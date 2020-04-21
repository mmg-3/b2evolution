/* This includes 2 files: jquery.textcomplete.js, textcomplete.init.js */

!function(t){if("function"==typeof define&&define.amd)define(["jquery"],t);else if("object"==typeof module&&module.exports){var e=require("jquery");module.exports=t(e)}else t(jQuery)}(function(t){if(void 0===t)throw new Error("jQuery.textcomplete requires jQuery");var e,c,d,u;return function(s){"use strict";var r=1;s.fn.textcomplete=function(e,i){var o=Array.prototype.slice.call(arguments);return this.each(function(){var t=s(this),n=t.data("textComplete");if(n||((i=i||{})._oid=r++,n=new s.fn.textcomplete.Completer(this,i),t.data("textComplete",n)),"string"==typeof e){if(!n)return;o.shift(),n[e].apply(n,o),"destroy"===e&&t.removeData("textComplete")}else s.each(e,function(i){s.each(["header","footer","placement","maxCount"],function(t){var e;i[t]&&(n.option[t]=i[t],e=t+"as a strategy param is deprecated. Use option.",console.warn&&console.warn(e),delete i[t])})}),n.register(s.fn.textcomplete.Strategy.parse(e,{el:this,$el:t}))})}}(t),function(a){"use strict";var n,o,s,r=0;function l(t,e){if(this.$el=a(t),this.id="textcomplete"+r++,this.strategies=[],this.views=[],this.option=a.extend({},l.defaults,e),!(this.$el.is("input[type=text]")||this.$el.is("input[type=search]")||this.$el.is("textarea")||t.isContentEditable||"true"==t.contentEditable))throw new Error("textcomplete must be called on a Textarea or a ContentEditable.");if(t===t.ownerDocument.activeElement)this.initialize();else{var i=this;this.$el.one("focus."+this.id,function(){i.initialize()}),this.option.adapter&&"CKEditor"!=this.option.adapter||"undefined"==typeof CKEDITOR||!this.$el.is("textarea")||CKEDITOR.on("instanceReady",function(e){e.editor.once("focus",function(t){i.$el=a(e.editor.editable().$),i.option.adapter||(i.option.adapter=a.fn.textcomplete.CKEditor,i.option.ckeditor_instance=e.editor),i.initialize()})})}}l.defaults={appendTo:"body",className:"",dropdownClassName:"dropdown-menu textcomplete-dropdown",maxCount:10,zIndex:"100",rightEdgeOffset:30},a.extend(l.prototype,{id:null,option:null,strategies:null,adapter:null,dropdown:null,$el:null,$iframe:null,initialize:function(){var t,e,i=this.$el.get(0);if(this.$el.prop("ownerDocument")!==document&&window.frames.length)for(var n=0;n<window.frames.length;n++)if(this.$el.prop("ownerDocument")===window.frames[n].document){this.$iframe=a(window.frames[n].frameElement);break}this.dropdown=new a.fn.textcomplete.Dropdown(i,this,this.option),t=this.option.adapter?this.option.adapter:(e=this.$el.is("textarea")||this.$el.is("input[type=text]")||this.$el.is("input[type=search]")?"number"==typeof i.selectionEnd?"Textarea":"IETextarea":"ContentEditable",a.fn.textcomplete[e]),this.adapter=new t(i,this,this.option)},destroy:function(){this.$el.off("."+this.id),this.adapter&&this.adapter.destroy(),this.dropdown&&this.dropdown.destroy(),this.$el=this.adapter=this.dropdown=null},deactivate:function(){this.dropdown&&this.dropdown.deactivate()},trigger:function(t,e){this.dropdown||this.initialize(),null!=t||(t=this.adapter.getTextFromHeadToCaret());var i=this._extractSearchQuery(t);if(i.length){var n=i[1];if(e&&this._term===n&&""!==n)return;this._term=n,this._search.apply(this,i)}else this._term=null,this.dropdown.deactivate()},fire:function(t){var e=Array.prototype.slice.call(arguments,1);return this.$el.trigger(t,e),this},register:function(t){Array.prototype.push.apply(this.strategies,t)},select:function(t,e,i){this._term=null,this.adapter.select(t,e,i),this.fire("change").fire("textComplete:select",t,e),this.adapter.focus()},_clearAtNext:!0,_term:null,_extractSearchQuery:function(t){for(var e=0;e<this.strategies.length;e++){var i=this.strategies[e],n=i.context(t);if(n||""===n){var o=a.isFunction(i.match)?i.match(t):i.match;r=n,"[object String]"===Object.prototype.toString.call(r)&&(t=n);var s=t.match(o);if(s)return[i,s[i.index],s]}}var r;return[]},_search:(n=function(i,n,o,t){var s=this;n.search(o,function(t,e){s.dropdown.shown||s.dropdown.activate(),s._clearAtNext&&(s.dropdown.clear(),s._clearAtNext=!1),s.dropdown.setPosition(s.adapter.getCaretPosition()),s.dropdown.render(s._zip(t,n,o)),e||(i(),s._clearAtNext=!0)},t)},function(){var t=Array.prototype.slice.call(arguments);if(o)s=t;else{o=!0;var i=this;t.unshift(function t(){if(s){var e=s;s=void 0,e.unshift(t),n.apply(i,e)}else o=!1}),n.apply(this,t)}}),_zip:function(t,e,i){return a.map(t,function(t){return{value:t,strategy:e,term:i}})}}),a.fn.textcomplete.Completer=l}(t),function(o){"use strict";function s(t,e){var i,n,o=e.strategy.idProperty;for(i=0;i<t.length;i++)if((n=t[i]).strategy===e.strategy)if(o){if(n.value[o]===e.value[o])return!0}else if(n.value===e.value)return!0;return!1}var r=o(window),a={};o(document).on("click",function(t){var i=t.originalEvent&&t.originalEvent.keepTextCompleteDropdown;o.each(a,function(t,e){t!==i&&e.deactivate()})});var i={SKIP_DEFAULT:0,KEY_UP:1,KEY_DOWN:2,KEY_ENTER:3,KEY_PAGEUP:4,KEY_PAGEDOWN:5,KEY_ESCAPE:6};function l(t,e,i){this.$el=l.createElement(i),this.completer=e,this.id=e.id+"dropdown",this._data=[],this.$inputEl=o(t),(this.option=i).listPosition&&(this.setPosition=i.listPosition),i.height&&this.$el.height(i.height);var n=this;o.each(["maxCount","placement","footer","header","noResultsMessage","className"],function(t,e){null!=i[e]&&(n[e]=i[e])}),this._bindEvents(t),a[this.id]=this}o.extend(l,{createElement:function(t){var e=t.appendTo;return e instanceof o||(e=o(e)),o("<ul></ul>").addClass(t.dropdownClassName).attr("id","textcomplete-dropdown-"+t._oid).css({display:"none",left:0,position:"absolute",zIndex:t.zIndex}).appendTo(e)}}),o.extend(l.prototype,{$el:null,$inputEl:null,completer:null,footer:null,header:null,id:null,maxCount:null,placement:"",shown:!1,data:[],className:"",destroy:function(){this.deactivate(),this.$el.off("."+this.id),this.$inputEl.off("."+this.id),this.clear(),this.$el.remove(),this.$el=this.$inputEl=this.completer=null,delete a[this.id]},render:function(t){var e=this._buildContents(t),i=o.map(t,function(t){return t.value});if(t.length){var n=t[0].strategy;n.id?this.$el.attr("data-strategy",n.id):this.$el.removeAttr("data-strategy"),this._renderHeader(i),this._renderFooter(i),e&&(this._renderContents(e),this._fitToBottom(),this._fitToRight(),this._activateIndexedItem()),this._setScroll()}else this.noResultsMessage?this._renderNoResultsMessage(i):this.shown&&this.deactivate()},setPosition:function(t){var e="absolute";return this.$inputEl.add(this.$inputEl.parents()).each(function(){return"absolute"!==o(this).css("position")&&("fixed"===o(this).css("position")?(t.top-=r.scrollTop(),t.left-=r.scrollLeft(),!(e="fixed")):void 0)}),this.$el.css(this._applyPlacement(t)),this.$el.css({position:e}),this},clear:function(){this.$el.html(""),this.data=[],this._index=0,this._$header=this._$footer=this._$noResultsMessage=null},activate:function(){return this.shown||(this.clear(),this.$el.show(),this.className&&this.$el.addClass(this.className),this.completer.fire("textComplete:show"),this.shown=!0),this},deactivate:function(){return this.shown&&(this.$el.hide(),this.className&&this.$el.removeClass(this.className),this.completer.fire("textComplete:hide"),this.shown=!1),this},isUp:function(t){return 38===t.keyCode||t.ctrlKey&&80===t.keyCode},isDown:function(t){return 40===t.keyCode||t.ctrlKey&&78===t.keyCode},isEnter:function(t){return!(t.ctrlKey||t.altKey||t.metaKey||t.shiftKey)&&(13===t.keyCode||9===t.keyCode||!0===this.option.completeOnSpace&&32===t.keyCode)},isPageup:function(t){return 33===t.keyCode},isPagedown:function(t){return 34===t.keyCode},isEscape:function(t){return 27===t.keyCode},_data:null,_index:null,_$header:null,_$noResultsMessage:null,_$footer:null,_bindEvents:function(){this.$el.on("mousedown."+this.id,".textcomplete-item",o.proxy(this._onClick,this)),this.$el.on("touchstart."+this.id,".textcomplete-item",o.proxy(this._onClick,this)),this.$el.on("mouseover."+this.id,".textcomplete-item",o.proxy(this._onMouseover,this)),this.$inputEl.on("keydown."+this.id,o.proxy(this._onKeydown,this))},_onClick:function(t){var e=o(t.target);t.preventDefault(),t.originalEvent.keepTextCompleteDropdown=this.id,e.hasClass("textcomplete-item")||(e=e.closest(".textcomplete-item"));var i=this.data[parseInt(e.data("index"),10)];this.completer.select(i.value,i.strategy,t);var n=this;setTimeout(function(){n.deactivate(),"touchstart"===t.type&&n.$inputEl.focus()},0)},_onMouseover:function(t){var e=o(t.target);t.preventDefault(),e.hasClass("textcomplete-item")||(e=e.closest(".textcomplete-item")),this._index=parseInt(e.data("index"),10),this._activateIndexedItem()},_onKeydown:function(t){var e;if(this.shown)switch(o.isFunction(this.option.onKeydown)&&(e=this.option.onKeydown(t,i)),null==e&&(e=this._defaultKeydown(t)),e){case i.KEY_UP:t.preventDefault(),this._up();break;case i.KEY_DOWN:t.preventDefault(),this._down();break;case i.KEY_ENTER:t.preventDefault(),this._enter(t);break;case i.KEY_PAGEUP:t.preventDefault(),this._pageup();break;case i.KEY_PAGEDOWN:t.preventDefault(),this._pagedown();break;case i.KEY_ESCAPE:t.preventDefault(),this.deactivate()}},_defaultKeydown:function(t){return this.isUp(t)?i.KEY_UP:this.isDown(t)?i.KEY_DOWN:this.isEnter(t)?i.KEY_ENTER:this.isPageup(t)?i.KEY_PAGEUP:this.isPagedown(t)?i.KEY_PAGEDOWN:this.isEscape(t)?i.KEY_ESCAPE:void 0},_up:function(){0===this._index?this._index=this.data.length-1:--this._index,this._activateIndexedItem(),this._setScroll()},_down:function(){this._index===this.data.length-1?this._index=0:this._index+=1,this._activateIndexedItem(),this._setScroll()},_enter:function(t){var e=this.data[parseInt(this._getActiveElement().data("index"),10)];this.completer.select(e.value,e.strategy,t),this.deactivate()},_pageup:function(){var e=0,i=this._getActiveElement().position().top-this.$el.innerHeight();this.$el.children().each(function(t){if(o(this).position().top+o(this).outerHeight()>i)return e=t,!1}),this._index=e,this._activateIndexedItem(),this._setScroll()},_pagedown:function(){var e=this.data.length-1,i=this._getActiveElement().position().top+this.$el.innerHeight();this.$el.children().each(function(t){if(o(this).position().top>i)return e=t,!1}),this._index=e,this._activateIndexedItem(),this._setScroll()},_activateIndexedItem:function(){this.$el.find(".textcomplete-item.active").removeClass("active"),this._getActiveElement().addClass("active")},_getActiveElement:function(){return this.$el.children(".textcomplete-item:nth("+this._index+")")},_setScroll:function(){var t=this._getActiveElement(),e=t.position().top,i=t.outerHeight(),n=this.$el.innerHeight(),o=this.$el.scrollTop();0===this._index||this._index==this.data.length-1||e<0?this.$el.scrollTop(e+o):n<e+i&&this.$el.scrollTop(e+i+o-n)},_buildContents:function(t){var e,i,n,o="";for(i=0;i<t.length&&this.data.length!==this.maxCount;i++)e=t[i],s(this.data,e)||(n=this.data.length,this.data.push(e),o+='<li class="textcomplete-item" data-index="'+n+'"><a>',o+=e.strategy.template(e.value,e.term),o+="</a></li>");return o},_renderHeader:function(t){if(this.header){this._$header||(this._$header=o('<li class="textcomplete-header"></li>').prependTo(this.$el));var e=o.isFunction(this.header)?this.header(t):this.header;this._$header.html(e)}},_renderFooter:function(t){if(this.footer){this._$footer||(this._$footer=o('<li class="textcomplete-footer"></li>').appendTo(this.$el));var e=o.isFunction(this.footer)?this.footer(t):this.footer;this._$footer.html(e)}},_renderNoResultsMessage:function(t){if(this.noResultsMessage){this._$noResultsMessage||(this._$noResultsMessage=o('<li class="textcomplete-no-results-message"></li>').appendTo(this.$el));var e=o.isFunction(this.noResultsMessage)?this.noResultsMessage(t):this.noResultsMessage;this._$noResultsMessage.html(e)}},_renderContents:function(t){this._$footer?this._$footer.before(t):this.$el.append(t)},_fitToBottom:function(){var t=r.scrollTop()+r.height(),e=this.$el.height();this.$el.position().top+e>t&&(this.completer.$iframe||this.$el.offset({top:t-e}))},_fitToRight:function(){for(var t,e=this.option.rightEdgeOffset,i=this.$el.offset().left,n=this.$el.width(),o=r.width()-e;o<i+n&&(this.$el.offset({left:i-e}),!(i<=(t=this.$el.offset().left)));)i=t},_applyPlacement:function(t){return-1!==this.placement.indexOf("top")?t={top:"auto",bottom:this.$el.parent().height()-t.top+t.lineHeight,left:t.left}:(t.bottom="auto",delete t.lineHeight),-1!==this.placement.indexOf("absleft")?t.left=0:-1!==this.placement.indexOf("absright")&&(t.right=0,t.left="auto"),t}}),o.fn.textcomplete.Dropdown=l,o.extend(o.fn.textcomplete,i)}(t),function(e){"use strict";function n(t){var n,o;e.extend(this,t),this.cache&&(this.search=(n=this.search,o={},function(e,i){o[e]?i(o[e]):n.call(this,e,function(t){o[e]=(o[e]||[]).concat(t),i.apply(null,arguments)})}))}n.parse=function(t,i){return e.map(t,function(t){var e=new n(t);return e.el=i.el,e.$el=i.$el,e})},e.extend(n.prototype,{match:null,replace:null,search:null,id:null,cache:!1,context:function(){return!0},index:2,template:function(t){return t},idProperty:null}),e.fn.textcomplete.Strategy=n}(t),function(d){"use strict";var u=Date.now||function(){return(new Date).getTime()};function t(){}d.extend(t.prototype,{id:null,completer:null,el:null,$el:null,option:null,initialize:function(t,e,i){var n,o,s,r,a,l,h,c;this.el=t,this.$el=d(t),this.id=e.id+this.constructor.name,this.completer=e,this.option=i,this.option.debounce&&(this._onKeyup=(n=this._onKeyup,o=this.option.debounce,c=function(){var t=u()-l;t<o?s=setTimeout(c,o-t):(s=null,h=n.apply(a,r),a=r=null)},function(){return a=this,r=arguments,l=u(),s=s||setTimeout(c,o),h})),this._bindEvents()},destroy:function(){this.$el.off("."+this.id),this.$el=this.el=this.completer=null},select:function(){throw new Error("Not implemented")},getCaretPosition:function(){var t=this._getCaretRelativePosition(),e=this.$el.offset(),i=this.option.appendTo;if(i){i instanceof d||(i=d(i));var n=i.offsetParent().offset();e.top-=n.top,e.left-=n.left}return t.top+=e.top,t.left+=e.left,t},focus:function(){this.$el.focus()},_bindEvents:function(){this.$el.on("keyup."+this.id,d.proxy(this._onKeyup,this))},_onKeyup:function(t){this._skipSearch(t)||this.completer.trigger(this.getTextFromHeadToCaret(),!0)},_skipSearch:function(t){switch(t.keyCode){case 9:case 13:case 16:case 17:case 18:case 33:case 34:case 40:case 38:case 27:return!0}if(t.ctrlKey)switch(t.keyCode){case 78:case 80:return!0}}}),d.fn.textcomplete.Adapter=t}(t),function(a){"use strict";function t(t,e,i){this.initialize(t,e,i)}a.extend(t.prototype,a.fn.textcomplete.Adapter.prototype,{select:function(t,e,i){var n,o=this.getTextFromHeadToCaret(),s=this.el.value.substring(this.el.selectionEnd),r=e.replace(t,i);void 0!==r&&(a.isArray(r)&&(s=r[1]+s,r=r[0]),n=a.isFunction(e.match)?e.match(o):e.match,o=o.replace(n,r),this.$el.val(o+s),this.el.selectionStart=this.el.selectionEnd=o.length)},getTextFromHeadToCaret:function(){return this.el.value.substring(0,this.el.selectionEnd)},_getCaretRelativePosition:function(){var t=a.fn.textcomplete.getCaretCoordinates(this.el,this.el.selectionStart);return{top:t.top+this._calculateLineHeight()-this.$el.scrollTop(),left:t.left-this.$el.scrollLeft(),lineHeight:this._calculateLineHeight()}},_calculateLineHeight:function(){var t=parseInt(this.$el.css("line-height"),10);if(isNaN(t)){var e=this.el.parentNode,i=document.createElement(this.el.nodeName),n=this.el.style;i.setAttribute("style","margin:0px;padding:0px;font-family:"+n.fontFamily+";font-size:"+n.fontSize),i.innerHTML="test",e.appendChild(i),t=i.clientHeight,e.removeChild(i)}return t}}),a.fn.textcomplete.Textarea=t}(t),function(l){"use strict";function t(t,e,i){this.initialize(t,e,i),l("<span>吶</span>").css({position:"absolute",top:-9999,left:-9999}).insertBefore(t)}l.extend(t.prototype,l.fn.textcomplete.Textarea.prototype,{select:function(t,e,i){var n,o=this.getTextFromHeadToCaret(),s=this.el.value.substring(o.length),r=e.replace(t,i);if(void 0!==r){l.isArray(r)&&(s=r[1]+s,r=r[0]),n=l.isFunction(e.match)?e.match(o):e.match,o=o.replace(n,r),this.$el.val(o+s),this.el.focus();var a=this.el.createTextRange();a.collapse(!0),a.moveEnd("character",o.length),a.moveStart("character",o.length),a.select()}},getTextFromHeadToCaret:function(){this.el.focus();var t=document.selection.createRange();t.moveStart("character",-this.el.value.length);var e=t.text.split("吶");return 1===e.length?e[0]:e[1]}}),l.fn.textcomplete.IETextarea=t}(t),function(m){"use strict";function t(t,e,i){this.initialize(t,e,i)}m.extend(t.prototype,m.fn.textcomplete.Adapter.prototype,{select:function(t,e,i){var n=this.getTextFromHeadToCaret(),o=this.el.ownerDocument.getSelection(),s=o.getRangeAt(0),r=s.cloneRange();r.selectNodeContents(s.startContainer);var a,l=r.toString().substring(s.startOffset),h=e.replace(t,i);if(void 0!==h){m.isArray(h)&&(l=h[1]+l,h=h[0]),a=m.isFunction(e.match)?e.match(n):e.match,n=n.replace(a,h).replace(/ $/,"&nbsp"),s.selectNodeContents(s.startContainer),s.deleteContents();var c=this.el.ownerDocument.createElement("div");c.innerHTML=n;var d=this.el.ownerDocument.createElement("div");d.innerHTML=l;for(var u,p,f=this.el.ownerDocument.createDocumentFragment();u=c.firstChild;)p=f.appendChild(u);for(;u=d.firstChild;)f.appendChild(u);s.insertNode(f),s.setStartAfter(p),s.collapse(!0),o.removeAllRanges(),o.addRange(s)}},_getCaretRelativePosition:function(){var t=this.el.ownerDocument.getSelection().getRangeAt(0).cloneRange(),e=this.el.ownerDocument.createElement("span");t.insertNode(e),t.selectNodeContents(e),t.deleteContents();var i=m(e),n=i.offset();if(n.left-=this.$el.offset().left,n.top+=i.height()-this.$el.offset().top,n.lineHeight=i.height(),this.completer.$iframe){var o=this.completer.$iframe.offset();n.top+=o.top,n.left+=o.left,n.top-=this.$el.scrollTop()}return i.remove(),n},getTextFromHeadToCaret:function(){var t=this.el.ownerDocument.getSelection().getRangeAt(0),e=t.cloneRange();return e.selectNodeContents(t.startContainer),e.toString().substring(0,t.startOffset)}}),m.fn.textcomplete.ContentEditable=t}(t),function(t){"use strict";function e(t,e,i){this.initialize(t,e,i)}t.extend(e.prototype,t.fn.textcomplete.ContentEditable.prototype,{_bindEvents:function(){var i=this;this.option.ckeditor_instance.on("key",function(t){var e=t.data;if(i._onKeyup(e),i.completer.dropdown.shown&&i._skipSearch(e))return!1},null,null,1),this.$el.on("keyup."+this.id,t.proxy(this._onKeyup,this))}}),t.fn.textcomplete.CKEditor=e}(t),e=t,c=["direction","boxSizing","width","height","overflowX","overflowY","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderStyle","paddingTop","paddingRight","paddingBottom","paddingLeft","fontStyle","fontVariant","fontWeight","fontStretch","fontSize","fontSizeAdjust","lineHeight","fontFamily","textAlign","textTransform","textIndent","textDecoration","letterSpacing","wordSpacing","tabSize","MozTabSize"],d="undefined"!=typeof window,u=d&&null!=window.mozInnerScreenX,e.fn.textcomplete.getCaretCoordinates=function(t,e,i){if(!d)throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");var n=i&&i.debug||!1;if(n){var o=document.querySelector("#input-textarea-caret-position-mirror-div");o&&o.parentNode.removeChild(o)}var s=document.createElement("div");s.id="input-textarea-caret-position-mirror-div",document.body.appendChild(s);var r=s.style,a=window.getComputedStyle?getComputedStyle(t):t.currentStyle;r.whiteSpace="pre-wrap","INPUT"!==t.nodeName&&(r.wordWrap="break-word"),r.position="absolute",n||(r.visibility="hidden"),c.forEach(function(t){r[t]=a[t]}),u?t.scrollHeight>parseInt(a.height)&&(r.overflowY="scroll"):r.overflow="hidden",s.textContent=t.value.substring(0,e),"INPUT"===t.nodeName&&(s.textContent=s.textContent.replace(/\s/g," "));var l=document.createElement("span");l.textContent=t.value.substring(e)||".",s.appendChild(l);var h={top:l.offsetTop+parseInt(a.borderTopWidth),left:l.offsetLeft+parseInt(a.borderLeftWidth)};return n?l.style.backgroundColor="#aaa":document.body.removeChild(s),h},t}),window.init_autocomplete_usernames=function(){var s=[];jQuery(".user.login, option[data-login]").each(function(){var t="OPTION"==jQuery(this).prop("tagName")?jQuery(this).data("login"):jQuery(this).text();""!=t&&-1==s.indexOf(t)&&("@"==t[0]&&(t=t.substr(1)),s.push(t))}),jQuery("textarea.autocomplete_usernames").textcomplete([{match:/\B@(\w+)$/,search:function(n,o){n.length<4?o(jQuery.map(s,function(t){return 0===t.indexOf(n)?t:null})):jQuery.ajax({type:"GET",dataType:"JSON",url:restapi_url+"users/autocomplete",data:{q:n,mentioned:s,blog:"undefined"==typeof blog?0:blog},success:function(t){if(void 0===t.users)return null;var e=[];for(var i in t.users)e.push(t.users[i].login);e=e.concat(s),o(jQuery.map(e,function(t){return 0===t.indexOf(n)?t:null}))}})},index:1,replace:function(t){return"@"+t+" "},cache:!0}])},jQuery(document).ready(function(){var t=!1;if("undefined"!=typeof navigator&&void 0!==navigator.appVersion){var e=navigator.appVersion.match(/msie (\d+)/i);e&&(t=parseInt(e[1]))}t&&t<=9||init_autocomplete_usernames()});