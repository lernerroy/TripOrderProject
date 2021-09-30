const cds = require ('@sap/cds')

cds.on('bootstrap', async app => {
  if (cds.env.for('cds').requires.multitenancy) {
    await cds.mtx.in(app)
  } 
});  


 // Delegate bootstrapping to built-in server.js
 module.exports = cds.server

