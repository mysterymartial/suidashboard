# app/tests/tax_service_test.py - Unit tests for Tax Service
import unittest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from datetime import datetime, timezone

# Import services to test
import sys
import os

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.tax_service import TaxService, tax_service


class TestTaxService(unittest.TestCase):
    """Test cases for Tax Service"""

    def setUp(self):
        self.tax_service = TaxService()

    @patch("app.services.tax_service.ai_service.get_real_time_tax_info", new_callable=AsyncMock)
    @patch("app.services.tax_service.ai_service.generate_tax_advice", new_callable=AsyncMock)
    def test_calculate_comprehensive_tax_summary(self, mock_generate_advice, mock_get_tax_info):
        """Test comprehensive tax summary calculation"""

        # Setup mocks
        mock_get_tax_info.return_value = {
            "capital_gains_short_term": 0.37,
            "capital_gains_long_term": 0.20,
            "fee_deductible": True,
            "currency": "USD",
            "crypto_to_crypto_taxable": True,
        }
        mock_generate_advice.return_value = "Test tax advice"

        # Transactions (2 in 2025, 1 in 2024 that should be ignored)
        transactions = [
            {
                "timestamp": datetime(2025, 1, 1, tzinfo=timezone.utc),
                "total_gas_cost": 0.001,
                "net_sui_change": 10.0,  # Gain
                "gpt_category": "Transfer",
            },
            {
                "timestamp": datetime(2025, 2, 1, tzinfo=timezone.utc),
                "total_gas_cost": 0.002,
                "net_sui_change": -5.0,  # Loss
                "gpt_category": "DeFi_Swap",
            },
            {
                "timestamp": datetime(2024, 1, 1, tzinfo=timezone.utc),  # Different year
                "total_gas_cost": 0.003,
                "net_sui_change": 20.0,
                "gpt_category": "NFT_Purchase",
            },
        ]

        # Run tax calculation
        result = asyncio.run(
            tax_service.calculate_comprehensive_tax_summary(transactions, "US", 2025)
        )

        # ===== Verify core fields =====
        self.assertEqual(result["total_transactions"], 2)  # Only 2025 transactions
        self.assertAlmostEqual(result["total_gas_fees"], 0.003, places=6)  # 0.001 + 0.002
        self.assertAlmostEqual(result["total_gains"], 10.0, places=6)  # Gain only
        self.assertAlmostEqual(result["total_losses"], 5.0, places=6)  # Absolute loss
        self.assertAlmostEqual(result["net_gain_loss"], 5.0, places=6)  # 10 - 5

        self.assertEqual(result["taxable_events"], 2)  # Both transactions non-dust

        # ===== Tax calculation (with fee deduction) =====
        expected_tax = max(0, (5.0 * 0.20) - (0.003 * 0.20))  # = 0.9994
        self.assertAlmostEqual(result["estimated_tax_owed"], expected_tax, places=4)

        # ===== Metadata =====
        self.assertEqual(result["country"], "US")
        self.assertEqual(result["tax_rate"], 0.20)
        self.assertEqual(result["currency"], "USD")
        self.assertEqual(result["year"], 2025)
        self.assertEqual(result["gpt_tax_advice"], "Test tax advice")

        # ===== Category counts =====
        self.assertEqual(result["transaction_categories"]["Transfer"], 1)
        self.assertEqual(result["transaction_categories"]["DeFi_Swap"], 1)
        self.assertNotIn("NFT_Purchase", result["transaction_categories"])

    @patch('app.services.tax_service.ai_service.get_real_time_tax_info')
    @patch('app.services.tax_service.ai_service.generate_tax_advice')
    def test_tax_summary_with_fee_deduction(self, mock_advice, mock_tax_info):
        """Test tax calculation with fee deduction"""
        # Setup mocks
        mock_tax_info.return_value = {
            "capital_gains_short_term": 0.37,
            "capital_gains_long_term": 0.20,
            "fee_deductible": True,  # Fees are deductible
            "currency": "USD",
            "crypto_to_crypto_taxable": True
        }
        mock_advice.return_value = "Test tax advice"

        # Test data - high gas fees
        transactions = [
            {
                'timestamp': datetime(2025, 1, 1, tzinfo=timezone.utc),
                'total_gas_cost': 2.0,  # High gas fee
                'net_sui_change': 10.0,  # Gain
                'gpt_category': 'Transfer'
            }
        ]

        # Run test
        result = asyncio.run(self.tax_service.calculate_comprehensive_tax_summary(
            transactions, "US", 2025))

        # Verify - tax should be reduced by gas fee deduction
        # Expected: (10.0 * 0.20) - (2.0 * 0.20) = 2.0 - 0.4 = 1.6
        self.assertEqual(result["estimated_tax_owed"], 1.6)

    @patch('app.services.tax_service.ai_service.get_real_time_tax_info')
    @patch('app.services.tax_service.ai_service.generate_tax_advice')
    def test_tax_summary_without_fee_deduction(self, mock_advice, mock_tax_info):
        """Test tax calculation without fee deduction"""
        # Setup mocks
        mock_tax_info.return_value = {
            "capital_gains_short_term": 0.37,
            "capital_gains_long_term": 0.20,
            "fee_deductible": False,  # Fees are NOT deductible
            "currency": "USD",
            "crypto_to_crypto_taxable": True
        }
        mock_advice.return_value = "Test tax advice"

        # Test data - high gas fees
        transactions = [
            {
                'timestamp': datetime(2025, 1, 1, tzinfo=timezone.utc),
                'total_gas_cost': 2.0,  # High gas fee
                'net_sui_change': 10.0,  # Gain
                'gpt_category': 'Transfer'
            }
        ]

        # Run test
        result = asyncio.run(self.tax_service.calculate_comprehensive_tax_summary(
            transactions, "US", 2025))

        # Verify - tax should NOT be reduced by gas fee
        # Expected: 10.0 * 0.20 = 2.0
        self.assertEqual(result["estimated_tax_owed"], 2.0)

    @patch('app.services.tax_service.ai_service.get_real_time_tax_info')
    @patch('app.services.tax_service.ai_service.generate_tax_advice')
    def test_tax_summary_with_net_loss(self, mock_advice, mock_tax_info):
        """Test tax calculation with net loss"""
        # Setup mocks
        mock_tax_info.return_value = {
            "capital_gains_short_term": 0.37,
            "capital_gains_long_term": 0.20,
            "fee_deductible": True,
            "currency": "USD",
            "crypto_to_crypto_taxable": True
        }
        mock_advice.return_value = "Test tax advice"

        # Test data - net loss
        transactions = [
            {
                'timestamp': datetime(2025, 1, 1, tzinfo=timezone.utc),
                'total_gas_cost': 0.001,
                'net_sui_change': 5.0,  # Gain
                'gpt_category': 'Transfer'
            },
            {
                'timestamp': datetime(2025, 2, 1, tzinfo=timezone.utc),
                'total_gas_cost': 0.002,
                'net_sui_change': -10.0,  # Larger loss
                'gpt_category': 'DeFi_Swap'
            }
        ]

        # Run test
        result = asyncio.run(self.tax_service.calculate_comprehensive_tax_summary(
            transactions, "US", 2025))

        # Verify - no tax on net loss
        self.assertEqual(result["net_gain_loss"], -5.0)  # Net loss
        self.assertEqual(result["estimated_tax_owed"], 0.0)  # No tax on loss


# Run tests if executed directly
if __name__ == "__main__":
    unittest.main()