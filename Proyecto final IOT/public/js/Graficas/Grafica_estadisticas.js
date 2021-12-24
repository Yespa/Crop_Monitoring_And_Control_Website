new Morris.Line({
    // ID of the element in which to draw the chart.
    element: 'Grafica_estad',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: [
      { year: '2008', value: 20, value2: 1 },
      { year: '2009', value: 10, value2: 13 },
      { year: '2010', value: 5, value2: 2 },
      { year: '2011', value: 5, value2: 6 },
      { year: '2012', value: 20, value2: 3 }
    ],
    // The name of the data record attribute that contains x-values.
    xkey: 'year',
    // A list of names of data record attributes that contain y-values.
    ykeys: ['value', 'value2'],
    // Labels for the ykeys -- will be displayed when you hover over the
    // chart.
    labels: ['Humedad','PH'],
    resize: true,
    lineColors: ['#8AAE53','#F88568']
  });