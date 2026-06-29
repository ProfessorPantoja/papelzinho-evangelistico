// verses.js — Banco curado de versículos evangelísticos. DONO: Agente "data".
// Texto: Almeida Corrigida Fiel (ACF).

/** @typedef {{id:string, ref:string, text:string, themes:string[]}} Verse */

/** @type {Verse[]} */
export const VERSES = [
  // ——— Salvação / Fé / Graça ———
  { id: "jo3-16", ref: "João 3:16", themes: ["salvação", "amor", "vida eterna"], text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
  { id: "jo3-17", ref: "João 3:17", themes: ["salvação", "amor"], text: "Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele." },
  { id: "jo3-36", ref: "João 3:36", themes: ["salvação", "fé", "vida eterna"], text: "Aquele que crê no Filho tem a vida eterna; mas aquele que não crê no Filho não verá a vida, mas a ira de Deus sobre ele permanece." },
  { id: "rm10-9", ref: "Romanos 10:9", themes: ["salvação", "fé"], text: "A saber: Se com a tua boca confessares ao Senhor Jesus, e em teu coração creres que Deus o ressuscitou dos mortos, serás salvo." },
  { id: "rm10-10", ref: "Romanos 10:10", themes: ["salvação", "fé"], text: "Visto que com o coração se crê para a justiça, e com a boca se faz confissão para a salvação." },
  { id: "rm10-13", ref: "Romanos 10:13", themes: ["salvação", "convite"], text: "Porque todo aquele que invocar o nome do Senhor será salvo." },
  { id: "at16-31", ref: "Atos 16:31", themes: ["salvação", "fé"], text: "E eles disseram: Crê no Senhor Jesus Cristo e serás salvo, tu e a tua casa." },
  { id: "at4-12", ref: "Atos 4:12", themes: ["salvação", "convite"], text: "E em nenhum outro há salvação, porque também debaixo do céu nenhum outro nome há, dado entre os homens, pelo qual devamos ser salvos." },
  { id: "ef2-8", ref: "Efésios 2:8", themes: ["graça", "fé", "salvação"], text: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus." },
  { id: "ef2-9", ref: "Efésios 2:9", themes: ["graça", "salvação"], text: "Não vem das obras, para que ninguém se glorie." },
  { id: "tt3-5", ref: "Tito 3:5", themes: ["graça", "salvação", "nova vida"], text: "Não pelas obras de justiça que houvéssemos feito, mas segundo a sua misericórdia, nos salvou pela lavagem da regeneração e da renovação do Espírito Santo." },
  { id: "2tm1-9", ref: "2 Timóteo 1:9", themes: ["graça", "salvação"], text: "Que nos salvou, e chamou com uma santa vocação; não segundo as nossas obras, mas segundo o seu próprio propósito e graça que nos foi dada em Cristo Jesus antes dos tempos dos séculos." },
  { id: "ap3-20", ref: "Apocalipse 3:20", themes: ["convite"], text: "Eis que estou à porta, e bato; se alguém ouvir a minha voz, e abrir a porta, entrarei em sua casa, e com ele cearei, e ele comigo." },
  { id: "mt11-28", ref: "Mateus 11:28", themes: ["convite", "esperança", "consolo"], text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." },
  { id: "mt11-29", ref: "Mateus 11:29", themes: ["convite", "consolo", "paz"], text: "Tomai sobre vós o meu jugo, e aprendei de mim, que sou manso e humilde de coração; e encontrareis descanso para as vossas almas." },
  { id: "jo6-37", ref: "João 6:37", themes: ["convite", "salvação"], text: "Todo o que o Pai me dá virá a mim; e o que vem a mim de maneira nenhuma o lançarei fora." },
  { id: "jo1-12", ref: "João 1:12", themes: ["salvação", "fé", "nova vida"], text: "Mas, a todos quantos o receberam, deu-lhes o poder de serem feitos filhos de Deus, aos que crêem no seu nome." },
  { id: "is1-18", ref: "Isaías 1:18", themes: ["perdão", "convite", "pecado"], text: "Vinde então, e argui-me, diz o Senhor: ainda que os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve; ainda que sejam vermelhos como o carmesim, se tornarão como a branca lã." },
  { id: "is55-6", ref: "Isaías 55:6", themes: ["convite", "arrependimento"], text: "Buscai ao Senhor enquanto se pode achar, invocai-o enquanto está perto." },
  { id: "is55-7", ref: "Isaías 55:7", themes: ["arrependimento", "perdão"], text: "Deixe o ímpio o seu caminho, e o homem maligno os seus pensamentos, e se converta ao Senhor, que se compadecerá dele; torne para o nosso Deus, porque grandioso é em perdoar." },

  // ——— Pecado ———
  { id: "rm3-23", ref: "Romanos 3:23", themes: ["pecado"], text: "Porque todos pecaram e destituídos estão da glória de Deus." },
  { id: "rm6-23", ref: "Romanos 6:23", themes: ["salvação", "pecado", "vida eterna"], text: "Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna, por Cristo Jesus nosso Senhor." },
  { id: "rm3-10", ref: "Romanos 3:10", themes: ["pecado"], text: "Como está escrito: Não há justo, nem ainda um." },
  { id: "rm5-12", ref: "Romanos 5:12", themes: ["pecado"], text: "Portanto, como por um homem entrou o pecado no mundo, e pelo pecado a morte, assim também a morte passou a todos os homens por isso que todos pecaram." },
  { id: "is53-6", ref: "Isaías 53:6", themes: ["pecado", "salvação"], text: "Todos nós andávamos desgarrados como ovelhas; cada um se desviava pelo seu caminho; mas o Senhor fez cair sobre ele a iniquidade de nós todos." },
  { id: "tg4-17", ref: "Tiago 4:17", themes: ["pecado"], text: "Aquele, pois, que sabe fazer o bem e não o faz, comete pecado." },
  { id: "1jo1-8", ref: "1 João 1:8", themes: ["pecado"], text: "Se dissermos que não temos pecado, enganamo-nos a nós mesmos, e não há verdade em nós." },

  // ——— Perdão / Arrependimento ———
  { id: "1jo1-9", ref: "1 João 1:9", themes: ["perdão", "arrependimento"], text: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça." },
  { id: "at3-19", ref: "Atos 3:19", themes: ["arrependimento", "perdão"], text: "Arrependei-vos, pois, e convertei-vos, para que sejam apagados os vossos pecados, e venham assim os tempos do refrigério pela presença do Senhor." },
  { id: "lc15-7", ref: "Lucas 15:7", themes: ["arrependimento"], text: "Digo-vos que assim haverá alegria no céu por um pecador que se arrepende, mais do que por noventa e nove justos que não necessitam de arrependimento." },
  { id: "2pe3-9", ref: "2 Pedro 3:9", themes: ["arrependimento", "amor"], text: "O Senhor não retarda a sua promessa, ainda que alguns a têm por tardia; mas é longânimo para conosco, não querendo que alguns se percam, senão que todos venham a arrepender-se." },
  { id: "sl103-12", ref: "Salmos 103:12", themes: ["perdão"], text: "Quanto está longe o oriente do ocidente, assim afasta de nós as nossas transgressões." },
  { id: "mc1-15", ref: "Marcos 1:15", themes: ["arrependimento", "fé"], text: "E dizendo: O tempo está cumprido, e o reino de Deus está próximo. Arrependei-vos, e crede no evangelho." },

  // ——— Amor ———
  { id: "rm5-8", ref: "Romanos 5:8", themes: ["amor", "salvação"], text: "Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores." },
  { id: "1jo4-9", ref: "1 João 4:9", themes: ["amor", "salvação"], text: "Nisto se manifestou o amor de Deus para conosco: que Deus enviou seu Filho unigênito ao mundo, para que por ele vivamos." },
  { id: "1jo4-10", ref: "1 João 4:10", themes: ["amor", "perdão"], text: "Nisto está o amor, não em que nós tenhamos amado a Deus, mas em que ele nos amou a nós, e enviou seu Filho para propiciação pelos nossos pecados." },
  { id: "1jo4-19", ref: "1 João 4:19", themes: ["amor"], text: "Nós o amamos a ele porque ele nos amou primeiro." },
  { id: "jr31-3", ref: "Jeremias 31:3", themes: ["amor"], text: "Há muito que o Senhor me apareceu, dizendo: Com amor eterno te amei; por isso com benignidade te atraí." },
  { id: "ef2-4", ref: "Efésios 2:4", themes: ["amor", "graça"], text: "Mas Deus, que é riquíssimo em misericórdia, pelo seu muito amor com que nos amou." },
  { id: "jo15-13", ref: "João 15:13", themes: ["amor"], text: "Ninguém tem maior amor do que este, de dar alguém a sua vida pelos seus amigos." },
  { id: "rm8-38", ref: "Romanos 8:38", themes: ["amor", "esperança"], text: "Porque estou certo de que, nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir." },
  { id: "rm8-39", ref: "Romanos 8:39", themes: ["amor", "esperança"], text: "Nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus nosso Senhor." },

  // ——— Caminho / Verdade / Vida eterna ———
  { id: "jo14-6", ref: "João 14:6", themes: ["salvação", "verdade", "vida eterna"], text: "Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida. Ninguém vem ao Pai, senão por mim." },
  { id: "jo11-25", ref: "João 11:25", themes: ["vida eterna", "esperança", "fé"], text: "Disse-lhe Jesus: Eu sou a ressurreição e a vida; quem crê em mim, ainda que esteja morto, viverá." },
  { id: "jo10-10", ref: "João 10:10", themes: ["vida eterna", "nova vida"], text: "O ladrão não vem senão a roubar, a matar, e a destruir; eu vim para que tenham vida, e a tenham com abundância." },
  { id: "jo10-28", ref: "João 10:28", themes: ["vida eterna", "esperança"], text: "E dou-lhes a vida eterna, e nunca hão de perecer, e ninguém as arrebatará da minha mão." },
  { id: "jo5-24", ref: "João 5:24", themes: ["vida eterna", "fé", "salvação"], text: "Na verdade, na verdade vos digo que quem ouve a minha palavra, e crê naquele que me enviou, tem a vida eterna, e não entrará em condenação, mas passou da morte para a vida." },
  { id: "1jo5-12", ref: "1 João 5:12", themes: ["vida eterna", "salvação"], text: "Quem tem o Filho tem a vida; quem não tem o Filho de Deus não tem a vida." },
  { id: "1jo5-13", ref: "1 João 5:13", themes: ["vida eterna", "fé", "esperança"], text: "Estas coisas vos escrevi a vós, os que credes no nome do Filho de Deus, para que saibais que tendes a vida eterna, e para que creiais no nome do Filho de Deus." },
  { id: "jo8-12", ref: "João 8:12", themes: ["vida eterna", "esperança"], text: "Falou-lhes, pois, Jesus outra vez, dizendo: Eu sou a luz do mundo; quem me segue não andará em trevas, mas terá a luz da vida." },

  // ——— Nova vida / Transformação ———
  { id: "2co5-17", ref: "2 Coríntios 5:17", themes: ["nova vida"], text: "Assim que, se alguém está em Cristo, nova criatura é: as coisas velhas já passaram; eis que tudo se fez novo." },
  { id: "ez36-26", ref: "Ezequiel 36:26", themes: ["nova vida"], text: "E dar-vos-ei um coração novo, e porei dentro de vós um espírito novo; e tirarei da vossa carne o coração de pedra, e vos darei um coração de carne." },
  { id: "gl2-20", ref: "Gálatas 2:20", themes: ["nova vida", "fé"], text: "Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim; e a vida que agora vivo na carne, vivo-a na fé do Filho de Deus, o qual me amou, e se entregou a si mesmo por mim." },
  { id: "rm12-2", ref: "Romanos 12:2", themes: ["nova vida"], text: "E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus." },
  { id: "jo3-3", ref: "João 3:3", themes: ["nova vida", "salvação"], text: "Jesus respondeu, e disse-lhe: Na verdade, na verdade te digo que aquele que não nascer de novo, não pode ver o reino de Deus." },

  // ——— Esperança / Paz / Consolo ———
  { id: "jo14-27", ref: "João 14:27", themes: ["paz", "consolo"], text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize." },
  { id: "fp4-6", ref: "Filipenses 4:6", themes: ["paz", "consolo"], text: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplicas, com ação de graças." },
  { id: "fp4-7", ref: "Filipenses 4:7", themes: ["paz", "consolo"], text: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus." },
  { id: "fp4-13", ref: "Filipenses 4:13", themes: ["esperança", "fé"], text: "Posso todas as coisas em Cristo que me fortalece." },
  { id: "rm5-1", ref: "Romanos 5:1", themes: ["paz", "fé"], text: "Tendo sido, pois, justificados pela fé, temos paz com Deus, por nosso Senhor Jesus Cristo." },
  { id: "rm8-28", ref: "Romanos 8:28", themes: ["esperança", "consolo"], text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito." },
  { id: "sl23-1", ref: "Salmos 23:1", themes: ["consolo", "paz", "esperança"], text: "O Senhor é o meu pastor, nada me faltará." },
  { id: "sl34-18", ref: "Salmos 34:18", themes: ["consolo", "esperança"], text: "Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito." },
  { id: "sl46-1", ref: "Salmos 46:1", themes: ["consolo", "esperança"], text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia." },
  { id: "mt6-33", ref: "Mateus 6:33", themes: ["esperança", "fé"], text: "Mas buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas." },
  { id: "is41-10", ref: "Isaías 41:10", themes: ["consolo", "esperança", "paz"], text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça." },
  { id: "pv3-5", ref: "Provérbios 3:5", themes: ["fé", "esperança"], text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento." },
  { id: "pv3-6", ref: "Provérbios 3:6", themes: ["fé", "esperança"], text: "Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas." },
  { id: "1pe5-7", ref: "1 Pedro 5:7", themes: ["consolo", "paz"], text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós." },
  { id: "ap21-4", ref: "Apocalipse 21:4", themes: ["esperança", "consolo", "vida eterna"], text: "E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas." },
  { id: "mt28-20", ref: "Mateus 28:20", themes: ["consolo", "esperança"], text: "Ensinando-as a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos. Amém." },

  // ——— Convite / Graça (clássicos finais) ———
  { id: "jo7-37", ref: "João 7:37", themes: ["convite", "esperança"], text: "E no último dia, o grande dia da festa, Jesus pôs-se em pé, e clamou, dizendo: Se alguém tem sede, venha a mim, e beba." },
  { id: "ap22-17", ref: "Apocalipse 22:17", themes: ["convite", "graça"], text: "E o Espírito e a esposa dizem: Vem. E quem ouve diga: Vem. E quem tem sede venha; e quem quiser tome de graça da água da vida." },
  { id: "2co6-2", ref: "2 Coríntios 6:2", themes: ["convite", "salvação"], text: "Porque diz: Ouvi-te em tempo aceitável e socorri-te no dia da salvação; eis aqui agora o tempo aceitável, eis aqui agora o dia da salvação." },
  { id: "rm6-14", ref: "Romanos 6:14", themes: ["graça", "nova vida"], text: "Porque o pecado não terá domínio sobre vós, pois não estais debaixo da lei, mas debaixo da graça." },
  { id: "1tm1-15", ref: "1 Timóteo 1:15", themes: ["salvação", "graça", "pecado"], text: "Esta é uma palavra fiel, e digna de toda a aceitação, que Cristo Jesus veio ao mundo, para salvar os pecadores, dos quais eu sou o principal." },
  { id: "1pe2-24", ref: "1 Pedro 2:24", themes: ["salvação", "pecado", "perdão"], text: "Levando ele mesmo em seu corpo os nossos pecados sobre o madeiro, para que, mortos para os pecados, pudéssemos viver para a justiça; e pelas suas feridas fostes sarados." },
  { id: "cl1-14", ref: "Colossenses 1:14", themes: ["perdão", "salvação"], text: "Em quem temos a redenção pelo seu sangue, a saber, a remissão dos pecados." },
  { id: "ef1-7", ref: "Efésios 1:7", themes: ["graça", "perdão"], text: "Em quem temos a redenção pelo seu sangue, a remissão das ofensas, segundo as riquezas da sua graça." },
  { id: "gl3-13", ref: "Gálatas 3:13", themes: ["salvação", "graça"], text: "Cristo nos resgatou da maldição da lei, fazendo-se maldição por nós; porque está escrito: Maldito todo aquele que for pendurado no madeiro." },
];

export function listThemes() {
  return [...new Set(VERSES.flatMap((v) => v.themes))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}
