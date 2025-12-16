"""
Tests for language generators
"""
import pytest
from pathlib import Path
import tempfile
import shutil

from models.language_spec import (
    LanguageSpecification,
    LanguageType,
    GrammarRule,
    SyntaxRule,
    Operator,
    Keyword,
    BuiltinFunction,
    DataType
)
from generators.parser_generator import ParserGenerator
from generators.interpreter_generator import InterpreterGenerator
from generators.compiler_generator import CompilerGenerator
from generators.documentation_generator import DocumentationGenerator
from generators.example_generator import ExampleGenerator


@pytest.fixture
def sample_spec():
    """Create a sample language specification for testing"""
    return LanguageSpecification(
        name="TestLang",
        version="1.0.0",
        description="A test programming language",
        language_type=LanguageType.INTERPRETED,
        keywords=[
            Keyword(word="if", category="control_flow", description="Conditional statement"),
            Keyword(word="while", category="control_flow", description="Loop statement"),
            Keyword(word="function", category="declaration", description="Function declaration")
        ],
        operators=[
            Operator(symbol="+", precedence=10, associativity="left", operation_type="arithmetic", implementation="a + b"),
            Operator(symbol="-", precedence=10, associativity="left", operation_type="arithmetic", implementation="a - b"),
            Operator(symbol="*", precedence=20, associativity="left", operation_type="arithmetic", implementation="a * b"),
            Operator(symbol="==", precedence=5, associativity="left", operation_type="comparison", implementation="a == b")
        ],
        builtin_functions=[
            BuiltinFunction(
                name="sqrt",
                parameters=[{"name": "x", "type": DataType.FLOAT}],
                return_type=DataType.FLOAT,
                implementation="import math; return math.sqrt(x)",
                description="Calculate square root"
            )
        ],
        grammar_rules=[
            GrammarRule(
                name="expression",
                pattern="term (('+' | '-') term)*",
                description="Addition and subtraction",
                node_id="expr1",
                x=0,
                y=0
            )
        ],
        file_extension=".test"
    )


@pytest.fixture
def temp_output_dir():
    """Create a temporary directory for output"""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir)


class TestParserGenerator:
    def test_generate_creates_files(self, sample_spec, temp_output_dir):
        """Test that parser generator creates all expected files"""
        generator = ParserGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        assert len(files) > 0
        assert any("lexer.py" in str(f) for f in files)
        assert any("parser.py" in str(f) for f in files)
        assert any("ast_nodes.py" in str(f) for f in files)
        assert any(".ebnf" in str(f) for f in files)

        # Verify files actually exist
        for file_path in files:
            assert Path(file_path).exists()

    def test_lexer_contains_keywords(self, sample_spec, temp_output_dir):
        """Test that generated lexer includes all keywords"""
        generator = ParserGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        lexer_file = next(f for f in files if "lexer.py" in str(f))
        with open(lexer_file, 'r') as f:
            content = f.read()

        for keyword in sample_spec.keywords:
            assert keyword.word in content

    def test_lexer_contains_operators(self, sample_spec, temp_output_dir):
        """Test that generated lexer includes all operators"""
        generator = ParserGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        lexer_file = next(f for f in files if "lexer.py" in str(f))
        with open(lexer_file, 'r') as f:
            content = f.read()

        for operator in sample_spec.operators:
            assert operator.symbol in content


class TestInterpreterGenerator:
    def test_generate_creates_files(self, sample_spec, temp_output_dir):
        """Test that interpreter generator creates all expected files"""
        generator = InterpreterGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        assert len(files) > 0
        assert any("interpreter.py" in str(f) for f in files)
        assert any("environment.py" in str(f) for f in files)
        assert any("builtins.py" in str(f) for f in files)

        for file_path in files:
            assert Path(file_path).exists()

    def test_interpreter_handles_operators(self, sample_spec, temp_output_dir):
        """Test that generated interpreter includes operator implementations"""
        generator = InterpreterGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        interpreter_file = next(f for f in files if "interpreter.py" in str(f))
        with open(interpreter_file, 'r') as f:
            content = f.read()

        assert "_eval_binary_op" in content
        # Check for at least some operator implementations
        assert "+" in content or "-" in content or "*" in content


class TestCompilerGenerator:
    def test_generate_creates_files(self, sample_spec, temp_output_dir):
        """Test that compiler generator creates all expected files"""
        sample_spec.language_type = LanguageType.COMPILED
        generator = CompilerGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        assert len(files) > 0
        assert any("codegen.py" in str(f) for f in files)
        assert any("compiler.py" in str(f) for f in files)

        for file_path in files:
            assert Path(file_path).exists()

    def test_codegen_targets_correct_language(self, sample_spec, temp_output_dir):
        """Test that code generator targets the specified language"""
        sample_spec.language_type = LanguageType.COMPILED
        sample_spec.target_language = "python"
        generator = CompilerGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        codegen_file = next(f for f in files if "codegen.py" in str(f))
        with open(codegen_file, 'r') as f:
            content = f.read()

        assert "python" in content.lower()


class TestDocumentationGenerator:
    def test_generate_creates_docs(self, sample_spec, temp_output_dir):
        """Test that documentation generator creates all docs"""
        generator = DocumentationGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        assert len(files) >= 3
        assert any("README.md" in str(f) for f in files)
        assert any("LANGUAGE_REFERENCE.md" in str(f) for f in files)
        assert any("TUTORIAL.md" in str(f) for f in files)

        for file_path in files:
            assert Path(file_path).exists()

    def test_readme_contains_language_info(self, sample_spec, temp_output_dir):
        """Test that README contains language information"""
        generator = DocumentationGenerator(sample_spec)
        files = generator.generate(temp_output_dir)

        readme_file = next(f for f in files if "README.md" in str(f))
        with open(readme_file, 'r') as f:
            content = f.read()

        assert sample_spec.name in content
        assert sample_spec.description in content
        assert sample_spec.version in content


class TestExampleGenerator:
    def test_generate_creates_examples(self, sample_spec, temp_output_dir):
        """Test that example generator creates example files"""
        generator = ExampleGenerator(sample_spec)
        files = generator.generate_all(temp_output_dir)

        assert len(files) >= 2
        assert any("hello_world" in str(f) for f in files)
        assert any("fibonacci" in str(f) for f in files)

        for file_path in files:
            assert Path(file_path).exists()

    def test_hello_world_example(self, sample_spec, temp_output_dir):
        """Test that hello world example is generated correctly"""
        generator = ExampleGenerator(sample_spec)
        hello_world = generator.generate_hello_world()

        assert "Hello, World!" in hello_world
        assert "print" in hello_world.lower()

    def test_fibonacci_example(self, sample_spec, temp_output_dir):
        """Test that fibonacci example is generated correctly"""
        generator = ExampleGenerator(sample_spec)
        fibonacci = generator.generate_fibonacci()

        assert "fibonacci" in fibonacci.lower()
        assert "function" in fibonacci.lower() or "def" in fibonacci.lower()
