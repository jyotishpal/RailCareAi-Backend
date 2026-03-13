from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import sys

# load CLIP model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

image_path = sys.argv[1]

# open image
image = Image.open(image_path)

labels = [
    "dirty train washroom",
    "toilet dirty in train",
    "garbage on train floor",
    "broken train seat",
    "train food problem",
    "train electrical issue",
    "passenger medical emergency",
    "fan not working in train",
]

inputs = processor(
    text=labels,
    images=image,
    return_tensors="pt",
    padding=True
)

outputs = model(**inputs)

logits_per_image = outputs.logits_per_image
probs = logits_per_image.softmax(dim=1)

best_index = probs.argmax().item()

prediction = labels[best_index]

# map department

if "washroom" in prediction or "floor" in prediction:
    department = "cleaning"
    priority = "normal"

elif "seat" in prediction:
    department = "maintenance"
    priority = "medium"

elif "medical" in prediction:
    department = "medical"
    priority = "emergency"

elif "food" in prediction:
    department = "catering"
    priority = "medium"

elif "electrical" in prediction:
    department = "electrical"
    priority = "medium"

else:
    department = "general"
    priority = "normal"

print(prediction + "|" + department + "," + priority)