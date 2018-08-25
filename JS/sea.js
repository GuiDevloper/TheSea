getById = function(root, id) {
	root = root || document;
	return root.getElementById(id);
};
getByClass = function(root, clas) {
	root = root || document;
	return root.getElementsByClassName(clas);
};
// Set ou update css de elementos
setStyle = function(els, value) {
	for (var el of [...els]){
		el.style.cssText += ";" + value;
	}
};

// Get length de svg
getLength = function(els) {
	var len = 0;
	for (var el of [...els].values()) {
		len += el.tagName == "path" ? el.getTotalLength() :
			(2 * Math.PI) * el.getAttribute('r');
	}
	return len;
};

var xhr = new XMLHttpRequest();
//Ajax object construído
var Ajax = {
	'send': function(url, type) {
		xhr.open(type, url, true);
		xhr.send(null);
	},
	'isReady': function($this) {
		return $this.readyState == 4 && $this.status == 200;
	}
};

var draw, paths, circles, pathLength, c1;
function calculateSVG($tudo) {
	draw = $tudo.getElementsByClassName("animal")[0].getElementsByTagName("svg")[0];
	paths = draw.getElementsByTagName("path");
	circles = draw.getElementsByTagName("circle");
	setStyle([...paths, ...circles], "animation: initial");
	pathLength = getLength(paths) + getLength(circles);
	var strokeAndAnim = "stroke-dasharray: " + pathLength +
		"; stroke-dashoffset: " + pathLength +
		"; animation: draw 4s forwards;";
	setStyle([...paths, ...circles], strokeAndAnim);
	c1 = draw.querySelectorAll("path, circle");
}

/*window.addEventListener("scroll", function(e) {
  var scrollPercentage =
  	(document.documentElement.scrollTop + document.body.scrollTop) /
  		(document.documentElement.scrollHeight - document.documentElement.clientHeight);
  var drawLength = pathLength * scrollPercentage;

	var len = c1.length;
	var i = 0;
	while(i < len){
		c1[i].style.strokeDashoffset = pathLength - drawLength;
		c1[i].style.fillOpacity = scrollPercentage;
		i++;
	}
});*/

var raias = document.getElementsByClassName("raias");
var childs = raias[0].children;
// Cria raia-pequena direita
var raia_r = childs[0].cloneNode(true);
// Substitui classe
raia_r.classList.remove('raia-l');
raia_r.classList.add('raia-r');
// Inclui para as raias
raias[0].appendChild(raia_r);

for (var elem of [...raias].values()) {
	elem.innerHTML = raias[0].innerHTML;
	for (var raia of [...elem.children].values()) {
		// Abre o node e percorre adding events de click
		raia.addEventListener('click', function(e) {
			// Obtém o atual disparador
			var $this = e.currentTarget;
			var tran = "transform: ";
			var fish = 0;
			// Se for raia esquerda
			var isLeft = $this.classList.value == "raia-l";
			// De acordo com o id clicado, define transform
			tran += "translateX(";
			// Define px após animação
			tran += isLeft ? "5px)" : "-5px) rotate(180deg)";

			// Obtém peixe dos JSON usando indice do .tudo
			getFish( fish, ($this.parentElement.parentElement)
				.classList.value.replace('tudo t', '')
			);
			// Mudando atual para translateX(0)
			setStyle([$this], "transform: translateX(0px)" + (
				!isLeft ? " rotate(180deg)" : '')
			);
			// Apos 200ms retorna ao normal
			setTimeout(function() {
				setStyle([$this], tran);
			}, 200);
		});
	}
}

// Carrega peixe
// Recebe peixe e sua profundidade
function getFish(index, deep) {
	var url = "./Fishs/Descriptions/Deep" + deep + ".json?q=test&amp;rnd=" + Math.random();
	Ajax.send(url, "GET");
	xhr.onreadystatechange = function() {
		if(Ajax.isReady(this)) {
			var data = xhr.responseText;
			var fish = JSON.parse(data)[index];
			var $tudo = document.getElementsByClassName("t" + deep)[0];
	  	$tudo.getElementsByClassName("nome1")[0].innerHTML = fish[0];
	  	$tudo.getElementsByClassName("nome2")[0].innerHTML = fish[1];
	  	$tudo.getElementsByClassName("desc")[0].innerHTML = fish[2];
	  	$tudo.getElementsByClassName("animal")[0].innerHTML = fish[3];
	  	calculateSVG($tudo);
		}
	};
}
