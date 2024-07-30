const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'http://localhost:3001', 
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin 'origin' (como aplicaciones móviles o curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true); 
        } else {
            return callback(new Error('CORS not allowed'), false); 
        }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Postman-Token']
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const userRouter = require('./src/routes/user.route');
const groupRouter = require('./src/routes/group.route');
const studentGroupRouter = require('./src/routes/student_group.route');
const homeworkRouter = require('./src/routes/homework.route');
const deliveryRouter = require('./src/routes/delivery.route');

app.use('/users', userRouter);
app.use('/groups', groupRouter);
app.use('/student_groups', studentGroupRouter);
app.use('/homeworks', homeworkRouter);
app.use('/deliveries', deliveryRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
