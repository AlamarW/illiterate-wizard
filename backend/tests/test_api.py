"""
Tests for FastAPI endpoints
"""
import pytest
from fastapi.testclient import TestClient
from pathlib import Path
import json

from main import app
from models.language_spec import LanguageSpecification, LanguageType


@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)


@pytest.fixture
def sample_language_spec():
    """Sample language specification for testing"""
    return {
        "name": "TestLang",
        "version": "1.0.0",
        "description": "A test language",
        "language_type": "interpreted",
        "grammar_rules": [],
        "syntax_rules": [],
        "semantic_actions": [],
        "keywords": [
            {"word": "if", "category": "control_flow", "description": "Conditional"}
        ],
        "operators": [
            {"symbol": "+", "precedence": 10, "associativity": "left", "operation_type": "arithmetic", "implementation": "a + b"}
        ],
        "builtin_functions": [],
        "data_types": ["integer", "float", "string"],
        "file_extension": ".test"
    }


class TestHealthEndpoint:
    def test_root_endpoint(self, client):
        """Test root endpoint returns welcome message"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Illiterate Wizard" in data["message"]


class TestLanguageEndpoints:
    def test_create_language(self, client, sample_language_spec):
        """Test creating a language specification"""
        response = client.post("/api/languages", json=sample_language_spec)
        assert response.status_code == 200
        data = response.json()
        assert "language_id" in data
        assert data["specification"]["name"] == "TestLang"

    def test_list_languages(self, client, sample_language_spec):
        """Test listing all languages"""
        # First create a language
        client.post("/api/languages", json=sample_language_spec)

        # Then list them
        response = client.get("/api/languages")
        assert response.status_code == 200
        data = response.json()
        assert "languages" in data
        assert len(data["languages"]) > 0

    def test_get_language(self, client, sample_language_spec):
        """Test getting a specific language"""
        # Create a language
        create_response = client.post("/api/languages", json=sample_language_spec)
        language_id = create_response.json()["language_id"]

        # Get it
        response = client.get(f"/api/languages/{language_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "TestLang"

    def test_get_nonexistent_language(self, client):
        """Test getting a language that doesn't exist"""
        response = client.get("/api/languages/nonexistent.json")
        assert response.status_code == 404

    def test_update_language(self, client, sample_language_spec):
        """Test updating a language specification"""
        # Create
        create_response = client.post("/api/languages", json=sample_language_spec)
        language_id = create_response.json()["language_id"]

        # Update
        sample_language_spec["description"] = "Updated description"
        response = client.put(f"/api/languages/{language_id}", json=sample_language_spec)
        assert response.status_code == 200
        assert response.json()["specification"]["description"] == "Updated description"

    def test_delete_language(self, client, sample_language_spec):
        """Test deleting a language"""
        # Create
        create_response = client.post("/api/languages", json=sample_language_spec)
        language_id = create_response.json()["language_id"]

        # Delete
        response = client.delete(f"/api/languages/{language_id}")
        assert response.status_code == 200

        # Verify it's gone
        get_response = client.get(f"/api/languages/{language_id}")
        assert get_response.status_code == 404


class TestGenerateEndpoint:
    def test_generate_language(self, client, sample_language_spec):
        """Test generating a complete language"""
        request = {
            "specification": sample_language_spec,
            "include_examples": True,
            "include_documentation": True
        }
        response = client.post("/api/generate", json=request)
        assert response.status_code == 200
        data = response.json()
        assert "language_name" in data
        assert "files_generated" in data
        assert len(data["files_generated"]) > 0

    def test_generate_without_examples(self, client, sample_language_spec):
        """Test generating without examples"""
        request = {
            "specification": sample_language_spec,
            "include_examples": False,
            "include_documentation": True
        }
        response = client.post("/api/generate", json=request)
        assert response.status_code == 200

    def test_generate_minimal_spec(self, client):
        """Test generating with minimal specification"""
        minimal_spec = {
            "name": "MinimalLang",
            "version": "1.0.0",
            "description": "Minimal",
            "language_type": "interpreted",
            "file_extension": ".min"
        }
        request = {
            "specification": minimal_spec,
            "include_examples": True,
            "include_documentation": True
        }
        response = client.post("/api/generate", json=request)
        assert response.status_code == 200
