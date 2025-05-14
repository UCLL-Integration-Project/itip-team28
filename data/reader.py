from influxdb_client import InfluxDBClient
from dotenv import load_dotenv
import os

load_dotenv()

INFLUXDB_URL = os.getenv("INFLUXDB_URL")
INFLUXDB_TOKEN = os.getenv("INFLUXDB_TOKEN")
INFLUXDB_ORG = os.getenv("INFLUXDB_ORG")
INFLUXDB_BUCKET = os.getenv("INFLUXDB_BUCKET")

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