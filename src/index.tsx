import * as React from 'react';
import styled, { css } from 'styled-components';
import { Menu } from './menu';
import { MenuContainer } from './menu-container';
import {
    LabelComponentProps,
    MenuComponentProps,
    Option,
    SelectProps
} from './typings';
import {
    equal,
    getDocument,
    getValueOptions,
    isArray,
    keys,
    replaceUmlauts,
    toKey
} from './utils';
import { Value } from './value';
export { OptionComponent } from './option';
export {
    OptionComponentProps,
    ValueComponentMultiProps,
    ValueComponentSingleProps,
    SelectStaticControl
} from './typings';
export { ValueComponentMulti } from './value-component-multi';
export { ValueComponentSingle } from './value-component-single';
export * from './config';
export {
    SelectProps,
    Menu,
    MenuComponentProps,
    LabelComponentProps,
    Option,
    keys
};

const Container = styled.div<{ disabled?: boolean }>`
    display: flex;
    position: relative;
    cursor: default;
    width: 100%;
    box-sizing: border-box;
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
    opacity: ${(props) => (props.disabled ? 0.75 : 1)};
    user-select: none;
`;

const NativeSelect = styled.select<{ native?: boolean }>`
    display: block;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    ${(props) =>
        props.native
            ? css`
                  z-index: 1;
              `
            : css`
                  pointer-events: none;
                  z-index: auto;
              `};
`;

function SelectImpl<T = any>(
    props: SelectProps<T>,
    ref: React.Ref<HTMLDivElement> | null
): JSX.Element | null {
    if (!ref) {
        ref = React.useRef<HTMLDivElement>(null);
    }

    const [open, setOpen] = React.useState(false);
    const [blindText, setBlindText] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState<
        number | undefined
    >(undefined);
    const [search, setSearch] = React.useState<string | undefined>(undefined);
    const [focused, setFocused] = React.useState(false);
    const blindTextTimeout = React.useRef(0);
    const nativeSelect = React.useRef<HTMLSelectElement>(null);

    const {
        className,
        creatable,
        clearable,
        placeholder,
        value,
        disabled,
        error,
        menuComponent,
        labelComponent,
        optionComponent,
        valueComponentSingle,
        valueComponentMulti,
        arrowComponent,
        clearComponent,
        hideSelectedOptions,
        equalCompareProp,
        multi,
        native,
        emptyText,
        rowHeight,
        menuWidth,
        menuHeight,
        menuPosition,
        keepSearchOnBlur,
        required,
        creatableText
    } = props;
    const searchable = props.searchable || creatable;
    const document = getDocument();
    const options = getOptions();

    React.useEffect(() => {
        if (blindText) {
            handleBlindTextUpdate();
        }
    }, [blindText]);

    React.useEffect(() => {
        if (props.control) {
            const ref = { close: () => closeMenu(getValue()), open: openMenu };

            if (props.control instanceof Function) {
                props.control(ref);
            } else if (props.control instanceof Object) {
                props.control.current = ref;
            }
        }
    }, [props.control]);

    function getOptions(): Option<T>[] {
        let newOptions = props.options || [];
        const showCreate =
            creatable &&
            !newOptions.some((option) => {
                const { value, label } = option;

                return (
                    (typeof value === 'string' && value === search) ||
                    label === search
                );
            });

        if (search) {
            newOptions = newOptions.filter((option) =>
                replaceUmlauts(option.label)
                    .toLowerCase()
                    .includes(replaceUmlauts(search).toLowerCase())
            );
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
                    value: search as any,
                    creatable: true
                },
                ...newOptions
            ];
        }

        return newOptions;
    }

    function toggleMenu(): void {
        const newOpen = !open;

        if (newOpen) {
            openMenu();
        } else {
            closeMenu(props.value);
        }
    }

    function openMenu(): void {
        const selectedIndex = props.hideSelectedOptions
            ? undefined
            : options.findIndex((option) =>
                  equal(option.value, props.value, props.equalCompareProp)
              );
        const keepSearchOnBlur = props.keepSearchOnBlur && !props.value;

        setOpen(true);
        setSearch(keepSearchOnBlur ? search : undefined);
        setSelectedIndex(selectedIndex);
        props.onOpen?.();

        addDocumentListener();
    }

    function closeMenu(value: any | any[], callback = () => {}): void {
        const keepSearchOnBlur = props.keepSearchOnBlur && !value;

        removeDocumentListener();
        setOpen(false);
        setSearch(keepSearchOnBlur ? search : undefined);
        setSelectedIndex(undefined);
        props.onClose?.();

        callback();
    }

    function createOption(value: string, cb?: () => void): void {
        if (props.onCreate) {
            closeMenu(value, () => {
                props.onCreate?.(value);
                cb?.();
            });
        }
    }

    function addDocumentListener(): void {
        removeDocumentListener();

        document?.addEventListener('click', onDocumentClick);
    }

    function removeDocumentListener(): void {
        document?.removeEventListener('click', onDocumentClick);
    }

    function cleanBlindText(): void {
        blindTextTimeout.current = setTimeout(() => setBlindText(''), 700);
    }

    function findOptionIndex(val: any) {
        let index = options.findIndex((option) => option.value === val);

        if (index === -1) {
            if (typeof val === 'object') {
                index = options.findIndex((option) =>
                    equal(option.value, val, props.equalCompareProp)
                );
            }

            if (index === -1) {
                return '';
            }
        }

        return String(index);
    }

    function onChangeNativeSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
        const { currentTarget } = e;

        if (props.onChange) {
            if (currentTarget.value === '') {
                onClear();
            } else {
                const values = Array.from(currentTarget.selectedOptions).map(
                    (htmlOption) => options[htmlOption.index - 1].value
                );

                if (multi) {
                    props.onChange(values as any);
                } else {
                    props.onChange(values[0] as any);
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

    function onOptionSelect(value: any | any[], option?: Option<T>): void {
        const { current } = nativeSelect;
        let optionWasCreated = false;

        const selectOnNative = () => {
            if (current) {
                current.value =
                    isArray(value) && multi
                        ? (value.map(findOptionIndex) as any)
                        : findOptionIndex(value);
            }

            setFocused(true);
            closeMenu(value, () => props.onChange?.(value, option));
        };

        if (creatable) {
            const createValue = (val: any) => {
                const option = options.find(
                    (option) =>
                        optionIsCreatable(option) && option.value === val
                );

                if (option) {
                    optionWasCreated = true;
                    createOption(option.value as any, selectOnNative);
                }
            };

            if (isArray(value) && multi) {
                value.map(createValue);
            } else {
                createValue(value);
            }
        }

        if (!optionWasCreated) {
            selectOnNative();
        }
    }

    function onOptionRemove(value: any): void {
        if (isArray(props.value) && props.multi) {
            const values = props.value.filter(
                (val) => !equal(val, value, props.equalCompareProp)
            );

            onOptionSelect(values);
        }
    }

    function onClear() {
        onOptionSelect(props.multi ? [] : undefined);
    }

    function onSearch(search: string): void {
        setSearch(search);
        setOpen(true);

        if (options.length === 1 || (props.creatable && search)) {
            setSelectedIndex(0);
        } else {
            setSelectedIndex(undefined);
        }

        props.onSearch?.(search);
    }

    function optionIsCreatable(option: Option<T>): boolean {
        return (
            creatable && option.creatable && Boolean(props.onCreate && search)
        );
    }

    const onDocumentClick = React.useCallback((e) => {
        const { target } = e;

        if (target.closest('.react-slct-menu')) {
            return;
        }

        if (typeof ref === 'object' && !ref?.current?.contains(target)) {
            closeMenu(props.value);
        }
    }, []);

    function onKeyDown({ keyCode }: React.KeyboardEvent): void {
        switch (keyCode) {
            case keys.TAB:
                if (open) {
                    closeMenu(props.value);
                }
                break;
        }

        if (!searchable && !creatable) {
            handleBlindText(keyCode);
        }
    }

    function onKeyUp({ keyCode }: React.KeyboardEvent): void {
        let newSelectedIndex = selectedIndex;

        switch (keyCode) {
            case keys.ARROW_UP:
                if (open) {
                    if (newSelectedIndex !== undefined) {
                        newSelectedIndex = newSelectedIndex - 1;

                        if (newSelectedIndex < 0) {
                            newSelectedIndex = options.length - 1;
                        }
                    }

                    setSelectedIndex(newSelectedIndex);
                } else {
                    openMenu();
                }
                break;
            case keys.ARROW_DOWN:
                if (open) {
                    if (
                        newSelectedIndex === undefined ||
                        newSelectedIndex === options.length - 1
                    ) {
                        newSelectedIndex = 0;
                    } else {
                        newSelectedIndex = newSelectedIndex + 1;
                    }

                    setSelectedIndex(newSelectedIndex);
                } else {
                    openMenu();
                }
                break;
            case keys.ENTER:
                if (selectedIndex === 0 && optionIsCreatable(options[0])) {
                    createOption(search!);
                } else if (
                    newSelectedIndex !== undefined &&
                    options[newSelectedIndex]
                ) {
                    const option = options[newSelectedIndex];
                    const newValue = option.value;

                    onOptionSelect(
                        isArray(value) && multi
                            ? [...value, newValue]
                            : newValue,
                        option
                    );
                }
                break;
            case keys.ESC:
                if (open) {
                    closeMenu(value);
                }
                break;
        }
    }

    function handleBlindText(keyCode: number): void {
        if (keyCode === keys.BACKSPACE && blindText.length) {
            clearTimeout(blindTextTimeout.current);

            setBlindText(blindText.slice(0, blindText.length - 1));
            cleanBlindText();
        } else if (keyCode === keys.SPACE) {
            clearTimeout(blindTextTimeout.current);

            setBlindText(blindText + ' ');
            cleanBlindText();
        } else {
            const key = String.fromCodePoint(keyCode);

            if (/\w/.test(key)) {
                clearTimeout(blindTextTimeout.current);

                setBlindText(blindText + key);
                cleanBlindText();
            }
        }
    }

    function handleBlindTextUpdate(): void {
        if (open) {
            const newSelectedIndex = options.findIndex((option) =>
                option.label.toLowerCase().startsWith(blindText.toLowerCase())
            );

            if (newSelectedIndex >= 0) {
                setSelectedIndex(newSelectedIndex);
            }
        } else if (!multi) {
            if (blindText) {
                const option = options.find((option) =>
                    option.label
                        .toLowerCase()
                        .startsWith(blindText.toLowerCase())
                );

                if (option) {
                    onOptionSelect(option.value, option);
                }
            } else {
                onOptionSelect(undefined);
            }
        }
    }

    function getValue(): T | T[] | undefined {
        const valueOptions = getValueOptions(
            props.options || [],
            props.value,
            props.multi,
            props.equalCompareProp
        );
        return !multi
            ? props.value
            : valueOptions.map((option) => option.value);
    }

    function renderChildren(): JSX.Element | null {
        const value = getValue();
        const showPlaceholder =
            !search &&
            (isArray(value) && multi
                ? value.length === 0
                : value === undefined || value === null);

        if (!props.children) {
            return null;
        }

        return props.children({
            options,
            open,
            value,
            MenuContainer,
            placeholder: showPlaceholder ? placeholder : undefined,
            onToggle: toggleMenu,
            onClose: () => closeMenu(value),
            onOpen: openMenu,
            onRef: ref
        });
    }

    function renderNativeSelect(): React.ReactNode {
        const dataRole = props['data-role']
            ? `select-${props['data-role']}`
            : undefined;
        const clearable = props.clearable && native;
        const value =
            isArray(props.value) && multi
                ? props.value.map(findOptionIndex)
                : findOptionIndex(props.value || '');
        const propDisabled = disabled ? disabled : required ? false : !native;

        return (
            <NativeSelect
                ref={nativeSelect as any}
                multiple={multi}
                value={value}
                disabled={propDisabled}
                required={required}
                native={native}
                tabIndex={-1}
                data-role={dataRole}
                onChange={onChangeNativeSelect}
            >
                <option value="" disabled={!clearable}>
                    {placeholder}
                </option>
                {options.map((option, i) => (
                    <option
                        key={toKey(option.value, props.equalCompareProp)}
                        value={`${i}`}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </NativeSelect>
        );
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

    return (
        <Container
            className={classNames.join(' ')}
            disabled={disabled}
            ref={ref}
            data-role={props['data-role']}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
        >
            {renderNativeSelect()}
            <Value
                clearable={clearable}
                searchable={searchable}
                open={open}
                disabled={disabled}
                multi={multi}
                mobile={native}
                focused={focused}
                options={props.options}
                placeholder={placeholder}
                error={error}
                value={value}
                search={search}
                keepSearchOnBlur={keepSearchOnBlur}
                equalCompareProp={equalCompareProp}
                labelComponent={labelComponent}
                valueComponentSingle={valueComponentSingle}
                valueComponentMulti={valueComponentMulti}
                arrowComponent={arrowComponent}
                clearComponent={clearComponent}
                valueIconComponent={props.valueIconComponent}
                onClear={onClear}
                onClick={toggleMenu}
                onSearch={onSearch}
                onSearchFocus={onSearchFocus}
                onSearchBlur={onSearchBlur}
                onOptionRemove={onOptionRemove}
            />
            <Menu
                open={open}
                options={options}
                value={value}
                multi={multi}
                error={error}
                search={search}
                selectedIndex={selectedIndex}
                menuComponent={menuComponent}
                labelComponent={labelComponent}
                optionComponent={optionComponent}
                hideSelectedOptions={hideSelectedOptions}
                equalCompareProp={equalCompareProp}
                emptyText={emptyText}
                rowHeight={rowHeight}
                menuWidth={menuWidth}
                menuHeight={menuHeight}
                menuPosition={menuPosition}
                onSelect={onOptionSelect}
            />
        </Container>
    );
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps<any>>(
    SelectImpl
);
