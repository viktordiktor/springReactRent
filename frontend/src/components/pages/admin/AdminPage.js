import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../ui/header/Header";
import AddPropertyPopup from "../../ui/addEditPropertyPopups/AddPropertyPopup";
import { useNavigate } from "react-router-dom";
import {
  getAdminData,
  getTypeLabel,
  hardDeleteProperty,
  restoreProperty,
  softDeleteProperty,
} from "../../../requests/requests";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedTab, setSelectedTab] = useState("properties");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();

  const handleAddPropertyClick = () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      setShowAddPopup(true);
    } else {
      navigate("/login");
    }
  };

  const handleClosePopup = () => {
    setShowAddPopup(false);
  };

  const handleAddProperty = () => {
    setShowAddPopup(false);
    navigate("/props");
  };

  const handleDeleteProperty = (propertyId) => {
    softDeleteProperty(propertyId)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          window.location.reload();
        }
        console.error("Ошибка при удалении объявления:", error);
      });
  };

  const handleRestoreProperty = (propertyId) => {
    restoreProperty(propertyId)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          window.location.reload();
        }
        console.error("Ошибка при восстановлении объявления:", error);
      });
  };

  const handlePermanentlyDeleteProperty = (propertyId) => {
    hardDeleteProperty(propertyId)
      .then((response) => {
        const updatedProperties = properties.filter(
          (property) => property.id !== propertyId,
        );
        setProperties(updatedProperties);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          window.location.reload();
        }
        console.error(
          "Ошибка при удалении объявления без возможности восстановления:",
          error,
        );
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminData = await getAdminData();

        const usersData = adminData.map((user) => ({
          id: user.id,
          email: user.email,
          fullName: user.person.fullName,
          phone: user.person.phone,
          role: user.role,
        }));

        const propertiesData = [];
        adminData.forEach((user) => {
          user.properties.forEach((property) => {
            propertiesData.push({
              id: property.id,
              address: property.address,
              price: property.price,
              description: property.description,
              rooms: property.rooms,
              square: property.square,
              type: property.type,
              deleted: property.deleted,
              images: property.images,
            });
          });
        });

        setUsers(usersData);
        setProperties(propertiesData);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          window.location.reload();
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header onAddProperty={handleAddPropertyClick} />
      <h2>Администрирование</h2>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className={`btn btn-${
            selectedTab === "users" ? "primary" : "secondary"
          }`}
          onClick={() => setSelectedTab("users")}
        >
          Управление пользователями
        </button>
        <button
          type="button"
          className={`btn btn-${
            selectedTab === "properties" ? "primary" : "secondary"
          }`}
          onClick={() => setSelectedTab("properties")}
        >
          Управление объявлениями
        </button>
      </div>

      {selectedTab === "users" && (
        <>
          <h2>Пользователи</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedTab === "properties" && (
        <>
          <h2>Свойства</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Адрес</th>
                <th>Цена</th>
                <th>Описание</th>
                <th>Комнаты</th>
                <th>Площадь</th>
                <th>Тип</th>
                <th>Удалено</th>
                <th>Изображение</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>{property.id}</td>
                  <td>{property.address}</td>
                  <td>{property.price}</td>
                  <td>{property.description}</td>
                  <td>{property.rooms}</td>
                  <td>{property.square}</td>
                  <td>{getTypeLabel(property.type)}</td>
                  <td>{property.deleted ? "Да" : "Нет"}</td>
                  <td>
                    {property.images.length > 0 && (
                      <img
                        src={`data:image/jpeg;base64,${property.images[0].image}`}
                        alt="Изображение свойства"
                        style={{ width: "100px", height: "100px" }}
                      />
                    )}
                  </td>
                  <td>
                    {property.deleted ? (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleRestoreProperty(property.id)}
                        >
                          Восстановить
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handlePermanentlyDeleteProperty(property.id)
                          }
                        >
                          Удалить безвозвратно
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          Удалить
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handlePermanentlyDeleteProperty(property.id)
                          }
                        >
                          Удалить безвозвратно
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showAddPopup && (
            <AddPropertyPopup
              onClose={handleClosePopup}
              onAddProperty={handleAddProperty}
            />
          )}
        </>
      )}
    </>
  );
};

export default AdminPage;
