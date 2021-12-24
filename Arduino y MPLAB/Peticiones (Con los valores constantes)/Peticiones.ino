#include <Arduino.h>

#include <ESP8266WiFi.h>

#include <ESP8266HTTPClient.h>

#include <WiFiClient.h>


const char* ssid = "ARISMENDY";
const char* password = "1007140073";
String DEVICE_ID;
String palabra;


String techo;
String rociadores;
String info_esp;

String host = "http://192.168.1.9";
String port = ":3001";


//DECLARAMOS FUNCIONES QUE USAREMOS ABAJO
void get_rociador();
void get_techo();
String obt_info();


int L = 15;//map(analogRead(0),0,1023,-50,150);
int R = 34;//map(analogRead(1),0,1023,0,100);
int T = 21;

void setup() {

  Serial.begin(9600);
  // Serial.setDebugOutput(true);

  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }
//WIFI PROPIA
//  WiFi.mode(WIFI_STA);
//  WiFiMulti.addAP("SSID", "PASSWORD");

  Serial.println("ESP_INIT");   /// Doy aviso de que el ESP se ha energizado

//CONECTAR A WIFI
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("");
  Serial.print("MAC address: ");
  DEVICE_ID = WiFi.macAddress();
  Serial.println(DEVICE_ID);

}


void loop(){
  get_rociador();
  get_techo();
  if (obt_info() == "1"){
      post("esp_variables_alm", concatenar(String(R),String(L),String(T)));
  }
  
  delay(1000);
}


void get_rociador() {
  // Espero la conexión a WiFi
  if ((WiFi.status() == WL_CONNECTED)) {

    WiFiClient client;

    HTTPClient http; // Sera de tipo http, va saber que estoy recibiendo http


    /// GET PARA EL ESTADO DE LOS ROCIADORES
    ////-------> Se conecta a la direccion del get

    if (http.begin(client, "http://192.168.1.9:3001/estado_roceador")) { 


     // Obtengo el codigo del html
      int httpCode = http.GET();

      //Se comprueba de que si llego un codigo
      if (httpCode > 0) {

        // Verificamos si se conecta al servidor
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          rociadores = http.getString();
          
        }
      } else {  // En caso de que el codigo se diferente a 200
        Serial.printf("GET_ERROR");
        Serial.println(httpCode);
      }

      http.end();
    } else {
      Serial.printf("GET_ERROR_CONECTED"); /// NO HAY CONEXIÓN WIFI
    }

  }
  Serial.println(rociadores);
  delay(1000);
}

void get_techo() {
  // Espero la conexión a WiFi
  if ((WiFi.status() == WL_CONNECTED)) {

    WiFiClient client;

    HTTPClient http; // Sera de tipo http, va saber que estoy recibiendo http

    /// GET PARA EL ESTADO DEL TECHO
    ////-------> Se conecta a la direccion del get
    if (http.begin(client, "http://192.168.1.9:3001/estado_techo")) { 


     // Se guardar el codigo del html
      int httpCode = http.GET();

      // Si hay codigo se entre a la codicion
      if (httpCode > 0) {

        // Si se conecta al servidor o es 200
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          techo = http.getString();
          
        }
      } else {
        /// EL codigo es diferente de 200
        Serial.printf("GET_ERROR");
        Serial.println(httpCode);
      }

      http.end();
    } else {
      Serial.printf("GET_ERROR_CONECTED"); /// NO HAY CONEXION A WIFI
    }

  }
  Serial.println(techo); /// ENVIO INFORMACION POR SERIAL
  delay(1000);
}

String obt_info() {
  // Espero la conexión a WiFi
  if ((WiFi.status() == WL_CONNECTED)) {

    WiFiClient client;

    HTTPClient http; // Sera de tipo http, va saber que estoy recibiendo http

    /// GET PARA ENVIO DE INFORMACION
    
    ////-------> Se conecta a la direccion del get
    if (http.begin(client, "http://192.168.1.9:3001/agg_info")) { 


     // Se guardar el codigo del html
      int httpCode = http.GET();

      // Si hay codigo se entre a la codicion
      if (httpCode > 0) {

        // Si se conecta al servidor o es 200
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          info_esp = http.getString();
          
        }
      } else {
        /// EL codigo es diferente de 200
        Serial.printf("GET_ERROR");
        Serial.println(httpCode);
      }

      http.end();
    } else {
      Serial.printf("GET_ERROR_CONECTED"); /// NO HAY CONEXION A WIFI
    }
    
  }
  //Serial.println(info_esp);
  delay(1000);
  return info_esp;
}


void post(String path, String value){
  WiFiClient client;

  HTTPClient http;
  
  String url = host + port + "/" + path;
  
  if(http.begin(client,url)){ 
    // Si se incia conexion http desde el esp hacia el server
    http.addHeader("Content-Type","application/json");
    
    int httpCode = http.POST(value);

    http.end();
    
   
  }else{
    Serial.println("POST_NO_CONNECT");
    
  }
  
  
}

String concatenar(String Sensor_humedad, String Sensor_PH,String Sensor_temp){

  String json = "{\"sens_hum\":\""+Sensor_humedad+"\",\"sens_PH\":\""+Sensor_PH+"\",\"sens_temp\":\""+Sensor_temp+"\"}";
  
  return json;
  
}
