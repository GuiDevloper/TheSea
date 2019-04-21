
var draw, paths, circles, pathLength, c1;
function calculateSVG($tudo) {
	draw = getByTag("svg", getByClass("animal", $tudo)[0])[0];
	paths = getByTag("path", draw);
	circles = getByTag("circle", draw);
	var a = Array.from(paths).concat(Array.from(circles));
	setStyle(a, "animation: initial");
	pathLength = getLength(paths) + getLength(circles);
	var strokeAndAnim = "stroke-dasharray: " + pathLength +
		"; stroke-dashoffset: " + pathLength +
		"; animation: draw 4s forwards;";
	setStyle(a, strokeAndAnim);
	c1 = draw.querySelectorAll("path, circle");
}

var raias = getByClass("raias");
var childs = raias[0].children;
// Cria raia-pequena direita
var raia_r = childs[0].cloneNode(true);
// Substitui classe
raia_r.classList.remove('raia-l');
raia_r.classList.add('raia-r');
// Inclui para as raias
raias[0].appendChild(raia_r);

// Add click para setas
var addRaiaEvent = function(raia) {
	// Abre o node e percorre adding events de click
	raia.addEventListener('click', function(e) {
		// Obtém o atual disparador
		var $this = e.currentTarget;
		// Se for raia esquerda
		var isLeft = $this.classList.value == "raia-l";
		var tran = ["transform: translateX(", !isLeft ? " rotate(180deg)" : ''];
		var indexDeep = ($this.parentElement.parentElement)
			.classList.value.replace('tudo t', '');
		// Obtém peixe armazenado usando indice do .tudo
		changeDOM(fishs[indexDeep], indexDeep, isLeft);
		var transDefault = tran[0] + "0px)" + tran[1];
		// Mudando atual para translateX(0)
		setStyle([$this], transDefault);
		// Define transform e px após animação
		tran = tran[0] + isLeft ? "5px)" : "-5px)" + tran[1];
		// Apos 200ms retorna ao normal
		setTimeout(function() {
			setStyle([$this], tran);
		}, 200);
	});
};

raias = Array.from(raias);
// Loop nas div de setas-raias
for (var i in raias) {
	raias[i].innerHTML = raias[0].innerHTML;
	for (var j in Array.from(raias[i].children)) {
		addRaiaEvent(Array.from(raias[i].children)[j]);
	}
}

var index = [0, 0, 0];
var fishs = [], fish = [];
// Carrega peixes
var getFish = function(deep) {
	var url = "./src/Seas.json?q=test&amp;rnd=" + Math.random();
	var fishx = Ajax.send(url, "GET");
	fishx.onreadystatechange = function() {
		if(Ajax.isReady(this)) {
			fishs = JSON.parse(fishx.responseText);
			showDefaults(fishs);
		}
	};
};
function showDefaults(fishs) {
	for (var sea = 1; sea<4; sea++) {
		changeDOM(fishs[sea][0], sea);
	}
}

// Recebe peixe, profundidade e SE é decrescente
function changeDOM(fish, deep, isLeft) {
	if (isLeft != undefined) {
		var max = deep != 1 ? 4 : 5;
		// Define indice do próximo peixe
		index[deep-1] = isLeft ? (
			index[deep-1] == 0 ? max : index[deep-1] - 1 ) : (
				index[deep-1] == max ? 0 : index[deep-1] + 1 );
	}
	fish = Object.keys(fish).length != 4 ? fish[index[deep-1]] : fish;
	var $tudo = getByClass("t" + deep)[0];
	var classes = ["nome1", "nome2", "desc", "animal"];
	for (var id in classes) {
		getByClass(classes[id], $tudo)[0].innerHTML = fish[id];
	}
	calculateSVG($tudo);
}
getFish(1);
