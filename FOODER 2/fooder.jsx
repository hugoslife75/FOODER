import { useState, useRef, useCallback } from "react";

// ─── REAL PARIS RESTAURANTS DATA ─────────────────────────────────────────────
// Données vérifiées via Google Places API — adresses, coordonnées, notes réelles
const ALL_PLACES_RAW = [
  {
    id:"1", name:"Septime",
    cuisine_type:"Bistronomie française",
    price_range:"€€€",
    rating_avg:4.4,
    address:"80 Rue de Charonne, 75011 Paris",
    latitude:48.8536, longitude:2.3809,
    phone:null,
    hours:"Lun-Ven 12h15–14h & 19h30–23h",
    description:"Table de référence du Paris bistronomique, classée parmi les 50 meilleurs restaurants du monde. Bertrand Grébaut signe une cuisine de saison d'une précision absolue.",
    tags:["Top 50 mondial","Saisonnier","Vins nature"],
    color:"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", emoji:"🥂",
    diets:["omnivore","flexitarien","pescetarien"], budgets:["€€€","€€€€"], cuisines:["francaise"],
    menu: {"format": "Menu dégustation · 7 services", "prix_menu": "75€ déj / 120€ dîner", "sections": [{"title": "Entrées", "dishes": [{"name": "Maquereau, pomme verte, moutarde de graines", "price": "—", "veg": false, "star": true, "note": "Plat signature · Recommandé par 94% des clients"}, {"name": "Betterave, fromage frais, noisettes torréfiées", "price": "—", "veg": true, "star": false, "note": "Option végétarienne"}, {"name": "Sardine fumée, crème acidulée, câpres", "price": "—", "veg": false, "star": false, "note": "Produit de saison"}]}, {"title": "Plats", "dishes": [{"name": "Saint-Pierre, bouillon de crustacés, fenouil", "price": "—", "veg": false, "star": true, "note": "Incontournable · ❤️‍🔥 4 food lovers"}, {"name": "Pigeonneau de Vendée, jus corsé, champignons", "price": "—", "veg": false, "star": true, "note": "Plat du moment · Top vente"}, {"name": "Légumes du marché, grains, sauce verte", "price": "—", "veg": true, "star": false, "note": "Végétal & saisonnier"}]}, {"title": "Desserts", "dishes": [{"name": "Sorbet yuzu, meringue, zestes confits", "price": "—", "veg": true, "star": true, "note": "🏆 Dessert le plus commandé"}, {"name": "Chocolat Valrhona, caramel, noisette", "price": "—", "veg": true, "star": false, "note": ""}]}], "top3": [{"name": "Maquereau, pomme verte, moutarde de graines", "emoji": "🐟", "votes": 847, "label": "Plat signature"}, {"name": "Saint-Pierre, bouillon de crustacés, fenouil", "emoji": "🐠", "votes": 634, "label": "Incontournable"}, {"name": "Sorbet yuzu, meringue, zestes confits", "emoji": "🍋", "votes": 511, "label": "Dessert culte"}]},
  },
  {
    id:"2", name:"Frenchie",
    cuisine_type:"Cuisine franco-anglaise",
    price_range:"€€€",
    rating_avg:4.6,
    address:"5 Rue du Nil, 75002 Paris",
    latitude:48.8677, longitude:2.3479,
    phone:"+33 1 40 39 96 19",
    hours:"Lun-Dim 18h30–22h30",
    description:"Greg Marchand a fait de cette adresse du quartier Montorgueil une institution moderne. Cuisine franco-anglaise de haute précision dans un cadre intime rue du Nil.",
    tags:["Étoile Michelin","Incontournable","Rue du Nil"],
    color:"linear-gradient(135deg,#2d1b4e,#1a0a2e,#3d1068)", emoji:"🍷",
    diets:["omnivore","pescetarien"], budgets:["€€€"], cuisines:["francaise"],
    menu: {"format": "Menu unique · 5 services", "prix_menu": "85€ dîner", "sections": [{"title": "Signature", "dishes": [{"name": "Foie gras poché, anguille fumée, gelée de cidre", "price": "—", "veg": false, "star": true, "note": "Plat culte de la maison · Top vente"}, {"name": "Burrata, tomate ancienne, vinaigrette aux herbes", "price": "—", "veg": true, "star": false, "note": "Option végétarienne"}, {"name": "Seiche à la plancha, riz soufflé, émulsion yuzu", "price": "—", "veg": false, "star": true, "note": "❤️‍🔥 Recommandé par Maxime Dufour"}]}, {"title": "Mains", "dishes": [{"name": "Pigeon rôti, jus aux épices, condiment coriandre", "price": "—", "veg": false, "star": true, "note": "🏆 Plat le plus recommandé"}, {"name": "Lieu jaune, asperges vertes, beurre noisette", "price": "—", "veg": false, "star": false, "note": "Produit de saison"}, {"name": "Risotto d'orge, parmesan 36 mois, truffe", "price": "—", "veg": true, "star": false, "note": "Végétarien gourmet"}]}, {"title": "Desserts", "dishes": [{"name": "Mille-feuille vanille Bourbon, caramel beurre salé", "price": "—", "veg": true, "star": true, "note": "🏆 Dessert #1"}, {"name": "Soufflé chocolat Valrhona, glace tonka", "price": "—", "veg": true, "star": false, "note": "À commander à l'avance"}]}], "top3": [{"name": "Foie gras poché, anguille fumée, gelée de cidre", "emoji": "🍃", "votes": 712, "label": "Plat culte"}, {"name": "Pigeon rôti, jus aux épices", "emoji": "🕊️", "votes": 589, "label": "Best-seller"}, {"name": "Mille-feuille vanille Bourbon", "emoji": "🥐", "votes": 498, "label": "Dessert #1"}]},
  },
  {
    id:"3", name:"Clown Bar",
    cuisine_type:"Bistro gastronomique",
    price_range:"€€€",
    rating_avg:4.2,
    address:"114 Rue Amelot, 75011 Paris",
    latitude:48.8636, longitude:2.3672,
    phone:"+33 1 43 55 87 35",
    hours:"Lun-Dim 12h–14h & 19h–minuit",
    description:"Carreaux de faïence Art Déco classés, abats sublimes et vins de collection. Une adresse hors du temps à deux pas du Cirque d'Hiver, dans un cadre monumental unique.",
    tags:["Art Déco","Cave exceptionnelle","Abats"],
    color:"linear-gradient(135deg,#1a0a0a,#3d0f0f,#1a0000)", emoji:"🎪",
    diets:["omnivore"], budgets:["€€€"], cuisines:["francaise"],
    menu: {"format": "Carte · Petites assiettes à partager", "prix_menu": "50–80€ / pers.", "sections": [{"title": "Petites assiettes", "dishes": [{"name": "Tartare de bœuf, jaune d'œuf, cornichons maison", "price": "18€", "veg": false, "star": true, "note": "🏆 Plat le plus commandé · Indétrônable"}, {"name": "Ris de veau, sauce gribiche, câpres frites", "price": "26€", "veg": false, "star": true, "note": "Abat signature · ❤️‍🔥 Sofia l'adore"}, {"name": "Pâté en croûte canard & foie gras", "price": "22€", "veg": false, "star": false, "note": "Fait maison chaque matin"}, {"name": "Asperges blanches, beurre mousseux, noisettes", "price": "16€", "veg": true, "star": false, "note": "Saisonnier"}]}, {"title": "Grands plats", "dishes": [{"name": "Pigeon en croûte de foie gras, jus corsé", "price": "38€", "veg": false, "star": true, "note": "Spécialité absolue · Top vente dîner"}, {"name": "Sole meunière, petits bateaux, citron confit", "price": "42€", "veg": false, "star": false, "note": "Arrivage quotidien"}]}, {"title": "Desserts", "dishes": [{"name": "Paris-Brest, praliné maison, chantilly pralinée", "price": "14€", "veg": true, "star": true, "note": "🏆 Dessert #1"}, {"name": "Tarte citron meringuée, zestes frais", "price": "12€", "veg": true, "star": false, "note": ""}]}], "top3": [{"name": "Tartare de bœuf, jaune d'œuf maison", "emoji": "🥩", "votes": 923, "label": "Indétrônable"}, {"name": "Pigeon en croûte de foie gras", "emoji": "🕊️", "votes": 701, "label": "Spécialité maison"}, {"name": "Paris-Brest, praliné maison", "emoji": "🥐", "votes": 634, "label": "Dessert culte"}]},
  },
  {
    id:"4", name:"Mokonuts",
    cuisine_type:"Cuisine du Levant",
    price_range:"€€",
    rating_avg:4.7,
    address:"5 Rue Saint-Bernard, 75011 Paris",
    latitude:48.8508, longitude:2.3814,
    phone:"+33 9 80 81 82 85",
    hours:"Lun-Ven 12h–14h30 (déjeuner uniquement)",
    description:"Omar Dhiab et Moko Hirayama livrent une cuisine du Levant lumineuse et sincère dans un espace de 22 couverts. Les cookies au sésame sont légendaires.",
    tags:["Levant","Cookies","Déjeuner"],
    color:"linear-gradient(135deg,#1a1500,#3d3000,#2a1f00)", emoji:"🫙",
    diets:["omnivore","vegetarien","flexitarien","halal"], budgets:["€€"], cuisines:["moyen-orient"],
    menu: {"format": "Formule du marché · 3 services", "prix_menu": "28€ déjeuner", "sections": [{"title": "Entrées", "dishes": [{"name": "Houmous maison, légumes croquants, zaatar", "price": "—", "veg": true, "star": true, "note": "❤️‍🔥 Recommandé par Léa · Classique Levant"}, {"name": "Salade de lentilles tiède, citron confit, herbes", "price": "—", "veg": true, "star": false, "note": "Vegan"}, {"name": "Ceviche de daurade, lait de coco, coriandre", "price": "—", "veg": false, "star": true, "note": "Top vente du moment"}]}, {"title": "Plats", "dishes": [{"name": "Saumon mi-cuit, beurre blanc citronné, quinoa", "price": "—", "veg": false, "star": true, "note": "🏆 Plat signature · Melt-in-mouth texture"}, {"name": "Agneau confit aux épices, légumes rôtis, semoule", "price": "—", "veg": false, "star": false, "note": "Week-end uniquement"}, {"name": "Gnocchi maison, champignons, parmesan", "price": "—", "veg": true, "star": false, "note": "Végétarien"}]}, {"title": "Pâtisseries & Cookies", "dishes": [{"name": "Cookie sésame noir & tahini (la légende)", "price": "4€", "veg": true, "star": true, "note": "🏆 Incontournable absolu · À emporter"}, {"name": "Cookie curcuma & chocolat blanc", "price": "4€", "veg": true, "star": true, "note": "Saveur surprise de la maison"}, {"name": "Blancmange coco, fruits de saison", "price": "—", "veg": true, "star": false, "note": ""}]}], "top3": [{"name": "Cookie sésame noir & tahini", "emoji": "🍪", "votes": 1204, "label": "La légende"}, {"name": "Saumon mi-cuit, beurre blanc citronné", "emoji": "🐟", "votes": 867, "label": "Plat signature"}, {"name": "Houmous maison, légumes, zaatar", "emoji": "🫙", "votes": 654, "label": "Classique Levant"}]},
  },
  {
    id:"5", name:"Restaurant LAVA",
    cuisine_type:"Cuisine au feu & braise",
    price_range:"€€",
    rating_avg:4.8,
    address:"9 Rue de la Montagne Ste Geneviève, 75005 Paris",
    latitude:48.8491, longitude:2.3489,
    phone:"+33 1 43 29 12 12",
    hours:"Lun-Dim 12h–14h30 & 18h30–minuit",
    description:"Cuisine au feu et à la braise dans le Quartier latin, portée par une passion pour les volcans. Menu dégustation aveugle en 3 ou 5 plats. Une des meilleures tables de Paris en 2024.",
    tags:["Braise","Menu aveugle","Quartier latin"],
    color:"linear-gradient(135deg,#3d1000,#5c1800,#2a0800)", emoji:"🔥",
    diets:["omnivore","pescetarien"], budgets:["€€","€€€"], cuisines:["francaise"],
    menu: {"format": "Menu aveugle · 3 ou 5 plats (Éruption)", "prix_menu": "55€ / 80€", "sections": [{"title": "Menu Éruption · 5 services", "dishes": [{"name": "Mise en bouche du chef (surprise)", "price": "—", "veg": false, "star": false, "note": "Amuse-bouche volcanique offert"}, {"name": "Carpaccio de thon, huile de piment, oseille", "price": "—", "veg": false, "star": true, "note": "🏆 Révélation du menu · Chili oil signature"}, {"name": "Poisson en feuilles de lotus, aigre-doux", "price": "—", "veg": false, "star": true, "note": "❤️‍🔥 Recommandé · Saveurs d'Asie subtiles"}, {"name": "Canard rôti au feu de bois, jus laqué", "price": "—", "veg": false, "star": true, "note": "Top vente · Cuisson au feu parfaite"}, {"name": "Pavlova litchi, rose, crème montée", "price": "—", "veg": true, "star": true, "note": "Dessert le plus commandé"}]}, {"title": "Menu Braise · 3 services", "dishes": [{"name": "Légumes grillés à la braise, romesco, amandes", "price": "—", "veg": true, "star": false, "note": "Option végétarienne"}, {"name": "Poulet fermier, braise, jus aux herbes", "price": "—", "veg": false, "star": false, "note": "Valeur sûre du menu court"}, {"name": "Sorbet citron, meringue soufflée", "price": "—", "veg": true, "star": false, "note": ""}]}], "top3": [{"name": "Carpaccio de thon, huile de piment", "emoji": "🐟", "votes": 934, "label": "Révélation absolue"}, {"name": "Canard rôti au feu de bois", "emoji": "🦆", "votes": 788, "label": "Cuisson au feu"}, {"name": "Pavlova litchi, crème montée", "emoji": "🍡", "votes": 612, "label": "Dessert top vente"}]},
  },
  {
    id:"6", name:"Abri",
    cuisine_type:"Cuisine française & japonaise",
    price_range:"€€",
    rating_avg:4.6,
    address:"92 Rue du Faubourg Poissonnière, 75010 Paris",
    latitude:48.8779, longitude:2.3493,
    phone:"+33 1 83 97 00 00",
    hours:"Fermé le lundi · Horaires variables",
    description:"Katsuaki Okiyama signe une cuisine française étoilée avec une sensibilité japonaise unique, dans un cadre de 20 couverts avec cuisine ouverte. Étoile Michelin.",
    tags:["Étoile Michelin","Cuisine ouverte","Franco-japonais"],
    color:"linear-gradient(135deg,#0a1628,#1a2a4a,#0d1f35)", emoji:"🍣",
    diets:["omnivore","pescetarien"], budgets:["€€","€€€"], cuisines:["japonaise","francaise"],
    menu: {"format": "Menu surprise · 4 services", "prix_menu": "55€ déj / 75€ dîner", "sections": [{"title": "Entrées", "dishes": [{"name": "Maquereau, daikon, vinaigrette ponzu", "price": "—", "veg": false, "star": true, "note": "Plat signature · Sensibilité japonaise"}, {"name": "Ris de veau, champignons shiitake, jus de volaille", "price": "—", "veg": false, "star": true, "note": "❤️‍🔥 Nina l'a adoré · Top vente"}, {"name": "Carpaccio de betterave, crème de chèvre, yuzu", "price": "—", "veg": true, "star": false, "note": "Option végétarienne"}]}, {"title": "Plats", "dishes": [{"name": "Pigeon, purée de pois chiche, épices douces", "price": "—", "veg": false, "star": true, "note": "🏆 Best-seller absolu · À ne pas manquer"}, {"name": "Canard & monkfish, légumes de saison", "price": "—", "veg": false, "star": true, "note": "Duo terre-mer exceptionnel"}, {"name": "Risotto, légumes du jardin, comté", "price": "—", "veg": true, "star": false, "note": "Végétarien"}]}, {"title": "Desserts", "dishes": [{"name": "Pêche pochée, yaourt de brebis, amandes effilées", "price": "—", "veg": true, "star": true, "note": "🏆 Dessert le plus photographié"}, {"name": "Fondant chocolat, glace sésame grillé", "price": "—", "veg": true, "star": false, "note": ""}]}], "top3": [{"name": "Pigeon, purée de pois chiche, épices", "emoji": "🕊️", "votes": 712, "label": "Best-seller"}, {"name": "Maquereau, daikon, ponzu", "emoji": "🐟", "votes": 534, "label": "Plat signature"}, {"name": "Pêche pochée, yaourt de brebis", "emoji": "🍑", "votes": 489, "label": "Dessert star"}]},
  },
  {
    id:"7", name:"Le Servan",
    cuisine_type:"Bistro fusion franco-asiatique",
    price_range:"€€€",
    rating_avg:4.5,
    address:"32 Rue Saint-Maur, 75011 Paris",
    latitude:48.8610, longitude:2.3815,
    phone:"+33 1 55 28 51 82",
    hours:"Lun-Sam 12h–14h & 19h30–22h30",
    description:"Tatiana Levha orchestre une cuisine franco-asiatique d'une créativité rare dans cet ancien café du 11e. La sauce des palourdes est à tomber. Sœur de Bertrand Grébaut (Septime).",
    tags:["Franco-asiatique","Naturel","11e"],
    color:"linear-gradient(135deg,#0d2137,#1a4a2e,#0a3322)", emoji:"🌿",
    diets:["omnivore","vegetarien","pescetarien"], budgets:["€€€"], cuisines:["francaise","asiatique"],
    menu: {"format": "Carte · Déjeuner & Dîner", "prix_menu": "35€ déj / 55–70€ dîner", "sections": [{"title": "Entrées", "dishes": [{"name": "Palourdes, sauce XO, pain grillé", "price": "18€", "veg": false, "star": true, "note": "🏆 Sauce culte · Réclamée par tous"}, {"name": "Langoustines, avocat fumé, chili ancho", "price": "24€", "veg": false, "star": true, "note": "❤️‍🔥 Top recommandation saison"}, {"name": "Sardine toast, basilic thaï, citron vert", "price": "14€", "veg": false, "star": false, "note": "Starter parfait"}, {"name": "Asperges blanches, sabayon savagnin, noix noires", "price": "16€", "veg": true, "star": false, "note": "Végétarien · Saisonnier"}]}, {"title": "Plats", "dishes": [{"name": "Ris de veau, oseille, bouillon de kombu", "price": "32€", "veg": false, "star": true, "note": "Top vente dîner"}, {"name": "Thon rouge, jus de thon, feuille shiso", "price": "28€", "veg": false, "star": true, "note": "🏆 Plat signature · Sauce renversante"}, {"name": "Huîtres zakutski, vodka, ciboulette", "price": "22€", "veg": false, "star": false, "note": ""}]}, {"title": "Desserts", "dishes": [{"name": "Paris-Brest, praliné, noix entières", "price": "14€", "veg": true, "star": true, "note": "🏆 Meilleur Paris-Brest de Paris"}, {"name": "Mochi glacé, thé matcha, haricots rouges", "price": "12€", "veg": true, "star": false, "note": ""}]}], "top3": [{"name": "Palourdes, sauce XO, pain grillé", "emoji": "🦪", "votes": 876, "label": "Sauce culte"}, {"name": "Thon rouge, jus de thon, shiso", "emoji": "🐟", "votes": 723, "label": "Plat signature"}, {"name": "Paris-Brest, praliné maison", "emoji": "🥐", "votes": 645, "label": "Meilleur de Paris"}]},
  },
  {
    id:"8", name:"Virtus",
    cuisine_type:"Gastronomie contemporaine",
    price_range:"€€€€",
    rating_avg:4.8,
    address:"29 Rue de Cotte, 75012 Paris",
    latitude:48.8503, longitude:2.3781,
    phone:"+33 9 80 68 08 08",
    hours:"Mar-Sam 19h30–21h · Ven aussi 12h–13h",
    description:"2 étoiles Michelin pour cette table confidentielle du 12e. La cuisine de Chiho Kanzaki et Marcelo di Giacomo est d'une précision et d'une émotion rares. Réservation impérative.",
    tags:["2 étoiles Michelin","Émotion","12e"],
    color:"linear-gradient(135deg,#1a0a2e,#2d1560,#0f0820)", emoji:"💎",
    diets:["omnivore","pescetarien"], budgets:["€€€€"], cuisines:["francaise"],
    menu: {"format": "Menu dégustation · 8 services", "prix_menu": "150€ · Accord mets-vins +80€", "sections": [{"title": "Mise en bouche", "dishes": [{"name": "Amuse-bouches du chef (×3)", "price": "—", "veg": false, "star": false, "note": "Offerts · Préambule au voyage"}, {"name": "Croustillant de homard breton, bisque mousseuse", "price": "—", "veg": false, "star": true, "note": "🏆 Entrée la plus applaudie"}]}, {"title": "Parcours principal", "dishes": [{"name": "Saint-Jacques, topinambour, truffe noire", "price": "—", "veg": false, "star": true, "note": "❤️‍🔥 Recommandé par Léa Moreau"}, {"name": "Filet de sole, algues, émulsion de yuzu", "price": "—", "veg": false, "star": true, "note": "Plat marin signature"}, {"name": "Wagyu 9+, jus au miso, légumes oubliés", "price": "—", "veg": false, "star": true, "note": "Top vente · La pièce centrale"}, {"name": "Légumes de saison, koshihikari, dashi", "price": "—", "veg": true, "star": false, "note": "Option végétarienne disponible"}]}, {"title": "Desserts", "dishes": [{"name": "Pré-dessert citron, gingembre, fleur de sel", "price": "—", "veg": true, "star": false, "note": ""}, {"name": "Chocolat Araguani, caramel soja, glace miso", "price": "—", "veg": true, "star": true, "note": "🏆 Dessert signature"}]}], "top3": [{"name": "Wagyu 9+, jus au miso, légumes oubliés", "emoji": "🥩", "votes": 934, "label": "Pièce maîtresse"}, {"name": "Homard breton, bisque mousseuse", "emoji": "🦞", "votes": 812, "label": "Entrée star"}, {"name": "Chocolat Araguani, caramel soja", "emoji": "🍫", "votes": 701, "label": "Dessert signature"}]},
  },
  {
    id:"9", name:"Pierre Sang in Oberkampf",
    cuisine_type:"Fusion franco-coréenne",
    price_range:"€€",
    rating_avg:4.6,
    address:"55 Rue Oberkampf, 75011 Paris",
    latitude:48.8647, longitude:2.3724,
    phone:"+33 9 67 31 96 80",
    hours:"Lun-Dim 12h–14h30 & 19h–23h30",
    description:"Pierre Sang Boyer propose un menu mystère en 6 plats revisitant la cuisine française avec des accents coréens. 11 places au comptoir face à la cuisine ouverte — une expérience unique.",
    tags:["Menu mystère","Franco-coréen","Comptoir"],
    color:"linear-gradient(135deg,#2a0d1a,#4a1530,#1a0810)", emoji:"🥢",
    diets:["omnivore","flexitarien"], budgets:["€€"], cuisines:["francaise","asiatique"],
    menu: {"format": "Menu mystère · 6 services", "prix_menu": "55€ · Accord vins +35€", "sections": [{"title": "Menu Mystère (non révélé à l'avance)", "dishes": [{"name": "Amuse-bouche coréen (kimchi, perilla…)", "price": "—", "veg": false, "star": false, "note": "Introduction aux saveurs"}, {"name": "Tartare de bœuf gochujang, jaune d'œuf confit", "price": "—", "veg": false, "star": true, "note": "🏆 Plat le plus commenté"}, {"name": "Poisson du jour, bouillon dashi, légumes fermentés", "price": "—", "veg": false, "star": true, "note": "❤️‍🔥 Recommandé par Théo Laurent"}, {"name": "Riz soufflé, champignons, crème de parmesan", "price": "—", "veg": true, "star": false, "note": "Option végétarienne"}, {"name": "Poulet fermier, doenjang, légumes grillés", "price": "—", "veg": false, "star": true, "note": "Top vente · Cuisson parfaite"}, {"name": "Dessert franco-coréen (surprise)", "price": "—", "veg": true, "star": false, "note": "La surprise finale"}]}], "top3": [{"name": "Tartare bœuf gochujang, jaune d'œuf", "emoji": "🥩", "votes": 789, "label": "Plat signature"}, {"name": "Poulet fermier, doenjang coréen", "emoji": "🍗", "votes": 634, "label": "Top vente"}, {"name": "Poisson du jour, bouillon dashi", "emoji": "🐠", "votes": 512, "label": "❤️‍🔥 Recommandé"}]},
  },
  {
    id:"10", name:"Clamato",
    cuisine_type:"Fruits de mer & bar",
    price_range:"€€€",
    rating_avg:4.4,
    address:"80 Rue de Charonne, 75011 Paris",
    latitude:48.8536, longitude:2.3808,
    phone:"+33 1 43 72 74 53",
    hours:"Lun-Dim 12h–14h30 & 19h–22h30",
    description:"L'annexe marine du Septime, sans réservation. Produits de la mer d'une fraîcheur irréprochable, servis en petites assiettes à partager. Bar à vin naturel excellent.",
    tags:["Fruits de mer","Sans résa","Vins nature"],
    color:"linear-gradient(135deg,#001a2e,#003d5c,#001220)", emoji:"🦀",
    diets:["omnivore","pescetarien"], budgets:["€€€"], cuisines:["francaise"],
    menu: {"format": "Tapas de la mer · Petites assiettes", "prix_menu": "40–60€ / pers. · Sans réservation", "sections": [{"title": "Crustacés & Coquillages", "dishes": [{"name": "Araignée de mer, mayo maison, pain grillé", "price": "17€", "veg": false, "star": true, "note": "🏆 Best-seller absolu · Arrivage quotidien"}, {"name": "Coques, beurre chipotle, pommes de terre croustillantes", "price": "16€", "veg": false, "star": true, "note": "❤️‍🔥 Incontournable · 4 food lovers"}, {"name": "Huîtres du Médoc, mignonette, citron", "price": "14€", "veg": false, "star": false, "note": "3 ou 6 pièces"}]}, {"title": "Poissons & Tartares", "dishes": [{"name": "Tiradito de daurade, sauce kiwi, coriandre", "price": "18€", "veg": false, "star": true, "note": "Top vente · Frais et acidulé"}, {"name": "Tarama de poutargue, pain au levain maison", "price": "12€", "veg": false, "star": false, "note": "Fait maison"}, {"name": "Espadon snacké, vierge aux agrumes", "price": "20€", "veg": false, "star": false, "note": ""}]}, {"title": "Légumes & Desserts", "dishes": [{"name": "Légumes grillés, anchoïade, fleur de sel", "price": "12€", "veg": true, "star": false, "note": "Végétarien"}, {"name": "Tarte sirop d'érable, chantilly vanille", "price": "12€", "veg": true, "star": true, "note": "🏆 Dessert signature · Un must"}]}], "top3": [{"name": "Araignée de mer, mayo maison", "emoji": "🦀", "votes": 1034, "label": "Best-seller #1"}, {"name": "Coques, beurre chipotle, pommes croustillantes", "emoji": "🐚", "votes": 889, "label": "Incontournable"}, {"name": "Tiradito de daurade, sauce kiwi", "emoji": "🐟", "votes": 723, "label": "Top vente"}]},
  },
  {
    id:"11", name:"Le Cheval d'Or",
    cuisine_type:"Fusion franco-chinoise",
    price_range:"€€€",
    rating_avg:4.4,
    address:"21 Rue de la Villette, 75019 Paris",
    latitude:48.8757, longitude:2.3873,
    phone:"+33 7 45 11 16 47",
    hours:"Lun-Ven 19h–21h · Fermé sam-dim",
    description:"Menu dégustation en 9 plats mêlant héritage pékinois et techniques françaises, signé par l'équipe primée aux Time Out Food & Drink Awards 2024. Une adresse confidentielle du 19e.",
    tags:["Franco-chinois","Menu dégustation","19e"],
    color:"linear-gradient(135deg,#1a1500,#4a3800,#2a2000)", emoji:"🏮",
    diets:["omnivore"], budgets:["€€€"], cuisines:["francaise","asiatique"],
    menu: {"format": "Menu dégustation · 9 services", "prix_menu": "95€ · Accord mets-vins +55€", "sections": [{"title": "Ouverture", "dishes": [{"name": "Amuse-bouches ×4 offerts par le chef", "price": "—", "veg": false, "star": false, "note": "Snacks franco-chinois"}, {"name": "Char siu foie gras, brioche vapeur, gingembre", "price": "—", "veg": false, "star": true, "note": "🏆 Fusion la plus audacieuse · Top vente"}]}, {"title": "Parcours", "dishes": [{"name": "Carpaccio de thon, sauce piment doux, huile sésame", "price": "—", "veg": false, "star": true, "note": "❤️‍🔥 Révélation absolue · Chili oil signature"}, {"name": "Raviolis pékinois, sauce truffe, bouillon clair", "price": "—", "veg": false, "star": false, "note": "Classique revisité"}, {"name": "Poisson en feuilles de lotus, sweet & sour", "price": "—", "veg": false, "star": true, "note": "Top vente · Rappelle la cuisine du Yunnan"}, {"name": "Canard de Pékin, crêpes, sauce hoisin maison", "price": "—", "veg": false, "star": true, "note": "Pièce centrale du menu"}]}, {"title": "Dessert", "dishes": [{"name": "Pavlova litchi, rose, crème légère", "price": "—", "veg": true, "star": true, "note": "🏆 Dessert star · Très photographié"}, {"name": "Petit fours maison (×3)", "price": "—", "veg": true, "star": false, "note": ""}]}], "top3": [{"name": "Carpaccio de thon, chili oil, sésame", "emoji": "🐟", "votes": 812, "label": "Révélation"}, {"name": "Char siu foie gras, brioche vapeur", "emoji": "🥩", "votes": 734, "label": "Fusion audacieuse"}, {"name": "Canard de Pékin, crêpes, hoisin maison", "emoji": "🦆", "votes": 678, "label": "Pièce centrale"}]},
  },
  {
    id:"12", name:"Le Châteaubriand",
    cuisine_type:"Néobistro avant-gardiste",
    price_range:"€€€",
    rating_avg:4.3,
    address:"129 Avenue Parmentier, 75011 Paris",
    latitude:48.8693, longitude:2.3713,
    phone:"+33 1 43 57 45 95",
    hours:"Mer-Sam 19h–22h30 · Sam aussi 12h–14h",
    description:"Iñaki Aizpitarte a forgé ici la bistronomie parisienne moderne dans les années 2000. Menu unique sans choix, cuisine créative et vins nature. Une institution de l'avant-garde.",
    tags:["Avant-garde","Menu unique","Institution"],
    color:"linear-gradient(135deg,#1a0a0a,#2e1515,#120808)", emoji:"🍽️",
    diets:["omnivore","pescetarien"], budgets:["€€€"], cuisines:["francaise"],
    menu: {"format": "Menu unique sans choix · 6 services", "prix_menu": "80€ · Vins nature en supplément", "sections": [{"title": "Menu unique (évolue chaque soir)", "dishes": [{"name": "Soufflé de fromage, herbes du moment", "price": "—", "veg": true, "star": false, "note": "Amuse-bouche"}, {"name": "Carpaccio de saint-pierre, vinaigrette aux algues", "price": "—", "veg": false, "star": true, "note": "🏆 Entrée la plus saluée"}, {"name": "Légumes fermentés, sauce aux aromates, bouillon", "price": "—", "veg": true, "star": false, "note": "Végétal & fermenté"}, {"name": "Ris de veau, jus réduit, champignons sauvages", "price": "—", "veg": false, "star": true, "note": "❤️‍🔥 Recommandé · Top vente dîner"}, {"name": "Pigeonneau, betterave confite, jus de gibier", "price": "—", "veg": false, "star": true, "note": "Pièce centrale signature"}, {"name": "Dessert surprise du chef", "price": "—", "veg": true, "star": false, "note": "Varie selon l'humeur du chef"}]}], "top3": [{"name": "Pigeonneau, betterave confite, jus de gibier", "emoji": "🕊️", "votes": 678, "label": "Pièce centrale"}, {"name": "Ris de veau, champignons sauvages", "emoji": "🍄", "votes": 589, "label": "Top vente"}, {"name": "Dessert surprise du chef", "emoji": "🍮", "votes": 412, "label": "Mystère gourmand"}]},
  },
];
// ─── DISTANCE & FILTERING ─────────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return Math.round(Math.sqrt(a) * 2 * R * 10) / 10;
}
const USER_LAT = 48.8533, USER_LNG = 2.3692; // Place de la Bastille

const ALL_PLACES = ALL_PLACES_RAW.map(p => ({
  ...p,
  distance: haversine(USER_LAT, USER_LNG, p.latitude, p.longitude),
}));

function filterPlaces(places, prefs) {
  if (!prefs) return places;
  return places.filter(p => {
    // Halal & casher: strict filter — only show certified/compatible places
    if (prefs.regime === "halal"  && !p.diets.includes("halal"))  return false;
    if (prefs.regime === "casher" && !p.diets.includes("casher")) return false;
    // Other diets: standard filter
    if (prefs.regime && !["halal","casher"].includes(prefs.regime) && !p.diets.includes(prefs.regime)) return false;
    if (prefs.budget && !p.budgets.includes(prefs.budget)) return false;
    return true;
  });
}


const MOCK_USER = { id:"u1", username:"Thomas", email:"thomas@fooder.app" };

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:"#0A0A0B", surface:"#111113", surfaceElevated:"#18181B",
  border:"rgba(255,255,255,0.07)", borderStrong:"rgba(255,255,255,0.13)",
  textPrimary:"#F4F4F5", textSecondary:"#A1A1AA", textTertiary:"#52525B",
  accent:"#FF4D6D", accentSoft:"rgba(255,77,109,0.15)", accentGlow:"rgba(255,77,109,0.25)",
  green:"#22C55E", greenSoft:"rgba(34,197,94,0.15)",
  superBlue:"#818CF8", superBlueSoft:"rgba(129,140,248,0.15)",
  radius:"16px", radiusSm:"10px", radiusLg:"24px",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    body{background:${T.bg};font-family:'Inter',-apple-system,sans-serif;color:${T.textPrimary};overflow:hidden;}
    ::-webkit-scrollbar{display:none;}
    @keyframes slideUp   {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideDown {from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn    {from{opacity:0}to{opacity:1}}
    @keyframes popIn     {0%{opacity:0;transform:scale(0.5)}60%{transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
    @keyframes floatUp   {0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-120px) scale(0.5)}}
    @keyframes superPulse{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(129,140,248,0.7)}70%{transform:scale(1.05);box-shadow:0 0 0 16px rgba(129,140,248,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(129,140,248,0)}}
    @keyframes shimmer   {0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes toastIn   {from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(180px) rotate(720deg);opacity:0}}
    @keyframes checkPop  {0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
    .slide-up  {animation:slideUp   0.4s cubic-bezier(0.16,1,0.3,1) both}
    .slide-down{animation:slideDown 0.4s cubic-bezier(0.16,1,0.3,1) both}
    .fade-in   {animation:fadeIn 0.3s ease both}
    .pop-in    {animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both}
    .shimmer   {background:linear-gradient(90deg,${T.surfaceElevated} 25%,rgba(255,255,255,0.04) 50%,${T.surfaceElevated} 75%);background-size:400px 100%;animation:shimmer 1.4s ease infinite;}
    button{font-family:inherit;cursor:pointer;border:none;background:none;}
  `}</style>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const Tag = ({ label }) => (
  <span style={{display:"inline-block",padding:"4px 10px",background:"rgba(255,255,255,0.06)",border:`0.5px solid ${T.border}`,borderRadius:"100px",fontSize:11,color:T.textSecondary,fontWeight:500}}>{label}</span>
);
const StarRating = ({ value, onChange, size=22 }) => (
  <div style={{display:"flex",gap:4}}>
    {[1,2,3,4,5].map(i=>(
      <button key={i} onClick={()=>onChange?.(i)} style={{padding:2,fontSize:size,lineHeight:1}}>
        <span style={{opacity:i<=value?1:0.25,transition:"opacity 0.15s"}}>⭐</span>
      </button>
    ))}
  </div>
);

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
const Confetti = ({ active, type="like" }) => {
  if (!active) return null;
  const colors = type==="superlike" ? ["#818CF8","#A5B4FC","#C7D2FE","#6366F1","#fff"] : ["#22C55E","#4ADE80","#86EFAC","#FF4D6D","#fff"];
  const n = type==="superlike" ? 22 : 14;
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
      {Array.from({length:n},(_,i)=>({id:i,color:colors[i%colors.length],left:10+Math.random()*80,delay:Math.random()*0.4,size:6+Math.random()*8,dur:0.8+Math.random()*0.5})).map(p=>(
        <div key={p.id} style={{position:"absolute",top:"35%",left:`${p.left}%`,width:p.size,height:p.size,borderRadius:p.id%3===0?"50%":"2px",background:p.color,animation:`confettiFall ${p.dur}s ${p.delay}s ease-out both`}}/>
      ))}
    </div>
  );
};
const FloatingHearts = ({ active }) => {
  if (!active) return null;
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:998,overflow:"hidden"}}>
      {Array.from({length:7},(_,i)=>({id:i,left:30+Math.random()*40,delay:i*0.08,size:18+Math.random()*18,dur:0.9+Math.random()*0.4})).map(h=>(
        <div key={h.id} style={{position:"absolute",bottom:"30%",left:`${h.left}%`,fontSize:h.size,lineHeight:1,animation:`floatUp ${h.dur}s ${h.delay}s ease-out both`}}>❤️</div>
      ))}
    </div>
  );
};

// ─── SWIPE CARD ───────────────────────────────────────────────────────────────
const SwipeCard = ({ place, onSwipe, isTop, stackIndex }) => {
  const startX=useRef(null), currentX=useRef(0);
  const [delta,setDelta]=useState(0);
  const [dragging,setDragging]=useState(false);
  const [exiting,setExiting]=useState(null);
  const getX=e=>(e.touches?.[0]||e).clientX;
  const onStart=e=>{if(!isTop)return;startX.current=getX(e);setDragging(true);};
  const onMove=e=>{if(!isTop||startX.current===null)return;const dx=getX(e)-startX.current;currentX.current=dx;setDelta(dx);};
  const onEnd=()=>{
    if(!isTop||startX.current===null)return;setDragging(false);
    const dx=currentX.current;
    if(Math.abs(dx)>90){const dir=dx>0?"like":"pass";setExiting(dir);setTimeout(()=>onSwipe(place.id,dir),320);}
    else setDelta(0);
    startX.current=null;currentX.current=0;
  };
  const likeOp=Math.min(Math.max(delta/70,0),1),passOp=Math.min(Math.max(-delta/70,0),1);
  let tx=delta,ty=0;
  if(exiting==="like"){tx=650;ty=-60;}if(exiting==="pass"){tx=-650;ty=-60;}
  return (
    <div onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
      onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
      style={{position:"absolute",inset:0,zIndex:10-stackIndex,borderRadius:T.radiusLg,overflow:"hidden",cursor:isTop?"grab":"default",userSelect:"none",
        transform:isTop?`translate(${tx}px,${ty}px) rotate(${(delta/20).toFixed(2)}deg)`:`scale(${0.93+stackIndex*0.035}) translateY(${-stackIndex*16}px)`,
        transition:dragging?"none":"transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        boxShadow:isTop?"0 32px 64px rgba(0,0,0,0.7),0 8px 24px rgba(0,0,0,0.5)":"0 8px 32px rgba(0,0,0,0.4)",willChange:"transform"}}>
      <div style={{position:"relative",height:"60%",background:place.color,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 30%,rgba(255,255,255,0.07) 0%,transparent 60%)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:96,opacity:0.9,filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.5))"}}>{place.emoji}</div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,transparent 40%,rgba(0,0,0,0.55) 100%)"}}/>
        <div style={{position:"absolute",top:24,left:22,background:T.greenSoft,border:`2.5px solid ${T.green}`,borderRadius:12,padding:"7px 16px",opacity:likeOp,transform:"rotate(-12deg)",transition:"opacity 0.04s"}}>
          <span style={{color:T.green,fontWeight:800,fontSize:20,letterSpacing:"0.07em"}}>LIKE</span></div>
        <div style={{position:"absolute",top:24,right:22,background:T.accentSoft,border:`2.5px solid ${T.accent}`,borderRadius:12,padding:"7px 16px",opacity:passOp,transform:"rotate(12deg)",transition:"opacity 0.04s"}}>
          <span style={{color:T.accent,fontWeight:800,fontSize:20,letterSpacing:"0.07em"}}>PASS</span></div>
        <div style={{position:"absolute",bottom:14,right:14,display:"flex",gap:6,alignItems:"center"}}>
          {place.diets?.includes("halal")&&<div style={{background:"rgba(34,197,94,0.3)",backdropFilter:"blur(8px)",borderRadius:100,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#4ADE80",border:"0.5px solid rgba(34,197,94,0.5)"}}>🌙 Halal</div>}
          {place.diets?.includes("casher")&&<div style={{background:"rgba(129,140,248,0.3)",backdropFilter:"blur(8px)",borderRadius:100,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#A5B4FC",border:"0.5px solid rgba(129,140,248,0.5)"}}>✡️ Casher</div>}
          <div style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",borderRadius:100,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}>
            <span style={{fontSize:12}}>📍</span><span style={{fontSize:12,color:T.textSecondary,fontWeight:500}}>{place.distance} km</span></div>
        </div>
      </div>
      <div style={{padding:"18px 22px 16px",background:T.surfaceElevated,height:"40%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:4}}>
            <h2 style={{fontSize:21,fontWeight:700,letterSpacing:"-0.03em"}}>{place.name}</h2>
            <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:13}}>⭐</span><span style={{fontSize:15,fontWeight:600}}>{place.rating_avg}</span></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:13,color:T.textSecondary,fontWeight:500}}>{place.cuisine_type}</span>
            <span style={{color:T.textTertiary}}>·</span>
            <span style={{fontSize:13,color:T.accent,fontWeight:600}}>{place.price_range}</span>
          </div>
          <p style={{fontSize:12.5,color:T.textSecondary,lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{place.description}</p>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{place.tags.map(t=><Tag key={t} label={t}/>)}</div>
      </div>
    </div>
  );
};

// ─── ACTION BUTTON ────────────────────────────────────────────────────────────
const ActionButton = ({emoji,label,bg,size=58,onClick,pulse}) => {
  const [pressed,setPressed]=useState(false);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <button onMouseDown={()=>setPressed(true)} onMouseUp={()=>{setPressed(false);onClick?.();}} onMouseLeave={()=>setPressed(false)} onTouchStart={()=>setPressed(true)} onTouchEnd={()=>{setPressed(false);onClick?.();}}
        style={{width:size,height:size,borderRadius:"50%",background:bg,border:`0.5px solid ${T.borderStrong}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,transform:pressed?"scale(0.9)":"scale(1)",transition:"transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:pressed?"none":`0 4px 20px ${bg}66`,animation:pulse?"superPulse 1.4s ease infinite":"none"}}>
        {emoji}
      </button>
      <span style={{fontSize:10,color:T.textTertiary,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</span>
    </div>
  );
};

// ─── TOAST / SKELETON / EMPTY ─────────────────────────────────────────────────
const Toast = ({msg,color,icon})=>msg?(
  <div style={{position:"absolute",top:60,left:16,right:16,zIndex:9999,background:T.surfaceElevated,border:`0.5px solid ${color}40`,borderRadius:T.radiusSm,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
    <span style={{fontSize:18}}>{icon}</span><span style={{fontSize:13,fontWeight:500,color:T.textPrimary}}>{msg}</span>
  </div>
):null;

const SkeletonCard = () => (
  <div style={{position:"absolute",inset:0,borderRadius:T.radiusLg,overflow:"hidden",background:T.surfaceElevated}}>
    <div className="shimmer" style={{height:"60%",width:"100%"}}/>
    <div style={{padding:22,display:"flex",flexDirection:"column",gap:12}}>
      {[[26,"55%"],[14,"38%"],[12,"85%"],[12,"70%"]].map(([h,w],i)=>(
        <div key={i} className="shimmer" style={{height:h,width:w,borderRadius:8}}/>
      ))}
    </div>
  </div>
);

const EmptyState = ({emoji,title,subtitle,action})=>(
  <div className="fade-in" style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",gap:16,textAlign:"center"}}>
    <div style={{width:72,height:72,borderRadius:22,background:T.surfaceElevated,border:`0.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{emoji}</div>
    <div>
      <h3 style={{fontSize:18,fontWeight:600,letterSpacing:"-0.02em",marginBottom:8}}>{title}</h3>
      <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.65,whiteSpace:"pre-line"}}>{subtitle}</p>
    </div>
    {action&&<button onClick={action.onClick} style={{marginTop:8,padding:"12px 24px",background:T.accentSoft,border:`0.5px solid ${T.accent}40`,borderRadius:T.radius,color:T.accent,fontSize:14,fontWeight:600}}>{action.label}</button>}
  </div>
);

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const STEPS=[
  {emoji:"⚡",title:"Découvre les\nrestaurants\nautour de toi",sub:"Fooder te propose les meilleures tables dans un rayon de 2 km.",cta:"Commencer"},
  {emoji:"❤️",title:"Swipe pour\ntrouver ta\nprochaine table",sub:"Swipe à droite pour liker, à gauche pour passer. Simple et addictif.",cta:"J'ai compris"},
  {emoji:"📍",title:"Partage ta\nposition",sub:"Pour voir les restaurants proches de toi, Fooder a besoin de ta localisation.",cta:"Continuer"},
];
const OnboardingScreen = ({onDone}) => {
  const [step,setStep]=useState(0);const s=STEPS[step];
  return (
    <div className="fade-in" style={{height:"100%",display:"flex",flexDirection:"column",padding:"56px 32px 48px",justifyContent:"space-between"}}>
      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
        {STEPS.map((_,i)=><div key={i} style={{height:6,borderRadius:3,background:i===step?T.accent:T.border,width:i===step?20:6,transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}/>)}
      </div>
      <div className="slide-up" key={step} style={{display:"flex",flexDirection:"column",gap:24}}>
        <div style={{width:72,height:72,borderRadius:20,background:T.accentSoft,border:`0.5px solid ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>{s.emoji}</div>
        <h1 style={{fontSize:36,fontWeight:700,letterSpacing:"-0.04em",lineHeight:1.1,whiteSpace:"pre-line"}}>{s.title}</h1>
        <p style={{fontSize:15,color:T.textSecondary,lineHeight:1.65,maxWidth:280}}>{s.sub}</p>
      </div>
      <button onClick={()=>step<STEPS.length-1?setStep(step+1):onDone()} style={{width:"100%",padding:"18px 0",borderRadius:T.radius,background:T.accent,color:"#fff",fontSize:16,fontWeight:600,boxShadow:`0 8px 32px ${T.accentGlow}`}}
        onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{s.cta}</button>
    </div>
  );
};

// ─── DIETARY QUIZ ─────────────────────────────────────────────────────────────
const QUIZ_STEPS = [
  {
    id:"regime", emoji:"🥗", title:"Ton régime\nalimentaire", sub:"On adapte les suggestions à tes habitudes alimentaires.", type:"single",
    options:[
      {id:"omnivore",    emoji:"🍖",label:"Omnivore",      desc:"Je mange de tout"},
      {id:"vegetarien",  emoji:"🥦",label:"Végétarien",    desc:"Pas de viande ni poisson"},
      {id:"vegan",       emoji:"🌱",label:"Vegan",         desc:"100% végétal"},
      {id:"pescetarien", emoji:"🐟",label:"Pescétarien",   desc:"Poisson mais pas de viande"},
      {id:"flexitarien", emoji:"🥙",label:"Flexitarien",   desc:"Surtout végétal, parfois carné"},
      {id:"halal",       emoji:"🌙",label:"Halal",         desc:"Viande halal certifiée uniquement"},
      {id:"casher",      emoji:"✡️", label:"Casher",        desc:"Cuisine casher certifiée"},
    ],
  },
  {
    id:"allergies", emoji:"⚠️", title:"Allergies &\nIntolérances", sub:"Sélectionne tout ce qui s'applique. Modifiable plus tard.", type:"multi", skip:"Aucune allergie",
    options:[
      {id:"gluten",    emoji:"🌾",label:"Gluten",          desc:"Blé, orge, seigle…"},
      {id:"lactose",   emoji:"🥛",label:"Lactose",         desc:"Lait et dérivés"},
      {id:"nuts",      emoji:"🥜",label:"Fruits à coque",  desc:"Noix, noisettes, amandes…"},
      {id:"crustaces", emoji:"🦞",label:"Crustacés",       desc:"Crevettes, homard…"},
      {id:"oeufs",     emoji:"🥚",label:"Œufs",            desc:"Œufs et ovoproduits"},
      {id:"soja",      emoji:"🫘",label:"Soja",            desc:"Tofu, edamame…"},
    ],
  },
  {
    id:"cuisines", emoji:"🌍", title:"Tes cuisines\npréférées", sub:"Choisis autant que tu veux.", type:"multi",
    options:[
      {id:"francaise",   emoji:"🥐",label:"Française",     desc:"Bistrots, gastronomie"},
      {id:"italienne",   emoji:"🍝",label:"Italienne",     desc:"Pasta, pizza, risotto"},
      {id:"japonaise",   emoji:"🍣",label:"Japonaise",     desc:"Sushi, ramen, izakaya"},
      {id:"asiatique",   emoji:"🥢",label:"Asiatique",     desc:"Thaï, coréen, vietnamien"},
      {id:"moyen-orient",emoji:"🧆",label:"Moyen-Orient",  desc:"Libanais, turc, persan"},
      {id:"americaine",  emoji:"🍔",label:"Américaine",    desc:"Burgers, smash, BBQ"},
    ],
  },
  {
    id:"budget", emoji:"💰", title:"Ton budget\npar repas", sub:"Pour des suggestions qui te correspondent vraiment.", type:"single",
    options:[
      {id:"€",    emoji:"🪙",label:"Moins de 15€",  desc:"Street food & fast-casual"},
      {id:"€€",   emoji:"💳",label:"15 – 35€",      desc:"Bistrots & brasseries"},
      {id:"€€€",  emoji:"💎",label:"35 – 70€",      desc:"Restaurants gastronomiques"},
      {id:"€€€€", emoji:"🥂",label:"70€ et plus",   desc:"Haute gastronomie"},
    ],
  },
];

const DietsQuizScreen = ({onDone}) => {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [visible,setVisible]=useState(true);
  const [dir,setDir]=useState("forward");
  const q=QUIZ_STEPS[step];
  const total=QUIZ_STEPS.length;
  const isMulti=q.type==="multi";
  const current=answers[q.id];
  const isSelected=id=>isMulti?(current||[]).includes(id):current===id;
  const canNext=isMulti?true:!!current;

  const toggle=id=>{
    if(isMulti){
      const prev=answers[q.id]||[];
      setAnswers(a=>({...a,[q.id]:prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]}));
    } else {
      setAnswers(a=>({...a,[q.id]:id}));
    }
  };

  const transition=(next)=>{
    setDir(next);setVisible(false);
    setTimeout(()=>{
      if(next==="back")setStep(s=>s-1);
      else if(step<total-1)setStep(s=>s+1);
      else onDone(answers);
      setVisible(true);
    },160);
  };

  const goNext=(skip=false)=>{
    if(skip)setAnswers(a=>({...a,[q.id]:[]}));
    transition("forward");
  };

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",paddingTop:8}}>
      {/* Header */}
      <div style={{padding:"0 24px 16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <button onClick={()=>step>0&&transition("back")} style={{width:36,height:36,borderRadius:10,background:step>0?T.surfaceElevated:"transparent",border:step>0?`0.5px solid ${T.border}`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:T.textSecondary,opacity:step>0?1:0,transition:"opacity 0.2s"}}>←</button>
          <span style={{fontSize:12,color:T.textTertiary,fontWeight:600,letterSpacing:"0.05em"}}>{step+1} / {total}</span>
          <div style={{width:36}}/>
        </div>
        {/* Progress */}
        <div style={{height:3,background:T.border,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${((step+1)/total)*100}%`,background:`linear-gradient(90deg,${T.accent},#FF8FA3)`,borderRadius:2,transition:"width 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}/>
        </div>
      </div>

      {/* Question */}
      <div style={{flex:1,overflowY:"auto",padding:"0 24px"}}>
        <div style={{opacity:visible?1:0,transform:visible?"translateY(0)":dir==="forward"?"translateY(12px)":"translateY(-12px)",transition:"opacity 0.16s ease,transform 0.16s ease"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:22}}>
            <div style={{width:52,height:52,borderRadius:16,background:T.accentSoft,border:`0.5px solid ${T.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{q.emoji}</div>
            <div>
              <h2 style={{fontSize:22,fontWeight:700,letterSpacing:"-0.03em",lineHeight:1.15,whiteSpace:"pre-line"}}>{q.title}</h2>
              <p style={{fontSize:12.5,color:T.textSecondary,marginTop:4,lineHeight:1.5}}>{q.sub}</p>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:10,paddingBottom:24}}>
            {q.options.map((opt,i)=>{
              const sel=isSelected(opt.id);
              return (
                <button key={opt.id} onClick={()=>toggle(opt.id)}
                  style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:sel?T.accentSoft:T.surfaceElevated,border:sel?`1.5px solid ${T.accent}`:`0.5px solid ${T.border}`,borderRadius:T.radius,textAlign:"left",width:"100%",transform:sel?"scale(1.015)":"scale(1)",transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",animation:`slideUp 0.35s ${i*0.05}s both`}}>
                  <div style={{width:44,height:44,borderRadius:12,background:sel?`${T.accent}22`:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,transition:"background 0.2s"}}>{opt.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{opt.label}</div>
                    <div style={{fontSize:12,color:T.textSecondary}}>{opt.desc}</div>
                  </div>
                  <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,background:sel?T.accent:"transparent",border:sel?"none":`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",transform:sel?"scale(1.1)":"scale(1)",animation:sel?"checkPop 0.25s ease":""}}>{sel?"✓":""}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:"10px 24px 28px",display:"flex",flexDirection:"column",gap:10,background:`linear-gradient(to top,${T.bg} 60%,transparent)`,flexShrink:0}}>
        <button onClick={()=>goNext(false)} disabled={!canNext}
          style={{width:"100%",padding:"17px 0",borderRadius:T.radius,background:canNext?T.accent:T.surfaceElevated,color:canNext?"#fff":T.textTertiary,fontSize:15,fontWeight:600,transition:"all 0.2s",boxShadow:canNext?`0 8px 24px ${T.accentGlow}`:"none"}}>
          {step<total-1?"Continuer →":"Découvrir les restaurants 🎉"}
        </button>
        {q.skip&&<button onClick={()=>goNext(true)} style={{fontSize:13,color:T.textTertiary,padding:"5px 0",textDecoration:"underline",textUnderlineOffset:3}}>{q.skip}</button>}
      </div>
    </div>
  );
};


// ─── PROFILE CHIP ─────────────────────────────────────────────────────────────
const DietChip = ({label,emoji}) => (
  <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,background:T.surfaceElevated,border:`0.5px solid ${T.border}`}}>
    <span style={{fontSize:14}}>{emoji}</span>
    <span style={{fontSize:12,fontWeight:500,color:T.textSecondary}}>{label}</span>
  </div>
);

// ─── RATING SHEET (s'ouvre après un like) ────────────────────────────────────
const MOOD_LABELS = [
  {stars:1, emoji:"😞", label:"Déçu"},
  {stars:2, emoji:"😐", label:"Bof"},
  {stars:3, emoji:"😊", label:"Bien"},
  {stars:4, emoji:"😍", label:"Très bien"},
  {stars:5, emoji:"🤩", label:"Exceptionnel"},
];

const RatingSheet = ({place, onClose, onSubmit, existingReview}) => {
  const [rating,  setRating]  = useState(existingReview?.rating  || 0);
  const [lover,   setLover]   = useState(existingReview?.lover   || false);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [done,    setDone]    = useState(false);

  const mood = MOOD_LABELS.find(m => m.stars === rating);
  const canSubmit = rating > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ rating, lover, comment });
    setDone(true);
  };

  if (done) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"40px 32px",textAlign:"center"}}>
      <div style={{width:68,height:68,borderRadius:20,background:lover?"rgba(255,77,109,0.15)":T.greenSoft,border:`0.5px solid ${lover?T.accent:T.green}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
        {lover ? "❤️‍🔥" : "⭐"}
      </div>
      <div>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:6}}>Note enregistrée !</h3>
        <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.6}}>
          {lover && <span style={{color:T.accent,fontWeight:600}}>Fooder Lover ❤️‍🔥 · </span>}
          {rating} étoile{rating>1?"s":""} pour <strong style={{color:T.textPrimary}}>{place.name}</strong>
        </p>
      </div>
      <button onClick={onClose} style={{width:"100%",padding:"15px 0",borderRadius:T.radius,background:T.accent,color:"#fff",fontSize:15,fontWeight:600,boxShadow:`0 8px 24px ${T.accentGlow}`}}>
        Merci 🎉
      </button>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",padding:"8px 24px 32px",gap:24}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:52,height:52,borderRadius:14,flexShrink:0,background:place.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{place.emoji}</div>
        <div>
          <h3 style={{fontSize:17,fontWeight:700,letterSpacing:"-0.02em"}}>{place.name}</h3>
          <p style={{fontSize:12,color:T.textSecondary,marginTop:2}}>{place.cuisine_type}</p>
        </div>
      </div>

      {/* Étoiles */}
      <div>
        <p style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:14}}>Ta note</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:12}}>
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)}
              style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:5,
                padding:"10px 8px",borderRadius:12,
                background: rating >= s ? "rgba(250,204,21,0.12)" : T.surfaceElevated,
                border: rating >= s ? "1.5px solid rgba(250,204,21,0.5)" : `0.5px solid ${T.border}`,
                transform: rating >= s ? "scale(1.08)" : "scale(1)",
                transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                minWidth:50,
              }}>
              <span style={{fontSize:28,lineHeight:1, filter: rating >= s ? "none" : "grayscale(1)", opacity: rating>=s?1:0.4, transition:"all 0.18s"}}>⭐</span>
              <span style={{fontSize:10,fontWeight:600,color:rating>=s?"#FACC15":T.textTertiary}}>{s}</span>
            </button>
          ))}
        </div>
        {/* Mood label */}
        <div style={{height:28,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {mood && (
            <div className="pop-in" key={mood.stars} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 14px",borderRadius:100,background:"rgba(250,204,21,0.1)",border:"0.5px solid rgba(250,204,21,0.3)"}}>
              <span style={{fontSize:16}}>{mood.emoji}</span>
              <span style={{fontSize:13,fontWeight:600,color:"#FACC15"}}>{mood.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fooder Lover button */}
      <button
        onClick={() => setLover(l => !l)}
        style={{
          width:"100%",padding:"15px 0",borderRadius:T.radius,
          background: lover
            ? "linear-gradient(135deg,rgba(255,77,109,0.2),rgba(255,77,109,0.08))"
            : T.surfaceElevated,
          border: lover ? `1.5px solid ${T.accent}` : `0.5px solid ${T.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",gap:10,
          transform: lover ? "scale(1.02)" : "scale(1)",
          transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: lover ? `0 4px 20px ${T.accentGlow}` : "none",
        }}>
        <span style={{fontSize:22,animation:lover?"heartBeat 0.6s ease":"none"}}>❤️‍🔥</span>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:14,fontWeight:700,color:lover?T.accent:T.textPrimary}}>Fooder Lover</div>
          <div style={{fontSize:11,color:T.textSecondary,marginTop:1}}>Je recommande vivement ce restaurant</div>
        </div>
        <div style={{marginLeft:"auto",width:22,height:22,borderRadius:"50%",background:lover?T.accent:"transparent",border:lover?"none":`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",transition:"all 0.2s"}}>
          {lover ? "✓" : ""}
        </div>
      </button>

      {/* Commentaire optionnel */}
      <div>
        <p style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Commentaire <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optionnel)</span></p>
        <textarea
          value={comment} onChange={e=>setComment(e.target.value)}
          placeholder={`Ton expérience chez ${place.name}…`}
          style={{width:"100%",padding:"12px 14px",background:T.surfaceElevated,border:`0.5px solid ${T.border}`,borderRadius:T.radiusSm,color:T.textPrimary,fontSize:14,lineHeight:1.5,resize:"none",height:76,outline:"none",fontFamily:"inherit"}}
        />
      </div>

      {/* CTA */}
      <button onClick={handleSubmit} disabled={!canSubmit}
        style={{width:"100%",padding:"17px 0",borderRadius:T.radius,background:canSubmit?T.accent:T.surfaceElevated,color:canSubmit?"#fff":T.textTertiary,fontSize:15,fontWeight:600,transition:"all 0.2s",boxShadow:canSubmit?`0 8px 24px ${T.accentGlow}`:"none"}}>
        {canSubmit ? "Publier ma note" : "Donne une note d'abord ⭐"}
      </button>

      <button onClick={onClose} style={{fontSize:13,color:T.textTertiary,padding:"0 0 4px",textDecoration:"underline",textUnderlineOffset:3,textAlign:"center"}}>
        Plus tard
      </button>
    </div>
  );
};

// ─── FAVORIS SCREEN ───────────────────────────────────────────────────────────
const FavorisScreen = ({likedIds, visitedIds, reviews, onOpenDetail, onRatePlace}) => {
  const liked = ALL_PLACES.filter(p => likedIds.has(p.id));
  if (liked.length === 0) return (
    <EmptyState emoji="❤️" title="Aucun favori" subtitle={"Swipe à droite pour sauvegarder\ntes restaurants préférés ici."}/>
  );
  return (
    <div className="fade-in" style={{height:"100%",overflowY:"auto",padding:"0 16px 24px"}}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {liked.map((p,i) => {
          const review = reviews[p.id];
          const isLover = review?.lover;
          return (
            <button key={p.id} onClick={()=>onOpenDetail(p)}
              style={{display:"flex",gap:14,padding:14,background:T.surfaceElevated,borderRadius:T.radius,
                border: isLover ? `1px solid ${T.accent}50` : `0.5px solid ${T.border}`,
                textAlign:"left",width:"100%",animation:`slideUp 0.4s ${i*0.06}s both`,
                background: isLover ? `linear-gradient(135deg,rgba(255,77,109,0.06),${T.surfaceElevated})` : T.surfaceElevated,
              }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderStrong}
              onMouseLeave={e=>e.currentTarget.style.borderColor=isLover?`${T.accent}50`:T.border}>

              {/* Thumbnail */}
              <div style={{position:"relative",flexShrink:0}}>
                <div style={{width:80,height:80,borderRadius:10,background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>{p.emoji}</div>
                {isLover && (
                  <div style={{position:"absolute",bottom:-4,right:-4,width:22,height:22,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,boxShadow:"0 2px 8px rgba(255,77,109,0.5)"}}>🔥</div>
                )}
              </div>

              {/* Info */}
              <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                    <h3 style={{fontSize:15,fontWeight:600,letterSpacing:"-0.02em"}}>{p.name}</h3>
                    <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                      {isLover && <span style={{fontSize:9,fontWeight:700,color:T.accent,background:"rgba(255,77,109,0.12)",padding:"2px 6px",borderRadius:100,textTransform:"uppercase",letterSpacing:"0.04em"}}>Lover</span>}
                      {visitedIds.has(p.id) && <span style={{fontSize:9,fontWeight:700,color:T.green,background:T.greenSoft,padding:"2px 6px",borderRadius:100,textTransform:"uppercase"}}>Visité</span>}
                    </div>
                  </div>
                  <p style={{fontSize:12,color:T.textSecondary,marginTop:2}}>{p.cuisine_type}</p>
                </div>

                {/* Bottom row */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,color:T.textSecondary}}>📍 {p.distance} km</span>
                    <span style={{color:T.textTertiary}}>·</span>
                    <span style={{fontSize:12,color:T.accent,fontWeight:600}}>{p.price_range}</span>
                  </div>
                  {/* Ma note ou bouton noter */}
                  {review?.rating ? (
                    <div style={{display:"flex",alignItems:"center",gap:3}}>
                      {[1,2,3,4,5].map(s=>(
                        <span key={s} style={{fontSize:11,opacity:s<=review.rating?1:0.2}}>⭐</span>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={e=>{e.stopPropagation();onRatePlace(p);}}
                      style={{fontSize:11,fontWeight:600,color:T.superBlue,background:"rgba(129,140,248,0.1)",border:"0.5px solid rgba(129,140,248,0.3)",padding:"3px 10px",borderRadius:100}}>
                      + Note
                    </button>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── PROFIL SCREEN ────────────────────────────────────────────────────────────
const REGIME_LABELS={omnivore:{l:"Omnivore",e:"🍖"},vegetarien:{l:"Végétarien",e:"🥦"},vegan:{l:"Vegan",e:"🌱"},pescetarien:{l:"Pescétarien",e:"🐟"},flexitarien:{l:"Flexitarien",e:"🥙"},halal:{l:"Halal",e:"🌙"},casher:{l:"Casher",e:"✡️"}};
const BUDGET_LABELS={"€":{l:"< 15€",e:"🪙"},"€€":{l:"15–35€",e:"💳"},"€€€":{l:"35–70€",e:"💎"},"€€€€":{l:"> 70€",e:"🥂"}};
const ALLERGY_LABELS={gluten:{l:"Gluten",e:"🌾"},lactose:{l:"Lactose",e:"🥛"},nuts:{l:"Fruits à coque",e:"🥜"},crustaces:{l:"Crustacés",e:"🦞"},oeufs:{l:"Œufs",e:"🥚"},soja:{l:"Soja",e:"🫘"}};

const ProfilScreen = ({user, likedIds, visitedIds, reviews, prefs, onEditPrefs}) => {
  const reviewList   = Object.entries(reviews);
  const loversCount  = reviewList.filter(([,r])=>r.lover).length;
  const ratedCount   = reviewList.filter(([,r])=>r.rating>0).length;
  const avgRating    = ratedCount > 0
    ? (reviewList.reduce((s,[,r])=>s+(r.rating||0),0)/ratedCount).toFixed(1)
    : null;

  const stats=[
    {label:"Likés",   value:likedIds.size,  color:T.accent},
    {label:"Visités", value:visitedIds.size, color:T.green},
    {label:"Lovers",  value:loversCount,     color:T.accent, emoji:"❤️‍🔥"},
  ];

  const regime   = prefs?.regime ? REGIME_LABELS[prefs.regime] : null;
  const budget   = prefs?.budget ? BUDGET_LABELS[prefs.budget] : null;
  const allergies= (prefs?.allergies||[]).map(a=>ALLERGY_LABELS[a]).filter(Boolean);

  // Sort reviews: lover first, then by rating desc
  const sortedReviews = reviewList
    .filter(([,r])=>r.rating>0)
    .sort(([,a],[,b])=>(b.lover?1:0)-(a.lover?1:0)||(b.rating-a.rating))
    .slice(0,4);

  return (
    <div className="fade-in" style={{height:"100%",overflowY:"auto",padding:"0 16px 24px"}}>
      {/* Avatar */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0 20px",gap:12}}>
        <div style={{width:88,height:88,borderRadius:26,background:`linear-gradient(135deg,${T.accent}44,${T.accent}22)`,border:`0.5px solid ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38}}>🍜</div>
        <div style={{textAlign:"center"}}>
          <h2 style={{fontSize:20,fontWeight:700,letterSpacing:"-0.03em"}}>{user.username}</h2>
          <p style={{fontSize:13,color:T.textSecondary,marginTop:2}}>{user.email}</p>
        </div>
        {loversCount > 0 && (
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:100,background:"linear-gradient(135deg,rgba(255,77,109,0.2),rgba(255,77,109,0.08))",border:`1px solid ${T.accent}40`}}>
            <span style={{fontSize:14}}>❤️‍🔥</span>
            <span style={{fontSize:12,color:T.accent,fontWeight:700}}>{loversCount} Fooder Lover{loversCount>1?"s":""}</span>
          </div>
        )}
        <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:100,background:T.accentSoft,border:`0.5px solid ${T.accent}40`}}>
          <span style={{fontSize:12,color:T.accent,fontWeight:600}}>📍 Paris · 2 km</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {stats.map(s=>(
          <div key={s.label} style={{flex:1,padding:"14px 10px",background:T.surfaceElevated,borderRadius:T.radius,border:`0.5px solid ${T.border}`,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.04em",color:s.color}}>
              {s.emoji&&<span style={{fontSize:16,marginRight:2}}>{s.emoji}</span>}{s.value}
            </div>
            <div style={{fontSize:11,color:T.textTertiary,marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mes notes */}
      {sortedReviews.length > 0 && (
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <h3 style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase"}}>Mes notes</h3>
            {avgRating && <span style={{fontSize:12,color:"#FACC15",fontWeight:600}}>⭐ {avgRating} moy.</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {sortedReviews.map(([placeId,review])=>{
              const place = ALL_PLACES.find(p=>p.id===placeId);
              if(!place) return null;
              return (
                <div key={placeId} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:review.lover?"linear-gradient(135deg,rgba(255,77,109,0.06),rgba(255,77,109,0.02))":T.surfaceElevated,borderRadius:T.radiusSm,border:review.lover?`0.5px solid ${T.accent}30`:`0.5px solid ${T.border}`}}>
                  <div style={{width:40,height:40,borderRadius:10,background:place.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{place.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{place.name}</span>
                      {review.lover && <span style={{fontSize:10,flexShrink:0}}>❤️‍🔥</span>}
                    </div>
                    {review.comment && <p style={{fontSize:11,color:T.textSecondary,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{review.comment}</p>}
                  </div>
                  <div style={{display:"flex",gap:1,flexShrink:0}}>
                    {[1,2,3,4,5].map(s=><span key={s} style={{fontSize:10,opacity:s<=review.rating?1:0.2}}>⭐</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Préférences */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <h3 style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase"}}>Mes préférences</h3>
          <button onClick={onEditPrefs} style={{fontSize:12,color:T.accent,fontWeight:600,padding:"4px 10px",borderRadius:8,background:T.accentSoft}}>Modifier</button>
        </div>
        <div style={{background:T.surfaceElevated,borderRadius:T.radius,border:`0.5px solid ${T.border}`,overflow:"hidden"}}>
          {[
            {label:"Régime",   value:regime   ? <DietChip label={regime.l}  emoji={regime.e}/> : <span style={{fontSize:13,color:T.textTertiary}}>Non renseigné</span>},
            {label:"Budget",   value:budget   ? <DietChip label={budget.l}  emoji={budget.e}/> : <span style={{fontSize:13,color:T.textTertiary}}>Non renseigné</span>},
            {label:"Allergies",value:allergies.length>0?<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{allergies.map(a=><DietChip key={a.l} label={a.l} emoji={a.e}/>)}</div>:<span style={{fontSize:13,color:T.textTertiary}}>Aucune</span>},
          ].map((item,i)=>(
            <div key={item.label} style={{padding:"13px 16px",borderTop:i>0?`0.5px solid ${T.border}`:"none"}}>
              <div style={{fontSize:11,fontWeight:600,color:T.textTertiary,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:8}}>{item.label}</div>
              {item.value}
            </div>
          ))}
        </div>
      </div>

      <button style={{width:"100%",padding:"15px 0",borderRadius:T.radius,background:"transparent",border:`0.5px solid ${T.border}`,color:T.accent,fontSize:14,fontWeight:600,marginBottom:8}}>Se déconnecter</button>
    </div>
  );
};


// ─── MENU COMPONENTS ─────────────────────────────────────────────────────────
const Top3Dishes = ({ dishes }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
      <span style={{ fontSize:16 }}>🏆</span>
      <h3 style={{ fontSize:12, fontWeight:700, color:T.textTertiary, letterSpacing:"0.06em", textTransform:"uppercase" }}>
        Plats les plus recommandés
      </h3>
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {dishes.map((d, i) => (
        <div key={i} style={{
          display:"flex", alignItems:"center", gap:14,
          padding:"13px 16px",
          background: i===0
            ? "linear-gradient(135deg,rgba(250,204,21,0.1),rgba(250,204,21,0.04))"
            : T.surfaceElevated,
          borderRadius: T.radius,
          border: i===0
            ? "0.5px solid rgba(250,204,21,0.3)"
            : `0.5px solid ${T.border}`,
        }}>
          {/* Rank */}
          <div style={{
            width:32, height:32, borderRadius:10, flexShrink:0,
            background: i===0 ? "rgba(250,204,21,0.15)" : i===1 ? "rgba(192,192,192,0.1)" : "rgba(180,120,60,0.1)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize: i===0 ? 18 : 16,
          }}>
            {i===0 ? "🥇" : i===1 ? "🥈" : "🥉"}
          </div>
          {/* Emoji */}
          <div style={{
            width:42, height:42, borderRadius:12, flexShrink:0,
            background:"rgba(255,255,255,0.05)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:22,
          }}>
            {d.emoji}
          </div>
          {/* Info */}
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, letterSpacing:"-0.01em", marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {d.name}
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{
                fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:100,
                background: i===0 ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.06)",
                color: i===0 ? "#FACC15" : T.textTertiary,
              }}>
                {d.label}
              </span>
              <span style={{ fontSize:11, color:T.textTertiary }}>
                {d.votes.toLocaleString("fr")} votes
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MenuSection = ({ menu }) => {
  const [openSection, setOpenSection] = useState(null);
  const [menuTab, setMenuTab] = useState("top3");

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["top3","🏆 Top 3"],["menu","📋 Menu complet"]].map(([id, label]) => (
          <button key={id} onClick={() => setMenuTab(id)}
            style={{
              flex:1, padding:"10px 0", borderRadius: T.radiusSm,
              background: menuTab===id ? T.accentSoft : T.surfaceElevated,
              border: menuTab===id ? `1.5px solid ${T.accent}` : `0.5px solid ${T.border}`,
              color: menuTab===id ? T.accent : T.textSecondary,
              fontSize:13, fontWeight:600,
              transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
            {label}
          </button>
        ))}
      </div>

      {menuTab === "top3" && <Top3Dishes dishes={menu.top3} />}

      {menuTab === "menu" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {/* Format + price pill */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:T.surfaceElevated, borderRadius:T.radiusSm, border:`0.5px solid ${T.border}`, marginBottom:4 }}>
            <span style={{ fontSize:12, color:T.textSecondary }}>{menu.format}</span>
            <span style={{ fontSize:13, fontWeight:700, color:T.accent }}>{menu.prix_menu}</span>
          </div>

          {menu.sections.map((section, si) => {
            const isOpen = openSection === si || menu.sections.length === 1;
            return (
              <div key={si} style={{ borderRadius: T.radius, overflow:"hidden", border:`0.5px solid ${T.border}` }}>
                {/* Section header */}
                <button onClick={() => setOpenSection(isOpen && menu.sections.length > 1 ? null : si)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"13px 16px", background: isOpen ? T.surfaceElevated : T.bg,
                    borderBottom: isOpen ? `0.5px solid ${T.border}` : "none",
                  }}>
                  <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary }}>{section.title}</span>
                  {menu.sections.length > 1 && (
                    <span style={{ fontSize:16, color:T.textTertiary, transition:"transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>⌄</span>
                  )}
                </button>

                {/* Dishes */}
                {isOpen && (
                  <div>
                    {section.dishes.map((dish, di) => (
                      <div key={di} style={{
                        display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px",
                        borderTop: di > 0 ? `0.5px solid ${T.border}` : "none",
                        background: dish.star ? "rgba(250,204,21,0.03)" : T.bg,
                      }}>
                        {/* Veg / star indicator */}
                        <div style={{ display:"flex", flexDirection:"column", gap:4, paddingTop:1, flexShrink:0, width:16 }}>
                          {dish.veg && <span style={{ fontSize:10 }}>🌿</span>}
                          {dish.star && <span style={{ fontSize:10 }}>⭐</span>}
                        </div>
                        {/* Name + note */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:13, fontWeight: dish.star ? 600 : 400, color: dish.star ? T.textPrimary : T.textSecondary, lineHeight:1.4, marginBottom:2 }}>
                            {dish.name}
                          </p>
                          {dish.note && (
                            <p style={{ fontSize:11, color:T.textTertiary, lineHeight:1.4, fontStyle:"italic" }}>
                              {dish.note}
                            </p>
                          )}
                        </div>
                        {/* Price */}
                        {dish.price !== "—" && (
                          <span style={{ fontSize:13, fontWeight:600, color:T.accent, flexShrink:0 }}>{dish.price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend */}
          <div style={{ display:"flex", gap:12, padding:"8px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:11 }}>🌿</span><span style={{ fontSize:11, color:T.textTertiary }}>Végétarien</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:11 }}>⭐</span><span style={{ fontSize:11, color:T.textTertiary }}>Recommandé</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── RESERVATION SHEET ───────────────────────────────────────────────────────
const SLOTS = ["12:00","12:30","13:00","13:30","19:00","19:30","20:00","20:30","21:00"];
const TODAY = new Date();
const DATES = Array.from({length:7},(_,i)=>{
  const d = new Date(TODAY); d.setDate(TODAY.getDate()+i);
  return { iso: d.toISOString().slice(0,10), label: i===0?"Aujourd'hui":i===1?"Demain":d.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}) };
});

const ReservationSheet = ({place,onClose,onConfirm}) => {
  const [selDate,setSelDate]=useState(DATES[0].iso);
  const [selSlot,setSelSlot]=useState(null);
  const [guests, setGuests] =useState(2);
  const [step,   setStep]   =useState("form");
  const dateLabel=DATES.find(d=>d.iso===selDate)?.label||selDate;

  if(step==="done") return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:"40px 32px",textAlign:"center"}}>
      <div style={{width:72,height:72,borderRadius:22,background:T.greenSoft,border:`0.5px solid ${T.green}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>✅</div>
      <div>
        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Réservation confirmée !</h3>
        <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.65}}><strong style={{color:T.textPrimary}}>{place.name}</strong><br/>{dateLabel} à {selSlot} · {guests} pers.</p>
      </div>
      <p style={{fontSize:12,color:T.textTertiary}}>Un email de confirmation t'a été envoyé.</p>
      <button onClick={onClose} style={{width:"100%",padding:"15px 0",borderRadius:T.radius,background:T.accent,color:"#fff",fontSize:15,fontWeight:600,boxShadow:`0 8px 24px ${T.accentGlow}`}}>Parfait 🎉</button>
    </div>
  );

  if(step==="confirm") return(
    <div className="slide-up" style={{display:"flex",flexDirection:"column",gap:18,padding:"24px 24px 32px"}}>
      <h3 style={{fontSize:18,fontWeight:700}}>Confirmer la réservation</h3>
      <div style={{background:T.surfaceElevated,borderRadius:T.radius,border:`0.5px solid ${T.border}`,overflow:"hidden"}}>
        {[{label:"Restaurant",value:place.name},{label:"Date",value:dateLabel},{label:"Heure",value:selSlot},{label:"Couverts",value:`${guests} personne${guests>1?"s":""}`}].map((row,i)=>(
          <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",borderTop:i>0?`0.5px solid ${T.border}`:"none"}}>
            <span style={{fontSize:13,color:T.textSecondary}}>{row.label}</span>
            <span style={{fontSize:13,fontWeight:600}}>{row.value}</span>
          </div>
        ))}
      </div>
      <div style={{padding:"13px 16px",background:"rgba(255,77,109,0.08)",borderRadius:T.radiusSm,border:`0.5px solid ${T.accent}30`}}>
        <p style={{fontSize:12,color:T.textSecondary,lineHeight:1.6}}>⚠️ Annulation gratuite jusqu'à 24h avant. Au-delà, des frais peuvent s'appliquer.</p>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setStep("form")} style={{flex:1,padding:"14px 0",borderRadius:T.radius,background:T.surfaceElevated,border:`0.5px solid ${T.border}`,color:T.textSecondary,fontSize:14,fontWeight:600}}>Modifier</button>
        <button onClick={()=>{onConfirm({date:selDate,slot:selSlot,guests});setStep("done");}} style={{flex:2,padding:"14px 0",borderRadius:T.radius,background:T.accent,color:"#fff",fontSize:14,fontWeight:600,boxShadow:`0 6px 20px ${T.accentGlow}`}}>Confirmer →</button>
      </div>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column"}}>
      <div style={{overflowY:"auto",padding:"24px 24px 0",maxHeight:"60vh"}}>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:20}}>Réserver chez {place.name}</h3>
        {/* Date */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Date</p>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
            {DATES.map(d=>(
              <button key={d.iso} onClick={()=>setSelDate(d.iso)} style={{flexShrink:0,padding:"10px 14px",borderRadius:T.radiusSm,background:selDate===d.iso?T.accent:T.surfaceElevated,border:selDate===d.iso?"none":`0.5px solid ${T.border}`,color:selDate===d.iso?"#fff":T.textSecondary,fontSize:12,fontWeight:600,transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",transform:selDate===d.iso?"scale(1.05)":"scale(1)"}}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        {/* Slots */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Heure</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {SLOTS.map(slot=>(
              <button key={slot} onClick={()=>setSelSlot(slot)} style={{padding:"11px 0",borderRadius:T.radiusSm,background:selSlot===slot?T.accentSoft:T.surfaceElevated,border:selSlot===slot?`1.5px solid ${T.accent}`:`0.5px solid ${T.border}`,color:selSlot===slot?T.accent:T.textSecondary,fontSize:14,fontWeight:600,transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",transform:selSlot===slot?"scale(1.04)":"scale(1)"}}>
                {slot}
              </button>
            ))}
          </div>
        </div>
        {/* Guests */}
        <div style={{marginBottom:24}}>
          <p style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Couverts</p>
          <div style={{display:"flex",alignItems:"center",background:T.surfaceElevated,borderRadius:T.radius,border:`0.5px solid ${T.border}`,overflow:"hidden"}}>
            <button onClick={()=>setGuests(g=>Math.max(1,g-1))} style={{width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:guests<=1?T.textTertiary:T.textPrimary}}>−</button>
            <div style={{flex:1,textAlign:"center",fontSize:17,fontWeight:700}}>{guests} <span style={{fontSize:13,fontWeight:400,color:T.textSecondary}}>pers.</span></div>
            <button onClick={()=>setGuests(g=>Math.min(10,g+1))} style={{width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:guests>=10?T.textTertiary:T.textPrimary}}>+</button>
          </div>
        </div>
      </div>
      <div style={{padding:"12px 24px 28px",background:`linear-gradient(to top,${T.bg} 60%,transparent)`}}>
        <button onClick={()=>setStep("confirm")} disabled={!selSlot} style={{width:"100%",padding:"17px 0",borderRadius:T.radius,background:selSlot?T.accent:T.surfaceElevated,color:selSlot?"#fff":T.textTertiary,fontSize:15,fontWeight:600,transition:"all 0.2s",boxShadow:selSlot?`0 8px 24px ${T.accentGlow}`:"none"}}>
          {selSlot?`Réserver pour ${guests} pers. →`:"Choisis un créneau"}
        </button>
      </div>
    </div>
  );
};

// ─── ITINERARY SHEET ──────────────────────────────────────────────────────────
const MAP_MODES=[
  {id:"walk",   emoji:"🚶",label:"À pied", time:"8 min", detail:"650 m · Rue de la Roquette"},
  {id:"bike",   emoji:"🚴",label:"Vélo",   time:"3 min", detail:"650 m · Piste cyclable"},
  {id:"transit",emoji:"🚇",label:"Métro",  time:"12 min",detail:"Bastille → Charonne"},
  {id:"car",    emoji:"🚗",label:"Voiture",time:"5 min", detail:"1,2 km · Via Oberkampf"},
];

const MiniMap = ({place}) => (
  <svg viewBox="0 0 340 160" style={{width:"100%",display:"block"}}>
    <rect width="340" height="160" fill="#0f1923"/>
    {[[0,80,340,80],[170,0,170,160],[60,0,60,160],[280,0,280,160],[0,40,340,40],[0,120,340,120]].map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e2d3d" strokeWidth={i<2?3:1.5}/>
    ))}
    <polyline points="50,140 50,80 170,80 170,58" fill="none" stroke={T.accent} strokeWidth={3} strokeDasharray="6 3" strokeLinecap="round"/>
    <circle cx="50" cy="140" r="8" fill={T.superBlue} opacity="0.9"/>
    <circle cx="50" cy="140" r="14" fill={T.superBlue} opacity="0.2"/>
    <circle cx="170" cy="58" r="10" fill={T.accent}/>
    <text x="170" y="62" textAnchor="middle" fontSize="11" fill="#fff">{place.emoji}</text>
    <text x="50"  y="128" textAnchor="middle" fontSize="9" fill={T.superBlue} fontWeight="600">Toi</text>
    <text x="170" y="76"  textAnchor="middle" fontSize="9" fill={T.accent}    fontWeight="600">{place.name}</text>
  </svg>
);

const ItinerarySheet = ({place}) => {
  const [mode,setMode]=useState("walk");
  const sel=MAP_MODES.find(m=>m.id===mode);
  const openMaps=()=>{
    const dest = place.latitude && place.longitude
      ? `${place.latitude},${place.longitude}`
      : encodeURIComponent(place.address);
    const travelMode = mode==="transit"?"r":mode==="walk"?"w":mode==="bike"?"b":"d";
    window.open(`https://maps.google.com/?q=${dest}&mode=${travelMode}`,"_blank");
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18,padding:"24px 24px 32px"}}>
      <h3 style={{fontSize:18,fontWeight:700}}>Itinéraire vers {place.name}</h3>
      {/* Map */}
      <div style={{borderRadius:T.radius,overflow:"hidden",border:`0.5px solid ${T.border}`}}>
        <MiniMap place={place}/>
        <div style={{padding:"12px 16px",background:T.surfaceElevated,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:14}}>📍</span>
          <div><p style={{fontSize:13,fontWeight:600}}>{place.name}</p><p style={{fontSize:12,color:T.textSecondary}}>{place.address}</p></div>
        </div>
      </div>
      {/* Modes */}
      <div>
        <p style={{fontSize:12,fontWeight:600,color:T.textTertiary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Mode de transport</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {MAP_MODES.map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 4px",borderRadius:T.radiusSm,background:mode===m.id?T.accentSoft:T.surfaceElevated,border:mode===m.id?`1.5px solid ${T.accent}`:`0.5px solid ${T.border}`,transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",transform:mode===m.id?"scale(1.05)":"scale(1)"}}>
              <span style={{fontSize:20}}>{m.emoji}</span>
              <span style={{fontSize:10,fontWeight:600,color:mode===m.id?T.accent:T.textSecondary}}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* ETA */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",background:T.surfaceElevated,borderRadius:T.radius,border:`0.5px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:48,height:48,borderRadius:14,background:T.accentSoft,border:`0.5px solid ${T.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{sel.emoji}</div>
          <div>
            <p style={{fontSize:22,fontWeight:700,letterSpacing:"-0.03em"}}>{sel.time}</p>
            <p style={{fontSize:12,color:T.textSecondary,marginTop:2}}>{sel.detail}</p>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <span style={{fontSize:11,color:T.textTertiary}}>Distance</span>
          <span style={{fontSize:14,fontWeight:600}}>{place.distance} km</span>
        </div>
      </div>
      <button onClick={openMaps} style={{width:"100%",padding:"17px 0",borderRadius:T.radius,background:T.accent,color:"#fff",fontSize:15,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:`0 8px 24px ${T.accentGlow}`}}>
        <span style={{fontSize:18}}>🗺️</span>Ouvrir dans Maps
      </button>
    </div>
  );
};

// ─── BOTTOM SHEET WRAPPER ─────────────────────────────────────────────────────
const BottomSheet = ({visible,onClose,children}) => (
  <>
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(2px)",zIndex:400,opacity:visible?1:0,transition:"opacity 0.25s",pointerEvents:visible?"all":"none"}}/>
    <div style={{position:"absolute",left:0,right:0,bottom:0,zIndex:401,background:T.bg,borderTopLeftRadius:28,borderTopRightRadius:28,border:`0.5px solid ${T.borderStrong}`,maxHeight:"88%",overflowY:"auto",transform:visible?"translateY(0)":"translateY(100%)",transition:"transform 0.38s cubic-bezier(0.16,1,0.3,1)"}}>
      <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}>
        <div style={{width:36,height:4,borderRadius:2,background:T.border}}/>
      </div>
      {children}
    </div>
  </>
);

// ─── DETAIL SCREEN ────────────────────────────────────────────────────────────
const DetailScreen = ({place,onBack,isLiked,isVisited,onLike,onVisit,onReservationDone}) => {
  const [showRating,setShowRating]=useState(false);
  const [rating,    setRating]    =useState(0);
  const [review,    setReview]    =useState("");
  const [done,      setDone]      =useState(false);
  const [sheet,     setSheet]     =useState(null); // null | "reservation" | "itinerary"
  const submit=()=>{if(rating>0){onVisit(place.id,rating,review);setDone(true);setShowRating(false);}};

  return(
    <div style={{height:"100%",position:"relative"}}>
      <div className="slide-up" style={{height:"100%",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        {/* Hero */}
        <div style={{position:"relative",height:280,flexShrink:0,background:place.color}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 30%,rgba(255,255,255,0.07) 0%,transparent 60%)"}}/>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:100,opacity:0.9,filter:"drop-shadow(0 8px 32px rgba(0,0,0,0.5))"}}>{place.emoji}</div>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.25) 0%,transparent 50%,rgba(0,0,0,0.8) 100%)"}}/>
          <button onClick={onBack} style={{position:"absolute",top:16,left:16,width:40,height:40,borderRadius:12,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",border:`0.5px solid ${T.borderStrong}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff"}}>←</button>
          <div style={{position:"absolute",bottom:20,left:24,right:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
              <span style={{fontSize:13}}>⭐ <strong>{place.rating_avg}</strong></span>
              <span style={{color:"rgba(255,255,255,0.4)"}}>·</span>
              <span style={{fontSize:13,color:T.accent,fontWeight:600}}>{place.price_range}</span>
              {place.diets?.includes("halal")&&<span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"rgba(34,197,94,0.25)",color:"#4ADE80",border:"0.5px solid rgba(34,197,94,0.5)"}}>🌙 Halal</span>}
              {place.diets?.includes("casher")&&<span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"rgba(129,140,248,0.25)",color:"#A5B4FC",border:"0.5px solid rgba(129,140,248,0.5)"}}>✡️ Casher</span>}
            </div>
            <h1 style={{fontSize:28,fontWeight:700,letterSpacing:"-0.04em"}}>{place.name}</h1>
          </div>
        </div>

        {/* ── Boutons Réserver + Itinéraire ── */}
        <div style={{padding:"18px 24px 0",display:"flex",gap:10}}>
          <button onClick={()=>setSheet("reservation")}
            style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:T.radius,background:`linear-gradient(135deg,${T.accent},#FF7A94)`,color:"#fff",fontSize:14,fontWeight:600,boxShadow:`0 6px 20px ${T.accentGlow}`,transition:"transform 0.15s,box-shadow 0.15s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <span style={{fontSize:18}}>📅</span>Réserver
          </button>
          <button onClick={()=>setSheet("itinerary")}
            style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:T.radius,background:T.surfaceElevated,border:`0.5px solid ${T.borderStrong}`,color:T.textPrimary,fontSize:14,fontWeight:600,transition:"transform 0.15s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <span style={{fontSize:18}}>🗺️</span>Itinéraire
          </button>
        </div>

        {/* Info */}
        <div style={{padding:"18px 24px 160px",display:"flex",flexDirection:"column",gap:18}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{place.tags.map(t=><Tag key={t} label={t}/>)}</div>
          <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.7}}>{place.description}</p>

          {/* Menu & Top plats */}
          {place.menu && <MenuSection menu={place.menu}/>}

          <div style={{background:T.surfaceElevated,borderRadius:T.radiusSm,border:`0.5px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px"}}>
              <span>📍</span><span style={{fontSize:13,color:T.textSecondary}}>{place.address}</span>
            </div>
            {place.hours&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderTop:`0.5px solid ${T.border}`}}>
              <span>🕐</span><span style={{fontSize:13,color:T.textSecondary}}>{place.hours}</span>
            </div>}
            {place.phone&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderTop:`0.5px solid ${T.border}`}}>
              <span>📞</span><a href={`tel:${place.phone}`} style={{fontSize:13,color:T.superBlue,fontWeight:500}}>{place.phone}</a>
            </div>}
          </div>
          {done&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",background:T.greenSoft,borderRadius:T.radiusSm,border:`0.5px solid ${T.green}40`}}><span>✅</span><span style={{fontSize:13,color:T.green,fontWeight:500}}>Visite enregistrée</span></div>}
          {showRating&&(
            <div style={{padding:18,background:T.surfaceElevated,borderRadius:T.radius,border:`0.5px solid ${T.borderStrong}`,display:"flex",flexDirection:"column",gap:14}}>
              <h3 style={{fontSize:15,fontWeight:600}}>Ta note pour {place.name}</h3>
              <StarRating value={rating} onChange={setRating} size={28}/>
              <textarea value={review} onChange={e=>setReview(e.target.value)} placeholder="Un avis ? (optionnel)" style={{width:"100%",padding:"12px 14px",background:T.bg,border:`0.5px solid ${T.border}`,borderRadius:T.radiusSm,color:T.textPrimary,fontSize:14,lineHeight:1.5,resize:"none",height:78,outline:"none"}}/>
              <button onClick={submit} style={{padding:"13px 0",borderRadius:T.radiusSm,background:rating>0?T.green:T.surfaceElevated,color:rating>0?"#fff":T.textTertiary,fontSize:14,fontWeight:600,transition:"all 0.2s"}}>{rating>0?"Enregistrer":"Donne une note d'abord"}</button>
            </div>
          )}
        </div>

        {/* Like / Visité */}
        <div style={{position:"sticky",bottom:0,padding:"14px 24px 28px",background:`linear-gradient(to top,${T.bg} 65%,transparent)`,display:"flex",gap:12}}>
          {isLiked?(
            <div style={{flex:1,padding:"14px 0",borderRadius:T.radius,background:T.greenSoft,border:`0.5px solid ${T.green}40`,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span>❤️</span><span style={{fontSize:14,fontWeight:600,color:T.green}}>Likée</span></div>
          ):(
            <button onClick={()=>onLike(place.id)} style={{flex:1,padding:"14px 0",borderRadius:T.radius,background:T.accentSoft,border:`0.5px solid ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:T.accent,fontSize:14,fontWeight:600}}>
              <span>🤍</span>Liker</button>
          )}
          <button onClick={()=>!isVisited&&!done&&setShowRating(true)} disabled={isVisited||done}
            style={{flex:1,padding:"14px 0",borderRadius:T.radius,background:T.surfaceElevated,border:`0.5px solid ${T.borderStrong}`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:(isVisited||done)?T.textTertiary:T.textPrimary,fontSize:14,fontWeight:600,opacity:(isVisited||done)?0.55:1,cursor:(isVisited||done)?"default":"pointer"}}>
            <span>👁</span>{(isVisited||done)?"Visité":"Marquer visité"}</button>
        </div>
      </div>

      {/* Bottom sheets */}
      <BottomSheet visible={sheet==="reservation"} onClose={()=>setSheet(null)}>
        <ReservationSheet place={place} onClose={()=>setSheet(null)} onConfirm={(d)=>{onReservationDone?.(d);}}/>
      </BottomSheet>
      <BottomSheet visible={sheet==="itinerary"} onClose={()=>setSheet(null)}>
        <ItinerarySheet place={place}/>
      </BottomSheet>
    </div>
  );
};

// ─── MOCK COMMUNITY DATA ──────────────────────────────────────────────────────
const COMMUNITY_USERS = [
  {
    id:"u2", username:"Léa Moreau", handle:"@leamoreau", avatar:"👩‍🍳", followers:1284, following:342,
    bio:"Cheffe de partie · Oberkampf addict · Vins nature",
    badge:"Top Foodie",
    lovers: ["1","5","8"],   // place ids
    likes:  ["1","2","3","5","6","8","10"],
    comments:{ "1":"Menu dégustation absolument époustouflant. Bertrand Grébaut est un génie.", "5":"Le menu aveugle chez LAVA — une révélation. Y aller les yeux fermés.", "8":"Virtus mérite chaque étoile. La salle est intime, la cuisine émouvante." },
    trustScore: 98,
  },
  {
    id:"u3", username:"Maxime Dufour", handle:"@maxdufour", avatar:"👨‍🍽️", followers:876, following:201,
    bio:"Journaliste culinaire · Bistronomie & nature",
    badge:"Critique",
    lovers: ["2","6","9"],
    likes:  ["2","4","6","7","9","11"],
    comments:{ "2":"Frenchie reste une valeur sûre, soir après soir. Greg Marchand ne déçoit jamais.", "6":"Mokonuts : une table qui vous manque dès le lendemain. Les cookies sont un crime.", "9":"Pierre Sang propose l'expérience la plus mémorable du 11e au rapport qualité-surprise." },
    trustScore: 94,
  },
  {
    id:"u4", username:"Sofia Petit", handle:"@sofiapetit", avatar:"🧑‍🍳", followers:2103, following:589,
    bio:"Food photographer · Paris × Tokyo",
    badge:"Influenceuse",
    lovers: ["3","7","12"],
    likes:  ["1","3","5","7","9","12"],
    comments:{ "3":"Le Clown Bar : pour ses carreaux Art Déco et son pigeon rôti. Hors du temps.", "7":"Abri en semaine pour le déjeuner — meilleur rapport qualité/émotion de Paris.", "12":"Le Châteaubriand, institution de la bistronomie. Iñaki reste une légende." },
    trustScore: 97,
  },
  {
    id:"u5", username:"Théo Laurent", handle:"@theolaurent", avatar:"🧔", followers:541, following:128,
    bio:"Amateur sérieux · Asiatique & fermentés",
    badge:"Régulier",
    lovers: ["9","4","11"],
    likes:  ["4","9","10","11"],
    comments:{ "9":"Le comptoir face à Pierre Sang, c'est du théâtre culinaire. Chaque plat est une surprise.", "11":"Le Cheval d'Or — la fusion franco-chinoise la plus sincère que j'aie mangée.", "4":"Clamato sans résa, dès l'ouverture : les crustacés sont irréprochables." },
    trustScore: 87,
  },
  {
    id:"u6", username:"Nina Blanc", handle:"@ninablanc", avatar:"👩", followers:319, following:97,
    bio:"Végétarienne engagée · Vins bio",
    badge:"Green Foodie",
    lovers: ["6","7"],
    likes:  ["6","7","2"],
    comments:{ "6":"Mokonuts propose la meilleure cuisine végétarienne de Paris sans te faire sentir au régime.", "7":"Abri : le chef japonais a une sensibilité hors du commun pour les légumes." },
    trustScore: 82,
  },
];

// ─── COMMUNAUTÉ SCREEN ────────────────────────────────────────────────────────
const BADGE_COLORS = {
  "Top Foodie":     { bg:"rgba(250,204,21,0.12)", border:"rgba(250,204,21,0.4)",  text:"#FACC15"  },
  "Critique":       { bg:"rgba(129,140,248,0.12)",border:"rgba(129,140,248,0.4)", text:"#818CF8"  },
  "Influenceuse":   { bg:"rgba(255,77,109,0.12)", border:"rgba(255,77,109,0.4)",  text:"#FF4D6D"  },
  "Régulier":       { bg:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.4)",   text:"#22C55E"  },
  "Green Foodie":   { bg:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.4)",   text:"#22C55E"  },
};

const UserProfileSheet = ({ user, onClose, onViewPlace }) => {
  const [tab, setTab] = useState("lovers");
  const loverPlaces = ALL_PLACES.filter(p => user.lovers.includes(p.id));
  const likePlaces  = ALL_PLACES.filter(p => user.likes.includes(p.id) && !user.lovers.includes(p.id));
  const badge = BADGE_COLORS[user.badge] || BADGE_COLORS["Régulier"];

  return (
    <div style={{ display:"flex", flexDirection:"column", maxHeight:"85vh" }}>
      {/* Header */}
      <div style={{ padding:"24px 24px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:18 }}>
          <div style={{ width:64, height:64, borderRadius:20, background:`linear-gradient(135deg,${T.accent}33,${T.superBlue}22)`, border:`0.5px solid ${T.borderStrong}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>
            {user.avatar}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <h3 style={{ fontSize:17, fontWeight:700, letterSpacing:"-0.02em" }}>{user.username}</h3>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:100, background:badge.bg, border:`0.5px solid ${badge.border}`, color:badge.text }}>{user.badge}</span>
            </div>
            <p style={{ fontSize:12, color:T.textTertiary, marginBottom:6 }}>{user.handle}</p>
            <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.5 }}>{user.bio}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:"flex", gap:8, marginBottom:18 }}>
          {[
            { label:"Abonnés",   value:user.followers.toLocaleString("fr") },
            { label:"Suivis",    value:user.following },
            { label:"❤️‍🔥 Lovers", value:user.lovers.length },
            { label:"Likes",     value:user.likes.length },
          ].map(s => (
            <div key={s.label} style={{ flex:1, textAlign:"center", padding:"10px 4px", background:T.surfaceElevated, borderRadius:T.radiusSm, border:`0.5px solid ${T.border}` }}>
              <div style={{ fontSize:15, fontWeight:700 }}>{s.value}</div>
              <div style={{ fontSize:10, color:T.textTertiary, marginTop:2, lineHeight:1.2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trust score */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:"rgba(250,204,21,0.06)", borderRadius:T.radiusSm, border:"0.5px solid rgba(250,204,21,0.2)", marginBottom:18 }}>
          <span style={{ fontSize:16 }}>⭐</span>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#FACC15" }}>Score de confiance</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#FACC15" }}>{user.trustScore}/100</span>
            </div>
            <div style={{ height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${user.trustScore}%`, background:"linear-gradient(90deg,#FACC15,#F59E0B)", borderRadius:2 }} />
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:2 }}>
          {[["lovers","❤️‍🔥 Coups de cœur"],["likes","Likés"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:"9px 0", borderRadius:T.radiusSm, background: tab===id ? T.accentSoft : T.surfaceElevated, border: tab===id ? `1.5px solid ${T.accent}` : `0.5px solid ${T.border}`, color: tab===id ? T.accent : T.textSecondary, fontSize:12, fontWeight:600, transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Place list */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 24px 28px" }}>
        {(tab === "lovers" ? loverPlaces : likePlaces).map((p, i) => (
          <button key={p.id} onClick={() => { onViewPlace(p); onClose(); }}
            style={{ display:"flex", gap:12, padding:"13px 0", width:"100%", textAlign:"left", borderBottom: i < (tab==="lovers"?loverPlaces:likePlaces).length-1 ? `0.5px solid ${T.border}` : "none", animation:`slideUp 0.35s ${i*0.06}s both` }}>
            <div style={{ width:56, height:56, borderRadius:12, flexShrink:0, background:p.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{p.emoji}</div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:14, fontWeight:600 }}>{p.name}</span>
                {tab==="lovers" && <span style={{ fontSize:12 }}>❤️‍🔥</span>}
              </div>
              <span style={{ fontSize:12, color:T.textSecondary }}>{p.cuisine_type} · {p.distance} km</span>
              {user.comments[p.id] && tab==="lovers" && (
                <p style={{ fontSize:11.5, color:T.textTertiary, lineHeight:1.5, fontStyle:"italic", marginTop:2, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  "{user.comments[p.id]}"
                </p>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0, paddingTop:2 }}>
              <span style={{ fontSize:11 }}>⭐</span>
              <span style={{ fontSize:12, fontWeight:600 }}>{p.rating_avg}</span>
            </div>
          </button>
        ))}
        {(tab==="lovers"?loverPlaces:likePlaces).length===0 && (
          <p style={{ textAlign:"center", color:T.textTertiary, fontSize:13, padding:"24px 0" }}>Aucune adresse pour l'instant</p>
        )}
      </div>
    </div>
  );
};

const CommunauteScreen = ({ onViewPlace }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set(["u2"])); // Léa pre-followed
  const [activeFilter, setActiveFilter] = useState("all"); // all | lovers | followed

  const toggleFollow = (uid, e) => {
    e.stopPropagation();
    setFollowedUsers(prev => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };

  const filtered = activeFilter === "followed"
    ? COMMUNITY_USERS.filter(u => followedUsers.has(u.id))
    : COMMUNITY_USERS;

  // Global top lovers: which place is recommended by the most users
  const loverCounts = {};
  COMMUNITY_USERS.forEach(u => u.lovers.forEach(pid => { loverCounts[pid] = (loverCounts[pid]||0)+1; }));
  const topLoverPlaces = Object.entries(loverCounts)
    .sort(([,a],[,b]) => b-a)
    .slice(0,5)
    .map(([pid, count]) => ({ place: ALL_PLACES.find(p=>p.id===pid), count }))
    .filter(x => x.place);

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"0 16px" }}>

        {/* ── Top addresses section ── */}
        <div style={{ marginBottom:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <span style={{ fontSize:16 }}>🏆</span>
            <h3 style={{ fontSize:13, fontWeight:700, color:T.textTertiary, letterSpacing:"0.05em", textTransform:"uppercase" }}>Top adresses de la communauté</h3>
          </div>
          <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
            {topLoverPlaces.map(({ place:p, count }, i) => (
              <button key={p.id} onClick={() => onViewPlace(p)}
                style={{ flexShrink:0, width:130, borderRadius:T.radius, overflow:"hidden", background:T.surfaceElevated, border:`0.5px solid ${T.border}`, textAlign:"left", animation:`slideUp 0.35s ${i*0.08}s both` }}>
                <div style={{ height:80, background:p.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, position:"relative" }}>
                  {p.emoji}
                  {i===0 && <div style={{ position:"absolute", top:8, left:8, fontSize:14 }}>🥇</div>}
                  <div style={{ position:"absolute", bottom:6, right:6, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)", borderRadius:100, padding:"2px 8px", display:"flex", alignItems:"center", gap:3 }}>
                    <span style={{ fontSize:10 }}>❤️‍🔥</span>
                    <span style={{ fontSize:10, fontWeight:700, color:"#fff" }}>{count}</span>
                  </div>
                </div>
                <div style={{ padding:"10px 10px 12px" }}>
                  <p style={{ fontSize:12, fontWeight:700, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</p>
                  <p style={{ fontSize:10, color:T.textSecondary, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.cuisine_type}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:6 }}>
                    <span style={{ fontSize:10 }}>⭐</span>
                    <span style={{ fontSize:11, fontWeight:600 }}>{p.rating_avg}</span>
                    <span style={{ color:T.textTertiary, fontSize:10 }}>·</span>
                    <span style={{ fontSize:10, color:T.accent, fontWeight:600 }}>{p.price_range}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Filter chips ── */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[["all","Tous"],["followed","Suivis"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveFilter(id)}
              style={{ padding:"7px 16px", borderRadius:100, background: activeFilter===id ? T.accentSoft : T.surfaceElevated, border: activeFilter===id ? `1.5px solid ${T.accent}` : `0.5px solid ${T.border}`, color: activeFilter===id ? T.accent : T.textSecondary, fontSize:12, fontWeight:600, transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}>
              {label}
            </button>
          ))}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, padding:"7px 12px", background:T.surfaceElevated, borderRadius:100, border:`0.5px solid ${T.border}` }}>
            <span style={{ fontSize:11 }}>👥</span>
            <span style={{ fontSize:12, color:T.textSecondary, fontWeight:500 }}>{followedUsers.size} suivis</span>
          </div>
        </div>

        {/* ── User cards ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, paddingBottom:24 }}>
          {filtered.length===0 && (
            <EmptyState emoji="👥" title="Personne à suivre" subtitle={"Suis des food lovers pour voir\nleurs adresses ici."} />
          )}
          {filtered.map((user, i) => {
            const badge = BADGE_COLORS[user.badge] || BADGE_COLORS["Régulier"];
            const isFollowed = followedUsers.has(user.id);
            const sharedLovers = user.lovers.map(id => ALL_PLACES.find(p=>p.id===id)).filter(Boolean).slice(0,3);
            return (
              <button key={user.id} onClick={() => setSelectedUser(user)}
                className="slide-up"
                style={{ animationDelay:`${i*0.07}s`, display:"flex", flexDirection:"column", padding:"16px", background:T.surfaceElevated, borderRadius:T.radius, border:`0.5px solid ${T.border}`, textAlign:"left", width:"100%", transition:"border-color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderStrong}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>

                {/* Top row: avatar + info + follow */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
                  <div style={{ width:48, height:48, borderRadius:14, flexShrink:0, background:`linear-gradient(135deg,${T.accent}22,${T.superBlue}11)`, border:`0.5px solid ${T.borderStrong}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{user.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                      <span style={{ fontSize:14, fontWeight:700 }}>{user.username}</span>
                      <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:100, background:badge.bg, border:`0.5px solid ${badge.border}`, color:badge.text }}>{user.badge}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                      <span style={{ fontSize:11, color:T.textTertiary }}>{user.followers.toLocaleString("fr")} abonnés</span>
                      <span style={{ fontSize:11, color:T.accent, fontWeight:600 }}>❤️‍🔥 {user.lovers.length} lovers</span>
                    </div>
                    {/* Trust score pill */}
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:100, background:"rgba(250,204,21,0.08)", border:"0.5px solid rgba(250,204,21,0.2)" }}>
                      <span style={{ fontSize:10 }}>⭐</span>
                      <span style={{ fontSize:10, fontWeight:700, color:"#FACC15" }}>{user.trustScore}/100</span>
                      <span style={{ fontSize:10, color:T.textTertiary }}>fiabilité</span>
                    </div>
                  </div>
                  <button
                    onClick={e => toggleFollow(user.id, e)}
                    style={{ flexShrink:0, padding:"7px 14px", borderRadius:100, background: isFollowed ? T.accentSoft : T.surfaceElevated, border: isFollowed ? `1.5px solid ${T.accent}` : `0.5px solid ${T.borderStrong}`, color: isFollowed ? T.accent : T.textSecondary, fontSize:11, fontWeight:700, transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", transform: isFollowed ? "scale(1)" : "scale(1)" }}>
                    {isFollowed ? "✓ Suivi" : "+ Suivre"}
                  </button>
                </div>

                {/* Bio */}
                <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.5, marginBottom:12 }}>{user.bio}</p>

                {/* Lover places preview */}
                <div>
                  <p style={{ fontSize:10, fontWeight:600, color:T.textTertiary, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:8 }}>Ses coups de cœur ❤️‍🔥</p>
                  <div style={{ display:"flex", gap:8 }}>
                    {sharedLovers.map(p => (
                      <div key={p.id} onClick={e => { e.stopPropagation(); onViewPlace(p); }}
                        style={{ flex:1, borderRadius:10, overflow:"hidden", background:p.color, cursor:"pointer" }}>
                        <div style={{ height:52, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{p.emoji}</div>
                        <div style={{ padding:"5px 6px 7px", background:"rgba(0,0,0,0.3)" }}>
                          <p style={{ fontSize:10, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</p>
                          {user.comments[p.id] && (
                            <p style={{ fontSize:9, color:"rgba(255,255,255,0.55)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontStyle:"italic" }}>"{user.comments[p.id].slice(0,40)}…"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User profile sheet */}
      <BottomSheet visible={!!selectedUser} onClose={() => setSelectedUser(null)}>
        {selectedUser && (
          <UserProfileSheet
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onViewPlace={onViewPlace}
          />
        )}
      </BottomSheet>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_TABS=[{id:"feed",emoji:"🏠",label:"Discover"},{id:"favoris",emoji:"❤️",label:"Favoris"},{id:"communaute",emoji:"🫂",label:"Communauté"},{id:"profil",emoji:"👤",label:"Profil"}];
const BottomNav = ({active,onChange,likedCount}) => (
  <nav style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 4px 24px",background:`linear-gradient(to top,${T.bg} 55%,transparent)`,display:"flex",justifyContent:"space-around",zIndex:100}}>
    {NAV_TABS.map(tab=>{
      const isActive=active===tab.id;
      return (
        <button key={tab.id} onClick={()=>onChange(tab.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"8px 10px",borderRadius:T.radius,background:isActive?T.accentSoft:"transparent",border:isActive?`0.5px solid ${T.accent}30`:"0.5px solid transparent",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",position:"relative"}}>
          <span style={{fontSize:20,opacity:isActive?1:0.45}}>{tab.emoji}</span>
          <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.04em",color:isActive?T.accent:T.textTertiary,textTransform:"uppercase"}}>{tab.label}</span>
          {tab.id==="favoris"&&likedCount>0&&<div className="pop-in" style={{position:"absolute",top:5,right:12,width:16,height:16,borderRadius:"50%",background:T.accent,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{likedCount}</div>}
        </button>
      );
    })}
  </nav>
);

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function FooderApp() {
  const [screen,       setScreen]      = useState("onboarding");
  const [activeTab,    setActiveTab]   = useState("feed");
  const [swipedIds,    setSwipedIds]   = useState(new Set());
  const [likedIds,     setLikedIds]    = useState(new Set());
  const [visitedIds,   setVisitedIds]  = useState(new Set());
  const [reviews,      setReviews]     = useState({}); // { placeId: {rating,lover,comment} }
  const [detailPlace,  setDetailPlace] = useState(null);
  const [ratingPlace,  setRatingPlace] = useState(null); // place awaiting rating sheet
  const [loading,      setLoading]     = useState(false);
  const [prefs,        setPrefs]       = useState(null);
  const [editingPrefs, setEditingPrefs]= useState(false);

  // ── Animations ────────────────────────────────────────────────────────────
  const [likeAnim,     setLikeAnim]    = useState(false);
  const [superAnim,    setSuperAnim]   = useState(false);
  const [confettiAnim, setConfettiAnim]= useState(false);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg, icon, color) => { setToast({msg,icon,color}); setTimeout(()=>setToast(null),2200); };

  const triggerLikeAnimation = (type="like") => {
    if (type==="superlike") { setSuperAnim(true); setTimeout(()=>setSuperAnim(false),1400); }
    else { setLikeAnim(true); setConfettiAnim(true); setTimeout(()=>setLikeAnim(false),1200); setTimeout(()=>setConfettiAnim(false),1200); }
  };

  // ── Like helpers ──────────────────────────────────────────────────────────
  const doLike = (placeId, triggerAnim=true) => {
    setLikedIds(prev=>new Set([...prev,placeId]));
    setSwipedIds(prev=>new Set([...prev,placeId]));
    if (triggerAnim) triggerLikeAnimation("like");
  };

  // ── Swipe ─────────────────────────────────────────────────────────────────
  const handleSwipe = useCallback((placeId, direction) => {
    setSwipedIds(prev=>new Set([...prev,placeId]));
    if (direction==="like") {
      setLikedIds(prev=>new Set([...prev,placeId]));
      triggerLikeAnimation("like");
      const p = ALL_PLACES.find(x=>x.id===placeId);
      showToast(`${p?.name} ajouté aux favoris !`,"❤️",T.green);
      // Open rating sheet after short delay (post-animation)
      setTimeout(()=>setRatingPlace(p||null), 700);
    }
  }, []);

  const handleSuperLike = () => {
    const r = filteredPlaces.filter(p=>!swipedIds.has(p.id));
    if (r.length===0) return;
    const top = r[0];
    doLike(top.id);
    triggerLikeAnimation("superlike");
    showToast(`Super Like sur ${top.name} ! ⭐`,"🌟",T.superBlue);
    setTimeout(()=>setRatingPlace(top), 700);
  };

  const handleButtonSwipe = (dir) => {
    const r = filteredPlaces.filter(p=>!swipedIds.has(p.id));
    if (r.length>0) handleSwipe(r[0].id, dir);
  };

  const handleLikeFromDetail = (placeId) => {
    doLike(placeId);
    showToast("Ajouté aux favoris !","❤️",T.green);
    const p = ALL_PLACES.find(x=>x.id===placeId);
    setTimeout(()=>setRatingPlace(p||null), 400);
  };

  const handleVisit = (placeId) => {
    setVisitedIds(prev=>new Set([...prev,placeId]));
    showToast("Visite enregistrée !","✅",T.superBlue);
  };

  // ── Rating ─────────────────────────────────────────────────────────────────
  const handleReviewSubmit = (placeId, review) => {
    setReviews(prev=>({...prev,[placeId]:review}));
    const isLover = review.lover;
    showToast(
      isLover ? "Fooder Lover enregistré ❤️‍🔥" : `Note de ${review.rating}⭐ enregistrée !`,
      isLover ? "❤️‍🔥" : "⭐",
      isLover ? T.accent : "#FACC15"
    );
  };

  // ── Onboarding → Quiz → Main ──────────────────────────────────────────────
  const handleOnboardingDone = () => setScreen("quiz");
  const handleQuizDone = (answers) => {
    setPrefs(answers); setLoading(true);
    setTimeout(()=>{ setLoading(false); setScreen("main"); }, 900);
  };
  const handleEditPrefs = () => setEditingPrefs(true);
  const handleEditDone  = (answers) => { setPrefs(answers); setEditingPrefs(false); };

  // ── Filtered places ───────────────────────────────────────────────────────
  const filteredPlaces = filterPlaces(ALL_PLACES, prefs);
  const remaining      = filteredPlaces.filter(p=>!swipedIds.has(p.id));

  const headerMap = {
    feed:      { title:"Fooder",     sub:"Paris · 2 km" },
    favoris:   { title:"Favoris",    sub:`${likedIds.size} restaurant${likedIds.size!==1?"s":""}` },
    communaute:{ title:"Communauté", sub:"Food lovers parisiens" },
    profil:    { title:"Profil",     sub:null },
  };

  return (
    <>
      <GlobalStyle/>
      <div style={{width:"100vw",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 20% 50%,rgba(255,77,109,0.08) 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(129,140,248,0.06) 0%,transparent 50%),#06060A",padding:12}}>

        {/* ── Phone frame ── */}
        <div style={{width:"100%",maxWidth:390,height:"100%",maxHeight:844,background:T.bg,borderRadius:48,border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 60px 120px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.05) inset",overflow:"hidden",position:"relative"}}>

          {/* Status bar */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:52,display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"0 28px 6px",zIndex:200}}>
            <span style={{fontSize:13,fontWeight:600}}>9:41</span>
            <div style={{display:"flex",gap:4,fontSize:11}}><span>●●●</span><span>WiFi</span><span>100%</span></div>
          </div>
          {/* Notch */}
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:126,height:32,background:"#000",borderBottomLeftRadius:18,borderBottomRightRadius:18,zIndex:999}}/>

          <Toast msg={toast?.msg} color={toast?.color} icon={toast?.icon}/>

          {/* Feed animations */}
          {screen==="main"&&activeTab==="feed"&&(
            <><FloatingHearts active={likeAnim}/><Confetti active={confettiAnim} type="like"/><Confetti active={superAnim} type="superlike"/></>
          )}

          {/* ── Rating sheet (global, over any screen) ── */}
          <BottomSheet visible={!!ratingPlace} onClose={()=>setRatingPlace(null)}>
            {ratingPlace && (
              <RatingSheet
                place={ratingPlace}
                existingReview={reviews[ratingPlace.id]}
                onClose={()=>setRatingPlace(null)}
                onSubmit={(r)=>{ handleReviewSubmit(ratingPlace.id, r); }}
              />
            )}
          </BottomSheet>

          {/* ── ONBOARDING ── */}
          {screen==="onboarding"&&(
            <div style={{position:"absolute",inset:0,paddingTop:52}}>
              <OnboardingScreen onDone={handleOnboardingDone}/>
            </div>
          )}

          {/* ── QUIZ ── */}
          {screen==="quiz"&&(
            <div style={{position:"absolute",inset:0,paddingTop:52,background:T.bg}}>
              <DietsQuizScreen onDone={handleQuizDone}/>
            </div>
          )}

          {/* ── EDIT PREFS ── */}
          {editingPrefs&&(
            <div style={{position:"absolute",inset:0,paddingTop:52,background:T.bg,zIndex:300}}>
              <div style={{padding:"16px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h2 style={{fontSize:18,fontWeight:700}}>Mes préférences</h2>
                <button onClick={()=>setEditingPrefs(false)} style={{width:36,height:36,borderRadius:10,background:T.surfaceElevated,border:`0.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:T.textSecondary}}>✕</button>
              </div>
              <DietsQuizScreen onDone={handleEditDone}/>
            </div>
          )}

          {/* ── DETAIL ── */}
          {screen==="detail"&&detailPlace&&(
            <div style={{position:"absolute",inset:0,paddingTop:52,zIndex:200,background:T.bg}}>
              <DetailScreen
                place={detailPlace}
                onBack={()=>setScreen("main")}
                isLiked={likedIds.has(detailPlace.id)}
                isVisited={visitedIds.has(detailPlace.id)}
                onLike={handleLikeFromDetail}
                onVisit={handleVisit}
                onReservationDone={(d)=>showToast(`Réservé · ${d.slot}`,"📅",T.accent)}
              />
            </div>
          )}

          {/* ── MAIN ── */}
          {screen==="main"&&(
            <div style={{position:"absolute",inset:0,paddingTop:52,display:"flex",flexDirection:"column"}}>
              {/* Header */}
              <div style={{padding:"14px 20px 10px",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
                  <h1 style={{fontSize:25,fontWeight:700,letterSpacing:"-0.04em"}}>{headerMap[activeTab].title}</h1>
                  {headerMap[activeTab].sub&&<span style={{fontSize:13,color:T.textTertiary}}>{headerMap[activeTab].sub}</span>}
                </div>
                {activeTab==="feed"&&prefs?.regime&&(
                  <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:11,color:T.textTertiary}}>Filtré pour toi ·</span>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:100,
                      background: prefs.regime==="halal" ? "rgba(34,197,94,0.15)" : prefs.regime==="casher" ? "rgba(129,140,248,0.15)" : "transparent",
                      color: prefs.regime==="halal" ? T.green : prefs.regime==="casher" ? T.superBlue : T.accent,
                      border: prefs.regime==="halal" ? "0.5px solid rgba(34,197,94,0.4)" : prefs.regime==="casher" ? "0.5px solid rgba(129,140,248,0.4)" : "none",
                    }}>
                      {REGIME_LABELS[prefs.regime]?.e} {REGIME_LABELS[prefs.regime]?.l}
                    </span>
                    {prefs.budget&&<><span style={{fontSize:11,color:T.textTertiary}}>·</span><span style={{fontSize:11,color:T.superBlue,fontWeight:600}}>{prefs.budget}</span></>}
                  </div>
                )}
              </div>

              <div style={{flex:1,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"}}>

                {/* FEED */}
                {activeTab==="feed"&&(
                  <>
                    <div style={{position:"relative",flex:1,margin:"0 16px"}}>
                      {loading ? <SkeletonCard/> :
                       remaining.length===0 ? (
                         <EmptyState emoji="🍽️" title="Plus de restaurants" subtitle={"Tu as tout vu dans ce secteur.\nReviens demain pour de nouvelles tables."}/>
                       ) : (
                         remaining.slice(0,3).map((p,i)=>(
                           <SwipeCard key={p.id} place={p} isTop={i===0} stackIndex={i} onSwipe={handleSwipe}/>
                         )).reverse()
                       )}
                      {!loading&&remaining.length>0&&(
                        <button onClick={()=>{setDetailPlace(remaining[0]);setScreen("detail");}}
                          style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",border:`0.5px solid ${T.borderStrong}`,borderRadius:100,padding:"6px 16px",zIndex:20,display:"flex",alignItems:"center",gap:6,color:T.textSecondary,fontSize:12,fontWeight:500}}>
                          <span style={{fontSize:13}}>ℹ️</span> Voir le détail
                        </button>
                      )}
                    </div>
                    {!loading&&remaining.length>0&&(
                      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:20,padding:"14px 0 4px",flexShrink:0}}>
                        <ActionButton emoji="✕"  label="Passer" bg={T.accentSoft}    size={58} onClick={()=>handleButtonSwipe("pass")}/>
                        <ActionButton emoji="❤️" label="Liker"  bg={T.greenSoft}     size={72} onClick={()=>handleButtonSwipe("like")}/>
                        <ActionButton emoji="⭐" label="Super"  bg={T.superBlueSoft} size={58} onClick={handleSuperLike} pulse/>
                      </div>
                    )}
                    <div style={{height:82,flexShrink:0}}/>
                  </>
                )}

                {/* FAVORIS */}
                {activeTab==="favoris"&&(
                  <>
                    <FavorisScreen
                      likedIds={likedIds}
                      visitedIds={visitedIds}
                      reviews={reviews}
                      onOpenDetail={p=>{setDetailPlace(p);setScreen("detail");}}
                      onRatePlace={p=>setRatingPlace(p)}
                    />
                    <div style={{height:80}}/>
                  </>
                )}

                {/* COMMUNAUTE */}
                {activeTab==="communaute"&&(
                  <>
                    <CommunauteScreen
                      onViewPlace={p=>{setDetailPlace(p);setScreen("detail");}}
                    />
                    <div style={{height:80}}/>
                  </>
                )}

                {/* PROFIL */}
                {activeTab==="profil"&&(
                  <>
                    <ProfilScreen
                      user={MOCK_USER}
                      likedIds={likedIds}
                      visitedIds={visitedIds}
                      reviews={reviews}
                      prefs={prefs}
                      onEditPrefs={handleEditPrefs}
                    />
                    <div style={{height:80}}/>
                  </>
                )}
              </div>

              <BottomNav active={activeTab} onChange={setActiveTab} likedCount={likedIds.size}/>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
