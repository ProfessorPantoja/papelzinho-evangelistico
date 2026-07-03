# 📖 Papelzinhos Evangelísticos

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

1. Escolha os versículos (aleatório, manual, colar texto ou gerar por tema).
2. Escolha o tamanho do papelzinho e a arte de fundo (22 templates ou sua própria imagem).
3. Ajuste os extras: mesmo versículo na folha toda, completar folha repetindo, rodapé com
   nome/contato da igreja.
4. Confira no preview (zoom −/+/Ajustar; a barra mostra capacidade por folha e nº de folhas).
5. Clique em **Imprimir / PDF** (ou `Ctrl+P`) e salve como PDF em tamanho A4.

Suas preferências ficam salvas no navegador (localStorage) e voltam na próxima visita.

## Funcionalidades
- **4 modos de seleção**: aleatório, busca manual, colar texto, gerar por tema (17 temas).
- **Banco curado**: 112 versículos evangelísticos na ACF.
- **5 tamanhos otimizados** para máximo aproveitamento da folha A4 + auto-ajuste de fonte.
- **22 artes de fundo** em CSS/SVG (leves, imprimem nítido e gastam pouca tinta) + upload de
  imagem própria com clareador de legibilidade.
- **Marcas de corte** nos cantos para guiar o recorte.
- **Rodapé opcional** (igreja/contato) em cada papelzinho.
- **Impressão fiel A4** via CSS Print (`@page size: A4`).

## Estrutura (módulos independentes)
- `src/data/` + `src/selection.js` — banco de versículos ACF e lógica de seleção.
- `src/layout.js` — diagramação da folha A4 (grade, marcas de corte, auto-fit, rodapé).
- `src/templates/` — artes de fundo (CSS/SVG).
- `index.html` / `src/app.js` — interface, zoom, persistência e integração.

Veja `PRD.md` (requisitos) e `CONTRACTS.md` (contratos de API entre módulos).
