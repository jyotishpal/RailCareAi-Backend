import joblib
import sys

# load ML models
vectorizer = joblib.load("ml/vectorizer.pkl")
model = joblib.load("ml/department_model.pkl")
priority_model = joblib.load("ml/priority_model.pkl")

text = sys.argv[1]

vec = vectorizer.transform([text])

department = model.predict(vec)[0]
priority = priority_model.predict(vec)[0]

# confidence
dept_conf = model.predict_proba(vec).max()
priority_conf = priority_model.predict_proba(vec).max()

confidence = round(max(dept_conf, priority_conf) * 100, 2)

print(f"{department},{priority},{confidence}")