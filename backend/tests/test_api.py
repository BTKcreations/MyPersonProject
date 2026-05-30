from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import Base, get_db
import models

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_get_portfolio_empty():
    response = client.get("/api/portfolio")
    assert response.status_code == 200
    data = response.json()
    assert data["profile"] is None
    assert data["skills"] == []
    assert data["projects"] == []

def test_get_portfolio_with_data():
    # Insert some dummy data
    db = TestingSessionLocal()
    profile = models.Profile(name="Test User", title="Tester", email="test@test.com")
    db.add(profile)
    skill = models.Skill(name="Python", category="Backend")
    db.add(skill)
    project = models.Project(title="Test Project", description="Test Desc")
    db.add(project)
    db.commit()

    response = client.get("/api/portfolio")
    assert response.status_code == 200
    data = response.json()
    assert data["profile"]["name"] == "Test User"
    assert len(data["skills"]) == 1
    assert data["skills"][0]["name"] == "Python"
    assert len(data["projects"]) == 1
    assert data["projects"][0]["title"] == "Test Project"

    # cleanup
    db.query(models.Profile).delete()
    db.query(models.Skill).delete()
    db.query(models.Project).delete()
    db.commit()
    db.close()
