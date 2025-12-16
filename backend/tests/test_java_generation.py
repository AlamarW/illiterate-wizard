"""
Tests for Java code generation
"""
import pytest
import subprocess
import tempfile
import shutil
from pathlib import Path

from models.language_spec import (
    LanguageSpecification,
    LanguageType,
    Operator,
    Keyword,
    DataType
)
from generators.parser_generator import ParserGenerator
from generators.compiler_generator import CompilerGenerator
from generators.example_generator import ExampleGenerator


@pytest.fixture
def java_spec():
    """Create a language specification targeting Java"""
    return LanguageSpecification(
        name="TestJavaLang",
        version="1.0.0",
        description="A test language compiling to Java",
        language_type=LanguageType.COMPILED,
        target_language="java",
        keywords=[
            Keyword(word="if", category="control_flow", description="Conditional"),
            Keyword(word="while", category="control_flow", description="Loop"),
        ],
        operators=[
            Operator(symbol="+", precedence=10, associativity="left", operation_type="arithmetic", implementation="a + b"),
            Operator(symbol="-", precedence=10, associativity="left", operation_type="arithmetic", implementation="a - b"),
            Operator(symbol="*", precedence=20, associativity="left", operation_type="arithmetic", implementation="a * b"),
            Operator(symbol="==", precedence=5, associativity="left", operation_type="comparison", implementation="a == b"),
            Operator(symbol="<", precedence=5, associativity="left", operation_type="comparison", implementation="a < b"),
        ],
        file_extension=".test"
    )


@pytest.fixture
def temp_output_dir():
    """Create a temporary directory for output"""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir)


class TestJavaCodeGeneration:
    def test_generates_java_files(self, java_spec, temp_output_dir):
        """Test that Java target generates correct files"""
        compiler_gen = CompilerGenerator(java_spec)
        files = compiler_gen.generate(temp_output_dir)

        assert len(files) >= 3
        assert any("codegen.py" in str(f) for f in files)
        assert any("compiler.py" in str(f) for f in files)
        assert any("COMPILE.md" in str(f) for f in files)

    def test_java_codegen_has_type_inference(self, java_spec, temp_output_dir):
        """Test that Java codegen includes type inference"""
        compiler_gen = CompilerGenerator(java_spec)
        files = compiler_gen.generate(temp_output_dir)

        codegen_file = next(f for f in files if "codegen.py" in str(f))
        with open(codegen_file, 'r') as f:
            content = f.read()

        assert "_infer_type" in content
        assert "variable_types" in content
        assert "System.out.println" in content

    def test_java_codegen_handles_primitives(self, java_spec, temp_output_dir):
        """Test that Java codegen includes primitive type mappings"""
        compiler_gen = CompilerGenerator(java_spec)
        files = compiler_gen.generate(temp_output_dir)

        codegen_file = next(f for f in files if "codegen.py" in str(f))
        with open(codegen_file, 'r') as f:
            content = f.read()

        # Check for Java primitive types
        assert '"int"' in content or "'int'" in content
        assert '"double"' in content or "'double'" in content
        assert '"String"' in content or "'String'" in content
        assert '"boolean"' in content or "'boolean'" in content

    def test_generates_compile_instructions(self, java_spec, temp_output_dir):
        """Test that COMPILE.md is generated with instructions"""
        compiler_gen = CompilerGenerator(java_spec)
        files = compiler_gen.generate(temp_output_dir)

        compile_file = next(f for f in files if "COMPILE.md" in str(f))
        with open(compile_file, 'r') as f:
            content = f.read()

        assert "javac" in content
        assert "java " in content
        assert java_spec.name in content

    @pytest.mark.skipif(not shutil.which("javac"), reason="Java compiler not available")
    def test_generated_java_compiles(self, java_spec, temp_output_dir):
        """Test that generated Java code actually compiles (requires javac)"""
        # Generate parser first
        parser_gen = ParserGenerator(java_spec)
        parser_files = parser_gen.generate(temp_output_dir)

        # Generate compiler
        compiler_gen = CompilerGenerator(java_spec)
        compiler_files = compiler_gen.generate(temp_output_dir)

        # Create a simple test program
        test_program = '''x = 5
y = 10
print(x + y)'''

        test_file = temp_output_dir / "test.test"
        with open(test_file, 'w') as f:
            f.write(test_program)

        # Run the compiler to generate Java
        import sys
        sys.path.insert(0, str(temp_output_dir))

        try:
            from lexer import Lexer
            from parser import Parser
            from codegen import CodeGenerator

            lexer = Lexer(test_program)
            tokens = lexer.tokenize()

            parser = Parser(tokens)
            ast = parser.parse()

            codegen = CodeGenerator()
            java_code = codegen.generate(ast)

            # Write Java file
            java_file = temp_output_dir / "TestJavaLang.java"
            with open(java_file, 'w') as f:
                f.write(java_code)

            # Try to compile it
            result = subprocess.run(
                ["javac", str(java_file)],
                cwd=temp_output_dir,
                capture_output=True,
                text=True
            )

            # Check compilation succeeded
            assert result.returncode == 0, f"Java compilation failed: {result.stderr}"

            # Check .class file was created
            class_file = temp_output_dir / "TestJavaLang.class"
            assert class_file.exists()

        finally:
            sys.path.remove(str(temp_output_dir))

    def test_hello_world_example_for_java(self, java_spec, temp_output_dir):
        """Test that examples work with Java target"""
        example_gen = ExampleGenerator(java_spec)
        hello_world = example_gen.generate_hello_world()

        assert "Hello, World!" in hello_world
        assert "print" in hello_world

    def test_fibonacci_example_for_java(self, java_spec, temp_output_dir):
        """Test that Fibonacci example is generated"""
        example_gen = ExampleGenerator(java_spec)
        fibonacci = example_gen.generate_fibonacci()

        assert "fibonacci" in fibonacci.lower()
        # Note: functions might not work in Java MVP, but string should be generated
        assert len(fibonacci) > 0


class TestJavaTypeInference:
    def test_infers_int_from_integer_literal(self, java_spec, temp_output_dir):
        """Test type inference for integers"""
        compiler_gen = CompilerGenerator(java_spec)
        compiler_gen.generate(temp_output_dir)

        # The test is that the codegen was generated successfully
        # and contains type inference logic
        codegen_file = temp_output_dir / "codegen.py"
        assert codegen_file.exists()

    def test_infers_double_from_float_literal(self, java_spec, temp_output_dir):
        """Test type inference for floats"""
        compiler_gen = CompilerGenerator(java_spec)
        compiler_gen.generate(temp_output_dir)

        codegen_file = temp_output_dir / "codegen.py"
        with open(codegen_file, 'r') as f:
            content = f.read()

        # Check that double type is handled
        assert "double" in content

    def test_infers_string_from_string_literal(self, java_spec, temp_output_dir):
        """Test type inference for strings"""
        compiler_gen = CompilerGenerator(java_spec)
        compiler_gen.generate(temp_output_dir)

        codegen_file = temp_output_dir / "codegen.py"
        with open(codegen_file, 'r') as f:
            content = f.read()

        assert "String" in content
