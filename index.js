const {Cc, Ci, Cm, Cr, Cu, CC, components} = require("chrome");
const { get, set } = require('sdk/preferences/service');
const tabs = require("sdk/tabs");

// globals
var factory = undefined;
const _name = 'rancolor';
const _description = 'This page provides some random colors';
const _id = 'aa132730-2278-11e5-867f-0800200c9a66'; // https://www.famkruithof.net/uuid/uuidgen
const _url = `about:${_name}`;
const _src = "resource://colortab/data/index.html";

Cm.QueryInterface(Ci.nsIComponentRegistrar);
Cu.import("resource://gre/modules/Services.jsm");

function AboutCustom() {}
AboutCustom.prototype = Object.freeze({
    classDescription: _description,
    contractID: '@mozilla.org/network/protocol/about;1?what=' + _name,
    classID: components.ID(`{${_id}}`),
    xpcom_categories: ["content-policy"],

    getURIFlags: (aURI) => Ci.nsIAboutModule.ALLOW_SCRIPT,

    newChannel: (aURI, aSecurity_or_aLoadInfo) => {
        var channel;
        if (Services.vc.compare(Services.appinfo.version, '47.*') > 0) {
              let uri = Services.io.newURI(_src, null, null);
              // greater than or equal to firefox48 so aSecurity_or_aLoadInfo is aLoadInfo
              channel = Services.io.newChannelFromURIWithLoadInfo(uri, aSecurity_or_aLoadInfo);
        }
        else // less then firefox48 aSecurity_or_aLoadInfo is aSecurity
              channel = Services.io.newChannel(_src, null, null);
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


tabs.on('activate', tab => {
	if(!factory)
		factory = new Factory(AboutCustom);

	var vff = parseInt(get('browser.startup.homepage_override.mstone'));
	if(vff > 40) {
		NewTabURL = require('resource:///modules/NewTabURL.jsm').NewTabURL;
		NewTabURL.override(_url);
	}
	//set('browser.startup.homepage', _url);
});

tabs.on('close', tab => {
	if(!factory)
		factory.unregister();
});
