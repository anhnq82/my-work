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

                //Draw arc paths
                arcs.append("path")
                    .attr("fill", function (d, i) {
                        return color(i);
                    })
                    .attr("d", arc)
                    .on("click", function(d) {
                        //alert(d.value);
                        d3.select(this)
                            .style("stroke", "white")
                            .style("stroke-width", 3);
                    })
                    .style("stroke", "white")
                    .style("stroke-width", 3);
/*                    .on("mouseenter", function(d) {
                        d3.select(this)
                            .attr("stroke","white")
                            .attr("stroke-width",4);
                    })
                    .on("mouseleave", function(d) {
                        d3.select(this).transition()
                            .attr("stroke",3);
                    })*/

                arcs.append("path")
                    .attr("fill", "#D6DCE3")
                    .attr("d", arcBorder)
                    .style("stroke", "white")
                    .style("stroke-width", 3);

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