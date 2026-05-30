import litellm
import os
from sqlalchemy.orm import Session
import models

def generate_chat_response(db: Session, user_message: str) -> str:
    # 1. Fetch Context
    profile = db.query(models.Profile).first()
    skills = db.query(models.Skill).all()
    projects = db.query(models.Project).all()

    # 2. Build Context String
    context = "You are the personal AI assistant for a software engineer's portfolio website.\n\n"

    if profile:
        context += f"Owner Name: {profile.name or 'Anonymous'}\n"
        context += f"Title: {profile.title}\n"
        context += f"About: {profile.about}\n"
        context += f"Contact Email: {profile.email}\n\n"

    if skills:
        context += "Skills: " + ", ".join([s.name for s in skills]) + "\n\n"

    if projects:
        context += "Projects:\n"
        for p in projects:
            context += f"- {p.title}: {p.description} (Tech: {', '.join(p.technologies) if p.technologies else 'N/A'})\n"

    prompt = f"""
    {context}

    Instructions:
    You are answering questions from a visitor on the portfolio website.
    Be polite, professional, and helpful. Use ONLY the context provided above to answer questions about the owner.
    If the user asks something outside the scope of the owner's professional profile, politely decline to answer.
    Keep your answers concise and conversational.

    Visitor's Message: "{user_message}"
    """

    model = os.getenv("LLM_MODEL", "ollama/llama3")
    api_base = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")

    kwargs = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "max_tokens": 500
    }

    if model.startswith("ollama/"):
        kwargs["api_base"] = api_base
        kwargs["custom_llm_provider"] = "ollama"
        if "OPENAI_API_KEY" in os.environ:
            kwargs["api_key"] = "dummy"

    try:
        response = litellm.completion(**kwargs)
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Chat error: {e}")
        return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later."
