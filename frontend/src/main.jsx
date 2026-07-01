
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/style.css';    // Import your custom styles
import './assets/rating.css';   // Import your star rating styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);