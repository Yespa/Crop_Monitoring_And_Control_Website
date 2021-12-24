//////////// LOGIN ///////

var usuario = '0';
var password = '0';

var datau = {
    user: usuario,
    pass: password,
};

///////// CAMBIO DE CONTRASEÑA ////////
var usuario_cambio = '0';
var password_new = '1';
var confirm_password = '2';

var datac = {
    usernew: usuario_cambio,
    passnew: password_new,
    confirmpass: confirm_password
};

/////// VARIABLES DE TRABAJO ////////

let text ="Restablecer contraseña";
var bandera_ocultar = 0;


///////// BOTON DE LOGIN ////////

document.getElementById('login').addEventListener('click', function() {
    datau.user = document.getElementById("usuario").value;
    datau.pass = document.getElementById("contrasena").value;
    
    //document.getElementById("nusuario1").innerHTML = usuario;

    //Esto hace parte del la nuevas    
    $.post({
        url: "/login",
        
        data: JSON.stringify(datau),
        contentType: "application/json",
        success: function(datosEntrada,status) {
        if(datosEntrada === "Ok") {
                window.location.replace("/home");
        }else
        {
            alertify.alert('Nombre de usuario y/o contraseña incorrectos');
        }
                
            
        }
    });
});

///////// BOTON DE CAMBIO DE CONTRASEÑA ////////


document.getElementById('cambio').addEventListener('click', function() {
    datau.user = document.getElementById("usuario").value;
    datau.pass = document.getElementById("contrasena").value;
    
    //document.getElementById("nusuario1").innerHTML = usuario;

    
    $.post({
        url: "/login",
        
        data: JSON.stringify(datau),
        contentType: "application/json",
        success: function(datosEntrada,status) {
        if(datosEntrada === "Ok") {
            console.log("Ingreso cambio exitoso");

            if($("#cambio").text() === "Restablecer contraseña"){
                $(".ocultar_cambio").show();
                text="Ocultar cambio"
                $("#cambio").html(text)

            }else if($("#cambio").text() === "Ocultar cambio"){
                $(".ocultar_cambio").hide();
                text="Restablecer contraseña"
                $("#cambio").html(text)
            }
            
            bandera_ocultar = 1;
            
                
        }else{
                        
            if($("#cambio").text() === "Ocultar cambio"){
                $(".ocultar_cambio").hide();
                text="Restablecer contraseña"
                $("#cambio").html(text)
            }
                    
            if(bandera_ocultar == 0){    
                alertify.alert('Nombre de usuario y/o contraseña incorrectos');
            }
            bandera_ocultar =0;
        }
            
            
        }
    });
});


document.getElementById('B_change_pass').addEventListener('click', function() {
    
    datac.usernew = document.getElementById("usuarionew").value;
    datac.passnew = document.getElementById("contrasena_nueva").value;
    datac.confirmpass = document.getElementById("confirme_contrasena").value;
  
    $.post({
        url: "/change_pass",
        data: JSON.stringify(datac),
        contentType: "application/json",
        success: function(datosEntrada,status) {
        if(datosEntrada === "ok_c") {
            //alertify.alert('¡Cambio de contraseña exitoso!');
            //alert("Cambio de contraseña exitoso!");
            window.location.replace("/");
        }
        else if (datosEntrada === "Not_OK"){
            //alert("Las contraseñas no coinciden, vuelva a intentarlo.");
            alertify.error('Las contraseñas no coinciden, vuelva a intentarlo.');
        }
        else if (datosEntrada === "User_NOT"){
            alertify.alert('Por favor revise nuevamente el usuario digitado, RECUERDE que debe ser el mismo con el que se logueo.');
            //alert("Por favor revise nuevamente el usuario digitado, RECUERDE que debe ser el mismo con el que se logueo.");
        }
                
            
        }
    });
});