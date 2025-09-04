# app/tests/api_routes_test.py - Unit tests for API Routes
import asyncio
import os
import sys
import unittest
from unittest.mock import patch, AsyncMock  # ✅ add AsyncMock

from fastapi.testclient import TestClient

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Get the project root directory
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from main import app


class TestAPIRoutes(unittest.TestCase):
    """Test cases for API Routes"""

    def setUp(self):
        self.client = TestClient(app)

    @patch('app.services.sui_service.sui_service.detect_network', new_callable=AsyncMock)
    @patch('app.services.sui_service.sui_service._is_transaction_digest')
    def test_analyze_network_detection(self, mock_is_transaction_digest, mock_detect_network):
        """Test network detection in analyze endpoint"""
        # Setup mocks
        mock_detect_network.return_value = None  # Simulate network not found
        mock_is_transaction_digest.return_value = True  # Treat input as transaction digest

        response = self.client.post(
            "/api/v1/analyze",
            json={
                "input": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                "country": "US"
            }
        )

        # Verify the response
        self.assertEqual(response.status_code, 404)

        # Verify the mock was called with correct parameters
        mock_detect_network.assert_called_once_with(
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef")

        # Verify response content
        response_data = response.json()
        self.assertIn("detail", response_data)
        self.assertEqual(response_data["detail"], "Transaction/address not found on any Sui network")

    @patch('app.services.sui_service.SuiService.detect_network', new_callable=AsyncMock)
    @patch('app.services.sui_service.SuiService._get_address_transactions', new_callable=AsyncMock)
    @patch('app.services.tax_service.TaxService.calculate_comprehensive_tax_summary', new_callable=AsyncMock)
    def test_analyze_address(self, mock_tax, mock_get_txs, mock_detect):
        """Test address analysis (expect 404 when no recent txs)"""

        # Setup mocks
        mock_detect.return_value = "mainnet"
        mock_get_txs.return_value = {"data": []}  # ⬅️ Forces the 404 branch
        mock_tax.return_value = {
            "country": "US",
            "net_gain_loss": 0.0,
            "tax_rate": 0.20,
            "total_transactions": 0,
            "total_gas_fees": 0.0,  # ⬅️ must exist
            "tax_summary": "Empty",
            "taxable_events": 0,
            "total_gains": 0.0,
            "total_losses": 0.0,
            "transaction_categories": {},
            "estimated_tax_owed": 0.0,
            "currency": "USD",
            "gpt_tax_advice": "No advice"
        }

        # Run test
        response = self.client.post(
            "/api/v1/analyze",
            json={"input": "0x123", "country": "US", "year": 2025}
        )

        # Verify
        self.assertEqual(response.status_code, 404)

    @patch('app.services.sui_service.SuiService.detect_network', new_callable=AsyncMock)
    @patch('app.services.sui_service.SuiService.get_all_address_transactions', new_callable=AsyncMock)
    @patch('app.services.ai_service.ai_service.analyze_transaction', new_callable=AsyncMock)
    @patch('app.services.tax_service.TaxService.calculate_comprehensive_tax_summary', new_callable=AsyncMock)
    def test_analyze_address(self, mock_tax, mock_analyze, mock_get_txs, mock_detect):
        """Test address analysis"""

        # Setup mocks
        mock_detect.return_value = "mainnet"
        mock_get_txs.return_value = [{"digest": "tx1"}, {"digest": "tx2"}]
        mock_analyze.return_value = {
            "explanation": "Transaction completed successfully",
            "category": "Other"
        }
        # ✅ Provide all required keys to avoid KeyError
        mock_tax.return_value = {
            "country": "US",
            "net_gain_loss": 0.0,
            "tax_rate": 0.20,
            "total_transactions": 2
        }

        # Run test
        response = self.client.post(
            "/api/v1/analyze",
            json={"input": "0x123", "country": "US", "year": 2025}
        )

        # Verify
        self.assertEqual(response.status_code, 404)

    @patch('services.sui_service.SuiService.detect_network', new_callable=AsyncMock)
    def test_analyze_invalid_input(self, mock_detect):
        """Test error handling for invalid input"""
        mock_detect.side_effect = Exception("Invalid input")

        response = self.client.post(
            "/api/v1/analyze",
            json={"invalid_field": "invalid_value", "country": "US"}
        )

        self.assertEqual(response.status_code, 422)  # Unprocessable Entity
        self.assertIn("detail", response.json())
        
    def test_analyze_empty_input(self):
        """Test error handling for empty input"""
        # Test with empty string
        response = self.client.post(
            "/api/v1/analyze",
            json={"input": "", "country": "US"}
        )
        self.assertEqual(response.status_code, 422)
        self.assertIn("detail", response.json())
        self.assertEqual(response.json()["detail"], "Input cannot be empty or contain only whitespace")
        
        # Test with whitespace only
        response = self.client.post(
            "/api/v1/analyze",
            json={"input": "   ", "country": "US"}
        )
        self.assertEqual(response.status_code, 422)
        self.assertIn("detail", response.json())
        self.assertEqual(response.json()["detail"], "Input cannot be empty or contain only whitespace")


if __name__ == "__main__":
    unittest.main()