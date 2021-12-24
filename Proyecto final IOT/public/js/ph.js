var objeto1 = {
    info: '1',
};



var r = 0;

var vector_sensor_ph = [];

document.getElementById('Obt_info').addEventListener('click', function(){


    $.post({
        url: "/estadistica",
        data: JSON.stringify(objeto1),
        contentType: "application/json",

        
    });

    $.post({
        url: "/Actualizar",
        success: function(IngresoInfo,status) {

            Object.keys(IngresoInfo).forEach(function(key) {
                var row = IngresoInfo[key];

                vector_sensor_ph.push(row.sensor_ph);
                
                
            });
            console.log(vector_sensor_ph[4 + r])

            document.getElementById('Est_PH').value = vector_sensor_ph[4 + r];
        } 
    });




});