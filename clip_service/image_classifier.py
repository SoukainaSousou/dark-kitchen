import torch
import open_clip
from PIL import Image
import io

model, _, preprocess = open_clip.create_model_and_transforms(
    'ViT-B-32', pretrained='laion2b_s34b_b79k'
)
tokenizer = open_clip.get_tokenizer('ViT-B-32')

CATEGORIES = ["burger", "pizza", "tacos", "sandwich", "pasta", "salad"]

def predict_category(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0)

    text_inputs = tokenizer(CATEGORIES)

    with torch.no_grad():
        image_features = model.encode_image(image_input)
        text_features = model.encode_text(text_inputs)
        similarity = (image_features @ text_features.T).softmax(dim=-1)

    return CATEGORIES[similarity.argmax().item()]
