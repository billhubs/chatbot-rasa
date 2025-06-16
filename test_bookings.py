import requests
import json

BASE_URL = "http://localhost:5005"

def make_booking(booking_type, details):
    """Simulate a complete booking conversation flow"""
    # Start conversation
    response = requests.post(
        f"{BASE_URL}/webhooks/rest/webhook",
        json={"sender": details['phone'], "message": "/greet"}
    )
    
    # Select booking type
    requests.post(
        f"{BASE_URL}/webhooks/rest/webhook",
        json={"sender": details['phone'], "message": booking_type}
    )
    
    # Fill all required slots
    for slot, value in details.items():
        requests.post(
            f"{BASE_URL}/webhooks/rest/webhook",
            json={"sender": details['phone'], "message": value}
        )
    
    # Confirm booking
    requests.post(
        f"{BASE_URL}/webhooks/rest/webhook",
        json={"sender": details['phone'], "message": "/affirm"}
    )

# Regular bookings
regular_bookings = [
    {
        'phone': '081234567891',
        'name': 'Budi Santoso',
        'route': 'Malang-Surabaya',
        'passengers': '2',
        'address_pickup': 'Jl. Raya Tlogomas No.12',
        'pickup_time': '14:00',
        'pickup_date': '14-06-2024',
        'vehicle': 'Avanza'
    },
    {
        'phone': '082345678901',
        'name': 'Siti Rahayu', 
        'route': 'Surabaya-Malang',
        'passengers': '3',
        'address_pickup': 'Jl. Diponegoro No.45',
        'pickup_time': '10:00',
        'pickup_date': '15-06-2024',
        'vehicle': 'Innova'
    }
]

# Charter drop bookings
charter_drop_bookings = [
    {
        'phone': '083456789012',
        'name': 'Agus Wijaya',
        'route': 'Malang-Juanda',
        'passengers': '4',
        'address_pickup': 'Jl. Soekarno Hatta No.23',
        'flight': 'GA-123',
        'airline': 'Garuda',
        'pickup_time': '06:00',
        'pickup_date': '16-06-2024',
        'vehicle': 'Avanza'
    },
    {
        'phone': '084567890123',
        'name': 'Dewi Lestari',
        'route': 'Juanda-Malang',
        'passengers': '2',
        'address_pickup': 'Terminal 1 Juanda',
        'flight': 'QG-456',
        'airline': 'Citilink',
        'pickup_time': '20:00',
        'pickup_date': '17-06-2024',
        'vehicle': 'Innova'
    },
    {
        'phone': '085678901234',
        'name': 'Rudi Hermawan',
        'route': 'Malang-Surabaya',
        'passengers': '6',
        'address_pickup': 'Jl. Kawi No.11',
        'pickup_time': '15:00',
        'pickup_date': '18-06-2024',
        'vehicle': 'Hiace'
    }
]

# Daily charter booking
daily_charter = {
    'phone': '086789012345',
    'name': 'Linda Setiawan',
    'route': 'Malang-Batu',
    'passengers': '8',
    'address_pickup': 'Jl. Veteran No.5',
    'pickup_time': '09:00',
    'pickup_date': '19-06-2024',
    'vehicle': 'Hiace',
    'hours': '10'
}

# Make all bookings
print("Making regular bookings...")
for booking in regular_bookings:
    make_booking("/regular", booking)

print("Making charter drop bookings...")    
for booking in charter_drop_bookings:
    make_booking("/charter_drop", booking)

print("Making daily charter booking...")
make_booking("/daily_charter", daily_charter)

print("All test bookings completed!")
