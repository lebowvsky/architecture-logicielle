<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (side cards, comparison items, legend items,
 *          diagnostic cards, decision table rows, layer diagram rows) are modeled as
 *          typed arrays and rendered via v-for, while unique prose, code blocks, and
 *          diagrams stay as direct template markup.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface SideCard {
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
  placement: string
  badgeClass: string
  badgeLabel: string
  note: string
}

interface LegendItem {
  color: string
  label: string
}

const sideCards: SideCard[] = [
  {
    icon: '\u{1F7E0}',
    colorClass: 'orange',
    name: 'Driving Side \u2014 C\u00f4t\u00e9 Gauche',
    title: 'Adapters Pilotants',
    description:
      'Ils <strong>pilotent</strong> l\u2019application. Un Controller HTTP re\u00e7oit une requ\u00eate et appelle un Use Case. Un test JUnit instancie directement le Use Case. Un CLI parse des arguments et d\u00e9l\u00e8gue.',
    tags: ['HTTP Controller', 'CLI', 'Test', 'Scheduler'],
  },
  {
    icon: '\u{1F7E2}',
    colorClass: 'green',
    name: 'Driven Side \u2014 C\u00f4t\u00e9 Droit',
    title: 'Adapters Pilot\u00e9s',
    description:
      'Ils sont <strong>pilot\u00e9s</strong> par l\u2019application. Le Use Case appelle un port de sortie, et l\u2019adapter concret se charge de la technique : \u00e9crire en base, appeler Stripe, envoyer un email.',
    tags: ['PostgreSQL Repo', 'Stripe', 'Email', 'Redis'],
  },
  {
    icon: '\u{1F534}',
    colorClass: 'pink',
    name: 'Ports \u2014 Les Interfaces',
    title: 'Contrats d\u00e9finis par le domaine',
    description:
      'Un port est une <strong>interface TypeScript</strong> d\u00e9finie par le domaine. Le port d\u2019entr\u00e9e d\u00e9crit ce que l\u2019application <em>sait faire</em>. Le port de sortie d\u00e9crit ce dont elle <em>a besoin</em>.',
    tags: ['Interface TypeScript', 'DIP', 'Contrat'],
  },
]

const comparisonWithout: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Sans inversion de d\u00e9pendance',
  dotColor: '#e84a7a',
  items: [
    { text: 'Le UseCase importe directement <code>PostgresRepo</code>' },
    { text: 'Changer de DB = modifier le UseCase' },
    { text: 'Impossible de tester sans lancer une DB' },
    { text: 'Le domaine m\u00e9tier conna\u00eet Stripe, TypeORM\u2026' },
    { text: 'Couplage fort entre couches' },
  ],
}

const comparisonWith: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Avec Ports & Adapters',
  dotColor: '#4ae8b0',
  items: [
    { text: 'Le UseCase d\u00e9pend uniquement d\u2019une <code>interface</code>' },
    { text: 'Swap PostgreSQL \u2192 MongoDB : 1 seul fichier modifi\u00e9' },
    { text: 'Tests avec un <code>InMemoryRepo</code> sans infrastructure' },
    { text: 'Le domaine m\u00e9tier ne conna\u00eet rien de l\u2019ext\u00e9rieur' },
    { text: 'Chaque adapter est ind\u00e9pendant et rempla\u00e7able' },
  ],
}

const entityComparisonBad: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Anti-pattern \u2014 Entity = ORM',
  dotColor: '#e84a7a',
  items: [
    { text: 'Imports depuis TypeORM/NestJS en t\u00eate de fichier' },
    { text: 'D\u00e9corateurs <code>@Entity</code> <code>@Column</code> partout' },
    { text: 'Sac de donn\u00e9es \u2014 aucune m\u00e9thode m\u00e9tier' },
    { text: 'Le sch\u00e9ma DB dicte la structure objet' },
    { text: 'Impossible de tester sans d\u00e9marrer une DB' },
    { text: 'Le domaine fuit dans l\u2019infrastructure' },
  ],
}

const entityComparisonGood: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Double mod\u00e8le \u2014 Entity + ORM s\u00e9par\u00e9s',
  dotColor: '#4ae8b0',
  items: [
    { text: 'Zero import \u2014 TypeScript pur' },
    { text: 'Propri\u00e9t\u00e9s priv\u00e9es, encapsulation r\u00e9elle' },
    { text: 'M\u00e9thodes m\u00e9tier : <code>payer()</code> <code>annuler()</code> <code>totalTTC()</code>' },
    { text: 'Structure dict\u00e9e par le m\u00e9tier, pas la DB' },
    { text: '<code>new Commande()</code> suffit pour tester' },
    { text: 'Un <code>Mapper</code> traduit entre les deux mondes' },
  ],
}

const diagnosticCards: DiagnosticCard[] = [
  {
    icon: '\u{1F9EA}',
    colorClass: 'green',
    name: 'Test sans infrastructure',
    title: 'Tester sans infrastructure',
    description:
      'Peut-on \u00e9crire <code>new PasserCommandeUseCase(fakeRepo, fakePaiement, fakeNotif)</code> et tester une r\u00e8gle m\u00e9tier sans DB, sans NestJS, sans HTTP ? Si oui, l\u2019hexagone est propre.',
    tags: ['Jest pur', 'Zero infra'],
  },
  {
    icon: '\u{1F504}',
    colorClass: 'blue',
    name: 'Test swap DB',
    title: 'Remplacer la base de donn\u00e9es',
    description:
      'Si on remplace PostgreSQL par MongoDB, combien de fichiers sont modifi\u00e9s ? En hexagonale : exactement <strong>1</strong> \u2014 l\u2019adapter. Le UseCase et le domaine restent intacts.',
    tags: ['1 seul fichier', 'Domain intact'],
  },
  {
    icon: '\u{1F310}',
    colorClass: 'purple',
    name: 'Test swap framework',
    title: 'Remplacer NestJS par Express',
    description:
      'Si on change de framework HTTP, le domaine m\u00e9tier est-il touch\u00e9 ? Non. Seul le driving adapter change. Use Cases, Entities et ports restent identiques.',
    tags: ['Framework agnostique', 'Domaine stable'],
  },
]

const layerRows: LayerRow[] = [
  {
    color: '#e87a4a',
    num: 'infrastructure/',
    title: 'Infrastructure \u2014 Adapters concrets',
    files: [
      { label: 'CommandeController.ts', colorClass: 'lf-orange' },
      { label: 'PostgresCommandeRepo.ts', colorClass: 'lf-orange' },
      { label: 'StripeService.ts', colorClass: 'lf-orange' },
      { label: 'EmailService.ts', colorClass: 'lf-orange' },
    ],
  },
  {
    color: '#e84a7a',
    num: 'usecases/ports/',
    title: 'Ports \u2014 Interfaces propri\u00e9t\u00e9 du domaine',
    files: [
      { label: 'ICommandeRepository.ts', colorClass: 'lf-iface' },
      { label: 'IPaiementService.ts', colorClass: 'lf-iface' },
      { label: 'INotificationService.ts', colorClass: 'lf-iface' },
    ],
  },
  {
    color: '#4ae8b0',
    num: 'domain/',
    title: 'Domaine \u2014 Noyau pur, zero import',
    files: [
      { label: 'Commande.ts', colorClass: 'lf-green' },
      { label: 'Client.ts', colorClass: 'lf-green' },
      { label: 'LigneCommande.ts (VO)', colorClass: 'lf-green' },
      { label: 'Montant.ts (VO)', colorClass: 'lf-green' },
    ],
  },
]

const correspondanceRows: LayerRow[] = [
  {
    color: '#e87a4a',
    num: 'Couche ext\u00e9rieure',
    title: 'Infrastructure / Frameworks',
    files: [
      { label: 'Hexagonale : Adapters', colorClass: 'lf-orange' },
      { label: 'Clean : Frameworks + Adapters', colorClass: 'lf-orange' },
      { label: 'Onion : Infrastructure', colorClass: 'lf-orange' },
    ],
  },
  {
    color: '#e84a7a',
    num: 'Ports / Interfaces',
    title: 'Contrats entre couches',
    files: [
      { label: 'Hexagonale : Ports', colorClass: 'lf-iface' },
      { label: 'Clean : Use Case Boundaries', colorClass: 'lf-iface' },
      { label: 'Onion : Service Interfaces', colorClass: 'lf-iface' },
    ],
  },
  {
    color: '#a78bfa',
    num: 'Cas d\u2019utilisation',
    title: 'Application Services / Use Cases',
    files: [
      { label: 'Hexagonale : Use Cases', colorClass: 'lf-purple' },
      { label: 'Clean : Interactors', colorClass: 'lf-purple' },
      { label: 'Onion : Application Services', colorClass: 'lf-purple' },
    ],
  },
  {
    color: '#4ae8b0',
    num: 'Noyau',
    title: 'Domaine m\u00e9tier pur',
    files: [
      { label: 'Hexagonale : Domain', colorClass: 'lf-green' },
      { label: 'Clean : Entities', colorClass: 'lf-green' },
      { label: 'Onion : Domain Model', colorClass: 'lf-green' },
    ],
  },
]

const decisionRows: DecisionRow[] = [
  {
    element: '@Controller',
    placement: 'infrastructure/http/',
    badgeClass: 'badge-ok',
    badgeLabel: 'DRIVING ADAPTER',
    note: 'Traduit HTTP \u2192 Command du domaine',
  },
  {
    element: '@Injectable() Service',
    placement: 'usecases/',
    badgeClass: 'badge-warn',
    badgeLabel: 'USE CASE',
    note: 'Acceptable si @Injectable() est le seul d\u00e9corateur NestJS',
  },
  {
    element: '@Entity() TypeORM',
    placement: 'infrastructure/persistence/orm/',
    badgeClass: 'badge-bad',
    badgeLabel: 'ORM ONLY',
    note: 'Jamais dans domain/ \u2014 mod\u00e8le de persistance uniquement',
  },
  {
    element: 'Entity domaine',
    placement: 'domain/',
    badgeClass: 'badge-ok',
    badgeLabel: 'DOMAIN',
    note: 'TypeScript pur, zero import, m\u00e9thodes m\u00e9tier riches',
  },
  {
    element: 'Repository interface',
    placement: 'usecases/ports/',
    badgeClass: 'badge-ok',
    badgeLabel: 'PORT',
    note: 'D\u00e9fini par le domaine, impl\u00e9ment\u00e9 par l\u2019infra',
  },
  {
    element: 'Repository impl',
    placement: 'infrastructure/persistence/',
    badgeClass: 'badge-ok',
    badgeLabel: 'DRIVEN ADAPTER',
    note: 'implements ICommandeRepository',
  },
  {
    element: '@Module()',
    placement: 'infrastructure/config/',
    badgeClass: 'badge-warn',
    badgeLabel: 'DI WIRING',
    note: 'Relie interfaces \u2192 impl\u00e9mentations concr\u00e8tes',
  },
  {
    element: 'Mapper ORM \u2194 Domaine',
    placement: 'infrastructure/persistence/mapper/',
    badgeClass: 'badge-ok',
    badgeLabel: 'TRANSLATOR',
    note: 'Seul fichier qui conna\u00eet les deux mondes',
  },
]

const legendItems: LegendItem[] = [
  { color: '#4ae8b0', label: 'Domaine (Entities, Value Objects)' },
  { color: '#a78bfa', label: 'Use Cases (orchestration)' },
  { color: '#e84a7a', label: 'Ports (interfaces)' },
  { color: '#e87a4a', label: 'Adapters (infrastructure)' },
  { color: '#4a9ee8', label: 'Driven side (pilot\u00e9)' },
  { color: '#e8c84a', label: 'R\u00e8gle / Principe' },
]

const codePortInterfaces = `<span class="cm">// D\u00e9fini PAR le UseCase. PostgreSQL vient se "brancher" ici.</span>
<span class="cm">// Ce fichier APPARTIENT au domaine \u2014 pas \u00e0 l'infrastructure.</span>
<span class="kw">export interface</span> <span class="ty">ICommandeRepository</span> {
  <span class="fn">sauvegarder</span>(commande: <span class="ty">Commande</span>): <span class="ty">Promise&lt;void&gt;</span>;
  <span class="fn">trouverParId</span>(id: <span class="ty">CommandeId</span>): <span class="ty">Promise&lt;Commande | null&gt;</span>;
  <span class="fn">trouverParClient</span>(clientId: <span class="ty">ClientId</span>): <span class="ty">Promise&lt;Commande[]&gt;</span>;
}

<span class="kw">export interface</span> <span class="ty">IPaiementService</span> {
  <span class="fn">debiter</span>(montant: <span class="ty">Montant</span>, client: <span class="ty">Client</span>): <span class="ty">Promise&lt;TransactionId&gt;</span>;
  <span class="fn">rembourser</span>(transactionId: <span class="ty">TransactionId</span>): <span class="ty">Promise&lt;void&gt;</span>;
}

<span class="kw">export interface</span> <span class="ty">INotificationService</span> {
  <span class="fn">envoyer</span>(destinataire: <span class="ty">Email</span>, message: <span class="ty">string</span>): <span class="ty">Promise&lt;void&gt;</span>;
}`

const codeEntity = `<span class="cm">// AUCUN import. TypeScript pur. Instanciable avec new Commande().</span>
<span class="kw">export class</span> <span class="ty">Commande</span> {
  <span class="kw">private</span> statut: <span class="ty">StatutCommande</span>;
  <span class="kw">private readonly</span> lignes: <span class="ty">LigneCommande</span>[];

  <span class="kw">private constructor</span>(
    <span class="kw">private readonly</span> id: <span class="ty">CommandeId</span>,
    <span class="kw">private readonly</span> clientId: <span class="ty">ClientId</span>,
    lignes: <span class="ty">LigneCommande</span>[]
  ) {
    <span class="kw">if</span> (lignes.length === <span class="str">0</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Une commande ne peut pas \u00eatre vide'</span>);
    <span class="kw">this</span>.lignes = lignes;
    <span class="kw">this</span>.statut = <span class="ty">StatutCommande</span>.EN_ATTENTE;
  }

  <span class="cm">// Factory method \u2014 r\u00e8gles de cr\u00e9ation centralis\u00e9es</span>
  <span class="kw">static</span> <span class="fn">creer</span>(clientId: <span class="ty">ClientId</span>, lignes: <span class="ty">LigneCommande</span>[]): <span class="ty">Commande</span> {
    <span class="kw">return new</span> <span class="ty">Commande</span>(<span class="ty">CommandeId</span>.<span class="fn">nouveau</span>(), clientId, lignes);
  }

  <span class="cm">// Reconstitution depuis la persistance (sans valider \u00e0 nouveau)</span>
  <span class="kw">static</span> <span class="fn">reconstituer</span>(id: <span class="ty">string</span>, clientId: <span class="ty">string</span>, statut: <span class="ty">string</span>, lignes: <span class="ty">LigneCommande</span>[]): <span class="ty">Commande</span> {
    <span class="kw">const</span> c = <span class="kw">new</span> <span class="ty">Commande</span>(<span class="kw">new</span> <span class="ty">CommandeId</span>(id), <span class="kw">new</span> <span class="ty">ClientId</span>(clientId), lignes);
    c.statut = <span class="ty">StatutCommande</span>[statut <span class="kw">as</span> <span class="kw">keyof typeof</span> <span class="ty">StatutCommande</span>];
    <span class="kw">return</span> c;
  }

  <span class="cm">// \u2500\u2500 M\u00e9thodes m\u00e9tier riches \u2014 impossibles avec @Entity() TypeORM \u2500\u2500</span>
  <span class="fn">payer</span>(montant: <span class="ty">Montant</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.statut !== <span class="ty">StatutCommande</span>.EN_ATTENTE)
      <span class="kw">throw new</span> <span class="ty">CommandeDejaTraiteeError</span>(<span class="kw">this</span>.id);
    <span class="kw">if</span> (!montant.<span class="fn">equals</span>(<span class="kw">this</span>.<span class="fn">totalTTC</span>()))
      <span class="kw">throw new</span> <span class="ty">MontantIncorrectError</span>(montant, <span class="kw">this</span>.<span class="fn">totalTTC</span>());
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

  <span class="fn">getId</span>(): <span class="ty">CommandeId</span> { <span class="kw">return this</span>.id; }
  <span class="fn">getStatut</span>(): <span class="ty">StatutCommande</span> { <span class="kw">return this</span>.statut; }
  <span class="fn">getLignes</span>(): <span class="ty">ReadonlyArray&lt;LigneCommande&gt;</span> { <span class="kw">return</span> [...<span class="kw">this</span>.lignes]; }
}`

const codeUseCase = `<span class="cm">// Le UseCase ne conna\u00eet QUE des interfaces (ports).</span>
<span class="cm">// Il ignore si la DB est PostgreSQL, MongoDB ou en m\u00e9moire.</span>
<span class="kw">export class</span> <span class="ty">PasserCommandeUseCase</span> {
  <span class="fn">constructor</span>(
    <span class="kw">private readonly</span> repo:     <span class="ty">ICommandeRepository</span>,   <span class="cm">// \u2190 interface, pas PostgreSQL</span>
    <span class="kw">private readonly</span> paiement: <span class="ty">IPaiementService</span>,      <span class="cm">// \u2190 interface, pas Stripe</span>
    <span class="kw">private readonly</span> notif:    <span class="ty">INotificationService</span>   <span class="cm">// \u2190 interface, pas SMTP</span>
  ) {}

  <span class="kw">async</span> <span class="fn">executer</span>(cmd: <span class="ty">PasserCommandeCommand</span>): <span class="ty">Promise&lt;CommandeId&gt;</span> {
    <span class="cm">// 1. R\u00e9cup\u00e9rer les entit\u00e9s du domaine via le port</span>
    <span class="kw">const</span> client = <span class="kw">await this</span>.repo.<span class="fn">trouverClientParId</span>(cmd.clientId);
    <span class="kw">if</span> (!client) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Client introuvable'</span>);

    <span class="cm">// 2. Cr\u00e9er l'entit\u00e9 domaine \u2014 r\u00e8gle m\u00e9tier pure</span>
    <span class="kw">const</span> commande = <span class="ty">Commande</span>.<span class="fn">creer</span>(client.getId(), cmd.lignes);

    <span class="cm">// 3. Persister via le port (\u2260 TypeORM)</span>
    <span class="kw">await this</span>.repo.<span class="fn">sauvegarder</span>(commande);

    <span class="cm">// 4. Paiement via le port (\u2260 Stripe SDK)</span>
    <span class="kw">await this</span>.paiement.<span class="fn">debiter</span>(commande.<span class="fn">totalTTC</span>(), client);
    commande.<span class="fn">payer</span>(commande.<span class="fn">totalTTC</span>());  <span class="cm">// r\u00e8gle m\u00e9tier : transition de statut</span>
    <span class="kw">await this</span>.repo.<span class="fn">sauvegarder</span>(commande); <span class="cm">// maj du statut</span>

    <span class="cm">// 5. Notification via le port (\u2260 SMTP)</span>
    <span class="kw">await this</span>.notif.<span class="fn">envoyer</span>(client.getEmail(), <span class="str">\`Commande \${commande.getId()} confirm\u00e9e\`</span>);

    <span class="kw">return</span> commande.<span class="fn">getId</span>();
  }
}`

const codeDrivenAdapter = `<span class="cm">// SEUL fichier qui conna\u00eet TypeORM. Impl\u00e9mente le contrat du domaine.</span>
<span class="kw">export class</span> <span class="ty">PostgresCommandeRepository</span> <span class="kw">implements</span> <span class="ty">ICommandeRepository</span> {
  <span class="fn">constructor</span>(<span class="kw">private readonly</span> repo: <span class="ty">Repository&lt;CommandeORM&gt;</span>) {}

  <span class="kw">async</span> <span class="fn">sauvegarder</span>(commande: <span class="ty">Commande</span>): <span class="ty">Promise&lt;void&gt;</span> {
    <span class="kw">const</span> row = <span class="ty">CommandeMapper</span>.<span class="fn">versORM</span>(commande); <span class="cm">// Entity domaine \u2192 ligne SQL</span>
    <span class="kw">await this</span>.repo.<span class="fn">save</span>(row);
  }

  <span class="kw">async</span> <span class="fn">trouverParId</span>(id: <span class="ty">CommandeId</span>): <span class="ty">Promise&lt;Commande | null&gt;</span> {
    <span class="kw">const</span> row = <span class="kw">await this</span>.repo.<span class="fn">findOneBy</span>({ id: id.valeur });
    <span class="kw">return</span> row ? <span class="ty">CommandeMapper</span>.<span class="fn">versDomaine</span>(row) : <span class="kw">null</span>; <span class="cm">// ligne SQL \u2192 Entity domaine</span>
  }
}`

const codeDrivingAdapter = `<span class="cm">// Traduit HTTP \u2192 langage du domaine. Z\u00e9ro logique m\u00e9tier ici.</span>
<span class="dec">@Controller</span>(<span class="str">'/commandes'</span>)
<span class="kw">export class</span> <span class="ty">CommandeController</span> {
  <span class="fn">constructor</span>(<span class="kw">private readonly</span> useCase: <span class="ty">PasserCommandeUseCase</span>) {}

  <span class="dec">@Post</span>()
  <span class="dec">@UsePipes</span>(<span class="kw">new</span> <span class="ty">ValidationPipe</span>())
  <span class="kw">async</span> <span class="fn">passerCommande</span>(<span class="dec">@Body</span>() dto: <span class="ty">PasserCommandeDTO</span>) {
    <span class="cm">// 1. Traduire DTO HTTP \u2192 Command du domaine</span>
    <span class="kw">const</span> command = <span class="kw">new</span> <span class="ty">PasserCommandeCommand</span>(
      <span class="kw">new</span> <span class="ty">ClientId</span>(dto.clientId),
      dto.lignes.<span class="fn">map</span>(l => <span class="kw">new</span> <span class="ty">LigneCommande</span>(l.produitId, l.quantite, l.prixUnitaire))
    );

    <span class="cm">// 2. D\u00e9l\u00e9guer au UseCase \u2014 le seul r\u00f4le de ce controller</span>
    <span class="kw">const</span> commandeId = <span class="kw">await this</span>.useCase.<span class="fn">executer</span>(command);

    <span class="cm">// 3. Traduire r\u00e9sultat domaine \u2192 r\u00e9ponse HTTP</span>
    <span class="kw">return</span> { commandeId: commandeId.valeur, status: <span class="str">'created'</span> };
  }
}`

const codeORM = `<span class="cm">// Ce fichier VIT dans infrastructure/. Jamais dans domain/.</span>
<span class="cm">// C'est un sac de donn\u00e9es plat pour TypeORM \u2014 aucune logique m\u00e9tier.</span>
<span class="kw">import</span> { Entity, PrimaryColumn, Column, CreateDateColumn } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Entity</span>(<span class="str">'commandes'</span>)
<span class="kw">export class</span> <span class="ty">CommandeORM</span> {
  <span class="dec">@PrimaryColumn</span>(<span class="str">'uuid'</span>)
  id: <span class="ty">string</span>;

  <span class="dec">@Column</span>({ name: <span class="str">'client_id'</span> })
  clientId: <span class="ty">string</span>;

  <span class="dec">@Column</span>({ type: <span class="str">'varchar'</span>, length: <span class="str">20</span> })
  statut: <span class="ty">string</span>;

  <span class="dec">@Column</span>({ type: <span class="str">'jsonb'</span> })
  lignes: <span class="ty">Array&lt;{ produitId: string; quantite: number; prixUnitaire: number }&gt;</span>;

  <span class="dec">@CreateDateColumn</span>({ name: <span class="str">'created_at'</span> })
  createdAt: <span class="ty">Date</span>;

  <span class="cm">// Aucune m\u00e9thode m\u00e9tier. Ce n'est pas son r\u00f4le.</span>
}`

const codeMapper = `<span class="cm">// Le seul endroit qui conna\u00eet les deux mod\u00e8les.</span>
<span class="cm">// Si tu changes de sch\u00e9ma DB, tu ne modifies que ce fichier.</span>
<span class="kw">export class</span> <span class="ty">CommandeMapper</span> {

  <span class="kw">static</span> <span class="fn">versORM</span>(commande: <span class="ty">Commande</span>): <span class="ty">CommandeORM</span> {
    <span class="kw">const</span> orm = <span class="kw">new</span> <span class="ty">CommandeORM</span>();
    orm.id       = commande.<span class="fn">getId</span>().valeur;
    orm.clientId = commande.<span class="fn">getClientId</span>().valeur;
    orm.statut   = commande.<span class="fn">getStatut</span>().toString();
    orm.lignes   = commande.<span class="fn">getLignes</span>().<span class="fn">map</span>(l => ({
      produitId:    l.<span class="fn">getProduitId</span>(),
      quantite:     l.<span class="fn">getQuantite</span>(),
      prixUnitaire: l.<span class="fn">getPrixUnitaire</span>().valeurCentimes
    }));
    <span class="kw">return</span> orm;
  }

  <span class="kw">static</span> <span class="fn">versDomaine</span>(row: <span class="ty">CommandeORM</span>): <span class="ty">Commande</span> {
    <span class="kw">const</span> lignes = row.lignes.<span class="fn">map</span>(l =>
      <span class="ty">LigneCommande</span>.<span class="fn">reconstituer</span>(l.produitId, l.quantite, l.prixUnitaire)
    );
    <span class="kw">return</span> <span class="ty">Commande</span>.<span class="fn">reconstituer</span>(row.id, row.clientId, row.statut, lignes);
  }
}`

const codeModule = `<span class="cm">// Le seul endroit qui sait tout. Relie les interfaces aux impl\u00e9mentations.</span>
<span class="dec">@Module</span>({
  imports: [<span class="ty">TypeOrmModule</span>.<span class="fn">forFeature</span>([<span class="ty">CommandeORM</span>])],
  providers: [
    <span class="cm">// Bind interface \u2192 impl\u00e9mentation concr\u00e8te</span>
    { provide: <span class="str">'ICommandeRepository'</span>,  useClass: <span class="ty">PostgresCommandeRepository</span> },
    { provide: <span class="str">'IPaiementService'</span>,     useClass: <span class="ty">StripeService</span>             },
    { provide: <span class="str">'INotificationService'</span>, useClass: <span class="ty">EmailService</span>             },
    <span class="ty">PasserCommandeUseCase</span>,
    <span class="ty">AnnulerCommandeUseCase</span>,
  ],
  controllers: [<span class="ty">CommandeController</span>],
})
<span class="kw">export class</span> <span class="ty">CommandeModule</span> {}

<span class="cm">// Pour les tests : swap sans toucher au UseCase</span>
<span class="cm">// { provide: 'ICommandeRepository', useClass: InMemoryCommandeRepository }</span>
<span class="cm">// { provide: 'IPaiementService',    useClass: MockPaiementService }</span>`

const codeTest = `<span class="cm">// Ce test ne n\u00e9cessite aucune DB, aucun NestJS, aucune connexion r\u00e9seau.</span>
<span class="cm">// InMemoryRepo et MockPaiement impl\u00e9mentent les ports du domaine.</span>
<span class="kw">import</span> { <span class="ty">PasserCommandeUseCase</span> }       <span class="kw">from</span> <span class="str">'./usecases/PasserCommandeUseCase'</span>;
<span class="kw">import</span> { <span class="ty">InMemoryCommandeRepository</span> } <span class="kw">from</span> <span class="str">'./fakes/InMemoryCommandeRepository'</span>;
<span class="kw">import</span> { <span class="ty">MockPaiementService</span> }         <span class="kw">from</span> <span class="str">'./fakes/MockPaiementService'</span>;

<span class="fn">it</span>(<span class="str">'passe une commande et la marque pay\u00e9e'</span>, <span class="kw">async</span> () => {
  <span class="cm">// Arrange \u2014 fakes qui impl\u00e9mentent les ports du domaine</span>
  <span class="kw">const</span> repo     = <span class="kw">new</span> <span class="ty">InMemoryCommandeRepository</span>();
  <span class="kw">const</span> paiement = <span class="kw">new</span> <span class="ty">MockPaiementService</span>();
  <span class="kw">const</span> notif    = <span class="kw">new</span> <span class="ty">MockNotificationService</span>();

  <span class="cm">// Instanciation SANS NestJS \u2014 preuve que le UseCase est agnostique</span>
  <span class="kw">const</span> useCase = <span class="kw">new</span> <span class="ty">PasserCommandeUseCase</span>(repo, paiement, notif);

  <span class="cm">// Act</span>
  <span class="kw">const</span> commandeId = <span class="kw">await</span> useCase.<span class="fn">executer</span>({
    clientId: <span class="ty">ClientId</span>.<span class="fn">de</span>(<span class="str">'client-42'</span>),
    lignes: [{ produitId: <span class="str">'p1'</span>, quantite: <span class="str">2</span>, prixUnitaire: <span class="str">50</span> }]
  });

  <span class="cm">// Assert \u2014 on teste le comportement, pas l'impl\u00e9mentation</span>
  <span class="fn">expect</span>(repo.commandes).<span class="fn">toHaveLength</span>(<span class="str">1</span>);
  <span class="fn">expect</span>(repo.commandes[<span class="str">0</span>].<span class="fn">getStatut</span>()).<span class="fn">toBe</span>(<span class="ty">StatutCommande</span>.PAYEE);
  <span class="fn">expect</span>(paiement.debitsEffectues).<span class="fn">toHaveLength</span>(<span class="str">1</span>);
  <span class="fn">expect</span>(notif.messagesEnvoyes).<span class="fn">toHaveLength</span>(<span class="str">1</span>);
});

<span class="fn">it</span>(<span class="str">'refuse une commande vide'</span>, () => {
  <span class="cm">// Tester la r\u00e8gle m\u00e9tier directement sur l'Entity \u2014 encore plus direct</span>
  <span class="fn">expect</span>(() => <span class="ty">Commande</span>.<span class="fn">creer</span>(<span class="ty">ClientId</span>.<span class="fn">de</span>(<span class="str">'c1'</span>), []))
    .<span class="fn">toThrow</span>(<span class="str">'Une commande ne peut pas \u00eatre vide'</span>);
});`

const fileTreeHtml = `<span class="ft-gray">src/</span>
<span class="ft-green">\u251C\u2500\u2500 domain/</span>                               <span class="ft-gray">\u2190 Noyau \u2014 ZERO import externe</span>
<span class="ft-green">\u2502   \u251C\u2500\u2500 Commande.ts</span>                        <span class="ft-gray">// payer() annuler() totalTTC() \u2014 r\u00e8gles m\u00e9tier</span>
<span class="ft-green">\u2502   \u251C\u2500\u2500 Client.ts</span>                          <span class="ft-gray">// peuxCommander() adresseValide()</span>
<span class="ft-green">\u2502   \u251C\u2500\u2500 LigneCommande.ts</span>                   <span class="ft-gray">// Value Object \u2014 prixTTC()</span>
<span class="ft-green">\u2502   \u251C\u2500\u2500 Montant.ts</span>                         <span class="ft-gray">// Value Object \u2014 ajouter() equals()</span>
<span class="ft-green">\u2502   \u2514\u2500\u2500 StatutCommande.ts</span>                  <span class="ft-gray">// Enum domaine</span>
\u2502
<span class="ft-purple">\u251C\u2500\u2500 usecases/</span>                              <span class="ft-gray">\u2190 Orchestration + ports</span>
<span class="ft-purple">\u2502   \u251C\u2500\u2500 PasserCommandeUseCase.ts</span>           <span class="ft-gray">// executer(cmd) \u2014 s\u00e9quence applicative</span>
<span class="ft-purple">\u2502   \u251C\u2500\u2500 AnnulerCommandeUseCase.ts</span>
<span class="ft-purple">\u2502   \u2514\u2500\u2500 ports/</span>                             <span class="ft-gray">\u2190 Interfaces APPARTENANT au domaine</span>
<span class="ft-iface">\u2502       \u251C\u2500\u2500 ICommandeRepository.ts</span>         <span class="ft-gray">// &lt;&lt;interface&gt;&gt; sauvegarder() trouverParId()</span>
<span class="ft-iface">\u2502       \u251C\u2500\u2500 IPaiementService.ts</span>             <span class="ft-gray">// &lt;&lt;interface&gt;&gt; debiter() rembourser()</span>
<span class="ft-iface">\u2502       \u2514\u2500\u2500 INotificationService.ts</span>        <span class="ft-gray">// &lt;&lt;interface&gt;&gt; envoyer()</span>
\u2502
<span class="ft-orange">\u2514\u2500\u2500 infrastructure/</span>                        <span class="ft-gray">\u2190 Tout ce qui est concret et rempla\u00e7able</span>
<span class="ft-orange">    \u251C\u2500\u2500 http/</span>                              <span class="ft-gray">\u2190 Adapters PILOTANTS</span>
<span class="ft-orange">    \u2502   \u251C\u2500\u2500 CommandeController.ts</span>          <span class="ft-gray">// @Controller NestJS \u2014 traduit HTTP \u2192 UseCase</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 dto/PasserCommandeDTO.ts</span>       <span class="ft-gray">// @IsNotEmpty \u2014 validation HTTP uniquement</span>
<span class="ft-orange">    \u251C\u2500\u2500 persistence/</span>                       <span class="ft-gray">\u2190 Adapters PILOT\u00c9S</span>
<span class="ft-orange">    \u2502   \u251C\u2500\u2500 PostgresCommandeRepository.ts</span>  <span class="ft-gray">// implements ICommandeRepository</span>
<span class="ft-orange">    \u2502   \u251C\u2500\u2500 orm/CommandeORM.ts</span>             <span class="ft-gray">// @Entity TypeORM (\u2260 Entity domaine)</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 mapper/CommandeMapper.ts</span>       <span class="ft-gray">// ORM \u2194 Domaine \u2014 seul traducteur</span>
<span class="ft-orange">    \u251C\u2500\u2500 paiement/</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 StripeService.ts</span>               <span class="ft-gray">// implements IPaiementService</span>
<span class="ft-orange">    \u251C\u2500\u2500 notification/</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 EmailService.ts</span>                <span class="ft-gray">// implements INotificationService</span>
<span class="ft-orange">    \u2514\u2500\u2500 config/</span>
<span class="ft-orange">        \u2514\u2500\u2500 CommandeModule.ts</span>              <span class="ft-gray">// @Module \u2014 DI : bind interfaces \u2192 impl\u00e9mentations</span>`

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
    label: 'Principes',
    links: [
      { id: 'dependency-rule', label: 'Dependency Rule' },
      { id: 'ports', label: 'Les Ports' },
    ],
  },
  {
    label: 'Code & Structure',
    links: [
      { id: 'structure', label: 'Structure src/' },
      { id: 'code', label: 'Code couche par couche' },
      { id: 'entity', label: 'Entity vs ORM' },
      { id: 'nestjs', label: 'NestJS dans l\u2019hexagone' },
    ],
  },
  {
    label: 'R\u00e9f\u00e9rences',
    links: [
      { id: 'diagnostic', label: 'Test ultime' },
      { id: 'correspondances', label: 'Correspondances' },
      { id: 'resume', label: 'R\u00e9sum\u00e9' },
    ],
  },
]

useHead({
  title: 'Architecture Hexagonale \u2014 Ports & Adapters',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Architecture Hexagonale \u2014 Ports & Adapters',
        description:
          'Architecture Hexagonale (Ports & Adapters) d\u2019Alistair Cockburn : principes, sch\u00e9ma fondamental, Dependency Rule, exemples de code TypeScript et structure de projet.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/hexagonal-architecture',
        author: {
          '@type': 'Person',
          name: 'Alistair Cockburn',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Architecture Hexagonale (Ports & Adapters) d\u2019Alistair Cockburn : principes, sch\u00e9ma fondamental, Dependency Rule, exemples de code TypeScript et structure de projet.',
  ogTitle: 'Architecture Hexagonale \u2014 Ports & Adapters',
  ogDescription:
    'Architecture Hexagonale (Ports & Adapters) d\u2019Alistair Cockburn : principes, sch\u00e9ma fondamental, Dependency Rule, exemples de code TypeScript et structure de projet.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/hexagonal-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Architecture Hexagonale \u2014 Ports & Adapters',
  twitterDescription:
    'Architecture Hexagonale (Ports & Adapters) d\u2019Alistair Cockburn : principes, sch\u00e9ma fondamental, Dependency Rule, exemples de code TypeScript et structure de projet.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="Architecture<br>Hexagonale"
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
      <div class="eyebrow">// Architecture Hexagonale &mdash; R&eacute;f&eacute;rence compl&egrave;te</div>
      <h1>L&rsquo;Architecture<br><em>Hexagonale</em></h1>
      <p class="subtitle">
        Ports &amp; Adapters &mdash; Alistair Cockburn (2005). Isoler le domaine m&eacute;tier
        de tout ce qui est technique, rempla&ccedil;able, p&eacute;riph&eacute;rique.
      </p>
    </header>

    <!-- Quote box -->
    <div class="quote-box">
      <div class="quote-icon">&#x1F50C;</div>
      <div class="quote-content">
        <h3>Alistair Cockburn &mdash; 2005</h3>
        <p>
          &laquo;&nbsp;Allow an application to equally be driven by users, programs, automated
          test or batch scripts, and to be developed and tested in isolation from its eventual
          run-time devices and databases.&nbsp;&raquo; L&rsquo;application doit fonctionner
          <em>indiff&eacute;remment</em> pilot&eacute;e par un humain, un test automatis&eacute;
          ou un script &mdash; et communiquer <em>indiff&eacute;remment</em> avec une vraie base
          de donn&eacute;es, une impl&eacute;mentation en m&eacute;moire, ou un fichier CSV.
        </p>
      </div>
    </div>

    <!-- Section 01 : La metaphore -->
    <section id="metaphore" class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La m&eacute;taphore : l&rsquo;ambassade avec des prises universelles</h2>
        <div class="section-line" />
      </div>
      <div class="prose">
        <p>
          Imagine une <strong>ambassade fran&ccedil;aise &agrave; Tokyo</strong>. &Agrave;
          l&rsquo;int&eacute;rieur, les lois fran&ccedil;aises s&rsquo;appliquent &mdash;
          c&rsquo;est le <em>domaine</em>. Les visiteurs japonais ne changent pas les lois de
          l&rsquo;ambassade : ils s&rsquo;adaptent &agrave; son protocole. L&rsquo;ambassade
          dispose de <strong>prises universelles</strong> &mdash; des ports &mdash; o&ugrave;
          n&rsquo;importe quel visiteur peut se &ldquo;brancher&rdquo;.
        </p>
        <p>
          C&rsquo;est exactement l&rsquo;architecture hexagonale. Le domaine m&eacute;tier est
          l&rsquo;ambassade. Les <em>ports</em> sont les prises normalis&eacute;es. Les
          <em>adapters</em> sont les convertisseurs qui permettent &agrave; n&rsquo;importe quel
          &eacute;quipement &eacute;tranger (HTTP, PostgreSQL, Stripe, un fichier CSV) de se
          brancher sur ces prises.
        </p>
        <p>
          Si demain l&rsquo;ambassade d&eacute;m&eacute;nage &agrave; Berlin, les prises restent
          les m&ecirc;mes &mdash; seuls les <em>adaptateurs</em> changent. Le domaine ne bouge
          pas d&rsquo;une virgule.
        </p>
      </div>
    </section>

    <!-- Section 02 : Vue d'ensemble -->
    <section id="overview" class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Vue d&rsquo;ensemble &mdash; Le sch&eacute;ma fondamental</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          L&rsquo;hexagone se divise en <strong>deux c&ocirc;t&eacute;s</strong>. &Agrave;
          gauche, les <em>driving adapters</em> (pilotants) &mdash; ceux qui d&eacute;clenchent
          une action. &Agrave; droite, les <em>driven adapters</em> (pilot&eacute;s) &mdash; ceux
          que l&rsquo;application utilise pour communiquer avec le monde ext&eacute;rieur. Au
          centre : le domaine, entour&eacute; de ports.
        </p>
      </div>

      <!-- Hexagonal CSS diagram -->
      <div class="hex-diagram">
        <!-- Center domain circle -->
        <div class="hex-center">
          <span class="hc-label">Noyau</span>
          <span class="hc-title">Entit&eacute;s<br>+ Use Cases</span>
        </div>

        <!-- Dashed port ring (CSS) -->
        <div class="hex-port-ring" />

        <!-- SVG arrows -->
        <svg class="hex-arrows" viewBox="0 0 720 440" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Driving arrows (left to center) -->
          <line x1="170" y1="80" x2="290" y2="180" stroke="rgba(232,122,74,0.5)" stroke-width="1.5" stroke-dasharray="6 4" />
          <line x1="170" y1="220" x2="290" y2="220" stroke="rgba(232,122,74,0.5)" stroke-width="1.5" stroke-dasharray="6 4" />
          <line x1="170" y1="360" x2="290" y2="260" stroke="rgba(232,122,74,0.5)" stroke-width="1.5" stroke-dasharray="6 4" />
          <!-- Driven arrows (center to right) -->
          <line x1="430" y1="180" x2="550" y2="80" stroke="rgba(74,158,232,0.5)" stroke-width="1.5" stroke-dasharray="6 4" />
          <line x1="430" y1="220" x2="550" y2="220" stroke="rgba(74,158,232,0.5)" stroke-width="1.5" stroke-dasharray="6 4" />
          <line x1="430" y1="260" x2="550" y2="360" stroke="rgba(74,158,232,0.5)" stroke-width="1.5" stroke-dasharray="6 4" />
          <!-- Port labels -->
          <text x="260" y="170" fill="rgba(232,74,122,0.7)" font-size="9" font-family="IBM Plex Mono, monospace" text-anchor="end">PORT D'ENTR&Eacute;E</text>
          <text x="460" y="170" fill="rgba(232,74,122,0.7)" font-size="9" font-family="IBM Plex Mono, monospace">PORT DE SORTIE</text>
        </svg>

        <!-- Driving adapters (left) -->
        <div class="hex-adapter driving" style="left: 0; top: 40px;">
          <div class="adp-type">driving</div>
          HTTP Controller
        </div>
        <div class="hex-adapter driving" style="left: 0; top: 180px;">
          <div class="adp-type">driving</div>
          CLI Adapter
        </div>
        <div class="hex-adapter driving" style="left: 0; top: 320px;">
          <div class="adp-type">driving</div>
          Test / JUnit
        </div>

        <!-- Driven adapters (right) -->
        <div class="hex-adapter driven" style="right: 0; top: 40px;">
          <div class="adp-type">driven</div>
          PostgreSQL Repo
        </div>
        <div class="hex-adapter driven" style="right: 0; top: 180px;">
          <div class="adp-type">driven</div>
          Stripe Service
        </div>
        <div class="hex-adapter driven" style="right: 0; top: 320px;">
          <div class="adp-type">driven</div>
          Email Service
        </div>

        <!-- Side labels -->
        <div class="hex-side-label driving-lbl">Driving Side</div>
        <div class="hex-side-label driven-lbl">Driven Side</div>
      </div>

      <!-- Side cards -->
      <div class="cards">
        <article
          v-for="card in sideCards"
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

    <!-- Section 03 : La Dependency Rule -->
    <section id="dependency-rule" class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">La Dependency Rule &mdash; la loi absolue</h2>
        <div class="section-line" />
      </div>

      <div class="rule-banner">
        <strong>&ldquo;Les d&eacute;pendances ne pointent QUE vers le centre.&rdquo;</strong><br>
        Aucun fichier du domaine ne peut importer quoi que ce soit de l&rsquo;infrastructure.<br>
        L&rsquo;infrastructure d&eacute;pend du domaine. Jamais l&rsquo;inverse.
      </div>

      <!-- Dependency flow diagram -->
      <div class="dep-flow">
        <div class="dep-node" style="color:#e87a4a;border-color:rgba(232,122,74,0.4);background:rgba(232,122,74,0.08);">
          HTTP<br>Controller
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">appelle</span>
        </div>
        <div class="dep-node" style="color:#e84a7a;border-color:rgba(232,74,122,0.4);background:rgba(232,74,122,0.08);">
          IPasserCommande<br><small>Port d&rsquo;entr&eacute;e</small>
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">impl&eacute;mente</span>
        </div>
        <div class="dep-node" style="color:#a78bfa;border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.08);">
          UseCase<br><small>Domaine</small>
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">utilise</span>
        </div>
        <div class="dep-node" style="color:#e84a7a;border-color:rgba(232,74,122,0.4);background:rgba(232,74,122,0.08);">
          ICommandeRepo<br><small>Port de sortie</small>
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">impl&eacute;mente</span>
        </div>
        <div class="dep-node" style="color:#4a9ee8;border-color:rgba(74,158,232,0.4);background:rgba(74,158,232,0.08);">
          PostgresRepo<br><small>Driven Adapter</small>
        </div>
      </div>

      <div class="prose">
        <p>
          Cette r&egrave;gle est rendue possible gr&acirc;ce &agrave; l&rsquo;<strong>inversion de
          d&eacute;pendance (DIP)</strong>. Quand un Use Case a besoin d&rsquo;une base de
          donn&eacute;es, il ne l&rsquo;importe pas directement &mdash; il d&eacute;finit une
          <em>interface</em> (un port) que l&rsquo;adapter viendra impl&eacute;menter. Le
          UseCase d&eacute;finit le contrat, l&rsquo;Adapter s&rsquo;y conforme.
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

    <!-- Section 04 : Les Ports -->
    <section id="ports" class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">Les Ports &mdash; contrats propri&eacute;t&eacute; du domaine</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Un port est une <strong>interface TypeScript</strong> d&eacute;finie dans le domaine.
          C&rsquo;est le domaine qui d&eacute;cide de quoi il a besoin &mdash; pas
          l&rsquo;infrastructure. PostgreSQL, Stripe, SendGrid&hellip; tous se conforment au
          contrat du port. Si l&rsquo;un d&rsquo;eux dispara&icirc;t, le domaine ne change pas
          d&rsquo;une virgule.
        </p>
      </div>

      <!-- Swap diagram -->
      <div class="swap-diagram">
        <div class="swap-interface">
          <div class="swap-interface-box">
            <span class="sib-label">Port (Interface)</span>
            ICommandeRepository
          </div>
        </div>
        <div class="swap-connectors">
          <div class="swap-impl si-prod">
            <span class="si-ctx">Production</span>
            PostgresCommandeRepo
          </div>
          <div class="swap-impl si-test">
            <span class="si-ctx">Tests unitaires</span>
            InMemoryRepo
          </div>
          <div class="swap-impl si-alt">
            <span class="si-ctx">Migration</span>
            MongoCommandeRepo
          </div>
          <div class="swap-impl si-leg">
            <span class="si-ctx">Import legacy</span>
            CsvCommandeRepo
          </div>
        </div>
      </div>

      <div class="info-box">
        <strong>La m&eacute;taphore de la prise &eacute;lectrique.</strong> La norme de prise est
        d&eacute;finie par <em>les appareils qui en ont besoin</em>, pas par les fabricants de
        c&acirc;bles. De m&ecirc;me, <code>ICommandeRepository</code> est d&eacute;fini par le
        UseCase &mdash; pas par PostgreSQL. Stripe <em>d&eacute;pend du port</em>
        <code>IPaiementService</code>. Jamais l&rsquo;inverse.
      </div>

      <!-- Code block: Port interfaces -->
      <div class="code-filename">usecases/ports/ &mdash; Interfaces (ports)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codePortInterfaces" />
    </section>

    <!-- Section 05 : Structure src/ -->
    <section id="structure" class="section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">Structure src/ &mdash; Feature &ldquo;Passer une commande&rdquo;</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Voici comment l&rsquo;hexagone se traduit en une structure de fichiers concr&egrave;te
          pour une feature e-commerce, en suivant exactement le pattern Ports &amp; Adapters.
        </p>
      </div>

      <!-- File tree -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="file-tree" v-html="fileTreeHtml" />

      <!-- Layers diagram -->
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
          </div>
        </div>
      </div>
    </section>

    <!-- Section 06 : Code couche par couche -->
    <section id="code" class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Code couche par couche</h2>
        <div class="section-line" />
      </div>

      <!-- Entity -->
      <div class="code-filename">domain/Commande.ts &mdash; Entity domaine pure</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeEntity" />

      <!-- UseCase -->
      <div class="code-filename">usecases/PasserCommandeUseCase.ts &mdash; Use Case</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeUseCase" />

      <!-- Driven Adapter -->
      <div class="code-filename">infrastructure/persistence/PostgresCommandeRepository.ts &mdash; Driven Adapter</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeDrivenAdapter" />

      <!-- Driving Adapter -->
      <div class="code-filename">infrastructure/http/CommandeController.ts &mdash; Driving Adapter</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeDrivingAdapter" />
    </section>

    <!-- Section 07 : Entities NestJS/TypeORM vs Entities Domaine -->
    <section id="entity" class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">Entities NestJS/TypeORM vs Entities Domaine</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          C&rsquo;est la <strong>source de confusion la plus fr&eacute;quente</strong>. Une
          <code>@Entity()</code> TypeORM n&rsquo;est pas une Entity au sens hexagonal. Cockburn ne
          dit pas <em>&ldquo;n&rsquo;utilisez aucun framework&rdquo;</em> &mdash; il dit
          <strong>&ldquo;le domaine ne doit pas d&eacute;pendre d&rsquo;un framework&rdquo;</strong>.
          La solution : <strong>deux mod&egrave;les s&eacute;par&eacute;s</strong> et un
          <strong>Mapper</strong> pour traduire entre les deux.
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

      <!-- Code block: ORM -->
      <div class="code-filename">infrastructure/persistence/orm/CommandeORM.ts &mdash; Mod&egrave;le ORM</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeORM" />

      <!-- Code block: Mapper -->
      <div class="code-filename">infrastructure/persistence/mapper/CommandeMapper.ts &mdash; Traducteur</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeMapper" />
    </section>

    <!-- Section 08 : NestJS dans l'hexagone -->
    <section id="nestjs" class="section">
      <div class="section-header">
        <span class="section-number">08</span>
        <h2 class="section-title">NestJS dans l&rsquo;hexagone &mdash; O&ugrave; placer quoi ?</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          NestJS est un <strong>framework d&rsquo;infrastructure</strong>. Ses d&eacute;corateurs
          (<code>@Controller</code>, <code>@Module</code>, <code>@Entity</code>) appartiennent
          &agrave; la couche externe. Voici comment les placer dans l&rsquo;hexagone sans polluer
          le domaine.
        </p>
      </div>

      <!-- Decision table -->
      <table class="decision-table">
        <thead>
          <tr>
            <th>&Eacute;l&eacute;ment NestJS</th>
            <th>Placement</th>
            <th>Type</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in decisionRows"
            :key="row.element"
          >
            <td>{{ row.element }}</td>
            <td>{{ row.placement }}</td>
            <td><span class="badge" :class="row.badgeClass">{{ row.badgeLabel }}</span></td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>

      <div class="quote-box">
        <div class="quote-icon">&#x26A0;&#xFE0F;</div>
        <div class="quote-content">
          <h3>Le compromis @Injectable()</h3>
          <p>
            Utiliser <code>@Injectable()</code> sur un Use Case est un compromis acceptable.
            C&rsquo;est le <strong>seul d&eacute;corateur NestJS</strong> qui touche le domaine.
            Il n&rsquo;ajoute aucune d&eacute;pendance runtime &mdash; c&rsquo;est du metadata
            pour le container DI. Si cela vous d&eacute;range, vous pouvez enregistrer le
            UseCase manuellement dans le Module via <code>useFactory</code>.
          </p>
        </div>
      </div>

      <!-- Code block: Module -->
      <div class="code-filename">infrastructure/config/CommandeModule.ts &mdash; DI Wiring</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeModule" />
    </section>

    <!-- Section 09 : Le test ultime -->
    <section id="diagnostic" class="section">
      <div class="section-header">
        <span class="section-number">09</span>
        <h2 class="section-title">Le test ultime d&rsquo;un hexagone r&eacute;ussi</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Cockburn propose <strong>trois questions diagnostiques</strong> pour &eacute;valuer la
          qualit&eacute; d&rsquo;un hexagone. Si l&rsquo;une &eacute;choue, un port est mal
          d&eacute;fini ou un adapter fuit dans le domaine.
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
      <div class="code-filename">Test unitaire pur &mdash; zero infrastructure</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeTest" />

      <div class="warn-box">
        <strong>Si ce test n&eacute;cessite docker-compose up</strong> &mdash; si vous devez
        lancer PostgreSQL, d&eacute;marrer NestJS ou appeler Stripe pour tester une r&egrave;gle
        m&eacute;tier &mdash; c&rsquo;est un signal clair : un adapter a fuit&eacute; dans le
        domaine, ou un port est mal d&eacute;fini.
      </div>
    </section>

    <!-- Section 10 : Correspondances -->
    <section id="correspondances" class="section">
      <div class="section-header">
        <span class="section-number">10</span>
        <h2 class="section-title">Hexagonale, Clean Architecture, Onion &mdash; Les correspondances</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Ces trois architectures partagent le m&ecirc;me ADN : <strong>isoler le domaine
          m&eacute;tier</strong> et <strong>inverser les d&eacute;pendances</strong>. Elles
          diff&egrave;rent par la terminologie et la granularit&eacute; des couches, mais le
          principe fondamental est identique.
        </p>
      </div>

      <!-- Correspondance layers diagram -->
      <div class="layers-diagram">
        <div
          v-for="layer in correspondanceRows"
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
          </div>
        </div>
      </div>

      <div class="info-box">
        <strong>La sp&eacute;cificit&eacute; de l&rsquo;hexagonale</strong> est son vocabulaire
        explicite autour des <em>ports</em> et <em>adapters</em>, et sa distinction claire entre
        <em>driving</em> (qui pilote) et <em>driven</em> (qui est pilot&eacute;). Clean
        Architecture se concentre davantage sur les cercles concentriques et la Dependency Rule.
        Onion Architecture met l&rsquo;accent sur les couches de services autour du Domain Model.
      </div>
    </section>

    <!-- Section 11 : Resume -->
    <section id="resume" class="section">
      <div class="section-header">
        <span class="section-number">11</span>
        <h2 class="section-title">R&eacute;sum&eacute; &mdash; Les r&egrave;gles en une page</h2>
        <div class="section-line" />
      </div>

      <div class="rule-banner">
        <strong>1. Les d&eacute;pendances pointent vers le centre.</strong> L&rsquo;infrastructure d&eacute;pend du domaine. Jamais l&rsquo;inverse.<br><br>
        <strong>2. Le domaine d&eacute;finit les ports.</strong> Les interfaces appartiennent au domaine, pas &agrave; l&rsquo;infrastructure.<br><br>
        <strong>3. Les adapters impl&eacute;mentent les ports.</strong> Chaque adapter est rempla&ccedil;able sans toucher au domaine.<br><br>
        <strong>4. Driving &ne; Driven.</strong> Les adapters pilotants (gauche) d&eacute;clenchent les Use Cases. Les adapt&eacute;s (droite) sont appel&eacute;s par eux.<br><br>
        <strong>5. Le test est la preuve.</strong> Si votre UseCase fonctionne avec des fakes en m&eacute;moire, sans infrastructure, l&rsquo;hexagone est propre.
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

/* Hexagonal diagram */
.hex-diagram {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 48px auto;
  height: 440px;
}

.hex-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 180px; height: 180px;
  background: rgba(74,232,176,0.12);
  border: 2px solid rgba(74,232,176,0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 3;
}

.hex-center .hc-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent2);
  margin-bottom: 4px;
}

.hex-center .hc-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.1rem;
  color: var(--white);
  line-height: 1.2;
}

.hex-port-ring {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 260px; height: 260px;
  border: 2px dashed rgba(232,74,122,0.3);
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
}

.hex-arrows {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.hex-adapter {
  position: absolute;
  width: 140px;
  padding: 10px 14px;
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  line-height: 1.5;
  letter-spacing: 0.03em;
  z-index: 4;
  border: 1px solid;
}

.hex-adapter .adp-type {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 2px;
}

.hex-adapter.driving {
  background: rgba(232,122,74,0.1);
  border-color: rgba(232,122,74,0.4);
  color: var(--orange);
}

.hex-adapter.driven {
  background: rgba(74,232,176,0.08);
  border-color: rgba(74,158,232,0.4);
  color: var(--blue);
}

.hex-side-label {
  position: absolute;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 3px;
}

.hex-side-label.driving-lbl {
  left: 16px; bottom: 24px;
  color: var(--orange);
  background: rgba(232,122,74,0.08);
  border: 1px solid rgba(232,122,74,0.2);
}

.hex-side-label.driven-lbl {
  right: 16px; bottom: 24px;
  color: var(--blue);
  background: rgba(74,158,232,0.08);
  border: 1px solid rgba(74,158,232,0.2);
}

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
.code-block :deep(.dec) { color: #e87a4a; }

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

.lf-green  { color: #4ae8b0; border-color: rgba(74,232,176,0.25); background: rgba(74,232,176,0.06); }
.lf-purple { color: #a78bfa; border-color: rgba(167,139,250,0.25); background: rgba(167,139,250,0.06); }
.lf-blue   { color: #4a9ee8; border-color: rgba(74,158,232,0.25); background: rgba(74,158,232,0.06); }
.lf-orange { color: #e87a4a; border-color: rgba(232,122,74,0.25); background: rgba(232,122,74,0.06); }
.lf-interface { color: #e84a7a; border-color: rgba(232,74,122,0.25); background: rgba(232,74,122,0.06); }
.lf-iface  { color: #e84a7a; border-color: rgba(232,74,122,0.25); background: rgba(232,74,122,0.06); }
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

.dep-node small {
  font-weight: 400;
  font-size: 0.65rem;
  opacity: 0.7;
  display: block;
  margin-top: 2px;
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

/* File tree */
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
  white-space: pre;
  overflow-x: auto;
}

.file-tree :deep(.ft-dir)    { color: var(--accent); }
.file-tree :deep(.ft-file)   { color: var(--text); }
.file-tree :deep(.ft-green)  { color: #4ae8b0; }
.file-tree :deep(.ft-purple) { color: #a78bfa; }
.file-tree :deep(.ft-blue)   { color: #4a9ee8; }
.file-tree :deep(.ft-orange) { color: #e87a4a; }
.file-tree :deep(.ft-gray)   { color: var(--muted); }
.file-tree :deep(.ft-iface)  { color: #e84a7a; }
.file-tree :deep(.ft-yellow) { color: #e8c84a; }

/* Swap diagram */
.swap-diagram { margin: 36px 0; }

.swap-interface { display: flex; justify-content: center; margin-bottom: 20px; }

.swap-interface-box {
  background: rgba(232,74,122,0.08);
  border: 2px solid rgba(232,74,122,0.35);
  border-radius: 6px;
  padding: 12px 28px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--red);
  text-align: center;
}

.swap-interface-box .sib-label {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.7;
  display: block;
  margin-bottom: 3px;
}

.swap-connectors {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  position: relative;
}

.swap-connectors::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 20px;
  background: var(--border);
}

.swap-impl {
  margin-top: 20px;
  padding: 14px 18px;
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  border: 1px solid;
  text-align: center;
  min-width: 160px;
}

.swap-impl .si-ctx {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.65;
  display: block;
  margin-bottom: 3px;
}

.si-prod { background: rgba(74,232,176,0.08); border-color: rgba(74,232,176,0.3); color: var(--green); }
.si-test { background: rgba(232,200,74,0.08); border-color: rgba(232,200,74,0.3); color: var(--accent); }
.si-alt  { background: rgba(74,158,232,0.08); border-color: rgba(74,158,232,0.3); color: var(--blue); }
.si-leg  { background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.3); color: var(--purple); }

/* Decision table */
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

.badge-ok   { background: rgba(74,232,176,0.12); color: var(--green); border: 1px solid rgba(74,232,176,0.3); }
.badge-warn { background: rgba(232,200,74,0.12); color: var(--accent); border: 1px solid rgba(232,200,74,0.3); }
.badge-bad  { background: rgba(232,74,122,0.12); color: var(--red); border: 1px solid rgba(232,74,122,0.3); }

/* Inline code */
.section :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
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
  .decision-table { font-size: 0.78rem; }
  .decision-table td, .decision-table th { padding: 10px 10px; }
}
</style>
