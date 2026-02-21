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
- Local GPT4All conversational answers (free, on-device)
- Optional OpenAI cloud answers
- Modular AI brain with `process_command(command)`
- Safe system actions: open apps/websites, Google search, quick notes, date/time, and system info
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


### 4.1) Configure Local LLM (GPT4All - truly free, on your computer)
In PowerShell (inside your activated `.venv` terminal):
```powershell
setx RUDRA_LLM_PROVIDER "gpt4all"
setx GPT4ALL_MODEL "ggml-gpt4all-j-v1.3-groovy.bin"
```

Optional (if your model file is in a custom folder):
```powershell
setx GPT4ALL_MODEL_PATH "D:\models"
```

RUDRA will use GPT4All locally for open-ended questions (no API cost).

### 4.2) Optional OpenAI cloud mode
If you prefer OpenAI instead of local GPT4All:
```powershell
setx RUDRA_LLM_PROVIDER "openai"
setx OPENAI_API_KEY "your_api_key_here"
setx OPENAI_MODEL "gpt-4o-mini"
```
Then **close and reopen** the VS Code terminal.

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

### Examples for smarter assistant usage
- "Rudra, search best Python tutorial"
- "Rudra, open youtube.com"
- "Rudra, take note buy groceries"
- "Rudra, system info"
- "Rudra, explain quantum computing" (answered by local GPT4All/OpenAI and spoken aloud)

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
- **Local GPT4All not working**: ensure `gpt4all` is installed, `RUDRA_LLM_PROVIDER=gpt4all`, and `GPT4ALL_MODEL` points to a valid local model file.
- **OpenAI answers not working**: set `RUDRA_LLM_PROVIDER=openai`, verify `OPENAI_API_KEY`, restart terminal, and ensure `openai` package is installed from `requirements.txt`.
- **Can it do every task like Google Assistant?** RUDRA supports many common tasks and can answer general questions via OpenAI, but it is still a local Python assistant with a safe, limited automation scope.

## Safety Note
This project is educational and intentionally avoids harmful functionality.
