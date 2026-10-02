const DATA = {
  "LF": {
    desc: "LIQUID FUEL",
    rules: [
      { condition: "High Halogen (40-100)", action: "LI" },
      { condition: "High Water (65-100), pH (2-14), HAZ", action: "VI" },
      { condition: "High Water (65-100), NON-HAZ", action: "LE / LS (W)" },
      { condition: "High pH (11-14)", action: "VC" },
      { condition: "Low pH (1-3)", action: "VA (in-house 2.1 pH)" },
      { condition: "Solid and Halogen < 0.05", action: "RT2" },
      { condition: "Solid and Halogen > 0.05", action: "RT" },
      { condition: "Non-Haz Low BTU or Not Compatible", action: "LE / LS (W)" },
      { condition: "High Water, High Halogen", action: "LI" },
      { condition: "Cannot be on a skid — Not Compatible with Fuels", action: "LP1 — Bulk or In-house" },
      { condition: "Pos Oxid — Test for Hex Chrom & CKD", action: "XM  (Pos HexChrom or Halogens = LX1)" },
    ]
  },
  "SF / DF": {
    desc: "NON-PUMPABLE SLUDGE / LIQUID FUEL",
    rules: [
      { condition: "High Halogen (40-100)", action: "SD (W)" },
      { condition: "High Water (65-100), HAZ", action: "SD (W)" },
      { condition: "High Water (65-100), NON-HAZ", action: "SE / SS (W)" },
      { condition: "High Water (65-100) High BTU", action: "Lower Water, Stays SF" },
      { condition: "High pH (11-14)", action: "SD (W)" },
      { condition: "Solid and Halogen < 0.05", action: "RT2" },
      { condition: "Solid and Halogen > 0.05", action: "RT" },
      { condition: "Low pH (1-3)", action: "SD (W)" },
      { condition: "Non-Haz Low BTU or Not Compatible", action: "SE / SS (W)" },
      { condition: "In a Tote (80%+ solid / 100% solid)", action: "DF / RT" },
      { condition: "Low Water Low BTU (really low water – ask)", action: "Raise Water, Change to SD" },
      { condition: "DF in Totes — OK if it will take in system", action: "— (no offspec needed)" },
    ]
  },
  "VA": {
    desc: "LIQUID ORGANIC ACIDS FOR FUELS",
    rules: [
      { condition: "High Halogen (40-100)", action: "LI" },
      { condition: "High Water (65-100), pH (2-14)", action: "VI" },
      { condition: "pH (5-10), Low Water (0-64)", action: "LF" },
      { condition: "Halogen (40-100)", action: "LI" },
      { condition: "pH (11-14), Low Water (0-64)", action: "VC" },
      { condition: "Solid", action: "ND (W)" },
      { condition: "Low BTU", action: "VI" },
      { condition: "Low pH — if acid under 2, can raise pH to 2.01", action: "— (adjust pH)" },
      { condition: "Sludge + Low pH < 2  (pH 2-4 = SD)", action: "Reprofile to LP1" },
      { condition: "High Acid 'WARNING'", action: "Manually Pass" },
      { condition: "Low BTU, Low Water (< 65%)", action: "Raise BTUs" },
      { condition: "Non-Compat Solids or Heat", action: "SD & 'Do Not Pump'" },
    ]
  },
  "VI": {
    desc: "LIQUID HIGH WATER FOR BLENDING/COMBUSTION",
    rules: [
      { condition: "Low Water (0-64), pH (4-10)", action: "LF" },
      { condition: "Low Water (0-64), pH (11-14)", action: "VC" },
      { condition: "Low Water (0-64), pH (1-3)", action: "VA" },
      { condition: "Low Water (0-64), Halogen (40-100)", action: "LI" },
      { condition: "Low pH ≤ 1.5 — If acid < 6, bump pH up to 2.1", action: "— (adjust pH)" },
      { condition: "Solid", action: "ND (W)" },
      { condition: "Low BTU", action: "Raise Water" },
      { condition: "No Skid", action: "— (note)" },
      { condition: "Non-Compat Solids or Heat", action: "SD & 'Do Not Pump'" },
    ]
  },
  "VC": {
    desc: "LIQUID ORGANIC CAUSTICS FOR FUELS",
    rules: [
      { condition: "Low pH (4-10)", action: "LF" },
      { condition: "Low pH (1-3)", action: "VA" },
      { condition: "High Water (65-100), pH (2-14)", action: "VI" },
      { condition: "Low BTU and High Halogen (40-100)", action: "LI" },
      { condition: "Solid / Sludge", action: "ND (W) / SF" },
      { condition: "High Halogen", action: "LI" },
      { condition: "Sludge", action: "SF" },
      { condition: "High Water, Low BTU", action: "VI" },
      { condition: "High BTU, Low pH", action: "LF" },
      { condition: "Low BTU, Low Water (< 65%)", action: "Raise BTUs" },
      { condition: "Non-Compat Solids or Heat", action: "SD & 'Do Not Pump'" },
    ]
  },
  "LI": {
    desc: "LIQUIDS FOR COMBUSTION/INCINERATION",
    rules: [
      { condition: "High Water (65-100)", action: "VI" },
      { condition: "Solid", action: "ND (W)" },
      { condition: "High Halogens", action: "VI" },
      { condition: "High pH — Change to 12", action: "LC1-2" },
      { condition: "Low pH", action: "Q to Reprofile" },
      { condition: "Flash OK — Change to 141", action: "— (adjust flash)" },
    ]
  },
  "LX1-3": {
    desc: "LIQUID OXIDIZER (CHLORINATED)",
    rules: [
      { condition: "D007 (Chromium) or D009 (Mercury)", action: "Q'd to Q Manager" },
      { condition: "Inner Containers", action: "Reprofile" },
    ]
  },
  "NX1-3": {
    desc: "SOLID OXIDIZER (NON-CHLORINATED / CHLORINATED)",
    rules: [
      { condition: "D007 (Chromium) or D009 (Mercury)", action: "Q'd to Q Manager" },
      { condition: "Inner Containers OK", action: "— (no offspec needed)" },
    ]
  },
  "RT2": {
    desc: "SOLIDS FOR RECYCLING (NON-HALOGENATED)",
    rules: [
      { condition: "High Halogen (> 0.05)", action: "RT (pH can raise to 4)" },
      { condition: "High Water (65-100)", action: "RSD" },
      { condition: "pH (1-3)", action: "RSD" },
      { condition: "Low pH — came in as LF", action: "ND" },
      { condition: "High pH (10-12.5) — came in as RT2, single drum", action: "RSB2" },
      { condition: "High pH (10-12.5) — came in as RT2, all same offspec or PC on own line", action: "RT2 (lower pH to 10)" },
      { condition: "High pH (10-12.5) — LF/SF offspec to RT2", action: "ND" },
      { condition: "Low acid (< 2) — Raise pH to 4 (all analyticals) if pH above 3", action: "— (adjust pH)" },
      { condition: "Non-Haz Low BTU or Not Compatible", action: "NE" },
      { condition: "High Water (65-100)", action: "RSD" },
      { condition: "W/ D009", action: "SD / ND" },
      { condition: "Non-Compat — forms solids", action: "OK" },
      { condition: "Non-Compat — High Heat, Bubbling, or Hard Solids", action: "Reprofile" },
      { condition: "Empty Paint Cans OK — Full = PI", action: "— (note)" },
      { condition: "No Totes — Goes RT", action: "RT" },
    ]
  },
  "RT": {
    desc: "ORGANIC SOLIDS FOR RECYCLING (NON AND HALOGENATED)",
    rules: [
      { condition: "Low pH (1-3)", action: "RSD" },
      { condition: "Low acid (< 2) — Raise pH to 4 (all analyticals)", action: "— (adjust pH)" },
    ]
  },
  "RH": {
    desc: "ORGANIC SOLIDS FOR RECYCLING (HALOGENATED)",
    rules: [
      { condition: "High Water (65-100)", action: "RSD" },
      { condition: "Halogens < 0.05 — OK if received code", action: "— (no offspec needed)" },
      { condition: "Low pH OK if solid", action: "— (no offspec needed)" },
    ]
  },
  "RS2": {
    desc: "ORGANIC SOLIDS FOR RECYCLING (NON-HALOGENATED)",
    rules: [
      { condition: "High Water (65-100)", action: "RSD" },
      { condition: "High Halogen (> 0.05)", action: "RH" },
      { condition: "High pH — try RSB2, if it doesn't work", action: "Reprofile" },
      { condition: "Inner Containers containing liquid (if empty, stays RS2)", action: "Reprofile (ZV1)" },
      { condition: "Not Compatible — solidification in fuel/water", action: "OK" },
      { condition: "Low BTU — damp material w/ no standing water", action: "RSD" },
      { condition: "Low BTU — dry material, thin metal, solid, can't get test result", action: "OK to raise BTUs" },
      { condition: "Low pH (2-4 OK to move up if solid)", action: "— (adjust pH)" },
      { condition: "Crush metal cans or lids", action: "OK" },
    ]
  },
  "RSD": {
    desc: "LOW BTU SLUDGE (OIL DRY CONTAMINATED WITH GAS, OIL, WATER)",
    rules: [
      { condition: "High Acid (65-100)", action: "RSB2" },
      { condition: "pH acceptable from 4-12.5", action: "— (no offspec needed)" },
      { condition: "Flash — Change to 141", action: "— (adjust flash)" },
      { condition: "Free Liquid with Inner Containers — OK if came in as RSD", action: "— (no offspec needed)" },
      { condition: "Inner Containers containing liquid 'OK' if they came in as RSD", action: "— (no offspec needed)" },
      { condition: "Liquid with Debris / Items in Liquid", action: "OK — RSD" },
    ]
  },
  "LFP / SFP": {
    desc: "LIQUID FUEL (WITH PHENOLIC COMPOUNDS) / NON-PUMPABLE SLUDGE (WITH PHENOLIC COMPOUNDS)",
    rules: [
      { condition: "Solid", action: "ND (W) — Put 0 water" },
      { condition: "Low pH, Acid 0-1", action: "Raise pH to 4 (SFP = ND)" },
      { condition: "Low pH, Acid 1+", action: "Q and Reprofile" },
      { condition: "Never RT or RT2", action: "— (never offspec to RT/RT2)" },
      { condition: "LFP — High Water, Low BTU (with codes)", action: "VI" },
      { condition: "LFP — High Water, Low BTU (no codes)", action: "LE" },
    ]
  },
  "LM1-3": {
    desc: "LIQUID FOR STABILIZATION",
    rules: [
      { condition: "Pos HexChrom — Liquid/Sludge only, no powder", action: "STA (need compat test)" },
      { condition: "Acid (30-60%)", action: "LA1" },
      { condition: "Acid (60-100%)", action: "LA2" },
      { condition: "Pos Oxidation", action: "Q and Reprofile" },
      { condition: "Chromium 3,000-10,000 — Acid 30-60%", action: "Bill Code = LA1" },
      { condition: "Chromium 3,000-10,000 — Acid 60-100%", action: "Bill Code = LA2" },
      { condition: "Chromium 10,000-50,000 (Liquid / Solid)", action: "Bill Code = STA / NTA" },
      { condition: "Chromium 100,000+", action: "Bill Code = LA3" },
      { condition: "CKD Vigorous", action: "OK" },
      { condition: "LM1-2 — Can go STA if liquid or sludge", action: "STA" },
      { condition: "LM1-2 — Solid", action: "NTA" },
      { condition: "LM3 — Cannot go STA/NTA (try anyway)", action: "Reprofile" },
      { condition: "NM1 — pH OK but Acid 30-35%", action: "Bump acid down" },
      { condition: "Powder", action: "Q to Reprofile" },
    ]
  },
  "NM1-3": {
    desc: "SOLID FOR STABILIZATION",
    rules: [
      { condition: "Pos HexChrom — Solid only, no powder", action: "NTA" },
    ]
  },
  "STA": {
    desc: "SLUDGES/SOLIDS FOR TREATMENT OR LANDFILL (ELECTROPLATING)",
    rules: [
      { condition: "Not Compatible — 'Do Not Pump' stickers", action: "'OK' on Analytical" },
      { condition: "STA to LM", action: "Reprofile" },
      { condition: "100% Liquid", action: "OK" },
    ]
  },
  "NTA": {
    desc: "SOLIDS FOR TREATMENT OR LANDFILL (ELECTROPLATING)",
    rules: [
      { condition: "No Landfill Error — Ask CER to remove block if approved by generator", action: "— (contact CER)" },
      { condition: "Metal Filters OK", action: "— (no offspec needed)" },
      { condition: "Low pH — Try LM1, if not", action: "Reprofile" },
      { condition: "No Liquids", action: "Reprofile to LPS" },
    ]
  },
  "ND": {
    desc: "SOLID LOW BTU FOR BLENDING OR COMBUSTION",
    rules: [
      { condition: "Not Compatible — 'Do Not Pump' stickers (if powder or solid, no sticker needed)", action: "'OK' on Analytical — Barcode Q to QManager" },
      { condition: "Paint Cans", action: "Stays ND" },
      { condition: "Ballasts", action: "Reprofile" },
      { condition: "100% Liquid (example: 70% liquid = ND)", action: "SD" },
      { condition: "Low or High pH (D002 does not apply to solids)", action: "Change pH 2.1-12.5" },
    ]
  },
  "NS": {
    desc: "NON-HAZ SOLID FOR SOLIDIFICATION",
    rules: [
      { condition: "Paint Cans", action: "PS" },
      { condition: "Metal Parts", action: "OK — 'Do Not Shred' stickers" },
      { condition: "Non-Compat (clumping, no reaction)", action: "OK" },
      { condition: "Bleach Wipes (NS/ND)", action: "OK" },
      { condition: "In Totes", action: "OK" },
    ]
  },
  "NSM": {
    desc: "POWDERS (NON-HAZ)",
    rules: [
      { condition: "High pH — if solid, can change to range", action: "— (adjust pH)" },
      { condition: "Liquid", action: "LS" },
    ]
  },
  "NEM": {
    desc: "POWDERS (NON-HAZ)",
    rules: [
      { condition: "Liquid/Sludge", action: "Leave NEM (per Jason S.)" },
      { condition: "Not Compat for Solids", action: "OK" },
    ]
  },
  "NM": {
    desc: "SOLID FOR STABILIZATION",
    rules: [
      { condition: "Pos HexChrom (with or w/o D002)", action: "NTA (compat test)" },
    ]
  },
  "NK": {
    desc: "LEAD BRICKS / MICROENCAPSULATION",
    rules: [
      { condition: "If Metal or Capsules", action: "OK — No sample" },
      { condition: "Elemental Mercury", action: "Q & Reprofile to NR" },
    ]
  },
  "NY": {
    desc: "SOLID STYRENE, ACRYLATES – CANNOT BE IN A TOTE",
    rules: [
      { condition: "No Totes", action: "— (note)" },
    ]
  },
  "LS": {
    desc: "NON-HAZ LIQUID FOR SOLIDIFICATION",
    rules: [
      { condition: "Inner Containers — Do not Q", action: "ZV6 (including DLA)" },
      { condition: "Cannot be on a skid", action: "— (note)" },
      { condition: "Low pH, Acid < 3 — pH goes to 2.1", action: "Attach 'Do Not Process Together' labels" },
    ]
  },
  "PS": {
    desc: "NON-HAZ LATEX IN CANS FOR LANDFILL",
    rules: [
      { condition: "Bulk Liquid", action: "LS" },
    ]
  },
  "LSISO": {
    desc: "NON-HAZ LIQUID FOR SOLIDIFICATION (ISO)",
    rules: [
      { condition: "Liquid on skid or in a box", action: "NSISO" },
      { condition: "Paint Cans", action: "PS" },
      { condition: "Inner Containers / Loosepacks", action: "Stays LSISO" },
    ]
  },
  "SM": {
    desc: "SLUDGE FOR STABILIZATION",
    rules: [
      { condition: "Pos HexChrom", action: "STA (compat test)" },
    ]
  },
  "SS": {
    desc: "NON-HAZ SLUDGE FOR SOLIDIFICATION",
    rules: [
      { condition: "Low pH with Low Acid — Change pH to 2.02", action: "— (adjust pH)" },
    ]
  },
  "LW": {
    desc: "NON-HAZ WASTE WATER (NO OILS)",
    rules: [
      { condition: "Not Compatible", action: "LS" },
    ]
  },
  "XM / XMH": {
    desc: "OXIDIZER FOR STABILIZATION/LANDFILL",
    rules: [
      { condition: "Pos HexChrom or Halogens", action: "LX1-3" },
      { condition: "Positive Oxidation", action: "Manually Pass" },
    ]
  },
  "LA1": {
    desc: "LIQUID INORGANIC ACIDS < 60%",
    rules: [
      { condition: "< 30% Acid (no hex and no vigorous)", action: "LM (bill as LA1)" },
      { condition: "75%+ Acid — Keep going up on LA number until error goes away", action: "LA3, LA4, LA5, LA6" },
      { condition: "HexChrome Not OK", action: "— (note)" },
    ]
  },
  "LA2": {
    desc: "LIQUID INORGANIC ACIDS > 60%",
    rules: [
      { condition: "High pH (3+)", action: "LM (bill as LA2)" },
      { condition: "Low pH, Vigorous", action: "Reprofile" },
      { condition: "< 30% Acid (no hex and no vigorous)", action: "LA1" },
      { condition: "Low Acid (< 60%) Pos Hex", action: "LA1" },
      { condition: "0-60% Acid = any CKD test", action: "LA1" },
    ]
  },
  "NA1-5": {
    desc: "SOLID INORGANIC ACIDS < 60%",
    rules: [
      { condition: "Acid error if solid — Raise to 60%", action: "— (adjust acid)" },
    ]
  },
  "NA2": {
    desc: "SOLID INORGANIC ACIDS > 60%",
    rules: [
      { condition: "pH error with D002", action: "NA1" },
    ]
  },
  "LE1-5": {
    desc: "NON-HAZ LIQUID FOR ENERGY RECOVERY",
    rules: [
      { condition: "High pH", action: "Reprofile" },
      { condition: "Not Compatible", action: "OK (msg in lab results)" },
      { condition: "Low pH (0-4)", action: "Reprofile" },
      { condition: "Gen Results: pH 7 / BTU 5000 / FP 141 / HAL < 0.05", action: "LXI" },
    ]
  },
  "SE1-5": {
    desc: "NON-HAZ SOLIDS",
    rules: [
      { condition: "< 140 Flash — requires D001", action: "Move to HAZ manifest" },
      { condition: "> 140 — Have lab test for < 200, if < 200", action: "Reprofile — no D001, no HAZ manifest" },
    ]
  },
  "NE1-5": {
    desc: "NON-HAZ SOLIDS",
    rules: [
      { condition: "Inner Containers OK — standard analytical results to pass", action: "— (see LE1-3 above)" },
      { condition: "Paint Cans", action: "Q & Offspec to PS" },
      { condition: "Powder will not offspec to NEM", action: "Q & Reprofile to NEM" },
      { condition: "Metal Parts", action: "OK — 'Do Not Shred'" },
    ]
  },
  "RLF / RLF1": {
    desc: "AROMATIC SOLVENTS",
    rules: [
      { condition: "Failed Halogen", action: "LF" },
      { condition: "Water (6-64)", action: "LF" },
      { condition: "Water (65-100)", action: "VI" },
      { condition: "Double Phase", action: "LF" },
      { condition: "No inner containers", action: "— (note)" },
      { condition: "No 5 gal drums or smaller", action: "— (note)" },
      { condition: "Sludge", action: "SF" },
      { condition: "Solid", action: "RT2" },
      { condition: "NVR Fail", action: "LF, VI, VC" },
    ]
  },
  "RPF2": {
    desc: "PETROLEUM DISTILLATE BASED PAINTS AND COATINGS",
    rules: [
      { condition: "Halogens < 3-ish (4-6 ask Jason)", action: "Change to < 0.05" },
      { condition: "No Compatibility — if mild reaction (heat or solidify) ask Jason or Carlos", action: "Reprofile" },
      { condition: "Paints/coatings in ≤ 5 gal inner containers (metal/plastic cans/bottles)", action: "— (OK)" },
    ]
  },
  "RZV1": {
    desc: "SMALL CANS OR JARS OF PAINT, FUELS, LAB RETAINS, NAIL POLISH",
    rules: [
      { condition: "Small cans of paint, lab retain, nail polish, glass jars of liquid", action: "— (OK)" },
      { condition: "Bulk Liquid", action: "Reprofile" },
    ]
  },
  "RLFT": {
    desc: "AROMATIC SOLVENTS (T-CODE — NEVER FAILS)",
    rules: [
      { condition: "Never fails — never offspec", action: "Manually Pass" },
    ]
  },
  "LH1-4": {
    desc: "CYANIDES",
    rules: [
      { condition: "Do not Q — No sample", action: "— (note)" },
      { condition: "No CYB", action: "— (note)" },
    ]
  },
  "CYB": {
    desc: "CYANIDE BAG",
    rules: [
      { condition: "Bag of Liquid", action: "NE3" },
    ]
  },
  "ZV1": {
    desc: "LABPACK FOR DEPACK, FUELS — INNER CONTAINERS OF FUEL MATERIAL",
    rules: [
      { condition: "Hand Sanitizer with spring/pump", action: "Q to Reprofile" },
      { condition: "Hand Sanitizer without spring/pump", action: "LP1 or DIDO" },
    ]
  },
  "ZV6": {
    desc: "NON-HAZ LABPACK FOR DEPACK OR LANDFILL",
    rules: [
      { condition: "Bulk Liquid", action: "LS" },
      { condition: "Bulk Solid", action: "NS (no Q)" },
    ]
  },
  "ZV7": {
    desc: "NON-HAZ LABPACK FOR DEPACK",
    rules: [
      { condition: "Bulk Liquid", action: "LE" },
    ]
  },
  "ZV1 / ZV5": {
    desc: "LABPACK FOR DEPACK — FUELS / PESTICIDES",
    rules: [
      { condition: "Cannot be bulk liquid — Q for ≥ 5 gal", action: "— (note)" },
    ]
  },
  "RO": {
    desc: "USED OIL",
    rules: [
      { condition: "Solid", action: "NO" },
      { condition: "Chemical Issue — Q Manager", action: "Email Approvals" },
      { condition: "Benzene", action: "Use red barcode label" },
    ]
  },
  "PI": {
    desc: "METAL PAINT CANS, GLASS BOTTLES, OR PLASTIC CANS/BOTTLES (MAX 5 GAL)",
    rules: [
      { condition: "Only PCBs and Oxidation results matter — change any other", action: "— (note)" },
      { condition: "Solid material OK", action: "— (no offspec needed)" },
      { condition: "Bulk Liquid", action: "Reprofile" },
      { condition: "pH & Acid results do not matter", action: "— (note)" },
    ]
  },
  "ZI": {
    desc: "LAB PACK INCINERATION",
    rules: [
      { condition: "D003", action: "ZP2" },
      { condition: "Non-Haz", action: "ZI" },
      { condition: "Landfill — Other approvals for new profile", action: "— (contact approvals)" },
    ]
  },
  "ZA": {
    desc: "LAB PACK INORGANIC ACIDS",
    rules: [
      { condition: "No Landfill", action: "ZI" },
    ]
  },
  "ZC / ZCH": {
    desc: "LAB PACK CAUSTICS",
    rules: [
      { condition: "No Landfill", action: "ZI / ZIH" },
    ]
  },
  "ZS": {
    desc: "LAB PACK SOLIDIFICATION",
    rules: [
      { condition: "No Landfill", action: "ZE" },
      { condition: "Non-Haz", action: "ZI" },
      { condition: "Only accepted in drums", action: "— (note)" },
    ]
  },
  "ZAF": {
    desc: "LAB PACK AEROSOLS",
    rules: [
      { condition: "No Canada", action: "AINC Process Code" },
    ]
  },
  "ZX1": {
    desc: "LAB PACK OXIDIZERS",
    rules: [
      { condition: "No Canada", action: "ZI" },
    ]
  },
  "ZIB": {
    desc: "LAB PACK INCINERATION (HAZ)",
    rules: [
      { condition: "ZIBH for non-haz — if it won't work", action: "Send to Approvals" },
    ]
  },
  "ZE": {
    desc: "LAB PACK ENERGY RECOVERY",
    rules: [
      { condition: "Non-Haz", action: "ZI" },
    ]
  },
  "ZR": {
    desc: "LAB PACK MERCURY",
    rules: [
      { condition: "To make hazardous (and vice-versa)", action: "ZR1" },
    ]
  },
  "CZACE": {
    desc: "RCRA EXEMPT ACETYLENE",
    rules: [
      { condition: "Powders — NE/NS goes NEM/NSM if airborne powder", action: "— (note)" },
    ]
  },
  "LP1": {
    desc: "INCINERATION PROCESS CODES",
    rules: [
      { condition: "Crushed Lights", action: "Can be FR2, FR3, or NSM" },
      { condition: "Needles (sharps) — check for cert on profile sheet if OK, pull off stickers", action: "— (verify cert)" },
      { condition: "If not on cert sheet", action: "Send to Approvals" },
      { condition: "PCBs — all drums need sampled immediately (unless no-sample PC)", action: "— (sample required)" },
      { condition: "Labels on drums", action: "— (note)" },
    ]
  },
  "AF1": {
    desc: "AEROSOLS LOOSE IN DRUMS OR CYBs",
    rules: [
      { condition: "No Skid", action: "AF2" },
      { condition: "Boxes of Aerosols in drum", action: "AF1 OK" },
      { condition: "If on a skid and delivered — bill code AF2, change material in Waste Manager to AF2", action: "— (see note)" },
      { condition: "CYB OK", action: "— (no offspec needed)" },
      { condition: "Totes — No inner containers", action: "— (note)" },
      { condition: "No NA3", action: "— (note)" },
      { condition: "Pepper Spray", action: "— (OK)" },
    ]
  },
  "XM": {
    desc: "OXIDIZER FOR STABILIZATION/LANDFILL",
    rules: [
      { condition: "Pos HexChrom or Halogens", action: "LX1-3" },
      { condition: "Positive Oxidation", action: "Manually Pass" },
    ]
  },
  "CORE (General)": {
    desc: "SOLVENTS, ALCOHOLS, FUELS — GENERAL RULES",
    rules: [
      { condition: "% NVR Fail — email Fuel Supervisor with analyticals & retain sample pics", action: "Change % NVR to 15 if supervisor approves" },
      { condition: "Flash — exempt from D001 if no other chemical errors", action: "Change Flash to 141 in Analytical" },
      { condition: "Shotgun Shells — Spent", action: "OK (NK Profile)" },
      { condition: "Shotgun Shells — Full", action: "Reject" },
      { condition: "Empty Drums — non-empty profiles — supervisor signs weight sheet", action: "OK with manifested profile (NM4 → NM2)" },
      { condition: "Chromium — do not Q (NM1-3 does get Q'd, but bill manifest & no Qpack/offspec needed)", action: "Change bill code based on lab results — Manually Pass" },
      { condition: "Elemental Mercury", action: "Reprofile to NR" },
      { condition: "Scrubbers — No sample", action: "Manually Pass — write 'Scrubbers' in Analytical" },
      { condition: "Hand Sanitizer — With Pumps (any Labpack PC)", action: "Q and Reprofiled as LP1 or DIDO" },
      { condition: "Hand Sanitizer — Without Pumps (any Labpack PC)", action: "Do not Q — process as received PC" },
      { condition: "Metal Totes — Sheppard Totes need own sales order and manifest", action: "If not, give to office manager" },
      { condition: "Ballasts — Non-PCB OK for NS if DLA", action: "'Do Not Shred' stickers" },
      { condition: "Ballasts — Non-DLA", action: "Goes LPMD" },
      { condition: "ND Ballasts", action: "Reprofile" },
      { condition: "Batteries — Leaking / Moisture in drum", action: "Reprofile to LPS" },
    ]
  },
};

// ─── SPECS DATA ─────────────────────────────────────────────────────────────
// Structured entry-criteria (what the material must meet to qualify for this code).
// Fields: must[], no[], ph, examples[], notes[]
const SPECS = {
  "LF": {
    must: [">3000 BTU", ">90% liquid / pumpable solids", "< 40% halogens", "< 65% water", "pH 4–10"],
    no: ["PCBs", "Benzene NESHAP waste", "Debris", "Reactive cyanides", "Reactive sulfides", "Reactive metal powders", "Isocyanates", "Nitrocellulose", "Phenolic compounds", "Poison inhalation hazards", "5.2 material", "Oxidizers"],
    examples: ["Waste oil", "Paint", "Paint thinner", "Petroleum distillates", "Xylene", "Toluene", "Methanol"],
    notes: ["LFP is the same code but allows phenolic compounds", "Fuels <5000 but >3000 BTU incur a 30% surcharge"]
  },
  "SF / DF": {
    must: [">3000 BTU", "Non-pumpable sludge (30–60% solid)", "< 40% chlorine", "< 65% water", "pH 4–10", "Free liquid content may vary"],
    no: ["PCBs", "Benzene NESHAP waste", "Reactive cyanides", "Reactive sulfides", "Reactive metal powders", "Isocyanates", "Nitrocellulose", "Phenolic compounds", "Poison inhalation hazards", "5.2 material"],
    examples: ["Waste oil sludge", "Paint sludge", "Distillation bottoms from solvent recovery"],
    notes: ["DF = drum fuel (poured off)", "SFP allows phenolic compounds"]
  },
  "VA": {
    must: [">3000 BTU", ">90% liquid / pumpable", "pH < 4 (organic acid)", "< 40% chlorine", "< 65% water"],
    no: ["PCBs", "Benzene NESHAP waste", "Debris", "Reactive cyanides", "Reactive sulfides", "Reactive metal powders", "Isocyanates", "Nitrocellulose", "Poison inhalation hazards", "Inorganic acids", "> 20% formic acid"],
    examples: ["Glacial acetic acid", "Trichloroacetic acid solution"],
    notes: ["Organic acids only — no inorganic acids", "pH must be < 4 to qualify"]
  },
  "VC": {
    must: [">3000 BTU", ">90% liquid / pumpable", "pH > 10 (organic base)", "< 40% chlorine", "< 65% water"],
    no: ["PCBs", "Benzene NESHAP waste", "Debris", "Reactive cyanides", "Reactive sulfides", "Reactive metal powders", "Isocyanates", "Nitrocellulose", "Poison inhalation hazards", "5.2 material"],
    examples: ["Alkaline methanol solution", "Organic amine mixtures/solutions"],
    notes: ["Organic caustics only — no inorganic caustics", "pH must be > 10 to qualify"]
  },
  "VI": {
    must: ["< 3000 BTU", "> 65% water", "pH 2–14", "Must have some organic content"],
    no: ["PCBs", "Benzene NESHAP waste", "Reactive cyanides", "Reactive sulfides", "Metal powders", "Nitrocellulose", "Poison inhalation hazards", "Isocyanates"],
    examples: ["80% water / 20% methanol solution"],
    notes: [">12.5 pH material approved case by case", "High water + hazardous codes route here from LF/SF"]
  },
  "LI": {
    must: ["> 40% halogenated organic liquids", "< 3000 BTU", "< 65% water", "pH 2–12.5"],
    no: ["PCBs", "Benzene NESHAP waste", "Reactive cyanides", "Reactive sulfides", "Metal powders", "Nitrocellulose", "Poison inhalation hazards"],
    examples: ["100% methylene chloride", "100% 1,1,1-trichloroethane"],
    notes: ["High-halogen route for liquids that can't be LF", "Requires > 40% halogens to qualify"]
  },
  "RT2": {
    must: [">5000 BTU (>3000 minimum)", "Typically 100% solids", "< 0.1% halogens", "pH 4–10", "Free liquid < 10%"],
    no: ["PCBs", "Benzene NESHAP waste", "Poison inhalation hazards", "Strong odor materials", "Oxidizers", "Reactive cyanides/sulfides", "Nitrocellulose", "Metal powders", "Isocyanates", "Pesticides/herbicides", "Soil", "Powders", "Full/unopened inner containers", "Totes (goes to RT)"],
    examples: ["Heavies from distillation column bottoms", "PPE and absorbent pigs contaminated with solvent and paint"],
    notes: ["Non-halogenated only — if halogens > 0.1% use RT", "No full or unopened inner containers — offspec charges for repack", "No material unsuitable for shredding (bricks, pipes, concrete, valves, large metal)"]
  },
  "RT": {
    must: [">5000 BTU", "Typically 100% solids", "< 30% chlorine, max 10% total halogens", "pH 4–10", "Free liquid < 10%"],
    no: ["PCBs", "Benzene NESHAP waste", "Poison inhalation hazards", "Strong odors", "Oxidizers", "Reactive cyanides/sulfides", "Nitrocellulose", "Metal powders", "Isocyanates", "Pesticides/herbicides", "Soil", "Powders"],
    examples: ["Methylene chloride spill debris with pigs, gloves, Tyvek suits, respirator cartridges"],
    notes: ["Halogenated and non-halogenated mixed — use RT2 if non-halo only", "Tyvek suits, respirator cartridges typical"]
  },
  "RS2": {
    must: [">3000 BTU", "Typically 100% solids", "< 0.1% halogens", "pH 4–10", "Free liquid < 10%"],
    no: ["PCBs", "Benzene NESHAP waste", "Poison inhalation hazards", "Strong odors", "Oxidizers", "Reactive cyanides/sulfides", "Nitrocellulose", "Metal powders", "Isocyanates", "Pesticides/herbicides", "Soil", "Powders", "Full/unopened inner containers"],
    examples: ["PPE and absorbent pigs contaminated with solvent and paint", "Solvent-based adhesive"],
    notes: ["Non-halogenated only — if > 0.1% halogens use RH", "No material unsuitable for shredding (bricks, pipes, concrete, valves, large metal)"]
  },
  "RH": {
    must: [">3000 BTU", "Solids with < 10% free liquids", "< 10% halogens", "pH 4–10"],
    no: ["PCBs", "Benzene NESHAP waste", "Poison inhalation hazards", "Strong odors", "Oxidizers", "Reactive cyanides/sulfides", "Nitrocellulose", "Metal powders", "Isocyanates", "Pesticides/herbicides", "Soil", "Powders"],
    examples: ["Dry cleaner filters", "Paint filters with halogens"],
    notes: ["Halogenated version of RS2"]
  },
  "RSD": {
    must: ["< 3000 BTU", "pH 2–12.5", "< 25% liquids by volume"],
    no: ["Poison inhalation hazards", "Strong odors", "PCBs", "Benzene NESHAP waste", "5.2 material", "Oxidizers", "Reactive cyanides/sulfides", "Metal powders", "Isocyanates", "Pesticides/herbicides", "Soil", "Powders"],
    examples: ["Oil dry contaminated with gasoline, oil, and water"],
    notes: ["Off-spec code — do not assign to profiles directly", "Low BTU sludge route from RT2/RS2 when wet"]
  },
  "LFP / SFP": {
    must: [">3000 BTU", "Contains phenolic compounds", "Same specs as LF/SF otherwise"],
    no: ["RT or RT2 routing (never offspec to those)", "Reactive cyanides/sulfides", "PCBs"],
    examples: ["Phenol-containing paint waste", "Phenolic resin sludge"],
    notes: ["LFP = liquid, SFP = sludge", "High water + phenolics → VI; no codes → LE"]
  },
  "LM1-3": {
    must: ["D002, D004–D011 only", "< 500 ppm VOC / no organic UHC", "Acid conc. < 30%", "Alkaline conc. up to 100% OK", "Total mercury < 260 ppm (LM1-3 < 50 ppm)", "Nitric acid < 10%", "Max chrome 10,000 ppm (LM1: 3,000 ppm)", "pH 0–14", "Hydrogen peroxide < 5%", "Hypochlorites/chlorates < 5%"],
    no: ["Hydrofluoric acid in any %", "Ammonia or ammonia compounds", "Hexachrome", "Reactive cyanides/sulfides", "Reactive metal powders", "Chelating agents", "Organics in any concentration"],
    examples: ["Sulfuric acid solution < 30%", "Sodium hydroxide solution", "Sodium sulfate solution"],
    notes: ["LM1 = acid (pH 0–4), LM2 = neutral (pH 4–10), LM3 = base (pH 10–14)", "LM4 is a precode only — final code assigned after sampling", "Processed at TTR Millington → Republic Services landfill", "Chrome > 3,000 ppm but < 10,000 ppm → route to STA/NTA instead"]
  },
  "STA": {
    must: ["D002, D004–D011, F006–F012, F019, K061, K062", "Must be treatable to 40 CFR 268.48 standards", "Debris OK", "Mercury < 260 ppm", "Max chrome 50,000 ppm", "Hexachrome OK", "pH 4–14"],
    no: ["Organics", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["Water-treatment solids from electroplating"],
    notes: ["Sludge version is STA, solid version is NTA", "Chrome > 50,000 ppm requires case-by-case approval"]
  },
  "NTA": {
    must: ["D002, D004–D011, F006–F012, F019, K061, K062", "Must be treatable to 40 CFR 268.48 standards", "Debris OK", "Mercury < 260 ppm", "Max chrome 50,000 ppm", "Hexachrome OK", "pH 4–14"],
    no: ["Organics", "Reactive cyanides/sulfides", "Reactive metal powders", "Free liquids (route to LPS)"],
    examples: ["Electroplating treatment solids", "Lead bricks"],
    notes: ["Solid version of STA", "No landfill error = contact CER to remove block if generator approved"]
  },
  "XM / XMH": {
    must: ["D001 (oxidizer), D002, D004–D011 only", "< 500 ppm VOC", "Acid conc. < 30%", "Alkaline conc. up to 100% OK", "Mercury < 260 ppm", "Nitric acid < 10%", "Max chrome 3,000 ppm", "< 20% total oxidizers", "Hydrogen peroxide < 5%", "Hypochlorites/chlorates < 5%"],
    no: ["Hydrofluoric acid", "Ammonia compounds", "Hexachrome", "Reactive cyanides/sulfides", "Reactive metal powders", "Chelating agents"],
    examples: ["20% sodium nitrate solution", "20% potassium permanganate solution", "Alkaline potassium permanganate solution"],
    notes: ["XMH = non-regulated oxidizer-like material", "Pos hexachrome or halogens → offspec to LX1-3"]
  },
  "LA1": {
    must: ["> 30% but < 60% inorganic acids", "pH 0–7", "D002, D004–D011 only", "Non-oxidizing", "Mercury > 260 ppm OK", "Hexachrome OK", "Total chrome < 10,000 ppm", "Nitric acid < 25%"],
    no: ["Organics in any concentration", "Hydrofluoric acid in any %", "Ammonia or ammonia compounds", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["> 30% sulfuric acid solution"],
    notes: ["LA = liquid, SA = sludge, NA = solid versions", "< 30% acid → LM; > 60% acid → LA2"]
  },
  "LA2": {
    must: ["> 60% inorganic acids", "pH 0–7", "D002, D004–D011 only", "Non-oxidizing", "Mercury > 260 ppm OK", "Hexachrome OK", "Total chrome < 10,000 ppm", "Nitric acid < 25%"],
    no: ["Organics in any concentration", "Hydrofluoric acid in any %", "Ammonia compounds", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["> 60% sulfuric or phosphoric acid solution"],
    notes: ["For very high acid concentrations", "Low acid (< 60%) with pos hexchrome → LA1"]
  },
  "LS": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["RCRA waste codes", "Strong odor materials", "Oxidizers", "Flammable liquids or solids", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["Non-haz liquids for solidification"],
    notes: ["Cannot be on a skid", "Inner containers → ZV6", "Low pH (< 3) → attach 'Do Not Process Together' labels"]
  },
  "SS": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["RCRA waste codes", "Strong odor materials", "Oxidizers", "Flammable liquids or solids", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["Non-haz sludges for solidification/landfill"],
    notes: ["Same specs as LS but for sludges"]
  },
  "NS": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["RCRA waste codes", "Strong odor materials", "Oxidizers", "Flammable liquids or solids", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["Non-haz solids for solidification/landfill"],
    notes: ["Paint cans → PS instead", "Metal parts: OK with 'Do Not Shred' stickers"]
  },
  "LE1-5": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["RCRA waste codes", "Reactive cyanides/sulfides", "Reactive metal powders", "Used oil", "Soil-bearing materials", "Strong odors", "Oxidizers", "Flammable liquids or solids"],
    examples: ["Non-haz liquids for energy recovery/incineration"],
    notes: ["Debris OK", "Low or high pH → reprofile"]
  },
  "SE1-5": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["RCRA waste codes", "Reactive cyanides/sulfides", "Reactive metal powders", "Used oil", "Strong odors", "Oxidizers", "Flammable liquids or solids"],
    examples: ["Non-haz sludges for energy recovery/incineration"],
    notes: ["Flash < 140 → must move to HAZ manifest"]
  },
  "NE1-5": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["RCRA waste codes", "Reactive cyanides/sulfides", "Reactive metal powders", "Used oil", "Strong odors", "Oxidizers", "Flammable liquids or solids"],
    examples: ["Non-haz solids for energy recovery/incineration"],
    notes: ["Debris OK", "Paint cans → Q & offspec to PS", "Metal parts: OK with 'Do Not Shred' stickers", "Powder → NEM"]
  },
  "LW": {
    must: ["No RCRA codes", "> 90% water", "< 1% suspendable solids", "pH 2–12.5"],
    no: ["RCRA codes", "Oil", "Reactive cyanides/sulfides", "Reactive metal powders", "Strong odors", "Oxidizers", "Flammable liquids"],
    examples: ["Clean process wastewater"],
    notes: ["No oils allowed — use LO if oil present"]
  },
  "AF1": {
    must: ["D001, D004–D011 OK", "> 3000 BTU", "< 40% halogens", "pH 4–10", "Non-oxidizing", "2 oz minimum container size"],
    no: ["D002, D003, F codes", "Mace or pepper spray", "Cylinders, cartridges, lighters", "Foaming products", "PCBs", "Reactive cyanides/sulfides", "Reactive metal powders", "Isocyanates"],
    examples: ["Spray paint", "WD-40"],
    notes: ["AF1 = loose in drums or CYBs", "AF2 = in boxes on pallet", "AF3 = in boxes on pallet, individually wrapped in plastic", "All other waste codes case by case"]
  },
  "AI": {
    must: ["D001, D002, D003 OK", "pH 0–14"],
    no: ["Pepper spray, tear gas, or mace", "Reactive cyanides", "Reactive sulfides"],
    examples: ["Small nasal inhalers", "Mace", "Isocyanate-based insulation products"],
    notes: ["For aerosols that cannot go to CRI (AF codes)", "Shipped to Clean Harbors for incineration"]
  },
  "LH1-5": {
    must: ["Inorganic cyanide liquids only", "pH 7–14", "D002–D011, F006–F012, P codes OK"],
    no: ["Organics in any concentration", "Reactive sulfides", "Reactive metal powders"],
    examples: ["Potassium cyanide solution", "Sodium cyanide solution"],
    notes: ["LH1: 1–10,000 ppm total cyanide", "LH2: 10,001–25,000 ppm", "LH3: 25,001–50,000 ppm", "LH4: 50,001–200,000 ppm", "LH5: > 200,000 ppm", "Material shipped to Canada — generator must approve out-of-country disposal"]
  },
  "RO": {
    must: ["Used oil only (no RCRA waste codes)", "pH 4–10", "< 20% water", "< 1,000 ppm halogens", "> 10,000 BTU", "Must be pumpable liquid"],
    no: ["RCRA waste codes", "Waste oil (only used oil)", "Reactive cyanides/sulfides", "Reactive metal powders", "Isocyanates", "PCBs"],
    examples: ["Used motor oil", "Used hydraulic fluid"],
    notes: ["Ship on BOL or manifest", "Non-oxidizing", "No waste oil — used oil only"]
  },
  "BR1": {
    must: ["Lead acid batteries only", "Must ship as Universal Waste", "Plastic drum containers only (no steel per DOT)"],
    no: ["RCRA waste codes", "Ship as hazardous waste"],
    examples: ["Lead acid car batteries"],
    notes: ["Proper shipping name: Universal Waste (Lead Acid Batteries)", "If on pallets, must be strapped or shrink-wrapped", "Cubic yard boxes OK", "May ship on bill of lading"]
  },
  "BR4": {
    must: ["Must ship as Universal Waste", "May ship in any DOT container"],
    no: ["RCRA waste codes", "Ship as hazardous waste"],
    examples: ["Lithium batteries", "Carbon zinc batteries"],
    notes: ["Proper shipping name: Universal Waste (Lithium Batteries) or Universal Waste (Carbon Zinc Batteries)"]
  },
  "BR5": {
    must: ["No mercury", "No RCRA waste codes", "Must ship as Universal Waste", "Liquid and solid alkaline batteries OK"],
    no: ["RCRA waste codes", "Mercury-containing batteries (use BR6)", "Ship as hazardous waste"],
    examples: ["AA, AAA, C, D alkaline batteries"],
    notes: ["May ship on bill of lading"]
  },
  "NR1-2": {
    must: ["D002, D009 OK", "Mercury and mercury debris OK", "Mercury spill cleanup kits OK"],
    no: [],
    examples: ["Elemental mercury", "Mercury thermometers", "Mercury spill kits"],
    notes: ["Other waste codes case by case", "Mercury compounds all approved case by case"]
  },
  "NK": {
    must: ["Solid debris material only", "No free liquids", "Waste codes approved case by case"],
    no: ["Free liquids", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["Lead bricks", "Metal debris for encapsulation"],
    notes: ["Microencapsulation — solid debris only", "WK = shredded metal version"]
  },
  "LP1-10": {
    must: ["Poison inhalation hazard chemicals", "Reactive cyanides/sulfides OK", "P-coded material OK", "Mercury < 260 ppm"],
    no: ["Organic peroxides (use LL1/LL2)", "Spontaneously combustible (case by case)"],
    examples: ["Dimethyl sulfate", "Mercaptoethanol", "Lachrymators", "Mercaptans", "Water reactives"],
    notes: ["High Haz incineration codes", "Case by case approval and pricing", "For no-landfill customers with reactive/PIH materials"]
  },
  "ZV1": {
    must: ["D001, D002 and all fuel-blendable waste codes", "Inner containers of fuel material", "> 3000 BTU", "< 40% halogens", "pH 0–14", "< 65% water"],
    no: ["Isocyanates", "P-listed waste codes", "Poison inhalation hazards", "Pesticides/herbicides", "Strong odor materials", "Oxidizers"],
    examples: ["Small cans of paint", "Lab retains", "Fuel material in sample jars or vials"],
    notes: ["Labpack depack code for fuel materials", "Acidic and caustic fuel-blendable waste OK"]
  },
  "ZV6": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["RCRA waste codes", "Poison inhalation hazards", "Reactive cyanides/sulfides", "Reactive metal powders", "Strong odors"],
    examples: ["Non-haz inner containers for landfill"],
    notes: ["Customer must approve landfill disposal", "Includes DLA materials"]
  },
  "ER": {
    must: ["No waste codes", "Drums, pallets, boxes OK"],
    no: ["Radioactive sources (must be removed prior to shipment)", "RCRA waste codes"],
    examples: ["Monitors", "Keyboards", "Printers", "Fax machines", "Copiers", "Phones", "Servers"],
    notes: ["Ship on bill of lading", "No radioactive sources — must be removed before shipment"]
  },
  "N1": {
    must: ["All asbestos must be double-bagged and wetted", "No RCRA codes", "Can ship in drums or boxes"],
    no: ["RCRA waste codes"],
    examples: ["Asbestos insulation", "Asbestos tile"],
    notes: ["Roll-off containers case by case approval"]
  },
  "RLF / RLF1": {
    must: ["> 5000 BTU", "Typically 100% liquid", "< 0.1% chlorine", "pH 4–10", "< 1% solids", "< 1% total suspended solids"],
    no: ["PCBs", "Benzene NESHAP waste", "Debris", "Reactive cyanides/sulfides", "Reactive metal powders", "Isocyanates", "Powders"],
    examples: ["Aromatic solvents for distillation column recycling"],
    notes: ["R.C.R.A. and non-R.C.R.A. organic liquids for distillation column recycling", "RCRA exempt byproducts, discarded commercial chemical products acceptable"]
  },
  "RANT": {
    must: ["Max 70% water", "100% liquid", "pH 4–10", "Oil content up to 70% OK", "Non-oxidizing"],
    no: ["PCBs", "Benzene NESHAP waste", "Debris", "Heavy metals", "Powders", "Oily sludge in bottom of containers", "Reactive cyanides/sulfides", "Reactive metal powders", "Isocyanates"],
    examples: ["Ethylene glycol antifreeze", "Propylene glycol", "Triethylene glycol"],
    notes: ["Non-RCRA antifreeze and ethylene glycol solutions for distillation column recycling", "Other glycols acceptable: propylene glycol, triethylene glycol, etc."]
  },
  "NEM / NSM": {
    must: ["No RCRA waste codes", "DOT regulated material OK", "State waste codes case by case", "pH 2–12.5"],
    no: ["Strong odors", "Oxidizers", "Flammable liquids/solids", "Reactive cyanides/sulfides", "Reactive metal powders"],
    examples: ["Non-haz powders — allowed due to wind-sheltered baghouse in TN"],
    notes: ["NEM = energy recovery (TN), NSM = process in TN", "Same as NE/NS but allows powders due to TN facility's sheltered baghouse", "Powder that can't go NEM → Q & reprofile"]
  },
};

// Classify action type
function classifyAction(action) {
  const a = action.toUpperCase();
  if (action.startsWith('—') || action === 'OK' || action.includes('no offspec')) return 'note';
  if (action.toLowerCase().includes('reprofile') || action.toLowerCase().includes('q and') || action.toLowerCase().includes('reject') || action.toLowerCase().includes('email')) return 'warning';
  if (action.toLowerCase().includes('ok') || action.toLowerCase().includes('adjust') || action.toLowerCase().includes('manually pass') || action.toLowerCase().includes('raise') || action.toLowerCase().includes('bump') || action.toLowerCase().includes('change') || action.toLowerCase().includes('lower') || action.toLowerCase().includes('verify') || action.toLowerCase().includes('contact') || action.toLowerCase().includes('sample') || action.toLowerCase().includes('note') || action.toLowerCase().includes('sticker')) return 'action';
  // Looks like a code (short, mostly uppercase)
  if (action.length <= 12 && action === action.replace(/[^A-Z0-9\/\s\(\)\.]/g, '').trim()) return 'code';
  return 'action';
}

let selectedCode = null;

function renderCodeList(filter = '') {
  const list = document.getElementById('codeList');
  list.innerHTML = '';
  const keys = Object.keys(DATA).filter(k => codeMatchesFilter(k, DATA[k].desc, filter));
  if (keys.length === 0) {
    list.innerHTML = '<div class="no-results">NO CODES MATCH</div>';
    return;
  }
  keys.forEach(code => {
    const btn = document.createElement('button');
    btn.className = 'code-btn' + (code === selectedCode ? ' active' : '');
    btn.innerHTML = `
      <span class="code-label">${code}</span>
      <span class="code-desc">${DATA[code].desc}</span>
      <span class="rule-count">${DATA[code].rules.length}</span>
    `;
    btn.addEventListener('click', () => selectCode(code));
    list.appendChild(btn);
  });
}

function highlightMatch(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<em>$1</em>');
}

function selectCode(code) {
  selectedCode = code;
  renderCodeList(document.getElementById('codeSearch').value);
  buildRightPanel(code);
}

function buildRightPanel(code, activeTab = 'rules', ruleFilter = '') {
  const right = document.getElementById('rightContent');
  const entry = DATA[code];

  right.innerHTML = `
    <div class="right-top">
      <div class="selected-code-title">${code}</div>
      <div class="selected-code-meta">
        <h2 id="codeDescDisplay">${entry.desc}</h2>
        <p id="ruleCountDisplay">${entry.rules.length} CONDITION${entry.rules.length !== 1 ? 'S' : ''} · OFFSPEC REFERENCE
          <button class="edit-desc-btn admin-only" id="editDescBtn" title="Edit description">✎</button>
        </p>
      </div>
    </div>
    <div class="condition-search" id="condSearchWrap">
      <div class="condition-search-label">Search</div>
      <input type="text" id="condSearch" dir="ltr" placeholder="Filter conditions or actions for ${code}...">
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${activeTab === 'rules' ? 'active' : ''}" id="tabRules">⚡ OFFSPEC RULES</button>
      <button class="tab-btn ${activeTab === 'specs' ? 'active' : ''}" id="tabSpecs">📋 ENTRY SPECS</button>
    </div>
    <div id="tabRulesContent" style="display:${activeTab === 'rules' ? 'flex' : 'none'};flex-direction:column;flex:1;min-height:0;overflow:hidden;">
      <div class="rules-area" id="rulesArea"></div>
      <button class="add-rule-btn admin-only" id="addRuleBtn">+ ADD CONDITION / RULE</button>
    </div>
    <div id="tabSpecsContent" style="display:${activeTab === 'specs' ? 'flex' : 'none'};flex-direction:column;flex:1;min-height:0;overflow:hidden;">
      <div class="specs-area" id="specsArea"></div>
    </div>
  `;

  const condSearchEl = document.getElementById('condSearch');
  if (ruleFilter) condSearchEl.value = ruleFilter;

  renderRules(code, ruleFilter);
  renderSpecs(code);

  condSearchEl.addEventListener('input', (e) => {
    renderRules(code, e.target.value);
  });
  document.getElementById('addRuleBtn').addEventListener('click', () => {
    openRuleModal(code, null, null);
  });
  document.getElementById('editDescBtn').addEventListener('click', () => {
    openCodeEditModal(code);
  });
  document.getElementById('tabRules').addEventListener('click', () => {
    document.getElementById('tabRules').classList.add('active');
    document.getElementById('tabSpecs').classList.remove('active');
    document.getElementById('tabRulesContent').style.display = 'flex';
    document.getElementById('tabSpecsContent').style.display = 'none';
    document.getElementById('condSearchWrap').style.display = '';
  });
  document.getElementById('tabSpecs').addEventListener('click', () => {
    document.getElementById('tabSpecs').classList.add('active');
    document.getElementById('tabRules').classList.remove('active');
    document.getElementById('tabSpecsContent').style.display = 'flex';
    document.getElementById('tabRulesContent').style.display = 'none';
    document.getElementById('condSearchWrap').style.display = 'none';
  });
  if (activeTab === 'specs') document.getElementById('condSearchWrap').style.display = 'none';
}

function renderSpecs(code) {
  const area = document.getElementById('specsArea');
  if (!area) return;

  // Find specs by exact key match or partial match
  let specs = SPECS[code];
  if (!specs) {
    // Try to find a matching key (e.g. code "LF" matches SPECS["LF"])
    const matchKey = Object.keys(SPECS).find(k =>
      k.toUpperCase() === code.toUpperCase() ||
      k.toUpperCase().replace(/\s/g,'') === code.toUpperCase().replace(/\s/g,'') ||
      code.toUpperCase().startsWith(k.split(/[\s\/]/)[0].toUpperCase())
    );
    if (matchKey) specs = SPECS[matchKey];
  }

  if (!specs) {
    area.innerHTML = `<div class="no-specs-msg">NO ENTRY SPECIFICATIONS ON FILE FOR ${code}<br><br>
      <small style="font-size:14px;opacity:0.5">Check the handbook or add specs manually via the rules tab.</small></div>`;
    return;
  }

  const sections = [];

  if (specs.must && specs.must.length) {
    sections.push(`
      <div class="specs-section">
        <h4 class="must-hdr">✓ MUST MEET</h4>
        <div class="specs-pills">
          ${specs.must.map(s => `<span class="specs-pill must">${s}</span>`).join('')}
        </div>
      </div>`);
  }

  if (specs.no && specs.no.length) {
    sections.push(`
      <div class="specs-section">
        <h4 class="no-hdr">✕ NOT ALLOWED</h4>
        <div class="specs-pills">
          ${specs.no.map(s => `<span class="specs-pill no-item">NO ${s}</span>`).join('')}
        </div>
      </div>`);
  }

  if (specs.examples && specs.examples.length) {
    sections.push(`
      <div class="specs-section">
        <h4 class="ex-hdr">◆ TYPICAL MATERIALS</h4>
        <div class="specs-pills">
          ${specs.examples.map(s => `<span class="specs-pill ex-item">${s}</span>`).join('')}
        </div>
      </div>`);
  }

  if (specs.notes && specs.notes.length) {
    sections.push(`
      <div class="specs-section">
        <h4 class="note-hdr">📌 NOTES</h4>
        <div class="specs-pills" style="flex-direction:column;gap:6px;">
          ${specs.notes.map(s => `<span class="specs-pill note-item">— ${s}</span>`).join('')}
        </div>
      </div>`);
  }

  area.innerHTML = sections.join('');
}

function renderRules(code, condFilter) {
  const entry = DATA[code];
  const area = document.getElementById('rulesArea');
  const countEl = document.getElementById('ruleCountDisplay');
  if (countEl) {
    countEl.innerHTML = `${entry.rules.length} CONDITION${entry.rules.length !== 1 ? 'S' : ''} · OFFSPEC REFERENCE
      <button class="edit-desc-btn admin-only" id="editDescBtn" title="Edit description">✎</button>`;
    document.getElementById('editDescBtn').addEventListener('click', () => openCodeEditModal(code));
  }

  let filteredRules = entry.rules.map((r, i) => ({ ...r, origIndex: i }));

  // Non-admins never see hidden rules
  if (!IS_ADMIN) filteredRules = filteredRules.filter(r => !r.hidden);

  if (condFilter && condFilter.trim()) {
    const words = condFilter.trim().split(/\s+/).filter(Boolean);
    filteredRules = filteredRules.filter(r =>
      words.every(w => {
        const wl = w.toLowerCase();
        return r.condition.toLowerCase().includes(wl) || r.action.toLowerCase().includes(wl);
      })
    );
  }

  if (filteredRules.length === 0) {
    area.innerHTML = '<div class="no-results">NO CONDITIONS MATCH FILTER</div>';
    return;
  }

  area.innerHTML = filteredRules.map(r => {
    const type = classifyAction(r.action);
    const hiddenClass = r.hidden ? 'rule-hidden' : '';
    const hideLabel = r.hidden ? '👁 SHOW' : '🚫 HIDE';
    const hideBtnClass = r.hidden ? 'hide-btn is-hidden' : 'hide-btn';
    return `
      <div class="rule-card ${hiddenClass}" data-idx="${r.origIndex}">
        <div class="rule-condition">${highlightMatch(r.condition, condFilter)}</div>
        <div class="rule-action">
          <span class="action-tag ${type}">${highlightMatch(r.action, condFilter)}</span>
        </div>
        <div class="rule-actions-bar admin-only">
          <button class="edit-btn" data-idx="${r.origIndex}">✎ EDIT</button>
          <button class="${hideBtnClass}" data-idx="${r.origIndex}">${hideLabel}</button>
          <button class="delete-btn" data-idx="${r.origIndex}">✕ DELETE</button>
        </div>
      </div>`;
  }).join('');

  area.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      openRuleModal(code, idx, DATA[code].rules[idx]);
    });
  });

  area.querySelectorAll('.hide-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      DATA[code].rules[idx].hidden = !DATA[code].rules[idx].hidden;
      saveToFirebase();
      renderRules(code, document.getElementById('condSearch')?.value || '');
    });
  });

  area.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      if (confirm('Delete this rule?')) {
        DATA[code].rules.splice(idx, 1);
        saveToFirebase();
        renderRules(code, document.getElementById('condSearch')?.value || '');
      }
    });
  });
}

// ---- RULE MODAL ----
let modalState = {};

function openRuleModal(code, ruleIndex, rule) {
  modalState = { code, ruleIndex };
  document.getElementById('modalTitle').textContent = ruleIndex === null ? 'ADD RULE' : 'EDIT RULE';
  document.getElementById('modalCondition').value = rule ? rule.condition : '';
  document.getElementById('modalAction').value = rule ? rule.action : '';
  document.getElementById('deleteCodeBtn').style.display = 'none';
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('modalCondition').focus();
}

document.getElementById('modalSave').addEventListener('click', () => {
  const condition = document.getElementById('modalCondition').value.trim();
  const action = document.getElementById('modalAction').value.trim();
  if (!condition || !action) { showToast('Both fields are required.','warn'); return; }

  const { code, ruleIndex } = modalState;
  if (ruleIndex === null) {
    DATA[code].rules.push({ condition, action });
  } else {
    const wasHidden = DATA[code].rules[ruleIndex].hidden || false;
    DATA[code].rules[ruleIndex] = { condition, action, hidden: wasHidden };
  }
  saveToFirebase();
  closeModal();
  renderRules(code, document.getElementById('condSearch')?.value || '');
});

document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ---- CODE EDIT MODAL (desc + delete) ----
function openCodeEditModal(code) {
  document.getElementById('editDescModalTitle').textContent = 'EDIT: ' + code;
  document.getElementById('editCodeNameInput').value = code;
  document.getElementById('editDescInput').value = DATA[code].desc;
  modalState = { editingDescCode: code };
  document.getElementById('editDescModalOverlay').classList.add('open');
  setTimeout(() => document.getElementById('editCodeNameInput').focus(), 50);
}

document.getElementById('editDescSave').addEventListener('click', () => {
  const oldCode = modalState.editingDescCode;
  if (!oldCode) return;
  const newCode = document.getElementById('editCodeNameInput').value.trim().toUpperCase();
  const newDesc = document.getElementById('editDescInput').value.trim();
  if (!newCode) { showToast('Code name cannot be empty.','warn'); return; }
  if (!newDesc) { showToast('Description cannot be empty.','warn'); return; }
  if (newCode !== oldCode && DATA[newCode]) { showToast(newCode+" already exists.","warn"); return; }

  // Rename key if changed
  if (newCode !== oldCode) {
    DATA[newCode] = { ...DATA[oldCode], desc: newDesc };
    delete DATA[oldCode];
    selectedCode = newCode;
  } else {
    DATA[oldCode].desc = newDesc;
  }

  saveToFirebase();
  document.getElementById('editDescModalOverlay').classList.remove('open');
  renderCodeList(document.getElementById('codeSearch').value);
  if (selectedCode) selectCode(selectedCode);
});

document.getElementById('editDescCancel').addEventListener('click', () => {
  document.getElementById('editDescModalOverlay').classList.remove('open');
});

document.getElementById('editDescModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('editDescModalOverlay'))
    document.getElementById('editDescModalOverlay').classList.remove('open');
});

document.getElementById('editCodeNameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.getElementById('editDescCancel').click();
});
document.getElementById('editDescInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('editDescSave').click();
  if (e.key === 'Escape') document.getElementById('editDescCancel').click();
});

document.getElementById('deleteCodeBtn').addEventListener('click', () => {
  const code = modalState.editingCode;
  if (confirm(`Delete the entire "${code}" process code and all its rules?`)) {
    delete DATA[code];
    saveToFirebase();
    closeCodeModal();
    selectedCode = null;
    document.getElementById('rightContent').innerHTML = `
      <div class="empty-state" style="height:calc(100vh - 80px)">
        <div class="big-arrow">←</div>
        <p>SELECT A PROCESS CODE</p>
        <p style="opacity:0.5">TO VIEW OFFSPEC CONDITIONS</p>
      </div>`;
    renderCodeList(document.getElementById('codeSearch').value);
  }
});

// ---- CREATE NEW PROCESS CODE ----
document.getElementById('newCodeBtn').addEventListener('click', () => {
  document.getElementById('newCodeName').value = '';
  document.getElementById('newCodeDesc').value = '';
  document.getElementById('newCodeModalOverlay').classList.add('open');
  document.getElementById('newCodeName').focus();
});

document.getElementById('newCodeSave').addEventListener('click', () => {
  const code = document.getElementById('newCodeName').value.trim().toUpperCase();
  const desc = document.getElementById('newCodeDesc').value.trim() || '—';
  if (!code) { showToast('Process code name is required.','warn'); return; }
  if (DATA[code]) { showToast(code+" already exists.","warn"); return; }
  DATA[code] = { desc, rules: [] };
  saveToFirebase();
  document.getElementById('newCodeModalOverlay').classList.remove('open');
  renderCodeList(document.getElementById('codeSearch').value);
  selectCode(code);
});

document.getElementById('newCodeCancel').addEventListener('click', () => {
  document.getElementById('newCodeModalOverlay').classList.remove('open');
});
document.getElementById('newCodeModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('newCodeModalOverlay'))
    document.getElementById('newCodeModalOverlay').classList.remove('open');
});

// NO SAMPLE LIST button
document.getElementById('noSampleBtn').addEventListener('click', () => {
  document.getElementById('noSampleModalOverlay').classList.add('open');
});
document.getElementById('noSampleClose').addEventListener('click', () => {
  document.getElementById('noSampleModalOverlay').classList.remove('open');
});
document.getElementById('noSampleModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('noSampleModalOverlay'))
    document.getElementById('noSampleModalOverlay').classList.remove('open');
});

// FLASH POINT ERROR button
document.getElementById('flashBtn').addEventListener('click', () => {
  document.getElementById('flashModalOverlay').classList.add('open');
});
document.getElementById('flashClose').addEventListener('click', () => {
  document.getElementById('flashModalOverlay').classList.remove('open');
});
document.getElementById('flashModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('flashModalOverlay'))
    document.getElementById('flashModalOverlay').classList.remove('open');
});

document.getElementById('addCodeBtn').addEventListener('click', () => {
  // Populate dropdown with all codes
  const select = document.getElementById('codeModalSelect');
  select.innerHTML = Object.keys(DATA).map(c =>
    `<option value="${c}" ${c === selectedCode ? 'selected' : ''}>${c} — ${DATA[c].desc}</option>`
  ).join('');
  document.getElementById('codeModalCondition').value = '';
  document.getElementById('codeModalAction').value = '';
  document.getElementById('codeModalOverlay').classList.add('open');
  document.getElementById('codeModalCondition').focus();
});

document.getElementById('codeModalSave').addEventListener('click', () => {
  const code = document.getElementById('codeModalSelect').value;
  const condition = document.getElementById('codeModalCondition').value.trim();
  const action = document.getElementById('codeModalAction').value.trim();
  if (!condition || !action) { showToast('Both condition and action are required.','warn'); return; }

  DATA[code].rules.push({ condition, action });
  saveToFirebase();
  closeCodeModal();
  // Navigate to that code and show the new rule
  selectCode(code);
});

document.getElementById('codeModalCancel').addEventListener('click', closeCodeModal);
document.getElementById('codeModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('codeModalOverlay')) closeCodeModal();
});

function closeCodeModal() {
  document.getElementById('codeModalOverlay').classList.remove('open');
}

// ── Search helpers ──
function expandTokens(str) {
  const tokens = [];
  str.toUpperCase().split(/[\s\/]+/).forEach(part => {
    const m = part.match(/^([A-Z]+)(\d+)-(\d+)$/);
    if (m) { for (let i = parseInt(m[2]); i <= parseInt(m[3]); i++) tokens.push(m[1] + i); }
    else if (part) tokens.push(part);
  });
  return tokens;
}

function codeMatchesFilter(code, desc, filter) {
  if (!filter) return true;
  const words = filter.trim().split(/\s+/);
  const codeTokens = expandTokens(code);
  const rules = (DATA[code] && DATA[code].rules) || [];
  return words.every(word => {
    const wLo = word.toLowerCase();
    const fTokens = expandTokens(word);
    if (fTokens.some(ft => codeTokens.some(ct => ct === ft || ct.startsWith(ft) || ft.startsWith(ct)))) return true;
    if (desc.toLowerCase().includes(wLo)) return true;
    if (rules.some(r => r.condition.toLowerCase().includes(wLo) || r.action.toLowerCase().includes(wLo))) return true;
    return false;
  });
}

function handleGlobalSearch(filter) {
  if (!filter.trim()) { renderCodeList(''); return; }
  const words = filter.trim().split(/\s+/);
  const allCodes = Object.keys(DATA);
  const ruleWords = words.filter(w => {
    const fTokens = expandTokens(w);
    return !allCodes.some(c => { const ct = expandTokens(c); return fTokens.some(ft => ct.some(t => t === ft || t.startsWith(ft) || ft.startsWith(t))); });
  });
  const matchingCodes = allCodes.filter(k => codeMatchesFilter(k, DATA[k].desc, filter));
  if (matchingCodes.length === 1) {
    selectedCode = matchingCodes[0];
    renderCodeList(filter);
    buildRightPanel(matchingCodes[0], 'rules', ruleWords.join(' '));
    return;
  }
  renderCodeList(filter);
}

// ── Init ──
renderCodeList();

document.getElementById('codeSearch').addEventListener('input', (e) => {
  const val = e.target.value;
  document.getElementById('clearSearch').style.display = val ? 'block' : 'none';
  handleGlobalSearch(val);
});

document.getElementById('clearSearch').addEventListener('click', () => {
  document.getElementById('codeSearch').value = '';
  document.getElementById('clearSearch').style.display = 'none';
  handleGlobalSearch('');
});

// ── Firebase + Admin ──
// FIREBASE_DB is provided globally by firebase-init.js
let IS_ADMIN = false;
const FB_DOC = 'lookup_data';
const LS_KEY = 'offspec_lookup_cache';

function setFbStatus(msg, color) {
  const el = document.getElementById('fbLoadStatus');
  if (el) { el.textContent = msg; el.style.color = color || '#555'; }
}

function saveToCache(data, specs) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ DATA: data, SPECS: specs })); } catch(e) {}
}

function loadFromCache() {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; }
}

function applyRemoteData(d) {
  if (d.DATA && typeof d.DATA === 'object') {
    Object.keys(DATA).forEach(k => { if (!d.DATA[k]) delete DATA[k]; });
    Object.keys(d.DATA).forEach(k => { DATA[k] = d.DATA[k]; });
  }
  if (d.SPECS && typeof d.SPECS === 'object') {
    Object.keys(d.SPECS).forEach(k => { SPECS[k] = d.SPECS[k]; });
  }
}

function saveToFirebase() {
  if (!FIREBASE_DB) return;
  FIREBASE_DB.collection('offspec').doc(FB_DOC).set({ DATA: DATA, SPECS: SPECS }).then(() => {
    saveToCache(DATA, SPECS);
    setFbStatus('⬤ Saved', '#3ddc84');
    setTimeout(() => setFbStatus('⬤ Connected', '#3ddc84'), 2000);
  }).catch(e => {
    setFbStatus('⬤ Save failed', '#ff4d4d');
    console.warn('Firebase save error:', e);
  });
}

function updateLockButtons() {
  const lockBtn = document.getElementById('lockBtn');
  const unlockBtn = document.getElementById('unlockBtn');
  if (IS_ADMIN) {
    lockBtn.classList.remove('active');
    lockBtn.style.borderColor = '#2a2a3a';
    lockBtn.style.color = '#555';
    unlockBtn.classList.add('active');
    unlockBtn.style.borderColor = '#3ddc84';
    unlockBtn.style.color = '#3ddc84';
  } else {
    unlockBtn.classList.remove('active');
    unlockBtn.style.borderColor = '#2a2a3a';
    unlockBtn.style.color = '#555';
    lockBtn.classList.add('active');
    lockBtn.style.borderColor = '#3ddc84';
    lockBtn.style.color = '#3ddc84';
  }
}

function applyAdminMode() {
  IS_ADMIN = true;
  document.body.classList.add('is-admin');
  updateLockButtons();
  if (selectedCode) selectCode(selectedCode);
}

function lockMode() {
  IS_ADMIN = false;
  document.body.classList.remove('is-admin');
  updateLockButtons();
  if (selectedCode) selectCode(selectedCode);
}

document.getElementById('lockBtn').addEventListener('click', () => { lockMode(); });
document.getElementById('unlockBtn').addEventListener('click', () => { applyAdminMode(); });

// Set initial button state
updateLockButtons();

// ── Firebase init (uses shared firebase-init.js) ──
onFirebaseReady(function() {
  setFbStatus('⬤ Loading...', '#f5a623');
  FIREBASE_DB.collection('offspec').doc(FB_DOC).get().then(doc => {
    if (doc.exists) {
      applyRemoteData(doc.data());
      saveToCache(DATA, SPECS);
      setFbStatus('⬤ Connected', '#3ddc84');
    } else {
      FIREBASE_DB.collection('offspec').doc(FB_DOC).set({ DATA: DATA, SPECS: SPECS }).then(() => {
        saveToCache(DATA, SPECS);
        setFbStatus('⬤ Connected (seeded)', '#3ddc84');
      });
    }
    renderCodeList(document.getElementById('codeSearch').value);
    if (selectedCode && DATA[selectedCode]) selectCode(selectedCode);
  }).catch(e => {
    console.warn('Firebase load error:', e);
    const cached = loadFromCache();
    if (cached) { applyRemoteData(cached); setFbStatus('⬤ Offline (cached)', '#f5a623'); }
    else setFbStatus('⬤ Offline', '#ff4d4d');
    renderCodeList();
  });
});

