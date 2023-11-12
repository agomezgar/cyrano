//const { dameAlumnos } = require("../dataBase/dataBase");

const prueba=document.getElementById("prueba");
const evaluacion=document.getElementById("evaluacion")
const grupo=document.getElementById("grupo");
const alumno=document.getElementById("alumno");
const acta=document.getElementById("acta")
const acta2=document.getElementById("acta2")
const listaItems=document.getElementById("listaItems")
const primeraColumna=document.getElementById("primeraColumna")
const segundaColumna=document.getElementById("segundaColumna")
const flechaIzq=document.getElementById("flechaIzq")
const flechaIzq2=document.getElementById("flechaIzq2")
const flechaDer=document.getElementById("flechaDer")
const flechaDer2=document.getElementById("flechaDer2")
const grabapdf=document.getElementById("grabapdf")
const columnaRefuerzo1=document.getElementById("columnaRefuerzo1")
const columnaInclusion1=document.getElementById("columnaInclusion1")
columnaInclusion1.style.width="50%"
const columnaExtraordinarias1=document.getElementById("columnaExtraordinarias1")
const columnaOtras1=document.getElementById("columnaOtras1")
let otrasMedidas=document.createElement('textarea')
const refuerzoPropuesto=document.createElement('textarea')
const adaptacionPropuesta=document.createElement('textarea')
const inclusionPropuesta=document.createElement('textarea')
const extraordinariasPropuesta=document.createElement('textarea')
const otrasPropuesta=document.createElement('textarea')
const botonGrabar=document.createElement('button')
let actasTotales=[]
let itemsPers=[]
botonGrabar.type="submit"
botonGrabar.innerHTML="Generar pdf"
grabapdf.appendChild(botonGrabar)
botonGrabar.disabled=true
let itemsBinarios=[]
let itemsRefuerzo=[]
let itemsInclusion=[]
let itemsExtraordinarias=[]
let itemsOtras=[]
let alumnoActual
grupo.disabled=true
alumno.disabled=true
let textoViejoOtrasMedidas=""
botonGrabar.addEventListener('click',function(){
    let listaAlumnos=[]

for(let i=1;i<alumno.length;i++){
    listaAlumnos.push(alumno[i].value)
}
let datosPdf={
    "evaluacion":evaluacion.selectedIndex,
    "grupo":grupo.value,
    "alumno":listaAlumnos,
    "actas":actasTotales,
    "itemsPersonalizados":itemsPers
}
    window.api.enviar("generaPdf",datosPdf)
})
window.api.enviar("dameGrupos")
//Seleccionar evaluación
evaluacion.addEventListener('change',function(){
    otrasMedidas.value=""
    primeraColumna.innerHTML=""
    flechaDer.innerHTML=""
    flechaDer2.innerHTML=""
    flechaIzq.innerHTML=""
    flechaIzq2.innerHTML=""
    acta.innerHTML=""
    acta2.innerHTML=""
    otrasMedidas.value=""
    columnaRefuerzo1.innerHTML=""
    refuerzoPropuesto.value=""
    columnaInclusion1.innerHTML=""
    columnaExtraordinarias1.innerHTML=""
    columnaOtras1.innerHTML=""
    refuerzoPropuesto.value=""
    adaptacionPropuesta.value=""
    inclusionPropuesta.value=""
    extraordinariasPropuesta.value=""
    otrasPropuesta.value=""
    botonGrabar.disabled=true
   
    if (evaluacion.value!=0){
        grupo.disabled=false
        grupo.selectedIndex=0
        alumno.disabled=true
        alumno.selectedIndex=0

    }else{
        grupo.disabled=true
        grupo.selectedIndex=0
        alumno.disabled=true
        alumno.selectedIndex=0
        for (let i=0;i<alumno.length;i++){
            alumno.remove(i);
        }
        
    }

 
})
//Seleccionar grupo
grupo.addEventListener('change',function(ev){
    for (let i=0;i<alumno.length;i++){
        alumno.remove(i);
    }
    otrasMedidas.value=""
    primeraColumna.innerHTML=""
    flechaDer.innerHTML=""
    flechaDer2.innerHTML=""
    flechaIzq.innerHTML=""
    flechaIzq2.innerHTML=""
    acta.innerHTML=""
    acta2.innerHTML=""
    otrasMedidas.value=""
    columnaRefuerzo1.innerHTML=""
    refuerzoPropuesto.value=""
    columnaInclusion1.innerHTML=""
    columnaExtraordinarias1.innerHTML=""
    columnaOtras1.innerHTML=""
    refuerzoPropuesto.value=""
    adaptacionPropuesta.value=""
    inclusionPropuesta.value=""
    extraordinariasPropuesta.value=""
    otrasPropuesta.value=""
    botonGrabar.disabled=false
  
    window.api.enviar("dameAlumnos",grupo.value)

    alumno.disabled=false
    })

//Seleccionar alumno
alumno.addEventListener('change',function(al){
    primeraColumna.innerHTML=""
    flechaDer.innerHTML="Siguiente"
    flechaDer2.innerHTML="Siguiente"
    flechaIzq.innerHTML="Anterior"
    flechaIzq2.innerHTML="Anterior"
    otrasMedidas.value=""
    columnaRefuerzo1.innerHTML=""
    refuerzoPropuesto.value=""
    columnaInclusion1.innerHTML=""
    columnaExtraordinarias1.innerHTML=""
    columnaOtras1.innerHTML=""
    refuerzoPropuesto.value=""
    adaptacionPropuesta.value=""
    inclusionPropuesta.value=""
    extraordinariasPropuesta.value=""
    otrasPropuesta.value=""
    alumnoActual=alumno.options[alumno.selectedIndex].value
    botonGrabar.disabled=false
    rellenaActa();
})
flechaDer.addEventListener('click',function(event){
    alumno.selectedIndex+=1
    if (alumno.selectedIndex==-1){
        alumno.selectedIndex=1
    }

    rellenaActa()
   
   
})
flechaDer2.addEventListener('click',function(event){
    alumno.selectedIndex+=1
    if (alumno.selectedIndex==-1){
        alumno.selectedIndex=1
    }

    rellenaActa()
   
   
})
flechaIzq.addEventListener('click',function(){
   
    alumno.selectedIndex-=1
    if (alumno.selectedIndex==0){
        alumno.selectedIndex=alumno.length-1
    }

    rellenaActa()

})
flechaIzq2.addEventListener('click',function(){
   
    alumno.selectedIndex-=1
    if (alumno.selectedIndex==0){
        alumno.selectedIndex=alumno.length-1
    }

    rellenaActa()

})
//Recibimos los grupos de la base de datos y rellenamos el select
window.api.recibir("tomaGrupos",(datos)=>{
    alumno.innerHTML=""
    for (let i=0;i<datos.length;i++){
        let el=document.createElement("option")
        el.value=datos[i].GRUPO
        el.textContent=datos[i].GRUPO
        grupo.appendChild(el)
    }
})
//Recibimos el listado de alumnos de esa clase
window.api.recibir("tomaAlumnos",(datos)=>{
    console.log("Borrando alumnos...")
   alumno.innerHTML=""
   let el=document.createElement("option");
   el.value="0"
   el.textContent=" "
   alumno.appendChild(el)
for (let i=0;i<datos.length;i++){
    let el=document.createElement("option")
    el.value=datos[i].ALUMNO
    el.textContent=datos[i].APELLIDOS+", "+datos[i].NOMBRE
    alumno.appendChild(el)
}
})
function rellenaActa(){

    otrasMedidas.value=""
    columnaRefuerzo1.innerHTML=""
    refuerzoPropuesto.value=""
    acta.innerHTML="<p align='center'><h2>Alumno/-a: "+alumno.options[alumno.selectedIndex].text+"</h2></p>"
    acta2.innerHTML="<p align='center'><h2>Alumno/-a: "+alumno.options[alumno.selectedIndex].text+"</h2></p>"
    primeraColumna.innerHTML=""
    columnaRefuerzo1.innerHTML=""
    columnaExtraordinarias1.innerHTML=""
    columnaInclusion1.innerHTML=""
    columnaOtras1.innerHTML=""
    let datos={
        "alumno" : alumno.options[alumno.selectedIndex].value,
        "evaluacion":evaluacion.selectedIndex

    }
    window.api.enviar("dameActa",datos)

}

window.api.recibir("tomaItems",(datos,datosTotales)=>{
    
rellenaInformacionFamilias(datos,datosTotales)
rellenaMedidasRefuerzo(datos,datosTotales)
rellenaMedidasInclusion(datos,datosTotales)
rellenaMedidasExtraordinarias(datos,datosTotales)
rellenaOtras(datos,datosTotales)
})

window.api.recibir("escribePersonalizado",(textoL,datos)=>{
    caja=document.getElementById(datos.id)

    try{
        caja.value=textoL.texto


    }catch(e){
        caja.value=""
       // itemsBinarios[itemsBinarios.length-1].checked=false
    }

    })
function rellenaInformacionFamilias(datos,datosTotales){
    while (primeraColumna.firstChild) {
        primeraColumna.removeChild(primeraColumna.lastChild);
      }
    //Vaciamos el array de items
itemsBinarios=[]

primeraColumna.innerHTML=""
    for (let i=0;i<5;i++){
        itemsBinarios[i]=document.createElement('input')
        itemsBinarios[i].type = "checkbox";
        eval("itemsBinarios[i].name "+" = " + "'check" + datosTotales[i].id + "'");
        itemsBinarios[i].value = i+1;
        itemsBinarios[i].checked=false
 
        itemsBinarios[i].addEventListener('change',function(event){
            let grabar={
                "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
                "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
                "item":i+1,
                "estado":itemsBinarios[i].checked
            }

                window.api.enviar("cambiaItem",grabar)
        })
        let label = document.createElement('label');
        label.innerHTML = datosTotales[i].textoItem;
        let br=document.createElement('br')
        primeraColumna.appendChild(itemsBinarios[i])
        primeraColumna.appendChild(label)
        primeraColumna.appendChild(br)
    }
    itemsBinarios[4].disabled=true

//INTENTO DESACTIVAR LO DE QUE SE GUARDE DOS VECES UN ITEM VARIABLE (no es por eso, pero lo dejo)
  itemsBinarios[4].addEventListener('change',function(event){

  })
for (let i=0;i<datos.length;i++){
for (let a=0;a<5;a++){
    if (datos[i].item==itemsBinarios[a].value){
itemsBinarios[a].checked=true
    }
}
}
//Si el item está marcado, busca poner el itemVariable en el textbox
if (itemsBinarios[4].checked==true){
    let grabar2={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":5,
        "id":"otrasMedidas",
        "variable":"textoViejoOtrasMedidas"
    }
 window.api.enviar("dameOtrasMedidas",grabar2)

}
 otrasMedidas.id="otrasMedidas"
 otrasMedidas.value=""
 otrasMedidas.style.height="100px";
 otrasMedidas.style.width="300px"
 //EL ERROR QUE GRABA VARIAS VECES PROVIENE DE AQUÍ. Se graba varias veces a medida que 
 //vamos creciendo en alumnos
otrasMedidas.addEventListener('change',function(event){
    otrasMedidas.disabled=true
    tag.innerHTML=""
    tag.appendChild(document.createTextNode("Grabando..."))
    //if (otrasMedidas.value==textoViejoOtrasMedidas)return
    let grabar={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"5",
        "item":"5",
        "texto":otrasMedidas.value,
        "estado":true,
        "id":otrasMedidas.id
    }
    if (otrasMedidas.value==""){
        itemsBinarios[4].checked=false
        grabar.estado=false
    }else{
        itemsBinarios[4].checked=true
        grabar.estado=true
    }
  
    window.api.enviar("grabarOtras",grabar,otrasMedidas.id)
    setTimeout(function() {
        otrasMedidas.disabled = false;
        tag.innerHTML=""
        tag.appendChild(document.createTextNode("Indicar información adicional"))
        }, 2000);
},false)
let tag = document.createElement("p");
tag.style.fontWeight = "bold";
let text = document.createTextNode("Indicar información adicional")
tag.appendChild(text);
primeraColumna.appendChild(tag);
primeraColumna.appendChild(otrasMedidas) 
  }
  function rellenaMedidasRefuerzo(datos,datosTotales){

    columnaRefuerzo1.innerHTML=""
    for (let i=0;i<2;i++){
        itemsRefuerzo[i]=document.createElement('input')
        itemsRefuerzo[i].type = "checkbox"; 
        eval("itemsRefuerzo[i].name "+" = " + "'check" + datosTotales[i].id+5 + "'");
        itemsRefuerzo[i].value = i+6;
        itemsRefuerzo[i].checked=false

  
        itemsRefuerzo[i].addEventListener('change',function(event){
            let grabar3={
                "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
                "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
                "item":itemsRefuerzo[i].value,
                "estado":itemsRefuerzo[i].checked
            }

                window.api.enviar("cambiaItem",grabar3)
        })
        let label = document.createElement('label');
        label.innerHTML = datosTotales[i+5].textoItem;
        let br=document.createElement('br')
        columnaRefuerzo1.appendChild(itemsRefuerzo[i])
        columnaRefuerzo1.appendChild(label)
        columnaRefuerzo1.appendChild(br)
    }

for (let i=0;i<datos.length;i++){
    for (let a=0;a<2;a++){

    if (datos[i].item==itemsRefuerzo[a].value){
itemsRefuerzo[a].checked=true   
    }
    }
}
//INTENTO DESACTIVAR LO DE QUE SE GUARDE DOS VECES UN ITEM VARIABLE (ya veo que no es eso)
itemsRefuerzo[1].addEventListener('change',function(event){

})
itemsRefuerzo[1].disabled=true
//¿SE HA MARCADO EL ITEM DE REFUERZOS PROPUESTOS? RELLENA TEXTBOX
    
if (itemsRefuerzo[1].checked==true){
    let grabar2={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"7",
        "id":"refuerzoPropuesto"
    }
 window.api.enviar("dameOtrasMedidas",grabar2)
}
//CAJA DE TEXTO DE REFUERZOS PROPUESTOS
 refuerzoPropuesto.id="refuerzoPropuesto"
refuerzoPropuesto.value=""
refuerzoPropuesto.style.height="100px";
refuerzoPropuesto.style.width="300px"
refuerzoPropuesto.addEventListener('change',function(event){
    refuerzoPropuesto.disabled=true
    tag.innerHTML=""
    tag.appendChild(document.createTextNode("Grabando..."))
    let grabar={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"7",
        "item":"7",
        "texto":refuerzoPropuesto.value,
        "estado":true
    }
    if (refuerzoPropuesto.value==""){
        itemsRefuerzo[1].checked=false
        grabar.estado=false
    }else{
        itemsRefuerzo[1].checked=true
        grabar.estado=true
    }
    window.api.enviar("grabarOtras",grabar)
    setTimeout(function() {
        refuerzoPropuesto.disabled = false;
        tag.innerHTML=""
        tag.appendChild(document.createTextNode("Indicar medidas de refuerzo alternativas"))
        }, 2000);
})
let tag = document.createElement("p");
tag.style.fontWeight = "bold";
let text = document.createTextNode("Indicar medidas de refuerzo alternativas")
tag.appendChild(text);
columnaRefuerzo1.appendChild(tag);
columnaRefuerzo1.appendChild(refuerzoPropuesto)  
let br2=document.createElement('br')
columnaRefuerzo1.appendChild(br2)
//¿SE HAN LLEVADO A CABO ADAPTACIONES CURRICULARES?
itemsRefuerzo[2]=document.createElement('input')
itemsRefuerzo[2].type = "checkbox"; 
eval("itemsRefuerzo[2].name "+" = " + "'check" + datosTotales[7].id + "'");
itemsRefuerzo[2].value = 8;
itemsRefuerzo[2].checked=false


itemsRefuerzo[2].addEventListener('change',function(event){
    let grabar3={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "item":"8",
        "estado":itemsRefuerzo[2].checked
    }

        window.api.enviar("cambiaItem",grabar3)
})
//INTENTO DESACTIVAR LO DE QUE SE GUARDE DOS VECES UN ITEM VARIABLE
itemsRefuerzo[2].addEventListener('change',function(event){

})
itemsRefuerzo[2].disabled=true
let label = document.createElement('label');
label.innerHTML = datosTotales[7].textoItem;
let br=document.createElement('br')
columnaRefuerzo1.appendChild(itemsRefuerzo[2])
columnaRefuerzo1.appendChild(label)
columnaRefuerzo1.appendChild(br)
for (let i=0;i<datos.length;i++){

      if (datos[i].item==8){
  itemsRefuerzo[2].checked=true   

      }
  }
  //CAJA DE TEXTO DE ADAPTACIONES PROPUESTAS
  adaptacionPropuesta.id="adaptacionPropuesta"
adaptacionPropuesta.value=""
adaptacionPropuesta.style.height="100px";
adaptacionPropuesta.style.width="300px"
adaptacionPropuesta.addEventListener('change',function(event){
    adaptacionPropuesta.disabled=true
    tag2.innerHTML=""
    tag2.appendChild(document.createTextNode("Grabando..."))
    let grabar={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"8",
        "item":"8",
        "texto":adaptacionPropuesta.value,
        "estado":true
    }
    if (adaptacionPropuesta.value==""){
        itemsRefuerzo[2].checked=false
        grabar.estado=false
    }else{
        itemsRefuerzo[2].checked=true
        grabar.estado=true
    }
    window.api.enviar("grabarOtras",grabar)
    setTimeout(function() {
        adaptacionPropuesta.disabled = false;
        tag2.innerHTML=""
        tag2.appendChild(document.createTextNode("Información sobre adaptaciones"))
        }, 2000);
})

if (itemsRefuerzo[2].checked==true){
    let grabar3={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"8",
        "id":"adaptacionPropuesta"
    }
 window.api.enviar("dameOtrasMedidas",grabar3)
}
let tag2 = document.createElement("p");
tag2.style.fontWeight = "bold";
let text2 = document.createTextNode("Información sobre adaptaciones")
tag2.appendChild(text2);
columnaRefuerzo1.appendChild(tag2);
columnaRefuerzo1.appendChild(adaptacionPropuesta)  
let br3=document.createElement('br')
columnaRefuerzo1.appendChild(br3)
//¿DEBERÍA SER EVALUADO/-A POR ORIENTACIÓN?
itemsRefuerzo[3]=document.createElement('input')
itemsRefuerzo[3].type = "checkbox"; 
eval("itemsRefuerzo[3].name "+" = " + "'check" + datosTotales[9].id + "'");
itemsRefuerzo[3].value = 9;
itemsRefuerzo[3].checked=false


itemsRefuerzo[3].addEventListener('change',function(event){
    let grabar3={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "item":"9",
        "estado":itemsRefuerzo[3].checked
    }

        window.api.enviar("cambiaItem",grabar3)
})
let label4 = document.createElement('label');
label4.innerHTML = datosTotales[8].textoItem;
let br4=document.createElement('br')
columnaRefuerzo1.appendChild(itemsRefuerzo[3])
columnaRefuerzo1.appendChild(label4)
columnaRefuerzo1.appendChild(br4)
for (let i=0;i<datos.length;i++){

    if (datos[i].item==9){
itemsRefuerzo[3].checked=true   

    }
}
  }
  function rellenaMedidasInclusion(datos,datosTotales){

    columnaInclusion1.innerHTML=""
    for (let i=0;i<6;i++){
        itemsInclusion[i]=document.createElement('input')
        itemsInclusion[i].type = "checkbox"; 
        eval("itemsInclusion[i].name "+" = " + "'check" + datosTotales[i].id+9 + "'");
        itemsInclusion[i].value = i+10;
        itemsInclusion[i].checked=false

  
        itemsInclusion[i].addEventListener('change',function(event){
            let grabar3={
                "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
                "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
                "item":itemsInclusion[i].value,
                "estado":itemsInclusion[i].checked
            }

                window.api.enviar("cambiaItem",grabar3)
        })
        let label = document.createElement('label');
        label.innerHTML = datosTotales[i+9].textoItem;
        let br=document.createElement('br')
        columnaInclusion1.appendChild(itemsInclusion[i])
        columnaInclusion1.appendChild(label)
        columnaInclusion1.appendChild(br)
    }

for (let i=0;i<datos.length;i++){
    for (let a=0;a<6;a++){

    if (datos[i].item==itemsInclusion[a].value){
itemsInclusion[a].checked=true   
    }
    }
}
//¿SE HA MARCADO EL ITEM DE OTRAS MEDIDAS DE INCLUSIÓN? RELLENA TEXTBOX
    
if (itemsInclusion[5].checked==true){
    let grabar2={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"15",
        "id":"inclusionPropuesta"
    }
 window.api.enviar("dameOtrasMedidas",grabar2)
}
//CAJA DE TEXTO DE REFUERZOS PROPUESTOS
 inclusionPropuesta.id="inclusionPropuesta"
inclusionPropuesta.value=""
inclusionPropuesta.style.height="100px";
inclusionPropuesta.style.width="300px"
inclusionPropuesta.addEventListener('change',function(event){
    inclusionPropuesta.disabled=true
    tag.innerHTML=""
    tag.appendChild(document.createTextNode("Grabando..."))
    let grabar={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"15",
        "item":"15",
        "texto":inclusionPropuesta.value,
        "estado":true
    }
    if (inclusionPropuesta.value==""){
        itemsInclusion[5].checked=false
        grabar.estado=false
    }else{
        itemsInclusion[5].checked=true
        grabar.estado=true
    }
    window.api.enviar("grabarOtras",grabar)
    setTimeout(function() {
        inclusionPropuesta.disabled = false;
        tag.innerHTML=""
        tag.appendChild(document.createTextNode("Indicar medidas de inclusión alternativas"))
        }, 2000);
})
let tag = document.createElement("p");
tag.style.fontWeight = "bold";
let text = document.createTextNode("Indicar medidas de inclusión alternativas")
tag.appendChild(text);
columnaInclusion1.appendChild(tag);
columnaInclusion1.appendChild(inclusionPropuesta)  
let br2=document.createElement('br')
columnaInclusion1.appendChild(br2)

  }   
  function rellenaMedidasExtraordinarias(datos,datosTotales){
console.log("DatosTotales: "+datosTotales);
    columnaExtraordinarias1.innerHTML=""
    for (let i=0;i<4;i++){
        itemsExtraordinarias[i]=document.createElement('input')
        itemsExtraordinarias[i].type = "checkbox"; 
        eval("itemsExtraordinarias[i].name "+" = " + "'check" + datosTotales[i].id+16 + "'");
        itemsExtraordinarias[i].value = i+16;
        itemsExtraordinarias[i].checked=false

  
        itemsExtraordinarias[i].addEventListener('change',function(event){
            let grabar3={
                "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
                "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
                "item":itemsExtraordinarias[i].value,
                "estado":itemsExtraordinarias[i].checked
            }

                window.api.enviar("cambiaItem",grabar3)
        })
        let label = document.createElement('label');
        label.innerHTML = datosTotales[i+15].textoItem;
        let br=document.createElement('br')
        columnaExtraordinarias1.appendChild(itemsExtraordinarias[i])
        columnaExtraordinarias1.appendChild(label)
        columnaExtraordinarias1.appendChild(br)
    }

for (let i=0;i<datos.length;i++){
    for (let a=0;a<4;a++){

    if (datos[i].item==itemsExtraordinarias[a].value){
itemsExtraordinarias[a].checked=true   
    }
    }
}
//¿SE HA MARCADO EL ITEM DE OTRAS MEDIDAS EXTRAORDINARIAS? RELLENA TEXTBOX
    
if (itemsExtraordinarias[3].checked==true){
    let grabar2={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"19",
        "id":"extraordinariasPropuesta"
    }
 window.api.enviar("dameOtrasMedidas",grabar2)
}
//CAJA DE TEXTO DE MEDIDAS EXTRAORDINARIAS DE INCLUSIÓN PROPUESTA
 extraordinariasPropuesta.id="extraordinariasPropuesta"
extraordinariasPropuesta.value=""
extraordinariasPropuesta.style.height="100px";
extraordinariasPropuesta.style.width="300px"
extraordinariasPropuesta.addEventListener('change',function(event){
    extraordinariasPropuesta.disabled=true
    tag.innerHTML=""
    tag.appendChild(document.createTextNode("Grabando..."))
    let grabar={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"19",
        "item":"19",
        "texto":extraordinariasPropuesta.value,
        "estado":true
    }
    if (extraordinariasPropuesta.value==""){
        itemsExtraordinarias[3].checked=false
        grabar.estado=false
    }else{
        itemsExtraordinarias[3].checked=true
        grabar.estado=true
    }
    window.api.enviar("grabarOtras",grabar)
    setTimeout(function() {
        extraordinariasPropuesta.disabled = false;
        tag.innerHTML=""
        tag.appendChild(document.createTextNode("Indicar otras posibles medidas extraordinarias de inclusión educativa"))
        }, 2000);
})
let tag = document.createElement("p");
tag.style.fontWeight = "bold";
let text = document.createTextNode("Indicar otras posibles medidas extraordinarias de inclusión educativa")
tag.appendChild(text);
columnaExtraordinarias1.appendChild(tag);
columnaExtraordinarias1.appendChild(extraordinariasPropuesta)  
let br2=document.createElement('br')
columnaExtraordinarias1.appendChild(br2)

  } 
  function rellenaOtras(datos,datosTotales){
    for (let i=0;i<1;i++){
        itemsOtras[i]=document.createElement('input')
        itemsOtras[i].type = "checkbox";
        eval("itemsOtras[i].name "+" = " + "'check" + datosTotales[i].id +19+ "'");
        itemsOtras[i].value = i+20;
        itemsOtras[i].checked=false
 
        itemsOtras[i].addEventListener('change',function(event){
            let grabar={
                "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
                "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
                "item":i+20,
                "estado":itemsOtras[i].checked
            }

                window.api.enviar("cambiaItem",grabar)
        })
        let label = document.createElement('label');
        label.innerHTML = datosTotales[i+19].textoItem;
        let br=document.createElement('br')
        columnaOtras1.appendChild(itemsOtras[i])
        columnaOtras1.appendChild(label)
        columnaOtras1.appendChild(br)
    }

  
for (let i=0;i<datos.length;i++){
for (let a=0;a<1;a++){
    console.log(datos[i].item+"=="+itemsOtras[a].value)
    if (datos[i].item==itemsOtras[a].value){
itemsOtras[a].checked=true
    }
}
}
//¿SE HA MARCADO EL ITEM DE OTRAS MEDIDAS EXTRAORDINARIAS? RELLENA TEXTBOX
    
if (itemsOtras[0].checked==true){
    let grabar2={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"20",
        "id":"otrasPropuesta"
    }
 window.api.enviar("dameOtrasMedidas",grabar2)
}
//CAJA DE TEXTO DE OTRAS CONSIDERACIONES
 otrasPropuesta.id="otrasPropuesta"
otrasPropuesta.value=""
otrasPropuesta.style.height="100px";
otrasPropuesta.style.width="300px"
otrasPropuesta.addEventListener('change',function(event){
    otrasPropuesta.disabled=true
    tag.innerHTML=""
    tag.appendChild(document.createTextNode("Grabando..."))
    let grabar={
        "alumno": parseInt(alumno.options[alumno.selectedIndex].value),
        "evaluacion":parseInt(evaluacion.options[evaluacion.selectedIndex].id),
        "identidadItem":"20",
        "item":"20",
        "texto":otrasPropuesta.value,
        "estado":true
    }
    if (otrasPropuesta.value==""){
        itemOtras[0].checked=false
        grabar.estado=false
    }else{
        itemsOtras[0].checked=true
        grabar.estado=true
    }
    window.api.enviar("grabarOtras",grabar)
    setTimeout(function() {
        otrasPropuesta.disabled = false;
        tag.innerHTML=""
        tag.appendChild(document.createTextNode("Indicar si hay otras consideraciones"))
        }, 2000);
})
let tag = document.createElement("p");
tag.style.fontWeight = "bold";
let text = document.createTextNode("Indicar si hay otras consideraciones")
tag.appendChild(text);
columnaOtras1.appendChild(tag);
columnaOtras1.appendChild(otrasPropuesta)  
let br2=document.createElement('br')
columnaOtras1.appendChild(br2)

  }