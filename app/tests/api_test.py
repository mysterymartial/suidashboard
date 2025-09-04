# app/tests/api_test.py - API endpoint tests
import unittest
import asyncio
import sys
import os
from http import client
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from datetime import datetime, timezone

# Add the project root to the path to fix import issues
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), 'desktop/sui-transaction-analyser'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Add app directory to path
app_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'desktop/sui-transaction-analyser/app'))
if app_dir not in sys.path:
    sys.path.insert(0, app_dir)

# Import after path adjustment
from main import app


class TestAPIEndpoints(unittest.TestCase):
    """Test cases for API endpoints"""

    def setUp(self):
        self.client = TestClient(app)

    @patch("app.services.sui_service.SuiService.detect_network")
    def test_analyze_transaction_network_not_found(self, mock_detect):
        """Test error handling when network not found"""
        future = asyncio.Future()
        future.set_result(None)
        mock_detect.return_value = future

        response = self.client.post(
            "/api/analyze",
            json={"input": "0x123", "country": "US"}
        )

        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn("detail", response_data)
        self.assertIn("not found", response_data["detail"].lower())

    @patch("app.services.ai_service.ai_service.get_real_time_tax_info", new_callable=AsyncMock)
    @patch("app.services.ai_service.ai_service.analyze_transaction", new_callable=AsyncMock)
    @patch("app.services.sui_service.sui_service._parse_transaction")
    @patch("app.services.sui_service.sui_service._is_transaction_digest")
    @patch("app.services.sui_service.sui_service._get_transaction", new_callable=AsyncMock)
    @patch("app.services.sui_service.sui_service.detect_network", new_callable=AsyncMock)
    def test_analyze_transaction_digest(self, mock_detect, mock_get_tx, mock_is_digest, mock_parse_tx, mock_ai,
                                        mock_tax_info):
        """Test analyzing a transaction digest"""
        from datetime import datetime, timezone

        # Mock network detection
        mock_detect.return_value = "mainnet"

        # Mock transaction digest detection
        mock_is_digest.return_value = True

        # Mock transaction fetch
        mock_get_tx.return_value = {
            "digest": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "timestampMs": "1625097600000",
            "transaction": {"data": {"sender": "0xsender"}},
            "effects": {"status": {"status": "success"}}
        }

        # Mock transaction parsing
        mock_parse_tx.return_value = {
            "digest": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "timestamp": datetime.fromtimestamp(1625097600, tz=timezone.utc),
            "sender": "0xsender",
            "status": "success",
            "total_gas_cost": 0.001,
            "sui_amount_in": 1.0,
            "sui_amount_out": 0.5,
            "net_sui_change": 0.5,
            "objects_created": 1,
            "objects_modified": 2,
            "transaction_type": "transfer"
        }

        # Mock AI analysis
        mock_ai.return_value = {
            "explanation": "Test transaction analysis",
            "category": "Transfer"
        }

        # Mock tax information
        mock_tax_info.return_value = {
            "capital_gains_long_term": 0.20,
            "currency": "USD",
            "fee_deductible": True
        }

        # Call API
        response = self.client.post(
            "/api/v1/analyze",
            json={
                "input": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                "country": "US"
            }
        )

        # Assertions
        self.assertEqual(response.status_code, 200, f"Unexpected response: {response.text}")
        body = response.json()
        self.assertIn("transaction", body)
        self.assertEqual(
            body["transaction"]["digest"],
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        )
        self.assertEqual(body["analysis_type"], "single_transaction")
        self.assertEqual(body["network"], "mainnet")
        self.assertIn("tax_info", body)
        self.assertIn("human_summary", body)

    @patch("app.services.tax_service.tax_service.calculate_comprehensive_tax_summary", new_callable=AsyncMock)
    @patch("app.services.sui_service.sui_service.batch_process_transactions", new_callable=AsyncMock)
    @patch("app.services.sui_service.sui_service._get_address_transactions", new_callable=AsyncMock)
    @patch("app.services.sui_service.sui_service._is_transaction_digest")
    @patch("app.services.sui_service.sui_service.detect_network", new_callable=AsyncMock)
    def test_analyze_address(self, mock_detect, mock_is_digest, mock_get_address, mock_batch, mock_tax):
        """Test analyzing an address"""
        from datetime import datetime

        # Mock responses
        mock_detect.return_value = "mainnet"
        mock_is_digest.return_value = False  # Treat input as address, not transaction digest
        mock_get_address.return_value = {"data": ["tx1", "tx2"]}  # This is what get_address_transactions returns
        mock_batch.return_value = [
            {
                "digest": "tx1",
                "timestamp": datetime(2023, 1, 1, 12, 0, 0),
                "net_sui_change": 10.0,
                "total_gas_cost": 0.001,
                "status": "success",
                "gpt_category": "Transfer",
                "gpt_explanation": "Simple SUI transfer transaction"
            },
            {
                "digest": "tx2",
                "timestamp": datetime(2023, 1, 2, 12, 0, 0),
                "net_sui_change": -5.0,
                "total_gas_cost": 0.002,
                "status": "success",
                "gpt_category": "DeFi",
                "gpt_explanation": "DeFi interaction with protocol"
            }
        ]
        mock_tax.return_value = {
            "estimated_tax_owed": 2.0,
            "net_gain_loss": 5.0,
            "total_gas_fees": 0.003,
            "taxable_events": 2,
            "total_gains": 10.0,
            "total_losses": 5.0,
            "transaction_categories": {"Transfer": 1, "DeFi": 1},
            "tax_rate": 0.20,
            "country": "US",
            "currency": "USD",
            "gpt_tax_advice": "Based on your transaction history, you have taxable gains."
        }

        # Call API (without full_history=True, so it uses the quick analysis path)
        response = self.client.post(
            "/api/v1/analyze",
            json={"input": "0x123", "country": "US"}
        )

        # Assertions
        self.assertEqual(response.status_code, 200, f"Unexpected response: {response.text}")
        response_data = response.json()
        self.assertIn("transactions", response_data)
        self.assertIn("tax_summary", response_data)
        self.assertEqual(response_data["analysis_type"], "recent_transactions")
        self.assertEqual(response_data["network"], "mainnet")
        self.assertEqual(len(response_data["transactions"]), 2)

    @patch("app.services.ai_service.FreeAIService.get_real_time_tax_info", new_callable=AsyncMock)
    @patch("app.services.ai_service.FreeAIService.analyze_transaction", new_callable=AsyncMock)
    @patch("app.services.sui_service.SuiService._get_transaction", new_callable=AsyncMock)
    def test_single_transaction_analysis_logic(self, mock_get_tx, mock_ai, mock_tax_info):
        # Arrange
        mock_get_tx.return_value = {
            "gas_cost": 10,
            "sui_in": 50,
            "sui_out": 0,
            "objects_created": 1,
            "objects_modified": 2
        }

        mock_ai.return_value = {
            "explanation": "Received SUI",
            "category": "Transfer"
        }

        mock_tax_info.return_value = {
            "capital_gains_short_term": 0.20,
            "capital_gains_long_term": 0.10,
            "fee_deductible": True,
            "currency": "USD",
            "crypto_to_crypto_taxable": True
        }

        # Act
        from app.services.tax_service import tax_service
        import asyncio
        result = asyncio.run(
            tax_service.calculate_comprehensive_tax_summary(
                [  # sample transaction
                    {
                        "timestamp": __import__("datetime").datetime(2025, 1, 1),
                        "total_gas_cost": 2,
                        "net_sui_change": 5,
                        "gpt_category": "Transfer"
                    }
                ],
                "US"
            )
        )

        # Assert
        self.assertIn("estimated_tax_owed", result)
        self.assertEqual(result["country"], "US")

    @patch("app.services.tax_service.tax_service.calculate_comprehensive_tax_summary", new_callable=AsyncMock)
    @patch("app.services.ai_service.ai_service.analyze_transaction", new_callable=AsyncMock)
    async def test_address_analysis_logic(self, mock_analyze_tx, mock_tax_summary):
        """Test that address analysis aggregates data and returns correct structure"""

        # Arrange - setup mock return values
        mock_analyze_tx.return_value = {
            "explanation": "Sent 10 SUI",
            "category": "Transfer"
        }
        mock_tax_summary.return_value = {
            "total_transactions": 2,
            "total_gas_fees": 0.01,
            "total_gains": 10,
            "total_losses": 0,
            "net_gain_loss": 10,
            "taxable_events": 1,
            "estimated_tax_owed": 2,
            "country": "US",
            "tax_rate": 0.2,
            "currency": "USD",
            "year": 2025,
            "transaction_categories": {"Transfer": 2},
            "gpt_tax_advice": "Sample advice",
            "tax_info_details": {"capital_gains_long_term": 0.2}
        }

        # Act - call the endpoint
        response = client.get("/api/v1/analyze/0x123?country=US")

        # Assert
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Verify important keys exist
        self.assertIn("transactions", data)
        self.assertIn("tax_summary", data)
        self.assertEqual(data["tax_summary"]["country"], "US")
        self.assertEqual(data["tax_summary"]["tax_rate"], 0.2)

        # Verify mocks were called
        mock_analyze_tx.assert_called()
        mock_tax_summary.assert_called()

    def test_api_error_handling(self):
        """Test API error handling with invalid input"""
        # Missing required "input" field -> FastAPI returns 422
        response = self.client.post("/api/v1/analyze", json={"country": "US"})
        self.assertEqual(response.status_code, 422)

        # Valid JSON but may not match schema (invalid input format) -> 422
        response = self.client.post("/api/v1/analyze", json={"input": "0x123"})
        self.assertEqual(response.status_code, 422)

        # Malformed JSON -> still 422 (FastAPI raises RequestValidationError)
        response = self.client.post(
            "/api/v1/analyze",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 422)

    def test_network_detection_timeout(self):
        """Test handling of network detection timeout"""
        with patch("app.services.sui_service.SuiService.detect_network", new_callable=AsyncMock) as mock_detect:
            # Set up the mock to raise TimeoutError
            mock_detect.side_effect = asyncio.TimeoutError("Network detection timeout")

            response = self.client.post(
                "/api/v1/analyze",
                json={"input": "0x123", "country": "US"}
            )
            self.assertIn(response.status_code, [500, 404, 408])

    def test_invalid_transaction_digest(self):
        """Test handling of invalid transaction digest"""
        with patch("app.services.sui_service.sui_service.detect_network", new_callable=AsyncMock) as mock_detect:
            with patch("app.services.sui_service.sui_service._is_transaction_digest") as mock_is_digest:
                with patch("app.services.sui_service.sui_service._get_transaction",
                           new_callable=AsyncMock) as mock_get_tx:
                    # Mock detect_network to return "mainnet" so we pass network detection
                    mock_detect.return_value = "mainnet"

                    # Mock _is_transaction_digest to return True so we go down the transaction digest path
                    mock_is_digest.return_value = True

                    # Mock _get_transaction to return None (transaction not found)
                    mock_get_tx.return_value = None

                    response = self.client.post(
                        "/api/v1/analyze",
                        json={
                            "input": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                            "country": "US"
                        }
                    )

                    # Should get 404 because transaction is not found
                    self.assertEqual(response.status_code, 404)
                    response_data = response.json()
                    self.assertIn("detail", response_data)
                    self.assertEqual(response_data["detail"], "Transaction not found")


if __name__ == "__main__":
    unittest.main()