var selectedItem;
var inboundList = [];
var outboundList = [];
var aircrafts = [];
var format = "%H:%M";

var gantt;
//{"FlightNo": "Ground", "aircraftTail": "A6EAD", "DepTime": "2015-08-12T08:45:00", "ArrTime": "2015-08-12T12:55:00", "DepStation": "DXB",
//  "ArrStation": "DXB", "AcSubType": "332",  "depDelay": 0,  "arrDelay": 0,  "status": "",  "type": "Ground" }

$(document).ready(function() {
  filterMasterData(data);
  drawData(data);
});


function drawData(data) {
  gantt = d3.gantt().taskTypes(aircrafts).taskStatus(flightStatus).tickFormat(format);
  gantt(data);
}









function filterMasterData(data) {
  $.each(data, function(index, value) {
    if (value.type == 'Selected') {
      selectedItem = value;
    } else if (value.type == 'Maint') {
      inboundList.push(value);
    } else if (value.type == 'Flight') {
      outboundList.push(value);
    }

    if(!aircrafts[value.aircraftTail]){
      aircrafts.push(value.aircraftTail);
    }

  });
}
