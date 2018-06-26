import { bind } from 'lodash-decorators';
import * as React from 'react';
import { Select, SelectProps, Option } from '../../src';
import { options } from './_options';

interface State {
    value?: string;
    options: Option[];
}

export class Single extends React.PureComponent<Partial<SelectProps>, State> {
    constructor(props) {
        super(props);

        this.state = {
            value: undefined,
            options: [...options]
        };
    }

    public render(): React.ReactNode {
        return (
            <Select
                placeholder="Please select..."
                options={this.state.options}
                onChange={this.onChange}
                onCreate={this.onCreate}
                value={this.state.value}
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
}
