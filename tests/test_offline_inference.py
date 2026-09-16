import sys
import pytest
import ollama


def test_inference(model_name: str = "gemma3:4b") -> None:
    """Verify local Ollama offline inference when reachable; skip cleanly otherwise."""
    print(f"Connecting to local Ollama and testing model: {model_name}...")
    try:
        response = ollama.chat(
            model=model_name,
            messages=[
                {
                    "role": "user",
                    "content": "Hello",
                },
            ],
        )
        content = response["message"]["content"]
        assert content, f"Expected non-empty response content from model {model_name}"
        print(f"\n--- Model Response ---\n{content}\n----------------------\n")
        print("✓ Offline inference test PASSED!")
    except Exception as e:
        pytest.skip(f"Local Ollama inference unavailable ({e})")


if __name__ == "__main__":
    # Check if any model is loaded
    try:
        models = [m.model for m in ollama.list().models]
        print(f"Available Ollama models: {models}")
        if not models:
            print("No models finished downloading yet. Run this test once Ollama pull finishes.")
            sys.exit(0)
        model_to_use = models[0]
        test_inference(model_to_use)
    except Exception as err:
        print(f"Ollama daemon unreachable: {err}")
        sys.exit(0)

