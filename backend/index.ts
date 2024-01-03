import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { RowDataPacket } from 'mysql2';
const app = express();
app.use(cors()); // Enable CORS for frontend requests

interface DbConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

const dbConfig: DbConfig = {
    host: 'containers-us-west-201.railway.app',
    user: 'root',
    password: 'afsTDjDtfErxDRlnCcVU',
    database: 'railway',
    port: 7892,
}

interface Data {
  team1: string;
  team1percent: number;
  team2: string;
  team2percent: number;
  winsite: string; 
  losesite: string;
  time: string;
}

app.get('/data', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rawRows] = await connection.query('SELECT * FROM GamePercents');
        await connection.end();
        const rows = rawRows as RowDataPacket[];
        
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        if (error instanceof Error) {
            res.status(500).send(`Server error: ${error.message}`);
        } else {
            res.status(500).send('Server error');
        }
    }
});

const PORT = 3001; // Set your backend port
app.listen(PORT, () => {
    console.log("Server running on http://localhost:${PORT}");
});
