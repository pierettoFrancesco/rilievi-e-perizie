import _http from "http";
import _url from "url";
import _fs from "fs";
import _express from "express";
import _dotenv from "dotenv";
import _cors from "cors";
//import _nodemailer from "nodemailer";
import _https from "https";
import _bcryptjs from "bcryptjs";
import _jwt from "jsonwebtoken";
const _nodemailer = require("nodemailer");
import { google } from "googleapis";

//letture Environment
_dotenv.config({"path":".env"});

//Variabili relative a Mongo
import {MongoClient, ObjectId} from "mongodb";
import { env } from "process";
const DBNAME = process.env.DBNAME;
const app = _express();
const connectionString= process.env.connectionStringAtlas;
//Variabili generiche
const HTTPS_PORT:number = parseInt(process.env.PORT);
let paginaErrore;


// Il parametro [ipAddress] consente di mettere il server su una delle interfacce della macchina,
// se non viene specificato su tutte le interfacce

//SERVER HTTPS occorre passare le chiavi RSA (private e public)
const privateKey = _fs.readFileSync('./keys/privateKey.pem', 'utf8');
const certificate = _fs.readFileSync('./keys/certificate.crt', 'utf8');
const ENCRYPTION_KEY = _fs.readFileSync('./keys/encryptionKey.txt', 'utf8')
const credentials = { key: privateKey, cert: certificate };
const https_server = _https.createServer(credentials, app);

https_server.listen(HTTPS_PORT, () => {
    init();
    console.log(`Il Server HTTPS è in ascolto sulla porta ${HTTPS_PORT}`);
});

function init(){
    /*_fs.readFile("./static/error.html",function(err,data){
        if(err){
            paginaErrore = "<h1>Risorsa non trovata</h1>";
        }
        else{
            paginaErrore=data.toString();
        }
    });*/
}
//********************************************************************************/
// Routes middleware
//********************************************************************************/

//1. Request log
app.use("/", (req:any, res:any, next:any) => {
    console.log("-----> "+req.method +": "+ req.originalUrl);
    next();
});

//2. Gestione delle risorse statiche
// .static() è un metodo express che ha già implementata la firma di sopra. Se trova il file fa la send() altrimenti la next()
app.use("/", _express.static("./static"));

//3. Lettura dei parametri Body
//Intercetta solo quelli in formato JSON
app.use("/",_express.json({"limit":"50mb"})); 
//Intercetta solo quelli in formato URL ENCODED
app.use("/",_express.urlencoded({"limit":"50mb","extended":true})); 

//4. Stampa dei parametri GET,BODY
app.use("/", (req:any, res:any, next:any) => {
    if(Object.keys(req["query"]).length>0)
        console.log("      "+JSON.stringify(req["query"]));
    if(Object.keys(req["body"]).length > 0)
        console.log("      "+JSON.stringify(req["body"]));
    next();
});

//5 CORS (Controllo degli accessi)
/*const whitelist = [
    "http://pierettofrancesco-crudserver.onrender.com", //render
    "https://pierettofrancesco-crudserver.onrender.com", // porta 443 (default)
    "http://localhost:3000",
    "https://localhost:3001",
    "http://localhost:4200" // server angular
   ];

const corsOptions = {
    origin: function(origin, callback) {
    if (!origin) // browser direct call
    return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
    var msg = `The CORS policy for this site does not
    allow access from the specified Origin.`
    return callback(new Error(msg), false);
    }
    else
    return callback(null, true);
    },
    credentials: true
};
app.use("/", _cors(corsOptions));*/

// Tramite questa procedura si accettano tutti
const corsOptions = {
    origin: function(origin, callback) {
        return callback(null, true);
    },
    credentials: true
};
app.use("/", _cors(corsOptions));


//********************************************************************************/
//Configurazione nodemailer
//********************************************************************************/
/*const auth = {
    "user" : process.env.gmailUser,
    "pass" : process.env.gmailPassword,
    }
const transporter = _nodemailer.createTransport({
    "service": "gmail",
    "auth": auth
});
let message = _fs.readFileSync("./message.html","utf8");*/

const o_Auth2= JSON.parse(process.env.oAuthCredential as any)
const OAuth2 = google.auth.OAuth2; // Oggetto OAuth2
const OAuth2Client = new OAuth2(
 o_Auth2["client_id"],
 o_Auth2["client_secret"]
);
OAuth2Client.setCredentials({
 refresh_token:o_Auth2.refresh_token,
});
let message = _fs.readFileSync("./message.html","utf8");


//********************************************************************************/
// Login

app.post("/api/login", async (req:any, res:any) => {
    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;
    const client = new MongoClient(connectionString);   
    await client.connect();
    const collection = client.db(DBNAME).collection("utenti");
    let regex = new RegExp("^"+username+"$", "i");
    let rq = collection.findOne({"username":regex, "admin" : admin}, {"projection" : {"username":1, "password":1}});
    rq.then((dbUser:any)=>{
        console.log(dbUser);
        if(!dbUser){
            res.status(401).send("Credenziali non valide");
        }
        else{
            _bcryptjs.compare(password, dbUser.password, (err:any, success:any)=>{
                if(err)
                    res.status(500).send("Bcrypt error "+ err.message);
                else{
                    if(!success){
                        res.status(401).send("Password non valida");
                    }
                    else{
                        let token = creaToken(dbUser);
                        res.setHeader("authorization",token)
                        //Fa si che venga restituita al client
                        res.setHeader("access-control-expose-headers","authorization")
                        res.send({"ris": "ok"})
                    }
                }
            })
        }
    })
    rq.catch((err:any)=>{
        res.status(500).send("errore esecuzione query "+ err.message)
    })
    rq.finally(()=>{
        client.close();
    })
})

function creaToken(data){
    let currentDate = Math.floor(new Date().getTime() / 1000); //Math.floor() tronca al numero più basso
    let payload ={
        "_id" : data["_id"],
        "username" : data["username"],
        //se non esiste data.iat allora mette la data attuale altrementi mette data.iat (Assegna prima varibiale non nulla)
        "iat" : data.iat || currentDate,
        "exp" : currentDate + parseInt(process.env.durataToken)
    }
    let token = _jwt.sign(payload, ENCRYPTION_KEY)
    console.log(token);
    return(token);


}

/*********************************************************************************/
// Controllo token di google
app.post("/api/googleLogin", async(req:any, res:any, next:any) => {
    if(!req.headers["authorization"]){
        res.status(403).send("Token mancante");
    }
    else{
        let token = req.headers["authorization"];
        //Semplice decodifica del token ottenendo il payload in Base64
        let payload = _jwt.decode(token);
        let username = payload["email"];
        const client = new MongoClient(connectionString);
        await client.connect();
        const collection = client.db(DBNAME).collection("mail");
        let regex = new RegExp("^"+username+"$", "i");
        let rq = collection.findOne({"username":regex}, {"projection" : {"username":1}});
        rq.then((dbUser)=>{
            if(!dbUser){
                res.status(403).send("Utente non autorizzato all'accesso");
            }
            else{
                let token = creaToken(dbUser);
                console.log(token);
                res.setHeader("authorization",token)
                //Fa si che venga restituita al client
                res.setHeader("access-control-expose-headers","authorization")
                res.send({"ris": "ok"})
            }
        })
    }
})

/*********************************************************************************/
// Verifica token
app.use("/api/",(req:any, res:any, next:any)=>{
    if(!req["body"]["skipCheckToken"]){
        if(!req.headers["authorization"]){
            res.status(403).send("Token mancante");
        }
        else{
            let token = req.headers["authorization"];
           _jwt.verify(token, ENCRYPTION_KEY, (err,payload)=>{
                console.log(err + "err\n" + payload + "payload");
                if(err){
                    res.status(403).send("Token corrotto "+ err);
                }
                else{
                    let newToken = creaToken(payload);
                    console.log(newToken);
                    res.setHeader("authorization",newToken)
                    //Fa si che venga restituita al client
                    res.setHeader("access-control-expose-headers","authorization")
                    req["payload"] = payload;
                    next();
                }
            }) 
        }
    }
    else{
        next();
    }
    
})




//********************************************************************************/
// Routes utente
//********************************************************************************/

/*app.use("/", (req:any, res:any, next:any) => {
    res.send("Richiesta ricevuta correttamente");
});*/

app.get("/api/elencoMail", async(req:any, res:any) => {
    let username = req["payload"]["username"];
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(DBNAME).collection("mail");
    let rq = collection.findOne({"username": username}, {"projection" : {"mail":1}});
    rq.then((data)=>{
        res.send(data);
    })
    rq.catch((err)=>{
        res.status(500).send("Errore esecuzione query "+ err.message);
    })
    rq.finally(()=>{
        client.close();
    })
});

app.post("/api/newMail", async(req:any, res:any, next:any) => {
    let mittente = req["payload"]["username"];
    let mail = req.body.mail;
    mail["from"] = mittente;
    let destinatario = mail.to;
    delete mail.to;
    console.log(mail);
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(DBNAME).collection("mail");
    let rq = collection.updateOne({"username": destinatario}, {"$push": {"mail": mail}});
    rq.then((data)=>{
        res.send({"ris" : "ok"});
    })
    rq.catch((err)=>{
        res.status(500).send("Errore invio mail ");
    })
    rq.finally(()=>{
        client.close();
    })
    

})

app.post("/api/recuperaPwd", async(req:any, res:any, next:any) => {
    let username = "f.pieretto.2292@vallauri.edu";
    message = message.replace("__user", username).replace("__password", "password");

    const accessToken = await OAuth2Client.getAccessToken().catch((err) => res.status(500).send("Errore richiesta access token a Google " + err)); //restituisce una promise
    console.log(accessToken);
    
    const auth = {
        "type":"OAuth2",
        "user":username, 
        "clientId":o_Auth2.client_id,
        "clientSecret":o_Auth2.client_secret,
        "refreshToken":o_Auth2.refresh_token,
        "accessToken":accessToken
    }
    const transporter = _nodemailer.createTransport({
        "service": "gmail",
        "auth": auth,
        "tls": {
            "rejectUnauthorized": false
        }
    });
    let mailOptions ={
        "from": auth.user, 
        "to":username,
        "subject": "Nuova password di accesso",
        //"html": req.body.message
        "html": message,
        "attachments": [{
            "filename": "qrCode.png",
            "path":"./qrCode.png"
        }]
    }
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            res.status(500).send("Errore invio mail:\n"+err.message);
        }
        else{
            res.send("Ok") //ci vuole un JSON, ma stringa e' JSON valido
        }
    });
})




/******************************************************************* */
//Default Route e gestione degli errori
/******************************************************************* */

app.use("/", (req:any, res:any, next:any) => {
    res.status(404);
    if(req.originalUrl.startsWith("/api/"))
        res.send("api non disponibile");
    else
        res.send(paginaErrore);
});

app.use("/",(err,req,res,next)=>{
    console.log("********** SERVER ERROR **********\n",err.stack);
    res.status(500).send(err.message);
})

