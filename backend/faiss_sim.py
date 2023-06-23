from sklearn.feature_extraction.text import TfidfVectorizer
import faiss
import numpy as np

def faiss_similarity(base_texts, target_texts):

    vectorizer = TfidfVectorizer().fit(base_texts + target_texts)
    vectors = vectorizer.transform(base_texts + target_texts).toarray()

    # Normalize vectors for cosine similarity
    row_sums = np.linalg.norm(vectors, axis=1)
    vectors = vectors / row_sums[:, np.newaxis]

    base_vectors = vectors[:len(base_texts)]
    target_vectors = vectors[len(base_texts):]

    # Build FAISS index
    dim = vectors.shape[1]  # dimension of vectors
    index = faiss.IndexFlatL2(dim)
    index.add(target_vectors.astype('float32'))

    similarities = []
    for vec in base_vectors:
        D, _ = index.search(np.array([vec]).astype('float32'), len(target_texts))
        similarities.append((0.5 * (1 - D + 1)).tolist()[0])  # Rescale cosine similarity to [0,1]


    return similarities
