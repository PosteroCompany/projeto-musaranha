﻿Musaranha.Funcionario = Musaranha.Funcionario || (function () {
    function iniciar() {
        $('select').material_select();

        $('button.incluir').off('click').click(function () {
            abrirModalInclusao();
        });

        $('button.editar').off('click').click(function () {
            abrirModalEdicao(this);
        });

        $('button.excluir').off('click').click(function () {
            var $tr = $(this).parents('[data-funcionario]');
            var codPessoa = $tr.data('funcionario');
            var nome = $tr.find('td').eq(0).text();
            var categoria = $tr.find('td').eq(2).text();
            abrirModalExclusao(codPessoa, nome, categoria);
        });

        $('input#txtTelefone').off('change').change(function () {
            novoTelefone($(this));
        });
    }

    function novoTelefone($input) {
        var $section = $input.closest('div.telefones');
        var $lastInput = $section.find('input[id^=txtTelefone]').last();
        if (checarTelefone($lastInput)) {
            var $cloneInput = $lastInput.clone();
            var n = parseInt($cloneInput.attr('name').replace(/\D/g, ''));
            var name = $cloneInput.attr('name').replace(/\d/g, '') + (++n);
            $cloneInput.val('');
            $cloneInput.attr('name', name);
            $section.append($cloneInput);
            iniciar();
            Musaranha.reativarMask();
        }
        else if ($input.val().trim().length == 0) {
            if($section.find('input[id^=txtTelefone]').length > 1)
                $lastInput.remove();
        }
    }

    function checarTelefone($input) {
        var telefone = $input.val().replace(/\D/g, '');
        return (telefone.length == 11 || telefone.length == 10);
    }

    function abrirModalInclusao() {
        var $modal = $('.acao.modal');

        $modal.find('.header').text('Incluir Funcionário');
        while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
            $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
        }
        $modal.find('.primary').text('Incluir').off().click(function () {
            incluir();
        });

        $modal.openModal();
    }

    function abrirModalEdicao(button) {
        var $modal = $('.acao.modal');
        var $tds = $(button).parents('[data-funcionario]').find('td');
        var codPessoa = $(button).parents('[data-funcionario]').data('funcionario');

        $modal.find('.header').text('Editar Funcionário');
        while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
            $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
        }

        $.ajax({
            url: '/funcionario/json/' + codPessoa,
            type: 'POST',
            success: function (fornecedor) {
                $modal.find('#txtNome').val(fornecedor.Nome);
                for (var i = 0, length = fornecedor.Telefones.length; i < length; i++) {
                    var $input = $modal.find('input[id^=txtTelefone]').last();
                    $input.val(fornecedor.Telefones[i]);
                    novoTelefone($input);
                }
                $modal.find('#txtCategoria').val(fornecedor.Categoria);
                $modal.find('#txtIdentidade').val(fornecedor.NumIdentidade);
                $modal.find('#txtCarteiraTrabalho').val(fornecedor.NumCarteiraTrabalho);
                $modal.find('#txtSalario').val(fornecedor.Salario);
                $modal.find('#txtObservacao').text(fornecedor.Observacao);

                $modal.find('.primary').text('Editar').off().click(function () {
                    editar(codPessoa);
                });

                Musaranha.reativarMask();
                iniciar();

                $modal.openModal();
            }
        });
    }

    function abrirModalExclusao(codPessoa, nome, categoria) {
        var $modal = $('.excluir.modal');
        $modal.find('.info').html('');
        $modal.find('.info').append('<p><b>Nome: </b>' + nome + '</p>');
        $modal.find('.info').append('<p><b>Categoria: </b>' + categoria + '</p>');

        $modal.find('.primary').off().click(function () {
            excluir(codPessoa);
        });

        $modal.openModal();
    }

    function incluir() {
        if (validarFormulario()) {
            var form = $('form.acao.modal').serializeArray();
            $('form.acao.modal .modal-footer').append(
                '<div class="progress">' +
                  '<div class="indeterminate"></div>' +
                '</div>');
            $.ajax({
                type: 'POST',
                url: '/funcionario/incluir',
                data: form,
                success: function (funcionarios) {
                    var $tbody = $('.table.funcionarios tbody');
                    $tbody.html(funcionarios);
                    Materialize.toast('Funcionário incluído com sucesso', 4000);
                    iniciar();
                },
                error: function () {
                    Materialize.toast('Ocorreu um erro na inclusão do Funcionário', 4000);
                },
                complete: function () {
                    $('form.acao.modal .modal-footer .progress').remove();
                    while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
                        $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
                    }
                    $('form.acao.modal').get(0).reset();
                    $('form.acao.modal').closeModal();
                }
            })
        }
        else return false;
    }

    function editar(codPessoa) {
        if (validarFormulario()) {
            var form = $('form.acao.modal').serializeArray();
            $('form.acao.modal .modal-footer').append(
                '<div class="progress">' +
                  '<div class="indeterminate"></div>' +
                '</div>');
            $.ajax({
                type: 'POST',
                data: form,
                url: '/funcionario/editar/' + codPessoa,
                success: function (funcionarios) {
                    var $tbody = $('.table.funcionarios tbody');
                    $tbody.html(funcionarios);
                    Materialize.toast('Funcionário editado com sucesso', 4000);
                    iniciar();
                },
                error: function () {
                    Materialize.toast('Ocorreu um erro na edição do Funcionário', 4000);
                },
                complete: function () {
                    $('form.acao.modal .modal-footer .progress').remove();
                    while ($('form.acao.modal div.telefones input[id^=txtTelefone]').length > 1) {
                        $('form.acao.modal div.telefones input[id^=txtTelefone]').last().remove();
                    }
                    $('form.acao.modal').get(0).reset();
                    $('form.acao.modal').closeModal();
                }
            })
        }
        else return false;
    }

    function excluir(codPessoa) {
        $('.excluir.modal .modal-footer').append(
                '<div class="progress">' +
                  '<div class="indeterminate"></div>' +
                '</div>');
        $.ajax({
            type: 'POST',
            url: '/funcionario/excluir/' + codPessoa,
            success: function (funcionarios) {
                var $tbody = $('.table.funcionarios tbody');
                $tbody.html(funcionarios);
                Materialize.toast('Funcionário excluído com sucesso', 4000);
                iniciar();
            },
            error: function () {
                Materialize.toast('Ocorreu um erro na exclusão do Funcionário', 4000);
            },
            complete: function () {
                $('.excluir.modal .modal-footer .progress').remove();
                $('.excluir.modal').find('.info').html('');
                $('.excluir.modal').closeModal();
            }
        })
    }

    function validarFormulario() {
        var valido = true;

        if (!$('#txtNome').val()) {
            $('#txtNome').addClass("invalid");
            valido = false;
        }
        if (!$('#txtTelefone').val()) {
            $('#txtTelefone').addClass("invalid");
            valido = false;
        }
        if ($('#txtTelefone').val()) {
            var telefone = $('#txtTelefone').val().replace(/\D/g, '');
            if (telefone.length != 10 && telefone.length != 11) {
                $('#txtTelefone').addClass("invalid");
                valido = false;
            }
        }
        if (!$('#txtIdentidade').val()) {
            $('#txtIdentidade').addClass("invalid");
            valido = false;
        }
        if (!$('#txtCarteiraTrabalho').val()) {
            $('#txtCarteiraTrabalho').addClass("invalid");
            valido = false;
        }
        if (!$('#txtSalario').val()) {
            $('#txtSalario').addClass("invalid");
            valido = false;
        }
        if (!$('#txtCategoria :selected').val()) {
            valido = false;
        }

        return valido;
    }

    return {
        iniciar: iniciar
    }
})();

Musaranha.Funcionario.Pagamento = Musaranha.Funcionario.Pagamento || (function () {
    function iniciar() {
        $('select').material_select();
        $('.datepicker').pickadate({
            selectMonths: true,
            selectYears: true
        });

        $('button.incluir').off('click').click(function () {
            abrirModalInclusao();
        });

        $('button.editar').off('click').click(function () {
            abrirModalEdicao(this);
        });

        $('button.excluir').off('click').click(function () {
            var $tr = $(this).parents('[data-pagamento]');
            var pagamento = $tr.data('pagamento');
            var funcionario = $('#txtFuncionario').val();
            var data = $tr.find('td').eq(0).text();
            var mesAnoReferencia = $tr.find('td').eq(1).text();
            var valor = $tr.find('td').eq(2).text();
            abrirModalExclusao(pagamento, funcionario, data, mesAnoReferencia, valor);
        });

        $('#txtFiltroFuncionario').off('change').change(function () {
            var $option = $(this).find(':selected');
            var nome = $option.text();
            var codigo = $option.val();
            var salario = $option.data('salario').split('R$ ').pop();
            $('#txtFuncionario').val(nome);
            $('#txtCodigoFuncionario').val(codigo);
            $('#txtValorPago').val(salario);
            $('#txtFiltroSalario').val(salario);
            if ($('#txtFiltroMesAnoReferencia').val().replace(/\D/g, '').length == 6) {
                carregarPagamentos(codigo, $('#txtFiltroMesAnoReferencia').val());
            }
        });

        $('#txtFiltroMesAnoReferencia').off('change').change(function () {
            $('#txtMesAnoReferencia').val($(this).val());
            if ($(this).val().replace(/\D/g, '').length == 6 && $('#txtFiltroFuncionario').val()) {
                carregarPagamentos($('#txtFiltroFuncionario').val(), $(this).val());
            }
        });

        $('button.recibo').off('click').click(function () {
            var splitedMesAno = $('#txtMesAnoReferencia').val().split('/'),
                codigo = $('#txtCodigoFuncionario').val(),
                mes = splitedMesAno[0],
                ano = splitedMesAno[1];
            if (codigo && mes && ano) {
                location.replace("/funcionario/recibo/" + codigo + "?ano=" + ano + "&mes=" + mes);
            }
        });
    }

    function abrirModalInclusao() {
        var $modal = $('.acao.modal');

        $modal.find('.header').text('Incluir Pagamento');
        $modal.find('.primary').text('Incluir').off().click(function () {
            incluir();
        });

        $modal.openModal();
    }

    function incluir() {
        if (validar()) {
            var splitedMesAno = $('#txtMesAnoReferencia').val().split('/'),
                codigo = $('#txtCodigoFuncionario').val(),
                data = $('#txtData').val(),
                valor = $('#txtValorPago').val(),
                mes = splitedMesAno[0],
                ano = splitedMesAno[1];

            $.ajax({
                type: 'POST',
                url: '/funcionario/incluirpagamento',
                data: {
                    codigo, mes, ano, data, valor
                },
                beforeSend: function () {
                    $('form.acao.modal .modal-footer').append(
                        '<div class="progress">' +
                          '<div class="indeterminate"></div>' +
                        '</div>'
                    );
                },
                success: function (pagamentos) {
                    var $table = $('table.pagamentos');
                    $table.html(pagamentos);
                    Materialize.toast('Pagamento incluído com sucesso', 4000);
                    iniciar();
                },
                error: function () {
                    Materialize.toast('Ocorreu um erro na inclusão de Pagamento', 4000);
                },
                complete: function () {
                    $('#txtFiltroMesAnoReferencia').val(mes + '/' + ano);
                    $('form.acao.modal .modal-footer .progress').remove();
                    $('form.acao.modal').closeModal();
                }
            });
        }
    }

    function abrirModalEdicao(button) {
        var $modal = $('.acao.modal');
        var $tds = $(button).parents('[data-pagamento]').find('td');
        var pagamento = $(button).parents('[data-pagamento]').data('pagamento');

        $modal.find('.header').text('Editar Pagamento');

        $modal.find('#txtData').val($tds.eq(0).text());
        $modal.find('#txtValorPago').val($tds.eq(2).text().split('R$ ').pop());

        $modal.find('.primary').text('Editar').off().click(function () {
            editar(pagamento);
        });

        Musaranha.reativarMask();

        $modal.openModal();
    }

    function editar(pagamento) {
        if (validar()) {
            var splitedMesAno = $('#txtMesAnoReferencia').val().split('/'),
                codigo = $('#txtCodigoFuncionario').val(),
                data = $('#txtData').val(),
                valor = $('#txtValorPago').val(),
                mes = splitedMesAno[0],
                ano = splitedMesAno[1];

            $.ajax({
                type: 'POST',
                url: '/funcionario/editarpagamento',
                data: {
                    codigo, pagamento, mes, ano, data, valor
                },
                beforeSend: function () {
                    $('form.acao.modal .modal-footer').append(
                        '<div class="progress">' +
                          '<div class="indeterminate"></div>' +
                        '</div>'
                    );
                },
                success: function (pagamentos) {
                    var $table = $('table.pagamentos');
                    $table.html(pagamentos);
                    Materialize.toast('Pagamento editado com sucesso', 4000);
                    iniciar();
                },
                error: function () {
                    Materialize.toast('Ocorreu um erro na edição de Pagamento', 4000);
                },
                complete: function () {
                    $('#txtFiltroMesAnoReferencia').val(mes + '/' + ano);
                    $('form.acao.modal .modal-footer .progress').remove();
                    $('form.acao.modal').closeModal();
                }
            });
        }
    }

    function abrirModalExclusao(pagamento, funcionario, data, mesAnoReferencia, valor) {
        var $modal = $('.excluir.modal');
        $modal.find('.info').html('');
        $modal.find('.info').append('<p><b>Funcionário: </b>' + funcionario + '</p>');
        $modal.find('.info').append('<p><b>Data: </b>' + data + '</p>');
        $modal.find('.info').append('<p><b>Mês/Ano de Referência: </b>' + mesAnoReferencia + '</p>');
        $modal.find('.info').append('<p><b>Valor Pago: </b>' + valor + '</p>');

        $modal.find('.primary').off().click(function () {
            excluir(pagamento);
        });

        $modal.openModal();
    }

    function excluir(pagamento) {
        var splitedMesAno = $('#txtMesAnoReferencia').val().split('/'),
            codigo = $('#txtCodigoFuncionario').val(),
            mes = splitedMesAno[0],
            ano = splitedMesAno[1];
        $.ajax({
            type: 'POST',
            url: '/funcionario/excluirpagamento',
            data: {
                codigo, pagamento, ano, mes
                },
            beforeSend: function () {
                $('.excluir.modal .modal-footer').append(
                    '<div class="progress">' +
                      '<div class="indeterminate"></div>' +
                    '</div>'
                );
            },
            success: function (pagamentos) {
                var $table = $('table.pagamentos');
                $table.html(pagamentos);
                Materialize.toast('Pagamento excluído com sucesso', 4000);
                iniciar();
            },
            error: function () {
                Materialize.toast('Ocorreu um erro na exclusão de Pagamento', 4000);
            },
            complete: function () {
                $('#txtFiltroMesAnoReferencia').val(mes + '/' + ano);
                $('form.excluir.modal .modal-footer .progress').remove();
                $('form.excluir.modal').closeModal();
            }
        })
    }

    function validar() {
        var valido = true;

        if (!$('#txtData').val()) {
            $('#txtData').addClass("invalid");
            valido = false;
        }

        if (!$('#txtValorPago').val()) {
            $('#txtValorPago').addClass("invalid");
            valido = false;
        }

        return valido;
    }

    function carregarPagamentos(funcionario, mesAno) {
        var splitedMesAno = mesAno.split('/'),
            codigo = funcionario,
            mes = splitedMesAno[0],
            ano = splitedMesAno[1];
        if (mes && mes <= 12) {
            $.ajax({
                type: 'POST',
                url: '/funcionario/carregarpagamentos',
                data: {
                    codigo,
                    mes,
                    ano
                    },
                success: function (pagamentos) {
                    var $table = $('table.pagamentos');
                    $table.html(pagamentos);
                    Materialize.toast('Pagamentos carregados', 4000);
                    iniciar();
                },
                error: function () {
                    Materialize.toast('Ocorreu um erro na tentativa de carregar os pagamentos', 4000);
                }
            });
        }
    }

    return {
        iniciar: iniciar
    }
})();
