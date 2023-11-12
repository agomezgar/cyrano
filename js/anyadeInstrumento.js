
const hazProgramacion=document.getElementById("hazProgramacion");
const anyadeInstrumento=document.getElementById("anyadeInstrumento");
const ponerNotas=document.getElementById("ponerNotas");
const nivel=document.getElementById("nivel");
const materia=document.getElementById("materia");
const evaluacion=document.getElementById("evaluacion");
const grabaInstrumento=document.getElementById("grabaInstrumento");
const instrumentosRecogidos=document.getElementById("instrumentosRecogidos");
const nombreInstrumento=document.getElementById("nombreInstrumento");
const nombre=document.getElementById("nombre");
let nivelElegido,materiaElegida,evaluacionElegida;
const criteriosDisponibles=document.getElementById("criteriosDisponibles");
const criteriosElegidos=document.getElementById("criteriosElegidos");
nombreInstrumento.hidden=true;
grabaInstrumento.hidden=true;
let critDisp=[]
let critEl=[];
let tablaInst=document.createElement("table");
;
materia.disabled=true;
evaluacion.disabled=true;
hazProgramacion.addEventListener('click',function(){
    window.api.enviar("cargaHazProgramacion")
})
anyadeInstrumento.addEventListener('click',function(){
    window.api.enviar("cargaAnyadeInstrumento");
})
ponerNotas.addEventListener('click',()=>{
    window.api.enviar("cargaPonerNotas");
})
verNotas.addEventListener('click',()=>{
    window.api.enviar("cargaVerNotas");
})
nivel.addEventListener('change',function(){
    console.log(nivel.options[nivel.selectedIndex].value);
     nivelElegido=nivel.options[nivel.selectedIndex].value;
    if (nivelElegido==1||nivelElegido==2||nivelElegido==3){
        nivelElegido=0;
    }
    materia.disabled=false;
    instrumentosRecogidos.innerHTML="";
    evaluacion.disabled=true;
    materia.innerHTML="";
    tablaInst.innerHTML="";
window.api.enviar("dameMaterias",nivel.options[nivel.selectedIndex].value)
})
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
materia.addEventListener('change',function(){
    materiaElegida=materia.options[materia.selectedIndex].value;
    let eleccion={
        "nivelElegido": nivelElegido,
        "materiaElegida":materiaElegida,
        "nivelReal":nivel.options[nivel.selectedIndex].value
    }
    window.api.enviar("compruebaInstrumentos",eleccion);
})
window.api.recibir("instrumentosComprobados",()=>{
    evaluacion.disabled=false;
})
evaluacion.addEventListener('change',()=>{
    evaluacionElegida=evaluacion.options[evaluacion.selectedIndex].value;
    criteriosDisponibles.innerHTML="";
let busqueda={
    "nivelReal":nivel.options[nivel.selectedIndex].value,
    "nivelElegido":nivelElegido,
    "materiaElegida":materiaElegida,
    "evaluacion":evaluacionElegida
}
window.api.enviar("buscaInstrumentos",busqueda);
})
window.api.recibir("tomaInstrumentos",(respuesta)=>{
critDisp=respuesta.criterios;

critEl=[]
if (respuesta.instrumentos.length==0){
    console.log("Vacío");
    instrumentosRecogidos.innerHTML="No hay instrumentos, macho"
}else{
    let preparado=[];
for (let i=0;i<respuesta.instrumentos.length;i++){
    preparado.push(respuesta.instrumentos[i].competencia+"."+respuesta.instrumentos[i].criterio);
}
console.log("preparado: ");
console.log(preparado);
    instrumentosRecogidos.innerHTML="<h2>Instrumentos para la evaluación "+evaluacionElegida+"</h2><br>(Click en instrumento para borrar)";
    instrumentosRecogidos.appendChild(tablaInst);
    let listaCompetencias=[];
    let instrumentosIndividuales = [...new Set(respuesta.instrumentos.map(item => item.instrumento))];
    console.log("Indiv")
    console.log(instrumentosIndividuales)
    //Recorro lista de instrumentos
    for (let a=0;a<instrumentosIndividuales.length;a++){
        listaCompetencias=[];
        listaPesoCompetencias=[];
        let filaInst=tablaInst.insertRow(-1);
        filaInst.id="Inst"+instrumentosIndividuales[a];
        let colInst=filaInst.insertCell();
        filaInst.style.border="1px solid"; // 1px solid red can be anything you want...
        filaInst.addEventListener('click',function(){
            let inst={
                "instrumento":instrumentosIndividuales[a],
                "evaluacion": evaluacionElegida,
                "nivelReal":nivel.options[nivel.selectedIndex].value,
                "nivelElegido":nivelElegido,
                "materiaElegida":materiaElegida,
            }
            window.api.enviar("borraInstrumento",inst)
        })
        colInst.innerHTML="Instrumento: "+instrumentosIndividuales[a];
    //Relleno array de competencias para ese instrumento
    for (let i=0;i<respuesta.instrumentos.length;i++){
        if (respuesta.instrumentos[i].instrumento==instrumentosIndividuales[a]&&!listaCompetencias.includes(respuesta.instrumentos[i].competencia)){
            console.log("Lleno lista para instrumento"+instrumentosIndividuales[a]+" con competencia "+respuesta.instrumentos[i].competencia)
        listaCompetencias.push(respuesta.instrumentos[i].competencia);
        listaPesoCompetencias.push(respuesta.instrumentos[i].pesoCompetencia);
    }
}
    //Recorro array de competencias y creo una fila nueva por cada una para ese instrumento
    for (let m=0;m<listaCompetencias.length;m++){
        let id="Comp"+instrumentosIndividuales[a]+listaCompetencias[m];
        let filaComp=tablaInst.insertRow(-1);
        filaComp.id=id;
        let celdaComp=filaComp.insertCell();
        filaComp.style.border="1px solid"; // 1px solid red can be anything you want...
        celdaComp.innerHTML="Competencia específica: "+listaCompetencias[m]+" ("+listaPesoCompetencias[m]+" %)";
        //Recorro criterios por competencia
        for (let k=0;k<respuesta.instrumentos.length;k++){
            if (respuesta.instrumentos[k].instrumento==instrumentosIndividuales[a]&&respuesta.instrumentos[k].competencia==listaCompetencias[m]){
                let celdaCrit=document.getElementById("Comp"+instrumentosIndividuales[a]+listaCompetencias[m]).insertCell();
                celdaCrit.innerHTML="Criterio: "+respuesta.instrumentos[k].criterio+", "+respuesta.instrumentos[k].pesoCriterio+"%"
                celdaCrit.style.border="1px solid red"; // 1px solid red can be anything you want...
            }
        }
    }
    listaCompetencias=[];
    listaPesoCompetencias=[];



}


        
        
  

/*         console.log(respuesta.instrumentos[i]);
       let f=tablaInst.insertRow(-1);
       f.id=respuesta.instrumentos[i].id;
       let a=f.insertCell();
       a.innerHTML=respuesta.instrumentos[i].instrumento */
       // instrumentosRecogidos.innerHTML+=respuesta.instrumentos[i].instrumento;
    }  





nombreInstrumento.hidden=false;
console.log("A ver hasta aquí");
console.log(respuesta);
for (let i=0;i<respuesta.criterios.length;i++){
    let id="d"+respuesta.criterios[i].id
    let f=criteriosDisponibles.insertRow(-1);
    f.id=id;
    let x=f.insertCell();
    x.id="celda"+id;
    x.innerHTML=respuesta.criterios[i].textoCriterio;
    x.addEventListener('click',('click',function(){
        colocaCriterio(respuesta.criterios[i]);
        console.log("Tachando celda "+x.id)
        x.style.textDecoration="line-through";

    }))
}
grabaInstrumento.hidden=false;
grabaInstrumento.addEventListener('click',function(){
if (nombre.value!=""){
    let info={
        "nombreInstrumento":nombre.value,
        "criterios":critEl,
        "nivelElegido": nivelElegido,
        "materiaElegida":materiaElegida,
        "nivelReal":nivel.options[nivel.selectedIndex].value,
        "evaluacion":evaluacion.options[evaluacion.selectedIndex].value
    }
    window.api.enviar("grabaInstrumento",info);
}
})
});

function colocaCriterio(criterio){
    
    let id="el"+criterio.id
    let el=document.getElementById(id);
    if (el==null){
        critEl.push(criterio);
    let f=criteriosElegidos.insertRow(-1);
    f.id=id;
    let x=f.insertCell();
    x.innerHTML=criterio.textoCriterio;
    x.addEventListener('click',function(){
        var row = document.getElementById(f.id);
        console.log("Intentando eliminar fila "+f.id)
        var parent = row.parentNode;
        parent.removeChild(row);
        let original=document.getElementById("celdad"+criterio.id);
        original.style.textDecoration="none"
        //Busco el criterio dentro de los elegidos buscando su id y lo borro de criteriosElegidos
        var lists = critEl.filter(x => {
            return x.id != criterio.id;
          })
          
          critEl=lists;


    })

    }
}