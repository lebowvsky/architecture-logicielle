<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (onion layer cards, comparison items, legend items,
 *          diagnostic cards, decision table rows, layer diagram rows) are modeled as
 *          typed arrays and rendered via v-for, while unique prose, code blocks, and
 *          diagrams stay as direct template markup.
 */

interface OnionCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
  quote?: string
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

interface DiagnosticCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
}

interface LayerRow {
  color: string
  num: string
  title: string
  files: { label: string; colorClass: string }[]
}

interface DecisionRow {
  element: string
  layer: string
  badgeClass: string
  badgeLabel: string
  reason: string
}

interface LegendItem {
  color: string
  label: string
}

const onionCards: OnionCard[] = [
  {
    icon: '\u{1F535}',
    colorClass: 'blue',
    name: 'Couche 01 \u2014 domain/model/',
    title: 'Domain Model',
    description:
      'Le noyau inviolable. Entities et Value Objects qui encodent les r\u00e8gles m\u00e9tier. <strong>Z\u00e9ro import externe</strong> \u2014 ni TypeORM, ni NestJS, ni Stripe. Du TypeScript pur. C\u2019est la couche la plus stable\u00a0: elle ne change que si les r\u00e8gles m\u00e9tier changent.',
    tags: ['Entities', 'Value Objects', 'Zero import', 'R\u00e8gles m\u00e9tier'],
    quote: '\u00ab\u00a0new Commande() doit fonctionner sans infrastructure.\u00a0\u00bb',
  },
  {
    icon: '\u{1F7E3}',
    colorClass: 'purple',
    name: 'Couche 02 \u2014 domain/services/',
    title: 'Domain Services',
    description:
      'La grande sp\u00e9cificit\u00e9 de l\u2019Onion. Contient les <strong>interfaces (ports)</strong> dont le domaine a besoin \u2014 <code>ICommandeRepository</code>, <code>IPaiementService</code> \u2014 et la logique m\u00e9tier impliquant plusieurs entit\u00e9s. Ces interfaces <strong>appartiennent au domaine</strong>, pas \u00e0 l\u2019infrastructure qui les impl\u00e9mente.',
    tags: ['Interfaces', 'Ports', 'Contrats', 'Multi-entit\u00e9s'],
    quote: '\u00ab\u00a0La norme de prise est d\u00e9finie par l\u2019appareil, pas par EDF.\u00a0\u00bb',
  },
  {
    icon: '\u{1F7E2}',
    colorClass: 'green',
    name: 'Couche 03 \u2014 application/',
    title: 'Application Services',
    description:
      'Les Use Cases de l\u2019application. Orchestrent le flux\u00a0: r\u00e9cup\u00e8rent des entit\u00e9s, appliquent des r\u00e8gles, utilisent les interfaces de couche 2. Ne connaissent ni PostgreSQL, ni Stripe, ni NestJS. Testables sans infrastructure.',
    tags: ['Use Cases', 'Orchestration', 'Testable', 'Agnostique'],
  },
  {
    icon: '\u{1F7E0}',
    colorClass: 'orange',
    name: 'Couche 04 \u2014 infrastructure/',
    title: 'Infrastructure',
    description:
      'Tout ce qui est concret, technique, rempla\u00e7able. NestJS, Express, TypeORM, PostgreSQL, Stripe SDK, les Controllers HTTP, les Guards, les tests d\u2019int\u00e9gration. <strong>Impl\u00e9mente les interfaces</strong> d\u00e9finies en couche 2. Si cette couche change enti\u00e8rement, le domaine ne le sait pas.',
    tags: ['NestJS', 'TypeORM', 'PostgreSQL', 'Stripe', 'Rempla\u00e7able'],
    quote: '\u00ab\u00a0La DB est un d\u00e9tail. Le framework est un d\u00e9tail.\u00a0\u00bb',
  },
]

const comparisonWithout: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Sans Onion Architecture',
  dotColor: '#e84a7a',
  items: [
    { text: 'Le UseCase importe directement <code>PostgresRepo</code>' },
    { text: 'Changer de DB = modifier le UseCase' },
    { text: 'Impossible de tester sans lancer une DB' },
    { text: 'Le domaine conna\u00eet Stripe, TypeORM, NestJS' },
    { text: 'Le sch\u00e9ma DB dicte la structure objet' },
  ],
}

const comparisonWith: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Avec Onion Architecture',
  dotColor: '#4ae8b0',
  items: [
    { text: 'Le UseCase d\u00e9pend d\u2019une <code>interface</code> uniquement' },
    { text: 'Swap PostgreSQL \u2192 MongoDB\u00a0: 1 seul fichier' },
    { text: 'Tests avec <code>InMemoryRepo</code> sans infra' },
    { text: 'Le domaine ignore tout de l\u2019ext\u00e9rieur' },
    { text: 'La structure objet suit le m\u00e9tier, pas la DB' },
  ],
}

const onionVsCleanRows: LayerRow[] = [
  {
    color: '#4a9ee8',
    num: 'Onion 01',
    title: 'Domain Model \u2192 Entities (Clean)',
    files: [
      { label: 'Commande.ts', colorClass: 'lf-blue' },
      { label: 'Client.ts', colorClass: 'lf-blue' },
      { label: 'Montant (VO)', colorClass: 'lf-blue' },
      { label: 'StatutCommande (VO)', colorClass: 'lf-blue' },
      { label: '= Cercle 01 Clean', colorClass: 'lf-accent' },
    ],
  },
  {
    color: '#a78bfa',
    num: 'Onion 02',
    title: 'Domain Services \u2192 Ports / Use Cases (Clean) \u2014 diff\u00e9rence cl\u00e9',
    files: [
      { label: 'ICommandeRepository', colorClass: 'lf-iface' },
      { label: 'IPaiementService', colorClass: 'lf-iface' },
      { label: 'INotificationService', colorClass: 'lf-iface' },
      { label: 'CommandeVerificationService', colorClass: 'lf-purple' },
      { label: '\u2248 Cercles 01-02 Clean', colorClass: 'lf-accent' },
    ],
  },
  {
    color: '#4ae8b0',
    num: 'Onion 03',
    title: 'Application Services \u2192 Interface Adapters (Clean)',
    files: [
      { label: 'PasserCommandeService', colorClass: 'lf-green' },
      { label: 'AnnulerCommandeService', colorClass: 'lf-green' },
      { label: 'ConsulterCommandeService', colorClass: 'lf-green' },
      { label: '\u2248 Cercle 03 Clean', colorClass: 'lf-accent' },
    ],
  },
  {
    color: '#e87a4a',
    num: 'Onion 04',
    title: 'Infrastructure \u2192 Frameworks & Drivers (Clean)',
    files: [
      { label: 'NestJS Controllers', colorClass: 'lf-orange' },
      { label: 'TypeORM Repos', colorClass: 'lf-orange' },
      { label: 'StripeService', colorClass: 'lf-orange' },
      { label: 'EmailService', colorClass: 'lf-orange' },
      { label: 'Tests d\u2019int\u00e9gration', colorClass: 'lf-orange' },
      { label: '= Cercle 04 Clean', colorClass: 'lf-accent' },
    ],
  },
]

const summaryRows: LayerRow[] = [
  {
    color: '#4a9ee8',
    num: '01 \u2014 Domain Model',
    title: '\u00ab\u00a0Quelles sont mes r\u00e8gles m\u00e9tier\u00a0?\u00a0\u00bb',
    files: [
      { label: 'Entities', colorClass: 'lf-blue' },
      { label: 'Value Objects', colorClass: 'lf-blue' },
      { label: 'Zero import', colorClass: 'lf-blue' },
      { label: 'Plus stable', colorClass: 'lf-blue' },
    ],
  },
  {
    color: '#a78bfa',
    num: '02 \u2014 Domain Services',
    title: '\u00ab\u00a0De quoi mon domaine a-t-il besoin\u00a0?\u00a0\u00bb',
    files: [
      { label: 'Interfaces (ports)', colorClass: 'lf-iface' },
      { label: 'Domain Services', colorClass: 'lf-purple' },
      { label: 'Contrats appartenant au domaine', colorClass: 'lf-iface' },
    ],
  },
  {
    color: '#4ae8b0',
    num: '03 \u2014 Application',
    title: '\u00ab\u00a0Comment s\u2019encha\u00eenent les \u00e9tapes\u00a0?\u00a0\u00bb',
    files: [
      { label: 'Use Cases', colorClass: 'lf-green' },
      { label: 'Orchestration', colorClass: 'lf-green' },
      { label: 'Agnostique du framework', colorClass: 'lf-green' },
    ],
  },
  {
    color: '#e87a4a',
    num: '04 \u2014 Infrastructure',
    title: '\u00ab\u00a0Comment je l\u2019impl\u00e9mente concr\u00e8tement\u00a0?\u00a0\u00bb',
    files: [
      { label: 'NestJS', colorClass: 'lf-orange' },
      { label: 'TypeORM', colorClass: 'lf-orange' },
      { label: 'Stripe', colorClass: 'lf-orange' },
      { label: 'Email', colorClass: 'lf-orange' },
      { label: 'Plus volatile', colorClass: 'lf-orange' },
    ],
  },
]

const decisionRows: DecisionRow[] = [
  {
    element: '@Module(), NestFactory',
    layer: '04 \u2014 Infrastructure',
    badgeClass: 'badge-ok',
    badgeLabel: '\u2713 OK',
    reason: 'Bootstrap framework \u2014 d\u00e9tail pur',
  },
  {
    element: '@Controller(), @Get(), @Post()',
    layer: '04 \u2014 Infrastructure',
    badgeClass: 'badge-ok',
    badgeLabel: '\u2713 OK',
    reason: 'Routing HTTP \u2014 rempla\u00e7able par Express',
  },
  {
    element: '@Guard(), @Interceptor(), @Pipe()',
    layer: '04 \u2014 Infrastructure',
    badgeClass: 'badge-ok',
    badgeLabel: '\u2713 OK',
    reason: 'Cycle de vie HTTP \u2014 infrastructure pure',
  },
  {
    element: 'TypeORM @Entity, @Column sur le mod\u00e8le ORM',
    layer: '04 \u2014 Infrastructure',
    badgeClass: 'badge-ok',
    badgeLabel: '\u2713 OK',
    reason: 'Mod\u00e8le ORM s\u00e9par\u00e9 de l\u2019Entity domaine',
  },
  {
    element: '@Injectable() sur un Use Case',
    layer: '03 \u2014 Application',
    badgeClass: 'badge-warn',
    badgeLabel: '\u26A0 Tol\u00e9rable',
    reason: 'M\u00e9tadonn\u00e9e DI \u2014 n\u2019affecte pas le comportement, test manuel toujours possible',
  },
  {
    element: '@Injectable() sur un Domain Service',
    layer: '02 \u2014 Domain Services',
    badgeClass: 'badge-bad',
    badgeLabel: '\u2717 \u00c9viter',
    reason: 'Couche 2 doit rester agnostique',
  },
  {
    element: '@Entity() TypeORM sur une Domain Entity',
    layer: '01 \u2014 Domain Model',
    badgeClass: 'badge-bad',
    badgeLabel: '\u2717 Interdit',
    reason: 'Violation grave \u2014 le sch\u00e9ma DB dicterait ta structure m\u00e9tier',
  },
]

const nestComparisonBad: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Mauvaise pratique \u2014 Entity pollu\u00e9e',
  dotColor: '#e84a7a',
  items: [
    { text: 'Import TypeORM en t\u00eate de <code>Commande.ts</code>' },
    { text: 'D\u00e9corateurs <code>@Entity @Column</code> partout' },
    { text: 'Propri\u00e9t\u00e9s publiques \u2014 encapsulation impossible' },
    { text: 'Impossible de tester sans d\u00e9marrer une DB' },
  ],
}

const nestComparisonGood: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Bonne pratique \u2014 deux mod\u00e8les s\u00e9par\u00e9s',
  dotColor: '#4ae8b0',
  items: [
    { text: '<code>Commande.ts</code> (couche 1)\u00a0: z\u00e9ro import' },
    { text: '<code>CommandeORM.ts</code> (couche 4)\u00a0: d\u00e9corateurs TypeORM' },
    { text: '<code>CommandeMapper.ts</code>\u00a0: traduit entre les deux' },
    { text: '<code>new Commande()</code> suffit pour tester' },
  ],
}

const diagnosticCards: DiagnosticCard[] = [
  {
    icon: '\u{1F9EA}',
    colorClass: 'blue',
    name: 'Test des Entities',
    title: 'Tester sans infrastructure',
    description:
      '<code>new Commande([item])</code> et test d\u2019une r\u00e8gle m\u00e9tier sans DB, sans NestJS, sans HTTP. Si c\u2019est possible, le Domain Model (couche 1) est propre.',
    tags: ['Jest pur', 'Zero infra'],
  },
  {
    icon: '\u{1F504}',
    colorClass: 'purple',
    name: 'Test du Swap DB',
    title: 'Remplacer PostgreSQL par MongoDB',
    description:
      'Combien de fichiers modifi\u00e9s\u00a0? En Onion correcte\u00a0: exactement <strong>1</strong> \u2014 le Repository d\u2019infrastructure. Les couches 1, 2, 3 restent intactes.',
    tags: ['1 seul fichier', 'Domaine intact'],
  },
  {
    icon: '\u{1F310}',
    colorClass: 'green',
    name: 'Test du Swap Framework',
    title: 'Remplacer NestJS par Express',
    description:
      'Seule la couche 4 change. Controllers, modules, config DI \u2014 mais les Use Cases et le domaine ne voient rien. C\u2019est la preuve que NestJS est bien un d\u00e9tail.',
    tags: ['Framework agnostique', 'Domaine stable'],
  },
]

const legendItems: LegendItem[] = [
  { color: '#4a9ee8', label: 'Domain Model (noyau pur)' },
  { color: '#a78bfa', label: 'Domain Services & Ports' },
  { color: '#4ae8b0', label: 'Application Services' },
  { color: '#e87a4a', label: 'Infrastructure' },
  { color: '#e84a7a', label: 'Interfaces / Contrats' },
  { color: '#e8c84a', label: 'R\u00e8gle / Principe' },
]

const codeEntity = `<span class="cm">// ZERO import. Pure TypeScript. R\u00e8gles m\u00e9tier encapsul\u00e9es.</span>
<span class="kw">export class</span> <span class="ty">Commande</span> {
  <span class="kw">private</span> statut: <span class="ty">StatutCommande</span>;
  <span class="kw">private readonly</span> lignes: <span class="ty">LigneCommande</span>[];

  <span class="fn">constructor</span>(
    <span class="kw">private readonly</span> id: <span class="ty">CommandeId</span>,
    <span class="kw">private readonly</span> clientId: <span class="ty">ClientId</span>,
    lignes: <span class="ty">LigneCommande</span>[]
  ) {
    <span class="kw">if</span> (lignes.length === <span class="str">0</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Une commande ne peut pas \u00eatre vide'</span>);
    <span class="kw">this</span>.lignes = lignes;
    <span class="kw">this</span>.statut = <span class="ty">StatutCommande</span>.EN_ATTENTE;
  }

  <span class="fn">payer</span>(montant: <span class="ty">Montant</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.statut !== <span class="ty">StatutCommande</span>.EN_ATTENTE)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Cette commande ne peut plus \u00eatre pay\u00e9e'</span>);
    <span class="kw">if</span> (!montant.<span class="fn">equals</span>(<span class="kw">this</span>.<span class="fn">totalTTC</span>()))
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Montant incorrect'</span>);
    <span class="kw">this</span>.statut = <span class="ty">StatutCommande</span>.PAYEE;
  }

  <span class="fn">annuler</span>(): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.statut === <span class="ty">StatutCommande</span>.PAYEE)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Impossible d\\'annuler une commande pay\u00e9e'</span>);
    <span class="kw">this</span>.statut = <span class="ty">StatutCommande</span>.ANNULEE;
  }

  <span class="fn">totalTTC</span>(): <span class="ty">Montant</span> {
    <span class="kw">return this</span>.lignes.<span class="fn">reduce</span>((acc, l) => acc.<span class="fn">ajouter</span>(l.<span class="fn">prixTTC</span>()), <span class="ty">Montant</span>.<span class="fn">zero</span>());
  }
}`

const codePort = `<span class="cm">// D\u00e9finie PAR le domaine. PostgreSQL viendra se "brancher" ici.</span>
<span class="cm">// PostgreSQL conna\u00eet cette interface. L'inverse est interdit.</span>
<span class="kw">export interface</span> <span class="ty">ICommandeRepository</span> {
  <span class="fn">sauvegarder</span>(commande: <span class="ty">Commande</span>): <span class="ty">Promise&lt;void&gt;</span>;
  <span class="fn">trouverParId</span>(id: <span class="ty">CommandeId</span>): <span class="ty">Promise&lt;Commande | null&gt;</span>;
  <span class="fn">trouverParClient</span>(clientId: <span class="ty">ClientId</span>): <span class="ty">Promise&lt;Commande[]&gt;</span>;
}

<span class="kw">export interface</span> <span class="ty">IPaiementService</span> {
  <span class="fn">debiter</span>(montant: <span class="ty">Montant</span>, client: <span class="ty">Client</span>): <span class="ty">Promise&lt;TransactionId&gt;</span>;
  <span class="fn">rembourser</span>(transactionId: <span class="ty">TransactionId</span>): <span class="ty">Promise&lt;void&gt;</span>;
}`

const codeAppService = `<span class="cm">// Orchestre le flux. Ne conna\u00eet QUE des interfaces (couche 02).</span>
<span class="cm">// Aucune d\u00e9pendance vers NestJS, PostgreSQL ou Stripe.</span>
<span class="kw">export class</span> <span class="ty">PasserCommandeService</span> {
  <span class="fn">constructor</span>(
    <span class="kw">private readonly</span> repo:    <span class="ty">ICommandeRepository</span>,   <span class="cm">// \u2190 interface, pas PostgreSQL</span>
    <span class="kw">private readonly</span> paiement: <span class="ty">IPaiementService</span>,     <span class="cm">// \u2190 interface, pas Stripe</span>
    <span class="kw">private readonly</span> notif:   <span class="ty">INotificationService</span>,  <span class="cm">// \u2190 interface, pas SMTP</span>
    <span class="kw">private readonly</span> verif:   <span class="ty">CommandeVerificationService</span>
  ) {}

  <span class="kw">async</span> <span class="fn">executer</span>(cmd: <span class="ty">PasserCommandeCommand</span>): <span class="ty">Promise&lt;CommandeId&gt;</span> {
    <span class="cm">// 1. Entit\u00e9s du domaine</span>
    <span class="kw">const</span> client = <span class="kw">await this</span>.repo.<span class="fn">trouverClientParId</span>(cmd.clientId);
    <span class="kw">if</span> (!client) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Client introuvable'</span>);

    <span class="cm">// 2. Cr\u00e9ation de l'Entity (couche 01)</span>
    <span class="kw">const</span> commande = <span class="kw">new</span> <span class="ty">Commande</span>(<span class="ty">CommandeId</span>.<span class="fn">nouveau</span>(), client.id, cmd.lignes);

    <span class="cm">// 3. R\u00e8gle m\u00e9tier via Domain Service (couche 02)</span>
    <span class="kw">if</span> (!<span class="kw">this</span>.verif.<span class="fn">verifierStock</span>(commande))
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Stock insuffisant'</span>);

    <span class="cm">// 4. Persistance via port</span>
    <span class="kw">await this</span>.repo.<span class="fn">sauvegarder</span>(commande);

    <span class="cm">// 5. Paiement via port</span>
    <span class="kw">await this</span>.paiement.<span class="fn">debiter</span>(commande.<span class="fn">totalTTC</span>(), client);
    commande.<span class="fn">payer</span>(commande.<span class="fn">totalTTC</span>());
    <span class="kw">await this</span>.repo.<span class="fn">sauvegarder</span>(commande);

    <span class="cm">// 6. Notification via port</span>
    <span class="kw">await this</span>.notif.<span class="fn">envoyer</span>(client.email, <span class="str">\`Commande \${commande.id} confirm\u00e9e\`</span>);

    <span class="kw">return</span> commande.id;
  }
}`

const codeInfra = `<span class="cm">// SEULE couche qui conna\u00eet TypeORM. Impl\u00e9mente le contrat de couche 02.</span>
<span class="kw">export class</span> <span class="ty">PostgresCommandeRepository</span> <span class="kw">implements</span> <span class="ty">ICommandeRepository</span> {
  <span class="fn">constructor</span>(<span class="kw">private readonly</span> repo: <span class="ty">Repository&lt;CommandeORM&gt;</span>) {}

  <span class="kw">async</span> <span class="fn">sauvegarder</span>(commande: <span class="ty">Commande</span>): <span class="ty">Promise&lt;void&gt;</span> {
    <span class="kw">const</span> row = <span class="ty">CommandeMapper</span>.<span class="fn">versORM</span>(commande);  <span class="cm">// Entity \u2192 ligne SQL</span>
    <span class="kw">await this</span>.repo.<span class="fn">save</span>(row);
  }

  <span class="kw">async</span> <span class="fn">trouverParId</span>(id: <span class="ty">CommandeId</span>): <span class="ty">Promise&lt;Commande | null&gt;</span> {
    <span class="kw">const</span> row = <span class="kw">await this</span>.repo.<span class="fn">findOneBy</span>({ id: id.valeur });
    <span class="kw">return</span> row ? <span class="ty">CommandeMapper</span>.<span class="fn">versDomaine</span>(row) : <span class="kw">null</span>;  <span class="cm">// ligne SQL \u2192 Entity</span>
  }
}`

const codeModule = `<span class="cm">// Le seul endroit qui sait tout. Relie les interfaces \u00e0 leurs impl\u00e9mentations.</span>
<span class="op">@Module</span>({
  imports: [<span class="ty">TypeOrmModule</span>.<span class="fn">forFeature</span>([<span class="ty">CommandeORM</span>])],
  providers: [
    <span class="cm">// Bind interface \u2192 impl\u00e9mentation concr\u00e8te</span>
    { provide: <span class="str">'ICommandeRepository'</span>, useClass: <span class="ty">PostgresCommandeRepository</span> },
    { provide: <span class="str">'IPaiementService'</span>,    useClass: <span class="ty">StripeService</span> },
    { provide: <span class="str">'INotificationService'</span>, useClass: <span class="ty">EmailService</span> },
    <span class="ty">PasserCommandeService</span>,
    <span class="ty">CommandeVerificationService</span>,
  ],
  controllers: [<span class="ty">CommandeController</span>],
})
<span class="kw">export class</span> <span class="ty">CommandeModule</span> {}

<span class="cm">// Pour les tests : swap sans toucher au UseCase</span>
<span class="cm">// { provide: 'ICommandeRepository', useClass: InMemoryCommandeRepository }</span>
<span class="cm">// { provide: 'IPaiementService',    useClass: MockPaiementService }</span>`

const codeTest = `<span class="cm">// Ce test ne n\u00e9cessite aucune DB, aucun NestJS, aucune connexion r\u00e9seau.</span>
<span class="cm">// InMemoryCommandeRepository et MockPaiementService impl\u00e9mentent les interfaces couche 02.</span>
<span class="kw">import</span> { <span class="ty">PasserCommandeService</span> }       <span class="kw">from</span> <span class="str">'../application/services/PasserCommandeService'</span>;
<span class="kw">import</span> { <span class="ty">InMemoryCommandeRepository</span> } <span class="kw">from</span> <span class="str">'./fakes/InMemoryCommandeRepository'</span>;
<span class="kw">import</span> { <span class="ty">MockPaiementService</span> }         <span class="kw">from</span> <span class="str">'./fakes/MockPaiementService'</span>;

<span class="fn">describe</span>(<span class="str">'PasserCommandeService'</span>, () => {
  <span class="fn">it</span>(<span class="str">'passe une commande avec succ\u00e8s'</span>, <span class="kw">async</span> () => {
    <span class="cm">// Arrange \u2014 fakes qui impl\u00e9mentent les interfaces de couche 02</span>
    <span class="kw">const</span> repo    = <span class="kw">new</span> <span class="ty">InMemoryCommandeRepository</span>();
    <span class="kw">const</span> paiement = <span class="kw">new</span> <span class="ty">MockPaiementService</span>();
    <span class="kw">const</span> notif   = <span class="kw">new</span> <span class="ty">MockNotificationService</span>();
    <span class="kw">const</span> verif   = <span class="kw">new</span> <span class="ty">CommandeVerificationService</span>();

    <span class="cm">// Instanciation SANS NestJS \u2014 preuve que le UseCase est agnostique</span>
    <span class="kw">const</span> useCase = <span class="kw">new</span> <span class="ty">PasserCommandeService</span>(repo, paiement, notif, verif);

    <span class="cm">// Act</span>
    <span class="kw">const</span> commandeId = <span class="kw">await</span> useCase.<span class="fn">executer</span>({
      clientId: <span class="ty">ClientId</span>.<span class="fn">de</span>(<span class="str">'client-1'</span>),
      lignes:   [{ produitId: <span class="str">'p1'</span>, quantite: <span class="str">2</span>, prixUnitaire: <span class="ty">Montant</span>.<span class="fn">de</span>(<span class="str">50</span>) }]
    });

    <span class="cm">// Assert</span>
    <span class="fn">expect</span>(repo.commandes).<span class="fn">toHaveLength</span>(<span class="str">1</span>);
    <span class="fn">expect</span>(paiement.debits).<span class="fn">toHaveLength</span>(<span class="str">1</span>);
    <span class="fn">expect</span>(notif.messages).<span class="fn">toHaveLength</span>(<span class="str">1</span>);
  });

  <span class="fn">it</span>(<span class="str">'refuse une commande vide'</span>, () => {
    <span class="cm">// Domain Model test\u00e9 directement \u2014 encore plus direct</span>
    <span class="fn">expect</span>(() => <span class="kw">new</span> <span class="ty">Commande</span>(<span class="ty">CommandeId</span>.<span class="fn">nouveau</span>(), clientId, []))
      .<span class="fn">toThrow</span>(<span class="str">'Une commande ne peut pas \u00eatre vide'</span>);
  });
});`

const fileTreeHtml = `<span class="ft-gray">src/</span>
<span class="ft-blue">\u251C\u2500\u2500 domain/</span>
<span class="ft-blue">\u2502   \u251C\u2500\u2500 model/</span>                        <span class="ft-gray">\u2190 Couche 01 \u2014 z\u00e9ro import</span>
<span class="ft-blue">\u2502   \u2502   \u251C\u2500\u2500 Commande.ts</span>               <span class="ft-gray">// payer() annuler() \u2014 r\u00e8gles m\u00e9tier</span>
<span class="ft-blue">\u2502   \u2502   \u251C\u2500\u2500 Client.ts</span>                  <span class="ft-gray">// peuxCommander() adresseValide()</span>
<span class="ft-blue">\u2502   \u2502   \u251C\u2500\u2500 LigneCommande.ts</span>           <span class="ft-gray">// Value Object</span>
<span class="ft-blue">\u2502   \u2502   \u251C\u2500\u2500 Montant.ts</span>                 <span class="ft-gray">// Value Object</span>
<span class="ft-blue">\u2502   \u2502   \u2514\u2500\u2500 StatutCommande.ts</span>          <span class="ft-gray">// Enum / VO</span>
\u2502   \u2502
<span class="ft-purple">\u2502   \u2514\u2500\u2500 services/</span>                      <span class="ft-gray">\u2190 Couche 02 \u2014 interfaces + domain services</span>
<span class="ft-iface">\u2502       \u251C\u2500\u2500 ICommandeRepository.ts</span>     <span class="ft-gray">// &lt;&lt;interface&gt;&gt; save() findById()</span>
<span class="ft-iface">\u2502       \u251C\u2500\u2500 IPaiementService.ts</span>        <span class="ft-gray">// &lt;&lt;interface&gt;&gt; debiter() rembourser()</span>
<span class="ft-iface">\u2502       \u251C\u2500\u2500 INotificationService.ts</span>    <span class="ft-gray">// &lt;&lt;interface&gt;&gt; envoyer(dest, msg)</span>
<span class="ft-purple">\u2502       \u2514\u2500\u2500 CommandeVerificationService.ts</span>  <span class="ft-gray">// logique multi-entit\u00e9s</span>
\u2502
<span class="ft-green">\u251C\u2500\u2500 application/</span>
<span class="ft-green">\u2502   \u2514\u2500\u2500 services/</span>                      <span class="ft-gray">\u2190 Couche 03 \u2014 use cases</span>
<span class="ft-green">\u2502       \u251C\u2500\u2500 PasserCommandeService.ts</span>   <span class="ft-gray">// executer(cmd) \u2014 orchestration</span>
<span class="ft-green">\u2502       \u251C\u2500\u2500 AnnulerCommandeService.ts</span>
<span class="ft-green">\u2502       \u2514\u2500\u2500 ConsulterCommandeService.ts</span>
\u2502
<span class="ft-orange">\u2514\u2500\u2500 infrastructure/</span>                    <span class="ft-gray">\u2190 Couche 04 \u2014 tout ce qui est concret</span>
<span class="ft-orange">    \u251C\u2500\u2500 persistence/</span>
<span class="ft-orange">    \u2502   \u251C\u2500\u2500 PostgresCommandeRepository.ts</span>  <span class="ft-gray">// implements ICommandeRepository</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 orm/</span>
<span class="ft-orange">    \u2502       \u251C\u2500\u2500 CommandeORM.ts</span>              <span class="ft-gray">// @Entity TypeORM (\u2260 domain Entity)</span>
<span class="ft-orange">    \u2502       \u2514\u2500\u2500 CommandeMapper.ts</span>           <span class="ft-gray">// ORM \u2194 Domain mapping</span>
<span class="ft-orange">    \u251C\u2500\u2500 paiement/</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 StripeService.ts</span>               <span class="ft-gray">// implements IPaiementService</span>
<span class="ft-orange">    \u251C\u2500\u2500 notification/</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 EmailService.ts</span>                <span class="ft-gray">// implements INotificationService</span>
<span class="ft-orange">    \u251C\u2500\u2500 http/</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 CommandeController.ts</span>          <span class="ft-gray">// @Controller NestJS</span>
<span class="ft-orange">    \u2514\u2500\u2500 config/</span>
<span class="ft-orange">        \u2514\u2500\u2500 CommandeModule.ts</span>              <span class="ft-gray">// @Module \u2014 DI bindings</span>`

useHead({
  title: 'Onion Architecture \u2014 Jeffrey Palermo',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Onion Architecture \u2014 Jeffrey Palermo',
        description:
          'Onion Architecture de Jeffrey Palermo : couches concentriques, Domain Model, Domain Services, comparaison avec Clean Architecture, exemples NestJS/TypeScript.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/onion-architecture',
        author: {
          '@type': 'Person',
          name: 'Jeffrey Palermo',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Onion Architecture de Jeffrey Palermo : couches concentriques, Domain Model, Domain Services, comparaison avec Clean Architecture, exemples NestJS/TypeScript.',
  ogTitle: 'Onion Architecture \u2014 Jeffrey Palermo & Uncle Bob',
  ogDescription:
    'Onion Architecture de Jeffrey Palermo : couches concentriques, Domain Model, Domain Services, comparaison avec Clean Architecture, exemples NestJS/TypeScript.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/onion-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Onion Architecture \u2014 Jeffrey Palermo & Uncle Bob',
  twitterDescription:
    'Onion Architecture de Jeffrey Palermo : couches concentriques, Domain Model, Domain Services, comparaison avec Clean Architecture, exemples NestJS/TypeScript.',
})
</script>

<template>
  <div class="container">
    <!-- Back link -->
    <nav>
      <NuxtLink to="/" class="back-link">
        Retour aux architectures
      </NuxtLink>
    </nav>

    <!-- Header -->
    <header>
      <div class="eyebrow">// Onion Architecture &mdash; R&eacute;f&eacute;rence compl&egrave;te</div>
      <h1>L&rsquo;Architecture<br><em>Oignon</em></h1>
      <p class="subtitle">
        Principes, couches concentriques, r&egrave;gle de d&eacute;pendance et exemple NestJS
        complet &mdash; Jeffrey Palermo (2008), dans l&rsquo;esprit de Robert C. Martin.
      </p>
    </header>

    <!-- Quote box -->
    <div class="quote-box">
      <div class="quote-icon">&#x1F9C5;</div>
      <div class="quote-content">
        <h3>Jeffrey Palermo &mdash; 2008</h3>
        <p>
          L&rsquo;Onion Architecture, introduite par Jeffrey Palermo en 2008, partage le m&ecirc;me
          ADN que la Clean Architecture d&rsquo;Uncle Bob&nbsp;:
          <em>le domaine m&eacute;tier ne d&eacute;pend de rien d&rsquo;ext&eacute;rieur</em>. Les
          frameworks, les bases de donn&eacute;es, l&rsquo;interface utilisateur sont des
          <em>d&eacute;tails p&eacute;riph&eacute;riques</em> qui s&rsquo;enroulent autour du
          c&oelig;ur stable &mdash; comme les couches d&rsquo;un oignon autour de son centre.
        </p>
      </div>
    </div>

    <!-- Section 01 : La metaphore -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La m&eacute;taphore&nbsp;: l&rsquo;oignon et le ch&acirc;teau fort</h2>
        <div class="section-line" />
      </div>
      <div class="prose">
        <p>
          Quand tu &eacute;pluches un oignon, tu traverses des couches successives.
          <strong>Plus tu vas vers le centre, plus tu atteins quelque chose de fondamental, stable,
          essentiel.</strong> La couche ext&eacute;rieure (la peau) est ce qui change le plus
          facilement. Le c&oelig;ur, lui, reste.
        </p>
        <p>
          C&rsquo;est exactement la philosophie de l&rsquo;Onion Architecture&nbsp;:
          <em>le domaine m&eacute;tier est le c&oelig;ur immuable</em>. L&rsquo;infrastructure
          &mdash; la DB, le framework HTTP, l&rsquo;interface utilisateur &mdash; est la peau
          ext&eacute;rieure, volatile et rempla&ccedil;able.
        </p>
        <p>
          Deuxi&egrave;me m&eacute;taphore&nbsp;: imagine un
          <strong>ch&acirc;teau m&eacute;di&eacute;val</strong>. Le donjon central (le domaine)
          est inviolable. Les douves (l&rsquo;infrastructure) peuvent &ecirc;tre d&eacute;plac&eacute;es,
          ass&eacute;ch&eacute;es, modifi&eacute;es &mdash; le donjon ne le sait pas et ne s&rsquo;en
          pr&eacute;occupe pas. Les visiteurs s&rsquo;adaptent au ch&acirc;teau, jamais l&rsquo;inverse.
        </p>
      </div>
    </section>

    <!-- Section 02 : Les 4 couches -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Les 4 couches concentriques</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          L&rsquo;Onion Architecture s&rsquo;organise en <strong>cercles concentriques</strong>.
          La r&egrave;gle absolue&nbsp;: <em>les d&eacute;pendances ne pointent que vers le
          centre</em>. Jamais vers l&rsquo;ext&eacute;rieur.
        </p>
      </div>

      <!-- Onion CSS diagram -->
      <div class="onion-diagram">
        <div class="onion-layer o-infra">
          <span class="layer-label" style="top:4%;">04 &mdash; Infrastructure</span>
          <span class="layer-sub" style="top:10%;">Frameworks &middot; DB &middot; UI &middot; HTTP &middot; Tests</span>
          <div class="onion-layer o-app">
            <span class="layer-label" style="top:4%;">03 &mdash; Application Services</span>
            <span class="layer-sub" style="top:11%;">Use Cases &middot; Handlers &middot; Orchestration</span>
            <div class="onion-layer o-domain-svc">
              <span class="layer-label" style="top:6%;">02 &mdash; Domain Services</span>
              <span class="layer-sub" style="top:16%;">Interfaces &middot; Ports &middot; Contrats</span>
              <div class="onion-layer o-domain-model" style="display:flex;align-items:center;justify-content:center;">
                <span class="layer-label">Domain Model</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onion layer cards -->
      <div class="cards">
        <article
          v-for="card in onionCards"
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

    <!-- Section 03 : La Dependency Rule -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">La Dependency Rule &mdash; la loi absolue</h2>
        <div class="section-line" />
      </div>

      <div class="rule-banner">
        <strong>&ldquo;Les d&eacute;pendances ne pointent QUE vers le centre.&rdquo;</strong><br>
        Rien dans une couche int&eacute;rieure ne peut mentionner quoi que ce soit d&rsquo;une couche
        ext&eacute;rieure.<br>
        Ni son nom, ni sa fonction, ni son type, ni sa variable.
      </div>

      <!-- Dependency flow diagram -->
      <div class="dep-flow">
        <div class="dep-node" style="color:#e87a4a;border-color:rgba(232,122,74,0.4);background:rgba(232,122,74,0.08);">
          04<br>Infrastructure
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#4ae8b0;border-color:rgba(74,232,176,0.4);background:rgba(74,232,176,0.08);">
          03<br>Application
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#a78bfa;border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.08);">
          02<br>Domain Svc
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#4a9ee8;border-color:rgba(74,158,232,0.4);background:rgba(74,158,232,0.08);">
          01<br>Domain Model
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#e84a7a;">&#x2717;</span>
          <span class="arr-txt" style="color:#e84a7a;">interdit</span>
        </div>
        <div class="dep-node" style="color:#e84a7a;border-color:rgba(232,74,122,0.4);background:rgba(232,74,122,0.08);">
          vers<br>l&rsquo;ext&eacute;rieur
        </div>
      </div>

      <div class="prose">
        <p>
          Cette r&egrave;gle est rendue possible par l&rsquo;<strong>inversion de d&eacute;pendance
          (DIP)</strong>. Quand un Use Case a besoin de persister une commande, il ne s&rsquo;adresse
          pas directement &agrave; PostgreSQL &mdash; il utilise une <em>interface</em>
          <code>ICommandeRepository</code> d&eacute;finie en couche 2. L&rsquo;adapter PostgreSQL de
          couche 4 impl&eacute;mente cette interface. Le UseCase d&eacute;finit le contrat,
          l&rsquo;Infrastructure s&rsquo;y conforme.
        </p>
      </div>

      <!-- Comparison table -->
      <div class="comparison">
        <div class="cmp-col">
          <div class="cmp-header" :class="comparisonWithout.headerClass">
            {{ comparisonWithout.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in comparisonWithout.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: comparisonWithout.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
        <div class="cmp-col">
          <div class="cmp-header" :class="comparisonWith.headerClass">
            {{ comparisonWith.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in comparisonWith.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: comparisonWith.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 04 : Onion vs Clean Architecture -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">Onion vs Clean Architecture &mdash; Les correspondances</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Les deux architectures partagent le m&ecirc;me principe fondamental. Leurs diff&eacute;rences
          sont essentiellement <strong>de vocabulaire et d&rsquo;organisation</strong>, pas de
          philosophie.
        </p>
      </div>

      <div class="layers-diagram">
        <div
          v-for="row in onionVsCleanRows"
          :key="row.num"
          class="layer-row"
          :style="{ '--layer-color': row.color }"
        >
          <div class="layer-num">{{ row.num }}</div>
          <div class="layer-content">
            <div class="layer-title">{{ row.title }}</div>
            <div class="layer-files">
              <span
                v-for="file in row.files"
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

      <div class="info-box">
        <strong>La diff&eacute;rence cl&eacute;&nbsp;:</strong> L&rsquo;Onion cr&eacute;e une couche
        explicite &ldquo;Domain Services&rdquo; pour les interfaces et contrats. Clean Architecture
        les appelle &ldquo;Ports&rdquo; et les int&egrave;gre dans le cercle Use Cases. En pratique,
        l&rsquo;effet est identique &mdash; les interfaces appartiennent au domaine, pas &agrave;
        l&rsquo;infrastructure qui les impl&eacute;mente.
      </div>
    </section>

    <!-- Section 05 : Structure src/ -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">Structure src/ &mdash; Feature &ldquo;Passer une commande&rdquo;</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Voici comment les 4 couches se traduisent concr&egrave;tement en fichiers pour une
          feature e-commerce.
        </p>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="file-tree" v-html="fileTreeHtml" />
    </section>

    <!-- Section 06 : Code couche par couche -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Code couche par couche</h2>
        <div class="section-line" />
      </div>

      <!-- Couche 1 : Entity -->
      <div class="code-filename">domain/model/Commande.ts &mdash; Couche 01 &#x2713; (z&eacute;ro import)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeEntity" />

      <!-- Couche 2 : Interface -->
      <div class="code-filename">domain/services/ICommandeRepository.ts &mdash; Couche 02 (port)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codePort" />

      <!-- Couche 3 : Application Service -->
      <div class="code-filename">application/services/PasserCommandeService.ts &mdash; Couche 03</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeAppService" />

      <!-- Couche 4 : Infrastructure -->
      <div class="code-filename">infrastructure/persistence/PostgresCommandeRepository.ts &mdash; Couche 04</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeInfra" />
    </section>

    <!-- Section 07 : NestJS dans l'Onion -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">NestJS dans l&rsquo;Onion &mdash; O&ugrave; se place quoi&nbsp;?</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          C&rsquo;est la question qui d&eacute;range le plus les d&eacute;veloppeurs NestJS. La
          r&eacute;ponse nuanc&eacute;e&nbsp;: <strong>NestJS est un d&eacute;tail de couche
          4</strong>, mais il faut &ecirc;tre pr&eacute;cis sur ce que &ldquo;NestJS&rdquo; veut
          dire &mdash; ce n&rsquo;est pas monolithique.
        </p>
      </div>

      <!-- Decision table -->
      <table class="decision-table">
        <thead>
          <tr>
            <th>&Eacute;l&eacute;ment NestJS</th>
            <th>Couche</th>
            <th>Statut</th>
            <th>Raison</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in decisionRows"
            :key="row.element"
          >
            <td>{{ row.element }}</td>
            <td>{{ row.layer }}</td>
            <td><span class="badge" :class="row.badgeClass">{{ row.badgeLabel }}</span></td>
            <td>{{ row.reason }}</td>
          </tr>
        </tbody>
      </table>

      <div class="warn-box">
        <strong>Le p&eacute;ch&eacute; capital des tutos NestJS&nbsp;:</strong> mettre
        <code>@Entity()</code> et <code>@Column()</code> directement sur tes classes domaine.
        C&rsquo;est la fa&ccedil;on la plus rapide de polluer le noyau de ton oignon. La
        solution&nbsp;: deux classes distinctes &mdash; une Entity domaine pure et un mod&egrave;le
        ORM s&eacute;par&eacute;, reli&eacute;s par un Mapper.
      </div>

      <!-- NestJS comparison table -->
      <div class="comparison">
        <div class="cmp-col">
          <div class="cmp-header" :class="nestComparisonBad.headerClass">
            {{ nestComparisonBad.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in nestComparisonBad.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: nestComparisonBad.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
        <div class="cmp-col">
          <div class="cmp-header" :class="nestComparisonGood.headerClass">
            {{ nestComparisonGood.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in nestComparisonGood.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: nestComparisonGood.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
      </div>

      <!-- @Injectable pragmatique quote -->
      <div class="quote-box">
        <div class="quote-icon">&#x1F50C;</div>
        <div class="quote-content">
          <h3>Le compromis pragmatique de @Injectable()</h3>
          <p>
            <code>@Injectable()</code> sur un Use Case (couche 3) est techniquement une violation
            &mdash; c&rsquo;est une d&eacute;pendance vers NestJS dans une couche qui devrait
            &ecirc;tre agnostique. Mais c&rsquo;est un d&eacute;corateur de
            <em>m&eacute;tadonn&eacute;es</em>&nbsp;: il n&rsquo;affecte pas le comportement de la
            classe. Tu peux toujours instancier
            <code>new PasserCommandeService(mockRepo, mockPaiement)</code> dans tes tests sans
            lancer NestJS. C&rsquo;est la violation <em>tol&eacute;rable</em> selon Uncle Bob
            &mdash; celle qui ne nuit pas &agrave; la testabilit&eacute; ni &agrave; la
            maintenabilit&eacute;.
          </p>
        </div>
      </div>

      <!-- NestJS Module code -->
      <div class="code-filename">infrastructure/config/CommandeModule.ts &mdash; DI NestJS en couche 04</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeModule" />
    </section>

    <!-- Section 08 : Le test ultime -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">08</span>
        <h2 class="section-title">Le test ultime d&rsquo;une Onion Architecture r&eacute;ussie</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Le crit&egrave;re de succ&egrave;s est simple et implacable&nbsp;:
          <strong>peut-on tester toute la logique m&eacute;tier sans lancer une seule
          infrastructure&nbsp;?</strong>
        </p>
      </div>

      <div class="cards">
        <article
          v-for="card in diagnosticCards"
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

      <!-- Test code block -->
      <div class="code-filename">Test unitaire pur &mdash; z&eacute;ro infrastructure, z&eacute;ro NestJS</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeTest" />

      <div class="warn-box">
        <strong>Si ce test n&eacute;cessite docker-compose up</strong> pour d&eacute;marrer &mdash;
        si tu dois lancer une base de donn&eacute;es, d&eacute;marrer NestJS ou appeler Stripe pour
        tester une r&egrave;gle m&eacute;tier &mdash; c&rsquo;est un signal clair&nbsp;: la
        Dependency Rule est viol&eacute;e quelque part dans tes couches internes.
      </div>
    </section>

    <!-- Section 09 : Resume -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">09</span>
        <h2 class="section-title">R&eacute;sum&eacute; &mdash; Une phrase par couche</h2>
        <div class="section-line" />
      </div>

      <div class="layers-diagram">
        <div
          v-for="row in summaryRows"
          :key="row.num"
          class="layer-row"
          :style="{ '--layer-color': row.color }"
        >
          <div class="layer-num">{{ row.num }}</div>
          <div class="layer-content">
            <div class="layer-title">{{ row.title }}</div>
            <div class="layer-files">
              <span
                v-for="file in row.files"
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
        <strong>La r&egrave;gle universelle&nbsp;:</strong> les fl&egrave;ches de d&eacute;pendance ne
        pointent que vers le centre.<br>
        PostgreSQL conna&icirc;t <code>ICommandeRepository</code>.
        <code>ICommandeRepository</code> ne conna&icirc;t pas PostgreSQL.<br>
        NestJS conna&icirc;t tes Use Cases. Tes Use Cases ne connaissent pas NestJS.<br>
        <strong>C&rsquo;est tout.</strong>
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
</template>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 32px 100px;
  position: relative;
  z-index: 1;
}

/* ── Back link ── */
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

/* ── Header ── */
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

/* ── Sections ── */
.section { margin-bottom: 72px; }

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

/* ── Prose ── */
.prose {
  font-size: 0.925rem;
  color: var(--text);
  line-height: 1.8;
  max-width: 780px;
}

.prose p { margin-bottom: 16px; }
.prose strong { color: var(--white); font-weight: 500; }
.prose em { color: var(--accent); font-style: italic; }

/* ── Quote callout ── */
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

.quote-icon { font-size: 2.2rem; flex-shrink: 0; margin-top: 2px; }

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

/* ── Cards ── */
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

.card-tags { display: flex; flex-wrap: wrap; gap: 6px; }

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

.green  { --card-accent: #4ae8b0; }
.yellow { --card-accent: #e8c84a; }
.blue   { --card-accent: #4a9ee8; }
.purple { --card-accent: #a78bfa; }
.pink   { --card-accent: #e84a7a; }
.orange { --card-accent: #e87a4a; }

/* ── Onion diagram (CSS circles) ── */
.onion-diagram {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 40px auto;
  aspect-ratio: 1;
}

.onion-layer {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.onion-layer .layer-label {
  position: absolute;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  pointer-events: none;
}

.onion-layer .layer-sub {
  position: absolute;
  font-size: 0.65rem;
  color: var(--muted);
  font-family: 'DM Sans', sans-serif;
  pointer-events: none;
}

.o-infra {
  width: 100%; height: 100%;
  border-color: rgba(232,122,74,0.5);
  background: rgba(232,122,74,0.06);
}
.o-app {
  width: 72%; height: 72%;
  border-color: rgba(74,232,176,0.5);
  background: rgba(74,232,176,0.07);
}
.o-domain-svc {
  width: 46%; height: 46%;
  border-color: rgba(167,139,250,0.5);
  background: rgba(167,139,250,0.08);
}
.o-domain-model {
  width: 22%; height: 22%;
  border-color: rgba(74,158,232,0.6);
  background: rgba(74,158,232,0.12);
}

.o-infra        .layer-label { top: 5%;  color: var(--orange); }
.o-infra        .layer-sub   { top: 11%; }
.o-app          .layer-label { top: 4%;  color: var(--green); }
.o-app          .layer-sub   { top: 11%; }
.o-domain-svc   .layer-label { top: 5%;  color: var(--purple); font-size:0.62rem; }
.o-domain-svc   .layer-sub   { top: 14%; font-size:0.58rem; }
.o-domain-model .layer-label { color: var(--blue); font-size: 0.55rem; top: auto; position: relative; padding: 4px 2px; }

/* ── Layers diagram (horizontal) ── */
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

.layer-files { display: flex; flex-wrap: wrap; gap: 6px; }

.layer-file {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 3px;
  border: 1px solid;
  letter-spacing: 0.04em;
}

.lf-green  { color: #4ae8b0; border-color: rgba(74,232,176,0.25);  background: rgba(74,232,176,0.06);  }
.lf-purple { color: #a78bfa; border-color: rgba(167,139,250,0.25); background: rgba(167,139,250,0.06); }
.lf-blue   { color: #4a9ee8; border-color: rgba(74,158,232,0.25);  background: rgba(74,158,232,0.06);  }
.lf-orange { color: #e87a4a; border-color: rgba(232,122,74,0.25);  background: rgba(232,122,74,0.06);  }
.lf-iface  { color: #e84a7a; border-color: rgba(232,74,122,0.25);  background: rgba(232,74,122,0.06);  }
.lf-accent { color: #e8c84a; border-color: rgba(232,200,74,0.25);  background: rgba(232,200,74,0.06);  }

/* ── Comparison table ── */
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

.cmp-header.bad  { color: var(--red);   background: rgba(232,74,122,0.06);  }
.cmp-header.good { color: var(--green); background: rgba(74,232,176,0.06); }

.cmp-body { padding: 16px 20px; }

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

/* ── Rule banner ── */
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

/* ── Dep flow ── */
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

.dep-arrow-h .arr      { font-size: 1.1rem; }
.dep-arrow-h .arr-txt  { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 0.08em; }

/* ── Decision table ── */
.decision-table {
  width: 100%;
  border-collapse: collapse;
  margin: 28px 0;
  font-size: 0.85rem;
}

.decision-table th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  background: rgba(0,0,0,0.2);
}

.decision-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  vertical-align: top;
}

.decision-table tr:last-child td { border-bottom: none; }
.decision-table tr:hover td { background: rgba(255,255,255,0.02); }

.decision-table td:first-child {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  color: var(--accent2);
}

.badge {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 3px;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.badge-ok     { background: rgba(74,232,176,0.12);  color: var(--green);  border: 1px solid rgba(74,232,176,0.3);  }
.badge-warn   { background: rgba(232,200,74,0.12);  color: var(--accent); border: 1px solid rgba(232,200,74,0.3);  }
.badge-bad    { background: rgba(232,74,122,0.12);  color: var(--red);    border: 1px solid rgba(232,74,122,0.3);  }

/* ── File tree ── */
.file-tree {
  background: #0a0c10;
  border: 1px solid var(--border);
  border-left: 3px solid var(--purple);
  border-radius: 6px;
  padding: 20px 24px;
  margin: 24px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  line-height: 2;
  color: #c8d0e8;
}

:deep(.ft-dir)    { color: var(--accent); }
:deep(.ft-file)   { color: var(--text); }
:deep(.ft-green)  { color: #4ae8b0; }
:deep(.ft-purple) { color: #a78bfa; }
:deep(.ft-blue)   { color: #4a9ee8; }
:deep(.ft-orange) { color: #e87a4a; }
:deep(.ft-gray)   { color: var(--muted); }
:deep(.ft-iface)  { color: #e84a7a; }

/* ── Code blocks ── */
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
}

:deep(.cm)  { color: #6a7090; }
:deep(.kw)  { color: #a78bfa; }
:deep(.fn)  { color: #4ae8b0; }
:deep(.str) { color: #e8c84a; }
:deep(.ty)  { color: #4a9ee8; }
:deep(.op)  { color: #e84a7a; }
:deep(.hl)  { color: var(--white); }

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

/* ── Info / warn boxes ── */
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

/* ── inline code ── */
:deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

/* ── Legend ── */
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

.legend-dot { width: 10px; height: 10px; border-radius: 50%; }

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.10s; }
.card:nth-child(3) { animation-delay: 0.15s; }
.card:nth-child(4) { animation-delay: 0.20s; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .comparison { grid-template-columns: 1fr; }
  .dep-flow   { flex-wrap: wrap; justify-content: center; }
  .onion-diagram { max-width: 320px; }
  .decision-table { font-size: 0.78rem; }
  .decision-table td, .decision-table th { padding: 10px 10px; }
}
</style>
