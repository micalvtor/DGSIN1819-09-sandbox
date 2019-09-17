function formatPaises(paises){
    return paises.map((pais)=>{
        delete pais._id;
        return pais;
    });
    }
    const BASE_API = "/api/v1";

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
module.exports.register=function(app,db){
    
app.get(BASE_API + "/exportaciones", (req, res) => {
    console.info("New GET request to /exportaciones");
    db.find({}).toArray((err, paises) => {
        if (err) {
            console.error("Error getting data from DB: " + err);
            res.sendStatus(500);
        } else {
            var formattedPaises= formatPaises(paises);
            console.debug("Sending exportaciones: " + JSON.stringify(formattedPaises, null, 2));
            res.send(formattedPaises);
        }
    });
});

// POST over a collection
app.post(BASE_API + "/exportaciones", (req, res) => {
    var newPais = req.body;
    if (!newPais) {
        console.warn("New POST request to /exportaciones/ without pais, sending 400...");
        res.sendStatus(400); //bad request
    } else {
        console.info("New POST request to /exportaciones with body: " + JSON.stringify(newPais, null, 2));
        if (!newPais.nombre || !newPais.anio || !newPais.US || !newPais.porcentaje) {
            console.warn("The pais " + JSON.stringify(newPais, null, 2) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        } else {
            db.find({ "nombre": newPais.nombre }).toArray((err, paises) => {
                if (err) {
                    console.error("Error getting data from DB: " + err);
                    res.sendStatus(500);
                } else {
                    if (paises.length > 0) {
                        console.warn("The pais " + JSON.stringify(newPais, null, 2) + " already exists, sending 409...");
                        res.sendStatus(409); // conflict
                    } else {
                        console.debug("Adding pais " + JSON.stringify(newPais, null, 2));
                        db.insert(newPais);
                        res.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

// DELETE over a collection
app.delete(BASE_API + "/exportaciones", (req, res) => {
    console.info("New DELETE request to /exportaciones");
    db.remove({}, { multi: true }, (err, result) => {
        if (err) {
            console.error('Error removing data from DB');
            res.sendStatus(500); // internal server error
        } else {
            var numRemoved = result.result.n;
            if (numRemoved === 0) {
                console.warn("There are no paises to delete");
                res.sendStatus(404); // not found
            } else {
                console.debug("All the paises (" + numRemoved + ") have been succesfully deleted, sending 204...");
                res.sendStatus(204); // no content
            }
        }
    });
});

// PUT over a collection
app.put(BASE_API + "/exportaciones", (req, res) => {
    console.warn("New PUT request to /exportaciones, sending 405...");
    res.sendStatus(405); // method not allowed
});

// GET a specific resource
app.get(BASE_API + "/exportaciones/:nombre", (req, res) => {
    var nombre = req.params.nombre;
    if (!nombre) {
        console.warn("New GET request to /exportaciones/:nombre without nombre, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New GET request to /exportaciones/" + nombre);
        db.find({ "nombre": nombre }).toArray((err, paisesFiltrados) => {
            if (err) {
                console.error('Error getting data from DB');
                res.sendStatus(500); // internal server error
            } else {
                if (paisesFiltrados.length > 0) {
                    var pais = formatPaises(paisesFiltrados)[0]; //since we expect to have exactly ONE pais with this nombre
                    console.debug("Sending exportaciones: " + JSON.stringify(pais, null, 2));
                    res.send(pais);
                } else {
                    console.warn("There are not any pais with nombre " + nombre);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});

app.get(BASE_API + "/exportaciones/:anio", (req, res) => {
    var anio = req.params.anio;
    if (!anio) {
        console.warn("New GET request to /exportaciones/:anio without anio, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New GET request to /exportaciones/" + anio);
        db.find({ "anio": anio }).toArray((err, paisesFiltrados) => {
            if (err) {
                console.error('Error getting data from DB');
                res.sendStatus(500); // internal server error
            } else {
                if (paisesFiltrados.length > 0) {
                    var pais = formatPaises(paisesFiltrados)[0]; //since we expect to have exactly ONE pais with this anio
                    console.debug("Sending exportaciones: " + JSON.stringify(pais, null, 2));
                    res.send(pais);
                } else {
                    console.warn("There are not any pais with anio " + anio);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});

app.get(BASE_API + "/exportaciones/:US", (req, res) => {
    var US = req.params.US;
    if (!US) {
        console.warn("New GET request to /exportaciones/:US without US, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New GET request to /exportaciones/" + US);
        db.find({ "US": US }).toArray((err, paisesFiltrados) => {
            if (err) {
                console.error('Error getting data from DB');
                res.sendStatus(500); // internal server error
            } else {
                if (paisesFiltrados.length > 0) {
                    var pais = formatPaises(paisesFiltrados)[0]; //since we expect to have exactly ONE pais with this US
                    console.debug("Sending exportaciones: " + JSON.stringify(pais, null, 2));
                    res.send(pais);
                } else {
                    console.warn("There are not any pais with US " + US);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});

app.get(BASE_API + "/exportaciones/:porcentaje", (req, res) => {
    var porcentaje = req.params.porcentaje;
    if (!porcentaje) {
        console.warn("New GET request to /exportaciones/:porcentaje without porcentaje, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New GET request to /exportaciones/" + porcentaje);
        db.find({ "porcentaje": porcentaje }).toArray((err, paisesFiltrados) => {
            if (err) {
                console.error('Error getting data from DB');
                res.sendStatus(500); // internal server error
            } else {
                if (paisesFiltrados.length > 0) {
                    var pais = formatPaises(paisesFiltrados)[0]; //since we expect to have exactly ONE pais with this porcentaje
                    console.debug("Sending exportaciones: " + JSON.stringify(pais, null, 2));
                    res.send(pais);
                } else {
                    console.warn("There are not any pais with porcentaje " + porcentaje);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});
// POST a specific resource
app.post(BASE_API + "/exportaciones/:nombre", (req, res) => {
    var nombre = req.params.nombre;
    console.warn("New POST request to /exportaciones/" + nombre + ", sending 405...");
    res.sendStatus(405); // method not allowed
});

app.post(BASE_API + "/exportaciones/:anio", (req, res) => {
    var anio = req.params.anio;
    console.warn("New POST request to /exportaciones/" + anio + ", sending 405...");
    res.sendStatus(405); // method not allowed
});

app.post(BASE_API + "/exportaciones/:US", (req, res) => {
    var US = req.params.US;
    console.warn("New POST request to /exportaciones/" + US + ", sending 405...");
    res.sendStatus(405); // method not allowed
});

app.post(BASE_API + "/exportaciones/:porcentaje", (req, res) => {
    var porcentaje = req.params.porcentaje;
    console.warn("New POST request to /exportaciones/" + porcentaje + ", sending 405...");
    res.sendStatus(405); // method not allowed
});
// DELETE a specific resource
app.delete(BASE_API + "/exportaciones/:nombre", (req, res) => {
    var nombre = req.params.nombre;
    if (!nombre) {
        console.warn("New DELETE request to /exportaciones/:nombre without nombre, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New DELETE request to /exportaciones/" + nombre);
        db.remove({ nombre: nombre }, {}, function (err, result) {
            if (err) {
                console.error('Error removing data from DB');
                res.sendStatus(500); // internal server error
            } else {
                var numRemoved = result.result.n;
                console.debug("exportaciones removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.debug("The pais with nombre " + nombre + " has been succesfully deleted, sending 204...");
                    res.sendStatus(204); // no content
                } else {
                    console.warn("There are no exportaciones to delete");
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});

// PUT over a specific resource
app.put(BASE_API + "/exportaciones/:nombre", (req, res) => {
    var nombre = req.params.nombre;
    var updatedPais = req.body;
    if (!nombre) {
        console.warn("New PUT request to /exportaciones/:nombre without nombre, sending 400...");
        res.sendStatus(400); // bad request
    } else if (!updatedPais) {
        console.warn("New PUT request to /exportaciones/ without pais, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New PUT request to /exportaciones/" + nombre + " with data " + JSON.stringify(updatedPais, null, 2));
        if (!updatedPais.nombre || !updatedPais.anio || !updatedPais.US|| !updatedPais.porcentaje) {
            console.warn("The pais " + JSON.stringify(updatedPais, null, 2) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        } else {
            db.find({ "nombre": nombre }).toArray((err, paises) => {
                if (err) {
                    console.error('Error getting data from DB');
                    res.sendStatus(500); // internal server error
                } else {
                    if (paises.length > 0) {
                        db.update({ nombre: nombre }, updatedPais);
                        console.debug("Modifying pais with nombre " + nombre + " with data " + JSON.stringify(updatedPais, null, 2));
                        res.send(updatedPais); // return the updated pais
                    } else {
                        console.warn("There are not any pais with nombre " + nombre);
                        res.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});
}