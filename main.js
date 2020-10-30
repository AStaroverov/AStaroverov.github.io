(()=>{"use strict";var __webpack_modules__={729:e=>{var t=Object.prototype.hasOwnProperty,n="~";function r(){}function o(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function s(e,t,r,s,i){if("function"!=typeof r)throw new TypeError("The listener must be a function");var a=new o(r,s||e,i),c=n?n+t:t;return e._events[c]?e._events[c].fn?e._events[c]=[e._events[c],a]:e._events[c].push(a):(e._events[c]=a,e._eventsCount++),e}function i(e,t){0==--e._eventsCount?e._events=new r:delete e._events[t]}function a(){this._events=new r,this._eventsCount=0}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),a.prototype.eventNames=function(){var e,r,o=[];if(0===this._eventsCount)return o;for(r in e=this._events)t.call(e,r)&&o.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(e)):o},a.prototype.listeners=function(e){var t=n?n+e:e,r=this._events[t];if(!r)return[];if(r.fn)return[r.fn];for(var o=0,s=r.length,i=new Array(s);o<s;o++)i[o]=r[o].fn;return i},a.prototype.listenerCount=function(e){var t=n?n+e:e,r=this._events[t];return r?r.fn?1:r.length:0},a.prototype.emit=function(e,t,r,o,s,i){var a=n?n+e:e;if(!this._events[a])return!1;var c,_,l=this._events[a],u=arguments.length;if(l.fn){switch(l.once&&this.removeListener(e,l.fn,void 0,!0),u){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,t),!0;case 3:return l.fn.call(l.context,t,r),!0;case 4:return l.fn.call(l.context,t,r,o),!0;case 5:return l.fn.call(l.context,t,r,o,s),!0;case 6:return l.fn.call(l.context,t,r,o,s,i),!0}for(_=1,c=new Array(u-1);_<u;_++)c[_-1]=arguments[_];l.fn.apply(l.context,c)}else{var p,v=l.length;for(_=0;_<v;_++)switch(l[_].once&&this.removeListener(e,l[_].fn,void 0,!0),u){case 1:l[_].fn.call(l[_].context);break;case 2:l[_].fn.call(l[_].context,t);break;case 3:l[_].fn.call(l[_].context,t,r);break;case 4:l[_].fn.call(l[_].context,t,r,o);break;default:if(!c)for(p=1,c=new Array(u-1);p<u;p++)c[p-1]=arguments[p];l[_].fn.apply(l[_].context,c)}}return!0},a.prototype.on=function(e,t,n){return s(this,e,t,n,!1)},a.prototype.once=function(e,t,n){return s(this,e,t,n,!0)},a.prototype.removeListener=function(e,t,r,o){var s=n?n+e:e;if(!this._events[s])return this;if(!t)return i(this,s),this;var a=this._events[s];if(a.fn)a.fn!==t||o&&!a.once||r&&a.context!==r||i(this,s);else{for(var c=0,_=[],l=a.length;c<l;c++)(a[c].fn!==t||o&&!a[c].once||r&&a[c].context!==r)&&_.push(a[c]);_.length?this._events[s]=1===_.length?_[0]:_:i(this,s)}return this},a.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&i(this,t)):(this._events=new r,this._eventsCount=0),this},a.prototype.off=a.prototype.removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=n,a.EventEmitter=a,e.exports=a},954:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>PseudoWorker});var eventemitter3__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(729),eventemitter3__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(eventemitter3__WEBPACK_IMPORTED_MODULE_0__);class PseudoWorker extends(eventemitter3__WEBPACK_IMPORTED_MODULE_0___default()){constructor(scriptFile){super();let timer=null;this.self=new(eventemitter3__WEBPACK_IMPORTED_MODULE_0___default()),this.self.location=globalThis.location,this.self.requestAnimationFrame=globalThis.requestAnimationFrame,this.self.cancelAnimationFrame=globalThis.cancelAnimationFrame,this.self.onmessage=null,this.self.onerror=null,this.self.postMessage=function(e){return timer=globalThis.setTimeout((()=>{this.emit("message",{data:e})})),!0},this.self.addEventListener=function(e,t){this.on(e,t)},this.self.removeEventListener=function(e,t){this.off(e,t)},this.self.terminate=function(){return"number"==typeof timer&&(clearTimeout(timer),timer=null),!0};const importScripts=function(){const e=Array.prototype.slice.call(arguments);for(let t=0,n=e.length;t<n;t++){const n=document.createElement("script");n.src=e[t],n.setAttribute("type","text/javascript"),document.getElementsByTagName("head")[0].appendChild(n)}},http=new XMLHttpRequest;if(http.open("GET",scriptFile,!1),http.send(null),4===http.readyState){const strResponse=http.responseText;404!==http.status&&500!==http.status&&(globalThis.__workerContext__=this.self,eval(strResponse))}}postMessage(e){this.self.emit("message",{data:e})}addEventListener(e,t){this.self.on(e,t)}removeEventListener(e,t){this.self.off(e,t)}}}},__webpack_module_cache__={};function __webpack_require__(e){if(__webpack_module_cache__[e])return __webpack_module_cache__[e].exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{function e(e,t,n,r){try{e.postMessage({type:t,payload:n},r||[])}catch(e){throw new Error("Can't send message to worker - "+e.message)}}var t=__webpack_require__(954);const n=globalThis.devicePixelRatio||1;Symbol("shouldStopImmediatePropagation"),Symbol("shouldStopPropagation"),Symbol("shouldPreventDefault");const r=["AT_TARGET","BUBBLING_PHASE","CAPTURING_PHASE","NONE","altKey","bubbles","button","buttons","cancelBubble","cancelable","clientX","clientY","composed","ctrlKey","defaultPrevented","detail","eventPhase","isTrusted","layerX","layerY","metaKey","movementX","movementY","offsetX","offsetY","pageX","pageY","returnValue","screenX","screenY","shiftKey","timeStamp","type","which","x","y","wheelDelta","wheelDeltaX","wheelDeltaY","deltaMode","deltaX","deltaY","deltaZ","detail","eventPhase"];const o=void 0!==HTMLCanvasElement.prototype.transferControlToOffscreen;function s(e){const t=e.getBoundingClientRect();e.width=t.width*n,e.height=t.height*n}!async function(i,a){const c=Array.from(i.querySelectorAll("canvas")),_=new(o?Worker:t.Z)("/dist/worker.js");if(c.forEach(s),await async function(e,t){return await new Promise((t=>{const n=function(e,r,o){const s=e=>{0===e.data.type&&(({data:e})=>{n(),t(e.payload)})(e)};return e.addEventListener("message",s),()=>e.removeEventListener("message",s)}(e)}))}(_),o){const t=c.map((e=>e.transferControlToOffscreen()));e(_,1,{devicePixelRatio:n,canvases:t},o?t:[])}else e(_,1,{devicePixelRatio:n,canvases:c});const l=function(t,o){const s=s=>{const i=function(e){const t={};return r.forEach((n=>{n in e&&(t[n]=e[n])})),t}(s);s instanceof MouseEvent&&function(e,t,r){e.clientX=n*(t.clientX-r.left),e.clientY=n*(t.clientY-r.top),e.x=e.clientX,e.y=e.clientY,e.movementX=n*t.movementX,e.movementY=n*t.movementY,e.original={clientX:e.clientX,clientY:e.clientY,x:e.x,y:e.y,movementX:e.movementX,movementY:e.movementY}}(i,s,o.getBoundingClientRect()),e(t,2,{event:i})};return o.addEventListener("click",s),o.addEventListener("mousemove",s),o.addEventListener("mousedown",s),o.addEventListener("mouseup",s),o.addEventListener("mouseenter",s),o.addEventListener("mouseleave",s),o.addEventListener("wheel",s,{passive:!0}),o.addEventListener("keydown",s),o.addEventListener("keypress",s),o.addEventListener("keyup",s),()=>{o.removeEventListener("click",s),o.removeEventListener("mousemove",s),o.removeEventListener("mousedown",s),o.removeEventListener("mouseup",s),o.removeEventListener("mouseenter",s),o.removeEventListener("mouseleave",s),o.removeEventListener("wheel",s),o.removeEventListener("keydown",s),o.removeEventListener("keypress",s),o.removeEventListener("keyup",s)}}(_,i),u=_.terminate;_.terminate=()=>{u.call(_),l()}}(document.getElementById("root"))})()})();