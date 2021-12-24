
var objeto1 = {
    info: '1',
};

var vector_fechas = [];
var vector_sensor_hum = [];
var vector_sensor_ph = [];
var vector_sensor_temp = [];
var vector_rociador = [];
var vector_techo = [];
var flag = 0;
var r = 0;
let info;

var a;
var b;


///////// BOTON DE OBTENER INFORMACION ////////

document.getElementById('obt_info').addEventListener('click', function() {
   
    $.post({
        url: "/estadistica",
        data: JSON.stringify(objeto1),
        contentType: "application/json",
        success: function(datosEntrada,status) {

            if( datosEntrada == "ok"){
                alertify.success('Información almacenada');

            }

        }
        
    });

    flag = 1;

    
    
});

document.getElementById('graf_tab').addEventListener('click', function(){

    $.post({
        url: "/Actualizar",
        success: function(IngresoInfo,status) {

            Object.keys(IngresoInfo).forEach(function(key) {
                var row = IngresoInfo[key];
                //console.log(row);
                vector_fechas.push(row.fecha);
                vector_sensor_hum.push(row.sensor_humedad);
                vector_sensor_ph.push(row.sensor_ph);
                vector_sensor_temp.push(row.sensor_temp);
                vector_rociador.push(row.rociador);
                vector_techo.push(row.techo);
                
            });

        
        
        if (flag == 0){
            r = 0;
        }else if (flag == 1){
            r = r +5;
        }
            
        document.getElementById('f1').innerHTML = vector_fechas[0+r];
        document.getElementById('f2').innerHTML = vector_fechas[1+r];
        document.getElementById('f3').innerHTML = vector_fechas[2+r];
        document.getElementById('f4').innerHTML = vector_fechas[3+r];
        document.getElementById('f5').innerHTML = vector_fechas[4+r];
    
    
        document.getElementById('sh1').innerHTML = vector_sensor_hum[0+r];
        document.getElementById('sh2').innerHTML = vector_sensor_hum[1+r];
        document.getElementById('sh3').innerHTML = vector_sensor_hum[2+r];
        document.getElementById('sh4').innerHTML = vector_sensor_hum[3+r];
        document.getElementById('sh5').innerHTML = vector_sensor_hum[4+r];
    
    
    
        document.getElementById('sp1').innerHTML = vector_sensor_ph[0+r];
        document.getElementById('sp2').innerHTML = vector_sensor_ph[1+r];
        document.getElementById('sp3').innerHTML = vector_sensor_ph[2+r];
        document.getElementById('sp4').innerHTML = vector_sensor_ph[3+r];
        document.getElementById('sp5').innerHTML = vector_sensor_ph[4+r];

        document.getElementById('tp1').innerHTML = vector_sensor_temp[0+r];
        document.getElementById('tp2').innerHTML = vector_sensor_temp[1+r];
        document.getElementById('tp3').innerHTML = vector_sensor_temp[2+r];
        document.getElementById('tp4').innerHTML = vector_sensor_temp[3+r];
        document.getElementById('tp5').innerHTML = vector_sensor_temp[4+r];    
    
    
        document.getElementById('r1').innerHTML = vector_rociador[0+r];
        document.getElementById('r2').innerHTML = vector_rociador[1+r];
        document.getElementById('r3').innerHTML = vector_rociador[2+r];
        document.getElementById('r4').innerHTML = vector_rociador[3+r];
        document.getElementById('r5').innerHTML = vector_rociador[4+r];
    
    
    
        document.getElementById('t1').innerHTML = vector_techo[0+r];
        document.getElementById('t2').innerHTML = vector_techo[1+r];
        document.getElementById('t3').innerHTML = vector_techo[2+r];
        document.getElementById('t4').innerHTML = vector_techo[3+r];
        document.getElementById('t5').innerHTML = vector_techo[4+r];



        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'Grafica_estad',
            parseTime: false,
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: 
            
            [
              { l: vector_fechas[0+r], value: vector_sensor_hum[0+r], value2: vector_sensor_ph[0+r], value3: vector_sensor_temp[0+r]},
              { l: vector_fechas[1+r], value: vector_sensor_ph[1+r], value2: vector_sensor_ph[1+r], value3: vector_sensor_temp[1+r]},
              { l: vector_fechas[2+r], value: vector_sensor_hum[2+r], value2: vector_sensor_ph[2+r], value3: vector_sensor_temp[2+r]},
              { l: vector_fechas[3+r], value: vector_sensor_hum[3+r], value2: vector_sensor_ph[3+r], value3: vector_sensor_temp[3+r]},
              { l: vector_fechas[4+r], value: vector_sensor_hum[4+r], value2: vector_sensor_hum[4+r], value3: vector_sensor_temp[4+r]}
            ],
            // The name of the data record attribute that contains x-values.
            xkey: 'l',
            
            // A list of names of data record attributes that contain y-values.
            ykeys: ['value', 'value2','value3'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Humedad','PH','Temperatura'],
            resize: true,
            lineColors: ['green','blue','red']
          
        
        });
        
        //console.log(vector_fechas);
        //console.log(vector_sensor_ph);


        }

        
    });



});



// Morris.Line({
//     // ID of the element in which to draw the chart.
//     element: 'Grafica_estad',
//     // Chart data records -- each entry in this array corresponds to a point on
//     // the chart.
//     data: 
    
//     [
//       { year: '2008', value: vector_sensor_hum[0+r], value2: vector_sensor_ph[0+r], max:10, min: 2 },
//       { year: '2009', value: vector_sensor_ph[1+r], value2: vector_sensor_ph[1+r], max: 10, min: 2 },
//       { year: '2010', value: vector_sensor_hum[2+r], value2: vector_sensor_ph[2+r], max: 10, min: 2 },
//       { year: '2011', value: vector_sensor_hum[3+r], value2: vector_sensor_ph[3+r], max: 10, min: 2 },
//       { year: '2012', value: vector_sensor_hum[4+r], value2: vector_sensor_hum[4+r], max: 10, min: 2 }
//     ],
//     // The name of the data record attribute that contains x-values.
//     xkey: 'year',
//     // A list of names of data record attributes that contain y-values.
//     ykeys: ['value', 'value2','max','min'],
//     // Labels for the ykeys -- will be displayed when you hover over the
//     // chart.
//     labels: ['Humedad','PH','Maximo','Minimo'],
//     resize: true,
//     lineColors: ['#8AAE53','#F88568','red','green']
  

// });
