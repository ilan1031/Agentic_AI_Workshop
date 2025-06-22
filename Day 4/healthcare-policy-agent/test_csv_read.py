import pandas as pd

try:
    df = pd.read_csv("policy_data.csv")
    print("CSV loaded successfully!")
    print(df.head())
except Exception as e:
    print("Error loading CSV:", e)
