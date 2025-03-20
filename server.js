require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// PostgreSQL connection pool setup
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});

app.use(cors());

// Middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to upload a USDZ file
app.post('/upload', upload.single('usdzFile'), async (req, res) => {
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const brandId = req.body.brandId;

    if (!brandId) {
        return res.status(400).send('Brand ID is required');
    }

    try {
        const fileData = fs.readFileSync(filePath);
        const client = await pool.connect();
        const query = 'INSERT INTO files (brand_id, file_name, usdz) VALUES ($1, $2, $3) RETURNING id';
        const values = [brandId, fileName, fileData];

        const result = await client.query(query, values);
        client.release();

        fs.unlinkSync(filePath); // Delete the file from local storage after saving to DB
        res.status(200).send(`File uploaded successfully with ID: ${result.rows[0].id}`);
    } catch (error) {
        res.status(500).send('Error uploading file: ' + error.message);
    }
});

// Endpoint to download a USDZ file by ID
app.get('/download/:id', async (req, res) => {
    const fileId = req.params.id;

    try {
        const client = await pool.connect();
        const query = 'SELECT file_name, usdz FROM files WHERE id = $1';
        const values = [fileId];

        const result = await client.query(query, values);
        client.release();

        if (result.rows.length > 0) {
            const fileName = result.rows[0].file_name;
            const fileData = result.rows[0].usdz;

            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(fileData);
        } else {
            res.status(404).send('File not found');
        }
    } catch (error) {
        res.status(500).send('Error downloading file: ' + error.message);
    }
});
// Route to get all files and their associated brand information
app.get('/files', async (req, res) => {
    try {
        const client = await pool.connect();
        const query = `
            SELECT files.id, files.file_name, files.usdz, brand.brand_name
            FROM files
            JOIN brand ON files.brand_id = brand.id;
        `;
        const result = await client.query(query);
        client.release();

        res.json(result.rows); // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error retrieving files: ' + error.message);
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});