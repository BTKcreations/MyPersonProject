import io
from pypdf import PdfReader

def parse_pdf(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def parse_txt(content: bytes) -> str:
    return content.decode("utf-8")

def parse_md(content: bytes) -> str:
    return content.decode("utf-8")

def parse_document(filename: str, content: bytes) -> str:
    ext = filename.lower().split('.')[-1]
    if ext == 'pdf':
        return parse_pdf(content)
    elif ext == 'txt':
        return parse_txt(content)
    elif ext == 'md':
        return parse_md(content)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
