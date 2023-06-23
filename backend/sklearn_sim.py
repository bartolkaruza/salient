from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def sklearn_similarity(base_texts, target_texts):
    vectorizer = TfidfVectorizer().fit_transform(base_texts + target_texts)
    vectors = vectorizer.toarray()

    base_vectors = vectors[:len(base_texts)]
    target_vectors = vectors[len(base_texts):]

    similarities = cosine_similarity(base_vectors, target_vectors)
    return similarities.tolist()