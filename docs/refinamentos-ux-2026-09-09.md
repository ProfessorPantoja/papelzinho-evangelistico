# Refinamentos para conferência manual

Implementados a partir de `774e96c`, em commits locais reversíveis:

- `970326f`: busca mostra todos os resultados ainda disponíveis; escolher remove o item
  da busca e remover dos escolhidos o devolve. Rodapé ADMPF ativo ao abrir a página.
- `6228756`: seleção de várias artes, alternância contínua entre papeizinhos e páginas,
  opção de embaralhar a ordem e gravação das artes escolhidas nas preferências.
- `beeb8bb`: upload de logo acima do rodapé, sem recorte; orientação de medidas, proporção
  e resolução do fundo conforme o tamanho escolhido. Imagens não ficam salvas após recarregar.

O rodapé pode ser desmarcado para a impressão atual; começa marcado novamente ao reabrir.
As artes alternam na ordem selecionada. Embaralhar muda essa ordem sem sortear versículos.
O banco contém 112 versículos em `src/data/verses.js`, na lista JavaScript `VERSES`,
com os campos `id`, `ref`, `text` e `themes`.

Não foram executados testes, navegação automatizada ou validação visual nesta rodada,
conforme pedido. A avaliação do resultado fica com o usuário.

## Checklist curto

- [ ] Buscar “João”, adicionar três versículos e remover um: ele deve voltar à busca.
- [ ] Marcar três artes e conferir a alternância; experimentar “Embaralhar ordem”.
- [ ] Trocar o tamanho e conferir a dica de proporção/resolução da imagem.
- [ ] Enviar/remover o logo; reabrir a página e conferir o rodapé marcado.
- [ ] No navegador externo, salvar/imprimir duas folhas e conferir fonte, logo, fundos e cortes.

Para desfazer uma melhoria, use `git revert HASH` com o commit correspondente, mantendo
o histórico. Para apenas consultar a versão anterior com a árvore limpa, use
`git switch --detach 774e96c`; retorne com `git switch codex/melhorias-editor-2026-09-09`.
