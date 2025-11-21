// Comprehensive Cyberpunk Red Items Database
const itemsDatabase = [
  // WEAPONS - PISTOLS
  {
    id: 1,
    name: "Medium Pistol",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 50,
    damage: "2d6",
    rof: 2,
    hands: 1,
    concealable: "J",
    description: "Standard sidearm. Reliable and common. Uses Medium Pistol Ammunition.",
    tags: ["ranged", "firearm"],
    availability: "Common"
  },
  {
    id: 2,
    name: "Heavy Pistol",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 100,
    damage: "3d6",
    rof: 2,
    hands: 1,
    concealable: "J",
    description: "More stopping power than medium pistols. Uses Heavy Pistol Ammunition.",
    tags: ["ranged", "firearm"],
    availability: "Common"
  },
  {
    id: 3,
    name: "Very Heavy Pistol",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 100,
    damage: "4d6",
    rof: 1,
    hands: 1,
    concealable: "J",
    description: "Maximum handgun stopping power. Uses Very Heavy Pistol Ammunition.",
    tags: ["ranged", "firearm"],
    availability: "Common"
  },

  // WEAPONS - SMGS
  {
    id: 4,
    name: "SMG (Submachine Gun)",
    category: "Weapons",
    subcategory: "SMGs",
    cost: 100,
    damage: "2d6",
    rof: 1,
    hands: 2,
    concealable: "L",
    description: "Compact automatic weapon. Autofire capable. Uses SMG Ammunition.",
    tags: ["ranged", "firearm", "autofire"],
    availability: "Common"
  },
  {
    id: 5,
    name: "Heavy SMG",
    category: "Weapons",
    subcategory: "SMGs",
    cost: 100,
    damage: "3d6",
    rof: 1,
    hands: 2,
    concealable: "L",
    description: "Heavier automatic weapon with more punch. Autofire capable. Uses Heavy SMG Ammunition.",
    tags: ["ranged", "firearm", "autofire"],
    availability: "Common"
  },

  // WEAPONS - SHOTGUNS
  {
    id: 6,
    name: "Shotgun",
    category: "Weapons",
    subcategory: "Shotguns",
    cost: 50,
    damage: "5d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Devastating at close range. Uses Shotgun Shell Ammunition.",
    tags: ["ranged", "firearm"],
    availability: "Common"
  },

  // WEAPONS - ASSAULT RIFLES
  {
    id: 7,
    name: "Assault Rifle",
    category: "Weapons",
    subcategory: "Assault Rifles",
    cost: 500,
    damage: "5d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Military-grade automatic rifle. Autofire capable. Uses Assault Rifle Ammunition.",
    tags: ["ranged", "firearm", "autofire"],
    availability: "Premium"
  },

  // WEAPONS - SNIPER RIFLES
  {
    id: 8,
    name: "Sniper Rifle",
    category: "Weapons",
    subcategory: "Sniper Rifles",
    cost: 500,
    damage: "5d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Long-range precision weapon. Uses Sniper Rifle Ammunition.",
    tags: ["ranged", "firearm", "precision"],
    availability: "Premium"
  },

  // WEAPONS - MELEE
  {
    id: 9,
    name: "Light Melee Weapon",
    category: "Weapons",
    subcategory: "Melee",
    cost: 50,
    damage: "1d6",
    rof: 2,
    hands: 1,
    concealable: "P",
    description: "Knife, club, or similar light melee weapon.",
    tags: ["melee"],
    availability: "Common"
  },
  {
    id: 10,
    name: "Medium Melee Weapon",
    category: "Weapons",
    subcategory: "Melee",
    cost: 50,
    damage: "2d6",
    rof: 2,
    hands: 1,
    concealable: "L",
    description: "Machete, sword, baseball bat, or similar medium melee weapon.",
    tags: ["melee"],
    availability: "Common"
  },
  {
    id: 11,
    name: "Heavy Melee Weapon",
    category: "Weapons",
    subcategory: "Melee",
    cost: 100,
    damage: "3d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Sledgehammer, greatsword, or similar heavy melee weapon.",
    tags: ["melee"],
    availability: "Common"
  },
  {
    id: 12,
    name: "Very Heavy Melee Weapon",
    category: "Weapons",
    subcategory: "Melee",
    cost: 100,
    damage: "4d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Super sledge, powered weapon, or similar very heavy melee weapon.",
    tags: ["melee"],
    availability: "Premium"
  },

  // ARMOR - HEAD
  {
    id: 13,
    name: "Kevlar Helmet",
    category: "Armor",
    subcategory: "Head",
    cost: 100,
    sp: 7,
    penalty: 0,
    description: "Standard ballistic helmet. Stops Head location only.",
    tags: ["protection"],
    availability: "Common"
  },
  {
    id: 14,
    name: "Light Armorjack Helmet",
    category: "Armor",
    subcategory: "Head",
    cost: 100,
    sp: 11,
    penalty: 0,
    description: "Light armor helmet. Stops Head location only.",
    tags: ["protection"],
    availability: "Common"
  },
  {
    id: 15,
    name: "Medium Armorjack Helmet",
    category: "Armor",
    subcategory: "Head",
    cost: 100,
    sp: 12,
    penalty: 0,
    description: "Medium armor helmet. Stops Head location only.",
    tags: ["protection"],
    availability: "Premium"
  },
  {
    id: 16,
    name: "Heavy Armorjack Helmet",
    category: "Armor",
    subcategory: "Head",
    cost: 100,
    sp: 13,
    penalty: 0,
    description: "Heavy armor helmet. Stops Head location only.",
    tags: ["protection"],
    availability: "Premium"
  },

  // ARMOR - BODY
  {
    id: 17,
    name: "Leathers",
    category: "Armor",
    subcategory: "Body",
    cost: 20,
    sp: 4,
    penalty: 0,
    description: "Heavy leather jacket and pants. Covers body only.",
    tags: ["protection"],
    availability: "Common"
  },
  {
    id: 18,
    name: "Kevlar",
    category: "Armor",
    subcategory: "Body",
    cost: 50,
    sp: 7,
    penalty: 0,
    description: "Bulletproof vest. Covers body only.",
    tags: ["protection"],
    availability: "Common"
  },
  {
    id: 19,
    name: "Light Armorjack",
    category: "Armor",
    subcategory: "Body",
    cost: 100,
    sp: 11,
    penalty: 0,
    description: "Light ballistic armor. Covers body only.",
    tags: ["protection"],
    availability: "Common"
  },
  {
    id: 20,
    name: "Medium Armorjack",
    category: "Armor",
    subcategory: "Body",
    cost: 100,
    sp: 12,
    penalty: -2,
    description: "Medium ballistic armor. Covers body only. -2 to MOVE.",
    tags: ["protection"],
    availability: "Premium"
  },
  {
    id: 21,
    name: "Heavy Armorjack",
    category: "Armor",
    subcategory: "Body",
    cost: 100,
    sp: 13,
    penalty: -2,
    description: "Heavy ballistic armor. Covers body only. -2 to MOVE.",
    tags: ["protection"],
    availability: "Premium"
  },
  {
    id: 22,
    name: "Flak",
    category: "Armor",
    subcategory: "Body",
    cost: 500,
    sp: 15,
    penalty: -2,
    description: "Military-grade armor. Covers body only. -2 to MOVE.",
    tags: ["protection"],
    availability: "Expensive"
  },
  {
    id: 23,
    name: "Metalgear",
    category: "Armor",
    subcategory: "Body",
    cost: 500,
    sp: 18,
    penalty: -4,
    description: "Powered armor suit. Covers body only. -4 to MOVE.",
    tags: ["protection"],
    availability: "Expensive"
  },

  // CYBERWARE - NEURALWARE
  {
    id: 24,
    name: "Neuralware Processor",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 500,
    humanity_loss: "2d6",
    description: "Required for installing other Neuralware. Brain implant that acts as a computer interface.",
    tags: ["cyberware", "neural"],
    availability: "Premium",
    slot: "Neuralware"
  },
  {
    id: 25,
    name: "Kerenzikov Speedware",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 500,
    humanity_loss: "1d6",
    description: "+1 to Initiative. Accelerated nervous system. Requires Neuralware Processor.",
    tags: ["cyberware", "neural", "combat"],
    availability: "Premium",
    slot: "Neuralware"
  },
  {
    id: 26,
    name: "Sandevistan",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 500,
    humanity_loss: "2d6",
    description: "Speedware upgrade. Can spend Action to gain additional Actions. Requires Neuralware Processor.",
    tags: ["cyberware", "neural", "combat"],
    availability: "Expensive",
    slot: "Neuralware"
  },
  {
    id: 27,
    name: "Interface Plugs",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Direct neural connection ports. Required for Netrunning. Requires Neuralware Processor.",
    tags: ["cyberware", "neural", "netrunning"],
    availability: "Common",
    slot: "Neuralware"
  },

  // CYBERWARE - CYBEREYES
  {
    id: 28,
    name: "Cybereye (Basic)",
    category: "Cyberware",
    subcategory: "Cybereyes",
    cost: 100,
    humanity_loss: "2d6",
    description: "Replacement eye. Can install eye options. Comes with basic low-light vision.",
    tags: ["cyberware", "cybereye"],
    availability: "Common",
    slot: "Eye"
  },
  {
    id: 29,
    name: "Cybereye Option: Targeting Scope",
    category: "Cyberware",
    subcategory: "Cybereyes",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "+1 to Ranged Attack Checks when aiming. Requires Cybereye.",
    tags: ["cyberware", "cybereye", "combat"],
    availability: "Common",
    slot: "Eye Option"
  },
  {
    id: 30,
    name: "Cybereye Option: Times Square Marquee",
    category: "Cyberware",
    subcategory: "Cybereyes",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Scrolling text display in your eye. Very flashy. Requires Cybereye.",
    tags: ["cyberware", "cybereye", "style"],
    availability: "Common",
    slot: "Eye Option"
  },
  {
    id: 31,
    name: "Cybereye Option: Infrared",
    category: "Cyberware",
    subcategory: "Cybereyes",
    cost: 500,
    humanity_loss: "1d6/2",
    description: "See heat signatures. Can see in total darkness. Requires Cybereye.",
    tags: ["cyberware", "cybereye"],
    availability: "Premium",
    slot: "Eye Option"
  },

  // CYBERWARE - CYBERAUDIO
  {
    id: 32,
    name: "Cyberaudio Suite",
    category: "Cyberware",
    subcategory: "Cyberaudio",
    cost: 100,
    humanity_loss: "2d6",
    description: "Replacement ears. Can install audio options. Comes with amplified hearing.",
    tags: ["cyberware", "cyberaudio"],
    availability: "Common",
    slot: "Ears"
  },
  {
    id: 33,
    name: "Cyberaudio Option: Radio Communicator",
    category: "Cyberware",
    subcategory: "Cyberaudio",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Built-in encrypted radio. Requires Cyberaudio Suite.",
    tags: ["cyberware", "cyberaudio", "communication"],
    availability: "Common",
    slot: "Audio Option"
  },
  {
    id: 34,
    name: "Cyberaudio Option: Radar Detector",
    category: "Cyberware",
    subcategory: "Cyberaudio",
    cost: 500,
    humanity_loss: "1d6/2",
    description: "Detect radar and sonar emissions. Requires Cyberaudio Suite.",
    tags: ["cyberware", "cyberaudio"],
    availability: "Premium",
    slot: "Audio Option"
  },

  // CYBERWARE - CYBERARM
  {
    id: 35,
    name: "Cyberarm",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 100,
    humanity_loss: "2d6",
    description: "Replacement arm. +2 to BODY checks with that arm. Can install cyberarm options.",
    tags: ["cyberware", "cyberarm"],
    availability: "Common",
    slot: "Arm"
  },
  {
    id: 36,
    name: "Cyberarm Option: Scratchers",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Retractable claws. 2d6 damage melee weapon. Requires Cyberarm.",
    tags: ["cyberware", "cyberarm", "combat"],
    availability: "Common",
    slot: "Arm Option"
  },
  {
    id: 37,
    name: "Cyberarm Option: Wolvers",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 500,
    humanity_loss: "1d6",
    description: "Extended retractable claws. 3d6 damage melee weapon. Requires Cyberarm.",
    tags: ["cyberware", "cyberarm", "combat"],
    availability: "Premium",
    slot: "Arm Option"
  },
  {
    id: 38,
    name: "Cyberarm Option: Rippers",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 500,
    humanity_loss: "2d6",
    description: "Massive retractable claws. 4d6 damage melee weapon. Requires Cyberarm.",
    tags: ["cyberware", "cyberarm", "combat"],
    availability: "Expensive",
    slot: "Arm Option"
  },

  // CYBERWARE - INTERNAL
  {
    id: 39,
    name: "Cybersnake",
    category: "Cyberware",
    subcategory: "Internal",
    cost: 500,
    humanity_loss: "2d6",
    description: "Retractable snake stored in torso. Can scout, attack, or manipulate objects.",
    tags: ["cyberware", "internal"],
    availability: "Premium",
    slot: "Internal"
  },
  {
    id: 40,
    name: "Subdermal Armor",
    category: "Cyberware",
    subcategory: "Internal",
    cost: 100,
    humanity_loss: "2d6",
    description: "SP 11 armor covering entire body. Counts as Light Armorjack.",
    tags: ["cyberware", "internal", "protection"],
    availability: "Common",
    slot: "Internal"
  },
  {
    id: 41,
    name: "Gills",
    category: "Cyberware",
    subcategory: "Internal",
    cost: 500,
    humanity_loss: "2d6",
    description: "Breathe underwater indefinitely.",
    tags: ["cyberware", "internal"],
    availability: "Premium",
    slot: "Internal"
  },

  // GEAR - TECH
  {
    id: 42,
    name: "Agent",
    category: "Gear",
    subcategory: "Tech",
    cost: 100,
    description: "Personal smartphone/PDA. Essential for communication and accessing the NET.",
    tags: ["tech", "communication"],
    availability: "Common"
  },
  {
    id: 43,
    name: "Cyberdeck",
    category: "Gear",
    subcategory: "Tech",
    cost: 500,
    description: "Netrunning computer. Required for Netrunning. Varies by model.",
    tags: ["tech", "netrunning"],
    availability: "Premium"
  },
  {
    id: 44,
    name: "Tech Scanner",
    category: "Gear",
    subcategory: "Tech",
    cost: 100,
    description: "Handheld device for detecting electronics and analyzing tech.",
    tags: ["tech"],
    availability: "Common"
  },
  {
    id: 45,
    name: "Disposable Cell Phone",
    category: "Gear",
    subcategory: "Tech",
    cost: 10,
    description: "Untraceable burner phone. Good for one conversation.",
    tags: ["tech", "communication"],
    availability: "Common"
  },

  // GEAR - MEDICAL
  {
    id: 46,
    name: "Medscanner",
    category: "Gear",
    subcategory: "Medical",
    cost: 100,
    description: "Diagnostic scanner. +2 to First Aid or Paramedic checks.",
    tags: ["medical"],
    availability: "Common"
  },
  {
    id: 47,
    name: "Medtech Bag",
    category: "Gear",
    subcategory: "Medical",
    cost: 100,
    description: "Medical supplies bag. Required for First Aid and Paramedic checks.",
    tags: ["medical"],
    availability: "Common"
  },
  {
    id: 48,
    name: "Speedheal",
    category: "Gear",
    subcategory: "Medical",
    cost: 50,
    description: "Pharmaceutical. Heal 1 HP immediately. Can only use once per day.",
    tags: ["medical", "consumable"],
    availability: "Common"
  },
  {
    id: 49,
    name: "Anti-Smash",
    category: "Gear",
    subcategory: "Medical",
    cost: 100,
    description: "Drug. Negates effects of being Seriously Wounded for 1 hour.",
    tags: ["medical", "consumable", "drug"],
    availability: "Premium"
  },

  // GEAR - GENERAL
  {
    id: 50,
    name: "Scrambler/Descrambler",
    category: "Gear",
    subcategory: "General",
    cost: 500,
    description: "Device for encrypting/decrypting communications.",
    tags: ["tech", "communication"],
    availability: "Premium"
  },
  {
    id: 51,
    name: "Virtuality Goggles",
    category: "Gear",
    subcategory: "General",
    cost: 100,
    description: "VR headset. Experience full virtual reality.",
    tags: ["tech"],
    availability: "Common"
  },
  {
    id: 52,
    name: "Grapple Gun",
    category: "Gear",
    subcategory: "General",
    cost: 100,
    description: "Fires grappling hook up to 30m. Can support 250kg.",
    tags: ["tool"],
    availability: "Common"
  },
  {
    id: 53,
    name: "Techhair",
    category: "Gear",
    subcategory: "General",
    cost: 100,
    description: "Color-changing, light-up synthetic hair. Very flashy.",
    tags: ["fashion", "style"],
    availability: "Common"
  },
  {
    id: 54,
    name: "Smart Glasses",
    category: "Gear",
    subcategory: "General",
    cost: 100,
    description: "AR glasses with HUD display. +1 to Perception checks involving sight.",
    tags: ["tech"],
    availability: "Common"
  },
  {
    id: 55,
    name: "Airhypo",
    category: "Gear",
    subcategory: "General",
    cost: 50,
    description: "Pneumatic hypodermic injector. Delivers drugs instantly.",
    tags: ["medical", "tool"],
    availability: "Common"
  },

  // VEHICLES
  {
    id: 56,
    name: "Motorcycle",
    category: "Vehicles",
    subcategory: "Bikes",
    cost: 2000,
    description: "Two-wheeled vehicle. MOVE 35. Seats 1-2. Very maneuverable.",
    tags: ["vehicle", "transport"],
    availability: "Premium",
    move: 35,
    seats: 2
  },
  {
    id: 57,
    name: "Economy Car",
    category: "Vehicles",
    subcategory: "Cars",
    cost: 5000,
    description: "Basic car. MOVE 30. Seats 4. Affordable transportation.",
    tags: ["vehicle", "transport"],
    availability: "Premium",
    move: 30,
    seats: 4
  },
  {
    id: 58,
    name: "Sports Car",
    category: "Vehicles",
    subcategory: "Cars",
    cost: 10000,
    description: "High-performance car. MOVE 40. Seats 2. Fast and flashy.",
    tags: ["vehicle", "transport"],
    availability: "Expensive",
    move: 40,
    seats: 2
  },
  {
    id: 59,
    name: "Luxury Car",
    category: "Vehicles",
    subcategory: "Cars",
    cost: 15000,
    description: "Premium car. MOVE 35. Seats 4. Comfortable and stylish.",
    tags: ["vehicle", "transport"],
    availability: "Expensive",
    move: 35,
    seats: 4
  },

  // AMMUNITION
  {
    id: 60,
    name: "Medium Pistol Ammunition",
    category: "Ammunition",
    subcategory: "Pistol",
    cost: 10,
    description: "Box of 50 rounds for Medium Pistols.",
    tags: ["ammo"],
    availability: "Common",
    quantity: 50
  },
  {
    id: 61,
    name: "Heavy Pistol Ammunition",
    category: "Ammunition",
    subcategory: "Pistol",
    cost: 10,
    description: "Box of 50 rounds for Heavy Pistols.",
    tags: ["ammo"],
    availability: "Common",
    quantity: 50
  },
  {
    id: 62,
    name: "Very Heavy Pistol Ammunition",
    category: "Ammunition",
    subcategory: "Pistol",
    cost: 10,
    description: "Box of 50 rounds for Very Heavy Pistols.",
    tags: ["ammo"],
    availability: "Common",
    quantity: 50
  },
  {
    id: 63,
    name: "SMG Ammunition",
    category: "Ammunition",
    subcategory: "SMG",
    cost: 10,
    description: "Box of 50 rounds for SMGs.",
    tags: ["ammo"],
    availability: "Common",
    quantity: 50
  },
  {
    id: 64,
    name: "Shotgun Shell Ammunition",
    category: "Ammunition",
    subcategory: "Shotgun",
    cost: 10,
    description: "Box of 20 shells for Shotguns.",
    tags: ["ammo"],
    availability: "Common",
    quantity: 20
  },
  {
    id: 65,
    name: "Assault Rifle Ammunition",
    category: "Ammunition",
    subcategory: "Rifle",
    cost: 20,
    description: "Box of 50 rounds for Assault Rifles.",
    tags: ["ammo"],
    availability: "Common",
    quantity: 50
  },
  {
    id: 66,
    name: "Sniper Rifle Ammunition",
    category: "Ammunition",
    subcategory: "Rifle",
    cost: 20,
    description: "Box of 20 rounds for Sniper Rifles.",
    tags: ["ammo"],
    availability: "Premium",
    quantity: 20
  },

  // EXOTIC WEAPONS
  {
    id: 67,
    name: "Grenade Launcher",
    category: "Weapons",
    subcategory: "Exotic",
    cost: 500,
    damage: "Varies",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Launches grenades. Damage depends on grenade type.",
    tags: ["ranged", "exotic", "explosive"],
    availability: "Expensive"
  },
  {
    id: 68,
    name: "Rocket Launcher",
    category: "Weapons",
    subcategory: "Exotic",
    cost: 1000,
    damage: "8d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Anti-vehicle weapon. Massive explosive damage.",
    tags: ["ranged", "exotic", "explosive"],
    availability: "Expensive"
  },
  {
    id: 69,
    name: "Flamethrower",
    category: "Weapons",
    subcategory: "Exotic",
    cost: 500,
    damage: "4d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Sprays burning fuel. Ignites targets on hit.",
    tags: ["ranged", "exotic", "fire"],
    availability: "Expensive"
  },

  // GRENADES
  {
    id: 70,
    name: "Fragmentation Grenade",
    category: "Weapons",
    subcategory: "Grenades",
    cost: 100,
    damage: "7d6",
    description: "Standard explosive grenade. 5m blast radius.",
    tags: ["explosive", "grenade"],
    availability: "Premium"
  },
  {
    id: 71,
    name: "Incendiary Grenade",
    category: "Weapons",
    subcategory: "Grenades",
    cost: 100,
    damage: "4d6",
    description: "Fire grenade. 5m blast radius. Ignites area.",
    tags: ["explosive", "grenade", "fire"],
    availability: "Premium"
  },
  {
    id: 72,
    name: "Flash-Bang Grenade",
    category: "Weapons",
    subcategory: "Grenades",
    cost: 100,
    damage: "Stun",
    description: "Non-lethal stun grenade. Blinds and deafens targets.",
    tags: ["explosive", "grenade", "non-lethal"],
    availability: "Premium"
  },
  {
    id: 73,
    name: "Smoke Grenade",
    category: "Weapons",
    subcategory: "Grenades",
    cost: 50,
    damage: "None",
    description: "Creates smoke cloud. 5m radius obscurement.",
    tags: ["explosive", "grenade", "utility"],
    availability: "Common"
  },

  // CYBERWARE - FASHIONWARE
  {
    id: 74,
    name: "Light Tattoo",
    category: "Cyberware",
    subcategory: "Fashionware",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Animated glowing tattoo. Programmable patterns.",
    tags: ["cyberware", "fashion"],
    availability: "Common",
    slot: "Fashionware"
  },
  {
    id: 75,
    name: "Shift Tacts",
    category: "Cyberware",
    subcategory: "Fashionware",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Color-changing contact lenses. Can change eye color at will.",
    tags: ["cyberware", "fashion"],
    availability: "Common",
    slot: "Fashionware"
  },
  {
    id: 76,
    name: "Chemskin",
    category: "Cyberware",
    subcategory: "Fashionware",
    cost: 100,
    humanity_loss: "1d6",
    description: "Color-changing skin. Can change appearance.",
    tags: ["cyberware", "fashion"],
    availability: "Premium",
    slot: "Fashionware"
  },

  // DRUGS
  {
    id: 77,
    name: "Synthcoke",
    category: "Gear",
    subcategory: "Drugs",
    cost: 20,
    description: "Stimulant. +1 to REF for 1 hour. Addictive.",
    tags: ["drug", "consumable"],
    availability: "Common"
  },
  {
    id: 78,
    name: "Smash",
    category: "Gear",
    subcategory: "Drugs",
    cost: 20,
    description: "Combat drug. +2 to BODY for 1 hour. Highly addictive.",
    tags: ["drug", "consumable", "combat"],
    availability: "Premium"
  },
  {
    id: 79,
    name: "Blue Glass",
    category: "Gear",
    subcategory: "Drugs",
    cost: 20,
    description: "Hallucinogen. -2 to all actions. Very addictive.",
    tags: ["drug", "consumable"],
    availability: "Common"
  },
  {
    id: 80,
    name: "Black Lace",
    category: "Gear",
    subcategory: "Drugs",
    cost: 50,
    description: "Extremely dangerous drug. +3 to all Stats for 1d6 turns. Often lethal.",
    tags: ["drug", "consumable", "combat"],
    availability: "Premium"
  },

  // MANUFACTURER-SPECIFIC WEAPONS - PISTOLS
  {
    id: 81,
    name: "Dai Lung Streetmaster",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 20,
    damage: "2d6",
    rof: 2,
    hands: 1,
    concealable: "J",
    description: "Poor Quality Medium Pistol. The ultimate in cheap guns, available almost everywhere. Sometimes jams due to its quality.",
    tags: ["ranged", "firearm", "poor-quality"],
    availability: "Common"
  },
  {
    id: 82,
    name: "Federated Arms X-9mm",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 50,
    damage: "2d6",
    rof: 2,
    hands: 1,
    concealable: "J",
    description: "Standard Quality Medium Pistol. Often kept as a backup weapon by professionals. Fits snugly in an ankle holster.",
    tags: ["ranged", "firearm", "backup"],
    availability: "Common"
  },
  {
    id: 83,
    name: "Militech Avenger",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 100,
    damage: "2d6",
    rof: 2,
    hands: 1,
    concealable: "J",
    description: "Excellent Quality Medium Pistol. Reliable service weapon favored by corporate security and military personnel.",
    tags: ["ranged", "firearm", "excellent-quality", "militech"],
    availability: "Premium"
  },
  {
    id: 84,
    name: "Militech Crusher SSG",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 1000,
    damage: "5d6 (slug) / 3d6 (shell)",
    rof: 1,
    hands: 1,
    concealable: "L",
    description: "Exotic Very Heavy Pistol. Pistol-sized shotgun developed for close combat. 6-shot capacity, uses shotgun shells. Originally designed for the Second Central American War.",
    tags: ["ranged", "firearm", "shotgun", "exotic", "militech"],
    availability: "Expensive"
  },
  {
    id: 85,
    name: "Budget Arms Teen-Dreem",
    category: "Weapons",
    subcategory: "SMGs",
    cost: 20,
    damage: "2d6",
    rof: 1,
    hands: 2,
    concealable: "L",
    description: "Poor Quality Exotic SMG. Disposable vendit gun with 10-shot capacity. Cheap but unreliable.",
    tags: ["ranged", "firearm", "autofire", "poor-quality", "disposable"],
    availability: "Common"
  },

  // ADDITIONAL CYBERWARE - SPEEDWARE
  {
    id: 86,
    name: "Kerenzikov Boosterware",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 500,
    humanity_loss: "4d6",
    description: "Speedware. Accelerated nervous system. +3 to Initiative. Only one Speedware can be installed at a time. 4d6 HL when installed after character creation, or 14 HL during character creation.",
    tags: ["cyberware", "neural", "combat", "speedware"],
    availability: "Expensive",
    slot: "Neuralware"
  },
  {
    id: 87,
    name: "Sandevistan Speedware",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 500,
    humanity_loss: "2d6",
    description: "Advanced Speedware. Adds +3 to Initiative for 60 seconds with one hour cooldown. Only one Speedware can be installed at a time. 2d6 HL when installed after character creation, or 7 HL during character creation.",
    tags: ["cyberware", "neural", "combat", "speedware"],
    availability: "Expensive",
    slot: "Neuralware"
  },

  // CYBERWARE - CYBERARM OPTIONS
  {
    id: 88,
    name: "Tool Hand",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 500,
    humanity_loss: "1d6",
    description: "Cyberarm Option. Built-in tools for technical work. Can be installed at a Clinic. Requires Cyberarm.",
    tags: ["cyberware", "cyberarm", "tech"],
    availability: "Expensive",
    slot: "Arm Option"
  },
  {
    id: 89,
    name: "Popup Net Launcher",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 500,
    humanity_loss: "1d6",
    description: "Cyberarm Option. Launches restraining nets. Can be installed at a Clinic. Replacement nets cost 50eb each. Requires Cyberarm.",
    tags: ["cyberware", "cyberarm", "combat", "non-lethal"],
    availability: "Expensive",
    slot: "Arm Option"
  },
  {
    id: 90,
    name: "Modular Finger Cyberhand",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Cyberarm Option. Modular fingertips that can be swapped out for different tools. Requires Cyberarm.",
    tags: ["cyberware", "cyberarm", "utility"],
    availability: "Premium",
    slot: "Arm Option"
  },

  // CYBERWARE - BORGWARE
  {
    id: 91,
    name: "Cyclops International Bug Eye",
    category: "Cyberware",
    subcategory: "Borgware",
    cost: 500,
    humanity_loss: "2d6",
    description: "Borgware. Advanced cybernetic eye system. Can only be installed at a Hospital.",
    tags: ["cyberware", "borgware", "cybereye"],
    availability: "Expensive",
    slot: "Borgware"
  },

  // CYBERWARE - NEURALWARE
  {
    id: 92,
    name: "Braindance Recorder",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 500,
    humanity_loss: "1d6",
    description: "Records experiences as Braindance. Can be installed at a Clinic. Requires Neuralware Processor.",
    tags: ["cyberware", "neural", "braindance"],
    availability: "Expensive",
    slot: "Neuralware"
  },
  {
    id: 93,
    name: "Chemical Analyser",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 500,
    humanity_loss: "1d6/2",
    description: "Chipware. Analyzes chemical compounds. Must be inserted into a Chipware Socket.",
    tags: ["cyberware", "neural", "tech", "chipware"],
    availability: "Expensive",
    slot: "Chipware Socket"
  },
  {
    id: 94,
    name: "Tactile Boost",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Chipware. Enhances sense of touch. +1 to relevant skill checks. Must be inserted into a Chipware Socket.",
    tags: ["cyberware", "neural", "chipware"],
    availability: "Premium",
    slot: "Chipware Socket"
  },

  // EXOTIC WEAPONS - PISTOLS
  {
    id: 95,
    name: "Malorian Arms 3516",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 1000,
    damage: "5d6",
    rof: 1,
    hands: 1,
    concealable: "J",
    description: "Exotic Very Heavy Pistol. Designed by Eran Malour for Johnny Silverhand. Permanently equipped with smartgun link. Requires Interface Plugs or Subdermal Grip to operate. Capable of ending a cyberpsycho at 100 paces.",
    tags: ["ranged", "firearm", "exotic", "smartgun", "legendary"],
    availability: "Expensive"
  },

  // ASSAULT RIFLES
  {
    id: 96,
    name: "Militech Ronin Light Assault Rifle",
    category: "Weapons",
    subcategory: "Assault Rifles",
    cost: 500,
    damage: "5d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Standard Quality Assault Rifle. 25-round magazine. Autofire capable. Reliable military-grade weapon. Range: 800m.",
    tags: ["ranged", "firearm", "autofire", "militech"],
    availability: "Expensive"
  },
  {
    id: 97,
    name: "Militech Dragon Assault Rifle",
    category: "Weapons",
    subcategory: "Assault Rifles",
    cost: 1000,
    damage: "5d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Excellent Quality Assault Rifle. 25-round magazine. +1 Weapon Accuracy. Autofire capable. Premium military weapon. Range: 800m.",
    tags: ["ranged", "firearm", "autofire", "excellent-quality", "militech"],
    availability: "Expensive"
  },
  {
    id: 98,
    name: "Arasaka WAA Bullpup Assault Weapon",
    category: "Weapons",
    subcategory: "Assault Rifles",
    cost: 500,
    damage: "5d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Exotic Assault Rifle. Bullpup configuration for improved handling. Autofire capable. Manufactured by Arasaka.",
    tags: ["ranged", "firearm", "autofire", "exotic", "arasaka"],
    availability: "Expensive"
  },

  // EXOTIC WEAPONS - SNIPER
  {
    id: 99,
    name: "Nomad Pneumatic Bolt Gun",
    category: "Weapons",
    subcategory: "Sniper Rifles",
    cost: 500,
    damage: "4d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Exotic Sniper Rifle. Fires pneumatic bolts. 8-shot capacity. Quieter than standard rifles. From 12 Days of Gunmas DLC.",
    tags: ["ranged", "exotic", "stealth", "nomad"],
    availability: "Expensive"
  },

  // MELEE WEAPONS - EXOTIC
  {
    id: 100,
    name: "Centurian Essentials Thermal Dagger",
    category: "Weapons",
    subcategory: "Melee",
    cost: 1000,
    damage: "2d6 + Fire",
    rof: 2,
    hands: 1,
    concealable: "P",
    description: "Exotic Medium Melee Weapon. Heated blade strongly sets targets on fire. Can be engraved for +10eb. From 12 Days of REDmas DLC.",
    tags: ["melee", "exotic", "fire", "thermal"],
    availability: "Expensive"
  },

  // CYBERWARE - CYBERARM OPTIONS (GRENADES)
  {
    id: 101,
    name: "Popup Grenade Launcher",
    category: "Cyberware",
    subcategory: "Cyberarm",
    cost: 500,
    humanity_loss: "1d6",
    description: "Cyberarm Option. Grenade launcher concealed in arm compartment. Can be loaded with one grenade. Can be installed at a Clinic. Requires Cyberarm.",
    tags: ["cyberware", "cyberarm", "explosive", "grenade"],
    availability: "Expensive",
    slot: "Arm Option"
  },

  // CYBERWARE - BORGWARE (LINEAR FRAMES)
  {
    id: 102,
    name: "Linear Frame Σ (Sigma)",
    category: "Cyberware",
    subcategory: "Borgware",
    cost: 5000,
    humanity_loss: "4d6",
    description: "Internal Linear Frame Borgware. Endoskeleton grafted onto body and neurolinked to muscles and bones. Increases BODY stat to 12. Can only be installed at a Hospital.",
    tags: ["cyberware", "borgware", "linear-frame", "enhancement"],
    availability: "Expensive",
    slot: "Borgware"
  },
  {
    id: 103,
    name: "Linear Frame β (Beta)",
    category: "Cyberware",
    subcategory: "Borgware",
    cost: 10000,
    humanity_loss: "4d6",
    description: "Internal Linear Frame Borgware. Advanced endoskeleton increases strength and resilience. Increases BODY stat to 14. Can only be installed at a Hospital.",
    tags: ["cyberware", "borgware", "linear-frame", "enhancement"],
    availability: "Expensive",
    slot: "Borgware"
  },
  {
    id: 104,
    name: "Linear Frame Ω (Omega)",
    category: "Cyberware",
    subcategory: "Borgware",
    cost: 25000,
    humanity_loss: "4d6",
    description: "Internal Linear Frame Borgware. Ultimate endoskeleton system. Increases BODY stat to 16. Can only be installed at a Hospital.",
    tags: ["cyberware", "borgware", "linear-frame", "enhancement"],
    availability: "Expensive",
    slot: "Borgware"
  },

  // CYBERWARE - NEURALWARE (INTERFACE)
  {
    id: 105,
    name: "Subdermal Grip",
    category: "Cyberware",
    subcategory: "Neuralware",
    cost: 100,
    humanity_loss: "1d6/2",
    description: "Neuralware. Subdermal pad in palm that links to smartguns. Alternative to Interface Plugs for weapon operation. Can be installed at a Clinic. Requires Neuralware Processor.",
    tags: ["cyberware", "neural", "smartgun", "interface"],
    availability: "Premium",
    slot: "Neuralware"
  },

  // ARMOR - SPECIAL
  {
    id: 106,
    name: "Bodyweight Suit",
    category: "Armor",
    subcategory: "Body",
    cost: 1000,
    sp: 11,
    penalty: 0,
    description: "Specialized armor designed for Netrunners. Has spots for Interface Plugs and Cyberdeck. Adds +1 Hardware Slot to attached Cyberdeck. Covers body only.",
    tags: ["protection", "netrunner", "tech"],
    availability: "Expensive"
  },
  {
    id: 107,
    name: "Light Metalgear",
    category: "Armor",
    subcategory: "Body",
    cost: 3000,
    sp: 15,
    penalty: -2,
    description: "Enhanced Metalgear with segmented plating for better flexibility. Covers body only. -2 to MOVE. From 12 Days of REDmas DLC.",
    tags: ["protection", "heavy", "metalgear"],
    availability: "Expensive"
  },

  // MORE EXOTIC WEAPONS
  {
    id: 108,
    name: "Constitutional Arms Multi-Ammunition Pistol",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 500,
    damage: "4d6",
    rof: 1,
    hands: 1,
    concealable: "J",
    description: "Exotic Very Heavy Pistol. Holds 5 shots and can load up to 5 different kinds of Very Heavy Pistol ammunition at the same time. Select which ammo to use with each shot. From The 12 Days of Gunmas DLC and Danger Gal Dossier.",
    tags: ["ranged", "firearm", "exotic", "versatile"],
    availability: "Expensive"
  },
  {
    id: 109,
    name: "Constitutional Arms Unity",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 500,
    damage: "4d6",
    rof: 2,
    hands: 1,
    concealable: "J",
    description: "Exotic Heavy Pistol. Deals 4d6 damage (instead of standard 3d6) when firing an Aimed Shot. From Cyberpunk: Edgerunners Mission Kit.",
    tags: ["ranged", "firearm", "exotic", "precision"],
    availability: "Expensive"
  },
  {
    id: 110,
    name: "Magnum Opus Hellbringer",
    category: "Weapons",
    subcategory: "Pistols",
    cost: 500,
    damage: "5d6",
    rof: 1,
    hands: 1,
    concealable: "J",
    description: "Exotic Very Heavy Pistol. 3 shot capacity that deals 5d6 damage instead of standard 4d6. When fired by a user with BODY less than 10, the weapon jams after each shot. From The 12 Days of Gunmas DLC.",
    tags: ["ranged", "firearm", "exotic", "powerful"],
    availability: "Expensive"
  },
  {
    id: 111,
    name: "Arasaka WSS Sniper System",
    category: "Weapons",
    subcategory: "Sniper Rifles",
    cost: 1000,
    damage: "5d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Excellent Quality Sniper Rifle manufactured by Arasaka. +1 accuracy bonus. 4-round magazine. 800m range. Most WSS on the market are unauthorized duplicates lacking the built-ins of originals but still very powerful.",
    tags: ["ranged", "firearm", "sniper", "excellent-quality", "arasaka"],
    availability: "Expensive"
  },
  {
    id: 112,
    name: "Nomad Pneumatic Bolt Gun",
    category: "Weapons",
    subcategory: "Sniper Rifles",
    cost: 500,
    damage: "4d6",
    rof: 1,
    hands: 2,
    concealable: "N",
    description: "Exotic Sniper Rifle. 8 shot capacity that deals 4d6 damage (instead of standard 5d6). Fires Arrows instead of bullets. Capable of firing Non-Basic Ammunition despite being an Exotic weapon. From The 12 Days of Gunmas DLC.",
    tags: ["ranged", "exotic", "arrows", "silent"],
    availability: "Expensive"
  },
  {
    id: 113,
    name: "Constitution Arms Hurricane",
    category: "Weapons",
    subcategory: "Shotguns",
    cost: 500,
    damage: "5d6",
    rof: 2,
    hands: 2,
    concealable: "N",
    description: "Exotic Shotgun. ROF 2 with 16 shot capacity. Takes 2 Actions to reload. Can only be used by a person with BODY 11 or higher, or if weapon is Mounted. Devastating autofire shotgun.",
    tags: ["ranged", "firearm", "exotic", "shotgun", "heavy"],
    availability: "Expensive"
  },
  {
    id: 114,
    name: "Militech Cowboy U-56",
    category: "Weapons",
    subcategory: "Grenade Launchers",
    cost: 500,
    damage: "Varies",
    rof: 2,
    hands: 2,
    concealable: "N",
    description: "Exotic Grenade Launcher manufactured by Militech. Can fire two grenades at a time. Can use any type of grenade despite being an Exotic Weapon. Can only be used by a person with BODY 11 or higher, or if Mounted.",
    tags: ["ranged", "explosive", "exotic", "grenade", "militech"],
    availability: "Expensive"
  },
  {
    id: 115,
    name: "Kendachi Mono-Three",
    category: "Weapons",
    subcategory: "Melee Weapons",
    cost: 500,
    damage: "4d6",
    rof: 2,
    hands: 2,
    concealable: "N",
    description: "Exotic Two-Handed Very Heavy Melee Weapon manufactured by Kendachi. With the correct biometric key, the Mono-Three ignores all armor below SP11. Without the key, this property is non-functional. Heavy Melee Weapons ignore half of armor.",
    tags: ["melee", "exotic", "monoblade", "kendachi", "armor-piercing"],
    availability: "Expensive"
  },

  // MORE CYBERWARE
  {
    id: 116,
    name: "Grafted Muscle and Bone Lace",
    category: "Cyberware",
    subcategory: "Internal Body Cyberware",
    cost: 1000,
    humanity_loss: "4d6",
    description: "Internal Body Cyberware. Combination of vat grown muscle grafts and microscopic fiber bone implants. Increases BODY by 2. The increase changes HP, Wound Threshold, and Death Save. Multiple installments stack. Cannot raise BODY above 10. Can only be installed at a Hospital.",
    tags: ["cyberware", "enhancement", "body", "strength"],
    availability: "Expensive",
    slot: "Internal Body"
  }
];
