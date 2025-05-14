from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import os

class Reader(FileSystemEventHandler):
    def __init__(self, filepath):
        self.filepath = filepath

    def on_modified(self, event):
        if event.src_path == self.filepath:
            print(f"{self.filepath} was modified!")

file_to_watch = "/path/to/your/file.txt"
event_handler = Reader(file_to_watch)
observer = Observer()

observer.schedule(event_handler, path=os.path.dirname(file_to_watch), recursive=False)
observer.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()

observer.join()
