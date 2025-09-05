# app/services/tax_service.py - Tax Calculation Service
from typing import Dict, List
import logging
from datetime import datetime
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)


class TaxService:

    async def calculate_comprehensive_tax_summary(self, transactions: List[Dict],
                                                  country: str, year: int = 2025) -> Dict:
        """Calculate comprehensive tax summary"""

        tax_info = await ai_service.get_real_time_tax_info(country)


        year_transactions = [
            tx for tx in transactions
            if tx['timestamp'].year == year
        ]


        total_gas_fees = sum(tx['total_gas_cost'] for tx in year_transactions)
        total_gains = sum(max(0, tx['net_sui_change']) for tx in year_transactions)
        total_losses = sum(min(0, tx['net_sui_change']) for tx in year_transactions)
        net_gain_loss = total_gains + total_losses


        taxable_events = len([
            tx for tx in year_transactions
            if abs(tx['net_sui_change']) > 0.001  # Ignore dust
        ])


        tax_rate = tax_info.get("capital_gains_long_term", 0.20)
        estimated_tax = max(0, net_gain_loss * tax_rate)


        if tax_info.get("fee_deductible", True):
            estimated_tax = max(0, estimated_tax - (total_gas_fees * tax_rate))


        categories = {}
        for tx in year_transactions:
            category = tx.get('gpt_category', 'Unknown')
            categories[category] = categories.get(category, 0) + 1


        tax_advice = await ai_service.generate_tax_advice(
            {
                'country': country,
                'total_transactions': len(year_transactions),
                'net_gain_loss': net_gain_loss,
                'tax_rate': tax_rate,
                'currency': tax_info.get('currency', 'USD')
            },
            year_transactions[:5]  # Sample for analysis
        )

        return {
            "total_transactions": len(year_transactions),
            "total_gas_fees": total_gas_fees,
            "total_gains": total_gains,
            "total_losses": abs(total_losses),
            "net_gain_loss": net_gain_loss,
            "taxable_events": taxable_events,
            "estimated_tax_owed": estimated_tax,
            "country": country.upper(),
            "tax_rate": tax_rate,
            "currency": tax_info.get("currency", "USD"),
            "year": year,
            "transaction_categories": categories,
            "gpt_tax_advice": tax_advice,
            "tax_info_details": tax_info
        }



tax_service = TaxService()
