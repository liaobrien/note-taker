const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

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
})

app.listen(PORT, () =>
      console.log(`Example app listening at http://localhost:${PORT}`)
);
