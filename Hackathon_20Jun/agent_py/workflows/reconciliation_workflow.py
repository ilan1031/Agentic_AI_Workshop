from langgraph.graph import StateGraph, END
from agents import transaction_extractor, invoice_matcher, categorizer, discrepancy_detector, reconciliation_approver
from pydantic import BaseModel

class WorkflowState(BaseModel):
    content: str = None
    transactions: list = []
    matches: list = []
    categories: list = []
    discrepancies: dict = {}
    report: dict = {}

def create_workflow():
    workflow = StateGraph(WorkflowState)
    
    # Define nodes
    def extract(state):
        state.transactions = transaction_extractor.extract_transactions(state.content)
        return state
    
    def match(state):
        state.matches = invoice_matcher.match_invoices(state.transactions)
        return state
    
    def categorize(state):
        state.categories = categorizer.categorize_transactions(state.transactions)
        return state
    
    def detect(state):
        state.discrepancies = discrepancy_detector.detect_discrepancies(state.transactions, state.matches)
        return state
    
    def approve(state):
        state.report = reconciliation_approver.approve_reconciliation(state.transactions, state.discrepancies)
        return state
    
    # Add nodes
    workflow.add_node("extractor", extract)
    workflow.add_node("matcher", match)
    workflow.add_node("categorizer", categorize)
    workflow.add_node("detector", detect)
    workflow.add_node("approver", approve)
    
    # Define edges
    workflow.set_entry_point("extractor")
    workflow.add_edge("extractor", "matcher")
    workflow.add_edge("matcher", "categorizer")
    workflow.add_edge("categorizer", "detector")
    workflow.add_edge("detector", "approver")
    workflow.add_edge("approver", END)
    
    return workflow.compile()