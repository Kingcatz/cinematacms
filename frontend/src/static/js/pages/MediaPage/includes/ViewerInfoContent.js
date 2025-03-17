import React, { useRef, useState, useEffect } from 'react';

import { usePopup } from '../../../components/-NEW-/hooks/usePopup';

import { UserConsumer } from '../../../contexts/UserContext';
import SiteContext from '../../../contexts/SiteContext';

import PageStore from '../../_PageStore';

import * as PageActions from '../../_PageActions';

import MediaPageStore from '../store.js';
import * as MediaPageActions from '../actions.js';

import CommentsList from '../../../components/-NEW-/Comments';

import { RatingSystem } from '../../../components/RatingSystem/RatingSystem';

import { PopupMain } from '../../../components/-NEW-/Popup';

import { publishedOnDate } from '../../../functions/';

import { formatInnerLink } from '../../../functions/formatInnerLink';

function metafield( arr ){

	let i;
	let sep;
	let ret = [];

	if( arr.length ){
		i = 0;
		sep = 1 < arr.length ? ', ' : '';
		while( i < arr.length ){
			ret[i] = <div key={i}><a href={ arr[i].url } title={ arr[i].title }>{ arr[i].title }</a>{ i < ( arr.length - 1 ) ? sep : '' }</div>;
			i += 1;
		}
	}

	return ret;
}

function MediaAuthorBanner(props){
	return (<div className="media-author-banner">
		<div>
			<a className="author-banner-thumb" href={ props.link || null } title={ props.name }>
						<span style={ { backgroundImage: 'url(' + props.thumb + ')' } }>
							<img src={ props.thumb } loading="lazy" alt={ props.name } title={ props.name } />
						</span>
			</a>
		</div>
		<div>
			<span><a href={ props.link } className="author-banner-name" title={ props.name }><span>{ props.name }</span></a></span>
		</div>
	</div>);
}

function MediaMetaField(props){
	return (<div className="media-content-languages">
		<div className="media-content-field">
			<div className="media-content-field-label"><h4>{ props.title }</h4></div>
			<div className="media-content-field-content">{ props.value }</div>
		</div>
	</div>);
}

function EditMediaButton(props){
	return( <a href={ props.link } rel="nofollow" title="Edit media" className="edit-media">EDIT MEDIA</a> );
}

function EditSubtitleButton(props){
	return ( <a href={ props.link } rel="nofollow" title="Edit subtitle" className="edit-subtitle">EDIT SUBTITLE</a> );
}

export default function ViewerInfoContent(props){

	const description = props.description.trim();
	const productionCompanyContent = MediaPageStore.get('media-production-company');
	const websiteContent = MediaPageStore.get('media-website');
	const licenseContent = MediaPageStore.get('media-license-info');
	const languagesContent = metafield( MediaPageStore.get('media-languages') );
	const topicsContent = metafield( MediaPageStore.get('media-topics') );
	const tagsContent = ! PageStore.get('config-enabled').taxonomies.tags || PageStore.get('config-enabled').taxonomies.tags.enabled ? metafield( MediaPageStore.get('media-tags') ) : [];
	const categoriesContent = PageStore.get('config-options').pages.media.categoriesWithTitle ? [] : ( ! PageStore.get('config-enabled').taxonomies.categories || PageStore.get('config-enabled').taxonomies.categories.enabled ? metafield( MediaPageStore.get('media-categories') ) : [] );

	let summary = MediaPageStore.get('media-summary');

	summary = summary ? summary.trim() : '';

	const [ popupContentRef, PopupContent, PopupTrigger ] = usePopup();

	const [hasSummary, setHasSummary ] = useState( '' !== summary );
	const [isContentVisible, setIsContentVisible] = useState( '' == summary );

	function proceedMediaRemoval(){
		MediaPageActions.removeMedia();
		popupContentRef.current.toggle();
	}

	function cancelMediaRemoval(){
		popupContentRef.current.toggle();
	}

	function onMediaDelete(mediaId){

		// TODO: Re-check this...
		setTimeout(function(){	// @note: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].

			PageActions.addNotification( "Media removed. Redirecting...", 'mediaDelete');

			setTimeout(function(){
				window.location.href = SiteContext._currentValue.url + '/' + MediaPageStore.get('media-data').author_profile.replace(/^\//g, '');
			}, 2000);

		}, 100);

		if( void 0 !== mediaId ){
			console.info("Removed media '" + mediaId + '"' );
		}
	}

	function onMediaDeleteFail(mediaId){

		// TODO: Re-check this...
		setTimeout(function(){	// @note: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].
			PageActions.addNotification( "Media removal failed", 'mediaDeleteFail');
		}, 100);

		if( void 0 !== mediaId ){
			console.info('Media "' + mediaId + '"' + " removal failed");
		}
	}

	function onClickLoadMore(){
		setIsContentVisible(!isContentVisible);
	}

	useEffect( () => {
		MediaPageStore.on("media_delete", onMediaDelete);
		MediaPageStore.on("media_delete_fail", onMediaDeleteFail);
		return () => {
			MediaPageStore.removeListener("media_delete", onMediaDelete);
			MediaPageStore.removeListener("media_delete_fail", onMediaDeleteFail);
		};
	}, []);

	const authorLink = formatInnerLink( props.author.url, SiteContext._currentValue.url );
	const authorThumb = formatInnerLink( props.author.thumb, SiteContext._currentValue.url );

	let ratings_info = MediaPageStore.get('media-data').ratings_info;

	if( void 0 === ratings_info || ! ratings_info.length ){
		ratings_info = null;
	}

	const licenseTitle = null !== licenseContent && '' !== licenseContent ? 'License' : 'Copyright';

	let licenseValue;

	if( null !== licenseContent && '' !== licenseContent ){
		licenseValue = <a href={ licenseContent.url } title={ licenseContent.title } className="media-license-link" target="_blank" rel="nofollow">
			<span><img src={ licenseContent.thumbnail } alt="" /></span>
			<span>{ licenseContent.title }</span>
		</a>;
	}
	else{
		licenseValue = <span>All rights reserved.</span>;
	}

	return (<UserConsumer>
		{ user =>
			<div className="media-info-content">

				{ void 0 === PageStore.get('config-media-item').displayAuthor || null === PageStore.get('config-media-item').displayAuthor || !! PageStore.get('config-media-item').displayAuthor ? <MediaAuthorBanner link={ authorLink } thumb={ authorThumb } name={props.author.name} published={props.published} /> : null }

				<div className={ "media-content-banner" + ( null !== productionCompanyContent && '' !== productionCompanyContent ? ' large-fields-title' : '' ) }>

					<div className="media-content-banner-inner">

						{ hasSummary ? <div className="media-content-summary">{ summary }</div> : null }
						{ ( ! hasSummary || isContentVisible ) && description ? ( PageStore.get('config-options').pages.media.htmlInDescription ? <div className="media-content-description" dangerouslySetInnerHTML={ { __html : description } }></div> : <div className="media-content-description">{ description }</div> ) : null }
						{ hasSummary ? <button className="load-more" onClick={ onClickLoadMore }>{ isContentVisible ? 'SHOW LESS' : 'SHOW MORE' }</button> : null }

						{ languagesContent.length ? <MediaMetaField value={ languagesContent } title={ 1 < languagesContent.length ? 'Languages' : 'Language' } /> : null }
						{ !!props.yearProduced && <MediaMetaField value={<span className="media-year-produced">{props.yearProduced}</span> } title={ 'Year produced' } /> }
						{ topicsContent.length ? <MediaMetaField value={ topicsContent } title={ 1 < topicsContent.length ? 'Topics' : 'Topic' } /> : null }

						{ categoriesContent.length ? <MediaMetaField value={ categoriesContent } title={ 1 < categoriesContent.length ? 'Categories' : 'Category' } /> : null }
						{ null !== productionCompanyContent && '' !== productionCompanyContent ? <MediaMetaField value={ productionCompanyContent } title='Production company' /> : null }
						{ websiteContent && <MediaMetaField value={ <a href={websiteContent}  target="_blank" rel="noreferrer noopener">{websiteContent}</a> } title='Website' /> }
						{ MediaPageStore.get('display-media-license-info') ? <MediaMetaField value={ licenseValue } title={ licenseTitle } /> : null }
						{ tagsContent.length ? <MediaMetaField value={ tagsContent } title={ 1 < tagsContent.length ? 'Tags' : 'Tag' } /> : null }
						{ user.can.editMedia || user.can.editSubtitle || user.can.deleteMedia ? <div className="media-author-actions">

							{ user.can.editMedia ? <EditMediaButton link={ MediaPageStore.get('media-data').edit_url } /> : null }
							{ user.can.editSubtitle && 'video' === MediaPageStore.get('media-data').media_type ?  <EditSubtitleButton link={ MediaPageStore.get('media-data').edit_url.replace( "edit?", "add_subtitle?" ) } /> : null }

							<PopupTrigger contentRef={ popupContentRef }>
								<button className="remove-media">DELETE MEDIA</button>
							</PopupTrigger>

							<PopupContent contentRef={ popupContentRef }>
								<PopupMain>
									<div className="popup-message">
										<span className="popup-message-title">Media removal</span>
										<span className="popup-message-main">You're willing to remove media permanently?</span>
									</div>
									<hr/>
									<span className="popup-message-bottom">
												<button className="button-link cancel-comment-removal" onClick={ cancelMediaRemoval }>CANCEL</button>
												<button className="button-link proceed-comment-removal" onClick={ proceedMediaRemoval }>PROCEED</button>
											</span>
								</PopupMain>
							</PopupContent>

						</div> : null }

					</div>

				</div>

				{ null !== ratings_info ? <RatingSystem media_id={ MediaPageStore.get('media-id') } ratings_data={ ratings_info } /> : null }

				<CommentsList />

			</div>
		}
	</UserConsumer>);
}
