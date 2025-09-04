# ================================
# app/models/schemas.py - Pydantic Models
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime
from enum import Enum

class SuiNetwork(str, Enum):
    MAINNET = "mainnet"
    TESTNET = "testnet"
    DEVNET = "devnet"

class AnalysisRequest(BaseModel):
    input: str = Field(..., description="Transaction digest or wallet address")
    country: str = Field(..., description="Country code for tax calculations (e.g., 'US', 'UK')")
    year: Optional[int] = Field(2025, description="Tax year for analysis")
    full_history: Optional[bool] = Field(False, description="Analyze complete transaction history")

class BatchAnalysisRequest(BaseModel):
    addresses: List[str] = Field(..., max_items=10, description="List of addresses to analyze")
    country: str = Field(..., description="Country code for tax calculations")
    year: Optional[int] = Field(2025, description="Tax year for analysis")

class TransactionSummary(BaseModel):
    digest: str
    timestamp: datetime
    sender: str
    gas_used: int
    gas_price: int
    total_gas_cost: float
    transaction_type: str
    sui_amount_in: float
    sui_amount_out: float
    net_sui_change: float
    objects_created: int
    objects_modified: int
    status: str
    network: str
    gpt_explanation: str = ""
    gpt_category: str = ""

class TaxSummary(BaseModel):
    total_transactions: int
    total_gas_fees: float
    total_gains: float
    total_losses: float
    net_gain_loss: float
    taxable_events: int
    estimated_tax_owed: float
    country: str
    tax_rate: float
    currency: str
    year: int
    transaction_categories: Dict[str, int]
    gpt_tax_advice: str = ""

class AnalysisResponse(BaseModel):
    success: bool
    analysis_type: str
    network: str
    transaction: Optional[TransactionSummary] = None
    transactions: Optional[List[Dict[str, Any]]] = None
    tax_summary: Optional[TaxSummary] = None
    tax_info: Optional[Dict[str, Any]] = None
    human_summary: str
    address: Optional[str] = None
    total_transactions_found: Optional[int] = None
    transactions_analyzed: Optional[int] = None
