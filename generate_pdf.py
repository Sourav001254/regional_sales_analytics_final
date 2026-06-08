from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import os
import sys

# Add current directory to path to import src.logger
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from logger import logger

def generate_pdf_report():
    logger.info("="*50)
    logger.info("STAGE 7b: AUTO-GENERATING PDF REPORT")
    logger.info("="*50)
    logger.info("Generating Branded PDF Executive Report...")
    doc = SimpleDocTemplate("Executive_Report.pdf", pagesize=letter)
    styles = getSampleStyleSheet()
    Story = []

    # Title
    title_style = ParagraphStyle(
        'MainTitle', parent=styles['Heading1'], fontSize=24, spaceAfter=20, textColor=colors.HexColor('#0A162B')
    )
    Story.append(Paragraph("Regional Sales & Finance - Executive Report", title_style))
    Story.append(Spacer(1, 12))
    
    # Text Insights
    Story.append(Paragraph("AI-Generated Insights:", styles['Heading2']))
    
    # Load insights if available
    insights_path = "advanced_outputs/automated_insights.txt"
    if os.path.exists(insights_path):
        with open(insights_path, "r") as f:
            lines = f.readlines()
            for line in lines:
                Story.append(Paragraph(line.strip(), styles['Normal']))
    else:
        Story.append(Paragraph("Insights file not found. Ensure Step 6 was executed.", styles['Normal']))
    
    Story.append(Spacer(1, 24))

    # Append Visual (from previous EDA)
    img_path = "advanced_outputs/revenue_forecast_sarima.png"
    if os.path.exists(img_path):
        im = Image(img_path, width=400, height=250)
        Story.append(im)
    else:
        Story.append(Paragraph("[Forecast Chart Image Placeholder - Run Step 6]", styles['Normal']))

    doc.build(Story)
    logger.info("PDF Saved Successfully as Executive_Report.pdf")

if __name__ == "__main__":
    generate_pdf_report()
