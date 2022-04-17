function busqF() {
    $.ajax({
        url: "/analista/filtroResultados",
        contentType: "application/json; charset=UTF-8",
        data: {
            'fechaInicio': $("#Fdesde").val(),
            'fechaFin': $("#Fhasta").val(),
            'codigo': $("#codigo").val()
        },
        success: function (result) {
            console.log(result);
            var final = "";
            $("#spaceCards").empty();
            if (result != null) {
                for (let i = 0; i < result.length; i++) {
                    final += `<div class="col-6 container" style="margin-bottom: 16px;">
                                <div class="card border-success" style="width: 83%; padding: 0;">
                                    <div class="card-header"><b>ID Resultado: </b>${result[i].idResultado}</div>
                                    <div class="card-body text-dark" style="padding-bottom: 0;">
                                        <p id="analysisCode"><b>Fecha: </b>${result[i].fechaResultado.toString().split('T')[0]}</p>
                                        <p id="analysisStatus"><b> ID Muestra: </b>${result[i].idMuestra1}</p>
                                        <br><br>
                                        <a href="#" class="btn btn-dark" style="position: absolute; right: 7%; top: 67%">Modificar</a>
                                    </div>
                                </div>
                            </div>`;               
                }
            } else {
                final += `<h5 class="mx-auto" style="color: rgb(192, 192, 192)">No se han encontrado resultados</h5>`;
            }

            $("#spaceCards").append(final);
        }
    });
};