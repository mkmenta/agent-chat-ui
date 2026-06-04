docker build -t agent-chat-ui .
docker run -p 3000:3000 --env-file .env agent-chat-ui