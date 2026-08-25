# Mais Atacadista Pet — site institucional B2B

Site estático (HTML/CSS/JS puro, sem dependências) para distribuidora atacadista de produtos pet
com **venda exclusiva para CNPJ**.

## Estrutura

```
index.html      Home: hero + consulta de CNPJ, categorias, diferenciais, como comprar,
                tabela de condições comerciais, marcas, logística, depoimentos, FAQ, cadastro
catalogo.html   Vitrine de 32 produtos com filtro por categoria, busca, ordenação,
                preço bloqueado ("sob cadastro") e lista de cotação
cadastro.html   Formulário completo de credenciamento PJ + login da área do lojista
css/style.css   Design system (tokens de cor, componentes, responsivo)
js/main.js      Máscaras, validação de CNPJ, FAQ, filtros, lista de cotação, reveal
assets/logo.jpg Logomarca
```

Basta abrir `index.html` no navegador — não precisa de build nem servidor.

## Identidade visual

Paleta extraída da logo:

| Token      | Hex       | Uso                              |
|------------|-----------|----------------------------------|
| `--ink`    | `#050505` | fundo principal                  |
| `--gold`   | `#FDC72B` | destaques, links, títulos        |
| `--orange` | `#F07C0A` | meio do degradê da marca         |
| `--burnt`  | `#D74D04` | fim do degradê                   |
| `--silver` | `#D9D4D0` | efeito metálico da palavra MAIS  |

Tipografia: **Barlow Condensed** (títulos, caixa alta — ecoa o logotipo) + **Inter** (texto).
Todos os tokens ficam em `:root` no topo de `css/style.css`.

## Posicionamento B2B

O caráter "somente CNPJ" aparece em todas as camadas do site:

- barra superior fixa avisando que a venda é exclusiva para pessoa jurídica;
- consulta de CNPJ no hero, com validação real dos dígitos verificadores;
- preços do catálogo bloqueados até a aprovação do cadastro;
- tabela de desconto progressivo por volume, prazos de pagamento e política de frete;
- formulário com IE, regime tributário, faixa de volume e declaração de PJ;
- FAQ tratando pedido mínimo, substituição tributária, primeira compra e devoluções.

## O que ajustar antes de publicar

1. **Contatos** — telefone `(11) 4002-8922`, e-mail, endereço e CNPJ do rodapé são fictícios.
   Estão em `index.html`, `catalogo.html`, `cadastro.html` e no link do WhatsApp (`wa.me/...`).
2. **Números e condições** — SKUs, faixas de desconto, prazos e cobertura logística são
   exemplos; troque pelos dados reais da operação.
3. **Produtos e marcas** — os 32 itens do catálogo e as 12 marcas são placeholders.
4. **Envio dos formulários** — hoje o `submit` é simulado no front (`js/main.js`, bloco
   "Envio dos formulários"). Aponte para o seu backend, CRM ou serviço de formulário.
5. **Login do lojista** — o box "Já é cliente?" é apenas visual, precisa de integração.

## Verificações já feitas

- validação de CNPJ testada com casos válidos e inválidos (dígitos verificadores, sequências repetidas);
- filtros, busca, ordenação, estado vazio e lista de cotação (localStorage) testados no navegador;
- acordeão do FAQ com abertura exclusiva;
- layout conferido em 1440px, 390px e 360px;
- conteúdo permanece visível mesmo sem JavaScript (as animações de entrada só são aplicadas com JS ativo).
