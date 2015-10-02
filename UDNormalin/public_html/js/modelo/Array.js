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
Array.prototype.equals = function(array){
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
            if(result[i].equals(result[j]) && i !== j){
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
Array.prototype.subtract = function(array){
    var result = new Array();
    var j = this.length;
    while(j--){
        var duplicade = false;
        var i = array.length;
        while(i--){
            if(this[j].nombre === array[i].nombre){
                duplicade = true;
                break;
            }
        }
        if(!duplicade){
            result.push(this[j]);
        }
    }
    return result;
};
