console.log("SERVIDOR CULTIVOS");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

var ingreso = false;
var user_memory = "0";

var estado_roceador = "ROC_OFF";
var est_techo = "TEC_CLOSE";
var bandera_info = "0";


let raw={};


var mysql = require('mysql');
 
var con = mysql.createConnection({
  host: "localhost",
  user: "****",
  password: "*****",
  database: "database_cultivo"
});

con.connect(function(err) {
    if (err) throw err;
      con.query("SELECT * FROM usuarios", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });

    con.query("SELECT fecha, sensor_humedad, sensor_ph, sensor_temp, rociador, techo FROM datos_esp ORDER BY id DESC LIMIT 5", function(error, result, fields) {
    

      raw = result;
      console.log(raw)
      
    });

});



 
app.get("/",function(request,response){

    response.sendFile(__dirname + "/public/Login.html");


});


////////////////// GET DE HOME /////////////////////////////


app.get("/home",function(request,response) {
    if (ingreso) {
          console.log("Ingreso home exitoso");
          response.sendFile(__dirname + "/public/home.html");
    } else {
      response.send("No se ha autenticado");
    }
    //response.end();
      
    });

/////////  GET DE ESTADISTICAS ///////////////////

app.get("/estadistic",function(request,response) {
    if (ingreso) {
          console.log("Ingreso estadisticas exitoso");
          response.sendFile(__dirname + "/public/estadistica.html");
    } else {
      response.send("Para visualizar estos datos primero debe autenticarse.");
    }
    //response.end();
      
});

    
/////////  GET DE HUMEDAD ///////////////////

app.get("/humedad",function(request,response) {
  if (ingreso) {
        console.log("Ingreso humedad exitoso");
        response.sendFile(__dirname + "/public/humedad.html");
  } else {
    response.send("Para visualizar estos datos primero debe autenticarse.");
  }
  //response.end();
    
});


/////////  GET DE PH ///////////////////

app.get("/dataph",function(request,response) {
  if (ingreso) {
        console.log("Ingreso PH exitoso");
        response.sendFile(__dirname + "/public/ph.html");
  } else {
    response.send("Para visualizar estos datos primero debe autenticarse.");
  }
  //response.end();
    
});

/////////  GET DE TECHO ///////////////////

app.get("/techo",function(request,response) {
  if (ingreso) {
        console.log("Ingreso estado del techo exitoso");
        response.sendFile(__dirname + "/public/Techo.html");
  } else {
    response.send("Para visualizar estos datos primero debe autenticarse.");
  }
  //response.end();
    
});


        ////// GETS DE COMUNICACION CON ESP /////////

app.get("/estado_roceador",function(request,response) {

  response.send(estado_roceador);

});

app.get("/estado_techo",function(request,response) {

  response.send(est_techo);

});

app.get("/agg_info",function(request,response) {

  response.send(bandera_info);

});







///////////////// POST //////////////////////////////////////////////////////////////////POST//////////////////


////////////////// POST INGRESO PRINCIPAL /////////////////////////////


app.post("/login",function(request,response) {
    
    let data = request.body;
    var data6 = {};
    console.log(data);
   
    if (data.user && data.pass) {
        
    con.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?', [data.user, data.pass], function(error, result, fields) {
      var data6 =result;
      console.log(data6);
      user_memory = data.user;
      if (data6.length > 0) {
          
        ingreso = true;
        //username = data.user;
        response.send("Ok");
        //response.end();
                
        
      } else {
        
        response.send('Usuario y/o contraseña incorrectos!');
        ingreso = false;
      }           
      //response.end();
    });
  } else {
    response.send('Ingrese usuario y contraseña!');
    //response.end();
  }

    
});

////////////// TEST ESP //////////////////

app.post("/DHT10",function(request,response) {

  response.send("Ok FUNCIONAMOS");

});

 ///////// RECIBIR CAMBIOS SOBRE ESTADO ROCIADORES /////////////////// 

            ////// CAMBIOS PARA LOS ROCEADORES /////

var roceador = "-";
  
 app.post("/humedad_p",function(request,response) {
  
  let data = request.body;
  console.log(data);

  if (data.estado_rociadores == "ROC_ON" ){
    estado_roceador = "ROC_ON";
    roceador = "Activos"; 
  }else{
    estado_roceador = "ROC_OFF";
    roceador = "Apagados";
  }
  response.send('change_roc');
  response.status(200);
});


         //////// CAMBIOS EN EL TECHO ///////

var techo = "-";

app.post("/techo_p",function(request,response) {
  
  let data = request.body;
  console.log(data);

  if (data.estado_techo == "TEC_OPEN" ){
    est_techo = "TEC_OPEN";
    techo = "Abierto";
  }else{
    est_techo = "TEC_CLOSE";
    techo = "Cerrado";
  }
  response.send('change_techo');
  response.status(200);
});



///////////  CAMBIO DE CONTRASEÑA  ////////////

  app.post("/change_pass", function(request,response) {
    
    var data = request.body;
    console.log(data);

    if (user_memory == data.usernew){

      if(data.passnew == data.confirmpass){
      
        console.log("Contraseñas iguales, cambio exitoso!");
        con.query('UPDATE usuarios SET contrasena = ? WHERE usuario = ?', [data.passnew, data.usernew], function(error, result, fields) {
          response.send("ok_c");
          user_memory = "0";            
        });
      }else	{
        
        console.log("Contraseñas distintas");
        response.send("Not_OK");
      }

    }else{
      console.log("Usuarios distintos.");
      response.send("User_NOT")

    }

  });

  ////////////////////////// ENVIAR DATOS A LA BASE DE DATOS. ////////////////////



   ///////// INGRESAR DATOS DESDE POSTMAN /////////////////// 

app.post("/dd",function(request,response) {

  let data = request.body;
  console.log(data);


  //INSERT INTO `database_home`.`customers` (`nombre`, `ciudad`, `pais`) VALUES ('Yesid', 'Medellin', 'Colombia');
  if (data.nombre) {
      
    con.query('INSERT INTO `database_home`.`customers` (`nombre`, `ciudad`, `pais`) VALUES (?, ?, ?)', [data.nombre, data.ciudad, data.pais], function(error, result, fields) {
                response.send("Ok");
            
    });
  } else {
    response.send('Error :(');
    //response.end();
  }


});




app.post("/esp_variables_alm",function(request,response) {
  
  bandera_info = "0";  
  let data = request.body;
  console.log(data);

  var bandera_tabla = 0;
  var fecha = new Date();


  var segundo = fecha.getSeconds();
  var minuto = fecha.getMinutes();
  var hora = fecha.getHours();
  var dia = fecha.getUTCDay();
  var mes = fecha.getMonth() + 1;
  var año = fecha.getUTCFullYear();

  var fecha_actual = dia + "/" + mes +"/"+ año + " "+ hora + ":" + minuto +":"+ segundo;

  if (data.sens_hum) {
    bandera_tabla = 1;
    //INSERT INTO `database_cultivo`.`datos_esp` (`id`, `fecha`, `sensor_humedad`, `sensor_ph`, `rociador`, `techo`) VALUES ('1', 'd', 'd', 'd', 'd', 'd');
    con.query('INSERT INTO `database_cultivo`.`datos_esp` (`fecha`, `sensor_humedad`, `sensor_ph`, `sensor_temp`, `rociador`, `techo`) VALUES (?, ?, ?, ?, ?, ?)', [fecha_actual, data.sens_hum, data.sens_PH, data.sens_temp, roceador,techo], function(error, result, fields) {});
  } else {
    response.send('Error');
    bandera_tabla = 0;
  }

  if (bandera_tabla == 1) {
    bandera_tabla = 0;
      //SELECT fecha, sensor_humedad, sensor_ph, rociador, techo FROM datos_esp ORDER BY id DESC LIMIT 5;
    con.query("SELECT fecha, sensor_humedad, sensor_ph, sensor_temp, rociador, techo FROM datos_esp ORDER BY id DESC LIMIT 5", function(error, result, fields) {
      

      raw = result;
      
    });
  }
 
});

///////////////// POST PARA EL BOTON ////////////////////

app.post("/estadistica",function(request,response) {
  
  let data1 = request.body;
  //console.log(data1);

  if (data1.info == "1" ){
    bandera_info = "1";
 
  }else{
    bandera_info = "0";

  }
  response.send("ok");

  response.status(200);
});

app.post("/Actualizar",function(request,response) {
  
  response.send(raw);

  response.status(200);
});



  
app.listen(3001, function(){

    console.log("Servidor Iniciado.....");
});
