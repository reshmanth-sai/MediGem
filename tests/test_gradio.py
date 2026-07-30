import gradio as gr

def echo(text):
    return f"Echo: {text}"

def test_gradio():
    demo = gr.Interface(fn=echo, inputs=gr.Textbox(label="Input"), outputs=gr.Textbox(label="Output"))
    print("✓ Gradio interface instantiated successfully.")
    assert demo is not None
    print("✓ Gradio test passed!")

if __name__ == "__main__":
    test_gradio()
