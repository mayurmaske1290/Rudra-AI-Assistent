# RUDRA - Voice-Controlled AI Assistant

RUDRA is a modular, voice-controlled Python assistant inspired by JARVIS.
It listens for a wake word (`rudra`), converts speech to text, interprets commands, and responds with text-to-speech.

## Project Structure

```text
Rudra-AI-Assistent/
├── rudra.py
├── requirements.txt
├── README.md
└── core/
    ├── brain.py
    ├── system_control.py
    └── voice.py
```

## Features
- Wake-word detection (`rudra`)
- Speech-to-text using `SpeechRecognition`
- Text-to-speech using `pyttsx3`
- Modular AI brain with `process_command(command)`
- Safe system control actions (time/date, app launching, simple OS commands)
- Cross-platform support (Windows + Linux)

---

## Windows 11 + VS Code (Recommended Setup)

### 1) Install prerequisites
- Install **Python 3.11 (recommended, including 3.11.9) or Python 3.12 (supported)** from: https://www.python.org/downloads/
  - During install, check **"Add Python to PATH"**.
  - Avoid Python 3.14 for now because voice dependencies are not fully compatible yet.
- Install **VS Code**: https://code.visualstudio.com/
- In VS Code, install extension: **Python** (by Microsoft).

### 2) Open project in VS Code
1. Open VS Code.
2. `File -> Open Folder...` and choose this project folder (`Rudra-AI-Assistent`).
3. Open terminal in VS Code: `Terminal -> New Terminal`.

### 3) Create and activate virtual environment (PowerShell)
```powershell
# If you installed Python 3.12 specifically, use: py -3.12 -m venv .venv
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run this once:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then run activation command again.

### 4) Install dependencies
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

> If `PyAudio` fails to install on Windows, use:
```powershell
pip install pipwin
pipwin install pyaudio
```
Then run:
```powershell
pip install SpeechRecognition pyttsx3
```

### 5) Select interpreter in VS Code
- Press `Ctrl+Shift+P` -> `Python: Select Interpreter` -> choose `.venv` interpreter.

### 6) Run assistant
```powershell
python rudra.py
```

Say commands like:
- "Rudra, what time is it?"
- "Rudra, open browser"
- "Rudra, date"
- "Rudra, exit"

---

## Linux Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python rudra.py
```

---

## Troubleshooting
- **I am on Python 3.11.9 — is that okay?** Yes. Python 3.11.9 is fully supported and recommended for this project.
- **Can I use Python 3.12?** Yes — 3.12 is supported and recommended alongside 3.11.
- **ImportError: `cannot import name speak from core.voice`**:
  - Make sure your project has `core/voice.py` from this repo and not an older copy.
  - Ensure `core/__init__.py` exists (it does in this version).
  - Run from the project root in VS Code terminal: `python rudra.py`.
- **No microphone detected**: ensure your input device is connected and allowed in Windows privacy settings.
- **No voice output**: check system output device and volume.
- **Speech not recognized**: speak clearly after wake word, and check internet connection (Google recognizer needs network).

## Safety Note
This project is educational and intentionally avoids harmful functionality.
