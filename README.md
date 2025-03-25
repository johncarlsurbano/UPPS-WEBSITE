# **UNIVERSITY PRINTING PRESS SYSTEM**

The **University Printing Press System (UPPS)** is a web-based solution designed to enhance the efficiency of request processing, billing, and inventory management at the **University of Science and Technology of Southern Philippines (USTP) Printing Press**. It features **automated queuing, real-time tracking, and integrated billing and inventory monitoring** to streamline operations and improve transparency.

## **Tech Stack**
- **Frontend:** React.js (Vite, Redux, Axios, etc.)
- **Backend:** Django (Django REST Framework)
- **Database:** SQLite

## **Features**
- **Automated Queuing**
- **Real-time Tracking**
- **Integrated Billing and Inventory Monitoring**

## **Installation Instructions**

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** and **npm** (or **yarn**)
- **Python** and **pip**

### **Backend Setup (Django)**
```sh
cd server
cd upps\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### **Frontend Setup (React)**
```sh
cd my-upps-website
npm install
npm run dev
```

## **Usage**
1. **Start the backend server:**
   ```sh
   python manage.py runserver
   ```
2. **Start the frontend development server:**
   ```sh
   npm run dev
   ```
3. **Open** [http://localhost:5175](http://localhost:5175) **in your browser**
