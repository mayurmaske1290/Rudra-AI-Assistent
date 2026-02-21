"""Entry point for the RUDRA voice assistant."""

from core import voice
from core.brain import process_command

WAKE_WORD = "rudra"


def strip_wake_word(text: str, wake_word: str) -> str:
    """Remove wake-word prefixes like 'rudra' or 'rudra,' from input text."""
    lowered = text.strip().lower()
    if lowered.startswith(wake_word):
        return lowered[len(wake_word) :].lstrip(" ,")
    return lowered


def run_assistant() -> None:
    """Main assistant loop."""
    voice.speak("RUDRA is online. Say Rudra to wake me up.")

    while True:
        spoken_text = voice.listen_for_speech(timeout=5, phrase_time_limit=7)
        if not spoken_text:
            continue

        normalized = spoken_text.lower()

        if WAKE_WORD not in normalized:
            continue

        command = strip_wake_word(normalized, WAKE_WORD)
        if not command:
            voice.speak("Yes? I am listening.")
            command = voice.listen_for_speech(timeout=6, phrase_time_limit=10)
            if not command:
                voice.speak("I did not catch that.")
                continue

        response, should_exit = process_command(command)
        voice.speak(response)

        if should_exit:
            break


if __name__ == "__main__":
    run_assistant()
