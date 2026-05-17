
import json
import psutil
data = {
    "cpu": psutil.cpu_percent(),
    "ram": psutil.virtual_memory().percent,
    "disk": psutil.disk_usage('/').percent
}

print(json.dumps(data))