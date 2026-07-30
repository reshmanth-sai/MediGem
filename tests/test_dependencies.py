import sys

def test_imports():
    modules = [
        ("gradio", "Gradio"),
        ("ollama", "Ollama Python Client"),
        ("cv2", "OpenCV"),
        ("PIL", "Pillow"),
        ("numpy", "NumPy"),
        ("pandas", "Pandas"),
        ("pydantic", "Pydantic"),
        ("dotenv", "Python Dotenv"),
        ("requests", "Requests"),
        ("markdown", "Markdown"),
        ("rich", "Rich"),
        ("fitz", "PyMuPDF"),
        ("pytesseract", "PyTesseract"),
        ("skimage", "Scikit-Image"),
    ]
    
    failed = []
    for mod_name, label in modules:
        try:
            __import__(mod_name)
            print(f"✓ {label} ({mod_name}) imported successfully.")
        except Exception as e:
            print(f"✗ {label} ({mod_name}) failed: {e}")
            failed.append(mod_name)
            
    if failed:
        print(f"\nFailed modules: {failed}")
        sys.exit(1)
    else:
        print("\nAll required dependencies verified successfully!")

if __name__ == "__main__":
    test_imports()
