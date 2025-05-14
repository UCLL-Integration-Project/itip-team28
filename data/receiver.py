from fastapi import FastAPI
from datetime import datetime
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

INFLUXDB_URL = "http://localhost:8086"
INFLUXDB_TOKEN = "7iexqSDrbDkt8_9D3fPnxK1dXJIKgScq1NZSzhMRrAGSe4fgrJW8qkBsQBhOwIlL7RqAHyJXbSNBG7BXhCoZ8A=="
INFLUXDB_ORG = "itip28"
INFLUXDB_BUCKET = "influxdb"

client = InfluxDBClient(
    url=INFLUXDB_URL,
    token=INFLUXDB_TOKEN,
    org=INFLUXDB_ORG
)

write_api = client.write_api(write_options=SYNCHRONOUS)

extractor = FastAPI()

@extractor.post("/newData")
async def new_data(car_id: str, reader_id: str, timestamp_read: datetime):

    point = (
        Point("halt")
        .field("car_id", car_id)
        .field("reader_id", reader_id)
        .field("timestamp_read", str(timestamp_read))
        .time(datetime.now())
    )

    write_api.write(bucket=INFLUXDB_BUCKET, org=INFLUXDB_ORG, record=point)

    return {"status": "saved"}
