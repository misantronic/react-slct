import * as React from 'react';
import { render } from 'react-dom';
import { Single } from './single';
import { Multi } from './multi';
import { injectGlobal } from 'styled-components';

injectGlobal`
    body {  
        font-family: sans-serif;
        font-size: 13px;
    }

    .app {
        max-width: 100%;
        width: 300px;
        margin: 0 auto;
    }

    .react-slct {
        margin-bottom: 12px;
    }
`;

render(
    <div className="app">
        <h1>🐘 react-slct examples</h1>

        <br />

        <h2>💃 Single</h2>
        <Single placeholder="Simple select..." />
        <Single placeholder="Clearable select..." clearable />
        <Single placeholder="Searchable select..." searchable />
        <Single placeholder="Disabled select..." disabled />

        <br />
        <br />

        <h2>👯 Multi</h2>
        <Multi placeholder="Simple multi select..." />

        <br />
        <br />

        <h2>👷 Creatable</h2>
        <Single placeholder="Creatable single select.." creatable />
        <Multi placeholder="Creatable multi select..." creatable />
    </div>,
    document.getElementById('app')
);
