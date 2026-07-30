"""Benchmarking Suite executing multi-run evaluations and latency statistics."""

from typing import Any, Dict
from evaluation.evaluator import EvaluationRunner


def run_benchmark() -> Dict[str, Any]:
    """Execute full system benchmark run."""
    runner = EvaluationRunner()
    return runner.run_evaluation()


if __name__ == "__main__":
    results = run_benchmark()
    print("Benchmark complete:", results["summary"])
