## Project Context

This project is an educational full-stack application built as part of the AnnieCannons AI-Assisted Track. The goal is to create a functional Product Feedback application using React, Node.js, Express, PostgreSQL, and modern deployment workflows. The application should prioritize completing required functionality while avoiding unnecessary features outside the project scope.

| | |
|---|---|
| **Status** | Draft — Milestone 1 |
| **Owner** | Arianne Cope |
| **Last updated** | 2026-08-05 |

---

## 1. Overview

### 1.1 What the application does

The Product Feedback App is a web application that lets customers submit suggestions for how a product could be improved, and lets anyone browse existing suggestions. It gives a company a lightweight, centralized place to collect and review product feedback instead of scattering it across email, chat, or spreadsheets.

### 1.2 Target users

- **Customers / end users of the product** — people who use the product and want to suggest improvements or view existing feedback from other customers.

The application is focused on the customer feedback experience. Internal company tools, administration features, and moderation workflows are outside the scope of this milestone.

### 1.3 Problem being solved

Companies often have no structured, visible channel for collecting product feedback. Suggestions get lost in support tickets or informal conversations, there's no way for customers to see what's already been suggested, and there's no easy way to browse feedback by topic. This application solves that by providing:

- A single place to submit a suggestion.
- A single place to view all suggestions.
- A way to narrow suggestions down by category so users can find feedback relevant to a specific area of the product.

---

## 2. Pages and User Flows

The frontend has exactly two pages for Milestone 1.

### 2.1 Home page (`/`)

Frontend navigation should use React Router to manage the Home and AddFeedback pages.

**Purpose:** Let users browse existing suggestions and filter them by category.

**Behavior:**

- On load, the page fetches all suggestions from the API and renders them as a list of suggestion cards.
- Each suggestion card displays:
  - Title
  - Description
  - Category
  - Created date (formatted for readability, e.g. "Aug 5, 2026")
- A category filter control (e.g. a set of buttons or a dropdown) is displayed above the suggestion list. Options are:
  - "All" (default, shows every suggestion)
  - One option per known category (see [Data Model](#3-data-model) for the category list)
- A visible link/button to navigate to the AddFeedback page (e.g. "Add Suggestion") is present on this page.

**Filtering behavior:**

- Selecting a category filters the visible list to only suggestions matching that category.
- Filtering is done via an API request that includes the selected category (see [API Endpoints](#4-api-endpoints)), not a client-side-only filter, so the behavior matches how the data would work at scale.
- Selecting "All" clears the filter and re-fetches/re-displays every suggestion.
- The currently active filter is visually indicated (e.g. active/selected state on the filter control).
- Changing the filter does not require a full page reload.

**Empty states:**

- If there are zero suggestions overall (no data in the database yet), show a general empty state message, e.g. "No suggestions yet. Be the first to add one!" with a link/button to the AddFeedback page. The application does not require seeded feedback data. The empty state should be visible when the database contains no suggestions.
- If a category filter is applied and no suggestions match that category, show a filter-specific empty state message, e.g. "No suggestions found in this category." The message must make clear this is due to the filter, not a system error, and should not be identical wording to the "no data at all" state.
- Empty states replace the list area; they do not appear alongside skeleton/loading content.

**Loading and error states (baseline expectations):**

- While suggestions are being fetched, show a loading indicator in place of the list.
- If the fetch fails, show an error message distinct from the empty state (e.g. "Something went wrong loading suggestions. Please try again.").

### 2.2 AddFeedback page (`/add`)

**Purpose:** Let users submit a new suggestion.

**Behavior:**

- Displays a form with the following fields:
  - **Title** — single-line text input.
  - **Category** — select/dropdown, populated from the fixed category list.
  - **Description** — multi-line text area.
- A submit button (e.g. "Add Suggestion") submits the form.
- A way to return to the Home page without submitting (e.g. "Cancel" or "Back" link/button).

**Form interactions:**

- All fields are required.
- Client-side validation runs before the API request is sent, so users get immediate feedback without waiting on a network round-trip.
- On successful submission:
  - The API is called to create the suggestion.
  - The user is shown a success indication (e.g. brief confirmation message) and is navigated back to the Home page.
  - The newly created suggestion appears in the Home page list (via re-fetch or navigation-triggered reload).
- On failed submission (client-side invalid, or server rejects/errors):
  - The form remains on the page with the user's entered values preserved.
  - Field-level and/or form-level validation messages are shown (see below).
  - The user can correct the input and resubmit without re-entering unaffected fields.

**Validation rules:**

| Field | Rule | Example validation message |
|---|---|---|
| Title | Required. Non-empty after trimming whitespace. Max length 100 characters. | "Title is required." / "Title must be 100 characters or fewer." |
| Category | Required. Must be one of the predefined category values. | "Please select a category." |
| Description | Required. Non-empty after trimming whitespace. Min length 10 characters, max length 1000 characters. | "Description is required." / "Description must be at least 10 characters." |

- Validation messages are displayed near the field they refer to.
- Validation is re-checked on submit even if a user bypasses individual field-level checks (e.g. via browser autofill or pasting), to guarantee bad data never reaches the API from the client.
- The server independently validates the same rules and returns a structured error response if violated (see [API Endpoints](#4-api-endpoints)) — the frontend must not treat client-side validation as the only line of defense.

---

## 3. Data Model
The suggestions table should be created in the Neon PostgreSQL database using a SQL schema file or migration script.
### 3.1 `suggestions` table (PostgreSQL)

| Field | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | `SERIAL` / `BIGSERIAL` (primary key) | `PRIMARY KEY` | Uniquely identifies each suggestion. |
| `title` | `VARCHAR(100)` | `NOT NULL` | Short summary of the suggestion, shown as the card heading. |
| `description` | `TEXT` | `NOT NULL` | Full explanation of the suggested improvement. |
| `category` | `VARCHAR(50)` | `NOT NULL` | Classifies the suggestion so it can be filtered on the Home page. Constrained to a fixed set of values (see below), enforced at the application layer and/or via a `CHECK` constraint. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Records when the suggestion was submitted; used for sorting/display (e.g. newest first) and for the "created date" shown on each card. |

**Category values (fixed enum for Milestone 1):**

- `UI/UX`
- `Feature`
- `Bug`
- `Performance`
- `Other`

Category values are case-sensitive and must be stored exactly as listed above.

> These values should live in one shared place (e.g. a constants file or DB enum/check constraint) referenced by both the frontend filter/select options and backend validation, so the two never drift out of sync.

**Indexing:** An index on `category` is recommended once data volume grows, to keep filtered queries fast. Not required for Milestone 1 given expected data volume, but worth flagging for the implementing engineer.

---

## 4. API Endpoints

Base path: `/api/suggestions`

### 4.1 Get all suggestions

- **Method:** `GET`
- **Route:** `/api/suggestions`
- **Purpose:** Retrieve every suggestion, for the Home page's default ("All") view.
- **Request format:** No body. No required query parameters.
- **Response format:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "title": "Add dark mode",
      "description": "It would be great to have a dark mode toggle in settings.",
      "category": "UI/UX",
      "created_at": "2026-08-01T14:23:00.000Z"
    }
  ]
  ```
  - Returns `[]` (empty array) when no suggestions exist — the frontend uses this to render the "no data" empty state.
  - Suggestions are returned ordered by `created_at` descending (newest first).

### 4.2 Filter suggestions by category

- **Method:** `GET`
- **Route:** `/api/suggestions?category={category}`
- **Purpose:** Retrieve only suggestions matching a given category, for the Home page's filtered view.
- **Request format:** Query parameter `category` (string, must match one of the fixed category values).
- **Response format:** `200 OK`
  - Same shape as [4.1](#41-get-all-suggestions), filtered to the requested category.
  - Returns `[]` when no suggestions match — the frontend uses this to render the "no matches for this filter" empty state.
  - `400 Bad Request` if `category` is provided but is not one of the recognized values:
    ```json
    { "error": "Invalid category value." }
    ```

### 4.3 Add a suggestion

- **Method:** `POST`
- **Route:** `/api/suggestions`
- **Purpose:** Create a new suggestion from the AddFeedback page form.
- **Request format:**
  ```json
  {
    "title": "Add dark mode",
    "description": "It would be great to have a dark mode toggle in settings.",
    "category": "UI/UX"
  }
  ```
- **Response format:**
  - `201 Created` on success, returning the created record including server-generated fields:
    ```json
    {
      "id": 42,
      "title": "Add dark mode",
      "description": "It would be great to have a dark mode toggle in settings.",
      "category": "UI/UX",
      "created_at": "2026-08-05T09:12:00.000Z"
    }
    ```
  - `400 Bad Request` on validation failure, returning field-level errors so the frontend can map them back to inputs:
    ```json
    {
      "errors": {
        "title": "Title is required.",
        "description": "Description must be at least 10 characters."
      }
    }
    ```

---

## 5. Tech Stack and Deployment Targets

| Layer | Technology | Deployment target |
|---|---|---|
| Frontend | React (responsive design) | Netlify |
| Backend | Node.js + Express (REST API) | Render |
| Database | PostgreSQL | Neon |

**Notes for the implementing engineer:**

- The frontend communicates with the backend exclusively via the REST endpoints defined in [Section 4](#4-api-endpoints). The API base URL should be configurable via an environment variable so it can point at a local backend in development and the deployed Render URL in production.
- The backend connects to Neon Postgres via a connection string supplied through an environment variable — no credentials should be hardcoded.
- CORS on the Express API must allow requests from the deployed Netlify origin.

---

## 6. Design Considerations

### 6.1 Responsive behavior

- The application must be usable on mobile, tablet, and desktop viewport widths.
- The suggestion list (Home page) should reflow from a multi-column or wide-card layout on desktop to a single-column stacked layout on narrow/mobile viewports.
- The category filter control must remain usable on small screens (e.g. wrapping or horizontally scrollable rather than overflowing or being clipped).
- The AddFeedback form fields should span the available width on mobile and be appropriately constrained (not full-bleed) on larger screens.

### 6.2 Accessibility considerations

- All form inputs on the AddFeedback page must have associated `<label>` elements.
- Validation messages must be programmatically associated with their fields (e.g. `aria-describedby`) so screen readers announce them.
- Interactive elements (filter buttons, submit button, links) must be reachable and operable via keyboard alone, with visible focus states.
- Color must not be the only means of conveying the active filter state or validation error state (e.g. pair color with text/icon).
- Sufficient color contrast should be maintained for text and interactive elements per WCAG AA guidance.

### 6.3 Design Reference

The provided product feedback application demo should be used as the visual reference for the frontend implementation, including layout, spacing, typography, components, and overall user experience.

Design reference:
https://product-feedback-app-2025.netlify.app/

If additional Figma designs are provided, they should be treated as the source of truth for visual styling. Otherwise, implementation should follow the behavioral requirements in this PRD while maintaining clean, accessible, responsive design patterns.

---

## 7. Out of Scope

The following are explicitly **not** part of this milestone and should not be built unless a future PRD revision adds them:

- User authentication or accounts (login, signup, sessions).
- Voting/upvoting on suggestions.
- Commenting or discussion threads on suggestions.
- Editing or deleting existing suggestions (via the UI or API).
- Sorting controls beyond the default newest-first order (e.g. sort by popularity).
- Pagination or infinite scroll (Milestone 1 assumes a data volume small enough to load in full).
- Admin dashboard, roles/permissions, or moderation tooling.
- Status tracking for suggestions (e.g. "Planned," "In Progress," "Complete").
- Email notifications or any notification system.
- Search (free-text) across suggestions.
- Multi-language / internationalization support.
- Analytics/telemetry instrumentation.
- Rate limiting or spam/abuse protection on submissions.
