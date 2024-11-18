const soap = require('soap');
const express = require('express');
const fs = require('fs');       
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

const service = {
    CalculatorService: {
        CalculatorPort: {
            Add: function (args, callback) {
                const intA = args.intA;
                const intB = args.intB;
                const result = intA + intB;
                callback(null, { AddResult: result });
            },
            Pot: function (args, callback) {
                const intA = args.intA;
                const intB = args.intB;
                const result = Math.pow(intA, intB);
                callback(null, { PotResult: result });
            },
            Mult: function(args, callback) {
                const intA = args.intA;
                const intB = args.intB;
                const result = intA * intB;
                callback(null, { MultResult: result });
            },
            Div: function(args, callback) {
                const intA = args.intA;
                const intB = args.intB;
                if (intB === 0) {
                    callback(new Error("No se puede realizar la división por cero"));
                } else {
                    const result = intA / intB;
                    callback(null, { DivResult: result });
                }
            }
        }
    }
};

// Variable de entorno con URL del servicio
const host_api = process.env.HOST_API || 'http://localhost:4000';

// Rutas de los archivos WSDL
const wsdlPath = path.join(__dirname, 'plantilla.wsdl');
const wsdlOutputPath = path.join(__dirname, 'requerimientos.wsdl');

// Leer y generar WSDL dinámico
fs.readFile(wsdlPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error leyendo la plantilla WSDL:', err);
        return;
    }
    
    const updatedWsdl = data.replace('{{HOST_API}}', host_api);
    
    fs.writeFile(wsdlOutputPath, updatedWsdl, (err) => {
        if (err) {
            console.error('Error generando el WSDL dinámico:', err);
        } else {
            console.log('WSDL generado correctamente en', wsdlOutputPath);

            // Leer el archivo WSDL y levantar el servidor SOAP
            const wsdl = fs.readFileSync(wsdlOutputPath, 'utf8');
            
            app.listen(PORT, () => {
                soap.listen(app, '/calculator', service, wsdl);
                console.log(`Servicio SOAP corriendo en ${host_api}/calculator`);
            });
        }
    });
});
