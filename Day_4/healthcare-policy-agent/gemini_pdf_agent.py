import streamlit as st
import google.generativeai as genai
from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import tempfile
import base64

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key="AIzaSyCSL5lhUQmXGEpKgqCm2AWqz1yUzMGg3J8")
model = genai.GenerativeModel('models/gemini-1.5-flash-latest')

# Initialize session state
def init_session():
    if "history" not in st.session_state:
        st.session_state.history = []
    if "user_profile" not in st.session_state:
        st.session_state.user_profile = {
            "age": 30,
            "family_type": "Individual",
            "dependents": 0,
            "requirements": []
        }
    if "policy_data" not in st.session_state:
        st.session_state.policy_data = None
    if "user_query" not in st.session_state:
        st.session_state.user_query = ""

# Extract text from PDF using Gemini Vision
def extract_policy_data(pdf_path):
    images = []
    with tempfile.TemporaryDirectory() as temp_dir:
        images = convert_from_path(pdf_path, output_folder=temp_dir)
        policy_text = ""
        for i, image in enumerate(images):
            image_path = os.path.join(temp_dir, f"page_{i+1}.jpg")
            image.save(image_path, "JPEG")
            with open(image_path, "rb") as img_file:
                img_data = base64.b64encode(img_file.read()).decode("utf-8")
            response = model.generate_content([
                "Extract all insurance policy details from this document image. "
                "Include policy name, age range, family type, max dependents, "
                "special features (senior health, wellness support, dental care), "
                "premium, and description. Format as JSON.",
                {"mime_type": "image/jpeg", "data": img_data}
            ])
            policy_text += response.text + "\n\n"
    return policy_text

# Load policy data
def load_policy_data():
    if st.session_state.policy_data is None:
        with st.spinner("Reading policy document..."):
            pdf_path = "src/policy_details.pdf.crdownload"
            try:
                reader = PdfReader(pdf_path)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                st.session_state.policy_data = text
            except:
                st.session_state.policy_data = extract_policy_data(pdf_path)

# Generate system prompt
def get_system_prompt():
    policy_context = st.session_state.policy_data or "No policy data available"
    return f"""
    You are a Healthcare Policy Advisor agent. Your role is to:
    1. Recommend suitable insurance policies based on user profiles
    2. Answer questions about healthcare policies
    3. Maintain professional and helpful tone

    Policy Document:
    {policy_context}

    Guidelines:
    - Always consider user's profile: age, family type, dependents, requirements
    - For policy questions, respond with specific policy names and details
    - When recommending, suggest 1-3 most suitable policies with reasons
    - Format responses clearly with bullet points and section headers
    - If asked about non-healthcare topics, politely decline
    - Always verify policy features against the document
    - For cost questions, mention premiums but note they're estimates
    - When showing multiple options, compare key features
    """

# Process user query with Gemini
def process_query(user_query):
    system_prompt = get_system_prompt()
    profile = st.session_state.user_profile
    profile_context = (
        f"## User Profile\n"
        f"- Age: {profile['age']}\n"
        f"- Coverage Type: {profile['family_type']}\n"
        f"- Dependents: {profile['dependents']}\n"
        f"- Special Requirements: {', '.join(profile['requirements']) or 'None'}\n"
    )
    history_context = "## Conversation History\n"
    for msg in st.session_state.history[-6:]:
        role = "User" if msg["role"] == "user" else "Assistant"
        history_context += f"{role}: {msg['content']}\n"
    full_prompt = (
        f"{system_prompt}\n\n"
        f"{profile_context}\n\n"
        f"{history_context}\n\n"
        f"## New Query\n{user_query}\n\n"
        f"## Assistant Response\n"
    )
    response = model.generate_content(full_prompt)
    return response.text

# Main application
def main():
    st.set_page_config(
        page_title="Healthcare Policy Advisor",
        page_icon="🏥",
        layout="centered",
        initial_sidebar_state="expanded"
    )
    
    init_session()
    load_policy_data()
    
    # Custom styling
    st.markdown("""
    <style>
        .stChatInput {background-color: #f0f2f6;}
        .stTextInput input {border-radius: 20px;}
        .stButton button {border-radius: 10px; background-color: #4CAF50; color: white;}
        .sidebar .sidebar-content {background-color: #f8f9fa;}
        .stSelectbox, .stSlider, .stRadio > div {margin-bottom: 15px;}
        .stAlert {border-radius: 10px;}
    </style>
    """, unsafe_allow_html=True)
    
    # Header
    st.title("🏥 Healthcare Policy Advisor")
    st.caption("AI-powered insurance recommendations based on your profile")
    
    # Sidebar - Profile
    with st.sidebar:
        st.header("👤 Your Profile")
        st.session_state.user_profile['age'] = st.slider("Your Age", 18, 100, 30)
        st.session_state.user_profile['family_type'] = st.radio("Coverage Type", ["Individual", "Family"])
        if st.session_state.user_profile['family_type'] == "Family":
            st.session_state.user_profile['dependents'] = st.number_input("Number of Dependents", 1, 10, 2)
        else:
            st.session_state.user_profile['dependents'] = 0
        st.session_state.user_profile['requirements'] = st.multiselect(
            "Special Requirements:",
            ["Senior Health", "Wellness Support", "Dental Care", "Maternity", "Chronic Condition"]
        )
        st.divider()
        st.subheader("Policy Document")
        with st.expander("View Policy Summary"):
            if st.session_state.policy_data:
                st.write(st.session_state.policy_data[:2000] + "...")
            else:
                st.warning("No policy data loaded")
        st.info("Profile updates will apply to future recommendations")
    
    # Chat area
    st.subheader("Policy Consultation")
    st.write("Ask about available policies, coverage details, or get personalized recommendations")
    
    for message in st.session_state.history:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Handle input from user or buttons
    user_query = st.chat_input("Ask about healthcare policies...")

    if st.session_state.user_query:
        user_query = st.session_state.user_query
        st.session_state.user_query = ""  # Reset after use

    if user_query:
        st.session_state.history.append({"role": "user", "content": user_query})
        with st.chat_message("user"):
            st.markdown(user_query)
        with st.chat_message("assistant"):
            with st.spinner("Analyzing policies..."):
                response = process_query(user_query)
            st.markdown(response)
        st.session_state.history.append({"role": "assistant", "content": response})
    
    # Action buttons
    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("🔄 New Conversation", use_container_width=True):
            st.session_state.history = []
            st.session_state.user_query = ""
            st.rerun()
    with col2:
        if st.button("📋 Get Recommendations", use_container_width=True):
            st.session_state.user_query = "Recommend suitable policies based on my profile"
            st.rerun()
    with col3:
        if st.button("📄 View Policy Details", use_container_width=True):
            st.session_state.user_query = "List all available policies with their key features"
            st.rerun()

if __name__ == "__main__":
    main()
