import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addSuggestion } from "../lib/api";
import { validateSuggestion } from "../utils/validateSuggestion";
import { CATEGORIES } from "../constants/categories";
import { PlusIcon, ChevronLeftIcon, ChevronDownIcon } from "../components/icons";
import "./AddFeedback.css";

const INITIAL_VALUES = { title: "", category: "", description: "" };

const FIELD_LABELS = { title: "Title", category: "Category", description: "Description" };

function describeInvalidFields(fieldErrors) {
  const labels = Object.keys(fieldErrors).map((field) => FIELD_LABELS[field] ?? field);
  const fieldList =
    labels.length <= 1
      ? labels.join("")
      : labels.length === 2
        ? `${labels[0]} and ${labels[1]}`
        : `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;

  return `Almost there — just fix ${fieldList} before submitting.`;
}

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
      setFormError(describeInvalidFields(validationErrors));
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
          setFormError(describeInvalidFields(err.fieldErrors));
        } else {
          setFormError("Something went wrong creating the suggestion. Please try again.");
        }
      });
  }

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  return (
    <main className="add-feedback">
      <Link to="/" className="add-feedback__go-back">
        <ChevronLeftIcon /> Go Back
      </Link>

      <div className="add-feedback__card">
        <div className="add-feedback__badge">
          <PlusIcon width="16" height="16" />
        </div>

        {isSuccess ? (
          <p className="add-feedback__success" role="status">
            Suggestion added! Taking you back to the list…
          </p>
        ) : (
          <form className="add-feedback__form" onSubmit={handleSubmit} noValidate>
            <h1 className="add-feedback__heading">Create New Feedback</h1>

            {formError && (
              <p className="add-feedback__form-error" role="alert">
                {formError}
              </p>
            )}

            <div className="add-feedback__field">
              <label htmlFor="title">Feedback Title</label>
              <p className="add-feedback__hint">Add a short, descriptive headline</p>
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
              <p className="add-feedback__hint">Choose a category for your feedback</p>
              <div className="add-feedback__select-wrap">
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
                <ChevronDownIcon className="add-feedback__select-icon" />
              </div>
              {errors.category && (
                <p className="add-feedback__field-error" id="category-error" role="alert">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="add-feedback__field">
              <label htmlFor="description">Feedback Detail</label>
              <p className="add-feedback__hint">
                Include any specific comments on what should be improved, added, etc.
              </p>
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
              <Link to="/" className="add-feedback__cancel">
                Cancel
              </Link>
              <button type="submit" className="add-feedback__submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default AddFeedback;
