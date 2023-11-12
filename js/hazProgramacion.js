const hazProgramacion=document.getElementById("hazProgramacion");
const anyadeInstrumento=document.getElementById("anyadeInstrumento");
const ponerNotas=document.getElementById("ponerNotas");
const verNotas=document.getElementById("verNotas");
const recogeTabla=document.getElementById("recogeTabla");
const nivel=document.getElementById("nivel");
const materia=document.getElementById("materia");
const recogeCriterios=document.getElementById("recogeCriterios");
const tablaCriterios=document.getElementById("tablaCriterios");
const primeraEvaluacion=document.getElementById("primeraEvaluacion");
const segundaEvaluacion=document.getElementById("segundaEvaluacion");
const evaluacionFinal=document.getElementById("evaluacionFinal");
const evaluacion=document.getElementById("evaluacion");
const repartoCriterios=document.getElementById("repartoCriterios");
const competencias=document.getElementById("competencias");
const pondCriterios=document.getElementById("pondCriterios");
const grabaProgramacion=document.getElementById("grabaProgramacion");
let info={};
let infoFinal=[];
let cuentaCriterios=0;
//let ponderaCriterios={};
hazProgramacion.disabled=true;
repartoCriterios.hidden=true;
pondCriterios.hidden=true;
grabaProgramacion.hidden=true;
hazProgramacion.addEventListener('click',()=>{
    window.api.enviar("cargaHazProgramacion");
})
anyadeInstrumento.addEventListener('click',()=>{
    window.api.enviar("cargaAnyadeInstrumento");
})
ponerNotas.addEventListener('click',()=>{
    window.api.enviar("cargaPonerNotas");
})
verNotas.addEventListener('click',()=>{
    window.api.enviar("cargaVerNotas");
})
evaluacion.addEventListener('change',()=>{
    console.log("Evaluacion: "+evaluacion.options[evaluacion.selectedIndex].value);
})
let nivelElegido,materiaElegida
materia.hidden=true;
evaluacion.hidden=true;
nivel.addEventListener('change',function(){
    console.log(nivel.options[nivel.selectedIndex].value);
     nivelElegido=nivel.options[nivel.selectedIndex].value;
    if (nivelElegido==1||nivelElegido==2||nivelElegido==3){
        nivelElegido=0;
    }
    let nivelActual= nivel.options[nivel.selectedIndex].value;

window.api.enviar("dameMaterias", nivelActual)
window.api.recibir("tomaMaterias",(datos)=>{
    materia.innerHTML="";
    materia.hidden=false;
    let el0=document.createElement("option");
    el0.value="";
    el0.text="";
    materia.appendChild(el0);
    for (let i=0;i<datos.length;i++){
        let el=document.createElement("option")
        el.value=datos[i].ABREVIATURA
        el.textContent=datos[i].ASIGNATURA
        materia.appendChild(el)
    }
})
})
materia.addEventListener('change',function(){
   // evaluacion.hidden=false;
    console.log(materia.options[materia.selectedIndex].value);
    materiaElegida=materia.options[materia.selectedIndex].value;
    let eleccion={
        "nivelElegido": nivelElegido,
        "materiaElegida":materiaElegida,
        "nivelReal":nivel.options[nivel.selectedIndex].value
    }

  
    window.api.enviar("dameCompetencias",eleccion);
  //  window.api.enviar("dameCriterios",eleccion);
})
window.api.recibir("tomaCompetencias",(datos)=>{
    nivel.disabled=true;
    materia.disabled=true;
    competencias.innerHTML="";
    let sumaCompetencias=[];
    let competenciasFinales=[];
    for (let i=0;i<datos.length;i++){
        let f=competencias.insertRow(-1);
        let x=f.insertCell();
        x.innerHTML="Competencia específica nº "+(i+1)+" "+datos[i]+": ";
        let y=f.insertCell();
        let z=document.createElement("input");
        z.setAttribute("type", "number"); 
        sumaCompetencias.push(z);
        y.appendChild(z);
    }
    let g=competencias.insertRow(-1);
    let a=g.insertCell();
    let boton=document.createElement("input");
    boton.setAttribute("type","button");
   boton.value="Grabar";
    a.appendChild(boton);
    boton.addEventListener('click',function(){
        let suma=0;

        sumaCompetencias.forEach (function(numero){
            suma += parseFloat(numero.value);
        });
        console.log(suma);
    
        if (suma==100){
            for (let i=0;i<sumaCompetencias.length;i++){
                competenciasFinales.push(parseFloat(sumaCompetencias[i].value))
            }
             info={
                "repartoCompetencias":competenciasFinales,
                "nivelElegido":nivelElegido,
                "nivel":nivel.options[nivel.selectedIndex].value,
                "materiaElegida":materiaElegida
            }
            console.log("correcto "+suma);
            let entradas=competencias.getElementsByTagName('input');
            for (let i=0;i<entradas.length;i++){
                entradas[i].disabled=true;
            }
console.log("llamando a dameCriterios");
            window.api.enviar("dameCriterios",info);
            pondCriterios.hidden=false;
            repartoCriterios.hidden=true;

        }else{
            console.log("nope "+suma);
        }
    })

})
window.api.recibir("tomaCriterios",(datos)=>{
    materia.disabled=true;
    pondCriterios.hidden=false;
    repartoCompetencias.hidden=true;
    let numeroFinal=datos.length;
tablaCriterios.innerHTML="";
    let criteriosFuente=[]
    let criteriosPrimera=[];
    let criteriosSegunda=[];
    let criteriosFinal=[];
    let cuenta=0;
    for (let i=0;i<datos.length;i++){
    let crit={
        materia:datos[i].outcome_shortname.split('.')[1],
        competencia:datos[i].outcome_shortname.split('.')[2],
        criterio:datos[i].outcome_shortname.split('.')[3],
        texto:datos[i].outcome_description
       }
    
       criteriosFuente.push(crit);  
    }
    let cuentaCrit=0;
    let criterioAnterior=criteriosFuente[0].competencia;
  
    let criteriosporCompetencia=[];
    for (let i=0;i<criteriosFuente.length;i++){
        if (criteriosFuente[i].competencia==criterioAnterior){
            cuentaCrit++;
        }else{
criteriosporCompetencia.push(cuentaCrit);
criterioAnterior=criteriosFuente[i].competencia;
cuentaCrit=1;
        }
    }
    criteriosporCompetencia.push(cuentaCrit);
for (let i=0;i<criteriosporCompetencia.length;i++){
    // let nombreTabla="tablaCE"+eval(criteriosporCompetencia[i]);
    // console.log("Tabla: "+nombreTabla);
    let botCriterios=[];
    let nombreTabla=document.createElement("table");
    nombreTabla.border=1;
    nombreTabla.id="competencia"+eval(i+1);
    let qs=nombreTabla.insertRow(-1);
    let qsr=qs.insertCell();
    qsr.colSpan="2";
    qsr.innerHTML="Competencia Específica "+eval(i+1)+" ("+info.repartoCompetencias[i]+"% en el total)";
    pondCriterios.appendChild(nombreTabla);
for (let a=1;a<criteriosporCompetencia[i]+1;a++){
    let f=nombreTabla.insertRow(-1);
    let x=f.insertCell();
    x.innerHTML=criteriosFuente[cuenta].texto.substring(2);
    let y=f.insertCell();
    let z=document.createElement("input");
    z.setAttribute("type", "number"); 
    y.appendChild(z);
    botCriterios.push(z);
    cuenta++;
}

let f=nombreTabla.insertRow();
let x=f.insertCell();
let bot=document.createElement("button");
bot.innerHTML="Grabar"
x.appendChild(bot);
bot.addEventListener('click',function(){
    let suma=0;

botCriterios.forEach (function(numero){
    suma += parseFloat(numero.value);
});
console.log("Suma: "+suma);
if (suma==100){
for (let q=0;q<botCriterios.length;q++){
let infoTemporal={};
infoTemporal.clave=0;
infoTemporal.nivel=nivel.options[nivel.selectedIndex].value;
infoTemporal.materia=materiaElegida;
infoTemporal.competencia="CE"+eval(i+1);
infoTemporal.pesoCompetencia=info.repartoCompetencias[i];
infoTemporal.criterio="CR"+eval(q+1);
 infoTemporal.pesoCriterio=botCriterios[q].value;
infoTemporal.textoCriterio="";
infoTemporal.evaluacion1=0;
infoTemporal.evaluacion2=0;
infoTemporal.evaluacion3=0;

infoFinal.push(infoTemporal);
}

    bot.disabled=true;
    console.log("Numero final antes de grabar: "+numeroFinal);
    numeroFinal=numeroFinal-criteriosporCompetencia[i];
    console.log("Numero final despues de grabar: "+numeroFinal);
}
});

}

  let botonFinal=document.createElement("button");
  botonFinal.innerHTML="Grabar ponderaciones de criterios";
  pondCriterios.appendChild(botonFinal);
  botonFinal.addEventListener('click',function(){
    if (numeroFinal==0){
        botonFinal.disabled=true;
        pondCriterios.hidden=true;
        repartoCriterios.hidden=false;
        evaluacion.hidden=false;
        for (let i=0;i<infoFinal.length;i++){
         
            infoFinal[i].textoCriterio=criteriosFuente[i].texto;
            infoFinal[i].clave=i;
        
        }
        reparteCriterios(infoFinal);

    }
  })

  
 /*     pondCriterios.innerHTML+="Criterios: ";
     for (let i=0;i<criteriosporCompetencia.length;i++){
         pondCriterios.innerHTML+=criteriosporCompetencia[i]+'<br>';
     } */
})
function reparteCriterios(infoFinal){
    for (let i=0;i<infoFinal.length;i++){

        let f=tablaCriterios.insertRow(-1);
        let x=f.insertCell()
        f.id="general"+infoFinal[i].competencia+infoFinal[i].criterio;
        x.innerHTML=infoFinal[i].textoCriterio;
        x.id="celda"+infoFinal[i].competencia+infoFinal[i].criterio;
        x.addEventListener('click',function(){
/*             let propuesta={
                "clave":i,
                "texto":criteriosFuente[i].texto,
                "evaluacion":evaluacion.options[evaluacion.selectedIndex].value
            } */
            if (evaluacion.options[evaluacion.selectedIndex].value!=0){
            colocaCriterio(infoFinal[i]);
            cuentaCriterios++;
            console.log("criterios grabados: "+cuentaCriterios);

            x.style.textDecoration="line-through";
            }
        })
    }
    grabaProgramacion.hidden=false;
    grabaProgramacion.addEventListener('click',function(){
        if (cuentaCriterios>=infoFinal.length){
            console.log("chachi, no quedan criterios");
            window.api.enviar("grabaProgramacion",infoFinal);
        }

    })
}
function colocaCriterio(propuesta){
    console.log("Colocando criterio: "+propuesta.clave);
let eval=evaluacion.options[evaluacion.selectedIndex].value;

    if (eval==1){
        id="1"+propuesta.competencia+propuesta.criterio;
        let el=document.getElementById(id);
        if (el==null){
        infoFinal[propuesta.clave].evaluacion1=1;
        let f=primeraEvaluacion.insertRow(-1);
        let x=f.insertCell();
        f.id="1"+propuesta.competencia+propuesta.criterio;
        x.innerHTML=propuesta.textoCriterio;
        x.addEventListener('click',function(){
            var row = document.getElementById(f.id);
            console.log("Intentando eliminar fila "+f.id)
            var parent = row.parentNode;
            parent.removeChild(row);
            infoFinal[propuesta.clave].evaluacion1=0;
            console.log("Ahora la primera evaluacion está a "+infoFinal[propuesta.clave].evaluacion1);
            compruebaEstilo(propuesta);
            cuentaCriterios=cuentaCriterios-1;
            console.log("criterios grabados: "+cuentaCriterios);
        })
    }
    }
    if (eval==2){
        id="2"+propuesta.competencia+propuesta.criterio;
        let el=document.getElementById(id);
        if (el==null){
        infoFinal[propuesta.clave].evaluacion2=1;

        let f=segundaEvaluacion.insertRow(-1);
        let x=f.insertCell();
        f.id="2"+propuesta.competencia+propuesta.criterio;
        x.innerHTML=propuesta.textoCriterio;
        x.addEventListener('click',function(){
            var row = document.getElementById(f.id);
            console.log("Intentando eliminar fila "+f.id)
            var parent = row.parentNode;
            parent.removeChild(row);
            infoFinal[propuesta.clave].evaluacion2=0;
            console.log("Ahora la segunda evaluacion está a "+infoFinal[propuesta.clave].evaluacion2);

            compruebaEstilo(propuesta);
            cuentaCriterios=cuentaCriterios-1;
            console.log("criterios grabados: "+cuentaCriterios);

         })
        }
    }
    if (eval==3){
        id="3"+propuesta.competencia+propuesta.criterio;
        let el=document.getElementById(id);
        if (el==null){
        infoFinal[propuesta.clave].evaluacion3=1;

        let f=evaluacionFinal.insertRow(-1);
        let x=f.insertCell();
        f.id="3"+propuesta.competencia+propuesta.criterio;

        x.innerHTML=propuesta.textoCriterio;
        x.addEventListener('click',function(){
            var row = document.getElementById(f.id);
            console.log("Intentando eliminar fila "+f.id)
            var parent = row.parentNode;
            parent.removeChild(row);
            infoFinal[propuesta.clave].evaluacion3=0;
            console.log("Ahora la tercera evaluacion está a "+infoFinal[propuesta.clave].evaluacion3);

            compruebaEstilo(propuesta);
            cuentaCriterios=cuentaCriterios-1;
            console.log("criterios grabados: "+cuentaCriterios);

         })
        }
    }
}
function compruebaEstilo(propuesta){
let id="celda"+propuesta.competencia+propuesta.criterio;
console.log("Comprobando estilo de fila: "+id)
console.log("Evaluaciones: ");
console.log(infoFinal[propuesta.clave].evaluacion1);
console.log(infoFinal[propuesta.clave].evaluacion2);
console.log(infoFinal[propuesta.clave].evaluacion3);

let celda=document.getElementById(id);
if (infoFinal[propuesta.clave].evaluacion1==0&&infoFinal[propuesta.clave].evaluacion2==0&&infoFinal[propuesta.clave].evaluacion3==0){
celda.style.textDecoration="none"
}
}
