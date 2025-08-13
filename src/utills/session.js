//store access token
export const setAccessToken = (token) => {
  localStorage.setItem('accessToken', token);
}
// Get access token
export const getAccessToken = async () => {
  return localStorage.getItem('accessToken');
}
// Clear access token
export const clearAccessToken = () => {
  localStorage.removeItem('accessToken');
}
// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token; // Returns true if token exists, false otherwise
}
//check token expiry
export const isTokenExpired = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return true;
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiry = payload.exp * 1000; // Convert to milliseconds
  return Date.now() >= expiry; // Check if current time is past expiry time
}
//extract username from token
export const getUsernameFromToken = () => {   
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1])); 
  return payload?.data?.firstname +' '+ payload?.data?.lastname|| null; // Assuming the username is stored in the token payload
}
export const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload?.data?.email || null; // Assuming the user ID is stored in
}
//session timeout 
export const validatePassword = (password) => {
  // Check if password is at least 8 characters long
  if (password.length < 8) return false;
  // Check if password contains at least one number
  if (!/\d/.test(password)) return false;
  // Check if password contains at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  return true; // Password is valid
}

export const clearSessionTimeout = () => {
  return localStorage.removeItem('sessionTimeout');
}
export const isSessionTimeout = () => {
  return localStorage.getItem('sessionTimeout') === 'true';
}
export const getSessionTimeout = () => {
  return localStorage.getItem('sessionTimeout');
}
export const setSessionTimeout = (timeout) => {
  return localStorage.setItem('sessionTimeout', timeout);
}
export const clearSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('sessionTimeout');
  // Add any other session-related cleanup here
}