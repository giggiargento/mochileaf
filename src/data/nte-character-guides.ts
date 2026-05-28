import type { Character, NteCharacterGuide } from '../types';

const iconBase = '/images/games/neverness-to-everness/icons';

const elementIcon: Record<string, string> = {
  Cosmos: `${iconBase}/Cosmos.webp`,
  Anima: `${iconBase}/Anima.webp`,
  Incantation: `${iconBase}/Incantation.webp`,
  Chaos: `${iconBase}/Chaos.webp`,
  Psyche: `${iconBase}/Psyche.webp`,
  Lakshana: `${iconBase}/Lakshana.webp`,
};

const defaultsByRole: Record<string, Omit<NteCharacterGuide, 'buildSummary'>> = {
  Attack: {
    diskSets: [
      { name: '4pc DPS core set', note: 'Prioritize Crit Rate / Crit DMG / ATK.' },
      { name: '2pc Element support', note: 'Match element bonus to this character.' },
    ],
    modules: [
      { name: 'Crit module line', note: 'Main source of burst consistency.' },
      { name: 'ATK + Cycle Rate module', note: 'Smooth rotations and skill uptime.' },
    ],
    skillPriority: ['Ultimate', 'Skill', 'Basic Attack', 'Support Skill'],
    farming: [
      {
        name: 'Esper EXP materials',
        purpose: 'Level cap and ascension breakpoints.',
        location: 'Rabbit Hole > Character Growth simulations',
        tip: 'Spend daily stamina here first until your main DPS hits next ascension cap.',
      },
      {
        name: 'Weapon/Arc upgrade mats',
        purpose: 'Main damage multiplier.',
        location: 'Rabbit Hole > Arc/Weapon material anomalies',
        tip: 'Farm on days matching your Arc upgrade route before side content.',
      },
      {
        name: 'Module enhancement chips',
        purpose: 'Crit/ATK scaling.',
        location: 'Anomaly Investigation > Module domains',
        tip: 'Use these after EXP/Arc mats; module gains are strongest mid/late progression.',
      },
    ],
  },
  Support: {
    diskSets: [
      { name: '4pc Utility set', note: 'Buff uptime, healing, or shield value.' },
      { name: '2pc Energy/Cycle set', note: 'Faster support-skill rotations.' },
    ],
    modules: [
      { name: 'Cycle Rate module line', note: 'Enables more frequent Esper triggers.' },
      { name: 'HP/DEF utility line', note: 'Survivability on longer fights.' },
    ],
    skillPriority: ['Support Skill', 'Skill', 'Ultimate', 'Basic Attack'],
    farming: [
      {
        name: 'Esper EXP materials',
        purpose: 'Reach survivability breakpoints.',
        location: 'Rabbit Hole > Character Growth simulations',
        tip: 'Keep supports within 10 levels of your main carry for safer anomaly runs.',
      },
      {
        name: 'Support-skill upgrade mats',
        purpose: 'Buff/heal scaling.',
        location: 'Rabbit Hole > Skill material anomalies',
        tip: 'Prioritize the support skill node before basic attack upgrades.',
      },
      {
        name: 'Module enhancement chips',
        purpose: 'Cooldown and durability value.',
        location: 'Anomaly Investigation > Module domains',
        tip: 'Target Cycle Rate and HP/DEF lines for consistency.',
      },
    ],
  },
  Defense: {
    diskSets: [
      { name: '4pc Guard set', note: 'Damage reduction and frontline uptime.' },
      { name: '2pc Utility set', note: 'Extra team value while tanking.' },
    ],
    modules: [
      { name: 'DEF/HP module line', note: 'Frontline stability first.' },
      { name: 'Cycle Rate utility line', note: 'Keep control/support active.' },
    ],
    skillPriority: ['Skill', 'Support Skill', 'Ultimate', 'Basic Attack'],
    farming: [
      {
        name: 'Esper EXP materials',
        purpose: 'Tank breakpoints for boss content.',
        location: 'Rabbit Hole > Character Growth simulations',
        tip: 'Raise DEF units early if your team gets one-shot in anomalies.',
      },
      {
        name: 'Defense skill materials',
        purpose: 'Shield/mitigation scaling.',
        location: 'Rabbit Hole > Skill material anomalies',
        tip: 'Upgrade mitigation skills before damage skills on tanks.',
      },
      {
        name: 'Module enhancement chips',
        purpose: 'DEF/HP line progression.',
        location: 'Anomaly Investigation > Module domains',
        tip: 'Focus defensive substats first, then utility.',
      },
    ],
  },
  Assist: {
    diskSets: [
      { name: '4pc Utility set', note: 'Team buffs and control value.' },
      { name: '2pc Energy/Cycle set', note: 'Frequent utility activations.' },
    ],
    modules: [
      { name: 'Cycle Rate module line', note: 'Primary stat line for assist units.' },
      { name: 'HP/ATK hybrid line', note: 'Balance personal value and survival.' },
    ],
    skillPriority: ['Support Skill', 'Ultimate', 'Skill', 'Basic Attack'],
    farming: [
      {
        name: 'Esper EXP materials',
        purpose: 'Unlock assist utility checkpoints.',
        location: 'Rabbit Hole > Character Growth simulations',
        tip: 'Bring assists to ascension breakpoints that unlock key passive nodes.',
      },
      {
        name: 'Support upgrade mats',
        purpose: 'Improve buff/control consistency.',
        location: 'Rabbit Hole > Skill material anomalies',
        tip: 'Prioritize control/buff skill ranks over personal DPS.',
      },
      {
        name: 'Module enhancement chips',
        purpose: 'Cycle and utility scaling.',
        location: 'Anomaly Investigation > Module domains',
        tip: 'Cycle Rate + utility lines generally outperform pure ATK on assists.',
      },
    ],
  },
};

const customGuides: Record<string, Partial<NteCharacterGuide>> = {
  hotori: {
    buildSummary:
      'On-field Cosmos DPS. Build for crit consistency and burst windows in teams with Nanally/Jiuyuan.',
    skillPriority: ['Ultimate', 'Skill', 'Support Skill', 'Basic Attack'],
  },
  nanally: {
    buildSummary:
      'Core Anima sustain/support. Prioritize support uptime and survivability over personal damage.',
    skillPriority: ['Support Skill', 'Ultimate', 'Skill', 'Basic Attack'],
  },
  jiuyuan: {
    buildSummary:
      'Flexible Anima support for heal + utility shells. Great in safer progression comps.',
  },
  sakiri: {
    buildSummary:
      'Incantation burst DPS. Prefers teams that can create safe burst windows with control or break.',
  },
  baicang: {
    buildSummary:
      'Frontline Incantation anchor with strong control value; keeps pressure stable for break comps.',
  },
  daffodil: {
    buildSummary:
      'Break-focused Chaos support/sub-DPS. Central enabler for high-pressure reaction teams.',
  },
  chiz: {
    buildSummary:
      'F2P-friendly Cosmos carry. Invest early: scales very well with proper module progression.',
  },
  hathor: {
    buildSummary:
      'Lakshana control support. Improves fight pacing and protects burst setups.',
  },
};

function fallbackRole(role: string): keyof typeof defaultsByRole {
  if (role in defaultsByRole) return role as keyof typeof defaultsByRole;
  return 'Assist';
}

export function getNteCharacterGuide(character: Character): NteCharacterGuide {
  const defaults = defaultsByRole[fallbackRole(character.role)];
  const custom = customGuides[character.slug] ?? {};
  const elementImg = character.element ? elementIcon[character.element] : undefined;

  return {
    buildSummary:
      custom.buildSummary ??
      `${character.name} works best in ${character.element ?? 'team'}-aligned comps where ${character.role.toLowerCase()} value is prioritized.`,
    diskSets: (custom.diskSets ?? defaults.diskSets).map((set) => ({
      ...set,
      image: set.image ?? elementImg,
    })),
    modules: (custom.modules ?? defaults.modules).map((module) => ({
      ...module,
      image: module.image ?? elementImg,
    })),
    skillPriority: custom.skillPriority ?? defaults.skillPriority,
    farming: custom.farming ?? defaults.farming,
  };
}
