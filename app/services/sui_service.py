
# app/services/sui_service.py - Enhanced Sui Blockchain Service
import aiohttp
import asyncio
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime, timezone
import re
from app.core.config import settings
from app.core.database import db
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)


class SuiService:
    def __init__(self):
        self.endpoints = settings.SUI_ENDPOINTS
        self.batch_size = settings.BATCH_SIZE
        self.max_concurrent = settings.MAX_CONCURRENT_REQUESTS
        self.request_delay = settings.REQUEST_DELAY

    async def detect_network(self, digest_or_address: str) -> Optional[str]:
        """Detect which network contains the transaction/address"""
        for network in ["mainnet", "testnet", "devnet"]:
            try:
                if self._is_transaction_digest(digest_or_address):
                    result = await self._get_transaction(digest_or_address, network)
                else:
                    result = await self._get_address_transactions(digest_or_address, network, limit=1)

                if result:
                    logger.info(f"✅ Found data on {network}")
                    return network
            except Exception as e:
                logger.debug(f"Network {network} check failed: {e}")
                continue
        return None

    def _is_transaction_digest(self, value: str) -> bool:
        """Enhanced validation for Sui transaction digests"""
        if not isinstance(value, str):
            return False

        # Remove any whitespace
        value = value.strip()

        # Check for empty string
        if not value:
            return False

        # Sui transaction digests are base64-encoded 32-byte hashes
        # Valid patterns:
        # 1. 44 chars ending with '=' (standard base64)
        # 2. 43 chars without padding
        # 3. Some may be 64 chars (hex format)

        # Check length
        if len(value) not in [43, 44, 64]:
            return False

        # For 64-char strings, validate as hex
        if len(value) == 64:
            return self._is_valid_hex(value)

        # For base64 format (43-44 chars)
        if len(value) in [43, 44]:
            return self._is_valid_base64(value)

        return False

    def _is_valid_hex(self, value: str) -> bool:
        """Validate hexadecimal string"""
        try:
            int(value, 16)
            return True
        except ValueError:
            return False

    def _is_valid_base64(self, value: str) -> bool:
        """Validate base64 string (Sui transaction digest format)"""
        # Base64 alphabet: A-Z, a-z, 0-9, +, /, =
        base64_pattern = re.compile(r'^[A-Za-z0-9+/]*={0,2}$')

        if not base64_pattern.match(value):
            return False

        # Additional validation: try to decode
        try:
            import base64
            # Pad if necessary for 43-char strings
            padded_value = value + '=' * (4 - len(value) % 4) if len(value) % 4 else value
            decoded = base64.b64decode(padded_value, validate=True)
            # Sui digests should decode to 32 bytes
            return len(decoded) == 32
        except Exception:
            return False

    def _is_sui_address(self, value: str) -> bool:
        """Validate Sui address format"""
        if not isinstance(value, str):
            return False

        value = value.strip()

        # Sui addresses are 32 bytes in hex, often with 0x prefix
        if value.startswith('0x'):
            value = value[2:]

        # Should be 64 hex characters
        if len(value) != 64:
            return False

        return self._is_valid_hex(value)

    async def _make_rpc_call(self, endpoint: str, method: str, params: List) -> Dict:
        """Make RPC call to Sui node with enhanced error handling"""
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params
        }

        timeout = aiohttp.ClientTimeout(total=30)
        try:
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(endpoint, json=payload) as response:
                    if response.status != 200:
                        raise Exception(f"HTTP {response.status}: {response.reason}")

                    result = await response.json()

                    if "error" in result:
                        error_msg = result['error'].get('message', 'Unknown RPC error')
                        raise Exception(f"RPC Error: {error_msg}")

                    return result.get("result", {})

        except asyncio.TimeoutError:
            raise Exception("Request timeout - network may be slow")
        except aiohttp.ClientError as e:
            raise Exception(f"Network error: {str(e)}")

    async def _get_transaction(self, digest: str, network: str, use_cache: bool = True) -> Optional[Dict]:
        """Get transaction with enhanced caching and validation"""
        # Validate digest format first
        if not self._is_transaction_digest(digest):
            logger.warning(f"Invalid digest format: {digest}")
            return None

        if use_cache:
            cached = await db.get_cached_transaction(digest, network)
            if cached:
                logger.debug(f"Cache hit for {digest[:10]}...")
                return cached

        try:
            result = await self._make_rpc_call(
                self.endpoints[network],
                "sui_getTransactionBlock",
                [digest, {
                    "showInput": True,
                    "showEffects": True,
                    "showEvents": True,
                    "showObjectChanges": True,
                    "showBalanceChanges": True
                }]
            )

            if use_cache and result:
                await db.cache_transaction(digest, network, result)

            return result
        except Exception as e:
            logger.error(f"Error fetching transaction {digest[:10]}...: {e}")
            return None

    async def _get_address_transactions(self, address: str, network: str,
                                        limit: int = 100, cursor: str = None) -> Dict:
        """Get transactions for address with validation"""
        # Validate address format
        if not self._is_sui_address(address):
            logger.warning(f"Invalid address format: {address}")
            return {}

        try:
            params = [
                {"FromOrToAddress": address},
                cursor,
                limit,
                True
            ]

            return await self._make_rpc_call(
                self.endpoints[network],
                "suix_queryTransactionBlocks",
                params
            )
        except Exception as e:
            logger.error(f"Error fetching address transactions: {e}")
            return {}

    async def get_all_address_transactions(self, address: str, network: str) -> List[str]:
        """Get ALL transactions for address using pagination"""
        all_digests = []
        cursor = None
        page_count = 0

        logger.info(f"🔍 Fetching all transactions for {address[:10]}... on {network}")

        while True:
            try:
                result = await self._get_address_transactions(address, network, self.batch_size, cursor)
                data = result.get("data", [])

                if not data:
                    break

                all_digests.extend(data)
                page_count += 1

                logger.info(f"📄 Page {page_count}: {len(data)} transactions (Total: {len(all_digests)})")

                if not result.get("hasNextPage", False):
                    break

                cursor = result.get("nextCursor")
                if not cursor:
                    break

                # Rate limiting
                await asyncio.sleep(self.request_delay)

            except Exception as e:
                logger.error(f"Error on page {page_count}: {e}")
                break

        logger.info(f"✅ Found {len(all_digests)} total transactions")
        return all_digests

    async def batch_process_transactions(self, digests: List[str], network: str) -> List[Dict]:
        """Process transactions in optimized batches with AI analysis"""
        transactions = []
        total_batches = (len(digests) + self.batch_size - 1) // self.batch_size

        logger.info(f"🚀 Processing {len(digests)} transactions in {total_batches} batches")

        semaphore = asyncio.Semaphore(self.max_concurrent)

        async def process_transaction(digest: str) -> Optional[Dict]:
            async with semaphore:
                try:
                    tx_data = await self._get_transaction(digest, network)
                    if not tx_data:
                        return None

                    parsed_tx = self._parse_transaction(tx_data, network)

                    # Enhanced AI analysis with tax implications
                    ai_analysis = await ai_service.analyze_transaction_with_tax({
                        'digest': parsed_tx['digest'],
                        'gas_cost': parsed_tx['total_gas_cost'],
                        'sui_in': parsed_tx['sui_amount_in'],
                        'sui_out': parsed_tx['sui_amount_out'],
                        'net_change': parsed_tx['net_sui_change'],
                        'objects_created': parsed_tx['objects_created'],
                        'objects_modified': parsed_tx['objects_modified'],
                        'status': parsed_tx['status'],
                        'transaction_type': parsed_tx['transaction_type'],
                        'timestamp': parsed_tx['timestamp'].isoformat()
                    })

                    parsed_tx.update({
                        'ai_summary': ai_analysis['summary'],
                        'ai_category': ai_analysis['category'],
                        'ai_tax_implications': ai_analysis['tax_implications'],
                        'ai_confidence_score': ai_analysis['confidence_score']
                    })

                    return parsed_tx
                except Exception as e:
                    logger.error(f"Error processing transaction {digest[:10]}...: {e}")
                    return None

        # Process in batches with progress tracking
        for i in range(0, len(digests), self.batch_size):
            batch = digests[i:i + self.batch_size]
            batch_num = i // self.batch_size + 1

            logger.info(f"⚡ Processing batch {batch_num}/{total_batches} ({len(batch)} transactions)")

            tasks = [process_transaction(digest) for digest in batch]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)

            successful = 0
            for result in batch_results:
                if isinstance(result, Exception):
                    logger.error(f"Transaction processing error: {result}")
                elif result:
                    transactions.append(result)
                    successful += 1

            logger.info(f"📊 Batch {batch_num} completed: {successful}/{len(batch)} successful")

            # Rate limiting between batches
            if i + self.batch_size < len(digests):
                await asyncio.sleep(self.request_delay * 2)

        logger.info(f"✅ Successfully processed {len(transactions)}/{len(digests)} transactions")
        return transactions

    def _parse_transaction(self, tx_data: Dict, network: str) -> Dict:
        """Parse raw transaction data with enhanced error handling"""
        try:
            digest = tx_data.get("digest", "")

            # Timestamp with validation
            timestamp_ms = tx_data.get("timestampMs", 0)
            if timestamp_ms and isinstance(timestamp_ms, (int, str)):
                try:
                    timestamp = datetime.fromtimestamp(int(timestamp_ms) / 1000, tz=timezone.utc)
                except (ValueError, OSError):
                    timestamp = datetime.now(timezone.utc)
            else:
                timestamp = datetime.now(timezone.utc)

            # Basic info with safe access
            transaction = tx_data.get("transaction", {})
            effects = tx_data.get("effects", {})

            # Enhanced gas calculation
            gas_data = effects.get("gasUsed", {})
            computation_cost = int(gas_data.get("computationCost", 0))
            storage_cost = int(gas_data.get("storageCost", 0))
            storage_rebate = int(gas_data.get("storageRebate", 0))
            non_refundable_storage = int(gas_data.get("nonRefundableStorageFee", 0))

            total_gas_cost = (computation_cost + storage_cost + non_refundable_storage - storage_rebate) / 1_000_000_000

            # Sender with validation
            sender = transaction.get("data", {}).get("sender", "")
            if not self._is_sui_address(sender):
                logger.warning(f"Invalid sender address in transaction {digest[:10]}...")

            # Transaction type
            tx_kind = transaction.get("data", {}).get("transaction", {}).get("kind", "Unknown")

            # Balance changes
            balance_changes = effects.get("balanceChanges", [])
            sui_in, sui_out = self._calculate_sui_flows(balance_changes, sender)

            # Object changes
            object_changes = tx_data.get("objectChanges", [])
            objects_created = len([obj for obj in object_changes if obj.get("type") == "created"])
            objects_modified = len([obj for obj in object_changes if obj.get("type") == "mutated"])
            objects_deleted = len([obj for obj in object_changes if obj.get("type") == "deleted"])

            # Status
            status = effects.get("status", {}).get("status", "Unknown")

            # Check for errors in execution
            execution_status = effects.get("status", {})
            is_success = execution_status.get("status") == "success"
            error_message = None
            if not is_success:
                error_message = execution_status.get("error", "Unknown error")

            return {
                "digest": digest,
                "timestamp": timestamp,
                "sender": sender,
                "gas_used": computation_cost + storage_cost,
                "gas_price": 1000,  # Default MIST per gas unit
                "total_gas_cost": total_gas_cost,
                "transaction_type": tx_kind,
                "sui_amount_in": sui_in,
                "sui_amount_out": sui_out,
                "net_sui_change": sui_in - sui_out,
                "objects_created": objects_created,
                "objects_modified": objects_modified,
                "objects_deleted": objects_deleted,
                "status": status,
                "is_success": is_success,
                "error_message": error_message,
                "network": network,
                "raw_data": tx_data
            }

        except Exception as e:
            logger.error(f"Error parsing transaction: {e}")
            return {
                "digest": tx_data.get("digest", ""),
                "timestamp": datetime.now(timezone.utc),
                "sender": "",
                "gas_used": 0,
                "gas_price": 0,
                "total_gas_cost": 0,
                "transaction_type": "Error",
                "sui_amount_in": 0,
                "sui_amount_out": 0,
                "net_sui_change": 0,
                "objects_created": 0,
                "objects_modified": 0,
                "objects_deleted": 0,
                "status": "Error",
                "is_success": False,
                "error_message": str(e),
                "network": network,
                "raw_data": tx_data
            }

    def _calculate_sui_flows(self, balance_changes: List[Dict], sender: str) -> Tuple[float, float]:
        """Calculate SUI inflow and outflow for sender with enhanced validation"""
        sui_in = 0.0
        sui_out = 0.0

        try:
            for change in balance_changes:
                # Validate required fields
                if not all(key in change for key in ["coinType", "amount", "owner"]):
                    continue

                # Check if it's SUI coin
                if change.get("coinType") != "0x2::sui::SUI":
                    continue

                # Check if change affects the sender
                owner = change.get("owner", {})
                if isinstance(owner, dict):
                    owner_address = owner.get("AddressOwner")
                else:
                    owner_address = owner

                if owner_address != sender:
                    continue

                # Calculate amount
                try:
                    amount = int(change.get("amount", 0)) / 1_000_000_000  # MIST to SUI

                    if amount > 0:
                        sui_in += amount
                    else:
                        sui_out += abs(amount)

                except (ValueError, TypeError) as e:
                    logger.warning(f"Invalid amount in balance change: {change.get('amount')} - {e}")
                    continue

        except Exception as e:
            logger.error(f"Error calculating SUI flows: {e}")

        return sui_in, sui_out

    async def get_transaction_summary(self, digest: str, network: str = None) -> Dict:
        """Get AI-powered transaction summary with tax implications"""
        try:
            # Auto-detect network if not provided
            if not network:
                network = await self.detect_network(digest)
                if not network:
                    return {"error": "Transaction not found on any network"}

            # Get transaction data
            tx_data = await self._get_transaction(digest, network)
            if not tx_data:
                return {"error": "Transaction not found"}

            # Parse transaction
            parsed_tx = self._parse_transaction(tx_data, network)

            # Generate AI analysis
            ai_analysis = await ai_service.generate_comprehensive_analysis({
                'transaction': parsed_tx,
                'network': network
            })

            return {
                "transaction": parsed_tx,
                "ai_analysis": ai_analysis,
                "network": network
            }

        except Exception as e:
            logger.error(f"Error generating transaction summary: {e}")
            return {"error": str(e)}

    async def analyze_address_portfolio(self, address: str, network: str = None) -> Dict:
        """Comprehensive address analysis with AI insights and tax summary"""
        try:
            # Auto-detect network if not provided
            if not network:
                network = await self.detect_network(address)
                if not network:
                    return {"error": "Address not found on any network"}

            # Get all transactions
            digests = await self.get_all_address_transactions(address, network)
            if not digests:
                return {"error": "No transactions found for address"}

            # Process transactions in batches
            transactions = await self.batch_process_transactions(digests, network)

            # Generate portfolio analysis
            portfolio_analysis = await ai_service.analyze_portfolio({
                'address': address,
                'transactions': transactions,
                'network': network,
                'total_transactions': len(transactions)
            })

            return {
                "address": address,
                "network": network,
                "transaction_count": len(transactions),
                "transactions": transactions,
                "portfolio_analysis": portfolio_analysis
            }

        except Exception as e:
            logger.error(f"Error analyzing address portfolio: {e}")
            return {"error": str(e)}


# Global Sui service instance
sui_service = SuiService()