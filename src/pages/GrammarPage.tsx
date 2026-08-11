import { useState, useEffect } from 'react';

interface Card {
  label: string;
  form?: string;
  front: string;
  meaning: string;
  rule: string;
  example: string;
  trans: string;
}

interface Chapter {
  num: number;
  kanji: string;
  title: string;
  cards: Card[];
}

const CHAPTERS: Chapter[] = [
  {
    num: 1, kanji: '一', title: 'Nouvelles rencontres',
    cards: [
      {
        label: 'Copule affirmative',
        front: 'X は Y です',
        meaning: 'X est Y',
        rule: 'Structure de base pour identifier ou décrire.\nFormel ; dictionnaire : X は Y だ',
        example: '私は学生です。', trans: 'Je suis étudiant(e).',
      },
      {
        label: 'Marqueur de question',
        front: '〜か',
        meaning: 'Transforme une phrase en question',
        rule: 'Se place en fin de phrase, à la place du point.\nPas d\'inversion sujet-verbe.',
        example: 'これは本ですか。', trans: 'Est-ce un livre ?',
      },
      {
        label: 'Possession / modification',
        front: 'N₁ の N₂',
        meaning: 'Le N₂ de N₁',
        rule: 'の relie deux noms : possession, appartenance,\ncatégorie, contenu…',
        example: '私の本 / 田中さんの車', trans: 'mon livre / la voiture de Tanaka',
      },
    ],
  },
  {
    num: 2, kanji: '二', title: 'Shopping',
    cards: [
      {
        label: 'Pronoms démonstratifs',
        front: 'これ / それ / あれ / どれ',
        meaning: 'ceci / cela / cela là-bas / lequel',
        rule: 'Pronoms seuls (sans nom après).\nこ = près du locuteur, そ = près de l\'interlocuteur, あ = loin des deux.',
        example: 'これはいくらですか。', trans: 'Combien coûte ceci ?',
      },
      {
        label: 'Adjectifs démonstratifs',
        front: 'この / その / あの / どの + N',
        meaning: 'ce N-ci / ce N-là / ce N là-bas / quel N',
        rule: 'Toujours suivis d\'un nom.\nMême logique de distance que これ/それ/あれ.',
        example: 'このかばんは高いです。', trans: 'Ce sac est cher.',
      },
      {
        label: 'Lieux démonstratifs',
        front: 'ここ / そこ / あそこ / どこ',
        meaning: 'ici / là / là-bas / où',
        rule: 'Désignent un lieu.\nどこ peut être suivi de に、で、へ、の…',
        example: 'トイレはどこですか。', trans: 'Où sont les toilettes ?',
      },
      {
        label: 'Appartenance interrogative',
        front: 'だれの + N',
        meaning: 'le N de qui ?',
        rule: 'だれ = qui (personnes). どの + N = quel N.\nRéponse : [personne] の + N です。',
        example: 'これはだれのかさですか。', trans: 'À qui est ce parapluie ?',
      },
      {
        label: 'Inclusion — aussi / même',
        front: 'N + も',
        meaning: 'N également, N aussi',
        rule: 'Remplace は, が ou を.\nAvec négatif : 何も食べない = ne rien manger.',
        example: '私も学生です。', trans: 'Moi aussi je suis étudiant(e).',
      },
      {
        label: 'Copule négative',
        front: 'N じゃないです',
        meaning: 'N n\'est pas le cas',
        rule: 'じゃ = contraction de では (plus formel).\nPassé négatif : じゃなかったです',
        example: '山田さんは先生じゃないです。', trans: 'Yamada n\'est pas professeur.',
      },
      {
        label: 'Particules finales',
        front: 'ね / よ',
        meaning: 'ね = confirmation / よ = assertion',
        rule: 'ね cherche l\'accord de l\'interlocuteur.\nよ informe ou insiste sur quelque chose.',
        example: 'そうですね。/ 大丈夫ですよ。', trans: 'C\'est bien ça. / C\'est bon, je t\'assure.',
      },
    ],
  },
  {
    num: 3, kanji: '三', title: 'Prévoir des activités',
    cards: [
      {
        label: 'Conjugaison polie — présent',
        form: 'ます形',
        front: '〜ます / 〜ません',
        meaning: 'Présent/futur affirmatif / négatif',
        rule: 'G1 (u-v): 書く→書きます  G2 (ru-v): 食べる→食べます\nIrrég: する→します、くる→きます',
        example: '毎日日本語を勉強します。', trans: 'J\'étudie le japonais tous les jours.',
      },
      {
        label: 'Particules essentielles',
        front: 'を / で / に・へ / と',
        meaning: 'objet / lieu d\'action / destination / avec',
        rule: 'を = objet direct  で = lieu où se passe l\'action\nに・へ = destination  と = avec quelqu\'un',
        example: '友達と図書館で日本語を勉強します。', trans: 'J\'étudie le japonais à la biblio. avec un ami.',
      },
      {
        label: 'Référence temporelle',
        front: 'に + heure / jour',
        meaning: 'à [heure] / le [jour de la semaine]',
        rule: 'Avec heures et jours de la semaine.\n⚠ Pas de に avec : 今日、明日、来週、毎〜, etc.',
        example: '７時に起きます。月曜日に授業があります。', trans: 'Je me lève à 7h. Le cours est le lundi.',
      },
      {
        label: 'Invitation polie',
        form: 'ます形',
        front: '〜ませんか',
        meaning: 'Ne voulez-vous pas… ?',
        rule: 'Proposition à faire quelque chose ensemble.\nPlus indirect et poli que ましょう.',
        example: '一緒に映画を見ませんか。', trans: 'On va voir un film ensemble ?',
      },
      {
        label: 'Adverbes de fréquence',
        front: 'いつも→よく→たいてい\nときどき→あまり→ぜんぜん',
        meaning: 'toujours → souvent → généralement\nparfois → peu → pas du tout',
        rule: 'あまり et ぜんぜん se construisent avec un verbe négatif.',
        example: 'あまりテレビを見ません。', trans: 'Je ne regarde pas souvent la télé.',
      },
    ],
  },
  {
    num: 4, kanji: '四', title: 'Premier rendez-vous',
    cards: [
      {
        label: 'Existence — inanimé',
        front: 'X が あります',
        meaning: 'Il y a X / X existe (objet, chose, événement)',
        rule: 'Pour les objets, plantes, événements.\nLieu : [Lieu] に X が あります。',
        example: '机の上に本があります。', trans: 'Il y a un livre sur le bureau.',
      },
      {
        label: 'Existence — animé',
        front: 'X が います',
        meaning: 'Il y a X / X est là (être vivant)',
        rule: 'Pour personnes, animaux, insectes…\nLieu : [Lieu] に X が います。',
        example: '部屋に猫がいます。', trans: 'Il y a un chat dans la chambre.',
      },
      {
        label: 'Localisation',
        front: '[Lieu] に あります / います',
        meaning: 'X se trouve à / dans [lieu]',
        rule: 'Question : X はどこにありますか / いますか。\nRéponse : [Lieu] にあります。',
        example: '銀行は駅の前にあります。', trans: 'La banque est devant la gare.',
      },
      {
        label: 'Passé de です',
        front: 'でした / じゃなかったです',
        meaning: 'était / n\'était pas',
        rule: 'でした = passé affirmatif\nじゃなかったです = passé négatif (formel : ではありませんでした)',
        example: '昨日は月曜日でした。', trans: 'Hier c\'était lundi.',
      },
      {
        label: 'Passé des verbes',
        form: 'ます形',
        front: '〜ました / 〜ませんでした',
        meaning: 'Passé affirmatif / négatif (poli)',
        rule: 'Stem ます + ました (aff.) / ませんでした (nég.)',
        example: '昨日映画を見ました。朝ご飯を食べませんでした。', trans: 'J\'ai vu un film. Je n\'ai pas pris de petit-déj.',
      },
      {
        label: 'も et と (nominaux)',
        front: 'Q + も + nég  /  N と N',
        meaning: 'rien / personne / nulle part  //  X et Y',
        rule: '何も・誰も・どこにも + nég = rien/personne/nulle part\nN と N = liste exhaustive de noms',
        example: '何も食べませんでした。本とペンを買いました。', trans: 'Je n\'ai rien mangé. J\'ai acheté un livre et un stylo.',
      },
    ],
  },
  {
    num: 5, kanji: '五', title: 'Voyage à Okinawa',
    cards: [
      {
        label: 'い-adj — présent',
        front: '〜い + です / 〜くないです',
        meaning: 'Adjectifs en い — présent',
        rule: 'Affirmatif : tel quel + です\nNégatif : remplacer い par くない + です',
        example: 'このかばんは高いです。高くないです。', trans: 'Ce sac est cher. Il n\'est pas cher.',
      },
      {
        label: 'い-adj — passé',
        front: '〜かったです / 〜くなかったです',
        meaning: 'Adjectifs en い — passé',
        rule: 'Affirmatif : い→かった + です\nNégatif : い→くなかった + です\n⚠ いい → よかった / よくなかった',
        example: '昨日は寒かったです。', trans: 'Il faisait froid hier.',
      },
      {
        label: 'な-adj — 4 formes',
        front: 'な-adj présent & passé',
        meaning: 'Présent : 〜です / 〜じゃないです\nPassé : 〜でした / 〜じゃなかったです',
        rule: 'Même que la copule です.\nDevant un nom : ajouter な (ex: 静かな部屋).',
        example: 'この部屋は静かです。昔は静かじゃなかったです。', trans: 'Cette pièce est calme. Avant, elle ne l\'était pas.',
      },
      {
        label: 'Adjectif épithète',
        front: 'い-adj + N  /  な-adj + な + N',
        meaning: 'Adjectif placé avant le nom',
        rule: 'い-adj : directement devant le nom\nな-adj : ajouter な avant le nom',
        example: '高い山 / 静かな図書館', trans: 'une haute montagne / une bibliothèque calme',
      },
      {
        label: 'Aimer / ne pas aimer',
        front: '好き（な）/ 嫌い（な）',
        meaning: 'aimer / ne pas aimer',
        rule: 'Se comportent comme des な-adj.\nLa chose aimée est sujet avec が.',
        example: '私は寿司が好きです。音楽が嫌いです。', trans: 'J\'aime les sushis. Je n\'aime pas la musique.',
      },
      {
        label: 'Proposition / offre',
        form: 'ます形',
        front: '〜ましょう / 〜ましょうか',
        meaning: 'Allons faire… / Voulez-vous que je… ?',
        rule: 'ましょう = suggestion collective\nましょうか = offre de faire qqch pour l\'autre',
        example: '日本語を勉強しましょう。手伝いましょうか。', trans: 'Étudions le japonais ! / Puis-je vous aider ?',
      },
      {
        label: 'Compteurs courants',
        front: '〜つ / 〜人 / 〜枚 / 〜本 / 〜冊',
        meaning: 'objets (1-9) / personnes / plats / longs / livres',
        rule: '〜つ: ひとつ ふたつ みっつ よっつ いつつ…\n〜人: ひとり ふたり さんにん…',
        example: 'みかんをふたつください。', trans: 'Donnez-moi deux mandarines, s.v.p.',
      },
    ],
  },
  {
    num: 6, kanji: '六', title: 'Une journée de Robert',
    cards: [
      {
        label: 'Formation de la forme て',
        form: 'て形',
        front: 'Formation de la forme て',
        meaning: 'Forme de base pour enchaîner les verbes',
        rule: 'く→いて  ぐ→いで  す→して\nつ/る/う→って  ぬ/ぶ/む→んで\nG2: る→て  いく→いって  する→して  くる→きて',
        example: '書く→書いて / 食べる→食べて', trans: '(base de nombreuses structures)',
      },
      {
        label: 'Demande / instruction',
        form: 'て形',
        front: '〜てください',
        meaning: 'S\'il vous plaît, faites…',
        rule: 'Forme て + ください. Très courant.\nNégatif : 〜ないでください (voir L8).',
        example: 'ゆっくり話してください。', trans: 'Parlez lentement, s.v.p.',
      },
      {
        label: 'Enchaînement d\'actions',
        form: 'て形',
        front: 'V₁ て + V₂',
        meaning: 'Faire V₁ puis V₂',
        rule: 'Relie deux actions successives.\nL\'ordre des verbes = ordre réel des actions.',
        example: '朝起きて、シャワーを浴びます。', trans: 'Le matin je me lève et prends une douche.',
      },
      {
        label: 'Permission',
        form: 'て形',
        front: '〜てもいいです',
        meaning: 'Il est permis de… / Puis-je… ?',
        rule: 'Question : 〜てもいいですか。\nRéponse négative : 〜てはいけません ou いいえ、ちょっと…',
        example: 'ここで写真を撮ってもいいですか。', trans: 'Puis-je prendre des photos ici ?',
      },
      {
        label: 'Interdiction',
        form: 'て形',
        front: '〜てはいけません',
        meaning: 'Il est interdit de… / Ne pas faire…',
        rule: 'Forme て + はいけません.\nStyle réglementaire ou ferme.',
        example: 'ここでタバコを吸ってはいけません。', trans: 'Il est interdit de fumer ici.',
      },
      {
        label: 'Cause / raison',
        front: '〜から',
        meaning: 'parce que / car',
        rule: '[Raison (phrase)] + から、[résultat].\nPlus direct que ので (voir L12).',
        example: '眠いから、早く寝ます。', trans: 'Je suis fatigué(e), donc je vais me coucher tôt.',
      },
    ],
  },
  {
    num: 7, kanji: '七', title: 'Portrait de famille',
    cards: [
      {
        label: 'Action en cours',
        form: 'て形',
        front: '〜ている (action progressive)',
        meaning: 'Être en train de faire…',
        rule: 'Forme て + いる/います.\n≈ présent continu français.',
        example: '今、テレビを見ています。', trans: 'Je suis en train de regarder la télé.',
      },
      {
        label: 'État résultant',
        form: 'て形',
        front: '〜ている (état persistant)',
        meaning: 'Être dans l\'état résultant d\'une action',
        rule: 'L\'action est passée ; son résultat est présent.\nTypique : mariage, habitation, apparence physique.',
        example: '結婚しています。眼鏡をかけています。', trans: 'Il/elle est marié(e). Il/elle porte des lunettes.',
      },
      {
        label: 'Forme て pour relier',
        form: 'て形 (adj/N)',
        front: 'い-adj くて / な-adj・N で',
        meaning: 'Enchaîner deux descriptions',
        rule: 'い-adj: 高い→高くて\nな-adj / Nom: 静かな→静かで / 学生→学生で',
        example: '安くておいしいです。静かできれいな部屋です。', trans: 'C\'est bon marché et délicieux. Chambre calme et jolie.',
      },
      {
        label: 'Déplacement avec but',
        form: 'ます幹',
        front: 'V-stem に 行く / 来る / 帰る',
        meaning: 'Aller / venir / rentrer pour faire V',
        rule: 'Stem ます (sans ます) + に + verbe de mouvement.\nExprime le but du déplacement.',
        example: '映画を見に行きます。', trans: 'Je vais voir un film.',
      },
    ],
  },
  {
    num: 8, kanji: '八', title: 'Barbecue',
    cards: [
      {
        label: 'Formes courtes — présent',
        form: '辞書形 / ない形',
        front: 'Plain forms (présent)',
        meaning: 'Formes de base non polies',
        rule: 'V: dict. form / ない  adj-い: 〜い / 〜くない\nな-adj / N + だ / じゃない\nUsages : subordonnées, conversation naturelle.',
        example: '食べる / 食べない / 高い / 静かだ', trans: '(formes utilisées dans la langue courante)',
      },
      {
        label: 'Opinion / hypothèse',
        form: '短縮形',
        front: '〜と思います',
        meaning: 'Je pense que…',
        rule: '[Forme courte] + と思います.\nLa forme courte peut être présent ou passé.',
        example: '明日雨が降ると思います。', trans: 'Je pense qu\'il va pleuvoir demain.',
      },
      {
        label: 'Discours indirect',
        form: '短縮形',
        front: '〜と言っていました',
        meaning: '(Il/elle) a dit que…',
        rule: '[Forme courte] + と言っていました.\nPour rapporter des paroles au passé.',
        example: '田中さんは来ると言っていました。', trans: 'Tanaka a dit qu\'il/elle viendrait.',
      },
      {
        label: 'Demande de ne pas faire',
        form: 'ない形',
        front: '〜ないでください',
        meaning: 'S\'il vous plaît, ne faites pas…',
        rule: 'Forme ない + でください.\nOpposé de 〜てください.',
        example: 'ここで写真を撮らないでください。', trans: 'Merci de ne pas prendre de photos ici.',
      },
      {
        label: 'Nominalisation avec の',
        form: '辞書形',
        front: 'V の が 好き / 上手 / 下手…',
        meaning: 'Aimer / être doué / être mauvais en faire V',
        rule: 'の nominalise la proposition verbale.\nAutres adjectifs possibles : 得意、苦手、嫌い…',
        example: '料理するのが好きです。歌うのが上手です。', trans: 'J\'aime cuisiner. Il/elle chante bien.',
      },
      {
        label: 'Particule が — sujet',
        front: 'が (sujet mis en valeur)',
        meaning: 'Identifie ou met en relief le sujet',
        rule: 'Vs は (thème) : が souligne QUI ou QUOI,\nrépondant à une question implicite.',
        example: '私が行きます。（pas quelqu\'un d\'autre）', trans: 'C\'est moi qui y vais.',
      },
    ],
  },
  {
    num: 9, kanji: '九', title: 'Le kabuki',
    cards: [
      {
        label: 'Formes courtes — passé',
        form: 'た形 / なかった形',
        front: 'Plain forms (passé)',
        meaning: 'Formes de base passées',
        rule: 'V: forme た / なかった  adj-い: 〜かった / 〜くなかった\nな-adj / N + だった / じゃなかった',
        example: '食べた / 食べなかった / 高かった / 静かだった', trans: '(formes passées courtes)',
      },
      {
        label: 'Opinion sur le passé',
        form: 'た形',
        front: '〜たと思います',
        meaning: 'Je pense que (il/elle) a fait…',
        rule: '[Forme た] + と思います.\nPour exprimer une opinion sur un fait passé.',
        example: '田中さんはもう行ったと思います。', trans: 'Je pense que Tanaka est déjà parti(e).',
      },
      {
        label: 'Discours indirect — passé',
        form: 'た形',
        front: '〜たと言っていました',
        meaning: '(Il/elle) a dit avoir fait…',
        rule: '[Forme た] + と言っていました.\nRapporte ce que quelqu\'un a déclaré.',
        example: '田中さんは行ったと言っていました。', trans: 'Tanaka a dit qu\'il/elle y était allé(e).',
      },
      {
        label: 'Qualification d\'un nom',
        form: '短縮形',
        front: 'V / Adj (forme courte) + Nom',
        meaning: 'Proposition relative avant un nom',
        rule: 'La forme courte (présent ou passé) se place\ndirectement avant le nom qu\'elle qualifie.',
        example: '昨日食べたケーキ / 背が高い人', trans: 'le gâteau que j\'ai mangé hier / une grande personne',
      },
      {
        label: 'Déjà / Pas encore',
        form: 'ます形 / て形',
        front: 'もう〜ました / まだ〜ていません',
        meaning: 'Déjà fait / Pas encore fait',
        rule: 'もう + passé poli = action accomplie\nまだ + ていません = action non encore accomplie',
        example: 'もう宿題をしました。まだしていません。', trans: 'J\'ai déjà fait mes devoirs. / Je ne les ai pas encore faits.',
      },
    ],
  },
  {
    num: 10, kanji: '十', title: 'Hiver au Japon',
    cards: [
      {
        label: 'Comparaison — 2 éléments',
        front: 'A は B より 〜です',
        meaning: 'A est plus [adj] que B',
        rule: 'より = que (point de comparaison).\nQuestion : A と B と どちらが 〜ですか。',
        example: '東京は大阪より大きいです。', trans: 'Tokyo est plus grande qu\'Osaka.',
      },
      {
        label: 'Superlatif — 3 éléments+',
        front: '〜の中で N が 一番 〜です',
        meaning: 'Parmi…, N est le plus [adj]',
        rule: 'の中で = parmi.  一番 = le plus.\nQuestion : どれ / どこ / だれが一番〜ですか。',
        example: 'クラスの中で、田中さんが一番背が高いです。', trans: 'Dans la classe, Tanaka est le/la plus grand(e).',
      },
      {
        label: 'Nominalisation avec の',
        front: 'Adj / N + の',
        meaning: 'Celui / celle qui est [adj]',
        rule: 'の remplace un nom déjà mentionné.\nÉvite la répétition : 大きいかばん → 大きいの',
        example: '大きいのをください。赤いのはいくらですか。', trans: 'Donnez-moi le grand. Combien coûte le rouge ?',
      },
      {
        label: 'Intention / plan',
        form: '辞書形 / ない形',
        front: '〜つもりです',
        meaning: 'Avoir l\'intention de…',
        rule: '[Dict. form] + つもりです (intention aff.)\n[Forme ない] + つもりです (intention nég.)',
        example: '来年、日本に行くつもりです。', trans: 'J\'ai l\'intention d\'aller au Japon l\'an prochain.',
      },
      {
        label: 'Devenir',
        form: 'く形 / に形',
        front: 'Adj + なる',
        meaning: 'Devenir [adj]',
        rule: 'い-adj: 〜く + なる\nな-adj: 〜に + なる  /  N: N + になる',
        example: '日本語が上手になりました。', trans: 'Mon japonais s\'est amélioré.',
      },
      {
        label: 'Quelque part / Nulle part',
        front: 'どこかに / どこにも〜ない',
        meaning: 'quelque part / nulle part',
        rule: '〜か + に/を = quelque chose / quelque part (aff.)\n〜にも + nég = rien, nulle part (aussi: 何も、誰にも)',
        example: '週末どこかに行きましたか。→ どこにも行きませんでした。', trans: 'Tu es allé(e) quelque part ? → Non, nulle part.',
      },
      {
        label: 'Particule で — moyen',
        front: 'で (moyen / instrument / langue)',
        meaning: 'par, avec, en (moyen utilisé)',
        rule: 'Transport : バスで行く\nInstrument : はしで食べる\nLangue : 日本語で話す',
        example: 'バスで行きます。日本語で話しましょう。', trans: 'J\'y vais en bus. Parlons en japonais.',
      },
    ],
  },
  {
    num: 11, kanji: '十一', title: 'Études à l\'étranger',
    cards: [
      {
        label: 'Désir (1ʳᵉ personne)',
        form: 'ます幹',
        front: '〜たいです',
        meaning: 'Vouloir faire…',
        rule: 'Stem ます + たい. Se conjugue comme un い-adj.\nL\'objet peut être が ou を.',
        example: '日本に行きたいです。寿司が食べたいです。', trans: 'Je veux aller au Japon. J\'ai envie de manger des sushis.',
      },
      {
        label: 'Liste d\'activités non exhaustive',
        form: 'た形',
        front: '〜たり 〜たり します',
        meaning: 'Faire des choses comme V₁ et V₂…',
        rule: 'Forme た + り pour chaque verbe, puis します.\nListe non exhaustive d\'activités typiques.',
        example: '週末は映画を見たり、音楽を聴いたりします。', trans: 'Le week-end je regarde des films, écoute de la musique, etc.',
      },
      {
        label: 'Expérience passée',
        form: 'た形',
        front: '〜たことがあります',
        meaning: 'Avoir déjà fait…',
        rule: 'Forme た + ことがあります (expérience de vie).\nNégatif : 〜たことがありません (jamais fait).',
        example: '富士山に登ったことがあります。', trans: 'J\'ai déjà gravi le mont Fuji.',
      },
      {
        label: 'Liste non exhaustive de noms',
        front: 'N₁ や N₂',
        meaning: 'N₁ et N₂ (entre autres)',
        rule: 'や ≠ と : と est exhaustif (X et Y, point final)\nや implique qu\'il y a d\'autres éléments non mentionnés.',
        example: 'りんごやバナナを買いました。', trans: 'J\'ai acheté des pommes, des bananes et d\'autres choses.',
      },
    ],
  },
  {
    num: 12, kanji: '十二', title: 'Mauvais temps',
    cards: [
      {
        label: 'Explication / mise en contexte',
        form: '短縮形',
        front: '〜んです / のです',
        meaning: 'Le fait est que… / C\'est que…',
        rule: 'Fournit ou sollicite une explication.\nV/adj (plain) + んです  /  な-adj・N + なんです',
        example: '頭が痛いんです。— そうなんですか。', trans: 'Le fait est que j\'ai mal à la tête. — Ah bon !',
      },
      {
        label: 'Excès',
        form: 'ます幹 / adj-stem',
        front: '〜すぎる',
        meaning: 'Trop… / excessivement…',
        rule: 'Stem ます (verbe) + すぎる\nい-adj: drop い + すぎる  /  な-adj: drop な + すぎる',
        example: 'このケーキは甘すぎます。食べすぎました。', trans: 'Ce gâteau est trop sucré. J\'ai trop mangé.',
      },
      {
        label: 'Conseil / recommandation',
        form: 'た形 / ない形',
        front: '〜ほうがいいです',
        meaning: 'Il vaut mieux… / Tu devrais…',
        rule: 'Aff: [forme た] + ほうがいい (conseil d\'agir)\nNég: [forme ない] + ほうがいい (conseil de ne pas agir)',
        example: '早く寝たほうがいいです。無理しないほうがいいです。', trans: 'Tu devrais te coucher tôt. Ne te force pas trop.',
      },
      {
        label: 'Cause — registre poli',
        form: '短縮形',
        front: '〜ので',
        meaning: 'Parce que… / étant donné que…',
        rule: 'Plus poli et neutre que から.\nV/い-adj (plain) + ので  /  な-adj・N + なので',
        example: '雨が降っているので、傘を持っていきます。', trans: 'Comme il pleut, je prends un parapluie.',
      },
      {
        label: 'Obligation',
        form: 'ない形',
        front: '〜なければいけません\n〜なきゃいけない',
        meaning: 'Devoir faire… / être obligé de…',
        rule: 'Forme ない → なければ + いけません\nOral familier : なきゃ ou なくちゃ',
        example: '宿題をしなければいけません。', trans: 'Je dois faire mes devoirs.',
      },
      {
        label: 'Question polie / doute',
        form: '短縮形',
        front: '〜でしょうか',
        meaning: 'Je me demande si… / Serait-il possible que… ?',
        rule: 'Plus poli et incertain que ですか.\nIndique une hésitation ou une question rhétorique.',
        example: '明日は雨でしょうか。', trans: 'Je me demande s\'il va pleuvoir demain.',
      },
    ],
  },
  {
    num: 13, kanji: '十三', title: 'Potentiel & nuances',
    cards: [
      {
        label: 'Forme potentielle',
        form: '可能形',
        front: '可能形 — pouvoir faire…',
        meaning: 'Pouvoir faire… / Être capable de…',
        rule: 'G1: く→ける む→める ぬ→ねる ぶ→べる う→える つ→てる る→れる す→せる\nG2: る→られる  する→できる  くる→こられる\nL\'objet prend が (pas を).',
        example: '漢字が読めます。日本語が話せます。', trans: 'Je peux lire les kanji. Je peux parler japonais.',
      },
      {
        label: 'Cumul de raisons',
        form: '短縮形',
        front: '〜し、〜し、…',
        meaning: 'D\'un côté…, d\'un autre côté… (cumul)',
        rule: '[Raison₁ (forme courte)] し、[Raison₂] し、[Résultat/Opinion].\nNon exhaustif : sous-entend d\'autres raisons.\nVerbe/adj plain + し  /  N・な-adj + だし',
        example: '安いし、おいしいし、このお店が好きです。', trans: 'C\'est pas cher, c\'est bon, j\'aime ce restaurant.',
      },
      {
        label: 'Apparence — そうです',
        form: 'ます幹 / adj',
        front: '〜そうです (apparence visible)',
        meaning: 'On dirait que… / Ça a l\'air de…',
        rule: 'V: stem ます + そう  (⚠ basé sur observation)\nい-adj: drop い + そう  ⚠ いい→よさそう、ない→なさそう\nな-adj: drop な + そう\n≠ 〜そうです (ouï-dire, voir 伝聞)',
        example: '雨が降りそうです。このケーキはおいしそうです。', trans: 'On dirait qu\'il va pleuvoir. Ce gâteau a l\'air délicieux.',
      },
      {
        label: 'Essayer — てみる',
        form: 'て形',
        front: '〜てみる',
        meaning: 'Essayer de faire… (pour voir)',
        rule: 'Forme て + みる/みます.\nExprime une tentative expérimentale.\nSous-entend : on ne sait pas à l\'avance le résultat.',
        example: '日本料理を作ってみました。着てみてください。', trans: 'J\'ai essayé de faire de la cuisine japonaise. Essayez de le porter.',
      },
      {
        label: 'Conditionnel なら',
        form: '短縮形',
        front: '〜なら',
        meaning: 'Si c\'est le cas de… / Si tu parles de…',
        rule: '[Thème/Condition] + なら + [Conseil ou résultat].\nBasé sur une info déjà connue ou mentionnée.\nV/adj (forme courte) + なら  /  N + なら (sans だ)',
        example: '日本に行くなら、京都に寄ってください。', trans: 'Si tu vas au Japon, passe par Kyoto.',
      },
      {
        label: 'Fréquence sur période',
        front: '[Période] に [Nombre] 回 / 度',
        meaning: '[X] fois par [période]',
        rule: '回 (かい) et 度 (ど) = "fois".\n[Période] + に = par (unité de temps).\n例: 週に三回 / 一日に二度 / 月に一度',
        example: '週に三回ジムに行きます。一日に二度歯を磨きます。', trans: 'Je vais à la salle 3 fois par semaine. Je me brosse les dents 2 fois par jour.',
      },
    ],
  },
];

function multiline(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

export function GrammarPage() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  useEffect(() => {
    setFlipped(new Set());
  }, [currentChapter]);

  const chapter = CHAPTERS[currentChapter];

  const toggle = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Chapter tabs */}
      <div className="overflow-x-auto -mx-4 px-4 mb-6" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-1 min-w-max">
          {CHAPTERS.map((ch, i) => (
            <button
              key={ch.num}
              onClick={() => setCurrentChapter(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                i === currentChapter
                  ? 'bg-japan-red text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
              }`}
            >
              L{ch.num}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter heading */}
      <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[#30363d]">
        <span className="kanji-char text-5xl text-japan-red opacity-80 select-none leading-none">
          {chapter.kanji}
        </span>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5">
            Leçon {chapter.num}
          </p>
          <h2 className="text-lg font-bold text-white">{chapter.title}</h2>
          <p className="text-xs text-gray-600 mt-0.5">
            {chapter.cards.length} fiche{chapter.cards.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center mb-4 tracking-wide">
        Cliquez sur une fiche pour révéler la correction
      </p>

      {/* Cards grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
      >
        {chapter.cards.map((card, i) => {
          const isFlipped = flipped.has(i);
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Fiche ${i + 1} : ${card.label}`}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              className="cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-japan-red focus-visible:outline-offset-2"
              style={{ height: '240px', perspective: '900px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.42s cubic-bezier(0.4,0,0.2,1)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-xl p-4 flex flex-col bg-[#161b22] border border-[#30363d] shadow-lg overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    borderLeftWidth: '3px',
                    borderLeftColor: '#c84535',
                  }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-japan-red mb-1 leading-none">
                    {card.label}
                  </p>
                  {card.form && (
                    <span className="kanji-char inline-block self-start text-[10px] text-gray-500 bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-px mb-2">
                      {card.form}
                    </span>
                  )}
                  <div className="kanji-char flex-1 flex items-center text-[1.1rem] text-white leading-relaxed">
                    <span>{multiline(card.front)}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-auto pt-2">
                    Cliquer pour voir la correction →
                  </p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl p-4 flex flex-col bg-[#0f1929] border border-[#30363d] shadow-lg overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderLeftWidth: '3px',
                    borderLeftColor: '#c84535',
                  }}
                >
                  <p className="text-sm font-bold text-white mb-1.5 leading-snug">
                    {multiline(card.meaning)}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {multiline(card.rule)}
                  </p>
                  <div className="mt-auto pt-2 border-t border-[#30363d]">
                    <p className="kanji-char text-sm text-white leading-snug">{card.example}</p>
                    <p className="text-xs text-gray-500 italic mt-0.5">{card.trans}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
