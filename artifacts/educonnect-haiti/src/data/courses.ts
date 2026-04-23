export const courses = [
  {
    id: "math-9af",
    title: "Algèbre et Géométrie Fondamentales",
    subject: "Mathématiques",
    level: "9e AF",
    description: "Maîtrisez les bases de l'algèbre et de la géométrie pour réussir les examens de 9e année fondamentale.",
    duration: "4 heures",
    chapters: [
      {
        id: "c1",
        title: "Équations du premier degré",
        videoUrl: "placeholder",
        summary: "Une équation du premier degré est une égalité qui contient une variable à la puissance 1. Pour la résoudre, on isole la variable.",
        exercises: [
          { question: "Résoudre: 2x + 4 = 10", options: ["x = 2", "x = 3", "x = 4"], answer: 1 },
          { question: "Quelle est la valeur de y si 5y = 25 ?", options: ["y = 5", "y = 10", "y = 20"], answer: 0 }
        ]
      },
      {
        id: "c2",
        title: "Théorème de Pythagore",
        videoUrl: "placeholder",
        summary: "Dans un triangle rectangle, le carré de la longueur de l'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.",
        exercises: [
          { question: "Si a=3 et b=4 dans un triangle rectangle, quelle est l'hypoténuse c?", options: ["5", "6", "7"], answer: 0 }
        ]
      }
    ]
  },
  {
    id: "fr-philo",
    title: "Analyse Littéraire Haïtienne",
    subject: "Français",
    level: "Philo / NS4",
    description: "Analyse des grandes œuvres littéraires haïtiennes et préparation à l'épreuve de littérature du baccalauréat.",
    duration: "6 heures",
    chapters: [
      {
        id: "c1",
        title: "Le mouvement indigéniste",
        videoUrl: "placeholder",
        summary: "Mouvement littéraire et culturel haïtien qui prône un retour aux sources et la valorisation de la culture populaire.",
        exercises: [
          { question: "Lequel de ces auteurs est une figure de l'indigénisme ?", options: ["Jacques Roumain", "Victor Hugo", "Aimé Césaire"], answer: 0 }
        ]
      }
    ]
  },
  {
    id: "svt-ns2",
    title: "Biologie Cellulaire",
    subject: "Sciences",
    level: "NS2",
    description: "Comprendre la structure et le fonctionnement de la cellule, l'unité de base de la vie.",
    duration: "3 heures",
    chapters: [
      {
        id: "c1",
        title: "La membrane plasmique",
        videoUrl: "placeholder",
        summary: "La membrane plasmique sépare l'intérieur de la cellule du milieu extérieur. Elle est composée d'une double couche de lipides.",
        exercises: [
          { question: "Quel est le rôle principal de la membrane ?", options: ["Produire de l'énergie", "Protéger la cellule et contrôler les échanges", "Stocker l'ADN"], answer: 1 }
        ]
      }
    ]
  }
];
