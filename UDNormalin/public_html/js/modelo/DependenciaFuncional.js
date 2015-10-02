/* 
 * Clase Dependencia Funcional, contiene la definicion de los atributos y 
 * metodos de la clase dependencia funcional.
 */

/**
 * Constructor de la clase. Inicializa un objeto de tipo Dependencia Funcional 
 * con el parametro implicado e implicante.
 * @param {Array|Atributo} implicado Conjunto de Elementos Implicados.
 * @param {Array|Atributo} implicante Conjunto de Elementos Implicantes.
 * @returns {DependenciaFuncional} objeto.
 */
function DependenciaFuncional(implicado, implicante) {
    this.implicado = implicado;
    this.implicante = implicante;
}

/**
 * Retorna la representacion en cadena de texto del objeto.
 * @returns {String}
 */
DependenciaFuncional.prototype.toString = function () {
    var string = this.implicado + "->" + this.implicante + " ";
    return string;
};

/**
 * Compara si dos dependencias funcionales son iguales.
 * @param {DependenciaFuncional} objDF Objeto de tipo Dependencia Funcional.
 * @returns {Boolean}
 */
DependenciaFuncional.prototype.equals = function (objDF) {
    if (objDF !== null) {
        if (this.implicado.length === objDF.implicado.length
                && this.implicante.length === objDF.implicante.length
                && this.implicante.containsArray(objDF.implicante)
                && this.implicado.containsArray(objDF.implicado)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};


