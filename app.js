const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const users = require('./routes/users');
const cards = require('./routes/cards');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

const { checkAuth } = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use('/signin', signin);
app.use('/signup', signup);
app.use(checkAuth);
app.use('/users', users);
app.use('/cards', cards);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый путь не существует'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
