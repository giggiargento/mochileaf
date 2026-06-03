import type { TierEntry } from '../types';

/** Aligned with https://neverness.gg/tier-list/ (S+ and S → S; Lacrimosa TBD there → A until updated). */
const nteTierList: TierEntry[] = [
  {
    tier: 'S',
    members: [
      { label: 'Baicang', slug: 'baicang' },
      { label: 'Chiz', slug: 'chiz' },
      { label: 'Haniel', slug: 'haniel' },
      { label: 'Hotori', slug: 'hotori' },
      { label: 'Jiuyuan', slug: 'jiuyuan' },
      { label: 'Nanally', slug: 'nanally' },
      { label: 'Sakiri', slug: 'sakiri' },
      { label: 'Zero (F)', slug: 'zero-female' },
      { label: 'Zero (M)', slug: 'zero-male' },
    ],
  },
  {
    tier: 'A',
    members: [
      { label: 'Daffodil', slug: 'daffodil' },
      { label: 'Hathor', slug: 'hathor' },
      { label: 'Lacrimosa', slug: 'lacrimosa' },
    ],
  },
  {
    tier: 'B',
    members: [
      { label: 'Adler', slug: 'adler' },
      { label: 'Aurelia', slug: 'aurelia' },
      { label: 'Fadia', slug: 'fadia' },
      { label: 'Mint', slug: 'mint' },
    ],
  },
  {
    tier: 'C',
    members: [
      { label: 'Edgar', slug: 'edgar' },
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
