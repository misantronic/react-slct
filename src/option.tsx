import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { OptionComponentProps } from './typings';

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
        const { active, selected, labelComponent, option } = this.props;
        const Label = labelComponent ? labelComponent : SelectLabel;
        const className = [
            'option',
            selected ? 'selected' : null,
            active ? 'active' : null
        ].filter(v => Boolean(v));

        return (
            <OptionItem
                className={className.join(' ')}
                selected={selected}
                active={active}
                onClick={this.onClick}
            >
                <Label {...option}>{option.label}</Label>
            </OptionItem>
        );
    }

    @bind
    private onClick(): void {
        this.props.onSelect(this.props.option.value, this.props.option);
    }
}
