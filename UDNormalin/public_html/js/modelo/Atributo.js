/* 
 * Clase Atributo, contiene la definicion de los atributos y metodos 
 * de la clase atributo.
 */

/**
 * Constructor de la clase. Inicializa un objeto de tipo Atributo con el
 * parametro nombre.
 * @param {String} nombre unico del atributo.
 * @returns {Atributo} objeto.
 */
function Atributo(nombre) {
    this.nombre = nombre;
}

/**
 * Retorna la representacion en cadena de texto del objeto.
 * @returns {String}
 */
Atributo.prototype.toString = function () {
    return this.nombre;
};

