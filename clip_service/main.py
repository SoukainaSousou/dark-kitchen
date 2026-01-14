# CORRECTION du fichier main.py pour FastAPI
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import open_clip
from PIL import Image
import io
import logging

# Configuration logging
logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

# CORS - TRÈS IMPORTANT
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variables globales pour le modèle
model = None
preprocess = None
tokenizer = None
CATEGORIES = ["burger", "pizza", "tacos", "sandwich", "pasta", "salad"]

def load_model():
    global model, preprocess, tokenizer
    if model is None:
        try:
            print("Chargement du modèle CLIP...")
            # NOTE: Utilise 'openai' si 'laion2b_s34b_b79k' ne marche pas
            model, _, preprocess = open_clip.create_model_and_transforms(
                'ViT-B-32', 
                pretrained='openai'  # ou 'laion2b_s34b_b79k'
            )
            tokenizer = open_clip.get_tokenizer('ViT-B-32')
            model.eval()
            print("Modèle CLIP chargé avec succès!")
        except Exception as e:
            print(f"Erreur chargement modèle: {e}")
            raise

@app.post("/detect-category")
async def detect_category(image: UploadFile = File(...)):
    try:
        # 1. Charger le modèle
        load_model()
        
        # 2. Lire l'image
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Image vide")
        
        # 3. Ouvrir l'image
        image_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # 4. Préparer les inputs
        image_input = preprocess(image_pil).unsqueeze(0)
        
        # 5. Tokenizer les catégories
        text_inputs = tokenizer(CATEGORIES)
        
        # 6. Calculer les similarités
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            text_features = model.encode_text(text_inputs)
            similarity = (image_features @ text_features.T).softmax(dim=-1)
        
        # 7. Trouver la catégorie
        category_idx = similarity.argmax().item()
        detected_category = CATEGORIES[category_idx]
        confidence = similarity[0][category_idx].item()
        
        print(f"Catégorie détectée: {detected_category} (confiance: {confidence:.2%})")
        
        return {
            "detected_category": detected_category,
            "confidence": confidence
        }
        
    except Exception as e:
        print(f"Erreur lors de la prédiction: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur de prédiction: {str(e)}")

# Endpoint de test
@app.get("/")
async def root():
    return {"message": "FastAPI image classifier is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)