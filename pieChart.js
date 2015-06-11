(function (angular) {
    'use strict';

    var module = angular.module("tango-cp-shell.common.directives");

    module.directive('cpPieChart', ['$compile', '$timeout', '$filter', function ($compile, $timeout, $filter) {
        var uniqueId = 1;

        return {
            restrict: 'A',
            replace: true,
            scope: {
                config: '=cpPieChart'
            },
            link: function (scope, element, attrs) {
                var dataset = scope.config;

                var w = 400;
                var h = 400;
                var r = Math.min(w, h) / 2;
                var labelr = r + 30; // radius for label anchor

                var border = 15;
                var outerRadius = w / 2 - border;
                var innerRadius = 0;
                var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);

                var arcBorder = d3.svg.arc()
                    .innerRadius(outerRadius)
                    .outerRadius(outerRadius + border);

                var pie = d3.layout.pie();

                //Easy colors accessible via a 10-step ordinal scale
                var color = d3.scale.category10();

                //Create SVG element
                var svg = d3.select("#cp-pie-chart")
                    .append("svg")
                    .attr("width", w + 200)
                    .attr("height", h + 200)
                    .style("padding", "100px");

                //Set up groups
                var arcs = svg.selectAll("g.arc")
                    .data(pie(dataset))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + (outerRadius + border) + "," + (outerRadius + border) + ")");
                
                var arcOver = d3.svg.arc()
                    .outerRadius(outerRadius + 10);

                //Draw arc paths
                arcs.append("path")
                    .attr("fill", function (d, i) {
                        return color(i);
                    })
                    .attr("d", arc)
                    .on("click", function(d) {
                    })
                    .style("stroke", "white")
                    .style("stroke-width", 3)
                    .on("mouseover", function(d) {
                        // Mouseover effect if no transition has started
                        // Calculate angle bisector
                            var ang = d.startAngle + (d.endAngle - d.startAngle)/2; 
                            alert(ang);
                        // Transformate to SVG space
                            ang = (ang - (Math.PI / 2) ) * -1;
                        // http://bl.ocks.org/marcbc/3281521
                        // Calculate a 10% radius displacement
                            var x = Math.cos(ang) * radius * 0.1;
                            var y = Math.sin(ang) * radius * -0.1;

                            d3.select(this).transition()
                                .duration(250).attr("transform", "translate("+x+","+y+")");
                    })
                    .on("mouseout", function(d) {
                        // Mouseout effect if no transition has started                
                        if(this._listenToEvents){
                            d3.select(this).transition()
                                .duration(150).attr("transform", "translate(0,0)"); 
                        }
                    });
                
                /*arcs.append("path")
                    .attr("fill", "#D6DCE3")
                    .attr("d", arcBorder)
                    .style("stroke", "white")
                    .style("stroke-width", 3);*/
                
                //Labels
                arcs.append("text")
                    .attr("transform", function (d) {
                        var c = arc.centroid(d),
                            x = c[0],
                            y = c[1],
                        // pythagorean theorem for hypotenuse
                            h = Math.sqrt(x*x + y*y);
                        return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")";
                    })
                    .attr("text-anchor", "middle")
                    .attr("fill","#71767D")
                    .html(function (d) {
                        return '<tspan class="h3">' + d.value + '</tspan><tspan class="h4">%</tspan>';
                    });
            }
        }
    }]);
})(window.angular);