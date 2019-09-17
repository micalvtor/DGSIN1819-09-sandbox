var express= require("express");
var path =require('path');
const BASE_API = "/api/v1";
var bp=require('body-parser');
var MongoClient =require('mongodb').MongoClient;
var cors=require('cors');

const mdbURL="mongodb+srv://admin:admin1234@dgsin1819-09-eiuo0.mongodb.net/dgsin-09db?retryWrites=true";

var app=express();

app.get("/docs",(req,res)=>{
    res.redirect("https://documenter.getpostman.com/view/753444/SVSLp7pB");
});
app.get("/hello",(req,res)=>{
    res.send("hello world");
});
app.use("/", express.static(path.join(__dirname,"public")));
app.use(bp.json());
app.use(cors());

var db;
app.get(BASE_API+"/loadInitialData ", function(req,res){
    console.log("INFO: New GET request to /loadInitialData ");
    var paises=[
        {
            "nombre":"Bélgica",
            "anio": 2017,
            "US":30703539.07,
            "porcentaje":9.49
        },
        {
            "nombre":"Brasil",
            "anio": 2017,
            "US":9924754.59,
            "porcentaje":12.28
        },
        {
            "nombre":"España",
            "anio": 2017,
            "US":15566761.96,
            "porcentaje":7.05
        },
        {
            "nombre":"Estados Unidos",
            "anio": 2017,
            "US":110120235.61,
            "porcentaje":13.82	
        },
        {
            "nombre":"Francia",
            "anio": 2017,
            "US":98688797.22,
            "porcentaje":23.55	
        }
        
    ];
    res.send(paises);
});
var initialPaises=[
    {
        "nombre":"Bélgica",
        "anio": 2017,
        "US":30703539.07,
        "porcentaje":9.49
    },
    {
        "nombre":"Brasil",
        "anio": 2017,
        "US":9924754.59,
        "porcentaje":12.28
    },
    {
        "nombre":"España",
        "anio": 2017,
        "US":15566761.96,
        "porcentaje":7.05
    },
    {
        "nombre":"Estados Unidos",
        "anio": 2017,
        "US":110120235.61,
        "porcentaje":13.82	
    },
    {
        "nombre":"Francia",
        "anio": 2017,
        "US":98688797.22,
        "porcentaje":23.55	
    }
];
MongoClient.connect(mdbURL, (err, client) => {
    if (err) {
        console.error("DB connection error: " + err);
        process.exit(1);
    } else {
        db = client.db("dgsin-09db").collection("contacts");
        db.find({}).toArray((err, paises) => {
            if (err) {
                console.error("Error getting data from DB: " + err);
            } else if (paises.length == 0) {
                /*
                console.info("Adding initial paises to empty DB");
                db.insert(initialPaises);
                */
               $http
               .get("/api/v1/loadInitialData")
               .then(function(response){
                db.insert(response.data);
                });
            } else {
                console.info("Connected to the DB with " + paises.length + " paises");
            }
        });

        var paisesAPI=require("./paisesAPI");

        paisesAPI.register(app,db);

        app.listen(process.env.PORT || 8080,()=>{
            console.log("Server ready");
        }).on("error",(e)=>{
            console.error("Server NOT ready!");
        });
    }
});

app.get(BASE_API +"/exportaciones", (req,res)=>{
    console.info("New GET request to /exportaciones");
res.send(initialPaises);
});

app.post(BASE_API+"/exportaciones",(req,res) =>{
    var nuevoPais=req.body;
    if(!nuevoPais){
        console.warn("New POST request to /exportaciones/, sending 400...");
        res.sendStatus(400);
    }else{
        console.info("New POST request to /exportaciones with body"+JSON.stringify(nuevoPais));
        if(!nuevoPais.nombre||  !nuevoPais.US|| !nuevoPais.porcentaje){
            console.warn("New pais"+JSON.stringify(nuevoPais)+"is not well-formed, sending 422...");
            res.sendStatus(422);
        }else{
            initialPaises.push(nuevoPais);
            res.sendStatus(201);
        }
    }
});

app.delete(BASE_API+"/exportaciones",(req,res) =>{
    console.info("New DELETE request to /paises");
    
            var numPaises=initialPaises.length;
            if(numPaises==0){
                console.warn("No hay paises que borrar");
                res.sendStatus(404);
            }else{
                console.info("Todos los paises ("+numPaises+") han sido exitosamente borrados");
                initialPaises=new Array();;
                res.sendStatus(204);
            }
   
});
app.put(BASE_API+"/exportaciones",(req,res) =>{
        
        console.warn("New PUT request to /exportaciones, sending 405...");
        res.sendStatus(405);
        });
app.get(BASE_API+"/exportaciones/:nombre",(req,res) =>{
    var nombre=req.params.nombre;
    if(!nombre){
        console.warn("New GET request to /exportaciones/:nombre, sending 400...");
        res.sendStatus(400);
    }else{
        console.info("New GET request to /exportaciones/"+nombre);
        var paisesFiltrados=initialPaises.filter((c)=>{
if(c.nombre==nombre){
return c;
}
});
if(paisesFiltrados.length>0){
res.send(paisesFiltrados[0]);
}else{
    console.warn("No hay países con el nombre: "+nombre);
    res.sendStatus(404);
}
}
});
app.post(BASE_API+"/exportaciones",(req,res) =>{
    var nombre=req.params.nombre;
    console.warn("New POST request to /exportaciones/"+nombre+", sending 405...");
                res.sendStatus(405);
});

app.delete(BASE_API+"/exportaciones/:nombre",(req,res) =>{
    var nombre=req.params.nombre;
    if(!nombre){
console.warn("New DELETE to exoprtaciones/:nombre without nombre, sending 400...");
res.sendStatus(400);
    }else{
var hay=false;
initialPaises=initialPaises.filter((c)=>{
    if(c.nombre!=nombre){
return c;
    }else{
        hay=true;
    }
});
if(hay){
console.info("El país con nombre "+nombre+" ha sido borrado de la lista");
res.sendStatus(204);
}else{
    console.warn("No hay países para borrar");
    res.sendStatus(404);
}
    }
});
app.put(BASE_API+"/exportaciones/:nombre",(req,res) =>{
var nombre =req.params.nombre;
var paisActualizado=req.body;
if(!nombre){
    console.warn("New PUT request to /exportaciones/:nombre without nombre, sending 400...");
    res.sendStatus(400);
}else if(!paisActualizado){
    console.warn("New PUT request to /exportaciones/:nombre without pais, sending 400...");
    res.sendStatus(400);
}else{
    console.info("New GET request to /exportaciones/"+nombre+"with data"+JSON.stringify(paisActualizado));
    if(!paisActualizado.nombre|| !paisActualizado.anio|| !paisActualizado.US|| !paisActualizado.porcentaje){
        console.warn("New pais"+JSON.stringify(paisActualizado)+"is not well-formed, sending 422...");
        res.sendStatus(422);
        
    }else{
        var hay=false;
        initialPaises=initialPaises.map((c) =>{
            if(c.nombre===nombre){
                hay=true;
                return paisActualizado;
            }else{
                return c;
            }
            });
            if(hay){
                res.send(paisActualizado);
            }else{
                console.warn("There are no paises with nombre:"+nombre);
                res.sendStatus(404);
            }
            
        }
    }
});

var request=require('request');
var apiServerHost="http://dgsin1819-09.herokuapp.com";

app.use("/proxyXX", (req,res)=>{
var url=apiServerHost+req.url;
console.log("piped: "+req.baseUrl +req.url);
req.pipe(request(url)).pipe(res);
});

const BASE_API_PATH="/api/v1";

app.get(BASE_API_PATH+"/data", function(req,res){
    console.log("INFO: New GET request to /data");
    res.send([1,2,34,23,12,6,9,29]);
});

app.get(BASE_API_PATH+"/paises", function(req,res){
    console.log("INFO: New GET request to /paises");
    var paises=[
        
        
        {
            "nombre":"España",
            "anio": 2010,
            "US":15566761.96,
            "porcentaje":7.05
        },
        {
            "nombre":"España",
            "anio": 2011,
            "US":1123468.96,
            "porcentaje":12.05
        },
        {
            "nombre":"España",
            "anio": 2012,
            "US":1333567.96,
            "porcentaje":8.68
        },
        {
            "nombre":"España",
            "anio": 2013,
            "US":15566761.96,
            "porcentaje":23.54
        },
        {
            "nombre":"España",
            "anio": 2014,
            "US":13466761.96,
            "porcentaje":9.09
        },
        {
            "nombre":"España",
            "anio": 2015,
            "US":12346761.96,
            "porcentaje":10.05
        },
        
    ];
    res.send(paises);
});