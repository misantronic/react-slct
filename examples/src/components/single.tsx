import { bind } from 'decko';
import * as React from 'react';
import { Select, SelectProps, Option } from '../../../src';
import { options } from '../utils/options';
import { isMobile } from '../utils/browser';

interface State {
    value?: string;
    options: Option[];
    native: boolean;
}

export class Single extends React.PureComponent<Partial<SelectProps>, State> {
    constructor(props) {
        super(props);

        this.state = {
            value: undefined,
            native: isMobile.matches,
            options: [...options]
        };
    }

    public componentDidMount(): void {
        isMobile.addListener(this.onResize);
    }

    public componentWillUnmount(): void {
        isMobile.removeListener(this.onResize);
    }

    public render(): React.ReactNode {
        return (
            <Select
                placeholder="Please select..."
                options={this.state.options}
                onChange={this.onChange}
                onCreate={this.onCreate}
                value={this.state.value}
                native={isMobile.matches}
                {...this.props}
            />
        );
    }

    @bind
    private onChange(value: string): void {
        this.setState({ value });
    }

    @bind
    private onCreate(value: string): void {
        this.setState(
            {
                options: [...this.state.options, { label: value, value }]
            },
            () => this.onChange(value)
        );
    }

    @bind
    private onResize(): void {
        this.setState({ native: isMobile.matches });
    }
}
