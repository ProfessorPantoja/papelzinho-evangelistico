# 📖 Papelzinhos evangelísticos

Ferramenta web para montar folhas A4 cheias de **papelzinhos evangelísticos** (cartões com versículos
da Bíblia, versão **Almeida Corrigida Fiel — ACF**), prontos para imprimir e recortar.

## Como usar
Abra o `index.html` no navegador (via servidor local ou hospedagem — a página usa ES modules).
Sem build, sem dependências.

```bash
# opção simples de servidor local:
python3 -m http.server 8000
# e abra http://localhost:8000
```

1. Escolha os versículos (aleatório com tema opcional, seleção manual ou texto colado).
2. Escolha o tamanho do papelzinho e a arte de fundo na galeria visual (22 templates ou sua própria imagem).
3. Ajuste os extras: mesmo versículo na folha toda, completar folha repetindo, rodapé com
   nome/contato da igreja.
4. Confira no preview (zoom −/+/Ajustar; a barra mostra capacidade por folha e nº de folhas).
5. Clique em **Imprimir / PDF**, siga a conferência final e salve como PDF em tamanho A4.

A seleção de versículos permanece estável enquanto você troca arte, tamanho, fonte e rodapé.
A impressão é bloqueada se houver alterações pendentes ou algum texto cortado.

Suas preferências ficam salvas no navegador (localStorage) e voltam na próxima visita.

## Funcionalidades
- **3 modos de seleção**: aleatório com 17 temas, busca manual e colar texto.
- **Banco curado**: 112 versículos evangelísticos na ACF.
- **5 tamanhos otimizados** para máximo aproveitamento da folha A4 + auto-ajuste de fonte.
- **Galeria acessível com 22 artes de fundo** em CSS/SVG (leves, imprimem nítido e gastam pouca
  tinta) + upload validado de imagem própria com clareador de legibilidade.
- **Marcas de corte** nos cantos para guiar o recorte.
- **Rodapé padrão da Igreja ADMPF** com campo separado para texto extra.
- **Preflight de impressão** com detecção de overflow, resumo de páginas e instruções para A4.
- **Impressão fiel A4** via CSS Print (`@page size: A4`).

## Estrutura (módulos independentes)
- `src/data/` + `src/selection.js` — banco de versículos ACF e lógica de seleção.
- `src/layout.js` — diagramação da folha A4 (grade, marcas de corte, auto-fit, rodapé).
- `src/templates/` — artes de fundo (CSS/SVG).
- `index.html` / `src/app.js` — interface, zoom, persistência e integração.

Veja `PRD.md` (requisitos) e `CONTRACTS.md` (contratos de API entre módulos).

## Verificação

```bash
node tests/smoke.mjs
```

O smoke test cobre limites, paginação, detecção de overflow, prontidão de impressão e validação
de imagens sem adicionar dependências ao projeto.
