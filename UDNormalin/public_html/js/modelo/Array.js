/*
 * Clase Array, contiene la definicion de los atributos y metodos
 * de la clase array.
 */

/**
 * Verifica si un arreglo contiene un atributo.
 * @param {Atributo} obj
 * @returns {Boolean}
 */
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i].nombre === obj.nombre) {
            return true;
        }
    }
    return false;
};

/**
 * Verifica si un arreglo contiene un arreglo de atributos.
 * @param {Array|Atributo} array Conjunto de atributos.
 * @returns {Boolean}
 */
Array.prototype.containsArray = function (array) {
    var j = array.length;
    while (j--) {
        if (!this.contains(array[j])) {
            return false;
        }
    }
    return true;
};

/**
 * Verifica si un arreglo es igual a otro arreglo.
 * @param {Array|Atributo} array
 * @returns {Boolean}
 */
Array.prototype.equals = function (array) {
    return this.containsArray(array) && this.length === array.length;
};

/**
 * Copia superficial de los elementos contenidos en un arreglo.
 * @returns {Array.prototype@call;slice}
 */
Array.prototype.clone = function () {
    return this.slice(0);
};

/**
 * Elimina los elmentos duplicados de un arreglo.
 * @returns {Array|DependenciaFuncional}
 */
Array.prototype.deleteDuplicades = function () {
    var result = this.clone();
    var i = result.length;
    while (i--) {
        var j = result.length;
        while (j--) {
            if (result[i].equals(result[j]) && i !== j) {
                result.splice(j, 1);
                --j;
            }
        }
    }
    return result;
};

/**
 * Elimina los elementos duplicados de dos arreglos.
 * @param {Array|Atributo} array
 * @returns {Array|Array.prototype.subtract.result}
 */
Array.prototype.subtract = function (array) {
    var result = new Array();
    var j = this.length;
    while (j--) {
        var duplicade = false;
        var i = array.length;
        while (i--) {
            if (this[j].nombre === array[i].nombre) {
                duplicade = true;
                break;
            }
        }
        if (!duplicade) {
            result.push(this[j]);
        }
    }
    return result;
};

/**
 * Obtiene las combinatorias de un arreglo sin repetir.
 * @param {type} n Numero de grupos requeridos.
 * @returns {Array|Array}
 */
Array.prototype.combineWithoutRepeat = function (n) {
    var combinatorias = new Array();
    var aux = "";
    this.calculateCombineWithoutRepeat(combinatorias, aux, this, n);
    return combinatorias;
};

/**
 * Calcula las combinatorias de un arreglo sin repetir.
 * @param {type} combinatorias
 * @param {type} actual
 * @param {type} array
 * @param {type} n
 * @returns {undefined}
 */
Array.prototype.calculateCombineWithoutRepeat 
        = function (combinatorias, actual, array, n) {
    if (n === 0) {
        actual = actual.substring(0, actual.length - 1);
        var auxArray = actual.split(",");
        var j = auxArray.length;
        while (j--) {
            auxArray[j] = new Atributo(auxArray[j]);
        }
        combinatorias.push(auxArray);
    } else {
        var auxArray = array.clone();
        var j = array.length - (n - 1);
        while (j--) {
            auxArray.splice(j, 1);
            var element = array[j];
            this.calculateCombineWithoutRepeat(combinatorias,
                    actual + element + ",",
                    auxArray.slice(0), n - 1);
        }
    }
};
