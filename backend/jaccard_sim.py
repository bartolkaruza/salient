from sklearn.feature_extraction.text import CountVectorizer

def jaccard_similarity(base_texts, target_texts):
    vectorizer = CountVectorizer().fit(base_texts + target_texts)
    vectors = vectorizer.transform(base_texts + target_texts).toarray()

    base_vectors = vectors[:len(base_texts)]
    target_vectors = vectors[len(base_texts):]

    similarities = []
    for bv in base_vectors:
        sim_row = []
        for tv in target_vectors:
            intersection = bv * tv
            union = bv + tv - intersection
            jaccard_sim = intersection.sum() / union.sum()
            sim_row.append(jaccard_sim)
        similarities.append(sim_row)

    return similarities