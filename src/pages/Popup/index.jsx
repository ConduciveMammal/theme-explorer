import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

const mountNode = window.document.querySelector('#app-container');

if (mountNode) {
  render(<Popup />, mountNode);
}
