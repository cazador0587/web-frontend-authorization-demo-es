// en src/utils/auth.js

export const BASE_URL = "https://api.nomoreparties.co/";

export const register = (username, email, password) => {
  return fetch(`${BASE_URL}auth/local/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject("Error: ${res.status}");
  });
};

// La función de autorización acepta los datos necesarios como parámetros.
export const authorize = (identifier, password) => {
  // Se envía una solicitud POST a /auth/local.
  return fetch(`${BASE_URL}/auth/local`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // Los parámetros se envuelven en un objeto, convertido en un string
    // JSON y se envían en el cuerpo de la solicitud.
    body: JSON.stringify({ identifier, password }),
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};
