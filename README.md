# 📖 Papeizinhos evangelísticos

Ferramenta web para montar folhas A4 cheias de **papeizinhos evangelísticos** (cartões com versículos
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
Ao trocar o tamanho, o modo automático continua preenchendo uma folha, e “Completar a folha
repetindo” recalcula as cópias a partir dos textos escolhidos, sem novo sorteio.
O botão de impressão aguarda o carregamento da imagem e a conferência da diagramação;
também fica bloqueado se houver alterações pendentes ou algum texto cortado.

Suas preferências ficam salvas no navegador (localStorage) e voltam na próxima visita.
Valores salvos inválidos são ignorados ou limitados ao intervalo aceito pelo editor.

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
- `src/pagination.js` — preenchimento das folhas a partir da seleção aplicada.
- `src/settings.js` — validação das preferências restauradas do navegador.
- `src/layout.js` — diagramação da folha A4 (grade, marcas de corte, auto-fit, rodapé).
- `src/templates/` — artes de fundo (CSS/SVG).
- `index.html` / `src/app.js` — interface, zoom, persistência e integração.

Veja `PRD.md` (requisitos) e `CONTRACTS.md` (contratos de API entre módulos).

## Verificação

```bash
node tests/smoke.mjs
node tests/pagination.mjs
node tests/settings.mjs
```

As verificações rápidas cobrem limites, preenchimento ao trocar de tamanho, seleção estável,
preferências inválidas, detecção de overflow, prontidão de impressão e validação de imagens,
sem adicionar dependências ao projeto. A conferência visual e de impressão é manual.

Veja o [relatório de melhorias de 09/09/2026](docs/relatorio-melhorias-2026-09-09.md)
para os commits e as instruções de reversão.
