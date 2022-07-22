import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import "@fontsource/nunito/variable.css"; // This contains ALL variable axes. Font files are larger.
import "@fontsource/nunito/variable-italic.css"; // Italic variant.

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
