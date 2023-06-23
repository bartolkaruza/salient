from flask import Flask, request
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

app = Flask(__name__)

@app.route('/similarity', methods=['POST'])
def similarity():
    data = request.get_json()
    base_texts = data['base_texts']
    target_texts = data['target_texts']

    vectorizer = TfidfVectorizer().fit_transform(base_texts + target_texts)
    vectors = vectorizer.toarray()

    base_vectors = vectors[:len(base_texts)]
    target_vectors = vectors[len(base_texts):]

    similarities = cosine_similarity(base_vectors, target_vectors)
    max_similarities = np.max(similarities, axis=0)

    return {'similarities': max_similarities.tolist()}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005)