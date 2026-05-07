import fitz # PyMuPDF
import spacy
import re
from typing import List

# Predefined dictionary of technical skills
TECHNICAL_SKILLS = {
    "python", "java", "c++", "c#", "javascript", "typescript", "react", "angular", "vue",
    "docker", "kubernetes", "sql", "nosql", "mongodb", "postgresql", "mysql",
    "fastapi", "django", "flask", "spring boot", "node.js", "express",
    "aws", "gcp", "azure", "machine learning", "deep learning", "nlp",
    "data science", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "git", "ci/cd", "jenkins", "github actions", "gitlab ci", "agile", "scrum",
    "html", "css", "linux", "bash", "go", "rust", "ruby"
}

_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return text

def extract_skills_from_text(text: str) -> List[str]:
    text_lower = text.lower()
    
    # Load spacy model for potential tokenization cleanup if needed
    nlp = get_nlp()
    doc = nlp(text_lower)
    
    extracted = set()
    for skill in TECHNICAL_SKILLS:
        # Use regex to match whole words/phrases
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            extracted.add(skill)
            
    return list(extracted)

def extract_education_from_text(text: str) -> List[str]:
    keywords = ["bachelor", "master", "phd", "degree", "university", "college", "institute", "b.s", "m.s", "b.sc", "btech", "mtech"]
    text_lower = text.lower()
    extracted = set()
    for kw in keywords:
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, text_lower):
            extracted.add(kw)
            
    return list(extracted)
