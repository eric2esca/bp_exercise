import axios from 'axios';

//Making an instance of axios
const api = axios.create({
  //Depending on dev vs prod
  baseURL: process.env.REACT_APP_BASE_URL, // http://localhost:5000 || host domain name  
/*
NOTE: we don't need a config object for axios as the
default headers in axios are already Content-Type: application/json
also axios stringifies and parses JSON for you, so no need for 
JSON.stringify or JSON.parse
*/
  headers: {
    'Content-Type': 'application/json' 
  }
});

export default api;