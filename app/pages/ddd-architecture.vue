<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (DDD cards, comparison items, rule cards, trap cards,
 *          pillar rows, legend items, lifecycle states) are modeled as typed arrays and
 *          rendered via v-for, while unique prose, code blocks, and diagrams stay as
 *          direct template markup.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface MetaTag {
  label: string
  colorClass: string
}

interface DddCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
  quote?: string
}

interface LayerRow {
  color: string
  num: string
  title: string
  description: string
  files: { label: string; colorClass: string }[]
  isCore?: boolean
}

interface RuleCard {
  colorClass: string
  name: string
  title: string
  description: string
}

interface LifecycleState {
  label: string
  sublabel: string
  color: string
  borderColor: string
  bgColor: string
}

interface LifecycleArrow {
  symbol: string
  text: string
  color?: string
}

interface ComparisonItem {
  text: string
}

interface ComparisonColumn {
  headerClass: string
  headerLabel: string
  dotColor: string
  items: ComparisonItem[]
}

interface ChecklistItem {
  num: number
  question: string
  voAnswer: string
  entAnswer: string
}

interface TrapCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
}

interface PillarRow {
  concept: string
  role: string
  rule: string
}

interface LegendItem {
  color: string
  label: string
}

const metaTags: MetaTag[] = [
  { label: 'Bounded Context', colorClass: 'green' },
  { label: 'Aggregate', colorClass: 'green' },
  { label: 'Domain Events', colorClass: 'green' },
  { label: 'Eric Evans', colorClass: 'yellow' },
  { label: 'Tactical + Strategic', colorClass: 'purple' },
]

const strategicCards: DddCard[] = [
  {
    icon: '\u{1F5FA}\uFE0F',
    colorClass: 'green',
    name: 'Bounded Context',
    title: 'Contexte Delimit\u00e9',
    description:
      "Fronti\u00e8re explicite dans laquelle un mod\u00e8le de domaine a une signification pr\u00e9cise et coh\u00e9rente. Un m\u00eame mot peut signifier des choses diff\u00e9rentes dans deux Bounded Contexts distincts.",
    tags: ['Fronti\u00e8re', 'Autonomie', 'Coh\u00e9rence'],
    quote: '\u00ab Client \u00bb dans le contexte Commande \u2260 \u00ab Client \u00bb dans le contexte CRM.',
  },
  {
    icon: '\u{1F5E3}\uFE0F',
    colorClass: 'yellow',
    name: 'Ubiquitous Language',
    title: 'Langage Ubiquitaire',
    description:
      "Vocabulaire commun entre d\u00e9veloppeurs et experts m\u00e9tier, utilis\u00e9 partout\u00a0: dans les r\u00e9unions, le code, les tests, la documentation. Si le code dit <code>passer_commande()</code>, le m\u00e9tier dit aussi \u00ab\u00a0passer commande\u00a0\u00bb.",
    tags: ['Communication', 'Alignement', 'Coh\u00e9rence'],
    quote: 'Le code est la documentation. Le vocabulaire m\u00e9tier EST le code.',
  },
  {
    icon: '\u{1F9ED}',
    colorClass: 'orange',
    name: 'Context Map',
    title: 'Carte des Contextes',
    description:
      "Repr\u00e9sentation des relations entre Bounded Contexts. D\u00e9finit comment ils communiquent\u00a0: Shared Kernel, Customer/Supplier, Anti-Corruption Layer, Published Language\u2026",
    tags: ['ACL', 'Shared Kernel', 'Relations'],
  },
]

const tacticalCards: DddCard[] = [
  {
    icon: '\u{1F3F0}',
    colorClass: 'purple',
    name: 'Aggregate',
    title: 'Fronti\u00e8re de Coh\u00e9rence',
    description:
      "Grappe d\u2019Entities et de Value Objects trait\u00e9e comme une unit\u00e9 atomique. Un seul point d\u2019entr\u00e9e (la Racine), une seule fronti\u00e8re transactionnelle. Les invariants m\u00e9tier sont garantis \u00e0 l\u2019int\u00e9rieur.",
    tags: ['Root', 'Invariants', 'Transaction'],
    quote: 'Le gardien de la coh\u00e9rence m\u00e9tier.',
  },
  {
    icon: '\u{1FAAA}',
    colorClass: 'green',
    name: 'Entity',
    title: 'Objet avec Identit\u00e9',
    description:
      "Objet d\u00e9fini par son identit\u00e9 unique, pas par ses attributs. Deux Entities avec les m\u00eames donn\u00e9es sont distinctes si leurs IDs diff\u00e8rent. Mutable, avec un cycle de vie propre.",
    tags: ['ID unique', 'Mutable', 'Cycle de vie'],
  },
  {
    icon: '\u{1F48E}',
    colorClass: 'cyan',
    name: 'Value Object',
    title: 'Objet sans Identit\u00e9',
    description:
      "Objet d\u00e9fini enti\u00e8rement par ses attributs. Immuable, sans identit\u00e9 propre. Deux Value Objects avec les m\u00eames donn\u00e9es sont \u00e9gaux et interchangeables.",
    tags: ['Immutable', '\u00c9galit\u00e9 par valeur', 'Sans ID'],
  },
  {
    icon: '\u{1F4E2}',
    colorClass: 'yellow',
    name: 'Domain Event',
    title: '\u00c9v\u00e9nement Domaine',
    description:
      "Quelque chose qui s\u2019est pass\u00e9 dans le domaine. Nomm\u00e9 au pass\u00e9, immuable, dat\u00e9. D\u00e9clenche des r\u00e9actions dans d\u2019autres Aggregates ou Bounded Contexts sans couplage direct.",
    tags: ['CommandeConfirm\u00e9e', 'D\u00e9couplage', 'Pass\u00e9'],
  },
  {
    icon: '\u{1F527}',
    colorClass: 'orange',
    name: 'Domain Service',
    title: 'Service Domaine',
    description:
      "Op\u00e9ration m\u00e9tier sans \u00e9tat qui ne se rattache naturellement \u00e0 aucune Entity ou Value Object. Contient de la logique m\u00e9tier qui implique plusieurs Aggregates ou des calculs transverses.",
    tags: ['Sans \u00e9tat', 'Inter-entit\u00e9s'],
  },
  {
    icon: '\u{1F5C4}\uFE0F',
    colorClass: 'pink',
    name: 'Repository',
    title: 'Abstraction de Persistance',
    description:
      "Interface d\u00e9finie dans le Domain qui donne l\u2019illusion d\u2019une collection en m\u00e9moire. L\u2019impl\u00e9mentation SQL/NoSQL vit dans l\u2019Infrastructure \u2014 le Domain ne la conna\u00eet jamais.",
    tags: ['Interface', 'DIP', 'Persistance'],
    quote: '\u00ab La DB est un d\u00e9tail. \u00bb \u2014 Uncle Bob',
  },
]

const layerRows: LayerRow[] = [
  {
    color: '#4a9ee8',
    num: 'Pr\u00e9sentation',
    title: 'Presentation Layer',
    description:
      "Re\u00e7oit les requ\u00eates, d\u00e9l\u00e8gue \u00e0 l\u2019Application Layer. Ne contient aucune logique m\u00e9tier.",
    files: [
      { label: 'REST Controllers', colorClass: 'lf-blue' },
      { label: 'GraphQL Resolvers', colorClass: 'lf-blue' },
      { label: 'CLI Adapters', colorClass: 'lf-blue' },
      { label: "DTOs d'entr\u00e9e", colorClass: 'lf-blue' },
    ],
  },
  {
    color: '#a78bfa',
    num: 'Application',
    title: 'Application Layer \u2014 Use Cases',
    description:
      "Orchestre sans logique m\u00e9tier. Coordonne les appels aux Repositories, dispatche les Domain Events. D\u00e9finit les transactions.",
    files: [
      { label: 'PasserCommandeUseCase', colorClass: 'lf-purple' },
      { label: 'Command Handlers', colorClass: 'lf-purple' },
      { label: 'Query Handlers', colorClass: 'lf-purple' },
      { label: 'CQRS', colorClass: 'lf-purple' },
    ],
  },
  {
    color: '#4ae8b0',
    num: 'Domain \u2605',
    title: 'Domain Layer \u2014 Le C\u0153ur M\u00e9tier',
    description:
      "Ind\u00e9pendant de tout framework. Contient toute l\u2019intelligence m\u00e9tier. Ne d\u00e9pend de RIEN d\u2019autre. C\u2019est la r\u00e8gle d\u2019or.",
    files: [
      { label: 'Entities', colorClass: 'lf-green' },
      { label: 'Value Objects', colorClass: 'lf-green' },
      { label: 'Aggregates', colorClass: 'lf-green' },
      { label: 'Domain Events', colorClass: 'lf-green' },
      { label: 'Domain Services', colorClass: 'lf-green' },
      { label: 'Repository (interfaces)', colorClass: 'lf-red' },
      { label: 'Specifications', colorClass: 'lf-green' },
    ],
    isCore: true,
  },
  {
    color: '#e87a4a',
    num: 'Infrastructure',
    title: 'Infrastructure Layer',
    description:
      "Impl\u00e9mentations techniques. D\u00e9pend du Domain via inversion de d\u00e9pendance (DIP). Rempla\u00e7able sans toucher au Domain.",
    files: [
      { label: 'PostgresCommandeRepo', colorClass: 'lf-orange' },
      { label: 'RabbitMQ EventBus', colorClass: 'lf-orange' },
      { label: 'StripeService', colorClass: 'lf-orange' },
      { label: 'SendGridMailer', colorClass: 'lf-orange' },
    ],
  },
]

const ruleCards: RuleCard[] = [
  {
    colorClass: 'purple',
    name: 'R\u00e8gle 1',
    title: 'Acc\u00e8s par la Racine uniquement',
    description:
      "Pour modifier quoi que ce soit dans l\u2019Aggregate, on passe obligatoirement par l\u2019Aggregate Root. Aucun acc\u00e8s direct aux Entities ou Value Objects internes depuis l\u2019ext\u00e9rieur.",
  },
  {
    colorClass: 'green',
    name: 'R\u00e8gle 2',
    title: '1 transaction = 1 seul Aggregate',
    description:
      "Une transaction ne modifie qu\u2019un seul Aggregate \u00e0 la fois. Si deux Aggregates doivent changer, on utilise des Domain Events et la coh\u00e9rence \u00e9ventuelle.",
  },
  {
    colorClass: 'orange',
    name: 'R\u00e8gle 3',
    title: 'R\u00e9f\u00e9rence externe = ID uniquement',
    description:
      "Un Aggregate ne r\u00e9f\u00e9rence jamais un autre Aggregate par objet. Seulement par son ID (Value Object typ\u00e9). Cela garantit l\u2019ind\u00e9pendance et la performance.",
  },
  {
    colorClass: 'yellow',
    name: 'R\u00e8gle 4',
    title: 'Les invariants sont garantis par la Racine',
    description:
      "C\u2019est la Racine qui v\u00e9rifie toutes les r\u00e8gles m\u00e9tier avant chaque mutation. Si un invariant est viol\u00e9, la Racine l\u00e8ve une exception \u2014 l\u2019\u00e9tat reste coh\u00e9rent.",
  },
  {
    colorClass: 'cyan',
    name: 'R\u00e8gle 5',
    title: 'Pr\u00e9f\u00e9rer les petits Aggregates',
    description:
      "Plus l\u2019Aggregate est petit, plus il est performant (moins de donn\u00e9es charg\u00e9es) et moins il g\u00e9n\u00e8re de conflits de concurrence. Un Aggregate id\u00e9al a 1 \u00e0 3 Entities.",
  },
  {
    colorClass: 'pink',
    name: 'R\u00e8gle 6',
    title: 'Communication inter-Aggregates via Events',
    description:
      "Deux Aggregates ne s\u2019appellent jamais directement. L\u2019Aggregate A \u00e9met un Domain Event, un handler r\u00e9agit et modifie l\u2019Aggregate B dans une transaction s\u00e9par\u00e9e.",
  },
]

const lifecycleStates: LifecycleState[] = [
  { label: 'Factory', sublabel: 'cr\u00e9ation', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.4)', bgColor: 'rgba(167,139,250,0.08)' },
  { label: 'EN_ATTENTE', sublabel: 'new', color: '#e8c84a', borderColor: 'rgba(232,200,74,0.4)', bgColor: 'rgba(232,200,74,0.08)' },
  { label: 'EN_ATTENTE', sublabel: 'avec lignes', color: '#4ae8b0', borderColor: 'rgba(74,232,176,0.4)', bgColor: 'rgba(74,232,176,0.08)' },
  { label: 'CONFIRMEE', sublabel: '\u21B3 event \u00e9mis', color: '#4a9ee8', borderColor: 'rgba(74,158,232,0.4)', bgColor: 'rgba(74,158,232,0.08)' },
  { label: 'EXPEDIEE', sublabel: 'terminal', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.4)', bgColor: 'rgba(167,139,250,0.08)' },
]

const lifecycleArrows: LifecycleArrow[] = [
  { symbol: '\u2192', text: 'cr\u00e9e' },
  { symbol: '\u2192', text: 'ajouterProduit()' },
  { symbol: '\u2192', text: 'confirmer()' },
  { symbol: '\u2192', text: 'expedier()' },
]

const voItems: ComparisonColumn = {
  headerClass: 'vo',
  headerLabel: '\u{1F48E} Value Object',
  dotColor: '#22d3ee',
  items: [
    { text: '\u00c9galit\u00e9 par valeur \u2014 deux VO avec les m\u00eames donn\u00e9es sont \u00e9gaux' },
    { text: 'Immuable \u2014 on ne modifie pas un VO, on en cr\u00e9e un nouveau' },
    { text: 'Pas d\u2019identit\u00e9 propre \u2014 aucun ID' },
    { text: 'Pas de cycle de vie \u2014 il na\u00eet et meurt avec son Entity' },
    { text: 'Partage s\u00e9curis\u00e9 \u2014 on peut le passer partout sans risque' },
  ],
}

const entItems: ComparisonColumn = {
  headerClass: 'ent',
  headerLabel: '\u{1FAAA} Entity',
  dotColor: '#4ae8b0',
  items: [
    { text: '\u00c9galit\u00e9 par identit\u00e9 \u2014 seul l\u2019ID compte pour la comparaison' },
    { text: 'Mutable \u2014 ses attributs changent au cours du temps' },
    { text: 'ID unique obligatoire \u2014 c\u2019est sa raison d\u2019\u00eatre' },
    { text: 'Cycle de vie propre \u2014 cr\u00e9ation, modification, archivage' },
    { text: 'Partage avec pr\u00e9caution \u2014 risque de mutation ext\u00e9rieure' },
  ],
}

const checklistItems: ChecklistItem[] = [
  { num: 1, question: 'Se soucie-t-on de QUELLE instance c\u2019est\u00a0?', voAnswer: 'Non \u2192 VO', entAnswer: 'Oui \u2192 Entity' },
  { num: 2, question: 'Si je remplace cet objet par un autre avec les m\u00eames donn\u00e9es, est-ce que \u00e7a change quelque chose\u00a0?', voAnswer: 'Non \u2192 VO (billet)', entAnswer: 'Oui \u2192 Entity (passeport)' },
  { num: 3, question: 'Cet objet a-t-il une vie propre \u2014 on le cr\u00e9e, on le suit, on l\u2019archive\u00a0?', voAnswer: 'Non \u2192 VO', entAnswer: 'Oui \u2192 Entity' },
  { num: 4, question: 'L\u2019objet change-t-il au cours du temps tout en restant le m\u00eame objet\u00a0?', voAnswer: 'Non \u2192 VO', entAnswer: 'Oui \u2192 Entity' },
  { num: 5, question: 'A-t-on besoin de le retrouver par son identit\u00e9 en base de donn\u00e9es\u00a0?', voAnswer: 'Non \u2192 VO', entAnswer: 'Oui \u2192 Entity' },
]

const eventsWithout: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Sans Domain Events \u2014 Couplage fort',
  dotColor: '#e84a7a',
  items: [
    { text: 'Le Use Case appelle directement le service de stock, le mailer, le CRM\u2026' },
    { text: 'Ajouter un effet de bord = modifier le Use Case existant' },
    { text: 'Impossible de tester la logique m\u00e9tier isol\u00e9ment' },
    { text: 'Un \u00e9chec dans le mailer fait \u00e9chouer toute la commande' },
  ],
}

const eventsWith: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Avec Domain Events \u2014 D\u00e9couplage',
  dotColor: '#4ae8b0',
  items: [
    { text: 'L\u2019Aggregate \u00e9met un event \u2014 il ne sait pas qui \u00e9coute' },
    { text: 'Ajouter un effet de bord = ajouter un handler, sans toucher au code existant' },
    { text: 'Chaque handler est testable ind\u00e9pendamment' },
    { text: 'Un \u00e9chec dans le mailer ne bloque pas la confirmation' },
  ],
}

const trapCards: TrapCard[] = [
  {
    icon: '\u{1F418}',
    colorClass: 'pink',
    name: 'Pi\u00e8ge 1',
    title: 'L\u2019Aggregate trop gros',
    description:
      "Un Aggregate \u00ab Commande \u00bb qui contient le Client, les Produits, l\u2019Historique, les Factures\u2026 Trop d\u2019Entities = trop de conflits de concurrence, trop de donn\u00e9es charg\u00e9es, trop de couplage.",
    tags: ['Performance', 'Concurrence', 'D\u00e9coupage'],
  },
  {
    icon: '\u{1F517}',
    colorClass: 'orange',
    name: 'Pi\u00e8ge 2',
    title: 'R\u00e9f\u00e9rence directe entre Aggregates',
    description:
      "Stocker une r\u00e9f\u00e9rence objet vers un autre Aggregate au lieu de son ID. R\u00e9sultat\u00a0: couplage fort, probl\u00e8mes de lazy loading, transactions qui d\u00e9bordent.",
    tags: ['ID uniquement', 'D\u00e9couplage', 'Performance'],
  },
  {
    icon: '\u{1F9E0}',
    colorClass: 'yellow',
    name: 'Pi\u00e8ge 3',
    title: 'Logique m\u00e9tier dans le Use Case',
    description:
      "Le Use Case contient des <code>if</code> m\u00e9tier, des calculs de prix, des validations complexes. Il devrait seulement orchestrer\u00a0: cr\u00e9er, d\u00e9l\u00e9guer, persister, dispatcher.",
    tags: ['Orchestration', 'D\u00e9l\u00e9gation', 'S\u00e9paration'],
  },
  {
    icon: '\u{1F6AA}',
    colorClass: 'purple',
    name: 'Pi\u00e8ge 4',
    title: 'Exposer les collections internes',
    description:
      "Retourner un tableau mutable depuis l\u2019Aggregate. L\u2019ext\u00e9rieur peut alors modifier la collection sans passer par la Racine \u2014 les invariants sont contourn\u00e9s.",
    tags: ['Encapsulation', 'Invariants', 'Readonly'],
  },
  {
    icon: '\u{1F4ED}',
    colorClass: 'green',
    name: 'Pi\u00e8ge 5',
    title: 'Oublier les Domain Events',
    description:
      "Appeler directement les services depuis le Use Case au lieu d\u2019\u00e9mettre des events. R\u00e9sultat\u00a0: couplage temporel, impossible d\u2019ajouter un handler sans modifier le code existant.",
    tags: ['Open/Closed', 'D\u00e9couplage', 'Extensibilit\u00e9'],
  },
  {
    icon: '\u{1F3D7}\uFE0F',
    colorClass: 'blue',
    name: 'Pi\u00e8ge 6',
    title: 'Confondre Entity TypeORM et Entity Domain',
    description:
      "L\u2019Entity TypeORM est un mod\u00e8le de persistance avec d\u00e9corateurs <code>@Entity</code> <code>@Column</code>. L\u2019Entity Domain est un objet pur sans d\u00e9pendance technique. Ce sont deux choses compl\u00e8tement diff\u00e9rentes.",
    tags: ['Mapping', 'S\u00e9paration', 'Domain pur'],
  },
]

const pillarRows: PillarRow[] = [
  { concept: 'Ubiquitous Language', role: 'Langage commun d\u00e9vs \u2194 experts', rule: 'Le code utilise les m\u00eames termes que le m\u00e9tier' },
  { concept: 'Bounded Context', role: 'Fronti\u00e8re explicite du mod\u00e8le', rule: 'Un mot = une d\u00e9finition dans un contexte' },
  { concept: 'Entity', role: 'Objet avec identit\u00e9 unique', rule: '\u00c9galit\u00e9 par ID, cycle de vie propre' },
  { concept: 'Value Object', role: 'Objet sans identit\u00e9, immuable', rule: '\u00c9galit\u00e9 par valeur, interchangeable' },
  { concept: 'Aggregate', role: 'Fronti\u00e8re de coh\u00e9rence transactionnelle', rule: 'Acc\u00e8s par la Racine, 1 tx = 1 Aggregate' },
  { concept: 'Domain Event', role: 'Fait pass\u00e9 dans le domaine', rule: 'Immuable, dat\u00e9, d\u00e9clenche des r\u00e9actions' },
  { concept: 'Repository', role: 'Abstraction de persistance', rule: 'Interface dans Domain, impl dans Infra' },
]

const legendItems: LegendItem[] = [
  { color: '#a78bfa', label: 'Aggregate / Root' },
  { color: '#4ae8b0', label: 'Entity' },
  { color: '#22d3ee', label: 'Value Object' },
  { color: '#e8c84a', label: 'Domain Event' },
  { color: '#e84a7a', label: 'Repository / Interface' },
  { color: '#e87a4a', label: 'Infrastructure' },
  { color: '#4a9ee8', label: 'Application / Use Cases' },
]

const fileTreeHtml = `<span class="ft-dir">src/</span>
\u251C\u2500\u2500 <span class="ft-dir">commande/</span>                          <span class="ft-gray">\u2190 Bounded Context</span>
\u2502   \u251C\u2500\u2500 <span class="ft-dir">domain/</span>                        <span class="ft-gray">\u2190 Noyau m\u00e9tier (0 d\u00e9pendance externe)</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-green">Commande.ts</span>              <span class="ft-gray">\u2190 Aggregate Root</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-green">LigneCommande.ts</span>         <span class="ft-gray">\u2190 Entity interne</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-cyan">Montant.ts</span>               <span class="ft-gray">\u2190 Value Object</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-cyan">Adresse.ts</span>               <span class="ft-gray">\u2190 Value Object</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-cyan">CommandeId.ts</span>            <span class="ft-gray">\u2190 Value Object (ID typ\u00e9)</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-yellow">CommandeConfirmeeEvent.ts</span> <span class="ft-gray">\u2190 Domain Event</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-red">CommandeRepository.ts</span>    <span class="ft-gray">\u2190 Interface (port de sortie)</span>
\u2502   \u2502   \u2514\u2500\u2500 <span class="ft-orange">PrixCalculateurService.ts</span><span class="ft-gray">\u2190 Domain Service</span>
\u2502   \u251C\u2500\u2500 <span class="ft-dir">application/</span>               <span class="ft-gray">\u2190 Orchestration, pas de logique m\u00e9tier</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-purple">PasserCommandeUseCase.ts</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-purple">AnnulerCommandeUseCase.ts</span>
\u2502   \u2502   \u2514\u2500\u2500 <span class="ft-purple">GetCommandeQuery.ts</span>
\u2502   \u251C\u2500\u2500 <span class="ft-dir">infrastructure/</span>            <span class="ft-gray">\u2190 Impl\u00e9mentations techniques</span>
\u2502   \u2502   \u251C\u2500\u2500 <span class="ft-orange">PostgresCommandeRepository.ts</span> <span class="ft-gray">\u2190 implements CommandeRepository</span>
\u2502   \u2502   \u2514\u2500\u2500 <span class="ft-orange">CommandeMapper.ts</span>        <span class="ft-gray">\u2190 SQL row \u2194 Domain object</span>
\u2502   \u2514\u2500\u2500 <span class="ft-dir">presentation/</span>              <span class="ft-gray">\u2190 HTTP, CLI, GraphQL</span>
\u2502       \u2514\u2500\u2500 <span class="ft-blue">CommandeController.ts</span>
\u251C\u2500\u2500 <span class="ft-dir">paiement/</span>                          <span class="ft-gray">\u2190 Autre Bounded Context</span>
\u2514\u2500\u2500 <span class="ft-dir">livraison/</span>                         <span class="ft-gray">\u2190 Autre Bounded Context</span>`

const codeBlockAggregateOop = `<span class="kw">type</span> <span class="ty">StatutCommande</span> = <span class="str">'EN_ATTENTE'</span> | <span class="str">'CONFIRMEE'</span> | <span class="str">'EXPEDIEE'</span> | <span class="str">'ANNULEE'</span>;

<span class="kw">class</span> <span class="ty">Commande</span> {
  <span class="kw">private readonly</span> _lignes: <span class="ty">LigneCommande</span>[] = [];
  <span class="kw">private</span> _statut: <span class="ty">StatutCommande</span> = <span class="str">'EN_ATTENTE'</span>;
  <span class="kw">private readonly</span> _evenements: <span class="ty">DomainEvent</span>[] = [];

  <span class="kw">private constructor</span>(
    <span class="kw">readonly</span> id: <span class="ty">CommandeId</span>,
    <span class="kw">private readonly</span> _clientId: <span class="ty">string</span>,
  ) {}

  <span class="cm">// Factory method \u2014 seul point de cr\u00e9ation</span>
  <span class="kw">static</span> <span class="fn">creer</span>(clientId: <span class="ty">string</span>): <span class="ty">Commande</span> {
    <span class="kw">if</span> (!clientId) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Client obligatoire'</span>);
    <span class="kw">return new</span> <span class="ty">Commande</span>(<span class="ty">CommandeId</span>.<span class="fn">nouveau</span>(), clientId);
  }

  <span class="cm">// Comportement m\u00e9tier \u2014 invariants v\u00e9rifi\u00e9s ici</span>
  <span class="fn">ajouterProduit</span>(produitId: <span class="ty">ProduitId</span>, quantite: <span class="ty">number</span>, prix: <span class="ty">Montant</span>): <span class="ty">void</span> {
    <span class="kw">this</span>.<span class="fn">verifierEtat</span>(<span class="str">'EN_ATTENTE'</span>, <span class="str">'ajouterProduit'</span>);
    <span class="kw">if</span> (<span class="kw">this</span>._lignes.length &gt;= <span class="num">10</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Maximum 10 produits par commande'</span>);
    <span class="kw">if</span> (<span class="kw">this</span>._lignes.<span class="fn">some</span>(l =&gt; l.produitId.<span class="fn">estEgalA</span>(produitId)))
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Produit d\u00e9j\u00e0 pr\u00e9sent'</span>);

    <span class="kw">this</span>._lignes.<span class="fn">push</span>(<span class="ty">LigneCommande</span>.<span class="fn">creer</span>(produitId, quantite, prix));
    <span class="kw">this</span>._evenements.<span class="fn">push</span>(<span class="kw">new</span> <span class="ty">ProduitAjouteEvent</span>(<span class="kw">this</span>.id, produitId));
  }

  <span class="fn">confirmer</span>(): <span class="ty">void</span> {
    <span class="kw">this</span>.<span class="fn">verifierEtat</span>(<span class="str">'EN_ATTENTE'</span>, <span class="str">'confirmer'</span>);
    <span class="kw">if</span> (<span class="kw">this</span>._lignes.length === <span class="num">0</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Commande vide'</span>);

    <span class="kw">this</span>._statut = <span class="str">'CONFIRMEE'</span>;
    <span class="kw">this</span>._evenements.<span class="fn">push</span>(
      <span class="kw">new</span> <span class="ty">CommandeConfirmeeEvent</span>(<span class="kw">this</span>.id, <span class="kw">this</span>._clientId, <span class="kw">this</span>.<span class="fn">calculerTotal</span>())
    );
  }

  <span class="fn">calculerTotal</span>(): <span class="ty">Montant</span> {
    <span class="kw">return this</span>._lignes.<span class="fn">reduce</span>(
      (acc, ligne) =&gt; acc.<span class="fn">ajouter</span>(ligne.sousTotal),
      <span class="ty">Montant</span>.<span class="fn">de</span>(<span class="num">0</span>)
    );
  }

  <span class="cm">// Le Use Case collecte et dispatche les events APR\u00c8S persistance</span>
  <span class="fn">collecterEvenements</span>(): <span class="ty">DomainEvent</span>[] {
    <span class="kw">const</span> evts = [...<span class="kw">this</span>._evenements];
    <span class="kw">this</span>._evenements.length = <span class="num">0</span>;
    <span class="kw">return</span> evts;
  }

  <span class="kw">private</span> <span class="fn">verifierEtat</span>(attendu: <span class="ty">StatutCommande</span>, op: <span class="ty">string</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>._statut !== attendu)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">\`"\${op}" impossible \u2014 statut: \${this._statut}\`</span>);
  }
}`

const codeBlockAggregateFp = `<span class="cm">// Types alg\u00e9briques \u2014 l'\u00e9tat est un type pur, sans classe</span>
<span class="kw">type</span> <span class="ty">Commande</span> = <span class="ty">Readonly</span>&lt;{
  id: <span class="ty">string</span>; clientId: <span class="ty">string</span>;
  lignes: <span class="kw">readonly</span> <span class="ty">LigneCommande</span>[];
  statut: <span class="ty">StatutCommande</span>;
}&gt;;

<span class="cm">// R\u00e9sultat : nouvel \u00e9tat + \u00e9v\u00e9nements \u00e9mis \u2014 aucun effet de bord</span>
<span class="kw">type</span> <span class="ty">CommandeResult</span> = { commande: <span class="ty">Commande</span>; events: <span class="ty">DomainEvent</span>[] };

<span class="kw">const</span> <span class="fn">ajouterProduit</span> = (
  commande: <span class="ty">Commande</span>, produitId: <span class="ty">string</span>,
  quantite: <span class="ty">number</span>, prix: <span class="ty">number</span>
): <span class="ty">CommandeResult</span> =&gt; {
  <span class="kw">if</span> (commande.statut !== <span class="str">'EN_ATTENTE'</span>) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Non modifiable'</span>);
  <span class="kw">if</span> (commande.lignes.length &gt;= <span class="num">10</span>)   <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Max 10 lignes'</span>);

  <span class="kw">return</span> {
    <span class="cm">// Spread = nouvel objet, l'original est intact</span>
    commande: { ...commande, lignes: [...commande.lignes, { produitId, quantite, prix }] },
    events: [{ type: <span class="str">'PRODUIT_AJOUTE'</span>, commandeId: commande.id, produitId }],
  };
};

<span class="kw">const</span> <span class="fn">confirmerCommande</span> = (commande: <span class="ty">Commande</span>): <span class="ty">CommandeResult</span> =&gt; {
  <span class="kw">if</span> (commande.lignes.length === <span class="num">0</span>) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Commande vide'</span>);
  <span class="kw">return</span> {
    commande: { ...commande, statut: <span class="str">'CONFIRMEE'</span> },
    events: [{ type: <span class="str">'COMMANDE_CONFIRMEE'</span>, commandeId: commande.id }],
  };
};`

const codeBlockValueObject = `<span class="cm">// Immuable. \u00c9galit\u00e9 par valeur. Pas d'identit\u00e9.</span>
<span class="kw">class</span> <span class="ty">Montant</span> {
  <span class="kw">private constructor</span>(
    <span class="kw">private readonly</span> _valeur: <span class="ty">number</span>,
    <span class="kw">private readonly</span> _devise: <span class="ty">string</span> = <span class="str">'EUR'</span>,
  ) {
    <span class="kw">if</span> (_valeur &lt; <span class="num">0</span>) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Montant n\u00e9gatif interdit'</span>);
  }

  <span class="cm">// Factory method \u2014 seul point de cr\u00e9ation</span>
  <span class="kw">static</span> <span class="fn">de</span>(valeur: <span class="ty">number</span>, devise = <span class="str">'EUR'</span>): <span class="ty">Montant</span> {
    <span class="kw">return new</span> <span class="ty">Montant</span>(valeur, devise);
  }

  <span class="cm">// Op\u00e9rations immuables \u2014 retournent un NOUVEAU Montant</span>
  <span class="fn">ajouter</span>(autre: <span class="ty">Montant</span>): <span class="ty">Montant</span> {
    <span class="kw">if</span> (<span class="kw">this</span>._devise !== autre._devise)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Devises diff\u00e9rentes'</span>);
    <span class="kw">return</span> <span class="ty">Montant</span>.<span class="fn">de</span>(<span class="kw">this</span>._valeur + autre._valeur, <span class="kw">this</span>._devise);
  }

  <span class="cm">// \u00c9galit\u00e9 par VALEUR \u2014 pas par r\u00e9f\u00e9rence</span>
  <span class="fn">estEgalA</span>(autre: <span class="ty">Montant</span>): <span class="ty">boolean</span> {
    <span class="kw">return this</span>._valeur === autre._valeur
        && <span class="kw">this</span>._devise === autre._devise;
  }
}

<span class="cm">// Test : deux Montant identiques sont \u00e9gaux</span>
<span class="kw">const</span> a = <span class="ty">Montant</span>.<span class="fn">de</span>(<span class="num">50</span>, <span class="str">'EUR'</span>);
<span class="kw">const</span> b = <span class="ty">Montant</span>.<span class="fn">de</span>(<span class="num">50</span>, <span class="str">'EUR'</span>);
a.<span class="fn">estEgalA</span>(b);  <span class="cm">// true \u2192 m\u00eame VALEUR = \u00e9gaux</span>
a === b;         <span class="cm">// false \u2192 r\u00e9f\u00e9rences diff\u00e9rentes, mais on s'en fiche</span>`

const codeBlockEntity = `<span class="cm">// Identit\u00e9 unique. Mutable. Cycle de vie propre.</span>
<span class="kw">class</span> <span class="ty">Client</span> {
  <span class="kw">private</span> _email: <span class="ty">Email</span>;         <span class="cm">// \u2190 Value Object</span>
  <span class="kw">private</span> _adresse: <span class="ty">Adresse</span>;    <span class="cm">// \u2190 Value Object</span>

  <span class="kw">constructor</span>(
    <span class="kw">readonly</span> id: <span class="ty">ClientId</span>,       <span class="cm">// \u2190 Value Object (ID typ\u00e9)</span>
    email: <span class="ty">Email</span>,
    adresse: <span class="ty">Adresse</span>,
  ) {
    <span class="kw">this</span>._email = email;
    <span class="kw">this</span>._adresse = adresse;
  }

  <span class="cm">// Comportement m\u00e9tier : on change l'email</span>
  <span class="fn">changerEmail</span>(nouvelEmail: <span class="ty">Email</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>._email.<span class="fn">estEgalA</span>(nouvelEmail))
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'M\u00eame email'</span>);
    <span class="kw">this</span>._email = nouvelEmail;  <span class="cm">// \u2190 nouveau VO, pas de mutation du VO</span>
  }

  <span class="cm">// \u00c9galit\u00e9 par IDENTIT\u00c9 \u2014 seul l'ID compte</span>
  <span class="fn">estEgalA</span>(autre: <span class="ty">Client</span>): <span class="ty">boolean</span> {
    <span class="kw">return this</span>.id.<span class="fn">estEgalA</span>(autre.id);
  }
}

<span class="cm">// Test : deux Clients avec le m\u00eame ID sont le m\u00eame Client</span>
<span class="kw">const</span> c1 = <span class="kw">new</span> <span class="ty">Client</span>(id, email1, adresse1);
<span class="kw">const</span> c2 = <span class="kw">new</span> <span class="ty">Client</span>(id, email2, adresse2);
c1.<span class="fn">estEgalA</span>(c2);  <span class="cm">// true \u2192 m\u00eame ID = m\u00eame Entity</span>`

const codeBlockDomainEvent = `<span class="cm">// Interface commune \u00e0 tous les Domain Events</span>
<span class="kw">interface</span> <span class="ty">DomainEvent</span> {
  <span class="kw">readonly</span> occurredOn: <span class="ty">Date</span>;
  <span class="kw">readonly</span> eventType: <span class="ty">string</span>;
}

<span class="cm">// Event concret \u2014 immuable, nomm\u00e9 au pass\u00e9</span>
<span class="kw">class</span> <span class="ty">CommandeConfirmeeEvent</span> <span class="kw">implements</span> <span class="ty">DomainEvent</span> {
  <span class="kw">readonly</span> occurredOn = <span class="kw">new</span> <span class="ty">Date</span>();
  <span class="kw">readonly</span> eventType = <span class="str">'COMMANDE_CONFIRMEE'</span>;

  <span class="kw">constructor</span>(
    <span class="kw">readonly</span> commandeId: <span class="ty">CommandeId</span>,
    <span class="kw">readonly</span> clientId: <span class="ty">string</span>,
    <span class="kw">readonly</span> montantTotal: <span class="ty">Montant</span>,
  ) {}
}

<span class="cm">// Handlers \u2014 chacun r\u00e9agit ind\u00e9pendamment</span>
<span class="kw">class</span> <span class="ty">ReduireStockHandler</span> {
  <span class="kw">async</span> <span class="fn">handle</span>(event: <span class="ty">CommandeConfirmeeEvent</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="cm">// R\u00e9duire le stock pour chaque produit de la commande</span>
    <span class="kw">await this</span>.stockService.<span class="fn">reduire</span>(event.commandeId);
  }
}

<span class="kw">class</span> <span class="ty">EnvoyerConfirmationHandler</span> {
  <span class="kw">async</span> <span class="fn">handle</span>(event: <span class="ty">CommandeConfirmeeEvent</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="cm">// Envoyer un email au client \u2014 si \u00e7a \u00e9choue, la commande reste confirm\u00e9e</span>
    <span class="kw">await this</span>.mailer.<span class="fn">envoyer</span>(event.clientId, <span class="str">'Votre commande est confirm\u00e9e'</span>);
  }
}`

const codeBlockRepository = `<span class="cm">// Aucune d\u00e9pendance technique \u2014 pur Domain</span>
<span class="kw">interface</span> <span class="ty">CommandeRepository</span> {
  <span class="fn">findById</span>(id: <span class="ty">CommandeId</span>): <span class="ty">Promise</span>&lt;<span class="ty">Commande</span> | <span class="kw">null</span>&gt;;
  <span class="fn">save</span>(commande: <span class="ty">Commande</span>):     <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;
  <span class="fn">findByClientId</span>(clientId: <span class="ty">string</span>): <span class="ty">Promise</span>&lt;<span class="ty">Commande</span>[]&gt;;
}`

const codeBlockUseCase = `<span class="cm">// Application Layer \u2014 orchestre, ne d\u00e9cide RIEN du m\u00e9tier</span>
<span class="kw">class</span> <span class="ty">PasserCommandeUseCase</span> {
  <span class="kw">constructor</span>(
    <span class="kw">private readonly</span> commandeRepo: <span class="ty">CommandeRepository</span>,  <span class="cm">// \u2190 interface</span>
    <span class="kw">private readonly</span> eventBus: <span class="ty">EventBus</span>,                <span class="cm">// \u2190 interface</span>
  ) {}

  <span class="kw">async</span> <span class="fn">executer</span>(dto: <span class="ty">PasserCommandeDTO</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="cm">// 1. Cr\u00e9er l'Aggregate via sa Factory</span>
    <span class="kw">const</span> commande = <span class="ty">Commande</span>.<span class="fn">creer</span>(dto.clientId);

    <span class="cm">// 2. D\u00e9l\u00e9guer le comportement au Domain</span>
    <span class="kw">for</span> (<span class="kw">const</span> ligne <span class="kw">of</span> dto.lignes) {
      commande.<span class="fn">ajouterProduit</span>(
        <span class="kw">new</span> <span class="ty">ProduitId</span>(ligne.produitId),
        ligne.quantite,
        <span class="ty">Montant</span>.<span class="fn">de</span>(ligne.prix),
      );
    }
    commande.<span class="fn">confirmer</span>();

    <span class="cm">// 3. Persister via le Repository (interface)</span>
    <span class="kw">await this</span>.commandeRepo.<span class="fn">save</span>(commande);

    <span class="cm">// 4. Dispatcher les Domain Events APR\u00c8S persistance</span>
    <span class="kw">for</span> (<span class="kw">const</span> event <span class="kw">of</span> commande.<span class="fn">collecterEvenements</span>()) {
      <span class="kw">await this</span>.eventBus.<span class="fn">publish</span>(event);
    }
  }
}`

/* ── Sidebar navigation ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'metaphore', label: 'La m\u00e9taphore' },
      { id: 'overview', label: 'Vue d\u2019ensemble' },
    ],
  },
  {
    label: 'Architecture',
    links: [
      { id: 'couches', label: 'Couches DDD' },
      { id: 'structure', label: 'Structure fichiers' },
    ],
  },
  {
    label: 'Building Blocks',
    links: [
      { id: 'aggregate', label: 'Aggregate' },
      { id: 'entity-vo', label: 'Entity vs Value Object' },
      { id: 'events', label: 'Domain Events' },
      { id: 'repository', label: 'Repository & App Layer' },
    ],
  },
  {
    label: 'R\u00e9f\u00e9rences',
    links: [
      { id: 'pieges', label: 'Pi\u00e8ges classiques' },
      { id: 'recap', label: 'R\u00e9capitulatif' },
    ],
  },
]

useHead({
  title: 'Domain-Driven Design \u2014 DDD',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Domain-Driven Design \u2014 DDD',
        name: 'Domain-Driven Design \u2014 DDD',
        description:
          'Guide complet du Domain-Driven Design \u2014 Bounded Context, Aggregate, Entity, Value Object, Domain Events et Repository avec exemples TypeScript.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/ddd-architecture',
        author: {
          '@type': 'Person',
          name: 'Eric Evans',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Guide complet du Domain-Driven Design \u2014 Bounded Context, Aggregate, Entity, Value Object, Domain Events et Repository avec exemples TypeScript.',
  ogTitle: 'Domain-Driven Design \u2014 DDD',
  ogDescription:
    'Guide complet du Domain-Driven Design \u2014 Bounded Context, Aggregate, Entity, Value Object, Domain Events et Repository avec exemples TypeScript.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/ddd-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Domain-Driven Design \u2014 DDD',
  twitterDescription:
    'Guide complet du Domain-Driven Design \u2014 Bounded Context, Aggregate, Entity, Value Object, Domain Events et Repository avec exemples TypeScript.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="Domain-Driven<br>Design"
      :groups="sidebarGroups"
      accent-color="#4ae8b0"
    />

    <main class="main">
      <div class="content">
    <!-- Back link -->
    <nav>
      <NuxtLink to="/" class="back-link">
        Retour aux architectures
      </NuxtLink>
    </nav>

    <!-- Header -->
    <header>
      <div class="eyebrow">// Domain-Driven Design &mdash; Eric Evans &middot; 2003</div>
      <h1>Domain-<em>Driven</em><br>Design</h1>
      <p class="subtitle">
        Mod&eacute;liser le logiciel &agrave; l&rsquo;image du m&eacute;tier. Le code parle le m&ecirc;me langage
        que l&rsquo;expert, les fronti&egrave;res sont explicites, et la logique m&eacute;tier vit au c&oelig;ur
        de l&rsquo;architecture &mdash; ind&eacute;pendante de toute technologie.
      </p>
      <div class="meta-tags">
        <span
          v-for="tag in metaTags"
          :key="tag.label"
          class="meta-tag"
          :class="tag.colorClass"
        >
          {{ tag.label }}
        </span>
      </div>
    </header>

    <!-- Section 01 : La Metaphore fondatrice -->
    <section id="metaphore" class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La m&eacute;taphore fondatrice</h2>
        <div class="section-line" />
      </div>

      <div class="quote-box">
        <div class="quote-icon">&#x1F3D9;&#xFE0F;</div>
        <div class="quote-content">
          <h3>La Ville et ses Quartiers</h3>
          <p>
            Imagine que tu construis une <strong>grande ville</strong>. Chaque
            <strong>quartier</strong> a ses propres r&egrave;gles, son propre langage, ses propres habitants.
            Le quartier financier parle de <em>transactions</em> et d&rsquo;<em>actifs</em>.
            Le quartier m&eacute;dical parle de <em>patients</em> et d&rsquo;<em>ordonnances</em>.
            Ils ne se comprennent pas directement &mdash; il faut des <strong>traducteurs aux
            fronti&egrave;res</strong>.
          </p>
          <p>
            C&rsquo;est exactement le DDD&nbsp;: <strong>mod&eacute;liser le logiciel &agrave; l&rsquo;image du
            m&eacute;tier</strong>, avec des fronti&egrave;res claires entre les domaines, un langage commun
            &agrave; chaque quartier, et une logique m&eacute;tier qui dicte l&rsquo;architecture &mdash;
            jamais l&rsquo;inverse.
          </p>
        </div>
      </div>

      <div class="prose">
        <p>
          Le Domain-Driven Design, introduit par Eric Evans en 2003, repose sur une id&eacute;e simple mais
          radicale&nbsp;: <strong>c&rsquo;est le domaine m&eacute;tier qui doit guider chaque d&eacute;cision
          architecturale</strong>. Avant de choisir une base de donn&eacute;es, un framework ou un pattern,
          on mod&eacute;lise la r&eacute;alit&eacute; du m&eacute;tier avec les experts &mdash; et ce
          mod&egrave;le devient le code.
        </p>
        <p>
          Le DDD se divise en deux niveaux&nbsp;: la <em>conception strat&eacute;gique</em>, qui organise les
          grandes fronti&egrave;res du syst&egrave;me, et la <em>conception tactique</em>, qui fournit les
          briques de construction &agrave; l&rsquo;int&eacute;rieur de ces fronti&egrave;res.
        </p>
      </div>
    </section>

    <!-- Section 02 : Vue d'ensemble -->
    <section id="overview" class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Vue d&rsquo;ensemble &mdash; Les deux niveaux</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          <strong>Conception Strat&eacute;gique</strong> &mdash; Comment d&eacute;couper le syst&egrave;me en
          domaines coh&eacute;rents et faire coexister plusieurs mod&egrave;les.
        </p>
      </div>

      <div class="cards">
        <article
          v-for="card in strategicCards"
          :key="card.name"
          class="card"
          :class="card.colorClass"
        >
          <span class="card-icon">{{ card.icon }}</span>
          <div class="card-name">{{ card.name }}</div>
          <div class="card-title">{{ card.title }}</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="card-desc" v-html="card.description" />
          <div class="card-tags">
            <span
              v-for="tag in card.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          <blockquote
            v-if="card.quote"
            class="card-quote"
          >
            {{ card.quote }}
          </blockquote>
        </article>
      </div>

      <div class="prose" style="margin-top: 40px;">
        <p>
          <strong>Conception Tactique</strong> &mdash; Les briques de construction &agrave;
          l&rsquo;int&eacute;rieur d&rsquo;un Bounded Context.
        </p>
      </div>

      <div class="cards">
        <article
          v-for="card in tacticalCards"
          :key="card.name"
          class="card"
          :class="card.colorClass"
        >
          <span class="card-icon">{{ card.icon }}</span>
          <div class="card-name">{{ card.name }}</div>
          <div class="card-title">{{ card.title }}</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="card-desc" v-html="card.description" />
          <div class="card-tags">
            <span
              v-for="tag in card.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          <blockquote
            v-if="card.quote"
            class="card-quote"
          >
            {{ card.quote }}
          </blockquote>
        </article>
      </div>
    </section>

    <!-- Section 03 : Architecture en couches DDD -->
    <section id="couches" class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">Architecture en couches DDD</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Le DDD s&rsquo;organise en quatre couches dont la <strong>r&egrave;gle d&rsquo;or est
          absolue</strong>&nbsp;: les d&eacute;pendances ne pointent que vers l&rsquo;int&eacute;rieur. Le
          Domain ne d&eacute;pend de rien. L&rsquo;Infrastructure d&eacute;pend du Domain &mdash; jamais
          l&rsquo;inverse.
        </p>
      </div>

      <!-- Layers diagram -->
      <div class="layers-diagram">
        <div
          v-for="layer in layerRows"
          :key="layer.num"
          class="layer-row"
          :class="{ 'layer-core': layer.isCore }"
          :style="{ '--layer-color': layer.color }"
        >
          <div class="layer-num">{{ layer.num }}</div>
          <div class="layer-content">
            <div class="layer-title">{{ layer.title }}</div>
            <div class="layer-desc">{{ layer.description }}</div>
            <div class="layer-files">
              <span
                v-for="file in layer.files"
                :key="file.label"
                class="layer-file"
                :class="file.colorClass"
              >
                {{ file.label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="rule-banner">
        <strong>La R&egrave;gle d&rsquo;Or des d&eacute;pendances&nbsp;:</strong><br>
        Pr&eacute;sentation &rarr; Application &rarr; Domain &larr; Infrastructure<br>
        Le Domain est le seul &agrave; ne d&eacute;pendre de rien. Si votre Domain importe quoi que ce soit
        de NestJS, TypeORM ou Express &mdash; la r&egrave;gle est viol&eacute;e.
      </div>
    </section>

    <!-- Section 04 : Structure de fichiers -->
    <section id="structure" class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">Structure de fichiers recommand&eacute;e</h2>
        <div class="section-line" />
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="file-tree" v-html="fileTreeHtml" />
    </section>

    <!-- Section 05 : L'Aggregate -->
    <section id="aggregate" class="section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">L&rsquo;Aggregate &mdash; Le c&oelig;ur battant du DDD</h2>
        <div class="section-line" />
      </div>

      <div class="quote-box">
        <div class="quote-icon">&#x1F3F0;</div>
        <div class="quote-content">
          <h3>La M&eacute;taphore du Ch&acirc;teau Fort</h3>
          <p>
            Un Aggregate, c&rsquo;est un <strong>ch&acirc;teau fort m&eacute;di&eacute;val</strong>. Il y a
            une porte principale (la <em>Racine &mdash; Aggregate Root</em>), des remparts qui
            d&eacute;finissent la <em>fronti&egrave;re de coh&eacute;rence</em>, et &agrave;
            l&rsquo;int&eacute;rieur vivent des Entities et des Value Objects. Pour parler au seigneur,
            aux chevaliers ou aux serviteurs &mdash; tu passes <strong>obligatoirement par la porte
            principale</strong>. Jamais par les remparts. Et une seule r&egrave;gle absolue&nbsp;:
            <strong>une transaction ne franchit pas les murs d&rsquo;un seul ch&acirc;teau</strong>.
          </p>
        </div>
      </div>

      <!-- Aggregate diagram -->
      <div class="agg-diagram">
        <div class="agg-diagram-label">AGGREGATE : Commande &mdash; Fronti&egrave;re de coh&eacute;rence</div>
        <div class="agg-root">
          <span class="agg-root-badge">Root</span>
          <span class="agg-root-name">Commande</span>
          <span class="agg-root-id">id: CommandeId &middot; statut: StatutCommande</span>
        </div>
        <div class="agg-children">
          <div class="agg-entity">
            <span class="agg-entity-label">Entity</span>
            <span class="agg-entity-name">LigneCommande</span>
          </div>
          <div class="agg-entity">
            <span class="agg-entity-label">Entity</span>
            <span class="agg-entity-name">Remise</span>
          </div>
          <div class="agg-vo">
            <span class="agg-vo-label">VO</span>
            <span class="agg-vo-name">Montant</span>
          </div>
          <div class="agg-vo">
            <span class="agg-vo-label">VO</span>
            <span class="agg-vo-name">Adresse</span>
          </div>
          <div class="agg-vo">
            <span class="agg-vo-label">VO</span>
            <span class="agg-vo-name">Quantite</span>
          </div>
        </div>
      </div>

      <div class="prose">
        <p><strong>Les 5 r&egrave;gles d&rsquo;or de l&rsquo;Aggregate</strong></p>
      </div>

      <div class="cards">
        <article
          v-for="rule in ruleCards"
          :key="rule.name"
          class="card"
          :class="rule.colorClass"
        >
          <div class="card-name">{{ rule.name }}</div>
          <div class="card-title">{{ rule.title }}</div>
          <div class="card-desc">{{ rule.description }}</div>
        </article>
      </div>

      <!-- Lifecycle flow -->
      <div class="lifecycle">
        <template v-for="(state, index) in lifecycleStates" :key="state.label + index">
          <div
            class="lc-state"
            :style="{
              color: state.color,
              borderColor: state.borderColor,
              background: state.bgColor,
            }"
          >
            <strong>{{ state.label }}</strong><br>
            <small>{{ state.sublabel }}</small>
          </div>
          <div
            v-if="index < lifecycleArrows.length"
            class="lc-arrow"
          >
            <span class="arr" :style="{ color: lifecycleArrows[index].color || '#4ae8b0' }">{{ lifecycleArrows[index].symbol }}</span>
            <span class="arr-txt">{{ lifecycleArrows[index].text }}</span>
          </div>
        </template>
        <div class="lc-arrow">
          <span class="arr" style="color: #e84a7a;">&#x2935;</span>
          <span class="arr-txt" style="color: #e84a7a;">annuler()</span>
        </div>
        <div
          class="lc-state"
          style="color: #e84a7a; border-color: rgba(232,74,122,0.4); background: rgba(232,74,122,0.08);"
        >
          <strong>ANNULEE</strong><br>
          <small>terminal</small>
        </div>
      </div>

      <!-- Code blocks -->
      <div class="code-filename">domain/Commande.ts &mdash; Aggregate Root (OOP)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockAggregateOop" />

      <div class="code-filename">domain/commande.fp.ts &mdash; Approche Fonctionnelle (immutabilit&eacute; totale)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockAggregateFp" />
    </section>

    <!-- Section 06 : Entity vs Value Object -->
    <section id="entity-vo" class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Entity vs Value Object</h2>
        <div class="section-line" />
      </div>

      <div class="quote-box">
        <div class="quote-icon">&#x1F4B0;</div>
        <div class="quote-content">
          <h3>La M&eacute;taphore des Billets de Banque</h3>
          <p>
            <strong>Entity</strong> &rarr; Pense &agrave; une <em>personne</em>. Si deux jumeaux ont
            exactement le m&ecirc;me nom, la m&ecirc;me apparence, la m&ecirc;me date de naissance &mdash;
            ce sont quand m&ecirc;me deux personnes distinctes. Ce qui compte, c&rsquo;est leur
            <strong>identit&eacute;</strong>, pas leurs attributs.
          </p>
          <p>
            <strong>Value Object</strong> &rarr; Pense &agrave; un <em>billet de 50&euro;</em>. Si tu
            &eacute;changes ton billet contre un autre billet de 50&euro; &mdash; tu t&rsquo;en fous. Ils
            sont <strong>interchangeables</strong>. Ce qui compte, c&rsquo;est la valeur, pas quel billet
            physique tu tiens.
          </p>
        </div>
      </div>

      <!-- Comparison -->
      <div class="comparison">
        <div class="cmp-col">
          <div class="cmp-header" :class="voItems.headerClass">
            {{ voItems.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in voItems.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: voItems.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
        <div class="cmp-col">
          <div class="cmp-header" :class="entItems.headerClass">
            {{ entItems.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in entItems.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: entItems.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
      </div>

      <!-- Code blocks -->
      <div class="code-filename">domain/Montant.ts &mdash; Value Object</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockValueObject" />

      <div class="code-filename">domain/Client.ts &mdash; Entity</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockEntity" />

      <div class="info-box">
        <strong>Le cas pi&egrave;ge &mdash; L&rsquo;Adresse&nbsp;: VO ou Entity&nbsp;?</strong>
        Un m&ecirc;me concept peut &ecirc;tre Value Object dans un contexte et Entity dans un autre.
        L&rsquo;<strong>Adresse de livraison</strong> d&rsquo;une commande est un VO&nbsp;: elle est
        captur&eacute;e au moment de la commande et ne doit pas changer si le client d&eacute;m&eacute;nage.
        L&rsquo;<strong>Adresse d&rsquo;un entrep&ocirc;t</strong> logistique est une Entity&nbsp;: on veut
        tracer ses modifications au fil du temps et la retrouver par son identit&eacute;.
        <em>C&rsquo;est le contexte m&eacute;tier qui d&eacute;cide, jamais la technique.</em>
      </div>

      <!-- Checklist -->
      <div class="checklist">
        <div
          v-for="item in checklistItems"
          :key="item.num"
          class="checklist-item"
        >
          <span class="ck-num">{{ item.num }}</span>
          <span class="ck-q">{{ item.question }}</span>
          <span class="ck-vo">{{ item.voAnswer }}</span>
          <span class="ck-ent">{{ item.entAnswer }}</span>
        </div>
      </div>

      <div class="rule-banner">
        <strong>La r&egrave;gle pratique&nbsp;:</strong> La grande majorit&eacute; des <em>attributs</em>
        d&rsquo;une Entity devraient &ecirc;tre des Value Objects. <code>Client</code> est une Entity &mdash;
        mais son <code>email</code>, son <code>adresse</code>, son <code>telephone</code> sont des Value
        Objects. L&rsquo;Entity est le squelette &mdash; les Value Objects sont la chair.
      </div>
    </section>

    <!-- Section 07 : Domain Events -->
    <section id="events" class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">Domain Events &mdash; Le d&eacute;couplage par les faits</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Un Domain Event repr&eacute;sente <strong>quelque chose qui s&rsquo;est pass&eacute; dans le
          domaine</strong>. Nomm&eacute; au pass&eacute;, immuable, dat&eacute;. Il permet &agrave; un
          Aggregate de d&eacute;clencher des r&eacute;actions dans d&rsquo;autres Aggregates &mdash; ou
          d&rsquo;autres Bounded Contexts &mdash; sans couplage direct.
        </p>
      </div>

      <!-- Comparison -->
      <div class="comparison">
        <div class="cmp-col">
          <div class="cmp-header" :class="eventsWithout.headerClass">
            {{ eventsWithout.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in eventsWithout.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: eventsWithout.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
        <div class="cmp-col">
          <div class="cmp-header" :class="eventsWith.headerClass">
            {{ eventsWith.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in eventsWith.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: eventsWith.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
      </div>

      <div class="code-filename">domain/events/CommandeConfirmeeEvent.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockDomainEvent" />
    </section>

    <!-- Section 08 : Repository & Application Layer -->
    <section id="repository" class="section">
      <div class="section-header">
        <span class="section-number">08</span>
        <h2 class="section-title">Repository &amp; Application Layer</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Le <strong>Repository</strong> est une abstraction qui donne au domaine l&rsquo;illusion d&rsquo;une
          collection en m&eacute;moire. L&rsquo;interface vit dans le Domain, l&rsquo;impl&eacute;mentation
          SQL dans l&rsquo;Infrastructure. L&rsquo;<strong>Application Layer</strong> orchestre &mdash; sans
          jamais contenir de logique m&eacute;tier.
        </p>
      </div>

      <div class="code-filename">domain/CommandeRepository.ts &mdash; Interface (Domain)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockRepository" />

      <div class="code-filename">application/PasserCommandeUseCase.ts &mdash; Orchestration (Application)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockUseCase" />
    </section>

    <!-- Section 09 : Les pieges classiques -->
    <section id="pieges" class="section">
      <div class="section-header">
        <span class="section-number">09</span>
        <h2 class="section-title">Les pi&egrave;ges classiques &agrave; &eacute;viter</h2>
        <div class="section-line" />
      </div>

      <div class="cards">
        <article
          v-for="trap in trapCards"
          :key="trap.name"
          class="card"
          :class="trap.colorClass"
        >
          <span class="card-icon">{{ trap.icon }}</span>
          <div class="card-name">{{ trap.name }}</div>
          <div class="card-title">{{ trap.title }}</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="card-desc" v-html="trap.description" />
          <div class="card-tags">
            <span
              v-for="tag in trap.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </article>
      </div>

      <div class="warn-box">
        <strong>Signal d&rsquo;alerte universelle&nbsp;:</strong> Si votre test d&rsquo;un use case
        n&eacute;cessite de lancer une base de donn&eacute;es, de d&eacute;marrer NestJS ou d&rsquo;appeler
        Stripe &mdash; la Dependency Rule est viol&eacute;e quelque part. Le domaine doit &ecirc;tre testable
        <em>sans aucune infrastructure</em>.
      </div>
    </section>

    <!-- Section 10 : Recapitulatif -->
    <section id="recap" class="section">
      <div class="section-header">
        <span class="section-number">10</span>
        <h2 class="section-title">R&eacute;capitulatif &mdash; Les 7 piliers</h2>
        <div class="section-line" />
      </div>

      <div class="decision-table">
        <div class="dt-header">
          <span class="dt-h-concept">Concept</span>
          <span class="dt-h-role">R&ocirc;le</span>
          <span class="dt-h-rule">R&egrave;gle cl&eacute;</span>
        </div>
        <div
          v-for="row in pillarRows"
          :key="row.concept"
          class="dt-row"
        >
          <span class="dt-concept">{{ row.concept }}</span>
          <span class="dt-role">{{ row.role }}</span>
          <span class="dt-rule">{{ row.rule }}</span>
        </div>
      </div>

      <div class="quote-box">
        <div class="quote-icon">&#x1F4D6;</div>
        <div class="quote-content">
          <h3>La synth&egrave;se de Robert C. Martin</h3>
          <p>
            Le Domain, c&rsquo;est le <strong>c&oelig;ur de la maison</strong> &mdash; il ne d&eacute;pend
            pas des murs, de la plomberie ou de l&rsquo;&eacute;lectricit&eacute;. Si vous changez de plombier
            (base de donn&eacute;es), le c&oelig;ur ne bouge pas. C&rsquo;est le principe de
            <em>Clean Architecture</em> appliqu&eacute; au DDD&nbsp;: l&rsquo;infrastructure est un
            d&eacute;tail rempla&ccedil;able. Le m&eacute;tier, lui, est &eacute;ternel.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <div class="page-footer">
      <span class="footer-left">// DOMAIN-DRIVEN DESIGN &mdash; TACTICAL + STRATEGIC</span>
      <span class="footer-right">
        R&eacute;f&eacute;rence&nbsp;: <em>Domain-Driven Design</em> &mdash; Eric Evans (2003)
      </span>
    </div>

    <!-- Legend -->
    <footer class="legend">
      <div
        v-for="item in legendItems"
        :key="item.label"
        class="legend-item"
      >
        <div
          class="legend-dot"
          :style="{ background: item.color }"
        />
        {{ item.label }}
      </div>
    </footer>
      </div>
    </main>
  </div>
</template>


<style scoped>
.page {
  --sidebar-w: 268px;
}

:global(html) {
  scroll-behavior: smooth;
}

.main {
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 32px 100px;
}

/* Back link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  margin-bottom: 40px;
  transition: color 0.2s;
}
.back-link:hover { color: var(--accent2); }
.back-link::before { content: '\2190'; font-size: 14px; }

/* Header */
header {
  margin-bottom: 72px;
  border-left: 3px solid var(--accent2);
  padding-left: 24px;
}

.eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent2);
  margin-bottom: 12px;
}

h1 {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--white);
  line-height: 1.15;
  margin-bottom: 16px;
}

h1 em { font-style: italic; color: var(--accent2); }

.subtitle {
  font-size: 1rem;
  color: var(--muted);
  max-width: 600px;
  margin-bottom: 20px;
}

/* Meta tags */
.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.meta-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.06em;
  font-weight: 600;
  text-transform: uppercase;
}

.meta-tag.green  { color: #4ae8b0; background: rgba(74,232,176,0.1); border: 1px solid rgba(74,232,176,0.25); }
.meta-tag.yellow { color: #e8c84a; background: rgba(232,200,74,0.1); border: 1px solid rgba(232,200,74,0.25); }
.meta-tag.purple { color: #a78bfa; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); }

/* Sections */
.section {
  margin-bottom: 72px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.section-number {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  border: 1px solid rgba(74,232,176,0.2);
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.section-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.5rem;
  color: var(--white);
}

.section-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* Prose */
.prose {
  font-size: 0.925rem;
  color: var(--text);
  line-height: 1.8;
  max-width: 780px;
}

.prose p { margin-bottom: 16px; }
.prose strong { color: var(--white); font-weight: 500; }
.prose em { color: var(--accent2); font-style: italic; }

/* Quote callout */
.quote-box {
  background: linear-gradient(135deg, rgba(74,232,176,0.06), rgba(232,200,74,0.04));
  border: 1px solid rgba(74,232,176,0.2);
  border-radius: 10px;
  padding: 28px 32px;
  margin: 40px 0;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.quote-icon {
  font-size: 2.2rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.quote-content h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 1.1rem;
  color: var(--accent2);
  margin-bottom: 8px;
}

.quote-content p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.75;
  margin-bottom: 8px;
}

.quote-content p:last-child { margin-bottom: 0; }

.quote-content em { color: var(--accent2); font-style: italic; }
.quote-content strong { color: var(--white); font-weight: 500; }

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
  cursor: default;
  animation: fadeUp 0.4s ease both;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--card-accent, var(--accent2));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.card:hover { border-color: var(--card-accent, var(--accent2)); transform: translateY(-2px); }
.card:hover::before { transform: scaleX(1); }

.card-icon { font-size: 1.6rem; margin-bottom: 12px; display: block; }

.card-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--card-accent, var(--accent2));
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.card-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.15rem;
  color: var(--white);
  margin-bottom: 10px;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.65;
  margin-bottom: 14px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 3px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: var(--muted);
  letter-spacing: 0.05em;
}

.card-quote {
  font-style: italic;
  font-size: 0.8rem;
  color: rgba(74,232,176,0.5);
  border-left: 2px solid rgba(74,232,176,0.2);
  padding-left: 10px;
  margin-top: 12px;
  line-height: 1.5;
}

/* Color variants */
.green  { --card-accent: #4ae8b0; }
.yellow { --card-accent: #e8c84a; }
.blue   { --card-accent: #4a9ee8; }
.purple { --card-accent: #a78bfa; }
.pink   { --card-accent: #e84a7a; }
.orange { --card-accent: #e87a4a; }
.cyan   { --card-accent: #22d3ee; }

/* Layers diagram */
.layers-diagram {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.layer-row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--border);
  min-height: 80px;
  transition: background 0.2s;
}

.layer-row:last-child { border-bottom: none; }
.layer-row:hover { background: rgba(255,255,255,0.02); }
.layer-row.layer-core { border: 2px solid rgba(74,232,176,0.3); }

.layer-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--layer-color);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  padding: 16px 14px;
  border-right: 1px solid var(--border);
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}

.layer-content {
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.layer-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.05rem;
  color: var(--layer-color);
}

.layer-desc {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.6;
}

.layer-files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.layer-file {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 3px;
  border: 1px solid;
  letter-spacing: 0.04em;
}

.lf-green  { color: #4ae8b0; border-color: rgba(74,232,176,0.25); background: rgba(74,232,176,0.06); }
.lf-purple { color: #a78bfa; border-color: rgba(167,139,250,0.25); background: rgba(167,139,250,0.06); }
.lf-blue   { color: #4a9ee8; border-color: rgba(74,158,232,0.25); background: rgba(74,158,232,0.06); }
.lf-orange { color: #e87a4a; border-color: rgba(232,122,74,0.25); background: rgba(232,122,74,0.06); }
.lf-yellow { color: #e8c84a; border-color: rgba(232,200,74,0.25); background: rgba(232,200,74,0.06); }
.lf-red    { color: #e84a7a; border-color: rgba(232,74,122,0.25); background: rgba(232,74,122,0.06); }
.lf-cyan   { color: #22d3ee; border-color: rgba(34,211,238,0.25); background: rgba(34,211,238,0.06); }

/* File tree */
.file-tree {
  background: #0a0c10;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent2);
  border-radius: 6px;
  padding: 20px 24px;
  margin: 24px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  line-height: 2;
  color: #c8d0e8;
  white-space: pre;
  overflow-x: auto;
}

.file-tree :deep(.ft-dir)    { color: var(--accent2); }
.file-tree :deep(.ft-green)  { color: #4ae8b0; }
.file-tree :deep(.ft-purple) { color: #a78bfa; }
.file-tree :deep(.ft-blue)   { color: #4a9ee8; }
.file-tree :deep(.ft-orange) { color: #e87a4a; }
.file-tree :deep(.ft-gray)   { color: var(--muted); }
.file-tree :deep(.ft-red)    { color: #e84a7a; }
.file-tree :deep(.ft-cyan)   { color: #22d3ee; }
.file-tree :deep(.ft-yellow) { color: #e8c84a; }

/* Aggregate diagram */
.agg-diagram {
  position: relative;
  border: 2px dashed rgba(167,139,250,0.4);
  border-radius: 12px;
  padding: 48px 24px 24px;
  margin: 40px 0;
  background: rgba(167,139,250,0.03);
}

.agg-diagram-label {
  position: absolute;
  top: -12px;
  left: 24px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--purple);
  background: var(--bg);
  padding: 2px 12px;
  border-radius: 3px;
  border: 1px solid rgba(167,139,250,0.3);
}

.agg-root {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(167,139,250,0.08);
  border: 1px solid rgba(167,139,250,0.3);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.agg-root-badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: var(--white);
  background: var(--purple);
  padding: 3px 10px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.agg-root-name {
  font-family: 'DM Serif Display', serif;
  font-size: 1.1rem;
  color: var(--purple);
}

.agg-root-id {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
}

.agg-children {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.agg-entity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(74,232,176,0.06);
  border: 1px solid rgba(74,232,176,0.25);
  border-radius: 6px;
  padding: 12px 16px;
  min-width: 100px;
}

.agg-entity-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: #4ae8b0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.agg-entity-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--white);
}

.agg-vo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(34,211,238,0.06);
  border: 1px solid rgba(34,211,238,0.25);
  border-radius: 6px;
  padding: 12px 16px;
  min-width: 100px;
}

.agg-vo-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: #22d3ee;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.agg-vo-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--white);
}

/* Lifecycle flow */
.lifecycle {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 40px 0;
  overflow-x: auto;
  padding-bottom: 4px;
}

.lc-state {
  flex-shrink: 0;
  padding: 12px 16px;
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.4;
  border: 1px solid;
  letter-spacing: 0.04em;
}

.lc-state small {
  font-weight: 400;
  font-size: 0.65rem;
  opacity: 0.7;
}

.lc-arrow {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 6px;
  gap: 2px;
}

.lc-arrow .arr {
  font-size: 1.1rem;
}

.lc-arrow .arr-txt {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.08em;
}

/* Code blocks */
.code-block {
  background: #0a0c10;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent2);
  border-radius: 6px;
  padding: 20px 24px;
  margin: 20px 0;
  overflow-x: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  line-height: 1.75;
  color: #c8d0e8;
  white-space: pre;
}

.code-block :deep(.cm)  { color: #6a7090; }
.code-block :deep(.kw)  { color: #a78bfa; }
.code-block :deep(.fn)  { color: #4ae8b0; }
.code-block :deep(.str) { color: #e8c84a; }
.code-block :deep(.ty)  { color: #4a9ee8; }
.code-block :deep(.op)  { color: #e84a7a; }
.code-block :deep(.num) { color: #e87a4a; }
.code-block :deep(.hl)  { color: var(--white); }

.code-filename {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--border);
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  padding: 6px 16px;
  display: inline-block;
  margin-bottom: 0;
}

.code-filename + .code-block {
  border-radius: 0 6px 6px 6px;
  margin-top: 0;
}

/* Comparison table */
.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 28px 0;
}

.cmp-col {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.cmp-header {
  padding: 14px 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}

.cmp-header.bad  { color: var(--red); background: rgba(232,74,122,0.06); }
.cmp-header.good { color: var(--green); background: rgba(74,232,176,0.06); }
.cmp-header.vo   { color: #22d3ee; background: rgba(34,211,238,0.06); }
.cmp-header.ent  { color: #4ae8b0; background: rgba(74,232,176,0.06); }

.cmp-body {
  padding: 16px 20px;
}

.cmp-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 0.85rem;
  line-height: 1.5;
}

.cmp-item:last-child { margin-bottom: 0; }

.cmp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 7px;
}

/* Info box */
.info-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent2);
  border-radius: 6px;
  padding: 18px 22px;
  margin: 24px 0;
  font-size: 0.875rem;
  color: var(--text);
  line-height: 1.7;
}

.info-box strong { color: var(--accent2); }
.info-box em { color: var(--accent2); font-style: italic; }

/* Warn box */
.warn-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--red);
  border-radius: 6px;
  padding: 18px 22px;
  margin: 24px 0;
  font-size: 0.875rem;
  color: var(--text);
  line-height: 1.7;
}

.warn-box strong { color: var(--red); }
.warn-box em { color: var(--accent2); font-style: italic; }

/* Rule banner */
.rule-banner {
  background: linear-gradient(135deg, rgba(74,232,176,0.08), rgba(167,139,250,0.06));
  border: 1px solid rgba(74,232,176,0.25);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 28px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  color: var(--accent2);
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.rule-banner strong { color: var(--white); }
.rule-banner em { color: var(--accent2); font-style: italic; }

.rule-banner :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

/* Checklist */
.checklist {
  margin: 28px 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.checklist-item {
  display: grid;
  grid-template-columns: 40px 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
  transition: background 0.2s;
}

.checklist-item:last-child { border-bottom: none; }
.checklist-item:hover { background: rgba(255,255,255,0.02); }

.ck-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--accent2);
  font-weight: 600;
  text-align: center;
}

.ck-q {
  color: var(--text);
  line-height: 1.5;
}

.ck-vo {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: #22d3ee;
  background: rgba(34,211,238,0.08);
  border: 1px solid rgba(34,211,238,0.2);
  padding: 3px 10px;
  border-radius: 3px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.ck-ent {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: #4ae8b0;
  background: rgba(74,232,176,0.08);
  border: 1px solid rgba(74,232,176,0.2);
  padding: 3px 10px;
  border-radius: 3px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Decision table */
.decision-table {
  margin: 28px 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.dt-header {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 0;
  background: rgba(74,232,176,0.06);
  border-bottom: 1px solid var(--border);
  padding: 12px 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent2);
}

.dt-row {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 0;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
  transition: background 0.2s;
}

.dt-row:last-child { border-bottom: none; }
.dt-row:hover { background: rgba(255,255,255,0.02); }

.dt-concept {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--accent2);
  font-weight: 600;
}

.dt-role {
  color: var(--text);
  line-height: 1.5;
}

.dt-rule {
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.5;
}

/* Inline code */
.section :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

/* Footer */
.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-top: 48px;
}

.footer-left {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.footer-right {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--muted);
}

.footer-right em {
  color: var(--accent2);
  font-style: italic;
}

/* Legend */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 24px;
  padding-top: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--muted);
  font-family: 'IBM Plex Mono', monospace;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.10s; }
.card:nth-child(3) { animation-delay: 0.15s; }
.card:nth-child(4) { animation-delay: 0.20s; }
.card:nth-child(5) { animation-delay: 0.25s; }
.card:nth-child(6) { animation-delay: 0.30s; }

/* Responsive */
@media (max-width: 900px) {
  .main { margin-left: 0; }
}

@media (max-width: 640px) {
  .comparison { grid-template-columns: 1fr; }
  .lifecycle { flex-wrap: wrap; justify-content: center; }
  .checklist-item { grid-template-columns: 30px 1fr; }
  .ck-vo, .ck-ent { display: none; }
  .dt-header, .dt-row { grid-template-columns: 1fr; gap: 4px; }
  .agg-root { flex-wrap: wrap; }
  .page-footer { flex-direction: column; gap: 8px; text-align: center; }
  .meta-tags { justify-content: flex-start; }
}
</style>
