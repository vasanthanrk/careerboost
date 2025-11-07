import json
import os
from datetime import datetime

LOG_FILE_PATH = "app/data/"

# requirement_type = resume, cover_letter, job_fit, linkedin
def save_ai_interaction(user, prompt: str, response: str, requirement_type:str, model_name: str = "gpt-5"):
    """
    Save user prompt + AI response pair to JSON file for dataset collection.
    """
    log_entry = (
        f"\n------------------------------------------\n"
        f"timestamp: {datetime.utcnow().isoformat()}\n"
        f"user_id: {user.id}\n"
        f"user_email: {user.email}\n"
        f"model: {model_name}\n"
        f"prompt:\n{prompt.strip()}\n"
        f"response:\n{response.strip()}\n"
    )

    # Ensure folder exists
    os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

    full_path = os.path.join(LOG_FILE_PATH, f"{requirement_type}.txt")
    # Read current logs
    if os.path.exists(full_path):
        with open(full_path, "a", encoding="utf-8") as f:
            f.write(log_entry)