# ⚡ AI Resume & Portfolio Builder

An AI-powered web app that generates personalized Resumes, Cover Letters, and Portfolio content for students using Claude AI.

---

## 🚀 Features
- 📄 **AI Resume Generator** – ATS-friendly, role-specific resumes
- ✉️ **Cover Letter Generator** – Personalized, compelling cover letters
- 🌐 **Portfolio Content Generator** – Hero tagline, about me, project highlights
- 💡 **AI Improvement Tips** – Get actionable suggestions to improve your document
- 📋 **Copy & Download** – Save your document instantly

---

## 🛠️ Tech Stack
- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **AI**: Claude API (Anthropic)

---

## ⚙️ Setup & Run Locally

### Step 1: Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-builder.git
cd ai-resume-builder
```

### Step 2: Create virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Set up API Key
1. Go to https://console.anthropic.com and get your API key
2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```
3. Open `.env` and paste your key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Step 5: Run the app
```bash
python app.py
```

Open your browser and go to: **http://localhost:5000**

---

## 🌐 Deploy on Render (Free)

1. Push your code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Set these:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Environment Variable**: `ANTHROPIC_API_KEY` = your key
5. Click Deploy!

---

## 📁 Project Structure
```
ai-resume-builder/
├── app.py              ← Flask backend + AI logic
├── requirements.txt    ← Python dependencies
├── .env.example        ← API key template
├── README.md
├── templates/
│   └── index.html      ← Main UI
└── static/
    ├── css/
    │   └── style.css   ← Styling
    └── js/
        └── main.js     ← Frontend logic
```

---

## 👨‍💻 Made During 6-Week Internship
Built with Python (Flask) + Claude AI API
```
