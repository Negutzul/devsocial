FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 4200 for ng serve
EXPOSE 4200

# Start the application
CMD ["npm", "start"] 