const hazProgramacion=document.getElementById("hazProgramacion");
const anyadeInstrumento=document.getElementById("anyadeInstrumento");
const ponerNotas=document.getElementById("ponerNotas");
const nivel=document.getElementById("nivel");
const materia=document.getElementById("materia");
const evaluacion=document.getElementById("evaluacion");
const grabaNotas=document.getElementById("grabaNotas");
const eligeInstrumento=document.getElementById("eligeInstrumento");
const eligeGrupo=document.getElementById("eligeGrupo");
const relacionNotas=document.getElementById("relacionNotas");
let tablaAlumnos;
let alumnos=[];
let busqueda;
grabaNotas.hidden=true;
materia.disabled=true;
evaluacion.disabled=true;
eligeInstrumento.disabled=true;
eligeGrupo.disabled=true;

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
    alumnos=[];
    console.log(nivel.options[nivel.selectedIndex].value);
     nivelElegido=nivel.options[nivel.selectedIndex].value;
    if (nivelElegido==1||nivelElegido==2||nivelElegido==3){
        nivelElegido=0;
    }
    materia.disabled=false;
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
    alumnos=[];
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
    alumnos=[];
    evaluacionElegida=evaluacion.options[evaluacion.selectedIndex].value;
    relacionNotas.innerHTML="";
 busqueda={
    "nivelReal":nivel.options[nivel.selectedIndex].value,
    "nivelElegido":nivelElegido,
    "materiaElegida":materiaElegida,
    "evaluacion":evaluacionElegida
}
eligeInstrumento.disabled=false;
window.api.enviar("dameInstrumentos",busqueda)
})
eligeInstrumento.addEventListener('change',()=>{
    window.api.enviar("dameGrupos");
    eligeGrupo.disabled=false;
});
window.api.recibir("tomaGrupos",(datos)=>{
    relacionNotas.innerHTML=""
    for (let i=0;i<datos.length;i++){
        let el=document.createElement("option")
        el.value=datos[i].GRUPO
        el.textContent=datos[i].GRUPO
        eligeGrupo.appendChild(el)
    }
})
window.api.recibir("tomaInstrumentos",(info)=>{
    for (let i=0;i<info.length;i++){
        let el=document.createElement("option");
        el.value=info[i].instrumento;
        el.textContent=info[i].instrumento;
        eligeInstrumento.appendChild(el);
    }
})
eligeGrupo.addEventListener('change',()=>{
    alumnos=[];
    window.api.enviar("dameAlumnos",eligeGrupo.options[eligeGrupo.selectedIndex].value)
  
})
window.api.recibir("tomaAlumnos",(alumnosOb)=>{
    alumnos=alumnosOb;
    grabaNotas.hidden=false;
    relacionNotas.innerHTML="<h2>Instrumento de evaluación: "+eligeInstrumento.options[eligeInstrumento.selectedIndex].value+". Introduzca notas.</h2>"
     tablaAlumnos=document.createElement("table");
    tablaAlumnos.style.border="1 px black";
    relacionNotas.appendChild(tablaAlumnos);
    for (let i=0;i<alumnosOb.length;i++){
        let nuevaFila=tablaAlumnos.insertRow(-1);
        let nombreAlumno=nuevaFila.insertCell();
       
        nuevaFila.innerHTML=alumnosOb[i].APELLIDOS+", "+alumnosOb[i].NOMBRE;
        let notaAlumno=nuevaFila.insertCell();
       
        let campoNota=document.createElement("input");
        campoNota.id=alumnosOb[i].ALUMNO
        campoNota.type="number";
        notaAlumno.appendChild(campoNota);
    }
    let info={
        "alumnos":alumnos,
        "busqueda":busqueda,
        "evaluacion":evaluacion.options[evaluacion.selectedIndex].value,
        "instrumento":eligeInstrumento.options[eligeInstrumento.selectedIndex].value,

    }
    //si fallo, devolver a grabarnotas
    window.api.enviar("compruebaTablaNotas",busqueda);

    window.api.enviar("compruebaNotas",info)
});

grabaNotas.addEventListener('click',()=>{
   
    let notas=[]
    for (let i=0;i<alumnos.length;i++){
        if (document.getElementById(alumnos[i].ALUMNO).value.length>0){
        let totalNotas={}

        totalNotas.alumno=alumnos[i].ALUMNO;
        totalNotas.instrumento=eligeInstrumento.options[eligeInstrumento.selectedIndex].value;

      totalNotas.notaObtenida=document.getElementById(alumnos[i].ALUMNO).value;
      notas.push(totalNotas);
        }
    }

let info={
    "notas":notas,
    "busqueda":busqueda,
    "instrumento":eligeInstrumento.options[eligeInstrumento.selectedIndex].value,
    "evaluacion":evaluacion.options[evaluacion.selectedIndex].value
}
window.api.enviar("grabaNotas",(info));

})
window.api.recibir("tomaNotas",(notas)=>{
    console.log("Notas recibidas: ");
    for (let i=0;i<notas.length;i++){
        document.getElementById(notas[i].alumno).value=notas[i].nota
    }
})