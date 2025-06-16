import json

try:
    with open('services.json', 'r') as file:
        data = json.load(file)
    print("JSON loaded successfully!")
    print("Services available:", [service['type'] for service in data['services']])
except Exception as e:
    print("Error loading JSON:", str(e))