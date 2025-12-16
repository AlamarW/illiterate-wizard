import React from 'react'

function LanguageConfig({ spec, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...spec, [field]: value })
  }

  const handleCommentChange = (field, value) => {
    onChange({
      ...spec,
      comment_syntax: { ...spec.comment_syntax, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Language Configuration</h2>
        <p className="text-gray-600 mb-6">
          Define the basic properties of your programming language.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language Name *
          </label>
          <input
            type="text"
            value={spec.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="MyLang"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Version
          </label>
          <input
            type="text"
            value={spec.version}
            onChange={(e) => handleChange('version', e.target.value)}
            placeholder="1.0.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={spec.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="A brief description of your language..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Language Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language Type
          </label>
          <select
            value={spec.language_type}
            onChange={(e) => handleChange('language_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="interpreted">Interpreted</option>
            <option value="compiled">Compiled</option>
          </select>
        </div>

        {/* File Extension */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Extension
          </label>
          <input
            type="text"
            value={spec.file_extension}
            onChange={(e) => handleChange('file_extension', e.target.value)}
            placeholder=".prog"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Target Language (for compiled) */}
        {spec.language_type === 'compiled' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <select
              value={spec.target_language}
              onChange={(e) => handleChange('target_language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
            </select>
          </div>
        )}
      </div>

      {/* Comment Syntax */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment Syntax</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Single Line
            </label>
            <input
              type="text"
              value={spec.comment_syntax.single_line}
              onChange={(e) => handleCommentChange('single_line', e.target.value)}
              placeholder="//"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Multi-line Start
            </label>
            <input
              type="text"
              value={spec.comment_syntax.multi_line_start}
              onChange={(e) => handleCommentChange('multi_line_start', e.target.value)}
              placeholder="/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Multi-line End
            </label>
            <input
              type="text"
              value={spec.comment_syntax.multi_line_end}
              onChange={(e) => handleCommentChange('multi_line_end', e.target.value)}
              placeholder="*/"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageConfig
