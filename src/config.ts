export const SITE = {
  title: 'WJC · 笔记与随想',
  shortTitle: 'WJC',
  description: '记录技术、学习与生活中的长期思考。',
  author: 'WJC',
  origin: 'https://chenwuluqi.github.io',
  repository: 'https://github.com/chenWULUQI/wjc.github.io',
};

export const NAVIGATION = [
  { label: '首页', href: '/' },
  { label: '写作', href: '/writing/' },
  { label: '技术', href: '/tech/' },
  { label: '归档', href: '/archive/' },
  { label: '标签', href: '/tags/' },
  { label: '关于', href: '/about/' },
];

export const CATEGORY_LABELS = {
  essay: '随笔',
  tech: '技术',
  life: '生活',
  notes: '笔记',
} as const;
