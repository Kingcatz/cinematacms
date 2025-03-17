import ComponentRenderer from './classes_instances/components-renderer';

import { PageHeader } from './components/-NEW-/PageHeader';
import { PageSidebar } from './components/-NEW-/PageSidebar';
// import PageFooter from './components/-NEW-/PageSidebar';

export function renderPage( idSelector, PageComponent ){
	
	ComponentRenderer.display( document.getElementById('app-header'), PageHeader, {}, 'app-header' );
	ComponentRenderer.display( document.getElementById('app-sidebar'), PageSidebar, {}, 'app-sidebar' );
	// ComponentRenderer.display( document.getElementById('app-footer'), PageFooter, {}, 'app-footer' );

	if( void 0 !== idSelector && void 0 !== PageComponent ){
		
		const elem = document.getElementById( idSelector );
		
		if( null !== elem ){
			ComponentRenderer.display( elem, PageComponent, {}, idSelector );
		}
	}
}

export function renderEmbedPage( idSelector, PageComponent ){

	if( void 0 !== idSelector && void 0 !== PageComponent ){
		
		const elem = document.getElementById( idSelector );
		
		if( null !== elem ){
			ComponentRenderer.display( elem, PageComponent, {}, idSelector );
		}
	}
}