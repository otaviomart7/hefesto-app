# Hefesto — Aplicativo Mobile (Expo + React Native)

App do cliente da **Hefesto · Manufatura Aditiva (Impressão 3D)**. Complementa o site: aqui o foco é **pedir orçamento, aprovar e acompanhar pedidos**. Visual extraído do export do Figma (frames `Mobile — …`), dados e regras vindos da versão web (`hefesto-web`).

## Como rodar

```bash
npm install
npx expo install --fix     # alinha as versões das libs ao SDK instalado
npx expo start             # abra no Expo Go (QR code) ou pressione a / i / w
```

Requer Node 18+ e o app **Expo Go** no celular (ou emulador Android/iOS).

## Telas (mapeadas ao Figma e ao site)

| Tela do app | Frame do Figma | Página do site |
|---|---|---|
| Splash animada | — | — |
| Entrar / Cadastrar | `Mobile — Entrar`, `Mobile — Cadastrar` | `Login` |
| Início | — | `Home` |
| Materiais (busca, linhas, cor) | — | `Produtos` |
| Detalhes do material | `Mobile — Detalhes do Produto` | `DetalheProduto` |
| Carrinho | `Mobile — Carrinho` | `Carrinho` |
| Solicitação de orçamento | `Mobile — Solicitação de Orçamento` | `Orcamento` |
| Confirmação | — | `Confirmacao` |
| Área do cliente (Solicitações / Pedidos) | `Mobile — Área do Cliente`, `Mobile — Pedidos` | `AreaCliente` |
| Detalhe da solicitação (linha do tempo, aprovar/recusar/cancelar) | — | — (exclusivo do app) |
| Contato + FAQ | `Mobile — Contato` | `Contato` |

Fora do app de propósito (ficam só no site): Sobre, Soluções e o painel administrativo.

## Rastreabilidade (requisitos → app)

| Requisito / regra | Onde está no app |
|---|---|
| RF cadastrar usuário / login / sair | `AuthScreen`, `ContaScreen` (Sair) |
| RF consultar e pesquisar materiais | `MateriaisScreen` |
| RF detalhes do material | `DetalhesScreen` |
| RF solicitar orçamento (com upload 3D) | `OrcamentoScreen` |
| RF acompanhar solicitação / histórico | `ContaScreen` + `PedidoScreen` |
| Caso de uso do app: visualizar e aprovar orçamento | `PedidoScreen` (card "Orçamento disponível") |
| Caso de uso do app: suporte | `ContatoScreen` (formulário + FAQ) |
| RN001 / RN008 — cadastro e autenticação obrigatórios para solicitar | `AuthGate` em Orçamento e Pedidos |
| RN003 — orçamento exige serviço/material, quantidade e contato | validação em `OrcamentoScreen` |
| RN005 — cancelar só antes da execução | `CANCELAVEIS` em `utils/status.js` |
| RN006 — fluxo de status | `FLUXO` em `utils/status.js` + `Timeline` |
| RN009 — obrigatórios não vão vazios | validação em todos os formulários |
| RN010 — e-mail válido e único | `utils/validators.js` + `AuthContext.cadastrar` |
| RNF001/008 — responsivo | `useLayout()` (escala por largura, conteúdo centralizado até 560 px) |
| RNF004 — senha protegida | hash SHA-256 (`expo-crypto`) antes de salvar |
| RNF005 — erros compreensíveis | mensagens por campo + toasts |

## Como funciona sem servidor

Tudo é salvo no aparelho (AsyncStorage): contas, carrinho e solicitações. Para demonstrar o rastreio, o andamento é **simulado**: depois de enviada, a solicitação avança sozinha (Solicitada → Em análise → Orçamento enviado), o app avisa com um banner, o cliente aprova e o pedido segue (Aprovada → Em execução → Concluída). Ajuste os tempos em `ATRASO_ETAPA` (`src/store/OrdersContext.js`). O valor do orçamento também é uma estimativa simples (`calcularOrcamento`): material × 120 g por peça + taxa de serviço + itens do carrinho.

Para ligar a uma API real, troque as funções de `src/store/*` mantendo as mesmas assinaturas.

## Estrutura

```
App.js                    fontes + providers
src/theme                 tokens do Figma + hook de responsividade
src/data                  materiais.json (do site) + helpers do catálogo
src/store                 Auth, Carrinho, Pedidos, Toast (+ storage)
src/components            Header, Button, Field, SelectField, Tabs, Timeline…
src/screens               telas
src/navigation            stack + abas
```
