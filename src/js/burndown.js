$(function () {
  $('#burndown').highcharts({
    
      title: {
        text: 'Kanban Board Group\'s Burndown Chart (Dummy Data)',  
      },
      
      subtitle: {
        text: 'Sprint X',
      },
      
      xAxis: {
        title: {
          text: 'Day'
        },
        categories: ['1', '2', '3', '4', '5','6', '7', '8', '9', '10',
                      '11', '12', '13', '14','15','16']
      },
      
      yAxis: {
        title: {
          text: '# Hours'
        },
      },
      
      tooltip: {
        valueSuffix: ' hours',
        crosshairs: true,
        shared: true
      },
      
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 1
      },
      
      series: [{
      
        name: 'Sprint Ideal',
        color: 'red',
        lineWidth: 5,
        marker: {
          radius: 6
        },
        data: [200,186,172,158,144,130,116,102,88,74,60,46,32,18,2,0]
      }, {
      
        name: 'Sprint Actual',
        lineWidth: 5,
        color: 'green',
        marker: {
          radius: 6
        },
        data: [200,175,225,210,200,175,161,140,100,80,75,40,75,51,31,0]
        
      }]
    });
  });


var citiesRef = db.collection("cities");

citiesRef.doc("SF").set({
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
citiesRef.doc("LA").set({
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
citiesRef.doc("DC").set({
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
citiesRef.doc("TOK").set({
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
citiesRef.doc("BJ").set({
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });


var query = citiesRef.where("capital", "==", true);