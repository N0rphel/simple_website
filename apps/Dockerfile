# Use lightweight Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy app source
COPY . .

# Expose app port
EXPOSE 3000

# Run app
CMD ["node", "server.js"]
