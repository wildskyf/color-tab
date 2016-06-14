window.onload = () => {
	var color = colors[Math.floor(Math.random() * colors.length)];

	var header = document.querySelector("header");
	var h1 = document.createElement("h1");
	var a = document.createElement("a");
		a.href = color.url;
		a.innerHTML = color.userName + "&dash;" + color.title;

	var max_length = 40;
	var p = document.createElement("p");
		p.innerHTML = color.description.slice(0,max_length) + (color.description.length > max_length? "…":"");

	header.appendChild(h1).appendChild(a);
	header.appendChild(p);

	Array.from(document.querySelector("#palette ul").children).forEach((load, i) => {
		var div = document.createElement("div");
			div.className = "color-hex";
			div.innerHTML = `#${color.colors[i]}`;
		load.appendChild(div);
		load.style.backgroundColor = "#" + color.colors[i];
	});
}
