var detalle = "";

/*
 * Procesa archivo json con los siguientes datos
 * Atributos y dependencias funcionales
 * @param {file} archivo JSON
 */
function leerArchivo(file) {
    document.getElementById('mensaje_error').style.display = 'none';
    if (document.getElementById('txt_entrada').type === 'file') {
        var file = file[0];
        var extension = file.name.split('.').pop();
        if (extension === 'json') {
            var reader = new FileReader();
            reader.onload = function (e) {
                // Cuando éste evento se dispara, los datos están ya disponibles.
                // Se trata de copiarlos a una área <div> en la página.
                var output = document.getElementById("fileOutput");
                output.textContent = e.target.result;
                document.getElementById("panel_archivo").style.display = '';
            };
            reader.readAsText(file);
        } else {
            escribirMensaje('Tipo de archivo no valido');
        }
    }
}

function cambiarTipoEntrada() {
    document.getElementById('mensaje_error').style.display = 'none';
    if (document.getElementById('txt_entrada').type === 'file') {
        document.getElementById('btn_tipo_entrada').innerHTML = 'Subir Archivo';
        document.getElementById('txt_entrada').type = 'text';
        document.getElementById("panel_archivo").style.display = 'none';
    } else {
        document.getElementById('btn_tipo_entrada').innerHTML = 'Caja Texto';
        document.getElementById('txt_entrada').type = 'file';
    }
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
    while (i--) {
        if (pAtributo === pUniverso[i].nombre) {
            return i;
        }
    }
    return -1;

}

function ejecutar() {
    var accion = document.getElementById('select_algoritmo').value;
    var auxRelacion = capturarEntradas();
    relacion = convertirEntradas(auxRelacion[0], auxRelacion[1]);
    if (relacion !== null) {
        ejecutarAccion(accion, relacion);
    }
}

function ejecutarAccion(accion, relacion) {
    detalle = "";
    var start = new Date().getTime();
    switch (accion) {
        case 'algoritmo1':
            document.getElementById('label_ejecucion').innerHTML = "Recubrimiento Minimal";
            var recubrimientoMinimal = relacion.recubrimientoMinimal();
            document.getElementById('text_ejecucion').innerHTML = '<p>{' + recubrimientoMinimal + '}</p>';
            break;

        case 'algoritmo2':
            document.getElementById('label_ejecucion').innerHTML = "Conjunto de Llaves Candidatas";
            var atributos = relacion.atributos;
            var recubrimientoMinimal = relacion.recubrimientoMinimal();
            var llaves = relacion.llaves(atributos, recubrimientoMinimal);
            if (llaves.length === 1) {
                document.getElementById('text_ejecucion').innerHTML = '<p>{' + llaves + '}</p>';
            } else {
                var auxSalida = "";
                var i = llaves.length;
                while (i--) {
                    auxSalida += "{" + llaves[i] + "}";
                }
                document.getElementById('text_ejecucion').innerHTML = '<p>{' + auxSalida + '}</p>';
            }
            break;

        case 'algoritmo3':
            document.getElementById('label_ejecucion').innerHTML = "¿Está en FNBC?";
            var atributos = relacion.atributos;
            var recubrimientoMinimal = relacion.recubrimientoMinimal();
            var llaves = relacion.llaves(atributos, recubrimientoMinimal);
            detalle += "<h3>Determinación de Forma Normal Boyce Codd</h3>";
            document.getElementById('text_ejecucion').innerHTML = '<p>NO</p>';
            if (llaves.length === 1) {
                detalle += "<p><small>Ya que la llave es única, se encuentra en FNBC</small></p>";
                document.getElementById('text_ejecucion').innerHTML = '<p>SI</p>';
            } else {
                var isFNBC = relacion.isFNBC(llaves, recubrimientoMinimal);
                if (isFNBC) {
                    document.getElementById('text_ejecucion').innerHTML = '<p>SI</p>';
                }
            }
            break;

        case 'algoritmo4':
            document.getElementById('label_ejecucion').innerHTML = "Representación Gráfica";
            document.getElementById('text_ejecucion').style.height = '400px';
            var cy = cytoscape({
                container: document.getElementById('text_ejecucion'),
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
            break;
    }
    document.getElementById('text_detalle').innerHTML = detalle;
    var end = new Date().getTime();
    var time = end - start;
    document.getElementById('text_tiempo').innerHTML = "Tiempo de Ejecución: " + time + "ms";
}

function convertirEntradas(txtAtributos, txtDependenciasFuncionales) {
    //objetos de atributo
    var arrAtrb = txtAtributos.split(",");
    var atributos = new Array();
    var i = arrAtrb.length;
    while (i--) {
        var atributo = new Atributo(arrAtrb[i]);
        atributos.push(atributo);
    }
    //Objetos de dependencias
    var arrDep = txtDependenciasFuncionales.split(";");
    var dependenciasFuncionales = [];
    for (var j = 0; j < arrDep.length; j++) {

        var auxDependencia = arrDep[j].split("->");
        //dependencias triviales
        if (auxDependencia[0] === auxDependencia[1]) {
            escribirMensaje(auxDependencia[0] + " Es una dependencia trivial");
            return null;
        }

        var auxImplicado = auxDependencia[0].split(',');
        var auxImplicante = auxDependencia[1].split(',');


        //Valida los implicados
        var arregloImplicado = [];
        var arregloImplicante = [];
        for (var k = 0; k < auxImplicado.length; k++) {
            var indiceImplicado = validarDependencia(auxImplicado[k], atributos);
            if (indiceImplicado < 0) {
                escribirMensaje(auxImplicado[k] + ' No pertenece al universo de atributos');
                return null;
            }
            arregloImplicado.push(atributos[indiceImplicado]);
        }
        for (var l = 0; l < auxImplicante.length; l++) {
            var indiceImplicante = validarDependencia(auxImplicante[l], atributos);
            if (indiceImplicante < 0) {
                escribirMensaje(auxImplicante[l] + ' No pertenece al universo de atributos');
                return null;
            }
            arregloImplicante.push(atributos[indiceImplicante]);
        }

        var dependencias = new DependenciaFuncional(arregloImplicado, arregloImplicante);
        dependenciasFuncionales.push(dependencias);
    }
    var relacion = new Relacion(atributos, dependenciasFuncionales);
    return relacion;
}

/**
 * Valida y ajustas los datos obtenidos para realizar
 * procesados para realizar el calculo correspondiente de 
 * cada algoritmo 
 * @returns {Relacion}
 */
function capturarEntradas() {
    var txtAtributos = "";
    var txtDependencias = "";
    if (document.getElementById('txt_entrada').type === 'file') {
        try {
            var divFile = document.getElementById('fileOutput');
            var datosArchivo = divFile.textContent;
            var valorJson = JSON.parse(datosArchivo);
            for (var i = 0; i < valorJson.length; i++) {
                //La segunda posicion corresponde a los atributos
                if (i === 0) {
                    txtAtributos = valorJson[i].atributos;
                } else {
                    txtDependencias = valorJson[i].dependenciasFuncionales;
                }
            }
            document.getElementById('txt_entrada').type = 'text';
            document.getElementById('txt_entrada').value = "R({" + txtAtributos + "},{" + txtDependencias + "})";
        } catch (err) {
            escribirMensaje('Por favor valide el formato del archivo ' + err);
            return null;
        }
    } else {
        var txtEntrada = document.getElementById('txt_entrada').value;
        txtEntrada = txtEntrada.replace(" ", "");
        var auxPosicion1 = txtEntrada.indexOf("{") + 1;
        var auxPosicion2 = txtEntrada.indexOf("}");
        txtAtributos = txtEntrada.substring(auxPosicion1, auxPosicion2);
        var auxPosicion3 = txtEntrada.indexOf(")") - 1;
        txtDependencias = txtEntrada.substring(auxPosicion2 + 3, auxPosicion3);
    }
    document.getElementById('btn_exportar').style.display = '';
    document.getElementById('btn_detalle').style.display = '';
    document.getElementById('panel_ejecucion').style.display = '';
    document.getElementById('btn_ocultar').style.display = 'none';
    document.getElementById('panel_detalle').style.display = 'none';
    var auxArray = new Array(txtAtributos, txtDependencias);
    return auxArray;
}

/**
 * Muestra el panel para visualizar
 * el paso a paso del proceso 
 * @returns {undefined}
 */
function mostrarDetalle() {
    document.getElementById('panel_detalle').style.display = '';
    document.getElementById('btn_detalle').style.display = 'none';
    document.getElementById('btn_ocultar').style.display = '';

}
/**
 * Ocula el panel para visualizar
 * el paso a paso del proceso 
 * @returns {undefined}
 */
function ocultarDetalle() {
    document.getElementById('panel_detalle').style.display = 'none';
    document.getElementById('btn_detalle').style.display = '';
    document.getElementById('btn_ocultar').style.display = 'none';
}



/**
 * Escribe un mensaje en pantalla
 * @param {type} texto
 * @returns {undefined}
 */
function escribirMensaje(texto) {
    document.getElementById('mensaje_error').style.display = '';
    var output = document.getElementById("mensaje_error");
    output.innerHTML = '<strong id="error">Error!</strong> ' + texto;
}