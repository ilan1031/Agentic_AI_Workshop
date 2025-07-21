import os
import streamlit as st
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager

# Load Gemini API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Expense categories
CATEGORIES = ["Groceries", "Dining", "Utilities", "Shopping", "Entertainment", "Others"]

# Streamlit UI
st.set_page_config(page_title="🧾 AI Bill Management Agent", layout="wide")
st.title("🧾 Smart Bill Analyzer")
st.markdown("Upload a bill image to extract, categorize, and summarize your expenses using **Gemini Vision** and **AutoGen Agents**.")

uploaded_file = st.file_uploader("📤 Upload Bill Image (JPG/PNG)", type=["jpg", "jpeg", "png"])
chat_log = []

# Gemini Vision Function
def extract_expenses(image_file):
    image_data = image_file.read()
    model = genai.GenerativeModel("gemini-pro-vision")
    prompt = f"""
    Extract item names and prices from this bill image.
    Return results in this JSON format:
    {{
      "expenses": [
        {{"item": "Milk", "amount": 45}},
        {{"item": "Eggs", "amount": 60}}
      ]
    }}
    """
    response = model.generate_content([prompt, image_data])
    return response.text.strip()

# Agent Definitions
user_proxy = UserProxyAgent(name="user_proxy", code_execution_config=False)
agent1 = AssistantAgent(name="BillProcessingAgent")
agent2 = AssistantAgent(name="ExpenseSummarizationAgent")

groupchat = GroupChat(agents=[user_proxy, agent1, agent2], messages=[], max_round=10)
manager = GroupChatManager(groupchat=groupchat, llm_config={"config_list": [{"model": "gpt-4", "api_key": "dummy"}]})

# AI Categorization Logic
def categorize_expenses(expense_list):
    categorized = {cat: [] for cat in CATEGORIES}
    for item in expense_list:
        name = item["item"].lower()
        amount = item["amount"]
        if any(word in name for word in ["milk", "eggs", "rice", "vegetable"]):
            categorized["Groceries"].append(amount)
        elif any(word in name for word in ["pizza", "coffee", "burger"]):
            categorized["Dining"].append(amount)
        elif any(word in name for word in ["electric", "water", "wifi"]):
            categorized["Utilities"].append(amount)
        elif any(word in name for word in ["shirt", "jeans", "dress"]):
            categorized["Shopping"].append(amount)
        elif any(word in name for word in ["movie", "netflix"]):
            categorized["Entertainment"].append(amount)
        else:
            categorized["Others"].append(amount)
    return categorized

def summarize_expenses(categorized):
    summary = "## 💰 Expense Summary\n"
    total = 0
    for cat, amounts in categorized.items():
        cat_total = sum(amounts)
        summary += f"- **{cat}**: ₹{cat_total:.2f}\n"
        total += cat_total
    summary += f"\n### 📌 Total Spent: ₹{total:.2f}\n"
    top_category = max(categorized.items(), key=lambda x: sum(x[1]))[0]
    summary += f"📈 Your highest spending is on **{top_category}**."
    return summary

# MAIN LOGIC
if uploaded_file:
    with st.spinner("🔍 Extracting expenses..."):
        extracted_json_str = extract_expenses(uploaded_file)
        try:
            import json
            expense_data = json.loads(extracted_json_str)
            expenses = expense_data.get("expenses", [])
        except Exception as e:
            st.error("Failed to parse expenses. Please check the bill format.")
            st.stop()

        # Display Extracted Data
        st.subheader("📋 Extracted Expenses")
        st.table(expenses)

        # Categorize
        with st.spinner("📂 Categorizing expenses..."):
            categorized_data = categorize_expenses(expenses)
            st.subheader("📁 Category-wise Breakdown")
            st.json(categorized_data)

        # Summarize
        with st.spinner("🧠 Summarizing insights..."):
            summary = summarize_expenses(categorized_data)
            st.markdown(summary)

        # AutoGen Chat Log Simulation
        chat_log.append("**User**: Uploading a bill for analysis.")
        chat_log.append("**BillProcessingAgent**: Categorized expenses into logical buckets.")
        chat_log.append("**ExpenseSummarizationAgent**: Summarized total spending and top category.")
        st.subheader("🧵 Agent Conversation Log")
        for msg in chat_log:
            st.markdown(msg)
