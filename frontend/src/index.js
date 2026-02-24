import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { pdfjs } from "react-pdf";

// Required for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App />   // ✅ Removed React.StrictMode
);

reportWebVitals();