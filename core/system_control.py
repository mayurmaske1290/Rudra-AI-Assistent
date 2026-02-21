"""Safe system control helpers for RUDRA."""

from __future__ import annotations

import datetime
import platform
import subprocess
import webbrowser
from pathlib import Path
from typing import Tuple


def get_time_string() -> str:
    """Return current local time as a readable string."""
    return datetime.datetime.now().strftime("%I:%M %p")


def get_date_string() -> str:
    """Return current local date as a readable string."""
    return datetime.datetime.now().strftime("%A, %B %d, %Y")


def get_system_info() -> str:
    """Return a short system description."""
    return f"You are running {platform.system()} {platform.release()} on {platform.machine()}."


def open_application(app_name: str) -> Tuple[bool, str]:
    """
    Open common applications in a cross-platform-safe way.

    Returns:
        (success, message)
    """
    system_name = platform.system().lower()
    name = app_name.lower().strip()

    app_map = {
        "browser": {
            "windows": ["cmd", "/c", "start", "https://www.google.com"],
            "linux": ["xdg-open", "https://www.google.com"],
        },
        "notepad": {
            "windows": ["notepad"],
            "linux": ["gedit"],
        },
        "calculator": {
            "windows": ["calc"],
            "linux": ["gnome-calculator"],
        },
        "terminal": {
            "windows": ["cmd"],
            "linux": ["x-terminal-emulator"],
        },
        "settings": {
            "windows": ["cmd", "/c", "start", "ms-settings:"],
            "linux": ["gnome-control-center"],
        },
    }

    if name not in app_map:
        return False, f"I do not know how to open {app_name} yet."

    command = app_map[name].get(system_name)
    if not command:
        return False, f"Opening {app_name} is not configured for this OS."

    try:
        subprocess.Popen(command, shell=False)
        return True, f"Opening {app_name}."
    except FileNotFoundError:
        return False, f"{app_name} is not installed on this system."
    except Exception as exc:  # noqa: BLE001
        return False, f"I could not open {app_name}: {exc}"


def open_website(url: str) -> Tuple[bool, str]:
    """Open a website in the default browser."""
    cleaned = url.strip()
    if not cleaned:
        return False, "Please provide a website."

    if not cleaned.startswith(("http://", "https://")):
        cleaned = f"https://{cleaned}"

    try:
        webbrowser.open(cleaned)
        return True, f"Opening {cleaned}."
    except Exception as exc:  # noqa: BLE001
        return False, f"I could not open the website: {exc}"


def web_search(query: str) -> Tuple[bool, str]:
    """Search Google for a given query using default browser."""
    q = query.strip()
    if not q:
        return False, "Please say what you want to search for."

    search_url = f"https://www.google.com/search?q={q.replace(' ', '+')}"
    return open_website(search_url)


def save_note(note_text: str) -> Tuple[bool, str]:
    """Save a quick note to a local notes file."""
    cleaned = note_text.strip()
    if not cleaned:
        return False, "Please tell me what note to save."

    notes_file = Path("rudra_notes.txt")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        with notes_file.open("a", encoding="utf-8") as file:
            file.write(f"[{timestamp}] {cleaned}\n")
        return True, "I saved your note in rudra_notes.txt."
    except Exception as exc:  # noqa: BLE001
        return False, f"I could not save your note: {exc}"
