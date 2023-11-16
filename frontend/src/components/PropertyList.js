import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import AddPropertyPopup from './AddPropertyPopup';
import '../styles/propertyList.css';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPopup, setShowAddPopup] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('/props');
            const fetchedProperties = response.data.content;

            const processedProperties = await Promise.all(
                fetchedProperties.map(async (property) => {
                    const imageUrl = `data:image/jpeg;base64,${property.images[0].image}`;
                    return { ...property, imageUrl };
                })
            );

            setProperties(processedProperties);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setLoading(false);
        }
    };

    const handleAddPropertyClick = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    const handleAddProperty = (newProperty) => {
        setProperties([...properties, newProperty]);
    };

    return (
        <div className="container">
            <h2 className="mt-4 mb-4">Rent Properties</h2>
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
                                    <img src={property.imageUrl} className="card-img-top" alt={property.address} />
                                    <div className="card-body">
                                        <h5 className="card-title">{property.address}</h5>
                                        <p className="card-text">Price: {property.price}$</p>
                                        <p className="card-text">Description: {property.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No properties found</div>
                    )}
                </div>
            )}

            {!loading && ( // Отображение кнопки только при завершении загрузки
                <button className="btn btn-primary" onClick={handleAddPropertyClick}>
                    Добавить новое объявление
                </button>
            )}

            {showAddPopup && <AddPropertyPopup onClose={handleClosePopup} onAddProperty={handleAddProperty} />}
        </div>
    );
};

export default PropertyList;