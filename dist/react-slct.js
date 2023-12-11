(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = exports.keys = exports.SelectProps = exports.Option = exports.MenuComponentProps = exports.Menu = exports.LabelComponentProps = exports.ValueComponentSingle = exports.ValueComponentMulti = exports.ValueComponentSingleProps = exports.ValueComponentMultiProps = exports.SelectStaticControl = exports.OptionComponentProps = exports.OptionComponent = void 0;
const tslib_1 = require("tslib");
const React = require("react");
const styled_components_1 = require("styled-components");
const menu_1 = require("./menu");
Object.defineProperty(exports, "Menu", { enumerable: true, get: function () { return menu_1.Menu; } });
const menu_container_1 = require("./menu-container");
const typings_1 = require("./typings");
Object.defineProperty(exports, "LabelComponentProps", { enumerable: true, get: function () { return typings_1.LabelComponentProps; } });
Object.defineProperty(exports, "MenuComponentProps", { enumerable: true, get: function () { return typings_1.MenuComponentProps; } });
Object.defineProperty(exports, "Option", { enumerable: true, get: function () { return typings_1.Option; } });
Object.defineProperty(exports, "SelectProps", { enumerable: true, get: function () { return typings_1.SelectProps; } });
const utils_1 = require("./utils");
Object.defineProperty(exports, "keys", { enumerable: true, get: function () { return utils_1.keys; } });
const value_1 = require("./value");
tslib_1.__exportStar(require("./config"), exports);
var option_1 = require("./option");
Object.defineProperty(exports, "OptionComponent", { enumerable: true, get: function () { return option_1.OptionComponent; } });
var typings_2 = require("./typings");
Object.defineProperty(exports, "OptionComponentProps", { enumerable: true, get: function () { return typings_2.OptionComponentProps; } });
Object.defineProperty(exports, "SelectStaticControl", { enumerable: true, get: function () { return typings_2.SelectStaticControl; } });
Object.defineProperty(exports, "ValueComponentMultiProps", { enumerable: true, get: function () { return typings_2.ValueComponentMultiProps; } });
Object.defineProperty(exports, "ValueComponentSingleProps", { enumerable: true, get: function () { return typings_2.ValueComponentSingleProps; } });
var value_component_multi_1 = require("./value-component-multi");
Object.defineProperty(exports, "ValueComponentMulti", { enumerable: true, get: function () { return value_component_multi_1.ValueComponentMulti; } });
var value_component_single_1 = require("./value-component-single");
Object.defineProperty(exports, "ValueComponentSingle", { enumerable: true, get: function () { return value_component_single_1.ValueComponentSingle; } });
const Container = styled_components_1.default.div `
    display: flex;
    position: relative;
    cursor: default;
    width: 100%;
    box-sizing: border-box;
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
    opacity: ${(props) => (props.disabled ? 0.75 : 1)};
    user-select: none;
`;
const NativeSelect = styled_components_1.default.select `
    display: block;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    ${(props) => props.native
    ? (0, styled_components_1.css) `
                  z-index: 1;
              `
    : (0, styled_components_1.css) `
                  pointer-events: none;
                  z-index: auto;
              `};
`;
function SelectImpl(props, ref) {
    if (!ref) {
        ref = React.useRef(null);
    }
    const [open, setOpen] = React.useState(false);
    const [blindText, setBlindText] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(undefined);
    const [search, setSearch] = React.useState(props.search);
    const [focused, setFocused] = React.useState(false);
    const blindTextTimeout = React.useRef(0);
    const nativeSelect = React.useRef(null);
    const { className, creatable, clearable, placeholder, value, disabled, error, menuComponent, labelComponent, optionComponent, valueComponentSingle, valueComponentMulti, arrowComponent, clearComponent, hideSelectedOptions, equalCompareProp, equalCompareStrict, multi, native, emptyText, rowHeight, menuWidth, menuHeight, menuPosition, keepSearchOnBlur, required, creatableText } = props;
    const searchable = props.searchable || creatable;
    const document = (0, utils_1.getDocument)();
    const options = getOptions();
    React.useEffect(() => {
        if (blindText) {
            handleBlindTextUpdate();
        }
    }, [blindText]);
    React.useEffect(() => {
        setSearch(props.search);
    }, [props.search]);
    React.useEffect(() => {
        var _a;
        if (search !== undefined) {
            (_a = props.onSearch) === null || _a === void 0 ? void 0 : _a.call(props, search, options);
        }
    }, [search]);
    React.useEffect(() => {
        if (props.control) {
            const ref = { close: () => closeMenu(getValue()), open: openMenu };
            if (props.control instanceof Function) {
                props.control(ref);
            }
            else if (props.control instanceof Object) {
                props.control.current = ref;
            }
        }
    }, [props.control]);
    function getOptions() {
        let newOptions = props.options || [];
        const showCreate = creatable &&
            !newOptions.some((option) => {
                const { value, label } = option;
                return ((typeof value === 'string' && value === search) ||
                    label === search);
            });
        if (search) {
            newOptions = newOptions.filter((option) => {
                const label = (0, utils_1.replaceUmlauts)(option.label).toLowerCase();
                const searchVal = (0, utils_1.replaceUmlauts)(search).toLowerCase();
                if (option.expr) {
                    return option.expr.test(searchVal);
                }
                return label.includes(searchVal);
            });
        }
        if (showCreate && search) {
            const label = creatableText
                ? typeof creatableText === 'string'
                    ? creatableText
                    : creatableText(search)
                : `Create "${search}"`;
            newOptions = [
                {
                    label,
                    value: search,
                    creatable: true
                },
                ...newOptions
            ];
        }
        return newOptions;
    }
    function toggleMenu() {
        const newOpen = !open;
        if (newOpen) {
            openMenu();
        }
        else {
            closeMenu(props.value);
        }
    }
    function openMenu() {
        var _a;
        const selectedIndex = props.hideSelectedOptions
            ? undefined
            : options.findIndex((option) => (0, utils_1.equal)(option.value, props.value, props.equalCompareProp, props.equalCompareStrict));
        const keepSearchOnBlur = props.keepSearchOnBlur && !props.value;
        setOpen(true);
        setSearch(keepSearchOnBlur || props.search ? search : undefined);
        setSelectedIndex(selectedIndex);
        (_a = props.onOpen) === null || _a === void 0 ? void 0 : _a.call(props);
        addDocumentListener();
    }
    function closeMenu(value, callback = () => { }) {
        var _a;
        const keepSearchOnBlur = props.keepSearchOnBlur && !value;
        removeDocumentListener();
        setOpen(false);
        setSearch(keepSearchOnBlur ? search : undefined);
        setSelectedIndex(undefined);
        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
        callback();
    }
    function createOption(value, cb) {
        if (props.onCreate) {
            closeMenu(value, () => {
                var _a;
                (_a = props.onCreate) === null || _a === void 0 ? void 0 : _a.call(props, value);
                cb === null || cb === void 0 ? void 0 : cb();
            });
        }
    }
    function addDocumentListener() {
        removeDocumentListener();
        document === null || document === void 0 ? void 0 : document.addEventListener('click', onDocumentClick);
    }
    function removeDocumentListener() {
        document === null || document === void 0 ? void 0 : document.removeEventListener('click', onDocumentClick);
    }
    function cleanBlindText() {
        blindTextTimeout.current = setTimeout(() => setBlindText(''), 700);
    }
    function findOptionIndex(val) {
        let index = options.findIndex((option) => option.value === val);
        if (index === -1) {
            if (typeof val === 'object') {
                index = options.findIndex((option) => (0, utils_1.equal)(option.value, val, props.equalCompareProp, props.equalCompareStrict));
            }
            if (index === -1) {
                return '';
            }
        }
        return String(index);
    }
    function onChangeNativeSelect(e) {
        const { currentTarget } = e;
        if (props.onChange) {
            if (currentTarget.value === '') {
                onClear();
            }
            else {
                const values = Array.from(currentTarget.selectedOptions).map((htmlOption) => options[htmlOption.index - 1].value);
                if (multi) {
                    props.onChange(values);
                }
                else {
                    props.onChange(values[0]);
                }
            }
        }
    }
    function onSearchFocus() {
        if (!open && !focused && !native) {
            openMenu();
        }
        setFocused(true);
    }
    function onSearchBlur() {
        setFocused(false);
    }
    function onOptionSelect(value, option) {
        const { current } = nativeSelect;
        let optionWasCreated = false;
        const selectOnNative = () => {
            var _a;
            if (current) {
                current.value =
                    (0, utils_1.isArray)(value) && multi
                        ? value.map(findOptionIndex)
                        : findOptionIndex(value);
            }
            setFocused(true);
            if (props.keepMenuOnSelect) {
                (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, value, option);
            }
            else {
                closeMenu(value, () => { var _a; return (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, value, option); });
            }
        };
        if (creatable) {
            const createValue = (val) => {
                const option = options.find((option) => optionIsCreatable(option) && option.value === val);
                if (option) {
                    optionWasCreated = true;
                    createOption(option.value, selectOnNative);
                }
            };
            if ((0, utils_1.isArray)(value) && multi) {
                value.map(createValue);
            }
            else {
                createValue(value);
            }
        }
        if (!optionWasCreated) {
            selectOnNative();
        }
    }
    function onOptionRemove(value) {
        if ((0, utils_1.isArray)(props.value) && props.multi) {
            const values = props.value.filter((val) => !(0, utils_1.equal)(val, value, props.equalCompareProp, props.equalCompareStrict));
            onOptionSelect(values);
        }
    }
    function onClear() {
        onOptionSelect(props.multi ? [] : undefined);
    }
    function onSearch(search) {
        var _a;
        setSearch(search);
        setOpen(true);
        if (options.length === 1 || (props.creatable && search)) {
            setSelectedIndex(0);
        }
        else {
            setSelectedIndex(undefined);
        }
        (_a = props.onSearch) === null || _a === void 0 ? void 0 : _a.call(props, search, options);
    }
    function optionIsCreatable(option) {
        return (creatable && option.creatable && Boolean(props.onCreate && search));
    }
    const onDocumentClick = React.useCallback((e) => {
        var _a;
        const { target } = e;
        if (target.closest('.react-slct-menu')) {
            return;
        }
        if (typeof ref === 'object' && !((_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.contains(target))) {
            closeMenu(props.value);
        }
    }, []);
    function onKeyDown({ keyCode }) {
        switch (keyCode) {
            case utils_1.keys.TAB:
                if (open) {
                    closeMenu(props.value);
                }
                break;
        }
        if (!searchable && !creatable) {
            handleBlindText(keyCode);
        }
    }
    function onKeyUp({ keyCode }) {
        let newSelectedIndex = selectedIndex;
        switch (keyCode) {
            case utils_1.keys.ARROW_UP:
                if (open) {
                    if (newSelectedIndex !== undefined) {
                        newSelectedIndex = newSelectedIndex - 1;
                        if (newSelectedIndex < 0) {
                            newSelectedIndex = options.length - 1;
                        }
                    }
                    setSelectedIndex(newSelectedIndex);
                }
                else {
                    openMenu();
                }
                break;
            case utils_1.keys.ARROW_DOWN:
                if (open) {
                    if (newSelectedIndex === undefined ||
                        newSelectedIndex === options.length - 1) {
                        newSelectedIndex = 0;
                    }
                    else {
                        newSelectedIndex = newSelectedIndex + 1;
                    }
                    setSelectedIndex(newSelectedIndex);
                }
                else {
                    openMenu();
                }
                break;
            case utils_1.keys.ENTER:
                if (selectedIndex === 0 && optionIsCreatable(options[0])) {
                    createOption(search);
                }
                else if (newSelectedIndex !== undefined &&
                    options[newSelectedIndex]) {
                    const option = options[newSelectedIndex];
                    const newValue = option.value;
                    onOptionSelect((0, utils_1.isArray)(value) && multi
                        ? [...value, newValue]
                        : newValue, option);
                }
                break;
            case utils_1.keys.ESC:
                if (open) {
                    closeMenu(value);
                }
                break;
        }
    }
    function handleBlindText(keyCode) {
        if (keyCode === utils_1.keys.BACKSPACE && blindText.length) {
            clearTimeout(blindTextTimeout.current);
            setBlindText(blindText.slice(0, blindText.length - 1));
            cleanBlindText();
        }
        else if (keyCode === utils_1.keys.SPACE) {
            clearTimeout(blindTextTimeout.current);
            setBlindText(blindText + ' ');
            cleanBlindText();
        }
        else {
            const key = String.fromCodePoint(keyCode);
            if (/\w/.test(key)) {
                clearTimeout(blindTextTimeout.current);
                setBlindText(blindText + key);
                cleanBlindText();
            }
        }
    }
    function handleBlindTextUpdate() {
        if (open) {
            const newSelectedIndex = options.findIndex((option) => option.label.toLowerCase().startsWith(blindText.toLowerCase()));
            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex);
            }
        }
        else if (!multi) {
            if (blindText) {
                const option = options.find((option) => option.label
                    .toLowerCase()
                    .startsWith(blindText.toLowerCase()));
                if (option) {
                    onOptionSelect(option.value, option);
                }
            }
            else {
                onOptionSelect(undefined);
            }
        }
    }
    function getValue() {
        const valueOptions = (0, utils_1.getValueOptions)(props.options || [], props.value, props.multi, props.equalCompareProp, props.equalCompareStrict);
        return !multi
            ? props.value
            : valueOptions.map((option) => option.value);
    }
    function renderChildren() {
        const value = getValue();
        const showPlaceholder = !search &&
            ((0, utils_1.isArray)(value) && multi
                ? value.length === 0
                : value === undefined || value === null);
        if (!props.children) {
            return null;
        }
        return props.children({
            options,
            open,
            value,
            MenuContainer: menu_container_1.MenuContainer,
            placeholder: showPlaceholder ? placeholder : undefined,
            onToggle: toggleMenu,
            onClose: () => closeMenu(value),
            onOpen: openMenu,
            onRef: ref
        });
    }
    function renderNativeSelect() {
        const dataRole = props['data-role']
            ? `select-${props['data-role']}`
            : undefined;
        const clearable = props.clearable && native;
        const value = (0, utils_1.isArray)(props.value) && multi
            ? props.value.map(findOptionIndex)
            : findOptionIndex(props.value || '');
        const propDisabled = disabled ? disabled : required ? false : !native;
        return (React.createElement(NativeSelect, { ref: nativeSelect, multiple: multi, value: value, disabled: propDisabled, required: required, native: native ? 'true' : undefined, tabIndex: -1, "data-role": dataRole, onChange: onChangeNativeSelect },
            React.createElement("option", { value: "", disabled: !clearable }, placeholder),
            options.map((option, i) => (React.createElement("option", { key: (0, utils_1.toKey)(option.value, props.equalCompareProp), value: `${i}`, disabled: option.disabled }, option.label)))));
    }
    if (props.children) {
        return renderChildren();
    }
    const classNames = [
        'react-slct',
        className,
        open && 'open',
        error && 'has-error'
    ].filter((c) => Boolean(c));
    return (React.createElement(styled_components_1.StyleSheetManager, { shouldForwardProp: () => true },
        React.createElement(Container, { className: classNames.join(' '), disabled: disabled, ref: ref, "data-role": props['data-role'], onKeyUp: onKeyUp, onKeyDown: onKeyDown },
            renderNativeSelect(),
            React.createElement(value_1.Value, { clearable: clearable, searchable: searchable, open: open, disabled: disabled, multi: multi, mobile: native, focused: focused, options: props.options, placeholder: placeholder, error: error, value: value, search: search, keepSearchOnBlur: keepSearchOnBlur, equalCompareProp: equalCompareProp, equalCompareStrict: equalCompareStrict, labelComponent: labelComponent, valueComponentSingle: valueComponentSingle, valueComponentMulti: valueComponentMulti, arrowComponent: arrowComponent, clearComponent: clearComponent, valueIconComponent: props.valueIconComponent, onClear: onClear, onClick: toggleMenu, onSearch: onSearch, onSearchFocus: onSearchFocus, onSearchBlur: onSearchBlur, onOptionRemove: onOptionRemove }),
            React.createElement(menu_1.Menu, { open: open, options: options, value: value, multi: multi, error: error, search: search, selectedIndex: selectedIndex, menuComponent: menuComponent, labelComponent: labelComponent, optionComponent: optionComponent, hideSelectedOptions: hideSelectedOptions, equalCompareProp: equalCompareProp, equalCompareStrict: equalCompareStrict, emptyText: emptyText, rowHeight: rowHeight, menuWidth: menuWidth, menuHeight: menuHeight, menuPosition: menuPosition, onSelect: onOptionSelect }))));
}
exports.Select = React.forwardRef(SelectImpl);
//# sourceMappingURL=index.js.map
});
___scope___.file("menu.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const React = require("react");
const react_1 = require("react");
const react_window_1 = require("react-window");
const styled_components_1 = require("styled-components");
const config_1 = require("./config");
const label_1 = require("./label");
const menu_container_1 = require("./menu-container");
const menu_row_1 = require("./menu-row");
const option_1 = require("./option");
const utils_1 = require("./utils");
const EmptyOptionItem = (0, styled_components_1.default)(option_1.OptionComponent.OptionItem) `
    height: 100%;
    border: 1px solid ${() => config_1.ReactSlctColors.border};
`;
const Empty = (props) => (React.createElement(EmptyOptionItem, null,
    React.createElement(label_1.SelectLabel, null,
        React.createElement("i", null, props.emptyText || 'No results'))));
function Menu(props) {
    const { rowHeight = 32, selectedIndex, open, error, menuWidth, menuHeight, menuPosition, multi, hideSelectedOptions } = props;
    const currentValue = (0, utils_1.isArray)(props.value) && multi ? props.value : [props.value];
    const options = React.useMemo(() => (props.options || []).filter((option) => {
        if (hideSelectedOptions) {
            const selected = currentValue.some((val) => (0, utils_1.equal)(val, option.value, props.equalCompareProp, props.equalCompareStrict));
            if (selected) {
                return false;
            }
        }
        return true;
    }), [
        props.options,
        props.equalCompareProp,
        hideSelectedOptions,
        currentValue
    ]);
    const [rect, setRect] = (0, react_1.useState)();
    const [style, setStyle] = (0, react_1.useState)();
    const list = (0, react_1.useRef)(null);
    const width = menuWidth || (rect && rect.width !== 'auto' ? rect.width : 0);
    const assumedHeight = Math.min(Math.max(options.length * rowHeight, rowHeight) + 2, menuHeight || 185);
    const actualHeight = ((style === null || style === void 0 ? void 0 : style.height) !== 'auto' && (style === null || style === void 0 ? void 0 : style.height)) || assumedHeight;
    (0, react_1.useEffect)(() => {
        if (open &&
            list.current &&
            selectedIndex !== undefined &&
            selectedIndex !== -1) {
            list.current.scrollToItem(selectedIndex, 'center');
        }
    }, [open, selectedIndex]);
    const itemData = React.useMemo(() => {
        return Object.assign(Object.assign({}, props), { options, onSelect: (value, option) => {
                if ((0, utils_1.isArray)(props.value) && props.multi) {
                    const found = props.value.some((item) => (0, utils_1.equal)(item, value, props.equalCompareProp, props.equalCompareStrict));
                    const values = found
                        ? props.value.filter((item) => !(0, utils_1.equal)(item, value, props.equalCompareProp, props.equalCompareStrict))
                        : Array.from(new Set([...props.value, value]));
                    props.onSelect(values, option);
                }
                else {
                    props.onSelect(value, option);
                }
            } });
    }, [
        options.length,
        props.search,
        props.rowHeight,
        props.selectedIndex,
        props.labelComponent,
        props.optionComponent,
        props.value
    ]);
    function renderList() {
        const MenuContent = props.menuComponent;
        const itemCount = options.length;
        if (MenuContent) {
            return React.createElement(MenuContent, Object.assign({}, props));
        }
        if (itemCount === 0) {
            return React.createElement(Empty, { emptyText: props.emptyText });
        }
        return (React.createElement(react_window_1.FixedSizeList, { className: "react-slct-menu-list", ref: list, width: "100%", height: actualHeight, itemSize: rowHeight, itemCount: itemCount, itemData: itemData }, menu_row_1.MenuRow));
    }
    return open ? (React.createElement(menu_container_1.MenuContainer, { error: error, menuWidth: width, menuHeight: assumedHeight, menuPosition: menuPosition, onRect: setRect, onStyle: setStyle }, renderList())) : null;
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map
});
___scope___.file("config.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactSlctColors = void 0;
exports.ReactSlctColors = {
    error: '#ff5c5c',
    border: '#ccc'
};
//# sourceMappingURL=react-slct.js.map?tm=1658140418709
});
___scope___.file("label.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectLabel = void 0;
const styled_components_1 = require("styled-components");
exports.SelectLabel = styled_components_1.default.span `
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
    box-sizing: border-box;
`;
//# sourceMappingURL=label.js.map
});
___scope___.file("menu-container.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuContainer = void 0;
const React = require("react");
const react_dom_1 = require("react-dom");
const styled_components_1 = require("styled-components");
const config_1 = require("./config");
const utils_1 = require("./utils");
function getMenuPosition({ rect, menuHeight = 186 }) {
    if (!rect) {
        return 'bottom';
    }
    const { height } = rect;
    if (height === 'auto' || menuHeight === 'auto') {
        return 'bottom';
    }
    if (rect.top + height + menuHeight <= (0, utils_1.getWindowInnerHeight)() ||
        rect.top < menuHeight / 2) {
        return 'bottom';
    }
    return 'top';
}
function getContainerTop(props) {
    var _a;
    const { rect } = props;
    const window = (0, utils_1.getWindow)();
    if (!rect) {
        return 0;
    }
    const menuHeight = (props.menuHeight !== 'auto' && props.menuHeight) || 186;
    const height = rect.height === 'auto' ? 32 : rect.height;
    const scrollY = (_a = window === null || window === void 0 ? void 0 : window.scrollY) !== null && _a !== void 0 ? _a : 0;
    const menuPosition = props.menuPosition || getMenuPosition(props);
    switch (menuPosition) {
        case 'top':
            return rect.top - menuHeight + 1 + scrollY;
        case 'bottom':
            return rect.top + height - 1 + scrollY;
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
// position this container fixed is not working well on mobile-devices
// @see https://medium.com/@im_rahul/safari-and-position-fixed-978122be5f29
const MenuWrapper = styled_components_1.default.div `
    position: absolute;
    z-index: 9999;
    background: #fff;
    box-sizing: border-box;
    box-shadow: ${(props) => getMenuPosition(props) === 'bottom'
    ? '0 2px 5px rgba(0, 0, 0, 0.1)'
    : '0 -2px 5px rgba(0, 0, 0, 0.1)'};

    .react-slct-menu-list {
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: ${(props) => props.error ? config_1.ReactSlctColors.error : config_1.ReactSlctColors.border};
        background-color: #fff;

        &:focus {
            outline: none;
        }
    }
`;
function MenuContainer(props) {
    const { error, onClick, children } = props;
    const className = ['react-slct-menu', props.className]
        .filter((c) => c)
        .join(' ');
    const document = (0, utils_1.getDocument)();
    const window = (0, utils_1.getWindow)();
    const menuOverlay = React.useRef(null);
    const menuWrapper = React.useRef(null);
    const [menuOverlayRect, setMenuOverlayRect] = React.useState();
    const [menuWrapperRect, setMenuWrapperRect] = React.useState();
    const style = React.useMemo(() => {
        var _a;
        const { menuLeft, menuTop, menuWidth, menuHeight } = props;
        let width = menuWidth && menuWidth !== 'auto'
            ? menuWidth
            : (menuOverlayRect === null || menuOverlayRect === void 0 ? void 0 : menuOverlayRect.width) || 'auto';
        let height = menuHeight && menuHeight !== 'auto'
            ? menuHeight
            : (menuWrapperRect === null || menuWrapperRect === void 0 ? void 0 : menuWrapperRect.height) || 'auto';
        let top = menuTop !== null && menuTop !== void 0 ? menuTop : getContainerTop({
            rect: menuOverlayRect,
            menuHeight: height,
            menuPosition: props.menuPosition
        });
        let left = (_a = menuLeft !== null && menuLeft !== void 0 ? menuLeft : menuOverlayRect === null || menuOverlayRect === void 0 ? void 0 : menuOverlayRect.left) !== null && _a !== void 0 ? _a : 0;
        if (window) {
            const numWidth = Number(width);
            if (numWidth > window.innerWidth) {
                width = window.innerWidth - 20;
            }
            if (left + numWidth > window.innerWidth) {
                left = Math.max(10, window.innerWidth - numWidth - 20);
            }
        }
        if (top < 0) {
            if (height !== 'auto') {
                height += top;
                top = 0;
            }
        }
        const visibility = top === 0 && left === 0 ? 'hidden' : undefined;
        return { top, left, width, height, visibility };
    }, [
        props.menuLeft,
        props.menuTop,
        props.menuWidth,
        props.menuHeight,
        menuOverlayRect,
        menuWrapperRect
    ]);
    function calcMenuOverlay() {
        if (menuOverlay.current) {
            const clientRect = menuOverlay.current.getBoundingClientRect();
            setMenuOverlayRect({
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            });
        }
    }
    function calcMenuWrapper() {
        if (menuWrapper.current) {
            const clientRect = menuWrapper.current.getBoundingClientRect();
            setMenuWrapperRect({
                left: Math.round(clientRect.left),
                top: Math.round(clientRect.top),
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            });
        }
    }
    React.useEffect(calcMenuOverlay, [menuOverlay.current]);
    React.useEffect(() => {
        var _a;
        calcMenuWrapper();
        if (menuWrapper.current) {
            (_a = props.onRef) === null || _a === void 0 ? void 0 : _a.call(props, menuWrapper.current);
        }
    }, [menuWrapper.current]);
    React.useEffect(() => {
        var _a;
        (_a = props.onRect) === null || _a === void 0 ? void 0 : _a.call(props, menuOverlayRect, menuWrapperRect);
    }, [menuOverlayRect, menuWrapperRect]);
    React.useEffect(() => {
        window === null || window === void 0 ? void 0 : window.addEventListener('scroll', onViewportChange, true);
        window === null || window === void 0 ? void 0 : window.addEventListener('resize', onViewportChange, true);
        function allowRectChange(e) {
            if (e.target.closest && !e.target.closest('.react-slct-menu')) {
                return false;
            }
            return true;
        }
        function onViewportChange(e) {
            if (allowRectChange(e)) {
                calcMenuOverlay();
                calcMenuWrapper();
            }
        }
        return () => {
            window === null || window === void 0 ? void 0 : window.removeEventListener('resize', onViewportChange, true);
            window === null || window === void 0 ? void 0 : window.removeEventListener('scroll', onViewportChange, true);
        };
    }, []);
    React.useEffect(() => {
        var _a;
        if (style) {
            (_a = props.onStyle) === null || _a === void 0 ? void 0 : _a.call(props, style);
        }
    }, [style]);
    return (React.createElement(MenuOverlay, { ref: menuOverlay }, document && style
        ? (0, react_dom_1.createPortal)(React.createElement(MenuWrapper, { "data-role": "menu", className: className, error: error, ref: menuWrapper, onClick: onClick, rect: menuOverlayRect, style: style }, children), document.body)
        : null));
}
exports.MenuContainer = MenuContainer;
//# sourceMappingURL=menu-container.js.map
});
___scope___.file("utils.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = exports.getWindowInnerHeight = exports.getWindow = exports.getDocument = exports.isArray = exports.getValueOptions = exports.replaceUmlauts = exports.equal = exports.toKey = void 0;
function toKey(value, equalCompareProp = 'id') {
    if (typeof value === 'string') {
        return value;
    }
    if (value && typeof value === 'object') {
        const jsonObject = value.toJSON ? value.toJSON() : value;
        if (equalCompareProp && jsonObject[equalCompareProp]) {
            return jsonObject[equalCompareProp];
        }
        return JSON.stringify(jsonObject);
    }
    return JSON.stringify(value);
}
exports.toKey = toKey;
function equal(valueA, valueB, equalCompareProp = 'id', strict = false) {
    if (valueA === valueB) {
        return true;
    }
    if (!valueA || !valueB) {
        return false;
    }
    if (typeof valueA === 'object' && typeof valueB === 'object') {
        if (equalCompareProp &&
            valueA[equalCompareProp] !== undefined &&
            valueA[equalCompareProp] !== null &&
            valueB[equalCompareProp] !== undefined &&
            valueB[equalCompareProp] !== null &&
            valueA[equalCompareProp] === valueB[equalCompareProp]) {
            return true;
        }
        if (strict) {
            return false;
        }
        if (valueA.toJSON && valueB.toJSON) {
            return (JSON.stringify(valueA.toJSON()) ===
                JSON.stringify(valueB.toJSON()));
        }
        return JSON.stringify(valueA) === JSON.stringify(valueB);
    }
    return false;
}
exports.equal = equal;
function replaceUmlauts(str) {
    return str
        .replace('Ü', 'u')
        .replace('Ö', 'o')
        .replace('Ä', 'a')
        .replace('ü', 'u')
        .replace('ä', 'a')
        .replace('ö', 'o');
}
exports.replaceUmlauts = replaceUmlauts;
function getValueOptions(options, value, multi, equalCompareProp, strict = false) {
    return options
        .slice()
        .filter((option) => {
        if (isArray(value) && multi) {
            return value.some((val) => equal(option.value, val, equalCompareProp, strict));
        }
        else {
            return equal(option.value, value, equalCompareProp, strict);
        }
    })
        .sort((optionA, optionB) => {
        if (isArray(value) && multi) {
            const a = value.findIndex((val) => equal(optionA.value, val, equalCompareProp, strict));
            const b = value.findIndex((val) => equal(optionB.value, val, equalCompareProp, strict));
            return a < b ? -1 : a > b ? 1 : 0;
        }
        else {
            return 0;
        }
    });
}
exports.getValueOptions = getValueOptions;
function isArray(val) {
    if (Array.isArray(val)) {
        return true;
    }
    // this is just a workaround for potential observable arrays
    if (val && val.map) {
        return true;
    }
    return false;
}
exports.isArray = isArray;
function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return undefined;
}
exports.getDocument = getDocument;
function getWindow() {
    if (typeof window !== 'undefined') {
        return window;
    }
    return undefined;
}
exports.getWindow = getWindow;
function getWindowInnerHeight(defaultHeight = 700) {
    var _a, _b;
    const window = getWindow();
    if (window) {
        return (_b = (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : window.innerHeight;
    }
    return defaultHeight;
}
exports.getWindowInnerHeight = getWindowInnerHeight;
exports.keys = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    BACKSPACE: 8,
    SPACE: 32
};
//# sourceMappingURL=react-slct.js.map?tm=1702219230085
});
___scope___.file("menu-row.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuRow = void 0;
const React = require("react");
const react_1 = require("react");
const react_window_1 = require("react-window");
const option_1 = require("./option");
const utils_1 = require("./utils");
exports.MenuRow = (0, react_1.memo)(({ index, style, data }) => {
    const { options = [], labelComponent, selectedIndex, optionComponent, rowHeight, search, equalCompareProp, equalCompareStrict, multi, onSelect } = data;
    const option = options[index];
    const currentValue = (0, utils_1.isArray)(data.value) && multi ? data.value : [data.value];
    const Component = optionComponent || option_1.OptionComponent;
    return (React.createElement("div", { style: style },
        React.createElement(Component, { option: option, labelComponent: labelComponent, height: rowHeight, active: currentValue.some((val) => (0, utils_1.equal)(val, option.value, equalCompareProp, equalCompareStrict)), selected: selectedIndex === index, search: search, onSelect: onSelect })));
}, react_window_1.areEqual);
//# sourceMappingURL=menu-row.js.map
});
___scope___.file("option.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionComponent = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
class OptionComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onClick = () => {
            this.props.onSelect(this.props.option.value, this.props.option);
        };
    }
    render() {
        const { OptionItem } = OptionComponent;
        const { active, selected, labelComponent, option, height } = this.props;
        const Label = (labelComponent ? labelComponent : label_1.SelectLabel);
        const className = [
            'option',
            this.props.className,
            selected ? 'selected' : null,
            active ? 'active' : null
        ].filter((v) => Boolean(v));
        return (React.createElement(OptionItem, { "data-role": "option", className: className.join(' '), selected: selected, active: active, height: height, onClick: this.onClick },
            React.createElement(Label, Object.assign({ type: "option", active: active }, option), option.label)));
    }
}
exports.OptionComponent = OptionComponent;
OptionComponent.OptionItem = styled_components_1.default.div `
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        height: ${(props) => props.height || 32}px;
        padding: 0 10px;
        min-width: 0;
        cursor: pointer;
        box-sizing: border-box;
        background-color: ${(props) => props.active ? '#ddd' : props.selected ? '#eee' : '#fff'};

        &:hover {
            background-color: ${(props) => props.active ? '#ddd' : '#eee'};
        }
    `;
//# sourceMappingURL=option.js.map
});
___scope___.file("typings.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=react-slct.js.map?tm=1699026179729
});
___scope___.file("value.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const config_1 = require("./config");
const label_1 = require("./label");
const utils_1 = require("./utils");
const value_component_multi_1 = require("./value-component-multi");
const value_component_single_1 = require("./value-component-single");
const Button = styled_components_1.default.button `
    background: transparent;
    border: none;
    margin: 0;
    font-size: 20px;
    padding: 0;
    line-height: 1;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`;
const ArrowButton = (0, styled_components_1.default)(Button) `
    font-size: 12px;
    color: ${() => config_1.ReactSlctColors.border};
    transform: translateY(2px);

    &:hover {
        color: #333;
    }
`;
const ValueContainer = styled_components_1.default.div `
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    min-height: 32px;
    pointer-events: ${(props) => props.mobile || props.disabled ? 'none' : 'auto'};
    padding: 5px 10px;
    background: #fff;
    cursor: default;
    border-width: 1px;
    border-style: solid;
    border-color: ${(props) => props.error ? config_1.ReactSlctColors.error : config_1.ReactSlctColors.border};
    z-index: 0;
    box-sizing: border-box;
    max-width: 100%;
    box-shadow: ${(props) => props.focused ? 'rgba(0, 0, 0, 0.15) 0 0 2px' : 'none'};
`;
const ValueLeft = styled_components_1.default.div `
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: ${(props) => props.multi && props.hasValue ? 'wrap' : 'nowrap'};
    user-select: none;
    min-width: 0;
    box-sizing: border-box;
    margin: ${(props) => props.multi && props.hasValue ? '-2px -5px' : 0};
`;
const ValueRight = styled_components_1.default.div `
    display: flex;
    align-items: center;
    margin-left: 4px;
    box-sizing: border-box;
`;
const Placeholder = (0, styled_components_1.default)(label_1.SelectLabel) `
    color: #aaa;
`;
const ClearButton = (0, styled_components_1.default)(Button) `
    margin-right: 6px;
`;
const ClearContainer = styled_components_1.default.span `
    color: ${() => config_1.ReactSlctColors.border};

    &:hover {
        color: #333;
    }
`;
const ClearX = () => React.createElement(ClearContainer, null, "\u00D7");
const Search = styled_components_1.default.span `
    min-width: 1px;
    margin-left: -1px;
    user-select: text;

    ${(props) => props.cansearch
    ? (0, styled_components_1.css) `
                  opacity: 1;
                  position: relative;
                  left: 1px;
              `
    : (0, styled_components_1.css) `
                  position: absolute;
                  opacity: 0;
              `}

    &:focus {
        outline: none;
    }
`;
class Value extends React.PureComponent {
    constructor(props) {
        super(props);
        this.blur = () => {
            if (this.search.current) {
                this.search.current.blur();
            }
        };
        this.onClick = () => {
            if (!this.props.disabled) {
                this.focus();
                this.props.onClick();
            }
        };
        this.onClear = (e) => {
            e.stopPropagation();
            this.props.onClear();
        };
        this.onSearch = (e) => {
            if (this.props.searchable) {
                this.props.onSearch(e.currentTarget.innerText.trim());
            }
            else {
                e.preventDefault();
            }
        };
        this.onKeyDown = (e) => {
            const { searchable } = this.props;
            if (e.metaKey) {
                return;
            }
            if ((!searchable && e.keyCode !== utils_1.keys.TAB) ||
                e.keyCode === utils_1.keys.ENTER ||
                e.keyCode === utils_1.keys.ARROW_UP ||
                e.keyCode === utils_1.keys.ARROW_DOWN) {
                e.preventDefault();
            }
        };
        this.search = React.createRef();
        const window = (0, utils_1.getWindow)();
        if (window) {
            window.addEventListener('blur', this.blur);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.search && !this.props.search && this.search.current) {
            this.search.current.innerText = '';
        }
        if (prevProps.focused !== this.props.focused && this.props.focused) {
            this.focus();
        }
    }
    render() {
        const { options = [], value, disabled, clearable, open, mobile, multi, focused, equalCompareProp, equalCompareStrict, error } = this.props;
        const ArrowComponent = this.props.arrowComponent;
        const ClearComponent = this.props.clearComponent || ClearX;
        const ValueIconComponent = this.props.valueIconComponent;
        const valueOptions = (0, utils_1.getValueOptions)(options, value, multi, equalCompareProp, equalCompareStrict);
        const showClearer = Boolean(clearable && valueOptions.length && !mobile);
        const searchAtStart = !multi || valueOptions.length === 0;
        const searchAtEnd = multi && valueOptions.length > 0;
        return (React.createElement(ValueContainer, { "data-role": "value", className: "react-slct-value", disabled: disabled, mobile: mobile ? 'true' : undefined, focused: focused ? 'true' : undefined, error: error ? 'true' : undefined, onClick: this.onClick },
            React.createElement(ValueLeft, { className: "value-left", multi: multi ? 'true' : undefined, hasValue: !!valueOptions.length ? 'true' : undefined },
                ValueIconComponent && React.createElement(ValueIconComponent, null),
                searchAtStart && this.renderSearch(),
                this.renderValues(valueOptions),
                searchAtEnd && this.renderSearch()),
            React.createElement(ValueRight, { className: "value-right" },
                showClearer && (React.createElement(ClearButton, { type: "button", tabIndex: -1, className: "clearer", onClick: this.onClear },
                    React.createElement(ClearComponent, null))),
                ArrowComponent ? (React.createElement(ArrowComponent, { open: open })) : (React.createElement(ArrowButton, { type: "button", className: "arrow", tabIndex: -1 }, open ? '▲' : '▼')))));
    }
    renderSearch() {
        const { open, value, disabled, searchable, search, keepSearchOnBlur, onSearchFocus, onSearchBlur } = this.props;
        const canSearch = (open && searchable) ||
            (keepSearchOnBlur && !value && searchable) ||
            Boolean(search);
        if (disabled && !keepSearchOnBlur) {
            return null;
        }
        return (React.createElement(Search, { className: "search", contentEditable: true, cansearch: canSearch ? 'true' : undefined, onInput: this.onSearch, onKeyDown: this.onKeyDown, onFocus: onSearchFocus, onBlur: onSearchBlur, ref: this.search }));
    }
    renderValues(valueOptions) {
        const { placeholder, search, labelComponent, valueComponentSingle, valueComponentMulti, multi, open } = this.props;
        if (search && open && !multi) {
            return null;
        }
        if (valueOptions.length === 0 && !search) {
            return React.createElement(Placeholder, null, placeholder);
        }
        const Single = valueComponentSingle || value_component_single_1.ValueComponentSingle;
        const Multi = (valueComponentMulti || value_component_multi_1.ValueComponentMulti);
        return valueOptions.map((option) => multi ? (React.createElement(Multi, { key: (0, utils_1.toKey)(option.value, this.props.equalCompareProp), option: option, labelComponent: labelComponent, options: valueOptions, onRemove: this.props.onOptionRemove })) : (React.createElement(Single, { key: (0, utils_1.toKey)(option.value, this.props.equalCompareProp), option: option, labelComponent: labelComponent })));
    }
    focus() {
        const el = this.search.current;
        if (el) {
            el.focus();
            if (typeof window.getSelection != 'undefined' &&
                typeof document.createRange != 'undefined') {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(el);
                range.collapse(false);
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    }
}
exports.Value = Value;
//# sourceMappingURL=value.js.map
});
___scope___.file("value-component-multi.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueComponentMulti = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const label_1 = require("./label");
class Remove extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.onClick = (e) => {
            e.stopPropagation();
            this.props.onClick(this.props.value);
        };
    }
    render() {
        const { StyledRemove } = Remove;
        return (React.createElement(StyledRemove, { className: "remove", type: "button", tabIndex: -1, onClick: this.onClick }, "\u00D7"));
    }
}
Remove.StyledRemove = styled_components_1.default.button `
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
class ValueComponentMulti extends React.PureComponent {
    render() {
        const { TagContainer } = ValueComponentMulti;
        const { option, labelComponent, onRemove } = this.props;
        const Label = (labelComponent || label_1.SelectLabel);
        const className = ['value-multi', this.props.className]
            .filter((c) => Boolean(c))
            .join(' ');
        return (React.createElement(TagContainer, { className: className },
            React.createElement(Remove, { value: option.value, onClick: onRemove }, "\u00D7"),
            React.createElement(Label, Object.assign({ type: "value-multi", active: true }, option), option.label)));
    }
}
exports.ValueComponentMulti = ValueComponentMulti;
ValueComponentMulti.TagContainer = styled_components_1.default.div `
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

        &:last-of-type {
            margin-right: 5px;
        }
    `;
//# sourceMappingURL=value-component-multi.js.map
});
___scope___.file("value-component-single.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueComponentSingle = void 0;
const React = require("react");
const label_1 = require("./label");
exports.ValueComponentSingle = React.memo((props) => {
    const Label = props.labelComponent || label_1.SelectLabel;
    const className = ['value-single', props.className]
        .filter(c => Boolean(c))
        .join(' ');
    return (React.createElement(Label, Object.assign({ active: true, type: "value-single", className: className }, props.option), props.option.label));
});
//# sourceMappingURL=value-component-single.js.map
});
return ___scope___.entry = "index.jsx";
});

FuseBox.import("default/index.jsx");
FuseBox.main("default/index.jsx");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))
//# sourceMappingURL=react-slct.js.map?tm=1702334077308