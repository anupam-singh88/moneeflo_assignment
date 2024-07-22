const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, MONGO_URI } = require('./config');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/not-found');

const app = express();

app.use(bodyParser.json());

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotations', quotationRoutes);

app.use(errorHandler);
app.use(notFoundHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
