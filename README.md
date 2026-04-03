# Welcome to your Lovable project
# 🌍 Epidemic Spread Predictor

## 🚀 About This Project

During this hackathon, I noticed that most epidemic dashboards only show past data but don’t actually help in understanding what will happen next.

So, I built this project to solve that problem.

This is an AI-powered web application that predicts future COVID-19 cases and also tells how risky the situation is using a smarter growth-based approach instead of just fixed numbers.

---

## 💡 What This Project Does

- Predicts future cases based on number of days
- Allows country-based analysis
- Shows how much cases will increase
- Calculates growth percentage
- Classifies risk into Low, Medium, High

---

## 🏗️ How It Works

Frontend (Lovable UI)  
↓  
Flask API (Backend)  
↓  
Machine Learning Model  
↓  
Prediction Output  

---

## ⚙️ Technologies Used

### 🖥️ Frontend
- Built using **Lovable**
- Responsive dashboard UI
- User inputs + result display

### ⚙️ Backend
- Python
- Flask (API)
- Flask-CORS

### 📊 Machine Learning
- Linear Regression (Scikit-learn)
- Pandas
- NumPy

### 🌐 Deployment
- Backend deployed on Render
- Connected via REST API

---

## 🔥 Key Features

- Real-time prediction using API
- Country-based epidemic analysis
- Growth-based risk detection
- Clean and modern UI
- Works as a complete full-stack system

---

## 🧠 Key Innovation

Instead of using fixed thresholds for risk (like total cases), I used:

👉 Growth Percentage-Based Risk Model

This makes predictions more realistic because risk depends on how fast cases are increasing, not just the total number.

---

## 🔗 API Endpoint

GET /predict?day=<number>&region=<country>

### Example:
https://new-epidemic-ai1.onrender.com/predict?day=10&region=India

---

## 🖥️ How It Works (User Side)

1. Enter number of days
2. Enter country name
3. Click Predict
4. Get:
   - Predicted cases
   - Increase in cases
   - Growth %
   - Risk level

---

## 📚 What I Learned

- How to build a machine learning model
- How to convert ML model into an API using Flask
- How frontend and backend connect
- How to deploy a live project using Render
- Importance of designing better logic (growth-based risk)

---

## ⚡ Challenges Faced

- Handling large real-world datasets
- Fixing incorrect risk prediction (initially always high)
- Mapping country names correctly (US, UK, etc.)
- Connecting API with frontend
- Deploying and testing live system

---

## 🚀 How to Run Locally

```bash
git clone https://github.com/your-username/new-Epidemic_ai.git
cd new-Epidemic_ai
pip install -r requirements.txt
python app.py

