const QUESTS = [
  {
    id: 1, icon: '🚪', color: '#FFF3CC',
    title: 'The Door of Secrets',
    location: 'Entrance · Ornate wooden door',
    duration: '~8 min', difficulty: 'Beginner',
    badge: 'Seeker', badgeIcon: '🚪',
    points: 200,
    desc: 'You stand before the ancient copper-adorned door of the Zaoua. Scan the QR code and let the history unfold. Answer correctly to earn your Seeker badge.',
    learn: [
      'History of the Issawiya Sufi brotherhood and its founder',
      'Symbolic meaning of the ornate wooden door in Sufi architecture'
    ],
    type: 'quiz',
    question: 'Who founded the Issawiya Sufi brotherhood that established this Zaoua?',
    options: [
      { text: 'Sidi Belhassen Chedly, patron saint of Tunis', correct: false },
      { text: 'Sidi Mohammed Ben Assa of Meknes, Morocco', correct: true },
      { text: 'An Aghlabid ruler of Ifriqiya', correct: false },
      { text: 'The Husaynid Beys of the 18th century', correct: false }
    ]
  },
  {
    id: 2, icon: '🔷', color: '#E1F5EE',
    title: 'The Language of Tiles',
    location: 'Courtyard · Zellige walls',
    duration: '~10 min', difficulty: 'Intermediate',
    badge: 'Observer', badgeIcon: '🔷',
    points: 200,
    desc: 'The inner courtyard reveals intricate zellige tilework. Point your camera at the geometric patterns — each motif carries a sacred message.',
    learn: [
      'Symbolism of Islamic geometric patterns in Tunisian architecture',
      'The spiritual significance of the 8-pointed star (Khatam)'
    ],
    type: 'ar-quiz',
    question: 'What does the 8-pointed star (Khatam) in Islamic geometric art symbolize?',
    options: [
      { text: 'The four seasons of the agricultural calendar', correct: false },
      { text: 'The seven pillars of Islamic law (Sharia)', correct: false },
      { text: 'The union of spiritual and earthly realms, pointing to God in all directions', correct: true },
      { text: 'Pure decoration with no symbolic meaning', correct: false }
    ]
  },
  {
    id: 3, icon: '🎵', color: '#F3E8FF',
    title: 'The Voice of the Saint',
    location: 'Mausoleum · Domed Qubba',
    duration: '~10 min', difficulty: 'Intermediate',
    badge: 'Devotee', badgeIcon: '🎵',
    points: 200,
    desc: 'You enter the domed mausoleum. A dhikr recording fills the sacred air. Listen closely and demonstrate your understanding of the spiritual path.',
    learn: [
      'The concept of baraka (divine blessing) in Sufi tradition',
      'The role of the Qubba mausoleum in Maghrebi religious life'
    ],
    type: 'audio-quiz',
    question: 'What is "baraka" in Sufi tradition?',
    options: [
      { text: 'The official title given to a mosque imam', correct: false },
      { text: 'A divine blessing or spiritual power flowing through saints and sacred places', correct: true },
      { text: 'A type of Islamic architecture found only in Morocco', correct: false },
      { text: 'The annual pilgrimage to Mecca', correct: false }
    ]
  },
  {
    id: 4, icon: '🧩', color: '#FDE8E8',
    title: 'Two Pillars, One City',
    location: 'Great Mosque · Transition Gateway',
    duration: '~12 min', difficulty: 'Advanced',
    badge: 'Scholar', badgeIcon: '🧩',
    points: 200,
    desc: 'Tbourba has two hearts — the Mosque and the Zaoua. Each serves the community differently. Sort their sacred functions into their rightful sanctuary.',
    learn: [
      'The complementary roles of mosque and zaoua in North African society',
      'How Sufism and orthodox Islam coexisted in Tunisian heritage'
    ],
    type: 'dragdrop',
    items: [
      { text: 'Friday sermon', col: 'mosque' },
      { text: 'Dhikr chanting', col: 'zaoua' },
      { text: 'Islamic law', col: 'mosque' },
      { text: "Saint's baraka", col: 'zaoua' },
      { text: 'Daily prayers', col: 'mosque' },
      { text: 'Sufi rituals', col: 'zaoua' }
    ]
  },
  {
    id: 5, icon: '📜', color: '#E6F1FB',
    title: 'Guardian of Memory',
    location: 'Digital Archive · Finale Ceremony',
    duration: '~10 min', difficulty: 'Advanced',
    badge: 'Guardian', badgeIcon: '📜',
    points: 200,
    desc: 'The scrolls of the Zaoua are in disarray. Weave the threads of time back to their sacred alignment. Arrange events chronologically to claim your title.',
    learn: [
      'Four centuries of the Zaoua de Sidi-Assa timeline',
      'The role of Husaynid dynasty patronage in Tunisian heritage'
    ],
    type: 'timeline',
    events: [
      { year: '~850 CE', desc: 'Great Mosque of Tbourba founded — Aghlabid dynasty', order: 1 },
      { year: '~1465', desc: 'Sidi Mohammed Ben Assa born — founder of the Issawiya brotherhood in Meknes', order: 2 },
      { year: '~1650', desc: 'Issawiya disciples establish the Zaoua de Sidi-Assa in Tbourba', order: 3 },
      { year: '1813 & 1896', desc: 'Husaynid dynasty restores and expands the Zaoua twice', order: 4 },
      { year: '1915', desc: 'French Protectorate classifies it as an official Historical Monument', order: 5 }
    ]
  }
];

const BADGES = [
  { id: 1, icon: '🚪', name: 'Seeker', cond: 'Complete Quest 1 · Door of Secrets' },
  { id: 2, icon: '🔷', name: 'Observer', cond: 'Complete Quest 2 · Language of Tiles' },
  { id: 3, icon: '🎵', name: 'Devotee', cond: 'Complete Quest 3 · Voice of the Saint' },
  { id: 4, icon: '🧩', name: 'Scholar', cond: 'Complete Quest 4 · Two Pillars' },
  { id: 5, icon: '📜', name: 'Guardian', cond: 'Complete Quest 5 · Guardian of Memory' }
];

const LIBRARY = {
  history: [
    { icon: '🏛️', tag: 'HISTORY', title: 'The Legacy of Sidi-Assa', desc: 'A deep dive into the 16th-century mystic who founded the Issawiya brotherhood, shaping the spiritual landscape of the Maghreb region.', time: '5 min read', url: 'https://en.wikipedia.org/wiki/Muhammad_ibn_Isa' },
    { icon: '📜', tag: 'HISTORY', title: 'Four Centuries of Patronage', desc: 'How the Husaynid dynasty invested in the Zaoua across two major restorations in 1813 and 1896, preserving its legacy.', time: '4 min read', url: 'https://en.wikipedia.org/wiki/Husainid_dynasty' },
    { icon: '🗺️', tag: 'HISTORY', title: 'Tbourba Through the Ages', desc: 'The city of Tbourba as a spiritual and commercial crossroads in northern Tunisia from the Aghlabid period onward.', time: '6 min read', url: 'https://en.wikipedia.org/wiki/Tbourba' }
  ],
  architecture: [
    { icon: '🔷', tag: 'ARCHITECTURE', title: 'Patterns of the Courtyard', desc: 'Decoding the mathematical beauty and visual symbolism embedded in the zellige tilework of the sacred courtyard walls.', time: '8 min read', url: 'https://en.wikipedia.org/wiki/Zellige' },
    { icon: '🕌', tag: 'ARCHITECTURE', title: 'The Qubba Tradition', desc: 'The domed mausoleum as a form of sacred architecture across the Maghreb — its spiritual geometry and spatial symbolism.', time: '5 min read', url: 'https://en.wikipedia.org/wiki/Qubba' },
    { icon: '🚪', tag: 'ARCHITECTURE', title: 'Sacred Thresholds', desc: 'Why the door of a Zaoua is its most powerful architectural element — the threshold between the ordinary and the sacred.', time: '4 min read', url: 'https://en.wikipedia.org/wiki/Zawiya_(religious_school)' }
  ],
  sufism: [
    { icon: '🎵', tag: 'SUFISM', title: 'The Art of Dhikr', desc: "The rhythmic recitation of God's names as practiced by the Issawiya brotherhood — its history, forms, and spiritual purpose.", time: '7 min read', url: 'https://en.wikipedia.org/wiki/Dhikr' },
    { icon: '✨', tag: 'SUFISM', title: 'Baraka and the Saints', desc: 'Understanding the concept of divine blessing (baraka) as it flows through the lineage of Sufi saints in North African tradition.', time: '5 min read', url: 'https://en.wikipedia.org/wiki/Barakah' },
    { icon: '🌙', tag: 'SUFISM', title: 'Zaoua vs Mosque', desc: 'How these two sacred institutions served complementary spiritual roles — law and spirit, mind and soul, duty and devotion.', time: '6 min read', url: 'https://en.wikipedia.org/wiki/Zawiya_(religious_school)' }
  ]
};
