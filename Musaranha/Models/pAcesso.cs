﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Musaranha.Models
{
    public partial class Acesso
    {
        private static MusaranhaEntities c => Contexto.Current;

        public static bool Autenticado(string usuario, string senha)
        {
            var acesso = c.Acessos.FirstOrDefault(x => x.Usuario == usuario);
            if (acesso?.Senha == Criptografia.GerarMD5Hash(senha))
            {
                return true;
            }
            return false;
        }        
    }
}