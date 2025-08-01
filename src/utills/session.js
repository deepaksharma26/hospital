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