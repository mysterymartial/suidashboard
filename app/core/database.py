# ================================
# app/core/database.py - Database Management
import logging
import pickle
import time
from typing import Optional, Dict

import aiosqlite

logger = logging.getLogger(__name__)


class Database:
    def __init__(self, db_path: str = "data/sui_tax_analysis.db"):
        self.db_path = db_path

    async def init_db(self):
        """Initialize database tables"""
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute('''
                CREATE TABLE IF NOT EXISTS transaction_cache (
                    digest TEXT PRIMARY KEY,
                    network TEXT NOT NULL,
                    data BLOB NOT NULL,
                    timestamp INTEGER NOT NULL
                )
            ''')

            await db.execute('''
                CREATE TABLE IF NOT EXISTS address_analysis (
                    address TEXT PRIMARY KEY,
                    network TEXT NOT NULL,
                    last_analyzed INTEGER NOT NULL,
                    transaction_count INTEGER NOT NULL,
                    analysis_data BLOB NOT NULL
                )
            ''')

            await db.execute('''
                CREATE TABLE IF NOT EXISTS tax_cache (
                    country TEXT PRIMARY KEY,
                    tax_data BLOB NOT NULL,
                    timestamp INTEGER NOT NULL
                )
            ''')

            await db.commit()
            logger.info("✅ Database tables initialized")

    async def get_cached_transaction(self, digest: str, network: str) -> Optional[Dict]:
        """Get cached transaction data"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                cursor = await db.execute(
                    "SELECT data, timestamp FROM transaction_cache WHERE digest = ? AND network = ?",
                    (digest, network)
                )
                result = await cursor.fetchone()

                if result:
                    data, timestamp = result
                    # Check if cache is still valid
                    if time.time() - timestamp < 3600:  # 1 hour
                        return pickle.loads(data)
        except Exception as e:
            logger.error(f"Cache read error: {e}")
        return None

    async def cache_transaction(self, digest: str, network: str, data: Dict):
        """Cache transaction data"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute(
                    "INSERT OR REPLACE INTO transaction_cache (digest, network, data, timestamp) VALUES (?, ?, ?, ?)",
                    (digest, network, pickle.dumps(data), int(time.time()))
                )
                await db.commit()
        except Exception as e:
            logger.error(f"Cache write error: {e}")

    async def get_cached_tax_info(self, country: str) -> Optional[Dict]:
        """Get cached tax information"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                cursor = await db.execute(
                    "SELECT tax_data, timestamp FROM tax_cache WHERE country = ?",
                    (country.upper(),)
                )
                result = await cursor.fetchone()

                if result:
                    data, timestamp = result
                    # Tax info valid for 24 hours
                    if time.time() - timestamp < 86400:
                        return pickle.loads(data)
        except Exception as e:
            logger.error(f"Tax cache read error: {e}")
        return None

    async def cache_tax_info(self, country: str, tax_data: Dict):
        """Cache tax information"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute(
                    "INSERT OR REPLACE INTO tax_cache (country, tax_data, timestamp) VALUES (?, ?, ?)",
                    (country.upper(), pickle.dumps(tax_data), int(time.time()))
                )
                await db.commit()
        except Exception as e:
            logger.error(f"Tax cache write error: {e}")


# Global database instance
db = Database()


async def init_db():
    """Initialize database"""
    await db.init_db()