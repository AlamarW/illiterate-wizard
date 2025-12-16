import React, { useState, useCallback } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Plus, Trash2 } from 'lucide-react'

const initialNodes = []
const initialEdges = []

function GrammarDesigner({ grammarRules, onChange }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedRule, setSelectedRule] = useState(null)
  const [editingRule, setEditingRule] = useState({
    name: '',
    pattern: '',
    description: ''
  })

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const addGrammarRule = () => {
    if (!editingRule.name || !editingRule.pattern) {
      alert('Please fill in name and pattern')
      return
    }

    const nodeId = `node-${Date.now()}`
    const newRule = {
      ...editingRule,
      node_id: nodeId,
      x: Math.random() * 400,
      y: Math.random() * 400
    }

    const newNode = {
      id: nodeId,
      type: 'default',
      position: { x: newRule.x, y: newRule.y },
      data: {
        label: (
          <div className="p-2">
            <div className="font-bold">{newRule.name}</div>
            <div className="text-xs text-gray-600">{newRule.pattern}</div>
          </div>
        )
      }
    }

    setNodes((nds) => [...nds, newNode])
    onChange([...grammarRules, newRule])

    setEditingRule({ name: '', pattern: '', description: '' })
  }

  const deleteRule = (ruleId) => {
    const updatedRules = grammarRules.filter(r => r.node_id !== ruleId)
    const updatedNodes = nodes.filter(n => n.id !== ruleId)
    setNodes(updatedNodes)
    onChange(updatedRules)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Grammar Designer</h2>
        <p className="text-gray-600">
          Design your language grammar visually. Create grammar rules and connect them to define your language structure.
        </p>
      </div>

      {/* Rule Editor */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900">Add Grammar Rule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name
            </label>
            <input
              type="text"
              value={editingRule.name}
              onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
              placeholder="expression"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pattern (EBNF)
            </label>
            <input
              type="text"
              value={editingRule.pattern}
              onChange={(e) => setEditingRule({ ...editingRule, pattern: e.target.value })}
              placeholder="term (('+' | '-') term)*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={editingRule.description}
              onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
              placeholder="Addition/subtraction"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={addGrammarRule}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Visual Designer */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Rules List */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Grammar Rules</h3>
        <div className="space-y-2">
          {grammarRules.length === 0 ? (
            <p className="text-gray-500 text-sm">No grammar rules defined yet.</p>
          ) : (
            grammarRules.map((rule) => (
              <div key={rule.node_id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{rule.name}</div>
                  <div className="text-sm text-gray-600 font-mono">{rule.pattern}</div>
                  {rule.description && (
                    <div className="text-xs text-gray-500 mt-1">{rule.description}</div>
                  )}
                </div>
                <button
                  onClick={() => deleteRule(rule.node_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default GrammarDesigner
