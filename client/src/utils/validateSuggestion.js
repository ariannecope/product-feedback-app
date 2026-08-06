import { CATEGORIES } from "../constants/categories";

// Mirrors the validation rules in PRD.md section 2.2 / server/src/routes/suggestions.js,
// re-checked here since the client must not be the only line of defense.
export function validateSuggestion({ title, category, description }) {
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
