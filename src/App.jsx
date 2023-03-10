import { Routes, Route, Navigate } from "react-router-dom";
import { useMemo } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";

import NewNote from "./components/NewNote";
import NoteList from "./components/NoteList";
import NoteLayout from "./components/NoteLayout";
import Note from "./components/Note";
import EditNote from "./components/EditNote";

import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [tags, setTags] = useLocalStorage("tags", []);

  function onCreateNote({ tags, ...data }) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function addTag(tag) {
    setTags((prev) => [...prev, tag]);
  }

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function deleteTag(id) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  function updateTag(id, label) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id !== id) {
          return tag;
        } else {
          return { ...tag, label };
        }
      });
    });
  }

  function onUpdateNote(id, { tags, ...data }) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id !== id) {
          return note;
        } else {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        }
      });
    });
  }

  function onDeleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />

        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />

        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
