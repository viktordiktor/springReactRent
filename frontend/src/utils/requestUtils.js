import axios from "axios";

export const getTypeLabel = (type) => {
    switch (type) {
        case 'APARTMENT':
            return 'Квартира';
        case 'COTTAGE':
            return 'Дача';
        case 'HOUSE':
            return 'Дом';
        default:
            return '';
    }
};

export function refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');

    if (!refresh_token) {
        console.error('Отсутствует refresh токен в Local Storage');
        return;
    }

    axios.post('/api/auth/refresh-token', { refresh_token })
        .then((response) => {
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        })
        .catch((error) => {
            console.error('Ошибка обновления токена:', error);
        });
}

export const propertyTypeOptions = [
    { value: 'APARTMENT', label: 'Квартира' },
    { value: 'COTTAGE', label: 'Дача' },
    { value: 'HOUSE', label: 'Дом' },
];