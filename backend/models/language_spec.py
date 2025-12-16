from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal
from enum import Enum


class LanguageType(str, Enum):
    INTERPRETED = "interpreted"
    COMPILED = "compiled"


class DataType(str, Enum):
    INTEGER = "integer"
    FLOAT = "float"
    STRING = "string"
    BOOLEAN = "boolean"
    ARRAY = "array"
    OBJECT = "object"
    VOID = "void"


class GrammarRule(BaseModel):
    """Represents a grammar production rule"""
    name: str
    pattern: str  # EBNF-style pattern
    description: Optional[str] = None
    node_id: str  # For visual representation
    x: float = 0  # Position in visual editor
    y: float = 0


class SyntaxRule(BaseModel):
    """Defines syntax patterns and their structure"""
    rule_type: str  # e.g., "statement", "expression", "declaration"
    pattern: str
    tokens: List[str]
    precedence: int = 0
    associativity: Literal["left", "right", "none"] = "left"


class SemanticAction(BaseModel):
    """Defines what happens when a syntax rule is matched"""
    rule_name: str
    action_type: str  # e.g., "evaluate", "declare", "assign"
    action_code: str  # Python code or template for action
    returns: Optional[DataType] = None


class BuiltinFunction(BaseModel):
    """Built-in function definition"""
    name: str
    parameters: List[Dict[str, DataType]]
    return_type: DataType
    implementation: str  # Code template or actual implementation
    description: str


class Operator(BaseModel):
    """Operator definition"""
    symbol: str
    precedence: int
    associativity: Literal["left", "right"]
    operation_type: str  # e.g., "arithmetic", "logical", "comparison"
    implementation: str


class Keyword(BaseModel):
    """Language keyword"""
    word: str
    category: str  # e.g., "control_flow", "declaration", "literal"
    description: str


class LanguageSpecification(BaseModel):
    """Complete specification for a programming language"""
    name: str
    version: str = "1.0.0"
    description: str
    language_type: LanguageType

    # Grammar and syntax
    grammar_rules: List[GrammarRule] = Field(default_factory=list)
    syntax_rules: List[SyntaxRule] = Field(default_factory=list)
    semantic_actions: List[SemanticAction] = Field(default_factory=list)

    # Language elements
    keywords: List[Keyword] = Field(default_factory=list)
    operators: List[Operator] = Field(default_factory=list)
    builtin_functions: List[BuiltinFunction] = Field(default_factory=list)
    data_types: List[DataType] = Field(default_factory=list)

    # Code generation settings
    target_language: Optional[str] = "python"  # For compiled languages
    file_extension: str = ".prog"
    comment_syntax: Dict[str, str] = Field(default_factory=lambda: {
        "single_line": "//",
        "multi_line_start": "/*",
        "multi_line_end": "*/"
    })

    # Metadata
    author: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class GenerateRequest(BaseModel):
    """Request to generate language implementation"""
    specification: LanguageSpecification
    include_examples: bool = True
    include_documentation: bool = True
