// verses.js — STUB inicial. DONO: Agente "data". Expandir o banco e os temas.
// Texto: Almeida Corrigida Fiel (ACF).

/** @typedef {{id:string, ref:string, text:string, themes:string[]}} Verse */

/** @type {Verse[]} */
export const VERSES = [
  { id: "jo3-16", ref: "João 3:16", themes: ["salvação", "amor"], text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
  { id: "rm10-9", ref: "Romanos 10:9", themes: ["salvação", "fé"], text: "A saber: Se com a tua boca confessares ao Senhor Jesus, e em teu coração creres que Deus o ressuscitou dos mortos, serás salvo." },
  { id: "rm3-23", ref: "Romanos 3:23", themes: ["pecado"], text: "Porque todos pecaram e destituídos estão da glória de Deus." },
  { id: "rm6-23", ref: "Romanos 6:23", themes: ["salvação", "pecado"], text: "Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna, por Cristo Jesus nosso Senhor." },
  { id: "at16-31", ref: "Atos 16:31", themes: ["salvação", "fé"], text: "E eles disseram: Crê no Senhor Jesus Cristo e serás salvo, tu e a tua casa." },
  { id: "ef2-8", ref: "Efésios 2:8", themes: ["graça", "fé"], text: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus." },
  { id: "jo14-6", ref: "João 14:6", themes: ["salvação", "verdade"], text: "Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida. Ninguém vem ao Pai, senão por mim." },
  { id: "rm5-8", ref: "Romanos 5:8", themes: ["amor", "salvação"], text: "Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores." },
  { id: "1jo1-9", ref: "1 João 1:9", themes: ["perdão"], text: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça." },
  { id: "ap3-20", ref: "Apocalipse 3:20", themes: ["convite"], text: "Eis que estou à porta, e bato; se alguém ouvir a minha voz, e abrir a porta, entrarei em sua casa, e com ele cearei, e ele comigo." },
  { id: "mt11-28", ref: "Mateus 11:28", themes: ["convite", "esperança"], text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." },
  { id: "2co5-17", ref: "2 Coríntios 5:17", themes: ["nova vida"], text: "Assim que, se alguém está em Cristo, nova criatura é: as coisas velhas já passaram; eis que tudo se fez novo." },
];

export function listThemes() {
  return [...new Set(VERSES.flatMap((v) => v.themes))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}
