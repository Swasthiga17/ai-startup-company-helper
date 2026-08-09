from reports.pdf_generator import generate_pdf

def generate_pdf_report(data: dict, output_path: str) -> str:
    return generate_pdf(data, output_path)
