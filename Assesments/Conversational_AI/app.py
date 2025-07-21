import streamlit as st
from langchain.tools import tool
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.chat_models import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langchain_core.runnables import RunnableLambda
import os
import requests

st.set_page_config(page_title="Competitor Intelligence AI", layout="wide")

st.title("🧠 Competitor Intelligence AI for Clothing Stores")
st.markdown("Enter a location (e.g., Koramangala, Bangalore) to generate a competitive landscape report.")

location = st.text_input("📍 Enter Location", "Koramangala, Bangalore")
run_button = st.button("🔍 Generate Report")

@tool
def fetch_competitors(location: str) -> str:
    """Get top nearby clothing stores and footfall patterns."""
    try:
        search_url = f"https://api.duckduckgo.com/?q=clothing+stores+in+{location}&format=json&no_redirect=1"
        data = requests.get(search_url).json()
        return f"Top clothing stores in {location}:
{data.get('AbstractText', 'Not found')[:500]}..."
    except Exception as e:
        return f"Error fetching data: {str(e)}"

@tool
def footfall_analysis(location: str) -> str:
    """Simulate footfall data for clothing stores at a given location."""
    return f"""Estimated peak hours for stores in {location}:
- Morning (10 AM - 12 PM): Low
- Afternoon (1 PM - 4 PM): Moderate
- Evening (5 PM - 8 PM): High
- Weekends: Very High"""

tools = [fetch_competitors, footfall_analysis]

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.5, convert_system_message_to_human=True)

# Build tool-calling agent
agent_runnable = create_tool_calling_agent(llm, tools)
agent = AgentExecutor(agent=agent_runnable, tools=tools, verbose=True, handle_parsing_errors=True)

# LangGraph setup
def analyst_step(state):
    location = state['location']
    competitors = fetch_competitors.invoke(location)
    return {"location": location, "competitor_info": competitors}

def strategist_step(state):
    location = state['location']
    footfall = footfall_analysis.invoke(location)
    return {"location": location, "footfall_info": footfall}

def generate_report(state):
    return {
        "report": f"""## 🧾 Competitor Report for {state['location']}

### 🛍️ Nearby Competitors:
{state['competitor_info']}

### 📊 Footfall Patterns:
{state['footfall_info']}

### 🧠 Suggestions:
- Consider evening hours for promotions or new launches.
- Plan campaigns during weekends for max exposure.
- Keep track of top-rated competitors.

"""
    }

workflow = StateGraph()
workflow.add_node("Analyst", RunnableLambda(analyst_step))
workflow.add_node("Strategist", RunnableLambda(strategist_step))
workflow.add_node("Report", RunnableLambda(generate_report))
workflow.set_entry_point("Analyst")
workflow.add_edge("Analyst", "Strategist")
workflow.add_edge("Strategist", "Report")
workflow.set_finish_point("Report")
graph = workflow.compile()

if run_button and location:
    with st.spinner("🤖 Thinking..."):
        result = graph.invoke({"location": location})
        st.success("✅ Report Generated!")
        st.markdown(result["report"])
        st.download_button("📥 Download Report", result["report"], file_name="competitor_report.md")