import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css';
import AddPropertyPopup from "./AddPropertyPopup";
import Header from "../elements/Header";
import { useNavigate } from "react-router-dom";
import EditPropertyPopup from "./EditPropertyPopup";

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUserProfile(response.data);
                setFullName(response.data.person.fullName);
                setPhone(response.data.person.phone);
                setLoading(false);
            } catch (error) {
                if (error.response.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    navigate("/login");
                    window.location.reload();
                }
                console.error(error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            try{
                await axios.patch(
                    `/api/person/${userProfile.person.id}`,
                    {
                        fullName: fullName,
                        phone: phone
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
            } catch(error){
                if (error.response.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    navigate("/login");
                    window.location.reload();
                }
            }
            const updatedUserProfile = { ...userProfile };
            updatedUserProfile.person.fullName = fullName;
            updatedUserProfile.person.phone = phone;
            setUserProfile(updatedUserProfile);

            setEditMode(false);
        } catch (error) {
            alert(error);
        }
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
        setShowAddPopup(false);
        navigate('/props');
    };

    const handleEditProperty = (propertyId) => {
        setSelectedPropertyId(propertyId);
    };

    const handleDeleteProperty = async (propertyId) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            await axios.delete(`/api/props/${propertyId}`, { headers });
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
                window.location.reload();
            }
        }
        window.location.reload();
    };

    const handleRestoreProperty = async (propertyId) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            await axios.post(`/api/props/${propertyId}`, { headers });
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
                window.location.reload();
            }
        }
        window.location.reload();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header onAddProperty={handleAddPropertyClick} />
            <div className="container mt-4">
                <h2>Профиль пользователя</h2>
                {userProfile && (
                    <div>
                        <h4>Email: {userProfile.email}</h4>
                        {editMode ? (
                            <div>
                                <label>
                                    ФИО:
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Телефон:
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </label>
                                <button onClick={handleSaveClick}>Сохранить</button>
                            </div>
                        ) : (
                            <div>
                                <h4>ФИО: {userProfile.person.fullName}</h4>
                                <h4>Телефон: {userProfile.person.phone}</h4>
                                <button onClick={handleEditClick}>Редактировать</button>
                            </div>
                        )}
                        <h4>Заказы:</h4>
                        {userProfile.properties.map((property) => (
                            <div key={property.id} className="property-card">
                                {property.images.length > 0 && (
                                    <img
                                        src={`data:image/jpeg;base64,${property.images[0].image}`}
                                        alt="Изображение заказа"
                                        className="property-image"
                                    />
                                )}
                                <div className="property-details">
                                    <p>Адрес: {property.address}</p>
                                    <p>Цена: {property.price}</p>
                                    {property.deleted ? (
                                        <div>
                                            <p>Объявление удалено</p>
                                            <button onClick={() => handleRestoreProperty(property.id)}>Восстановить</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button onClick={() => handleEditProperty(property.id)}>Редактировать</button>
                                            <button onClick={() => handleDeleteProperty(property.id)}>Удалить</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddPopup && <AddPropertyPopup onClose={handleClosePopup} onAddProperty={handleAddProperty} />}
            {selectedPropertyId && (
                <EditPropertyPopup
                    onClose={() => setSelectedPropertyId(null)}
                    propertyId={selectedPropertyId}
                />
            )}
        </div>
    );
};

export default Profile;