const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const xml2js = require("xml2js");

app.use(cors());


app.get("/", (req, res) => {
    return res.send("Hola");
});

app.post("/evento-cms", bodyParser.text({type:"*/*"}) , async(req, res) => {
    console.log(req.headers);

    try {
        const resultado = await xml2js.parseStringPromise(req.body);
        console.log(resultado);
        
    } catch (error) {
        console.log(error);
    }


    return res.sendStatus(200);
});


const port = 3000;
app.listen(port, () => {
    console.log("Servidor corriendo: " + port);
});