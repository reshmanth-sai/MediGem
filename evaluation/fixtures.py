"""Dynamic Fixture Manager for discovering test samples across medical modalities."""

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional

from backend.config.constants import ImageType, MedicalModality

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEST_FIXTURES_DIR = PROJECT_ROOT / "tests" / "fixtures"
SAMPLE_DATA_DIR = PROJECT_ROOT / "sample_data"


@dataclass
class TestFixtureItem:
    """Fixture item container carrying metadata and file paths."""
    fixture_id: str
    modality: MedicalModality
    input_type: str
    file_path: Optional[str]
    symptoms: List[str]
    description: str


class FixtureManager:
    """Dynamic fixture manager discovering and categorizing medical input samples."""

    def __init__(self, fixtures_dir: Path = TEST_FIXTURES_DIR) -> None:
        self.fixtures_dir = fixtures_dir
        self._fixtures: Dict[str, TestFixtureItem] = {}
        self.discover_fixtures()

    def discover_fixtures(self) -> List[TestFixtureItem]:
        """Discover available synthetic test fixtures and sample data."""
        self._fixtures.clear()

        # 1. ECG Fixture
        ecg_path = self.fixtures_dir / "sample_ecg.png"
        if ecg_path.exists():
            self.register_fixture(
                TestFixtureItem(
                    fixture_id="FIX-ECG-01",
                    modality=MedicalModality.ECG,
                    input_type="IMAGE",
                    file_path=str(ecg_path),
                    symptoms=["Chest tightness", "Palpitations"],
                    description="12-Lead Rhythm Strip Image",
                )
            )

        # 2. Lab Report PDF Fixture
        report_path = self.fixtures_dir / "sample_report.pdf"
        if report_path.exists():
            self.register_fixture(
                TestFixtureItem(
                    fixture_id="FIX-REPORT-01",
                    modality=MedicalModality.LAB_REPORT,
                    input_type="PDF",
                    file_path=str(report_path),
                    symptoms=["Fatigue", "Weakness"],
                    description="Blood Lab Report PDF Document",
                )
            )

        # 3. Prescription Fixture
        rx_path = self.fixtures_dir / "sample_prescription.png"
        if rx_path.exists():
            self.register_fixture(
                TestFixtureItem(
                    fixture_id="FIX-RX-01",
                    modality=MedicalModality.PRESCRIPTION,
                    input_type="IMAGE",
                    file_path=str(rx_path),
                    symptoms=["Skin rash"],
                    description="Prescription Scan Image",
                )
            )

        # 4. Wound Fixture
        wound_path = self.fixtures_dir / "sample_wound.png"
        if wound_path.exists():
            self.register_fixture(
                TestFixtureItem(
                    fixture_id="FIX-WOUND-01",
                    modality=MedicalModality.WOUND,
                    input_type="IMAGE",
                    file_path=str(wound_path),
                    symptoms=["Laceration on right forearm"],
                    description="Wound Inspection Photo",
                )
            )

        # 5. Plain Text Fixture
        self.register_fixture(
            TestFixtureItem(
                fixture_id="FIX-TXT-01",
                modality=MedicalModality.GENERAL,
                input_type="TEXT",
                file_path=None,
                symptoms=["Fever", "Cough", "Headache"],
                description="Plain Text Symptom Presentation",
            )
        )

        return list(self._fixtures.values())

    def register_fixture(self, fixture: TestFixtureItem) -> None:
        """Register a test fixture item."""
        self._fixtures[fixture.fixture_id] = fixture

    def get_fixture(self, fixture_id: str) -> Optional[TestFixtureItem]:
        """Retrieve fixture by ID."""
        return self._fixtures.get(fixture_id)

    def get_fixtures_by_modality(self, modality: MedicalModality) -> List[TestFixtureItem]:
        """Filter fixtures by target modality."""
        return [f for f in self._fixtures.values() if f.modality == modality]


# Global Singleton FixtureManager Instance
fixture_manager = FixtureManager()
