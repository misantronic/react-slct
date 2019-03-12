import * as React from 'react';
import { render } from 'react-dom';
import { createGlobalStyle } from 'styled-components';

const id = 'react-slct-style';

function create() {
    const ReactSlctStyle = createGlobalStyle`
        .react-slct, .react-slct-menu {
            --react-slct-error-color: #ff5c5c; 
        }
    `;
    const reactSlctDiv = document.createElement('div');

    reactSlctDiv.id = id;
    document.body.appendChild(reactSlctDiv);

    render(<ReactSlctStyle />, reactSlctDiv);
}

if (!document.getElementById(id)) {
    create();
}
