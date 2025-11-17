# import pdfkit
# import os

# WKHTMLTOPDF_CMD = os.getenv("WKHTMLTOPDF_CMD", "/usr/local/bin/wkhtmltopdf")
# config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_CMD)

# def generate_pdf_from_html(html: str) -> bytes:
#     """Convert HTML content to PDF bytes."""
#     return pdfkit.from_string(html, False, configuration=config)

from weasyprint import HTML

def generate_pdf_from_html(html: str) -> bytes:
    """Convert HTML content to PDF bytes using WeasyPrint."""
    return HTML(string=html).write_pdf()
