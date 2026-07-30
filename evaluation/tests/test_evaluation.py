"""Unit test suite for Evaluation, Validation, and Benchmarking Framework (Phase 11)."""

import unittest
from pathlib import Path

from evaluation.fixtures import fixture_manager
from evaluation.latency import LatencyProfiler, LatencyRecord
from evaluation.metrics import EvaluationMetricEntry, MetricsCollector
from evaluation.report_generator import report_generator
from evaluation.safety_audit import safety_auditor
from evaluation.screenshots import screenshot_generator


class TestEvaluationFramework(unittest.TestCase):
    """Test suite verifying FixtureManager, SafetyAuditor, LatencyProfiler, MetricsCollector, ReportGenerator, and ScreenshotGenerator."""

    # 1. Test Fixture Discovery
    def test_fixture_discovery(self) -> None:
        fixtures = fixture_manager.discover_fixtures()
        self.assertGreater(len(fixtures), 0)
        ecg_fixtures = fixture_manager.get_fixtures_by_modality("ECG")  # type: ignore
        self.assertTrue(any(f.fixture_id == "FIX-ECG-01" for f in fixtures))

    # 2. Test Safety Audit
    def test_safety_audit(self) -> None:
        audit = safety_auditor.audit_emergency_rules()
        self.assertTrue(audit["all_detected"])
        self.assertTrue(audit["passed"])
        self.assertLess(audit["max_duration_ms"], 5.0)

    # 3. Test Metrics Collector
    def test_metrics_collector(self) -> None:
        collector = MetricsCollector()
        collector.record_run(
            EvaluationMetricEntry(
                fixture_id="FIX-TEST-01",
                modality="LAB_REPORT",
                risk_level="LOW",
                safety_pass=True,
                validation_pass=True,
                ocr_confidence=0.98,
                completeness="COMPLETE",
                quality_level="GOOD",
                duration_ms=120.0,
            )
        )
        metrics = collector.compute_metrics()
        self.assertEqual(metrics["total_runs"], 1)
        self.assertEqual(metrics["safety_pass_rate"], 1.0)
        self.assertEqual(metrics["avg_ocr_confidence"], 0.98)

    # 4. Test Report Generator (Markdown, JSON, CSV)
    def test_report_generator(self) -> None:
        summary_data = {
            "total_runs": 2,
            "safety_pass_rate": 1.0,
            "validation_pass_rate": 1.0,
            "avg_ocr_confidence": 0.96,
            "avg_duration_ms": 250.0,
        }
        benchmark_rows = [
            {
                "fixture_id": "FIX-ECG-01",
                "modality": "ECG",
                "risk_level": "MODERATE",
                "safety_pass": True,
                "validation_pass": True,
                "ocr_confidence": 0.95,
                "completeness": "COMPLETE",
                "duration_ms": 300.0,
            }
        ]
        safety_audit_data = {
            "critical_symptoms_count": 4,
            "all_detected": True,
            "max_duration_ms": 0.25,
            "passed": True,
        }

        generated = report_generator.generate_all(summary_data, benchmark_rows, safety_audit_data)
        self.assertTrue(Path(generated["json_path"]).exists())
        self.assertTrue(Path(generated["csv_path"]).exists())
        self.assertTrue(Path(generated["md_path"]).exists())

    # 5. Test Diagram & Screenshot Generator
    def test_screenshot_generator(self) -> None:
        svg_path = screenshot_generator.generate_system_architecture_svg()
        self.assertTrue(svg_path.exists())

        screen_paths = screenshot_generator.generate_screenshot_placecards()
        self.assertEqual(len(screen_paths), 4)
        for p in screen_paths:
            self.assertTrue(p.exists())


if __name__ == "__main__":
    unittest.main()
