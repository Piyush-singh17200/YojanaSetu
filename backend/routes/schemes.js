const express = require("express");
const router = express.Router();
const { SCHEMES, CATEGORIES } = require("../data/schemes");

// GET /api/schemes - list all schemes (optionally filter by category)
router.get("/", (req, res) => {
  const { category } = req.query;
  const results = category && category !== "all"
    ? SCHEMES.filter((s) => s.category === category)
    : SCHEMES;
  res.json(results.map((s) => ({ ...s, match: s.baseMatch })));
});

// GET /api/schemes/categories - category metadata
router.get("/categories", (req, res) => {
  res.json(CATEGORIES);
});

// GET /api/schemes/:id - single scheme detail
router.get("/:id", (req, res) => {
  const scheme = SCHEMES.find((s) => s.id === req.params.id);
  if (!scheme) return res.status(404).json({ error: "Scheme not found" });
  res.json({ ...scheme, match: scheme.baseMatch });
});

// Very small rule-based matcher. In production this would be a proper
// eligibility rules engine; this gives sensible, explainable results
// for an MVP without needing a database of legal rule text.
function computeMatch(profile, scheme) {
  let score = scheme.baseMatch;

  const income = profile.income || "";
  const occupation = (profile.occupation || "").toLowerCase();
  const education = (profile.education || "").toLowerCase();
  const gender = (profile.gender || "").toLowerCase();
  const category = (profile.category || "").toLowerCase();

  const lowIncome = income.includes("Below") || income.includes("1,00,000") || income.includes("2,50,000");

  if (scheme.category === "education" && (occupation.includes("student") || education.includes("undergraduate") || education.includes("postgraduate"))) score += 6;
  if (scheme.category === "education" && lowIncome) score += 3;

  if (scheme.category === "agriculture" && occupation.includes("farmer")) score += 8;

  if (scheme.category === "business" && (occupation.includes("self-employed") || occupation.includes("business"))) score += 6;
  if (scheme.id === "stand-up-india" && (gender === "female" || category === "sc" || category === "st")) score += 10;

  if (scheme.category === "women" && gender === "female") score += 8;

  if (scheme.category === "health" && lowIncome) score += 5;

  return Math.max(20, Math.min(99, Math.round(score)));
}

// POST /api/schemes/match - personalised ranking based on onboarding profile
router.post("/match", express.json(), (req, res) => {
  const profile = req.body || {};
  const ranked = SCHEMES
    .map((s) => ({ ...s, match: computeMatch(profile, s) }))
    .sort((a, b) => b.match - a.match);
  res.json(ranked);
});

module.exports = router;
