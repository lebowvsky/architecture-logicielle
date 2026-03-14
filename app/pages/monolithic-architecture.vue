<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (variant cards, comparison items, legend items,
 *          timeline items, diagnostic items, module cards, layer rows, decision cards)
 *          are modeled as typed arrays and rendered via v-for, while unique prose,
 *          code blocks, and diagrams stay as direct template markup.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface VariantCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
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

interface LayerRow {
  color: string
  num: string
  title: string
  files: { label: string; colorClass: string }[]
  desc: string
}

interface TimelineItem {
  dotClass: string
  phaseClass: string
  phaseLabel: string
  title: string
  description: string
  tags: { label: string; style?: string }[]
}

interface ModuleCard {
  name: string
  files: { name: string; isPublic: boolean; indent?: boolean }[]
}

interface DecisionCard {
  icon: string
  colorClass: string
  name: string
  title: string
  items: string[]
}

interface DiagItem {
  signalClass: string
  label: string
  text: string
}

interface LegendItem {
  color: string
  label: string
}

const variantCards: VariantCard[] = [
  {
    icon: '\u{1F370}',
    colorClass: 'yellow',
    name: 'Variante 01',
    title: 'Monolithe en couches',
    description:
      '<strong>N-Tier / Layered Architecture.</strong> Organisation horizontale classique : Pr\u00e9sentation \u2192 Logique M\u00e9tier \u2192 Acc\u00e8s aux Donn\u00e9es \u2192 Base de Donn\u00e9es. Chaque couche ne communique qu\u2019avec la couche imm\u00e9diatement inf\u00e9rieure. Simple, \u00e9prouv\u00e9, mais les d\u00e9pendances pointent vers le bas \u2014 la DB dicte souvent la structure.',
    tags: ['3-Tier', 'MVC', 'S\u00e9paration of Concerns'],
  },
  {
    icon: '\u{1F33F}',
    colorClass: 'green',
    name: 'Variante 02',
    title: 'Monolithe modulaire',
    description:
      '<strong>Modular Monolith \u2014 la voie recommand\u00e9e.</strong> Un seul d\u00e9ploiement, mais une structure interne fortement modulaire avec fronti\u00e8res claires entre modules. Chaque module expose une fa\u00e7ade publique et prot\u00e8ge ses d\u00e9tails internes. Le meilleur des deux mondes : simplicit\u00e9 op\u00e9rationnelle + s\u00e9paration des pr\u00e9occupations.',
    tags: ['Modules isol\u00e9s', 'Fa\u00e7ade publique', 'Recommand\u00e9'],
  },
  {
    icon: '\u{1F4A5}',
    colorClass: 'pink',
    name: 'Variante 03',
    title: 'Big Ball of Mud',
    description:
      '<strong>Anti-pattern \u2014 la d\u00e9g\u00e9n\u00e9rescence naturelle.</strong> Aucune fronti\u00e8re interne, couplage total, chaque fichier peut importer n\u2019importe quel autre. R\u00e9sultat in\u00e9vitable si aucune discipline architecturale n\u2019est maintenue. Le monolithe qu\u2019on critique injustement est souvent celui-ci.',
    tags: ['Anti-pattern', 'Couplage total', 'Spaghetti'],
  },
]

const comparisonForces: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Forces',
  dotColor: '#4ae8b0',
  items: [
    { text: '<strong>Simplicit\u00e9 de d\u00e9ploiement</strong> \u2014 un seul artefact \u00e0 d\u00e9ployer, un seul pipeline CI/CD' },
    { text: '<strong>Transactions ACID natives</strong> \u2014 pas de saga, pas d\u2019eventual consistency' },
    { text: '<strong>D\u00e9bogage simple</strong> \u2014 un seul processus, stack trace compl\u00e8te, pas de tracing distribu\u00e9' },
    { text: '<strong>Performance in-process</strong> \u2014 appels directs en m\u00e9moire, latence nulle entre modules' },
    { text: '<strong>Onboarding rapide</strong> \u2014 un seul repo, un seul langage, une seule stack' },
    { text: '<strong>Co\u00fbt op\u00e9rationnel faible</strong> \u2014 pas de service mesh, pas d\u2019orchestrateur de conteneurs' },
    { text: '<strong>Refactoring global facile</strong> \u2014 renommer une m\u00e9thode se propage dans tout le projet' },
  ],
}

const comparisonLimites: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Limites',
  dotColor: '#e84a7a',
  items: [
    { text: '<strong>Scalabilit\u00e9 monolithique</strong> \u2014 on scale tout ou rien, impossible de scaler un module seul' },
    { text: '<strong>Temps de build croissant</strong> \u2014 le build ralentit avec chaque ligne de code ajout\u00e9e' },
    { text: '<strong>Couplage progressif</strong> \u2014 sans discipline, les modules finissent entrem\u00eal\u00e9s' },
    { text: '<strong>D\u00e9ploiement risqu\u00e9</strong> \u2014 un bug dans un module bloque le d\u00e9ploiement de tous les autres' },
    { text: '<strong>Lock-in technologique</strong> \u2014 un seul langage, un seul framework, une seule version' },
    { text: '<strong>Taille d\u2019\u00e9quipe limit\u00e9e</strong> \u2014 au-del\u00e0 de 8\u201310 d\u00e9veloppeurs, les conflits de merge explosent' },
    { text: '<strong>Red\u00e9marrage complet</strong> \u2014 chaque modification n\u00e9cessite un red\u00e9ploiement de tout le syst\u00e8me' },
  ],
}

const entityComparisonBad: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Monolithe classique \u2014 Entity pollu\u00e9e',
  dotColor: '#e84a7a',
  items: [
    { text: 'L\u2019<code>Order</code> entity importe TypeORM, class-validator, Swagger' },
    { text: 'D\u00e9corateurs <code>@Entity</code> <code>@Column</code> <code>@ApiProperty</code> partout' },
    { text: 'Aucune m\u00e9thode m\u00e9tier \u2014 simple sac de donn\u00e9es' },
    { text: 'Le sch\u00e9ma DB dicte la structure du code m\u00e9tier' },
    { text: 'Impossible de tester la logique sans d\u00e9marrer une DB' },
  ],
}

const entityComparisonGood: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Monolithe propre \u2014 deux mod\u00e8les',
  dotColor: '#4ae8b0',
  items: [
    { text: 'Entity domaine s\u00e9par\u00e9e \u2014 TypeScript pur, zero import' },
    { text: 'M\u00e9thodes m\u00e9tier riches : <code>payer()</code> <code>annuler()</code> <code>valider()</code>' },
    { text: 'Mod\u00e8le ORM s\u00e9par\u00e9 pour TypeORM dans le module infrastructure' },
    { text: 'Un <code>Mapper</code> traduit entre les deux mondes' },
    { text: '<code>new Order(items)</code> suffit pour tester \u2014 zero infra' },
  ],
}

const layerRows: LayerRow[] = [
  {
    color: '#4a9ee8',
    num: 'Pr\u00e9sentation',
    title: 'Couche Pr\u00e9sentation',
    files: [
      { label: 'OrderController.ts', colorClass: 'lf-blue' },
      { label: 'ProductController.ts', colorClass: 'lf-blue' },
      { label: 'AuthController.ts', colorClass: 'lf-blue' },
      { label: '@Get @Post @Put @Delete', colorClass: 'lf-blue' },
    ],
    desc: 'Re\u00e7oit les requ\u00eates HTTP, valide les DTO, d\u00e9l\u00e8gue \u00e0 la couche m\u00e9tier, formate les r\u00e9ponses.',
  },
  {
    color: '#a78bfa',
    num: 'Logique m\u00e9tier',
    title: 'Couche Logique M\u00e9tier',
    files: [
      { label: 'OrderService.ts', colorClass: 'lf-purple' },
      { label: 'PaymentService.ts', colorClass: 'lf-purple' },
      { label: 'InventoryService.ts', colorClass: 'lf-purple' },
      { label: 'CustomerService.ts', colorClass: 'lf-purple' },
    ],
    desc: 'Contient les r\u00e8gles m\u00e9tier, orchestration, validations fonctionnelles. Coeur du syst\u00e8me.',
  },
  {
    color: '#4ae8b0',
    num: 'Acc\u00e8s donn\u00e9es',
    title: 'Couche Acc\u00e8s aux Donn\u00e9es',
    files: [
      { label: 'OrderRepository.ts', colorClass: 'lf-green' },
      { label: 'ProductRepository.ts', colorClass: 'lf-green' },
      { label: 'CustomerRepository.ts', colorClass: 'lf-green' },
      { label: 'ORM Entities', colorClass: 'lf-green' },
    ],
    desc: 'Repositories, ORM (TypeORM, Prisma), queries SQL, mapping entit\u00e9s/tables.',
  },
  {
    color: '#e87a4a',
    num: 'Base de donn\u00e9es',
    title: 'Base de Donn\u00e9es',
    files: [
      { label: 'PostgreSQL', colorClass: 'lf-orange' },
      { label: 'MySQL', colorClass: 'lf-orange' },
      { label: 'Oracle', colorClass: 'lf-orange' },
      { label: 'Transactions ACID', colorClass: 'lf-orange' },
    ],
    desc: 'Une seule base de donn\u00e9es partag\u00e9e par tous les modules. Transactions ACID natives.',
  },
]

const timelineItems: TimelineItem[] = [
  {
    dotClass: 'good',
    phaseClass: 'good',
    phaseLabel: 'Phase 1 \u2014 Naissance (0 \u00e0 18 mois)',
    title: 'Le monolithe id\u00e9al',
    description:
      '\u00c9quipe petite (2\u20135 devs), domaine encore flou, it\u00e9rations rapides. Le monolithe est le choix optimal : d\u00e9ploiement simple, d\u00e9bogage facile, transactions ACID gratuites. Les modules sont encore petits et bien s\u00e9par\u00e9s.',
    tags: [
      { label: '2\u20135 devs' },
      { label: 'It\u00e9rations rapides' },
      { label: 'Simplicit\u00e9 maximale' },
    ],
  },
  {
    dotClass: 'warn',
    phaseClass: 'warn',
    phaseLabel: 'Phase 2 \u2014 Croissance (18 mois \u00e0 3 ans)',
    title: 'Les tensions apparaissent',
    description:
      'L\u2019\u00e9quipe grandit (8\u201315 devs), les modules commencent \u00e0 s\u2019entrem\u00ealer. Les builds ralentissent, les conflits de merge se multiplient. C\u2019est le moment critique : modulariser en interne ou subir la d\u00e9gradation.',
    tags: [
      { label: '8\u201315 devs' },
      { label: 'Builds lents' },
      { label: 'Conflits merge', style: 'color:#e8c84a;border-color:rgba(232,200,74,0.3)' },
    ],
  },
  {
    dotClass: 'bad',
    phaseClass: 'bad',
    phaseLabel: 'Phase 3 \u2014 Maturit\u00e9 douloureuse (3 ans+)',
    title: 'La Big Ball of Mud',
    description:
      'Sans discipline, le monolithe d\u00e9g\u00e9n\u00e8re. Chaque fichier peut importer n\u2019importe quel autre, les tests sont lents ou inexistants, d\u00e9ployer est un \u00e9v\u00e9nement stressant. L\u2019\u00e9quipe passe plus de temps \u00e0 contourner le code qu\u2019\u00e0 le construire.',
    tags: [
      { label: 'Couplage total', style: 'color:#e84a7a;border-color:rgba(232,74,122,0.3)' },
      { label: 'Tests impossible', style: 'color:#e84a7a;border-color:rgba(232,74,122,0.3)' },
      { label: 'Peur du d\u00e9ploiement', style: 'color:#e84a7a;border-color:rgba(232,74,122,0.3)' },
    ],
  },
  {
    dotClass: 'info',
    phaseClass: 'info',
    phaseLabel: 'Phase 4 \u2014 La d\u00e9cision',
    title: 'Trois chemins possibles',
    description:
      '1. Modulariser le monolithe (monolithe modulaire). 2. Extraire progressivement des services (Strangler Fig). 3. Rester en monolithe si l\u2019\u00e9quipe et le domaine le permettent. Le pire choix : ne rien faire.',
    tags: [
      { label: 'Modulariser' },
      { label: 'Strangler Fig' },
      { label: 'Rester monolithe' },
    ],
  },
]

const moduleCards: ModuleCard[] = [
  {
    name: 'Orders',
    files: [
      { name: 'api/', isPublic: true },
      { name: 'OrdersFacade.ts \u2713', isPublic: true, indent: true },
      { name: 'internal/', isPublic: false },
      { name: 'OrderService.ts', isPublic: false, indent: true },
      { name: 'OrderRepository.ts', isPublic: false, indent: true },
      { name: 'Order.ts (entity)', isPublic: false, indent: true },
    ],
  },
  {
    name: 'Products',
    files: [
      { name: 'api/', isPublic: true },
      { name: 'ProductsFacade.ts \u2713', isPublic: true, indent: true },
      { name: 'internal/', isPublic: false },
      { name: 'ProductService.ts', isPublic: false, indent: true },
      { name: 'ProductRepository.ts', isPublic: false, indent: true },
      { name: 'Product.ts (entity)', isPublic: false, indent: true },
    ],
  },
  {
    name: 'Payments',
    files: [
      { name: 'api/', isPublic: true },
      { name: 'PaymentsFacade.ts \u2713', isPublic: true, indent: true },
      { name: 'internal/', isPublic: false },
      { name: 'StripeAdapter.ts', isPublic: false, indent: true },
      { name: 'PaymentRepository.ts', isPublic: false, indent: true },
    ],
  },
  {
    name: 'Customers',
    files: [
      { name: 'api/', isPublic: true },
      { name: 'CustomersFacade.ts \u2713', isPublic: true, indent: true },
      { name: 'internal/', isPublic: false },
      { name: 'CustomerService.ts', isPublic: false, indent: true },
      { name: 'Customer.ts (entity)', isPublic: false, indent: true },
    ],
  },
]

const decisionCards: DecisionCard[] = [
  {
    icon: '\u2705',
    colorClass: 'green',
    name: 'Recommand\u00e9',
    title: 'Choisir le monolithe si\u2026',
    items: [
      '\u00c9quipe petite (< 10 devs) avec un domaine encore flou',
      'MVP ou produit en phase de d\u00e9couverte',
      'Transactions ACID requises entre modules',
      'Budget infra limit\u00e9 \u2014 pas de Kubernetes en vue',
      'L\u2019\u00e9quipe n\u2019a pas l\u2019exp\u00e9rience des syst\u00e8mes distribu\u00e9s',
    ],
  },
  {
    icon: '\u26A0\uFE0F',
    colorClass: 'pink',
    name: 'Signaux d\u2019alerte',
    title: 'Envisager la migration si\u2026',
    items: [
      'Les builds d\u00e9passent 15\u201320 minutes r\u00e9guli\u00e8rement',
      'Les \u00e9quipes se bloquent mutuellement \u00e0 chaque d\u00e9ploiement',
      'Un module n\u00e9cessite un scaling 10x mais pas les autres',
      'L\u2019onboarding d\u2019un nouveau d\u00e9veloppeur d\u00e9passe 2 semaines',
      'Les tests end-to-end prennent plus de temps que les tests unitaires',
    ],
  },
  {
    icon: '\u{1F4A1}',
    colorClass: 'yellow',
    name: 'Mythes',
    title: 'Les mythes \u00e0 d\u00e9mystifier',
    items: [
      '\u00ab Monolithe = mauvais \u00bb \u2014 Faux. Un monolithe modulaire est une architecture saine.',
      '\u00ab Microservices = moderne \u00bb \u2014 Faux. C\u2019est un choix d\u2019organisation, pas de modernit\u00e9.',
      '\u00ab On ne peut pas scaler un monolithe \u00bb \u2014 Faux. On scale l\u2019instance, pas le module.',
      '\u00ab Il faut tout r\u00e9\u00e9crire \u00bb \u2014 Faux. Le Strangler Fig permet une migration progressive.',
      '\u00ab Les monolithes ne peuvent pas \u00eatre test\u00e9s \u00bb \u2014 Faux. Avec une bonne architecture interne, tout est testable.',
    ],
  },
]

const goodSignals: DiagItem[] = [
  {
    signalClass: 'good-signal',
    label: 'Tests rapides',
    text: 'La suite de tests unitaires s\u2019ex\u00e9cute en moins de 5 minutes. Les tests d\u2019int\u00e9gration sont isol\u00e9s par module.',
  },
  {
    signalClass: 'good-signal',
    label: 'D\u00e9ploiement serein',
    text: 'L\u2019\u00e9quipe d\u00e9ploie plusieurs fois par semaine sans angoisse. Le rollback est rapide et automatis\u00e9.',
  },
  {
    signalClass: 'good-signal',
    label: 'Onboarding rapide',
    text: 'Un nouveau d\u00e9veloppeur est productif en moins d\u2019une semaine. La structure du projet est claire et document\u00e9e.',
  },
  {
    signalClass: 'good-signal',
    label: 'Changements isol\u00e9s',
    text: 'Modifier un module ne casse pas les autres. Les tests rouges restent dans le p\u00e9rim\u00e8tre du changement.',
  },
]

const badSignals: DiagItem[] = [
  {
    signalClass: 'bad-signal',
    label: 'Le fichier maudit',
    text: 'Un fichier est modifi\u00e9 dans 80% des pull requests. Tout le monde le touche, personne ne le comprend.',
  },
  {
    signalClass: 'bad-signal',
    label: 'Builds > 30 min',
    text: 'Le build prend plus de 30 minutes. Les d\u00e9veloppeurs lancent le build et vont prendre un caf\u00e9.',
  },
  {
    signalClass: 'bad-signal',
    label: 'Peur de d\u00e9ployer',
    text: 'Le d\u00e9ploiement est un \u00e9v\u00e9nement stressant. On ne d\u00e9ploie que le vendredi\u2026 non, jamais le vendredi.',
  },
  {
    signalClass: 'bad-signal',
    label: 'Bugs cascade',
    text: 'Un changement dans le module Paiement casse le module Commandes. Le couplage est invisible mais r\u00e9el.',
  },
]

const legendItems: LegendItem[] = [
  { color: '#4a9ee8', label: 'Couche Pr\u00e9sentation' },
  { color: '#a78bfa', label: 'Logique M\u00e9tier' },
  { color: '#4ae8b0', label: 'Acc\u00e8s aux Donn\u00e9es' },
  { color: '#e87a4a', label: 'Base de Donn\u00e9es' },
  { color: '#e84a7a', label: 'Anti-patterns' },
  { color: '#e8c84a', label: 'R\u00e8gle / Principe' },
]

const codeFileTree = `<span class="cm">src/</span>
<span class="ty">\u251C\u2500\u2500 modules/</span>
<span class="ty">\u2502   \u251C\u2500\u2500 orders/</span>
<span class="fn">\u2502   \u2502   \u251C\u2500\u2500 orders.controller.ts</span>       <span class="cm">// @Controller('orders') \u2014 HTTP routing</span>
<span class="fn">\u2502   \u2502   \u251C\u2500\u2500 orders.service.ts</span>          <span class="cm">// Logique m\u00e9tier commandes</span>
<span class="fn">\u2502   \u2502   \u251C\u2500\u2500 orders.repository.ts</span>       <span class="cm">// TypeORM \u2014 acc\u00e8s DB</span>
<span class="fn">\u2502   \u2502   \u251C\u2500\u2500 order.entity.ts</span>            <span class="cm">// @Entity() TypeORM</span>
<span class="fn">\u2502   \u2502   \u2514\u2500\u2500 orders.module.ts</span>           <span class="cm">// @Module \u2014 DI config</span>
<span class="ty">\u2502   \u2502</span>
<span class="ty">\u2502   \u251C\u2500\u2500 products/</span>
<span class="fn">\u2502   \u2502   \u251C\u2500\u2500 products.controller.ts</span>
<span class="fn">\u2502   \u2502   \u251C\u2500\u2500 products.service.ts</span>
<span class="fn">\u2502   \u2502   \u2514\u2500\u2500 ...</span>
<span class="ty">\u2502   \u2502</span>
<span class="ty">\u2502   \u251C\u2500\u2500 customers/</span>
<span class="fn">\u2502   \u2502   \u2514\u2500\u2500 ...</span>
<span class="ty">\u2502   \u2502</span>
<span class="ty">\u2502   \u2514\u2500\u2500 payments/</span>
<span class="fn">\u2502       \u251C\u2500\u2500 payments.service.ts</span>        <span class="cm">// Wraps Stripe SDK directement</span>
<span class="fn">\u2502       \u2514\u2500\u2500 ...</span>
<span class="ty">\u2502</span>
<span class="ty">\u251C\u2500\u2500 app.module.ts</span>                       <span class="cm">// Root module \u2014 importe tout</span>
<span class="ty">\u2514\u2500\u2500 main.ts</span>                             <span class="cm">// NestFactory.create() \u2014 1 seul processus</span>`

const codeOrdersService = `<span class="op">@Injectable</span>()
<span class="kw">export class</span> <span class="ty">OrdersService</span> {
  <span class="fn">constructor</span>(
    <span class="kw">private readonly</span> repo:        <span class="ty">OrdersRepository</span>,
    <span class="kw">private readonly</span> products:    <span class="ty">ProductsService</span>,   <span class="cm">// \u2190 appel direct en m\u00e9moire</span>
    <span class="kw">private readonly</span> payments:    <span class="ty">PaymentsService</span>,   <span class="cm">// \u2190 pas de HTTP, pas de latence</span>
    <span class="kw">private readonly</span> customers:   <span class="ty">CustomersService</span>,  <span class="cm">// \u2190 transaction ACID gratuite</span>
  ) {}

  <span class="kw">async</span> <span class="fn">createOrder</span>(dto: <span class="ty">CreateOrderDto</span>): <span class="ty">Promise&lt;Order&gt;</span> {
    <span class="cm">// 1. V\u00e9rification stock \u2014 appel direct, synchrone, in-process</span>
    <span class="kw">const</span> product = <span class="kw">await this</span>.products.<span class="fn">findById</span>(dto.productId);
    <span class="kw">if</span> (!product.<span class="fn">isInStock</span>(dto.quantity))
      <span class="kw">throw new</span> <span class="ty">BadRequestException</span>(<span class="str">'Stock insuffisant'</span>);

    <span class="cm">// 2. Paiement \u2014 m\u00eame processus, m\u00eame transaction DB possible</span>
    <span class="kw">const</span> payment = <span class="kw">await this</span>.payments.<span class="fn">charge</span>(dto.amount, dto.cardToken);

    <span class="cm">// 3. Cr\u00e9ation commande \u2014 tout dans la m\u00eame transaction ACID</span>
    <span class="kw">const</span> order = <span class="kw">await this</span>.repo.<span class="fn">save</span>({ ...dto, paymentId: payment.id });
    <span class="kw">await this</span>.products.<span class="fn">decrementStock</span>(dto.productId, dto.quantity);

    <span class="kw">return</span> order; <span class="cm">// Si n'importe quoi \u00e9choue \u2192 rollback automatique</span>
  }
}`

const codeModularService = `<span class="cm">// CORRECT : on passe par les fa\u00e7ades publiques des autres modules</span>
<span class="op">@Injectable</span>()
<span class="kw">export class</span> <span class="ty">OrdersService</span> {
  <span class="fn">constructor</span>(
    <span class="kw">private readonly</span> repo:      <span class="ty">OrdersRepository</span>,   <span class="cm">// \u2190 internal OK</span>
    <span class="kw">private readonly</span> products:  <span class="ty">ProductsFacade</span>,    <span class="cm">// \u2190 fa\u00e7ade publique \u2713</span>
    <span class="kw">private readonly</span> payments:  <span class="ty">PaymentsFacade</span>,    <span class="cm">// \u2190 fa\u00e7ade publique \u2713</span>
  ) {}
}

<span class="cm">// INTERDIT : importation depuis internal/ d'un autre module</span>
<span class="cm">// import { ProductRepository } from '../products/internal/product.repository'; // \u2717</span>
<span class="cm">// import { Product }           from '../products/internal/product.entity';     // \u2717</span>`

/* ── Sidebar navigation ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'metaphore', label: 'La m\u00e9taphore' },
      { id: 'anatomie', label: 'Les 4 couches' },
      { id: 'variantes', label: 'Les 3 variantes' },
    ],
  },
  {
    label: 'Code & Structure',
    links: [
      { id: 'exemple', label: 'Exemple e-commerce' },
      { id: 'modulaire', label: 'Monolithe modulaire' },
    ],
  },
  {
    label: 'Analyse',
    links: [
      { id: 'cycle', label: 'Cycle de vie' },
      { id: 'avantages', label: 'Avantages & limites' },
      { id: 'entity', label: 'L\u2019Entity pi\u00e8ge' },
    ],
  },
  {
    label: 'D\u00e9cision',
    links: [
      { id: 'quand', label: 'Quand choisir ?' },
      { id: 'diagnostic', label: 'Diagnostic' },
    ],
  },
]

useHead({
  title: 'Architecture Monolithique \u2014 R\u00e9f\u00e9rence compl\u00e8te',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Architecture Monolithique \u2014 R\u00e9f\u00e9rence compl\u00e8te',
        description:
          'Architecture Monolithique : anatomie, cycle de vie, variantes (monolithe en couches, monolithe modulaire, Big Ball of Mud), exemples NestJS, et d\u00e9cisions de migration.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/monolithic-architecture',
        author: [
          {
            '@type': 'Person',
            name: 'Martin Fowler',
          },
          {
            '@type': 'Person',
            name: 'Robert C. Martin',
          },
        ],
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Architecture Monolithique : anatomie, cycle de vie, variantes (monolithe en couches, monolithe modulaire, Big Ball of Mud), exemples NestJS, et d\u00e9cisions de migration.',
  ogTitle: 'Architecture Monolithique \u2014 R\u00e9f\u00e9rence compl\u00e8te',
  ogDescription:
    'Architecture Monolithique : anatomie, cycle de vie, variantes (monolithe en couches, monolithe modulaire, Big Ball of Mud), exemples NestJS, et d\u00e9cisions de migration.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/monolithic-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Architecture Monolithique \u2014 R\u00e9f\u00e9rence compl\u00e8te',
  twitterDescription:
    'Architecture Monolithique : anatomie, cycle de vie, variantes (monolithe en couches, monolithe modulaire, Big Ball of Mud), exemples NestJS, et d\u00e9cisions de migration.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="Architecture<br>Monolithique"
      :groups="sidebarGroups"
      accent-color="#e8c84a"
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
      <div class="eyebrow">// Architecture Monolithique &mdash; R&eacute;f&eacute;rence compl&egrave;te</div>
      <h1>L&rsquo;Architecture <em>Monolithique</em></h1>
      <p class="subtitle">
        Anatomie, cycle de vie, variantes et d&eacute;cisions &mdash; du monolithe na&iuml;f au
        monolithe modulaire, selon Martin Fowler et Robert C. Martin.
      </p>
    </header>

    <!-- Quote box -->
    <div class="quote-box">
      <div class="quote-icon">&#x1F3DB;&#xFE0F;</div>
      <div class="quote-content">
        <h3>Martin Fowler &amp; Uncle Bob &mdash; le consensus</h3>
        <p>
          &laquo;&nbsp;Ne commencez <em>jamais</em> avec les microservices. Un monolithe bien
          structur&eacute; est le bon point de d&eacute;part &mdash; vous ne connaissez pas encore
          vos fronti&egrave;res de domaine.&nbsp;&raquo; &mdash; Martin Fowler
        </p>
        <p>
          Uncle Bob ajoute&nbsp;: <em>&laquo;&nbsp;Le monolithe n&rsquo;est pas le
          probl&egrave;me. Le monolithe non-modulaire, lui, l&rsquo;est. Un d&eacute;ploiement
          unique n&rsquo;interdit pas une architecture propre.&nbsp;&raquo;</em>
        </p>
      </div>
    </div>

    <!-- Section 01 : La metaphore -->
    <section id="metaphore" class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La m&eacute;taphore : le couteau suisse</h2>
        <div class="section-line" />
      </div>
      <div class="prose">
        <p>
          Imagine un <strong>couteau suisse</strong>. Tous les outils sont dans le m&ecirc;me
          bo&icirc;tier&nbsp;: lame, tire-bouchon, ciseaux, tournevis. Quand il est bien con&ccedil;u,
          chaque outil a sa place et fonctionne ind&eacute;pendamment. Quand il est mal con&ccedil;u,
          les outils se bloquent mutuellement et ouvrir le tire-bouchon entra&icirc;ne la lame.
        </p>
        <p>
          C&rsquo;est exactement un monolithe. Le probl&egrave;me n&rsquo;est pas le bo&icirc;tier
          unique &mdash; c&rsquo;est <em>l&rsquo;organisation interne</em>. Un monolithe modulaire
          est un couteau suisse bien con&ccedil;u. Un Big Ball of Mud est un couteau suisse o&ugrave;
          tout est soud&eacute;.
        </p>
        <p>
          La m&eacute;taphore va plus loin&nbsp;: si un jour vous avez besoin d&rsquo;une
          trononneuse, le couteau suisse ne suffira plus. Mais pour 90% des usages
          quotidiens, il est parfait &mdash; et surtout, il tient dans votre poche.
        </p>
      </div>
    </section>

    <!-- Section 02 : Anatomie -->
    <section id="anatomie" class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Anatomie d&rsquo;un monolithe &mdash; les 4 couches</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Un monolithe est un syst&egrave;me d&eacute;ploy&eacute; comme <strong>un seul
          artefact</strong>, ex&eacute;cut&eacute; dans <strong>un seul processus</strong>, avec
          <strong>une seule base de donn&eacute;es</strong>. Quelle que soit sa taille, il
          s&rsquo;organise g&eacute;n&eacute;ralement en 4 couches horizontales.
        </p>
      </div>

      <!-- Monolith diagram (custom, not v-for) -->
      <div class="monolith-diagram">
        <div class="monolith-deploy-label">
          monolith-app.jar &mdash; 1 seul artefact &middot; 1 seul processus &middot; 1 seul d&eacute;ploiement
        </div>
        <div class="monolith-inner">
          <!-- Couche Presentation -->
          <div class="mono-layer mono-ui">
            <span class="mono-layer-icon">&#x1F310;</span>
            <div class="mono-layer-content">
              <div class="mono-layer-name">Couche Pr&eacute;sentation</div>
              <div class="mono-layer-detail">Controllers, vues, API REST, GraphQL</div>
            </div>
            <span class="tag">HTTP</span>
          </div>
          <div class="mono-arrow">&updownarrow;</div>
          <!-- Couche Logique Metier -->
          <div class="mono-layer mono-biz">
            <span class="mono-layer-icon">&#x2699;&#xFE0F;</span>
            <div class="mono-layer-content">
              <div class="mono-layer-name">Couche Logique M&eacute;tier</div>
              <div class="mono-layer-detail">Services, orchestrateurs, r&egrave;gles m&eacute;tier</div>
            </div>
            <span class="tag">CORE</span>
          </div>
          <div class="mono-arrow">&updownarrow;</div>
          <!-- Couche Acces aux Donnees -->
          <div class="mono-layer mono-dal">
            <span class="mono-layer-icon">&#x1F5C4;&#xFE0F;</span>
            <div class="mono-layer-content">
              <div class="mono-layer-name">Couche Acc&egrave;s aux Donn&eacute;es</div>
              <div class="mono-layer-detail">Repositories, ORM</div>
            </div>
            <span class="tag">DATA</span>
          </div>
          <div class="mono-arrow">&updownarrow;</div>
          <!-- Base de Donnees -->
          <div class="mono-layer mono-db">
            <span class="mono-layer-icon">&#x1F4BE;</span>
            <div class="mono-layer-content">
              <div class="mono-layer-name">Base de Donn&eacute;es</div>
              <div class="mono-layer-detail">PostgreSQL, MySQL, Oracle</div>
            </div>
            <span class="tag">ACID</span>
          </div>
        </div>
      </div>

      <!-- Layers diagram (v-for) -->
      <div class="layers-diagram">
        <div
          v-for="layer in layerRows"
          :key="layer.num"
          class="layer-row"
          :style="{ '--layer-color': layer.color }"
        >
          <div class="layer-num">{{ layer.num }}</div>
          <div class="layer-content">
            <div class="layer-title">{{ layer.title }}</div>
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
            <div class="layer-desc">{{ layer.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 03 : Les 3 variantes -->
    <section id="variantes" class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">Les 3 variantes du monolithe</h2>
        <div class="section-line" />
      </div>

      <div class="cards">
        <article
          v-for="card in variantCards"
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
        </article>
      </div>
    </section>

    <!-- Section 04 : Exemple concret e-commerce -->
    <section id="exemple" class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">Exemple concret &mdash; e-commerce NestJS</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Voici la structure typique d&rsquo;un monolithe NestJS pour un e-commerce. Tous les
          modules vivent dans le m&ecirc;me projet, le m&ecirc;me processus, le m&ecirc;me
          d&eacute;ploiement. Les appels entre modules sont des appels de m&eacute;thode directe
          &mdash; pas de HTTP, pas de gRPC, pas de message broker.
        </p>
      </div>

      <!-- File tree -->
      <div class="code-filename">Structure du projet NestJS &mdash; monolithe e-commerce</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeFileTree" />

      <div class="prose">
        <p>
          L&rsquo;avantage cl&eacute; du monolithe : les appels entre modules sont des
          <strong>appels in-process directs</strong>. <code>OrdersService</code> appelle
          <code>ProductsService.findById()</code> directement en m&eacute;moire, sans s&eacute;rialisation,
          sans latence r&eacute;seau, sans gestion d&rsquo;erreurs distribu&eacute;es.
        </p>
      </div>

      <!-- Code block: OrdersService -->
      <div class="code-filename">modules/orders/orders.service.ts &mdash; appels inter-modules directs</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeOrdersService" />

      <div class="info-box">
        <strong>L&rsquo;avantage transactionnel.</strong> Dans un monolithe, les op&eacute;rations
        <code>save(order)</code>, <code>decrementStock()</code> et <code>charge()</code> peuvent
        vivre dans la m&ecirc;me transaction ACID. Si le paiement &eacute;choue, tout est
        automatiquement annul&eacute;. En microservices, il faudrait impl&eacute;menter un Saga
        pattern avec compensation &mdash; 10x plus complexe.
      </div>
    </section>

    <!-- Section 05 : Le monolithe modulaire -->
    <section id="modulaire" class="section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">Le Monolithe Modulaire &mdash; la voie vertueuse</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Le monolithe modulaire est la <strong>variante recommand&eacute;e</strong> par Martin
          Fowler et Uncle Bob. Le principe&nbsp;: chaque module expose une
          <em>fa&ccedil;ade publique</em> (un fichier <code>*Facade.ts</code>) et prot&egrave;ge
          tout le reste dans un dossier <code>internal/</code>. Les autres modules n&rsquo;ont
          acc&egrave;s qu&rsquo;&agrave; la fa&ccedil;ade.
        </p>
        <p>
          R&eacute;sultat&nbsp;: les avantages du monolithe (simplicit&eacute; de d&eacute;ploiement,
          transactions ACID, performance in-process) avec les avantages de la modularit&eacute;
          (couplage faible, &eacute;quipes autonomes, refactoring isol&eacute;). Et le jour
          o&ugrave; un module doit devenir un service ind&eacute;pendant, la fronti&egrave;re
          existe d&eacute;j&agrave;.
        </p>
      </div>

      <!-- Module grid -->
      <div class="module-grid">
        <div
          v-for="mod in moduleCards"
          :key="mod.name"
          class="module-card"
        >
          <div class="module-card-name">{{ mod.name }}</div>
          <div class="module-card-files">
            <div
              v-for="file in mod.files"
              :key="file.name"
              class="module-file"
              :class="[file.isPublic ? 'public' : 'private', file.indent ? 'indent' : '']"
            >
              {{ file.isPublic && !file.indent ? 'PUBLIC' : '' }}
              {{ !file.isPublic && !file.indent ? 'PRIV\u00c9' : '' }}
              {{ file.indent ? '' : '' }}
              {{ file.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="rule-banner">
        <strong>R&egrave;gle d&rsquo;or du monolithe modulaire&nbsp;:</strong><br>
        Un module ne peut importer QUE la fa&ccedil;ade publique d&rsquo;un autre module.<br>
        Jamais un fichier de <code>internal/</code>. Jamais une Entity directement.<br>
        La fa&ccedil;ade est le <strong>seul point de contact</strong> entre modules.
      </div>

      <!-- Code block: modular service -->
      <div class="code-filename">modules/orders/orders.service.ts &mdash; via fa&ccedil;ades</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeModularService" />
    </section>

    <!-- Section 06 : Cycle de vie -->
    <section id="cycle" class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Le cycle de vie d&rsquo;un monolithe</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Tout monolithe traverse les m&ecirc;mes phases. Les reconna&icirc;tre t&ocirc;t permet
          d&rsquo;agir <em>avant</em> la d&eacute;g&eacute;n&eacute;rescence. La cl&eacute;&nbsp;:
          modulariser en phase 2, pas en phase 3.
        </p>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        <div
          v-for="item in timelineItems"
          :key="item.phaseLabel"
          class="timeline-item"
        >
          <div class="timeline-dot" :class="item.dotClass" />
          <div class="timeline-phase" :class="item.phaseClass">{{ item.phaseLabel }}</div>
          <div class="timeline-title">{{ item.title }}</div>
          <div class="timeline-desc">{{ item.description }}</div>
          <div class="timeline-tags">
            <span
              v-for="tag in item.tags"
              :key="tag.label"
              class="tag"
              :style="tag.style || ''"
            >
              {{ tag.label }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 07 : Avantages & inconvenients -->
    <section id="avantages" class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">Avantages &amp; inconv&eacute;nients &agrave; grande &eacute;chelle</h2>
        <div class="section-line" />
      </div>

      <div class="comparison">
        <div class="cmp-col">
          <div class="cmp-header" :class="comparisonForces.headerClass">
            {{ comparisonForces.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in comparisonForces.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: comparisonForces.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
        <div class="cmp-col">
          <div class="cmp-header" :class="comparisonLimites.headerClass">
            {{ comparisonLimites.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in comparisonLimites.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: comparisonLimites.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 08 : La critique d'Uncle Bob -->
    <section id="entity" class="section">
      <div class="section-header">
        <span class="section-number">08</span>
        <h2 class="section-title">La critique d&rsquo;Uncle Bob &mdash; l&rsquo;Entity pi&egrave;ge</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          La plus grande erreur dans un monolithe classique&nbsp;: confondre l&rsquo;Entity ORM
          (mod&egrave;le de persistance) avec l&rsquo;Entity domaine (r&egrave;gles m&eacute;tier).
          Uncle Bob le r&eacute;p&egrave;te&nbsp;: <strong>&laquo;&nbsp;Si votre Entity a un
          d&eacute;corateur <code>@Entity</code> ou un import TypeORM, ce n&rsquo;est pas une
          Entity au sens de la Clean Architecture.&nbsp;&raquo;</strong>
        </p>
        <p>
          Dans un monolithe, cette confusion est encore plus insidieuse car tout vit dans le
          m&ecirc;me processus. La tentation de r&eacute;utiliser le mod&egrave;le ORM comme
          mod&egrave;le m&eacute;tier est forte &mdash; et c&rsquo;est exactement ainsi que le
          couplage s&rsquo;installe progressivement.
        </p>
      </div>

      <!-- Comparison table -->
      <div class="comparison">
        <div class="cmp-col">
          <div class="cmp-header" :class="entityComparisonBad.headerClass">
            {{ entityComparisonBad.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in entityComparisonBad.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: entityComparisonBad.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
        <div class="cmp-col">
          <div class="cmp-header" :class="entityComparisonGood.headerClass">
            {{ entityComparisonGood.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in entityComparisonGood.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: entityComparisonGood.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
      </div>

      <div class="warn-box">
        <strong>Le p&eacute;ch&eacute; cardinal&nbsp;:</strong> importer directement une Entity
        TypeORM dans un service m&eacute;tier. Le jour o&ugrave; le sch&eacute;ma DB change, toute
        la logique m&eacute;tier casse. S&eacute;parez vos mod&egrave;les et utilisez un Mapper.
      </div>
    </section>

    <!-- Section 09 : Quand choisir -->
    <section id="quand" class="section">
      <div class="section-header">
        <span class="section-number">09</span>
        <h2 class="section-title">Quand choisir le monolithe ?</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Le choix d&rsquo;une architecture est une d&eacute;cision &eacute;conomique, pas
          technologique. Martin Fowler le r&eacute;p&egrave;te&nbsp;: commencez par un monolithe,
          extrayez des services quand les contraintes l&rsquo;exigent &mdash; pas avant.
        </p>
      </div>

      <!-- Decision flow -->
      <div class="dep-flow">
        <div class="dep-node" style="color:#4ae8b0;border-color:rgba(74,232,176,0.4);background:rgba(74,232,176,0.08);">
          Nouveau<br>projet
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
        </div>
        <div class="dep-node" style="color:#a78bfa;border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.08);">
          Monolithe<br>modul.
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#e8c84a;">&rarr;</span>
        </div>
        <div class="dep-node" style="color:#e8c84a;border-color:rgba(232,200,74,0.4);background:rgba(232,200,74,0.08);">
          Refacto<br>interne
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#e87a4a;">&rarr;</span>
        </div>
        <div class="dep-node" style="color:#e87a4a;border-color:rgba(232,122,74,0.4);background:rgba(232,122,74,0.08);">
          Strangler<br>Fig
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#e84a7a;">&rarr;</span>
        </div>
        <div class="dep-node" style="color:#e84a7a;border-color:rgba(232,74,122,0.4);background:rgba(232,74,122,0.08);">
          Micro-<br>services
        </div>
      </div>

      <!-- Decision cards -->
      <div class="cards">
        <article
          v-for="card in decisionCards"
          :key="card.name"
          class="card"
          :class="card.colorClass"
        >
          <span class="card-icon">{{ card.icon }}</span>
          <div class="card-name">{{ card.name }}</div>
          <div class="card-title">{{ card.title }}</div>
          <ul class="card-list">
            <li
              v-for="item in card.items"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </article>
      </div>
    </section>

    <!-- Section 10 : Le diagnostic -->
    <section id="diagnostic" class="section">
      <div class="section-header">
        <span class="section-number">10</span>
        <h2 class="section-title">Le diagnostic &mdash; Votre monolithe est-il sain ?</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Avant de d&eacute;cider de migrer ou de rester en monolithe, posez le diagnostic.
          Voici les signaux &agrave; observer dans votre code, vos builds et votre &eacute;quipe.
        </p>
      </div>

      <div class="diag-section-label good-label">Signaux positifs &mdash; monolithe sain</div>

      <!-- Good signals -->
      <div class="diagnostic-grid">
        <div
          v-for="signal in goodSignals"
          :key="signal.label"
          class="diag-item"
          :class="signal.signalClass"
        >
          <div class="diag-dot" />
          <div>
            <div class="diag-label">{{ signal.label }}</div>
            <div class="diag-text">{{ signal.text }}</div>
          </div>
        </div>
      </div>

      <div class="diag-section-label bad-label">Signaux d&rsquo;alerte &mdash; monolithe en souffrance</div>

      <!-- Bad signals -->
      <div class="diagnostic-grid">
        <div
          v-for="signal in badSignals"
          :key="signal.label"
          class="diag-item"
          :class="signal.signalClass"
        >
          <div class="diag-dot" />
          <div>
            <div class="diag-label">{{ signal.label }}</div>
            <div class="diag-text">{{ signal.text }}</div>
          </div>
        </div>
      </div>

      <div class="info-box">
        <strong>Chemin de sortie recommand&eacute;&nbsp;:</strong> Si vous avez 3+ signaux
        d&rsquo;alerte, commencez par modulariser votre monolithe (monolithe modulaire).
        Si le monolithe modulaire ne suffit pas, utilisez le pattern
        <em>Strangler Fig</em> pour extraire progressivement des services &mdash; jamais de
        big-bang rewrite.
      </div>
    </section>

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
.back-link:hover { color: var(--accent); }
.back-link::before { content: '\2190'; font-size: 14px; }

/* Header */
header {
  margin-bottom: 72px;
  border-left: 3px solid var(--accent);
  padding-left: 24px;
}

.eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

h1 {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--white);
  line-height: 1.15;
  margin-bottom: 16px;
}

h1 em { font-style: italic; color: var(--accent); }

.subtitle {
  font-size: 1rem;
  color: var(--muted);
  max-width: 560px;
}

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
  color: var(--accent);
  background: rgba(232,200,74,0.08);
  border: 1px solid rgba(232,200,74,0.2);
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
.prose em { color: var(--accent); font-style: italic; }

/* Quote callout */
.quote-box {
  background: linear-gradient(135deg, rgba(232,200,74,0.06), rgba(74,232,176,0.04));
  border: 1px solid rgba(232,200,74,0.2);
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
  color: var(--accent);
  margin-bottom: 8px;
}

.quote-content p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.75;
}

.quote-content em { color: var(--accent2); font-style: italic; }

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
  background: var(--card-accent, var(--accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.card:hover { border-color: var(--card-accent, var(--accent)); transform: translateY(-2px); }
.card:hover::before { transform: scaleX(1); }

.card-icon { font-size: 1.6rem; margin-bottom: 12px; display: block; }

.card-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--card-accent, var(--accent));
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

.card-list {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.7;
  padding-left: 18px;
  margin-bottom: 8px;
}

.card-list li { margin-bottom: 6px; }

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
  color: rgba(232,200,74,0.5);
  border-left: 2px solid rgba(232,200,74,0.2);
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

/* Code blocks */
.code-block {
  background: #0a0c10;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
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

/* Layers diagram (horizontal) */
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

.layer-files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.layer-file {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 3px;
  border: 1px solid;
  letter-spacing: 0.04em;
}

.layer-desc {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.5;
  max-width: 700px;
}

.lf-green  { color: #4ae8b0; border-color: rgba(74,232,176,0.25); background: rgba(74,232,176,0.06); }
.lf-purple { color: #a78bfa; border-color: rgba(167,139,250,0.25); background: rgba(167,139,250,0.06); }
.lf-blue   { color: #4a9ee8; border-color: rgba(74,158,232,0.25); background: rgba(74,158,232,0.06); }
.lf-orange { color: #e87a4a; border-color: rgba(232,122,74,0.25); background: rgba(232,122,74,0.06); }
.lf-red    { color: #e84a7a; border-color: rgba(232,74,122,0.25); background: rgba(232,74,122,0.06); }
.lf-yellow { color: #e8c84a; border-color: rgba(232,200,74,0.25); background: rgba(232,200,74,0.06); }

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

/* Rule banner */
.rule-banner {
  background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(74,232,176,0.06));
  border: 1px solid rgba(167,139,250,0.25);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 28px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  color: var(--purple);
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.rule-banner strong { color: var(--white); }

/* Dependency flow (horizontal) */
.dep-flow {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 32px 0;
  overflow-x: auto;
  padding-bottom: 4px;
}

.dep-node {
  flex-shrink: 0;
  padding: 14px 20px;
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: center;
  line-height: 1.4;
  border: 1px solid;
}

.dep-arrow-h {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 6px;
  gap: 2px;
}

.dep-arrow-h .arr {
  font-size: 1.1rem;
}

.dep-arrow-h .arr-txt {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.08em;
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

/* Inline code */
.section :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

/* Legend */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
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

/* ===== Monolith-specific styles ===== */

/* Monolith diagram */
.monolith-diagram {
  margin: 40px 0;
  border: 2px solid rgba(232,200,74,0.3);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: rgba(232,200,74,0.03);
}

.monolith-deploy-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 10px 20px;
  background: rgba(232,200,74,0.06);
  border-bottom: 1px solid rgba(232,200,74,0.15);
  display: flex;
  align-items: center;
  gap: 10px;
}

.monolith-deploy-label::before {
  content: '';
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.monolith-inner {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mono-layer {
  border-radius: 6px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: opacity 0.2s;
  position: relative;
}

.mono-layer-icon { font-size: 1.4rem; flex-shrink: 0; }
.mono-layer-content { flex: 1; }

.mono-layer-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.mono-layer-detail {
  font-size: 0.8rem;
  color: var(--muted);
}

.mono-arrow {
  text-align: center;
  color: var(--muted);
  font-size: 1.2rem;
  line-height: 1;
  padding: 2px 0;
}

.mono-db { background: rgba(232,122,74,0.1); border: 1px solid rgba(232,122,74,0.3); }
.mono-db .mono-layer-name { color: var(--orange); }

.mono-dal { background: rgba(74,232,176,0.07); border: 1px solid rgba(74,232,176,0.2); }
.mono-dal .mono-layer-name { color: var(--green); }

.mono-biz { background: rgba(167,139,250,0.07); border: 1px solid rgba(167,139,250,0.2); }
.mono-biz .mono-layer-name { color: var(--purple); }

.mono-ui { background: rgba(74,158,232,0.07); border: 1px solid rgba(74,158,232,0.2); }
.mono-ui .mono-layer-name { color: var(--blue); }

/* Module grid */
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 28px 0;
}

.module-card {
  background: var(--surface);
  border: 1px solid rgba(167,139,250,0.25);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.module-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--purple);
}

.module-card-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--purple);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.module-card-files { display: flex; flex-direction: column; gap: 4px; }

.module-file {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  padding: 2px 0;
  border-bottom: 1px solid var(--border);
}

.module-file:last-child { border-bottom: none; }
.module-file.public { color: var(--accent2); }
.module-file.private { color: var(--muted); }
.module-file.indent { padding-left: 12px; }

/* Timeline */
.timeline {
  position: relative;
  padding-left: 32px;
  margin: 32px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--green), var(--accent), var(--red));
}

.timeline-item { position: relative; margin-bottom: 32px; }
.timeline-item:last-child { margin-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -28px;
  top: 4px;
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid;
  background: var(--bg);
}

.timeline-dot.good { border-color: var(--green); background: rgba(74,232,176,0.2); }
.timeline-dot.warn { border-color: var(--accent); background: rgba(232,200,74,0.2); }
.timeline-dot.bad  { border-color: var(--red); background: rgba(232,74,122,0.2); }
.timeline-dot.info { border-color: var(--purple); background: rgba(167,139,250,0.2); }

.timeline-phase {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.timeline-phase.good { color: var(--green); }
.timeline-phase.warn { color: var(--accent); }
.timeline-phase.bad  { color: var(--red); }
.timeline-phase.info { color: var(--purple); }

.timeline-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.1rem;
  color: var(--white);
  margin-bottom: 6px;
}

.timeline-desc {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.6;
}

.timeline-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

/* Diagnostic grid */
.diagnostic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin: 28px 0;
}

.diag-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.diag-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.diag-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.diag-text {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.5;
}

.good-signal .diag-dot  { background: var(--green); }
.good-signal .diag-label { color: var(--green); }
.bad-signal  .diag-dot  { background: var(--red); }
.bad-signal  .diag-label { color: var(--red); }

.diag-section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 28px;
  margin-bottom: 4px;
}

.diag-section-label.good-label { color: var(--green); }
.diag-section-label.bad-label  { color: var(--red); }

/* Shared DB info */
.shared-db {
  background: rgba(232,122,74,0.08);
  border: 1px solid rgba(232,122,74,0.3);
  border-radius: 8px;
  padding: 14px 20px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--orange);
  letter-spacing: 0.04em;
}

.shared-db-icon { font-size: 1.8rem; }

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.10s; }
.card:nth-child(3) { animation-delay: 0.15s; }
.card:nth-child(4) { animation-delay: 0.20s; }

/* Responsive */
@media (max-width: 900px) {
  .main { margin-left: 0; }
}

@media (max-width: 640px) {
  .comparison { grid-template-columns: 1fr; }
  .dep-flow { flex-wrap: wrap; justify-content: center; }
  .module-grid { grid-template-columns: 1fr 1fr; }
}
</style>
