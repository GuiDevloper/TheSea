//var td = svg;
//animal.innerHtml = td;
function setAnimation(els, value) {
	for (var el of els){
		el.style.cssText += ";" + value;
	}
}
function getLength(els) {
	var len = 0;
	for (var el of els.values()) {
		len += el.tagName == "path" ? el.getTotalLength() :
			(2 * Math.PI) * el.getAttribute('r');
	}
	return len;
}
var draw, paths, circles, pathLength, c1;
function calculateSVG() {
	draw = document.querySelector('.a1 svg');
	paths = draw.querySelectorAll("path");
	circles = draw.querySelectorAll("circle");
	setAnimation([...paths, ...circles], "animation: initial");
	pathLength = getLength(paths) + getLength(circles);
	var strokeAndAnim = "stroke-dasharray: " + pathLength +
		"; stroke-dashoffset: " + pathLength +
		"; animation: draw 4s forwards;";
	setAnimation([...paths, ...circles], strokeAndAnim);
	c1 = draw.querySelectorAll("path, circle");
}
calculateSVG();
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
//Cria raia-pequena direita
var raia_r = childs[0].cloneNode(true);
//Substitui classe
raia_r.classList.remove('raia-l');
raia_r.classList.add('raia-r');
//Inclui para as raias
raias[0].appendChild(raia_r);
var fish_index = 0;
for (var elem of [...raias].values()) {
	elem.innerHTML = raias[0].innerHTML;
	for (var raia of [...elem.children].values()) {
		//Abre o node e percorre adding events de click
		raia.addEventListener('click', function(e) {
			//Obtém o atual disparador
			$this = e.currentTarget;
			var tran;
			//De acordo com o id clicado, define transform
			if ($this.id == "raia-l") {
				tran = "translateX(5px)";
				fish_index = fish_index == 0 ? 5 : fish_index-1;
			} else {
				tran = "translateX(-5px) rotate(180deg)";
				fish_index = fish_index == 5 ? 0 : fish_index+1;
			}
			getFish(fish_index, $this.parentElement.parentElement);
			//Mudando atual para translateX(0)
			setAnimation([$this], $this.style.transform.replace(
				tran.replace(" rotate(180deg)", ""), "translateX(0px)"
			));
			//Apos 200ms retorna ao normal
			setTimeout(function() {
				setAnimation([$this], tran);
			}, 200);
		});
	}
}
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
function getFish(index, $tudo) {
	var deep = $tudo.classList.value.replace('tudo t', '');
	var url = "./Fishs/Descriptions/Deep" + deep + ".json?q=test&amp;rnd=" + Math.random();
	Ajax.send(url, "GET");
	xhr.onreadystatechange = function() {
		if(Ajax.isReady(this)) {
			var data = xhr.responseText;
	  	var fish = JSON.parse(data)[index];
	  	$tudo.getElementsByClassName("nome1")[0].innerHTML = fish[0];
	  	$tudo.getElementsByClassName("nome2")[0].innerHTML = fish[1];
	  	$tudo.getElementsByClassName("desc")[0].innerHTML = fish[2];
	  	$tudo.getElementsByClassName("animal")[0].innerHTML = fish[3];
	  	calculateSVG();
		}
	};
}
