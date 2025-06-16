# Deployment Instructions for Chatbot Project

This document provides detailed steps to deploy your chatbot project (Rasa, backend, frontend) using Docker Compose on a free cloud platform such as Railway or Render.

---

## Prerequisites

- Docker installed locally for building/testing images
- Account on a free cloud platform supporting Docker Compose (e.g., [Railway](https://railway.app/), [Render](https://render.com/))
- GitHub repository with your project code (optional but recommended for CI/CD)

---

## Project Preparation

1. Ensure your project has the following files:
   - `docker-compose.yml` (defines services: rasa, backend, rasa-x, frontend)
   - `backend/Procfile` and `backend/start.sh` for backend startup
   - `frontend/Dockerfile` for frontend container build
   - `backend/requirements.txt` for Python dependencies
   - `backend/chatbot.py` as backend entrypoint
   - Rasa project files (`domain.yml`, `nlu.yml`, `rules.yml`, `stories.yml`, etc.)

2. Commit and push all changes to your GitHub repository.

---

## Deployment Steps on Railway or Render

### Railway

1. Sign up / log in to [Railway](https://railway.app/).
2. Create a new project and link your GitHub repository.
3. Railway will detect the `docker-compose.yml` and build your services.
4. Configure environment variables if needed (e.g., `RASA_X_PASSWORD`, `RASA_X_USERNAME`, `RASA_X_TOKEN`).
5. Deploy the project. Railway will build and start containers.
6. Railway assigns public URLs for your services. Note the frontend URL (port 3000).
7. Test the chatbot by accessing the frontend URL.

### Render

1. Sign up / log in to [Render](https://render.com/).
2. Create a new Web Service.
3. Connect your GitHub repository.
4. Select "Docker" as the environment.
5. Use the `docker-compose.yml` to deploy all services.
6. Set environment variables in Render dashboard.
7. Deploy and monitor build logs.
8. Access the frontend URL and test chatbot functionality.

---

## Environment Variables

Set the following environment variables in your platform dashboard:

- `RASA_X_PASSWORD`: password for Rasa X UI
- `RASA_X_USERNAME`: username for Rasa X UI
- `RASA_X_TOKEN`: token for Rasa X authentication
- Any other secrets or API keys your project requires

---

## Verifying Deployment

- Access frontend UI via the platform-assigned URL (port 3000).
- Interact with the chatbot to test booking, recommendations, and status checks.
- Check logs on the platform dashboard for errors or warnings.
- Verify backend APIs (e.g., `/chat`, `/reservations`) are reachable.

---

## Additional Tips

- For local testing, run `docker-compose up --build` to start all services.
- Use platform CLI tools for logs and debugging.
- Monitor resource usage to stay within free tier limits.

---

If you want, I can help you create platform-specific configuration files or scripts, or guide you step-by-step through the deployment process on your chosen platform.

Please let me know your preferred platform or if you want help with both.
