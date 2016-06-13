const {Cc, Ci, Cm, Cr, Cu, CC, components} = require("chrome");
const self = require("sdk/self"), tabs = require("sdk/tabs");

Cm.QueryInterface(Ci.nsIComponentRegistrar);
components.utils.import("resource://gre/modules/Services.jsm");

// globals
var factory;
const aboutPage_description = 'This page provides some random colors';
const aboutPage_id = 'aa132730-2278-11e5-867f-0800200c9a66'; // make sure you generate a unique id from https://www.famkruithof.net/uuid/uuidgen
const aboutPage_word = 'rancolor';
const aboutPage_page = "resource://colortab/data/index.html";

function AboutCustom() {}
AboutCustom.prototype = Object.freeze({
    classDescription: aboutPage_description,
    contractID: '@mozilla.org/network/protocol/about;1?what=' + aboutPage_word,
    classID: components.ID('{' + aboutPage_id + '}'),
    xpcom_categories: ["content-policy"],

    getURIFlags: (aURI) => Ci.nsIAboutModule.ALLOW_SCRIPT,

    newChannel: (aURI, aSecurity_or_aLoadInfo) => {
        var channel;
        if (Services.vc.compare(Services.appinfo.version, '47.*') > 0) {
              let uri = Services.io.newURI(aboutPage_page, null, null);
              // greater than or equal to firefox48 so aSecurity_or_aLoadInfo is aLoadInfo
              channel = Services.io.newChannelFromURIWithLoadInfo(uri, aSecurity_or_aLoadInfo);
        } else {
              // less then firefox48 aSecurity_or_aLoadInfo is aSecurity
              channel = Services.io.newChannel(aboutPage_page, null, null);
        }
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
	if(tab.url === "about:blank" || tab.url === "about:newtab")
		tab.url = self.data.url(`about:${aboutPage_word}`);
	if(!factory)
		factory = new Factory(AboutCustom);
})
;
/*
tabs.on('close', tab => {
	if(!factory)
		factory.unregister();
});
*/
