import * as React from 'react';
import { render } from 'react-dom';
import styled, { injectGlobal } from 'styled-components';
import { Single } from './components/single';
import { Multi } from './components/multi';
import { Code } from './components/code';
import { options } from './utils/options';

injectGlobal`
    body {  
        font-family: sans-serif;
        font-size: 13px;
    }
`;

const App = styled.div`
    max-width: 100%;
    width: 480px;
    margin: 0;
    padding: 5px 10px;
    box-sizing: border-box;
`;

const Example = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

const labelComponent = (props: { children: React.ReactNode; icon: string }) => (
    <div>
        <span style={{ marginRight: 4 }}>{props.icon}</span>
        <span>{props.children}</span>
    </div>
);

const optionsWithoutIcons = options.map(option => ({
    value: option.value,
    label: option.label
}));

const code = (...props) => `<Select placeholder="Please select..." 
    onChange={this.onChange} 
    value={this.state.value} ${props.join('\n\t')}
    options={${JSON.stringify(optionsWithoutIcons, null, 2)}} />`;

render(
    <App className="app">
        <h1>🐘 react-slct examples</h1>

        <br />

        <h2>💃 Single</h2>

        <Example>
            <Single placeholder="Simple select..." />
            <Code>{code()}</Code>
        </Example>
        <Example>
            <Single placeholder="Clearable select..." clearable />
            <Code>{code(`creatable`)}</Code>
        </Example>
        <Example>
            <Single placeholder="Searchable select..." searchable />
            <Code>{code(`searchable`)}</Code>
        </Example>
        <Example>
            <Single placeholder="Disabled select..." disabled />
            <Code>{code(`disabled`)}</Code>
        </Example>

        <br />
        <br />

        <h2>👯 Multi</h2>

        <Example>
            <Multi placeholder="Simple multi select..." />
            <Code>{code(`multi`)}</Code>
        </Example>

        <br />
        <br />

        <h2>👷 Creatable</h2>

        <Example>
            <Single placeholder="Creatable single select.." creatable />
            <Code>{code(`creatable`)}</Code>
        </Example>
        <Example>
            <Multi placeholder="Creatable multi select..." creatable />
            <Code>{code(`creatable`, `multi`)}</Code>
        </Example>

        <br />
        <br />

        <h2>👹 Custom</h2>

        <Example>
            <Single
                placeholder="Custom labels.."
                labelComponent={labelComponent}
            />
            <Code>
                {`const labelComponent = (props: { children: React.ReactNode; icon: string }) => (
    <div>
        <span style={{ marginRight: 4 }}>{props.icon}</span>
        <span>{props.children}</span>
    </div>
);

`}
                {code(`labelComponent={labelComponent}`)}
            </Code>
        </Example>
    </App>,
    document.getElementById('app')
);
