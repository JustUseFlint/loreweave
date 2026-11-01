/* Loreweave curated content.
   Regions: champion → faction per Riot's public Universe faction listings (curated by hand).
   Relationships, events and trails: curated sample data, summarized in original words. */
window.LW_DATA = (() => {
  const R = {
    bandle:{name:"Bandle City",color:"#E9B949",tag:"Home of the yordles",summary:"A hidden yordle realm reached through shifting spirit-paths. Time, scale and logic bend there, and its residents wander the wider world with mischief and curiosity.",landmarks:["The Hidden Paths","Bandle Woods"],x:610,y:255,
      champs:"Corki Lulu Rumble Teemo Tristana Veigar Yuumi"},
    bilgewater:{name:"Bilgewater",color:"#3FA7A0",tag:"Port of plunder",summary:"A lawless port city in the Serpent Isles where pirates, bounty hunters and smugglers trade under the rule of whoever holds the most fear.",landmarks:["The Slaughter Docks","Butcher's Bridge"],x:825,y:470,
      champs:"Gangplank Graves Illaoi MissFortune Nautilus Pyke TahmKench TwistedFate Fizz Nilah"},
    demacia:{name:"Demacia",color:"#D9C58A",tag:"Kingdom of law",summary:"A proud kingdom founded as a refuge from magic. Its petricite walls and strict laws keep sorcery out, at a growing cost to the mages born within.",landmarks:["The Great City of Demacia","Petricite forests"],x:205,y:270,
      champs:"Fiora Galio Garen JarvanIV Kayle Lux Morgana Poppy Quinn Shyvana Sona Sylas Vayne XinZhao Lucian Locke"},
    freljord:{name:"Freljord",color:"#8DC6E8",tag:"The frozen north",summary:"A harsh land of ice where tribes vie for survival under the legacy of the Three Sisters and the shadow of the Iceborn.",landmarks:["Frostguard Citadel","Rakelstake","The Howling Abyss"],x:300,y:95,
      champs:"Anivia Ashe Braum Gnar Gragas Lissandra Nunu Olaf Ornn Sejuani Trundle Tryndamere Udyr Volibear Aurora"},
    ionia:{name:"Ionia",color:"#E58FB0",tag:"The first lands",summary:"An island land deeply bound to the spirit realm, scarred by the Noxian invasion and divided over how to protect its balance.",landmarks:["The Placidium of Navori","Kinkou Monastery"],x:880,y:205,
      champs:"Ahri Akali Ivern Irelia Jhin Karma Kayn Kennen LeeSin Lillia MasterYi MonkeyKing Rakan Shen Syndra Varus Xayah Yasuo Yone Zed Hwei Sett Yunara"},
    ixtal:{name:"Ixtal",color:"#5FCF7A",tag:"Elemental jungle",summary:"A secluded jungle nation of elemental mages who withdrew from the world rather than join it, hidden behind wards and wilds.",landmarks:["Ixaocan","The Sunken Temples"],x:610,y:445,
      champs:"Malphite Milio Neeko Nidalee Qiyana Rengar Zyra Skarner"},
    noxus:{name:"Noxus",color:"#D4453B",tag:"Empire of strength",summary:"An expansionist empire that claims anyone may rise by merit and strength. Its armies, generals and noble houses shape the politics of half the world.",landmarks:["The Immortal Bastion","Noxkraya arena"],x:470,y:180,
      champs:"Ambessa Briar Cassiopeia Darius Draven Katarina Kled Leblanc Mordekaiser Rell Riven Samira Sion Swain Talon Vladimir Mel"},
    piltover:{name:"Piltover",color:"#E6A65A",tag:"City of Progress",summary:"A gleaming city of inventors and merchant clans whose hextech breakthroughs and trade gates sit directly above the undercity of Zaun.",landmarks:["The Sun Gates","The Academy"],x:505,y:330,
      champs:"Caitlyn Camille Ezreal Heimerdinger Jayce Orianna Seraphine Vi"},
    shadowisles:{name:"Shadow Isles",color:"#4FD1B5",tag:"Land of the Ruined",summary:"Once the radiant Blessed Isles, now shrouded in the Black Mist after the Ruination. The dead who linger here are bound in endless torment.",landmarks:["Helia","The Black Mist"],x:965,y:505,
      champs:"Elise Gwen Hecarim Kalista Karthus Maokai Thresh Viego Vex Yorick Senna"},
    shurima:{name:"Shurima",color:"#E8C15A",tag:"Fallen empire of the sun",summary:"A desert where a god-emperor's empire once spanned continents. Its sun disc has risen again, and old Ascended powers stir.",landmarks:["The Sun Disc","Nerimazeth"],x:430,y:470,
      champs:"Akshan Amumu Azir KSante Nasus Naafiri Rammus Renekton Sivir Taliyah Xerath"},
    targon:{name:"Targon",color:"#9C8CFF",tag:"The mountain of the stars",summary:"A towering peak where mortals who survive the climb may become hosts to celestial Aspects. The Solari and Lunari faiths contest its sky.",landmarks:["Mount Targon","The Solari temples"],x:250,y:470,
      champs:"AurelionSol Diana Leona Pantheon Soraka Taric Zoe Aphelios"},
    void:{name:"The Void",color:"#B061FF",tag:"The hungering dark",summary:"A realm of nothingness pressing into the world. Its creatures were unleashed through the fall of ancient Icathia and hunger to unmake reality.",landmarks:["Icathia","The Void rifts"],x:620,y:560,
      champs:"Belveth Chogath Kaisa Kassadin Khazix KogMaw Malzahar RekSai Velkoz"},
    zaun:{name:"Zaun",color:"#5BE0A0",tag:"The undercity",summary:"A sprawling, chemically choked undercity beneath Piltover, where inventors, chem-barons and survivors build futures from scrap.",landmarks:["The Lanes","The Sump"],x:540,y:375,
      champs:"Blitzcrank DrMundo Ekko Janna Jinx Renata Singed Twitch Urgot Viktor Warwick Zac Zeri Ziggs"},
  };
  const regionOf = {};
  for (const [k,v] of Object.entries(R)) v.champs.split(" ").forEach(c => regionOf[c] = k);

  // [from, to, type, note] — curated sample data, summarized in original words.
  const REL = [
    ["Jinx","Vi","Sibling","Sisters from the undercity whose paths split apart violently."],
    ["Jinx","Caitlyn","Rival","Piltover's sheriff has made catching Jinx a personal mission."],
    ["Vi","Caitlyn","Ally","Partners in the Piltover enforcers; the animated series adds romance."],
    ["Jinx","Ekko","Rival","Childhood friends in the animated series, now on opposite sides."],
    ["Jayce","Viktor","Rival","Former research partners whose visions of hextech diverged."],
    ["Heimerdinger","Jayce","Mentor","The yordle professor shaped Piltover's academy where Jayce rose."],
    ["Jayce","Caitlyn","Ally","Defenders of Piltover's order."],
    ["Garen","Lux","Sibling","Children of House Crownguard: the soldier and the hidden mage."],
    ["Garen","Katarina","Rival","A Demacian champion and a Noxian assassin locked in a long rivalry."],
    ["Darius","Draven","Sibling","Noxian brothers: the Hand of Noxus and the glory-hungry executioner."],
    ["Yasuo","Yone","Sibling","Brothers torn apart by a false accusation and a fatal duel."],
    ["Yasuo","Taliyah","Mentor","Yasuo taught the young Shuriman stoneweaver to control her power."],
    ["Yasuo","Riven","Rival","Both carry guilt from the night an Ionian elder died."],
    ["Xayah","Rakan","Love","Vastayan rebels and lovers who fight side by side."],
    ["Kayle","Morgana","Sibling","Twin sisters of celestial heritage with opposed ideals of justice."],
    ["Nasus","Renekton","Sibling","Ascended brothers of Shurima, one sane and one maddened by the Darkin."],
    ["Azir","Xerath","Vendetta","Xerath's betrayal ended Azir's Ascension and Shurima's golden age."],
    ["Renekton","Xerath","Vendetta","Renekton was sealed in a tomb with Xerath for centuries."],
    ["Sivir","Azir","Ally","The mercenary is descended from the emperor's bloodline."],
    ["Ashe","Tryndamere","Love","The Avarosan queen and the barbarian king united by marriage."],
    ["Ashe","Sejuani","Rival","Two visions for the Freljord's future competing for the tribes."],
    ["Ashe","Lissandra","Vendetta","The Ice Witch works in secret against Ashe's unification."],
    ["Anivia","Ornn","Sibling","Freljord demigods: the cryophoenix and the forge god are kin."],
    ["Ornn","Volibear","Sibling","Demigod brothers with very different views of mortals."],
    ["Shen","Zed","Rival","Students of the same master who split over the Kinkou balance."],
    ["Zed","Kayn","Mentor","Zed took the Noxian orphan in and trained him in shadow."],
    ["Shen","Akali","Mentor","Akali trained under Shen before leaving the Kinkou."],
    ["Shen","Kennen","Ally","Kennen serves as Shen's Heart of the Tempest in the Kinkou."],
    ["Lucian","Senna","Love","Husband and wife Sentinels of Light."],
    ["Lucian","Thresh","Vendetta","The Chain Warden imprisoned Senna's soul in his lantern."],
    ["Senna","Thresh","Vendetta","Senna escaped Thresh's lantern and hunts the Black Mist."],
    ["MissFortune","Gangplank","Vendetta","Gangplank murdered her family; she toppled his rule."],
    ["Graves","TwistedFate","Rival","Former partners in crime turned uneasy allies."],
    ["Illaoi","Gangplank","Rival","The priestess of Nagakabouros clashes with Bilgewater's tyrant."],
    ["Rengar","Khazix","Vendetta","The Pridestalker hunts the Void beast that took his eye."],
    ["Katarina","Cassiopeia","Sibling","Daughters of House Du Couteau."],
    ["Katarina","Talon","Ally","Talon was raised by House Du Couteau alongside Katarina."],
    ["Swain","Leblanc","Rival","The Grand General and the Black Rose vie for Noxus."],
    ["JarvanIV","Shyvana","Ally","The prince of Demacia and the half-dragon who swore to protect him."],
    ["JarvanIV","XinZhao","Ally","Xin Zhao serves as seneschal and protector of the royal family."],
    ["Sylas","Lux","Ally","A secret friendship that Sylas turned into a jailbreak."],
    ["Leona","Diana","Rival","Solari and Lunari champions bound by sun and moon."],
    ["Viego","Kalista","Vendetta","Kalista's oath was twisted by the Ruined King's betrayal."],
    ["Viego","Gwen","Rival","The doll stitched with Isolde's magic stands against Viego."],
    ["Hecarim","Kalista","Rival","Old Camavoran soldiers on opposite sides of the Ruination."],
    ["Irelia","Swain","Rival","Irelia led Ionia's resistance against the Noxian invasion."],
    ["Irelia","Karma","Ally","Ionian leaders working, uneasily, to defend their homeland."],
    ["Teemo","Tristana","Ally","Yordle scouts and friends from Bandle City."],
    ["Ambessa","Mel","Sibling","Mother and daughter of House Medarda (curated as family tie)."],
    ["Aatrox","Zaahen","Rival","Fallen Darkin: one embraces war, one hunts his own kind."],
    ["Pantheon","Leona","Ally","Targonian warriors bound to the mountain's Aspects."],
    ["Aphelios","Diana","Ally","Lunari faithful and the moon's champion."],
    ["Nami","Fizz","Ally","Tides-touched heroes of the deep."],
    ["Taric","Leona","Ally","Aspect of the Protector and Aspect of the Sun."],
  ];
  // note: Ambessa is Mel's mother — badge shown as "Family".
  REL.find(r=>r[0]==="Ambessa")[2]="Family";

  // Curated sample world timeline (approximate eras; summarized, not copied).
  const EVENTS = [
    {id:"darkin",era:"Ancient",title:"The Ascended fall to the Darkin",regions:["shurima"],champs:["Aatrox","Zaahen","Varus","Naafiri"],summary:"Shurima's god-warriors are corrupted and imprisoned in weapons, becoming the Darkin.",before:"Shurima's Ascended defend the empire.",after:"The Darkin are sealed in their weapons."},
    {id:"azirfall",era:"Ancient",title:"Azir's Ascension is betrayed",regions:["shurima"],champs:["Azir","Xerath","Nasus","Renekton"],summary:"The slave-mage Xerath disrupts the emperor's ritual, destroying Shurima's capital.",before:"Shurima at the height of its empire.",after:"The empire falls into the sands for millennia."},
    {id:"icathia",era:"Ancient",title:"Icathia opens the Void",regions:["void","shurima"],champs:["Kassadin","Malzahar","Kaisa","Chogath"],summary:"Rebels against Shurima unleash the Void, which devours their own land.",before:"Icathia resists Shuriman rule.",after:"Void horrors seep into the world."},
    {id:"runewars",era:"Ancient",title:"The Rune Wars",regions:["demacia","noxus","freljord"],champs:["Ryze","Galio"],summary:"Mages wielding World Runes nearly destroy Runeterra; Ryze hunts the scattered runes.",before:"World Runes in mortal hands.",after:"A wary world shaped by the devastation."},
    {id:"ruination",era:"Ruination",title:"The Ruination",regions:["shadowisles"],champs:["Viego","Kalista","Hecarim","Thresh","Gwen"],summary:"A grieving king's attempt to revive his queen unleashes the Black Mist over the Blessed Isles.",before:"The Blessed Isles, a place of learning and healing.",after:"The Shadow Isles and their trapped dead."},
    {id:"demaciafound",era:"Founding",title:"Demacia is founded",regions:["demacia"],champs:["Galio","Garen","JarvanIV"],summary:"Refugees from mage wars raise a kingdom behind petricite walls.",before:"Refugees fleeing sorcery.",after:"A kingdom that outlaws magic."},
    {id:"ionianinvasion",era:"Modern",title:"Noxus invades Ionia",regions:["noxus","ionia"],champs:["Irelia","Swain","Riven","Zed","Shen","Karma"],summary:"Noxian armies land in Ionia; the resistance ultimately drives them out at great cost.",before:"An Ionia mostly at peace.",after:"Ionia divided over militarization."},
    {id:"swainrise",era:"Modern",title:"Swain seizes Noxus",regions:["noxus"],champs:["Swain","Darius","Leblanc","Katarina"],summary:"Swain overthrows the Grand General Boram Darkwill and reforms the empire's leadership.",before:"Darkwill's long reign.",after:"Swain rules with Darius as his Hand."},
    {id:"gangplankfall",era:"Modern",title:"Gangplank's fall",regions:["bilgewater"],champs:["MissFortune","Gangplank","TwistedFate","Graves"],summary:"Miss Fortune blows up Gangplank's ship and ignites a power struggle in Bilgewater.",before:"Gangplank rules the docks.",after:"A war for Bilgewater's throne."},
    {id:"shurimareturns",era:"Modern",title:"The Sun Disc rises again",regions:["shurima"],champs:["Azir","Sivir","Xerath","Nasus"],summary:"Sivir's blood reawakens the Sun Disc; Azir returns as the emperor.",before:"Shurima a buried legend.",after:"A resurgent Shurima and a freed Xerath."},
    {id:"hextech",era:"Modern",title:"The Day of Progress and hextech",regions:["piltover","zaun"],champs:["Jayce","Viktor","Heimerdinger","Vi","Jinx","Caitlyn","Ekko"],summary:"Piltover's hextech breakthroughs deepen the divide with the undercity below.",before:"An uneasy truce between topside and the undercity.",after:"Hextech power, and open conflict with Zaun."},
    {id:"freljordwar",era:"Modern",title:"The Freljord's tribal war",regions:["freljord"],champs:["Ashe","Sejuani","Lissandra","Tryndamere","Braum"],summary:"Ashe's peaceful unification competes with Sejuani's conquest while the Iceborn wait.",before:"Scattered tribes.",after:"An unsettled north."},
    {id:"harrowing",era:"Modern",title:"The Harrowing",regions:["shadowisles","bilgewater"],champs:["Thresh","Hecarim","Yorick","Lucian","Senna"],summary:"The Black Mist periodically spills from the Shadow Isles to hunt the living.",before:"Coastal towns at rest.",after:"Fear along every shore."},
  ];

  const TRAILS = [
    {id:"brothers",title:"Two brothers, one blade",hook:"Two brothers, one blade, and a wind that won't forgive",stops:["c:Yasuo","c:Yone","r:ionia","c:Riven","e:ionianinvasion","c:Taliyah","r:shurima","c:Azir"],art:["Yasuo","Yone"]},
    {id:"undercity",title:"From Zaun to the stars",hook:"Two sisters, one city above another",stops:["c:Jinx","c:Vi","r:piltover","e:hextech","c:Viktor","c:Jayce","c:Caitlyn","r:zaun"],art:["Jinx","Vi"]},
    {id:"ruin",title:"The fall of a kingdom",hook:"A king's grief became a curse on an entire nation",stops:["c:Viego","e:ruination","c:Kalista","c:Hecarim","c:Gwen","r:shadowisles","c:Thresh","c:Senna","c:Lucian"],art:["Viego","Kalista"]},
    {id:"siblings",title:"Every sibling pair",hook:"Blood ties that bind, and break",stops:["c:Garen","c:Lux","c:Darius","c:Draven","c:Kayle","c:Morgana","c:Nasus","c:Renekton","c:Katarina","c:Cassiopeia"],art:["Garen","Lux"]},
  ];
  const RIVALRIES = [["Garen","Lux"],["Darius","Draven"],["Jinx","Vi"],["Azir","Xerath"],["MissFortune","Gangplank"],["Shen","Zed"],["Kayle","Morgana"],["Rengar","Khazix"]];
  return {R, regionOf, REL, EVENTS, TRAILS, RIVALRIES};
})();
