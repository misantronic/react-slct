import * as React from 'react';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { OptionComponentProps } from './typings';

interface OptionItemProps {
    active?: OptionComponentProps['active'];
    selected?: OptionComponentProps['selected'];
    height?: OptionComponentProps['height'];
}

export class OptionComponent extends React.PureComponent<OptionComponentProps> {
    public static OptionItem = styled.div<OptionItemProps>`
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        height: ${(props) => props.height || 32}px;
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
        const { active, selected, labelComponent, option, height } = this.props;
        const Label = (labelComponent ? labelComponent : SelectLabel) as any;
        const className = [
            'option',
            this.props.className,
            selected ? 'selected' : null,
            active ? 'active' : null
        ].filter((v) => Boolean(v));

        return (
            <OptionItem
                data-role="option"
                className={className.join(' ')}
                selected={selected}
                active={active}
                height={height}
                onClick={this.onClick}
            >
                <Label type="option" active={active} {...option}>
                    {option.label}
                </Label>
            </OptionItem>
        );
    }

    private onClick = () => {
        this.props.onSelect(this.props.option.value, this.props.option);
    };
}
