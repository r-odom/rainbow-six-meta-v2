export const OPERATORS = [
  {
    id: 'sledge',
    name: 'Sledge',
    role: 'Attacker',
    category: 'Hard Breacher',
    bestLoadout: {
      primary: 'L85A2',
      primaryAttachments: ['Angled Grip', 'Flash Hider'],
      secondary: 'PMM',
      gadgets: ['Hard Breacher Charge', 'Claymore'],
      notes: 'Primary for wall destruction, Claymore for post-plant.'
    }
  },
  {
    id: 'ash',
    name: 'Ash',
    role: 'Attacker',
    category: 'Entry Fragger',
    bestLoadout: {
      primary: 'G36C',
      primaryAttachments: ['Angled Grip', 'Flash Hider'],
      secondary: 'P12',
      gadgets: ['Breaching Round', 'Flashbang'],
      notes: 'Fast reload, Breaching Rounds for soft walls.'
    }
  },
  {
    id: 'thermite',
    name: 'Thermite',
    role: 'Attacker',
    category: 'Hard Breacher',
    bestLoadout: {
      primary: 'M590A1',
      primaryAttachments: ['Laser Sight'],
      secondary: 'D-50',
      gadgets: ['Exothermic Charge', 'Stun'],
      notes: 'Shotgun for close, Thermite charges for hatches.'
    }
  },
  {
    id: 'rook',
    name: 'Rook',
    role: 'Defender',
    category: 'Support',
    bestLoadout: {
      primary: 'FMG-9',
      primaryAttachments: ['Vertical Grip'],
      secondary: 'P229',
      gadgets: ['Armor Pack', 'Barbed Wire'],
      notes: 'Armor Pack for team survivability.'
    }
  },
  {
    id: 'mira',
    name: 'Mira',
    role: 'Defender',
    category: 'Support',
    bestLoadout: {
      primary: 'Vector .45 ACP',
      primaryAttachments: ['Laser Sight'],
      secondary: 'P12',
      gadgets: ['Black Mirror', 'Barbed Wire'],
      notes: 'Mirror for map control, avoid direct fights.'
    }
  },
  // Add more operators as needed
];

export const MAPS = ['Bank', 'Border', 'Clubhouse', 'Coastline', 'Consulate', 'Kafe Dostoyevsky', 'Oregon', 'Skyscraper', 'Theme Park'];

export const SITES = {
  Bank: ['Kilo', 'Mira', 'Vault', 'Lobby'],
  Border: ['White', 'Blue', 'Vault', 'Kitchen'],
  Clubhouse: ['A', 'B', 'C'],
  // ... expand
};
