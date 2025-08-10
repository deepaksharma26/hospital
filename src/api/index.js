import { getAccessToken } from "../utills/session";

const apiKey = process.env.REACT_APP_API_KEY || 'defaultApiKey';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1/';

export const postMethod = async (url, data) => {
  const response = await fetch(apiUrl+url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${await getAccessToken()}`,
      'key': apiKey

    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
export const getMethod = async (url) => {
  const response = await fetch(apiUrl+url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${await getAccessToken()}`,
      'key': apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } 
  return response.json();
}

export const putMethod = async (url, data) => {
  const response = await fetch(apiUrl+url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `${await getAccessToken()}`,
      'key': apiKey
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const deleteMethod = async (url, data) => {
  const response = await fetch(apiUrl+url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${await getAccessToken()}`,
      'key': apiKey
    },
    body: JSON.stringify(data)
  }); 
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}