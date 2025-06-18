import streamlit as st
from backend.workflows.langgraph_flow import tax_compliance_flow
from backend.agents.deadline_tracker import DeadlineTrackerAgent
from backend.agents.regulation_retriever import RegulationRetrieverAgent
from datetime import datetime
import os

# Page setup
st.set_page_config(page_title="Tax Compliance Tracker", layout="wide")
st.title("Smart Tax Compliance Tracker")

# Initialize agents
deadline_agent = DeadlineTrackerAgent()
reg_agent = RegulationRetrieverAgent()

# Sidebar for document upload
with st.sidebar:
    st.header("Upload Documents")
    invoice_file = st.file_uploader("Invoices", type=["pdf", "csv"])
    transaction_file = st.file_uploader("Transactions", type=["csv", "json"])
    ledger_file = st.file_uploader("Ledgers", type=["xlsx", "csv"])
    regulation_file = st.file_uploader("Regulations", type=["pdf", "txt", "docx"])
    
    if st.button("Process Documents"):
        # Save uploaded files (implementation omitted for brevity)
        st.success("Documents processed successfully!")

# Main tabs
tab1, tab2, tab3 = st.tabs(["Dashboard", "Regulation Search", "Compliance Calendar"])

with tab1:  # Dashboard
    st.subheader("Compliance Status")
    
    # Run agent workflow
    state = tax_compliance_flow.invoke({"regulation_query": None})
    
    col1, col2 = st.columns(2)
    with col1:
        st.info("Document Monitoring")
        st.write(state["document_status"] or "No new documents")
        
    with col2:
        st.info("Upcoming Deadlines")
        deadlines = deadline_agent.get_upcoming_deadlines()
        if deadlines:
            for d in deadlines:
                st.warning(f"**{d['summary']}** - Due: {d['start'].strftime('%Y-%m-%d')}")
        else:
            st.success("No upcoming deadlines in next 7 days")

with tab2:  # Regulation Search
    st.subheader("Tax Regulation Search")
    query = st.text_input("Enter your tax regulation query:")
    
    if query:
        result = reg_agent.retrieve_regulation(query)
        st.markdown(f"**Result:**\n{result}")

with tab3:  # Compliance Calendar
    st.subheader("Compliance Calendar")
    days = st.slider("Lookahead days", 1, 90, 30)
    deadlines = deadline_agent.get_upcoming_deadlines(days)
    
    if deadlines:
        for event in deadlines:
            start_date = event["start"].strftime("%Y-%m-%d")
            delta = (event["start"] - datetime.now()).days
            st.write(f"**{event['summary']}**")
            st.caption(f"Due: {start_date} ({delta} days remaining)")
            st.progress(min(100, max(0, 100 - (delta/days)*100)))
    else:
        st.info("No upcoming compliance deadlines")