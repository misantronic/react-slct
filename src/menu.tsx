import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { ReactSlctColors } from './config';
import { SelectLabel } from './label';
import { MenuContainer } from './menu-container';
import { MenuRow } from './menu-row';
import { OptionComponent } from './option';
import { MenuComponentProps, Option, Rect } from './typings';
import { equal, isArray } from './utils';

const EmptyOptionItem = styled(OptionComponent.OptionItem)`
    height: 100%;
    border: 1px solid ${() => ReactSlctColors.border};
`;

const Empty = (props: { emptyText?: string }) => (
    <EmptyOptionItem>
        <SelectLabel>
            <i>{props.emptyText || 'No results'}</i>
        </SelectLabel>
    </EmptyOptionItem>
);

export function Menu(props: MenuComponentProps) {
    const {
        rowHeight = 32,
        selectedIndex,
        open,
        error,
        menuWidth,
        menuHeight,
        menuPosition,
        multi,
        hideSelectedOptions
    } = props;
    const currentValue =
        isArray(props.value) && multi ? props.value : [props.value];
    const options = React.useMemo(
        () =>
            (props.options || []).filter((option) => {
                if (hideSelectedOptions) {
                    const selected = currentValue.some((val) =>
                        equal(
                            val,
                            option.value,
                            props.equalCompareProp,
                            props.equalCompareStrict
                        )
                    );

                    if (selected) {
                        return false;
                    }
                }

                return true;
            }),
        [
            props.options,
            props.equalCompareProp,
            hideSelectedOptions,
            currentValue
        ]
    );
    const [rect, setRect] = useState<Rect>();
    const [style, setStyle] = useState<Rect>();
    const list = useRef<FixedSizeList>(null);
    const width = menuWidth || (rect && rect.width !== 'auto' ? rect.width : 0);
    const assumedHeight = Math.min(
        Math.max(options.length * rowHeight, rowHeight) + 2,
        menuHeight || 185
    );
    const actualHeight =
        (style?.height !== 'auto' && style?.height) || assumedHeight;

    useEffect(() => {
        if (
            open &&
            list.current &&
            selectedIndex !== undefined &&
            selectedIndex !== -1
        ) {
            list.current.scrollToItem(selectedIndex, 'center');
        }
    }, [open, selectedIndex]);

    const itemData = React.useMemo(() => {
        return {
            ...props,
            options,
            onSelect: (value: any, option: Option) => {
                if (isArray(props.value) && props.multi) {
                    const found = props.value.some((item) =>
                        equal(
                            item,
                            value,
                            props.equalCompareProp,
                            props.equalCompareStrict
                        )
                    );
                    const values = found
                        ? props.value.filter(
                              (item) =>
                                  !equal(
                                      item,
                                      value,
                                      props.equalCompareProp,
                                      props.equalCompareStrict
                                  )
                          )
                        : Array.from(new Set([...props.value, value]));

                    props.onSelect(values, option);
                } else {
                    props.onSelect(value, option);
                }
            }
        };
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
            return <MenuContent {...props} />;
        }

        if (itemCount === 0) {
            return <Empty emptyText={props.emptyText} />;
        }

        return (
            <FixedSizeList
                className="react-slct-menu-list"
                ref={list}
                width="100%"
                height={actualHeight}
                itemSize={rowHeight}
                itemCount={itemCount}
                itemData={itemData}
            >
                {MenuRow}
            </FixedSizeList>
        );
    }

    return open ? (
        <MenuContainer
            error={error}
            menuWidth={width}
            menuHeight={assumedHeight}
            menuPosition={menuPosition}
            onRect={setRect}
            onStyle={setStyle}
        >
            {renderList()}
        </MenuContainer>
    ) : null;
}
