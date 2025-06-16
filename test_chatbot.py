import requests
import json
import time
from datetime import datetime

# Configuration
API_URL = "http://localhost:5000/chat"
USER_ID = "test_user"
LOG_FILE = "logs/chatbot_test_log.txt"

# Helper function to send message and log response
def send_message(message, log_file=LOG_FILE):
    payload = {"message": message, "user_id": USER_ID}
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(API_URL, data=json.dumps(payload), headers=headers)
        response.raise_for_status()
        response_data = response.json()
        with open(log_file, "a") as f:
            f.write(f"{datetime.now()} - Sent: {message}\n")
            f.write(f"{datetime.now()} - Received: {json.dumps(response_data, indent=2)}\n\n")
        print(f"Sent: {message}")
        print(f"Received: {response_data['response']}\n")
        return response_data["response"]
    except requests.exceptions.RequestException as e:
        with open(log_file, "a") as f:
            f.write(f"{datetime.now()} - Error: {str(e)}\n\n")
        print(f"Error: {e}")
        return None

# Test flows
def test_chatbot_flows():
    with open(LOG_FILE, "w") as f:
        f.write(f"Chatbot Test Log - {datetime.now()}\n\n")

    # Flow 0: Greet
    print("=== Flow 0: Greet ===")
    send_message("halo")
    time.sleep(1)

    # Flow 1: Direct Booking (Reguler)
    print("=== Flow 1: Direct Booking (Reguler) ===")
    send_message("Pesan Reguler Malang-Juanda untuk Billy Tian Sunarto, 3 orang, 085233496932, jemput di Jl. Candi No.2, antar ke Bandara Juanda, penerbangan QZ323 AirAsia, jam 07:30, tanggal 2025-08-15")
    time.sleep(1)
    send_message("konfirmasi")
    time.sleep(1)
    send_message("selesai")
    time.sleep(1)

    # Flow 2: Step-by-Step Booking (Charter Drop)
    print("=== Flow 2: Step-by-Step Booking (Charter Drop) ===")
    send_message("pesan charter drop malang-juanda")
    time.sleep(1)
    send_message("Billy Tian Sunarto")
    time.sleep(1)
    send_message("7 orang")
    time.sleep(1)
    send_message("085233496932")
    time.sleep(1)
    send_message("Jl. Candi No.2")
    time.sleep(1)
    send_message("Bandara Juanda")
    time.sleep(1)
    send_message("4 alamat")
    time.sleep(1)
    send_message("QZ323")
    time.sleep(1)
    send_message("AirAsia")
    time.sleep(1)
    send_message("07:30")
    time.sleep(1)
    send_message("2025-08-15")
    time.sleep(1)
    send_message("konfirmasi")
    time.sleep(1)
    send_message("selesai")
    time.sleep(1)

    # Flow 3: Check Reservation
    print("=== Flow 3: Check Reservation ===")
    send_message("cari pesanan KR-0A3CC9")
    time.sleep(1)
    send_message("KR-0A3CC9")
    time.sleep(1)

    # Flow 4: Pricing Query
    print("=== Flow 4: Pricing Query ===")
    send_message("berapa harga reguler malang-juanda untuk 3 orang?")
    time.sleep(1)

    # Flow 5: Cancellation
    print("=== Flow 5: Cancellation ===")
    send_message("batal")
    time.sleep(1)

    # Flow 6: Recommendation
    print("=== Flow 6: Recommendation ===")
    send_message("rekomendasi layanan malang-juanda")
    time.sleep(1)

if __name__ == "__main__":
    test_chatbot_flows()
