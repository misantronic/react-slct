import { bind, debounce } from 'lodash-decorators';
import * as React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { MenuContainerProps, Rect } from './typings';
import { getDocument, getWindow, getWindowInnerHeight } from './utils';

export interface MenuContainerState {
    menuOverlay?: Rect;
    menuWrapper?: Rect;
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

    const menuHeight = (props.menuHeight !== 'auto' && props.menuHeight) || 186;
    const height = rect.height === 'auto' ? 32 : rect.height;

    switch (menuPosition(props)) {
        case 'top':
            return rect.top - menuHeight + 1;
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
    private menuOverlay?: HTMLDivElement | null;
    private menuWrapper?: HTMLDivElement | null;

    private get menuOverlayRect(): Rect | undefined {
        if (this.menuOverlay) {
            const clientRect = this.menuOverlay.getBoundingClientRect();

            return {
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            };
        }

        return undefined;
    }

    private get menuWrapperRect(): Rect | undefined {
        if (this.menuWrapper) {
            const clientRect = this.menuWrapper.getBoundingClientRect();

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
        const { window } = this;
        const { menuLeft, menuTop, menuWidth } = this.props;
        const { menuOverlay, menuWrapper } = this.state;
        const menuHeight =
            this.props.menuHeight ||
            (menuWrapper ? menuWrapper.height : 'auto');
        let width = menuWidth || (menuOverlay ? menuOverlay.width : 'auto');
        const height =
            menuHeight || (menuWrapper ? menuWrapper.height : 'auto');
        const top =
            menuTop !== undefined
                ? menuTop
                : getContainerTop({
                      rect: menuOverlay,
                      menuHeight: height
                  });
        let left =
            menuLeft !== undefined
                ? menuLeft
                : menuOverlay
                ? menuOverlay.left
                : 0;

        if (window) {
            const numWidth = Number(width);

            if (numWidth > window.innerWidth) {
                width = window.innerWidth - 20;
            }

            if (left + numWidth > window.innerWidth) {
                left = Math.max(10, window.innerWidth - numWidth - 20);
            }
        }

        return { top, left, width, height };
    }

    private get window() {
        return getWindow();
    }

    private get document() {
        return getDocument();
    }

    constructor(props: MenuContainerProps) {
        super(props);

        this.state = {};
    }

    public componentDidMount(): void {
        this.addListener();
    }

    public componentDidUpdate(_: any, prevState: MenuContainerState): void {
        const { menuOverlay, menuWrapper } = this.state;

        if (this.props.onRect) {
            if (
                prevState.menuOverlay !== menuOverlay ||
                prevState.menuWrapper !== menuWrapper
            ) {
                this.props.onRect(menuOverlay, menuWrapper);
            }
        }
    }

    public componentWillUnmount(): void {
        this.removeListener();
    }

    public render(): React.ReactNode {
        const { error, onClick, children } = this.props;
        const className = ['react-slct-menu', this.props.className]
            .filter(c => c)
            .join(' ');

        return (
            <MenuOverlay ref={this.onMenuOverlay}>
                {this.document
                    ? createPortal(
                          <MenuWrapper
                              data-role="menu"
                              className={className}
                              error={error}
                              ref={this.onMenuWrapper}
                              onClick={onClick}
                              rect={this.state.menuOverlay}
                              style={this.style}
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
            this.setState({
                menuOverlay: this.menuOverlayRect,
                menuWrapper: this.menuWrapperRect
            });
        }
    }

    @bind
    private onMenuOverlay(el: HTMLDivElement | null): void {
        this.menuOverlay = el;

        if (this.menuOverlay) {
            this.setState({
                menuOverlay: this.menuOverlayRect
            });
        }
    }

    @bind
    @debounce(16)
    private onMenuWrapper(el: HTMLDivElement | null): void {
        if (el && this.props.onRef) {
            this.props.onRef(el);
        }

        this.menuWrapper = el;

        if (this.menuWrapper) {
            this.setState({
                menuWrapper: this.menuWrapperRect
            });
        }
    }
}
