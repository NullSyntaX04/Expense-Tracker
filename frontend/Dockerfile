# Use official Node image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose frontend port (Vite default)
EXPOSE 5173

# Start frontend
CMD ["npm", "run", "dev", "--", "--host"]
