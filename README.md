# AWS Serverless Notes App 🚀

A simple serverless Notes application built using AWS services.

This project demonstrates how to build and deploy a full-stack application without managing any servers.

## 🏗️ Architecture

User
  ↓
Amazon S3
  ↓
Amazon API Gateway
  ↓
AWS Lambda
  ↓
Amazon DynamoDB

## ☁️ AWS Services Used

- Amazon S3 — Hosts the frontend
- Amazon API Gateway — Provides RESTful HTTP API endpoints
- AWS Lambda — Runs the backend Python code
- Amazon DynamoDB — Stores notes
- AWS IAM — Manages permissions
- Amazon CloudWatch — Lambda logging and monitoring

## ✨ Features

- Create notes
- View all notes
- View individual notes
- Update notes
- Delete notes
- Search notes
- Responsive frontend
- Serverless backend
- No traditional server required

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create a note |
| GET | `/notes` | Get all notes |
| GET | `/notes/{id}` | Get one note |
| PUT | `/notes/{id}` | Update a note |
| DELETE | `/notes/{id}` | Delete a note |

## 🛠️ Technologies

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- AWS Lambda

### Database
- Amazon DynamoDB

### Cloud
- Amazon S3
- Amazon API Gateway
- AWS IAM
- Amazon CloudWatch

## 📁 Project Structure

```text
aws-serverless-notes-app/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── lambda/
│   └── lambda_function.py
│
├── architecture/
│   └── architecture.png
│
└── README.md
