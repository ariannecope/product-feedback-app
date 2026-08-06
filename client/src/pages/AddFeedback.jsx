import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addSuggestion } from "../lib/api";
import { validateSuggestion } from "../utils/validateSuggestion";
import { CATEGORIES } from "../constants/categories";
import "./AddFeedback.css";

const INITIAL_VALUES = { title: "", category: "", description: "" };

function AddFeedback() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => navigate("/"), 900);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  function handleChange(field) {
    return (e) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedValues = {
      title: values.title.trim(),
      category: values.category,
      description: values.description.trim(),
    };

    const validationErrors = validateSuggestion(trimmedValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormError("Please fix the errors below and try again.");
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("submitting");

    addSuggestion(trimmedValues)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("idle");
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
          setFormError("Please fix the errors below and try again.");
        } else {
          setFormError("Something went wrong creating the suggestion. Please try again.");
        }
      });
  }

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  return (
    <main className="add-feedback">
      <div className="add-feedback__header">
        <h1>Add Suggestion</h1>
        <Link to="/" className="add-feedback__cancel-link">
          Cancel
        </Link>
      </div>

      {isSuccess && (
        <p className="add-feedback__success" role="status">
          Suggestion added! Taking you back to the list…
        </p>
      )}

      {!isSuccess && (
        <form className="add-feedback__form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="add-feedback__form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="add-feedback__field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={values.title}
              onChange={handleChange("title")}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="add-feedback__field-error" id="title-error" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="add-feedback__field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={values.category}
              onChange={handleChange("category")}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "category-error" : undefined}
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="add-feedback__field-error" id="category-error" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          <div className="add-feedback__field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={5}
              value={values.description}
              onChange={handleChange("description")}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "description-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="add-feedback__field-error" id="description-error" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="add-feedback__actions">
            <Link to="/" className="add-feedback__back-link">
              Back
            </Link>
            <button type="submit" className="add-feedback__submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add Suggestion"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

export default AddFeedback;
