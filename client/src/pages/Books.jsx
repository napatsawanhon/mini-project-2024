import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Books = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://localhost:8800/books");
                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllBooks();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("ต้องการจะลบหนังสือเล่มนี้ใช่หรือไม่?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8800/books/${id}`);
                setBooks(books.filter(book => book.id !== id));
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div>
            <h1>Hello World Book Shop</h1>
            <div className="books">
                {books.map((book) => (
                    <div className="book" key={book.id}>
                        {book.cover && <img src={`http://localhost:8800${book.cover}`} alt={book.title} />}
                        <h2>{book.title}</h2>
                        <p>{book.desc}</p>
                        <span>Price {book.price} Bath.</span>
                        <button className="delete" onClick={() => handleDelete(book.id)}>
                            Delete
                        </button>
                        <button className="update">
                            <Link to={`/update/${book.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                                Update
                            </Link>
                        </button>
                    </div>
                ))}
            </div>
            <button className="addHome">
                <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
                    Add new book
                </Link>
            </button>
        </div>
    );
};

export default Books;
