<div align="center">

# 👁️ IrisDx
### Medical Iris Recognition System

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3%2B-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13%2B-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.8%2B-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-00ffcc?style=for-the-badge)](LICENSE)

*A clinical-grade web interface for biometric iris identification powered by deep learning.*

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Using the Real Model](#-using-the-real-model)
- [Mock Mode](#-mock-mode)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔬 Overview

**IrisDx** is a full-stack web application that provides a sleek, clinical-grade GUI for an iris biometric recognition system. It wraps a trained Keras deep-learning model (`IRISRecognizer1.h5`) trained on the **CASIA-Iris-Thousand** dataset with a professional dark-themed, glassmorphism interface that delivers real-time scan animations and identification results.

When the model is not present, the system runs in **Mock Mode**, allowing full UI testing with simulated results — no GPU or model file required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖼️ **Drag & Drop Upload** | Drag iris images directly onto the scan zone or click to browse |
| 🎞️ **Scan Animations** | Real-time scanning line, rotating reticle, and grid overlay |
| 📊 **Live Progress Tracking** | Step-by-step processing pipeline with animated progress bar |
| 🧠 **Deep Learning Inference** | Runs a Keras CNN model to identify iris patterns |
| 🔄 **Mock Mode** | Fully functional UI demo without requiring the model file |
| 📱 **Responsive Design** | Adapts cleanly to desktop and tablet viewports |
| 🎨 **Medical Aesthetic** | Dark clinical UI with neon-cyan accents and glassmorphism panels |

---

## 📁 Project Structure

```
iris_gui/
│
├── app.py                  # Flask application & API routes
│
├── templates/
│   └── index.html          # Main Jinja2 HTML template
│
├── static/
│   ├── css/
│   │   └── style.css       # Full design system & animations
│   └── js/
│       └── app.js          # Client-side logic (drag-drop, fetch, UI states)
│
├── uploads/                # Temporary upload directory (auto-cleared after each scan)
│   └── .gitkeep
│
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
├── .gitignore
└── README.md
```

> **Note:** The trained model file `IRISRecognizer1.h5` is **not** included in this repository due to its size. See [Using the Real Model](#-using-the-real-model) below.

---

## 🚀 Getting Started

### Prerequisites

- Python **3.9** or higher
- `pip` package manager
- *(Optional)* A trained `IRISRecognizer1.h5` Keras model

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/iris_gui.git
cd iris_gui
```

**2. Create and activate a virtual environment** *(recommended)*

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

> ⚠️ **TensorFlow** is listed as an optional dependency. If you want real model inference, install it manually:
> ```bash
> pip install tensorflow>=2.13.0
> ```

**4. Copy the environment template**

```bash
cp .env.example .env
# Edit .env and set your SECRET_KEY and MODEL_PATH
```

### Running the App

```bash
python app.py
```

Then open your browser and navigate to:

```
http://127.0.0.1:5000
```

---

## 🧠 Using the Real Model

To enable real iris recognition inference:

1. Place your trained model file at the path defined in `app.py` (default: one directory **above** `iris_gui/`):

   ```
   Downloads/
   ├── IRISRecognizer1.h5      ← place the model here
   └── iris_gui/
       └── app.py
   ```

2. *(Optional)* Update the `MODEL_PATH` in `app.py` or your `.env` to point to a custom location.

3. Restart the Flask server. The console will confirm:
   ```
   Loading model from ..\IRISRecognizer1.h5...
   Model loaded successfully.
   ```

> The model expects **150×150 RGB** images, normalized to `[0, 1]`. Adjust `preprocess_image()` in `app.py` if your model uses different input dimensions.

---

## 🔄 Mock Mode

If the model file is not found or TensorFlow is not installed, IrisDx automatically starts in **Mock Mode**:

- Confidence scores are randomly sampled between **85% – 99%**
- Subject IDs are randomly selected from a predefined pool (e.g., `437-R`, `715-L`)
- The UI displays a **yellow warning** in the Processing Mode field
- All animations, drag-drop, and scan sequences work identically to production mode

This is ideal for UI development, demos, and testing without a GPU.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, Flask |
| **ML / Inference** | TensorFlow / Keras, NumPy |
| **Image Processing** | OpenCV, Pillow |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **UI Design** | Glassmorphism, CSS animations, CSS custom properties |
| **Icons** | Phosphor Icons |
| **Fonts** | Google Fonts — Inter, Orbitron |
| **Dataset** | CASIA-Iris-Thousand |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for the biometrics & computer vision community

</div>
