import pytest
from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Handwritten Digit Feature Extraction API" in response.json()["message"]

def test_sample_images_list():
    response = client.get("/api/sample-images")
    assert response.status_code == 200
    data = response.json()
    assert "samples" in data
    assert len(data["samples"]) == 10

def test_sample_digit_extraction():
    response = client.get("/api/sample-images/7")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "edges" in data
    assert "corners" in data
    assert "intensity" in data
