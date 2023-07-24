const express = require('express');
const app = express();
const path = require('path');
const PORT = 3001;
// Helper function for generating unique ids
const uuid = require('./helpers/uuid');
// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



//returns notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/notes.html'))
);


//homepage is index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/index.html'))
);


// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


// This API route is a POST Route for a new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
        };

      res.json(response);
} else {
  res.json('error in posting note');
}
});

//The following API routes should be created:
//GET /api/notes should read the db.json file and return all saved notes as JSON.

//POST /api/notes should receive a new note to save on the request body, 
//add it to the db.json file, and then return the new note to the client. 
//You'll need to find a way to give each note a unique id when it's saved 
//(look into npm packages that could do this for you).


app.listen(PORT, ()=> {
    console.log(`app listening on port http://localhost:${PORT}`)
})