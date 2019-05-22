/**
 * @name ProtoJS
 * @version v0.15.0
 * @license MIT License
 */
//------------------------------------------- GLOBAL --------------------------------------------------//
String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
		return (args[number] !== undefined)? args[number] : match;
	});
};

function require(url) {
	return new Promise((resolve, reject) => {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url + '?' + (new Date().getTime());
		script.onload = () => resolve();
		script.onerror = () => reject();
		document.getElementsByTagName('head')[0].appendChild(script);
	});
}

function load(url) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onload = function() {
			resolve(new DOMParser().parseFromString(xhr.response, "text/html"));
		};
    xhr.onerror = () => reject(xhr.statusText);
		xhr.send();
	});
}

function ajax(type, url, async) {
	type = (type.toLowerCase() === "get" || type.toLowerCase() === "post")? type : "GET";
	async = (async !== undefined)? async : false;
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(type, url, async);
		xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr.statusText);
		xhr.send();
	});
}

function list(nodes) {
	return Array.prototype.slice.call(nodes);
}

function $(query) {
	return (typeof query === "string")? new Element(document.getElementById(query)) : new Element(query);
}

function $$(query) {
	if (/^[#\.@]?[a-zA-Z]+$/gm.test(query)) {
		query = (query[0] == "#")? document.getElementById(query.substring(1)) :
		(query[0] == ".")? document.getElementsByClassName(query.substring(1)) :
		(query[0] == "@")? document.getElementsByName(query.substring(1)) :
		document.getElementsByTagName(query);
	}
	return (typeof query === "string")? new Collection(list(document.querySelectorAll(query))) : new Collection(list(query));
}

function $$$(query) {
	if (/^[#\.@]?[a-zA-Z]+$/gm.test(query)) {
		query = (query[0] == "#")? document.getElementById(query.substring(1)) :
		(query[0] == ".")? document.getElementsByClassName(query.substring(1))[0] :
		(query[0] == "@")? document.getElementsByName(query.substring(1))[0] :
		document.getElementsByTagName(query)[0];
	}
	return (typeof query === "string")? new Element(document.querySelector(query)) : new Element(query);
}

function ready(fn) {
	document.addEventListener("DOMContentLoaded", fn);
}

var _special_attrs = ["checked"];

//------------------------------------------- ELEMENT --------------------------------------------------//
function Element(dom) {
	this.dom = dom;
	this.class = dom.classList;
	this.tag = dom.tagName;
	this.type = dom.nodeType;
	if (!('events' in dom) && Array.isArray(dom['events'])) {
		this.dom.events = [];
	}
}

// tree traversing
Element.prototype.next = function() {
	return new Element(this.dom.nextElementSibling);
};
Element.prototype.prev = function() {
	return new Element(this.dom.previousElementSibling);
};
Element.prototype.parent = function() {
	return new Element(this.dom.parentElement);
};
Element.prototype.children = function() {
	var nodes = list(this.dom.children);
	return new Collection(nodes);
};
Element.prototype.find = function(selector) {
	var nodes = list(this.dom.querySelectorAll(selector));
	return new Collection(nodes);
};

// dom operation
Element.prototype.html = function(content) {
	if (content !== undefined) {
		this.dom.innerHTML = content;
		return this;
	} else {
		return this.dom.innerHTML;
	}
};
Element.prototype.text = function(content) {
	if (content !== undefined) {
		this.dom.innerText = content;
		return this;
	} else {
		return this.dom.innerText;
	}
};
Element.prototype.attr = function(prop, value) {
	if (value !== undefined) {
		if (_special_attrs.includes(prop)) {
			this.dom[prop] = value;
		} else {
			this.dom.setAttribute(prop, value);
		}
		return this;
	} else {
		if (_special_attrs.includes(prop)) {
			return this.dom[prop];
		} else {
			return this.dom.getAttribute(prop);
		}
	}
};
Element.prototype.data = function(data, value) {
	if (value !== undefined) {
		this.dom.dataset[data] = value;
		return this;
	} else if (data !== undefined) {
		return this.dom.dataset[data];
	} else {
		return this.dom.dataset;
	}
};
Element.prototype.css = function(prop, value) {
	if (value !== undefined) {
		this.dom.style[prop] = value;
		return this;
	} else {
		return window.getComputedStyle(this.dom)[prop];
	}
};
Element.prototype.val = function(value) {
	if (value !== undefined) {
		this.dom.value = value;
		return this;
	} else {
		return this.dom.value;
	}
}
Element.prototype.append = function(child) {
	this.dom.appendChild(child);
	return this;
};
Element.prototype.prepend = function(child) {
	this.dom.prependChild(child);
	return this;
};
Element.prototype.replace = function(oldchild, newchild) {
	this.dom.replaceChild(newchild, oldchild);
	this.dom = newchild;
	return this;
};
Element.prototype.remove = function(child) {
	this.dom.removeChild(child);
	return this;
};
Element.prototype.removeAt = function(index) {
	var childs = this.dom.children;
	this.dom.removeChild(childs[index]);
	return this;
};
Element.prototype.clear = function() {
	var childs = list(this.dom.children);
	for (var i = 0; i < childs.length; i++) {
		this.dom.removeChild(childs[i]);
	}
	return this;
};
Element.prototype.delete = function() {
	this.dom.parentElement.removeChild(this.dom);
};
Element.prototype.before = function(child) {
	this.dom.parentElement.insertBefore(child, this.dom);
	return this;
};
Element.prototype.after = function(child) {
	this.dom.parentElement.insertBefore(child, this.dom.nextElementSibling);
	return this;
};

// class
Element.prototype.addClass = function(classname) {
	this.dom.classList.add(classname);
	return this;
};
Element.prototype.removeClass = function(classname) {
	this.dom.classList.remove(classname);
	return this;
};
Element.prototype.toggleClass = function(classname) {
	this.dom.classList.toggle(classname);
	return this;
};

// event
function Event(name, fn) {
	this.name = name;
	this.fn = fn;
}
Element.prototype.event = function(name) {
	var founded = [];
	for (let i = 0; i < this.dom.events.length; i++) {
		var event = this.dom.events[i];
		if (event.name === name) {
			founded.push(event.fn);
		}
	}
	return (founded.length > 1)? founded : founded[0];
};
Element.prototype.on = function(name, fn) {
	var event = new Event(name, fn);
	this.dom.events.push(event);
	this.dom.addEventListener(name, fn);
	return this;
};
Element.prototype.off = function(name, fn) {
	for (let i = 0; i < this.dom.events.length; i++) {
		var event = this.dom.events[i];
		if (event.name === name && (fn === undefined || (fn !== undefined && event.fn == fn))) {
			this.dom.events[i] = undefined;
			this.dom.removeEventListener(event.name, event.fn);
		}
	}
	this.dom.events = this.dom.events.filter(function(event) {
		return event !== undefined;
	});
	return this;
};
Element.prototype.fire = function(name) {
	for (let i = 0; i < this.dom.events.length; i++) {
		var event = this.dom.events[i];
		if (event.name === name) {
			event.fn.call(this.dom);
		}
	}
	return this;
};

//------------------------------------------- COLLECTION --------------------------------------------------//
function Collection(nodes) {
	this.nodes = nodes;
	this.length = nodes.length;
	this.todos = [];
}
Collection.prototype.append = function(child) {
	this.nodes.push(child);
	this.length = this.nodes.length;
};
Collection.prototype.remove = function(index) {
	this.nodes.splice(index, 1);
	this.length = this.nodes.length;
};

// indexing
Collection.prototype.get = function(index) {
	if (index < this.length) {
		return new Element(this.nodes[index]);
	} else {
		throw new Error("Index out of bounds !");
	}
};
Collection.prototype.at = function(index) {
	if (index < this.length) {
		return this.nodes[index];
	} else {
		throw new Error("Index out of bounds !");
	}
};
Collection.prototype.first = function() {
	return new Element(this.nodes[0]);
};
Collection.prototype.last = function() {
	return new Element(this.nodes[this.length - 1]);
};

// processing
Collection.prototype.each = function(fn) {
	for (let i = 0; i < this.length; i++) {
		var node = this.nodes[i];
		fn.call(node, i, this);
	}
	return this;
};
Collection.prototype.filter = function(fn) {
	var filtered = [];
	for (let i = 0; i < this.length; i++) {
		var node = this.nodes[i];
		if (fn.call(node, i, this)) {
			filtered.push(node);
		}
	}
	return new Collection(filtered);
};

// dom operation
Collection.prototype.attr = function(prop, value) {
	for (let i = 0; i < this.length; i++) {
		this.nodes[i][prop] = value;
		
	}
	return this;
};
Collection.prototype.css = function(prop, value) {
	for (let i = 0; i < this.length; i++) {
		this.nodes[i].style[prop] = value;
	}
	return this;
};
Collection.prototype.data = function(data, value) {
	for (let i = 0; i < this.length; i++) {
		this.nodes[i].dataset[data] = value;
	}
	return this;
};

// class
Collection.prototype.addClass = function(classname) {
	for (let i = 0; i < this.length; i++) {
		this.nodes[i].classList.add(classname);
	}
	return this;
};
Collection.prototype.removeClass = function(classname) {
	for (let i = 0; i < this.length; i++) {
		this.nodes[i].classList.remove(classname);
	}
	return this;
};
Collection.prototype.toggleClass = function(classname) {
	for (let i = 0; i < this.length; i++) {
		this.nodes[i].classList.toggle(classname);
	}
	return this;
};
