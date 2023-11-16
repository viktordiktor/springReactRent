import React, { useState } from 'react';

function Registry() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = {
            username: username,
            password: password,
            fullName: fullName,
            phone: phone
        };

        fetch('/auth/registry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Регистрация успешна');
                } else {
                    console.error('Ошибка при регистрации');
                }
            })
            .catch(error => {
                console.error('Ошибка сети:', error);
            });
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fullName">Полное имя:</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={handleFullNameChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">Телефон:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}

export default Registry;