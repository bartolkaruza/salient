from flask import Flask, request
from flask_cors import CORS, cross_origin
from ensemble_sim import ensemble_similarity

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

similarity_threshold = 0.2

def score_filter(timeline_tweet_similarity_scores):
    return all([score < similarity_threshold for score in timeline_tweet_similarity_scores])


# This endpoint is intended to be a single api call per set of timeline tweets
@app.route('/rate_tweets', methods=['POST'])
@cross_origin()
def rating_handler():
    data = request.get_json()
    user_stored_to_filter_tweets = data['user_stored_to_filter_tweets']
    new_timeline_tweets = data['new_timeline_tweets']
    # timeline tweets are in dimension 0, similarity scores in dimension 1. This is inverted from backend.py
    if len(user_stored_to_filter_tweets) > 0:
        similarities = ensemble_similarity(new_timeline_tweets, user_stored_to_filter_tweets)
        similarity_filter_passed = [score_filter(timeline_tweet_similarity_scores) for timeline_tweet_similarity_scores in similarities]
    else:
        similarity_filter_passed = [True for i in range(len(new_timeline_tweets))]
    # For now the first prototype implements a single filter. More functionality will be added to this endpoint.
    return {
        'passed': similarity_filter_passed
    }

# This endpoint returns fixed values for the similarity test, to be able to test ui behaviour
@app.route('/rate_tweets_ui_tester', methods=['POST'])
@cross_origin()
def rating_random_test_handler():
    data = request.get_json()
    user_stored_to_filter_tweets = data['user_stored_to_filter_tweets']
    new_timeline_tweets = data['new_timeline_tweets']
    fixed_false_values = [2, 5, 8]

    return {
        'passed': [idx not in fixed_false_values for idx, _ in enumerate(new_timeline_tweets)]
    }




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005)