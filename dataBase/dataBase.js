

const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const path2 = `${__dirname}/dataBase/baseDatos.db`.replace('app.asar', 'app.asar.unpacked');
const homedir = require('os').homedir();
var fuente=homedir+('/.cyrano/baseDatos.db'); 
console.log("Fuente: "+fuente)
function conectar(){
let db = new sqlite3.Database(fuente, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

}


function dameGrupos(){

  let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
   // let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);

  let sql = `SELECT DISTINCT GRUPO FROM datMatriculas ORDER BY grupo`;
  return new Promise((resolve,reject)=>{
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }

      resolve(rows)
    });
  })

  
  // close the database connection
  db.close();
  return rows;
}
function dameAlumnos(grupo){
    let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
    let sql = "SELECT * FROM datMatriculas WHERE GRUPO==? ORDER BY APELLIDOS,NOMBRE";
    return new Promise((resolve,reject)=>{
      db.all(sql, [grupo], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows)
      });
    })
    
    // close the database connection
    db.close();
    return rows;
}
function dameActa(datos){
  let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
  let sql = "SELECT * FROM actas WHERE idAlumno==? AND evaluacion=? GROUP BY item";
  return new Promise((resolve,reject)=>{
    db.all(sql,[datos.alumno,datos.evaluacion],(err,row)=>{
      if (err){
        reject(err);
      }
      resolve(row)
    })
  })
  db.close();
  return row
}
function dameItems(datos){
  let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
  let sql = "SELECT * FROM actas WHERE idAlumno==? and evaluacion=? ORDER BY item";
  
  return new Promise((resolve,reject)=>{
    db.all(sql,[datos.alumno,datos.evaluacion],(err,row)=>{
      if (err){
        reject(err);
      }
      resolve(row)
    })
  })
  db.close()
}
function dameTextoItems(datos){

  let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
  let sql = "SELECT * FROM items WHERE id== ?";
return new Promise((resolve,reject)=>{

  db.get(sql,[datos],(err,row)=>{
if (err){
  reject(err)
}

resolve(row)

 })



db.close()

}
)


  }

  function dameTodoTextoItems(datos){

    let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
    let sql = "SELECT * FROM items";
  return new Promise((resolve,reject)=>{
  
  
    db.all(sql,[],(err,row)=>{
  if (err){
    reject(err)
  }
  
  resolve(row)
  
   })
  
  
  
  db.close()
  
  }
  )
  
  
    }
    function grabaItem(datos){

      let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
      let sql = "INSERT INTO actas (idAlumno, evaluacion, item) VALUES(?,?,?)";
    return new Promise((resolve,reject)=>{
    
    
      db.run(sql,[datos.alumno,datos.evaluacion,datos.item],(err,row)=>{
    if (err){
      console.log(err.message)
      reject(err)
    }
    
    resolve(row)
    
     })
    
    
    
    db.close()
    
    }
    )
    
    
      }
      function borraItem(datos){

        let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
        let sql = "DELETE FROM actas WHERE idAlumno==? AND evaluacion==? and item==?";
      return new Promise((resolve,reject)=>{
      
      
        db.run(sql,[datos.alumno,datos.evaluacion,datos.item],(err,row)=>{
      if (err){
        reject(err)
      }
      
      resolve(row)
      
       })
      
      
      
      db.close()
      
      }
      )
      
      
        }

        function dameOtras(datos){
                  //Si existen items personalizados, se grabarán en esta tabla,
        //después de borrar el anterior (si existiera)

          let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
          let sql = "DELETE FROM itemsVariables WHERE identidadItem==? AND alumno==? and evaluacion==?";
          let sql2 = "INSERT INTO itemsVariables (identidadItem, alumno, evaluacion,texto) VALUES(?,?,?,?)";
return new Promise((resolve,reject)=>{
  
db.all(sql,[datos.identidadItem,datos.alumno,datos.evaluacion],(err,row)=>{
  if (err){
    console.log(err.message)
    reject (err)
  }

 resolve(row)
})
  
}).then((row)=>{
  new Promise((resolve,reject)=>{
        
if (datos.texto!=""){
    db.run(sql2,[datos.identidadItem,datos.alumno,datos.evaluacion,datos.texto],(err,row)=>{
  if (err){
    console.log(err.message)
    reject(err)
  }

  resolve(row)
  
   })
  
}else{
  resolve(0)
}
  
  db.close()
  
  }
  )
})

      }

      //SIN USAR
      function borraOtras(datos){
        //Si existen items personalizados, se grabarán en esta tabla,
//después de borrar el anterior (si existiera)

let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
let sql = "DELETE FROM itemsVariables WHERE identidadItem==? AND alumno==? and evaluacion==?";
let sql2 = "INSERT INTO itemsVariables (identidadItem, alumno, evaluacion,texto) VALUES(?,?,?,?)";
let sql3="SELECT * FROM itemsVariables WHERE identidadItem==? AND alumno==? and evaluacion==?";
new Promise((resolve,reject)=>{


db.all(sql,[datos.identidadItem,datos.alumno,datos.evaluacion],(err,row)=>{
if (err){
console.log(err.message)
reject (err)
}
resolve(row)
})

}).then(()=>{
new Promise((resolve,reject)=>{

if (datos.texto!=""){
  db.run(sql3,[datos.identidadItem,datos.alumno,datos.evaluacion],(err,row)=>{
    
  })
db.run(sql2,[datos.identidadItem,datos.alumno,datos.evaluacion,datos.texto],(err,row)=>{
if (err){
console.log(err.message)
reject(err)
}

resolve(row)

})

}

db.close()

}
)
})

}
      function leeItemPersonalizado(datos){

        let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
        let sql = "SELECT * FROM itemsVariables WHERE identidadItem== ? AND alumno==? AND evaluacion==?";
      return new Promise((resolve,reject)=>{
        db.get(sql,[datos.identidadItem,datos.alumno,datos.evaluacion],(err,row)=>{
      if (err){
        reject(err)
      }
      resolve(row)
      
       })
      
      
      
      db.close()
      
      }
      )
      
      
        }
        function dameItemsPersonalizados(){
          let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
          let sql = "SELECT id, identidaditem,alumno,evaluacion,texto FROM itemsVariables GROUP BY texto";
        return new Promise((resolve,reject)=>{
          db.all(sql,[],(err,row)=>{
        if (err){
          reject(err)
        }
        resolve(row)
        
         })
        
        
        
        db.close()
        
        }
        )
        
        }
        function dameMaterias(nivel){

          let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
           // let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
        
          let sql = `SELECT * FROM materias2 WHERE NIVEL==?`;
        //  console.log("Buscando materias: "+nivel);
          return new Promise((resolve,reject)=>{
            db.all(sql, nivel, (err, rows) => {
              if (err) {
                reject(err);
              }
          //    console.log(rows);

              resolve(rows)
            });
          })
        
          
          // close the database connection
          db.close();
          return rows;
        }
        function dameCrit(eleccion) {
          let db = new sqlite3.Database(fuente, sqlite3.OPEN_READWRITE);
          const selectedTable = eleccion.replace(/[^a-zA-Z0-9_]/g, '');
          console.log(selectedTable);
          
          const sql = `SELECT * FROM ${selectedTable}`;
          console.log(sql);
        
          return new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
              if (err) {
                // Agregar detalles al mensaje de error
                const errorMessage = `Error executing SQL: ${sql}\nError Message: ${err.message}`;
                console.error(errorMessage);
                reject(errorMessage);
              }
        
              resolve(rows);
            });
          });
        
          // close the database connection
          db.close();
        }
        function dameDatos(datos){

          let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
          let sql = datos;
        return new Promise((resolve,reject)=>{
        
        
          db.all(sql,[],(err,row)=>{
        if (err){
          resolve("no");
          console.log(err);
        }
        
        resolve(row)
        
         })
        
        
        
        db.close()
        
        }
        )
        
        
          }
          function grabaProgramacion(datos){
        
            let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
            let sql="INSERT INTO prog"+datos.materia+" (competencia, pesoCompetencia,criterio,textoCriterio,pesoCriterio,evaluacion1,evaluacion2,evaluacion3) "
            +"VALUES (?,?,?,?,?,?,?,?)";
          
          return new Promise((resolve,reject)=>{
             console.log("Grabando programacion: "+sql);     
            db.run(sql,[datos.competencia,datos.pesoCompetencia,datos.criterio,datos.textoCriterio,datos.pesoCriterio,datos.evaluacion1,datos.evaluacion2,datos.evaluacion3],(err,row)=>{
          if (err){
            resolve("no");
            console.log(err);
          }
          
          resolve(row)
          
           })
          
          
          
          db.close()
          
          }
          )
          
          
            }
          function creaTabla(datos){
            console.log("Creando tabla: "+datos);
                      let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
                      let sql = 'CREATE TABLE '+datos+' ("id"	INTEGER PRIMARY KEY AUTOINCREMENT,"competencia"	TEXT NOT NULL,"pesoCompetencia"	NUMERIC NOT NULL,"criterio"	TEXT NOT NULL,"textoCriterio" TEXT NOT NULL,"pesoCriterio"	NUMERIC NOT NULL,"evaluacion1"	INTEGER,"evaluacion2" INTEGER,"evaluacion3"	INTEGER)';
                    return new Promise((resolve,reject)=>{
                      db.run(sql,[],(err,row)=>{
                    if (err){
                      resolve("no");
                      console.log(err);
                    }
                    
                    resolve(row)
                    
                     })
                    
                    
                    
                    db.close()
                    
                    }
                    )
                    
                    
                      }

            function borraTabla(tabla){
              let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
              let sql="DELETE FROM "+tabla;
              return new Promise((resolve,reject)=>{
                db.run(sql,[],(err,row)=>{
                  if (err){
                    console.log(err.message);
                    reject (err);
                  }
                  resolve (row);
                })
              })
            }
                      function dameOtras(datos){
                        //Si existen items personalizados, se grabarán en esta tabla,
              //después de borrar el anterior (si existiera)
      
                let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
                let sql = "DELETE FROM itemsVariables WHERE identidadItem==? AND alumno==? and evaluacion==?";
                let sql2 = "INSERT INTO itemsVariables (identidadItem, alumno, evaluacion,texto) VALUES(?,?,?,?)";
      return new Promise((resolve,reject)=>{
        
      db.all(sql,[datos.identidadItem,datos.alumno,datos.evaluacion],(err,row)=>{
        if (err){
          console.log(err.message)
          reject (err)
        }
      
       resolve(row)
      })
        
      }).then((row)=>{
        new Promise((resolve,reject)=>{
              
      if (datos.texto!=""){
          db.run(sql2,[datos.identidadItem,datos.alumno,datos.evaluacion,datos.texto],(err,row)=>{
        if (err){
          console.log(err.message)
          reject(err)
        }
      
        resolve(row)
        
         })
        
      }else{
        resolve(0)
      }
        
        db.close()
        
        }
        )
      })
      
            }
            function creaTabla2(datos){
              console.log("Creando tabla: "+datos);
                        let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
                        let sql=datos;                      
                        return new Promise((resolve,reject)=>{
                      
                      
                        db.run(sql,[],(err,row)=>{
                      if (err){
                        resolve("no");
                        console.log(err);
                      }
                      
                      resolve(row)
                      
                       })
                      
                      
                      
                      db.close()
                      
                      }
                      )
                      
                      
                        }
            function graba(datos){
              let db = new sqlite3.Database(fuente,sqlite3.OPEN_READWRITE);
              let sql=datos;
                return new Promise((resolve,reject)=>{
                  db.run(sql,[],(err,row)=>{
                    if (err){
                      console.log(err);
                    }
                    resolve(row);
                  })
                })
              
              db.close();

            }
            function restaura(datos) {
              let db = new sqlite3.Database(fuente, sqlite3.OPEN_READWRITE);
              let sql = 'INSERT INTO datMatriculas(ALUMNO,APELLIDOS,NOMBRE,MATRICULA,ETAPA,ANNO,TIPO,ESTUDIOS,GRUPO,REPETIDOR,FECHAMATRICULA,CENTRO,PROCEDENCIA,ESTADOMATRICULA,FECHARESMATRICULA,NUM_EXP_CENTRO,PROGRAMA_2)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
          
              return new Promise((resolve, reject) => {

          
                          datos.forEach(row => {
                              db.run(sql, [...row], (err) => {
                                  if (err) {
                                      console.log(err);
                                  }
                              });
                          });
                      
                  
          
                  db.close((err) => {
                      if (err) {
                          console.error(err.message);
                          reject(err);
                      }
                      console.log('Base de datos cerrada.');
                      resolve();
                  });
              });
          }
          

          
          
                          
module.exports={conectar,dameGrupos,dameAlumnos,dameActa,dameItems
,dameTextoItems,dameTodoTextoItems,grabaItem,borraItem,
dameOtras,borraOtras,leeItemPersonalizado,dameItemsPersonalizados,dameMaterias,
dameCrit,dameDatos,grabaProgramacion,creaTabla,borraTabla,creaTabla2,graba,restaura}