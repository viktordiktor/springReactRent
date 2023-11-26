import React, { useState } from "react";
import axios from "axios";
import "./addProperty.css";
import { useNavigate } from "react-router-dom";
import { addProperty, propertyTypeOptions } from "../../../requests/requests";
import Select from "react-select";

const AddPropertyPopup = ({ onClose }) => {
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [square, setSquare] = useState("");
  const [rooms, setRooms] = useState("");
  const [images, setImages] = useState({});
  const [propertyType, setPropertyType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    const id = Math.random().toString(36).substr(2, 9);
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
      formData.append(
        "propertyData",
        JSON.stringify({ address, price, description, square, rooms }),
      );

      Object.values(images).forEach((image) => {
        formData.append(`images`, image);
      });

      formData.append("propertyType", propertyType.value);

      await addProperty(formData);

      navigate("/props");
      window.location.reload();
      onClose();
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
        window.location.reload();
      }
      setErrorMessage(
        "Произошла ошибка при добавлении объявления. Пожалуйста, попробуйте еще раз.",
      );
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
              required={true}
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
              required={true}
            />
          </div>
          <label htmlFor="selectType">Тип недвижимости:</label>
          <Select
            options={propertyTypeOptions}
            value={propertyType}
            onChange={(value) => setPropertyType(value)}
            id="selectType"
            required={true}
          />

          <div className="form-group">
            <label htmlFor="rooms">Количество комнат:</label>
            <input
              type="number"
              id="rooms"
              className="form-control"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              required={true}
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
              required={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={true}
            />
          </div>
          <div className="form-group add-button">
            <label htmlFor="images">Изображения:&nbsp;&nbsp;</label>
            <input
              type="file"
              id="images"
              className="form-control-file"
              onChange={handleImageUpload}
            />
          </div>
          <div className="image-preview-container">
            {Object.entries(images).map(([id, image]) => (
              <div key={id} className="image-preview-item">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="image-preview"
                />
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
