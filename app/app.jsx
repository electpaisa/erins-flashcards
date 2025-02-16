import React from 'react';
import FlashcardsApp from './FlashcardsApp';
import { createRoot } from 'react-dom/client';

const domContainer = document.querySelector('#app-container');
const root = createRoot(domContainer);

root.render(<FlashcardsApp></FlashcardsApp>);