# Illiterate Wizard 🧙‍♂️

**Generate programming languages with a click!**

A web-based visual programming language builder that lets you design, customize, and generate complete programming languages through an intuitive drag-and-drop interface.

## Features

- 🎨 **Visual Grammar Designer** - Design language grammar using a node-based interface
- ⚙️ **Syntax Rule Editor** - Define keywords, operators, and syntax patterns
- 🧠 **Semantics Configuration** - Specify semantic actions for language constructs
- 📚 **Built-in Functions** - Create custom built-in function libraries
- 🔄 **Interpreter/Compiler Generation** - Choose between interpreted or compiled execution
- 📖 **Auto-Documentation** - Automatically generates complete language documentation
- 💡 **Example Generation** - Auto-generates Hello World and Fibonacci examples
- 📦 **Export & Download** - Download your complete language as a zip file
- 🐳 **Docker Support** - Run locally with Docker

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/illiterate-wizard.git
   cd illiterate-wizard
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

## Usage Guide

### 1. Configure Your Language

Start by defining basic properties:
- **Name**: Your language name
- **Type**: Interpreted or Compiled
- **File Extension**: e.g., `.mylang`
- **Comment Syntax**: Single-line and multi-line comment markers

### 2. Design Grammar Rules

Use the visual grammar designer to create production rules:
- Drag and drop nodes to create grammar structures
- Connect nodes to show relationships
- Define patterns using EBNF notation

### 3. Define Syntax Elements

**Keywords**: Add reserved words (if, while, function, etc.)
**Operators**: Define operators with precedence and associativity
**Syntax Rules**: Specify statement and expression patterns

### 4. Configure Semantics

Define what happens when syntax rules are matched:
- Evaluation actions
- Variable declarations
- Function calls
- Return values

### 5. Add Built-in Functions

Create standard library functions:
- Define function signatures
- Specify parameters and return types
- Provide implementation code

### 6. Generate Your Language

Click "Generate Language" to create:
- ✅ Lexer/Tokenizer
- ✅ Parser
- ✅ AST (Abstract Syntax Tree) definitions
- ✅ Interpreter or Compiler
- ✅ Complete documentation
- ✅ Example programs (Hello World, Fibonacci)
- ✅ Language specification file

### 7. Download and Use

Download your generated language as a zip file containing:
- All source code
- Documentation (README, Language Reference, Tutorial)
- Example programs
- Ready-to-use interpreter/compiler

## Architecture

### Backend (Python/FastAPI)
```
backend/
├── main.py                 # FastAPI application
├── models/                 # Data models
│   └── language_spec.py   # Language specification models
├── generators/             # Code generators
│   ├── parser_generator.py
│   ├── interpreter_generator.py
│   ├── compiler_generator.py
│   ├── documentation_generator.py
│   └── example_generator.py
├── storage/                # Language storage
│   ├── languages/         # Saved specifications
│   └── generated/         # Generated language files
└── tests/                  # Test suite
```

### Frontend (React/Vite)
```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── GrammarDesigner.jsx
│   │   ├── SyntaxEditor.jsx
│   │   ├── SemanticsEditor.jsx
│   │   ├── BuiltinsEditor.jsx
│   │   ├── LanguageConfig.jsx
│   │   └── Preview.jsx
│   ├── services/          # API client
│   │   └── api.js
│   └── App.jsx            # Main application
└── package.json
```

## API Endpoints

### Language Management
- `POST /api/languages` - Create language specification
- `GET /api/languages` - List all languages
- `GET /api/languages/{id}` - Get specific language
- `PUT /api/languages/{id}` - Update language
- `DELETE /api/languages/{id}` - Delete language

### Generation
- `POST /api/generate` - Generate complete language
- `GET /api/download/{name}` - Download generated language

## Testing

### Backend Tests
```bash
cd backend
pytest
```

Tests cover:
- Parser generation
- Interpreter generation
- Compiler generation
- Documentation generation
- Example generation
- API endpoints

### Run Specific Tests
```bash
pytest tests/test_generators.py
pytest tests/test_api.py
```

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Python 3.11+** - Core language

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Flow** - Visual node editor
- **Monaco Editor** - Code editor
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend server (production)

## Development

### Project Structure
```
illiterate-wizard/
├── backend/               # Python FastAPI backend
├── frontend/              # React frontend
├── docker-compose.yml     # Docker orchestration
├── README.md             # This file
└── PROGRESS.md           # Development progress tracking
```

### Environment Variables

**Backend** (optional):
```bash
# Add to backend/.env if needed
STORAGE_DIR=./storage
```

**Frontend**:
```bash
# Add to frontend/.env
VITE_API_URL=http://localhost:8000
```

## Examples

### Creating a Simple Language

1. **Name**: SimpleLang
2. **Keywords**: `if`, `else`, `while`, `function`, `return`
3. **Operators**: `+`, `-`, `*`, `/`, `==`, `!=`, `<`, `>`
4. **Built-ins**: `print()`, `input()`, `len()`
5. **Type**: Interpreted

Click "Generate Language" and get a complete interpreter with documentation!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Roadmap

- [x] Support for Java compilation target (✅ **Completed!**)
- [ ] **MCP (Model Context Protocol) Support** - Allow users with LLMs to design complete programming languages through natural conversation
  - MCP server for language specification
  - Conversational language design workflow
  - AI-assisted grammar rule generation
  - Automatic syntax validation and suggestions
  - Example code generation from descriptions
- [ ] Support for C compilation target
- [ ] Advanced type system configuration
- [ ] Standard library templates
- [ ] Language import/export marketplace
- [ ] Interactive language testing playground
- [ ] Code completion and syntax highlighting for generated languages
- [ ] Performance optimization tools
- [ ] Language versioning and migration tools

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation in `/docs`

## Acknowledgments

Built with modern web technologies and a passion for programming language design!

---

**Made with ❤️ by the Illiterate Wizard team**
