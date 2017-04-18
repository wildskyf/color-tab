var replaceNewTabPage = tab => {
	if (tab.url == "about:newtab") {
		browser.tabs.update(
			tab.id,
			{ url:"data/index.html" }
		)
		/*
		browser.tabs.remove(tab.id);
		browser.tabs.create({
			url:"data/index.html"
		});
		*/
	}
};

browser.tabs.onCreated.addListener(replaceNewTabPage);

