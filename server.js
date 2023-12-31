const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;

// Helper function for generating unique ids
const uuid = require('./helpers/uuid');
// Helper functions for reading and writing to the JSON file
const {
   readFromFile, 
   readAndAppend,
  writeToFile,
 } = require('./helpers/fsUtils');


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



//returns notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);




// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => {
    res.json(JSON.parse(data));
  });
});


// This is a POST Route for a new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
        fs.readFile("./db/db.json", 'UTF-8', (err, data) => {
          if (err){
           console.error(err)
          } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            writeToFile("./db/db.json", parsedData);
          }
        });
   
       const response = {
         status: 'success',
         body: newNote,
       };
   
       console.log(response);
       res.status(201).json(response);
     } else {
       res.status(500).json('Error in posting note');
     }
   });


//homepage is index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, ()=> {
    console.log(`app listening on port http://localhost:${PORT}`)
})