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

@app.route('/events/<string:event_id>', methods=['GET'])
def get_event(event_id):
    url = f"https://app.ticketmaster.com/discovery/v2/events/{event_id}.json?apikey={API_KEY}"
    res = requests.get(url)

    if res.status_code != 200:
        return jsonify({'error': 'Event not found'}), 404

    e = res.json()     # the single-event payload

    # Build the same shape your /events/all endpoint returns for each item
    event = {
        "id": e["id"],
        "name": e["name"],
        "date": e["dates"]["start"].get("localDate", "TBA"),
        "start_time": e["dates"]["start"].get("localTime", "TBA"),
        "end_time": e.get("dates", {}).get("end", {}).get("localTime", "TBA"),
        "venue": (
            e["_embedded"]["venues"][0]["name"]
            if "_embedded" in e and "venues" in e["_embedded"]
            else "TBA"
        ),
        "info": e.get("info") or e.get("pleaseNote", ""),
        "image": e["images"][0]["url"] if e.get("images") else "",
        "price_min": e.get("priceRanges", [{}])[0].get("min", 0),
        "price_max": e.get("priceRanges", [{}])[0].get("max", 0),
    }

    return jsonify(event)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
