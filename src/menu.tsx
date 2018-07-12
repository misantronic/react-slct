import { bind } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { List } from 'react-virtualized/dist/commonjs/List';
import styled from 'styled-components';
import { SelectLabel } from './label';
import {
    toString,
    isArray,
    getWindowInnerHeight,
    getWindow,
    getDocument
} from './utils';
import {
    Rect,
    MenuComponentProps,
    Option,
    MenuContainerProps
} from './typings';
import { OptionComponent } from './option';

interface MenuComponentState {
    rect?: Rect;
}

function menuPosition(props: MenuContainerProps): 'top' | 'bottom' {
    if (
        !props.rect ||
        props.rect.top + props.rect.height + (props.menuHeight || 185) <=
            getWindowInnerHeight()
    ) {
        return 'bottom';
    }

    return 'top';
}

function getContainerTop(props: MenuContainerProps): string {
    if (!props.rect) {
        return '0px';
    }

    switch (menuPosition(props)) {
        case 'top':
            return `${props.rect.top - (props.menuHeight || 186)}px`;
        case 'bottom':
            return `${props.rect.top + props.rect.height - 1}px`;
    }
}
``;

export class Menu extends React.PureComponent<
    MenuComponentProps,
    MenuComponentState
> {
    public static MenuContainer = styled.div.attrs<MenuContainerProps>({
        style: (props: MenuContainerProps) => ({
            top: getContainerTop(props),
            left: `${props.rect ? props.rect.left : 0}px`,
            width: `${props.rect ? props.rect.width : 0}px`,
            boxShadow:
                menuPosition(props) === 'bottom'
                    ? '0 2px 5px rgba(0, 0, 0, 0.1)'
                    : '0 -2px 5px rgba(0, 0, 0, 0.1)'
        })
    })`
        position: fixed;
        z-index: 9999;
        background: #fff;
        box-sizing: border-box;

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

        this.state = {};
        this.list = React.createRef();
    }

    public componentDidUpdate(prevProps: MenuComponentProps): void {
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
        const { Empty } = Menu;
        const { open, options = [], multi, selectedIndex } = this.props;
        const { rect } = this.state;
        const MenuContent = this.props.menuComponent;
        const rowHeight = 32;
        const menuHeight = 185;
        const height = Math.min(
            Math.max(options.length * rowHeight, rowHeight),
            menuHeight
        );

        return open ? (
            <MenuContainer menuHeight={height} onRect={this.onRect}>
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
                        scrollToRow={multi ? 0 : selectedIndex}
                        noRowsRenderer={Empty}
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
            optionComponent
        } = this.props;
        const option = options[index];
        const currentValue = isArray(this.props.value)
            ? this.props.value.map(val => toString(val))
            : [toString(this.props.value)];
        const value = toString(option.value);
        const Component = optionComponent || OptionComponent;

        return (
            <div key={key} style={style}>
                <Component
                    option={option}
                    labelComponent={labelComponent}
                    active={currentValue.some(val => val === value)}
                    selected={selectedIndex === index}
                    onSelect={this.onSelect}
                />
            </div>
        );
    }

    @bind
    private onSelect(value: any, option: Option): void {
        this.props.onSelect(
            isArray(this.props.value)
                ? Array.from(new Set([...this.props.value, value]))
                : value,
            option
        );
    }

    @bind
    private onRect(rect?: Rect): void {
        this.setState({ rect });
    }
}

export interface MenuContainerState {
    rect?: Rect;
}

export class MenuContainer extends React.PureComponent<
    MenuContainerProps,
    MenuContainerState
> {
    private el?: HTMLDivElement | null;

    private get rect(): Rect | undefined {
        if (this.el) {
            const clientRect = this.el.getBoundingClientRect();

            return {
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            };
        }

        return undefined;
    }

    private get window() {
        return getWindow();
    }

    private get document() {
        return getDocument();
    }

    constructor(props) {
        super(props);

        this.state = {};
    }

    public componentDidMount(): void {
        this.addListener();
    }

    public componentDidUpdate(_, prevState: MenuContainerState): void {
        if (prevState.rect !== this.state.rect && this.props.onRect) {
            this.props.onRect(this.state.rect);
        }
    }

    public componentWillUnmount(): void {
        this.removeListener();
    }

    public render(): React.ReactNode {
        return (
            <div
                ref={this.onEl}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none'
                }}
            >
                {this.document
                    ? createPortal(
                          <Menu.MenuContainer
                              data-role="menu"
                              className="react-slct-menu"
                              rect={this.state.rect}
                              menuHeight={this.props.menuHeight}
                          >
                              {this.props.children}
                          </Menu.MenuContainer>,
                          this.document.body
                      )
                    : null}
            </div>
        );
    }

    private addListener(): void {
        if (this.window) {
            this.window.addEventListener('scroll', this.onViewportChange, true);
            this.window.addEventListener('resize', this.onViewportChange, true);
        }
    }

    private removeListener(): void {
        if (this.window) {
            this.window.removeEventListener(
                'resize',
                this.onViewportChange,
                true
            );
            this.window.removeEventListener(
                'scroll',
                this.onViewportChange,
                true
            );
        }
    }

    private allowRectChange(e): boolean {
        if (e.target.closest && !e.target.closest('.react-slct-menu')) {
            return false;
        }

        return true;
    }

    @bind
    private onViewportChange(e): void {
        if (this.allowRectChange(e)) {
            this.setState({ rect: this.rect });
        }
    }

    @bind
    private onEl(el: HTMLDivElement | null): void {
        this.el = el;

        this.setState({
            rect: this.rect
        });
    }
}
