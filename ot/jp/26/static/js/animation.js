var size={width:600,height:600};var data=[60,30,10];var win=d3.select(window),svg=d3.select("#chart"),pie=d3.layout.pie().value(function(d){return d;}),arc=d3.svg.arc().innerRadius(0);var isAnimated=false;function render(){var g=svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class","arc");g.append("path").attr("stroke","white");g.append("text").attr("dy",".35em").style("text-anchor","middle").text(function(d){return d.data;});}
function update(){size.width=parseInt(svg.style("width"));size.height=parseInt(svg.style("height"));arc.outerRadius(size.width/2);svg.attr("width",size.width).attr("height",size.width);var g=svg.selectAll(".arc").attr("transform","translate("+(size.width/2)+","+(size.width/2)+")");if(isAnimated){g.selectAll("path").attr("d",arc);}
g.selectAll("text").attr("transform",function(d){return "translate("+arc.centroid(d)+")";});}
function animate(){var g=svg.selectAll(".arc"),length=data.length,i=0;g.selectAll("path").transition().ease("cubic-out").delay(500).duration(1000).attrTween("d",function(d){var interpolate=d3.interpolate({startAngle:0,endAngle:0},{startAngle:d.startAngle,endAngle:d.endAngle});return function(t){return arc(interpolate(t));};}).each("end",function(transition,callback){i++;isAnimated=i===length;});}
render();update();animate();win.on("resize",update);