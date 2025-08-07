# Use Python 3.12 slim image for smaller size
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy pyproject.toml first for better caching
COPY pyproject.toml /app/

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Copy the rest of the application
COPY . /app/

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["sh", "-c", "python -m uvicorn src.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
