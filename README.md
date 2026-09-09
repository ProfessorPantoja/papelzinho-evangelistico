# 📖 Papeizinhos evangelísticos

## Instruções de trabalho neste projeto

- **SINO obrigatório ao concluir uma rodada de trabalho:** executar
  `bash /home/pantoja/.codex/skills/sino/scripts/task-done.sh` como última ação antes
  da resposta final. Confirmar o toque somente se o script terminar com sucesso;
  se falhar, informar a falha. Não substituir a execução por um emoji.
- Registrar as melhorias em commits reversíveis e informar o estado do Git.
- A validação visual e de impressão fica com o usuário. Não executar automação de
  navegador, testes demorados ou ciclos de polimento sem pedido explícito.

Estas instruções também estão em [AGENTS.md](AGENTS.md), para as próximas rodadas.

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
   O botão **Abrir painel de versículos** abre uma tela ampla para ler o acervo inteiro,
   filtrar por livro/tema/palavra e marcar textos. Use **Usar escolhidos na folha** para
   retornar ao editor no modo manual. **Só escolhidos** facilita revisar sua seleção.
   Em **Ordenar**, use **Maiores primeiro** ou **Menores primeiro** para organizar a
   consulta pela quantidade de caracteres, sem mudar a sequência dos escolhidos.
2. Escolha o tamanho do papelzinho e a arte de fundo na galeria visual. Ative **Alternar várias
   artes na folha** para marcar mais de uma; **Embaralhar ordem das artes** muda a sequência.
3. Ajuste os extras: mesmo versículo na folha toda, completar folha repetindo, logo e rodapé
   com nome/contato da igreja. O rodapé ADMPF começa marcado em cada visita.
4. Confira no preview (zoom −/+/Ajustar; a barra mostra capacidade por folha e nº de folhas).
5. Clique em **Imprimir / PDF**, siga a conferência final e salve como PDF em tamanho A4.

A seleção de versículos permanece estável enquanto você troca arte, tamanho, fonte e rodapé.
Ao trocar o tamanho, o modo automático continua preenchendo uma folha, e “Completar a folha
repetindo” recalcula as cópias a partir dos textos escolhidos, sem novo sorteio.
O botão de impressão aguarda o carregamento da imagem e a conferência da diagramação;
também fica bloqueado se houver alterações pendentes ou algum texto cortado.

**Revisar textos**, na barra da prévia, reúne os papeizinhos cortados ou com fonte abaixo
de 7 pt. Escolha pela folha, número e referência; use **− / +**, digite o tamanho em pt
ou clique em **Restaurar automático**. Cada ajuste muda somente aquela cópia, inclusive
quando há versículos repetidos. Desmarque **Só os marcados para revisão** para acessar
qualquer papelzinho. Os itens corrigidos continuam na lista da revisão aberta, com o
estado atualizado, para permitir novos ajustes.

Fontes abaixo de 7 pt geram um aviso de leitura, mas não bloqueiam a impressão; texto
cortado continua bloqueando. O limite de 7 pt é uma referência para conferência, não
uma garantia de legibilidade. As exceções de fonte são mantidas ao trocar arte, tamanho,
logo e rodapé. Sortear ou aplicar uma seleção novamente, ou recarregar a página, restaura
o automático. O controle geral de fonte continua atuando nas cópias sem ajuste individual.

Suas preferências ficam salvas no navegador (localStorage) e voltam na próxima visita.
Valores salvos inválidos são ignorados ou limitados ao intervalo aceito pelo editor.
As artes escolhidas também são lembradas. Imagens enviadas (fundo e logo) precisam ser
escolhidas novamente ao reabrir a página; o rodapé padrão sempre começa ativo.

Na busca manual, os versículos adicionados saem dos resultados e aparecem na lista de
escolhidos. Use **×** para remover: o versículo volta aos resultados da busca atual.

O campo de imagem mostra as medidas, a proporção e uma sugestão de resolução a 300 dpi
para o tamanho escolhido. Fundos preenchem o papelzinho e podem ter as bordas recortadas
quando a proporção é diferente. O logo usa uma área de até 26 × 10 mm, sem recorte.

## Funcionalidades
- **3 modos de seleção**: aleatório com 17 temas, busca manual e colar texto.
- **Banco curado**: 129 trechos ACF, incluindo referências com dois versículos consecutivos;
  revisão do acervo anterior e 17 novos trechos em 09/09/2026.
- **Painel de versículos** com leitura integral, filtros, seleção e links para o contexto
  no site oficial da SBTB. As notas de leitura são editoriais e não são impressas.
- **5 tamanhos otimizados** para máximo aproveitamento da folha A4 + auto-ajuste de fonte.
- **Galeria acessível com 22 artes de fundo** em CSS/SVG (leves, imprimem nítido e gastam pouca
  tinta) + upload validado de imagem própria com clareador de legibilidade.
- **Marcas de corte** nos cantos para guiar o recorte.
- **Rodapé padrão da Igreja ADMPF**, ativo em cada visita, com campo separado para texto extra e upload de logo.
- **Preflight de impressão** com detecção de overflow, resumo de páginas e instruções para A4.
- **Impressão fiel A4** via CSS Print (`@page size: A4`).

## Estrutura (módulos independentes)
- `src/data/verses.js` + `src/selection.js` — 129 trechos ACF em uma lista JavaScript
  exportada como `VERSES` (campos `id`, `ref`, `text`, `themes` e `context` opcional) e lógica de seleção. Não há arquivo JSON separado.
- `src/verse-library.js` — painel de leitura e escolha, compartilhando a seleção do editor.
- `src/tract-review.js` — revisão das cópias da folha e controle individual da fonte.
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

Os [refinamentos de seleção, artes e identificação da igreja](docs/refinamentos-ux-2026-09-09.md)
incluem um checklist curto para conferência manual. Essa rodada não teve execução de testes.

Veja a [revisão individual ACF](docs/revisao-acf-2026-09-09.md) para as fontes, os 112 registros
conferidos e os 17 novos trechos. A conferência textual utilizou o serviço do site oficial;
a interface nova e a impressão ficam para avaliação manual.

Texto bíblico: Almeida Corrigida Fiel (ACF), © 1994, 1995, 2007, 2011 Sociedade Bíblica
Trinitariana do Brasil / Trinitarian Bible Society. Consulte as
[condições de citação da SBTB](https://www.biblias.com.br/direitos-autorais).

Para conferir a ordenação e os ajustes individuais:

- Ordene por **Maiores primeiro** e escolha alguns textos longos.
- Em **Revisar textos**, diminua a fonte de uma cópia e confirme que as demais permanecem iguais.
- Experimente **Restaurar automático** e confira a prévia/PDF antes de imprimir.
