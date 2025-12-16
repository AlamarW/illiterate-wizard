import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

function SemanticsEditor({ semanticActions, onChange }) {
  const [newAction, setNewAction] = useState({
    rule_name: '',
    action_type: 'evaluate',
    action_code: '',
    returns: null
  })

  const addAction = () => {
    if (!newAction.rule_name || !newAction.action_code) {
      alert('Please fill in rule name and action code')
      return
    }
    onChange([...semanticActions, newAction])
    setNewAction({ rule_name: '', action_type: 'evaluate', action_code: '', returns: null })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Semantic Actions</h2>
        <p className="text-gray-600">
          Define what happens when syntax rules are matched during parsing.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900">Add Semantic Action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
            <input
              type="text"
              value={newAction.rule_name}
              onChange={(e) => setNewAction({ ...newAction, rule_name: e.target.value })}
              placeholder="binary_operation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select
              value={newAction.action_type}
              onChange={(e) => setNewAction({ ...newAction, action_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="evaluate">Evaluate</option>
              <option value="declare">Declare</option>
              <option value="assign">Assign</option>
              <option value="call">Call</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Code (Python)</label>
            <textarea
              value={newAction.action_code}
              onChange={(e) => setNewAction({ ...newAction, action_code: e.target.value })}
              placeholder="left = evaluate(node.left)\nright = evaluate(node.right)\nreturn left + right"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
            <select
              value={newAction.returns || ''}
              onChange={(e) => setNewAction({ ...newAction, returns: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">None</option>
              <option value="integer">Integer</option>
              <option value="float">Float</option>
              <option value="string">String</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        </div>
        <button
          onClick={addAction}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Action</span>
        </button>
      </div>

      <div className="space-y-2">
        {semanticActions.length === 0 ? (
          <p className="text-gray-500 text-sm">No semantic actions defined yet.</p>
        ) : (
          semanticActions.map((action, index) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{action.rule_name}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {action.action_type}
                    </span>
                    {action.returns && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        → {action.returns}
                      </span>
                    )}
                  </div>
                  <pre className="text-sm bg-gray-50 p-2 rounded font-mono overflow-x-auto">
                    {action.action_code}
                  </pre>
                </div>
                <button
                  onClick={() => onChange(semanticActions.filter((_, i) => i !== index))}
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

export default SemanticsEditor
