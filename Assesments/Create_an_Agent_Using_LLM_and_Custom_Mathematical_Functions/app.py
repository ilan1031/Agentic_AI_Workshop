import streamlit as st
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import Tool
from crewai import Agent, Task, Crew

# Load environment
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Check API key
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

# Initialize Gemini Pro model
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    temperature=0.4,
    google_api_key=GOOGLE_API_KEY
)

# Streamlit UI
st.set_page_config(page_title="🚛 Logistics Optimization Crew AI", layout="wide")

st.title("🚛 Logistics Optimization Crew AI System")
st.write("This agentic system uses two AI agents to analyze logistics data and generate optimized delivery or inventory strategies.")

product_input = st.text_area("Enter a list of products or delivery locations (comma-separated):", "Product A, Product B, Product C")

trigger = st.button("Run Optimization")

if trigger and product_input:
    product_list = [p.strip() for p in product_input.split(",") if p.strip()]

    # Define Agents
    logistics_analyst = Agent(
        role="Logistics Analyst",
        goal="Analyze logistics data for inefficiencies",
        backstory="You are a seasoned analyst working for a major logistics firm, deeply familiar with supply chain and delivery route metrics.",
        verbose=True,
        llm=llm
    )

    optimizer = Agent(
        role="Optimization Strategist",
        goal="Create actionable strategies to improve logistics performance",
        backstory="You specialize in designing AI-driven strategies that minimize delivery time, reduce cost, and enhance inventory turnover.",
        verbose=True,
        llm=llm
    )

    # Define Tasks
    task_analysis = Task(
        description=(
            f"Analyze the current state of logistics operations for the following products: {', '.join(product_list)}. "
            "Focus on identifying route delays, bottlenecks, or poor inventory turnover."
        ),
        expected_output="Detailed findings and insights into logistics inefficiencies.",
        agent=logistics_analyst
    )

    task_optimization = Task(
        description=(
            f"Using the insights from the logistics analyst, devise an optimization strategy "
            f"for the logistics and delivery process of the following products: {', '.join(product_list)}. "
            "Your strategy should focus on optimizing delivery routes or inventory management using AI or heuristics."
        ),
        expected_output="Optimized delivery or inventory management plan.",
        agent=optimizer
    )

    # Assemble Crew
    crew = Crew(
        agents=[logistics_analyst, optimizer],
        tasks=[task_analysis, task_optimization],
        verbose=True
    )

    # Run Crew
    with st.spinner("Running agents..."):
        result = crew.kickoff()
    st.success("Optimization complete!")
    st.subheader("📝 Final Output")
    st.code(result, language="markdown")

    st.divider()
    st.subheader("📋 Summary")
    st.write(f"- **Products Input:** {', '.join(product_list)}")
    st.write("- **Agents:** Logistics Analyst, Optimization Strategist")
    st.write("- **Goal:** Identify logistics inefficiencies and optimize delivery or inventory workflows.")
