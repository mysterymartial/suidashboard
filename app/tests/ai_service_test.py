# app/tests/ai_service_test.py - Unit tests for AI Service
import unittest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
import json
from datetime import datetime, timezone

# Import services to test
import sys
import os

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.ai_service import FreeAIService, ai_service


class TestAIService(unittest.TestCase):
    """Test cases for AI Service"""

    def setUp(self):
        self.ai_service = FreeAIService()
        # Setup mock for aiohttp ClientSession
        self.session_mock = AsyncMock()
        self.response_mock = AsyncMock()
        self.session_mock.post.return_value.__aenter__ = AsyncMock(return_value=self.response_mock)
        self.session_mock.post.return_value.__aexit__ = AsyncMock(return_value=None)

    @patch('aiohttp.ClientSession')
    def test_init(self, mock_session):
        """Test initialization of AI service"""
        service = FreeAIService()
        self.assertIsNotNone(service.hf_api_url)
        self.assertIsNotNone(service.model)

    @patch('aiohttp.ClientSession')
    def test_call_huggingface_success(self, mock_session_class):
        """Test successful Hugging Face API call"""

        # Create a real async function to simulate the response.json() method
        async def mock_json_response():
            return [{"generated_text": "Test response"}]

        # Create a context manager that returns our mock response
        class MockResponse:
            def __init__(self):
                self.status = 200
                self.json = mock_json_response

        class MockPost:
            def __init__(self):
                self.response = MockResponse()

            async def __aenter__(self):
                return self.response

            async def __aexit__(self, exc_type, exc_val, exc_tb):
                pass

        # Create a mock session instance
        class MockSession:
            def __init__(self):
                self.post_call_count = 0

            def post(self, url, **kwargs):
                self.post_call_count += 1
                return MockPost()

            async def __aenter__(self):
                return self

            async def __aexit__(self, exc_type, exc_val, exc_tb):
                pass

        # Create session instance and configure the mock
        session_instance = MockSession()
        mock_session_class.return_value = session_instance

        # Run test
        result = asyncio.run(self.ai_service._call_huggingface("Test prompt"))

        # Verify
        self.assertEqual(result, "Test response")
        self.assertEqual(session_instance.post_call_count, 1)
        
        # Verify that the headers were included in the request
        # Note: In this mock setup we can't directly verify the headers,
        # but in a real test environment, we would check for the Authorization header

    @patch('aiohttp.ClientSession')
    def test_call_huggingface_error(self, mock_session):
        """Test error handling in Hugging Face API call"""
        # Setup mock for error
        mock_session.return_value = self.session_mock
        self.response_mock.status = 500
        self.response_mock.text = AsyncMock(return_value="Server error")

        # Run test
        result = asyncio.run(self.ai_service._call_huggingface("Test prompt"))

        # Verify
        self.assertEqual(result, "")

    @patch('app.core.database.db.cache_tax_info')
    @patch('app.core.database.db.get_cached_tax_info')
    def test_get_real_time_tax_info_success(self, mock_get_cache, mock_cache):
        """Test getting tax info with successful API response"""

        async def run_test():
            # Setup mocks
            mock_get_cache.return_value = None  # No cache hit

            # Mock successful Hugging Face API response with valid JSON
            with patch.object(self.ai_service, '_call_huggingface', new_callable=AsyncMock) as mock_call_hf:
                mock_call_hf.return_value = '''
                {
                    "capital_gains_short_term": 0.37, 
                    "capital_gains_long_term": 0.20, 
                    "fee_deductible": true, 
                    "currency": "USD", 
                    "crypto_to_crypto_taxable": true
                }
                '''

                # Mock the cache function
                mock_cache.return_value = None

                # Run test
                result = await self.ai_service.get_real_time_tax_info("US")

                # Verify the result structure
                self.assertEqual(result["capital_gains_short_term"], 0.37)
                self.assertEqual(result["capital_gains_long_term"], 0.20)
                self.assertTrue(result["fee_deductible"])
                self.assertEqual(result["currency"], "USD")
                self.assertTrue(result["crypto_to_crypto_taxable"])
                self.assertIn("recent_changes", result)
                self.assertIn("reporting_threshold", result)

                # Verify mocks were called correctly
                mock_get_cache.assert_called_once_with("US")
                mock_call_hf.assert_called_once()
                mock_cache.assert_called_once_with("US", result)

        # Run the async test
        asyncio.run(run_test())

    @patch('app.services.ai_service.db')
    def test_get_real_time_tax_info_cache_hit_alt(self, mock_db):
        """Test getting tax info with cache hit (alternative patching approach)"""

        async def run_test():
            # Setup mock for cache hit
            cached_data = {
                "capital_gains_short_term": 0.25,
                "capital_gains_long_term": 0.15,
                "fee_deductible": True,
                "currency": "EUR",
                "crypto_to_crypto_taxable": True,
                "recent_changes": "Cached data for DE",
                "reporting_threshold": 600
            }

            # Mock the database methods as async functions
            async def mock_get_cached_tax_info(country):
                return cached_data

            async def mock_cache_tax_info(country, data):
                return None

            mock_db.get_cached_tax_info = mock_get_cached_tax_info
            mock_db.cache_tax_info = mock_cache_tax_info

            with patch.object(self.ai_service, '_call_huggingface', new_callable=AsyncMock) as mock_call_hf:
                # Run test
                result = await self.ai_service.get_real_time_tax_info("DE")

                # Verify
                self.assertEqual(result, cached_data)
                # Note: We can't use assert_called_once_with on our custom async function
                # but the logic is preserved - cache hit means API should not be called
                mock_call_hf.assert_not_called()  # API should not be called when cache hits

        # Run the async test
        asyncio.run(run_test())

    def test_get_real_time_tax_info_api_failure(self):
        """Test fallback when API fails"""

        async def run_test():
            with patch('app.core.database.db.get_cached_tax_info', return_value=None) as mock_get_cache:
                with patch.object(self.ai_service, '_call_huggingface', new_callable=AsyncMock) as mock_call_hf:
                    mock_call_hf.return_value = "Invalid response"  # API failure

                    # Run test
                    result = await self.ai_service.get_real_time_tax_info("UK")

                    # Verify fallback data
                    self.assertIsNotNone(result["capital_gains_short_term"])
                    self.assertIsNotNone(result["capital_gains_long_term"])
                    self.assertTrue("fallback" in result["recent_changes"].lower())

        # Run the async test
        asyncio.run(run_test())

    def test_analyze_transaction_fallback(self):
        """Test transaction analysis fallback when API fails"""

        async def run_test():
            # Test data that will trigger specific fallback logic
            tx_data = {
                'gas_cost': 0.001,
                'sui_in': 0,
                'sui_out': 10,
                'objects_created': 0,
                'objects_modified': 1,
                'status': 'success'
            }

            # Mock _call_huggingface to raise an exception (simulating API failure)
            # This will trigger the except block which calls _analyze_transaction_fallback
            with patch.object(self.ai_service, '_call_huggingface', new_callable=AsyncMock) as mock_call_hf:
                mock_call_hf.side_effect = Exception("API error")  # Exception triggers fallback

                # Run test
                result = await self.ai_service.analyze_transaction(tx_data)

                # Verify fallback behavior
                self.assertEqual(result["explanation"], "Sent 10 SUI")  # This matches the fallback logic
                self.assertEqual(result["category"], "Transfer")

        # Run the async test
        asyncio.run(run_test())

    def test_analyze_transaction_fallback_direct(self):
        """Test the fallback method directly"""
        # Test data - outgoing transfer
        tx_data = {
            'gas_cost': 0.001,
            'sui_in': 0,
            'sui_out': 5,
            'objects_created': 0,
            'objects_modified': 1,
            'status': 'success'
        }

        # Call the fallback method directly
        result = self.ai_service._analyze_transaction_fallback(tx_data)

        # Verify fallback logic
        self.assertEqual(result["explanation"], "Sent 5 SUI")
        self.assertEqual(result["category"], "Transfer")

    def test_generate_tax_advice_fallback(self):
        """Test tax advice fallback when API returns short/empty response"""

        async def run_test():
            # Setup mock to return short response (triggers fallback)
            with patch.object(self.ai_service, '_call_huggingface', new_callable=AsyncMock) as mock_call_hf:
                mock_call_hf.return_value = "Short"  # Less than 50 characters

                # Test data
                tax_summary = {
                    'country': 'US',
                    'total_transactions': 50,
                    'net_gain_loss': 1000.0,
                    'tax_rate': 0.20
                }
                transactions_sample = [{}] * 3

                # Run test
                result = await self.ai_service.generate_tax_advice(tax_summary, transactions_sample)

                # Verify fallback is used
                self.assertIn("Tax Advice for US Crypto Investors", result)
                self.assertIn("Keep detailed records", result)
                self.assertIn("tax professional", result)
                self.assertGreater(len(result), 200)

        # Run the async test
        asyncio.run(run_test())

    def test_generate_tax_advice_api_failure(self):
        """Test fallback when API fails for tax advice"""

        async def run_test():
            # Setup mock for API failure
            with patch.object(self.ai_service, '_call_huggingface', new_callable=AsyncMock) as mock_call_hf:
                mock_call_hf.side_effect = Exception("API error")

                # Test data - with gains
                tax_summary = {
                    'country': 'US',
                    'total_transactions': 50,
                    'net_gain_loss': 1000.0,
                    'tax_rate': 0.20
                }
                transactions_sample = [{}] * 3

                # Run test
                result = await self.ai_service.generate_tax_advice(tax_summary, transactions_sample)

                # Verify fallback advice
                self.assertIn("Tax Advice", result)
                self.assertIn("records", result.lower())

        # Run the async test
        asyncio.run(run_test())

    def test_fallback_tax_rates(self):
        """Test fallback tax rates for different countries"""
        # Test known country
        us_rates = self.ai_service._get_fallback_tax_rates("US")
        self.assertEqual(us_rates["capital_gains_short_term"], 0.37)
        self.assertEqual(us_rates["capital_gains_long_term"], 0.20)

        # Test unknown country (should default to US rates)
        unknown_rates = self.ai_service._get_fallback_tax_rates("ZZ")
        self.assertEqual(unknown_rates["capital_gains_short_term"], 0.37)
        self.assertEqual(unknown_rates["capital_gains_long_term"], 0.20)

        # Test case insensitivity
        uk_rates = self.ai_service._get_fallback_tax_rates("uk")
        self.assertEqual(uk_rates["capital_gains_short_term"], 0.20)

    def test_analyze_transaction_fallback_scenarios(self):
        """Test transaction analysis fallback for different scenarios"""
        # Test incoming transfer
        incoming = self.ai_service._analyze_transaction_fallback({
            'sui_in': 10,
            'sui_out': 0,
            'objects_created': 0,
            'objects_modified': 0
        })
        self.assertIn("Received", incoming["explanation"])
        self.assertEqual(incoming["category"], "Transfer")

        # Test outgoing transfer
        outgoing = self.ai_service._analyze_transaction_fallback({
            'sui_in': 0,
            'sui_out': 5,
            'objects_created': 0,
            'objects_modified': 0
        })
        self.assertIn("Sent", outgoing["explanation"])
        self.assertEqual(outgoing["category"], "Transfer")

        # Test smart contract
        contract = self.ai_service._analyze_transaction_fallback({
            'sui_in': 0,
            'sui_out': 0,
            'objects_created': 3,
            'objects_modified': 5
        })
        self.assertIn("Created", contract["explanation"])
        self.assertEqual(contract["category"], "Smart_Contract")

        # Test other/unknown
        other = self.ai_service._analyze_transaction_fallback({
            'sui_in': 0,
            'sui_out': 0,
            'objects_created': 0,
            'objects_modified': 0
        })
        self.assertEqual(other["category"], "Other")

    def test_generate_fallback_advice(self):
        """Test fallback advice generation for different scenarios"""
        # Test with gains
        gains_summary = {
            'country': 'US',
            'net_gain_loss': 1000.0,
            'tax_rate': 0.20
        }
        gains_advice = self.ai_service._generate_fallback_advice(gains_summary)
        self.assertIn("gains", gains_advice.lower())
        self.assertIn("records", gains_advice.lower())

        # Test with losses
        loss_summary = {
            'country': 'UK',
            'net_gain_loss': -500.0,
            'tax_rate': 0.20
        }
        loss_advice = self.ai_service._generate_fallback_advice(loss_summary)
        self.assertIn("loss", loss_advice.lower())
        self.assertIn("offset", loss_advice.lower())


# Run tests if executed directly
if __name__ == "__main__":
    unittest.main()