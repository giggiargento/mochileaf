import type { TierEntry } from '../types';

const nteTierList: TierEntry[] = [
  {
    tier: 'S',
    members: [
      { label: 'Baicang', slug: 'baicang' },
      { label: 'Chiz', slug: 'chiz' },
      { label: 'Daffodil', slug: 'daffodil' },
      { label: 'Nanally', slug: 'nanally' },
      { label: 'Sakiri', slug: 'sakiri' },
    ],
  },
  {
    tier: 'A',
    members: [
      { label: 'Fadia', slug: 'fadia' },
      { label: 'Hathor', slug: 'hathor' },
      { label: 'Hotori', slug: 'hotori' },
      { label: 'Jiuyuan', slug: 'jiuyuan' },
      { label: 'Zero (F)', slug: 'zero-female' },
    ],
  },
  {
    tier: 'B',
    members: [
      { label: 'Aurelia', slug: 'aurelia' },
      { label: 'Haniel', slug: 'haniel' },
      { label: 'Xun', slug: 'xun' },
      { label: 'Zero (M)', slug: 'zero-male' },
    ],
  },
  {
    tier: 'C',
    members: [
      { label: 'Adler', slug: 'adler' },
      { label: 'Edgar', slug: 'edgar' },
      { label: 'Mint', slug: 'mint' },
      { label: 'Skia', slug: 'skia' },
    ],
  },
  { tier: 'D', members: [{ label: '—' }] },
];

export function getTierListForGame(gameSlug: string): TierEntry[] {
  if (gameSlug === 'neverness-to-everness') return nteTierList;
  return [
    { tier: 'S', members: [{ label: 'Coming soon' }] },
    { tier: 'A', members: [{ label: '—' }] },
    { tier: 'B', members: [{ label: '—' }] },
    { tier: 'C', members: [{ label: '—' }] },
    { tier: 'D', members: [{ label: '—' }] },
  ];
}
