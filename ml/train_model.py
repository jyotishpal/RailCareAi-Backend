import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# load dataset
data = pd.read_csv("dataset.csv")

X = data["description"]
y_department = data["department"]
y_priority = data["priority"]

# convert text to vectors
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# train department model
dept_model = LogisticRegression()
dept_model.fit(X_vec, y_department)

# train priority model
priority_model = LogisticRegression()
priority_model.fit(X_vec, y_priority)

# save models
joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(dept_model, "department_model.pkl")
joblib.dump(priority_model, "priority_model.pkl")

print("Model trained successfully")