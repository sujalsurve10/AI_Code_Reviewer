# ⚡ AI Code Reviewer v2.0

> Full-stack AI code review tool built with **LangChain**, **Gemini 2.0 Flash**, **React**, and **Express**.

## ✨ New Features (v2.0)

| Feature | Description |
|---|---|
| 🦜 **LangChain Integration** | Uses `@langchain/google-genai` with `RunnableSequence`, `ChatPromptTemplate`, and `StringOutputParser` chains |
| 🔍 **4 Analysis Modes** | Code Review, Bug Fixer, Complexity Analyzer, Code Explainer |
| 🌐 **Multi-Language Support** | JavaScript, TypeScript, Python, Java, C, C++ |
| 🎯 **Focus Areas** | Target reviews by General / Security / Performance / Readability |
| 🕓 **Review History** | Last 10 reviews saved in-session with drawer UI |
| 📋 **Copy Output** | One-click copy of AI-generated review |
| ↺ **Sample Code** | Auto-loads language-specific buggy sample code for demo |

## 🏗️ Architecture

```
Frontend (React + Vite)
    │  axios POST /ai/*
    ▼
Backend (Express)
    │  ai.routes.js → ai.controller.js
    ▼
LangChain Service
    ├── reviewChain       → /ai/get-review
    ├── bugFixChain       → /ai/fix-bugs
    ├── complexityChain   → /ai/analyze-complexity
    └── explainChain      → /ai/explain
    │
    ▼
Google Gemini 2.0 Flash (via @langchain/google-genai)
```

## 🚀 Setup

### Backend
```bash
cd BackEnd
npm install
echo "GOOGLE_GEMINI_KEY=your_key_here" > .env
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## 🔑 Environment Variables

```
GOOGLE_GEMINI_KEY=your_google_ai_studio_key
```

Get your key at: https://aistudio.google.com/apikey

## 🛠️ Tech Stack

- **LangChain** — `@langchain/google-genai`, `@langchain/core` (chains, prompts, parsers)
- **Gemini 2.0 Flash** — fast, capable LLM
- **Express.js** — REST API backend
- **React + Vite** — frontend
- **react-simple-code-editor** + **Prism.js** — syntax-highlighted editor
- **react-markdown** + **rehype-highlight** — rendered AI output

## 📸 Key LangChain Concepts Used

```js
// Prompt template
const prompt = ChatPromptTemplate.fromMessages([...]);

// Chain composition
const chain = RunnableSequence.from([prompt, model, new StringOutputParser()]);

// Invoke
const result = await chain.invoke({ code, language, focus });
```
