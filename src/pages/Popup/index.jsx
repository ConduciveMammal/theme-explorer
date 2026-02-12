import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';
import './index.css';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

const mountNode = window.document.querySelector('#app-container');

if (mountNode) {
  const root = createRoot(mountNode);
  root.render(<Popup />);
}
