import type { Domain } from '../types';

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
  'Nombres': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'hundred', 'thousand', 'ten thousand', 'number', 'count', 'half', 'double', 'zero', 'numeral'],
  'Nature': ['water', 'fire', 'earth', 'wood', 'metal', 'mountain', 'river', 'sea', 'ocean',
    'lake', 'tree', 'flower', 'plant', 'grass', 'rain', 'wind', 'cloud', 'snow', 'sun', 'moon',
    'star', 'sky', 'ground', 'stone', 'rock', 'forest', 'field', 'island', 'valley', 'sand',
    'wave', 'light', 'shadow', 'ice', 'steam', 'vapor', 'nature', 'heaven', 'spring', 'land',
    'soil', 'shore', 'beach', 'cliff', 'peak', 'plain', 'rice field', 'paddy'],
  'Corps humain': ['eye', 'ear', 'mouth', 'nose', 'hand', 'foot', 'leg', 'arm', 'finger', 'toe',
    'head', 'face', 'neck', 'heart', 'body', 'bone', 'blood', 'skin', 'hair', 'tooth', 'teeth',
    'tongue', 'lip', 'chest', 'back', 'stomach', 'kidney', 'liver', 'lung', 'throat', 'shoulder',
    'elbow', 'knee', 'wrist', 'ankle', 'nail', 'spine', 'muscle', 'nerve'],
  'Famille & Personnes': ['father', 'mother', 'son', 'daughter', 'child', 'sibling', 'brother',
    'sister', 'husband', 'wife', 'parent', 'ancestor', 'family', 'relative', 'grandfather',
    'grandmother', 'grandson', 'granddaughter', 'uncle', 'aunt', 'cousin', 'nephew', 'niece',
    'man', 'woman', 'person', 'people', 'human', 'baby', 'infant', 'adult', 'elderly', 'folk',
    'friend', 'companion', 'rival', 'enemy', 'king', 'queen', 'lord', 'lady', 'warrior', 'knight'],
  'Animaux': ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'rabbit', 'snake',
    'tiger', 'bear', 'monkey', 'insect', 'bug', 'dragon', 'animal', 'beast', 'deer', 'fox',
    'wolf', 'lion', 'elephant', 'whale', 'dolphin', 'turtle', 'frog', 'fly', 'bee', 'butterfly',
    'crab', 'shrimp', 'shell', 'feather', 'wing', 'claw', 'fang'],
  'Nourriture & Boissons': ['rice', 'food', 'eat', 'drink', 'meal', 'meat', 'fish', 'vegetable',
    'fruit', 'sweet', 'alcohol', 'sake', 'tea', 'cook', 'hunger', 'taste', 'flavor', 'salt',
    'sugar', 'soy', 'bread', 'soup', 'noodle', 'sauce', 'vinegar', 'oil', 'wheat', 'bean',
    'tofu', 'broth', 'boil', 'roast', 'fry', 'bake'],
  'Lieux & Bâtiments': ['country', 'city', 'town', 'village', 'house', 'home', 'school', 'store',
    'shop', 'road', 'street', 'bridge', 'gate', 'door', 'room', 'place', 'region', 'area',
    'district', 'castle', 'temple', 'shrine', 'hospital', 'station', 'port', 'harbor', 'market',
    'park', 'garden', 'palace', 'tower', 'wall', 'roof', 'floor', 'window', 'hall', 'library',
    'factory', 'farm', 'office', 'bank', 'inn', 'hotel', 'theater'],
  'Temps & Saisons': ['day', 'month', 'year', 'hour', 'minute', 'second', 'morning', 'evening',
    'night', 'noon', 'week', 'time', 'season', 'spring', 'summer', 'autumn', 'fall', 'winter',
    'today', 'tomorrow', 'yesterday', 'now', 'before', 'after', 'early', 'late', 'always',
    'sometimes', 'never', 'often', 'recently', 'ancient', 'modern', 'future', 'past', 'era',
    'age', 'period', 'moment', 'instant', 'duration', 'interval', 'dawn', 'dusk', 'midnight'],
  'Couleurs': ['red', 'blue', 'green', 'yellow', 'white', 'black', 'purple', 'orange', 'pink',
    'color', 'colour', 'brown', 'gray', 'grey', 'golden', 'silver', 'bright', 'dark', 'pale',
    'vivid', 'dye', 'paint', 'pigment'],
  'Transport': ['car', 'train', 'ship', 'boat', 'airplane', 'plane', 'bicycle', 'vehicle',
    'travel', 'journey', 'ride', 'drive', 'sail', 'fly', 'walk', 'run', 'wheel', 'engine',
    'fuel', 'road', 'rail', 'route', 'passage', 'crossing', 'ferry', 'cart', 'wagon', 'bus'],
  'Éducation & Langue': ['study', 'learn', 'school', 'teacher', 'student', 'pupil', 'book',
    'write', 'read', 'character', 'letter', 'language', 'literature', 'knowledge', 'grade',
    'exam', 'test', 'class', 'lesson', 'subject', 'science', 'math', 'history', 'art', 'music',
    'grammar', 'sentence', 'word', 'meaning', 'dictionary', 'question', 'answer', 'explain',
    'understand', 'remember', 'forget', 'translate', 'speak', 'voice', 'sound', 'say', 'call',
    'talk', 'name', 'story', 'news', 'poem', 'novel', 'text', 'document', 'record'],
  'Travail & Commerce': ['work', 'labor', 'job', 'occupation', 'business', 'company', 'office',
    'factory', 'build', 'make', 'create', 'produce', 'money', 'price', 'buy', 'sell', 'trade',
    'market', 'pay', 'gold', 'silver', 'coin', 'profit', 'loss', 'tax', 'salary', 'wage',
    'merchant', 'goods', 'product', 'service', 'manage', 'control', 'rule', 'law', 'army',
    'soldier', 'officer', 'government', 'official', 'minister', 'nation', 'politics', 'war',
    'peace', 'power', 'authority'],
  'Émotions & État': ['happy', 'sad', 'angry', 'afraid', 'love', 'hate', 'like', 'dislike',
    'joy', 'sorrow', 'worry', 'fear', 'mind', 'heart', 'feeling', 'think', 'thought', 'will',
    'desire', 'hope', 'wish', 'dream', 'spirit', 'soul', 'emotion', 'mood', 'pain', 'pleasure',
    'peace', 'calm', 'quiet', 'kind', 'gentle', 'cruel', 'brave', 'coward', 'proud', 'humble',
    'shame', 'honor', 'glory', 'suffering', 'comfort', 'lonely', 'grateful'],
  'Actions & Mouvements': ['go', 'come', 'return', 'enter', 'exit', 'rise', 'fall', 'stand',
    'sit', 'lie', 'move', 'stop', 'start', 'open', 'close', 'give', 'take', 'put', 'pull',
    'push', 'throw', 'catch', 'hold', 'release', 'cut', 'break', 'join', 'separate', 'mix',
    'turn', 'change', 'become', 'exist', 'live', 'die', 'born', 'grow', 'increase', 'decrease',
    'send', 'receive', 'carry', 'bring', 'lift', 'lower', 'shake', 'touch', 'hit', 'kick'],
};

export function getDomainsForKanji(meanings: string[]): Domain[] {
  const lowerMeanings = meanings.map((m) => m.toLowerCase());
  const matched = new Set<Domain>();

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS) as [Domain, string[]][]) {
    for (const keyword of keywords) {
      if (lowerMeanings.some((m) => m.includes(keyword))) {
        matched.add(domain);
        break;
      }
    }
  }

  return Array.from(matched);
}

export function jlptNumericToLabel(jlpt: number | null): 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | null {
  if (jlpt === null) return null;
  return `N${jlpt}` as 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
}
