import requests
from datetime import datetime, timedelta
import random
import time

URL = "http://localhost:8000/newData"
INFLUXDB_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "7iexqSDrbDkt8_9D3fPnxK1dXJIKgScq1NZSzhMRrAGSe4fgrJW8qkBsQBhOwIlL7RqAHyJXbSNBG7BXhCoZ8A=="
INFLUXDB_ORG = "itip28"
INFLUXDB_BUCKET = "influxdb"

car_ids = ["C123", "C456", "C789"]
reader_ids = ["R1", "R2", "R3"]
now = datetime.utcnow()

delete_payload = {
    "start": "1970-01-01T00:00:00Z",
    "stop": datetime.utcnow().isoformat() + "Z"
}
delete_headers = {
    "Authorization": f"Token {INFLUXDB_TOKEN}",
    "Content-Type": "application/json"
}
delete_params = {
    "org": INFLUXDB_ORG,
    "bucket": INFLUXDB_BUCKET
}
delete_response = requests.post(
    f"{INFLUXDB_URL}/api/v2/delete",
    params=delete_params,
    headers=delete_headers,
    json=delete_payload
)
print(f"Delete status: {delete_response.status_code}")

time.sleep(1)

for i in range(5):
    payload = {
        "car_id": random.choice(car_ids),
        "reader_id": random.choice(reader_ids),
        "timestamp_read": (now - timedelta(seconds=i * 10)).isoformat()
    }
    response = requests.post(URL, params=payload)
    print(f"Sent: {payload}")
    print(f"Response: {response.status_code} - {response.json()}")

time.sleep(2)

query = f'''
from(bucket: "{INFLUXDB_BUCKET}")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "halt")
'''

query_response = requests.post(
    f"{INFLUXDB_URL}/api/v2/query?org={INFLUXDB_ORG}",
    headers={
        "Authorization": f"Token {INFLUXDB_TOKEN}",
        "Content-Type": "application/vnd.flux"
    },
    data=query
)

print("Queried data:")
print(query_response.text)
