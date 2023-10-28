const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('Develop/public')); // Updated path for serving static files

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/Develop/public/notes.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Develop/public/index.html');
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8')); // Updated path for reading db.json
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8')); // Updated path for reading db.json
  notes.push(newNote);
  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(notes, null, 2)); // Updated path for writing db.json
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8')); // Updated path for reading db.json
  const noteId = req.params.id;

  // Filter out the note to be deleted
  const updatedNotes = notes.filter((note) => note.id !== noteId);

  // Write the updated notes to db.json
  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(updatedNotes, null, 2)); // Updated path for writing db.json

  res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
