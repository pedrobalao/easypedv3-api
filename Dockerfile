# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

# Copy the rest of the code to the container
COPY . .

# Compile the TypeScript code
RUN npm run build

# Specify the command to run when the container starts
CMD ["npm", "start"]
