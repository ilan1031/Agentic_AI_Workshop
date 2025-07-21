# 🧠 Smart Competitor AI Agent

This is a conversational AI agent built with **LangChain**, **Gemini 1.5 Flash**, **LangGraph**, and **Streamlit**. It helps business owners analyze nearby clothing store competitors by generating actionable insights like:

* Footfall trends
* Peak business hours
* Location-based recommendations

It uses real-time web search and LLM reasoning to build a report for competitive intelligence.

---

## 📌 Features

* 🏬 **Competitor Detection** in a target location (e.g., "Koramangala, Bangalore")
* 📈 **Live Footfall Analysis** and busiest hours via AI reasoning
* 🔍 **Search-integrated Tool** to retrieve real-time data using DuckDuckGo
* 💬 **Conversational Interface** powered by LangChain Agent
* 🧠 **Gemini 1.5 Flash** as the LLM backbone (free-tier model)
* 🕸️ **LangGraph Pipeline** for modular and trackable flow
* 🎨 **Modern UI with Streamlit** (single file app)

---

## 📁 File Structure

```
smart_content_creation/
│
├── app.py                # Streamlit app with LangChain + LangGraph pipeline
├── README.md             # This file
├── requirements.txt      # Python dependencies
└── .env                  # Your API key for Gemini (Not committed!)
```

---

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart_content_creation
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Your Gemini API Key

Create a `.env` file in the root:

```
GEMINI_API_KEY=your-gemini-api-key
```

> ⚠️ Do not share or commit your API key!

### 4. Run the App

```bash
streamlit run app.py
```

---

## ⚙️ How It Works

### Agent Components

* **LangChain AgentExecutor** with `create_tool_calling_agent`
* **Custom Tools**

  * `get_weather_info(city: str)` → Returns dummy weather context
  * `search_top_competitors(location: str)` → Uses DuckDuckGo to get info
* **LangGraph Flow**

  * Node 1: Tool selector
  * Node 2: LLM response generator
  * Node 3: Final response with reasoning

### Streamlit UI

* Text input for location (e.g., "MG Road Bangalore")
* Agent output displayed as real-time response
* Responsive layout using `st.columns` and `st.chat_message`

---

## 🧪 Example Query

> "Tell me the busiest time for clothing stores in Indiranagar Bangalore"

👨‍💼 Output:

* **Competitors found:** FabIndia, Westside, H\&M
* **Peak hours:** 5 PM - 9 PM (from Google reviews & web snippets)
* **Strategy tip:** Offer in-store discounts from 4 PM to 6 PM

---

## 🧠 Powered By

* **LLM**: Gemini 1.5 Flash (Free-tier via API)
* **LangChain**: Agent, tools, chains
* **LangGraph**: Modular orchestration
* **Streamlit**: Fast frontend interface
* **DuckDuckGo**: Real-time web search integration

---

## 🔐 Security

* `.env` and API keys are ignored by `.gitignore`
* All user inputs are sanitized before processing

---

## 📌 Use Cases

* Retail footfall prediction
* Competitor benchmarking
* Business location planning
* Peak-hour promotions planning

---

## 📬 Contact

For custom deployments, API support, or new feature requests, please reach out via GitHub issues or email.
