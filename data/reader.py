from influxdb_client import InfluxDBClient

INFLUXDB_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "7iexqSDrbDkt8_9D3fPnxK1dXJIKgScq1NZSzhMRrAGSe4fgrJW8qkBsQBhOwIlL7RqAHyJXbSNBG7BXhCoZ8A=="
INFLUXDB_ORG = "itip28"
INFLUXDB_BUCKET = "influxdb"

client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)

query_api = client.query_api()

query = f'''
from(bucket: "{INFLUXDB_BUCKET}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "halt")
'''

tables = query_api.query(query)

for table in tables:
    for record in table.records:
        print(f"Time: {record.get_time()}, Data: {record.values}")