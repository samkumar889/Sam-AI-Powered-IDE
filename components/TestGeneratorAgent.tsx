'use client'

import { useState } from 'react'
import { 
  FileCode, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Settings2, 
  Code2, 
  Globe,
  Loader2
} from 'lucide-react'

type TestType = 'unit' | 'integration' | 'e2e'
type TestStatus = 'idle' | 'generating' | 'success' | 'error'

interface TestFile {
  id: string
  name: string
  type: TestType
  content: string
  status: 'pending' | 'generating' | 'success' | 'error'
}

export default function TestGeneratorAgent() {
  const [targetFile, setTargetFile] = useState('')
  const [testTypes, setTestTypes] = useState<TestType[]>(['unit'])
  const [testFiles, setTestFiles] = useState<TestFile[]>([])
  const [status, setStatus] = useState<TestStatus>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const toggleTestType = (type: TestType) => {
    setTestTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    )
  }

  const generateTests = async () => {
    if (!targetFile) {
      addLog('Please select or enter a target file path')
      return
    }

    setStatus('generating')
    addLog('Starting test generation...')

    // Simulate generating different test types
    const newTestFiles: TestFile[] = []

    if (testTypes.includes('unit')) {
      newTestFiles.push({
        id: 'unit-1',
        name: targetFile.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1'),
        type: 'unit',
        content: `// Auto-generated Unit Test for ${targetFile}
import { describe, it, expect } from '@jest/globals'

describe('${targetFile}', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })
  
  it('should handle edge cases', () => {
    expect(1 + 1).toBe(2)
  })
})`,
        status: 'generating'
      })
    }

    if (testTypes.includes('integration')) {
      newTestFiles.push({
        id: 'integration-1',
        name: targetFile.replace(/\.(ts|tsx|js|jsx)$/, '.integration.test.$1'),
        type: 'integration',
        content: `// Auto-generated Integration Test for ${targetFile}
import { describe, it, expect } from '@jest/globals'

describe('${targetFile} Integration', () => {
  it('should work with dependencies', async () => {
    // Add your integration test logic here
    expect(true).toBe(true)
  })
})`,
        status: 'generating'
      })
    }

    if (testTypes.includes('e2e')) {
      newTestFiles.push({
        id: 'e2e-1',
        name: targetFile.replace(/\.(ts|tsx|js|jsx)$/, '.e2e.spec.ts'),
        type: 'e2e',
        content: `// Auto-generated E2E Test for ${targetFile}
import { test, expect } from '@playwright/test'

test('basic e2e flow', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/SAM AI/)
})`,
        status: 'generating'
      })
    }

    setTestFiles(newTestFiles)
    
    // Simulate generating each test file
    for (let i = 0; i < newTestFiles.length; i++) {
      const testFile = newTestFiles[i]
      addLog(`Generating ${testFile.type} test: ${testFile.name}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTestFiles(prev => prev.map(tf => 
        tf.id === testFile.id ? { ...tf, status: 'success' } : tf
      ))
      addLog(`✓ ${testFile.type} test generated successfully`)
    }

    setStatus('success')
    addLog('All tests generated successfully!')
  }

  const getTestTypeIcon = (type: TestType) => {
    switch (type) {
      case 'unit': return <Code2 className="w-4 h-4" />
      case 'integration': return <FileCode className="w-4 h-4" />
      case 'e2e': return <Globe className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 border-t border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-red-400" />
          <h2 className="font-semibold text-white">Auto Testing Agent</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {/* Target File Input */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Target File Path
            </label>
            <input
              type="text"
              value={targetFile}
              onChange={(e) => setTargetFile(e.target.value)}
              placeholder="e.g., components/MyComponent.tsx"
              className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          {/* Test Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Test Types to Generate
            </label>
            <div className="flex gap-3">
              {(['unit', 'integration', 'e2e'] as TestType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => toggleTestType(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    testTypes.includes(type)
                      ? 'bg-red-900/30 text-red-400 border border-red-700'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  {getTestTypeIcon(type)}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateTests}
            disabled={status === 'generating' || !targetFile || testTypes.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-700/20"
          >
            {status === 'generating' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Tests...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Generate Tests
              </>
            )}
          </button>

          {/* Generated Test Files */}
          {testFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Generated Test Files</h3>
              <div className="space-y-2">
                {testFiles.map((testFile) => (
                  <div
                    key={testFile.id}
                    className="bg-gray-950 border border-gray-800 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {testFile.status === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-red-400" />
                        ) : testFile.status === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                        )}
                        <span className="text-sm text-white font-medium">{testFile.name}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          testFile.type === 'unit' ? 'bg-blue-500/20 text-blue-400' :
                          testFile.type === 'integration' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {testFile.type}
                        </span>
                      </div>
                    </div>
                    <pre className="text-xs text-gray-400 bg-black/30 p-2 rounded overflow-x-auto">
                      {testFile.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="border-t border-gray-800">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/50">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Logs</h3>
            </div>
            <div className="px-4 py-2 max-h-48 overflow-auto bg-gray-950 font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="text-gray-400 py-0.5">{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
