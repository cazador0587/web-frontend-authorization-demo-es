export const BASE_URL = "https://api.nomoreparties.co/";

export const register = (username, email, password) => {
  return fetch(`${BASE_URL}auth/local/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject('Error: ${res.status}');
  });
};
