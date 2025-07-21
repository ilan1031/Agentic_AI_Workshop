import streamlit as st
from PyPDF2 import PdfReader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
import json, re, os
from dotenv import load_dotenv

# Load API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    st.error("Missing GEMINI_API_KEY. Please set it in your .env file.")
    st.stop()

# LangChain Gemini model
model = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    api_key=GEMINI_API_KEY,
    temperature=0.3,
    max_output_tokens=2048
)

# Streamlit setup
st.set_page_config(page_title="Study Assistant", page_icon="📚", layout="wide")
st.title("📚 AI Study Assistant")
st.caption("Summarize your PDFs and generate interactive quizzes!")

# ---------- Utility Functions ----------

def extract_pdf_text(file):
    """Extracts all text from uploaded PDF."""
    reader = PdfReader(file)
    return "\n".join(p.extract_text() or "" for p in reader.pages)

def summarize_material(text: str) -> str:
    """Uses Gemini to generate a bullet-point summary."""
    prompt_template = """
    Summarize the following study material into clear bullet points.
    - Focus on 10-15 key concepts
    - Use academic tone
    - Limit to 1-2 sentences per point

    Study Material:
    {text}

    Bullet Point Summary:
    """
    prompt = ChatPromptTemplate.from_template(prompt_template)
    chain = {"text": RunnablePassthrough()} | prompt | model | StrOutputParser()
    return chain.invoke(text)

def generate_quiz(summary: str) -> dict:
    """Generates MCQs from the summary in JSON format."""
    quiz_template = """
    Based on this summary, generate 5 multiple choice questions.
    - Each question should have 4 options (A-D)
    - One correct answer per question
    - Return a valid JSON like this:
    {{
        "questions": [
            {{
                "question": "...",
                "options": {{
                    "A": "...", "B": "...", "C": "...", "D": "..."
                }},
                "correct_answer": "A"
            }}
        ]
    }}

    Summary:
    {summary}
    """
    prompt = ChatPromptTemplate.from_template(quiz_template)
    chain = {"summary": RunnablePassthrough()} | prompt | model | StrOutputParser()
    result = chain.invoke(summary)

    try:
        result = re.sub(r"```json|```", "", result).strip()
        return json.loads(result)
    except json.JSONDecodeError:
        st.error("❌ Failed to parse quiz JSON. Try again.")
        st.text(result)
        return {"questions": []}

# ---------- Session State ----------
state_defaults = {
    "quiz_data": {},
    "user_answers": {},
    "submitted": False,
    "processed_file": None,
    "summary": ""
}
for key, default in state_defaults.items():
    if key not in st.session_state:
        st.session_state[key] = default

# ---------- Upload + Processing ----------
uploaded_file = st.file_uploader("Upload a PDF", type="pdf")

if uploaded_file:
    if st.session_state.processed_file != uploaded_file.name:
        # Reset state for new file
        for key in ["quiz_data", "user_answers", "submitted", "summary"]:
            st.session_state[key] = state_defaults[key]
        st.session_state.processed_file = uploaded_file.name

    if not st.session_state.summary:
        with st.spinner("📖 Extracting content..."):
            raw_text = extract_pdf_text(uploaded_file)

        if not raw_text.strip():
            st.error("PDF extraction failed. Try a different file.")
            st.stop()

        with st.spinner("✍️ Generating summary..."):
            st.session_state.summary = summarize_material(raw_text)

    st.subheader("📝 Summary")
    st.markdown(st.session_state.summary)

    if not st.session_state.quiz_data:
        with st.spinner("🧠 Generating quiz..."):
            st.session_state.quiz_data = generate_quiz(st.session_state.summary)

    # ---------- Quiz Section ----------
    quiz = st.session_state.quiz_data.get("questions", [])
    if quiz:
        st.subheader("❓ Interactive Quiz")
        st.caption("Test your understanding of the summarized content")

        with st.form("quiz_form"):
            for i, q in enumerate(quiz):
                st.markdown(f"**Q{i+1}:** {q['question']}")
                choice = st.radio(
                    "Select an answer:",
                    options=["A", "B", "C", "D"],
                    format_func=lambda opt: f"{opt}) {q['options'][opt]}",
                    key=f"q{i}",
                    index=None
                )
                st.session_state.user_answers[i] = choice
                st.divider()

            if st.form_submit_button("Submit Answers"):
                st.session_state.submitted = True

        if st.session_state.submitted:
            st.subheader("📊 Results")
            score = 0

            for i, q in enumerate(quiz):
                user = st.session_state.user_answers.get(i)
                correct = q["correct_answer"]

                if user == correct:
                    st.success(f"Q{i+1}: ✅ Correct! ({user})")
                    score += 1
                else:
                    st.error(f"Q{i+1}: ❌ Incorrect (Your answer: {user}, Correct: {correct})")

                with st.expander(f"Explanation Q{i+1}"):
                    st.markdown(f"**{q['question']}**")
                    for opt, txt in q['options'].items():
                        symbol = "✓" if opt == correct else "•"
                        st.markdown(f"{symbol} **{opt}:** {txt}")

            st.success(f"🎯 Score: {score}/{len(quiz)} ({(score/len(quiz))*100:.0f}%)")

            if st.button("🔄 Retake Quiz"):
                st.session_state.submitted = False
                st.session_state.user_answers = {}
                st.rerun()

    st.caption(f"📁 File: {uploaded_file.name}")
