# Use official Python image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose ports for Rasa server and action server
EXPOSE 5005 5055

# Start Rasa server and action server
CMD ["sh", "-c", "rasa run --enable-api --cors '*' & rasa run actions"]
