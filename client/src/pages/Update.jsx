import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export const Update = () => {
    const [book, setBook] = useState({
        title: '',
        desc: '',
        price: null,
        cover: ''
    });
    const [error, setError] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const bookId = location.pathname.split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/books/${bookId}`);
                setBook(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBook();
    }, [bookId]);

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
        formData.append('title', book.title);
        formData.append('desc', book.desc);
        formData.append('price', book.price);
        if (book.cover instanceof File) {
            formData.append('cover', book.cover);
        }

		if (!book.title || !book.desc || !book.price || !book.cover) {
			window.alert("กรุณากรอกข้อมูล");
			return;
		  }

        try {
            await axios.put(`http://localhost:8800/books/${bookId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/');
        } catch (err) {
            console.log(err);
            setError(true);
        }
    };

    return (
        <div className="form">
            <h1>Update the Book</h1>
            <input
                type="text"
                placeholder="title"
                name="title"
                value={book.title}
                onChange={handleChange}
            />
            <input
                type="text"
                placeholder="desc"
                name="desc"
                value={book.desc}
                onChange={handleChange}
            />
            <input
                type="number"
                placeholder="price"
                name="price"
                value={book.price}
                onChange={handleChange}
            />
            <input
                type="file"
                onChange={handleFileChange}
                name="cover"
            />
            <button className="formUpdateButton" onClick={handleClick}>Update</button>
        </div>
    );
};

export default Update;
