# Use official Python image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy the entire project
COPY . .

# Expose ports for Rasa server, action server, and backend
EXPOSE 5005 5055 5000

# Start Rasa server, action server, and backend with Gunicorn
CMD ["sh", "-c", "rasa run --enable-api --cors '*' & rasa run actions & gunicorn -b 0.0.0.0:5000 backend.chatbot:app"]
