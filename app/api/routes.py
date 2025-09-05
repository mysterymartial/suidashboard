# ================================
# app/api/routes.py - API Routes
import logging
from datetime import datetime
from typing import Dict, Any

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    AnalysisRequest, BatchAnalysisRequest
)
from app.services.ai_service import ai_service
from app.services.sui_service import sui_service
from app.services.tax_service import tax_service

logger = logging.getLogger(__name__)

analyzer_router = APIRouter()


@analyzer_router.post("/analyze", response_model=Dict[str, Any])
async def analyze_sui_transactions(request: AnalysisRequest):
    """
    🚀 Complete Sui transaction analysis with GPT insights

    - **Single API call** analyzes transactions OR addresses
    - **Auto-detects network** (mainnet/testnet/devnet)
    - **GPT-powered explanations** for each transaction
    - **Real-time tax calculations** by country
    - **Complete transaction history** when requested
    """
    try:
        # Check for empty or blank input
        if not request.input or request.input.strip() == "":
            raise HTTPException(
                status_code=422,
                detail="Input cannot be empty or contain only whitespace"
            )
            
        logger.info(f"🔍 Analyzing: {request.input[:20]}... for {request.country}")

        # Detect network
        network = await sui_service.detect_network(request.input)
        if not network:
            raise HTTPException(
                status_code=404,
                detail="Transaction/address not found on any Sui network"
            )

        if sui_service._is_transaction_digest(request.input):
            return await _analyze_single_transaction(request, network)
        else:
            # Address analysis
            return await _analyze_address_transactions(request, network)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


async def _analyze_single_transaction(request: AnalysisRequest, network: str) -> Dict[str, Any]:

    tx_data = await sui_service._get_transaction(request.input, network)
    if not tx_data:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction = sui_service._parse_transaction(tx_data, network)

    ai_analysis = await ai_service.analyze_transaction({
        'gas_cost': transaction['total_gas_cost'],
        'sui_in': transaction['sui_amount_in'],
        'sui_out': transaction['sui_amount_out'],
        'objects_created': transaction['objects_created'],
        'objects_modified': transaction['objects_modified'],
        'status': transaction['status']
    })

    transaction.update({
        'gpt_explanation': ai_analysis['explanation'],
        'gpt_category': ai_analysis['category']
    })

    tax_info = await ai_service.get_real_time_tax_info(request.country)

    net_change = transaction['net_sui_change']
    tax_rate = tax_info.get("capital_gains_long_term", 0.20)
    estimated_tax = max(0, net_change * tax_rate) if net_change > 0 else 0

    return {
        "success": True,
        "analysis_type": "single_transaction",
        "network": network,
        "transaction": {
            "digest": transaction['digest'],
            "timestamp": transaction['timestamp'].isoformat(),
            "sender": transaction['sender'],
            "status": transaction['status'],
            "gas_cost_sui": round(transaction['total_gas_cost'], 9),
            "sui_in": round(transaction['sui_amount_in'], 9),
            "sui_out": round(transaction['sui_amount_out'], 9),
            "net_change": round(transaction['net_sui_change'], 9),
            "objects_created": transaction['objects_created'],
            "objects_modified": transaction['objects_modified'],
            "gpt_explanation": transaction['gpt_explanation'],
            "gpt_category": transaction['gpt_category'],
            "transaction_type": transaction['transaction_type']
        },
        "tax_info": {
            "country": request.country.upper(),
            "tax_rates": tax_info,
            "estimated_tax_on_gains": round(estimated_tax, 9),
            "currency": tax_info.get("currency", "USD")
        },
        "human_summary": f"""
🔍 TRANSACTION ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━
Network: {network.upper()} ✅
Status: {transaction['status']}
Date: {transaction['timestamp'].strftime('%Y-%m-%d %H:%M:%S UTC')}

💰 FINANCIAL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━
• SUI Received: {transaction['sui_amount_in']:.6f}
• SUI Sent: {transaction['sui_amount_out']:.6f}
• Net Change: {transaction['net_sui_change']:+.6f} SUI
• Gas Cost: {transaction['total_gas_cost']:.6f} SUI

🤖 AI ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: {transaction['gpt_category']}
Explanation: {transaction['gpt_explanation']}

💸 TAX IMPLICATIONS ({request.country.upper()})
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tax Rate: {tax_info.get('capital_gains_long_term', 0.20) * 100}%
• Estimated Tax: {estimated_tax:.6f} SUI
• Fees Deductible: {'Yes' if tax_info.get('fee_deductible') else 'No'}

⚠️  This is an estimate. Consult a tax professional for accurate advice.
        """.strip()
    }


async def _analyze_address_transactions(request: AnalysisRequest, network: str) -> Dict[str, Any]:
    if request.full_history:

        logger.info(f"📊 Starting FULL history analysis for {request.input[:10]}...")

        all_digests = await sui_service.get_all_address_transactions(request.input, network)
        if not all_digests:
            raise HTTPException(status_code=404, detail="No transactions found for this address")

        transactions = await sui_service.batch_process_transactions(all_digests, network)

        tax_summary = await tax_service.calculate_comprehensive_tax_summary(
            transactions, request.country, request.year
        )

        return {
            "success": True,
            "analysis_type": "full_address_history",
            "network": network,
            "address": request.input,
            "total_transactions_found": len(all_digests),
            "transactions_analyzed": len(transactions),
            "analysis_year": request.year,
            "tax_summary": tax_summary,
            "recent_transactions": [
                {
                    "digest": tx['digest'],
                    "timestamp": tx['timestamp'].isoformat(),
                    "net_change": round(tx['net_sui_change'], 9),
                    "gas_cost": round(tx['total_gas_cost'], 9),
                    "category": tx.get('gpt_category', 'Unknown'),
                    "explanation": (tx.get('gpt_explanation', '')[:100] + "...")
                    if len(tx.get('gpt_explanation', '')) > 100
                    else tx.get('gpt_explanation', ''),
                    "status": tx['status']
                }
                for tx in sorted(transactions, key=lambda x: x['timestamp'], reverse=True)[:15]
            ],
            "human_summary": f"""
📊 COMPREHENSIVE WALLET ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address: {request.input[:12]}...{request.input[-8:]}
Network: {network.upper()}
Analysis Year: {request.year}

📈 TRANSACTION OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Found: {len(all_digests):,} transactions
• Successfully Analyzed: {len(transactions):,} transactions  
• Taxable Events: {tax_summary['taxable_events']:,}
• Total Gas Fees: {tax_summary['total_gas_fees']:.6f} SUI

💰 FINANCIAL SUMMARY  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Gains: +{tax_summary['total_gains']:.6f} SUI
• Total Losses: -{tax_summary['total_losses']:.6f} SUI
• Net P&L: {tax_summary['net_gain_loss']:+.6f} SUI

🏷️  TRANSACTION CATEGORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{chr(10).join([f"• {cat}: {count:,} transactions" for cat, count in list(tax_summary['transaction_categories'].items())[:6]])}

💸 TAX CALCULATION ({tax_summary['country']})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tax Rate: {tax_summary['tax_rate'] * 100}%
• Estimated Tax Owed: {tax_summary['estimated_tax_owed']:.6f} SUI
• Currency: {tax_summary['currency']}

🤖 AI TAX ADVISOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{tax_summary['gpt_tax_advice']}

⚠️  Complete Analysis: This covers {len(transactions):,}/{len(all_digests):,} transactions found.
    For official tax reporting, verify all platforms are included.
            """.strip()
        }

    else:
        tx_data = await sui_service._get_address_transactions(request.input, network, limit=25)
        digests = tx_data.get("data", [])

        if not digests:
            raise HTTPException(status_code=404, detail="No recent transactions found")

        transactions = await sui_service.batch_process_transactions(digests, network)
        tax_summary = await tax_service.calculate_comprehensive_tax_summary(
            transactions, request.country, request.year
        )

        return {
            "success": True,
            "analysis_type": "recent_transactions",
            "network": network,
            "address": request.input,
            "transactions_analyzed": len(transactions),
            "tax_summary": tax_summary,
            "transactions": [
                {
                    "digest": tx['digest'],
                    "timestamp": tx['timestamp'].isoformat(),
                    "net_change": round(tx['net_sui_change'], 9),
                    "gas_cost": round(tx['total_gas_cost'], 9),
                    "category": tx.get('gpt_category', 'Unknown'),
                    "explanation": tx.get('gpt_explanation', ''),
                    "status": tx['status']
                }
                for tx in sorted(transactions, key=lambda x: x['timestamp'], reverse=True)
            ],
            "human_summary": f"""
📊 RECENT TRANSACTIONS ANALYSIS  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address: {request.input[:12]}...{request.input[-8:]}
Network: {network.upper()}
Analyzed: {len(transactions)} recent transactions

💰 QUICK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Net P&L: {tax_summary['net_gain_loss']:+.6f} SUI
• Gas Fees: {tax_summary['total_gas_fees']:.6f} SUI  
• Estimated Tax: {tax_summary['estimated_tax_owed']:.6f} SUI ({tax_summary['country']})

🤖 AI INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{tax_summary['gpt_tax_advice'][:300]}{'...' if len(tax_summary['gpt_tax_advice']) > 300 else ''}

💡 TIP: Use "full_history": true for complete wallet analysis
            """.strip()
        }


@analyzer_router.post("/batch-analysis")
async def batch_analyze_addresses(request: BatchAnalysisRequest):
    """
    📊 Batch analyze up to 10 addresses simultaneously

    - **Parallel processing** for multiple wallets
    - **Quick overview** of each address
    - **Comparative analysis** across portfolios
    """
    try:
        if len(request.addresses) > 10:
            raise HTTPException(
                status_code=400,
                detail="Maximum 10 addresses allowed per batch"
            )

        results = []

        for i, address in enumerate(request.addresses, 1):
            logger.info(f"📊 Batch analyzing {i}/{len(request.addresses)}: {address[:10]}...")

            try:
                network = await sui_service.detect_network(address)
                if not network:
                    results.append({
                        "address": address,
                        "error": "Address not found on any network"
                    })
                    continue

                tx_data = await sui_service._get_address_transactions(address, network, limit=20)
                digests = tx_data.get("data", [])

                if not digests:
                    results.append({
                        "address": address,
                        "network": network,
                        "transactions_count": 0,
                        "net_pnl": 0,
                        "estimated_tax": 0,
                        "top_category": "No transactions"
                    })
                    continue

                transactions = await sui_service.batch_process_transactions(digests, network)
                tax_summary = await tax_service.calculate_comprehensive_tax_summary(
                    transactions, request.country, request.year
                )

                top_category = "Unknown"
                if tax_summary['transaction_categories']:
                    top_category = max(
                        tax_summary['transaction_categories'].items(),
                        key=lambda x: x[1]
                    )[0]

                results.append({
                    "address": address,
                    "network": network,
                    "transactions_count": len(transactions),
                    "net_pnl": round(tax_summary['net_gain_loss'], 6),
                    "estimated_tax": round(tax_summary['estimated_tax_owed'], 6),
                    "top_category": top_category,
                    "gas_fees": round(tax_summary['total_gas_fees'], 6)
                })

            except Exception as e:
                logger.error(f"Error analyzing {address}: {e}")
                results.append({
                    "address": address,
                    "error": str(e)
                })

        successful_results = [r for r in results if "error" not in r]
        total_pnl = sum(r['net_pnl'] for r in successful_results)
        total_tax = sum(r['estimated_tax'] for r in successful_results)

        return {
            "success": True,
            "batch_results": results,
            "summary": {
                "total_addresses": len(request.addresses),
                "successful_analyses": len(successful_results),
                "combined_net_pnl": round(total_pnl, 6),
                "combined_estimated_tax": round(total_tax, 6),
                "country": request.country.upper(),
                "year": request.year
            },
            "human_summary": f"""
📊 BATCH ANALYSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analyzed: {len(successful_results)}/{len(request.addresses)} addresses
Country: {request.country.upper()}
Year: {request.year}

💰 COMBINED TOTALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Net P&L: {total_pnl:+.6f} SUI
• Total Est. Tax: {total_tax:.6f} SUI

📋 INDIVIDUAL RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{chr(10).join([
                f"• {r['address'][:10]}...{r['address'][-6:]}: {r.get('net_pnl', 0):+.3f} SUI ({r.get('top_category', 'Error')})"
                for r in results[:5]
            ])}

💡 Use individual /analyze calls for detailed breakdowns
            """.strip()
        }

    except Exception as e:
        logger.error(f"Batch analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@analyzer_router.get("/tax-rates/{country}")
async def get_tax_rates(country: str):
    """
    🌍 Get real-time tax rates for any country using GPT

    - **Real-time GPT analysis** of current tax laws
    - **Country-specific rates** and rules
    - **Recent tax law changes** included
    """
    try:
        tax_info = await ai_service.get_real_time_tax_info(country)
        return {
            "country": country.upper(),
            "tax_information": tax_info,
            "last_updated": datetime.now().isoformat(),
            "disclaimer": "Tax information provided by AI analysis. Consult a qualified tax professional for official advice."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@analyzer_router.get("/supported-features")
async def get_supported_features():
    """
    📋 Get list of supported features and capabilities
    """
    return {
        "supported_networks": ["mainnet", "testnet", "devnet"],
        "analysis_types": [
            "single_transaction",
            "recent_transactions",
            "full_address_history",
            "batch_analysis"
        ],
        "gpt_features": [
            "real_time_tax_rates",
            "transaction_explanations",
            "smart_categorization",
            "personalized_tax_advice"
        ],
        "supported_countries": [
            "US", "UK", "CA", "DE", "FR", "AU", "SG", "JP", "NL", "CH"
        ],
        "performance_features": [
            "async_processing",
            "batch_optimization",
            "intelligent_caching",
            "parallel_execution"
        ]
    }
