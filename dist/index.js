"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = exports.keys = exports.Menu = exports.ValueComponentSingle = exports.ValueComponentMulti = exports.OptionComponent = void 0;
const tslib_1 = require("tslib");
const React = require("react");
const styled_components_1 = require("styled-components");
const menu_1 = require("./menu");
Object.defineProperty(exports, "Menu", { enumerable: true, get: function () { return menu_1.Menu; } });
const menu_container_1 = require("./menu-container");
const utils_1 = require("./utils");
Object.defineProperty(exports, "keys", { enumerable: true, get: function () { return utils_1.keys; } });
const value_1 = require("./value");
var option_1 = require("./option");
Object.defineProperty(exports, "OptionComponent", { enumerable: true, get: function () { return option_1.OptionComponent; } });
var value_component_multi_1 = require("./value-component-multi");
Object.defineProperty(exports, "ValueComponentMulti", { enumerable: true, get: function () { return value_component_multi_1.ValueComponentMulti; } });
var value_component_single_1 = require("./value-component-single");
Object.defineProperty(exports, "ValueComponentSingle", { enumerable: true, get: function () { return value_component_single_1.ValueComponentSingle; } });
tslib_1.__exportStar(require("./config"), exports);
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
    const { className, creatable, clearable, placeholder, value, disabled, error, menuComponent, labelComponent, optionComponent, valueComponentSingle, valueComponentMulti, arrowComponent, clearComponent, hideSelectedOptions, equalCompareProp, multi, native, emptyText, rowHeight, menuWidth, menuHeight, menuPosition, keepSearchOnBlur, required, creatableText } = props;
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
            newOptions = newOptions.filter((option) => (0, utils_1.replaceUmlauts)(option.label)
                .toLowerCase()
                .includes((0, utils_1.replaceUmlauts)(search).toLowerCase()));
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
            : options.findIndex((option) => (0, utils_1.equal)(option.value, props.value, props.equalCompareProp));
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
                index = options.findIndex((option) => (0, utils_1.equal)(option.value, val, props.equalCompareProp));
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
            const values = props.value.filter((val) => !(0, utils_1.equal)(val, value, props.equalCompareProp));
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
        (_a = props.onSearch) === null || _a === void 0 ? void 0 : _a.call(props, search);
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
        const valueOptions = (0, utils_1.getValueOptions)(props.options || [], props.value, props.multi, props.equalCompareProp);
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
        return (React.createElement(NativeSelect, { ref: nativeSelect, multiple: multi, value: value, disabled: propDisabled, required: required, native: native, tabIndex: -1, "data-role": dataRole, onChange: onChangeNativeSelect },
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
    return (React.createElement(Container, { className: classNames.join(' '), disabled: disabled, ref: ref, "data-role": props['data-role'], onKeyUp: onKeyUp, onKeyDown: onKeyDown },
        renderNativeSelect(),
        React.createElement(value_1.Value, { clearable: clearable, searchable: searchable, open: open, disabled: disabled, multi: multi, mobile: native, focused: focused, options: props.options, placeholder: placeholder, error: error, value: value, search: search, keepSearchOnBlur: keepSearchOnBlur, equalCompareProp: equalCompareProp, labelComponent: labelComponent, valueComponentSingle: valueComponentSingle, valueComponentMulti: valueComponentMulti, arrowComponent: arrowComponent, clearComponent: clearComponent, valueIconComponent: props.valueIconComponent, onClear: onClear, onClick: toggleMenu, onSearch: onSearch, onSearchFocus: onSearchFocus, onSearchBlur: onSearchBlur, onOptionRemove: onOptionRemove }),
        React.createElement(menu_1.Menu, { open: open, options: options, value: value, multi: multi, error: error, search: search, selectedIndex: selectedIndex, menuComponent: menuComponent, labelComponent: labelComponent, optionComponent: optionComponent, hideSelectedOptions: hideSelectedOptions, equalCompareProp: equalCompareProp, emptyText: emptyText, rowHeight: rowHeight, menuWidth: menuWidth, menuHeight: menuHeight, menuPosition: menuPosition, onSelect: onOptionSelect })));
}
exports.Select = React.forwardRef(SelectImpl);
//# sourceMappingURL=index.js.map