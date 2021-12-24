//Objeto en donde mandaremos informacion hacia servidor principal
var objeto = {
    estado_rociadores: "ROC_OFF",
};


var objeto1 = {
    info: '1',
};

var r = 0;

var vector_sensor_hum = [];

document.getElementById('Desc_rociador').addEventListener('click', function() {
    
    document.getElementById('Esta_rociador').value = "Apagados";
    objeto.estado_rociadores = "ROC_OFF";
    
    $.post({
        url: "/humedad_p",
        data: JSON.stringify(objeto),
        contentType: "application/json",
        success: function(datosEntrada,status) {
            if( datosEntrada == "change_roc"){
                alertify.error('Rociadores apagados.');
            }
        }
    });
});

document.getElementById('Act_rociador').addEventListener('click', function() {
    
    document.getElementById('Esta_rociador').value = "Activados";
    objeto.estado_rociadores = "ROC_ON";
    $.post({
        url: "/humedad_p",
        data: JSON.stringify(objeto),
        contentType: "application/json",
        success: function(datosEntrada,status) {
            if( datosEntrada == "change_roc"){
                alertify.success('Rociadores encendidos.');
                //alert("Rociadores encendidos");
            }        
        }
    });
});


document.getElementById('Obt_info').addEventListener('click', function(){


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

    $.post({
        url: "/Actualizar",
        success: function(IngresoInfo,status) {

            Object.keys(IngresoInfo).forEach(function(key) {
                var row = IngresoInfo[key];

                vector_sensor_hum.push(row.sensor_humedad);
                
                
            });
            console.log(vector_sensor_hum[4 + r])

            document.getElementById('Info_hum').value = vector_sensor_hum[4 + r];
        } 
    });




});