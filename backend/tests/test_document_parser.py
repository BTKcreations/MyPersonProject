import pytest
from document_parser import parse_document, parse_txt, parse_md

def test_parse_txt():
    content = b"Hello World"
    result = parse_txt(content)
    assert result == "Hello World"

def test_parse_md():
    content = b"# Hello\nThis is markdown."
    result = parse_md(content)
    assert result == "# Hello\nThis is markdown."

def test_parse_document_unsupported():
    with pytest.raises(ValueError, match="Unsupported file type: docx"):
        parse_document("test.docx", b"dummy")

def test_parse_document_txt():
    result = parse_document("test.txt", b"Test content")
    assert result == "Test content"
