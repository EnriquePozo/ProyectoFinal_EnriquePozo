const btnPopup= document.querySelector('.btnLogin-popup');
const servicio= document.querySelector('.serv');
const btnOut= document.querySelector('.btnLogout')
servicio.classList.remove('desactivado'); 
btnPopup.classList.add('desactivalogin');
btnOut.classList.remove('desactivalogout'); 

//FUNCION DE CUOTAS PARA PRESTAMO

//interes es la TEA, se requiere la TEM
function calcularTEM(tea){
    let tem=(Math.pow(1+(tea/100),1/12)-1)*100;
    return tem;
}

//calculo de intereses de cuota 1
function calcularPrimeraCuota(tasa,monto){
    let lcuota=((Math.pow(tasa/100 + 1,1/12)  - 1) * monto)/100;
    return lcuota;
}


//calculo del seguro
function calcularSeguro(monto){
    let seg=monto*0.0914/100;
    return seg;
}

//calculo de la cuota fija mensual a pagar sin gastos
function calcularCuota(monto,tem){
    let cfm=monto*(((tem/100)*Math.pow(1+tem/100,12))/(Math.pow(1+tem/100,12)-1));
    return cfm;
}

//calculo de la cuota final
function calcularCuotaFinal(cfm,seg){
    let cf=cfm+seg;
    return cf;
}

//calculo de amortizacion mensual
function amortizacionMensual(cf,lc,seg){
    let am=cf-lc-seg;
    return am;
}

//calculo de saldo capital restante
function saldoCapital(monto,am){
    let sc=monto-am;
    return sc;
}


/*
function cuotaPrestamo(nrocuota,saldocapital,amort,inter,cuo,seg,montototal){
    this.ncuota=nrocuota;
    this.scapital=saldocapital;
    this.amortizacion=amort;
    this.interes=inter;
    this.cuota=cuo;
    this.seguro=seg;
    this.mtotal=montototal;
}
*/

class cuotaPrestamo{
    constructor(nrocuota,saldocapital,amort,inter,cuo,seg,montototal){
        this.ncuota=nrocuota;
        this.scapital=saldocapital;
        this.amortizacion=amort;
        this.interes=inter;
        this.cuota=cuo;
        this.seguro=seg;
        this.mtotal=montototal;
    }
}
const registros = [];
//CRONOGRAMA DE PAGOS
function generarCronograma(capital,cuota,interes){
    if(capital>0 && cuota>0 && interes>0)
    {   
        let saldo=capital;
        //const ocuota = {ncuota}
        //console.log("CRONOGRAMA DE PAGOS:");
        //console.log("===================");

        registros.splice(0, registros.length);

        for(i=1;i<=cuota;i++)
        {
            let tem=Math.round(calcularTEM(interes)*100)/100;
            let lcuota=Math.round(calcularPrimeraCuota(interes,saldo)*100)/100;
            let seg=Math.round(calcularSeguro(saldo)*100)/100;
            let cfm=Math.round(calcularCuota(saldo,tem)*100)/100;        
            let cf=Math.round(calcularCuotaFinal(cfm,seg)*100)/100;
            let am=Math.round(amortizacionMensual(cf,lcuota,seg)*100)/100;
            saldo=Math.round(saldoCapital(saldo,am)*100)/100;

            registros.push(new cuotaPrestamo(i, saldo, am, lcuota, cfm, seg, cf));
            
            //console.log("Cuota nro. "+i.toString()+": saldo capital: S/ "+saldo.toString()+"     amortizacion: S/ "+am.toString()+"     interes: S/ "+lcuota.toString()+"     cuota: S/ "+cfm.toString()+"     seguro: S/ "+seg.toString()+"     monto total: S/ "+cf.toString());
        }
        /*
        for(const registro of registros)
        {
            console.log("Cuota nro.         "+registro.ncuota);
            console.log("Saldo capital:   S/"+registro.scapital);
            console.log("Amortización:    S/"+registro.amortizacion);
            console.log("Interés:         S/"+registro.interes);
            console.log("Cuota:           S/"+registro.cuota);
            console.log("Seguro:          S/"+registro.seguro);
            console.log("Monto Total:     S/"+registro.mtotal);
            
        }
        */
    }else{
        //alert("Faltan datos");
        Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Datos insuficientes!',
            showConfirmButton: false,
            timer: 1500
          });
    }
}


/*
let capital=parseFloat(prompt("ingresar capital: "));
let cuota=parseInt(prompt("ingresar nro. de cuotas: "));
let interes=parseFloat(prompt("ingresar tasa de interes (%): ")); //TEA

generarCronograma(capital,cuota,interes);

*/
const Validaciones = (capital,cuota,interes) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(() => {
            if (!isNaN(capital) && !isNaN(cuota) && !isNaN(interes)) {
                resolve(true);
            }
            else
            {
                reject(false);
            }
        }, 2000);
    }

    )
}


function simulacion(){
    eliminarResultado();
    let capital=document.getElementById("icapital").value;
    let cuota=document.getElementById("icuotas").value;
    let interes=document.getElementById("itea").value; //TEA
    if(Validaciones(capital,cuota,interes)){

        generarCronograma(capital,cuota,interes);

        if(registros.length>0){
            const conten = document.getElementById("contenedor");
            const divfondo = document.createElement('div');
            divfondo.innerHTML=`<div id="fondoresultado">
            </div>`;
            conten.append(divfondo);

            const fondo= document.getElementById("fondoresultado");

            const div2=document.createElement('div');
            div2.innerHTML=`<div class="resultado">
            <h3 class="text-center">Simulacion de cuotas</h3>
            <div class="row text-center encabezado1">
            <div class="col">Nro. Cuota</div>
            <div class="col">Saldo Capital</div>
            <div class="col">Amortizacion</div>
            <div class="col">Interes</div>
            <div class="col">Cuota</div>
            <div class="col">Seguro</div>
            <div class="col">Monto Total</div>
            </div>
            </div>`;

            setTimeout(()=>{fondo.append(div2)},2000);
            //fondo.append(div2);

            //EN PANTALLA
            for(const registro of registros)
            {
                const divr=document.createElement('div');
                divr.innerHTML=`<div class="row text-center registro1">
                <div class="col">${registro.ncuota}</div>
                <div class="col">${registro.scapital}</div>
                <div class="col">${registro.amortizacion}</div>
                <div class="col">${registro.interes}</div>
                <div class="col">${registro.cuota}</div>
                <div class="col">${registro.seguro}</div>
                <div class="col">${registro.mtotal}</div>
                </div>`;
                setTimeout(()=>{fondo.append(divr)},5000);
            }


            //POR CONSOLA
            let busqueda=0;
            let nbusqueda=0;
            registros.forEach(
                (reg)=>{    /*
                    console.log("Cuota nro.         "+reg.ncuota);
                    console.log("Saldo capital:   S/"+reg.scapital);
                    console.log("Amortización:    S/"+reg.amortizacion);
                    console.log("Interés:         S/"+reg.interes);
                    console.log("Cuota:           S/"+reg.cuota);
                    console.log("Seguro:          S/"+reg.seguro);
                    console.log("Monto Total:     S/"+reg.mtotal);  */
                    if(nbusqueda==0)
                    {
                        nbusqueda=reg.ncuota;
                        busqueda=reg.mtotal;
                    }
                    else{
                        if(busqueda>reg.mtotal)
                        {
                            nbusqueda=reg.ncuota;
                            busqueda=reg.mtotal;
                        }
                    }
                }
            ) 

            //console.log(registros.find(c => c.ncuota > 5));
            //alert(registros.find(c => c.ncuota > 5));
            const r= registros.find(c => c.ncuota == nbusqueda);
            //alert("cuota:"+r.ncuota);
            //const contenid = document.getElementById("contenedor")
            const div3=document.createElement('div');
            div3.innerHTML=`<br>
                            <br>
                            <div class="busqueda">
                                <div class="row">
                                    <div class="col-6">
                                        <h4>Cuota mas baja:</h4>
                                        <div class="col-12">Nro. cuota:     ${r.ncuota}</div>
                                        <div class="col-12">Saldo Capital:  S/ ${r.scapital}</div>
                                        <div class="col-12">Amortizacion:   S/ ${r.amortizacion}</div>
                                        <div class="col-12">Interes:        S/ ${r.interes}</div>
                                        <div class="col-12">Cuota:          S/ ${r.cuota}</div>
                                        <div class="col-12">Seguro:         S/ ${r.seguro}</div>
                                        <div class="col-12">Monto Total:    S/ ${r.mtotal}</div>
                                    </div>
                                    <div class="col-6"></div>
                                </div>
                            </div>`;

            setTimeout(()=>{conten.append(div3)},8000);
        }
    }
    else{
        alert("Datos insuficientes");
    };
}

function eliminarResultado(){
    
    let div = document.getElementById('fondoresultado');
    if(div !== null){
        while (div.hasChildNodes()){
            div.removeChild(div.lastChild);
        }
    }
}
/*
function validarDatos(capital,cuota,interes){
    if (!isNaN(capital) && !isNaN(cuota) && !isNaN(interes)) {
        return true;
    }
    else
    {
        return false;
    }

}
*/