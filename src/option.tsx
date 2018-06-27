import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { Option, SelectProps } from './typings';

interface OptionComponentProps<T = any> extends Option<T> {
    active?: boolean;
    selected?: boolean;
    labelComponent: SelectProps['labelComponent'];
    onSelect(value: T): void;
}

interface OptionItemProps {
    active?: OptionComponentProps['active'];
    selected?: OptionComponentProps['selected'];
}

export class OptionComponent extends React.PureComponent<OptionComponentProps> {
    public static OptionItem = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        height: 32px;
        padding: 0 10px;
        min-width: 0;
        cursor: pointer;
        box-sizing: border-box;
        background-color: ${(props: OptionItemProps) =>
            props.active ? '#ddd' : props.selected ? '#eee' : '#fff'};

        &:hover {
            background-color: ${(props: OptionItemProps) =>
                props.active ? '#ddd' : '#eee'};
        }
    `;

    public render(): React.ReactNode {
        const { OptionItem } = OptionComponent;
        const { active, selected, label, labelComponent } = this.props;
        const Label = labelComponent ? labelComponent : SelectLabel;

        return (
            <OptionItem
                className="option"
                selected={selected}
                active={active}
                onClick={this.onClick}
            >
                <Label {...this.props}>{label}</Label>
            </OptionItem>
        );
    }

    @bind
    private onClick(): void {
        this.props.onSelect(this.props.value);
    }
}