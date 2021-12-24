/*
 * File:   HUERTA.c
 * Author: David - Yesid
 *
 * Created on 24 de mayo de 2020, 12:30 AM
 */
// PIC18F2550 Configuration Bit Settings

// 'C' source line config statements

// CONFIG1L
#pragma config PLLDIV = 2       // PLL Prescaler Selection bits (Divide by 2 (8 MHz oscillator input))
#pragma config CPUDIV = OSC1_PLL2// System Clock Postscaler Selection bits ([Primary Oscillator Src: /1][96 MHz PLL Src: /2])
#pragma config USBDIV = 1       // USB Clock Selection bit (used in Full-Speed USB mode only; UCFG:FSEN = 1) (USB clock source comes directly from the primary oscillator block with no postscale)

// CONFIG1H
#pragma config FOSC = INTOSC_HS // Oscillator Selection bits (Internal oscillator, HS oscillator used by USB (INTHS))
#pragma config FCMEN = OFF      // Fail-Safe Clock Monitor Enable bit (Fail-Safe Clock Monitor disabled)
#pragma config IESO = OFF       // Internal/External Oscillator Switchover bit (Oscillator Switchover mode disabled)

// CONFIG2L
#pragma config PWRT = OFF       // Power-up Timer Enable bit (PWRT disabled)
#pragma config BOR = ON         // Brown-out Reset Enable bits (Brown-out Reset enabled in hardware only (SBOREN is disabled))
#pragma config BORV = 3         // Brown-out Reset Voltage bits (Minimum setting 2.05V)
#pragma config VREGEN = OFF     // USB Voltage Regulator Enable bit (USB voltage regulator disabled)

// CONFIG2H
#pragma config WDT = ON         // Watchdog Timer Enable bit (WDT enabled)
#pragma config WDTPS = 32768    // Watchdog Timer Postscale Select bits (1:32768)

// CONFIG3H
#pragma config CCP2MX = ON      // CCP2 MUX bit (CCP2 input/output is multiplexed with RC1)
#pragma config PBADEN = ON      // PORTB A/D Enable bit (PORTB<4:0> pins are configured as analog input channels on Reset)
#pragma config LPT1OSC = OFF    // Low-Power Timer 1 Oscillator Enable bit (Timer1 configured for higher power operation)
#pragma config MCLRE = ON       // MCLR Pin Enable bit (MCLR pin enabled; RE3 input pin disabled)

// CONFIG4L
#pragma config STVREN = ON      // Stack Full/Underflow Reset Enable bit (Stack full/underflow will cause Reset)
#pragma config LVP = ON         // Single-Supply ICSP Enable bit (Single-Supply ICSP enabled)
#pragma config XINST = OFF      // Extended Instruction Set Enable bit (Instruction set extension and Indexed Addressing mode disabled (Legacy mode))

// CONFIG5L
#pragma config CP0 = OFF        // Code Protection bit (Block 0 (000800-001FFFh) is not code-protected)
#pragma config CP1 = OFF        // Code Protection bit (Block 1 (002000-003FFFh) is not code-protected)
#pragma config CP2 = OFF        // Code Protection bit (Block 2 (004000-005FFFh) is not code-protected)
#pragma config CP3 = OFF        // Code Protection bit (Block 3 (006000-007FFFh) is not code-protected)

// CONFIG5H
#pragma config CPB = OFF        // Boot Block Code Protection bit (Boot block (000000-0007FFh) is not code-protected)
#pragma config CPD = OFF        // Data EEPROM Code Protection bit (Data EEPROM is not code-protected)

// CONFIG6L
#pragma config WRT0 = OFF       // Write Protection bit (Block 0 (000800-001FFFh) is not write-protected)
#pragma config WRT1 = OFF       // Write Protection bit (Block 1 (002000-003FFFh) is not write-protected)
#pragma config WRT2 = OFF       // Write Protection bit (Block 2 (004000-005FFFh) is not write-protected)
#pragma config WRT3 = OFF       // Write Protection bit (Block 3 (006000-007FFFh) is not write-protected)

// CONFIG6H
#pragma config WRTC = OFF       // Configuration Register Write Protection bit (Configuration registers (300000-3000FFh) are not write-protected)
#pragma config WRTB = OFF       // Boot Block Write Protection bit (Boot block (000000-0007FFh) is not write-protected)
#pragma config WRTD = OFF       // Data EEPROM Write Protection bit (Data EEPROM is not write-protected)

// CONFIG7L
#pragma config EBTR0 = OFF      // Table Read Protection bit (Block 0 (000800-001FFFh) is not protected from table reads executed in other blocks)
#pragma config EBTR1 = OFF      // Table Read Protection bit (Block 1 (002000-003FFFh) is not protected from table reads executed in other blocks)
#pragma config EBTR2 = OFF      // Table Read Protection bit (Block 2 (004000-005FFFh) is not protected from table reads executed in other blocks)
#pragma config EBTR3 = OFF      // Table Read Protection bit (Block 3 (006000-007FFFh) is not protected from table reads executed in other blocks)

// CONFIG7H
#pragma config EBTRB = OFF      // Boot Block Table Read Protection bit (Boot block (000000-0007FFh) is not protected from table reads executed in other blocks)

// #pragma config statements should precede project file includes.
// Use project enums instead of #define for ON and OFF.


#define luz PORTBbits.RB1//leer sensor luz
#define open_motor LATBbits.LB2//prender motor
#define close_motor LATAbits.LA5//motor reversa
#define valve LATBbits.LB3//valvula manguera
#define fin_close PORTBbits.RB4//final carrera cerrar techo
#define fin_open PORTAbits.RA4//final carrera open

#include <xc.h>
#define _XTAL_FREQ 8000000;
//otras librerias importantes
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <xc.h>

char palabra[100];
char buffer[100];
char data[100];
int index=0;
int i=0;
int cont=0;

int humedad=0;//HUMEDAD ACTUAL
int hum=0;//humedad en bits y V
int PH_full=0;//ph actual
int PH=0;//ph en bits y V
int temp_b;//temp en bits
int temp;//temp
int flag_valve=0;
int cont_abrir=0;
int cont_cerrar=0;



unsigned int leerADC(unsigned char canal);//función del ADC


void main(void) {
    //OSCILADOR
    
    OSCCONbits.IRCF=0b111;//8MHz
    OSCCONbits.SCS=0b10;//interno
    
    //SERIAL
    
    TRISCbits.RC7=1;//RX
    TRISCbits.RC6=1;//TX
    
    RCSTAbits.SPEN  = 1; //Habilitar puerto serial
    TXSTAbits.TXEN = 1; //Habilitar transmisión
    RCSTAbits.CREN = 1;//Habilito recepción por el puerto Rx.
    
    //BAUDIOS 9600
    
    TXSTAbits.SYNC =0;
    BAUDCONbits.BRG16 =0;
    TXSTAbits.BRGH = 0;
    SPBRG = 12;//A 8MHZ----->8*10^6/(64*(12+1))
    
    //DEFINICIÓN DE PINES
    
    TRISAbits.RA0=1;//HUM
    TRISAbits.RA1=1;//PH
    TRISAbits.RA2=1;//TEMP
    TRISBbits.RB1=1;//LUZ
    TRISBbits.RB2=0;//OPEN_MOTOR
    TRISBbits.RB3=0;//VALVULA MANGUERA
    TRISAbits.RA5=0;//CLOSE_MOTOR
    TRISCbits.RC7=1;//RX
    TRISCbits.RC6=0;//TX
    TRISBbits.RB4=1;//FIN CARRERA CLOSE
    TRISAbits.RA4=1;//FIN CARRERA OPEN

    ////ADC/////////
    
    ADCON1bits.VCFG1 = 0; //Voltaje de referencia negativo (GND)
    ADCON1bits.VCFG0 = 0; //Voltaje de referencia positivo (VDD)
    ADCON1bits.PCFG = 0b0011; // Pines AN0 - AN1 ANALOGOS
    ADCON0bits.CHS = 0b0000; // SELECCIONAR CANAL 0 (AN0) PARA ADC
    ADCON0bits.CHS = 0b0001; // SELECCIONAR CANAL 1 (AN1) PARA ADC
    ADCON0bits.CHS = 0b0010; // SELECCIONAR CANAL 2 (AN2) PARA ADC
    ADCON2bits.ADCS = 1; //Tad= 1us
    ADCON2bits.ACQT = 1; //2Tad= 2us > 1.75us menor posible
    ADCON2bits.ADFM = 1; //right justified
    ADCON0bits.ADON = 1; //encender adc
    
    //////TIMER/////////////
    //CONFIGURACION TIMER 1...
    T1CONbits.TMR1ON = 0; //Apagar timer
    T1CONbits.TMR1CS = 0; //Reloj interno ( Fosc/4 )
    T1CONbits.T1OSCEN = 0; //Oscilador para cristales apagado
    T1CONbits.T1CKPS = 0b11; //1:8 prescale
    //OJO: solo se activa en "1" cuando se desean dos timers...
    //si solo queremos un timer, se debe colocar "0"
    T1CONbits.RD16 = 1; //Lecturas y escrituras de 16bits (dos timers)
    TMR1 = 0; //Reset timer
    /////INTERRUPCIONES////////
    
    PIE1bits.RCIE=1;//habilitamos interrupcion recepcion
    INTCONbits.GIE=1;//Interrupcion global
    INTCONbits.PEIE=1;//Interrupcion periferica
    
    
    while(1){
        if(luz==1 || (strcmp(palabra,"TEC_ON")==0) && cont_abrir==0 && fin_open==0){
            open_motor = 1;//puente H con motor me hace abrir el techo
            close_motor = 0;
            cont_abrir = 1;
            cont_cerrar = 0;
        }
        if(luz==0 || (strcmp(palabra,"TEC_OFF")==0) && cont_cerrar==0 && fin_close==0){
            open_motor=0;//puente H con motor me hace cerrar el techo
            close_motor=1;
            cont_abrir = 0;
            cont_cerrar = 1;
        }
        
        hum = leerADC(0);//1023 BITS
        hum = hum*4/1023+0.5;//bits a V
        humedad = 25*hum-12.5;//V a %HUM
        
        PH = leerADC(1);//1023 BITS
        PH = PH*0.828/1023;//bits a V
        PH_full = -13/0.828*PH+13;//V a PH
        
        temp_b = leerADC(2);//1023 BITS
        temp_b = temp_b*5/1023;
        temp = temp_b*23;//temp en °C
        
        if ((strcmp(palabra,"ROC_ON")==0) ){//ENVIAN COMANDO RIEGO
            valve=1;//se activa el riego
        }
        if ((strcmp(palabra,"ROC_OFF")==0)){
            valve=0;
        }
        
        
////////OBTENER TODA LA INFO//////////////    
        if(cont==5){//cada segundo le enviamos esta info al ESP
            printf("hum:%i",humedad);
            printf("ph:%i",PH_full);
            printf("temp:%i",temp);
            cont=0;
        }


        
        
    }
    
    return;
}


void putch(char data){
    while(!TXIF){ 
    }
    TXREG = data;
}
unsigned int leerADC(unsigned char canal) {
    ADCON0bits.CHS = canal; //seleccionar canal analogico
    ADCON0bits.GO = 1; //comenzar adc
    while(ADCON0bits.GO) //esperar a que termine de leer
    return ADRES; //retorna el valor
}

void __interrupt() isr(){

    //si se llega bandera de serial
    if(PIR1bits.RCIF){
        //Se guarda info de lo recibido en character (desde otro pic)
        char recibido = RCREG; //Serial.read() tambien se puede
        //Verificamos que se haya recibido correctamente la sennal de otro pic
        if(recibido  != '\n' && recibido != '\0'){
            buffer[index] = recibido ;
            index=index+1;
            if(buffer>=100){//llega a un overflow
                index=0;
            }
        }
        else if(recibido == '\n') {//acaba la palabra
            
            buffer[index]='\0';
            for (i=0; i<=index; ++i){
                palabra[i] = buffer[i];//almaceno la palabra en la variable palabra
            }
            for(i=0;i<=index; ++i){//reinicio todas las posiciones del index
                buffer[i] = '\0';
            }
            index = 0;
        }
        //Se baja bandera
        PIR1bits.RCIF = 0;
    } 
///////INTERRUPCION TIMER1/////////// 
    if (PIR1bits.TMR1IF) {
        //Reaccionamos al evento
        cont = cont +1;
        //Se debe resetear el timer 0, de lo contrario, no se resetea 
        TMR1 = 0;
        //Bajamos o desactivamos la bandera asociada al evento
        PIR1bits.TMR1IF = 0;
    }
    
}
