"""Main decision-making logic for RUDRA."""

from typing import Tuple

from core.system_control import get_date_string, get_time_string, open_application


EXIT_COMMANDS = {"exit", "quit", "stop", "goodbye", "shutdown"}


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

    return "I understood you, but I do not support that command yet.", False
