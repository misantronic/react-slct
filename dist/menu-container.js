"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_decorators_1 = require("lodash-decorators");
const React = require("react");
const react_dom_1 = require("react-dom");
const styled_components_1 = require("styled-components");
const utils_1 = require("./utils");
function menuPosition({ rect, menuHeight = 186 }) {
    if (!rect) {
        return 'bottom';
    }
    const { height } = rect;
    if (height === 'auto' || menuHeight === 'auto') {
        return 'bottom';
    }
    if (rect.top + height + menuHeight <= utils_1.getWindowInnerHeight()) {
        return 'bottom';
    }
    return 'top';
}
function getContainerTop(props) {
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
const MenuOverlay = styled_components_1.default.div `
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
`;
const MenuWrapper = styled_components_1.default.div `
    position: fixed;
    z-index: 9999;
    background: #fff;
    box-sizing: border-box;
    box-shadow: ${(props) => menuPosition(props) === 'bottom'
    ? '0 2px 5px rgba(0, 0, 0, 0.1)'
    : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

    .react-slct-menu-list {
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: ${(props) => props.error ? 'var(--react-slct-error-color)' : '#ccc'};
        background-color: #fff;

        &:focus {
            outline: none;
        }
    }
`;
class MenuContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    get menuOverlayRect() {
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
    get menuWrapperRect() {
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
    get style() {
        const { window } = this;
        const { menuLeft, menuTop, menuWidth } = this.props;
        const { menuOverlay, menuWrapper } = this.state;
        const menuHeight = this.props.menuHeight ||
            (menuWrapper ? menuWrapper.height : 'auto');
        let width = menuWidth || (menuOverlay ? menuOverlay.width : 'auto');
        const height = menuHeight || (menuWrapper ? menuWrapper.height : 'auto');
        const top = menuTop !== undefined
            ? menuTop
            : getContainerTop({
                rect: menuOverlay,
                menuHeight: height
            });
        let left = menuLeft !== undefined
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
    get window() {
        return utils_1.getWindow();
    }
    get document() {
        return utils_1.getDocument();
    }
    componentDidMount() {
        this.addListener();
    }
    componentDidUpdate(_, prevState) {
        const { menuOverlay, menuWrapper } = this.state;
        if (this.props.onRect) {
            if (prevState.menuOverlay !== menuOverlay ||
                prevState.menuWrapper !== menuWrapper) {
                this.props.onRect(menuOverlay, menuWrapper);
            }
        }
    }
    componentWillUnmount() {
        this.removeListener();
    }
    render() {
        const { error, onClick, children } = this.props;
        const className = ['react-slct-menu', this.props.className]
            .filter(c => c)
            .join(' ');
        return (React.createElement(MenuOverlay, { ref: this.onMenuOverlay }, this.document
            ? react_dom_1.createPortal(React.createElement(MenuWrapper, { "data-role": "menu", className: className, error: error, ref: this.onMenuWrapper, onClick: onClick, rect: this.state.menuOverlay, style: this.style }, children), this.document.body)
            : null));
    }
    addListener() {
        if (this.window) {
            this.window.addEventListener('scroll', this.onViewportChange, true);
            this.window.addEventListener('resize', this.onViewportChange, true);
        }
    }
    removeListener() {
        if (this.window) {
            this.window.removeEventListener('resize', this.onViewportChange, true);
            this.window.removeEventListener('scroll', this.onViewportChange, true);
        }
    }
    allowRectChange(e) {
        if (e.target.closest && !e.target.closest('.react-slct-menu')) {
            return false;
        }
        return true;
    }
    onViewportChange(e) {
        if (this.allowRectChange(e)) {
            this.setState({
                menuOverlay: this.menuOverlayRect,
                menuWrapper: this.menuWrapperRect
            });
        }
    }
    onMenuOverlay(el) {
        this.menuOverlay = el;
        if (this.menuOverlay) {
            this.setState({
                menuOverlay: this.menuOverlayRect
            });
        }
    }
    onMenuWrapper(el) {
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
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MenuContainer.prototype, "onViewportChange", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MenuContainer.prototype, "onMenuOverlay", null);
tslib_1.__decorate([
    lodash_decorators_1.bind,
    lodash_decorators_1.debounce(16),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MenuContainer.prototype, "onMenuWrapper", null);
exports.MenuContainer = MenuContainer;
//# sourceMappingURL=menu-container.js.map