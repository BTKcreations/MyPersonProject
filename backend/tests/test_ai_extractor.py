from ai_extractor import extract_portfolio_data
from unittest.mock import patch
import json

@patch("litellm.completion")
def test_extract_portfolio_data_success(mock_completion):
    mock_response = {
        "profile": {"name": "Test Name"},
        "skills": [{"name": "Python", "category": "Backend"}],
        "projects": [{"title": "Test Project", "description": "Test Desc", "technologies": ["Python"]}]
    }

    class MockMessage:
        content = json.dumps(mock_response)

    class MockChoice:
        message = MockMessage()

    class MockResponse:
        choices = [MockChoice()]

    mock_completion.return_value = MockResponse()

    result = extract_portfolio_data("some text")
    assert result == mock_response

@patch("litellm.completion")
def test_extract_portfolio_data_failure(mock_completion):
    mock_completion.side_effect = Exception("API Error")

    result = extract_portfolio_data("some text")
    assert result is None
