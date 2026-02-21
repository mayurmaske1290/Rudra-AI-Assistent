"""Main decision-making logic for RUDRA."""

from __future__ import annotations

import os
from typing import Tuple

from core.system_control import (
    get_date_string,
    get_system_info,
    get_time_string,
    open_application,
    open_website,
    save_note,
    web_search,
)

try:
    from gpt4all import GPT4All
except ImportError:  # pragma: no cover - optional dependency at development time
    GPT4All = None  # type: ignore[assignment]

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

_local_model = None


def _ask_gpt4all(user_text: str) -> str:
    """Generate an answer using a local GPT4All model (fully offline)."""
    if GPT4All is None:
        return "Local LLM is not installed. Run pip install gpt4all and try again."

    model_name = os.getenv("GPT4ALL_MODEL", "ggml-gpt4all-j-v1.3-groovy.bin")
    model_path = os.getenv("GPT4ALL_MODEL_PATH", "").strip() or None
    max_tokens = int(os.getenv("RUDRA_MAX_TOKENS", "220"))

    global _local_model

    try:
        if _local_model is None:
            _local_model = GPT4All(model_name=model_name, model_path=model_path)

        prompt = (
            f"{_SYSTEM_PROMPT}\n"
            f"User: {user_text}\n"
            "Assistant:"
        )
        answer = _local_model.generate(
            prompt,
            max_tokens=max_tokens,
            temp=0.6,
        )
        cleaned = str(answer).strip()
        if cleaned:
            return cleaned
        return "I could not generate a local model response right now."
    except Exception as exc:  # noqa: BLE001
        return f"Local LLM failed: {exc}"


def _ask_openai(user_text: str) -> str:
    """Send a prompt to OpenAI and return a short spoken-ready answer."""
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return (
            "OpenAI is not configured yet. Set OPENAI_API_KEY in your environment, "
            "then ask again."
        )

    if OpenAI is None:
        return "OpenAI package is not installed. Run pip install openai and try again."

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


def _ask_llm(user_text: str) -> str:
    """Route chat answers to local GPT4All or OpenAI based on configuration."""
    provider = os.getenv("RUDRA_LLM_PROVIDER", "gpt4all").strip().lower()

    if provider == "gpt4all":
        return _ask_gpt4all(user_text)
    if provider == "openai":
        return _ask_openai(user_text)

    return "Invalid RUDRA_LLM_PROVIDER. Use gpt4all or openai."


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

    if "system info" in cmd or "about this system" in cmd:
        return get_system_info(), False

    if cmd.startswith("open "):
        target = cmd.replace("open ", "", 1).strip()

        if "." in target or target.startswith(("http", "www")):
            success, message = open_website(target)
            return message if success else f"Sorry, {message}", False

        success, message = open_application(target)
        return message if success else f"Sorry, {message}", False

    if cmd.startswith("search "):
        query = cmd.replace("search ", "", 1).strip()
        success, message = web_search(query)
        return message if success else f"Sorry, {message}", False

    if cmd.startswith("google "):
        query = cmd.replace("google ", "", 1).strip()
        success, message = web_search(query)
        return message if success else f"Sorry, {message}", False

    if cmd.startswith("note ") or cmd.startswith("take note "):
        note_text = cmd.replace("take note", "", 1).replace("note", "", 1).strip()
        success, message = save_note(note_text)
        return message if success else f"Sorry, {message}", False

    if "hello" in cmd or "hi" in cmd:
        return "Hello! How can I help you?", False

    if "your name" in cmd:
        return "I am RUDRA, your personal AI assistant.", False

    return _ask_llm(command), False
