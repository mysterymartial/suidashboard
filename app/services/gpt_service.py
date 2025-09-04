# # ================================
# # app/services/gpt_service.py - GPT Integration
# import openai
# import json
# import logging
# from typing import Dict, Optional
# from app.core.config import settings
# from app.core.database import db
#
# logger = logging.getLogger(__name__)
#
#
# class GPTService:
#     def __init__(self):
#         openai.api_key = settings.OPENAI_API_KEY
#         self.model = "gpt-4-turbo-preview"
#         self.fallback_model = "gpt-3.5-turbo"
#
#     async def get_real_time_tax_info(self, country: str) -> Dict:
#         """Get real-time tax information using GPT"""
#         # Check cache first
#         cached_tax_info = await db.get_cached_tax_info(country)
#         if cached_tax_info:
#             logger.info(f"Using cached tax info for {country}")
#             return cached_tax_info
#
#         try:
#             prompt = f"""
#             Provide current 2025 tax information for {country} regarding cryptocurrency transactions.
#             Return ONLY valid JSON with these exact keys:
#             {{
#                 "capital_gains_short_term": 0.25,
#                 "capital_gains_long_term": 0.15,
#                 "fee_deductible": true,
#                 "currency": "USD",
#                 "crypto_to_crypto_taxable": true,
#                 "reporting_threshold": 600,
#                 "recent_changes": "Brief description of 2024-2025 changes"
#             }}
#
#             Provide accurate decimal rates (not percentages) for {country}.
#             """
#
#             response = await self._call_gpt(prompt)
#
#             try:
#                 tax_info = json.loads(response)
#                 required_fields = ['capital_gains_short_term', 'capital_gains_long_term',
#                                    'fee_deductible', 'currency', 'crypto_to_crypto_taxable']
#
#                 if all(field in tax_info for field in required_fields):
#                     await db.cache_tax_info(country, tax_info)
#                     logger.info(f"✅ Got real-time tax info for {country}")
#                     return tax_info
#
#             except json.JSONDecodeError:
#                 logger.warning(f"GPT returned invalid JSON for {country}")
#
#         except Exception as e:
#             logger.error(f"Error getting tax info for {country}: {e}")
#
#         # Fallback to hardcoded rates
#         fallback_rates = self._get_fallback_tax_rates(country)
#         await db.cache_tax_info(country, fallback_rates)
#         return fallback_rates
#
#     async def analyze_transaction(self, transaction_data: Dict) -> Dict[str, str]:
#         """Analyze transaction with GPT"""
#         try:
#             prompt = f"""
#             Analyze this Sui blockchain transaction. Respond with EXACTLY this format:
#
#             EXPLANATION: [One clear sentence explaining what happened]
#             CATEGORY: [One word: Transfer, DeFi_Swap, NFT_Purchase, Smart_Contract, Staking, Gaming, or Other]
#
#             Transaction data:
#             - Gas cost: {transaction_data.get('gas_cost', 0)} SUI
#             - SUI in: {transaction_data.get('sui_in', 0)}
#             - SUI out: {transaction_data.get('sui_out', 0)}
#             - Objects created: {transaction_data.get('objects_created', 0)}
#             - Objects modified: {transaction_data.get('objects_modified', 0)}
#             - Status: {transaction_data.get('status', 'Unknown')}
#             """
#
#             response = await self._call_gpt(prompt, model=self.fallback_model)
#
#             explanation = ""
#             category = "Other"
#
#             for line in response.split('\n'):
#                 if line.startswith("EXPLANATION:"):
#                     explanation = line.replace("EXPLANATION:", "").strip()
#                 elif line.startswith("CATEGORY:"):
#                     category = line.replace("CATEGORY:", "").strip()
#
#             return {
#                 "explanation": explanation or "Transaction completed successfully",
#                 "category": category
#             }
#
#         except Exception as e:
#             logger.error(f"GPT transaction analysis error: {e}")
#             return {
#                 "explanation": "Transaction processed",
#                 "category": "Other"
#             }
#
#     async def generate_tax_advice(self, tax_summary: Dict, transactions_sample: List[Dict]) -> str:
#         """Generate personalized tax advice"""
#         try:
#             prompt = f"""
#             Generate concise tax advice for a {tax_summary['country']} crypto investor:
#
#             Portfolio Summary:
#             - Total Transactions: {tax_summary['total_transactions']}
#             - Net P&L: {tax_summary['net_gain_loss']:.6f} SUI
#             - Tax Rate: {tax_summary['tax_rate'] * 100}%
#             - Currency: {tax_summary['currency']}
#
#             Provide 3-4 bullet points with actionable advice. Keep under 200 words.
#             """
#
#             advice = await self._call_gpt(prompt, model=self.fallback_model)
#             return advice or "Consult a qualified tax professional for personalized advice."
#
#         except Exception as e:
#             logger.error(f"Error generating tax advice: {e}")
#             return "Unable to generate personalized advice. Please consult a tax professional."
#
#     async def _call_gpt(self, prompt: str, model: Optional[str] = None) -> str:
#         """Make GPT API call with error handling"""
#         try:
#             model_to_use = model or self.model
#
#             response = openai.ChatCompletion.create(
#                 model=model_to_use,
#                 messages=[{"role": "user", "content": prompt}],
#                 max_tokens=800,
#                 temperature=0.2
#             )
#
#             return response.choices[0].message.content.strip()
#
#         except Exception as e:
#             logger.error(f"GPT API call failed: {e}")
#             if model != self.fallback_model:
#                 # Try fallback model
#                 return await self._call_gpt(prompt, self.fallback_model)
#             raise e
#
#     def _get_fallback_tax_rates(self, country: str) -> Dict:
#         """Fallback tax rates"""
#         fallback_rates = {
#             "US": {"capital_gains_short_term": 0.37, "capital_gains_long_term": 0.20,
#                    "fee_deductible": True, "currency": "USD", "crypto_to_crypto_taxable": True},
#             "UK": {"capital_gains_short_term": 0.20, "capital_gains_long_term": 0.20,
#                    "fee_deductible": True, "currency": "GBP", "crypto_to_crypto_taxable": True},
#             "CA": {"capital_gains_short_term": 0.50, "capital_gains_long_term": 0.25,
#                    "fee_deductible": True, "currency": "CAD", "crypto_to_crypto_taxable": True},
#             "DE": {"capital_gains_short_term": 0.42, "capital_gains_long_term": 0.26,
#                    "fee_deductible": True, "currency": "EUR", "crypto_to_crypto_taxable": True},
#         }
#         return fallback_rates.get(country.upper(), fallback_rates["US"])
#
#
# # Global GPT service instance
# gpt_service = GPTService()
