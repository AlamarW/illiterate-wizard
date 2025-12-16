import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

function SyntaxEditor({ syntaxRules, keywords, operators, onSyntaxChange, onKeywordsChange, onOperatorsChange }) {
  const [activeSection, setActiveSection] = useState('keywords')
  const [newKeyword, setNewKeyword] = useState({ word: '', category: '', description: '' })
  const [newOperator, setNewOperator] = useState({ symbol: '', precedence: 0, associativity: 'left', operation_type: '', implementation: '' })
  const [newSyntaxRule, setNewSyntaxRule] = useState({ rule_type: 'statement', pattern: '', tokens: '', precedence: 0, associativity: 'left' })

  const addKeyword = () => {
    if (!newKeyword.word) {
      alert('Please enter a keyword')
      return
    }
    onKeywordsChange([...keywords, newKeyword])
    setNewKeyword({ word: '', category: '', description: '' })
  }

  const addOperator = () => {
    if (!newOperator.symbol) {
      alert('Please enter an operator symbol')
      return
    }
    onOperatorsChange([...operators, { ...newOperator, precedence: parseInt(newOperator.precedence) }])
    setNewOperator({ symbol: '', precedence: 0, associativity: 'left', operation_type: '', implementation: '' })
  }

  const addSyntaxRule = () => {
    if (!newSyntaxRule.pattern) {
      alert('Please enter a pattern')
      return
    }
    const tokensArray = newSyntaxRule.tokens.split(',').map(t => t.trim()).filter(t => t)
    onSyntaxChange([...syntaxRules, {
      ...newSyntaxRule,
      tokens: tokensArray,
      precedence: parseInt(newSyntaxRule.precedence)
    }])
    setNewSyntaxRule({ rule_type: 'statement', pattern: '', tokens: '', precedence: 0, associativity: 'left' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Syntax Rules</h2>
        <p className="text-gray-600">
          Define keywords, operators, and syntax rules for your language.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-4">
          {['keywords', 'operators', 'syntax'].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 border-b-2 font-medium text-sm capitalize ${
                activeSection === section
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </div>

      {/* Keywords Section */}
      {activeSection === 'keywords' && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Add Keyword</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Word</label>
                <input
                  type="text"
                  value={newKeyword.word}
                  onChange={(e) => setNewKeyword({ ...newKeyword, word: e.target.value })}
                  placeholder="if, while, function..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newKeyword.category}
                  onChange={(e) => setNewKeyword({ ...newKeyword, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="control_flow">Control Flow</option>
                  <option value="declaration">Declaration</option>
                  <option value="literal">Literal</option>
                  <option value="operator">Operator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newKeyword.description}
                  onChange={(e) => setNewKeyword({ ...newKeyword, description: e.target.value })}
                  placeholder="Conditional statement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <button
              onClick={addKeyword}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Keyword</span>
            </button>
          </div>

          <div className="space-y-2">
            {keywords.map((kw, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div>
                  <span className="font-mono font-bold text-purple-600">{kw.word}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{kw.category}</span>
                  {kw.description && (
                    <div className="text-xs text-gray-500 mt-1">{kw.description}</div>
                  )}
                </div>
                <button
                  onClick={() => onKeywordsChange(keywords.filter((_, i) => i !== index))}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operators Section */}
      {activeSection === 'operators' && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Add Operator</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                <input
                  type="text"
                  value={newOperator.symbol}
                  onChange={(e) => setNewOperator({ ...newOperator, symbol: e.target.value })}
                  placeholder="+, -, *, =="
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precedence</label>
                <input
                  type="number"
                  value={newOperator.precedence}
                  onChange={(e) => setNewOperator({ ...newOperator, precedence: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Associativity</label>
                <select
                  value={newOperator.associativity}
                  onChange={(e) => setNewOperator({ ...newOperator, associativity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newOperator.operation_type}
                  onChange={(e) => setNewOperator({ ...newOperator, operation_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select...</option>
                  <option value="arithmetic">Arithmetic</option>
                  <option value="logical">Logical</option>
                  <option value="comparison">Comparison</option>
                  <option value="bitwise">Bitwise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation</label>
                <input
                  type="text"
                  value={newOperator.implementation}
                  onChange={(e) => setNewOperator({ ...newOperator, implementation: e.target.value })}
                  placeholder="a + b"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <button
              onClick={addOperator}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Operator</span>
            </button>
          </div>

          <div className="space-y-2">
            {operators.map((op, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <span className="font-mono font-bold text-purple-600 text-lg">{op.symbol}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{op.operation_type}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Precedence: {op.precedence} | {op.associativity}
                  </div>
                </div>
                <button
                  onClick={() => onOperatorsChange(operators.filter((_, i) => i !== index))}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Syntax Rules Section */}
      {activeSection === 'syntax' && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Add Syntax Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
                <select
                  value={newSyntaxRule.rule_type}
                  onChange={(e) => setNewSyntaxRule({ ...newSyntaxRule, rule_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="statement">Statement</option>
                  <option value="expression">Expression</option>
                  <option value="declaration">Declaration</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
                <input
                  type="text"
                  value={newSyntaxRule.pattern}
                  onChange={(e) => setNewSyntaxRule({ ...newSyntaxRule, pattern: e.target.value })}
                  placeholder="if EXPR { BLOCK }"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tokens (comma-separated)</label>
                <input
                  type="text"
                  value={newSyntaxRule.tokens}
                  onChange={(e) => setNewSyntaxRule({ ...newSyntaxRule, tokens: e.target.value })}
                  placeholder="if, {, }"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precedence</label>
                <input
                  type="number"
                  value={newSyntaxRule.precedence}
                  onChange={(e) => setNewSyntaxRule({ ...newSyntaxRule, precedence: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <button
              onClick={addSyntaxRule}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rule</span>
            </button>
          </div>

          <div className="space-y-2">
            {syntaxRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{rule.rule_type}</div>
                  <div className="text-sm font-mono text-gray-600 mt-1">{rule.pattern}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Tokens: {rule.tokens.join(', ')} | Precedence: {rule.precedence}
                  </div>
                </div>
                <button
                  onClick={() => onSyntaxChange(syntaxRules.filter((_, i) => i !== index))}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SyntaxEditor
