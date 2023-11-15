import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { convertByteaToImageUrl } from '../utils/imageUtils';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
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
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    return (
        <div className="container">
            <h2 className="mt-4 mb-4">Properties</h2>
            <div className="row">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div key={property.id} className="col-md-4 mb-4">
                            <div className="card">
                                <img src={property.imageUrl} className="card-img-top" alt={property.address} />
                                <div className="card-body">
                                    <h5 className="card-title">{property.address}</h5>
                                    <p className="card-text">Price: {property.price}</p>
                                    <p className="card-text">Description: {property.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No properties found</div>
                )}
            </div>
        </div>
    );
};

export default PropertyList;