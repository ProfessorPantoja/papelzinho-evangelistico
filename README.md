# 📖 Papelzinhos Evangelísticos

Ferramenta web para montar folhas A4 cheias de **papelzinhos evangelísticos** (cartões com versículos
da Bíblia, versão **Almeida Corrigida Fiel — ACF**), prontos para imprimir e recortar.

## Como usar
Abra o `index.html` no navegador. Sem instalação, sem build.

1. Escolha os versículos (aleatório, manual, colar texto ou gerar por tema).
2. Escolha o tamanho do papelzinho e a arte de fundo.
3. Clique em **Gerar / Atualizar** para ver a folha A4.
4. Clique em **Imprimir / PDF** (ou `Ctrl+P`) e salve como PDF em tamanho A4.

## Estrutura (módulos independentes)
- `src/data/` + `src/selection.js` — banco de versículos ACF e lógica de seleção.
- `src/layout.js` — diagramação da folha A4 (grade, marcas de corte, auto-fit).
- `src/templates/` — artes de fundo (CSS/SVG).
- `index.html` / `src/app.js` — interface e integração.

Veja `PRD.md` (requisitos) e `CONTRACTS.md` (contratos de API entre módulos).
