from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
import json
import os
from datetime import datetime
from pathlib import Path

from models.language_spec import LanguageSpecification, GenerateRequest
from generators.parser_generator import ParserGenerator
from generators.interpreter_generator import InterpreterGenerator
from generators.compiler_generator import CompilerGenerator
from generators.documentation_generator import DocumentationGenerator
from generators.example_generator import ExampleGenerator

app = FastAPI(
    title="Illiterate Wizard - Language Builder",
    description="Generate programming languages with a click!",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE_DIR = Path("storage/languages")
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Illiterate Wizard - Programming Language Builder",
        "version": "1.0.0"
    }


@app.post("/api/languages")
async def create_language(spec: LanguageSpecification):
    """Save a language specification"""
    try:
        # Add timestamps
        spec.created_at = datetime.utcnow().isoformat()
        spec.updated_at = spec.created_at

        # Save to file
        filename = f"{spec.name.lower().replace(' ', '_')}.json"
        filepath = STORAGE_DIR / filename

        with open(filepath, 'w') as f:
            json.dump(spec.model_dump(), f, indent=2)

        return {
            "message": "Language specification saved successfully",
            "language_id": filename,
            "specification": spec
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/languages")
async def list_languages():
    """List all saved language specifications"""
    try:
        languages = []
        for filepath in STORAGE_DIR.glob("*.json"):
            with open(filepath, 'r') as f:
                spec = json.load(f)
                languages.append({
                    "id": filepath.name,
                    "name": spec.get("name"),
                    "description": spec.get("description"),
                    "language_type": spec.get("language_type"),
                    "created_at": spec.get("created_at")
                })
        return {"languages": languages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/languages/{language_id}")
async def get_language(language_id: str):
    """Get a specific language specification"""
    try:
        filepath = STORAGE_DIR / language_id
        if not filepath.exists():
            raise HTTPException(status_code=404, detail="Language not found")

        with open(filepath, 'r') as f:
            spec = json.load(f)
        return spec
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/languages/{language_id}")
async def update_language(language_id: str, spec: LanguageSpecification):
    """Update a language specification"""
    try:
        filepath = STORAGE_DIR / language_id
        if not filepath.exists():
            raise HTTPException(status_code=404, detail="Language not found")

        # Update timestamp
        spec.updated_at = datetime.utcnow().isoformat()

        with open(filepath, 'w') as f:
            json.dump(spec.model_dump(), f, indent=2)

        return {
            "message": "Language specification updated successfully",
            "specification": spec
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/languages/{language_id}")
async def delete_language(language_id: str):
    """Delete a language specification"""
    try:
        filepath = STORAGE_DIR / language_id
        if not filepath.exists():
            raise HTTPException(status_code=404, detail="Language not found")

        filepath.unlink()
        return {"message": "Language specification deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate")
async def generate_language(request: GenerateRequest):
    """Generate the complete language implementation"""
    try:
        spec = request.specification
        output_dir = Path(f"storage/generated/{spec.name.lower().replace(' ', '_')}")
        output_dir.mkdir(parents=True, exist_ok=True)

        result = {
            "language_name": spec.name,
            "language_type": spec.language_type,
            "files_generated": []
        }

        # Generate parser
        parser_gen = ParserGenerator(spec)
        parser_files = parser_gen.generate(output_dir)
        result["files_generated"].extend(parser_files)

        # Generate interpreter or compiler
        if spec.language_type == "interpreted":
            interpreter_gen = InterpreterGenerator(spec)
            impl_files = interpreter_gen.generate(output_dir)
        else:
            compiler_gen = CompilerGenerator(spec)
            impl_files = compiler_gen.generate(output_dir)
        result["files_generated"].extend(impl_files)

        # Generate documentation
        if request.include_documentation:
            doc_gen = DocumentationGenerator(spec)
            doc_files = doc_gen.generate(output_dir)
            result["files_generated"].extend(doc_files)

        # Generate examples
        if request.include_examples:
            example_gen = ExampleGenerator(spec)
            example_files = example_gen.generate_all(output_dir)
            result["files_generated"].extend(example_files)

        # Export language spec
        spec_file = output_dir / f"{spec.name}_specification.json"
        with open(spec_file, 'w') as f:
            json.dump(spec.model_dump(), f, indent=2)
        result["files_generated"].append(str(spec_file))

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download/{language_name}")
async def download_language(language_name: str):
    """Download generated language as a zip file"""
    try:
        import zipfile
        import io

        lang_dir = Path(f"storage/generated/{language_name.lower().replace(' ', '_')}")
        if not lang_dir.exists():
            raise HTTPException(status_code=404, detail="Generated language not found")

        # Create zip file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file_path in lang_dir.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(lang_dir)
                    zip_file.write(file_path, arcname)

        zip_buffer.seek(0)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={language_name}.zip"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
