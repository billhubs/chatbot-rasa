#!/bin/bash

# Script to manually download LLaMA model weights using curl with insecure flag to bypass SSL verification

# Replace the URL below with your signed download URL from Meta
DOWNLOAD_URL="https://llama3-1.llamameta.net/*?Policy=eyJTdGF0ZW1lbnQiOlt7InVuaXF1ZV9oYXNoIjoicGt4MmZtOHI0ZzM1M3ZlcnN2ZmptZWMwIiwiUmVzb3VyY2UiOiJodHRwczpcL1wvbGxhbWEzLTEubGxhbWFtZXRhLm5ldFwvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc1MDAwMzI2OX19fV19&Signature=lGXkZCIgF6jzsUMH%7EtYMBM%7EF5rhVEm5Ci3SzdSStsyWnACcXYoN8XdyvnD0rfqUAU1lDWe%7EbeYt4bFseZQFTPm6HN%7E49qiim-n7yig7sRWeDly111R8Fdn7FWYBl87R--UWU5MODXH9UmGrXAl93Dm6%7E9a09qI0EhaB2Xo06QHbksr8Vi-N8Fslc3LtJne4IQWURSyhnenIqspky0D2PH-8yxYukiQqpWR03sCMTuTZiiM4XmNSk-N4a2S2RVmlH3u7g5e2Z40hKI5C7LWG7FA-W4ATMXqiJfn9XNvqeA%7EzoL0NkV%7EDtzJQ2MggEXkoMY%7EdSaW7IeKRbaYXoFTg6Bw__&Key-Pair-Id=K15QRJLYKIFSLZ&Download-Request-ID=1024521913127510"

# Output file name
OUTPUT_FILE="llama-3.1-8b-model.tar.gz"

echo "Starting download of LLaMA model weights with insecure SSL option..."
curl -k -L -o $OUTPUT_FILE "$DOWNLOAD_URL"

if [ $? -eq 0 ]; then
  echo "Download completed successfully: $OUTPUT_FILE"
else
  echo "Download failed."
fi
