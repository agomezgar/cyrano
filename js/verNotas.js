const hazProgramacion=document.getElementById("hazProgramacion");
const anyadeInstrumento=document.getElementById("anyadeInstrumento");
const ponerNotas=document.getElementById("ponerNotas");
const nivel=document.getElementById("nivel");
const materia=document.getElementById("materia");
const evaluacion=document.getElementById("evaluacion");
const grabaNotas=document.getElementById("grabaNotas");
const eligeGrupo=document.getElementById("eligeGrupo");
const relacionNotas=document.getElementById("relacionNotas");
let tablaAlumnos;
let alumnos=[];
let instrumentos=[];
let competencias=[];
let instrumentosporCompetencia=[];
let totalCompetencias=[];
let notasGenerales=[];
let notasEnviar=[];
let busqueda;
let fx;
grabaNotas.hidden=true;
materia.disabled=true;
evaluacion.disabled=true;
eligeGrupo.disabled=true;
let notasColocadas=0;
let pesoCompetenciasAcumulado=0;
let filaTablaComp=document.createElement("table");
let filaNotasFinales=document.createElement("table");

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
    instrumentos=[];
    materiaElegida=materia.options[materia.selectedIndex].value;
    notasColocadas=0;
    evaluacion.disabled=false;
    busqueda={
        "nivelReal":nivel.options[nivel.selectedIndex].value,
        "nivelElegido":nivelElegido,
        "materiaElegida":materiaElegida
        }
window.api.enviar("compruebaProgramacion",busqueda);

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
notasColocadas=0;
eligeGrupo.disabled=false;
window.api.enviar("dameGrupos");
window.api.enviar("buscaInstrumentos",busqueda);
})

window.api.recibir("tomaGrupos",(datos)=>{
    notasColocadas=0;
    relacionNotas.innerHTML=""
    for (let i=0;i<datos.length;i++){
        let el=document.createElement("option")
        el.value=datos[i].GRUPO
        el.textContent=datos[i].GRUPO
        eligeGrupo.appendChild(el)
    }
})
window.api.recibir("tomaInstrumentos",(datos)=>{
console.log(datos);
for (let i=0;i<datos.instrumentos.length;i++){
    if (!instrumentos.includes(datos.instrumentos[i].instrumento)){
    instrumentos.push(datos.instrumentos[i].instrumento)
}
}
for (let i=0;i<datos.criterios.length;i++){
//Creo matriz de referencia para competencias
    if (!competencias.includes(datos.criterios[i].competencia)){
        competencias.push(datos.criterios[i].competencia)
}
}


let compRef=[];
for (let k=0;k<datos.instrumentos.length;k++){
    if (!compRef.includes(datos.instrumentos[k].competencia)){
        let comp={
            "competencia":"",
            "pesoCompetencia":0,
            "criterios":[],
            "pesoCriterios":[]
        }
        compRef.push(datos.instrumentos[k].competencia);
        console.log("Creando nueva entrada para "+datos.instrumentos[k].competencia);
        comp.competencia=datos.instrumentos[k].competencia;
        comp.pesoCompetencia=datos.instrumentos[k].pesoCompetencia;
        let criteriosTemporal=[];
        for (let l=0;l<datos.instrumentos.length;l++){
            if (datos.instrumentos[l].competencia==datos.instrumentos[k].competencia){
                if (!criteriosTemporal.includes(datos.instrumentos[l].criterio)){
                    criteriosTemporal.push(datos.instrumentos[l].criterio)
                    comp.criterios.push(datos.instrumentos[l].criterio);
                    comp.pesoCriterios.push(datos.instrumentos[l].pesoCriterio)
                }
             
            }
        }
        console.log("Empujando competencia...");
        console.log(comp);
        totalCompetencias.push(comp);
    }
}
let comOrdenadas=compRef.sort();
console.log("comOrdenada: ");
console.log(comOrdenadas)
//Ahora vuelvo a repasar la matriz de referencia y voy creando un objeto comp con sus criterios y pesos
//¡Ojo! Sólo se puede añadir al objeto si competencia y criterio aparecen en la datos.instrumentos
 
/*     for (let k=0;k<datos.criterios.length;k++){

        if (!compRef.includes(datos.criterios[k].competencia)){
            let comp={
                "competencia":"",
                "pesoCompetencia":0,
                "criterios":[],
                "pesoCriterios":[]
            }
            compRef.push(datos.criterios[k].competencia);
            console.log("Creando nueva entrada para "+datos.criterios[k].competencia);
            comp.competencia=datos.criterios[k].competencia;
            comp.pesoCompetencia=datos.criterios[k].pesoCompetencia;
            for (let l=0;l<datos.criterios.length;l++){
                if (datos.criterios[l].competencia==datos.criterios[k].competencia){
                    comp.criterios.push(datos.criterios[l].criterio);
                    comp.pesoCriterios.push(datos.criterios[l].pesoCriterio);
                }
            }
            console.log("Empujando competencia. ");
            console.log(comp);
            totalCompetencias.push(comp);
    }
        } */
instrumentosporCompetencia=[];
console.log("Total competencias: ");
console.log(totalCompetencias);
let info4={
"nivelReal":nivel.options[nivel.selectedIndex].value,
"nivelElegido":nivelElegido,
"materiaElegida":materiaElegida,
"evaluacion":evaluacionElegida,
"totalCompetencias":totalCompetencias}

window.api.enviar("dameInstrumentosporCompetencia",info4);
/* for (let i=0;i<totalCompetencias.length;i++){
    for (let k=0;k<totalCompetencias[i].criterios.length;k++){
        console.log("Buscando instrumentos para "+totalCompetencias[i].competencia+", criterio "+totalCompetencias[i].criterios[k]);
    }
} */
window.api.recibir("tomaInstrumentosporCompetencia",(instrumento)=>{
    instrumentosporCompetencia=instrumento;
    console.log("Instrumentos por Competencia: ");
    console.log(instrumentosporCompetencia);
})

})
eligeGrupo.addEventListener('change',()=>{
    alumnos=[];
    window.api.enviar("dameAlumnos",eligeGrupo.options[eligeGrupo.selectedIndex].value)
  notasEnviar=[];
})
window.api.recibir("tomaAlumnos",(alumnosOb)=>{
    alumnos=alumnosOb;
    //grabaNotas.hidden=false;
    relacionNotas.innerHTML="<h2>Relación de notas de "+eligeGrupo.options[eligeGrupo.selectedIndex].value+" en la materia "+materia.options[materia.selectedIndex].textContent+" para la evaluacion "+evaluacion.options[evaluacion.selectedIndex].value+"</h2>"
    let negritab=document.createElement("h2");
    let titulito=document.createTextNode("Notas por instrumento de evaluación");
    negritab.appendChild(titulito);
    relacionNotas.appendChild(negritab);
    tablaAlumnos=document.createElement("table");
    relacionNotas.appendChild(tablaAlumnos);
    let filaRell=tablaAlumnos.insertRow(-1);
    let colRell=filaRell.insertCell();
 /*    let filaPrinc=tablaAlumnos.insertRow(-1);
    let nombreAl=filaPrinc.insertCell();
    nombreAl.innerHTML="<table><tr><td>Alumno:</td>"
    console.log("Instrumentos en tabla: ")
    console.log(instrumentos);
    for (let i=0;i<instrumentos.length;i++){
        nombreAl.innerHTML+="<td>"+instrumentos[i]+"</td>"
    } 
    nombreAl.innerHTML+="</tr></table>"; */
    tablaGeneral=document.createElement("table");
    relacionNotas.appendChild(tablaGeneral);
     fx=tablaGeneral.insertRow(-1);
    /* let cn=fx.insertCell();
    let tablaNombre=document.createElement("table");
    cn.appendChild(tablaNombre);
    let ff=tablaNombre.insertRow(-1);
    let fa=ff.insertCell();
    fa.colSpan="2";
    fa.style.border="1px solid #000"
    fa.innerHTML="Reparto por competencias";
    let fb=tablaNombre.insertRow(-1)
    let cb=fb.insertCell();
    cb.style.border="1px solid #000"
    fb.innerHTML="<b>Alumno: </b>";
    for (let q=0;q<alumnosOb.length;q++){
        let fs=tablaNombre.insertRow(-1);
        let cs=fs.insertCell();
        cs.innerHTML=alumnosOb[q].APELLIDOS+", "+alumnosOb[q].NOMBRE;
        cs.style.border="1px solid #000"
    } */
  
    grabaNotas.addEventListener('click',()=>{
        let info={
            "alumnos":alumnosOb,
            "notas":totalCompetencias,
            "materia":materiaElegida,
            "evaluacion":evaluacionElegida,
            "instrumentos":instrumentos,
            "instrumentosporCompetencia":instrumentosporCompetencia,
            "conjuntoNotas":notasEnviar
        }
        window.api.enviar("generaInformes",info)
    })
//Relleno tabla de notas por alumno e instrumento
rellenaTablaNombre();

        //relleno calculo competencias y criterios
 
});
window.api.recibir("tomaNotaIndividual",(datos)=>{
    let notita={
        "alumno":datos.alumno,
        "instrumento":datos.instrumento,
        "nota":datos.nota[0].nota
    }
    notasEnviar.push(notita);
colocaNota(datos);
//dameAlumnos();
});
function colocaNota(datos){
   if (typeof datos.nota[0].nota=='undefined'){
    document.getElementById(datos.instrumento+datos.alumno).value=0;
    let info={
        "nivelReal":nivel.options[nivel.selectedIndex].value,
        "nivelElegido":nivelElegido,
        "materiaElegida":materiaElegida,
        "evaluacion":evaluacionElegida,
        "instrumento":datos.instrumento,
        "alumno":datos.alumno,
        "nota":0
    }
    window.api.enviar("grabaNotas2",info);
   }else{
    document.getElementById(datos.instrumento+datos.alumno).value=datos.nota[0].nota;

   }
   document.getElementById(datos.instrumento+datos.alumno).addEventListener('change',()=>{
   // console.log("Cambiando Elemento "+datos.instrumento+datos.alumno+" a "+document.getElementById(datos.instrumento+datos.alumno).value);
    let info={
        "nivelReal":nivel.options[nivel.selectedIndex].value,
        "nivelElegido":nivelElegido,
        "materiaElegida":materiaElegida,
        "evaluacion":evaluacionElegida,
        "instrumento":datos.instrumento,
        "alumno":datos.alumno,
        "nota":document.getElementById(datos.instrumento+datos.alumno).value
    }
    //Necesito también actualizar notasEnviar
    for (let i=0;i<notasEnviar.length;i++){
        if (datos.instrumento==notasEnviar[i].instrumento&&datos.alumno==notasEnviar[i].alumno){
            notasEnviar[i].nota=document.getElementById(datos.instrumento+datos.alumno).value
        }
    }
   
    window.api.enviar("actualizaNota",info);
})
   // console.log("colocando nota en "+datos.instrumento+datos.alumno);
    notasColocadas++;
 //   console.log("notasColocadas: "+notasColocadas);
    if (notasColocadas==(alumnos.length*instrumentos.length)){
        console.log("Procedemos a rellenar tablaComp")

        rellenaTablaComp();
    }
        
}
window.api.recibir("notaActualizada",()=>{
 console.log("actualizando");
 notasColocadas=0;
 rellenaTablaComp();

 
})
function rellenaTablaNombre(){
    let alumnosOb=alumnos;
    let nuevaFil=tablaAlumnos.insertRow(-1);
    let tituloNombreAlumno=nuevaFil.insertCell();
    tituloNombreAlumno.innerHTML="Nombre de alumno: ";
    for (let i=0;i<instrumentos.length;i++){
        let nuevCol=nuevaFil.insertCell()
        nuevCol.innerHTML=instrumentos[i];
    }
    for (let i=0;i<alumnosOb.length;i++){
        let nuevaFila=tablaAlumnos.insertRow(-1);
        let nombreAlumno=nuevaFila.insertCell();
       
        nombreAlumno.innerHTML=alumnosOb[i].APELLIDOS+", "+alumnosOb[i].NOMBRE;

        for (let m=0;m<instrumentos.length;m++){
            let coli=nuevaFila.insertCell();
            let val=document.createElement("input");
            val.id=instrumentos[m]+alumnosOb[i].ALUMNO;
            let info3={
                "nivelReal":nivel.options[nivel.selectedIndex].value,
                "nivelElegido":nivelElegido,
                "materiaElegida":materiaElegida,
                "evaluacion":evaluacionElegida,
                "instrumento":instrumentos[m],
                "alumno":alumnosOb[i].ALUMNO,
                "nota":0
            }
            coli.appendChild(val);

      
            window.api.enviar("dameNotaIndividual",info3)
          

        }

    }
    let negritab=document.createElement("h2");
    let titulito=document.createTextNode("Notas de competencias afectadas en esta evaluación: ");
    negritab.appendChild(titulito);
    relacionNotas.innerHTML+="<br>";
    relacionNotas.appendChild(negritab);
    let info={
        "alumnos":alumnos,
        "busqueda":busqueda,
        "evaluacion":evaluacion.options[evaluacion.selectedIndex].value
    }
    window.api.enviar("compruebaNotas",info)
}
//Para quedarme con dos decimales y que redondee
function RoundNum(num, length) { 
    var number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
    return number;
}
function rellenaTablaComp(){
    let alumnosOb=alumnos;
    filaTablaComp.innerHTML="";
    filaNotasFinales.innerHTML="";
    filaNotasFinales=document.createElement("table");
    filaTablaComp=document.createElement("table");
    notasGenerales=[];
    pesoCompetenciasAcumulado=0;

    relacionNotas.appendChild(filaTablaComp)
    for (let i=0;i<totalCompetencias.length;i++){
        pesoCompetenciasAcumulado+=totalCompetencias[i].pesoCompetencia;
    }
    for (let i=0;i<totalCompetencias.length;i++){
        notasGenerales[i]=[];
        let renglon=document.createElement("br");
        
        filaTablaComp.appendChild(renglon);
        let tablaCom=document.createElement("table")
        tablaCom.id=totalCompetencias[i].competencia
     //   let alprev=fx.insertCell();
        filaTablaComp.appendChild(tablaCom);
        let fl=tablaCom.insertRow(-1);
        let alb=fl.insertCell();
        alb.style.border = "1px solid #000"
        alb.innerHTML="<b>Nota por competencias</b>"
        let al=fl.insertCell();
        al.colSpan=totalCompetencias[i].pesoCriterios.length+1;
        al.style.border = "1px solid #000"
    
        al.innerHTML="Competencia: "+totalCompetencias[i].competencia+" ("+totalCompetencias[i].pesoCompetencia+" %)";
        let fl2=tablaCom.insertRow(-1)
        let al44=fl2.insertCell();
        al44.style.border = "1px solid #000"
        al44.innerHTML="<b>Alumno:</b>"
        for (let k=0;k<totalCompetencias[i].criterios.length;k++){
           
            let co=fl2.insertCell();
            co.style.border = "1px solid #000"
            co.innerHTML="Criterio "+totalCompetencias[i].criterios[k]+" ("+totalCompetencias[i].pesoCriterios[k]+" %)"
        }
        let al55=fl2.insertCell();
        al55.style.border = "1px solid #000"
        al55.innerHTML="Nota de competencia:"
        for (let n=0;n<alumnosOb.length;n++){
   
            let nuevaFila=tablaCom.insertRow(-1);
            let nombreAlu=nuevaFila.insertCell();
            nombreAlu.style.border = "1px solid #000"

            nombreAlu.innerHTML=alumnosOb[n].APELLIDOS+", "+alumnosOb[n].NOMBRE; 
            let cad="";
            let notaComp=0;
            let sumaCrit=0;
            for (let o=0;o<totalCompetencias[i].criterios.length;o++){
                let cu=nuevaFila.insertCell();
                cu.id=alumnosOb[n].ALUMNO+totalCompetencias[i].competencia+totalCompetencias[i].criterios[o];
                let cadena="";
                //Cálculo de la nota en cada criterio
                let inst=[];
                let nota=0;
                let cuen=0;
                for (let b=0;b<instrumentosporCompetencia.length;b++){
                    for (let r=0;r<instrumentosporCompetencia[b].length;r++){
                        if (instrumentosporCompetencia[b][r].competencia==totalCompetencias[i].competencia&&instrumentosporCompetencia[b][r].criterio==totalCompetencias[i].criterios[o]){
                            inst.push(instrumentosporCompetencia[b][r].instrumento);
                            cadena+=instrumentosporCompetencia[b][r].instrumento+"-> "+parseFloat(document.getElementById(inst[cuen]+alumnosOb[n].ALUMNO).value)+", ";
                            cuen++;
                        }
                    }
                }
                 for (let u=0;u<inst.length;u++){
                  //  console.log("Buscando valor "+inst[u]+alumnosOb[n].ALUMNO+": "+document.getElementById(inst[u]+alumnosOb[n].ALUMNO).value);
                  //  cadena+=document.getElementById(inst[u]+alumnosOb[n].ALUMNO).value+", ";
                    nota+=parseFloat(document.getElementById(inst[u]+alumnosOb[n].ALUMNO).value);
                    
                } 
                cu.innerHTML=cadena+"Nota de criterio->"+RoundNum(nota/inst.length,2);
                cu.style.border = "1px solid #000"
                cad+=RoundNum(nota/inst.length,2)+" a "+totalCompetencias[i].pesoCriterios[o]+" %, ";
                notaComp+=(nota/inst.length)*totalCompetencias[i].pesoCriterios[o];
                sumaCrit+=totalCompetencias[i].pesoCriterios[o]
               // cu.innerHTML=alumnosOb[n].APELLIDOS+", "+alumnosOb[n].NOMBRE+totalCompetencias[i].competencia+totalCompetencias[i].criterios[o];

            }

            let cos=nuevaFila.insertCell();
            cos.innerHTML=cad+"Nota de competencia: ->"+RoundNum(notaComp/sumaCrit,+2);
            cos.style.border = "1px solid #000"
           // console.log("Empujando nota competenciaL "+(notaComp/sumaCrit)*totalCompetencias[i].pesoCompetencia+" para un peso total de "+pesoCompetenciasAcumulado)
            notasGenerales[i].push((notaComp/sumaCrit)*totalCompetencias[i].pesoCompetencia);

        }
        console.log("peso competenciaL: "+pesoCompetenciasAcumulado)

    }
    relacionNotas.appendChild(filaNotasFinales);
    let text=document.createElement("p");
    filaNotasFinales.appendChild(text);
    console.log("GEnerales: ");
    console.log(notasGenerales)
    let tituloNotaFinal=document.createTextNode("Nota final para la evaluación "+evaluacionElegida)
    let negrita=document.createElement("h2");
    negrita.appendChild(tituloNotaFinal)
    filaNotasFinales.appendChild(negrita);
    let text2=document.createElement("p");
    filaNotasFinales.appendChild(text2);
    let tablaNotas=document.createElement("table");
/*     let finali=fx.insertCell();
    fx.appendChild(tablaNotas); */
    filaNotasFinales.appendChild(tablaNotas);
    let fl=tablaNotas.insertRow(-1);
    let albb=fl.insertCell();
    albb.style.border = "1px solid #000"
    albb.innerHTML="<b>Alumno: </b>"
    let alb=fl.insertCell();
    alb.style.border = "1px solid #000"
    alb.innerHTML="<b>Nota final: </b>"
    for (let n=0;n<alumnosOb.length;n++){
   
        let nuevaFila=tablaNotas.insertRow(-1);
        let nombreAlu=nuevaFila.insertCell();
        nombreAlu.style.border = "1px solid #000"
        nombreAlu.innerHTML=alumnosOb[n].APELLIDOS+", "+alumnosOb[n].NOMBRE;
        let notaAlu=nuevaFila.insertCell();
        notaAlu.style.border = "1px solid #000";
        let notilla=0;
        for (let a=0;a<notasGenerales.length;a++){
            notilla+=notasGenerales[a][n];
        }
        notilla=notilla/pesoCompetenciasAcumulado;
        notaAlu.innerHTML=RoundNum(notilla,2);

    }
    grabaNotas.hidden=false;

}