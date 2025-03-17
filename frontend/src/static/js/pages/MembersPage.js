import React from 'react';
import PropTypes from 'prop-types';

import ApiUrlContext from '../contexts/ApiUrlContext';

import { Page } from './_Page';
import PageStore from './_PageStore';

import { MediaListWrapper } from './components/MediaListWrapper';

import { LazyLoadItemListAsync } from '../components/-NEW-/LazyLoadItemListAsync';

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

export class MembersPage extends Page {

	constructor(props){
		
		super(props, 'members');

		const urlvars = getUrlVars();

		const location = void 0 !== urlvars.location ? urlvars.location.trim() : null;

		this.state = {
			title: props.title,
			api_url: ApiUrlContext._currentValue.users,
		};
		
		if(  null !== location && '' !== location ){

			if( 'International' === location ){
				this.state.title = location + ' members';
			}
			else{
				this.state.title = 'Members from ' + location;
			}

			this.state.api_url = this.state.api_url + '?location=' + location;
		}
	}

	pageContent(){
		return <MediaListWrapper title={ this.state.title } className="items-list-ver">
					<LazyLoadItemListAsync requestUrl={ this.state.api_url } />
				</MediaListWrapper>;
	}
}

MembersPage.propTypes = {
	title: PropTypes.string.isRequired,
};

MembersPage.defaultProps = {
	title: 'Members',
};
