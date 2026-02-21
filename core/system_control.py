"""Safe system control helpers for RUDRA."""

import datetime
import os
import platform
import subprocess
from typing import Tuple


def get_time_string() -> str:
    """Return current local time as a readable string."""
    return datetime.datetime.now().strftime("%I:%M %p")


def get_date_string() -> str:
    """Return current local date as a readable string."""
    return datetime.datetime.now().strftime("%A, %B %d, %Y")


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
            "windows": ["start", ""],
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
    }

    if name not in app_map:
        return False, f"I do not know how to open {app_name} yet."

    command = app_map[name].get(system_name)
    if not command:
        return False, f"Opening {app_name} is not configured for this OS."

    try:
        if system_name == "windows":
            # 'start' is a shell builtin; use shell=True only for this controlled case.
            if command[0] == "start":
                os.system("start https://www.google.com")
            else:
                subprocess.Popen(command, shell=False)
        else:
            subprocess.Popen(command, shell=False)

        return True, f"Opening {app_name}."
    except FileNotFoundError:
        return False, f"{app_name} is not installed on this system."
    except Exception as exc:  # noqa: BLE001
        return False, f"I could not open {app_name}: {exc}"
