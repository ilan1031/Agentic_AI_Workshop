from langgraph.graph import StateGraph, END
from agents.transaction_extractor import transaction_extractor
from agents.invoice_matcher import invoice_matcher
from agents.categorizer import categorizer
from agents.discrepancy_detector import discrepancy_detector
from agents.reconciliation_approver import reconciliation_approver

# Define state
class AgentState(dict):
    file_content: str = None
    file_type: str = None
    transactions: list = None
    matched_results: list = None
    categorized_results: list = None
    discrepancy_results: list = None
    report: dict = None

# Build graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("extractor", transaction_extractor)
workflow.add_node("matcher", invoice_matcher)
workflow.add_node("categorizer", categorizer)
workflow.add_node("detector", discrepancy_detector)
workflow.add_node("approver", reconciliation_approver)

# Define edges
workflow.set_entry_point("extractor")
workflow.add_edge("extractor", "matcher")
workflow.add_edge("matcher", "categorizer")
workflow.add_edge("categorizer", "detector")
workflow.add_edge("detector", "approver")
workflow.add_edge("approver", END)

# Compile
app = workflow.compile()