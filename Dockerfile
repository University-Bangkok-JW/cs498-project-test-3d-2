FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
