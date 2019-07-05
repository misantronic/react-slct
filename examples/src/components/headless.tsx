import * as React from 'react';
import styled from 'styled-components';
import { Select } from '../../../src';
import { options } from '../utils/options';

interface HeadlessState {
    value: any;
}

const Container = styled.div`
    width: 100%;
    position: relative;
`;

const Value = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
`;

const Placeholder = styled.span`
    color: #aaa;
`;

const Options = styled.div`
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    margin-top: -1px;
    box-sizing: border-box;
    background: white;
    z-index: 1;
`;

const Option = styled.div`
    padding: 8px 10px;
    cursor: pointer;

    &:hover {
        background-color: #eee;
    }
`;

const ArrowButton = styled.button`
    font-size: 12px;
    color: #ccc;

    &:hover {
        color: #333;
    }
`;

export class Headless extends React.Component<{}, HeadlessState> {
    constructor(props) {
        super(props);

        this.state = {
            value: undefined
        };
    }

    public render(): React.ReactNode {
        return (
            <Select
                value={this.state.value}
                options={options}
                placeholder="Headless component..."
            >
                {({
                    value,
                    options,
                    placeholder,
                    open,
                    onToggle,
                    onRef,
                    MenuContainer
                }) => (
                    <Container ref={onRef as any}>
                        <Value onClick={onToggle}>
                            {placeholder && (
                                <Placeholder>{placeholder}</Placeholder>
                            )}
                            {value && !Array.isArray(value) && (
                                <div>
                                    {value.id}. {value.value}
                                </div>
                            )}
                            <ArrowButton>{open ? '▲' : '▼'}</ArrowButton>
                        </Value>
                        {open && (
                            <MenuContainer>
                                <Options>
                                    {options.map((option, i) => (
                                        <Option
                                            key={i}
                                            onClick={(
                                                e: React.SyntheticEvent<any>
                                            ) => {
                                                e.stopPropagation();

                                                this.setState(
                                                    {
                                                        value: option.value
                                                    },
                                                    onToggle
                                                );
                                            }}
                                        >
                                            {option.label}
                                        </Option>
                                    ))}
                                </Options>
                            </MenuContainer>
                        )}
                    </Container>
                )}
            </Select>
        );
    }
}
