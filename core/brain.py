"""Main decision-making logic for RUDRA."""

from __future__ import annotations

import os
from typing import Tuple

from core.system_control import get_date_string, get_time_string, open_application

try:
    from openai import OpenAI
except ImportError:  # pragma: no cover - optional dependency at development time
    OpenAI = None  # type: ignore[assignment]


EXIT_COMMANDS = {"exit", "quit", "stop", "goodbye", "shutdown"}

_SYSTEM_PROMPT = (
    "You are RUDRA, a concise, helpful voice assistant. "
    "Reply in plain text suitable for speech output. "
    "Keep answers short unless the user asks for details."
)


def _ask_openai(user_text: str) -> str:
    """Send a prompt to OpenAI and return a short spoken-ready answer."""
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return (
            "OpenAI is not configured yet. Set OPENAI_API_KEY in your environment, "
            "then ask again."
        )

    if OpenAI is None:
        return (
            "OpenAI package is not installed. Run pip install openai and try again."
        )

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    try:
        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=model,
            input=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": user_text},
            ],
            max_output_tokens=220,
        )
        answer = (response.output_text or "").strip()
        if answer:
            return answer
        return "I could not generate a response right now."
    except Exception as exc:  # noqa: BLE001
        return f"I could not reach OpenAI right now: {exc}"


def process_command(command: str) -> Tuple[str, bool]:
    """
    Interpret a user command and return a spoken response.

    Returns:
        response_text, should_exit
    """
    cmd = command.lower().strip()

    if not cmd:
        return "Please say a command.", False

    if any(word in cmd for word in EXIT_COMMANDS):
        return "Goodbye. RUDRA is going offline.", True

    if "time" in cmd:
        return f"The current time is {get_time_string()}.", False

    if "date" in cmd or "day" in cmd:
        return f"Today is {get_date_string()}.", False

    if cmd.startswith("open "):
        app = cmd.replace("open ", "", 1).strip()
        success, message = open_application(app)
        return message if success else f"Sorry, {message}", False

    if "hello" in cmd or "hi" in cmd:
        return "Hello! How can I help you?", False

    if "your name" in cmd:
        return "I am RUDRA, your personal AI assistant.", False

    # For all other commands, fall back to OpenAI for natural conversation.
    return _ask_openai(command), False
