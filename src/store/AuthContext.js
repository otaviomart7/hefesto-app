import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { CHAVES, gravar, ler, remover } from './storage';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// RNF004 — a senha nunca é guardada em texto puro
const hashSenha = (senha) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `hefesto::${senha}`);

const publico = ({ senhaHash, ...resto }) => resto;

export function AuthProvider({ children }) {
  const usuarios = useRef([]);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      usuarios.current = await ler(CHAVES.usuarios, []);
      const sessao = await ler(CHAVES.sessao, null);
      const u = sessao && usuarios.current.find((x) => x.email === sessao.email);
      if (u) setUsuario(publico(u));
      setCarregando(false);
    })();
  }, []);

  const iniciarSessao = useCallback((u) => {
    setUsuario(publico(u));
    gravar(CHAVES.sessao, { email: u.email });
  }, []);

  // RN010 — e-mail único
  const cadastrar = useCallback(
    async ({ nome, email, senha }) => {
      const mail = email.trim().toLowerCase();
      if (usuarios.current.some((u) => u.email === mail)) {
        throw new Error('Este e-mail já está associado a outra conta.');
      }
      const novo = { nome: nome.trim(), email: mail, empresa: '', telefone: '', senhaHash: await hashSenha(senha), criadoEm: new Date().toISOString() };
      usuarios.current = [...usuarios.current, novo];
      await gravar(CHAVES.usuarios, usuarios.current);
      iniciarSessao(novo);
    },
    [iniciarSessao]
  );

  const entrar = useCallback(
    async (email, senha) => {
      const mail = email.trim().toLowerCase();
      const u = usuarios.current.find((x) => x.email === mail);
      if (!u || u.senhaHash !== (await hashSenha(senha))) {
        throw new Error('E-mail ou senha incorretos.');
      }
      iniciarSessao(u);
    },
    [iniciarSessao]
  );

  const sair = useCallback(() => {
    setUsuario(null);
    remover(CHAVES.sessao);
  }, []);

  const atualizarPerfil = useCallback(async (dados) => {
    usuarios.current = usuarios.current.map((u) => (u.email === dados.email ? { ...u, ...dados } : u));
    await gravar(CHAVES.usuarios, usuarios.current);
    setUsuario((atual) => (atual ? { ...atual, ...dados } : atual));
  }, []);

  // Simulação: no app real, enviaria um e-mail de recuperação
  const recuperarSenha = useCallback(async (email) => {
    await new Promise((r) => setTimeout(r, 700));
    return usuarios.current.some((u) => u.email === email.trim().toLowerCase());
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, cadastrar, entrar, sair, atualizarPerfil, recuperarSenha }),
    [usuario, carregando, cadastrar, entrar, sair, atualizarPerfil, recuperarSenha]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
