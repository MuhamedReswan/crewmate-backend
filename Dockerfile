# 1. Use an official Node.js base image
FROM node:20-alpine

# 2. Set working directory in the container
WORKDIR /app

# 3. Copy only package files to install dependencies first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the entire project
COPY . .

# 6. Build the TypeScript code
RUN npm run build

# 7. Set environment variable for production
ENV NODE_ENV=production

# 8. Expose your backend port (change if your app uses another)
EXPOSE 3000

# 9. Start the app using compiled JS in dist/
# CMD ["node", "dist/server.js"] // 
CMD ["npx", "nodemon", "--watch", "src", "src/index.ts"] 

