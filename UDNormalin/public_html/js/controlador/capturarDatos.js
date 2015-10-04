//algoritmo = "";

txtAtributos = "";
txtDependencias = "";
/*
 * Procesa archivo json con los siguientes datos
 * Atributos y dependencias funcionales
 * @param {file} archivo JSON
 */
function leerArchivo(file) {
    var file = file[0];
    document.getElementById('archivo').value = 'S';
    var reader = new FileReader();

    reader.onload = function (e) {
        // Cuando éste evento se dispara, los datos están ya disponibles.
        // Se trata de copiarlos a una área <div> en la página.
        var output = document.getElementById("fileOutput");
        output.textContent = e.target.result;


    };
    reader.readAsText(file);

}

/**
 * 
 * @param {type} pAtributo Atributo a evaluar
 * @param {type} pUniverso Universo de atributos
 * @returns {Number} Retorna -1 si el valor no se encuentra
 * en el universo de atributos 
 */
function validarDependencia(pAtributo, pUniverso) {
    var i = pUniverso.length;
    while ( i-- ){
        if (pAtributo === pUniverso[i].nombre) {
            return i;
        }
    }
    return -1;

}

/**
 * Lee archivo JSON y obtiene el universo de atributos
 * y la dependencias funcionales
 * @returns {undefined}
 */
function procesarArchivo() {
    try {
        divFile = document.getElementById('fileOutput');
        datosArchivo = divFile.textContent;
        valorJson = JSON.parse(datosArchivo);
        for (var i = 0; i < valorJson.length; i++) {
            //La segunda posicion corresponde a los atributos
            if (i === 0) {
                txtAtributos = valorJson[i].atributos;
            } else {
                txtDependencias = valorJson[i].dependenciasFuncionales;
            }
        }
    } catch (err) {
        console.log('Por favor valide el formato del archivo ' + err);
    }
}

/**
 * Valida y ajustas los datos obtenidos para realizar
 * procesados para realizar el calculo correspondiente de 
 * cada algoritmo 
 * @returns {undefined}
 */
function calcular() {
    txtAtributos = "";
    txtDependencias = "";

    var esArchivo = document.getElementById('archivo').value;
    if (esArchivo === 'S') {
        procesarArchivo();
    } else {
        var txtEntrada = document.getElementById('txt_entrada').value;
        txtEntrada = txtEntrada.replace(" ", "");
        auxPosicion1 = txtEntrada.indexOf("{") + 1;
        auxPosicion2 = txtEntrada.indexOf("}");
        txtAtributos = txtEntrada.substring(auxPosicion1, auxPosicion2);
        auxPosicion3 = txtEntrada.indexOf(")") - 1;
        txtDependencias = txtEntrada.substring(auxPosicion2 + 3, auxPosicion3);
    }
    //objetos de atributo
    var arrAtrb = txtAtributos.split(",");
    var atributos = new Array();
    var i = arrAtrb.length;
    while (i--) {
        var atributo = new Atributo(arrAtrb[i]);
        atributos.push(atributo);
    }
    //Objetos de dependencias
    var arrDep = txtDependencias.split(";");
    var dependenciasFuncionales = [];
    for (var j = 0; j < arrDep.length; j++) {

        var auxDependencia = arrDep[j].split("->");

        var auxImplicado = auxDependencia[0].split(',');
        var auxImplicante = auxDependencia[1].split(',');

  
        //Valida los implicados
        var arregloImplicado = [];
        var arregloImplicante = [];
        for (var k = 0; k < auxImplicado.length; k++) {
            var indiceImplicado = validarDependencia(auxImplicado[k], atributos);
            if (indiceImplicado < 0) {
                alert(auxImplicado[k] + ' No pertenece al universo de atributos');
                return;
            }
            arregloImplicado.push(atributos[indiceImplicado]);
        }
        for (var l = 0; l < auxImplicante.length; l++) {
            var indiceImplicante = validarDependencia(auxImplicante[l], atributos);
            if (indiceImplicante < 0) {
                alert(auxImplicante[l] + ' No pertenece al universo de atributos');
                return;
            }
            arregloImplicante.push(atributos[indiceImplicante]);
        }

        var dependencias = new DependenciaFuncional(arregloImplicado, arregloImplicante);
        dependenciasFuncionales.push(dependencias);
    }

    relacion = new Relacion(atributos, dependenciasFuncionales);

    document.getElementById('btn_exportar').style.display = '';


    recubrimientoMinimal = relacion.recubrimientoMinimal();
    llaves = relacion.llaves(atributos, recubrimientoMinimal);

    exportarRelacion = new Relacion(atributos, recubrimientoMinimal);

    document.getElementById("txt_recubrimiento_minimal").value = "{" + recubrimientoMinimal + "}";
    document.getElementById("txt_llaves").value = "{" + llaves + "}";

    cy = cytoscape({
        container: document.getElementById('cy'),
        style: [
            {
                selector: 'node',
                css: {
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center'
                }
            },
            {
                selector: '$node > node',
                css: {
                    'padding-top': '10px',
                    'padding-left': '10px',
                    'padding-bottom': '10px',
                    'padding-right': '10px',
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            },
            {
                selector: 'edge',
                css: {
                    'target-arrow-shape': 'triangle'
                }
            },
            {
                selector: ':selected',
                css: {
                    'background-color': 'black',
                    'line-color': 'black',
                    'target-arrow-color': 'black',
                    'source-arrow-color': 'black'
                }
            }
        ],
        layout: {
            name: 'cose',
            padding: 5
        }
    });

    var nodes = relacion.getNodesCytoscape();
    var edges = relacion.getEdgesCytoscape();

    cy.add(nodes);
    cy.add(edges);

    document.getElementById('btn_exportar').style.display = '';
}
