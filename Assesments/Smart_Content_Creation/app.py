import os
import streamlit as st
from dotenv import load_dotenv
from langchain.agents import Tool, AgentExecutor, create_tool_calling_agent
from langchain_core.runnables import RunnableLambda
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.graph import END, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Setup LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3, google_api_key=os.getenv("GEMINI_API_KEY"))

# Tool 1: Search Nearby Clothing Stores
def search_competitor_stores(city: str) -> str:
    search = TavilySearchResults()
    return search.invoke(f"top clothing stores in {city} with high footfall and peak hours")

tool_search = Tool(
    name="CompetitorClothingStoreSearch",
    description="Find top clothing stores in a given location with footfall and peak hour details",
    func=search_competitor_stores
)

# Tool 2: General Web Search (fallback or for contextual info)
search_tool = TavilySearchResults()

# Tool-based agent
tools = [tool_search, search_tool]
agent = create_tool_calling_agent(llm, tools)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# LangGraph pipeline (optional, simple flow here)
def run_agent_task(state):
    query = state["input"]
    result = executor.invoke({"input": query})
    return {**state, "output": result["output"]}

workflow = StateGraph()
workflow.add_node("invoke_agent", RunnableLambda(run_agent_task))
workflow.set_entry_point("invoke_agent")
workflow.set_finish_point("invoke_agent")
graph_executor = workflow.compile()

# 🌟 Streamlit UI
st.set_page_config(page_title="🧠 Competitor Insights AI", layout="wide")
st.title("🧠 Smart Competitor Insights Assistant")
st.markdown("🔍 **Analyze top clothing store competitors with AI-powered insights**")

with st.form("query_form"):
    location = st.text_input("Enter your location (e.g., Koramangala, Bangalore):")
    question = st.text_area("What would you like to know? (e.g., footfall trends, busiest hours)", height=120)
    submitted = st.form_submit_button("🔎 Analyze")

if submitted and location and question:
    query = f"In {location}, {question}"
    with st.spinner("Analyzing competitors..."):
        response = graph_executor.invoke({"input": query})
        st.success("Analysis Complete ✅")
        st.markdown("### 📝 AI-Generated Competitor Report")
        st.write(response["output"])
