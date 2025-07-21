
# 🚛 Logistics Optimization Crew AI System

A two-agent AI system built using **LangChain CrewAI** and **Streamlit**, designed to analyze logistics inefficiencies and generate actionable optimization strategies for delivery routes or inventory management.

> ⚙️ Powered by Google Gemini Pro via LangChain
> 🧠 Agents: `Logistics Analyst`, `Optimization Strategist`
> 📦 Focus: Route Efficiency • Inventory Turnover • Logistics Optimization

---

## 📌 Project Overview

This application simulates a realistic Crew AI environment with specialized agents to:

* **Analyze logistics operations**
* **Detect inefficiencies in routes or inventory**
* **Generate optimization strategies based on product input**

The system is interactive and runs via a modern Streamlit interface.

---

## 🧠 AI Agent Roles

### 🧾 Logistics Analyst

* **Role:** Researches inefficiencies in logistics for the given products
* **Backstory:** A senior logistics specialist skilled in operations, delays, and supply chain metrics

### 🧠 Optimization Strategist

* **Role:** Creates a data-driven optimization plan using insights from the analyst
* **Backstory:** An expert in AI-based supply chain optimization and route planning

---

## 📺 User Interface

Built with **Streamlit**, the UI allows:

* Inputting a comma-separated product list
* Triggering Crew AI execution
* Viewing final strategy & agent output in real time

![Streamlit UI Demo - Logistics Crew AI](https://dummyimage.com/800x400/cccccc/000000\&text=Streamlit+Logistics+AI+UI+Demo)

---

## 🚀 How It Works

1. **Input Products:** Enter a list of products or delivery areas
2. **Kickoff Agents:** The Logistics Analyst performs analysis
3. **Strategize:** The Optimization Strategist generates the plan
4. **Result:** A structured optimization strategy is displayed

---

## 🛠️ Setup Instructions

### 1. Clone this repository

```bash
git clone https://github.com/your-username/logistics-crew-ai.git
cd logistics-crew-ai
```

### 2. Install dependencies

Create a virtual environment and install:

```bash
pip install -r requirements.txt
```

> ✅ Requires Python 3.9+

### 3. Set up your `.env`

Create a `.env` file with your [Google Gemini API Key](https://makersuite.google.com/app):

```
GOOGLE_API_KEY=your_gemini_api_key
```

---

## 📦 `requirements.txt`

```
streamlit
python-dotenv
langchain
langchain-google-genai
crewai
```

---

## 🖥️ Run the App

```bash
streamlit run app.py
```

Open the URL in your browser (usually `http://localhost:8501`)

---

## 🧪 Example Input

```
Product A, Product B, Product C
```

## ✅ Sample Output

```
📦 Identified route inefficiencies for Product A and B in Zone 3
🚛 Recommended dynamic routing with AI-based scheduling
📈 Projected inventory turnover improved by 17%
```

---

## 💡 Future Enhancements

* PDF/CSV data ingestion for real logistics data
* Export results to Excel/CSV
* LangGraph pipeline for state tracing
* Multi-agent dashboards
* Cost estimation module

---

## 🧑‍💻 Author

Built by \[ilanthalir]
Powered by LangChain + Gemini Pro + CrewAI + Streamlit


