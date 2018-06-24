//var td = svg;
//animal.innerHtml = td;

function getLength(els){
	var len = 0;
	for (var el of els.values()) {
		len += el.tagName == "path" ? el.getTotalLength() : 
			(2 * Math.PI) * el.getAttribute('r');
	}
	return len;
}
var draw, paths, circles, pathLength, c1;
function calculateSVG(){
	draw = document.querySelector('#animal-1 svg');
	paths = draw.querySelectorAll("path");
	circles = draw.querySelectorAll("circle");
	setAnimation(paths, "animation: initial");
	setAnimation(circles, "animation: initial");
	pathLength = getLength(paths) + getLength(circles);
	setAnimation(circles, "stroke-dasharray: " + pathLength +
		 "; stroke-dashoffset: "+pathLength);
	setAnimation(paths, "stroke-dasharray: " + pathLength +
		 "; stroke-dashoffset: "+pathLength);
	console.log(pathLength);
	c1 = draw.querySelectorAll("path, circle");
	setAnimation(paths, "animation: draw 4s");
	setAnimation(circles, "animation: draw 4s");
	setTimeout(function(){
		setAnimation(circles, "stroke-dashoffset: 0; fill-opacity: 1");
		setAnimation(paths, "stroke-dashoffset: 0; fill-opacity: 1");
	}, 3900);
}
calculateSVG();
function setAnimation(els, value){
	for (var el of els){
		el.style.cssText += ";" + value;
	}
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
var raias = document.getElementsByClassName("raias")[0];
var childs = raias.children;
//Cria raia-pequena direita
var raia_r = childs[0].cloneNode(true);
//Adiciona novo id
raia_r.id = 'raia-r';
//Inclui para as raias
raias.appendChild(raia_r);
var fish_index = 0;
//Abre o node e percorre adding events de click
[...childs].forEach(function(elem) {
	elem.addEventListener('click', function(e){
		//Obtém o atual disparador
		$this = e.currentTarget;
		//De acordo com o id clicado, define transform
		if ($this.id == "raia-l") {
			var tran = "translateX(5px)";
			fish_index = fish_index == 0 ? 5 : fish_index-1;
		} else {
			var tran = "translateX(-5px) rotate(180deg)";
			fish_index = fish_index == 5 ? 0 : fish_index+1;
		}
		getFish("./Fishs/Descriptions/Deep1.json?q=test&amp;rnd=" + Math.random(), fish_index);
		//Mudando atual para translateX(0)
		$this.style.transform = $this.style.transform.replace(
				tran.replace(" rotate(180deg)",""), "translateX(0px)");
		//Apos 200ms retorna ao normal
		setTimeout(function(){
			$this.style.transform = tran;
		}, 200);
	})
});
var xhr = new XMLHttpRequest();
//Ajax object construído
var Ajax = {
	'send': function(url, type){
		xhr.open(type, url, true);
		xhr.send(null);
	},
	'isReady': function($this){
		return $this.readyState == 4 && $this.status == 200;
	}
};
function getFish(url, index) {
	Ajax.send(url, "GET");
	xhr.onreadystatechange = function() {
		if(Ajax.isReady(this)){
			var data = xhr.responseText;
	  	var fish = JSON.parse(data)[index];
	  	document.getElementById("nome-1").innerHTML = fish[0];
	  	document.getElementsByClassName("ncientifico")[0].innerHTML = fish[1];
	  	document.getElementById("descricao-1").innerHTML = fish[2];
	  	document.getElementById("animal-1").innerHTML = fish[3];
	  	calculateSVG();
		}
	};
}