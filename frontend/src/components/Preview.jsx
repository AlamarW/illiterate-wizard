import React from 'react'
import { FileCode, CheckCircle } from 'lucide-react'

function Preview({ spec, generatedResult }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Preview</h2>
        <p className="text-gray-600">
          Preview your language specification and generated files.
        </p>
      </div>

      {/* Language Spec Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Specification Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Name:</span>
            <div className="font-medium text-gray-900">{spec.name || 'Not set'}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Type:</span>
            <div className="font-medium text-gray-900 capitalize">{spec.language_type}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">File Extension:</span>
            <div className="font-medium text-gray-900">{spec.file_extension}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Version:</span>
            <div className="font-medium text-gray-900">{spec.version}</div>
          </div>
        </div>
      </div>

      {/* Components Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{spec.grammar_rules.length}</div>
          <div className="text-sm text-gray-600">Grammar Rules</div>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{spec.keywords.length}</div>
          <div className="text-sm text-gray-600">Keywords</div>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{spec.operators.length}</div>
          <div className="text-sm text-gray-600">Operators</div>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{spec.builtin_functions.length}</div>
          <div className="text-sm text-gray-600">Built-in Functions</div>
        </div>
      </div>

      {/* Generated Files */}
      {generatedResult && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Language Generated Successfully!
            </h3>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Language:</strong> {generatedResult.language_name}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Type:</strong> {generatedResult.language_type}
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Generated Files:</div>
              <div className="bg-white rounded p-3 max-h-60 overflow-y-auto">
                {generatedResult.files_generated && generatedResult.files_generated.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 py-1 text-sm">
                    <FileCode className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-xs text-gray-600">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spec JSON Preview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specification JSON</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-xs font-mono">
            {JSON.stringify(spec, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Preview
