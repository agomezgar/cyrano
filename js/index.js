const hazProgramacion=document.getElementById("hazProgramacion");
const anyadeInstrumento=document.getElementById("anyadeInstrumento");
const ponerNotas=document.getElementById("ponerNotas");
const verNotas=document.getElementById("verNotas");
hazProgramacion.addEventListener('click',()=>{
    window.api.enviar('cargaHazProgramacion');
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
