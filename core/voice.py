"""Voice input and output utilities for RUDRA."""

from __future__ import annotations

import pyttsx3
import speech_recognition as sr

_tts_engine: pyttsx3.Engine | None = None


def _get_tts_engine() -> pyttsx3.Engine | None:
    """Create and cache the TTS engine lazily."""
    global _tts_engine
    if _tts_engine is not None:
        return _tts_engine

    try:
        _tts_engine = pyttsx3.init()
        _tts_engine.setProperty("rate", 175)
    except Exception as exc:  # noqa: BLE001
        print(f"TTS engine unavailable: {exc}")
        _tts_engine = None
    return _tts_engine


def speak(text: str) -> None:
    """Convert text to speech and print it for debugging."""
    print(f"RUDRA: {text}")
    engine = _get_tts_engine()
    if engine is None:
        return

    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as exc:  # noqa: BLE001
        print(f"TTS playback failed: {exc}")


def listen_for_speech(timeout: int = 5, phrase_time_limit: int = 10) -> str:
    """
    Listen from default microphone and return recognized text.

    Returns an empty string on recognition failure/timeouts.
    """
    recognizer = sr.Recognizer()

    try:
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            print("Listening...")

            try:
                audio = recognizer.listen(
                    source,
                    timeout=timeout,
                    phrase_time_limit=phrase_time_limit,
                )
            except sr.WaitTimeoutError:
                return ""
    except Exception as exc:  # noqa: BLE001
        print(f"Microphone not available: {exc}")
        return ""

    try:
        text = recognizer.recognize_google(audio)
        print(f"YOU: {text}")
        return text
    except sr.UnknownValueError:
        return ""
    except sr.RequestError as exc:
        print(f"Speech recognition service unavailable: {exc}")
        return ""
