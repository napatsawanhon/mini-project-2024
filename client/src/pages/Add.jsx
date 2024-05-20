import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Add = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: null,
        cover: null,
    });
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setBook((prev) => ({ ...prev, cover: e.target.files[0] }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", book.title);
        formData.append("desc", book.desc);
        formData.append("price", book.price);
        formData.append("cover", book.cover);

        if (!book.title || !book.desc || !book.price || !book.cover) {
            window.alert("กรุณากรอกข้อมูล");
            return;
        }

        try {
            await axios.post("http://localhost:8800/books", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/");
        } catch (err) {
            console.log(err);
            setError(true);
        }
    };

    return (
        <div className="form">
            <h1>Add New Book</h1>
            <input
                type="text"
                placeholder="title"
                onChange={handleChange}
                name="title"
            />
            <textarea
                rows={5}
                type="text"
                placeholder="Book desc"
                name="desc"
                onChange={handleChange}
            />
            <input
                type="number"
                placeholder="price"
                onChange={handleChange}
                name="price"
            />
            <input type="file" onChange={handleFileChange} name="cover" />
            <button onClick={handleClick}>Add</button>
            {error && "Something went wrong!"}
            <Link to="/">See all books</Link>
        </div>
    );
};

export default Add;