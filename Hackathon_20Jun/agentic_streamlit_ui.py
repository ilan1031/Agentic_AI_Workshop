
import streamlit as st
import requests
import json

FASTAPI_BASE = "http://localhost:8000"

st.set_page_config(page_title="Reconciliation Agent UI", layout="centered")
st.title("🧾 Agentic Reconciliation System")
st.subheader("Upload, Match, Categorize, Reconcile Transactions")

st.markdown("---")

# Upload CSV file
st.header("1. Upload Transactions")
uploaded_file = st.file_uploader("Upload CSV or JSON", type=["csv", "json"])

if uploaded_file:
    files = {"file": uploaded_file.getvalue()}
    res = requests.post(f"{FASTAPI_BASE}/extract-transactions", files={"file": uploaded_file})
    if res.ok:
        transactions = res.json().get("transactions", [])
        st.success("Transactions extracted successfully")
        st.json(transactions)
    else:
        st.error("Failed to extract transactions")

st.markdown("---")

# Match invoices
st.header("2. Match Invoices")
match_data = st.text_area("Paste Transaction JSON for Matching", height=200)
if st.button("Run Matcher"):
    try:
        txns = json.loads(match_data)
        res = requests.post(f"{FASTAPI_BASE}/match-invoices", json={"transactions": txns})
        if res.ok:
            st.success("Matching complete")
            st.json(res.json())
        else:
            st.error("Matching failed")
    except Exception as e:
        st.error(f"Invalid JSON or error: {e}")

st.markdown("---")

# Categorize
st.header("3. Categorize Transactions")
cat_data = st.text_area("Paste Transaction JSON for Categorization", height=200)
if st.button("Run Categorizer"):
    try:
        txns = json.loads(cat_data)
        res = requests.post(f"{FASTAPI_BASE}/categorize", json={"transactions": txns})
        if res.ok:
            st.success("Categorization complete")
            st.json(res.json())
        else:
            st.error("Categorization failed")
    except Exception as e:
        st.error(f"Invalid JSON or error: {e}")

st.markdown("---")

# Discrepancy detection
st.header("4. Detect Discrepancies")
disc_data = st.text_area("Paste Transaction JSON for Discrepancy Detection", height=200)
if st.button("Run Discrepancy Detector"):
    try:
        txns = json.loads(disc_data)
        res = requests.post(f"{FASTAPI_BASE}/detect-discrepancies", json={"transactions": txns})
        if res.ok:
            st.success("Discrepancy detection complete")
            st.json(res.json())
        else:
            st.error("Detection failed")
    except Exception as e:
        st.error(f"Invalid JSON or error: {e}")

st.markdown("---")

# Final reconciliation
st.header("5. Final Reconciliation")
recon_data = st.text_area("Paste Final Transaction JSON for Approval", height=200)
if st.button("Run Reconciliation Approver"):
    try:
        txns = json.loads(recon_data)
        res = requests.post(f"{FASTAPI_BASE}/reconcile", json={"transactions": txns})
        if res.ok:
            st.success("Final Reconciliation complete")
            st.json(res.json())
        else:
            st.error("Approval failed")
    except Exception as e:
        st.error(f"Invalid JSON or error: {e}")

st.markdown("---")

# Full pipeline
st.header("6. Full Reconciliation Workflow")
full_file = st.file_uploader("Upload CSV or JSON for Full Workflow", key="full")
if full_file and st.button("Run Full Workflow"):
    res = requests.post(f"{FASTAPI_BASE}/full-reconciliation", files={"file": full_file})
    if res.ok:
        st.success("Full reconciliation complete")
        st.json(res.json())
    else:
        st.error("Full reconciliation failed")
