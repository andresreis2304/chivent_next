from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

API_KEY = "HvH3lxb9xqJ0EUvCag350ntAcn4Kx4Yh"  # fallback for dev

@app.route('/')
def hello():
    return "Hello World"

@app.route('/events/all', methods=['GET'])
def get_all_events():
    url = f"https://app.ticketmaster.com/discovery/v2/events.json?apikey={API_KEY}&city=Chicago"
    response = requests.get(url)
    data = response.json()

    events = []

    if "_embedded" in data:
        for event in data["_embedded"]["events"]:
            events.append({
                "id": event["id"],
                "name": event["name"],
                "date": event["dates"]["start"].get("localDate", "TBA"),
                "start_time": event["dates"]["start"].get("localTime", "TBA"),
                "end_time": event.get("dates", {}).get("end", {}).get("localTime", "TBA"),
                "venue": event["_embedded"]["venues"][0]["name"] if "_embedded" in event and "venues" in event["_embedded"] else "TBA",
                "info": event.get("info") or event.get("pleaseNote", ""),
                "image": event["images"][0]["url"] if event.get("images") else "",
                "price_min": event.get("priceRanges", [{}])[0].get("min", 0),
                "price_max": event.get("priceRanges", [{}])[0].get("max", 0),
            })

    return jsonify(events)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
