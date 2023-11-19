import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import AddPropertyPopup from './AddPropertyPopup';
import '../styles/propertyList.css';
import Header from '../elements/Header';
import {Link, useNavigate} from "react-router-dom";

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const refreshPage = () => {
        navigate(0);
    }

    useEffect(() => {
        fetchProperties();
    }, [page]);

    const fetchProperties = async () => {
        try {
            const response = await axios.get(`/api/props?pageNumber=${page - 1}`);
            const fetchedProperties = response.data.content;
            const totalPages = response.data.totalPages;

            const processedProperties = await Promise.all(
                fetchedProperties.map(async (property) => {
                    const imageUrl = `data:image/jpeg;base64,${property.images[0].image}`;
                    return { ...property, imageUrl };
                })
            );

            setProperties(processedProperties);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const renderPaginationButtons = () => {
        const buttons = [];

        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pagination-button ${page === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    const handleAddPropertyClick = () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken && refreshToken) {
            setShowAddPopup(true);
        } else {
            window.location.href = '/login'
        }
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    const handleAddProperty = (newProperty) => {
        setProperties([...properties, newProperty]);
        navigate('/props');
        refreshPage();
        navigate(0);
    };

    return (
        <>
            <Header onAddProperty={handleAddPropertyClick} />
            <div className="container">
                <h2 className="mt-4 mb-4">Продажа недвижимости</h2>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="row">
                        {properties.length > 0 ? (
                            properties.map((property) => (
                                <div key={property.id} className="col-md-4 mb-4">
                                    <div className="card">
                                        <Link to={`/props/${property.id}`}>
                                            <img src={property.imageUrl} className="card-img-top" alt={property.address} />
                                        </Link>
                                        <div className="card-body">
                                            <h5 className="card-title">{property.address}</h5>
                                            <p className="card-text">Цена: {property.price}$</p>
                                            <p className="card-text">Комнат: {property.rooms}</p>
                                            <p className="card-text">Площадь: {property.square} кв. м.</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No properties found</div>
                        )}
                    </div>
                )}

                {showAddPopup && <AddPropertyPopup onClose={handleClosePopup} onAddProperty={handleAddProperty} />}
                <div className="pagination">{renderPaginationButtons()}</div>
            </div>
        </>
    );
};

export default PropertyList;