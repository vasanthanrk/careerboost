import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os

# ----------------------------------------------------------------------
# CONFIG
# ----------------------------------------------------------------------
BASE_MODEL_PATH = "gpt2"  # or "./ai_resume_model_gpt2" if downloaded locally
LORA_ADAPTER_PATH = "./ai_resume_model_lora/adapter_state.pt"

device = "mps" if torch.backends.mps.is_available() else (
    "cuda" if torch.cuda.is_available() else "cpu"
)
print(f"⚙️ Using device: {device}")

# ----------------------------------------------------------------------
# LOAD BASE MODEL + TOKENIZER
# ----------------------------------------------------------------------
print("🔹 Loading base GPT-2 model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_PATH)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(BASE_MODEL_PATH)
model.to(device)

# ----------------------------------------------------------------------
# LOAD LoRA ADAPTER STATE
# ----------------------------------------------------------------------
if os.path.exists(LORA_ADAPTER_PATH):
    adapter_state = torch.load(LORA_ADAPTER_PATH, map_location="cpu")
    print(f"✅ Loaded LoRA adapter weights from {LORA_ADAPTER_PATH}")

    # Merge LoRA weights into model (non-strict to ignore base-only keys)
    missing, unexpected = model.load_state_dict(adapter_state, strict=False)
    print(f"ℹ️ Missing keys: {len(missing)}, Unexpected keys: {len(unexpected)}")
else:
    print(f"⚠️ No adapter found at {LORA_ADAPTER_PATH} — running base GPT-2.")

# ----------------------------------------------------------------------
# GENERATION FUNCTION
# ----------------------------------------------------------------------
def generate_text(prompt: str, max_new_tokens=80, temperature=0.8, top_p=0.9):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
        )
    text = tokenizer.decode(output[0], skip_special_tokens=True)
    return text

# ----------------------------------------------------------------------
# SAMPLE PROMPTS
# ----------------------------------------------------------------------
prompts = [
    "Write a short professional summary for a Senior Software Engineer.",
    "Generate a cover letter for a data scientist applying to Google.",
    "Give 3 bullet points describing leadership skills.",
]

print("\n🧠 Generating samples...\n")
for i, p in enumerate(prompts, 1):
    print(f"Prompt {i}: {p}")
    result = generate_text(p)
    print(f"Output:\n{result}\n{'-'*80}\n")
