from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf(data: dict, output_path: str) -> str:
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=22, textColor=colors.HexColor('#1a1a2e'), spaceAfter=20)
    elements.append(Paragraph("AI Startup Analysis Report", title_style))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(f"<b>Idea:</b> {data.get('idea', 'N/A')}", styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))
    sections = [
        ("Market Analysis", data.get("market", {})),
        ("Competitor Analysis", data.get("competitors", {})),
        ("SWOT Analysis", data.get("swot", {})),
        ("Business Model", data.get("business_model", {})),
        ("MVP Roadmap", data.get("mvp", {})),
        ("Startup Score", data.get("score", {})),
        ("Revenue Forecast", data.get("revenue", {})),
        ("Pitch Deck", data.get("pitch", {})),
    ]
    for title, section_data in sections:
        if section_data:
            elements.append(Paragraph(f"<b>{title}</b>", styles['Heading2']))
            if isinstance(section_data, dict):
                for key, value in section_data.items():
                    if isinstance(value, list):
                        elements.append(Paragraph(f"<b>{key.replace('_', ' ').title()}:</b>", styles['Normal']))
                        for item in value:
                            if isinstance(item, dict):
                                details = []
                                for k, v in item.items():
                                    if isinstance(v, list):
                                        details.append(f"<b>{k.replace('_', ' ').title()}:</b> {', '.join(map(str, v))}")
                                    else:
                                        details.append(f"<b>{k.replace('_', ' ').title()}:</b> {v}")
                                elements.append(Paragraph(f"• {', '.join(details)}", styles['Normal']))
                            else:
                                elements.append(Paragraph(f"• {item}", styles['Normal']))
                    elif isinstance(value, dict):
                        elements.append(Paragraph(f"<b>{key.replace('_', ' ').title()}:</b>", styles['Normal']))
                        for k, v in value.items():
                            elements.append(Paragraph(f"  {k.replace('_', ' ').title()}: {v}", styles['Normal']))
                    else:
                        elements.append(Paragraph(f"<b>{key.replace('_', ' ').title()}:</b> {value}", styles['Normal']))
            elements.append(Spacer(1, 0.15 * inch))
    doc.build(elements)
    return output_path
