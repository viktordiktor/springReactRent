import Header from "../elements/Header";
import {useEffect, useState} from "react";
import axios from "axios";
import AddPropertyPopup from "./AddPropertyPopup";
import {useParams, useNavigate} from "react-router-dom";
import '../styles/singleProperty.css';

const SingleProperty = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProperty();
    }, []);

    const fetchProperty = async () => {
        try {
            const response = await axios.get(`/api/props/${id}`);
            const { person, property } = response.data;

            const processedProperty = {
                id: property.id,
                address: property.address,
                price: property.price,
                rooms: property.rooms,
                square: property.square,
                person: {
                    id: person.id,
                    fullName: person.fullName,
                    phone: person.phone,
                },
                images: property.images.map((image) => ({
                    id: image.id,
                    imageUrl: `data:image/jpeg;base64,${image.image}`,
                })),
            };

            setProperty(processedProperty);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching property:', error);
            setLoading(false);
        }
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? property.images.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === property.images.length - 1 ? 0 : prevIndex + 1));
    };

    const openImageModal = () => {
        setImageModalOpen(true);
    };

    const closeImageModal = () => {
        setImageModalOpen(false);
    };

    const handleAddPropertyClick = () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken && refreshToken) {
            setShowAddPopup(true);
        } else {
            navigate('/login');
        }
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    const handleAddProperty = (newProperty) => {
        setProperty(newProperty);
        setShowAddPopup(false);
        navigate('/props');
    };

    return (
        <>
            <Header onAddProperty={handleAddPropertyClick} />
            <div className="container">
                {loading ? (
                    <div>Loading...</div>
                ) : property ? (
                    <div className="row">
                        <div className="col-md-6">
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={property.images[currentImageIndex].imageUrl}
                                    alt="Property"
                                    className="img-fluid"
                                    style={{ marginBottom: '10px', borderRadius: '4px', cursor: 'pointer' }}
                                    onClick={openImageModal}
                                />
                                {property.images.length > 1 && (
                                    <>
                                        <div
                                            className="arrow-left"
                                            onClick={handlePreviousImage}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '10px',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </div>
                                        <div
                                            className="arrow-right"
                                            onClick={handleNextImage}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '10px',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </div>
                                    </>
                                )}
                            </div>
                            {isImageModalOpen && (
                                <div
                                    className="modal"
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0, 0, 0, 0.8)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onClick={closeImageModal}
                                >
                                    <img
                                        src={property.images[currentImageIndex].imageUrl}
                                        alt="Property"
                                        className="img-fluid"
                                        style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '4px' }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <h2>{property.address}</h2>
                            <p>Цена: {property.price}$</p>
                            <p>Комнат: {property.rooms}</p>
                            <p>Площадь: {property.square} кв. м.</p>
                            <p>Контактное лицо: {property.person.fullName}</p>
                            <p>Телефон: {property.person.phone}</p>
                        </div>
                    </div>
                ) : (
                    <div>Property not found</div>
                )}
                {showAddPopup && <AddPropertyPopup onClose={handleClosePopup} onAddProperty={handleAddProperty} />}
            </div>
        </>
    );
};

export default SingleProperty;