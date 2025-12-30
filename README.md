# InternFlare Jobs API

A robust backend API for InternFlare, a platform connecting graduate interns with job opportunities. Built with Node.js, TypeScript, and Express, this API provides comprehensive job management, user authentication, application tracking, and review systems.

## Features

- **User Management**: Registration, authentication, and profile management for users and companies
- **Job Management**: Create, read, update, and delete job postings with advanced filtering and pagination
- **Job Applications**: Seamless application submission and tracking system
- **Company Profiles**: Dedicated profiles for companies with verification and management
- **Review System**: Allow users to leave reviews and ratings for companies and vice versa
- **File Upload**: Support for resume uploads and image handling
- **Security**: JWT-based authentication, rate limiting, CAPTCHA verification, and input validation
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Testing**: Jest-based test suite for reliable code quality

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Argon2
- **File Handling**: Multer for uploads, Jimp for image processing
- **Email**: Nodemailer for notifications
- **Rate Limiting**: Express Rate Limit
- **Logging**: Morgan for HTTP request logging
- **Testing**: Jest with ts-jest
- **Linting**: ESLint with TypeScript support

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd internflare_jobs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=8000
   DB=mongodb://localhost:27017/internflare_jobs
   DB_PASSWORD=your_mongodb_password
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Usage

### Development

```bash
npm run dev
```

This will start the development server with hot reloading using `tsc-watch`.

### Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## API Documentation

The API is fully documented using Swagger/OpenAPI. Once the server is running, visit:

- **Swagger UI**: `http://localhost:8000/api-docs`
- **API Base URL**: `http://localhost:8000`

### Key Endpoints

- `GET /jobs` - Retrieve all jobs with filtering and pagination
- `POST /jobs` - Create a new job posting
- `GET /jobs/{id}` - Get specific job details
- `PATCH /jobs/{id}` - Update job information
- `DELETE /jobs/{id}` - Delete a job posting
- `POST /users/login` - User authentication
- `POST /job-applications` - Submit job application
- `GET /companies` - Browse company profiles
- `POST /reviews` - Submit company reviews

All endpoints requiring authentication use JWT Bearer tokens.

## Authentication

The API uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## File Uploads

The API supports file uploads for:

- User resumes (PDF, DOC, DOCX)
- Company logos and profile images
- Application attachments

Files are stored in the `uploads/` directory with automatic validation and processing.

## Error Handling

The API implements comprehensive error handling with custom error classes and middleware. All errors return consistent JSON responses with appropriate HTTP status codes.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

Run the test suite with:

```bash
npm test
```

Tests are written using Jest and cover controllers, models, and utility functions.

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository or contact me directly
