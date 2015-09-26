function DependenciaFuncional(implicado, implicante) {
    this.implicado = implicado;
    this.implicante = implicante;
}

DependenciaFuncional.prototype.toString = function DFtoString() {
    var string = this.implicado + "->" + this.implicante;
    return string;
};

function Atributo(nombre) {
    this.nombre = nombre;
}

Atributo.prototype.toString = function AtributotoString() {
    return this.nombre;
};

function Relacion(atributos, dependeciasFuncionales) {
    this.atributos = atributos;
    this.dependenciasFuncionales = dependeciasFuncionales;
}

Relacion.prototype.calcularCerramiento = function (atributos) {
    var cerramiento = atributos;
    var auxDependenciasFuncionales = 
    cerramiento = this.calcularCerramientoIterativo(cerramiento,
            this.dependenciasFuncionales);
    return cerramiento;
};


Relacion.prototype.calcularCerramientoIterativo 
        = function (cerramiento, dependenciasFuncionales) {
    var auxCerramiento = new Array();
    var j = 1;
    while (auxCerramiento.toString() !== cerramiento.toString()) {
        auxCerramiento = cerramiento.clone();
        var i = dependenciasFuncionales.length;
        while (i--) {
            var implicado = dependenciasFuncionales[i].implicado;
            var implicante = dependenciasFuncionales[i].implicante;
            if (cerramiento.containsArray(implicado)) {
                dependenciasFuncionales.splice(i, 1);
                if (!cerramiento.containsArray(implicante)) {
                    cerramiento = cerramiento.concat(implicante);
                }
            }
        }
        j++;
    }
    return cerramiento;
};

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i].nombre === obj.nombre) {
            return true;
        }
    }
    return false;
};

Array.prototype.containsArray = function (array) {
    var j = array.length;
    while (j--) {
        if (!this.contains(array[j])) {
            return false;
        }
    }
    return true;
};

Array.prototype.clone = function () {
    return this.slice(0);
};


