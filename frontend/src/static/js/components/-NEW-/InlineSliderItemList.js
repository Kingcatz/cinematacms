import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useItemListInlineSlider } from './hooks/useItemListInlineSlider';

import PageStore from '../../pages/_PageStore.js';
import LayoutStore from '../../stores/LayoutStore.js';

import { PendingItemsList } from './PendingItemsList';
import { ListItem, listItemProps } from './ListItem';

import { ItemList } from './ItemList';

import { ItemsStaticListHandler } from "./includes/itemLists/ItemsStaticListHandler";

export function InlineSliderItemList(props){

    const [ items, countedItems, listHandler, classname, setListHandler, onItemsCount, onItemsLoad, winResizeListener, sidebarVisibilityChangeListener, itemsListWrapperRef, itemsListRef, renderBeforeListWrap, renderAfterListWrap ] = useItemListInlineSlider(props);

    useEffect(() => {

        setListHandler( new ItemsStaticListHandler(props.items, props.pageItems, props.maxItems, onItemsCount, onItemsLoad) );

    	PageStore.on('window_resize', winResizeListener);
        LayoutStore.on('sidebar-visibility-change', sidebarVisibilityChangeListener);

        return () => {

        	PageStore.removeListener('window_resize', winResizeListener);
        	LayoutStore.removeListener('sidebar-visibility-change', sidebarVisibilityChangeListener);

            if( listHandler ){
                listHandler.cancelAll();
                setListHandler(null);
            }
        };
    }, []);
    return ( ! countedItems ?
            <PendingItemsList className={ classname.listOuter } /> :
            ( ! items.length ? null : <div className={ classname.listOuter }>

                { renderBeforeListWrap() }

                <div ref={ itemsListWrapperRef } className="items-list-wrap">
                    <div ref={ itemsListRef } className={ classname.list }>
                        { items.map( ( itm, index ) => <ListItem key={ index } { ...listItemProps( props, itm, index ) } /> ) }
                    </div>
                </div>

                { renderAfterListWrap() }

            </div> )
           );
}

InlineSliderItemList.propTypes = {
    ...ItemList.propTypes,
};

InlineSliderItemList.defaultProps = {
    ...ItemList.defaultProps,
    pageItems: 12,
};
