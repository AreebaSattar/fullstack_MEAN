# Full Stack Application - Angular & Express with JWT Authentication
# MEAN STACK PROJECT :)

This repository contains a full-stack application with an Angular frontend, an Express backend, and MongoDB as the database. The app implements JWT authentication, user roles (Admin and User), file upload, and file sharing functionality.

## Prerequisites
At first I installed all these:
- **Node.js** (LTS version) - [Downloaded the Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) - Package manager
- **MongoDB** - [Installed MongoDB Compass](https://www.mongodb.com/try/download/compass)
- **Angular CLI** - Installed via npm: `npm install -g @angular/cli`
- **Postman** - For testing the API routes (backend)

## Project Structure
The application is split into two main parts:
I have used the jetbrains IDE (Webstorm) for both frontend and backend.
1. **Backend** - Express API handling authentication, file uploads, and file sharing.
2. **Frontend** - Angular application providing the user interface.

## Step-by-Step Setup 
- **Created a folder for the backend project and initialize Node.js Project**
  ```bash
  mkdir backendrmt
  cd backendrmt
  npm init -y
- **Installed required dependencies that I needed for my project**
  ```bash
  npm install express mongoose jsonwebtoken bcryptjs cors multer cookie-session dotenv
- **For JWT created a key:** - Created file **generateKey.js** and put this code in it 
  ```bash
  const crypto = require('crypto');
  const secureKey = crypto.randomBytes(32).toString('hex');
  console.log('Secure Key:', secureKey);
- **Added the variable JWT_SECRET in .env file**
  ```bash
  JWT_SECRET="HERE_I_PASTED_MY_SECRET_KEY_THAT_GOT_GENERATED_FROM_ABOVE_FILE_CODE"
- **Connected MongoDB to the backend by:**
  ```bash
  const mongoose = require('mongoose');
  const dbURI = "mongodb://127.0.0.1:27017/rmtdb";
  const connectDB = async () => {
      try {
          await mongoose.connect(dbURI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
          });
          console.log('MongoDB connected...');
      } catch (err) {
          console.error('MongoDB connection error:', err);
          process.exit(1);
      }
  };
  
  module.exports = connectDB;
**I created the DB and named it rmtdb and connected that to backend**
- **In server.js called the connectDB function**
  ```bash
  const connectDB = require('./config/database');
  connectDB();
- **Also used cors for the backend**
As our frontend is running on 4200 port and backend on 3000, so we need to install cors and use that so that it allows us cross origin connection.
  ```bash
  const cors = require('cors');
  app.use(cors({
      origin: 'http://localhost:4200', // Angular frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  
  

