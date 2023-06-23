from flask import Flask, request
from sklearn_sim import sklearn_similarity
from faiss_sim import faiss_similarity
from jaccard_sim import jaccard_similarity
from bert_sim import bert_similarity
from ensemble_sim import ensemble_similarity

app = Flask(__name__)

@app.route('/sklearn_similarity', methods=['POST'])
def sklearn_handler():
    data = request.get_json()
    base_texts = data['base_texts']
    target_texts = data['target_texts']
    similarities = sklearn_similarity(base_texts, target_texts)
    return {'similarities': similarities}

@app.route('/faiss_similarity', methods=['POST'])
def fais_handler():
    data = request.get_json()
    base_texts = data['base_texts']
    target_texts = data['target_texts']
    similarities = faiss_similarity(base_texts, target_texts)
    return {'similarities': similarities}

@app.route('/jaccard_similarity', methods=['POST'])
def jaccard_handler():
    data = request.get_json()
    base_texts = data['base_texts']
    target_texts = data['target_texts']
    similarities = jaccard_similarity(base_texts, target_texts)
    return {'similarities': similarities}

@app.route('/bert_similarity', methods=['POST'])
def bert_handler():
    data = request.get_json()
    base_texts = data['base_texts']
    target_texts = data['target_texts']
    similarities = bert_similarity(base_texts, target_texts)
    return {'similarities': similarities}

@app.route('/ensemble_similarity', methods=['POST'])
def ensemble_handler():
    data = request.get_json()
    base_texts = data['base_texts']
    target_texts = data['target_texts']
    similarities = ensemble_similarity(base_texts, target_texts)
    return {'similarities': similarities}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005)
