!function(){var e,t={5959:function(e,t,n){"use strict";var r=n(9087),i=(n(6394),n(5334),n(2004),n(8407),n(8288),n(5677),n(2129),n(4655),n(288),n(4458),n(3675),n(2322),n(5466)),o=n(2880),a=(n(1346),n(4426),n(6157),n(4669),n(3233),n(9006),n(8736),n(1589),n(2331)),s=(n(3296),n(9751),n(5101),n(3080),n(1590)),c=n.n(s),u=n(8420),l=n(5143);function d(e){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d(e)}function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function p(e,t){return p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},p(e,t)}function h(e,t){if(t&&("object"===d(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return m(e)}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function y(e){return y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},y(e)}var b={},v=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&p(e,t)}(a,e);var t,n,r,i,o=(r=a,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=y(r);if(i){var n=y(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return h(this,e)});function a(){var e;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(e=o.call(this)).mediacms_config=(0,l.v)(window.MediaCMS);var t,n=(t={},window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,(function(e,n,r){t[n]=r})),t),r=n.q,i=n.c,s=n.t,c=n.topic,u=n.country,d=n.language;return b[Object.defineProperty(m(e),"id",{value:"SearchFieldStoreData_"+Object.keys(b).length}).id]={searchQuery:r?decodeURIComponent(r).replace(/\+/g," "):"",categoriesQuery:i?decodeURIComponent(i).replace(/\+/g," "):"",tagsQuery:s?decodeURIComponent(s).replace(/\+/g," "):"",topicsQuery:c?decodeURIComponent(c).replace(/\+/g," "):"",countriesQuery:u?decodeURIComponent(u).replace(/\+/g," "):"",languagesQuery:d?decodeURIComponent(d).replace(/\+/g," "):"",predictions:[]},e.dataResponse=e.dataResponse.bind(m(e)),e}return t=a,(n=[{key:"dataResponse",value:function(e){if(e&&e.data){var t=0;for(b[this.id].predictions=[];t<e.data.length;)b[this.id].predictions[t]=e.data[t].title,t+=1;this.emit("load_predictions",b[this.id].requestedQuery,b[this.id].predictions),b[this.id].pendingRequested?(b[this.id].requestedQuery=b[this.id].pendingRequested.query,(0,u.A_)(b[this.id].pendingRequested.url,!1,this.dataResponse),b[this.id].pendingRequested=null):b[this.id].requestedQuery=null}}},{key:"get",value:function(e){switch(e){case"search-query":return b[this.id].searchQuery;case"search-categories":return b[this.id].categoriesQuery;case"search-tags":return b[this.id].tagsQuery;case"search-topics":return b[this.id].topicsQuery;case"search-countries":return b[this.id].countriesQuery;case"search-languages":return b[this.id].languagesQuery}return null}},{key:"actions_handler",value:function(e){if("REQUEST_PREDICTIONS"===e.type){var t=e.query,n=this.mediacms_config.api.search.titles+t;if(b[this.id].requestedQuery)return void(b[this.id].requestedQuery.q!==t&&(b[this.id].pendingRequested={query:t,url:n}));b[this.id].requestedQuery=t,(0,u.A_)(n,!1,this.dataResponse)}}}])&&f(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),a}(c());(0,u.v$)(new v,"actions_handler"),n(8416),n(4564),n(9808);var g,w=(0,l.v)(window.MediaCMS),S=w.url,O=w.theme,I=w.member,k=O.switch.enabled&&"header"===O.switch.position,_=(i.createContext({hasThemeSwitcher:k,popupNavItems:{top:(g=[],I.is.anonymous||(I.can.addMedia&&(g.push({link:S.user.addMedia,icon:"video_call",text:"Upload media",itemAttr:{className:"visible-only-in-small"}}),I.pages.home&&g.push({link:I.pages.home,icon:"video_library",text:"My media"})),g.push({link:S.signout,icon:"exit_to_app",text:"Sign out"})),g),middle:function(){var e=[];return k&&e.push({itemType:"open-subpage",icon:"brightness_4",iconPos:"left",text:"Switch theme",buttonAttr:{className:"change-page","data-page-id":"switch-theme"}}),I.is.anonymous?(I.can.login&&e.push({itemType:"link",icon:"login",iconPos:"left",text:"Sign in",link:S.signin,linkAttr:{className:k?"visible-only-in-small":"visible-only-in-extra-small"}}),I.can.register&&e.push({itemType:"link",icon:"person_add",iconPos:"left",text:"Register",link:S.register,linkAttr:{className:k?"visible-only-in-small":"visible-only-in-extra-small"}})):(e.push({link:S.user.editProfile,icon:"brush",text:"Edit profile"}),I.can.changePassword&&e.push({link:S.changePassword,icon:"lock",text:"Change password"})),e}(),bottom:function(){var e=[];return I.is.admin&&e.push({link:S.admin,icon:"admin_panel_settings",text:"MediaCMS administration"}),e}()}}).Consumer,{switch:(0,l.v)(window.MediaCMS).theme.switch}),x=i.createContext(_),E=(x.Provider,x.Consumer,n(6498),n(3074)),M=n.n(E),P=n(2431),C=n(8349);function j(e){var t=(0,i.useContext)(o.Z),n={"aria-label":"Account profile photo that opens list of options and settings pages links",className:"thumbnail"};switch(e.isButton?void 0!==e.onClick&&(n.onClick=e.onClick):n.type="span",e.size){case"small":case"large":n.className+=" "+e.size+"-thumb"}return i.createElement(P.M,n,t.thumbnail?i.createElement("img",{src:t.thumbnail,alt:""}):i.createElement(a.O,{type:"person"}))}j.propTypes={isButton:M().bool,size:M().oneOf(["small","medium","large"]),onClick:M().func},j.defaultProps={isButton:!1,size:"medium"};var R=n(4860),A=n(8024),T=n(291);function N(e){return N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},N(e)}function Z(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function q(e,t){return q=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},q(e,t)}function F(e,t){if(t&&("object"===N(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function D(e){return D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},D(e)}function Q(e){"dark"===e?(0,A.Ec)(document.body,"dark_theme"):(0,A.dt)(document.body,"dark_theme")}var B=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&q(e,t)}(a,e);var t,n,r,i,o=(r=a,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=D(r);if(i){var n=D(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return F(this,e)});function a(){var e;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),e=o.call(this);var t,n,r,i,s,c=(0,l.v)(window.MediaCMS);return e.cache=new R.Z("MediaCMS["+c.site.id+"][theme]",86400),e.logos=(n=null,r=null,void 0!==(t=c.theme.logo).darkMode&&((0,T.Je)()&&void 0!==t.darkMode.svg&&""!==t.darkMode.svg?r=t.darkMode.svg:void 0!==t.darkMode.img&&""!==t.darkMode.img&&(r=t.darkMode.img)),void 0!==t.lightMode&&((0,T.Je)()&&void 0!==t.lightMode.svg&&""!==t.lightMode.svg?n=t.lightMode.svg:void 0!==t.lightMode.img&&""!==t.lightMode.img&&(n=t.lightMode.img)),null===n&&null===r||(null===n?n=r:null===r&&(r=n)),{light:n,dark:r}),e.state={mode:(i=e.cache.get("mode"),s=c.theme.mode,"light"===i||"dark"===i?i:s)},Q(e.state.mode),e}return t=a,(n=[{key:"get",value:function(e){switch(e){case"logo":return this.logos[this.state.mode];case"mode":return this.state.mode}}},{key:"actions_handler",value:function(e){"TOGGLE_MODE"===e.type&&(this.state.mode="light"===this.state.mode?"dark":"light",Q(this.state.mode),this.cache.set("mode",this.state.mode),this.emit("mode-change"))}}])&&Z(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),a}(c());(0,u.v$)(new B,"actions_handler"),n(8534),n(6760);var L=n(365);n(2070),n(5090),n(137),i.createContext((0,l.v)(window.MediaCMS).sidebar).Consumer;var U=n(9518),W=n(2276),G=n(3699);function V(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,o=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);a=!0);}catch(e){s=!0,i=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw i}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return $(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?$(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function $(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}!function(e,t){if(void 0!==t){var n=document.getElementById(e);null!==n&&r.Z.display(n,t,{},e)}}("page-embed",(function(){var e=V((0,i.useState)(!1),2),t=e[0],n=e[1],r=V((0,i.useState)(!1),2),o=r[0],a=r[1];function s(){n(!0)}function c(){a(!0)}return C.df("embed"),(0,i.useEffect)((function(){return W.Z.on("loaded_video_data",s),W.Z.on("loaded_media_error",c),G.loadMediaData(),function(){W.Z.removeListener("loaded_video_data",s),W.Z.removeListener("loaded_media_error",c)}}),[]),i.createElement("div",{className:"embed-wrap"},o?i.createElement("div",{className:"player-container player-container-error"},i.createElement("div",{className:"player-container-inner"},i.createElement("div",{className:"error-container"},i.createElement("div",{className:"error-container-inner"},i.createElement("span",{className:"icon-wrap"},i.createElement("i",{className:"material-icons"},"error_outline")),i.createElement("span",{className:"msg-wrap"},W.Z.get("media-load-error-message")))))):null,t?i.createElement(L.I,null,(function(e){return i.createElement(U.Z,{data:W.Z.get("media-data"),siteUrl:e.url})})):null)}))},6498:function(e,t,n){"use strict";n(8416)},4860:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}}),n(9751);var r=n(6228);function i(){var e="test-slug";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(e){return!1}}function o(e,t){return t=parseInt(t,10)||3600,i||console.warn(["Current browser does not support localStorage."]),e?{prefix:e,seconds:t,set:function(n,o,a,s){if(i){(a=a||t)||(s=(0,r.a)(["Invalid cache expiration value",a]));try{localStorage.setItem(e+"["+n+"]",JSON.stringify({value:o,expire:(new Date).getTime()+1e3*a})),s=!0}catch(e){s=(0,r.a)([e])}}return s},get:function(t,n){return null!==(n=(n=i?localStorage.getItem(e+"["+t+"]"):null)?JSON.parse(n):null)?void 0!==n.expire&&n.expire>(new Date).getTime()?n.value:null:n},clear:function(){var t;if(i&&Object.keys(localStorage).length)for(t in localStorage)localStorage.hasOwnProperty(t)&&0===t.indexOf(e)&&localStorage.removeItem(t);return!0}}:(0,r.O)(["Cache object prefix is required"])}},8416:function(e,t,n){var r=n(4835).Dispatcher;e.exports=new r},6760:function(e,t,n){"use strict";n(3233),n(9751),n(2004),n(8407),n(6394),n(8288),n(5677),n(2129),n(4655),n(288),n(4458),n(3675),n(2322);var r=n(5466),i=n(6116),o=n(3074),a=n.n(o);function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function c(e){var t,n,o=(0,r.useRef)(null),a=(t=(0,r.useState)(null),n=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,o=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);a=!0);}catch(e){s=!0,i=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw i}}return o}}(t,n)||function(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),c=a[0],u=a[1],l=[];function d(t,n){var r;n.preventDefault(),n.stopPropagation(),r=l[t].id,void 0!==e.pages[r]&&u(r)}return(0,r.useEffect)((function(){void 0!==e.pages[e.initPage]?u(e.initPage):Object.keys(e.pages).length?u(Object.keys(e.pages)[0]):u(null)}),[e.initPage]),(0,r.useEffect)((function(){!function(){for(var e=0;e<l.length;)l[e].elem.removeEventListener("click",l[e].listener),e+=1;l=[]}(),c&&(function(){var t,n,r=(0,i.findDOMNode)(o.current),a=r.querySelectorAll(e.pageChangeSelector);if(a.length)for(t=0;t<a.length;)(n=(n=a[t].getAttribute(e.pageIdSelectorAttr))?n.trim():n)&&(l[t]={id:n,elem:a[t]},l[t].listener=function(e){return function(t){return d(e,t)}}(t),l[t].elem.addEventListener("click",l[t].listener)),t+=1;e.focusFirstItemOnPageChange&&r.focus()}(),"function"==typeof e.pageChangeCallback&&e.pageChangeCallback(c))}),[c]),c?r.createElement("div",{ref:o},r.cloneElement(e.pages[c])):null}c.propTypes={initPage:a().string,pages:a().object.isRequired,pageChangeSelector:a().string.isRequired,pageIdSelectorAttr:a().string.isRequired,focusFirstItemOnPageChange:a().bool,pageChangeCallback:a().func},c.defaultProps={focusFirstItemOnPageChange:!0}},8534:function(e,t,n){"use strict";n(9808),n(3233),n(2070),n(4517);var r=n(5466),i=n(3074),o=n.n(i),a=n(2331);function s(){return s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s.apply(this,arguments)}function c(e){var t=[],n=e.itemAttr||{};void 0===n.className?n.className="":n.className&&(n.className+=" ");var i=e.text?e.icon&&"right"!==e.iconPos?1:0:-1,o=e.icon?e.text&&"right"===e.iconPos?1:0:-1;switch(-1<i&&(t[i]=r.createElement("span",{key:"Text"},e.text)),-1<o&&(t[o]=r.createElement("span",{key:"Icon",className:"right"===e.iconPos?"menu-item-icon-right":"menu-item-icon"},r.createElement(a.O,{type:e.icon}))),e.itemType){case"link":t=r.createElement("a",s({},e.linkAttr||{},{href:e.link,title:e.text||null}),t),n.className+="link-item"+(e.active?" active":"");break;case"button":case"open-subpage":t=r.createElement("button",s({},e.buttonAttr||{},{key:"button"}),t);break;case"label":t=r.createElement("button",s({},e.buttonAttr||{},{key:"button"}),r.createElement("span",null,e.text||null)),n.className="label-item";break;case"div":t=r.createElement("div",s({},e.divAttr||{},{key:"div"}),e.text||null)}return""!==n.className&&(n.className=" "+n.className),n.className=n.className.trim(),r.createElement("li",n,t)}function u(e){var t=e.items.map((function(e,t){return r.createElement(c,s({key:t},e))}));return t.length?r.createElement("div",{className:"nav-menu"+(e.removeVerticalPadding?" pv0":"")},r.createElement("nav",null,r.createElement("ul",null,t))):null}c.propTypes={itemType:o().oneOf(["link","open-subpage","button","label","div"]),link:o().string,icon:o().string,iconPos:o().oneOf(["left","right"]),text:o().string,active:o().bool,divAttr:o().object,buttonAttr:o().object,itemAttr:o().object,linkAttr:o().object},c.defaultProps={itemType:"link",iconPos:"left",active:!1},u.propTypes={removeVerticalPadding:o().bool,items:o().arrayOf(o().shape(c.propTypes)).isRequired},u.defaultProps={removeVerticalPadding:!1}},4564:function(e,t,n){"use strict";n(5466)},291:function(e,t,n){"use strict";function r(){return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")}n.d(t,{Je:function(){return r}}),n(2322),n(3296),n(7390),n(4669),n(7441),n(9268)},8736:function(e,t,n){"use strict";n(5466),n(2004),n(8407),n(6394),n(8288),n(5677),n(2129),n(4655),n(288),n(4458),n(3675),n(2322),n(6116),n(4564),n(291)},731:function(e,t,n){"use strict";function r(e,t,n){return e.scrollLeft?1+Math.ceil(e.scrollLeft/t):n}function i(e,t){void 0!==e&&(this.data={dom:{wrapper:e,firstItem:e.querySelector(t)},item:{width:null}},this.data.item.width=this.data.dom.firstItem.offsetWidth,this.state={initedAllStateValues:!1,currentSlide:1,maxSlideIndex:null,slideItemsFit:null,slideItems:null,totalItems:null,wrapper:{width:null,scrollWidth:null}})}n.d(t,{Z:function(){return i}}),i.prototype.updateDataStateOnResize=function(e,t){this.data.item.width=this.data.dom.firstItem.offsetWidth,this.state.wrapper.width=this.data.dom.wrapper.offsetWidth,this.state.wrapper.scrollWidth=this.data.dom.wrapper.scrollWidth,this.state.slideItemsFit=Math.floor(this.state.wrapper.width/this.data.item.width),this.state.slideItems=Math.max(1,this.state.slideItemsFit),t&&this.state.slideItems<=this.state.slideItemsFit&&(this.state.itemsLengthFit=this.state.slideItems),this.state.totalItems=e,this.state.maxSlideIndex=Math.max(this.state.totalItems-this.state.slideItemsFit+1),this.state.currentSlide=Math.min(this.state.currentSlide,this.state.maxSlideIndex||1),this.state.currentSlide<=this.state.slideItemsFit&&1<this.state.currentSlide&&(this.state.currentSlide=1)},i.prototype.updateDataState=function(e,t,n){!n&&this.state.initedAllStateValues||(this.state.initedAllStateValues=!0,this.state.wrapper.width=this.data.dom.wrapper.offsetWidth,this.state.wrapper.scrollWidth=this.data.dom.wrapper.scrollWidth,this.state.slideItemsFit=Math.floor(this.state.wrapper.width/this.data.item.width),this.state.slideItems=Math.max(1,this.state.slideItemsFit),t&&this.state.slideItems<=this.state.slideItemsFit&&(this.state.itemsLengthFit=this.state.slideItems)),this.state.totalItems=e,this.state.maxSlideIndex=Math.max(1,this.state.totalItems-this.state.slideItemsFit+1),this.state.currentSlide=Math.min(this.state.currentSlide,this.state.maxSlideIndex),this.state.currentSlide<=this.state.slideItemsFit&&1<this.state.currentSlide&&(this.state.currentSlide=1)},i.prototype.nextSlide=function(){this.state.currentSlide=Math.min(r(this.data.dom.wrapper,this.data.item.width,this.state.currentSlide)+this.state.slideItems,this.state.maxSlideIndex)},i.prototype.previousSlide=function(){this.state.currentSlide=Math.max(1,r(this.data.dom.wrapper,this.data.item.width,this.state.currentSlide)-this.state.slideItems)},i.prototype.scrollToCurrentSlide=function(){this.data.dom.wrapper.scrollLeft=this.data.item.width*(this.state.currentSlide-1)},i.prototype.hasNextSlide=function(){return this.state.currentSlide<this.state.maxSlideIndex},i.prototype.hasPreviousSlide=function(){return 1<this.state.currentSlide},i.prototype.currentSlide=function(){return this.state.currentSlide},i.prototype.loadItemsToFit=function(){return 2*this.state.slideItemsFit>this.state.totalItems},i.prototype.loadMoreItems=function(){return this.state.currentSlide+this.state.slideItemsFit>=this.state.maxSlideIndex},i.prototype.itemsFit=function(){return this.state.slideItemsFit}},1346:function(e,t,n){"use strict";var r=n(5466),i=n(5143);r.createContext((0,i.v)(window.MediaCMS).api).Consumer},1589:function(e,t,n){"use strict";var r=n(5466),i=n(5143);r.createContext((0,i.v)(window.MediaCMS).url).Consumer},2880:function(e,t,n){"use strict";var r=n(5466),i=n(5143),o=r.createContext((0,i.v)(window.MediaCMS).member);o.Consumer,t.Z=o},3140:function(e,t,n){"use strict";n(2322),n(9268)},9688:function(e,t,n){"use strict";n.d(t,{U:function(){return o}}),n(2322),n(3296),n(6394),n(4669);var r=n(137),i=n.n(r);function o(e,t){var n=i()(e,{});return""!==n.origin&&"null"!==n.origin&&n.origin||(n=i()(t+"/"+e.replace(/^\//g,""),{})),n.toString()}},8420:function(e,t,n){"use strict";n.d(t,{$A:function(){return l.Z},A_:function(){return r.Z},GH:function(){return o.Z},Jl:function(){return a.Z},UN:function(){return u.Z},j0:function(){return i.Z},m5:function(){return d.Z},uf:function(){return c.Z},v$:function(){return s.Z},vo:function(){return f.ZP}});var r=n(6638),i=n(9752),o=n(84),a=n(9009),s=n(1438),c=n(4135),u=(n(3140),n(1752),n(7514),n(4582)),l=n(4845),d=(n(1569),n(6203)),f=n(7188)},2186:function(e,t,n){"use strict";function r(e){return function(e){return e===Math.trunc(e)}(e)&&(function(e){return function(e,t){return e>0}(e)}(e)||function(e){return 0===e}(e))}n.d(t,{ZU:function(){return r}}),n(5777)},3699:function(e,t,n){"use strict";n.d(t,{loadMediaData:function(){return o}}),n(2322),n(3296);var r=n(8416),i=n.n(r);function o(){i().dispatch({type:"LOAD_MEDIA_DATA"})}},8349:function(e,t,n){"use strict";n.d(t,{df:function(){return o}});var r=n(8416),i=n.n(r);function o(e){i().dispatch({type:"INIT_PAGE",page:e})}},6157:function(e,t,n){"use strict";n(5101),n(6394),n(3080),n(2004),n(8407),n(8288),n(5677),n(2129),n(4655),n(5466);var r,i=n(1590),o=n.n(i),a=n(4860),s=n(8420),c=n(8024),u=n(5143),l=n(4426);function d(e){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d(e)}function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function p(e,t){return p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},p(e,t)}function h(e,t){if(t&&("object"===d(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return m(e)}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function y(e){return y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},y(e)}var b=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&p(e,t)}(d,e);var t,n,i,o,s=(i=d,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=y(i);if(o){var n=y(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return h(this,e)});function d(){var e;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,d),e=s.call(this);var t=(0,u.v)(window.MediaCMS);return e.cache=new a.Z("MediaCMS["+t.site.id+"][layout]",86400),e.state={enabledSidebar:!(!document.getElementById("app-sidebar")&&!document.querySelector(".page-sidebar")),visibleSidebar:e.cache.get("visible-sidebar"),visibleMobileSearch:!1},"media"===l.Z.get("current-page")?e.state.visibleSidebar=!1:e.state.visibleSidebar=1023<window.innerWidth&&(null===e.state.visibleSidebar||e.state.visibleSidebar),e.state.visibleSidebar?(0,c.Ec)(document.body,"visible-sidebar"):(0,c.dt)(document.body,"visible-sidebar"),l.Z.once("page_init",function(){"media"===l.Z.get("current-page")&&(e.state.visibleSidebar=!1,(0,c.dt)(document.body,"visible-sidebar"))}.bind(m(e))),e}return t=d,(n=[{key:"get",value:function(e){switch(e){case"enabled-sidebar":return this.state.enabledSidebar;case"visible-sidebar":return this.state.visibleSidebar;case"visible-mobile-search":return this.state.visibleMobileSearch;case"container-width":return window.innerWidth;case"container-height":return window.innerHeight}}},{key:"actions_handler",value:function(e){switch(e.type){case"TOGGLE_SIDEBAR":this.state.visibleSidebar=!this.state.visibleSidebar,t=this.state.visibleSidebar,clearTimeout(r),(0,c.Ec)(document.body,"sliding-sidebar"),r=setTimeout((function(){"media"===l.Z.get("current-page")?t?(0,c.Ec)(document.body,"overflow-hidden"):(0,c.dt)(document.body,"overflow-hidden"):!t||767<window.innerWidth?(0,c.dt)(document.body,"overflow-hidden"):(0,c.Ec)(document.body,"overflow-hidden"),t?(0,c.Ec)(document.body,"visible-sidebar"):(0,c.dt)(document.body,"visible-sidebar"),r=setTimeout((function(){r=null,(0,c.dt)(document.body,"sliding-sidebar")}),220)}),20),this.cache.set("visible-sidebar",this.state.visibleSidebar),this.emit("sidebar-visibility-change");break;case"CHANGE_MOBILE_SEARCH_VISIBILITY":this.state.visibleMobileSearch=e.visible,this.emit("mobile-search-visibility-change")}var t}}])&&f(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),d}(o());(0,s.v$)(new b,"actions_handler")}},n={};function r(e){var i=n[e];if(void 0!==i)return i.exports;var o=n[e]={exports:{}};return t[e].call(o.exports,o,o.exports,r),o.exports}r.m=t,e=[],r.O=function(t,n,i,o){if(!n){var a=1/0;for(l=0;l<e.length;l++){n=e[l][0],i=e[l][1],o=e[l][2];for(var s=!0,c=0;c<n.length;c++)(!1&o||a>=o)&&Object.keys(r.O).every((function(e){return r.O[e](n[c])}))?n.splice(c--,1):(s=!1,o<a&&(a=o));if(s){e.splice(l--,1);var u=i();void 0!==u&&(t=u)}}return t}o=o||0;for(var l=e.length;l>0&&e[l-1][2]>o;l--)e[l]=e[l-1];e[l]=[n,i,o]},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,{a:t}),t},r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.j=991,function(){var e={991:0};r.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,o,a=n[0],s=n[1],c=n[2],u=0;if(a.some((function(t){return 0!==e[t]}))){for(i in s)r.o(s,i)&&(r.m[i]=s[i]);if(c)var l=c(r)}for(t&&t(n);u<a.length;u++)o=a[u],r.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return r.O(l)},n=self.webpackChunkmediacms_frontend=self.webpackChunkmediacms_frontend||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var i=r.O(void 0,[431],(function(){return r(5959)}));i=r.O(i)}();