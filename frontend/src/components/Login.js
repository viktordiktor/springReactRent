import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Navigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = {
            email: email,
            password: password
        };

        axios.post('/api/auth/authenticate', userData)
            .then(response => {
                console.log('Авторизация успешна');
                const { access_token, refresh_token } = response.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                setRedirect(true);
            })
            .catch(error => {
                console.error('Ошибка при авторизации', error);
            });
    };

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        if (storedAccessToken && storedRefreshToken) {
            // Выполните здесь дополнительную проверку валидности токенов, если необходимо
            console.log('Пользователь уже авторизован');
            setRedirect(true);
        }
    }, []);

    if (redirect) {
        return <Navigate to='/props'></Navigate>;
    }

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card w-75">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Авторизация</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Пароль:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Войти</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;