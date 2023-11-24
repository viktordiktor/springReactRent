import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import AddPropertyPopup from './AddPropertyPopup';
import '../styles/propertyList.css';
import Header from '../elements/Header';
import { Link, useNavigate } from 'react-router-dom';
import { getTypeLabel } from '../utils/requestUtils';
import FilterModal from './FilterModal';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [sortField, setSortField] = useState(null);
    const [sortType, setSortType] = useState("ASC");
    const [resetFilters, setResetFilters] = useState(false);
    const navigate = useNavigate();

    const refreshPage = () => {
        navigate(0);
    };

    useEffect(() => {
        fetchProperties();
    }, [page, sortField, sortType]);

    const fetchProperties = async () => {
        try {
            const response = await axios.get(`/api/props?pageNumber=${page - 1}`, {
                params: { ...filters, sortField, sortType }
            });
            const fetchedProperties = response.data.content;
            const totalPages = response.data.totalPages;

            const processedProperties = await Promise.all(
                fetchedProperties.map(async (property) => {
                    const imageUrl = `data:image/jpeg;base64,${property.images[0].image}`;
                    return { ...property, imageUrl };
                })
            );

            setProperties(processedProperties);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const renderPaginationButtons = () => {
        const buttons = [];

        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pagination-button ${page === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    const handleAddPropertyClick = () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken && refreshToken) {
            setShowAddPopup(true);
        } else {
            window.location.href = '/login';
        }
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    const handleAddProperty = (newProperty) => {
        setProperties([...properties, newProperty]);
        navigate('/props');
        refreshPage();
        navigate(0);
    };

    const handleFilterApply = async (newFilters) => {
        try {
            setShowFilterModal(false);
            setPage(1);
            setFilters(newFilters);

            // Сбрасываем сортировку
            setSortField(null);
            setSortType("ASC");

            const response = await axios.get(`/api/props?pageNumber=0`, { params: { ...newFilters, sortField: null, sortType: "ASC" } });
            const fetchedProperties = response.data.content;
            const totalPages = response.data.totalPages;

            const processedProperties = await Promise.all(
                fetchedProperties.map(async (property) => {
                    const imageUrl = `data:image/jpeg;base64,${property.images[0].image}`;
                    return { ...property, imageUrl };
                })
            );

            setProperties(processedProperties);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error fetching filtered properties:', error);
        }
    };

    const handleSortClick = (field) => {
        if (sortField === field) {
            setSortType(sortType === "ASC" ? "DESC" : "ASC");
        } else {
            setSortField(field);
            setSortType("ASC");
            setResetFilters(true); // Устанавливаем состояние resetFilters в true при выборе нового поля сортировки
        }
        setPage(1);
    };

    const handleReset = () => {
        setSortField(null);
        setSortType("ASC");
        setFilters({});
        setPage(1);
        setResetFilters(false);
    };


    return (
        <>
            <Header onAddProperty={handleAddPropertyClick} />
            <div className="container">
                <h2 className="mt-4 mb-4">Продажа недвижимости</h2>
                <div className="filter-button">
                    <button onClick={() => setShowFilterModal(true)}>Фильтры</button>
                    <div className="sort-section">
                        <span>Сортировать по:&nbsp;</span>
                        <span className={`sort-link ${sortField === "price" ? "active" : ""}`} onClick={() => handleSortClick("price")}>
  Цене&nbsp;
                            {sortField === "price" && (sortType === "ASC" ? <FaSortUp /> : <FaSortDown />)}
</span>
                        <span className={`sort-link ${sortField === "rooms" ? "active" : ""}`} onClick={() => handleSortClick("rooms")}>
  Кол-ву комнат&nbsp;
                            {sortField === "rooms" && (sortType === "ASC" ? <FaSortUp /> : <FaSortDown />)}
</span>
                        <span className={`sort-link ${sortField === "square" ? "active" : ""}`} onClick={() => handleSortClick("square")}>
  Площади&nbsp;
                            {sortField === "square" && (sortType === "ASC" ? <FaSortUp /> : <FaSortDown />)}
</span>
                    </div>
                    {(sortField || Object.keys(filters).length > 0) && Object.keys(filters).some(key => filters[key]) && (
                        <button className="reset-button" onClick={() => handleReset()}>
                            Сбросить всё
                        </button>
                    )}
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="row">
                        {properties.length > 0 ? (
                            properties.map((property) => (
                                <div key={property.id} className="col-md-4 mb-4">
                                    <div className="card">
                                        <Link to={`/props/${property.id}`}>
                                            <img src={property.imageUrl} className="card-img-top" alt={property.address} />
                                        </Link>
                                        <div className="card-body">
                                            <h1 className="card-title">{property.price}$</h1>
                                            <h5 className="card-title">{property.address}</h5>
                                            <p className="card-text">{getTypeLabel(property.type)}, {property.rooms} комн., {property.square} кв. м.</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No properties found</div>
                        )}
                    </div>
                )}

                {showAddPopup && <AddPropertyPopup onClose={handleClosePopup} onAddProperty={handleAddProperty} />}

                <div className="pagination">{renderPaginationButtons()}</div>
            </div>
            {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} onApply={handleFilterApply} />}
        </>
    );
};

export default PropertyList;