import React, { useState } from 'react';
import axios from 'axios';
import '../styles/addProperty.css';
import {useNavigate} from "react-router-dom";

const AddPropertyPopup = ({ onClose }) => {
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [square, setSquare] = useState('');
    const [rooms, setRooms] = useState('');
    const [images, setImages] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleImageUpload = (event) => {
        const selectedImage = event.target.files[0];
        const id = Math.random().toString(36).substr(2, 9); // Генерируем случайный идентификатор файла
        setImages((prevImages) => ({ ...prevImages, [id]: selectedImage }));
    };

    const handleRemoveImage = (id) => {
        const updatedImages = { ...images };
        delete updatedImages[id];
        setImages(updatedImages);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('propertyData', JSON.stringify({ address, price, description, square, rooms }));

            Object.values(images).forEach((image) => {
                formData.append(`images`, image);
            });

            const accessToken = localStorage.getItem('access_token');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            };

            await axios.post('/api/props/new', formData, { headers });

            navigate('/props');
            window.location.reload();
            onClose();
        } catch (error) {
            // Обработка ошибки добавления объявления
            setErrorMessage('Произошла ошибка при добавлении объявления. Пожалуйста, попробуйте еще раз.');
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Добавить новое объявление</h2>
                <button className="close-button" onClick={onClose}>
                    <span className="close-icon">✖</span>
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="address">Адрес:</label>
                        <input
                            type="text"
                            id="address"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Цена:</label>
                        <input
                            type="number"
                            id="price"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rooms">Количество комнат:</label>
                        <input
                            type="number"
                            id="rooms"
                            className="form-control"
                            value={rooms}
                            onChange={(e) => setRooms(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="square">Площадь:</label>
                        <input
                            type="number"
                            id="square"
                            className="form-control"
                            value={square}
                            onChange={(e) => setSquare(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Описание:</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group add-button">
                        <label htmlFor="images">Изображения:&nbsp;&nbsp;</label>
                        <input type="file" id="images" className="form-control-file" onChange={handleImageUpload} />
                    </div>
                    <div className="image-preview-container">
                        {Object.entries(images).map(([id, image]) => (
                            <div key={id} className="image-preview-item">
                                <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
                                <button type="button" onClick={() => handleRemoveImage(id)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="btn btn-primary add-button">
                        Добавить объявление
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyPopup;