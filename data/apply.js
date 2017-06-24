window.onload = () => {
	const colors_url = chrome.extension.getURL('data/colors.json');
	const toJSON = res => res.json();

	fetch(colors_url).then(toJSON).then(colors => {
		var color = colors[Math.floor(Math.random() * colors.length)];

		var header = document.querySelector("header");
		var h1 = document.createElement("h1");
		var a = document.createElement("a");
		a.href = color.url;
		a.textContent = `${color.userName} - ${color.title}`;

		var max_length = 100;
		var p = document.createElement("p");
		p.textContent = color.description.slice(0,max_length) + (color.description.length > max_length? "…":"")

		header.appendChild(h1).appendChild(a);
		header.appendChild(p);

		Array.from(document.querySelector("#palette ul").children).forEach((load, i) => {
			var div = document.createElement("div");
			div.className = "color-hex";
			div.textContent = `#${color.colors[i]}`;
			load.appendChild(div);
			load.style.backgroundColor = "#" + color.colors[i];
		});
	});
}
