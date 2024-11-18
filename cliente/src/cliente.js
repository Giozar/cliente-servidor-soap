const soap = require('soap');

// Cambiar dirección IP por la de la máquina que corre el servidor
const host_api = process.env.HOST_API || 'http://localhost:4000';
const url = `${host_api}/calculator?wsdl`;

const requestArgs = {
    intA: 10,
    intB: 2
};

soap.createClient(url, (err, client) => {
    if (err) throw err;

    client.Add(requestArgs, (err, result) => {
        if (err) throw err;
        console.log('Resultado de la suma:', result.AddResult);
    });
    client.Pot(requestArgs, (err, result) => {
        if (err) throw err;
        console.log('Resultado de la Potencia:', result.PotResult);
    });
    client.Mult(requestArgs, (err, result) => {
        if (err) throw err;
        console.log('Resultado de la multiplicación:', result.MultResult);
    });
    client.Div(requestArgs, (err, result) => {
        if (err) throw err;
        if(result === null) {
            console.log('No se puede dividir entre cero');
            return
        }
        console.log('Resultado de la división:', result.DivResult);
    });
});