# The pipeline API only. The frontend is meant to be run with `npm run dev`
# for hot reload; see README.md "Run it".
FROM python:3.12-slim

# tesseract-ocr: the OCR engine pytesseract shells out to.
# libglib2.0-0: opencv-python-headless's one remaining runtime library
# (the "headless" build otherwise skips the GUI/libGL stack entirely,
# which is what a server that only calls cv2's image-processing functions
# needs).
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# requirements-api.txt, not the root requirements.txt: see that file's own
# comment for why (the root file also pins the unused Gradio prototype,
# which fails to install in this image).
COPY requirements-api.txt .
RUN pip install --no-cache-dir -r requirements-api.txt

COPY backend ./backend

# MEDIGEM_DB_PATH defaults to data/medigem.db under this directory; the
# compose file mounts a volume there so cases and accounts survive a
# container restart. CaseStore/UserStore create the directory themselves.
EXPOSE 8000

CMD ["uvicorn", "backend.api.app:app", "--host", "0.0.0.0", "--port", "8000"]
