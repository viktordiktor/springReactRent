// imageUtils.js

export const convertByteaToImageUrl = (bytea) => {
    const byteArray = new Uint8Array(bytea);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(blob);
    });
};