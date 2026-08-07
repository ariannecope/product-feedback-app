import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSuggestions } from "../lib/api";
import BrandBlock from "../components/BrandBlock";
import CategoryFilter from "../components/CategoryFilter";
import SuggestionCard from "../components/SuggestionCard";
import EmptyState from "../components/EmptyState";
import { PlusIcon, LightbulbIcon } from "../components/icons";
import "./Home.css";

function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let isCancelled = false;

    setStatus("loading");
    fetchSuggestions(activeCategory)
      .then((data) => {
        if (isCancelled) return;
        setSuggestions(data);
        setStatus("success");
      })
      .catch(() => {
        if (isCancelled) return;
        setStatus("error");
      });

    return () => {
      isCancelled = true;
    };
  }, [activeCategory]);

  const addFeedbackButton = (
    <Link to="/add" className="home__add-button">
      <PlusIcon /> Add Feedback
    </Link>
  );

  return (
    <main className="home">
      <h1 className="visually-hidden">Product Feedback Suggestions</h1>

      <BrandBlock />

      <div className="home__toolbar">
        <span className="home__count">
          <LightbulbIcon />
          {suggestions.length} Suggestions
        </span>
        {addFeedbackButton}
      </div>

      <div className="home__filters">
        <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="home__panel">
        {status === "loading" && (
          <p className="home__status" role="status">
            Loading suggestions…
          </p>
        )}

        {status === "error" && (
          <p className="home__status home__status--error" role="alert">
            Something went wrong loading suggestions. Please try again.
          </p>
        )}

        {status === "success" && suggestions.length === 0 && activeCategory === "All" && (
          <EmptyState
            heading="There is no feedback yet."
            subtitle="Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app."
            cta={addFeedbackButton}
          />
        )}

        {status === "success" && suggestions.length === 0 && activeCategory !== "All" && (
          <EmptyState
            heading="No suggestions found in this category."
            subtitle="Try a different filter, or be the first to add feedback here."
          />
        )}

        {status === "success" && suggestions.length > 0 && (
          <ul className="home__list">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default Home;
