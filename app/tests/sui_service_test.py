# app/tests/sui_service_test.py - Unit tests for Sui Service
import unittest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock

# Import services to test
import sys
import os

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.sui_service import SuiService, sui_service


class TestSuiService(unittest.TestCase):
    """Test cases for Sui Service"""
    
    def setUp(self):
        self.sui_service = SuiService()
    
    def test_init(self):
        """Test initialization of Sui service"""
        self.assertIsNotNone(self.sui_service.endpoints)
        self.assertIsNotNone(self.sui_service.batch_size)
        self.assertIsNotNone(self.sui_service.max_concurrent)
        self.assertIsNotNone(self.sui_service.request_delay)

    def test_is_transaction_digest(self):
        """Test transaction digest validation"""

        # Valid 64-character hex digests
        self.assertTrue(
            self.sui_service._is_transaction_digest(
                "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
            )
        )

        self.assertTrue(
            self.sui_service._is_transaction_digest(
                "ABCD1234567890abcdef1234567890abcdef1234567890abcdef1234567890EF"
            )
        )

        # Valid base64 digests (these decode to exactly 32 bytes)
        self.assertTrue(
            self.sui_service._is_transaction_digest(
                "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI="  # 44 chars with padding
            )
        )

        self.assertTrue(
            self.sui_service._is_transaction_digest(
                "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY="  # 44 chars with padding
            )
        )

        self.assertTrue(
            self.sui_service._is_transaction_digest(
                "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI"  # 43 chars without padding
            )
        )

        self.assertTrue(
            self.sui_service._is_transaction_digest(
                "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVoxMjM0NTY="  # 44 chars with padding
            )
        )

        # Invalid digests - wrong length
        self.assertFalse(self.sui_service._is_transaction_digest("0x123"))  # Too short
        self.assertFalse(self.sui_service._is_transaction_digest(""))  # Empty
        self.assertFalse(self.sui_service._is_transaction_digest("12345"))  # Too short

        # Invalid digests - wrong format
        self.assertFalse(self.sui_service._is_transaction_digest("0x123$%^"))  # Invalid characters with 0x
        self.assertFalse(self.sui_service._is_transaction_digest(
            "123456789012345678901234567890123456789012345678901234567890123$"))  # Invalid character in hex

        # Invalid digests - wrong base64 format
        self.assertFalse(self.sui_service._is_transaction_digest(
            "ABC123DEF456GHI789JKL012MNO345PQR678STU90+/=-"))  # Invalid base64 format
        self.assertFalse(self.sui_service._is_transaction_digest(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn@#"))  # Invalid base64 characters

        # Invalid digests - None and non-string inputs
        self.assertFalse(self.sui_service._is_transaction_digest(None))
        self.assertFalse(self.sui_service._is_transaction_digest(123))
        self.assertFalse(self.sui_service._is_transaction_digest([]))

        # Edge case - whitespace should be handled
        self.assertTrue(
            self.sui_service._is_transaction_digest(
                "  1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef  "
            )
        )

    @patch('app.services.sui_service.SuiService._make_rpc_call')
    def test_get_transaction_with_cache_hit(self, mock_rpc):
        """Test transaction retrieval with cache hit"""
        # Use a valid digest format (64-char hex)
        valid_digest = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

        # Setup mock for cache hit (async)
        with patch('app.core.database.db.get_cached_transaction', new_callable=AsyncMock) as mock_cache:
            mock_cache.return_value = {"digest": valid_digest, "data": "cached_data"}

            # Run test
            result = asyncio.run(self.sui_service._get_transaction(valid_digest, "mainnet"))

            # Verify result comes from cache
            self.assertEqual(result, {"digest": valid_digest, "data": "cached_data"})
            mock_rpc.assert_not_called()

    @patch('app.services.sui_service.SuiService._make_rpc_call')
    def test_get_transaction_with_cache_miss(self, mock_rpc):
        """Test transaction retrieval with cache miss"""
        # Use a valid digest format (64-char hex)
        valid_digest = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

        # Setup mocks
        with patch('app.core.database.db.get_cached_transaction', new_callable=AsyncMock) as mock_get_cache, \
                patch('app.core.database.db.cache_transaction', new_callable=AsyncMock) as mock_set_cache:
            mock_get_cache.return_value = None  # Simulate cache miss
            mock_rpc.return_value = {"digest": valid_digest, "data": "rpc_data"}

            # Run test
            result = asyncio.run(self.sui_service._get_transaction(valid_digest, "mainnet"))

            # Verify
            self.assertEqual(result, {"digest": valid_digest, "data": "rpc_data"})
            mock_rpc.assert_called_once()  # RPC should be called
            mock_set_cache.assert_awaited_once_with(valid_digest, "mainnet",
                                                    {"digest": valid_digest, "data": "rpc_data"})

    @patch('app.services.sui_service.SuiService._get_transaction', new_callable=AsyncMock)
    @patch('app.services.sui_service.SuiService._get_address_transactions', new_callable=AsyncMock)
    def test_detect_network_transaction(self, mock_addr_tx, mock_get_tx):
        """Test network detection for transaction"""
        # Use a valid transaction digest format
        valid_digest = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

        # Setup mocks for sequential network checks
        # The method checks networks in order: mainnet, testnet, devnet
        mock_get_tx.side_effect = [
            None,  # Not found on mainnet
            None,  # Not found on testnet
            {"digest": valid_digest}  # Found on devnet
        ]

        # Run test
        result = asyncio.run(
            self.sui_service.detect_network(valid_digest)
        )

        # Verify it correctly detects devnet
        self.assertEqual(result, "devnet")

        # Verify the method was called 3 times (once for each network)
        self.assertEqual(mock_get_tx.call_count, 3)

        # Address transactions mock should not be called for transaction digest
        mock_addr_tx.assert_not_called()

    @patch('app.services.sui_service.SuiService._get_transaction')
    @patch('app.services.sui_service.SuiService._get_address_transactions', new_callable=AsyncMock)
    def test_detect_network_address(self, mock_addr_tx, mock_get_tx):
        """Test network detection for address"""
        # Use a valid Sui address format (64 hex characters with 0x prefix)
        valid_address = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

        # Setup mocks
        mock_addr_tx.side_effect = [
            {"data": ["tx1"]},  # Found on mainnet
            {"data": ["tx2"]},  # Would be found on testnet, but shouldn't reach here
            None  # Shouldn't check devnet
        ]

        # Run test
        result = asyncio.run(self.sui_service.detect_network(valid_address))

        # Verify
        self.assertEqual(result, "mainnet")

        # Verify address transactions was called once (for mainnet only)
        self.assertEqual(mock_addr_tx.call_count, 1)

        # Verify get_transaction was not called (since this is an address, not a digest)
        mock_get_tx.assert_not_called()

    async def test_detect_network_with_address(self):
        service = SuiService()

        with patch.object(service, "_make_rpc_call", new_callable=AsyncMock) as mock_rpc:
            # Simulate queryTransactionBlocks returning something on testnet
            async def side_effect(endpoint, method, params):
                if "testnet" in endpoint:
                    return {"data": [{"digest": "tx123"}]}
                raise Exception("no data")

            mock_rpc.side_effect = side_effect

            result = await service.detect_network("0xbe89047238043a9b99b6c1d40dc31fe72a128b9ce29df06278ee2013a066d7f9")
            assert result == "testnet"

    async def test_detect_network_with_transaction_digest(self):
        service = SuiService()

        # Patch the internal helper so no real HTTP happens
        with patch.object(service, "_make_rpc_call", new_callable=AsyncMock) as mock_rpc:
            # Pretend that mainnet has data, others fail
            mock_rpc.return_value = {"digest": "fake123"}

            result = await service.detect_network("H2UL7MGvxCQwZzELSwYKMA1PJG7wtKpv")

            assert result == "mainnet"
            mock_rpc.assert_called()

    def test_calculate_sui_flows(self):
        """Test SUI inflow/outflow calculation"""
        # Test data
        sender = "0xsender"
        balance_changes = [
            {"coinType": "0x2::sui::SUI", "owner": {"AddressOwner": "0xsender"}, "amount": "1000000000"},  # 1 SUI in
            {"coinType": "0x2::sui::SUI", "owner": {"AddressOwner": "0xsender"}, "amount": "-2000000000"},  # 2 SUI out
            {"coinType": "0x2::other::TOKEN", "owner": {"AddressOwner": "0xsender"}, "amount": "3000000000"},  # Not SUI
            {"coinType": "0x2::sui::SUI", "owner": {"AddressOwner": "0xother"}, "amount": "4000000000"}  # Not sender
        ]
        
        # Run test
        sui_in, sui_out = self.sui_service._calculate_sui_flows(balance_changes, sender)
        
        # Verify
        self.assertEqual(sui_in, 1.0)  # 1 SUI in
        self.assertEqual(sui_out, 2.0)  # 2 SUI out
    
    def test_parse_transaction(self):
        """Test transaction parsing"""
        # Test data
        tx_data = {
            "digest": "test_digest",
            "timestampMs": "1625097600000",  # 2021-07-01
            "transaction": {
                "data": {
                    "sender": "0xsender",
                    "transaction": {"kind": "TransferSui"}
                }
            },
            "effects": {
                "status": {"status": "success"},
                "gasUsed": {
                    "computationCost": "1000000",
                    "storageCost": "500000",
                    "storageRebate": "300000"
                },
                "balanceChanges": [
                    {"coinType": "0x2::sui::SUI", "owner": {"AddressOwner": "0xsender"}, "amount": "-5000000000"}
                ]
            },
            "objectChanges": [
                {"type": "created"},
                {"type": "mutated"},
                {"type": "mutated"}
            ]
        }
        
        # Run test
        result = self.sui_service._parse_transaction(tx_data, "mainnet")
        
        # Verify
        self.assertEqual(result["digest"], "test_digest")
        self.assertEqual(result["sender"], "0xsender")
        self.assertEqual(result["transaction_type"], "TransferSui")
        self.assertEqual(result["status"], "success")
        self.assertEqual(result["gas_used"], 1500000)  # computation + storage
        self.assertEqual(result["total_gas_cost"], 0.0012)  # (1000000 + 500000 - 300000) / 10^9
        self.assertEqual(result["objects_created"], 1)
        self.assertEqual(result["objects_modified"], 2)
        self.assertEqual(result["network"], "mainnet")
        self.assertEqual(result["sui_amount_out"], 5.0)  # 5 SUI out

    def test_parse_transaction_error_handling(self):
        """Test error handling in transaction parsing"""
        # Run test with invalid/empty data
        result = self.sui_service._parse_transaction({}, "mainnet")

        # Verify defaults returned by the happy-path branch (no exception raised)
        self.assertEqual(result["digest"], "")
        self.assertEqual(result["sender"], "")
        self.assertEqual(result["transaction_type"], "Unknown")  # default when kind missing
        self.assertEqual(result["status"], "Unknown")  # default when status missing
        self.assertEqual(result["gas_used"], 0)
        self.assertEqual(result["total_gas_cost"], 0)
        self.assertEqual(result["objects_created"], 0)
        self.assertEqual(result["objects_modified"], 0)
        self.assertEqual(result["network"], "mainnet")


# Run tests if executed directly
if __name__ == "__main__":
    unittest.main()