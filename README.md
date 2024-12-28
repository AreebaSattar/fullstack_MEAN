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

## STEPS PERFORMED AND I VERIFIED THEM IN POSTMAN

### 1. Authentication and Authorization
#### 1.1 User Authentication with JWT
- **Implemented JWT authentication as I mentioned above** for secure communication between frontend and backend side.
- **Code generates JWT tokens** during the login and registeration of a user and also I set up an expiration after an hour
#### 1.2 Roles and Permissions (Roles)
- Created **Two Roles**
  - **Admin** -> He manages all users and documents.
  - **User** -> He can upload and view own docs and docs shared with them.
I enforced **Role based access control** using middleware functions:
- `authenticateToken` : Verifies JWT tokens
- `authorizeRole` : it restricts access to specific roles.
#### 1.3 Postman Tests for Authentication and Authorization
- **Register a User**
   - URL: `http://localhost:3000/api/auth/register`
   - Method: `POST`
   - Body (JSON):
     ```json
     {
       "username": "user1",
       "password": "password123",
       "role": "User"
     }
     ```
   - Response: Returns user details and JWT token.
     ```json
     {
      "id": "676f6cc956adc57b7af98a97",
      "username": "user1",
      "role": "User",
      "token": "TOKENGENERATED"
      }
     ```
- **Login a User**
   - URL: `http://localhost:3000/api/auth/login`
   - Method: `POST`
   - Body (JSON):
     ```json
     {
       "username": "user1",
       "password": "password123"
     }
     ```
   - Response: Returns user details and JWT token.
     ```json
       {
      "id": "676f6cc956adc57b7af98a97",
      "username": "user1",
      "role": "User",
      "token": "TOKENGENERATED"
      }
    ```
- **Access Admin Dashboard (Admin Only)**
   - URL: `http://localhost:3000/api/auth/admin-dashboard`
   - Method: `GET`
   - Headers:
     ```json
     {
       "Authorization": "Bearer <OURJWTOKENforUser>"
     }
     ```
   - Response:
     - **Admin Token**: Welcome message for Admin.
         ```json
         { message: 'Welcome to the Admin Dashboard' }
         ```
     - **User Token**: Access denied.
- **Access User Dashboard (User Only)**
   - URL: `http://localhost:3000/api/auth/user-dashboard`
   - Method: `GET`
   - Headers:
     ```json
     {
       "Authorization": "Bearer <OURJWTOKENforUSER>"
     }
     ```
   - Response:
     - **User Token**: Welcome message for User.
       ```json
         { message: 'Welcome to the User Dashboard' }
         ```
     - **Admin Token**: Access denied.
    
  ### 2. Document/ Files Management
  #### 2.1 File Upload
  - Allowed users to **upload files** with the following validations:
  - **File types**: PDF, DOCX, PNG, JPG.
  - **File size**: Maximum 5 MB.
- Implemented using `multer` middleware in the backend. (TOOK HELP FROM GOOGLE different sites)
    ```bash
    const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|docx|png|pdf/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);}
        else if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images (jpg, png) and PDFs and DOCX are allowed.'));
        }}}).single('File');
    ```
#### 2.2 Sharing the Files
- Enabled users to **share uploaded files** with other users
- Admins and file owners can manage file sharing.
  ```bash
      app.post('/files/share/:id', authenticateToken, authorizeRole('Admin', 'User'), async (req, res) => {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });
    
        // Allow the file owner or Admin to share it
        if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'You are not authorized to share this file.' });}
        file.sharedWith.push(req.body.userId); // Add user ID to the sharedWith array
        await file.save();
        res.status(200).json({ message: 'File shared successfully.' });
    });
  ```
#### 2.3 Deleting Files
- Allowed Admins and file owners to **delete files** from the database and server.
```bash
app.delete('/files/:id', authenticateToken,authorizeRole('Admin', 'User'), async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });

        if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access Forbidden' });
        }

        await file.delete();
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting the file' });
    }
});
```
#### 2.4 Postman Tests for File Management
1. **Upload a File**
   - URL: `http://localhost:3000/upload`
   - Method: `POST`
   - Headers:
     ```json
     {
       "Authorization": "Bearer <JWTTOKENoftheUSWER>"
     }
     ```
   - Body (Form-Data):
     - Key: `File` (File Type)
     - Value: Choose a file (e.g., `file1.docx`)
   - Response: Returns file details.
     ```bash
     {
      "message": "File uploaded successfully!",
      "file": {
        "id": "676f6a9956adc57b7af98a94",
        "filename": "File-1735355033038.docx",
        "filepath": "uploads\\File-1735355033038.docx"}}
     ```
2. **Fetch Files**
   - URL: `http://localhost:3000/files`
   - Method: `GET`
   - Headers:
     ```json
     {
       "Authorization": "Bearer <JWTTOKENLoggedInuser>"
     }
     ```
   - Response:
     - **Admin Token**: All files can be fteched by Admin.
     - **User Token**: Files uploaded by or shared with the looggedIn user.
3. **Share a File**
   - URL: `http://localhost:3000/files/share/:id`
   - Method: `POST`
   - Headers:
     ```json
       {
         "Authorization": "Bearer <JWTTOKENLoggedInuser>"
       }
     ```
   - Body (JSON):
     ```json
       {
         "userId": "<UserIDtowhomshareWith>"
       }
     ```
   - Response: File shared successfully. / {"error":"You are not authorized to share this file."}
4. **Delete a File**
   - URL: `http://localhost:3000/files/:id`
   - Method: `DELETE`
   - Headers:
     ```json
     {
       "Authorization": "Bearer <JWTTOKENLoggedInuser>"
     }
     ```
   - Response:
     - **Admin or Owner of the file**: File deleted successfully.
     - **Other Users**: Access denied.

5. **Download a File**
   - URL: `http://localhost:3000/files/:id`
   - Method: `GET`
   - Headers:
     ```json
     {
       "Authorization": "Bearer <JWTTOKENLoggedInuser>"
     }
     ```
   - Response: Downloads the file if the user has access.
     
