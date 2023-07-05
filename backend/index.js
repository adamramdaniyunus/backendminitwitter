import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './config/Database.js';
import router from './routes/web.js';
import UploadRoute from './routes/UploadRoute.js'
dotenv.config();

const Port = process.env.PORT;
const Client = process.env.URL_CLIENT;

const app = express();
app.use(cors({
    credentials: true,
    origin: Client
}));

app.use(express.static('public'));
app.use('/images', express.static("images"));
app.use('/profile', express.static("profile"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(router);
app.use('/upload', UploadRoute);
db.on('error', (error) => {
    console.log(error);
});
db.once('open', () => {
    console.log('Database Connected');
});

app.listen(Port, () => {
    console.log('Server Running');
});