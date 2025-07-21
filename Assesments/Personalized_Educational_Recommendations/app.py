import os
import json
from typing import List, Dict, Any
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew
import google.generativeai as genai
import requests
import streamlit as st
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SERPER_API_KEY = os.getenv("SERPER_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# LangChain-compatible Gemini for CrewAI
gemini_llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.7
)

# Helper Functions
def search_learning_materials(topic: str) -> Dict[str, Any]:
    try:
        url = "https://google.serper.dev/search"
        headers = {"X-API-KEY": SERPER_API_KEY}
        results = {
            "videos": [],
            "articles": [],
            "exercises": []
        }
        queries = {
            "videos": f"{topic} tutorial video",
            "articles": f"{topic} guide article",
            "exercises": f"{topic} practice exercises"
        }

        for key, query in queries.items():
            res = requests.post(url, json={"q": query}, headers=headers).json()
            for r in res.get("organic", [])[:3]:
                results[key].append(f"{r['title']}: {r['link']}")
        return {"topic": topic, **results}
    except Exception as e:
        return {
            "topic": topic,
            "videos": [f"Error: {str(e)}"],
            "articles": [],
            "exercises": []
        }

def generate_quiz_questions(topic: str) -> List[Dict[str, Any]]:
    prompt = f"""Create 3 multiple-choice questions about {topic}. Format:
Question: ...
A) ...
B) ...
C) ...
D) ...
Answer: A/B/C/D"""
    try:
        response = model.generate_content(prompt).text
        questions = []
        blocks = response.split("Question:")
        for block in blocks[1:]:
            lines = [line.strip() for line in block.split("\n") if line.strip()]
            question = lines[0]
            options = [line[3:].strip() for line in lines[1:5]]
            answer_letter = [line for line in lines if line.startswith("Answer:")][0][-1]
            answer_index = ord(answer_letter.upper()) - ord('A')
            questions.append({
                "question": question,
                "options": options,
                "answer": options[answer_index]
            })
        return questions
    except Exception as e:
        return [{"question": f"Error: {str(e)}", "options": [], "answer": ""}]

def suggest_projects(topic: str, level: str) -> List[Dict[str, Any]]:
    prompt = f"""Suggest 3 practical project ideas for a {level} learner about {topic}. Format:
Project: Title
Description: Detailed explanation"""
    try:
        response = model.generate_content(prompt).text
        projects = []
        for block in response.split("Project:")[1:]:
            lines = [l.strip() for l in block.split("\n") if l.strip()]
            title = lines[0]
            desc = next((l.split("Description:",1)[1].strip() for l in lines if "Description:" in l), "No description")
            projects.append({
                "title": title,
                "description": desc,
                "level": level
            })
        return projects
    except Exception as e:
        return [{"title": "Error", "description": str(e), "level": level}]

# Agents
learning_agent = Agent("Learning Material Curator", gemini_llm)
quiz_agent = Agent("Quiz Master", gemini_llm)
project_agent = Agent("Project Mentor", gemini_llm)

# Tasks
def create_learning_task(topic: str):
    return Task(f"Find materials for {topic}", agent=learning_agent)

def create_quiz_task(topic: str):
    return Task(f"Generate quiz for {topic}", agent=quiz_agent)

def create_project_task(topic: str, level: str):
    return Task(f"Suggest projects for {topic} at {level} level", agent=project_agent)

# Orchestration
def generate_learning_path(topic: str, level: str):
    return {
        "learning_materials": search_learning_materials(topic),
        "quiz_questions": generate_quiz_questions(topic),
        "project_ideas": suggest_projects(topic, level)
    }

# Streamlit UI
def main():
    st.set_page_config("🎓 Educational Assistant", "🎓", layout="wide")
    st.title("🎓 Personalized Learning Assistant")
    st.markdown("Create a learning path with materials, quizzes, and projects!")
    st.markdown("---")

    if not GEMINI_API_KEY or not SERPER_API_KEY:
        st.error("Set GEMINI_API_KEY and SERPER_API_KEY in your .env file.")
        return

    col1, col2 = st.columns(2)
    with col1:
        topic = st.text_input("Enter Topic", placeholder="e.g. Machine Learning")
    with col2:
        level = st.selectbox("Skill Level", ["Beginner", "Intermediate", "Advanced"])

    if st.button("🚀 Generate Learning Path"):
        if not topic:
            st.warning("Please enter a topic.")
            return

        with st.spinner("Generating..."):
            result = generate_learning_path(topic, level)

        if result:
            st.success("Done! See results below.")
            tab1, tab2, tab3 = st.tabs(["📚 Materials", "📝 Quiz", "💡 Projects"])

            with tab1:
                lm = result["learning_materials"]
                st.subheader("Videos")
                for item in lm["videos"]: st.markdown(f"• {item}")
                st.subheader("Articles")
                for item in lm["articles"]: st.markdown(f"• {item}")
                st.subheader("Exercises")
                for item in lm["exercises"]: st.markdown(f"• {item}")

            with tab2:
                st.subheader("Quiz")
                for i, q in enumerate(result["quiz_questions"], 1):
                    st.markdown(f"**Q{i}: {q['question']}**")
                    for j, o in enumerate(q['options']):
                        st.write(f"{chr(65+j)}) {o}")
                    st.success(f"✅ Answer: {q['answer']}")
                    st.markdown("---")

            with tab3:
                st.subheader("Project Ideas")
                for i, p in enumerate(result["project_ideas"], 1):
                    st.markdown(f"### {p['title']} ({p['level']})")
                    st.write(p["description"])
                    st.markdown("---")

    st.markdown("---")
    st.markdown("Powered by Gemini + CrewAI + Serper", unsafe_allow_html=True)

if __name__ == "__main__":
    main()
