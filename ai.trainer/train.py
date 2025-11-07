import os
import json
import torch
from torch.utils.data import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model

# ----------------------------------------------------------------------
# CONFIG
# ----------------------------------------------------------------------
BASE_MODEL_PATH = "gpt2"  # 🧠 Hugging Face GPT-2 model (downloads automatically)
TRAINING_FILE = "./training_data.jsonl"
OUTPUT_DIR = "./outputs_gpt2"
LORA_OUTPUT_DIR = "./ai_resume_model_lora"

# Optional: remove Apple MPS memory cap
os.environ["PYTORCH_MPS_HIGH_WATERMARK_RATIO"] = "0.0"

# Detect device
device = "mps" if torch.backends.mps.is_available() else (
    "cuda" if torch.cuda.is_available() else "cpu"
)
print(f"⚙️ Using device: {device}")

# ----------------------------------------------------------------------
# LOAD TOKENIZER & MODEL
# ----------------------------------------------------------------------
print("🔹 Loading GPT-2 tokenizer and model...")
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_PATH)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(BASE_MODEL_PATH, device_map={"": "cpu"})

if device == "mps":
    model.config.use_cache = True
    torch.set_default_dtype(torch.float32)
else:
    model.config.use_cache = True

# ----------------------------------------------------------------------
# LORA CONFIGURATION (✅ GPT-2 specific layers)
# ----------------------------------------------------------------------
lora_config = LoraConfig(
    r=4,
    lora_alpha=8,
    target_modules=[
        "attn.c_attn",   # attention projection
        "attn.c_proj",   # attention output
        "mlp.c_fc",      # feed-forward layer 1
        "mlp.c_proj",    # feed-forward layer 2
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)

if device == "mps":
    try:
        model.to(torch.device("mps"))
        print("Moved model to MPS.")
    except Exception as e:
        print("⚠️ Could not move model to MPS:", e)

# ----------------------------------------------------------------------
# LOAD JSONL DATA
# ----------------------------------------------------------------------
def load_jsonl(path):
    data = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                try:
                    obj = json.loads(line)
                    text = f"### Instruction:\n{obj.get('prompt','')}\n\n### Response:\n{obj.get('response','')}"
                    data.append(text)
                except Exception as e:
                    print(f"⚠️ Skipping bad line: {e}")
    return data

texts = load_jsonl(TRAINING_FILE)
print(f"✅ Loaded {len(texts)} samples from {TRAINING_FILE}")

# ----------------------------------------------------------------------
# DATASET
# ----------------------------------------------------------------------
class TextDataset(Dataset):
    def __init__(self, texts, tokenizer, max_length=256):
        self.enc = tokenizer(
            texts,
            truncation=True,
            padding="max_length",
            max_length=max_length,
            return_tensors="pt",
        )

    def __len__(self):
        return len(self.enc["input_ids"])

    def __getitem__(self, idx):
        return {
            "input_ids": self.enc["input_ids"][idx],
            "attention_mask": self.enc["attention_mask"][idx],
            "labels": self.enc["input_ids"][idx],
        }

dataset = TextDataset(texts, tokenizer)
print(f"🧩 Dataset ready with {len(dataset)} samples.")

# ----------------------------------------------------------------------
# TRAINING CONFIG
# ----------------------------------------------------------------------
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=1,
    num_train_epochs=1,
    gradient_accumulation_steps=2,
    learning_rate=2e-4,
    logging_steps=5,
    save_total_limit=1,
    fp16=False,
    report_to="none",
    max_steps=20,  # 🧪 quick test; remove for full training
)

trainer = Trainer(model=model, args=training_args, train_dataset=dataset)

# ----------------------------------------------------------------------
# TRAIN
# ----------------------------------------------------------------------
print("🚀 Starting GPT-2 LoRA fine-tuning...")
try:
    trainer.train()
except RuntimeError as e:
    print("⚠️ Training stopped early:", e)

print("✅ Training completed!")

# ----------------------------------------------------------------------
# SAVE LORA ADAPTER
# ----------------------------------------------------------------------
os.makedirs(LORA_OUTPUT_DIR, exist_ok=True)

adapter_state = {}
for name, param in model.named_parameters():
    if param.requires_grad and param.device.type != "meta":
        adapter_state[name] = param.detach().cpu().clone()

adapter_path = os.path.join(LORA_OUTPUT_DIR, "adapter_state.pt")
torch.save(adapter_state, adapter_path)
print(f"💾 LoRA adapter saved to {adapter_path}")

tokenizer.save_pretrained(LORA_OUTPUT_DIR)
print(f"✅ Tokenizer saved to {LORA_OUTPUT_DIR}")