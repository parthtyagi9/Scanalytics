import requests
import random
import time
import dotenv
import os

from dotenv import load_dotenv
load_dotenv()

# --- CONFIGURATION ---
API_URL = "http://127.0.0.1:8000/api/track"
API_KEY = os.getenv("OPENROUTER_API_KEY")

# --- FAKE DATA GENERATOR ---
events = [
    {"name": "video_play", "props": {"title": "Birds 4K", "duration": 300, "user_type": "free"}},
    {"name": "video_play", "props": {"title": "Mouse Hunt", "duration": 120, "user_type": "premium"}},
    {"name": "video_play", "props": {"title": "Birds 4K", "duration": 10, "user_type": "free"}}, # Short watch
    {"name": "subscription", "props": {"plan": "premium", "price": 9.99, "currency": "USD"}},
    {"name": "error", "props": {"code": 500, "message": "Server crash", "browser": "Chrome"}},
    {"name": "click", "props": {"button": "signup_header", "screen": "homepage"}},
]

print(f"Sending 30 fake events to {API_URL}...")

for i in range(30):
    event = random.choice(events)
    payload = {
        "event_name": event["name"],
        "properties": event["props"]
    }
    
    try:
        r = requests.post(
            API_URL, 
            json=payload, 
            headers={"x-api-key": API_KEY}
        )
        if r.status_code == 200:
            print(f"[{i+1}/30] Sent {event['name']}")
        else:
            print(f"[{i+1}/30] Failed: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

print("\n✨ Data Seeding Complete!")