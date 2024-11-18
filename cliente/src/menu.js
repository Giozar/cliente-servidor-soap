const express = require('express');
const soap = require('soap');

const app = express();
const PORT = 3000;

const host_api = process.env.HOST_API || 'http://localhost:4000';
const url = `${host_api}/calculator?wsdl`;

app.use(express.static('public'));
app.use(express.json());

app.post('/calculadora', (req, res) => {
    const { intA, intB, operation } = req.body;

    const requestArgs = {
        intA: parseInt(intA, 10),
        intB: parseInt(intB, 10)
    };

    soap.createClient(url, (err, client) => {
        if (err) return res.status(500).json({ message: 'Error al crear el cliente SOAP' });

        client[operation](requestArgs, (err, result) => {
            if (err) {
                res.json({ message: `Error en la operación ${operation}: ${err.message}` });
            } else {

                if(result == null) {
                    res.json({ message: `No se puede dividir entre cero` });
                    return;
                }
                const resultKey = `${operation}Result`;
                res.json({ message: `Resultado de la operación ${operation}: ${result[resultKey]}` });
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
