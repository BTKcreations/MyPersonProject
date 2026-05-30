from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio Backend")

from fastapi import UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from document_parser import parse_document
from ai_extractor import extract_portfolio_data
import json

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/admin/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()

    # Save document to DB
    db_doc = models.Document(
        filename=file.filename,
        content=content.decode('utf-8', errors='ignore'),
        type=file.filename.split('.')[-1]
    )
    db.add(db_doc)
    db.commit()

    # Parse
    try:
        parsed_text = parse_document(file.filename, content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Extract data using AI
    extracted_data = extract_portfolio_data(parsed_text)
    if not extracted_data:
        raise HTTPException(status_code=500, detail="Failed to extract data using AI")

    # Save extracted data to database
    try:
        # Save Profile
        if 'profile' in extracted_data:
            prof_data = extracted_data['profile']
            profile = db.query(models.Profile).first()
            if not profile:
                profile = models.Profile(**prof_data)
                db.add(profile)
            else:
                for key, value in prof_data.items():
                    setattr(profile, key, value)
            db.commit()

        # Save Skills
        if 'skills' in extracted_data:
            for skill_data in extracted_data['skills']:
                skill = db.query(models.Skill).filter(models.Skill.name == skill_data.get('name')).first()
                if not skill:
                    db.add(models.Skill(**skill_data))
            db.commit()

        # Save Projects
        if 'projects' in extracted_data:
            for proj_data in extracted_data['projects']:
                proj = db.query(models.Project).filter(models.Project.title == proj_data.get('title')).first()
                if not proj:
                    db.add(models.Project(**proj_data))
            db.commit()

        return {"status": "success", "data": extracted_data}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/portfolio")
def get_portfolio(db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    skills = db.query(models.Skill).all()
    projects = db.query(models.Project).all()

    return {
        "profile": profile,
        "skills": skills,
        "projects": projects
    }
