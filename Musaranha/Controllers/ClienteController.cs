﻿using System;
using System.Linq;
using System.Web.Mvc;
using Musaranha.Models;

namespace Musaranha.Controllers
{
    [Filters.AutenticacaoFilter]
    public class ClienteController : Controller
    {
        // GET: /cliente
        public ActionResult Index() => View(Cliente.Listar());

        // POST: /cliente/incluir
        [HttpPost]
        public ActionResult Incluir(FormCollection form)
        {
            if (form.HasKeys())
            {
                Cliente cliente = new Cliente();

                /* Dados Pessoais */
                cliente.Pessoa = new Pessoa();
                cliente.Pessoa.Tipo = form["txtTipo"] ?? "N";
                cliente.Pessoa.Nome = form["txtNome"];

                int n = 1;
                while (!String.IsNullOrWhiteSpace(form[$"txtTelefone{n}"]))
                {
                    string numTelefone = form[$"txtTelefone{n}"].SomenteNumeros();
                    if (numTelefone.Length == 11 || numTelefone.Length == 10)
                    {
                        cliente.Pessoa.Telefone.Add(new Telefone { NumTelefone =  numTelefone});
                    }
                    n++;
                }

                switch (cliente.Pessoa.Tipo)
                {
                    case "F":
                        cliente.Pessoa.CPF = form["txtCPFOuCNPJ"].SomenteNumeros() ?? null;
                        break;
                    case "J":
                        cliente.Pessoa.CNPJ = form["txtCPFOuCNPJ"].SomenteNumeros() ?? null;
                        break;
                    default:
                        break;
                }
                cliente.Pessoa.Email = form["txtEmail"] ?? null;

                /* Endereço */
                if (!String.IsNullOrWhiteSpace(form["txtLogradouro"]))
                {
                    cliente.Pessoa.Endereco = new Endereco();
                    cliente.Pessoa.Endereco.Logradouro = form["txtLogradouro"];
                    cliente.Pessoa.Endereco.Numero = form["txtNumero"];
                    cliente.Pessoa.Endereco.Complemento = form["txtComplemento"];
                    cliente.Pessoa.Endereco.Bairro = form["txtBairro"];
                    cliente.Pessoa.Endereco.Cidade = form["txtCidade"];
                    cliente.Pessoa.Endereco.Estado = form["txtEstado"];
                    cliente.Pessoa.Endereco.CEP = form["txtCEP"].SomenteNumeros();
                }

                Cliente.Incluir(cliente);

                return PartialView("_Lista", Cliente.Listar());
            }
            return Json(false);
        }

        // POST: /cliente/editar/5
        [HttpPost]
        public ActionResult Editar(int cod, FormCollection form)
        {
            if (cod > 0 && form.HasKeys())
            {
                Cliente cliente = Cliente.ObterPorCodigo(cod);

                /* Dados Pessoais */
                cliente.Pessoa.Tipo = form["txtTipo"] ?? "N";
                cliente.Pessoa.Nome = form["txtNome"];
                cliente.Pessoa.Telefone.Clear();
                int n = 1;
                while (!String.IsNullOrWhiteSpace(form[$"txtTelefone{n}"]))
                {
                    cliente.Pessoa.Telefone.Add(new Telefone { NumTelefone = form[$"txtTelefone{n}"].SomenteNumeros() });
                    n++;
                }
                switch (cliente.Pessoa.Tipo)
                {
                    case "F":
                        cliente.Pessoa.CPF = form["txtCPFOuCNPJ"].SomenteNumeros() ?? null;
                        cliente.Pessoa.CNPJ = null;
                        break;
                    case "J":
                        cliente.Pessoa.CNPJ = form["txtCPFOuCNPJ"].SomenteNumeros() ?? null;
                        cliente.Pessoa.CPF = null;
                        break;
                    default:
                        break;
                }
                cliente.Pessoa.Email = form["txtEmail"] ?? null;

                /* Endereço */
                if (!String.IsNullOrWhiteSpace(form["txtLogradouro"]))
                {
                    if (cliente.Pessoa.Endereco == null)
                        cliente.Pessoa.Endereco = new Endereco();
                    cliente.Pessoa.Endereco.Logradouro = form["txtLogradouro"];
                    cliente.Pessoa.Endereco.Numero = form["txtNumero"];
                    cliente.Pessoa.Endereco.Complemento = form["txtComplemento"] ?? null;
                    cliente.Pessoa.Endereco.Bairro = form["txtBairro"];
                    cliente.Pessoa.Endereco.Cidade = form["txtCidade"];
                    cliente.Pessoa.Endereco.Estado = form["txtEstado"];
                    cliente.Pessoa.Endereco.CEP = form["txtCEP"].SomenteNumeros();
                }
                else
                {
                    if (cliente.Pessoa.Endereco != null)
                        Contexto.Current.Endereco.Remove(cliente.Pessoa.Endereco);
                    cliente.Pessoa.Endereco = null;
                }

                Cliente.Editar(cliente);

                return PartialView("_Lista", Cliente.Listar());
            }
            return Json(false);
        }

        // POST: /cliente/excluir/5
        [HttpPost]
        public ActionResult Excluir(int cod)
        {
            if (cod != 0)
            {
                Cliente cliente = Cliente.ObterPorCodigo(cod);

                Cliente.Excluir(cliente);

                return PartialView("_Lista", Cliente.Listar());
            }
            return Json(false);
        }

        // POST: /cliente/json/5
        [HttpPost]
        public ActionResult Json(int cod)
        {
            Cliente cliente = Cliente.ObterPorCodigo(cod);
            return Json(new
            {
                Nome = cliente.Pessoa.Nome,
                Telefones = cliente.Pessoa.Telefone.Select(t => t.NumTelefone),
                Logradouro = cliente.Pessoa.Endereco?.Logradouro ?? "",
                Numero = cliente.Pessoa.Endereco?.Numero ?? "",
                Complemento = cliente.Pessoa.Endereco?.Complemento ?? "",
                CEP = cliente.Pessoa.Endereco?.CEP ?? "",
                Bairro = cliente.Pessoa.Endereco?.Bairro ?? "",
                Cidade = cliente.Pessoa.Endereco?.Cidade ?? "",
                Estado = cliente.Pessoa.Endereco?.Estado ?? "",
                Tipo = cliente.Pessoa.Tipo ?? "",
                CPF = cliente.Pessoa.CPF ?? "",
                CNPJ = cliente.Pessoa.CNPJ ?? "",
                Email = cliente.Pessoa.Email ?? ""
            });
        }
    }
}