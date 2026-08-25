# CampusAI - College AI Knowledge Assistant

CampusAI is an AI-powered college information assistant that helps students get information about their college through a simple chat interface.

Students can ask questions about college facilities, library, hostel, academics, fees, and other college-related information. The system uses uploaded college PDF documents as its knowledge base and Google Gemini to generate answers.

## Features

- Student registration and login
- Admin login
- JWT authentication
- Protected API routes
- Admin PDF upload
- PDF text extraction
- College knowledge base
- AI-powered question answering
- Google Gemini API integration
- MongoDB Atlas database
- Next.js frontend
- Express.js backend
- Responsive chat interface
- Admin document upload interface
- Source information for AI answers

## Technologies Used

### Frontend

- Next.js
- React
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- JWT
- Multer
- PDF processing

### Database

- MongoDB Atlas
- Mongoose

### AI

- Google Gemini API

### Development Tools

- Visual Studio Code
- npm
- Nodemon
- Git
- GitHub

## System Architecture

```text
Student
   |
   v
Next.js Frontend
   |
   v
Express.js Backend
   |
   +-------------> MongoDB Atlas
   |
   +-------------> Google Gemini API
   |
   v
College PDF Knowledge Base