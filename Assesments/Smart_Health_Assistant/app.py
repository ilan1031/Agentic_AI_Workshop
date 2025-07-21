import streamlit as st
import google.generativeai as genai
import autogen
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager
import os

st.set_page_config(page_title="Smart Health Assistant", layout="centered")

# UI Sidebar
st.sidebar.title("🔐 API Configuration")
GOOGLE_API_KEY = st.sidebar.text_input("Enter your Google Gemini API Key", type="password")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    st.success("API Key configured successfully!", icon="✅")
else:
    st.warning("Please enter your API Key to proceed.")

# App Title
st.title("🤖 Smart Health Assistant")
st.markdown("Generate a personalized health plan with **BMI**, **meal**, and **workout** recommendations using AI agents.")

# Collect User Input
with st.form("health_form"):
    name = st.text_input("👤 Your Name")
    age = st.number_input("🎂 Age", min_value=1, max_value=120)
    gender = st.selectbox("🚻 Gender", ["Male", "Female", "Other"])
    weight = st.number_input("⚖️ Weight (kg)", min_value=1.0)
    height = st.number_input("📏 Height (cm)", min_value=50.0)
    goal = st.selectbox("🎯 Health Goal", ["Lose Weight", "Gain Muscle", "Maintain Fitness"])
    dietary_pref = st.selectbox("🥗 Dietary Preference", ["Vegetarian", "Non-Vegetarian", "Vegan"])
    submit = st.form_submit_button("🧠 Generate Plan")

if submit and GOOGLE_API_KEY:
    st.info("Generating your personalized health plan...")

    # Agent Configuration
    config_list = [{
        "model": "gemini-1.5-flash",
        "api_key": GOOGLE_API_KEY
    }]

    llm_config = {
        "config_list": config_list,
        "temperature": 0.7,
        "timeout": 60,
    }

    # Define Assistant Agents
    bmi_agent = AssistantAgent(
        name="BMI_Agent",
        llm_config=llm_config,
        system_message="You are a health expert. Calculate BMI and give advice."
    )

    diet_agent = AssistantAgent(
        name="Diet_Planner",
        llm_config=llm_config,
        system_message="You are a nutritionist. Create a detailed 7-day meal plan based on user's BMI, dietary preference, and goal."
    )

    workout_agent = AssistantAgent(
        name="Workout_Scheduler",
        llm_config=llm_config,
        system_message="You are a fitness coach. Design a workout plan based on user's BMI, age, gender, and goal."
    )

    # User Proxy
    user_proxy = UserProxyAgent(
        name="User",
        code_execution_config={"work_dir": "code", "use_docker": False},
        human_input_mode="NEVER",
    )

    # Group Chat with All Agents
    groupchat = GroupChat(
        agents=[user_proxy, bmi_agent, diet_agent, workout_agent],
        messages=[],
        max_round=3,
    )

    manager = GroupChatManager(groupchat=groupchat, llm_config=llm_config)

    user_message = f"""
    Generate a complete health plan for:

    - Name: {name}
    - Age: {age}
    - Gender: {gender}
    - Weight: {weight} kg
    - Height: {height} cm
    - Health Goal: {goal}
    - Dietary Preference: {dietary_pref}

    Provide:
    1. BMI and explanation
    2. Personalized meal plan
    3. 7-day workout routine
    """

    user_proxy.initiate_chat(manager, message=user_message)

    final_messages = groupchat.messages

    report = ""
    for msg in final_messages:
        if msg["role"] == "assistant":
            report += msg["content"] + "\n\n"

    st.subheader("📄 Personalized Health Report")
    st.markdown(report)

    st.download_button(
        label="📥 Download Report",
        data=report,
        file_name="health_report.txt",
        mime="text/plain"
    )
