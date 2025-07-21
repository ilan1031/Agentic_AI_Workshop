# app.py

import os
from dotenv import load_dotenv
import streamlit as st
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini LLM Setup
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    verbose=True,
    temperature=0.3,
    google_api_key=GEMINI_API_KEY
)

# Streamlit UI
st.set_page_config(page_title="🚚 Logistics Crew AI Optimizer", layout="centered")
st.title("🚚 Logistics Optimization using CrewAI")
st.markdown("Define your logistics analysis inputs below:")

product_list_input = st.text_input("🛒 Enter Products (comma-separated)", "Laptop, Smartphone, Router")
location_list_input = st.text_input("🏬 Enter Locations (comma-separated)", "Warehouse A, Warehouse B")
time_range = st.selectbox("📅 Time Range", ["Last 7 days", "Last 30 days", "Last Quarter", "Last Year"])

if st.button("Run Crew AI Optimization"):
    product_list = [p.strip() for p in product_list_input.split(",")]
    location_list = [l.strip() for l in location_list_input.split(",")]

    # Agent 1: Logistics Analyst
    logistics_analyst = Agent(
        role="Logistics Analyst",
        goal="Analyze logistics performance focusing on route efficiency and inventory turnover",
        backstory=(
            "An expert in global logistics and operational analytics, skilled in identifying inefficiencies "
            "in transportation routes and warehouse inventory cycles."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # Agent 2: Optimization Strategist
    optimization_strategist = Agent(
        role="Optimization Strategist",
        goal="Develop a smart, data-driven logistics optimization strategy",
        backstory=(
            "A logistics strategy architect with years of experience in building scalable supply chain "
            "solutions for multinational companies. Specializes in dynamic routing, predictive inventory placement, "
            "and cost-efficient warehousing."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # Task 1: Logistics Analysis
    analysis_task = Task(
        description=(
            f"Analyze logistics data for the following products: {', '.join(product_list)}. "
            f"Focus on route efficiency, delivery delays, and inventory turnover across these locations: "
            f"{', '.join(location_list)} within {time_range}. Identify bottlenecks and inefficiencies."
        ),
        expected_output=(
            "A report on logistics performance, route delays, and inventory problems for each product and location."
        ),
        agent=logistics_analyst
    )

    # Task 2: Optimization Strategy
    strategy_task = Task(
        description=(
            f"Based on the analysis, create an optimization plan for improving delivery and inventory management "
            f"for products: {', '.join(product_list)} across {', '.join(location_list)}."
        ),
        expected_output=(
            "A strategic plan with routing suggestions, warehouse placement changes, and efficiency KPIs."
        ),
        agent=optimization_strategist
    )

    # Build the Crew
    crew = Crew(
        agents=[logistics_analyst, optimization_strategist],
        tasks=[analysis_task, strategy_task],
        process=Process.sequential,
        verbose=True
    )

    with st.spinner("🚀 Running Crew AI... Please wait"):
        result = crew.kickoff()

    st.success("✅ Crew AI has completed the optimization.")
    st.markdown("### 🧠 Final Strategy Output")
    st.markdown(result)

    # Show agent contributions
    st.markdown("---")
    st.markdown("#### 👤 Agent Roles")
    with st.expander("📌 Logistics Analyst"):
        st.markdown(logistics_analyst.backstory)
    with st.expander("📌 Optimization Strategist"):
        st.markdown(optimization_strategist.backstory)
