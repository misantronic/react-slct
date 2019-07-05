import { bind } from 'lodash-decorators';
import * as React from 'react';
import { List } from 'react-virtualized/dist/commonjs/List';
import styled from 'styled-components';
import { SelectLabel } from './label';
import { MenuContainer } from './menu-container';
import { OptionComponent } from './option';
import { MenuComponentProps, Option, Rect } from './typings';
import { equal, isArray } from './utils';

interface MenuComponentState {
    rect?: Rect;
}

export class Menu extends React.PureComponent<
    MenuComponentProps,
    MenuComponentState
> {
    private static EmptyOptionItem = styled(OptionComponent.OptionItem)`
        height: 100%;
    `;

    private static Empty = (props: { emptyText?: string }) => (
        <Menu.EmptyOptionItem>
            <SelectLabel>
                <i>{props.emptyText || 'No results'}</i>
            </SelectLabel>
        </Menu.EmptyOptionItem>
    );

    private list: React.RefObject<List>;

    constructor(props) {
        super(props);

        this.state = {};
        this.list = React.createRef();
    }

    public componentDidUpdate(prevProps: MenuComponentProps): void {
        const { search, emptyText, options } = this.props;
        const { current: list } = this.list;

        if (list) {
            if (
                search !== prevProps.search ||
                emptyText !== prevProps.emptyText ||
                options !== prevProps.options
            ) {
                list.forceUpdateGrid();
            }
        }
    }

    public render(): React.ReactNode {
        const { open, options = [], selectedIndex, error } = this.props;
        const { rect } = this.state;
        const MenuContent = this.props.menuComponent;
        const rowHeight = this.props.rowHeight || 32;
        const height = Math.min(
            Math.max(options.length * rowHeight, rowHeight),
            this.props.menuHeight || 185
        );

        return open ? (
            <MenuContainer
                error={error}
                menuHeight={height}
                onRect={this.onRect}
            >
                {MenuContent ? (
                    <MenuContent {...this.props} />
                ) : (
                    <List
                        className="react-slct-menu-list"
                        ref={this.list}
                        width={rect ? rect.width : 0}
                        height={height}
                        rowHeight={rowHeight}
                        rowCount={options.length}
                        rowRenderer={this.rowRenderer}
                        scrollToIndex={selectedIndex}
                        noRowsRenderer={this.emptyRenderer}
                    />
                )}
            </MenuContainer>
        ) : null;
    }

    @bind
    private rowRenderer({ key, index, style }) {
        const {
            options = [],
            labelComponent,
            selectedIndex,
            optionComponent,
            rowHeight,
            search
        } = this.props;
        const option = options[index];
        const currentValue = isArray(this.props.value)
            ? this.props.value
            : [this.props.value];
        const Component = optionComponent || OptionComponent;

        return (
            <div key={key} style={style}>
                <Component
                    option={option}
                    labelComponent={labelComponent}
                    height={rowHeight}
                    active={currentValue.some(val => equal(val, option.value))}
                    selected={selectedIndex === index}
                    search={search}
                    onSelect={this.onSelect}
                />
            </div>
        );
    }

    @bind
    private emptyRenderer() {
        const { Empty } = Menu;

        return <Empty emptyText={this.props.emptyText} />;
    }

    @bind
    private onSelect(value: any, option: Option): void {
        if (isArray(this.props.value)) {
            const found = this.props.value.some(item => equal(item, value));

            let values;

            if (found) {
                values = this.props.value.filter(item => !equal(item, value));
            } else {
                values = Array.from(new Set([...this.props.value, value]));
            }

            this.props.onSelect(values, option);
        } else {
            this.props.onSelect(value, option);
        }
    }

    @bind
    private onRect(rect?: Rect): void {
        this.setState({ rect });
    }
}

export interface MenuContainerState {
    rect?: Rect;
}
