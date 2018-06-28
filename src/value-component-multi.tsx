import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { ValueComponentMultiProps } from './typings';
import { SelectLabel } from './label';

interface RemoveProps<T = any> {
    value: T;
    onClick(value: T): void;
}

const TagContainer = styled.div`
    display: flex;
    padding: 0px 3px;
    background-color: rgba(0, 126, 255, 0.08);
    border-radius: 2px;
    border: 1px solid rgba(0, 126, 255, 0.24);
    color: #007eff;
    font-size: 0.9em;
    line-height: 1.4;
    margin: 2px 3px;
    align-items: center;
`;

const StyledRemove = styled.button`
    cursor: pointer;
    color: #007eff;
    border: none;
    background: none;
    padding: 2px 4px;
    margin: 0;
    margin-right: 4px;
    line-height: 1;
    display: inline-block;
    border-right: 1px solid rgba(0, 126, 255, 0.24);
    margin-left: -2px;
    font-size: 13px;

    &:hover {
        background-color: rgba(0, 113, 230, 0.08);
    }

    &:focus {
        outline: none;
    }
`;

class Remove extends React.PureComponent<RemoveProps> {
    public render(): React.ReactNode {
        return (
            <StyledRemove
                className="remove"
                tabIndex={-1}
                onClick={this.onClick}
            >
                ×
            </StyledRemove>
        );
    }

    @bind
    private onClick(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onClick(this.props.value);
    }
}

export class ValueComponentMulti<T = any> extends React.PureComponent<
    ValueComponentMultiProps<T>
> {
    public render(): React.ReactNode {
        const { option, labelComponent, onRemove } = this.props;
        const Label = labelComponent || SelectLabel;

        return (
            <TagContainer className="value-multi" {...option}>
                <Remove value={option.value} onClick={onRemove}>
                    ×
                </Remove>
                <Label {...option}>{option.label}</Label>
            </TagContainer>
        );
    }
}
