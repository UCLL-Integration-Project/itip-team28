from fastapi import FastAPI
from datetime import datetime
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from dotenv import load_dotenv
import os

load_dotenv()

INFLUXDB_URL = os.getenv("INFLUXDB_URL")
INFLUXDB_TOKEN = os.getenv("INFLUXDB_TOKEN")
INFLUXDB_ORG = os.getenv("INFLUXDB_ORG")
INFLUXDB_BUCKET = os.getenv("INFLUXDB_BUCKET")

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
