$('#registrar').click(function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $.ajax({
        url: '/agricultor/validate',
        type: 'POST',
        async: false,
        data: {
            nombre_Agricultor: $('#nombreC').val(),
            correo_Agricultor: $('#correo').val(),
            usuario_Agricultor: $('#usuario').val(),
            contrasena_Agricultor: $('#contraseña').val(),
            ciudad_Agricultor: $('#ciudad').val(),
            depart_Agricultor: $('#departamento').val()
        },
        success: function (dataR) {
            sendData(dataR);
        },
        error: function (data) {
            $('#errores').css('display', 'block');
            var errors = JSON.parse(data.responseText);
            $('#error').empty();
            var errorsList = '';
            for (var i = 0; i < errors.length; i++) {
                errorsList += '<li>' + errors[i].msg + '</li>';
            }
            $('#error').append(errorsList);
        }
    });
});

function sendData(dataR){
    $.ajax({
        url: '/agricultor/create',
        type: 'POST',
        data: dataR,
        success: function(results){
            console.log('yes');
        }
    });
}
