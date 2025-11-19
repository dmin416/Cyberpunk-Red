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
  }
];
