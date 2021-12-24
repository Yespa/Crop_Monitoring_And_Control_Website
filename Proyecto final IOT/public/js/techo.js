//Objeto en donde mandaremos informacion hacia servidor principal
var objeto = {
    estado_techo: "TEC_CLOSE",
};


document.getElementById('Desc_techo').addEventListener('click', function() {
    document.getElementById('Esta_techo').value = "Cerrado";
    objeto.estado_techo = "TEC_CLOSE";
    
    $.post({
        url: "/techo_p",
        data: JSON.stringify(objeto),
        contentType: "application/json",
        success: function(datosEntrada,status) {
            if( datosEntrada == "change_techo"){
                alertify.error('Cerrando techo...');
                //alert("Cerrando techo...");
            }
        }
    });
});

document.getElementById('Act_techo').addEventListener('click', function() {
    document.getElementById('Esta_techo').value = "Abierto";
    objeto.estado_techo = "TEC_OPEN";
    $.post({
        url: "/techo_p",
        data: JSON.stringify(objeto),
        contentType: "application/json",
        success: function(datosEntrada,status) {
            if( datosEntrada == "change_techo"){
                alertify.success('Abriendo techo...');
                //alert("Abriendo techo...");
            }        }
    });
});
