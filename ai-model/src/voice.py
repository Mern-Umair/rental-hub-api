import speech_recognition as sr
import pyttsx3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.predict import predict_with_suggestions

engine = pyttsx3.init()
engine.setProperty('rate', 140)
engine.setProperty('volume', 1.0)

def speak(text):
    print(f"\nAI: {text}")
    engine.say(text)
    engine.runAndWait()

def listen():
    recognizer = sr.Recognizer()
    recognizer.energy_threshold = 300
    recognizer.dynamic_energy_threshold = True
    recognizer.pause_threshold = 1.0

    with sr.Microphone() as source:
        print("\nMicrophone ready — bol sakte hain...")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        
        try:
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=8)
        except sr.WaitTimeoutError:
            return None

    try:
        text = recognizer.recognize_google(audio, language="ur-PK")
        print(f"Tumne kaha: {text}")
        return text
    except:
        try:
            text = recognizer.recognize_google(audio, language="en-US")
            print(f"Tumne kaha: {text}")
            return text
        except sr.UnknownValueError:
            return None
        except sr.RequestError:
            print("Internet connection check karo!")
            return None

def voice_chat():
    speak("Assalam o Alaikum! Property dhundne mein madad kar sakta hoon!")
    speak("Lahore, Karachi ya koi bhi city ka ghar ya flat poochh sakte hain!")

    while True:
        text = listen()

        if text is None:
            speak("Kuch samajh nahi aaya — dobara bolein please!")
            continue

        if any(word in text.lower() for word in ["exit", "band karo", "bye", "quit"]):
            speak("Allah Hafiz! Property search ke liye dobara aaiye!")
            break

        result = predict_with_suggestions(text)
        speak(result["response"])

        if result["suggestions"]:
            speak("Kya aap ye bhi dekhna chahenge: " + " ya ".join(result["suggestions"]))

if __name__ == "__main__":
    voice_chat()