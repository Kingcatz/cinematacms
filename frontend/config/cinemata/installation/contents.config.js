module.exports = {
	header: {
		// right: '<a href="https://engagemedia.org/" target="_blank" rel="noreferrer" title="EngageMedia"></a>',
		onLogoRight: "Social issue films about the Asia-Pacific",
	},
	sidebar: {
		mainMenuExtraItems: [
			{
				text: "Playlists",
				link: "/playlists",
				icon: "playlist_play",
				className: "nav-item-playlist",
			},
		],
		navMenuItems: [
			{
				text: "About us",
				link: "/about.html",
				icon: "contact_support",
				className: "nav-item-about-us",
			},
			{
				text: "Editorial policy",
				link: "/editorial-policy.html",
				icon: "description",
				className: "nav-item-editorial-policy",
			},
			{
				text: "Contact us",
				link: "/contact.html",
				icon: "alternate_email",
				className: "nav-item-contact-us",
			},
		],
		belowNavMenu:
			'<ul class="social-media-links">\
		                <li>\
		                    <a href="https://engagemedia.us1.list-manage.com/subscribe/post?u=d9dee6898a6443ce6f94eb51a&amp;id=017d30dda8" target="_blank" rel="noreferrer" title="" alt="">\
								<img src="/static/images/icons/dark-mode/newsletter.png" loading="lazy" alt=""/>\
		                    </a>\
		                </li>\
		                <li>\
		                    <a href="http://www.facebook.com/engagemedia" target="_blank" rel="noreferrer" title="" alt="">\
								<img src="/static/images/icons/dark-mode/facebook.png" loading="lazy" alt=""/>\
		                    </a>\
		                </li>\
		                <li>\
		                    <a href="http://twitter.com/EngageMedia" target="_blank" rel="noreferrer" title="" alt="">\
		                        <img src="/static/images/icons/dark-mode/twitter.png" loading="lazy" alt="" />\
		                    </a>\
		                </li>\
		            </ul>',
		// belowThemeSwitcher: '',
		footer:
			'<div class="copyright-wrap">\
					<div class="copyright-notice">\
						<a href="https://engagemedia.org" target="_blank" rel="noreferrer" title="EngageMedia">\
							<span>\
								<img src="/static/images/em_logo_dark.png" alt="" class="em-dark" />\
								<img src="/static/images/em_logo_light.png" alt="" class="em-light" />\
							</span>\
						</a>\
					</div>\
					<div class="page-sidebar-bottom-content">powered by <a href="//demo.mediacms.io" title="mediacms.io" target="_blank" rel="noreferrer">mediacms.io</a></div>\
				</div>\
				<ul class="sidebar-bottom-menu">\
					<li><a href="#" title="Terms">Terms</a></li>\
					<li><a href="#" title="Privacy">Privacy</a></li>\
				</ul>',
	},
	uploader: {
		belowUploadArea:
			'Please check our <a href="./editorial-policy" title="Editorial Policy">Editorial Policy</a> before uploading media.<br/>Any media that does not comply with the policy will be deleted from Cinemata.org.',
		postUploadMessage: "",
	},
	notifications: {
		messages: {
			addToLiked: "Added to favorites",
			removeFromLiked: "Removed from favorites",
		},
	},
};
