import { bind } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { MenuContainerProps, Rect } from './typings';
import { getDocument, getWindow, getWindowInnerHeight } from './utils';

export interface MenuContainerState {
    rect?: Rect;
}

interface MenuWrapperProps {
    rect?: Rect;
    menuHeight?: MenuContainerProps['menuHeight'];
    error?: boolean;
}

function menuPosition({
    rect,
    menuHeight = 186
}: MenuWrapperProps): 'top' | 'bottom' {
    if (!rect) {
        return 'bottom';
    }

    const { height } = rect;

    if (height === 'auto' || menuHeight === 'auto') {
        return 'bottom';
    }

    if (rect.top + height + menuHeight <= getWindowInnerHeight()) {
        return 'bottom';
    }

    return 'top';
}

function getContainerTop(props: MenuWrapperProps): number {
    const { rect } = props;

    if (!rect) {
        return 0;
    }

    const menuHeight =
        !props.menuHeight || props.menuHeight === 'auto'
            ? 186
            : props.menuHeight;
    const height = rect.height === 'auto' ? 32 : rect.height;

    switch (menuPosition(props)) {
        case 'top':
            return rect.top - menuHeight;
        case 'bottom':
            return rect.top + height - 1;
    }
}

const MenuOverlay = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
`;

const MenuWrapper = styled.div`
    position: fixed;
    z-index: 9999;
    background: #fff;
    box-sizing: border-box;
    box-shadow: ${(props: MenuWrapperProps) =>
        menuPosition(props) === 'bottom'
            ? '0 2px 5px rgba(0, 0, 0, 0.1)'
            : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

    .ReactVirtualized__List {
        border-width: 1px;
        border-style: solid;
        border-color: ${(props: MenuWrapperProps) =>
            props.error ? 'var(--react-slct-error-color)' : '#ccc'};
        background-color: #fff;

        &:focus {
            outline: none;
        }
    }
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

    private get style(): Rect {
        const { menuLeft, menuTop, menuWidth, menuHeight } = this.props;
        const { rect } = this.state;

        return {
            top:
                menuTop !== undefined
                    ? menuTop
                    : getContainerTop({ rect, menuHeight }),
            left: menuLeft !== undefined ? menuLeft : rect ? rect.left : 0,
            width: menuWidth || (rect ? rect.width : 0),
            height: menuHeight || 'auto'
        };
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
        const { style } = this;
        const { error, onRef, onClick, children } = this.props;
        const className = ['react-slct-menu', this.props.className]
            .filter(c => c)
            .join(' ');

        return (
            <MenuOverlay ref={this.onEl}>
                {this.document
                    ? createPortal(
                          <MenuWrapper
                              data-role="menu"
                              className={className}
                              error={error}
                              ref={onRef}
                              onClick={onClick}
                              rect={this.state.rect}
                              style={style}
                          >
                              {children}
                          </MenuWrapper>,
                          this.document.body
                      )
                    : null}
            </MenuOverlay>
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
