const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function fetchSuggestions(category) {
  const url =
    category && category !== "All"
      ? `${API_BASE_URL}/get-suggestions-by-category/${encodeURIComponent(category)}`
      : `${API_BASE_URL}/get-all-suggestions`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch suggestions");
  }

  return response.json();
}

export async function addSuggestion(suggestion) {
  const response = await fetch(`${API_BASE_URL}/add-one-suggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(suggestion),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error("Failed to create suggestion");
    error.fieldErrors = data?.errors ?? null;
    throw error;
  }

  return data;
}
