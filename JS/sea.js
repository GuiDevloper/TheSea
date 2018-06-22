//var td = svg;
//animal.innerHtml = td;

function getCircleLength(els){
	var len = 0;
	for (var el of els.values()) {
		len += (2 * Math.PI) * el.getAttribute('r');
	}
	return len;
}
function getPathLength(els){
	var len = 0;
	for (var el of els.values()) {
		len += el.getTotalLength();
	}
	return len;
}
var draw = document.querySelector('#animal-1 svg');
var paths = draw.querySelectorAll("path");
var circles = draw.querySelectorAll("circle");
var pathLength = getPathLength(paths) + getCircleLength(circles);
draw.style.strokeDasharray = pathLength;
draw.style.strokeDashoffset = pathLength;
console.log(pathLength);

	c1 = draw.querySelectorAll("path, circle");
//console.log(c1);


window.addEventListener("scroll", function(e) {
  var scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
  var drawLength = pathLength * scrollPercentage;
	
	var len = c1.length;
	var i = 0;
	while(i < len){
		c1[i].style.strokeDashoffset = pathLength - drawLength;
		c1[i].style.fillOpacity = scrollPercentage;
		i++;
	}
});
var corpo = document.getElementById("corpo-rl");
corpo.addEventListener('click', function(){
	corpo.style.transform = "translateX(0px)";
	setTimeout(function(){
		corpo.style.transform = "translateX(5px)";
	}, 200);
})