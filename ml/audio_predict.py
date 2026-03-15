import whisper
import joblib
import sys

# load whisper model
audio_model = whisper.load_model("base")

# load ML models
vectorizer = joblib.load("ml/vectorizer.pkl")
dept_model = joblib.load("ml/department_model.pkl")
priority_model = joblib.load("ml/priority_model.pkl")

audio_path = sys.argv[1]

# convert audio to text
result = audio_model.transcribe(audio_path)
text = result["text"]

# vectorize
vec = vectorizer.transform([text])

# ML prediction
department = dept_model.predict(vec)[0]
priority = priority_model.predict(vec)[0]

print(text + "|" + department + "," + priority)