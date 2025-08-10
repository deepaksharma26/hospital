export const formatDate = (date) => {
  const options = {  day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}
export const formatTime = (time) => {
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(time).toLocaleTimeString(undefined, options);
}
export const formatDateTime = (dateTime) => {
  const date = formatDate(dateTime);
  const time = formatTime(dateTime);
  return `${date} at ${time}`;
}
//date to ISO string
export const dateToISOString = (date) => {
  return new Date(date).toISOString();
}
//ISO string to date
export const isoStringToDate = (isoString) => {
  return new Date(isoString);
}
//date to UTC string
export const dateToUTCString = (date) => {
  return new Date(date).toUTCString();
}
//UTC string to date
export const utcStringToDate = (utcString) => {
  return new Date(utcString);
}
export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
}
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}
export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
}
export const formatDuration = (seconds) => {    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}   
export const checkvalidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
export const checkvalidPhone = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return re.test(String(phone).toLowerCase());
}
export const checkvalidPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number, and one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(String(password));
}
export const windowWidth = () => {
  return  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}
