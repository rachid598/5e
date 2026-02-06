const ideas = [
  {
    title: 'Activités courtes et efficaces',
    items: [
      'Cartes éclair “Vrai / Faux + justification” (équivalences, simplification).',
      'Rituel de début de cours (5 min) : 3 simplifications + 1 comparaison + 1 fraction d’une quantité.',
      'Tri rapide : classer des fractions simplifiées / non simplifiées.',
      'Défi minute : simplifier le plus de fractions possibles en 2 minutes.',
    ],
  },
  {
    title: 'Manipulations et visuels',
    items: [
      'Bandes de fractions pour comparer et justifier visuellement.',
      'Disques de fractions pour travailler les équivalences.',
      'Quadrillage : colorier une fraction puis la représenter autrement.',
      'Droite graduée : placer des fractions et comparer.',
    ],
  },
  {
    title: 'Problèmes concrets',
    items: [
      'Recettes : adapter une quantité (proportionnalité).',
      'Partage : répartir une quantité entre des personnes.',
      'Trajet : il reste X km si on a fait 3/5 du parcours.',
      'Réductions : “-30%” en équivalence fractionnaire.',
    ],
  },
  {
    title: 'Jeux et défis',
    items: [
      'Bingo des fractions équivalentes.',
      'Dominos : associer une fraction à une équivalente.',
      'Course par équipes : simplifier un maximum en temps limité.',
      'Escape game : énigmes sur simplification / comparaison / problèmes.',
    ],
  },
  {
    title: 'Oralisation et justification',
    items: [
      '“Explique-moi comment tu sais” : justification orale.',
      'Mini-débat : “6/8 = 3/4 ? Pourquoi ?”.',
      'Pair-check : un élève explique, l’autre valide.',
    ],
  },
]

const sequence = [
  {
    title: 'Séance 1 — Comprendre et représenter les fractions',
    goals: [
      'Représenter une fraction (bandes, disques, quadrillage).',
      'Comprendre l’équivalence (1/2 = 2/4 = 3/6).',
    ],
    steps: [
      'Rituel : 3 fractions à représenter.',
      'Manipulation : bandes / disques pour comparer.',
      'Trace écrite : définition + exemples.',
      'Exercices courts : représenter et comparer.',
    ],
  },
  {
    title: 'Séance 2 — Simplifier et rendre irréductible',
    goals: [
      'Identifier des diviseurs communs.',
      'Simplifier en justifiant.',
    ],
    steps: [
      'Rituel : 4 simplifications rapides.',
      'Méthode : expliquer la simplification par division.',
      'Atelier en îlots : cartes Vrai/Faux + justification.',
      'Mini-évaluation formative (exit ticket).',
    ],
  },
  {
    title: 'Séance 3 — Réinvestissement en problèmes',
    goals: [
      'Utiliser les fractions en contexte.',
      'Choisir une stratégie de résolution.',
    ],
    steps: [
      'Problèmes concrets (recettes, partages, trajets).',
      'Correction collective avec justification.',
      'Jeu de fin : bingo des équivalences.',
    ],
  },
]

const exercises = [
  {
    level: 'Niveau 1 — Bases',
    items: [
      'Simplifier : 4/8, 6/9, 10/15, 12/16.',
      'Comparer : 3/4 et 5/8 ; 2/3 et 3/5.',
      'Représenter 3/5 sur une bande.',
    ],
  },
  {
    level: 'Niveau 2 — Intermédiaire',
    items: [
      'Simplifier : 18/24, 21/28, 27/36, 35/50.',
      'Équivalences : trouver 2 fractions équivalentes à 5/6.',
      'Problème : une recette pour 4, adapter pour 6.',
    ],
  },
  {
    level: 'Niveau 3 — Avancé',
    items: [
      'Simplifier : 84/126, 75/105, 96/144.',
      'Comparer sans calculatrice : 7/9 et 8/11.',
      'Problème : 3/5 du trajet fait, il reste 12 km.',
    ],
  },
]

function Section({ title, children }) {
  return (
    <section className="bg-surface rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function BulletList({ items }) {
  return (
    <ul className="list-disc list-inside text-slate-300 space-y-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function FractionsIdeas({ onBack }) {
  return (
    <div className="min-h-screen p-4 pb-10">
      <header className="flex items-center gap-3 mb-6 pt-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-surface hover:bg-surface-light transition-colors"
        >
          Retour
        </button>
        <div>
          <h2 className="text-xl font-bold">Idées Fractions (5e)</h2>
          <p className="text-xs text-slate-400">
            Activités concrètes, séquence 2–3 séances, exercices par niveau.
          </p>
        </div>
      </header>

      <div className="space-y-6">
        <Section title="Idées pédagogiques concrètes">
          <div className="space-y-4">
            {ideas.map((group) => (
              <div key={group.title}>
                <h4 className="font-semibold text-slate-100 mb-2">
                  {group.title}
                </h4>
                <BulletList items={group.items} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Séquence complète sur 2–3 séances">
          <div className="space-y-4">
            {sequence.map((session) => (
              <div key={session.title} className="space-y-2">
                <h4 className="font-semibold text-slate-100">
                  {session.title}
                </h4>
                <p className="text-sm text-slate-400">
                  Objectifs : {session.goals.join(' · ')}
                </p>
                <BulletList items={session.steps} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Fiche d’exercices par niveau">
          <div className="space-y-4">
            {exercises.map((level) => (
              <div key={level.level}>
                <h4 className="font-semibold text-slate-100 mb-2">
                  {level.level}
                </h4>
                <BulletList items={level.items} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
