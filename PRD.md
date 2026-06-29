# PRD — Renderizador de Papelzinhos Evangelísticos

> **Status:** Rascunho para discussão (pré-execução)
> **Autor:** Art Pantoja
> **Data:** 2026-06-29
> **Objetivo deste documento:** registrar tudo que foi descrito sobre o projeto, organizar os requisitos, levantar as decisões em aberto e propor sugestões antes de começarmos a implementar.

---

## 1. Visão Geral

Criar uma ferramenta (aplicação web) que **monta e renderiza folhas A4 cheias de "papelzinhos" evangelísticos** — pequenos cartões/folhetos contendo versículos bíblicos — prontos para imprimir e recortar.

A ideia central: o usuário escolhe versículos (de várias formas), escolhe um tamanho e um design de fundo, e a ferramenta diagrama automaticamente **vários papelzinhos lado a lado** preenchendo a folha A4, otimizando o aproveitamento do papel.

### Resultado final esperado
Uma folha A4 (na tela e em PDF/impressão) com **vários bloquinhos um do lado do outro**, cada um com um versículo escrito dentro, com marcas de corte para facilitar o recorte.

---

## 2. Personas / Casos de Uso

- **Evangelista/membro de igreja** que quer imprimir dezenas de folhetinhos baratos para distribuir.
- Quer **rapidez**: gerar uma folha cheia em poucos cliques.
- Quer **variedade**: vários versículos diferentes na mesma folha (ou repetir o mesmo, se preferir).
- Quer **economia de papel**: o máximo de papelzinhos por folha A4.
- Quer **aparência agradável**: não um retângulo branco vazio, mas algo com um fundo bonito.

---

## 3. Requisitos Funcionais

### 3.1. Seleção de versículos (formas de entrada)
O usuário pode montar a lista de versículos de **4 formas**:

1. **Aleatório** — a ferramenta sorteia versículos de um banco de dados.
   - Opção de definir quantos papelzinhos / quantos versículos sortear.
   - Opção de filtrar por tema, livro ou tamanho (ver decisões em aberto).
2. **Escolha manual** — o usuário busca e seleciona versículos específicos (ex.: João 3:16).
3. **Colar texto** — o usuário cola texto de outro lugar (um ou vários versículos), e a ferramenta usa como conteúdo dos papelzinhos.
4. **Geração assistida** — o usuário pede para "gerar" versículos (ex.: por tema "salvação", "esperança", "amor de Deus"), e a ferramenta sugere/monta a seleção.

### 3.2. Versão da Bíblia
- Base padrão: **Almeida Corrigida Fiel (ACF)**.
- O texto dos versículos deve seguir essa versão.
- *(Sugestão: arquitetar para permitir outras versões no futuro — ver Seção 7.)*

### 3.3. Tamanho dos papelzinhos
- Existe um **tamanho padrão otimizado** (escolhido para caber o máximo possível por folha A4).
- O usuário **pode alterar** o tamanho (escolher dentre presets e/ou definir medidas).
- A folha A4 é preenchida automaticamente com a maior quantidade possível de papelzinhos daquele tamanho.

### 3.4. Design / arte de fundo
- Cada papelzinho pode ter uma **arte de fundo** (para não ficar um folheto branco e sem graça).
- Deve existir a opção de **ficar totalmente liso** (sem arte / fundo branco).
- A ferramenta oferece **vários templates de arte** prontos para escolher.
- As artes podem ser criadas em **HTML/CSS/SVG** (sem depender necessariamente de imagens externas).
- Possibilidade futura de o usuário **criar/customizar o próprio design**.

### 3.5. Layout e diagramação da folha A4
- A folha de saída é **A4**.
- Os papelzinhos ficam dispostos **em grade, lado a lado**, preenchendo a folha.
- Deve haver **marcas de corte / linhas de recorte** (ou margem de respiro) entre os papelzinhos.
- A saída precisa ser **impressa / exportada em PDF** com fidelidade (tamanho A4 real).

### 3.6. Tratamento de versículos de tamanhos diferentes (EM ABERTO)
> Esta é a parte que ainda não foi decidida. Registrando as opções discutidas:

- **Problema:** alguns versículos são curtos, outros longos. Em um grid de células fixas, um versículo longo pode não caber.
- **Opções levantadas:**
  - (a) **Tamanho de papel fixo + só usar versículos pequenos** quando o sorteio for aleatório.
  - (b) **Tamanho de papel fixo + ajuste automático da fonte** (o texto diminui para caber).
  - (c) **Versículo grande ocupa dois espaços** (uma célula "dupla" na grade), e o resto preenche normalmente.
- Decisão a tomar depois (ver Seção 8).

---

## 4. Requisitos Não-Funcionais

- **Impressão fiel:** o que aparece na tela deve sair igual no papel (CSS de impressão `@page size: A4`, margens controladas).
- **Funciona offline / sem servidor pesado:** idealmente roda no navegador (banco de versículos local).
- **Rápido e simples de usar:** poucos cliques até a folha pronta.
- **Responsivo o suficiente** para configurar no desktop (foco em desktop, já que é para impressão).
- **Português (pt-BR)** como idioma da interface.

---

## 5. Sugestão de Arquitetura / Stack (minha recomendação)

> Recomendação para discussão — nada fechado.

- **Aplicação web 100% no navegador** (sem backend obrigatório no MVP):
  - **HTML + CSS + JavaScript**, possivelmente com **React + Vite** para organizar a interface.
  - Alternativa mais leve: HTML/CSS/JS "puro" se quisermos algo bem simples.
- **Layout da folha:** **CSS Grid** + **CSS Print** (`@media print`, `@page { size: A4; margin: ... }`). Isso permite que a própria função "Imprimir" do navegador gere o PDF em A4 perfeito, sem biblioteca pesada.
- **Banco de versículos ACF:** arquivo **JSON local** com os versículos (ver Seção 6 sobre a fonte dos dados).
- **Artes de fundo:** **CSS/SVG** (gradientes, molduras, ornamentos vetoriais) — leves, escaláveis e imprimem nítido. Bibliotecas opcionais para ícones/ornamentos (ex.: ícones SVG livres).
- **Exportar PDF:**
  - MVP: usar o **Imprimir → Salvar como PDF** do navegador (mais simples e fiel).
  - Evolução: botão "Exportar PDF" com biblioteca (ex.: `html2pdf`/`jsPDF`/`print-js`) se quisermos download direto.
- **Geração assistida de versículos por tema:** no MVP pode ser **filtro por tema/palavra-chave** sobre o banco local; numa evolução, integração com IA para sugerir conjuntos temáticos.

---

## 6. Fonte dos Dados (ACF) — Ponto de Atenção

- O texto da **Almeida Corrigida Fiel (ACF)** é publicado pela **Sociedade Bíblica Trinitariana do Brasil** e tem **direitos autorais**. Vale considerarmos:
  - Uso pessoal/ministerial costuma ser tranquilo, mas convém ter clareza sobre a fonte do texto.
  - **Decisão necessária:** de onde virá o JSON dos versículos (base aberta, digitação própria, ou outra versão de domínio público como Almeida 1911 / João Ferreira de Almeida Livre como fallback).
- **Sugestão:** começar com um **conjunto curado de versículos evangelísticos populares** (João 3:16, Romanos 10:9, Atos 16:31, Efésios 2:8-9, etc.) na ACF, e ir expandindo. Isso já cobre 90% dos casos de uso evangelístico e evita carregar a Bíblia inteira no MVP.

---

## 7. Escopo

### MVP (primeira versão)
1. Banco curado de versículos evangelísticos em ACF (JSON).
2. Seleção: **aleatório**, **manual** e **colar texto**.
3. Tamanho padrão otimizado + 2–3 presets de tamanho.
4. Diagramação automática em grade na folha A4 com marcas de corte.
5. 3–4 templates de arte de fundo (incluindo o "liso/branco").
6. Impressão / exportação em PDF.

### Pós-MVP (evolução)
- Geração assistida por tema (com IA).
- Editor de tamanho livre (medidas customizadas).
- Editor/criador de artes personalizadas (upload de imagem de fundo, logo da igreja, espaço para contato).
- Suporte a versículos longos ocupando célula dupla (opção c).
- Mais versões da Bíblia.
- Salvar/recarregar "projetos" de folhas.
- Frente e verso (ex.: versículo na frente, dados de contato/igreja no verso).

---

## 8. Decisões em Aberto (precisam da sua resposta)

1. **Versículos de tamanho variado:** qual abordagem no MVP? (a) só versículos curtos, (b) auto-ajuste da fonte, ou (c) células duplas para os grandes?
2. **Fonte dos dados ACF:** banco curado pequeno (recomendado p/ MVP) ou Bíblia completa? De onde tiramos o texto?
3. **Tamanho padrão do papelzinho:** tem uma medida em mente (ex.: ~5×9 cm, estilo cartão), ou deixo eu sugerir um valor otimizado?
4. **Stack:** topa React + Vite, ou prefere algo mais simples em HTML/CSS/JS puro?
5. **Identidade visual:** quer espaço fixo no papelzinho para nome/contato da igreja, ou só o versículo?

---

## 9. Minhas Sugestões Extras

- **Marcas de corte e sangria:** incluir linhas-guia pontilhadas para recorte fácil (com tesoura) e opção de "borda só de respiro" para quem usa guilhotina.
- **Referência sempre visível:** mostrar a referência do versículo (ex.: "João 3:16 — ACF") em destaque no papelzinho — é o que a pessoa usa pra procurar depois.
- **Modo "mesma mensagem" x "variado":** alternar entre folha toda com o mesmo versículo (bom pra campanhas focadas) ou variada.
- **Pré-visualização fiel:** preview na tela já no formato A4, com zoom, pra conferir antes de imprimir.
- **Tipografia legível:** fonte serifada clássica para o versículo + opção de tamanho de fonte; auto-fit para textos maiores.
- **QR Code opcional:** espaço para um QR (link da igreja, plano de salvação, WhatsApp) — aumenta muito a taxa de retorno de folhetos.
- **Economia de tinta:** opção "modo econômico" (artes mais leves/contornos) pra não gastar muita tinta na impressão em massa.
- **Acessibilidade de impressão:** garantir bom contraste texto/fundo (artes de fundo bem suaves para não atrapalhar a leitura do versículo).

---

## 10. Próximos Passos

1. Você revisa este PRD e responde as **Decisões em Aberto** (Seção 8).
2. Ajusto o PRD conforme suas respostas.
3. Monto um **protótipo HTML** de uma folha A4 com papelzinhos + 1–2 templates de arte, só pra você ver o resultado e validarmos o visual.
4. A partir do protótipo aprovado, implementamos o MVP completo.
