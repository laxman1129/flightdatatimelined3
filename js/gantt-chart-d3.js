/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

var x,y;
var timeDomainStart;
var timeDomainEnd;

d3.gantt = function() {
  var FIT_TIME_DOMAIN_MODE = "fit";
  var FIXED_TIME_DOMAIN_MODE = "fixed";

  var margin = {
    top: 20,
    right: 40,
    bottom: 20,
    left: 150
  };
  timeDomainStart = new Date(d3.min(data,function(d){return d.ArrTime;})).getTime();
  timeDomainEnd = new Date(d3.max(data,function(d){return d.DepTime;})).getTime();
  var timeDomainMode = FIT_TIME_DOMAIN_MODE; // fixed or fit
  var taskTypes = [];
  var taskStatus = [];
  var height = document.body.clientHeight - margin.top - margin.bottom - 5;
  var width = document.body.clientWidth - margin.right - margin.left - 5;

  var tickFormat = "%H:%M";

  var keyFunction = function(d) {
    return d.DepTime + d.aircraftTail + d.ArrTime;
  };

  var rectTransform = function(d) {
    return "translate(" + x(new Date(d.DepTime).getTime()) + "," + y(d.aircraftTail) + ")";
  };

  x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]);

  y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .1);

  var xAxis = d3.svg.axis().scale(x).orient("top").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
    .tickSize(8).tickPadding(8);

  var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  var initTimeDomain = function(tasks) {
    if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
      if (tasks === undefined || tasks.length < 1) {
        timeDomainStart = new Date().getTime();
        timeDomainEnd = new Date().getTime();
        return;
      }
      tasks.sort(function(a, b) {
        return a.ArrTime - b.ArrTime;
      });
      timeDomainEnd = new Date(tasks[tasks.length - 1].ArrTime).getTime();
      tasks.sort(function(a, b) {
        return a.DepTime - b.DepTime;
      });
      timeDomainStart = new Date(tasks[0].DepTime).getTime();
    }
  };

  var initAxis = function() {
    x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
    y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .8);
    xAxis = d3.svg.axis().scale(x).orient("top").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
      .tickSize(2).tickPadding(2);

    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(2);
  };

  function gantt(tasks) {

    initTimeDomain(tasks);
    initAxis();

    var svg = d3.select("body")
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "gantt-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    svg.selectAll(".chart")
      .data(tasks, keyFunction).enter()
      .append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", function(d) {
        if (taskStatus[d.status] == null) {
          return "bar";
        }
        return taskStatus[d.status];
      })
      .attr("y", 0)
      .attr("transform", rectTransform)
      .attr("height", '20px')
      .attr("width", function(d) {
        return (x(new Date(d.ArrTime).getTime()) - x(new Date(d.DepTime).getTime()));
      });


    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
      .transition()
      .call(xAxis);

//add functionon click here for y axis
    svg.append("g").attr("class", "y axis")
      .transition().call(yAxis);

    d3.select(".y.axis")
    .on('click', function(d) {
      window.open('https://www.google.co.in','sample window','height=200,width=200');
      console.log(d);
    });

    return gantt;

  };

  gantt.redraw = function(tasks) {

    initTimeDomain(tasks);
    initAxis();

    var svg = d3.select("svg");

    var ganttChartGroup = svg.select(".gantt-chart");
    var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

    rect.enter()
      .insert("rect", ":first-child")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", function(d) {
        if (taskStatus[d.status] == null) {
          return "bar";
        }
        return taskStatus[d.status];
      })
      .transition()
      .attr("y", 0)
      .attr("transform", rectTransform)
      .attr("height", function(d) {
        return y.rangeBand();
      })
      .attr("width", function(d) {
        return (x(d.ArrTime) - x(d.DepTime));
      });

    rect.transition()
      .attr("transform", rectTransform)
      .attr("height", function(d) {
        return y.rangeBand();
      })
      .attr("width", function(d) {
        return (x(d.ArrTime) - x(d.DepTime));
      });

    rect.exit().remove();

    svg.select(".x").transition().call(xAxis);
    svg.select(".y").transition().call(yAxis);



    return gantt;
  };

  gantt.margin = function(value) {
    if (!arguments.length)
      return margin;
    margin = value;
    return gantt;
  };

  gantt.timeDomain = function(value) {
    if (!arguments.length)
      return [timeDomainStart, timeDomainEnd];
    timeDomainStart = +value[0], timeDomainEnd = +value[1];
    return gantt;
  };

  /**
   * @param {string}
   *                vale The value can be "fit" - the domain fits the data or
   *                "fixed" - fixed domain.
   */
  gantt.timeDomainMode = function(value) {
    if (!arguments.length)
      return timeDomainMode;
    timeDomainMode = value;
    return gantt;

  };

  gantt.taskTypes = function(value) {
    if (!arguments.length)
      return taskTypes;
    taskTypes = value;
    return gantt;
  };

  gantt.taskStatus = function(value) {
    if (!arguments.length)
      return taskStatus;
    taskStatus = value;
    return gantt;
  };

  gantt.width = function(value) {
    if (!arguments.length)
      return width;
    width = +value;
    return gantt;
  };

  gantt.height = function(value) {
    if (!arguments.length)
      return height;
    height = +value;
    return gantt;
  };

  gantt.tickFormat = function(value) {
    if (!arguments.length)
      return tickFormat;
    tickFormat = value;
    return gantt;
  };



  return gantt;
};
