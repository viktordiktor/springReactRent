import axios from "axios";

export const getTypeLabel = (type) => {
  switch (type) {
    case "APARTMENT":
      return "Квартира";
    case "COTTAGE":
      return "Дача";
    case "HOUSE":
      return "Дом";
    default:
      return "";
  }
};

export function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    console.error("Отсутствует refresh токен в Local Storage");
    return;
  }

  axios
    .post("/api/auth/refresh-token", { refresh_token })
    .then((response) => {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    })
    .catch((error) => {
      console.error("Ошибка обновления токена:", error);
    });
}

export const propertyTypeOptions = [
  { value: "APARTMENT", label: "Квартира" },
  { value: "COTTAGE", label: "Дача" },
  { value: "HOUSE", label: "Дом" },
];

export const getRole = async (accessToken) => {
  const response = await axios.get("/api/users/role", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const addProperty = async (formData) => {
  const accessToken = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "multipart/form-data",
  };

  const response = await axios.post("/api/props/new", formData, { headers });
  return response.data;
};

export const getOneProperty = async (propertyId) => {
  return await axios.get(`/api/props/${propertyId}`);
};

export const editProperty = async (propertyId, formData) => {
  const accessToken = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "multipart/form-data",
  };

  await axios.patch(`/api/props/${propertyId}`, formData, { headers });
};

export const softDeleteProperty = async (propertyId) => {
  const access_token = localStorage.getItem("access_token");

  if (access_token) {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios.delete(`/api/props/${propertyId}`, { headers });
  }
};

export const restoreProperty = async (propertyId) => {
  const access_token = localStorage.getItem("access_token");

  if (access_token) {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios.post(`/api/props/${propertyId}`, null, { headers });
  }
};

export const hardDeleteProperty = async (propertyId) => {
  const access_token = localStorage.getItem("access_token");

  if (access_token) {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios.delete(`/api/admin/deleteProperty/${propertyId}`, { headers });
  }
};

export const getAdminData = async () => {
  const access_token = localStorage.getItem("access_token");

  if (access_token) {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const response = await axios.get("/api/admin", { headers });
    return response.data;
  }
};

export const login = async (userData) => {
  return await axios.post("/api/auth/authenticate", userData);
};

export const register = async (userData) => {
  await axios.post("/api/auth/register", userData);
};

export const editPerson = async (userProfile, fullName, phone, accessToken) => {
  await axios.patch(
    `/api/person/${userProfile.person.id}`,
    {
      fullName: fullName,
      phone: phone,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const getPerson = async () => {
  const accessToken = localStorage.getItem("access_token");
  return await axios.get("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
