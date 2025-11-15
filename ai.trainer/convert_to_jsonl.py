import json
import os
from datetime import datetime

# ----------------------------------------------------------------------
# CONFIGURATION
# ----------------------------------------------------------------------
DATA_DIR = "../resume-backend/app/data"  # where your text files live
OUTPUT_FILE = "./training_data.jsonl"

# Mapping: file → prompt header (AI training context)
FILE_PROMPTS = {
    "resume.txt": "Generate a professional resume based on the details below.",
    "cover_letter.txt": "Generate a professional cover letter based on the details below.",
    "job_fit.txt": "Analyze the job fit based on the following resume and job description.",
    "linkedin.txt": "Optimize the LinkedIn profile based on the details below.",
    "ats_check.txt": "uploaded resume ats checker data."
}


# ----------------------------------------------------------------------
# HELPERS
# ----------------------------------------------------------------------
def clean_text(text: str) -> str:
    """Removes extra spaces, blank lines, and formats cleanly."""
    text = text.strip().replace("\r", "")
    text = "\n".join(line.strip() for line in text.splitlines() if line.strip())
    return text


def create_jsonl_entry(prompt: str, response: str):
    """Creates a JSON line with metadata for model training."""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "prompt": prompt,
        "response": response
    }


def convert_to_jsonl():
    """Reads all .txt files, converts them into JSONL training format."""
    data = []

    for filename, instruction in FILE_PROMPTS.items():
        path = os.path.join(DATA_DIR, filename)

        if not os.path.exists(path):
            print(f"⚠️ File not found: {filename} (skipped)")
            continue

        with open(path, "r", encoding="utf-8") as f:
            content = f.read().strip()

        if not content:
            print(f"⚠️ Empty file: {filename} (skipped)")
            continue

        # Create prompt-response pair
        prompt = f"{instruction}\n\nInput:\n{clean_text(content)}"
        response = f"{clean_text(content)}"  # You can replace with AI response if needed

        data.append(create_jsonl_entry(prompt, response))
        print(f"✅ Added training entry from {filename}")

    # Save all entries to JSONL file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for entry in data:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    print(f"\n🎯 Successfully created: {OUTPUT_FILE}")
    print(f"🧩 Total training samples: {len(data)}")


# ----------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------
if __name__ == "__main__":
    convert_to_jsonl()
