const { app, BrowserWindow ,Menu,globalShortcut} = require('electron')
const PDFDocument = require('pdfkit');
const path = require('path')
const homedir = require('os').homedir();
let camino=path.join(__dirname,'dataBase/dataBase.js')
const path2 = `${__dirname}/baseDatos.db`.replace('app.asar', 'app.asar.unpacked');
let instrumentos=[]
let db=require(camino)
const fs=require('fs-extra')
const { ipcMain,dialog} = require('electron')
const { Database } = require('sqlite3');
const { resolve } = require('path');
const { cursorTo } = require('readline');
const { text } = require('pdfkit');
const { Console } = require('console');
const doc = require('pdfkit');
const { parse } = require("csv-parse");
var appVersion="1.0.0"
let win
let textos=[]
let textosTotales=[]
let archivo,archivo2
function grabaBase(){
	//Creamos un directorio auxiliar en home
 
//alert ('Aviso: si tenías Arduino previamente instalado, y habías instalado alguna librería poco común, es posible que después tengas que reinstalarla...');	
var dir=homedir+'/.cyrano';
	var dir2=dir+'/'+appVersion
	var dir3=homedir+'/.cyrano/';
if (fs.existsSync(dir)){
	console.log("");
	fs.removeSync(dir,{ recursive: true });
}
	fs.mkdirSync(dir,function(err,stdout){
		if (err) {return console.error(err);}
		else{console.log('1. directorio creado correctamente: '+stdout);
	};
	});
	fs.writeFile(dir2, appVersion, (err,stdout) => {
        if(err){
            console.log("Problema creando el archivo de nueva versión"+ err.message)
        }
                    
        console.log("Archivo de versión "+appVersion+" creado");
		console.log(stdout);
	//	alert("creaMasaylo() terminado");
		copiaArchivosCompilacion();
    });
	

}
function copiaArchivosCompilacion(){
	var fuente=__dirname+('/dataBase/'); 
	var dir=homedir+'/.cyrano';

	fs.copy(fuente, dir, function (err,stdout) {
		if (err) return console.error(err)
  
	  })
	

}
const createWindow = () => {
  var dir=homedir+'/.cyrano/'+appVersion;
  if (!fs.existsSync(dir)){
    console.log("No existe el directorio");
    grabaBase();
  }

    win = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true
    
    
    },
  })
  const menuTemplate = [
    {
        label: 'Respaldar base de datos',
        click:()=>{
          dialog.showSaveDialog({
            title: 'Respaldar base de datos',
            defaultPath: path.join(__dirname, '/'),
            // defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: 'Guardar',
            // Restricting the user to only Text Files.
            filters: [
                {
                    name: 'Archivos db',
                    extensions: ['db']
                }, ],
            properties: []
        }).then(file => {
            // Stating whether dialog operation was cancelled or not.
            console.log(file.canceled);
            if (!file.canceled) {
              var fuente=homedir+('/.cyrano/baseDatos.db'); 

                console.log(file.filePath.toString());
                archivo=file.filePath.toString()+'.db';
                console.log(archivo);
fs.copyFile(fuente,archivo)
        
        
            }
        })
        }
    },
    {
      label: 'Restaurar base de datos',
      click:()=>{
        dialog.showOpenDialog({
          title: 'Restaurar base de datos',
          defaultPath: path.join(__dirname, '/'),
          // defaultPath: path.join(__dirname, '../assets/'),
          buttonLabel: 'Restaurar',
          // Restricting the user to only Text Files.
          filters: [
              {
                  name: 'Archivos db',
                  extensions: ['db']
              }, ],
          properties: ['openFile']
      }).then(file => {
          // Stating whether dialog operation was cancelled or not.
          console.log(file);
          console.log(file.canceled);
          if (!file.canceled) {
            var destino=homedir+('/.cyrano/baseDatos.db'); 

              archivo=file.filePaths.toString();
              console.log("Archivo: "+archivo);
              console.log("Destino: "+destino);
fs.copyFile(archivo,destino);
      
      
          }
      })
      }
    },
    {
      label: 'Restaurar datos de mi centro',
      click:()=>{
        dialog.showOpenDialog({
          title: 'Restaurar datos de mi centro',
          defaultPath: path.join(__dirname, '/'),
          // defaultPath: path.join(__dirname, '../assets/'),
          buttonLabel: 'Restaurar',
          // Restricting the user to only Text Files.
          filters: [
              {
                  name: 'Archivos csv',
                  extensions: ['csv']
              }, ],
          properties: ['openFile']
      }).then(file => {
        let datos=[];
          // Stating whether dialog operation was cancelled or not.
          console.log(file);
          console.log(file.canceled);
          fs.createReadStream(file.filePaths.toString())
  .pipe(parse({ encoding: 'latin1',delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    //console.log(row);
    datos.push(row);
  })
  .on("end",function(){
let Promise=db.graba("DELETE FROM datMatriculas ").then(()=>{
  db.restaura(datos);

})



    
  })
/*           if (!file.canceled) {
            var destino=homedir+('/.cyrano/baseDatos.db'); 

              archivo=file.filePaths.toString();
              console.log("Archivo: "+archivo);
              console.log("Destino: "+destino);
fs.copyFile(archivo,destino);
      
      
          } */
      })
      }
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
  win.loadFile(path.join(__dirname,'html/index.html'))
}
app.whenReady().then(() => {
	createWindow();
    globalShortcut.register('Control+Shift+I', () => {
        // When the user presses Ctrl + Shift + I, this function will get called
        // You can modify this function to do other things, but if you just want
        // to disable the shortcut, you can just return false
win.openDevTools();    });  })
  
ipcMain.on('cargaHazProgramacion',function(event){
  win.loadFile(path.join(__dirname,'html/hazProgramacion.html'))
})
ipcMain.on('cargaPonerNotas',function (event){
  win.loadFile(path.join(__dirname,'html/ponerNotas.html'))

})
ipcMain.on('cargaVerNotas',function (event){
  win.loadFile(path.join(__dirname,'html/verNotas.html'))

})
  ipcMain.on('dameMaterias',function(event,nivel){
    let promise=db.dameMaterias(nivel).then((datos)=>{
      win.webContents.send('tomaMaterias',datos);
    })
  })
  ipcMain.on("dameCriterios",function(event,eleccion){
 //console.log("Llamando a dameCriterios");
    let cadena=eleccion.materiaElegida;
   // console.log("cadena: "+cadena)
    let promise=db.dameCrit(cadena).then((datos)=>{
      //console.log(datos);
      win.webContents.send('tomaCriterios',datos);
    })
  });
/*   ipcMain.on("compruebaTabla",function(event,datos){
    console.log(datos);
    let cadena="SELECT * FROM "+datos;
  
    let promise=db.dameDatos(cadena).then((respuesta)=>{
      
      
      win.webContents.send("la tabla no existe")
    })

  }) */
  ipcMain.on("dameCompetencias",function(event,datos){
    let cadena=datos.materiaElegida;
let cadena2=datos.nivelElegido+datos.materiaElegida;

//Comprobamos si la tabla existe
let tablaComp="prog"+cadena;
let tablaInst="inst"+cadena
let promise1=db.dameDatos("SELECT * FROM "+tablaComp).then((respuesta)=>{

 // console.log(respuesta);
  if (respuesta=='no'){
    let promisec=db.creaTabla("prog"+cadena).then((respuesta)=>{
      let sql = `SELECT * FROM `+cadena;
     // console.log("Buscando competencias..."+sql);
      //console.log("retirando competencias: "+sql)
          let promise=db.dameDatos(sql).then((respuesta2)=>{
            let comp=[];
            for (let i=0;i<respuesta2.length;i++){
             // materia:datos[i].outcome_shortname.split('.')[1],
      
              comp.push(respuesta2[i].outcome_shortname.split('.')[2])
      
            }
            //console.log("Competencias: "+filtra(comp));
            win.webContents.send("tomaCompetencias",filtra(comp));
          })
          
    })

  }else{
    dialog.showMessageBox(win,
      {
        type: 'question',
        buttons: ['Sí, quiero una nueva programación', 'Me he equivocado, lo siento mucho, no volverá a ocurrir'],
        title: '¿Reescribir programación?',
        cancelId: 99,
        message:
          'Ya hay grabada una programación para ese nivel y materia. Si sigues adelante, se borrará y tendrás que empezar de cero...',
      }
  )
  .then((response)=>{
    //console.log(response);
    if (response.response==0){ 
      let sql = `SELECT * FROM `+cadena;
      //console.log("Borrando tabla "+tablaComp)
      let promise=db.borraTabla(tablaComp).then((respuestaA)=>{
       // console.log("Borrando tabla "+tablaInst)
        let promiseb=db.borraTabla(tablaInst).then((respuestaB)=>{

        }).then(()=>{
          let promise=db.dameDatos(sql).then((respuesta2)=>{
            let comp=[];
            for (let i=0;i<respuesta2.length;i++){
             // materia:datos[i].outcome_shortname.split('.')[1],
      
              comp.push(respuesta2[i].outcome_shortname.split('.')[2])
      
            }
            //console.log("Competencias: "+filtra(comp));
            win.webContents.send("tomaCompetencias",filtra(comp));
          })
        })      
      })

          
    }else{
      console.log("Error. No se reescribe...");
      return;
    }
  })
   



  }
})

  })
  ipcMain.on("grabaCompetencias",function(event,info){
for (let i=0;i<info.repartoCompetencias.length;i++){
  //console.log(info.repartoCompetencias[i]);
}
  })
  function filtra(data){
 let arr=[];
 data.forEach(element => {
  if (!arr.includes(element)){
    arr.push(element)
  }
  
 });
 return arr;
    }
    ipcMain.on("grabaProgramacion",function(event,infoFinal){
for (let i=0;i<infoFinal.length;i++){
      let promise1=db.grabaProgramacion(infoFinal[i]).then((respuesta)=>{
      });
         
    }
    win.loadFile(path.join(__dirname,'html/index.html'))
      
    })
    
    ipcMain.on("cargaAnyadeInstrumento",function(){
      win.loadFile(path.join(__dirname,'html/anyadeInstrumento.html'))
    })
    ipcMain.on("compruebaInstrumentos",function(event,datos){
      let cadena=datos.materiaElegida;
      let cadena2="_"+datos.nivelElegido+datos.materiaElegida;

          let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
          let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
         // console.log(selectedTable);
      
      //Comprobamos si existe la tabla de programación; si no existe, abortamos
      let tablaComp="prog"+cadena;
      let tablaInst="inst"+cadena;
      let promise1=db.dameDatos("SELECT * FROM "+tablaComp).then((respuesta)=>{

        if (respuesta=='no'){
          
          dialog.showMessageBox(win,
            {
              type: 'warning',
              buttons: ['Me \"abré\" equivocado...'],
              title: 'No hay programación grabada',
              cancelId: 99,
              message:
                'No hay grabada una programación para esta materia en este nivel',
            }
        ).then(()=> {
          win.loadFile(path.join(__dirname,'html/index.html'))
        })
 
      
        }else{
          //Si la programación existe, comprobamos si existe ya la tabla de instrumentos
          let promise2=db.dameDatos("SELECT * FROM "+tablaInst).then((respuesta)=>{
            //console.log(respuesta);
            if (respuesta=='no'){
              //No existe; procedemos a crear la tabla
              let creacion = 'CREATE TABLE '+tablaInst+' ("id"	INTEGER PRIMARY KEY AUTOINCREMENT,"instrumento" TEXT NOT NULL,"competencia"	TEXT NOT NULL,"pesoCompetencia"	NUMERIC NOT NULL,"criterio"	TEXT NOT NULL,"pesoCriterio"	NUMERIC NOT NULL,"evaluacion"	INTEGER)';
              let promise3=db.creaTabla2(creacion).then((respuesta4)=>{
                console.log(respuesta4);
              })
            }
          })     
          win.webContents.send("instrumentosComprobados");
 
        }
      })
      
    })
    ipcMain.on("buscaInstrumentos",function(event,busqueda){
      let cadena=busqueda.materiaElegida;
      let cadena2="_"+busqueda.nivelElegido+busqueda.materiaElegida;

          let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
          let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
          console.log(selectedTable);
      
      //Comprobamos si existe la tabla de programación; si no existe, abortamos
      let tablaComp="prog"+cadena;
      let tablaInst="inst"+cadena;   
   //Cambio id por criterio
     // let promise1=db.dameDatos("SELECT * FROM "+tablaInst+" WHERE evaluacion=="+busqueda.evaluacion+" ORDER BY competencia, id, criterio").then((respuesta)=>{
//console.log("Buscando instrumentos en "+tablaInst)
let sql="";
   sql="SELECT * FROM "+tablaInst+" WHERE evaluacion=="+busqueda.evaluacion+" ORDER BY competencia, criterio, id"

let promise1=db.dameDatos(sql).then((respuesta)=>{

        instrumentos=[];
        if (respuesta.length==0){
          console.log("No hay instrumentos");
          instrumentos=respuesta;
        }else{
          instrumentos=respuesta;
        }
      }).then(()=>{
        //console.log("Fallan los criterios...");
        //console.log("SELECT * FROM "+tablaComp+ " WHERE evaluacion"+busqueda.evaluacion+"==1 ORDER BY competencia,criterio")
        
        let promise2=db.dameDatos("SELECT * FROM "+tablaComp+ " WHERE evaluacion"+busqueda.evaluacion+"==1 ORDER BY competencia,criterio").then((respuesta)=>{
  
          let info={
            "instrumentos":instrumentos,
            "criterios":respuesta
          }
  
        //  console.log("Instrumentos y criterios: ");
         // console.log(info);
          win.webContents.send("tomaInstrumentos",info);
  
        })
      })
    })
    ipcMain.on("buscaInstrumentos2",function(event,busqueda){
      let cadena=busqueda.materiaElegida;
      let cadena2="_"+busqueda.nivelElegido+busqueda.materiaElegida;

          let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
          let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
          console.log(selectedTable);
      
      //Comprobamos si existe la tabla de programación; si no existe, abortamos
      let tablaComp="prog"+cadena;
      let tablaInst="inst"+cadena;   
   //Cambio id por criterio
     // let promise1=db.dameDatos("SELECT * FROM "+tablaInst+" WHERE evaluacion=="+busqueda.evaluacion+" ORDER BY competencia, id, criterio").then((respuesta)=>{
//console.log("Buscando instrumentos en "+tablaInst)
let sql="";
if (busqueda.evaluacion!=3){
  sql="SELECT * FROM "+tablaInst+" WHERE evaluacion=="+busqueda.evaluacion+" ORDER BY competencia, criterio, id"

}else{
  sql="SELECT * FROM "+tablaInst+" ORDER BY competencia, criterio, id"
}

let promise1=db.dameDatos(sql).then((respuesta)=>{

        instrumentos=[];
        if (respuesta.length==0){
          console.log("No hay instrumentos");
          instrumentos=respuesta;
        }else{
          instrumentos=respuesta;
        }
      }).then(()=>{
        //console.log("Fallan los criterios...");
        //console.log("SELECT * FROM "+tablaComp+ " WHERE evaluacion"+busqueda.evaluacion+"==1 ORDER BY competencia,criterio")
        
        let promise2=db.dameDatos("SELECT * FROM "+tablaComp+ " WHERE evaluacion"+busqueda.evaluacion+"==1 ORDER BY competencia,criterio").then((respuesta)=>{
  
          let info={
            "instrumentos":instrumentos,
            "criterios":respuesta
          }
  
        //  console.log("Instrumentos y criterios: ");
         // console.log(info);
          win.webContents.send("tomaInstrumentos",info);
  
        })
      })
    })
    ipcMain.on("grabaInstrumento",function(event,info){
      let cadena=info.materiaElegida;
      let cadena2="_"+info.nivelElegido+info.materiaElegida;

          let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
          let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
          console.log(selectedTable);
      

      let tablaInst="inst"+cadena;  
      let sql2="SELECT * FROM "+tablaInst+" WHERE instrumento=='"+info.nombreInstrumento+"'";
      console.log(sql2);
      let promise=db.dameDatos(sql2).then((nombreI)=>{
        //console.log(JSON.stringify(nombreI))
        if (nombreI.length>0){
          dialog.showMessageBox(win,
            {
              type: 'warning',
              buttons: ['Ok'],
              title: 'Ya existe ese nombre',
              cancelId: 99,
              message:
                'Ya hay un instrumento de evaluación con ese nombre en esta programación. No se grabará...',
            }
        )
          console.log("Ya hay un instrumento grabado con ese nombre. Cambiar...")
        }else{
          console.log("Este instrumento es nuevo, grabamos")
          for (let i=0;i<info.criterios.length;i++){
            let sql="INSERT INTO "+tablaInst+" (instrumento,competencia,pesoCompetencia,criterio,pesoCriterio,evaluacion) VALUES "+
            "('"+info.nombreInstrumento+"','"+info.criterios[i].competencia+"',"+info.criterios[i].pesoCompetencia+",'"+info.criterios[i].criterio
            +"',"+info.criterios[i].pesoCriterio+","+info.evaluacion+");"
            console.log(sql);
            db.graba(sql);
          }
          win.loadFile(path.join(__dirname,'html/index.html'))
        }
      })

   

    })
    ipcMain.on('borraInstrumento',function(event,inst){
      let cadena=inst.materiaElegida;
      let cadena2="_"+inst.nivelElegido+inst.materiaElegida;

          let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
          let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
          console.log(selectedTable);
      

      let tablaInst="inst"+cadena;  
      let tablaNotas="notas"+cadena
      dialog.showMessageBox(win,
        {
          type: 'question',
          buttons: ['Borrar instrumento', 'Cancelar'],
          title: '¿Borrar instrumento?',
          cancelId: 99,
          message:
            '¿Quieres borrar el instrumento '+inst.instrumento+' que habías creado para la evaluacion '+inst.evaluacion+'?',
        }
    )
    .then((response)=>{
      if (response.response==0){ 
        let sql = "DELETE  FROM "+tablaInst+" WHERE instrumento=='"+inst.instrumento+"' AND evaluacion=="+inst.evaluacion;
        console.log(sql);
        let promise=db.graba(sql).then((respuesta)=>{
          console.log(respuesta);
          let sql="DELETE FROM "+tablaNotas+" WHERE instrumento=='"+inst.instrumento+"' AND evaluacion=="+inst.evaluacion;
          console.log(sql);
          db.graba(sql).then(()=>{
            win.loadFile(path.join(__dirname,'html/index.html'))
          })
        })
/*         let promise=db.borraTabla(tablaComp).then((respuestaA)=>{
          let promise=db.dameDatos(sql).then((respuesta2)=>{
            let comp=[];
            for (let i=0;i<respuesta2.length;i++){
             // materia:datos[i].outcome_shortname.split('.')[1],
      
              comp.push(respuesta2[i].outcome_shortname.split('.')[2])
      
            }
            console.log("Competencias: "+filtra(comp));
            win.webContents.send("tomaCompetencias",filtra(comp));
          })
        })
  
             */
      }else{
        console.log("Error. No se reescribe...");
        return;
      }
    })
     
    })
    ipcMain.on('dameGrupos',function(event,arg){
      let promise=db.dameGrupos().then((datos)=>{
        win.webContents.send("tomaGrupos",datos)
      })
    })
ipcMain.on("dameInstrumentos",function(event,info){
  let cadena=info.materiaElegida;
  let cadena2="_"+info.nivelElegido+info.materiaElegida;

      let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
      let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
      console.log(selectedTable);
  

  let tablaInst="inst"+cadena;  
  let sql="";
 
    sql="SELECT DISTINCT instrumento FROM "+tablaInst+" WHERE evaluacion=="+info.evaluacion+' ORDER BY competencia, id';
  

  let promise=db.dameDatos(sql).then((respuesta)=>{
if (info.evaluacion==3){
  console.log("EValuacion final")
  console.log(JSON.stringify(respuesta));
}
win.webContents.send("tomaInstrumentos",respuesta)
  })
})
ipcMain.on("dameAlumnos",function(event,grupo){
  console.log("grupo "+grupo);
  let promise=db.dameAlumnos(grupo).then((respuesta)=>{
    win.webContents.send("tomaAlumnos",respuesta);
  })

})
ipcMain.on("compruebaTablaNotas",function(event,info){
  let cadena=info.materiaElegida;
  let cadena2="_"+info.nivelElegido+info.materiaElegida;

      let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
      let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');

  let tablaNotas="notas"+selectedTable;  
  let promise=db.graba("CREATE TABLE IF NOT EXISTS "+tablaNotas+'("id" INTEGER PRIMARY KEY AUTOINCREMENT,"instrumento" TEXT NOT NULL,"evaluacion" INTEGER,"alumno" NUMERIC NOT NULL,"nota" NUMERIC NOT NULL)')
})
ipcMain.on("grabaNotas",function(event,info){
  let cadena=info.busqueda.materiaElegida;
  let cadena2="_"+info.busqueda.nivelElegido+info.busqueda.materiaElegida;

      let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
      let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
  

  let tablaNotas="notas"+cadena;  

  //Primero borramos notas anteriores, luego grabamos
  for (let i=0;i<info.notas.length;i++){
    let sql="DELETE FROM "+tablaNotas+" WHERE instrumento=='"+info.notas[i].instrumento+"' AND evaluacion=="+info.evaluacion+" AND alumno=="+info.notas[i].alumno;
    //console.log("Borrando notas con sentencia "+sql);
    db.graba(sql).then(()=>{
      let sql2= "INSERT INTO "+tablaNotas+" (instrumento,evaluacion,alumno,nota) VALUES ('"+info.notas[i].instrumento+"', "+info.evaluacion+", "+info.notas[i].alumno+", "+info.notas[i].notaObtenida+")";
     // console.log("Grabando notas con sentencia "+sql2);
      db.graba(sql2);
    });

  }
  

  win.loadFile(path.join(__dirname,'html/index.html'))


})
ipcMain.on("grabaNotas2",function (event,info){
  console.log("Se ha encontrado una nota vacía, probablente, y me piden que le ponga un 0");
  console.log("Instrumento: "+info.instrumento);
  console.log("Evaluacion: "+info.evaluacion);
  console.log("Alumno: "+info.alumno);
  console.log("Tabla: notas"+info.materiaElegida)
  let sql="INSERT INTO notas"+info.materiaElegida+"(instrumento,evaluacion,alumno,nota) VALUES ('"+info.instrumento+"', "+info.evaluacion+", "+info.alumno+", "+info.nota+")";
  let promise=db.graba(sql).then(()=>{
    console.log("Nota grabada")
  })
})
ipcMain.on("compruebaNotas",function(event,info){
  let cadena=info.busqueda.materiaElegida;
  let cadena2="_"+info.busqueda.nivelElegido+info.busqueda.materiaElegida;

      let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
      let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
  let tablaNotas="notas"+cadena;  
  
  for (let i=0;i<info.alumnos.length;i++){
    let sql="SELECT * FROM "+tablaNotas+" WHERE instrumento=='"+info.instrumento+"' AND evaluacion=="+info.evaluacion+" AND alumno=="+info.alumnos[i].ALUMNO;
    let promise=db.dameDatos(sql).then((respuesta)=>{
      if (respuesta.length>0){
//console.log(respuesta)
win.webContents.send("tomaNotas",respuesta);

      }
    });

  }
})
ipcMain.on("compruebaProgramacion",function(event,datos){
  let cadena=datos.materiaElegida;
  let cadena2="_"+datos.nivelElegido+datos.materiaElegida;

      let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
      let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
     // console.log(selectedTable);
  
  //Comprobamos si existe la tabla de programación; si no existe, abortamos
  let tablaComp="prog"+cadena;
  let tablaInst="inst"+cadena;
  let promise1=db.dameDatos("SELECT * FROM "+tablaComp).then((respuesta)=>{

    if (respuesta=='no'){
      
      dialog.showMessageBox(win,
        {
          type: 'warning',
          buttons: ['Me \"abré\" equivocado...'],
          title: 'No hay programación grabada',
          cancelId: 99,
          message:
            'No hay grabada una programación para esta materia en este nivel',
        }
    ).then(()=> {
      win.loadFile(path.join(__dirname,'html/index.html'))
    })
}
})
});
ipcMain.on("dameNotaIndividual",function(event,datos){

  let cadena=datos.materiaElegida;
  let cadena2="_"+datos.nivelElegido+datos.materiaElegida;

      let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
      let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
     // console.log(selectedTable);
  
  //Comprobamos si existe la tabla de programación; si no existe, abortamos
  let tablaNotas="notas"+cadena;
  //Me preparo la evaluación final
  let sql;
 
    sql="SELECT nota FROM "+tablaNotas+" WHERE instrumento=='"+datos.instrumento+"' AND alumno="+datos.alumno;

  //console.log("Buscando nota individual");
  //console.log(sql)
  let promise=db.dameDatos(sql).then((respuesta)=>{
    if (respuesta.length>0){
     // console.log("He hallado nota")
      datos.nota=respuesta;
     // console.log(datos.nota);
      win.webContents.send("tomaNotaIndividual",datos)
    }else{
      datos.nota=[0];
      win.webContents.send("tomaNotaIndividual",datos)
      console.log("Hemos tenido problema con "+datos.nota)
    }

  }) 
})

ipcMain.on("dameInstrumentosporCompetencia",function(event,datos){

  let cadena=datos.materiaElegida;
  let cadena2="_"+datos.nivelElegido+datos.materiaElegida;

      let selectedTable = cadena.replace(/[^a-zA-Z0-9_]/g, '');
      let selectedTable2 = cadena2.replace(/[^a-zA-Z0-9_]/g, '');
     // console.log(selectedTable);
  
  //Comprobamos si existe la tabla de programación; si no existe, abortamos
  let tablaInstrumentos="inst"+cadena;
  let instrumento=[];
  for (let i=0;i<datos.totalCompetencias.length;i++){

    //Preparo sql para que también tome la tercera evaluación como la final
    let sql;
 if (datos.evaluacion!=3){
  sql="SELECT * FROM "+tablaInstrumentos+" WHERE competencia=='"+datos.totalCompetencias[i].competencia+"' AND evaluacion="+datos.evaluacion +' ORDER BY competencia';

 }else{
  sql="SELECT * FROM "+tablaInstrumentos+" WHERE competencia=='"+datos.totalCompetencias[i].competencia+"'  ORDER BY competencia";

 }
  
    let promise=db.dameDatos(sql).then((respuesta)=>{
      //console.log("Instrumentos para competencia: "+datos.totalCompetencias[i].competencia);
      //console.log(respuesta);
      instrumento.push(respuesta);
    }).then(()=>{
      //console.log("Tamaño: "+instrumento.length)
      //Si he llegado al final del bucle, envío.
      if(instrumento.length==datos.totalCompetencias.length){
       // console.log("Ahora que el tamaño es "+instrumento.length+", enviamos...");
      win.webContents.send("tomaInstrumentosporCompetencia",instrumento);
    }

    })

  }

})
ipcMain.on("actualizaNota",function(event,datos){
  console.log("Actualizando: ");
  console.log(datos);
  let cadena=datos.materiaElegida;

  let tablaNotas="notas"+cadena;  
  let sql="DELETE FROM "+tablaNotas+" WHERE instrumento=='"+datos.instrumento+"' AND evaluacion=="+datos.evaluacion+" AND alumno=="+datos.alumno;
  db.graba(sql).then(()=>{
    let sql2= "INSERT INTO "+tablaNotas+" (instrumento,evaluacion,alumno,nota) VALUES ('"+datos.instrumento+"', "+datos.evaluacion+", "+datos.alumno+", "+datos.nota+")";
    db.graba(sql2).then(()=>{
      win.webContents.send("notaActualizada");
    })
  })

})
function RoundNum(num, length) { 
  var number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
  return number;
}
ipcMain.on("generaInformes",function(event,datos){
  //console.log(JSON.stringify(datos.notas));
  let ruta=dialog.showOpenDialog({
    title: '¿Dónde lo guardamos?',
    defaultPath: path.join(__dirname, '/'),
    // defaultPath: path.join(__dirname, '../assets/'),
    buttonLabel: 'Guardar',

    properties: ["openDirectory"]
}).then((file)=>{

  ruta=file.filePaths
}).then(async()=>{
  //console.log("datos.notas: "+JSON.stringify(datos.notas));
 // console.log("datos.instrumentosporCompetencia:"+JSON.stringify(datos.instrumentosporCompetencia))

    for (let i=0;i<datos.alumnos.length;i++){

        let doc=new PDFDocument()
        doc.pipe(fs.createWriteStream(ruta.toString()+'/acta'+datos.alumnos[i].APELLIDOS+datos.alumnos[i].NOMBRE+'evaluacion'+datos.evaluacion+'.pdf'));
                              // stroke the path
                              doc.font('Times-Roman')
                              let textoTitulo=""
                              if (datos.evaluacion==1){
                                textoTitulo="PRIMERA EVALUACIÓN"
                                }
                                if (datos.evaluacion==2){
                                 textoTitulo="SEGUNDA EVALUACIÓN"
                                  }
                                  if (datos.evaluacion==3){
                                textoTitulo="EVALUACIÓN FINAL"         
                                   }
                                   doc.image(path.join(__dirname,'images/logoclm.png'), 0, 15, {width: 150}); 
                                   doc.image(path.join(__dirname,'images/cofinanciado.png'), 200, 15, {width: 50}); 
                                   doc.image(path.join(__dirname,'images/logoJuandeAvila.png'), 300, 15, {width: 50}); 
                                   doc.image(path.join(__dirname,'images/logoAlfonsoX.png'), 400, 15, {width: 50}); 
                        
                              doc
                              .fontSize(16)
                              .text('INFORME DE '+textoTitulo+' ESO', 100, 80)
                            
                              doc.fontSize(14)
                              doc.font('Times-Bold')

                              doc.text('Alumno/-a: '+datos.alumnos[i].APELLIDOS+','+datos.alumnos[i].NOMBRE, 50, 100);
                              doc.fontSize(12)
                         
                              let xNotas2=500
                              let yNotas2=doc.y;
                                   doc.moveDown();
                                   doc.font('Times-Bold')

                              doc.text('Notas obtenidas:')
                              doc.fontSize(12);
                              doc.font('Times-Roman')
                              doc.moveDown();

                              let xNotas=doc.x-10;
                              let yNotas=doc.y
                              let NotaCompTemporal=0;
                              let cuentaCompTemporal=0;
                             
                              for (let m=0;m<datos.instrumentos.length;m++){
                                let notita;
                                for (let k=0;k<datos.conjuntoNotas.length;k++){
                                  if (datos.alumnos[i].ALUMNO==datos.conjuntoNotas[k].alumno&&datos.instrumentos[m]==datos.conjuntoNotas[k].instrumento){
                                    notita=datos.conjuntoNotas[k].nota

                                  }
                                }
                              
                                doc.text("Instrumento: "+datos.instrumentos[m]+", nota->"+notita);
                                

                            }
                             yNotas2=doc.y;
                           let yCriterios=doc.y;
                            doc.lineWidth(5)
                          
                            doc.rect(xNotas,yNotas-5,xNotas2,yNotas2-yNotas+5).lineWidth('1').stroke()
                              doc.fontSize(12)
                              for (let k=0;k<datos.notas.length;k++){
                              //  console.log("Y1: "+doc.y)
                                doc.moveDown();
                                //console.log("Y2: "+doc.y);
                                let xCompetencia=doc.x-10;
                                let yCompetencia=doc.y-5
                                doc.font('Times-Bold')
                                doc.text ("Nota correspondiente a la competencia: "+datos.notas[k].competencia+" ("+datos.notas[k].pesoCompetencia+"% del total de la nota en todo el curso)");
                                doc.rect(xCompetencia,yCompetencia,500,doc.y-yCompetencia+5).lineWidth('1').stroke()
                                doc.moveDown();
                                
                                let notaCompetencia=[];
                                doc.fontSize(12);
                                doc.font('Times-Roman')

                             //  doc.rect(xCompetencia,yCompetencia-5,500,yCompetencia-doc.y).lineWidth('1').stroke();

                              for (let m=0;m<datos.notas[k].criterios.length;m++){
                              let notaCriterio=0;
                              let cuentaCriterio=0;
                              yCriterios=doc.y;
                                doc.text ("Criterio: "+datos.notas[k].criterios[m]+" ("+datos.notas[k].pesoCriterios[m]+"% dentro de la competencia)")
                                let cadena="Instrumentos utilizados: "
                              //  console.log("Buscando instrumentos para competencia "+datos.notas[k].competencia+", criterio: "+datos.notas[k].criterios.sort()[m])
                                for (let n=0;n<datos.instrumentosporCompetencia.length;n++){
                                  for (let s=0;s<datos.instrumentosporCompetencia[n].length;s++){
                                //  console.log(datos.instrumentosporCompetencia[n][0])
                                  if (datos.instrumentosporCompetencia[n][s].competencia==datos.notas[k].competencia&&datos.instrumentosporCompetencia[n][s].criterio==datos.notas[k].criterios[m]){
                                    //console.log("Encontrado para competencia "+datos.instrumentosporCompetencia[n][0].competencia+", criterio: "+datos.notas[k].criterios[m]+", introduciendo instrumento: "+datos.instrumentosporCompetencia[n][0].instrumento);
                                    
                                    cadena+=datos.instrumentosporCompetencia[n][s].instrumento+"->"
                                   
                                    for (let z=0;z<datos.conjuntoNotas.length;z++){
                                      if (datos.alumnos[i].ALUMNO==datos.conjuntoNotas[z].alumno&&datos.instrumentosporCompetencia[n][s].instrumento==datos.conjuntoNotas[z].instrumento){
                                        cadena+=datos.conjuntoNotas[z].nota+", ";
                                        notaCriterio+=parseFloat(datos.conjuntoNotas[z].nota);
                                        cuentaCriterio++;
                                      }
                                      
                                    }

                                  }
                                  
                                }
                                }
                                let notaFinalCriterio=parseFloat(notaCriterio/cuentaCriterio);
                                doc.text(cadena);
                               
                                let notaCrit={"nota":notaFinalCriterio,"peso":datos.notas[k].pesoCriterios[m]}
                                notaCompetencia.push(notaCrit);

                                doc.text ("Nota final para criterio "+datos.notas[k].criterios[m]+": "+RoundNum(notaFinalCriterio,2));
                               // let altoCuadro=0;
               /*                  if ((doc.y-yCriterios)>0){
                                  altoCuadro=doc.y-yCriterios;
                                }else{
                                  altoCuadro=yCriterios-doc.y;
                                } */
                               // doc.rect(doc.x-10,yCriterios,500,doc.y-yCriterios).lineWidth('1').stroke()
                                //doc.rect(doc.x-10,yCompetencia,500,doc.y-yCompetencia+5).lineWidth('1').stroke()

                            // doc.rect(xCompetencia,yCompetencia,500,doc.y-yCompetencia2).lineWidth('1').stroke()

                              }
                              let notaComp=0;
                              let cuenta2=0;
                              for (let h=0;h<notaCompetencia.length;h++){
                                notaComp+=parseFloat(notaCompetencia[h].nota*notaCompetencia[h].peso);
                                cuenta2+=notaCompetencia[h].peso;

                              }
                              let notaCompImp=parseFloat(notaComp/cuenta2)
                             
                              doc.font('Times-Bold');
                              doc.text("Nota en competencia "+datos.notas[k].competencia+": "+RoundNum(notaCompImp,2));
                              doc.font('Times-Roman');
                              NotaCompTemporal+=parseFloat(notaCompImp*datos.notas[k].pesoCompetencia);
                              cuentaCompTemporal+=parseFloat(datos.notas[k].pesoCompetencia);
                              let yCompetencia2=doc.y-5
                            // doc.rect(xCompetencia,yCompetencia,500,yCompetencia2).lineWidth('1').stroke()
                             doc.moveDown();
                              }
                              let notaFinal=parseFloat(NotaCompTemporal/cuentaCompTemporal)
                              doc.moveDown();
                              doc.fontSize(18);
                              let xNotaFinal=doc.x-10;
                              let yNotaFinal=doc.y-5
                              doc.text("Nota final: "+RoundNum(notaFinal,2));
                              doc.rect(xNotaFinal,yNotaFinal,500,doc.y-yNotaFinal).lineWidth('1').stroke();
                              doc.end();
                      

    }

});
win.loadFile(path.join(__dirname,'html/index.html'))

})