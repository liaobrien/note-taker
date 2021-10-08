const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const util = require('util');

const noteData = require('./db/db.json');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
      readFileAsync("./db/db.json", "utf8").then(data => {
            const parsedData = JSON.parse(data);
            res.json(parsedData);
            res.end();
      });
})

app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/index.html'));
});


// POST / api / notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
      console.info(`${req.method} request received to add a note`);

      const { title, text } = req.body;

      if (title && text) {

            const newNote = {
                  title,
                  text,
                  id: uuid(),
            };

            fs.readFile('./db/db.json', 'utf8', (err, data) => {
                  if (err) {
                        console.error(err);
                  } else {

                        const parsedNotes = JSON.parse(data);


                        parsedNotes.push(newNote);

                        fs.writeFile(
                              './db/db.json',
                              JSON.stringify(parsedNotes, null, 4),
                              (writeErr) =>
                                    writeErr
                                          ? console.error(writeErr)
                                          : console.info('Successfully updated notes!')
                        );
                  }
            });

            const response = {
                  status: 'success',
                  body: newNote,
            };

            console.log(response);
            res.status(201).json(response);
      }
      else {
            res.status(500).json('Error in posting note');
      }
});

// delete note feature
app.delete("/api/notes/:id", function (req, res) {
      fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            const parsedNoteData = JSON.parse(data);

            for (let i = 0; i < parsedNoteData.length; i++) {
                  if (noteData[i].id === req.params.id) {
                        parsedNoteData.splice(i, 1)
                        break;
                  }
            }
      })



      fs.writeFile(`./db/db.json`, JSON.stringify(noteData), (err) => {
            if (err) {
                  return console.log(err);
            } else {
                  console.log("Note successfully deleted!");
            }
      });
      res.json(noteData);
});

app.listen(PORT, () =>
      console.log(`App listening at on ${PORT}`)
);
