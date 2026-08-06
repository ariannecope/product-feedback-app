import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSuggestions } from "../lib/api";
import CategoryFilter from "../components/CategoryFilter";
import SuggestionCard from "../components/SuggestionCard";
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

  return (
    <main className="home">
      <div className="home__header">
        <h1>Product Feedback</h1>
        <Link to="/add" className="home__add-link">
          Add Suggestion
        </Link>
      </div>

      <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

      <div className="home__list-area">
        {status === "loading" && <p role="status">Loading suggestions…</p>}

        {status === "error" && (
          <p className="home__error" role="alert">
            Something went wrong loading suggestions. Please try again.
          </p>
        )}

        {status === "success" && suggestions.length === 0 && activeCategory === "All" && (
          <div className="home__empty">
            <p>No suggestions yet. Be the first to add one!</p>
            <Link to="/add" className="home__add-link">
              Add Suggestion
            </Link>
          </div>
        )}

        {status === "success" && suggestions.length === 0 && activeCategory !== "All" && (
          <p className="home__empty">No suggestions found in this category.</p>
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
