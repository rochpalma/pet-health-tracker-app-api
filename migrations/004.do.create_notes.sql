CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    dog_id INTEGER REFERENCES dog_profile(id) ON DELETE CASCADE NOT NULL,
    event_name TEXT NOT NULL,
    note TEXT,
    note_type TEXT NOT NULL
);