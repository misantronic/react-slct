import * as React from 'react';
import { render } from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Headless } from './components/headless';
import { Single } from './components/single';
import { Multi } from './components/multi';
import { Code } from './components/code';
import { options } from './utils/options';
import {
    OptionComponentProps,
    MenuComponentProps,
    Option
} from '../../src/typings';

const GlobalStyle = createGlobalStyle`
    body {  
        font-family: sans-serif;
        font-size: 13px;
    }
`;

const App = styled.div`
    max-width: 100%;
    width: 480px;
    margin: 0 0 300px;
    padding: 5px 10px;
    box-sizing: border-box;
`;

const Example = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

const CustomOptionComponent = styled.div`
    background-color: palevioletred;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    height: 32px;
    padding: 0 10px;
    min-width: 0;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
        background-color: palegreen;
        color: black;
    }
`;

const labelComponent = (props: Option) => (
    <div>
        <span style={{ marginRight: 4 }}>{props.icon}</span>
        <span>{props.children}</span>
    </div>
);

const optionComponent = (props: OptionComponentProps) => (
    <CustomOptionComponent onClick={() => props.onSelect(props.option.value)}>
        {props.option.icon} {props.option.label}
    </CustomOptionComponent>
);

const menuComponent = (props: MenuComponentProps) => (
    <div style={{ border: '1px solid #ccc', padding: 10 }}>
        {(props.options || []).map((option, i) => (
            <div key={i}>
                <button
                    onClick={() => props.onSelect(option.value)}
                    style={{ width: '100%' }}
                >
                    {option.icon} {option.label}
                </button>
            </div>
        ))}
    </div>
);

const optionsWithoutIcons = options.map(option => ({
    value: option.value,
    label: option.label
}));

const code = (...props) => `<Select placeholder="Please select..." 
    value={this.state.value} ${props.join('\n\t')}
    options={${JSON.stringify(optionsWithoutIcons, null, 2)}} />`;

render(
    <App className="app">
        <GlobalStyle />
        <h1>🐘 react-slct examples</h1>

        <br />

        <h2>💃 Single</h2>

        <Example>
            <Single placeholder="Simple select..." />
            <Code>{code(`onChange={value => ...}`)}</Code>
        </Example>
        <Example>
            <Single placeholder="Clearable select..." clearable />
            <Code>{code(`creatable`, `onChange={value => ...}`)}</Code>
        </Example>
        <Example>
            <Single placeholder="Searchable select..." searchable />
            <Code>{code(`searchable`, `onChange={value => ...}`)}</Code>
        </Example>
        <Example>
            <Single placeholder="Disabled select..." disabled />
            <Code>{code(`disabled`, `onChange={value => ...}`)}</Code>
        </Example>
        <Example>
            <Single placeholder="Errored select..." error />
            <Code>{code(`error`)}</Code>
        </Example>

        <br />
        <br />

        <h2>👯 Multi</h2>

        <Example>
            <Multi placeholder="Simple multi select..." />
            <Code>{code(`multi`, `onChange={values => ...}`)}</Code>
        </Example>

        <Example>
            <Multi searchable placeholder="Simple searchable multi select..." />
            <Code>
                {code(`multi`, `searchable`, `onChange={values => ...}`)}
            </Code>
        </Example>

        <br />
        <br />

        <h2>👷 Creatable</h2>

        <Example>
            <Single placeholder="Creatable single select.." creatable />
            <Code>
                {code(
                    `creatable`,
                    `onChange={value => ...}`,
                    `onCreate={value => ...}`
                )}
            </Code>
        </Example>
        <Example>
            <Multi placeholder="Creatable multi select..." creatable />
            <Code>
                {code(
                    `creatable`,
                    `multi`,
                    `onChange={values => ...}`,
                    `onCreate={value => ...}`
                )}
            </Code>
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
                {code(
                    `labelComponent={labelComponent}`,
                    `onChange={value => ...}`
                )}
            </Code>
        </Example>
        <Example>
            <Single
                placeholder="Custom optionComponent.."
                optionComponent={optionComponent}
            />
            <Code>
                {`const optionComponent = (props: OptionComponentProps) => (
    <CustomOptionComponent onClick={() => props.onSelect(props.value)}>
        {props.icon} {props.label}
    </CustomOptionComponent>
);

`}
                {code(
                    `optionComponent={optionComponent}`,
                    `onChange={value => ...}`
                )}
            </Code>
        </Example>
        <Example>
            <Single
                placeholder="Custom menuComponent..."
                menuComponent={menuComponent}
            />
            <Code>
                {`const menuComponent = (props: MenuComponentProps) => (
    <div style={{ border: '1px solid #ccc', padding: 10 }}>
        {props.options.map((option, i) => (
            <div key={i}>
                <button
                    onClick={() => props.onSelect(option.value)}
                    style={{ width: '100%' }}
                >
                    {option.icon} {option.label}
                </button>
            </div>
        ))}
    </div>
);

`}
                {code(
                    `menuComponent={menuComponent}`,
                    `onChange={value => ...}`
                )}
            </Code>
        </Example>

        <br />
        <br />

        <h2>🏎 Headless</h2>

        <Example>
            <Headless />
        </Example>
    </App>,
    document.getElementById('app')
);
