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
- **Gate matching is substring, both ways.** A symptom matches a rule term if
  either contains the other, so it has no idea of negation ("no chest pain"
  trips the cardiac rule), a one-letter input like "a" trips all eleven rules,
  and hyphens are stripped rather than spaced ("passed-out" misses the "passed
  out" synonym). The first two fail toward referral; the third does not. These
  cases are pinned in `frontend_v2/lib/gate/parity.fixtures.json`, so fixing
  the matcher shows up as a reviewed fixture diff rather than a silent change.
  The coverage matrix on `/developer` lists 49 phrasings against the 11 rules;
  21 do not behave as a clinician would expect (12 English misses, all 7
  romanised Hindi phrasings, 2 over-fires).
- **OCR.** Tesseract with no preprocessing; 77.5 % mean confidence on the two
  sample documents that carry a text layer. Handwriting is not read.

## Data

- **Accounts exist but are minimal.** Local username/password (scrypt-hashed),
  four roles (ANM, CHO, MO, admin), cookie sessions. There is no password
  reset flow in the UI (an admin can reset one via the API), no lockout after
  repeated failed logins, no audit of failed attempts, and only one facility
  (no multi-site accounts). The very first account created on a machine is
  always admin, by design, so there is a way in.
- **The event log is per case.** Every change to a stored case is recorded
  with the real signed-in actor and time once accounts exist (before that,
  while no account has been created yet, the API is open and actor is
  whatever the client claims). Deletes are hard deletes of the case; the
  deletion event itself is kept.
- **Plain SQLite** on one disk. No encryption at rest, no backups, no retention
  policy. Intake uploads are deleted after the run, so the document the model
  assessed cannot be re-viewed; files attached to a case afterwards are kept on
  disk unencrypted.
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
