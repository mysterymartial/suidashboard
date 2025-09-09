# ================================ 
# app/services/ai_service.py
import aiohttp 
import json 
import logging 
from typing import Dict, Optional, List 
from app.core.config import settings
from app.core.database import db
 
logger = logging.getLogger(__name__) 
 
class FreeAIService: 
    def __init__(self):
        self.hf_api_url = settings.HF_API_URL
        self.model = settings.HF_MODEL
        # Alternative models
        # "google/flan-t5-large" 
        # "microsoft/DialoGPT-large"  
        # "EleutherAI/gpt-j-6B" 
         
    async def get_real_time_tax_info(self, country: str) -> Dict:

        cached_tax_info = await db.get_cached_tax_info(country)
        if cached_tax_info:
            logger.info(f"Using cached tax info for {country}")
            return cached_tax_info
            
        try: 
            prompt = f"""Generate tax information for {country} cryptocurrency in JSON format: 
            capital_gains_short_term (decimal), capital_gains_long_term (decimal),  
            fee_deductible (boolean), currency (string), crypto_to_crypto_taxable (boolean) 
            Only respond with valid JSON."""
             
            response = await self._call_huggingface(prompt) 
             

            try: 

                cleaned = response.strip() 
                if '{' in cleaned: 
                    json_start = cleaned.find('{') 
                    json_end = cleaned.rfind('}') + 1 
                    json_text = cleaned[json_start:json_end] 
                    tax_info = json.loads(json_text) 
                     

                    required = ['capital_gains_short_term', 'capital_gains_long_term',  
                              'fee_deductible', 'currency', 'crypto_to_crypto_taxable'] 
                     
                    if all(field in tax_info for field in required): 
                        tax_info['recent_changes'] = f"AI-generated tax info for {country} (2024-2025)" 
                        tax_info['reporting_threshold'] = 600 
                        logger.info(f"🤖 Got AI tax info for {country}") 
                        

                        await db.cache_tax_info(country, tax_info)
                        
                        return tax_info 
            except Exception as e: 
                logger.error(f"Failed to parse AI response: {e}") 
                 
        except Exception as e: 
            logger.error(f"AI tax info error: {e}") 
         

        return self._get_fallback_tax_rates(country)

    async def analyze_transaction(self, transaction_data: Dict) -> Dict[str, str]:
        """Analyze transaction using free AI"""
        try:
            prompt = f"""Analyze this Sui blockchain transaction: 
            Gas: {transaction_data.get('gas_cost', 0)} SUI 
            SUI in: {transaction_data.get('sui_in', 0)} 
            SUI out: {transaction_data.get('sui_out', 0)} 
            Objects created: {transaction_data.get('objects_created', 0)} 
            Objects modified: {transaction_data.get('objects_modified', 0)} 
             
            Respond with: 
            EXPLANATION: [one sentence] 
            CATEGORY: [Transfer/DeFi_Swap/NFT_Purchase/Smart_Contract/Staking/Gaming/Other]"""

            response = await self._call_huggingface(prompt)

            explanation = "Transaction completed successfully"
            category = "Other"


            lines = response.split('\n')
            for line in lines:
                if 'EXPLANATION:' in line:
                    explanation = line.split('EXPLANATION:', 1)[-1].strip()
                elif 'CATEGORY:' in line:
                    category = line.split('CATEGORY:', 1)[-1].strip()
                    # Clean up category
                    valid_categories = ['Transfer', 'DeFi_Swap', 'NFT_Purchase',
                                     'Smart_Contract', 'Staking', 'Gaming', 'Other']
                    if category not in valid_categories:
                        category = "Other"

            logger.info(f"🤖 AI analysis: {category} - {explanation}")

            return {
                "explanation": explanation,
                "category": category
            }

        except Exception as e:
            logger.error(f"AI transaction analysis error: {e}")

            return self._analyze_transaction_fallback(transaction_data)

    async def generate_tax_advice(self, tax_summary: Dict, transactions_sample: List[Dict]) -> str:
        """Generate tax advice using free AI"""
        try:
            prompt = f"""Generate crypto tax advice for {tax_summary['country']} investor: 
            Transactions: {tax_summary['total_transactions']} 
            Net P&L: {tax_summary['net_gain_loss']:.6f} SUI 
            Tax Rate: {tax_summary['tax_rate'] * 100}% 
             
            Provide 3-4 bullet points with actionable tax advice. Keep under 200 words."""

            advice = await self._call_huggingface(prompt)

            if advice and len(advice) > 50:
                logger.info(f"🤖 Generated AI tax advice for {tax_summary['country']}")
                return advice

        except Exception as e:
            logger.error(f"AI advice generation error: {e}")


        return self._generate_fallback_advice(tax_summary)

    async def _call_huggingface(self, prompt: str) -> str:
        """Call Hugging Face Inference API """
        try: 
            url = f"{self.hf_api_url}/{self.model}" 
             
            payload = { 
                "inputs": prompt, 
                "parameters": { 
                    "max_new_tokens": 150,
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "do_sample": True
                } 
            } 
            
            headers = {
                "Authorization": f"Bearer {settings.HF_TOKEN}"
            }
             
            async with aiohttp.ClientSession() as session: 
                async with session.post(url, json=payload, headers=headers) as response: 
                    if response.status == 200: 
                        result = await response.json() 
                        if isinstance(result, list) and len(result) > 0: 

                            return result[0].get("generated_text", "") 
                        elif isinstance(result, dict): 

                            return result.get("generated_text", "") 
                    else: 
                        error_text = await response.text() 
                        logger.error(f"Hugging Face API error: {response.status} - {error_text}") 
                        return "" 
        except Exception as e: 
            logger.error(f"Error calling Hugging Face API: {e}") 
            return "" 

    def _get_fallback_tax_rates(self, country: str) -> Dict: 
        """Fallback tax rates if AI fails""" 

        country = country.upper() 
        tax_rates = { 
            "US": {"capital_gains_short_term": 0.37, "capital_gains_long_term": 0.20}, 
            "UK": {"capital_gains_short_term": 0.20, "capital_gains_long_term": 0.20}, 
            "DE": {"capital_gains_short_term": 0.25, "capital_gains_long_term": 0.25}, 
            "JP": {"capital_gains_short_term": 0.55, "capital_gains_long_term": 0.20}, 
            "SG": {"capital_gains_short_term": 0.00, "capital_gains_long_term": 0.00}, 
        } 
         

        rates = tax_rates.get(country, tax_rates["US"]) 
         

        return { 
            "capital_gains_short_term": rates["capital_gains_short_term"], 
            "capital_gains_long_term": rates["capital_gains_long_term"], 
            "fee_deductible": True, 
            "currency": "USD", 
            "crypto_to_crypto_taxable": True, 
            "reporting_threshold": 600, 
            "recent_changes": f"Fallback tax rates for {country}" 
        } 

    def _analyze_transaction_fallback(self, transaction_data: Dict) -> Dict[str, str]: 
        """Fallback transaction analysis if AI fails""" 

        sui_in = transaction_data.get('sui_in', 0) 
        sui_out = transaction_data.get('sui_out', 0) 
        objects_created = transaction_data.get('objects_created', 0) 
        objects_modified = transaction_data.get('objects_modified', 0) 
         
        if sui_in > 0 and sui_out == 0: 
            return { 
                "explanation": f"Received {sui_in} SUI", 
                "category": "Transfer" 
            } 
        elif sui_out > 0 and sui_in == 0: 
            return { 
                "explanation": f"Sent {sui_out} SUI", 
                "category": "Transfer" 
            } 
        elif objects_created > 0 and objects_modified > 2: 
            return { 
                "explanation": f"Created {objects_created} objects and modified {objects_modified}", 
                "category": "Smart_Contract" 
            } 
        else: 
            return { 
                "explanation": "Transaction completed", 
                "category": "Other" 
            } 

    def _generate_fallback_advice(self, tax_summary: Dict) -> str: 
        """Generate fallback tax advice if AI fails""" 
        country = tax_summary['country'] 
        net_gain_loss = tax_summary['net_gain_loss'] 
        tax_rate = tax_summary.get('tax_rate', 0.20) 
         
        if net_gain_loss > 0: 
            return f"""Tax Advice for {country} Crypto Investors:
            
• Keep detailed records of all your cryptocurrency transactions for tax reporting purposes.
• Consider holding assets longer than one year to potentially qualify for lower long-term capital gains rates.
• Transaction fees may be deductible from your taxable gains - consult with a tax professional.
• If you've realized significant gains this year ({net_gain_loss:.2f} SUI), consider tax-loss harvesting strategies.

This is general advice. Please consult with a qualified tax professional for advice specific to your situation."""
        else: 
            return f"""Tax Advice for {country} Crypto Investors:
            
• Your current position shows a net loss, which may be used to offset capital gains from other investments.
• Keep detailed records of all your cryptocurrency transactions for tax reporting purposes.
• Different countries have different rules for carrying forward crypto losses - consult a tax professional.
• Consider tax-loss harvesting strategies if you have gains in other investments.

This is general advice. Please consult with a qualified tax professional for advice specific to your situation."""


ai_service = FreeAIService()