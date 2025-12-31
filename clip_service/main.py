from fastapi import FastAPI, File, UploadFile
from image_classifier import predict_category

app = FastAPI()

@app.post("/detect-category")
async def detect_category(image: UploadFile = File(...)):
    image_bytes = await image.read()
    category = predict_category(image_bytes)
    return { "detected_category": category }
