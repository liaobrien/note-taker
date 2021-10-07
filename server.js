const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const noteData = require('./db/db.json');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
      res.json(noteData);
})

app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req, res) => {
      console.info(`${req.method} request received to add a review`);

      // not sure where to go from here just yet...
      const { title, text } = req.body;

      if (title && text) {
            // Variable for the object we will save
            const newNote = {
                  title,
                  text,
                  review_id: uuid(),
            };

            fs.readFile('./db/reviews.json', 'utf8', (err, data) => {
                  if (err) {
                        console.error(err);
                  } else {
                        // Convert string into JSON object
                        const parsedReviews = JSON.parse(data);

                        // Add a new review
                        parsedReviews.push(newNote);

                        // Write updated reviews back to the file
                        fs.writeFile(
                              './db/reviews.json',
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
});

app.listen(PORT, () =>
      console.log(`App listening at http://localhost:${PORT} 🚀`)
);
