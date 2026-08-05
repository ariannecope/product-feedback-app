-- Product Feedback App — Milestone 4: Database
-- PostgreSQL schema for the `suggestions` table (Neon).
-- See PRD.md, section 3.1, for the data model this implements.

DROP TABLE IF EXISTS suggestions;

CREATE TABLE suggestions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('UI/UX', 'Feature', 'Bug', 'Performance', 'Other')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recommended once data volume grows (PRD 3.1); included now since it's
-- cheap to create up front and every list request filters/sorts on these.
CREATE INDEX idx_suggestions_category ON suggestions (category);
CREATE INDEX idx_suggestions_created_at ON suggestions (created_at DESC);

-- Sample data
INSERT INTO suggestions (title, description, category) VALUES
    (
        'Add dark mode',
        'It would be great to have a dark mode toggle in settings so the app is easier on the eyes at night.',
        'UI/UX'
    ),
    (
        'Allow exporting suggestions to CSV',
        'It would help our team to export the full list of suggestions to a CSV file for offline review and reporting.',
        'Feature'
    ),
    (
        'Filter buttons overlap on small screens',
        'On mobile viewports around 375px wide, the category filter buttons overlap the suggestion list instead of wrapping.',
        'Bug'
    ),
    (
        'Suggestion list is slow to load with many items',
        'When there are more than a couple hundred suggestions, the home page takes several seconds to render the list.',
        'Performance'
    ),
    (
        'Add a way to share a suggestion link',
        'A simple copy-link button on each suggestion card would make it easier to point coworkers at specific feedback.',
        'Other'
    );
