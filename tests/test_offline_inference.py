import ollama
import sys

def test_inference(model_name="gemma3:4b"):
    print(f"Connecting to local Ollama and testing model: {model_name}...")
    try:
        response = ollama.chat(
            model=model_name,
            messages=[
                {
                    'role': 'user',
                    'content': 'Hello',
                },
            ]
        )
        content = response['message']['content']
        print(f"\n--- Model Response ---")
        print(content)
        print("----------------------\n")
        print("✓ Offline inference test PASSED!")
        return True
    except Exception as e:
        print(f"Inference error with model {model_name}: {e}")
        return False

if __name__ == "__main__":
    # Check if any model is loaded
    models = [m.model for m in ollama.list().models]
    print(f"Available Ollama models: {models}")
    
    if not models:
        print("No models finished downloading yet. Run this test once Ollama pull finishes.")
        sys.exit(0)
        
    model_to_use = models[0]
    test_inference(model_to_use)
