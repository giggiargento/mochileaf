import type { Character, NteCharacterGuide } from '../types';

const defaultsByRole: Record<string, Omit<NteCharacterGuide, 'buildSummary'>> = {
  Attack: {
    diskSets: [
      {
        name: 'The Rain That Shook the World (S)',
        note: 'Strong general DPS Arc for burst carries with reliable damage scaling.',
      },
      {
        name: 'First Step to Success (A)',
        note: 'Accessible bridge Arc for early progression while farming better S options.',
      },
    ],
    modules: [
      { name: 'S-tier Module line', note: 'Prioritize CRIT/ATK rolls for burst consistency.' },
      { name: 'A-tier Module fallback', note: 'Use ATK + Cycle Rate until best rolls drop.' },
    ],
    skillPriority: [
      { skill: 'Ultimate', scales: 'Main burst multiplier and finisher damage.' },
      { skill: 'Skill', scales: 'Core rotation damage and esper-cycle trigger value.' },
      { skill: 'Basic Attack', scales: 'Sustained on-field DPS between cooldowns.' },
      { skill: 'Support Skill', scales: 'Swap-in utility and secondary cycle effects.' },
    ],
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
      {
        name: 'Eternal Waltz (S)',
        note: 'Great sustain-oriented Arc for supports that cast Ultimate frequently.',
      },
      {
        name: 'Call of the Twisted City (A)',
        note: 'Stable A-rank fallback for heal-focused or utility-heavy support setups.',
      },
    ],
    modules: [
      { name: 'S-tier Utility Modules', note: 'Cycle Rate + HP/DEF for stable support uptime.' },
      { name: 'A-tier Utility Modules', note: 'Use mixed defensive rolls until better drops.' },
    ],
    skillPriority: [
      { skill: 'Support Skill', scales: 'Buff/heal/shield potency and utility uptime.' },
      { skill: 'Skill', scales: 'Secondary support effects and cycle consistency.' },
      { skill: 'Ultimate', scales: 'Team-wide burst utility and emergency stabilization.' },
      { skill: 'Basic Attack', scales: 'Minor personal damage; lowest impact for supports.' },
    ],
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
      {
        name: 'Your Happiness is Priceless (S)',
        note: 'Defensive Arc with strong team sustain value for frontline roles.',
      },
      {
        name: 'Umbrella (A)',
        note: 'Comfortable A-rank tank fallback while waiting for premium defensive Arcs.',
      },
    ],
    modules: [
      { name: 'S-tier Tank Modules', note: 'DEF/HP lines for frontline stability.' },
      { name: 'A-tier Tank Modules', note: 'Bridge option with mixed DEF + utility stats.' },
    ],
    skillPriority: [
      { skill: 'Skill', scales: 'Mitigation/shield values and frontline control.' },
      { skill: 'Support Skill', scales: 'Team protection and taunt/control utility.' },
      { skill: 'Ultimate', scales: 'Defensive burst impact and clutch survival windows.' },
      { skill: 'Basic Attack', scales: 'Low-impact personal damage on tanks.' },
    ],
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
      {
        name: 'Marching Beyond Time (S)',
        note: 'High-value utility Arc for teams that benefit from support-cycle acceleration.',
      },
      {
        name: 'A Time Will Come (A)',
        note: 'Flexible A-rank option that fits mixed-type team compositions.',
      },
    ],
    modules: [
      { name: 'S-tier Assist Modules', note: 'Cycle Rate-focused setup for frequent utility.' },
      { name: 'A-tier Assist Modules', note: 'Hybrid setup balancing uptime and survival.' },
    ],
    skillPriority: [
      { skill: 'Support Skill', scales: 'Primary assist utility and team buff uptime.' },
      { skill: 'Ultimate', scales: 'Big utility spikes and rotation acceleration.' },
      { skill: 'Skill', scales: 'Supplemental control/setup effects.' },
      { skill: 'Basic Attack', scales: 'Minimal gain versus support-focused upgrades.' },
    ],
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
    skillPriority: [
      { skill: 'Ultimate', scales: 'Largest burst spike and carry conversion.' },
      { skill: 'Skill', scales: 'Core DPS loop and cycle trigger pressure.' },
      { skill: 'Support Skill', scales: 'Swap burst contribution and utility damage.' },
      { skill: 'Basic Attack', scales: 'Fill damage while waiting for key cooldowns.' },
    ],
  },
  nanally: {
    buildSummary:
      'Core Anima sustain/support. Prioritize support uptime and survivability over personal damage.',
    skillPriority: [
      { skill: 'Support Skill', scales: 'Healing ticks, sustain uptime, and team safety.' },
      { skill: 'Ultimate', scales: 'Emergency stabilization and support burst value.' },
      { skill: 'Skill', scales: 'Secondary sustain/control utility.' },
      { skill: 'Basic Attack', scales: 'Lowest-impact upgrade on this role.' },
    ],
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

  return {
    buildSummary:
      custom.buildSummary ??
      `${character.name} works best in ${character.element ?? 'team'}-aligned comps where ${character.role.toLowerCase()} value is prioritized.`,
    diskSets: custom.diskSets ?? defaults.diskSets,
    modules: custom.modules ?? defaults.modules,
    skillPriority: custom.skillPriority ?? defaults.skillPriority,
    farming: custom.farming ?? defaults.farming,
  };
}
