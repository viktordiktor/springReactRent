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
        // Обработка отсутствия refresh токена в Local Storage
        console.error('Отсутствует refresh токен в Local Storage');
        // Выполнение других действий при отсутствии refresh токена
        // ...
        return;
    }

    axios.post('/api/auth/refresh-token', { refresh_token })
        .then((response) => {
            const { access_token, refresh_token } = response.data;
            // Обработка успешного ответа и обновление токена на клиентской стороне (если необходимо)
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            // Выполнение других действий после обновления токена
            // ...
        })
        .catch((error) => {
            // Обработка ошибки при обновлении токена
            console.error('Ошибка обновления токена:', error);
            // Выполнение других действий при неудачном обновлении токена
            // ...
        });
}

export const propertyTypeOptions = [
    { value: 'APARTMENT', label: 'Квартира' },
    { value: 'COTTAGE', label: 'Дача' },
    { value: 'HOUSE', label: 'Дом' },
];