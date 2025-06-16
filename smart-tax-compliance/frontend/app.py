import streamlit as st
import requests

API = "http://localhost:5000"

st.title("🧾 Smart Tax Compliance Tracker")

if st.button("Run Compliance Check"):
    sample_txns = [{"amount": 10000, "tax": "TDS", "date": "2025-06-15"}]
    r = requests.post(f"{API}/api/compliance", json={"transactions": sample_txns})
    st.json(r.json())

st.subheader("📜 Tax Rules")
rules = requests.get(f"{API}/api/rules").json()
st.json(rules)
