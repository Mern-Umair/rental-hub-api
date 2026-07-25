import speech_recognition as sr
import pyttsx3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.rag_agent import rag_response

engine = pyttsx3.init()
engine.setProperty('rate', 140)

def speak(text):
    print(f"\nAI: {text}")
    engine.say(text)
    engine.runAndWait()

def listen():
    recognizer = sr.Recognizer()
    recognizer.energy_threshold = 300
    recognizer.pause_threshold = 1.0

    with sr.Microphone() as source:
        print("\nSun raha hoon — bolein!")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        try:
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=8)
        except sr.WaitTimeoutError:
            return None

    try:
        text = recognizer.recognize_google(audio, language="ur-PK")
        print(f"Aapne kaha: {text}")
        return text
    except:
        try:
            text = recognizer.recognize_google(audio, language="en-US")
            print(f"Aapne kaha: {text}")
            return text
        except:
            return None

def rag_voice_agent():
    speak("Assalam o Alaikum! Main aapka Property Assistant hoon!")
    speak("Koi bhi property poochh sakte hain — city, budget, bedrooms!")

    while True:
        query = listen()

        if query is None:
            speak("Samajh nahi aaya — dobara bolein!")
            continue

        if any(word in query.lower() for word in ["exit", "bye", "band karo", "shukriya"]):
            speak("Allah Hafiz! Dobara aaiye!")
            break

        response = rag_response(query)
        speak(response)

if __name__ == "__main__":
    rag_voice_agent()