const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const users = require('./routes/users');
const cards = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./utills/statusCodes');
const { createUser, login } = require('./controllers/users');
const { checkAuth } = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(checkAuth);
app.use('/users', users);
app.use('/cards', cards);

app.use((req, res) => {
  const error = new Error('PageNotFound');
  error.status = ERROR_NOT_FOUND;
  error.message = 'Запрашиваемый путь не существует';
  res.status(error.status).json({ message: error.message });
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
