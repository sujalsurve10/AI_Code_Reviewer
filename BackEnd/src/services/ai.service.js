const { ChatMistralAI } = require("@langchain/mistralai");
const { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableSequence } = require("@langchain/core/runnables");

// ─── LangChain Model Setup ──────────────────────────────────────────────────
const model = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey:process.env.MISTRAl_API_KEY ,
    temperature: 0.3,
    maxOutputTokens: 4096,
});

// ─── System Prompt ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert code reviewer with 7+ years of development experience.
Your job is to analyze code and return structured, actionable feedback.

Focus on:
• Code Quality — clean, maintainable, well-structured code
• Best Practices — industry-standard coding patterns
• Performance — execution time and resource usage
• Security — vulnerabilities (SQL injection, XSS, CSRF, etc.)
• Scalability — future-proof design
• Readability — clear naming, comments, documentation

Review Format:
1. 📊 **Summary** — one-line verdict
2. ✅ **Strengths** — what's done well
3. ❌ **Issues** — bugs, risks, bad patterns (with line references if possible)
4. 🔧 **Refactored Code** — improved version with comments
5. 💡 **Pro Tips** — advanced suggestions specific to {language}

Tone: precise, constructive, expert. Assume the developer is competent.`;

// ─── Review Chain ────────────────────────────────────────────────────────────
const reviewPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
    HumanMessagePromptTemplate.fromTemplate(
        "Review this {language} code:\n\n```{language}\n{code}\n```\n\nFocus area: {focus}"
    )
]);

const reviewChain = RunnableSequence.from([
    reviewPrompt,
    model,
    new StringOutputParser()
]);

// ─── Bug Fix Chain ───────────────────────────────────────────────────────────
const bugFixPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        "You are a debugging expert. Identify ALL bugs in the given {language} code and provide the fully fixed version with explanations."
    ),
    HumanMessagePromptTemplate.fromTemplate(
        "Find and fix all bugs in this code:\n\n```{language}\n{code}\n```"
    )
]);

const bugFixChain = RunnableSequence.from([
    bugFixPrompt,
    model,
    new StringOutputParser()
]);

// ─── Complexity Analysis Chain ───────────────────────────────────────────────
const complexityPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        "You are an algorithms expert. Analyze time/space complexity and suggest optimizations."
    ),
    HumanMessagePromptTemplate.fromTemplate(
        "Analyze the complexity of this {language} code and suggest optimizations:\n\n```{language}\n{code}\n```"
    )
]);

const complexityChain = RunnableSequence.from([
    complexityPrompt,
    model,
    new StringOutputParser()
]);

// ─── Explain Code Chain ───────────────────────────────────────────────────────
const explainPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        "You are a patient coding teacher. Explain code clearly for developers of all levels."
    ),
    HumanMessagePromptTemplate.fromTemplate(
        "Explain what this {language} code does, step by step:\n\n```{language}\n{code}\n```"
    )
]);

const explainChain = RunnableSequence.from([
    explainPrompt,
    model,
    new StringOutputParser()
]);

// ─── Exported Service Functions ──────────────────────────────────────────────
async function reviewCode({ code, language = "javascript", focus = "general review" }) {
    return reviewChain.invoke({ code, language, focus });
}

async function fixBugs({ code, language = "javascript" }) {
    return bugFixChain.invoke({ code, language });
}

async function analyzeComplexity({ code, language = "javascript" }) {
    return complexityChain.invoke({ code, language });
}

async function explainCode({ code, language = "javascript" }) {
    return explainChain.invoke({ code, language });
}

module.exports = { reviewCode, fixBugs, analyzeComplexity, explainCode };
