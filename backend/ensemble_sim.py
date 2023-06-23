import numpy as np
from faiss_sim import faiss_similarity
from jaccard_sim import jaccard_similarity
from sklearn_sim import sklearn_similarity
# from bert_sim import bert_similarity

def ensemble_similarity(base_texts, target_texts):
    # Get similarity matrices from different methods
    faiss_sim = np.array(faiss_similarity(base_texts, target_texts))
    jaccard_sim = np.array(jaccard_similarity(base_texts, target_texts))
    sklearn_sim = np.array(sklearn_similarity(base_texts, target_texts))
    # bert_sim = np.array(bert_similarity(base_texts, target_texts))

    # Average the similarity matrices
    avg_sim = (faiss_sim + jaccard_sim + sklearn_sim) / 3  

    return avg_sim.tolist()