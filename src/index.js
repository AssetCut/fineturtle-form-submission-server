import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import mysql from 'mysql2/promise';
const app = express();
dotenv.config();

// Connecting to Mongo DB
const getDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE,
            multipleStatements: true,
        });

        return connection;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// Middlewares
app.use(cors({
    origin: ['*'],
    credentials: true
}));
app.use(express.json());

// Routes
app.post("/londonevent", async (req, res) => {
    try {
        const body = req.body;
        const db = await getDB();
        if (!db) throw new Error('Database Connection Failed');

        const query =
            'INSERT INTO londonevent (full_name, twitter_link, certainity) values (?,?,?)';
        const values = [body.full_name, body.twitter_link, body.certainity];

        const [result, fields] = await db.execute(query, values);

        res.status(200).json({ message: 'Success' });
    } catch (err) {
        next(err)
    }
});

// Error Handling
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something Went Wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    });
});

const port = 8080;
app.listen(port, () => {
    console.log(`server started on port ${port}...`);
});