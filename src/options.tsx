import { bind } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { List } from 'react-virtualized/dist/commonjs/List';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { toString, isArray, getWindowInnerHeight } from './utils';
import { SelectProps, Rect } from './typings';
import { OptionComponent } from './option';

export interface OptionsProps<T = any> {
    options: SelectProps['options'];
    value: SelectProps['value'];
    labelComponent: SelectProps['labelComponent'];
    multi: SelectProps['multi'];
    selectedIndex?: number;
    open: boolean;
    rect: Rect;
    search?: string;
    onSelect(value: T | T[]): void;
}

function menuPosition(rect: Rect): 'top' | 'bottom' {
    if (rect.top + rect.height + 185 <= getWindowInnerHeight()) {
        return 'bottom';
    }

    return 'top';
}

function getContainerTop(props: { rect: Rect }): string {
    switch (menuPosition(props.rect)) {
        case 'top':
            return `${props.rect.top - 185 + 1}px`;
        case 'bottom':
            return `${props.rect.top + props.rect.height - 1}px`;
    }
}

export class Options extends React.PureComponent<OptionsProps> {
    private static OptionsContainer = styled.div`
        position: fixed;
        left: ${(props: { rect: Rect }) => props.rect.left}px;
        top: ${getContainerTop};
        width: ${(props: { rect: Rect }) => props.rect.width}px;
        z-index: 9999;
        background: #fff;
        box-sizing: border-box;
        box-shadow: ${(props: { rect: Rect }) =>
            menuPosition(props.rect) === 'bottom'
                ? '0 2px 5px rgba(0, 0, 0, 0.1)'
                : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

        .ReactVirtualized__List {
            border: 1px solid #ccc;

            &:focus {
                outline: none;
            }
        }
    `;

    private static Empty = () => (
        <OptionComponent.OptionItem>
            <SelectLabel>
                <i>No results</i>
            </SelectLabel>
        </OptionComponent.OptionItem>
    );

    private list: React.RefObject<List>;

    constructor(props) {
        super(props);

        this.list = React.createRef();
    }

    public componentDidUpdate(prevProps: OptionsProps): void {
        const { selectedIndex, search } = this.props;
        const { current } = this.list;

        if (current) {
            if (selectedIndex !== -1 && selectedIndex !== undefined) {
                current.forceUpdateGrid();
                current.scrollToRow(selectedIndex);
            }

            if (search !== prevProps.search) {
                current.forceUpdateGrid();
            }
        }
    }

    public render(): React.ReactNode {
        const { OptionsContainer, Empty } = Options;
        const { open, rect, options, multi, selectedIndex } = this.props;
        const rowHeight = 32;
        const menuHeight = 185;
        const height = Math.min(
            Math.max(options.length * rowHeight, rowHeight),
            menuHeight
        );

        return open
            ? createPortal(
                  <OptionsContainer
                      className="react-slct-options-container"
                      rect={rect}
                  >
                      <List
                          className="react-slct-options-list"
                          ref={this.list}
                          width={rect.width}
                          height={height}
                          rowHeight={rowHeight}
                          rowCount={options.length}
                          rowRenderer={this.rowRenderer}
                          scrollToRow={multi ? 0 : selectedIndex}
                          noRowsRenderer={Empty}
                      />
                  </OptionsContainer>,
                  document.body
              )
            : null;
    }

    @bind
    private rowRenderer({ key, index, style }) {
        const { options, labelComponent, selectedIndex } = this.props;
        const option = options[index];
        const currentValue = isArray(this.props.value)
            ? this.props.value.map(val => toString(val))
            : [toString(this.props.value)];
        const value = toString(option.value);

        return (
            <div key={key} style={style}>
                <OptionComponent
                    {...option}
                    labelComponent={labelComponent}
                    active={currentValue.some(val => val === value)}
                    selected={selectedIndex === index}
                    onSelect={this.onSelect}
                />
            </div>
        );
    }

    @bind
    private onSelect(value: any): void {
        this.props.onSelect(
            isArray(this.props.value)
                ? Array.from(new Set([...this.props.value, value]))
                : value
        );
    }
}
