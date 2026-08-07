import { formatDate } from "../utils/formatDate";
import "./SuggestionCard.css";

function SuggestionCard({ suggestion }) {
  const { title, description, category, created_at } = suggestion;

  return (
    <li className="suggestion-card">
      <h2 className="suggestion-card__title">{title}</h2>
      <p className="suggestion-card__description">{description}</p>
      <div className="suggestion-card__footer">
        <span className="suggestion-card__category">{category}</span>
        <span className="suggestion-card__date">{formatDate(created_at)}</span>
      </div>
    </li>
  );
}

export default SuggestionCard;
