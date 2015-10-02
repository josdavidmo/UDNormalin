function exportar() {

    var relacionArch = exportarRelacion;
    var atributosArch = relacionArch.atributos;
    var dependenciasArch = relacionArch.dependenciasFuncionales;

    var txtArchivo = '[{"atributos": "';
    for (var i = 0; i < atributosArch.length; i++) {
        txtArchivo += atributosArch[i].nombre + ',';
    }

    txtArchivo = txtArchivo.substring(0, txtArchivo.length - 1);
    txtArchivo += '"},{"dependenciasFuncionales": "';


    for (var j = 0; j < dependenciasArch.length; j++) {
        var dependencias = dependenciasArch[j];
        var arregloImplicado = dependencias.implicado;
        var arregloImplicante = dependencias.implicante;

        txtArchivo += obtieneDependencias(arregloImplicado, arregloImplicante);

    }
    txtArchivo = txtArchivo.substring(0, txtArchivo.length - 1);
    txtArchivo += '"} ]';
    window.open('data:text/json;charset=utf-8,' + escape(txtArchivo));


}


function obtieneDependencias(pImplicado, pImplicante) {
    var texto = '';
    for (var i = 0; i < pImplicado.length; i++) {
        var atributo = pImplicado[i];
        texto += atributo.nombre;
    }
    texto += '->';

    for (var j = 0; j < pImplicante.length; j++) {
        var atributo = pImplicante[j];
        texto += atributo.nombre;
    }
    texto += ',';

    return texto;
}

