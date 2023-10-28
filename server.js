const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('Develop/public'));

// HTML Routes

// Route to display the "Notes" page
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/Develop/public/notes.html');
});

// Route to display the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Develop/public/index.html');
});

// API Routes

// Get the list of notes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'));
  res.json(notes);
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'));
  notes.push(newNote);
  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(notes, null, 2)); 
  res.json(newNote);
});

// Delete a note by its ID
app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8')); 
  const noteId = req.params.id;

  // Filter out the notes to be deleted
  const updatedNotes = notes.filter((note) => note.id !== noteId);

  // Write the updated notes to db.json
  fs.writeFileSync('./Develop/db/db.json', JSON.stringify(updatedNotes, null, 2)); 

  res.json({ message: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
