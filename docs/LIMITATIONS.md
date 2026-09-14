# Limitations

Read this before drawing any conclusion from the product page's figures.

## Clinical

- **Not validated.** No labelled dataset, no clinician agreement study, no
  outcome data. The measured figures are latency and schema validity. Nothing
  measured says whether a risk level, red flag or next step is correct.
- **Decision support, not diagnosis.** Every output has
  `requires_human_review: true` by default and the clinician decides. MediGem
  is not a medical device and is not certified as one.
- **Small model.** `gemma3:4b` with no clinical fine-tuning. Observations
  occasionally come back empty; assessments can be generic. Confidence is
  qualitative (low / medium / high) and uncalibrated.
- **Small gate.** 11 rules across 11 categories with one English synonym
  table. Symptoms in Hindi or transliterated Hindi do not match. The assistant's
  free-text symptom extraction is a substring list.
- **OCR.** Tesseract with no preprocessing; 77.5 % mean confidence on the two
  sample documents that carry a text layer. Handwriting is not read.

## Data

- **No accounts.** The signed-in clinician is a fixed demo persona. Sign-offs
  are recorded under that name.
- **No audit trail** beyond the single review row on a case. Deletes are hard
  deletes.
- **Plain SQLite** on one disk. No encryption at rest, no backups, no retention
  policy. Uploaded images are deleted after the run, so the document behind a
  stored assessment cannot be re-viewed.
- **API key is a shared string** that also ships in the browser bundle when set
  for the site. It deters casual abuse; it is not authentication.

## Operations

- **One machine.** Single-process API, in-memory rate limiter, no metrics. A
  hung model call holds the worker for up to the 120 s client timeout.
- **Hardware.** 9.1 s median is an Apple M5 figure. A CPU-only laptop should
  expect 60–120 s per assessment and needs 16 GB to be comfortable.
- **No installer.** Running it means Python, Ollama, `uvicorn` and a Node
  process. "Offline" means a laptop serving itself over the clinic's network.
- **Hosted demo cannot run the model.** medigem.vercel.app replays recorded
  runs and says so on every screen.

## Safety guard

The output guard is regex-based. It catches doses (`650 mg`, `2 tablets`),
`prescribe …`, `dose: N`, and certainty claims (`diagnosed with`,
`definitive diagnosis`). It excludes lab concentrations (`13.8 g/dL`) after a
bug that marked every lab-report run degraded. It will miss phrasings it has
not seen; it is a backstop, not a guarantee.
