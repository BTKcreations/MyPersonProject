import json
import litellm
import os

litellm.drop_params = True

def extract_portfolio_data(text: str):
    """
    Uses LLM to extract structured portfolio data from a given text.
    Relies on litellm to abstract away the specific provider (OpenAI, Gemini, etc.)
    configured via environment variables.
    """
    model = os.getenv("LLM_MODEL", "gpt-3.5-turbo")

    prompt = f"""
    You are an AI assistant that extracts portfolio data from resumes and professional documents.
    Extract the following information from the text below and return it strictly as a JSON object:

    {{
        "profile": {{
            "name": "Full Name",
            "title": "Professional Title",
            "about": "A short bio (3-4 sentences)",
            "email": "Email address",
            "github_url": "Github link if present",
            "linkedin_url": "LinkedIn link if present"
        }},
        "skills": [
            {{ "name": "Skill Name", "category": "Frontend/Backend/AI/etc" }}
        ],
        "projects": [
            {{
                "title": "Project Name",
                "description": "Short description",
                "technologies": ["tech1", "tech2"],
                "github_url": "url",
                "live_url": "url"
            }}
        ]
    }}

    If any field is not found, leave it empty or null. Do not include markdown formatting like ```json in the output, just the raw JSON.

    Text to process:
    {text}
    """

    try:
        response = litellm.completion(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        content = response.choices[0].message.content.strip()

        # Handle case where LLM still includes markdown formatting
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()

        return json.loads(content)
    except Exception as e:
        print(f"Error during extraction: {e}")
        return None
