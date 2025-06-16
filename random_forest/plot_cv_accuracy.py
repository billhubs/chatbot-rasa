import matplotlib.pyplot as plt
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer

# Load dataset
df = pd.read_csv("random_forest/intent_dataset.csv")

# Feature extraction
tfidf = TfidfVectorizer()
X = tfidf.fit_transform(df['text'])
y = df['intent']

# Model
model = RandomForestClassifier(n_estimators=100)

# Cross-validation
cv_scores = cross_val_score(model, X, y, cv=10, scoring='accuracy')

# Plot
plt.figure(figsize=(8, 6))
plt.boxplot(cv_scores, vert=True, patch_artist=True, labels=['Random Forest'])
plt.title('10-Fold Cross-Validation Accuracy')
plt.ylabel('Accuracy')
plt.ylim(0, 1)
plt.grid(axis='y')
plt.savefig('random_forest/cv_accuracy_boxplot.png')
plt.show()

# Print results
print("10-Fold Cross-Validation Accuracy per fold:")
for i, score in enumerate(cv_scores, 1):
    print(f"Fold {i}: {score:.4f}")
print(f"Mean Accuracy: {cv_scores.mean():.4f}")
print(f"Std Dev: {cv_scores.std():.4f}")
