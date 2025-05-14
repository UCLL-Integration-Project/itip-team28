from fastapi import FastAPI
from datetime import datetime
from dataclasses import dataclass

extractor = FastAPI()

@dataclass
class Halt:
    car_id: str
    reader_id: str
    timestamp_read: datetime

@extractor.post("/newData")
async def new_data(car_id: str, reader_id: str, timestamp_read: datetime):
    new_halt = Halt(car_id, reader_id, timestamp_read)
    print(new_halt)
    return {"status": "received"}

## run "uvicorn receiver:extractor --reload" to start application
## install fastapi and uvicorn