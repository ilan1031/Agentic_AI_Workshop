# travel_assistant_agent.py

import os
import requests
import streamlit as st
from dotenv import load_dotenv
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities.duckduckgo_search import DuckDuckGoSearchAPIWrapper

# Load .env keys
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

# Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GEMINI_API_KEY)

# ---------------------- TOOLS ----------------------

@tool
def get_current_weather(location: str) -> str:
    """Get current weather info for a given location"""
    try:
        url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={location}&aqi=no"
        response = requests.get(url).json()

        if "error" in response:
            return f"Weather not available: {response['error']['message']}"

        weather = response["current"]
        return (f"Weather in {location}: {weather['temp_c']}°C, {weather['condition']['text']}.\n"
                f"Feels like {weather['feelslike_c']}°C. "
                f"Humidity: {weather['humidity']}%. "
                f"Wind: {weather['wind_kph']} km/h.")
    except Exception as e:
        return f"Weather tool failed: {str(e)}"

@tool
def get_top_attractions(location: str) -> str:
    """Get top tourist attractions"""
    try:
        search = DuckDuckGoSearchAPIWrapper()
        results = search.run(f"top 5 tourist attractions in {location} with short descriptions")

        summary_prompt = (
            f"List and summarize the 5 best tourist attractions in {location} from this:\n\n{results}\n\n"
            "Use this format:\n"
            "1. **Name** (Type) - Description. Why visit: ...")

        return llm.invoke(summary_prompt).content
    except Exception as e:
        return f"Attraction tool failed: {str(e)}"

@tool
def get_accommodation_recommendations(location: str, travel_style: str) -> str:
    """Get hotel/stay recommendations based on travel style"""
    try:
        search = DuckDuckGoSearchAPIWrapper()
        query = f"best {travel_style.lower()} hotels in {location}"
        raw_results = search.run(query)

        prompt = (
            f"Suggest 3 good stays in {location} for {travel_style} travelers. For each, include:\n"
            "- Name\n- Type\n- Features\n- Why it suits {travel_style}\n\n{raw_results}"
        )

        return llm.invoke(prompt).content
    except Exception as e:
        return f"Accommodation tool failed: {str(e)}"

# ------------------ AGENT SETUP ------------------

tools = [get_current_weather, get_top_attractions, get_accommodation_recommendations]

prompt = ChatPromptTemplate.from_messages([
    ("system", 
     "You are a helpful Travel Assistant.\n"
     "Provide responses with the following structure:\n"
     "### Weather Report ☀️🌧️❄️\n[weather]\n\n"
     "### Top Attractions 🏰🏞️🎭\n[attractions]\n\n"
     "### Where to Stay 🏨\n[accommodations]\n\n"
     "Use emojis and concise explanations."),
    ("human", "{input}")
])

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# ------------------ STREAMLIT UI ------------------

st.set_page_config(page_title="🌍 Travel Assistant AI", layout="wide")
st.title("🌍 Travel Assistant AI ✈️")

# Sidebar
with st.sidebar:
    st.header("🗺️ Travel Planner")
    location = st.text_input("Destination", "Paris")
    style = st.selectbox("Travel Style", ["Adventure", "Relaxation", "Cultural", "Foodie", "Family", "Business"])
    if st.button("Clear"):
        st.session_state.messages = []
        st.rerun()

# Init history
if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "Where are you planning to go today? 🌎"}]

# Display history
for msg in st.session_state.messages:
    avatar = "🧑‍💻" if msg["role"] == "user" else "🤖"
    with st.chat_message(msg["role"], avatar=avatar):
        st.markdown(msg["content"])

# User input
if prompt := st.chat_input("Ask about your trip or destination..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user", avatar="🧑‍💻"):
        st.markdown(prompt)

    with st.chat_message("assistant", avatar="🤖"):
        with st.spinner("Planning your trip..."):
            try:
                input_text = (
                    f"I'm planning a {style.lower()} trip to {location}. "
                    f"Please help with weather, places to visit, and stays."
                )
                result = agent_executor.invoke({"input": input_text})
                reply = result["output"]
                st.markdown(reply)
                st.session_state.messages.append({"role": "assistant", "content": reply})
            except Exception as e:
                error = f"❌ Error: {str(e)}"
                st.error(error)
                st.session_state.messages.append({"role": "assistant", "content": error})

st.caption("Built with LangChain ⚙️ + Gemini ✨ + Streamlit 🖼️")
