const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const xml2js = require("xml2js");


const registroDeVehiculos = [];

app.use(cors());


app.get("/status", (req, res) => {

    const clientsha = req.query.client_sha;

    if (clientsha == null) return res.sendStatus(400);
    if (clientsha != '95dff4c2f575b1ad6035bfb47798cac6') return res.sendStatus(401);

    return res.json({ unidades: registroDeVehiculos });
});

app.post("/evento-cms", bodyParser.text({ type: "*/*" }), async (req, res) => {
    console.log(req.headers);

    try {
        const resultado = await xml2js.parseStringPromise(req.body);
        const envelope = resultado['soapenv:Envelope'];
        const body = envelope['soapenv:Body'];
        if (Array.isArray(body) && body.length > 0) {
            const telemetrylist = body[0]['web:storeTelemetryList'];
            const telemetryWithDetails = telemetrylist[0]['telemetryWithDetails'];
            const telemetry = telemetryWithDetails[0]['telemetry'][0];
            const telemetryDetails = telemetryWithDetails[0]['telemetryDetails'];

            const nuevoRegistroDeVehiculo = {};

            nuevoRegistroDeVehiculo.gpsID = telemetry.gpsCode[0];
            nuevoRegistroDeVehiculo.date = telemetry.date[0];
            nuevoRegistroDeVehiculo.speed = Number(telemetry.speed[0]);
            nuevoRegistroDeVehiculo.lat = Number(telemetry.coordY[0]);
            nuevoRegistroDeVehiculo.lon = Number(telemetry.coordX[0]);

            for (const detalle of telemetryDetails) {
                if (detalle.sensorCode[0] == 'ign') {
                    nuevoRegistroDeVehiculo.ign = Number(detalle.value[0]);
                    break;
                }
            }

            if (registroDeVehiculos.includes((el) => el.gpsID === nuevoRegistroDeVehiculo.gpsID)) {
                registroDeVehiculos = registroDeVehiculos.filter((el) => el.gpsID != nuevoRegistroDeVehiculo.gpsID);
                registroDeVehiculos.push(nuevoRegistroDeVehiculo);
            } else {
                registroDeVehiculos.push(nuevoRegistroDeVehiculo);
            }
            console.log(nuevoRegistroDeVehiculo);
        }

    } catch (error) {
        console.log(error);
    }


    return res.sendStatus(200);
});


const port = 3000;
app.listen(port, () => {
    console.log("Servidor corriendo: " + port);
});