import { useState, useEffect, useRef } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-typescript"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

const LANGUAGES = ["javascript", "typescript", "python", "java", "c", "cpp"]

const MODES = [
  { id: "review",     label: "🔍 Review",     endpoint: "/ai/get-review",          desc: "Full code review" },
  { id: "bugfix",     label: "🐛 Fix Bugs",    endpoint: "/ai/fix-bugs",            desc: "Auto-detect & fix bugs" },
  { id: "complexity", label: "📊 Complexity",  endpoint: "/ai/analyze-complexity",  desc: "Time & space analysis" },
  { id: "explain",    label: "💡 Explain",     endpoint: "/ai/explain",             desc: "Plain-English explanation" },
]

const FOCUS_OPTIONS = [
  "general review", "security", "performance", "readability", "best practices"
]

const SAMPLE_CODES = {
  javascript: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(40));`,
  python: `def find_duplicates(arr):\n    duplicates = []\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            if arr[i] == arr[j]:\n                duplicates.append(arr[i])\n    return duplicates\n\nprint(find_duplicates([1,2,3,2,4,3]))`,
  typescript: `async function fetchUser(id: number) {\n  const res = await fetch(\`/api/users/\${id}\`);\n  const data = res.json();\n  return data;\n}`,
  java: `public class BubbleSort {\n    public static void sort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < n - i - 1; j++)\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n    }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    char buf[10];\n    gets(buf);\n    printf("Hello, %s\\n", buf);\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    cout << factorial(20) << endl;\n}`
}

export default function App() {
  const [code, setCode]           = useState(SAMPLE_CODES.javascript)
  const [language, setLanguage]   = useState("javascript")
  const [mode, setMode]           = useState(MODES[0])
  const [focus, setFocus]         = useState(FOCUS_OPTIONS[0])
  const [result, setResult]       = useState("")
  const [loading, setLoading]     = useState(false)
  const [history, setHistory]     = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [charCount, setCharCount] = useState(0)
  const resultRef = useRef(null)

  useEffect(() => { prism.highlightAll() }, [])
  useEffect(() => { setCharCount(code.length) }, [code])
  useEffect(() => {
    setCode(SAMPLE_CODES[language] || code)
  }, [language])

  const getHighlightLang = () => {
    const map = { cpp: "clike", c: "clike" }
    return map[language] || language
  }

  async function runAnalysis() {
    if (!code.trim()) return
    setLoading(true)
    setResult("")
    try {
      const payload = { code, language }
      if (mode.id === "review") payload.focus = focus
      const res = await axios.post(`http://localhost:3000${mode.endpoint}`, payload)
      const text = res.data.result
      setResult(text)
      // save to history
      setHistory(prev => [{
        id: Date.now(),
        mode: mode.label,
        language,
        codeSnippet: code.slice(0, 60) + (code.length > 60 ? "…" : ""),
        result: text,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)])
      setTimeout(() => resultRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 100)
    } catch (err) {
      setResult(`❌ **Error:** ${err.response?.data?.error || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function loadFromHistory(item) {
    setResult(item.result)
    setShowHistory(false)
  }

  function copyResult() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function clearAll() {
    setCode(SAMPLE_CODES[language])
    setResult("")
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡</span>
          <div>
            <h1>AI Code Reviewer</h1>
            <span className="powered">Powered by LangChain + MISTRAL AI</span>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-ghost" onClick={() => setShowHistory(!showHistory)}>
            🕓 History {history.length > 0 && <span className="badge">{history.length}</span>}
          </button>
        </div>
      </header>

      {/* ── Toolbar ── */}
      <div className="toolbar">
        <div className="toolbar-group">
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="toolbar-group">
          <label>Mode</label>
          <div className="mode-tabs">
            {MODES.map(m => (
              <button
                key={m.id}
                className={`mode-tab ${mode.id === m.id ? "active" : ""}`}
                onClick={() => setMode(m)}
                title={m.desc}
              >{m.label}</button>
            ))}
          </div>
        </div>

        {mode.id === "review" && (
          <div className="toolbar-group">
            <label>Focus</label>
            <select value={focus} onChange={e => setFocus(e.target.value)}>
              {FOCUS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        )}

        <div className="toolbar-right">
          <span className="char-count">{charCount} chars</span>
          <button className="btn-ghost" onClick={clearAll}>↺ Reset</button>
          <button className="btn-primary" onClick={runAnalysis} disabled={loading}>
            {loading ? <><span className="spinner"></span> Analyzing…</> : `${mode.label}`}
          </button>
        </div>
      </div>

      {/* ── Main Panels ── */}
      <main className="panels">
        {/* Left: Editor */}
        <div className="panel panel-left">
          <div className="panel-header">
            <span>📝 Code Editor</span>
            <span className="lang-badge">{language}</span>
          </div>
          <div className="editor-wrap">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={c => prism.highlight(c, prism.languages[getHighlightLang()] || prism.languages.javascript, getHighlightLang())}
              padding={16}
              style={{ fontFamily: '"Fira Code", monospace', fontSize: 14, minHeight: "100%", background: "transparent" }}
            />
          </div>
        </div>

        {/* Right: Result */}
        <div className="panel panel-right" ref={resultRef}>
          <div className="panel-header">
            <span>🤖 AI Analysis</span>
            {result && (
              <button className="btn-ghost small" onClick={copyResult}>
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>
            )}
          </div>
          <div className="result-body">
            {loading && (
              <div className="loading-state">
                <div className="pulse-ring"></div>
                <p>LangChain is analyzing your code…</p>
                <span className="loading-mode">{mode.desc}</span>
              </div>
            )}
            {!loading && !result && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>Select a mode and click <strong>{mode.label}</strong> to analyze your code</p>
                <div className="mode-hints">
                  {MODES.map(m => (
                    <div key={m.id} className="hint-chip" onClick={() => setMode(m)}>
                      {m.label} <span>{m.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!loading && result && (
              <Markdown rehypePlugins={[rehypeHighlight]}>{result}</Markdown>
            )}
          </div>
        </div>
      </main>

      {/* ── History Drawer ── */}
      {showHistory && (
        <div className="history-overlay" onClick={() => setShowHistory(false)}>
          <div className="history-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>🕓 Review History</h3>
              <button onClick={() => setShowHistory(false)}>✕</button>
            </div>
            {history.length === 0 ? (
              <p className="empty-history">No reviews yet</p>
            ) : (
              history.map(item => (
                <div key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
                  <div className="hi-top">
                    <span className="hi-mode">{item.mode}</span>
                    <span className="hi-lang">{item.language}</span>
                    <span className="hi-time">{item.timestamp}</span>
                  </div>
                  <code className="hi-snippet">{item.codeSnippet}</code>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
