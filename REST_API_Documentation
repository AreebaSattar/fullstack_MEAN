# REST API Documentation

## 1. Authentication and Authorization

### 1.1 User Authentication with JWT
- Implemented JWT authentication for secure communication between frontend and backend.
- Generated JWT tokens during user login and registration with an expiration time of 1 hour.

### 1.2 Roles and Permissions
- Created **Two Roles**:
  - **Admin**: Manages all users and documents.
  - **User**: Can upload and view their own documents and documents shared with them.
- Enforced **Role-Based Access Control** using middleware:
  - `authenticateToken`: Verifies JWT tokens.
  - `authorizeRole`: Restricts access to specific roles.

### 1.3 Postman Tests for Authentication and Authorization
1. **Register a User**
   - **URL**: `http://localhost:3000/api/auth/register`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "username": "user1",
       "password": "password123",
       "role": "User"
     }
     ```
   - **Response**:
     ```json
     {
       "id": "676f6cc956adc57b7af98a97",
       "username": "user1",
       "role": "User",
       "token": "TOKENGENERATED"
     }
     ```

2. **Login a User**
   - **URL**: `http://localhost:3000/api/auth/login`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "username": "user1",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "id": "676f6cc956adc57b7af98a97",
       "username": "user1",
       "role": "User",
       "token": "TOKENGENERATED"
     }
     ```

3. **Access Admin Dashboard (Admin Only)**
   - **URL**: `http://localhost:3000/api/auth/admin-dashboard`
   - **Method**: `GET`
   - **Headers**:
     ```json
     {
       "Authorization": "Bearer <JWT_TOKEN>"
     }
     ```
   - **Response**:
     - **Admin Token**:
       ```json
       { "message": "Welcome to the Admin Dashboard" }
       ```
     - **User Token**:
       ```json
       { "error": "Access Denied" }
       ```

4. **Access User Dashboard (User Only)**
   - **URL**: `http://localhost:3000/api/auth/user-dashboard`
   - **Method**: `GET`
   - **Headers**:
     ```json
     {
       "Authorization": "Bearer <JWT_TOKEN>"
     }
     ```
   - **Response**:
     - **User Token**:
       ```json
       { "message": "Welcome to the User Dashboard" }
       ```
     - **Admin Token**:
       ```json
       { "error": "Access Denied" }
       ```

---

## 2. Document/File Management

### 2.1 File Upload
- Allowed users to upload files with the following validations:
  - **File types**: PDF, DOCX, PNG, JPG.
  - **File size**: Maximum 5 MB.

**Upload File Endpoint**:
- **URL**: `http://localhost:3000/upload`
- **Method**: `POST`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }

