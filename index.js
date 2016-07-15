const {Cc, Ci, Cm, Cr, Cu, CC, components} = require("chrome");
const {NewTabURL} = require('resource:///modules/NewTabURL.jsm');
const ogd4tab = NewTabURL.get();

Cm.QueryInterface(Ci.nsIComponentRegistrar);
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

// globals
var factory = undefined;
const _name = 'rancolor';
const _description = 'This page provides some random colors';
const _id = 'aa132730-2278-11e5-867f-0800200c9a66'; // https://www.famkruithof.net/uuid/uuidgen
const _url = `about:${_name}`;
const _src = "resource://colortab/data/index.html";

function AboutCustom() {};
AboutCustom.prototype = Object.freeze({
	classDescription: _description,
	contractID: '@mozilla.org/network/protocol/about;1?what=' + _name,
	classID: components.ID(`{${_id}}`),
	QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

	getURIFlags: aURI => Ci.nsIAboutModule.ALLOW_SCRIPT,

	newChannel: (aURI, aSecurity_or_aLoadInfo) => {
		let uri = Services.io.newURI(_src, null, null);
		var channel = Services.io.newChannelFromURIWithLoadInfo(uri, aSecurity_or_aLoadInfo);
		channel.originalURI = aURI;
		return channel;
	}
});

function Factory(component) {
	this.createInstance = (outer, iid) => {
		if (outer)
			throw Cr.NS_ERROR_NO_AGGREGATION;
		return new component();
	};
	this.register = () =>
		Cm.registerFactory(component.prototype.classID, component.prototype.classDescription, component.prototype.contractID, this);
	this.unregister = () =>
		Cm.unregisterFactory(component.prototype.classID, this);

	Object.freeze(this);
	this.register();
}

exports.main = () => {
	factory = new Factory(AboutCustom);
	NewTabURL.override(_url);
}

exports.onUnload = () => {
	factory.unregister();
	NewTabURL.override(ogd4tab);
}

