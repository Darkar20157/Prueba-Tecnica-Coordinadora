require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORTSERVER;
const userRoutes = require('./routes/user_routes');
const eventRoutes = require('./routes/events_router');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:'+port);
})