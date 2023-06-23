from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

def bert_similarity(base_texts, target_texts):
    model = SentenceTransformer('all-MiniLM-L6-v2')  # Pretrained model
    
    base_embeddings = model.encode(base_texts)
    target_embeddings = model.encode(target_texts)

    similarities = cosine_similarity(base_embeddings, target_embeddings)
    
    return similarities.tolist()