import { bind } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { List } from 'react-virtualized/dist/commonjs/List';
import styled from 'styled-components';
import { SelectLabel } from './label';
import {
    isArray,
    getWindowInnerHeight,
    getWindow,
    getDocument,
    equal
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
    public static MenuContainer = styled.div.attrs(
        (props: MenuContainerProps) => ({
            style: {
                top: getContainerTop(props),
                left: `${props.rect ? props.rect.left : 0}px`,
                width: `${
                    props.rect ? props.menuWidth || props.rect.width : 0
                }px`
            }
        })
    )`
        position: fixed;
        z-index: 9999;
        background: #fff;
        box-sizing: border-box;
        box-shadow: ${(props: MenuContainerProps) =>
            menuPosition(props) === 'bottom'
                ? '0 2px 5px rgba(0, 0, 0, 0.1)'
                : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

        .ReactVirtualized__List {
            border-width: 1px;
            border-style: solid;
            border-color: ${(props: MenuContainerProps) =>
                props.error ? 'var(--react-slct-error-color)' : '#ccc'};
            background-color: #fff;

            &:focus {
                outline: none;
            }
        }
    `;

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
        const menuHeight = this.props.menuHeight || 185;
        const height = Math.min(
            Math.max(options.length * rowHeight, rowHeight),
            menuHeight
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

const MenuWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
`;

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
        const {
            menuWidth,
            menuHeight,
            error,
            onRef,
            rect,
            onClick,
            children
        } = this.props;
        const className = ['react-slct-menu', this.props.className]
            .filter(c => c)
            .join(' ');

        return (
            <MenuWrapper ref={this.onEl}>
                {this.document
                    ? createPortal(
                          <Menu.MenuContainer
                              data-role="menu"
                              className={className}
                              error={error}
                              rect={rect || this.state.rect}
                              menuWidth={menuWidth}
                              menuHeight={menuHeight}
                              ref={onRef}
                              onClick={onClick}
                          >
                              {children}
                          </Menu.MenuContainer>,
                          this.document.body
                      )
                    : null}
            </MenuWrapper>
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
