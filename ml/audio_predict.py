import whisper
import joblib
import sys

# Load whisper model
audio_model = whisper.load_model("base")

# Load ML models
vectorizer = joblib.load("ml/vectorizer.pkl")
dept_model = joblib.load("ml/department_model.pkl")
priority_model = joblib.load("ml/priority_model.pkl")

audio_path = sys.argv[1]

# Convert audio → text
result = audio_model.transcribe(audio_path)
text = result["text"]

# Convert text → vector
vec = vectorizer.transform([text])

# ML prediction
department = dept_model.predict(vec)[0]
priority = priority_model.predict(vec)[0]

print(text + "|" + department + "," + priority)