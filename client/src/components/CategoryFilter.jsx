import { CATEGORIES } from "../constants/categories";
import "./CategoryFilter.css";

const OPTIONS = ["All", ...CATEGORIES];

function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter suggestions by category">
      {OPTIONS.map((option) => {
        const isActive = option === activeCategory;
        return (
          <button
            key={option}
            type="button"
            className={`category-filter__button${isActive ? " category-filter__button--active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onChange(option)}
          >
            {isActive && <span aria-hidden="true">✓ </span>}
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
