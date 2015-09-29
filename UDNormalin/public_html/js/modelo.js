function DependenciaFuncional(implicado, implicante) {
    this.implicado = implicado;
    this.implicante = implicante;
}

DependenciaFuncional.prototype.toString = function () {
    var string = this.implicado + "->" + this.implicante + " ";
    return string;
};

DependenciaFuncional.prototype.equals = function (objDF) {
    if (this.implicado.length === objDF.implicado.length
            && this.implicante.length === objDF.implicante.length
            && this.implicante.containsArray(objDF.implicante)
            && this.implicado.containsArray(objDF.implicado)) {
        return true;
    } else {
        return false;
    }
};

function Atributo(nombre) {
    this.nombre = nombre;
}

Atributo.prototype.toString = function () {
    return this.nombre;
};

function Relacion(atributos, dependenciasFuncionales) {
    this.atributos = atributos;
    this.dependenciasFuncionales = dependenciasFuncionales;
}

Relacion.prototype.getNodesCytoscape = function(){
    var nodes = '{"nodes": [';
    var i = this.atributos.length;
    while(i--){
        nodes += '{"data":{ "id": "' + this.atributos[i] + '"}},';
    }
    nodes = nodes.substring(0, nodes.length-1);
    nodes += "]}";
    return JSON.parse(nodes);
};

Relacion.prototype.getEdgesCytoscape = function() {
    var edges = '{"edges": [';
    var j = this.dependenciasFuncionales.length;
    while(j--){
        var auxImplicado = this.dependenciasFuncionales[j].implicado;
        var auxImplicante = this.dependenciasFuncionales[j].implicante;
        var k = auxImplicado.length;
        while(k--){
            var m = auxImplicante.length;
            while(m--){
                edges += '{"data":{"id":"' + auxImplicado.toString().replace(",", "") 
                                           + auxImplicante.toString().replace(",", "")  
                                           + auxImplicado[k] 
                                           + auxImplicante[m] + '",'  
                                + '"source":"' + auxImplicado[k] + '",' 
                                + '"target":"' + auxImplicante[m] + '"}},';
            }
        }
    }
    edges = edges.substring(0, edges.length-1);
    edges += "]}";
    return JSON.parse(edges);
};

Relacion.prototype.toString = function () {
    return "({" + this.atributos + "},{" + this.dependenciasFuncionales + "})";
};

Relacion.prototype.cierre = function (atributos, dependenciasFuncionales) {
    var cierre = atributos.clone();
    var auxDependenciasFuncionales = dependenciasFuncionales.clone();
    cierre = this.calcularCerramiento(cierre,
                                      auxDependenciasFuncionales);
    return cierre;
};

Relacion.prototype.calcularCerramiento = function (cierre, dependenciasFuncionales) {
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

Relacion.prototype.recubrimientoMinimal = function () {
    var auxDependenciasFuncionales = this.dependenciasFuncionales.clone();
    this.calcularRecubrimientoMinimal(auxDependenciasFuncionales);
    return auxDependenciasFuncionales;
};

Relacion.prototype.calcularRecubrimientoMinimal = function (dependenciasFuncionales) {
    this.eliminarAtributosExtranosDerecha(dependenciasFuncionales);
    this.eliminarAtributosExtranosIzquierda(dependenciasFuncionales);
    this.eliminarRedundancias(dependenciasFuncionales);
};

Relacion.prototype.eliminarAtributosExtranosDerecha = function (dependenciasFuncionales) {
    var i = dependenciasFuncionales.length;
    while (i--) {
        var implicado = dependenciasFuncionales[i].implicado;
        var implicante = dependenciasFuncionales[i].implicante;
        if (implicante.length > 1) {
            dependenciasFuncionales.splice(i, 1);
            var j = implicante.length;
            while (j--) {
                var auxImplicante = new Array(implicante[j]);
                var dependenciaFuncional = new DependenciaFuncional(implicado,
                        auxImplicante);
                dependenciasFuncionales.push(dependenciaFuncional);
            }
        }
    }
};

Relacion.prototype.eliminarAtributosExtranosIzquierda = function (dependenciasFuncionales) {
    var auxDependenciasFuncionales = dependenciasFuncionales.clone();
    var i = dependenciasFuncionales.length;
    while (i--) {
        var implicante = dependenciasFuncionales[i].implicante;
        var implicado = dependenciasFuncionales[i].implicado;
        if (implicado.length > 1) {
            var j = implicado.length;
            while (j--) {
                var auxImplicado = implicado.clone();
                auxImplicado.splice(j, 1);
                var cierre = this.cierre(auxImplicado, dependenciasFuncionales);
                if (cierre.containsArray(implicante)) {
                    auxDependenciasFuncionales[i].implicado = auxImplicado;
                }
            }
        }
    }
    dependenciasFuncionales.deleteDuplicades();    
};

Relacion.prototype.eliminarRedundancias = function (dependenciasFuncionales) {
    var i = dependenciasFuncionales.length;
    while (i--) {
        var auxDependenciasFuncionales = dependenciasFuncionales.clone();
        var dependenciaFuncional = auxDependenciasFuncionales.splice(i, 1);
        var implicado = dependenciaFuncional[0].implicado;
        var implicante = dependenciaFuncional[0].implicante;
        var cierre = this.cierre(implicado, auxDependenciasFuncionales);
        if (cierre.containsArray(implicante)) {
            dependenciasFuncionales.splice(i, 1);
        }
    }
};

Relacion.prototype.llaves = function(dependenciasFuncionales){
    var atributos = this.atributos;
    var implicantes = this.getImplicantes(dependenciasFuncionales);
    var result = atributos.subtract(implicantes);
    var cierre = this.cierre(result, dependenciasFuncionales);
    if(cierre.equals(atributos)){
        return result;
    } else {
        return "No fue posible calcular el cierre";
    }
};

Relacion.prototype.getImplicantes = function(dependenciasFuncionales){
    var implicantes = new Array();
    var i = dependenciasFuncionales.length;
    while(i--){
        var implicante = dependenciasFuncionales[i].implicante;
        var j = implicante.length;
        while(j--){
            if(!implicantes.contains(implicante[j])){
                implicantes.push(implicante[j]);
            }
        }
    }
    return implicantes;
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

Array.prototype.equals = function(array){
    return this.containsArray(array) && this.length === array.length;
};

Array.prototype.clone = function () {
    return this.slice(0);
};

Array.prototype.deleteDuplicades = function () {
    var i = this.length;
    while (i--) {
        var j = this.length;
        while (j--) {
            if(this[i].equals(this[j])
                    && i !== j){
                this.splice(j, 1);
                --j;
            }
        }
    }
};

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




