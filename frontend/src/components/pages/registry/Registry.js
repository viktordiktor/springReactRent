import React, { useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { register } from "../../../requests/requests";

function Registry() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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
      email: email,
      password: password,
      role: "USER",
      fullName: fullName,
      phone: phone,
    };

    register(userData)
      .then((response) => {
        console.log("Регистрация успешна");
        setRedirect(true);
      })
      .catch((error) => {
        if (error.response.data) alert(error.response.data);
        console.error("Ошибка при регистрации", error);
      });
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card w-75">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Регистрация</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
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
              <label htmlFor="password" className="form-label">
                Пароль:
              </label>
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
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Полное имя:
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={handleFullNameChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Телефон:
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Зарегистрироваться
            </button>
          </form>
          <p className="text-center mt-3">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registry;
