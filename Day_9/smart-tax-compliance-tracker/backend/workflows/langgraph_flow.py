from langgraph.graph import StateGraph, END
from backend.agents import document_monitor, deadline_tracker, regulation_retriever

doc_agent = document_monitor.DocumentMonitorAgent()
deadline_agent = deadline_tracker.DeadlineTrackerAgent()
reg_agent = regulation_retriever.RegulationRetrieverAgent()

# Use a dict-based state
workflow = StateGraph(dict)

# Node functions: operate on and return dicts
def document_monitor_node(state):
    state["document_status"] = doc_agent.monitor_documents()
    return state

def deadline_tracker_node(state):
    state["deadlines"] = deadline_agent.get_upcoming_deadlines()
    return state

def regulation_retriever_node(state):
    if state.get("regulation_query"):
        state["regulation_result"] = reg_agent.retrieve_regulation(state["regulation_query"])
    return state

workflow.add_node("document_monitor", document_monitor_node)
workflow.add_node("deadline_tracker", deadline_tracker_node)
workflow.add_node("regulation_retriever", regulation_retriever_node)

workflow.set_entry_point("document_monitor")

workflow.add_edge("document_monitor", "deadline_tracker")
workflow.add_conditional_edges(
    "deadline_tracker",
    lambda state: "regulation_retriever" if state.get("regulation_query") else END,
    {
        "regulation_retriever": "regulation_retriever",
        END: END
    }
)
workflow.add_edge("regulation_retriever", END)

tax_compliance_flow = workflow.compile()
