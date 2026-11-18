import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/material-symbols-outlined/fill.css';
import '@fontsource/dm-serif-display/400.css';
import '@fontsource-variable/fraunces';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);

document.fonts.load("24px 'Material Symbols Outlined Variable'").then(() => document.documentElement.classList.add('icons-ready'));
