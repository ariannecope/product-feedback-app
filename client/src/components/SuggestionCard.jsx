import { formatDate } from "../utils/formatDate";
import "./SuggestionCard.css";

function SuggestionCard({ suggestion }) {
  const { title, description, category, created_at } = suggestion;

  return (
    <li className="suggestion-card">
      <div className="suggestion-card__header">
        <h3 className="suggestion-card__title">{title}</h3>
        <span className="suggestion-card__category">{category}</span>
      </div>
      <p className="suggestion-card__description">{description}</p>
      <span className="suggestion-card__date">{formatDate(created_at)}</span>
    </li>
  );
}

export default SuggestionCard;
