import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/header.css';

const Header = ({ onAddProperty }) => {
    const accessToken = localStorage.getItem('access_token');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('/api/users/role', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUserRole(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (accessToken) {
            fetchUserRole();
        }
    }, [accessToken]);

    return (
        <header className="header">
            <Link to={`/props`} className="navbar-brand">
                <h1 className="link-text">Недвижимость Минск</h1>
            </Link>
            <button className="btn btn-primary" onClick={onAddProperty}>
                Добавить новое объявление
            </button>
            {accessToken && userRole === 'ADMIN' && (
                <Link to="/admin" className="btn btn-primary">
                    Панель администратора
                </Link>
            )}
            {accessToken ? (
                <Link to="/profile" className="btn btn-primary">
                    Профиль
                </Link>
            ) : (
                <Link to="/login" className="btn btn-primary">
                    Войти
                </Link>
            )}
        </header>
    );
};

export default Header;