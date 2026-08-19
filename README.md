# Product Feedback App

## 📌 Project Description & Purpose

This project is a web application that lets customers submit suggestions for how a product could be improved, and lets anyone browse existing suggestions. It gives a company a lightweight, centralized place to collect and review product feedback instead of scattering it across email, chat, or spreadsheets. It was built as part of the AnnieCannons AI-Assisted Track.

## 🚀 Live Site

Check out the app:[Click Here](https://product-feedback-app-claude.netlify.app/)

## 🖼️ Screenshots

Here is where you'll include a screenshot of your project to show it off!

Your instructor will walk you through this process with the rest of the class. Please be patient until the time comes! In the meantime, you can fill out all other sections of this template.
1. Use `Command + Control + Shift + 4` to take a screenshot of your site and copy the screenshot to your clipboard
2. Find your Github README.md file on the Github website
3. Edit the site by clicking on the Pencil icon ✏️
4. Move your cursor to the position where you want to paste the screenshot, then paste it. Github will convert the pasted screenshot into an `<img>` tag
5. Select "Commit changes..." to save your changes

## ✨ Features

This is what you can do on the app:
- Browse all submitted suggestions, sorted newest first
- Filter suggestions by category (UI/UX, Feature, Bug, Performance, Other)
- Submit new feedback through a form with a title, category, and description
- See clear validation messages if a submission is incomplete or invalid
- See loading, error, and empty states while browsing or submitting feedback
- Use the app comfortably on desktop, tablet, and mobile screen sizes

## 🛠️ Tech Stack

**Frontend**

- **Languages:** JavaScript (JSX), CSS
- **Framework:** React 18 (via Vite), React Router
- **Deployment:** Netlify

**Server/API**

- **Languages:** JavaScript (Node.js)
- **Framework:** Express
- **Deployment:** Render

**Database**

- **Languages:** SQL (PostgreSQL)
- **Deployment:** Neon

## 💻 Local Setup

1. Clone the repo and install dependencies from the project root (this is an npm workspaces monorepo, so one install covers both `client/` and `server/`):
   ```bash
   npm install
   ```
2. Copy the example environment files and fill in real values:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```
   - `server/.env` needs `DATABASE_URL` set to your Neon Postgres connection string.
   - `client/.env`'s `VITE_API_BASE_URL` only needs to change if your server isn't running on the default port.
3. Create the database table by running `server/src/db/schema.sql` against your Postgres/Neon database.
4. Start both the client and server together from the project root:
   ```bash
   npm run dev
   ```
   Or run them separately with `npm run dev:client` / `npm run dev:server`.
5. The app will be running at `http://localhost:5173`, talking to the API at `http://localhost:5000` by default.

## 🔹 API Documentation

These are the API endpoints I built:
1. `GET /get-all-suggestions` — returns every suggestion, newest first
2. `GET /get-suggestions-by-category/:category` — returns suggestions filtered to one category
3. `POST /add-one-suggestion` — creates a new suggestion from the Add Feedback form

Full request/response shapes and validation rules are documented in [PRD.md](./PRD.md#4-api-endpoints).

## 🗄️ Database Schema

Here's the SQL I used to create my table:

```sql
CREATE TABLE suggestions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('UI/UX', 'Feature', 'Bug', 'Performance', 'Other')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_suggestions_category ON suggestions (category);
CREATE INDEX idx_suggestions_created_at ON suggestions (created_at DESC);
```

## 💭 Reflections

**What I learned:** This was my first app built in Claude code. I learned how to write prompts, check errors and file structs, debug, and run security checks all using Claude.

**What I'm proud of:** I'm proud of how slowly I took the project, to really soak in the process. I didn't have one bug in website. So I think taking lots of time with the PRD really helped. 

**What challenged me:** Using such a new tool was scary and overwhelming. But now that I have a project under my belt, I'm excited to keep exploring. 

**Future ideas for how I'd continue building this project:**
1. More styling on the cards
2. Additional page for implemented feedback
3. Thank you messages for users.

## 🤖 AI Usage Notes

I used Claude Code (Anthropic's AI coding assistant) throughout this project as a collaborator, as part of this track's AI-Assisted approach. It helped me:
- Implement the Add Feedback form (validation, loading/error/success states, and wiring to the API)
- Restyle the Home and Add Feedback pages to match my Figma design, including a responsive layout for tablet and mobile
- Run a Lighthouse accessibility audit and fix the issues it found (color contrast and missing document structure)
- Review my CORS configuration and `.gitignore` for security gaps

_(This section only covers the work Claude Code was involved in — add or adjust anything from earlier milestones you worked on solo or with other tools.)_

## 🙌 Credits & Shoutouts

Thanks to Catie and Phil for the great instruction!
