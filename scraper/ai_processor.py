import requests
import json
import os
from dotenv import load_dotenv
from database import get_active_tickers

load_dotenv()

API_KEY = os.getenv('AI_API_KEY')
API_URL = os.getenv('AI_BASE_URL')

SYSTEM_PROMPT = """You are a professional crypto market analyst. 
Analyze the provided Telegram message and determine if it impacts the following assets in our watchlist: {tickers}.

Output ONLY a JSON object following this schema:
{{
  "headline": "string (max 100 char, key news point)",
  "summary": "string (max 300 char, concise explanation)",
  "sentiment": "bullish | bearish | neutral",
  "confidence": 0.0-1.0,
  "impact_assets": [
    {{
      "ticker": "string",
      "direction": "bullish | bearish",
      "magnitude": "high | medium | low",
      "rationale": "string (max 150 char)",
      "timeframe": "immediate | short_term | medium_term"
    }}
  ],
  "categories": ["macro", "crypto", "commodities", "geopolitics", "regulatory"],
  "tags": ["fed", "rate_hike", "etc"]
}}

Only include assets in 'impact_assets' if they are explicitly mentioned or strongly implied by the news logic.
If the news is irrelevant to the market or the watchlist, return an empty 'impact_assets' list.
"""

def call_custom_ai(prompt, tickers_list, model="gpt-5.4"):
    tickers_str = ", ".join(tickers_list)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT.format(tickers=tickers_str)},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        # Extract content
        content = result['choices'][0]['message']['content']
        
        # Parse JSON from content (handle potential markdown formatting)
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"Error calling AI: {e}")
        return None

def process_message(text):
    active_tickers = get_active_tickers()
    if not text:
        return None
        
    cleaned_text = text.replace("\n", " ").strip()
    if len(cleaned_text) < 10:
        return None
        
    return call_custom_ai(cleaned_text, active_tickers)

if __name__ == '__main__':
    # Test sederhana
    print("Testing AI Processor...")
    test_msg = "Bitcoin records massive whale accumulation as SEC hints at new Ethereum spot ETF approval process."
    result = process_message(test_msg)
    print(json.dumps(result, indent=2))
