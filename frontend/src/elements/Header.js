import React from 'react';

const Header = ({ onAddProperty }) => {
    return (
        <header className="header">
            <h1>Property for Sale</h1>
            <button className="btn btn-primary" onClick={onAddProperty}>
                Добавить новое объявление
            </button>
        </header>
    );
};

export default Header;