# ⚡ AI Code Reviewer v2.0
> Full-stack AI code review tool built with **LangChain**, **Mistral AI (mistral-large-latest)**, **React**, and **Express**.

## ✨ Features

| Feature | Description |
|---|---|
| 🦜 **LangChain Integration** | Uses `@langchain/mistralai` with `RunnableSequence`, `ChatPromptTemplate`, and `StringOutputParser` chains |
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
Mistral AI — mistral-large-latest (via @langchain/mistralai)
```

## 🚀 Setup

### Backend
```bash
cd BackEnd
npm install
echo "MISTRAL_API_KEY=your_key_here" > .env
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
MISTRAL_API_KEY=your_mistral_api_key
```

Get your key at: https://console.mistral.ai/api-keys

## 🛠️ Tech Stack

- **LangChain** — `@langchain/mistralai`, `@langchain/core` (chains, prompts, parsers)
- **Mistral AI** — `mistral-large-latest` — powerful, fast LLM
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
