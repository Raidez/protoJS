/*!
 * ProtoJS v1.0.0
 * https://github.com/Raidez/protoJS
 */

//#region FONCTIONS POUR UN ELEMENT
/*-----------------------------------
	FONCTIONS POUR UN ELEMENT
-----------------------------------*/
/**
 * Recherche un élément avec un sélecteur CSS ou convertit un élément en objet ProtoJS
 * @param {string|Element} selector Sélecteur CSS ou élément
 * @constructor
 */
function $(selector) {
	/// permet d'invoquer l'objet sans utiliser le mot-clé 'new'
	if (!(this instanceof $)){
		return new $(selector);
	}

	if (typeof selector == "string") {
		this.selector = selector;
		this.node = document.querySelector(selector);
	} else if (typeof selector == "object") {
		this.node = selector;
	}
	this.tag = this.node.tagName.toLowerCase();
	if (this.node.hasOwnProperty('events')) {
		this.events = this.node.events;
	} else {
		this.events = this.node.events = [];
	}
}

/**
 * Récupère/modifie la valeur de l'élément
 * @param {any} [value] Nouvelle valeur de l'élément
 * @returns {string}
 */
$.prototype.val = function(value = null) {
	if (value != null) {
		this.node.value = value;
		return this;
	} else {
		return this.node.value;
	}
};

/**
 * Change le contenu HTML de l'élément
 * @param {string} [content]
 * @returns {$|string}
 */
$.prototype.html = function(content = null) {
	if (content != null) {
		this.node.innerHTML = content;
		return this;
	} else {
		return this.node.innerHTML;
	}
};

/**
 * Change le texte de l'élément
 * @param {string} [content]
 * @returns {$|string}
 */
$.prototype.text = function(content = null) {
	if (content != null) {
		this.node.innerText = content;
		return this;
	} else {
		return this.node.innerText;
	}
};

/**
 * Vérifie si l'élément correspond au filtre
 * @param {string} filter Filtre CSS
 * @returns {boolean}
 */
$.prototype.is = function(filter) {
	return this.node.matches(filter);
};

/**
 * Récupère l'élément suivant
 * @returns {$} L'élément suivant
 */
$.prototype.next = function() {
	return $(this.node.nextElementSibling);
};

/**
 * Récupère l'élément précédant
 * @returns {$} L'élément précédant
 */
$.prototype.prev = function() {
	return $(this.node.previousElementSibling);
};

/**
 * Récupère les éléments descendants avec un sélecteur CSS
 * @param {string} selector Sélecteur CSS
 * @returns {$$} Collection
 */
$.prototype.find = function(selector) {
	return $$(this.node.querySelectorAll(selector));
};

/**
 * Récupère l'élément adjacent correspondant au filtre
 * @param {string} filter Filtre CSS
 * @returns {$} Elément trouvé
 */
$.prototype.close = function(filter) {
	var founded = null;
	var nodes = Array.from(this.node.parentElement.children);
	for (var node of nodes) {
		if (node.matches(filter)) {
			founded = node;
			break;
		}
	}
	return $(founded);
};

/**
 * Récupère l'élément ascendant correspondant au sélecteur
 * @param {string} [selector] Sélecteur de l'élément
 * @returns {$} L'élément ascendant
 */
$.prototype.parent = function(selector = null) {
	if (selector != null) {
		var parent = null;
		var founded = false;
		do {
			parent = this.node.parentElement;
			if (parent == null) {
				break;
			}
			founded = package.matches(selector);
		} while (!founded)
		return $(parent);
	} else {
		return $(this.node.parentElement);
	}
};

/**
 * Renvoi la liste des enfants de l'élément
 * @returns {$$} Collection
 */
$.prototype.children = function() {
	return $$(this.node.children);
};

/**
 * Attache un événement à l'élément
 * @param {string} type Type de l'événement
 * @param {function} handler Function de l'événement
 * @returns {$}
 */
$.prototype.on = function(type, handler) {
	this.events.push({ 'type': type, 'handler': handler });
	this.node.addEventListener(type, handler);
	return this;
};

/**
 * Attache un événement à l'élément en stoppant l'action par défaut
 * @param {string} type Type de l'événement
 * @param {function} handler Function de l'événement
 * @returns {$}
 */
$.prototype.handle = function(type, handler) {
	this.events.push({ 'type': type, 'handler': handler });
	this.node.addEventListener(type, function(e) {
		e.preventDefault();
		handler.call(e.currentTarget, e);
	});
	return this;
};

/**
 * Détache un événement de l'élément
 * @param {string} type Type de l'événement
 * @returns {$}
 */
$.prototype.off = function(type) {
	var event = { 'type': null, 'handler': null };
	for (var ev of this.events) {
		if (ev.type == type) {
			event = ev;
		}
	}
	this.node.removeEventListener(event.type, event.handler);
	return this;
};

/**
 * Active un événement
 * @param {string} type Type de l'événement
 * @returns {$}
 */
$.prototype.trigger = function(type) {
	var event = { 'type': null, 'handler': null };
	for (var ev of this.events) {
		if (ev.type == type) {
			ev.handler.call(this.node);
		}
	}
	return this;
};

/**
 * Duplique un élément
 * @param {boolean} [deep = true] Copie profonde (éléments enfants, événements, etc)
 * @returns {$}
 */
$.prototype.clone = function(deep = true) {
	var node = $(this.node.cloneNode(deep));
	if (this.node.events.length > 0 && deep) {
		for (var event of this.node.events) {
			node.events.push({ 'type': event.type, 'handler': event.handler });
			node.node.addEventListener(event.type, event.handler);
		}
	}
	return node;
};
//#endregion

//#region FONCTIONS POUR PLUSIEURS ELEMENTS
/*-----------------------------------
	FONCTIONS POUR PLUSIEURS ELEMENTS
-----------------------------------*/
/**
 * Recherche plusieurs éléments avec un sélecteur CSS ou convertit une liste d'éléments en objet ProtoJS
 * @param {string|Element[]} selector Sélecteur CSS ou liste d'éléments
 * @constructor
 */
function $$(selector) {
	/// permet d'invoquer l'objet sans utiliser le mot-clé 'new'
	if (!(this instanceof $$)){
		return new $$(selector);
	}

	if (typeof selector == "string") {
		this.selector = selector;
		this.nodes = Array.from(document.querySelectorAll(selector));
	} else if (typeof selector == "object") {
		this.nodes = Array.from(selector);
	}
	this.length = this.nodes.length;
}

/**
 * Ajoute un élément à la collection
 * @param {Element} element Elément ajouté
 * @returns {$$}
 */
$$.prototype.push = function(element) {
	this.nodes.push(element);
	this.length = this.nodes.length;
	return this;
};

/**
 * Supprime l'élément à l'index spécifié ou le dernier
 * @param {number} [index] L'index de l'élément
 * @returns {$$}
 */
$$.prototype.pop = function(index = null) {
	if (index != null) {
		this.nodes.splice(index, 1);
	} else {
		this.nodes.splice(0, this.length);
	}
	this.length = this.nodes.length;
	return this;
};

/**
 * Découpe la collection
 * @param {number} start
 * @param {number} [end]
 * @returns {$$} Collection découpée
 */
$$.prototype.slice = function(start, end = null) {
	this.nodes.slice(start, end);
	this.length = this.nodes.length;
};

/**
 * Récupère l'élément à l'index
 * @param {number} [index = 0] L'index de l'élément
 * @returns {$}
 */
$$.prototype.get = function(index = 0) {
	return $(this.nodes[index]);
};

/**
 * Récupère le dernier élément de la collection
 * @returns {$} Dernier élément
 */
$$.prototype.last = function() {
	return $(this.nodes[this.length - 1]);
};

/**
 * Exécute un fonction pour chaque élément de la collection
 * @param {function} fn Fonction exécutée
 * @returns {$$}
 */
$$.prototype.each = function(fn) {
	for (var i = 0; i < this.nodes.length; i++) {
		var node = this.nodes[i];
		fn.call(node, i, this.nodes);
	}
	return this;
};

/**
 * Filtre les éléments elon une fonction
 * @param {function} fn Fonction filtrante
 * @returns {$$} Collection filtrée
 */
$$.prototype.filter = function(fn) {
	var filtered = $$([]);
	for (var i = 0; i < this.nodes.length; i++) {
		var node = this.nodes[i];
		if (fn.call(node, i, this.nodes)) {
			filtered.push(node);
		}
	}
	return filtered;
};
//#endregion

//#region FONCTIONS COMMUNES
/*-----------------------------------
	FONCTIONS COMMUNES
-----------------------------------*/
/**
 * Recupère/modifie le style des éléments
 * @param {string} attr Attribut
 * @param {any} [value] Valeur de l'attribut
 * @returns {$|$$}
 */
$.prototype.css = $$.prototype.css = function(attr, value) {
	if (this instanceof $) {
		this.node.style[attr] = value;
	} else {
		for (var node of this.nodes) {
			node.style[attr] = value;
		}
	}
	return this;
};

/**
 * Ajoute/enlève la classe CSS des éléments
 * @param {string} classname Nom de classe CSS
 * @returns {$|$$}
 */
$.prototype.class = $$.prototype.class = function(classname) {
	for (var clname of classname.split(' ')) {
		if (this instanceof $) {
			this.node.classList.toggle(clname);
		} else {
			for (var node of this.nodes) {
				node.classList.toggle(clname);
			}
		}
	}
	return this;
};

/**
 * Récupère/modifie l'attribut des éléments
 * @param {string} attr Attribut
 * @param {any} [value] Valeur de l'attribut
 * @returns {$|$$}
 */
$.prototype.attr = $$.prototype.attr = function(attr, value = null) {
	if (value != null) {
		if (this instanceof $) {
			this.node.setAttribute(attr, value);
		} else {
			for (var node of this.nodes) {
				node.setAttribute(attr, value);
			}
		}
		return this;
	} else {
		if (this instanceof $) {
			return this.node.getAttribute(attr);
		} else {
			var attrs = [];
			for (var node of this.nodes) {
				attrs.push(node.getAttribute(attr));
			}
			return attrs;
		}
	}
};

/**
 * Attache un élément enfant
 * @param {element|$} child
 * @returns {$|$$}
 */
$.prototype.append = $$.prototype.append = function(child) {
	child = (child instanceof $)? child.node : child;
	if (this instanceof $) {
		this.node.appendChild(child);
	} else {
		for (var node of this.nodes) {
			node.appendChild(child);
		}
	}
	return this;
};

/**
 * Attache l'élément à un parent
 * @param {element|$} parent
 * @returns {$|$$}
 */
$.prototype.appendTo = $$.prototype.appendTo = function(parent) {
	parent = (parent instanceof $)? parent.node : parent;
	if (this instanceof $) {
		parent.appendChild(this.node);
	} else {
		for (var node of this.nodes) {
			parent.appendChild(node);
		}
	}
	return this;
};

/**
 * Supprime les éléments
 * @returns {$|$$}
 */
$.prototype.remove = $$.prototype.remove = function() {
	if (this instanceof $) {
		this.node.parentElement.removeChild(this.node);
	} else {
		for (var node of this.nodes) {
			node.parentElement.removeChild(node);
		}
	}
	return this;
};
//#endregion

//#region FONCTIONS UTILITAIRES
/*-----------------------------------
	FONCTIONS UTILITAIRES
-----------------------------------*/
/**
 * Exécute une fonction lorsque l'intégralité du DOM est prêt
 * @param {function} fn Function qui sera exécutée
 */
$.ready = function(fn) {
	document.addEventListener('DOMContentLoaded', fn, false);
};

/**
 * Crée un élément
 * @param {string} tagname Balise de l'élément
 * @returns {$} Elément
 */
$.create = function(tagname) {
	return $(document.createElement(tagname));
};

/**
 * Crée plusieurs fois un élément
 * @param {string} tagname Balise de l'élément
 * @param {number} [count = 1] Nombre d'itération
 * @returns {$$} Collection
 */
$$.create = function(tagname, count = 1) {
	var nodes = [];
	for (var i = 0; i < count; i++) {
		nodes.push(document.createElement(tagname));
	}
	return $$(nodes);
};

/**
 * Permet de récupérer/modifier une variable CSS ou les propriétés de l'élément <html>
 * @param {string} attr Attribut/variable CSS
 * @param {any} [value] Valeur de l'attribut
 */
$.css = function(attr, value = null) {
	if (value == null) {
		return document.documentElement.style.getPropertyValue(attr);
	} else {
		document.documentElement.style.setProperty(attr, value);
	}
};

/**
 * Exécute une requête AJAX
 * @param {string} type Type de requête (GET ou POST)
 * @param {string} url
 * @param {boolean} [async]
 * @param {object} [data]
 * @returns {Promise}
 */
$.ajax = function(type, url, async = true, data = {}) {
	type = type.toUpperCase();
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(type, url, async);
		xhr.onload = function() { resolve(xhr.response) };
		xhr.onerror = function() { reject(xhr.statusText) };
		xhr.send(data);
	});
};

/**
 * Serialize un formulaire
 * @param {Element} form
 * @returns {object}
 */
$.serialize = function(form) {
	form = (form instanceof $)? form.node : form;
	var values = {};
	for (var pair of new FormData(form).entries()) {
		values[pair[0]] = pair[1];
	}
	return values;
};

/**
 * Import un fichier javascript
 * @param {string} url
 * @returns {Promise}
 */
$.require = function(url) {
	return new Promise((resolve, reject) => {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url + '?' + (new Date().getTime());
		script.onload = function() { resolve() };
		script.onerror = function() { reject() };
		document.getElementsByTagName('head')[0].appendChild(script);
	});
};

/**
 * Import un fichier HTML
 * @param {string} url
 * @returns {Promise}
 */
$.load = function(url) {
	return new Promise(function(resolve, reject) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onload = function() { resolve(new DOMParser().parseFromString(xhr.response, "text/html")) };
		xhr.onerror = function() { reject(xhr.statusText) };
		xhr.send();
	});
};

/**
 * Récupère le navigateur actuel
 * @returns {string[]} Liste des navigateurs potentiels
 * @see https://stackoverflow.com/a/9851769
 */
$.browser = function() {
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+
	var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)); // Safari 3.0+ "[object HTMLElementConstructor]"
	var isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
	var isEdge = !isIE && !!window.StyleMedia; // Edge 20+
	var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime); // Chrome 1 - 71
	var isBlink = (isChrome || isOpera) && !!window.CSS; // Blink engine detection

	var browsers = [];
	if (isOpera) browsers.push("Opera");
	if (isFirefox) browsers.push("Firefox");
	if (isSafari) browsers.push("Safari");
	if (isIE) browsers.push("IE");
	if (isEdge) browsers.push("Edge");
	if (isChrome) browsers.push("Chrome");
	if (isBlink) browsers.push("Blink");
	return browsers;
};
//#endregion

//#region TODOLIST
/*-----------------------------------
	TODOLIST
-----------------------------------*/
$.prototype.prepend = function(child) {};
$.prototype.prependTo = function(parent) {};
$.prototype.replace = function(oldnode, newnode) {};
/**
 * Supprime tous les enfants d'un élément
 */
$.prototype.clear = function() {};
$.prototype.box = function() {};
//#endregion
