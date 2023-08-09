const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());


app.get("/",(req,res)=>{
    return res.send("Hola");
});

app.post("/evento-cms", (req, res) => {
    console.log(req.body);
    return res.sendStatus(200);
});


const port = 3000;
app.listen(port, () => {
    console.log("Servidor corriendo: " + port);
});