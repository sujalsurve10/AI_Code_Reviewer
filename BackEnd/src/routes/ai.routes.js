const express = require('express');
const controller = require("../controllers/ai.controller");

const router = express.Router();

router.post("/get-review", controller.getReview);
router.post("/fix-bugs", controller.fixBugs);
router.post("/analyze-complexity", controller.analyzeComplexity);
router.post("/explain", controller.explainCode);

module.exports = router;
