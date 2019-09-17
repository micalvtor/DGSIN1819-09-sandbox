Recurso base:
.../api/v1/exportaciones

Ejemplo de un dato:
{ "pais": "España", anio: 2017, "US" : 124325676.89 , "porcentaje" : 12.89 }
Acceder a todas las estadísticas:
Petición:
GET.../exportaciones
Respuesta:
[ { "pais": "España", anio: 2017, "US" : 124325676.89 , "porcentaje" : 12.89 },
  {  "pais": "Francia", anio: 2017, "US" : 334325676.89 , "porcentaje" : 9.14 },
    ... ]
    Acceder a todas las estadísticas de sevilla:
    Petición:
    GET.../exportaciones/España
    Respuesta:
    [ { "pais": "España", anio: 2017, "US" : 124325676.89 , "porcentaje" : 12.89 },
      { "pais": "España", anio: 2016, "US" : 16339676.89 , "porcentaje" : 14.19 },
        ... ]
        Acceder a una estadística concreta:
        Petición:
        GET .../exportaciones/España/2016
        Respuesta:{ "pais": "España", anio: 2016, "US" : 16339676.89 , "porcentaje" : 14.19 },
       
          Crear una nueva estadística:
          Petición:
          POST .../exportaciones/
          { "pais": "España", anio: 2017, "US" : 124325676.89 , "porcentaje" : 12.89 },
          Respuesta:
          201 CREATED
          Actualizar una estadística:
          Petición:PUT.../exportaciones/España/2017
          { "pais": "España", anio: 2017, "US" : 124325676.89 , "porcentaje" : 13.89 },
