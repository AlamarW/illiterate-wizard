import React, { useState } from 'react'
import { Wand2, FileCode, Download, Play } from 'lucide-react'
import GrammarDesigner from './components/GrammarDesigner'
import SyntaxEditor from './components/SyntaxEditor'
import SemanticsEditor from './components/SemanticsEditor'
import BuiltinsEditor from './components/BuiltinsEditor'
import LanguageConfig from './components/LanguageConfig'
import Preview from './components/Preview'
import api from './services/api'

function App() {
  const [activeTab, setActiveTab] = useState('config')
  const [languageSpec, setLanguageSpec] = useState({
    name: '',
    version: '1.0.0',
    description: '',
    language_type: 'interpreted',
    grammar_rules: [],
    syntax_rules: [],
    semantic_actions: [],
    keywords: [],
    operators: [],
    builtin_functions: [],
    data_types: ['integer', 'float', 'string', 'boolean'],
    target_language: 'python',
    file_extension: '.prog',
    comment_syntax: {
      single_line: '//',
      multi_line_start: '/*',
      multi_line_end: '*/'
    }
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState(null)

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      const response = await api.generateLanguage({
        specification: languageSpec,
        include_examples: true,
        include_documentation: true
      })
      setGeneratedResult(response.data)
      alert('Language generated successfully!')
    } catch (error) {
      console.error('Error generating language:', error)
      alert('Error generating language: ' + (error.response?.data?.detail || error.message))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await api.downloadLanguage(languageSpec.name)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${languageSpec.name}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading language:', error)
      alert('Error downloading language: ' + (error.response?.data?.detail || error.message))
    }
  }

  const handleSave = async () => {
    try {
      await api.saveLanguage(languageSpec)
      alert('Language specification saved!')
    } catch (error) {
      console.error('Error saving language:', error)
      alert('Error saving language: ' + (error.response?.data?.detail || error.message))
    }
  }

  const tabs = [
    { id: 'config', label: 'Configuration', icon: FileCode },
    { id: 'grammar', label: 'Grammar', icon: Wand2 },
    { id: 'syntax', label: 'Syntax', icon: FileCode },
    { id: 'semantics', label: 'Semantics', icon: FileCode },
    { id: 'builtins', label: 'Built-ins', icon: FileCode },
    { id: 'preview', label: 'Preview', icon: Play }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wand2 className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Illiterate Wizard</h1>
                <p className="text-sm text-gray-600">Generate programming languages with a click!</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Save Spec
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !languageSpec.name}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Language'}</span>
              </button>
              {generatedResult && (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'config' && (
              <LanguageConfig
                spec={languageSpec}
                onChange={setLanguageSpec}
              />
            )}
            {activeTab === 'grammar' && (
              <GrammarDesigner
                grammarRules={languageSpec.grammar_rules}
                onChange={rules => setLanguageSpec({ ...languageSpec, grammar_rules: rules })}
              />
            )}
            {activeTab === 'syntax' && (
              <SyntaxEditor
                syntaxRules={languageSpec.syntax_rules}
                keywords={languageSpec.keywords}
                operators={languageSpec.operators}
                onSyntaxChange={rules => setLanguageSpec({ ...languageSpec, syntax_rules: rules })}
                onKeywordsChange={keywords => setLanguageSpec({ ...languageSpec, keywords })}
                onOperatorsChange={operators => setLanguageSpec({ ...languageSpec, operators })}
              />
            )}
            {activeTab === 'semantics' && (
              <SemanticsEditor
                semanticActions={languageSpec.semantic_actions}
                onChange={actions => setLanguageSpec({ ...languageSpec, semantic_actions: actions })}
              />
            )}
            {activeTab === 'builtins' && (
              <BuiltinsEditor
                builtinFunctions={languageSpec.builtin_functions}
                onChange={functions => setLanguageSpec({ ...languageSpec, builtin_functions: functions })}
              />
            )}
            {activeTab === 'preview' && (
              <Preview
                spec={languageSpec}
                generatedResult={generatedResult}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
