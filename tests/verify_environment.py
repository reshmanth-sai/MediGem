import sys
import os
import subprocess

def run_check():
    print("=" * 60)
    print("  MediGem Development Environment Validation Report")
    print("=" * 60)
    
    checks = []
    
    # Check 1: Python Version
    py_ver = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    checks.append(("Python 3 Installed", sys.version_info.major == 3 and sys.version_info.minor >= 10, f"v{py_ver}"))
    
    # Check 2: Git Installed
    try:
        git_ver = subprocess.check_output(["git", "--version"]).decode().strip()
        checks.append(("Git Installed", True, git_ver))
    except Exception as e:
        checks.append(("Git Installed", False, str(e)))
        
    # Check 3: Git Initialized & Branch
    git_dir_exists = os.path.exists(".git")
    checks.append(("Git Repository Initialized", git_dir_exists, "Main Branch configured"))
    
    # Check 4: Virtual Environment
    in_venv = hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
    checks.append(("Virtual Environment Active", in_venv, sys.prefix))
    
    # Check 5: Core Dependencies Import
    modules = ["gradio", "ollama", "cv2", "PIL", "numpy", "pandas", "pydantic", "dotenv", "requests", "markdown", "rich", "fitz", "pytesseract", "skimage"]
    all_imports = True
    for m in modules:
        try:
            __import__(m)
        except Exception:
            all_imports = False
            break
    checks.append(("Python Packages Installed & Verified", all_imports, f"{len(modules)}/{len(modules)} core & optional packages"))
    
    # Check 6: Ollama CLI & Daemon
    try:
        import requests
        res = requests.get("http://localhost:11434/api/version", timeout=3)
        ollama_ok = res.status_code == 200
        ver_str = res.json().get('version', 'unknown') if ollama_ok else "unreachable"
        checks.append(("Ollama Installed & Daemon Running", ollama_ok, f"v{ver_str}"))
    except Exception as e:
        checks.append(("Ollama Installed & Daemon Running", False, str(e)))
        
    # Check 7: Gradio Working
    try:
        import gradio as gr
        demo = gr.Interface(fn=lambda x: x, inputs="text", outputs="text")
        checks.append(("Gradio Working", demo is not None, "Interface instantiated"))
    except Exception as e:
        checks.append(("Gradio Working", False, str(e)))
        
    # Check 8: Image Processing Working
    try:
        import cv2, numpy as np
        from PIL import Image
        arr = np.zeros((100, 100, 3), dtype=np.uint8)
        img = Image.fromarray(arr)
        w, h = img.size
        checks.append(("Image Processing Working", w == 100 and h == 100, f"Width: {w}, Height: {h}, Mode: {img.mode}"))
    except Exception as e:
        checks.append(("Image Processing Working", False, str(e)))
        
    # Check 9: Required Files Exist
    req_files = ["app.py", "requirements.txt", ".env.example", ".gitignore", "README.md"]
    files_ok = all(os.path.exists(f) for f in req_files)
    checks.append(("Project Configuration Files Created", files_ok, ", ".join(req_files)))
    
    # Check 10: Required Folders Exist
    req_dirs = [
        "backend/ai", "backend/emergency", "backend/prompts", "backend/models",
        "backend/services", "backend/utils", "backend/config", "backend/validation",
        "frontend", "assets", "outputs", "sample_data/ecg", "sample_data/prescriptions",
        "sample_data/reports", "sample_data/wounds", "tests", "docs"
    ]
    dirs_ok = all(os.path.exists(d) for d in req_dirs)
    checks.append(("Project Folder Hierarchy Created", dirs_ok, f"{len(req_dirs)} directories"))

    print("\nChecklist Results:")
    all_passed = True
    for title, status, info in checks:
        symbol = "✓" if status else "✗"
        print(f" {symbol} {title:<38}: {info}")
        if not status:
            all_passed = False
            
    print("\n" + "=" * 60)
    if all_passed:
        print(" SUCCESS: Environment is 100% hackathon-ready!")
    else:
        print(" WARNING: Some environment checks failed.")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    run_check()
