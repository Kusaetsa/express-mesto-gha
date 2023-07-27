const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const users = require('./routes/users');

const cards = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.owner = {
    _id: '64c25b2d58913f1a509c20e8',
  };
  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
