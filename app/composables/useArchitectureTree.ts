import { ref, computed } from 'vue'

// ── Types ──────────────────────────────────────────────────────────────────
export interface Choice {
  label: string
  icon: string
  sub?: string
  next: string
}

export interface QuestionNode {
  id: string
  dimension: string
  question: string
  context: string
  choices: Choice[]
}

export interface ResultNode {
  result: string[]
  confidence: number
  rationale: string
}

export interface Architecture {
  id: string
  icon: string
  name: string
  subtitle: string
  color: string
  description: string
  strengths: string[]
  weaknesses: string[]
  when: string
  uncle_bob: string
  changeCost: string
  orgFit: string
  nfrImpact: string
}

// ── Constantes ─────────────────────────────────────────────────────────────
export const DIM_COLORS: Record<string, string> = {
  stade: '#e8c84a',
  domaine: '#4a9ee8',
  org: '#a78bfa',
  nfr: '#e84a7a',
  cost: '#4ae8b0',
}

export const DIM_LABELS: Record<string, { label: string; icon: string }> = {
  stade: { label: 'Stade du projet', icon: '📍' },
  domaine: { label: 'Complexité / Domaine', icon: '🏛️' },
  org: { label: "Organisation (Conway's Law)", icon: '👥' },
  nfr: { label: 'Contraintes non-fonctionnelles', icon: '⚡' },
  cost: { label: "Coût du changement d'avis", icon: '🔄' },
}

export const ARCHITECTURES: Record<string, Architecture> = {
  layered: {
    id: 'layered',
    icon: '▤',
    name: 'Layered Architecture',
    subtitle: 'N-Tier / Architecture en couches',
    color: '#4a9ee8',
    description:
      'Présentation → Business → Data Access → Database. Simple, universel, rapide à bootstrapper.',
    strengths: [
      "Courbe d'apprentissage minimale",
      'Pattern universel',
      'Rapide à mettre en place',
      'Idéal CRUD',
    ],
    weaknesses: [
      'Couplage DB→Métier possible',
      'Scalabilité limitée',
      'Tests touchent la DB sans DIP',
    ],
    when: 'MVP, back-office, équipe junior, deadline serrée',
    uncle_bob:
      '"Le schéma DB risque de dicter les entités métier — restez vigilant." — Uncle Bob',
    changeCost:
      '⭐⭐ Faible — Structure familière, refactoring vers Clean progressif via DIP.',
    orgFit:
      'Toutes tailles. Idéal équipes < 5 devs ou structures mono-équipe.',
    nfrImpact:
      "Attention haute fréquence : chaque couche est une indirection. Pour < 10ms P99, envisagez un accès Data direct.",
  },
  clean: {
    id: 'clean',
    icon: '◎',
    name: 'Clean Architecture',
    subtitle: 'Cercles concentriques — Uncle Bob (2017)',
    color: '#e8c84a',
    description:
      'Entities → Use Cases → Interface Adapters → Frameworks & Drivers. La Dependency Rule est absolue.',
    strengths: [
      'Indépendance totale du framework',
      'Testabilité maximale',
      'Règles métier isolées',
      'Évolutivité',
    ],
    weaknesses: [
      'Overhead initial fort',
      'Over-engineering pour projets simples',
      "Courbe d'apprentissage",
    ],
    when: 'Domaine métier complexe, longue durée de vie, équipe expérimentée',
    uncle_bob:
      '"Le web est un détail. La DB est un détail. Vos règles métier ne doivent rien savoir d\'eux."',
    changeCost:
      '⭐⭐⭐⭐ Très protégé — Couplage zéro entre domaine et infra : pivots technologiques peu coûteux.',
    orgFit:
      "Équipes 5–20 devs. Conway favorable : frontières de couches = frontières d'équipes.",
    nfrImpact:
      'Neutre sur la perf. CI/CD plus rapide grâce aux tests unitaires purs sans infra.',
  },
  hexagonal: {
    id: 'hexagonal',
    icon: '⬡',
    name: 'Hexagonal Architecture',
    subtitle: 'Ports & Adapters — Alistair Cockburn',
    color: '#4ae8b0',
    description:
      'Le domaine au centre communique via des Ports. Les Adapters implémentent ces ports pour le monde extérieur.',
    strengths: [
      'Testabilité exceptionnelle',
      'Symétrie driving/driven',
      'Swappable adapters',
      'Domain pur',
    ],
    weaknesses: [
      'Verbosité des ports/adapters',
      'Peut sembler redondant avec Clean',
      'Setup initial',
    ],
    when: 'Multiples sources de données, TDD strict, microservices, équipe senior',
    uncle_bob:
      '"Si un test nécessite docker-compose up pour une règle métier, l\'hexagone est pollué."',
    changeCost:
      "⭐⭐⭐⭐⭐ Maximal — Swapper un adapter ne touche jamais le domaine. Design for change par excellence.",
    orgFit:
      'Idéal équipes distribuées. Chaque Port = contrat explicite entre équipes Driving et Driven.',
    nfrImpact:
      "Léger overhead d'indirection. Compensé par la capacité à swapper vers un adapter haute perf sans refactoring.",
  },
  onion: {
    id: 'onion',
    icon: '🧅',
    name: 'Onion Architecture',
    subtitle: 'Jeffrey Palermo — Variante de Clean',
    color: '#e87a4a',
    description:
      'Domain Model → Domain Services → Application Services → Infrastructure. Domain Services comme couche explicite de contrats.',
    strengths: [
      'Domain Services explicites',
      'Interfaces appartiennent au domaine',
      'Testabilité',
      'Évolutivité',
    ],
    weaknesses: [
      'Similaire à Clean — parfois redondant',
      'Terminologie confuse vs Clean',
      'Over-engineering possible',
    ],
    when: 'DDD, équipe habituée à Onion, Domain Services nombreux',
    uncle_bob:
      '"Onion et Clean partagent le même ADN. Leurs différences sont de vocabulaire, pas de philosophie."',
    changeCost:
      '⭐⭐⭐⭐ Très protégé — Domain Services rendent les contrats encore plus explicites.',
    orgFit:
      'Forte culture Domain-Driven. La séparation Domain Services / Application Services facilite le ownership.',
    nfrImpact:
      "Identique à Clean Architecture. La couche Domain Services supplémentaire est négligeable en runtime.",
  },
  ddd: {
    id: 'ddd',
    icon: '◈',
    name: 'Domain-Driven Design',
    subtitle: 'Eric Evans — À combiner avec Hexagonal/Clean',
    color: '#a78bfa',
    description:
      'Bounded Contexts, Aggregates, Entities, Value Objects, Domain Events, Ubiquitous Language.',
    strengths: [
      'Alignement métier/code parfait',
      'Gestion de la complexité',
      'Modèle expressif',
      'Scalabilité en Bounded Contexts',
    ],
    weaknesses: [
      'Complexité initiale très élevée',
      'Nécessite des experts métier disponibles',
      'Overkill pour CRUD',
    ],
    when: 'Domaine très complexe, multiples bounded contexts, équipe senior + product experts',
    uncle_bob:
      'Souvent combiné avec Clean ou Hexagonal pour protéger les Aggregates du monde extérieur.',
    changeCost:
      "⭐⭐⭐ Modulable — Changer un Bounded Context n'impacte pas les autres. BC = unité de déploiement.",
    orgFit:
      "Conway's Law au cœur du DDD : 1 Bounded Context = 1 équipe autonome. Min. 3+ équipes recommandé.",
    nfrImpact:
      'Domain Events = découplage asynchrone. Excellent pour scalabilité par contexte. Aggregates = limites transactionnelles.',
  },
  monolithic: {
    id: 'monolithic',
    icon: '⬛',
    name: 'Architecture Monolithique',
    subtitle: 'Modulaire ou non — Point de départ classique',
    color: '#6a7090',
    description:
      'Tout dans un seul déployable. Le monolithe modulaire bien structuré surpasse de nombreux micro-services mal découpés.',
    strengths: [
      'Déploiement simple',
      'Pas de latence réseau',
      'Debugging facile',
      'Rapide à démarrer',
    ],
    weaknesses: [
      'Scalabilité limitée par composant',
      'Couplage croissant si non modulaire',
      'Déploiement tout-ou-rien',
    ],
    when: 'Startup early-stage, équipe < 10 devs, domaine pas encore stabilisé',
    uncle_bob:
      '"Un bon monolithe modulaire bat un mauvais microservice en scalabilité réelle."',
    changeCost:
      "⭐ Variable — Faible si modulaire dès le départ. Très élevé si le couplage s'accumule.",
    orgFit:
      "Une seule équipe, un seul déployable. Signal d'alerte : > 10–15 devs sur le même monolithe.",
    nfrImpact:
      'Performances max (pas de réseau interne). Scalabilité en bloc : impossible de scaler un composant seul.',
  },
}

// ── Arbre de décision ──────────────────────────────────────────────────────
export const TREE: Record<string, QuestionNode | ResultNode> = {
  q1: {
    id: 'q1',
    dimension: 'stade',
    question: 'Quel est le stade de votre projet ?',
    context:
      "Uncle Bob : \"La meilleure architecture est celle qui convient à votre contexte actuel, pas à votre contexte idéal.\" YAGNI appliqué à l'architecture.",
    choices: [
      {
        label: 'MVP / Prototype',
        icon: '🚀',
        sub: 'Time-to-market critique, domaine incertain',
        next: 'q2_mvp',
      },
      {
        label: 'Produit établi',
        icon: '📦',
        sub: 'Équipe en place, base de code existante',
        next: 'q2_prod',
      },
      {
        label: 'Refactoring',
        icon: '🔄',
        sub: 'Améliorer ou migrer une base existante',
        next: 'q2_refacto',
      },
      {
        label: 'Greenfield senior',
        icon: '🏗️',
        sub: 'Nouveau projet, équipe expérimentée',
        next: 'q2_green',
      },
    ],
  },
  q2_mvp: {
    id: 'q2_mvp',
    dimension: 'domaine',
    question: 'Quelle est la complexité métier attendue ?',
    context:
      "Pour un MVP, l'over-engineering tue la vélocité. Distinguez complexité accidentelle et complexité essentielle (Fred Brooks).",
    choices: [
      {
        label: 'Simple (CRUD)',
        icon: '📋',
        sub: 'Formulaires, listes, rapports basiques',
        next: 'qorg_simple',
      },
      {
        label: 'Modérée',
        icon: '⚙️',
        sub: 'Quelques règles métier, workflows',
        next: 'qorg_moderate',
      },
      {
        label: 'Complexe dès le départ',
        icon: '🧩',
        sub: 'Domaine riche, experts métier impliqués',
        next: 'q3_complex',
      },
    ],
  },
  q2_prod: {
    id: 'q2_prod',
    dimension: 'domaine',
    question: 'Quel est votre principal défi actuel ?',
    context:
      "Un produit établi accumule de la dette architecturale. La question : quelle migration est possible sans arrêter la production ?",
    choices: [
      {
        label: 'Tests difficiles',
        icon: '🧪',
        sub: 'DB ou framework polluent les tests unitaires',
        next: 'qnfr_tests',
      },
      {
        label: 'Scalabilité',
        icon: '📈',
        sub: 'Besoin de scaler certaines parties',
        next: 'q3_scale',
      },
      {
        label: 'Métier mal modélisé',
        icon: '🏛️',
        sub: 'Le code ne parle pas le langage métier',
        next: 'qorg_ddd',
      },
      {
        label: 'Évolution technologique',
        icon: '🔌',
        sub: 'Changer de DB, framework, API tierce',
        next: 'qcost_tech',
      },
    ],
  },
  q2_refacto: {
    id: 'q2_refacto',
    dimension: 'domaine',
    question: "Quel est l'état de la base actuelle ?",
    context:
      '"Le Big Bang Rewrite est le risque le plus élevé en génie logiciel." — Joel Spolsky. La migration progressive (Strangler Fig) est presque toujours préférable.',
    choices: [
      {
        label: 'Layered désorganisé',
        icon: '🌀',
        sub: 'Couches non respectées, couplage fort',
        next: 'qcost_layered',
      },
      {
        label: 'Monolithe non modulaire',
        icon: '🪨',
        sub: 'Tout couplé, pas de séparation claire',
        next: 'q3_refacto_size',
      },
      {
        label: 'Déjà structuré',
        icon: '📐',
        sub: 'Architecture en place, besoin de raffinement',
        next: 'q2_prod',
      },
    ],
  },
  q2_green: {
    id: 'q2_green',
    dimension: 'domaine',
    question: 'Quel est le domaine métier principal ?',
    context:
      "Greenfield + équipe senior = liberté maximale. Attention : l'architecture la plus sophistiquée n'est pas toujours la plus adaptée.",
    choices: [
      {
        label: 'E-commerce / SaaS',
        icon: '🛒',
        sub: 'Catalogue, commandes, utilisateurs, paiements',
        next: 'qorg_saas',
      },
      {
        label: 'Finance / Santé / Legal',
        icon: '🏦',
        sub: 'Règles critiques, compliance, auditabilité',
        next: 'qnfr_critical',
      },
      {
        label: 'Plateforme / Marketplace',
        icon: '🌐',
        sub: 'Multiples acteurs, bounded contexts distincts',
        next: 'qorg_platform',
      },
      {
        label: 'Outil interne / Admin',
        icon: '🔧',
        sub: 'Back-office, reporting, gestion interne',
        next: 'qorg_simple',
      },
    ],
  },
  qorg_simple: {
    id: 'qorg_simple',
    dimension: 'org',
    question:
      'Quelle est la taille et la structure de votre équipe ?',
    context:
      "Conway's Law (1967) : \"Les organisations conçoivent des systèmes qui reproduisent leur structure de communication.\" Votre architecture reflétera votre org, qu'elle vous plaise ou non.",
    choices: [
      {
        label: '1–3 devs',
        icon: '👤',
        sub: 'Solo ou micro-équipe, décisions rapides',
        next: 'qnfr_simple',
      },
      {
        label: '4–10 devs',
        icon: '👥',
        sub: 'Équipe unique, communication directe',
        next: 'qnfr_simple',
      },
      {
        label: '10+ devs',
        icon: '🏢',
        sub: 'Plusieurs équipes ou squads',
        next: 'qnfr_simple',
      },
    ],
  },
  qorg_moderate: {
    id: 'qorg_moderate',
    dimension: 'org',
    question: 'Comment vos équipes sont-elles organisées ?',
    context:
      "Inverse Conway Maneuver : choisissez d'abord l'architecture cible, puis réorganisez les équipes en conséquence. Amazon l'a fait avec AWS.",
    choices: [
      {
        label: 'Une seule équipe full-stack',
        icon: '🔲',
        sub: 'Tout le monde touche à tout',
        next: 'qnfr_moderate',
      },
      {
        label: 'Équipes frontend / backend',
        icon: '⬛',
        sub: 'Découpage technique horizontal',
        next: 'qnfr_moderate',
      },
      {
        label: 'Équipes par feature / domaine',
        icon: '◈',
        sub: 'Découpage vertical par contexte métier',
        next: 'qnfr_moderate',
      },
    ],
  },
  qorg_ddd: {
    id: 'qorg_ddd',
    dimension: 'org',
    question: 'Avez-vous accès à des experts métier ?',
    context:
      "DDD sans domain experts disponibles produit un Ubiquitous Language artificiel — vocabulaire de développeurs, pas de métier. Premier facteur d'échec DDD selon Eric Evans.",
    choices: [
      {
        label: 'Oui, régulièrement disponibles',
        icon: '🤝',
        sub: 'PO technique, experts accessibles en sprint',
        next: 'qnfr_ddd',
      },
      {
        label: 'Accès limité / ponctuel',
        icon: '📋',
        sub: "Specs écrites, peu d'itérations avec le métier",
        next: 'qnfr_moderate',
      },
      {
        label: 'Non / Pas de domain experts',
        icon: '🚧',
        sub: "L'équipe dev modélise seule le domaine",
        next: 'qnfr_tests',
      },
    ],
  },
  qorg_saas: {
    id: 'qorg_saas',
    dimension: 'org',
    question: 'Comment votre équipe SaaS est-elle structurée ?',
    context:
      "Pour un SaaS, la cadence de livraison est souvent plus importante que la perfection architecturale initiale.",
    choices: [
      {
        label: 'Startup < 8 devs',
        icon: '🚀',
        sub: 'Vélocité primordiale, peu de spécialisation',
        next: 'qnfr_saas_small',
      },
      {
        label: 'Scale-up 8–30 devs',
        icon: '📈',
        sub: 'Équipes multiples, besoin de découplage',
        next: 'qnfr_saas_mid',
      },
      {
        label: 'Équipes distribuées 30+',
        icon: '🌍',
        sub: 'Multiple continents, time zones, squads',
        next: 'qnfr_saas_large',
      },
    ],
  },
  qorg_platform: {
    id: 'qorg_platform',
    dimension: 'org',
    question:
      'Vos équipes peuvent-elles être autonomes par domaine ?',
    context:
      "Une plateforme avec plusieurs Bounded Contexts nécessite que chaque BC soit owné par une équipe distincte. Sans cette autonomie, le DDD crée de la friction sans bénéfice.",
    choices: [
      {
        label: 'Oui — équipes par BC envisageables',
        icon: '✅',
        sub: 'Budget, recrutement et org le permettent',
        next: 'qnfr_ddd',
      },
      {
        label: 'Non — équipe unique sur tout',
        icon: '⚠️',
        sub: 'Contrainte budget / organisation',
        next: 'qnfr_moderate',
      },
    ],
  },
  qnfr_simple: {
    id: 'qnfr_simple',
    dimension: 'nfr',
    question:
      'Avez-vous des contraintes de performance ou disponibilité critiques ?',
    context:
      "Les NFR dures peuvent invalider un choix architectural par ailleurs excellent. Comme une maison construite sur des fondations inadaptées — le domaine peut être parfait, l'exécution catastrophique.",
    choices: [
      {
        label: 'Non — standard',
        icon: '✅',
        sub: '< 500ms P99, disponibilité 99.9%',
        next: 'qcost_simple',
      },
      {
        label: 'Haute fréquence',
        icon: '⚡',
        sub: '< 10ms P99, > 10k req/s',
        next: 'qcost_perf',
      },
      {
        label: 'Disponibilité critique',
        icon: '🔴',
        sub: '99.99%+ SLA, zero downtime deploys',
        next: 'qcost_ha',
      },
    ],
  },
  qnfr_moderate: {
    id: 'qnfr_moderate',
    dimension: 'nfr',
    question:
      'Quelles sont vos contraintes non-fonctionnelles prioritaires ?',
    context:
      "Un SLA de 99.99% = 52 minutes d'indisponibilité/an max. Soyez précis sur vos contraintes réelles.",
    choices: [
      {
        label: 'Temps de réponse < 50ms P99',
        icon: '⚡',
        sub: 'Latence critique, haute fréquence',
        next: 'qcost_perf',
      },
      {
        label: 'Conformité réglementaire',
        icon: '📜',
        sub: 'RGPD, SOC2, HIPAA, PCI-DSS, ISO 27001',
        next: 'qcost_compliance',
      },
      {
        label: 'Standard — aucune contrainte dure',
        icon: '✅',
        sub: 'Performances acceptables, SLA classique',
        next: 'qcost_moderate',
      },
    ],
  },
  qnfr_tests: {
    id: 'qnfr_tests',
    dimension: 'nfr',
    question: 'Quelle est votre exigence de testabilité ?',
    context:
      "Uncle Bob : \"Un test qui nécessite une infrastructure n'est pas un test unitaire — c'est un test d'intégration déguisé.\" La testabilité est une NFR architecturale.",
    choices: [
      {
        label: 'Tests unitaires sans infra',
        icon: '🧪',
        sub: 'TDD strict, 0 dépendance externe dans les tests',
        next: 'qcost_tests',
      },
      {
        label: "Tests d'intégration suffisants",
        icon: '🔬',
        sub: 'TestContainers, infra mock acceptable',
        next: 'qcost_moderate',
      },
      {
        label: 'Tests E2E uniquement',
        icon: '🌐',
        sub: 'Cypress, Playwright, pas de TDD',
        next: 'qcost_simple',
      },
    ],
  },
  qnfr_critical: {
    id: 'qnfr_critical',
    dimension: 'nfr',
    question: "Quelles contraintes réglementaires s'appliquent ?",
    context:
      "Finance/Santé/Legal imposent des contraintes architecturales : auditabilité, immutabilité, traçabilité. L'Event Sourcing répond naturellement à ces besoins.",
    choices: [
      {
        label: 'Audit trail complet',
        icon: '📋',
        sub: 'Chaque action traçable et réversible',
        next: 'qcost_audit',
      },
      {
        label: 'Isolation des données stricte',
        icon: '🔒',
        sub: 'Tenant isolation, données never mixed',
        next: 'qcost_compliance',
      },
      {
        label: 'SLA 99.99%+',
        icon: '🔴',
        sub: 'Zéro downtime, disaster recovery < 1h',
        next: 'qcost_ha',
      },
    ],
  },
  qnfr_ddd: {
    id: 'qnfr_ddd',
    dimension: 'nfr',
    question:
      'Vos Bounded Contexts ont-ils des contraintes de scalabilité indépendantes ?',
    context:
      "L'avantage clé du DDD : chaque BC peut avoir son propre modèle de déploiement. Mais si tout doit scaler de façon homogène, ce bénéfice disparaît.",
    choices: [
      {
        label: 'Oui — chaque BC a ses propres pics',
        icon: '📊',
        sub: 'Ex: catalogue stable, checkout saisonnier',
        next: 'qcost_ddd',
      },
      {
        label: 'Non — scalabilité homogène',
        icon: '📦',
        sub: 'Tous les BC ont le même profil de charge',
        next: 'qcost_moderate',
      },
    ],
  },
  qnfr_saas_small: {
    id: 'qnfr_saas_small',
    dimension: 'nfr',
    question:
      'Votre SaaS a-t-il des contraintes de performance critiques ?',
    context:
      "Pour une petite équipe SaaS, l'arbitrage est souvent : performance now vs maintenability later.",
    choices: [
      {
        label: 'Non — standard',
        icon: '✅',
        sub: 'Time-to-market prioritaire sur la perf',
        next: 'qcost_simple',
      },
      {
        label: 'Oui — haute fréquence',
        icon: '⚡',
        sub: 'Latence ou débit critique dès le départ',
        next: 'qcost_perf',
      },
    ],
  },
  qnfr_saas_mid: {
    id: 'qnfr_saas_mid',
    dimension: 'nfr',
    question:
      'Quels sont les principaux risques NFR pour votre scale-up ?',
    context:
      "À 8–30 devs, les goulots changent : ce n'est plus la performance du code mais la vitesse de déploiement.",
    choices: [
      {
        label: 'Vélocité de déploiement',
        icon: '🚀',
        sub: 'Plusieurs deploys/jour, feature flags',
        next: 'qcost_tests',
      },
      {
        label: 'Résilience',
        icon: '🛡️',
        sub: 'Zero downtime, circuit breakers',
        next: 'qcost_ha',
      },
      {
        label: 'Conformité',
        icon: '📜',
        sub: "SOC2, RGPD en cours d'obtention",
        next: 'qcost_compliance',
      },
    ],
  },
  qnfr_saas_large: {
    id: 'qnfr_saas_large',
    dimension: 'nfr',
    question:
      'Quelle est la contrainte NFR la plus critique à 30+ devs ?',
    context:
      "Au-delà de 30 devs, le principal ennemi n'est plus la performance mais le couplage organisationnel.",
    choices: [
      {
        label: 'Déploiements indépendants par équipe',
        icon: '🔬',
        sub: 'Chaque squad deploy sans coordination',
        next: 'qcost_ddd',
      },
      {
        label: 'Observabilité / Debugging distribué',
        icon: '🔭',
        sub: 'Traçage, métriques, alerting centralisé',
        next: 'qcost_ddd',
      },
    ],
  },
  qcost_simple: {
    id: 'qcost_simple',
    dimension: 'cost',
    question:
      "Quelle est la probabilité de changer d'avis sur les choix techniques ?",
    context:
      'Uncle Bob : "La bonne architecture maximise le nombre de décisions non prises." Plus vous pouvez reporter une décision, plus vous avez d\'informations pour la prendre correctement.',
    choices: [
      {
        label: 'Faible — stack stable',
        icon: '🔒',
        sub: 'Choix technologiques figés, peu de risque pivot',
        next: 'r_layered_mono',
      },
      {
        label: 'Moyen — quelques incertitudes',
        icon: '🎲',
        sub: 'DB ou framework pourrait changer',
        next: 'r_layered_clean',
      },
      {
        label: 'Élevé — stack incertain',
        icon: '🌊',
        sub: 'Domaine nouveau, technos non validées',
        next: 'r_hexagonal',
      },
    ],
  },
  qcost_moderate: {
    id: 'qcost_moderate',
    dimension: 'cost',
    question:
      'Sur quels composants le changement est-il le plus probable ?',
    context:
      '"Identifier ce qui est susceptible de changer et protéger ce qui ne doit pas changer." — Stable Dependencies Principle (Uncle Bob).',
    choices: [
      {
        label: 'Infrastructure (DB, cloud, APIs)',
        icon: '🔌',
        sub: 'Migration cloud, changement de DB probable',
        next: 'r_hexagonal_clean',
      },
      {
        label: 'Framework applicatif',
        icon: '🏗️',
        sub: 'NestJS → autre, Vue → React, etc.',
        next: 'r_clean_hexagonal',
      },
      {
        label: 'Règles métier',
        icon: '📐',
        sub: 'Le domaine lui-même est en mutation',
        next: 'r_ddd_clean',
      },
    ],
  },
  qcost_perf: {
    id: 'qcost_perf',
    dimension: 'cost',
    question:
      "Votre goulot d'étranglement performance est-il connu ?",
    context:
      '"Premature optimization is the root of all evil" — Knuth. Mais une architecture qui interdit les optimisations futures est aussi un problème.',
    choices: [
      {
        label: 'Oui — couche DB / I/O',
        icon: '💾',
        sub: 'Requêtes lentes, N+1 queries identifiés',
        next: 'r_hexagonal_clean',
      },
      {
        label: 'Oui — calcul CPU intensif',
        icon: '🔢',
        sub: 'Algorithmes lourds, traitement batch',
        next: 'r_clean_hexagonal',
      },
      {
        label: 'Non — à identifier en production',
        icon: '🔭',
        sub: 'Pas encore profilé, incertitude totale',
        next: 'r_hexagonal',
      },
    ],
  },
  qcost_tests: {
    id: 'qcost_tests',
    dimension: 'cost',
    question:
      "Votre domaine métier est-il susceptible d'évoluer rapidement ?",
    context:
      "La testabilité sans infrastructure est une assurance contre le coût du changement : un domaine bien testé se refactorise en confiance.",
    choices: [
      {
        label: 'Oui — règles métier fréquemment revues',
        icon: '🔄',
        sub: 'Sprints courts, pivots fréquents',
        next: 'r_hexagonal_clean',
      },
      {
        label: 'Non — domaine relativement stable',
        icon: '🔒',
        sub: 'Évolution incrémentale, peu de ruptures',
        next: 'r_clean_hexagonal',
      },
    ],
  },
  qcost_ha: {
    id: 'qcost_ha',
    dimension: 'cost',
    question: 'Comment gérez-vous les migrations sans downtime ?',
    context:
      "SLA 99.99% implique des contraintes de déploiement : blue/green, canary, feature flags. Ces patterns influencent le couplage entre composants.",
    choices: [
      {
        label: 'Blue/Green deployments',
        icon: '🔵',
        sub: 'Deux environnements, bascule instantanée',
        next: 'r_hexagonal_clean',
      },
      {
        label: 'Canary releases progressives',
        icon: '🐦',
        sub: 'Déploiement progressif sur un % du trafic',
        next: 'r_ddd_hexagonal',
      },
      {
        label: 'Feature flags',
        icon: '🚩',
        sub: 'Activation à chaud sans redéploiement',
        next: 'r_clean_hexagonal',
      },
    ],
  },
  qcost_compliance: {
    id: 'qcost_compliance',
    dimension: 'cost',
    question:
      'Votre modèle de données peut-il évoluer sans migration destructive ?',
    context:
      "La compliance impose souvent l'immuabilité et l'audit trail. L'Event Sourcing répond naturellement : chaque changement d'état est un événement persisté, jamais écrasé.",
    choices: [
      {
        label: 'Oui, Event Sourcing envisageable',
        icon: '📋',
        sub: 'Chaque état = somme des événements passés',
        next: 'r_ddd_hexagonal',
      },
      {
        label: 'Non, migrations classiques',
        icon: '🗃️',
        sub: 'ALTER TABLE, migrations versionnées',
        next: 'r_clean_hexagonal',
      },
    ],
  },
  qcost_audit: {
    id: 'qcost_audit',
    dimension: 'cost',
    question:
      "Avez-vous besoin de rejouer l'historique des décisions métier ?",
    context:
      "L'audit trail Finance/Santé peut nécessiter de recalculer un état passé. Event Sourcing + CQRS = réponse architecturale naturelle.",
    choices: [
      {
        label: 'Oui — Time Travel queries nécessaires',
        icon: '⏪',
        sub: "Rejouer l'état à n'importe quel instant T",
        next: 'r_ddd_hexagonal',
      },
      {
        label: "Non — log d'audit suffisant",
        icon: '📝',
        sub: 'Savoir qui a fait quoi, pas recalculer',
        next: 'r_ddd_clean',
      },
    ],
  },
  qcost_ddd: {
    id: 'qcost_ddd',
    dimension: 'cost',
    question:
      "Êtes-vous prêts à investir dans la complexité initiale du DDD ?",
    context:
      "Le DDD est un investissement économique : +20–30% les 3 premiers mois, remboursé en maintenabilité sur 12–18 mois.",
    choices: [
      {
        label: 'Oui — équipe et org alignées',
        icon: '✅',
        sub: 'Budget, temps et volonté politique disponibles',
        next: 'r_ddd_hexagonal',
      },
      {
        label: 'Partiellement — DDD tactique seulement',
        icon: '⚡',
        sub: 'Aggregates/Value Objects sans patterns stratégiques',
        next: 'r_ddd_clean',
      },
      {
        label: 'Non — trop complexe maintenant',
        icon: '⏳',
        sub: 'Réduire la complexité, revenir au DDD plus tard',
        next: 'r_hexagonal_clean',
      },
    ],
  },
  qcost_layered: {
    id: 'qcost_layered',
    dimension: 'cost',
    question:
      'Quelle est votre tolérance au risque de migration ?',
    context:
      "Migrer un Layered désorganisé vers Clean/Hexagonal en 3 phases : (1) DIP partout, (2) extraction domaine, (3) création des adapters. Chaque phase est indépendante et livrable en production.",
    choices: [
      {
        label: 'Migration progressive (Strangler Fig)',
        icon: '🌿',
        sub: 'Module par module, sans arrêter la prod',
        next: 'r_hexagonal',
      },
      {
        label: 'Refactoring couche par couche',
        icon: '🔧',
        sub: "DIP d'abord, puis extraction domaine progressive",
        next: 'r_clean_hexagonal',
      },
    ],
  },
  qcost_tech: {
    id: 'qcost_tech',
    dimension: 'cost',
    question:
      'Quelle technologie est la plus susceptible de changer ?',
    context:
      'Stable Dependencies Principle (Uncle Bob) : "Dépendez de ce qui est stable, protégez-vous de ce qui change."',
    choices: [
      {
        label: 'Base de données',
        icon: '💾',
        sub: 'Migration SQL→NoSQL, changement ORM, cloud DB',
        next: 'r_hexagonal',
      },
      {
        label: 'Framework backend',
        icon: '🏗️',
        sub: 'NestJS, Express, Fastify — potentiel pivot',
        next: 'r_clean_hexagonal',
      },
      {
        label: 'Services externes (APIs)',
        icon: '🔌',
        sub: 'Paiement, email, stockage, analytics',
        next: 'r_hexagonal_clean',
      },
    ],
  },
  q3_complex: {
    id: 'q3_complex',
    dimension: 'org',
    question: 'Avez-vous accès à des experts métier ?',
    context:
      "Le DDD nécessite une collaboration continue avec les domain experts. Sans elle, on construit un modèle de développeurs — expressif pour les devs, opaque pour le métier.",
    choices: [
      {
        label: 'Oui, régulièrement disponibles',
        icon: '🤝',
        sub: 'PO technique, experts accessibles chaque sprint',
        next: 'qnfr_ddd',
      },
      {
        label: 'Non / Accès limité',
        icon: '🚧',
        sub: "Specs figées, peu d'itérations avec le métier",
        next: 'qnfr_moderate',
      },
    ],
  },
  q3_scale: {
    id: 'q3_scale',
    dimension: 'domaine',
    question: 'Comment souhaitez-vous scaler ?',
    context:
      "Microservices ≠ scalabilité. Un monolithe bien designé scale horizontalement très efficacement. Le domaine justifie-t-il la complexité opérationnelle des microservices ?",
    choices: [
      {
        label: 'Microservices',
        icon: '🔬',
        sub: 'Déploiements indépendants par domaine',
        next: 'qorg_platform',
      },
      {
        label: 'Monolithe modulaire',
        icon: '📦',
        sub: 'Scalabilité horizontale sur le monolithe',
        next: 'qnfr_moderate',
      },
      {
        label: 'Hybride (strangler fig)',
        icon: '🌿',
        sub: 'Extraction progressive de services',
        next: 'qcost_moderate',
      },
    ],
  },
  q3_refacto_size: {
    id: 'q3_refacto_size',
    dimension: 'domaine',
    question:
      'Quelle est la taille de la base de code à migrer ?',
    context:
      '< 50k lignes : refactoring complet en 2–3 sprints envisageable. > 50k lignes : migration progressive = seule option raisonnable.',
    choices: [
      {
        label: '< 50k lignes',
        icon: '📄',
        sub: 'Refactoring global envisageable en quelques sprints',
        next: 'qcost_layered',
      },
      {
        label: '> 50k lignes',
        icon: '📚',
        sub: 'Migration progressive port par port nécessaire',
        next: 'qcost_layered',
      },
    ],
  },
  // Results
  r_layered_mono: {
    result: ['layered', 'monolithic'],
    confidence: 90,
    rationale:
      "Contexte YAGNI pur : MVP simple, stack stable, équipe réduite. Layered + Monolithique est la combinaison avec le meilleur rapport complexité/valeur. Appliquez le DIP dès le départ pour garder la porte ouverte vers Clean. Conway confirme : une seule équipe = un seul déployable cohérent.",
  },
  r_layered_clean: {
    result: ['layered', 'clean'],
    confidence: 80,
    rationale:
      "L'architecture duale pour les projets en croissance : Layered pour démarrer vite, Clean comme boussole d'évolution. Appliquez le Dependency Inversion Principle sur tous les repositories dès le sprint 1 — c'est le pont qui rend la migration progressive et non-destructive.",
  },
  r_layered: {
    result: ['layered'],
    confidence: 85,
    rationale:
      "Pour un outil interne, la Layered Architecture est le choix pragmatique optimal. Logique métier modérée, équipe familière. Appliquez strictement le DIP entre Business et Data Access pour éviter l'architecture transitive décrite par Uncle Bob.",
  },
  r_hexagonal: {
    result: ['hexagonal'],
    confidence: 88,
    rationale:
      "L'Architecture Hexagonale est la réponse naturelle quand le changement technologique est votre principal risque. Les Ports sont vos assurances : changez l'Adapter (DB, API, canal), le domaine ne voit rien. Conway favorable : chaque Port = contrat entre équipes Driving et Driven.",
  },
  r_hexagonal_clean: {
    result: ['hexagonal', 'clean'],
    confidence: 85,
    rationale:
      "Le duo le plus polyvalent pour équipes seniors. Hexagonale pour la praticité des Ports & Adapters et la testabilité. Clean pour la rigueur des cercles. Même structure de fichiers — choisissez le vocabulaire. Votre NFR de testabilité est satisfaite sans infrastructure.",
  },
  r_clean_hexagonal: {
    result: ['clean', 'hexagonal'],
    confidence: 83,
    rationale:
      "Clean Architecture en boussole, Hexagonale en implémentation. Uncle Bob fournit le framework conceptuel (Dependency Rule, cercles), Cockburn fournit le pattern concret (Ports, Adapters). Commencez par établir la Dependency Rule, puis nommez vos interfaces comme des Ports.",
  },
  r_clean_onion: {
    result: ['clean', 'onion'],
    confidence: 78,
    rationale:
      "Pour un monolithe modulaire à longue durée de vie, Clean et Onion sont quasi-équivalents. Choisissez Onion si votre équipe préfère des Domain Services explicites comme couche intermédiaire.",
  },
  r_ddd_clean: {
    result: ['ddd', 'clean'],
    confidence: 82,
    rationale:
      "DDD + Clean Architecture : Evans modélise le quoi (Aggregates, Bounded Contexts, Domain Events), Uncle Bob structure le comment (Dependency Rule, cercles). Les Aggregates DDD deviennent les Entities de Clean. L'Ubiquitous Language traverse toutes les couches.",
  },
  r_ddd_hexagonal: {
    result: ['ddd', 'hexagonal'],
    confidence: 87,
    rationale:
      "La combinaison de référence pour les domaines critiques. Les Aggregates DDD forment le cœur pur de l'hexagone. Les Ports définissent les contrats des services externes. Conway parfaitement alignée : 1 Bounded Context = 1 hexagone = 1 équipe autonome.",
  },
}

// ── Composable ─────────────────────────────────────────────────────────────
export function useArchitectureTree() {
  const history = ref<string[]>(['q1'])
  const answers = ref<{ question: string; answer: string; dimension: string }[]>([])
  const finished = ref(false)

  const currentNodeId = computed(() => history.value[history.value.length - 1])
  const currentNode = computed(() => TREE[currentNodeId.value] as QuestionNode)
  const resultNode = computed(() =>
    finished.value ? (TREE[currentNodeId.value] as ResultNode) : null,
  )
  const progress = computed(() =>
    Math.min(((history.value.length - 1) / 8) * 100, 95),
  )
  const answersByDim = computed(() =>
    answers.value.reduce(
      (acc: Record<string, string[]>, a) => {
        if (!acc[a.dimension]) acc[a.dimension] = []
        acc[a.dimension].push(a.answer)
        return acc
      },
      {},
    ),
  )

  function choose(choice: Choice) {
    answers.value.push({
      question: currentNode.value.question,
      answer: choice.label,
      dimension: currentNode.value.dimension,
    })
    history.value.push(choice.next)
    if ((TREE[choice.next] as ResultNode)?.result !== undefined) {
      finished.value = true
    }
  }

  function goBack() {
    if (history.value.length <= 1) return
    history.value.pop()
    answers.value.pop()
    finished.value = false
  }

  function restart() {
    history.value = ['q1']
    answers.value = []
    finished.value = false
  }

  return {
    // Constants
    DIM_COLORS,
    DIM_LABELS,
    ARCHITECTURES,
    TREE,
    // State
    history,
    answers,
    finished,
    // Computed
    currentNodeId,
    currentNode,
    resultNode,
    progress,
    answersByDim,
    // Actions
    choose,
    goBack,
    restart,
  }
}
