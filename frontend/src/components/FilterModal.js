import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import '../styles/filterModal.css';

const FilterModal = ({ onClose, onApply }) => {
    const [propertyType, setPropertyType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleApplyFilters = () => {
        const filters = {
            propertyType,
            minPrice,
            maxPrice
        };
        onApply(filters);
        onClose();
    };

    const handlePropertyTypeChange = (event) => {
        setPropertyType(event.target.value);
    };

    const handleMinPriceChange = (event) => {
        setMinPrice(event.target.value);
    };

    const handleMaxPriceChange = (event) => {
        setMaxPrice(event.target.value);
    };

    return (
        <div className="filter-modal">
            <h3>Фильтры</h3>
            <div className="filter-section">
                <h4>Тип недвижимости</h4>
                <select value={propertyType} onChange={handlePropertyTypeChange}>
                    <option value="">Все</option>
                    <option value="APARTMENT">Квартира</option>
                    <option value="HOUSE">Дом</option>
                    <option value="COTTAGE">Дача</option>
                </select>
            </div>
            <div className="filter-section">
                <h4>Цена</h4>
                <label>
                    Минимальная цена:
                    <input type="number" value={minPrice} onChange={handleMinPriceChange} />
                </label>
                <br />
                <label>
                    Максимальная цена:
                    <input type="number" value={maxPrice} onChange={handleMaxPriceChange} />
                </label>
            </div>
            <button onClick={handleApplyFilters}>Применить фильтры</button>
            <button onClick={onClose} className="close-button">
                <IoMdClose />
            </button>
        </div>
    );
};

export default FilterModal;