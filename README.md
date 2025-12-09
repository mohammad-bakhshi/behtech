# BehTech Task

A simple JavaScript project that imports Excel files of products, parses their contents, and import products to database and perform advanced filters and search on them.

---

## 📦 Features

- Parses `.xlsx` files into JSON
- save Data of products from excel file to mongodb database
- perform advanced filters and search on products.

---

## 🛠️ Technologies Used

- **JavaScript (ES6)**
- **XLSX (SheetJS)** — for parsing Excel files
- **Express.JS Framework** — for backend server
- **MongoDB Framework** — for saving permanent data

---

## 🚀 Getting Started

### 1. Install Docker and Docker Compose

### 2. Create .env file from .env.example file

### 3. Run sudo docker compose up to start the project

## ⚙️ Architecture Explanation

### Used MVC architectural. MVC is an architectural/design pattern that separates an application into three main logical components Model, View, and Controller. Each architectural component is built to handle specific development aspects of an application. It isolates the business logic and presentation layer from each other.

## ⛓️ API usage examples

### This project exposes two primary endpoints for interacting with the import system and product data.

### 🧾 **1. POST `/api/import`**

Uploads an Excel file and starts the import process.

**Description:**  
This endpoint accepts an Excel file (`.xlsx` or `.xls`) via a multipart/form-data request.  
It parses the file, and returns a JSON summary of the imported records.

### 🧾 **2. GET `/api/products`**

Get list of products with filters and search performed on it.

**Description:**  
This endpoint list the products;
