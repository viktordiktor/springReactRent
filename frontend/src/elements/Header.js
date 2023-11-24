import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ onAddProperty }) => {
    const accessToken = localStorage.getItem('access_token');

    return (
        <header className="header">
            <Link to={`/props`} className="navbar-brand">
                <h1 className="link-text">Недвижимость Минск</h1>
            </Link>
            <button className="btn btn-primary" onClick={onAddProperty}>
                Добавить новое объявление
            </button>
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