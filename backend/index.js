import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'test',
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/books', (req, res) => {
    const q = 'SELECT * FROM books';
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/books', upload.single('cover'), (req, res) => {
    const q = 'INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)';
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.file ? `/uploads/${req.file.filename}` : ''
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json('Book insert successfully!');
    });
});

app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const q = 'SELECT * FROM books WHERE id = ?';
    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data[0]);
    });
});


app.put('/books/:id', upload.single('cover'), (req, res) => {
    const bookId = req.params.id;
    const q = 'UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?';

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.file ? `/uploads/${req.file.filename}` : req.body.cover
    ];

    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json('Book has been updated successfully!');
    });
});

app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const q = 'DELETE FROM books WHERE id = ?';
    db.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json('Book has been deleted successfully!');
    });
});

app.listen(8800, () => {
    console.log('Connected to backend!');
});
