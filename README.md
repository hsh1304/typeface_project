# Typeface File Upload Service

A full-stack file upload service built with React, Express.js, PostgreSQL, and MinIO. Upload, view, and download files with support for .txt, .jpg, .jpeg, .png, and .json files.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed

### 1. Clone and Setup
```bash
git clone <repository-url>
cd typeface_project
```

### 2. Create Environment File
Create a `.env` file in the project root:

```env
# Database
DB_NAME=appdb
DB_USER=appuser
DB_PASS=apppass
DB_HOST=postgres
DB_PORT=5432

# MinIO Storage
S3_ENDPOINT=http://minio:9000
S3_BUCKET=my-minio-bucket
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_REGION=us-east-1

# Server
PORT=8000
VITE_API_URL=http://localhost:8000
```

### 3. Start the Application
```bash
docker-compose up --build
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MinIO Console**: http://localhost:9001 (admin/minioadmin)

## 🔧 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Express.js, Sequelize
- **Database**: PostgreSQL
- **Storage**: MinIO (S3-compatible)
- **Containerization**: Docker

## 📝 Features

- File upload with drag-and-drop interface
- File type validation (.txt, .jpg, .jpeg, .png, .json)
- File listing and download
- Real-time updates
- Error handling with user-friendly messages

## 🔌 API Endpoints

- `POST /api/upload` - Upload a file
- `GET /api/files` - Get all files
- `GET /api/download/:id` - Get download URL
- `GET /` - Health check

## 🐳 Docker Services

| Service | Port | Credentials |
|---------|------|-------------|
| Frontend | 3000 | - |
| Backend | 8000 | - |
| PostgreSQL | 5432 | appuser/apppass |
| MinIO API | 9000 | minioadmin/minioadmin |
| MinIO Console | 9001 | minioadmin/minioadmin |

## 🔍 Troubleshooting

### Common Issues
- **Docker not running**: Start Docker Desktop
- **Port conflicts**: Check if ports 3000, 8000, 5432, 9000, 9001 are free
- **Database connection**: Ensure PostgreSQL container is running
- **File upload fails**: Check MinIO container and bucket exists

### View Logs
```bash
docker-compose logs
docker-compose logs backend
docker-compose logs frontend
```

## 🚀 Production

Update `.env` with production values:
- Use managed PostgreSQL
- Use AWS S3 or production MinIO
- Set secure credentials
- Enable HTTPS

