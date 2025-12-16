import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

function BuiltinsEditor({ builtinFunctions, onChange }) {
  const [newFunction, setNewFunction] = useState({
    name: '',
    parameters: [],
    return_type: 'void',
    implementation: '',
    description: ''
  })
  const [paramInput, setParamInput] = useState({ name: '', type: 'integer' })

  const addParameter = () => {
    if (!paramInput.name) return
    setNewFunction({
      ...newFunction,
      parameters: [...newFunction.parameters, { name: paramInput.name, type: paramInput.type }]
    })
    setParamInput({ name: '', type: 'integer' })
  }

  const removeParameter = (index) => {
    setNewFunction({
      ...newFunction,
      parameters: newFunction.parameters.filter((_, i) => i !== index)
    })
  }

  const addFunction = () => {
    if (!newFunction.name || !newFunction.description) {
      alert('Please fill in function name and description')
      return
    }
    onChange([...builtinFunctions, newFunction])
    setNewFunction({
      name: '',
      parameters: [],
      return_type: 'void',
      implementation: '',
      description: ''
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Built-in Functions</h2>
        <p className="text-gray-600">
          Define built-in functions that are available in your language.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900">Add Built-in Function</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Function Name</label>
            <input
              type="text"
              value={newFunction.name}
              onChange={(e) => setNewFunction({ ...newFunction, name: e.target.value })}
              placeholder="sqrt, abs, max..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
            <select
              value={newFunction.return_type}
              onChange={(e) => setNewFunction({ ...newFunction, return_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="void">Void</option>
              <option value="integer">Integer</option>
              <option value="float">Float</option>
              <option value="string">String</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={newFunction.description}
            onChange={(e) => setNewFunction({ ...newFunction, description: e.target.value })}
            placeholder="Calculates the square root of a number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parameters</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={paramInput.name}
              onChange={(e) => setParamInput({ ...paramInput, name: e.target.value })}
              placeholder="parameter name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={paramInput.type}
              onChange={(e) => setParamInput({ ...paramInput, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="integer">Integer</option>
              <option value="float">Float</option>
              <option value="string">String</option>
              <option value="boolean">Boolean</option>
            </select>
            <button
              type="button"
              onClick={addParameter}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {newFunction.parameters.map((param, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded">
                <span className="text-sm">
                  <span className="font-mono">{param.name}</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-600">{param.type}</span>
                </span>
                <button
                  onClick={() => removeParameter(index)}
                  className="text-red-600 hover:bg-red-50 rounded p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Implementation (Python code)
          </label>
          <textarea
            value={newFunction.implementation}
            onChange={(e) => setNewFunction({ ...newFunction, implementation: e.target.value })}
            placeholder="import math&#10;return math.sqrt(args[0])"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          />
        </div>

        <button
          onClick={addFunction}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Function</span>
        </button>
      </div>

      <div className="space-y-2">
        {builtinFunctions.length === 0 ? (
          <p className="text-gray-500 text-sm">No custom built-in functions defined yet.</p>
        ) : (
          builtinFunctions.map((func, index) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-mono font-bold text-purple-600">{func.name}</span>
                    <span className="text-gray-500">
                      ({func.parameters.map(p => `${p.name}: ${p.type}`).join(', ')})
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="text-blue-600">{func.return_type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{func.description}</p>
                  {func.implementation && (
                    <pre className="text-xs bg-gray-50 p-2 rounded font-mono overflow-x-auto">
                      {func.implementation}
                    </pre>
                  )}
                </div>
                <button
                  onClick={() => onChange(builtinFunctions.filter((_, i) => i !== index))}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BuiltinsEditor
