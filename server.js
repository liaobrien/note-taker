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

app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, () =>
      console.log(`Example app listening at http://localhost:${PORT}`)
);
