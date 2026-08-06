const express = require("express");
const pool = require("../config/db");
const { CATEGORIES } = require("../constants/categories");

const router = express.Router();

const SUGGESTION_COLUMNS = "id, title, description, category, created_at";

// Mirrors the validation rules in PRD.md section 2.2, re-checked here since
// the server must not rely on client-side validation alone.
function validateSuggestion({ title, description, category }) {
  const errors = {};

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.title = "Title is required.";
  } else if (title.trim().length > 100) {
    errors.title = "Title must be 100 characters or fewer.";
  }

  if (typeof category !== "string" || !CATEGORIES.includes(category)) {
    errors.category = "Please select a category.";
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    errors.description = "Description is required.";
  } else if (description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  } else if (description.trim().length > 1000) {
    errors.description = "Description must be 1000 characters or fewer.";
  }

  return errors;
}

router.get("/get-all-suggestions", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${SUGGESTION_COLUMNS} FROM suggestions ORDER BY created_at DESC`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res
      .status(500)
      .json({ error: "Something went wrong loading suggestions." });
  }
});

router.get("/get-suggestions-by-category/:category", async (req, res) => {
  const { category } = req.params;

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category value." });
  }

  try {
    const { rows } = await pool.query(
      `SELECT ${SUGGESTION_COLUMNS} FROM suggestions WHERE category = $1 ORDER BY created_at DESC`,
      [category]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching suggestions by category:", err);
    res
      .status(500)
      .json({ error: "Something went wrong loading suggestions." });
  }
});

router.post("/add-one-suggestion", async (req, res) => {
  const { title, description, category } = req.body ?? {};
  const errors = validateSuggestion({ title, description, category });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO suggestions (title, description, category)
       VALUES ($1, $2, $3)
       RETURNING ${SUGGESTION_COLUMNS}`,
      [title.trim(), description.trim(), category]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating suggestion:", err);
    res
      .status(500)
      .json({ error: "Something went wrong creating the suggestion." });
  }
});

module.exports = router;
