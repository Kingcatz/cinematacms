let TAXONOMIES = null;

export function init( settings ){

	TAXONOMIES = {
	    tags: {
	    	enabled: false,
	    	title: 'Tags',
	    },
	    categories: {
	    	enabled: false,
	    	title: 'Categories',
	    },
	    topics: {
	    	enabled: false,
	    	title: 'Topics',
	    },
	    languages: {
	    	enabled: false,
	    	title: 'Languages',
	    },
	    countries: {
	    	enabled: false,
	    	title: 'Countries',
	    },
    };

    if( void 0 !== settings ){

		for(let k in TAXONOMIES){

			if( void 0 !== settings[k] ){

				TAXONOMIES[k].enabled = true;

				if( void 0 !== settings[k].enabled && false === settings[k].enabled ){
					TAXONOMIES[k].enabled = false;
				}
				
				if( 'string' === typeof settings[k].title ){
					TAXONOMIES[k].title = settings[k].title.trim();
				}
			}		
		}
	}
}

export function settings(){
	return TAXONOMIES;
}
