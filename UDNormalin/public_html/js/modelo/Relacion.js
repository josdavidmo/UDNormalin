/* 
 * Clase Relacion, contiene la definicion de los atributos y 
 * metodos de la clase relacion.
 */

/* global detalle */

/**
 * Constructor de la clase. Inicializa un objeto de tipo Relacion con el 
 * parametro atributo e dependencias funcionales.
 * @param {Array|Atributo} atributos Conjunto de Atributos.
 * @param {Array|DependenciaFuncional} dependenciasFuncionales Conjunto de 
 * Dependencias Funcionales.
 * @returns {Relacion} objeto.
 */
function Relacion(atributos, dependenciasFuncionales) {
    this.atributos = atributos;
    this.dependenciasFuncionales = dependenciasFuncionales;
}

/**
 * Retorna la representacion en formato JSON de los atributos.
 * @returns {Array|Object} JSON.
 */
Relacion.prototype.getNodesCytoscape = function () {
    var nodes = '{"nodes": [';
    var i = this.atributos.length;
    while (i--) {
        nodes += '{"data":{ "id": "' + this.atributos[i] + '"}},';
    }
    nodes = nodes.substring(0, nodes.length - 1);
    nodes += "]}";
    return JSON.parse(nodes);
};

/**
 * Retorna la representacion en formato JSON de las depedencias funcionales.
 * @returns {Array|Object}
 */
Relacion.prototype.getEdgesCytoscape = function () {
    var edges = '{"edges": [';
    var j = this.dependenciasFuncionales.length;
    while (j--) {
        var auxImplicado = this.dependenciasFuncionales[j].implicado;
        var auxImplicante = this.dependenciasFuncionales[j].implicante;
        var k = auxImplicado.length;
        while (k--) {
            var m = auxImplicante.length;
            while (m--) {
                edges += '{"data":{"id":"'
                        + auxImplicado.toString().replace(",", "")
                        + auxImplicante.toString().replace(",", "")
                        + auxImplicado[k]
                        + auxImplicante[m] + '",'
                        + '"source":"' + auxImplicado[k] + '",'
                        + '"target":"' + auxImplicante[m] + '"}},';
            }
        }
    }
    edges = edges.substring(0, edges.length - 1);
    edges += "]}";
    return JSON.parse(edges);
};

/**
 * Retorna la representacion en cadena de texto de la relación.
 * @returns {String}
 */
Relacion.prototype.toString = function () {
    return "R({" + this.atributos + "},{" + this.dependenciasFuncionales + "})";
};

/**
 * Obtiene el cierre de un atributo dado un conjunto de atributos y dependencias
 * funcionales.
 * @param {Array|Atributo} atributos
 * @param {Array|DependenciaFuncional} dependenciasFuncionales
 * @returns {Relacion@call;calcularCerramiento|Array.prototype@call;slice}
 */
Relacion.prototype.cierre = function (atributos, dependenciasFuncionales) {
    var cierre = atributos.clone();
    var auxDependenciasFuncionales = dependenciasFuncionales.clone();
    cierre = this.calcularCerramiento(cierre,
            auxDependenciasFuncionales);
    detalle += "<p><small>" + atributos + "<sup>+</sup> = " + cierre + "</small></p>";
    return cierre;
};

/**
 * Calcula el cierre de un atributo dado un conjunto de atributos y dependencias
 * funcionales.
 * @param {Array|Atributo} cierre
 * @param {Array|Atributo} dependenciasFuncionales
 * @returns {Array|Atributo}
 */
Relacion.prototype.calcularCerramiento
        = function (cierre, dependenciasFuncionales) {
            var auxCierre = new Array();
            while (auxCierre.toString() !== cierre.toString()) {
                auxCierre = cierre.clone();
                var i = dependenciasFuncionales.length;
                while (i--) {
                    var implicado = dependenciasFuncionales[i].implicado;
                    var implicante = dependenciasFuncionales[i].implicante;
                    if (cierre.containsArray(implicado)) {
                        dependenciasFuncionales.splice(i, 1);
                        var j = implicante.length;
                        while (j--) {
                            if (!cierre.contains(implicante[j])) {
                                cierre.push(implicante[j]);
                            }
                        }
                    }
                }
            }
            return cierre;
        };

/**
 * Obtiene el recubrimiento minimal de las dependencias funcionales almacenadas
 * en el objeto.
 * @returns {Relacion@pro;dependenciasFuncionales@call;clone}
 */
Relacion.prototype.recubrimientoMinimal = function () {
    var auxDependenciasFuncionales
            = this.calcularRecubrimientoMinimal(this.dependenciasFuncionales.clone());
    return auxDependenciasFuncionales;
};

/**
 * Calcula el recubrimiento minimal de un conjunto de dependencias funcionales.
 * @param {Array|DependenciaFuncional} dependenciasFuncionales
 * @returns {Array|DependenciaFUncional}
 */
Relacion.prototype.calcularRecubrimientoMinimal = function (dependenciasFuncionales) {
    var auxDependenciasFuncionales = dependenciasFuncionales.clone();
    detalle += "<h3>Cálculo Recubrimiento Minimal</h3>";
    detalle += "<ol>";
    detalle += "<li><p>Eliminamos los atributos extraños a derecha:</p></li>";
    auxDependenciasFuncionales
            = this.eliminarAtributosExtranosDerecha(auxDependenciasFuncionales);
    detalle += "<p>Así, obtenemos el conjunto L<sub>0</sub> = {" + auxDependenciasFuncionales + "}</p>";
    detalle += "<li><p>Eliminamos los atributos extraños a izquierda:</p></li>";
    auxDependenciasFuncionales
            = this.eliminarAtributosExtranosIzquierda(auxDependenciasFuncionales);
    detalle += "<p>Así, obtenemos el conjunto L<sub>1</sub> = {" + auxDependenciasFuncionales + "}</p>";
    detalle += "<li><p>Eliminamos las redundancias:</p></li>";
    auxDependenciasFuncionales
            = this.eliminarRedundancias(auxDependenciasFuncionales);
    detalle += "<p>Finalmente, el recorrido mínimal corresponde a L<sub>2</sub> = {" + auxDependenciasFuncionales + "}</p>";
    detalle += "</ol>";
    return auxDependenciasFuncionales;
};

/**
 * Elimina los atributos extraños a derecha de un conjunto de dependencias 
 * funcionales.
 * @param {Array|DependenciaFuncional} dependenciasFuncionales Conjunto de 
 * depedencias funcionales.
 * @returns {Array|DependenciaFuncional}
 */
Relacion.prototype.eliminarAtributosExtranosDerecha = function (dependenciasFuncionales) {
    var auxDependenciasFuncionales = dependenciasFuncionales.clone();
    var i = auxDependenciasFuncionales.length;
    while (i--) {
        var implicado = auxDependenciasFuncionales[i].implicado;
        var implicante = auxDependenciasFuncionales[i].implicante;
        if (implicante.length > 1) {
            detalle += "<p><small>Separamos el implicante " + implicante + "</small></p>";
            auxDependenciasFuncionales.splice(i, 1);
            var j = implicante.length;
            while (j--) {
                var auxImplicante = new Array(implicante[j]);
                var dependenciaFuncional = new DependenciaFuncional(implicado,
                        auxImplicante);
                auxDependenciasFuncionales.push(dependenciaFuncional);
            }
        }
    }
    return auxDependenciasFuncionales;
};

/**
 * Elimina los atributos extraños a izquierda de un conjunto de dependencias 
 * functionales.
 * @param {Array|DependenciaFuncional} dependenciasFuncionales Conjunto de 
 * dependencias funcionales.
 * @returns {Array|DependenciaFuncional}
 */
Relacion.prototype.eliminarAtributosExtranosIzquierda = function (dependenciasFuncionales) {
    var auxDependenciasFuncionales = dependenciasFuncionales.clone();
    var i = dependenciasFuncionales.length;
    while (i--) {
        var implicante = dependenciasFuncionales[i].implicante;
        var implicado = dependenciasFuncionales[i].implicado;
        if (implicado.length > 1) {
            var j = implicado.length;
            detalle += "<p><small>Evaluando el implicado " + implicado + "</small></p>";
            detalle += "<ul>";
            while (j--) {
                var auxImplicado = implicado.clone();
                var extrano = auxImplicado.splice(j, 1);
                detalle += "<li><p><small>Calculando el cierre de " + auxImplicado + "</small></p></li>";
                var cierre = this.cierre(auxImplicado, dependenciasFuncionales);
                if (cierre.containsArray(implicante)) {
                    detalle += "<p><small>Luego " + extrano + " es extraño</small></p>";
                    auxDependenciasFuncionales[i].implicado = auxImplicado;
                }
            }
            detalle += "</ul>";
        }
    }
    return auxDependenciasFuncionales.deleteDuplicades();
};

/**
 * Elimina las redundancias de un conjunto de dependencias funcionales.
 * @param {Array|DependenciaFuncional} dependenciasFuncionales Conjunto de 
 * dependencias funcionales.
 * @returns {Array|DependenciaFuncional}
 */
Relacion.prototype.eliminarRedundancias = function (dependenciasFuncionales) {
    var auxDependenciasFuncionales = dependenciasFuncionales.clone();
    var i = auxDependenciasFuncionales.length;
    detalle += "<ul>";
    while (i--) {
        var auxDependenciasFuncionales2 = auxDependenciasFuncionales.clone();
        var dependenciaFuncional = auxDependenciasFuncionales2.splice(i, 1);
        var implicado = dependenciaFuncional[0].implicado;
        detalle += "<li><p><small>Calculando el cierre de " + implicado + "</small></p></li>";
        var implicante = dependenciaFuncional[0].implicante;
        var cierre = this.cierre(implicado, auxDependenciasFuncionales2);
        if (cierre.containsArray(implicante)) {
            auxDependenciasFuncionales.splice(i, 1);
            detalle += "<p><small>Luego " + implicado + " es redundante</small></p>";
        }
    }
    detalle += "</ul>";
    return auxDependenciasFuncionales;
};

/**
 * Obtiene el conjunto de llaves de una relacion.
 * @param {Array|Atributo} atributos
 * @param {Array|DependenciaFuncional} dependenciasFuncionales
 * @returns {Array|Atributo}
 */
Relacion.prototype.llaves = function (atributos, dependenciasFuncionales) {
    detalle += "<h3>Cálculo de Llaves</h3>";
    var atributos = atributos;
    var implicantes = this.getImplicantes(dependenciasFuncionales);
    var llaves = atributos.subtract(implicantes);
    if (llaves.length !== 0) {
        detalle += "<p><small>Restando los Atributos e Implicantes y calculando su cierre:</small></p>";
        var cierre = this.cierre(llaves, dependenciasFuncionales);
        if (cierre.equals(atributos)) {
            detalle += "<p><small>Como el cierre contiene todos los atributos, se dice que la llave es única</small></p>";
            return new Array(llaves);
        }
    } else {
        detalle += "<p><small>Ya que la llave no es única, \n\
                    procedemos a evaluar combinaciones de atributos hasta \n\
                    encontrar todas las llaves candidatas</small></p>";
        llaves = new Array();
        var implicados = this.getImplicados(dependenciasFuncionales);
        var w = atributos.subtract(implicados);
        var v = atributos.subtract(w);
        var j = 1;
        while (j <= v.length) {
            var combinatorias = v.combineWithoutRepeat(j);
            var i = combinatorias.length;
            while (i--) {
                var cierre = this.cierre(combinatorias[i], dependenciasFuncionales);
                if (cierre.equals(atributos)) {
                    llaves.push(combinatorias[i]);
                    detalle += "<p><small>Luego " + combinatorias[i] + " es una llave candidata</small></p>";
                    v = v.subtract(combinatorias[i]);
                }
            }
            j++;
        }
        return llaves;
    }
};

/**
 * Obtiene los implicantes de un conjunto de dependencias funcionales.
 * @param {Array|DependenciaFuncional} dependenciasFuncionales
 * @returns {Array|Relacion.prototype.getImplicantes.implicantes}
 */
Relacion.prototype.getImplicantes = function (dependenciasFuncionales) {
    var implicantes = new Array();
    var i = dependenciasFuncionales.length;
    while (i--) {
        var implicante = dependenciasFuncionales[i].implicante;
        var j = implicante.length;
        while (j--) {
            if (!implicantes.contains(implicante[j])) {
                implicantes.push(implicante[j]);
            }
        }
    }
    return implicantes;
};

/**
 * Obtiene los implicados de un conjunto de dependencias funcionales.
 * @param {Array|DependenciaFuncional} dependenciasFuncionales
 * @returns {Array|Relacion.prototype.getImplicados.implicados}
 */
Relacion.prototype.getImplicados = function (dependenciasFuncionales) {
    var implicados = new Array();
    var i = dependenciasFuncionales.length;
    while (i--) {
        var implicado = dependenciasFuncionales[i].implicado;
        var j = implicado.length;
        while (j--) {
            if (!implicados.contains(implicado[j])) {
                implicados.push(implicado[j]);
            }
        }
    }
    return implicados;
};

/**
 * Determina si una dependencia funcional esta en FNBC.
 * @param {Array|Atributo} llaves
 * @param {Array|DependenciaFuncional} dependenciasFuncionales
 * @returns {Boolean}
 */
Relacion.prototype.isFNBC = function (llaves, dependenciasFuncionales) {
    detalle += "<p><small>Miramos si cada llave encontrada corresponde a un implicado</small></p>";
    detalle += "<ul>";
    var i = llaves.length;
    while (i--) {
        var llave = llaves[i];
        var j = dependenciasFuncionales.length;
        var contiene = false;
        while (j-- && !contiene) {
            var implicado = dependenciasFuncionales[j].implicado;
            if (implicado.equals(llave)) {
                contiene = true;
            }
        }
        if (!contiene) {
            detalle += "<li><p><small>¿La llave " + llave + " corresponde a un implicado? NO</small></p></li>";
            detalle += "<p><small>Entonces no esta en FNBC</small></p>";
            detalle += "</ul>";
            return false;
        } else {
            detalle += "<li><p><small>¿La llave " + llave + " corresponde a un implicado? SI</small></p></li>";
        }
    }
    detalle += "</ul>";
    return true;
};
