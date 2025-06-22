from langgraph.graph import StateGraph, END
from backend.agents import document_monitor, deadline_tracker, regulation_retriever

# Define agent workflow states
class AgentState:
    def __init__(self):
        self.document_status = None
        self.deadlines = None
        self.regulation_query = None
        self.regulation_result = None

# Initialize agents
doc_agent = document_monitor.DocumentMonitorAgent()
deadline_agent = deadline_tracker.DeadlineTrackerAgent()
reg_agent = regulation_retriever.RegulationRetrieverAgent()

# Define node functions
def document_monitor_node(state):
    state.document_status = doc_agent.monitor_documents()
    return state

def deadline_tracker_node(state):
    state.deadlines = deadline_agent.get_upcoming_deadlines()
    return state

def regulation_retriever_node(state):
    if state.regulation_query:
        state.regulation_result = reg_agent.retrieve_regulation(state.regulation_query)
    return state

# Create workflow
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("document_monitor", document_monitor_node)
workflow.add_node("deadline_tracker", deadline_tracker_node)
workflow.add_node("regulation_retriever", regulation_retriever_node)

# Set entry point
workflow.set_entry_point("document_monitor")

# Define edges
workflow.add_edge("document_monitor", "deadline_tracker")
workflow.add_conditional_edges(
    "deadline_tracker",
    lambda state: "regulation_retriever" if state.regulation_query else END,
    {
        "regulation_retriever": "regulation_retriever",
        "end": END
    }
)
workflow.add_edge("regulation_retriever", END)

# Compile the graph
tax_compliance_flow = workflow.compile()