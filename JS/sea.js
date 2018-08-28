getById = function(id, root) {
	root = root || document;
	return root.getElementById(id);
};
getByClass = function(clas, root) {
	root = root || document;
	return root.getElementsByClassName(clas);
};
getByTag = function(tag, root) {
	root = root || document;
	return root.getElementsByTagName(tag);
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
	draw = getByTag("svg", getByClass("animal", $tudo)[0])[0];
	paths = getByTag("path", draw);
	circles = getByTag("circle", draw);
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
addRaiaEvent = function(raia) {
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
		changeDOM(fishs[indexDeep-1], indexDeep, isLeft);
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

// Loop nas div de setas-raias
for (var elem of [...raias].values()) {
	elem.innerHTML = raias[0].innerHTML;
	for (var raia of [...elem.children].values()) {
		addRaiaEvent(raia);
	}
}

var index = 0;
var fishs = [], fish = [];
// Carrega peixes
getFish = function(deep) {
	var url = "./Fishs/Deep" + deep + ".json?q=test&amp;rnd=" + Math.random();
	Ajax.send(url, "GET");
	xhr.onreadystatechange = function() {
		if(Ajax.isReady(this)) {
			var data = xhr.responseText;
			fishs.push(JSON.parse(data));
			deep < 3 ? getFish(deep + 1) : showDefaults(fishs);
		}
	};
};
function showDefaults(fishs) {
	var i = 1;
	for (var fish of fishs) {
		changeDOM(fish[0], i++);
	}
}

// Recebe peixe, profundidade e SE é decrescente
function changeDOM(fish, deep, isLeft) {
	if (isLeft != undefined) {
		var max = deep != 1 ? 4 : 5;
		// Define indice do próximo peixe
		index = isLeft ? ( index == 0 ? max : index - 1 ) : (
				index == max ? 0 : index + 1 );
	}
	fish = Object.keys(fish).length != 4 ? fish[index] : fish;
	var $tudo = getByClass("t" + deep)[0];
	var classes = ["nome1", "nome2", "desc", "animal"], i = 0;
	for (var classe of classes) {
		getByClass(classe, $tudo)[0].innerHTML = fish[i++];
	}
	calculateSVG($tudo);
}
getFish(1);
