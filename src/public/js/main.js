function showNav() {
    elements = document.getElementsByClassName("myItem");
    for (let index = 0; index < elements.length; index++) {
        elements[index].style.display = "block";
    }
}

function hideNav() {
    elements = document.getElementsByClassName("myItem");
    for (let index = 0; index < elements.length; index++) {
        elements[index].style.display = "none";
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "200px";

    setTimeout(showNav, 400);
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";

    hideNav()
}

function add() {

    if ($("#cultAct").val() != "") {

        if (parseInt($("#mySelect").val()) > parseInt($("#cont").val())) {
            $("#mySelect").attr('disabled', 'disabled');

            $.ajax({
                url: '/agricultor/requestMuestra',
                type: 'POST',
                data: {
                    cultivosActAgricultor: $('#cultAct').val(),
                    cultivosFutAgricultor: $('#cultFut').val(),
                    observacionAgricultor: $('#observ').val()
                },
                success: function (data) {
                    if (data) {
                        Swal.fire(
                            'Muestra ' + (parseInt($("#cont").val()) + 1).toString() + '',
                            'Los datos han sido guardados',
                            'success'
                        )
                        $(".inputRequest").val("")
                        $("#cont").val(parseInt($("#cont").val()) + 1);

                        if (parseInt($("#mySelect").val()) == parseInt($("#cont").val())) {
                            $("#buttMuestra").css('display', 'none');
                            $("#buttSave").css('display', '');
                        }

                    } else {
                        Swal.fire(
                            'Error',
                            'Los campos deben llenarse con caracteres alfanuméricos y puntuación',
                            'warning'
                        )
                    }
                }
            });
        }

    } else {
        Swal.fire(
            'Error!',
            'Debe escribir los cultivos que posee actualmente',
            'warning'
        )
    }
}

function saveChanges() {

    Swal.fire({
        title: '¿Está seguro de guardar los cambios?',
        text: "Una vez acepte, se creará la solicitud y podrá realizar el pago",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1f942f',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        allowOutsideClick: false

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/agricultor/requestSave',
                success: function (data) {
                    if (data) {
                        Swal.fire({
                            title: 'Guardado!',
                            text: 'En unos segundos será redirigido a su lista de análisis donde encontrará\
                         los ID que debe ponerle a sus muestras',
                            icon: 'success',
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            timer: 5000
                        }).then((result) => {

                            window.location.href = 'principal'
                        })
                    } else {
                        Swal.fire(
                            'Error!',
                            'No se pudo guardar la solicitud',
                            'error'
                        )
                    }
                }
            })
        }
    })
}

function deleteS() {
    Swal.fire({
        title: '¿Está seguro de borrar los datos ingresados?',
        text: "Una vez acepte se borrarán todos los datos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#1f942f',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Borrar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/agricultor/requestDelete',
                success: function (data) {
                    if (data) {
                        Swal.fire(
                            'Borrado exitoso',
                            'Los datos han sido descartados',
                            'success'
                        )
                        $("#mySelect").val("0");
                        $("#cont").val("0");
                        $("#mySelect").prop('disabled', false);
                        $("#buttMuestra").css('display', '');
                        $("#buttSave").css('display', 'none');

                    } else {
                        Swal.fire(
                            'Borrado fallido',
                            'Aun no hay datos para descartar',
                            'warning'
                        )
                    }
                }
            });
        }
    });
}

function iniciarAn() {
    Swal.fire({
        title: '¿Está seguro de iniciar el análisis de la muestra?',
        text: "Recuerde tener los instrumentos e indumentaria listos para realizar el proceso ",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1f942f',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: '<a href="/analista/iniciarAnalisis/' + $("#inputIdIn").val() + '" style="color: white">Aceptar</a>'
    })
}

function detenAn() {
    Swal.fire({
        title: '¿Está seguro de pausar el análisis de la muestra?',
        text: "Recuerde que solo debe realizar esta acción si se presenta alguna situación que le impida continuar con el análisis",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1f942f',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: '<a href="/analista/detenerAnalisis/' + $("#inputIdIn").val() + '" style="color: white">Aceptar</a>'
    })
}