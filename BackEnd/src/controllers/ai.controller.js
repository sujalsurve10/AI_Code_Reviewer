const { reviewCode, fixBugs, analyzeComplexity, explainCode } = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    const { code, language = "javascript", focus = "general review" } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });
    try {
        const result = await reviewCode({ code, language, focus });
        res.json({ result, mode: "review" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.fixBugs = async (req, res) => {
    const { code, language = "javascript" } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });
    try {
        const result = await fixBugs({ code, language });
        res.json({ result, mode: "bugfix" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.analyzeComplexity = async (req, res) => {
    const { code, language = "javascript" } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });
    try {
        const result = await analyzeComplexity({ code, language });
        res.json({ result, mode: "complexity" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.explainCode = async (req, res) => {
    const { code, language = "javascript" } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });
    try {
        const result = await explainCode({ code, language });
        res.json({ result, mode: "explain" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
