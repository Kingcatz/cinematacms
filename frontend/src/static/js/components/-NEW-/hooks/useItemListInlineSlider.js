import React, { useState, useEffect, useRef } from 'react';

import { useItemList } from './useItemList';

import { CircleIconButton } from '../CircleIconButton';

import initItemsList from '../includes/itemLists/initItemsList';
import ItemsInlineSlider from "../includes/itemLists/ItemsInlineSlider"

import { addClassname, removeClassname } from '../functions/dom';

export function useItemListInlineSlider( props ){

    const itemsListRef = useRef(null);
    const itemsListWrapperRef = useRef(null);

    const [ items, countedItems, listHandler, setListHandler, onItemsLoad, onItemsCount, addListItems ] = useItemList( props, itemsListRef );

    const [ inlineSlider, setInlineSlider ] = useState(null);

    const [ displayNext, setDisplayNext ] = useState(false);
    const [ displayPrev, setDisplayPrev ] = useState(false);

    const [ resizeDate, setResizeDate ] = useState(null);
    const [ sidebarVisibilityChangeDate, setSidebarVisibilityChangeDate ] = useState(null);

    let resizeTimeout = null;

    let sliderRecalTimeout = null;

    let pendingChangeSlide = true; // @note: Allows to run method `this.inlineSlider.scrollToCurrentSlide()` on object `this.inlineSlider` initialization.

    let classname = {
        list: 'items-list',
        listOuter: 'items-list-outer list-inline list-slider' + (!!props.className ? ' ' + props.className : ''),
    };

    function afterItemsLoad(){
        updateSlider(true);
    }

    function renderBeforeListWrap() {
        return ! displayPrev ? null : <span className="previous-slide"><CircleIconButton buttonShadow={true} onClick={ prevSlide }><i className="material-icons">keyboard_arrow_left</i></CircleIconButton></span>;
    }

    function renderAfterListWrap() {
        return ! displayNext ? null : <span className="next-slide"><CircleIconButton buttonShadow={true} onClick={ nextSlide }><i className="material-icons">keyboard_arrow_right</i></CircleIconButton></span>;
    }

    function winResizeListener(){
        setResizeDate(new Date());
    }

    function sidebarVisibilityChangeListener(){
        setSidebarVisibilityChangeDate(new Date());
    }

    function onWinResize(){

        // 767 < PageStore.get('window-inner-width') ||

        if ( null === inlineSlider) {
            updateSlider(false);
            return;
        }

        clearTimeout(resizeTimeout);
        
        addClassname(itemsListWrapperRef.current, 'resizing');

        inlineSlider.updateDataStateOnResize( items.length, listHandler.loadedAllItems() );
        inlineSlider.scrollToCurrentSlide();

        resizeTimeout = setTimeout( onWinResizeUpdate, 200 );        
    }

    function onWinResizeUpdate(){
        inlineSlider.updateDataStateOnResize( items.length, listHandler.loadedAllItems() );
        inlineSlider.scrollToCurrentSlide();
        removeClassname(itemsListWrapperRef.current, 'resizing');
        resizeTimeout = null;        
    }

    function onSidebarVisibilityChange(){

        clearTimeout(sliderRecalTimeout);

        // @NOTE: 200ms is transition duration, set in CSS.
        sliderRecalTimeout = setTimeout(function() {
            updateSliderButtonsView();
            sliderRecalTimeout = setTimeout(function() {
                sliderRecalTimeout = null;
                updateSlider();
            }, 50);
        }, 150);
    }

    function nextSlide(){

        inlineSlider.nextSlide();

        updateSliderButtonsView();

        if (!listHandler.loadedAllItems() && inlineSlider.loadMoreItems()) {
            pendingChangeSlide = true;
            listHandler.loadItems(inlineSlider.itemsFit());
        }
        else {
            inlineSlider.scrollToCurrentSlide();
        }
    }

    function prevSlide(){
        inlineSlider.previousSlide();
        updateSliderButtonsView();
        inlineSlider.scrollToCurrentSlide();
    }

    function initSlider(){
        
        if (!itemsListWrapperRef.current) {
            return;
        }

        setInlineSlider( new ItemsInlineSlider(itemsListWrapperRef.current, '.item') );
    }

    function updateSlider(afterItemsUpdate){

        if (null === inlineSlider) {
            initSlider();
            return;
        }

        inlineSlider.updateDataState(items.length, listHandler.loadedAllItems(), !afterItemsUpdate);

        if (!listHandler.loadedAllItems() && inlineSlider.loadItemsToFit()) {
            listHandler.loadItems(inlineSlider.itemsFit());
        } else {

            updateSliderButtonsView();

            if (pendingChangeSlide) {
                pendingChangeSlide = false;
                inlineSlider.scrollToCurrentSlide();
            }
        }
    }

    function updateSliderButtonsView() {
        if( ! inlineSlider ){
            return;
        }
        setDisplayNext( inlineSlider.hasNextSlide() );
        setDisplayPrev( inlineSlider.hasPreviousSlide() );
    }

    useEffect(() => {
        addListItems();
        afterItemsLoad();
    }, [items]);

    useEffect(() => {
        updateSlider(true);
    }, [inlineSlider]);

    useEffect(() => {
        onWinResize();
    }, [resizeDate]);

    useEffect(() => {
        onSidebarVisibilityChange();
    }, [sidebarVisibilityChangeDate]);

    return [ items, countedItems, listHandler, classname, setListHandler, onItemsCount, onItemsLoad, winResizeListener, sidebarVisibilityChangeListener, itemsListWrapperRef, itemsListRef, renderBeforeListWrap, renderAfterListWrap ];
}