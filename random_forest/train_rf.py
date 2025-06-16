import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
from joblib import dump
from sklearn.model_selection import cross_val_score

# Load labeled dataset (columns: text, intent)
df = pd.read_csv("intent_dataset.csv")

# Feature extraction (TF-IDF)
from sklearn.feature_extraction.text import TfidfVectorizer
tfidf = TfidfVectorizer()
X = tfidf.fit_transform(df['text'])
y = df['intent']

# Initialize model
model = RandomForestClassifier(n_estimators=100)

# Perform 10-Fold Cross-Validation
cv_scores = cross_val_score(model, X, y, cv=10, scoring='accuracy')

# Print table report
print("10-Fold Cross-Validation Accuracy Report")
print("----------------------------------------")
print(f"{'Fold':<6} | {'Accuracy':<8}")
print("-" * 20)
for i, score in enumerate(cv_scores, 1):
    print(f"{i:<6} | {score:.4f}")
print("-" * 20)
print(f"Mean    | {cv_scores.mean():.4f}")
print(f"Std Dev | {cv_scores.std():.4f}")

# Train model on full dataset
model.fit(X, y)

# Save artifacts with joblib and verification
from joblib import dump, load
try:
    # Save with joblib which handles scikit-learn objects better
    dump(model, "rf_model.joblib")
    dump(tfidf, "tfidf_vectorizer.joblib")
    
    # Verify files can be loaded
    test_model = load("rf_model.joblib")
    test_vectorizer = load("tfidf_vectorizer.joblib")
    print("Successfully saved and verified model and vectorizer")
    
    # Move files to project root
    import shutil
    try:
        shutil.move("rf_model.joblib", "../rf_model.joblib")
        shutil.move("tfidf_vectorizer.joblib", "../tfidf_vectorizer.joblib")
        print("Moved model files to project root")
    except Exception as e:
        print(f"Warning: Could not move files to root: {str(e)}")
        
except Exception as e:
    raise RuntimeError(f"Error saving model files: {str(e)}")
