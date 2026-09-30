$(document).ready(function () {
    Lucro.Init();
});

var Lucro = {
    Init: function () {
        Lucro.Listar();
        $('#btnNovo').on('click', Lucro.btnNovo_OnClick);
        $('#btnSalvar').on('click', Lucro.btnSalvar_OnClick);
    },

    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="5" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/Lucros",
            method: "GET",
            success: function (data) {
                var html = '';
                $.each(data, function (i, Lucro) {
                    html += '<tr>';
                    html += '<td>' + Lucro.id + '</td>';
                    html += '<td>' + Lucro.nome + '</td>';
                    html += '<td>' + Lucro.descricao + '</td>';
                    html += '<td>R$ ' + parseFloat(Lucro.preco).toFixed(2) + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-sm btn-warning me-1" onclick="Lucro.Editar(' + Lucro.id + ')"><i class="bi bi-pencil"></i> Editar</button>';
                    html += '<button class="btn btn-sm btn-danger" onclick="Lucro.Excluir(' + Lucro.id + ')"><i class="bi bi-trash"></i> Excluir</button>';
                    html += '</td>';
                    html += '</tr>';
                });
                if (html === '') {
                    html = '<tr><td colspan="5" class="text-center text-muted">Nenhum Lucro cadastrado</td></tr>';
                }
                $('#tabela-body').html(html);
            },
            error: function () {
                $('#tabela-body').html('<tr><td colspan="5" class="text-center text-danger">Erro ao carregar Lucros</td></tr>');
            }
        });
    },

    btnNovo_OnClick: function () {
        $('#formLucro')[0].reset();
        $('#LucroId').val('');
        $('#modalLucroLabel').text('Novo Lucro');
        $('#modalLucro').modal('show');
    },

    btnSalvar_OnClick: function () {
        var id = $('#LucroId').val();
        var Lucro = {
            nome: $('#nome').val(),
            descricao: $('#descricao').val(),
            preco: parseFloat($('#preco').val())
        };

        if (!Lucro.nome || !Lucro.descricao || isNaN(Lucro.preco)) {
            alert('Preencha todos os campos corretamente!');
            return;
        }

        if (id) {
            $.ajax({
                url: Config.API_URL + "/Lucros/" + id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(Lucro),
                success: function () {
                    $('#modalLucro').modal('hide');
                    Lucro.Listar();
                },
                error: function () {
                    alert('Erro ao atualizar Lucro');
                }
            });
        } else {
            $.ajax({
                url: Config.API_URL + "/Lucros",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(Lucro),
                success: function () {
                    $('#modalLucro').modal('hide');
                    Lucro.Listar();
                },
                error: function () {
                    alert('Erro ao cadastrar Lucro');
                }
            });
        }
    },

    Editar: function (id) {
        $.ajax({
            url: Config.API_URL + "/Lucros/" + id,
            method: "GET",
            success: function (Lucro) {
                $('#LucroId').val(Lucro.id);
                $('#nome').val(Lucro.nome);
                $('#descricao').val(Lucro.descricao);
                $('#preco').val(Lucro.preco);
                $('#modalLucroLabel').text('Editar Lucro');
                $('#modalLucro').modal('show');
            }
        });
    },

};
