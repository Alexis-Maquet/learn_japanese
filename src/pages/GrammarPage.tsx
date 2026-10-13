import { useState } from 'react';
import { GRAMMAR_CATEGORIES } from '@/utils/conjugationLocal';

interface Card {
  label: string;
  form?: string;
  front: string;
  meaning: string;
  rule: string;
  example: string;
  trans: string;
}

const CATEGORY_CARDS: Record<string, Card[]> = {
  'verb-base': [
    { label: 'Présent poli', form: 'ます形', front: '〜ます', meaning: 'Présent / futur affirmatif (poli)',
      rule: 'G1: dernière kana → ます-stem + ます\n例 書く→書きます  泳ぐ→泳ぎます  話す→話します\nG2: る→ます (食べる→食べます)\nSuru: します  Kuru: きます',
      example: '毎日日本語を勉強します。', trans: "J'étudie le japonais tous les jours." },
    { label: 'Présent négatif poli', form: 'ません形', front: '〜ません', meaning: 'Présent négatif (poli)',
      rule: 'ます-stem + ません\n例 書きます→書きません  食べます→食べません',
      example: 'あまりテレビを見ません。', trans: "Je ne regarde pas souvent la télé." },
    { label: 'Passé poli', form: 'ました形', front: '〜ました', meaning: 'Passé affirmatif (poli)',
      rule: 'ます-stem + ました\n例 書きます→書きました',
      example: '昨日映画を見ました。', trans: "J'ai vu un film hier." },
    { label: 'Passé négatif poli', form: 'ませんでした形', front: '〜ませんでした', meaning: 'Passé négatif (poli)',
      rule: 'ます-stem + ませんでした',
      example: '朝ご飯を食べませんでした。', trans: "Je n'ai pas pris de petit-déjeuner." },
    { label: 'Forme て', form: 'て形', front: '〜て / 〜で', meaning: 'Base pour enchaîner les verbes',
      rule: 'G1: く→いて  ぐ→いで  す→して  つ/る/う→って  ぬ/ぶ/む→んで\nG2: る→て  する→して  くる→きて\n⚠ いく→いって (exception)',
      example: '起きて、シャワーを浴びます。', trans: 'Je me lève et prends une douche.' },
    { label: 'Forme ない', form: 'ない形', front: '〜ない', meaning: 'Présent négatif (plain / informel)',
      rule: 'G1: 〜う→〜わない  〜く→〜かない  〜ぐ→〜がない…\nG2: る→ない  する→しない  くる→こない',
      example: '今日は行かない。', trans: "Je n'y vais pas aujourd'hui." },
    { label: 'Forme た', form: 'た形', front: '〜た / 〜だ', meaning: 'Passé (plain / informel)',
      rule: 'Mêmes irrégularités que て mais +a/da\n例 書いた  食べた  した  きた',
      example: '昨日宿題をした。', trans: "J'ai fait mes devoirs hier." },
    { label: 'Passé négatif plain', form: 'なかった形', front: '〜なかった', meaning: 'Passé négatif (plain / informel)',
      rule: '形ない → ない→なかった\n例 書かない→書かなかった',
      example: '昨日何も食べなかった。', trans: "Je n'ai rien mangé hier." },
    { label: 'Séquence stricte', form: 'て形', front: '〜てから', meaning: 'Après avoir fait [V]… (ordre obligatoire)',
      rule: '形て + から\n⚠ L\'ordre des actions est fixe (≠ た後で)',
      example: '手を洗ってから、食べます。', trans: 'Je me lave les mains avant de manger.' },
  ],
  'aspect': [
    { label: 'Progressif / état', form: 'て形', front: '〜ています', meaning: 'En train de faire / état résultant',
      rule: '形て + います\nAction en cours : 今勉強しています\nÉtat résultant : 結婚しています (est marié)',
      example: '今テレビを見ています。結婚しています。', trans: "Je regarde la télé. / Je suis marié(e)." },
    { label: 'Progressif passé', form: 'て形', front: '〜ていました', meaning: 'Était en train de faire',
      rule: '形て + いました (progressif au passé)',
      example: '昨日は雨が降っていました。', trans: 'Hier il pleuvait.' },
    { label: 'État résultant intentionnel', form: 'て形', front: '〜てあります', meaning: "A été fait (état persiste)",
      rule: '形て + あります — verbe transitif seulement\nQuelqu\'un a agi, l\'état persiste.',
      example: '窓が開けてあります。', trans: 'La fenêtre a été ouverte (et reste ouverte).' },
    { label: 'Préparation', form: 'て形', front: '〜ておきます', meaning: "Faire [V] à l'avance",
      rule: '形て + おきます\nPréparation pour une situation future.',
      example: '旅行の前に調べておきます。', trans: "Je vais faire des recherches avant le voyage." },
    { label: 'Complétion (regret)', form: 'て形', front: '〜てしまいます', meaning: 'Faire [V] complètement (souvent avec regret)',
      rule: '形て + しまいます\nIndique l\'irrémédiable ou la surprise.',
      example: 'ケーキを全部食べてしまいました。', trans: "J'ai tout mangé le gâteau (hélas)." },
    { label: 'Essayer', form: 'て形', front: '〜てみます', meaning: 'Essayer de faire [V] pour voir',
      rule: '形て + みます\nTentative expérimentale — résultat inconnu à l\'avance.',
      example: '日本料理を作ってみました。', trans: "J'ai essayé de faire de la cuisine japonaise." },
    { label: 'Changement vers soi', form: 'て形', front: '〜てきます', meaning: "Changement progressif / action venant vers soi",
      rule: '形て + きます\nVers le locuteur dans l\'espace ou dans le temps.',
      example: '日本語が上手になってきました。', trans: 'Mon japonais s\'est progressivement amélioré.' },
    { label: 'Continuation', form: 'て形', front: '〜ていきます', meaning: "Continuer à faire / changement s'éloignant",
      rule: '形て + いきます\nContinuation ou changement s\'éloignant dans le temps.',
      example: '少しずつ暖かくなっていきます。', trans: 'Il va faire de plus en plus chaud petit à petit.' },
  ],
  'giving': [
    { label: 'Donner une action', form: 'て形', front: '〜てあげます', meaning: "Faire [V] pour quelqu'un (sortant)",
      rule: '形て + あげます\nLocuteur (ou tiers) fait une action pour l\'autre.',
      example: '荷物を持ってあげます。', trans: 'Je vais porter ton bagage.' },
    { label: 'Recevoir une action', form: 'て形', front: '〜てくれます', meaning: "Quelqu'un fait [V] pour moi/nous",
      rule: '形て + くれます\nL\'autre fait l\'action pour le bénéfice du locuteur.',
      example: '先生が説明してくれました。', trans: 'Le professeur m\'a expliqué.' },
    { label: 'Recevoir (remerciement)', form: 'て形', front: '〜てもらいます', meaning: "Recevoir l'action de [V] de quelqu'un",
      rule: '形て + もらいます\nFocus sur le bénéficiaire (le locuteur).',
      example: '友達に手伝ってもらいました。', trans: "J'ai reçu l'aide de mon ami." },
  ],
  'desire': [
    { label: 'Désir (1ère personne)', form: 'ます幹', front: '〜たいです', meaning: 'Vouloir faire [V]',
      rule: 'ます-stem + たい(です) — se conjugue comme い-adj\nL\'objet peut prendre が ou を.',
      example: '日本に行きたいです。寿司が食べたいです。', trans: "Je veux aller au Japon. J'ai envie de manger des sushis." },
    { label: 'Désir (3ème personne)', form: 'ます幹', front: '〜たがっています', meaning: "Quelqu'un d'autre veut faire [V]",
      rule: 'ます-stem + たがっています\n⚠ たい = 1ère personne ; たがる = 3ème personne.',
      example: '田中さんは日本に行きたがっています。', trans: 'Tanaka veut aller au Japon.' },
    { label: 'Forme volitionnelle', form: '意向形', front: '〜よう / 〜ましょう', meaning: "Allons faire… / J'ai l'intention de…",
      rule: 'G1: 〜おう (書く→書こう)  G2: る→よう  する→しよう\nPoli: ます-stem + ましょう (提案)',
      example: '一緒に行こう。日本語を勉強しましょう。', trans: 'Allons-y ensemble ! Étudions le japonais !' },
  ],
  'permission': [
    { label: 'Demande polie', form: 'て形', front: '〜てください', meaning: 'S\'il vous plaît, faites [V]',
      rule: '形て + ください\nNégatif : 〜ないでください.',
      example: 'ゆっくり話してください。', trans: 'Parlez lentement, s.v.p.' },
    { label: 'Permission', form: 'て形', front: '〜てもいいです', meaning: 'Il est permis de [V]',
      rule: '形て + もいいです\nQuestion : 〜てもいいですか。',
      example: 'ここで写真を撮ってもいいですか。', trans: 'Puis-je prendre des photos ici ?' },
    { label: 'Interdiction', form: 'て形', front: '〜てはいけません', meaning: 'Il est interdit de [V]',
      rule: '形て + はいけません\nTon réglementaire ou ferme.',
      example: 'ここでタバコを吸ってはいけません。', trans: 'Il est interdit de fumer ici.' },
    { label: 'Obligation', form: 'ない形', front: '〜なければいけません', meaning: 'Devoir faire [V] (il faut)',
      rule: '形ない → ない→なければ + いけません\nOral : なきゃ / なくちゃ.',
      example: '宿題をしなければいけません。', trans: 'Je dois faire mes devoirs.' },
    { label: 'Non-obligation', form: 'ない形', front: '〜なくてもいいです', meaning: "Il n'est pas nécessaire de [V]",
      rule: '形ない → ない→なくて + もいいです',
      example: '今日は来なくてもいいです。', trans: "Tu n'es pas obligé(e) de venir aujourd'hui." },
    { label: 'Demande négative', form: 'ない形', front: '〜ないでください', meaning: 'Prière de ne pas faire [V]',
      rule: '形ない + でください\nOpposé de 〜てください.',
      example: 'ここで写真を撮らないでください。', trans: 'Merci de ne pas prendre de photos ici.' },
    { label: 'Conseil positif', form: 'た形', front: '〜たほうがいいです', meaning: 'Tu ferais mieux de [V]',
      rule: '形た + ほうがいいです\n⚠ いく→いった (exception)  する→した  くる→きた\nConseille d\'agir.',
      example: '早く寝たほうがいいです。', trans: 'Tu ferais mieux de te coucher tôt.' },
    { label: 'Conseil négatif', form: 'ない形', front: '〜ないほうがいいです', meaning: 'Tu ferais mieux de ne pas [V]',
      rule: '形ない + ほうがいいです\n⚠ ある→ない (pas あらない)  する→しない  くる→こない\nConseille de s\'abstenir.',
      example: '無理しないほうがいいです。', trans: "Tu ferais mieux de ne pas te forcer." },
  ],
  'potential': [
    { label: 'Forme potentielle', form: '可能形', front: '可能形', meaning: 'Pouvoir faire [V]',
      rule: 'G1: く→ける  ぐ→げる  す→せる  つ→てる  う→える  る→れる  ぶ→べる  む→める\nG2: る→られる  する→できる  くる→こられる\n⚠ L\'objet prend が.',
      example: '漢字が読めます。日本語が話せます。', trans: 'Je peux lire les kanji. Je peux parler japonais.' },
    { label: 'Capacité (nominale)', form: '辞書形', front: '〜ことができます', meaning: 'Être capable de [V] (formel)',
      rule: '辞書形 + ことができます\nPlus formel que la forme potentielle.',
      example: '日本語を話すことができます。', trans: 'Je suis capable de parler japonais.' },
  ],
  'passive-caus': [
    { label: 'Voix passive', form: '受け身形', front: '〜られます (passif)', meaning: 'Être [fait] par quelqu\'un',
      rule: 'G1: 〜われる/かれる/がれる…\nG2: る→られる  する→される\nMarqueur agent : に.',
      example: '先生に褒められました。', trans: "J'ai été félicité(e) par le professeur." },
    { label: 'Causatif', form: '使役形', front: '〜させます (causatif)', meaning: 'Faire faire [V] à quelqu\'un',
      rule: 'G1: 〜わせる/かせる/がせる…\nG2: る→させる  する→させる\nBénéficiaire : に ou を.',
      example: '母は私に宿題をさせました。', trans: 'Ma mère m\'a fait faire mes devoirs.' },
    { label: 'Causatif-passif', form: '使役受け身形', front: '〜させられます', meaning: 'Être forcé de faire [V]',
      rule: '使役形 → させる → させられる\nExprime une contrainte subie.',
      example: '残業させられました。', trans: "J'ai été forcé(e) de faire des heures sup." },
  ],
  'conditional': [
    { label: 'Conditionnel ば', form: 'ば形', front: '〜ば', meaning: 'Si [V]… (hypothèse générale)',
      rule: 'G1: e-rangée + ば (書く→書けば)\nG2: る→れば  する→すれば  くる→くれば\nCondition générale ou conseil.',
      example: '練習すれば、上手になります。', trans: 'Si tu pratiques, tu vas t\'améliorer.' },
    { label: 'Conditionnel たら', form: 'た形', front: '〜たら', meaning: 'Quand / Si [événement se produit]',
      rule: '形た + ら\nÉvénement temporel ou conditionnel.',
      example: '家に帰ったら、電話します。', trans: 'Quand je rentrerai, je t\'appellerai.' },
    { label: 'Conditionnel と', form: '辞書形', front: '〜と', meaning: 'Résultat automatique si [V]',
      rule: '辞書形 + と\nCause→effet automatique, inévitable.\n⚠ Pas pour les ordres ou demandes.',
      example: '右に曲がると、銀行があります。', trans: 'Si vous tournez à droite, il y a une banque.' },
    { label: 'Conditionnel なら', form: '辞書形', front: '〜なら', meaning: "Si c'est le cas que [V]",
      rule: '辞書形 + なら (basé sur une info connue)\nN + なら (sans だ).',
      example: '日本に行くなら、京都に行ってください。', trans: 'Si tu vas au Japon, va à Kyoto.' },
  ],
  'purpose': [
    { label: "But d'un déplacement", form: 'ます幹', front: 'V-stem に 行く / 来る / 帰る', meaning: 'Aller / venir / rentrer pour faire [V]',
      rule: 'ます-stem + に + verbe de mouvement\nSuru verbs: retirer する, ajouter に行く.',
      example: '映画を見に行きます。', trans: 'Je vais voir un film.' },
    { label: 'Dans le but de', form: '辞書形', front: '〜ために', meaning: 'Dans le but de [V] (intentionnel)',
      rule: '辞書形 + ために\nBut délibéré.',
      example: '健康のために、毎日運動します。', trans: 'Je fais du sport tous les jours pour ma santé.' },
    { label: 'Pour que / afin de', form: '辞書形 / ない形 / 可能形', front: '〜ように', meaning: 'Pour que [V] (but non-intentionnel)',
      rule: '辞書形・ない形・可能形 + ように\n例 忘れないように  話せるように\nBut progressif ou non-intentionnel.',
      example: '日本語が話せるように、勉強しています。', trans: "J'étudie pour pouvoir parler japonais." },
  ],
  'time-seq': [
    { label: 'Avant de', form: '辞書形', front: '〜前に', meaning: 'Avant de [V]',
      rule: '辞書形 + 前に\n⚠ Toujours la forme dict. (non-passé).',
      example: '寝る前に、歯を磨きます。', trans: 'Je me brosse les dents avant de dormir.' },
    { label: 'Après avoir fait', form: 'た形', front: '〜た後で', meaning: 'Après avoir [V]',
      rule: '形た + 後で\nL\'action précédente est accomplie.',
      example: '宿題をした後で、ゲームをします。', trans: 'Après avoir fait mes devoirs, je joue.' },
    { label: 'Simultanéité', form: 'ます幹', front: '〜ながら', meaning: 'Tout en [V] (deux actions en même temps)',
      rule: 'ます-stem + ながら\nAction principale en fin de phrase.',
      example: '音楽を聴きながら、勉強します。', trans: "J'étudie en écoutant de la musique." },
    { label: "Liste d'actions", form: 'た形', front: '〜たり 〜たり します', meaning: "Faire des choses comme [V] et [V]…",
      rule: '形た + り pour chaque verbe + します\nListe non exhaustive.',
      example: '週末は映画を見たり、音楽を聴いたりします。', trans: 'Le week-end je regarde des films, écoute de la musique, etc.' },
    { label: 'Au moment de (avant)', form: '辞書形', front: '〜とき (辞書形)', meaning: 'Quand on [V] / avant que [V] soit accompli',
      rule: '辞書形 + とき = avant que l\'action soit accomplie',
      example: '日本に行くとき、お土産を買います。', trans: 'Quand je vais au Japon, j\'achète des souvenirs.' },
    { label: 'Au moment de (après)', form: 'た形', front: '〜たとき', meaning: 'Quand on a [V] / une fois [V]',
      rule: '形た + とき = après que l\'action est accomplie',
      example: '日本に着いたとき、友達に会いました。', trans: "Quand je suis arrivé(e) au Japon, j'ai rencontré mon ami." },
    { label: 'Deadline', form: '辞書形', front: '〜までに', meaning: "Avant de [V] / d'ici à [date]",
      rule: '辞書形 + までに\nExprime une limite temporelle.',
      example: '月曜日までに宿題を出してください。', trans: 'Rendez vos devoirs avant lundi.' },
    { label: 'Expérience passée', form: 'た形', front: '〜たことがあります', meaning: "Avoir déjà fait [V]",
      rule: '形た + ことがあります\nNégatif : 〜たことがありません.',
      example: '富士山に登ったことがあります。', trans: "J'ai déjà gravi le mont Fuji." },
  ],
  'intention': [
    { label: 'Intention ferme', form: '辞書形', front: '〜つもりです', meaning: "Avoir l'intention de [V]",
      rule: '辞書形 + つもりです\nNég. : ない形 + つもりです.',
      example: '来年、日本に行くつもりです。', trans: "J'ai l'intention d'aller au Japon l'an prochain." },
    { label: 'Plan prévu', form: '辞書形', front: '〜予定です', meaning: 'Être prévu de faire [V]',
      rule: '辞書形 + 予定です\nPlan concret, souvent décidé.',
      example: '来月出張の予定です。', trans: "J'ai un voyage d'affaires prévu le mois prochain." },
    { label: 'Décision personnelle', form: '辞書形', front: '〜ことにします', meaning: 'Décider de [V] (décision propre)',
      rule: '辞書形 + ことにします\n≠ ことになりました (décision externe).',
      example: '毎日運動することにします。', trans: "Je décide de faire du sport tous les jours." },
    { label: 'Décision externe', form: '辞書形', front: '〜ことになりました', meaning: "Il a été décidé de [V] (circonstances)",
      rule: '辞書形 + ことになりました\nDécision prise par les circonstances ou par autrui.',
      example: '来月から東京で働くことになりました。', trans: "Il a été décidé que je travaillerai à Tokyo." },
    { label: 'Changement de capacité / habitude', form: '辞書形 / 可能形', front: '〜ようになりました', meaning: 'Être maintenant capable de [V] / se mettre à [V]',
      rule: '可能形 ou 辞書形 + ようになりました\n例 読めるようになった  毎日食べるようになった\nNégatif : ない形 + ようになりました.',
      example: '漢字が読めるようになりました。', trans: "Je suis maintenant capable de lire les kanji." },
    { label: 'Effort / habitude', form: '辞書形', front: '〜ようにします', meaning: "S'efforcer de [V]",
      rule: '辞書形 + ようにします\nEffort conscient et répété.',
      example: '毎日野菜を食べるようにします。', trans: "Je vais m'efforcer de manger des légumes." },
  ],
  'conjecture': [
    { label: 'Peut-être', form: '辞書形', front: '〜かもしれません', meaning: 'Peut-être que [V]',
      rule: '辞書形 + かもしれません\n⚠ na-adj et N + かもしれません (sans だ).',
      example: '明日は雨が降るかもしれません。', trans: "Il se peut qu'il pleuve demain." },
    { label: 'Probabilité', form: '辞書形', front: '〜でしょう', meaning: 'Probablement [V]',
      rule: '辞書形 + でしょう\nPlus certain que かもしれない.',
      example: '明日は晴れるでしょう。', trans: 'Il fera probablement beau demain.' },
    { label: 'Censé / devrait', form: '辞書形', front: '〜はずです', meaning: 'Être censé [V] / devrait être le cas',
      rule: '辞書形 + はずです\nDéduction logique.',
      example: '田中さんはもう来るはずです。', trans: 'Tanaka devrait arriver maintenant.' },
    { label: 'Apparence directe', form: 'ます幹', front: '〜そうです (様態)', meaning: "On dirait que [V] (observation directe)",
      rule: 'ます-stem + そうです\nBasé sur ce qu\'on voit directement.',
      example: '雨が降りそうです。', trans: "On dirait qu'il va pleuvoir." },
    { label: 'Ouï-dire', form: '辞書形', front: '〜そうです (伝聞)', meaning: "J'ai entendu dire que [V]",
      rule: '辞書形 + そうです\nRapporte une information entendue.',
      example: '田中さんは来ないそうです。', trans: "J'ai entendu dire que Tanaka ne viendra pas." },
    { label: 'Apparemment', form: '辞書形', front: '〜らしいです', meaning: 'Il paraît que [V]',
      rule: '辞書形 + らしいです\nInformation de seconde main.',
      example: '田中さんは病気らしいです。', trans: 'Il paraît que Tanaka est malade.' },
    { label: 'Il semble que', form: '辞書形', front: '〜ようです', meaning: 'Il semble que [V] (inférence)',
      rule: '辞書形 + ようです\nInférence basée sur des indices.',
      example: '試験は難しかったようです。', trans: "Il semble que l'examen était difficile." },
  ],
  'quotation': [
    { label: 'Penser que', form: '短縮形', front: '〜と思います', meaning: 'Je pense que [V]',
      rule: 'Forme courte (plain) + と思います\nPassé : 〜たと思います.',
      example: '明日は雨が降ると思います。', trans: "Je pense qu'il va pleuvoir demain." },
    { label: 'Dire que', form: '短縮形', front: '〜と言いました', meaning: "Quelqu'un a dit que [V]",
      rule: 'Forme courte + と言いました\nRapport de paroles au passé.',
      example: '田中さんは来ると言いました。', trans: "Tanaka a dit qu'il/elle viendrait." },
    { label: 'Avoir entendu que', form: '短縮形', front: '〜と聞きました', meaning: "J'ai entendu dire que [V]",
      rule: 'Forme courte + と聞きました',
      example: '田中さんは転職すると聞きました。', trans: "J'ai entendu que Tanaka allait changer d'emploi." },
  ],
  'cause': [
    { label: 'Parce que (subjectif)', form: '短縮形', front: '〜から', meaning: 'Parce que [V] (raison subjective)',
      rule: 'Forme courte (tout temps) + から\n例 行くから  行ったから  雨だから\nDirect, expressif — plus courant à l\'oral.',
      example: '眠かったから、早く寝ました。', trans: "J'étais fatigué(e), donc je me suis couché(e) tôt." },
    { label: 'Parce que (objectif)', form: '短縮形', front: '〜ので', meaning: 'Parce que [V] (raison polie)',
      rule: 'Forme courte + ので  (な-adj・N : 〜なので)\n例 行くので  雨なので\nPlus poli et neutre que から.',
      example: '雨が降っているので、傘を持っていきます。', trans: 'Comme il pleut, je prends un parapluie.' },
    { label: 'Bien que / pourtant', form: '短縮形', front: '〜のに', meaning: 'Bien que [V] (déception)',
      rule: 'Forme courte + のに  (な-adj・N : 〜なのに)\n例 高いのに  勉強したのに\nExprime une déception ou une surprise.',
      example: '一生懸命勉強したのに、失敗しました。', trans: "J'ai travaillé dur, et pourtant j'ai échoué." },
    { label: 'Mais / nuance', form: '短縮形', front: '〜けど', meaning: 'Mais / bien que [V]',
      rule: 'Forme courte (tout temps) + けど\n例 行きたいけど  行ったけど\nIntroduit une nuance ou un contraste (informel).',
      example: '行きたいけど、時間がありません。', trans: "Je voudrais y aller, mais je n'ai pas le temps." },
    { label: 'Trop (verbe)', form: 'ます幹', front: '〜すぎます', meaning: 'Faire trop de [V]',
      rule: 'ます-stem + すぎます\nい-adj: い→すぎます  な-adj: な→すぎます.',
      example: '食べすぎました。', trans: "J'ai trop mangé." },
  ],
  'i-adj': [
    { label: 'Présent affirmatif', form: 'い-adj', front: '〜い + です', meaning: 'Présent affirmatif (poli)',
      rule: 'Forme de dictionnaire + です\nPlain : tel quel.',
      example: 'このケーキはおいしいです。', trans: 'Ce gâteau est délicieux.' },
    { label: 'Présent négatif', form: 'くない形', front: '〜くないです', meaning: 'Présent négatif',
      rule: 'い→くない + です\n⚠ いい→よくない.',
      example: 'このケーキは甘くないです。', trans: "Ce gâteau n'est pas sucré." },
    { label: 'Passé affirmatif', form: 'かった形', front: '〜かったです', meaning: 'Passé affirmatif',
      rule: 'い→かった + です\n⚠ いい→よかった.',
      example: '昨日は寒かったです。', trans: 'Il faisait froid hier.' },
    { label: 'Passé négatif', form: 'くなかった形', front: '〜くなかったです', meaning: 'Passé négatif',
      rule: 'い→くなかった + です\n⚠ いい→よくなかった.',
      example: '昨日は寒くなかったです。', trans: "Il ne faisait pas froid hier." },
    { label: 'Enchaînement', form: 'くて形', front: '〜くて', meaning: 'Forme て (enchaînement de descriptions)',
      rule: 'い→くて\nRelie deux adjectifs ou une description à une action.',
      example: 'このレストランは安くておいしいです。', trans: "Ce restaurant est bon marché et délicieux." },
    { label: 'Forme adverbiale', form: 'く形', front: '〜く (adverbe)', meaning: 'Modifier un verbe',
      rule: 'い→く\nModifie un verbe ou un adjectif.',
      example: '早く起きました。', trans: "Je me suis levé(e) tôt." },
    { label: 'Devenir', form: 'くなります', front: '〜くなります', meaning: 'Devenir [adj]',
      rule: 'い→くなります\nExprime un changement d\'état.',
      example: '日本語が上手くなりました。', trans: "Mon japonais s'est amélioré." },
    { label: 'Apparence', form: 'そうです', front: '〜そうです', meaning: "Avoir l'air [adj] (observation directe)",
      rule: 'い→そうです\n⚠ いい→よさそう  ない→なさそう.',
      example: 'このケーキはおいしそうです。', trans: "Ce gâteau a l'air délicieux." },
    { label: 'Excès', form: 'すぎます', front: '〜すぎます', meaning: 'Trop [adj]',
      rule: 'い→すぎます',
      example: 'このケーキは甘すぎます。', trans: 'Ce gâteau est trop sucré.' },
  ],
  'na-adj': [
    { label: 'Présent affirmatif', form: 'な-adj + です', front: '〜です', meaning: 'Présent affirmatif (poli)',
      rule: 'na-adj (sans な) + です\nPlain : 〜だ\nDevant un nom : ajouter な.',
      example: 'この部屋は静かです。', trans: 'Cette pièce est calme.' },
    { label: 'Présent négatif', form: 'ではありません', front: '〜ではありません', meaning: 'Présent négatif',
      rule: 'na-adj (sans な) + ではありません\nInformel : じゃない.',
      example: 'この部屋は静かではありません。', trans: "Cette pièce n'est pas calme." },
    { label: 'Passé affirmatif', form: 'でした', front: '〜でした', meaning: 'Passé affirmatif',
      rule: 'na-adj (sans な) + でした',
      example: '昔、この町は静かでした。', trans: 'Avant, cette ville était calme.' },
    { label: 'Passé négatif', form: 'ではありませんでした', front: '〜ではありませんでした', meaning: 'Passé négatif',
      rule: 'na-adj (sans な) + ではありませんでした',
      example: '昔はそんなに有名ではありませんでした。', trans: "Avant, ce n'était pas si célèbre." },
    { label: 'Enchaînement', form: 'で形', front: '〜で', meaning: 'Forme て (enchaînement de descriptions)',
      rule: 'na-adj (sans な) + で',
      example: 'この部屋は静かできれいです。', trans: 'Cette pièce est calme et jolie.' },
    { label: 'Forme adverbiale', form: 'に形', front: '〜に (adverbe)', meaning: 'Modifier un verbe',
      rule: 'na-adj (sans な) + に',
      example: '上手に話せます。', trans: 'Je peux parler habilement.' },
    { label: 'Devenir', form: 'になります', front: '〜になります', meaning: 'Devenir [adj]',
      rule: 'na-adj (sans な) + になります',
      example: '日本語が上手になりました。', trans: "Mon japonais s'est amélioré." },
    { label: 'Apparence', form: 'そうです', front: '〜そうです', meaning: "Avoir l'air [adj]",
      rule: 'na-adj (sans な) + そうです',
      example: 'この問題は簡単そうです。', trans: "Ce problème a l'air facile." },
    { label: 'Excès', form: 'すぎます', front: '〜すぎます', meaning: 'Trop [adj]',
      rule: 'na-adj (sans な) + すぎます',
      example: 'この仕事は大変すぎます。', trans: 'Ce travail est trop difficile.' },
  ],
  'copula': [
    { label: 'Présent affirmatif', form: 'N + です', front: '〜です', meaning: "C'est un(e) [N] — présent poli",
      rule: 'nom + です\nPlain: nom + だ\n⚠ じゃない = négatif informel.',
      example: '私は学生です。', trans: 'Je suis étudiant(e).' },
    { label: 'Présent négatif', form: 'N + ではありません', front: '〜ではありません', meaning: "Ce n'est pas un(e) [N]",
      rule: 'nom + ではありません\nInformel : じゃありません / じゃない.',
      example: '私は先生ではありません。', trans: "Je ne suis pas professeur." },
    { label: 'Passé affirmatif', form: 'N + でした', front: '〜でした', meaning: "C'était un(e) [N]",
      rule: 'nom + でした\nPlain: nom + だった.',
      example: '昨日は休みでした。', trans: "Hier c'était un jour de repos." },
    { label: 'Passé négatif', form: 'N + ではありませんでした', front: '〜ではありませんでした', meaning: "Ce n'était pas un(e) [N]",
      rule: 'nom + ではありませんでした',
      example: '子供の頃、私は学生ではありませんでした。', trans: "Enfant, je n'étais pas encore étudiant(e)." },
    { label: 'Devenir', form: 'N + になります', front: '〜になります', meaning: 'Devenir un(e) [N]',
      rule: 'nom + になります',
      example: '医者になりたいです。', trans: 'Je veux devenir médecin.' },
  ],
  'comparison': [
    { label: 'Comparaison directe', form: 'より〜', front: 'A は B より 〜です', meaning: 'A est plus [adj] que B',
      rule: 'より = que (point de comparaison)\nQuestion : A と B と どちらが 〜ですか。',
      example: '東京は大阪より大きいです。', trans: "Tokyo est plus grande qu'Osaka." },
    { label: 'Construction のほうが', form: 'のほうが〜', front: 'A のほうが B より 〜です', meaning: 'A est plus [adj] que B (emphase sur A)',
      rule: 'のほうが met en relief l\'élément comparé.',
      example: '夏のほうが冬より好きです。', trans: "Je préfère l'été à l'hiver." },
    { label: 'Superlatif', form: '一番', front: '〜の中で 一番 〜です', meaning: 'Le/la plus [adj] parmi…',
      rule: 'の中で + 一番 + adj\nQuestion : どれ/どこ/だれが一番〜ですか。',
      example: 'クラスの中で田中さんが一番背が高いです。', trans: 'Dans la classe, Tanaka est le/la plus grand(e).' },
  ],
  'nominalizer': [
    { label: 'Nominalisation こと', form: 'こと', front: '〜こと (abstrait)', meaning: 'Le fait de [V] (abstrait / conceptuel)',
      rule: '辞書形 + こと\nUsages : ことが好き、ことができる、ことがある…',
      example: '日本語を勉強することが好きです。', trans: "J'aime étudier le japonais." },
    { label: 'Nominalisation の', form: 'の', front: '〜の (concret)', meaning: 'Le fait de [V] (observable)',
      rule: '辞書形 + の\nPour ce qu\'on peut voir ou percevoir directement.',
      example: '歌うのが上手です。', trans: 'Il/elle chante bien.' },
    { label: 'Habitude occasionnelle', form: '辞書形', front: '〜ことがあります (habitude)', meaning: "Il m'arrive parfois de [V]",
      rule: '辞書形 + ことがあります\n⚠ ≠ たことがあります (expérience ponctuelle).',
      example: '忙しい時、朝ご飯を食べないことがあります。', trans: "Quand je suis occupé(e), il m'arrive de sauter le petit-déj." },
  ],
};

const BASE_CARDS: Card[] = [
  { label: 'Copule affirmative', front: 'X は Y です', meaning: 'X est Y',
    rule: 'Structure de base pour identifier ou décrire.\nFormel : です ; dictionnaire : だ',
    example: '私は学生です。', trans: 'Je suis étudiant(e).' },
  { label: 'Marqueur de question', front: '〜か', meaning: 'Transforme une phrase en question',
    rule: 'Se place en fin de phrase, à la place du point.\nPas d\'inversion sujet-verbe.',
    example: 'これは本ですか。', trans: 'Est-ce un livre ?' },
  { label: 'Possession / modification', front: 'N₁ の N₂', meaning: 'Le N₂ de N₁',
    rule: 'の relie deux noms : possession, appartenance,\ncatégorie, contenu…',
    example: '私の本 / 田中さんの車', trans: 'mon livre / la voiture de Tanaka' },
  { label: 'Pronoms démonstratifs', front: 'これ / それ / あれ / どれ', meaning: 'ceci / cela / cela là-bas / lequel',
    rule: 'Pronoms seuls (sans nom après).\nこ = près du locuteur, そ = près de l\'interlocuteur, あ = loin des deux.',
    example: 'これはいくらですか。', trans: 'Combien coûte ceci ?' },
  { label: 'Adjectifs démonstratifs', front: 'この / その / あの / どの + N', meaning: 'ce N-ci / ce N-là / ce N là-bas / quel N',
    rule: 'Toujours suivis d\'un nom.\nMême logique de distance que これ/それ/あれ.',
    example: 'このかばんは高いです。', trans: 'Ce sac est cher.' },
  { label: 'Lieux démonstratifs', front: 'ここ / そこ / あそこ / どこ', meaning: 'ici / là / là-bas / où',
    rule: 'Désignent un lieu.\nどこ peut être suivi de に、で、へ、の…',
    example: 'トイレはどこですか。', trans: 'Où sont les toilettes ?' },
  { label: 'Appartenance interrogative', front: 'だれの + N', meaning: 'le N de qui ?',
    rule: 'だれ = qui (personnes). どの + N = quel N.\nRéponse : [personne] の + N です。',
    example: 'これはだれのかさですか。', trans: 'À qui est ce parapluie ?' },
  { label: 'Inclusion — aussi / même', front: 'N + も', meaning: 'N également, N aussi',
    rule: 'Remplace は, が ou を.\nAvec négatif : 何も食べない = ne rien manger.',
    example: '私も学生です。', trans: 'Moi aussi je suis étudiant(e).' },
  { label: 'Copule négative', front: 'N じゃないです', meaning: 'N n\'est pas le cas',
    rule: 'じゃ = contraction de では (plus formel).\nPassé négatif : じゃなかったです',
    example: '山田さんは先生じゃないです。', trans: 'Yamada n\'est pas professeur.' },
  { label: 'Particules finales', front: 'ね / よ', meaning: 'ね = confirmation / よ = assertion',
    rule: 'ね cherche l\'accord de l\'interlocuteur.\nよ informe ou insiste sur quelque chose.',
    example: 'そうですね。/ 大丈夫ですよ。', trans: 'C\'est bien ça. / C\'est bon, je t\'assure.' },
  { label: 'Particules essentielles', front: 'を / で / に・へ / と', meaning: 'objet / lieu d\'action / destination / avec',
    rule: 'を = objet direct  で = lieu où se passe l\'action\nに・へ = destination  と = avec quelqu\'un',
    example: '友達と図書館で日本語を勉強します。', trans: 'J\'étudie le japonais à la biblio. avec un ami.' },
  { label: 'Référence temporelle', front: 'に + heure / jour', meaning: 'à [heure] / le [jour de la semaine]',
    rule: 'Avec heures et jours de la semaine.\n⚠ Pas de に avec : 今日、明日、来週、毎〜, etc.',
    example: '７時に起きます。月曜日に授業があります。', trans: 'Je me lève à 7h. Le cours est le lundi.' },
  { label: 'Particule で — moyen', front: 'で (moyen / instrument / langue)', meaning: 'par, avec, en (moyen utilisé)',
    rule: 'Transport : バスで行く\nInstrument : はしで食べる\nLangue : 日本語で話す',
    example: 'バスで行きます。日本語で話しましょう。', trans: 'J\'y vais en bus. Parlons en japonais.' },
  { label: 'Particule が — sujet', front: 'が (sujet mis en valeur)', meaning: 'Identifie ou met en relief le sujet',
    rule: 'Vs は (thème) : が souligne QUI ou QUOI,\nrépondant à une question implicite.',
    example: '私が行きます。（pas quelqu\'un d\'autre）', trans: 'C\'est moi qui y vais.' },
  { label: 'Aimer / ne pas aimer', front: '好き（な）/ 嫌い（な）', meaning: 'aimer / ne pas aimer',
    rule: 'Se comportent comme des な-adj.\nLa chose aimée est sujet avec が.',
    example: '私は寿司が好きです。音楽が嫌いです。', trans: 'J\'aime les sushis. Je n\'aime pas la musique.' },
  { label: 'Adjectif épithète', front: 'い-adj + N  /  な-adj + な + N', meaning: 'Adjectif placé avant le nom',
    rule: 'い-adj : directement devant le nom\nな-adj : ajouter な avant le nom',
    example: '高い山 / 静かな図書館', trans: 'une haute montagne / une bibliothèque calme' },
];

const COUNT_CARDS: Card[] = [
  { label: 'Existence — inanimé', front: 'X が あります', meaning: 'Il y a X / X existe (objet, chose, événement)',
    rule: 'Pour les objets, plantes, événements.\nLieu : [Lieu] に X が あります。',
    example: '机の上に本があります。', trans: 'Il y a un livre sur le bureau.' },
  { label: 'Existence — animé', front: 'X が います', meaning: 'Il y a X / X est là (être vivant)',
    rule: 'Pour personnes, animaux, insectes…\nLieu : [Lieu] に X が います。',
    example: '部屋に猫がいます。', trans: 'Il y a un chat dans la chambre.' },
  { label: 'Localisation', front: '[Lieu] に あります / います', meaning: 'X se trouve à / dans [lieu]',
    rule: 'Question : X はどこにありますか / いますか。\nRéponse : [Lieu] にあります。',
    example: '銀行は駅の前にあります。', trans: 'La banque est devant la gare.' },
  { label: 'Passé de です', front: 'でした / じゃなかったです', meaning: 'était / n\'était pas',
    rule: 'でした = passé affirmatif\nじゃなかったです = passé négatif (formel : ではありませんでした)',
    example: '昨日は月曜日でした。', trans: 'Hier c\'était lundi.' },
  { label: 'も et と (nominaux)', front: 'Q + も + nég  /  N と N', meaning: 'rien / personne / nulle part  //  X et Y',
    rule: '何も・誰も・どこにも + nég = rien/personne/nulle part\nN と N = liste exhaustive de noms',
    example: '何も食べませんでした。本とペンを買いました。', trans: 'Je n\'ai rien mangé. J\'ai acheté un livre et un stylo.' },
  { label: 'Liste non exhaustive de noms', front: 'N₁ や N₂', meaning: 'N₁ et N₂ (entre autres)',
    rule: 'や ≠ と : と est exhaustif (X et Y, point final)\nや implique qu\'il y a d\'autres éléments non mentionnés.',
    example: 'りんごやバナナを買いました。', trans: 'J\'ai acheté des pommes, des bananes et d\'autres choses.' },
  { label: 'Quelque part / Nulle part', front: 'どこかに / どこにも〜ない', meaning: 'quelque part / nulle part',
    rule: '〜か + に/を = quelque chose / quelque part (aff.)\n〜にも + nég = rien, nulle part (aussi : 何も、誰にも)',
    example: '週末どこかに行きましたか。→ どこにも行きませんでした。', trans: 'Tu es allé(e) quelque part ? → Non, nulle part.' },
  { label: 'Adverbes de fréquence', front: 'いつも→よく→たいてい\nときどき→あまり→ぜんぜん', meaning: 'toujours → souvent → généralement\nparfois → peu → pas du tout',
    rule: 'あまり et ぜんぜん se construisent avec un verbe négatif.',
    example: 'あまりテレビを見ません。', trans: 'Je ne regarde pas souvent la télé.' },
  { label: 'Fréquence sur période', front: '[Période] に [Nombre] 回 / 度', meaning: '[X] fois par [période]',
    rule: '回 (かい) et 度 (ど) = "fois".\n[Période] + に = par (unité de temps).\n例 週に三回 / 一日に二度 / 月に一度',
    example: '週に三回ジムに行きます。一日に二度歯を磨きます。', trans: 'Je vais à la salle 3 fois par semaine. Je me brosse les dents 2 fois par jour.' },
  { label: 'Compteurs courants', front: '〜つ / 〜人 / 〜枚 / 〜本 / 〜冊', meaning: 'objets (1-9) / personnes / plats / longs / livres',
    rule: '〜つ: ひとつ ふたつ みっつ よっつ いつつ…\n〜人: ひとり ふたり さんにん…',
    example: 'みかんをふたつください。', trans: 'Donnez-moi deux mandarines, s.v.p.' },
  { label: 'Celui qui est [adj]', front: 'Adj / N + の', meaning: 'Celui / celle qui est [adj]',
    rule: 'の remplace un nom déjà mentionné.\nÉvite la répétition : 大きいかばん → 大きいの',
    example: '大きいのをください。赤いのはいくらですか。', trans: 'Donnez-moi le grand. Combien coûte le rouge ?' },
];

const PLAIN_CARDS: Card[] = [
  { label: 'Formes courtes — présent', form: '辞書形 / ない形', front: 'Plain forms (présent)', meaning: 'Formes de base non polies',
    rule: 'V : forme dict. / ない  adj-い : 〜い / 〜くない\nな-adj / N + だ / じゃない\nUsages : subordonnées, conversation naturelle.',
    example: '食べる / 食べない / 高い / 静かだ', trans: '(formes utilisées dans la langue courante)' },
  { label: 'Formes courtes — passé', form: 'た形 / なかった形', front: 'Plain forms (passé)', meaning: 'Formes de base passées',
    rule: 'V : forme た / なかった  adj-い : 〜かった / 〜くなかった\nな-adj / N + だった / じゃなかった',
    example: '食べた / 食べなかった / 高かった / 静かだった', trans: '(formes passées courtes)' },
  { label: 'Opinion sur le passé', form: 'た形', front: '〜たと思います', meaning: 'Je pense que (il/elle) a fait…',
    rule: '[Forme た] + と思います.\nPour exprimer une opinion sur un fait passé.',
    example: '田中さんはもう行ったと思います。', trans: 'Je pense que Tanaka est déjà parti(e).' },
  { label: 'Discours indirect', form: '短縮形', front: '〜と言っていました', meaning: '(Il/elle) a dit que…',
    rule: '[Forme courte] + と言っていました.\nPassé : [Forme た] + と言っていました.',
    example: '田中さんは来ると言っていました。行ったと言っていました。', trans: 'Tanaka a dit qu\'il/elle viendrait. / qu\'il/elle y était allé(e).' },
  { label: 'Qualification d\'un nom', form: '短縮形', front: 'V / Adj (forme courte) + Nom', meaning: 'Proposition relative avant un nom',
    rule: 'La forme courte (présent ou passé) se place\ndirectement avant le nom qu\'elle qualifie.',
    example: '昨日食べたケーキ / 背が高い人', trans: 'le gâteau que j\'ai mangé hier / une grande personne' },
  { label: 'Déjà / Pas encore', form: 'ます形 / て形', front: 'もう〜ました / まだ〜ていません', meaning: 'Déjà fait / Pas encore fait',
    rule: 'もう + passé poli = action accomplie\nまだ + ていません = action non encore accomplie',
    example: 'もう宿題をしました。まだしていません。', trans: 'J\'ai déjà fait mes devoirs. / Je ne les ai pas encore faits.' },
  { label: 'Invitation polie', form: 'ます形', front: '〜ませんか', meaning: 'Ne voulez-vous pas… ?',
    rule: 'Proposition à faire quelque chose ensemble.\nPlus indirect et poli que ましょう.',
    example: '一緒に映画を見ませんか。', trans: 'On va voir un film ensemble ?' },
  { label: 'Offre', form: 'ます形', front: '〜ましょうか', meaning: 'Voulez-vous que je… ?',
    rule: 'ましょうか = offre de faire qqch pour l\'autre\n(ましょう seul = suggestion collective).',
    example: '手伝いましょうか。', trans: 'Puis-je vous aider ?' },
  { label: 'Enchaînement d\'actions', form: 'て形', front: 'V₁ て + V₂', meaning: 'Faire V₁ puis V₂',
    rule: 'Relie deux actions successives.\nL\'ordre des verbes = ordre réel des actions.',
    example: '朝起きて、シャワーを浴びます。', trans: 'Le matin je me lève et prends une douche.' },
  { label: 'Explication / mise en contexte', form: '短縮形', front: '〜んです / のです', meaning: 'Le fait est que… / C\'est que…',
    rule: 'Fournit ou sollicite une explication.\nV/adj (plain) + んです  /  な-adj・N + なんです',
    example: '頭が痛いんです。— そうなんですか。', trans: 'Le fait est que j\'ai mal à la tête. — Ah bon !' },
  { label: 'Question polie / doute', form: '短縮形', front: '〜でしょうか', meaning: 'Je me demande si… / Serait-il possible que… ?',
    rule: 'Plus poli et incertain que ですか.\nIndique une hésitation ou une question rhétorique.',
    example: '明日は雨でしょうか。', trans: 'Je me demande s\'il va pleuvoir demain.' },
  { label: 'Cumul de raisons', form: '短縮形', front: '〜し、〜し、…', meaning: 'D\'un côté…, d\'un autre côté… (cumul)',
    rule: '[Raison₁ (forme courte)] し、[Raison₂] し、[Résultat/Opinion].\nNon exhaustif : sous-entend d\'autres raisons.\nV/adj plain + し  /  N・な-adj + だし',
    example: '安いし、おいしいし、このお店が好きです。', trans: 'C\'est pas cher, c\'est bon, j\'aime ce restaurant.' },
];

const LEVEL_STYLE: Record<string, { tab: string; badge: string }> = {
  N5:     { tab: 'border-green-600/60 text-green-300',   badge: 'bg-green-900/40 text-green-300 border-green-600/50' },
  'N5–N4':{ tab: 'border-blue-600/60 text-blue-300',    badge: 'bg-blue-900/40 text-blue-300 border-blue-600/50' },
  N4:     { tab: 'border-blue-600/60 text-blue-300',    badge: 'bg-blue-900/40 text-blue-300 border-blue-600/50' },
  'N4–N3':{ tab: 'border-purple-600/60 text-purple-300',badge: 'bg-purple-900/40 text-purple-300 border-purple-600/50' },
  N3:     { tab: 'border-purple-600/60 text-purple-300',badge: 'bg-purple-900/40 text-purple-300 border-purple-600/50' },
};

interface Tab { id: string; nameFR: string; nameJP: string; level: string; freq?: number; }

// Fiches de cours sans exercice associé : reprennent l'ancien contenu par leçons
const REFERENCE_TABS: Tab[] = [
  { id: 'ref-basics', nameFR: 'Bases et particules', nameJP: '基本・助詞', level: 'N5' },
  { id: 'ref-count',  nameFR: 'Existence et quantité', nameJP: '存在・数量', level: 'N5' },
  { id: 'ref-plain',  nameFR: 'Formes courtes et discours', nameJP: '普通形・会話', level: 'N4' },
];
CATEGORY_CARDS['ref-basics'] = BASE_CARDS;
CATEGORY_CARDS['ref-count'] = COUNT_CARDS;
CATEGORY_CARDS['ref-plain'] = PLAIN_CARDS;

const TABS: Tab[] = [...REFERENCE_TABS, ...GRAMMAR_CATEGORIES];

function multiline(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

export function GrammarPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const selectTab = (i: number) => {
    setFlipped(new Set());
    setCurrentIdx(i);
  };

  const cat = TABS[currentIdx];
  const cards = CATEGORY_CARDS[cat.id] ?? [];
  const style = LEVEL_STYLE[cat.level] ?? LEVEL_STYLE['N4'];

  const toggle = (i: number) => {
    setFlipped(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Category tabs */}
      <div className="overflow-x-auto -mx-4 px-4 mb-6" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-1 min-w-max">
          {TABS.map((c, i) => {
            const s = LEVEL_STYLE[c.level] ?? LEVEL_STYLE['N4'];
            const active = i === currentIdx;
            return (
              <button
                key={c.id}
                onClick={() => selectTab(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap border ${
                  active
                    ? `${s.tab} bg-[#21262d]`
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#21262d]'
                }`}
              >
                {c.nameFR}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category heading */}
      <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[#30363d]">
        <span className="kanji-char text-3xl text-japan-red opacity-80 select-none leading-none">
          {cat.nameJP}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h2 className="text-lg font-bold text-white">{cat.nameFR}</h2>
            <span className={`text-[10px] font-bold border rounded px-1.5 py-px ${style.badge}`}>
              {cat.level}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {cards.length} fiche{cards.length > 1 ? 's' : ''}{cat.freq !== undefined && ` · fréquence ${cat.freq}/100`}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center mb-4 tracking-wide">
        Cliquez sur une fiche pour révéler la règle
      </p>

      {/* Cards grid */}
      <div
        key={cat.id}
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
      >
        {cards.map((card, i) => {
          const isFlipped = flipped.has(i);
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Fiche ${i + 1} : ${card.label}`}
              onClick={() => toggle(i)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}
              className="cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-japan-red focus-visible:outline-offset-2"
              style={{ height: '280px', perspective: '900px' }}
            >
              <div
                style={{
                  position: 'relative', width: '100%', height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.42s cubic-bezier(0.4,0,0.2,1)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-xl p-4 flex flex-col bg-[#161b22] border border-[#30363d] shadow-lg overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', borderLeftWidth: '3px', borderLeftColor: '#c84535' }}
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
                    Cliquer pour voir la règle →
                  </p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl p-4 flex flex-col bg-[#0f1929] border border-[#30363d] shadow-lg overflow-y-auto"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderLeftWidth: '3px', borderLeftColor: '#c84535' }}
                >
                  <p className="text-sm font-bold text-white mb-1.5 leading-snug">
                    {card.meaning}
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
