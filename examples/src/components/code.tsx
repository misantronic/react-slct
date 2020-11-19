import * as React from 'react';
import styled from 'styled-components';
import { bind } from 'decko';

interface CodeProps {
    children: string | string[];
}

interface CodeState {
    show: boolean;
}

const Button = styled.button`
    margin: 0 0 0 10px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`;

const Container = styled.code`
    white-space: pre;
    position: absolute;
    left: 520px;
    background: #111;
    color: #fff;
    padding: 8px;
`;

export class Code extends React.PureComponent<CodeProps, CodeState> {
    constructor(props) {
        super(props);

        this.state = { show: false };
    }

    public render(): React.ReactNode {
        const { children } = this.props;
        const { show } = this.state;

        return (
            <>
                <Button
                    title="Source"
                    tabIndex={-1}
                    onClick={this.onToggleSource}
                >
                    {'</>'}
                </Button>
                {show && <Container>{children}</Container>}
            </>
        );
    }

    @bind
    private onToggleSource(): void {
        this.setState({ show: !this.state.show });
    }
}
