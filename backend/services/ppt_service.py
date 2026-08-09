from pitchdeck.pptx_generator import generate_pptx

def generate_pptx_deck(data: dict, output_path: str) -> str:
    return generate_pptx(data, output_path)
