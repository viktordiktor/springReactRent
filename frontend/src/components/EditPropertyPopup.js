import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/addProperty.css';
import { useNavigate } from 'react-router-dom';
import {propertyTypeOptions, refreshToken} from '../utils/requestUtils';
import Select from "react-select";

const EditPropertyPopup = ({ onClose, propertyId }) => {
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [square, setSquare] = useState('');
    const [rooms, setRooms] = useState('');
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const navigate = useNavigate();
    console.log(images);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`/api/props/${propertyId}`);
                const { person, property } = response.data;

                setAddress(property.address);
                setPrice(property.price);
                setDescription(property.description);
                setSquare(property.square);
                setRooms(property.rooms);
                setPropertyType(property.type);

                // Загрузка изображений в форму

                setImages(property.images.map((image) => ({
                    id: image.id,
                    imageUrl: `data:image/jpeg;base64,${image.image}`,
                })));

            } catch (error) {
                if(error.response.status === 401){
                    refreshToken();
                }
                console.error('Ошибка при редактировании', error);
            }
        };

        fetchProperty();
    }, [propertyId]);


    const handleImageUpload = (event) => {
        const selectedImage = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImages((prevImages) => [
                ...prevImages,
                {
                    id: null,
                    imageUrl: reader.result,
                },
            ]);
        };

        reader.readAsDataURL(selectedImage);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('propertyData', JSON.stringify({ address, price, description, square, rooms }));

            images.forEach((image) => {
                const { imageUrl } = image;
                const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                const fileType = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
                const file = dataURLtoFile(imageUrl, fileName, fileType);
                formData.append('images', file);
            });

            formData.append('propertyType', propertyType.value);

            const accessToken = localStorage.getItem('access_token');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            };

            await axios.patch(`/api/props/${propertyId}`, formData, { headers });

            navigate('/profile');
            window.location.reload();
            onClose();
        } catch (error) {
            if(error.response.status === 401){
                refreshToken();
            }
            setErrorMessage('Произошла ошибка при редактировании объявления. Пожалуйста, попробуйте еще раз.');
        }
    };

    function dataURLtoFile(dataUrl, fileName, fileType) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: fileType });
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Редактировать объявление</h2>
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
                    <label htmlFor="selectType">Тип недвижимости:</label>
                    <Select
                        options={propertyTypeOptions}
                        value={propertyTypeOptions.find(option => option.value === propertyType)}
                        onChange={(value) => setPropertyType(value)}
                        id="selectType"
                    />
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
                        {images.map((image, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={image.imageUrl} alt="Preview" className="image-preview" />
                                <button type="button" onClick={() => handleRemoveImage(index)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="btn btn-primary add-button">
                        Сохранить изменения
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPropertyPopup;