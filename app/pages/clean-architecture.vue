<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (circle cards, comparison items, legend items,
 *          diagnostic cards) are modeled as typed arrays and rendered via v-for,
 *          while unique prose, code blocks, and diagrams stay as direct template markup.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface CircleCard {
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

interface LegendItem {
  color: string
  label: string
}

const circleCards: CircleCard[] = [
  {
    icon: '\u{1F7E2}',
    colorClass: 'green',
    name: 'Cercle 01 \u2014 entities/',
    title: 'Entities',
    description:
      "Le noyau inviolable. Encapsule les r\u00e8gles m\u00e9tier d\u2019entreprise. Ces objets existent ind\u00e9pendamment de toute application, framework ou base de donn\u00e9es. Ce sont les plus stables.",
    tags: ['Zero import', 'R\u00e8gles m\u00e9tier', 'Jamais chang\u00e9'],
    quote: '\u00ab Si votre Entity a un import TypeORM, ce n\u2019est plus une Entity. \u00bb',
  },
  {
    icon: '\u{1F7E3}',
    colorClass: 'purple',
    name: 'Cercle 02 \u2014 usecases/',
    title: 'Use Cases',
    description:
      "Orchestrent le flux de donn\u00e9es vers et depuis les Entities pour r\u00e9aliser les objectifs de l\u2019application. Contiennent aussi les ports \u2014 interfaces que les adapters devront impl\u00e9menter.",
    tags: ['Interactors', 'Ports (interfaces)', 'Orchestration'],
  },
  {
    icon: '\u{1F535}',
    colorClass: 'blue',
    name: 'Cercle 03 \u2014 adapters/',
    title: 'Interface Adapters',
    description:
      'Traducteurs de format. Convertissent les donn\u00e9es du format Use Case/Entity vers le monde ext\u00e9rieur (et vice versa). Controllers, Presenters, Gateways, Repositories concrets.',
    tags: ['Controllers', 'Presenters', 'Gateways'],
  },
  {
    icon: '\u{1F7E0}',
    colorClass: 'orange',
    name: 'Cercle 04 \u2014 frameworks/',
    title: 'Frameworks & Drivers',
    description:
      "Express, NestJS, React, MySQL, Redis, Stripe SDK\u2026 Ce sont des d\u00e9tails. Uncle Bob\u00a0: \"Don\u2019t think too much about them.\" Ils peuvent tous \u00eatre remplac\u00e9s sans toucher au domaine.",
    tags: ['NestJS', 'TypeORM', 'PostgreSQL', 'Rempla\u00e7ables'],
    quote: '\u00ab The web is a detail. The database is a detail. \u00bb',
  },
]

const comparisonWithout: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Sans Clean Architecture',
  dotColor: '#e84a7a',
  items: [
    { text: 'Le UseCase importe directement <code>MySQLRepo</code>' },
    { text: 'Changer de DB = modifier le UseCase' },
    { text: 'Impossible de tester sans lancer une DB' },
    { text: 'Le domaine m\u00e9tier conna\u00eet Stripe, TypeORM\u2026' },
  ],
}

const comparisonWith: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Avec Clean Architecture',
  dotColor: '#4ae8b0',
  items: [
    { text: 'Le UseCase d\u00e9pend uniquement d\u2019une <code>interface</code>' },
    { text: 'Swap MySQL \u2192 MongoDB : 1 seul fichier modifi\u00e9' },
    { text: 'Tests avec un <code>MockRepo</code> sans infrastructure' },
    { text: 'Le domaine m\u00e9tier ne conna\u00eet rien de l\u2019ext\u00e9rieur' },
  ],
}

const entityComparisonBad: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u274C Entity TypeORM \u2014 mod\u00e8le de persistance',
  dotColor: '#e84a7a',
  items: [
    { text: 'Imports depuis TypeORM/NestJS en t\u00eate de fichier' },
    { text: 'D\u00e9corateurs <code>@Entity</code> <code>@Column</code> partout' },
    { text: 'Sac de donn\u00e9es \u2014 aucune m\u00e9thode m\u00e9tier' },
    { text: 'Le sch\u00e9ma DB dicte la structure objet' },
    { text: 'Impossible de tester sans d\u00e9marrer une DB' },
  ],
}

const entityComparisonGood: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Entity Uncle Bob \u2014 domaine pur',
  dotColor: '#4ae8b0',
  items: [
    { text: 'Zero import \u2014 TypeScript pur' },
    { text: 'Propri\u00e9t\u00e9s priv\u00e9es, encapsulation r\u00e9elle' },
    { text: 'M\u00e9thodes m\u00e9tier : <code>payer()</code> <code>annuler()</code> <code>valider()</code>' },
    { text: 'Structure dict\u00e9e par le m\u00e9tier, pas la DB' },
    { text: '<code>new Commande()</code> suffit pour tester' },
  ],
}

const diagnosticCards: DiagnosticCard[] = [
  {
    icon: '\u{1F9EA}',
    colorClass: 'green',
    name: 'Test des Entities',
    title: 'Tester sans infrastructure',
    description:
      'Peut-on \u00e9crire <code>new Commande([item])</code> et tester une r\u00e8gle m\u00e9tier sans DB, sans NestJS, sans HTTP ? Si oui, les Entities sont propres.',
    tags: ['Jest pur', 'Zero infra'],
  },
  {
    icon: '\u{1F504}',
    colorClass: 'purple',
    name: 'Test du Swap DB',
    title: 'Remplacer la base de donn\u00e9es',
    description:
      "Si on remplace MySQL par MongoDB, combien de fichiers sont modifi\u00e9s ? En Clean Architecture : exactement <strong>1</strong> \u2014 le Gateway. Rien d\u2019autre.",
    tags: ['1 seul fichier', 'Domain intact'],
  },
  {
    icon: '\u{1F310}',
    colorClass: 'blue',
    name: 'Test du Swap Framework',
    title: 'Remplacer Express par NestJS',
    description:
      "Si on change de framework HTTP, le domaine m\u00e9tier est-il touch\u00e9 ? Non. Seuls les Controllers et <code>app.ts</code> changent. Use Cases et Entities restent intacts.",
    tags: ['Framework agnostique', 'Domaine stable'],
  },
]

const layerRows: LayerRow[] = [
  {
    color: '#e87a4a',
    num: '04 \u2014 frameworks/',
    title: 'Frameworks & Drivers',
    files: [
      { label: 'express/app.ts', colorClass: 'lf-orange' },
      { label: 'database/postgres.ts', colorClass: 'lf-orange' },
      { label: 'config/container.ts', colorClass: 'lf-orange' },
      { label: 'NestJS \u00b7 TypeORM \u00b7 Stripe SDK', colorClass: 'lf-orange' },
    ],
  },
  {
    color: '#4a9ee8',
    num: '03 \u2014 adapters/',
    title: 'Interface Adapters',
    files: [
      { label: 'CommandeController.ts', colorClass: 'lf-blue' },
      { label: 'CommandePresenter.ts', colorClass: 'lf-blue' },
      { label: 'PostgresCommandeRepo.ts', colorClass: 'lf-blue' },
      { label: 'StripeService.ts', colorClass: 'lf-blue' },
    ],
  },
  {
    color: '#a78bfa',
    num: '02 \u2014 usecases/',
    title: 'Use Cases & Ports',
    files: [
      { label: 'PasserCommandeUseCase.ts', colorClass: 'lf-purple' },
      { label: 'ports/CommandeRepository.ts', colorClass: 'lf-interface' },
      { label: 'ports/PaiementService.ts', colorClass: 'lf-interface' },
      { label: 'ports/NotificationService.ts', colorClass: 'lf-interface' },
    ],
  },
  {
    color: '#4ae8b0',
    num: '01 \u2014 entities/',
    title: 'Entities \u2014 domaine pur',
    files: [
      { label: 'Commande.ts', colorClass: 'lf-green' },
      { label: 'Produit.ts', colorClass: 'lf-green' },
      { label: 'Client.ts', colorClass: 'lf-green' },
      { label: 'StatutCommande (VO)', colorClass: 'lf-green' },
    ],
  },
]

const legendItems: LegendItem[] = [
  { color: '#4ae8b0', label: 'Entities (domaine pur)' },
  { color: '#a78bfa', label: 'Use Cases & Ports' },
  { color: '#4a9ee8', label: 'Interface Adapters' },
  { color: '#e87a4a', label: 'Frameworks & Drivers' },
  { color: '#e84a7a', label: 'Ports / Interfaces' },
  { color: '#e8c84a', label: 'R\u00e8gle / Principe' },
]

const codeEntity = `<span class="cm">// Zero import. Domaine pur.</span>
<span class="kw">export class</span> <span class="ty">Commande</span> {
  <span class="kw">private</span> statut: <span class="ty">StatutCommande</span>;
  <span class="kw">private</span> items: <span class="ty">Item</span>[];

  <span class="fn">constructor</span>(items: <span class="ty">Item</span>[]) {
    <span class="kw">if</span> (items.length === <span class="str">0</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Une commande doit avoir des items'</span>);
    <span class="kw">this</span>.items = items;
    <span class="kw">this</span>.statut = <span class="str">'pending'</span>;
  }

  <span class="fn">payer</span>(montant: <span class="ty">number</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.statut !== <span class="str">'pending'</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Commande d\u00e9j\u00e0 trait\u00e9e'</span>);
    <span class="kw">if</span> (montant &lt;= <span class="str">0</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Montant invalide'</span>);
    <span class="kw">this</span>.statut = <span class="str">'paid'</span>;
  }

  <span class="fn">annuler</span>(): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.statut === <span class="str">'paid'</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Impossible d\\'annuler une commande pay\u00e9e'</span>);
    <span class="kw">this</span>.statut = <span class="str">'cancelled'</span>;
  }
}`

const codeUseCase = `<span class="cm">// Le UseCase ne conna\u00eet QUE des interfaces (ports)</span>
<span class="kw">export class</span> <span class="ty">PasserCommandeUseCase</span> {
  <span class="fn">constructor</span>(
    <span class="kw">private</span> repo: <span class="ty">CommandeRepository</span>,     <span class="cm">// \u2190 interface, pas MySQL</span>
    <span class="kw">private</span> paiement: <span class="ty">PaiementService</span>,     <span class="cm">// \u2190 interface, pas Stripe</span>
    <span class="kw">private</span> notif: <span class="ty">NotificationService</span>     <span class="cm">// \u2190 interface, pas SMTP</span>
  ) {}

  <span class="kw">async</span> <span class="fn">executer</span>(cmd: <span class="ty">PasserCommandeCmd</span>): <span class="ty">Promise&lt;void&gt;</span> {
    <span class="kw">const</span> client = <span class="kw">await this</span>.repo.<span class="fn">findClientById</span>(cmd.clientId);
    client.<span class="fn">peuxCommander</span>();               <span class="cm">// r\u00e8gle Entity</span>

    <span class="kw">const</span> commande = <span class="kw">new</span> <span class="ty">Commande</span>(cmd.items);  <span class="cm">// Entity</span>
    <span class="kw">await this</span>.repo.<span class="fn">save</span>(commande);

    <span class="kw">await this</span>.paiement.<span class="fn">debiter</span>(commande.total(), client);
    commande.<span class="fn">payer</span>(commande.total());

    <span class="kw">await this</span>.notif.<span class="fn">envoyer</span>(client.email, <span class="str">'Commande confirm\u00e9e'</span>);
    <span class="kw">await this</span>.repo.<span class="fn">save</span>(commande);
  }
}`

const codePort = `<span class="cm">// D\u00e9fini PAR le UseCase. Stripe et MySQL ne d\u00e9cident pas de cette interface.</span>
<span class="kw">export interface</span> <span class="ty">CommandeRepository</span> {
  <span class="fn">save</span>(commande: <span class="ty">Commande</span>): <span class="ty">Promise&lt;void&gt;</span>;
  <span class="fn">findById</span>(id: <span class="ty">string</span>): <span class="ty">Promise&lt;Commande&gt;</span>;
  <span class="fn">findClientById</span>(id: <span class="ty">string</span>): <span class="ty">Promise&lt;Client&gt;</span>;
}`

const codeGateway = `<span class="cm">// Impl\u00e9mente l'interface du UseCase. C'est la SEULE couche qui conna\u00eet TypeORM.</span>
<span class="kw">export class</span> <span class="ty">PostgresCommandeRepo</span> <span class="kw">implements</span> <span class="ty">CommandeRepository</span> {
  <span class="kw">async</span> <span class="fn">save</span>(commande: <span class="ty">Commande</span>): <span class="ty">Promise&lt;void&gt;</span> {
    <span class="kw">const</span> row = <span class="kw">this</span>.<span class="fn">toORM</span>(commande);  <span class="cm">// Entity \u2192 mod\u00e8le ORM</span>
    <span class="kw">await this</span>.typeormRepo.<span class="fn">save</span>(row);
  }

  <span class="kw">async</span> <span class="fn">findById</span>(id: <span class="ty">string</span>): <span class="ty">Promise&lt;Commande&gt;</span> {
    <span class="kw">const</span> row = <span class="kw">await this</span>.typeormRepo.<span class="fn">findOneBy</span>({ id });
    <span class="kw">return this</span>.<span class="fn">toDomain</span>(row);          <span class="cm">// ligne SQL \u2192 Entity</span>
  }

  <span class="kw">private</span> <span class="fn">toORM</span>(c: <span class="ty">Commande</span>): <span class="ty">CommandeORM</span> { <span class="cm">/* mapping... */</span> }
  <span class="kw">private</span> <span class="fn">toDomain</span>(row: <span class="ty">CommandeORM</span>): <span class="ty">Commande</span> { <span class="cm">/* mapping... */</span> }
}`

const codeContainer = `<span class="cm">// Le seul fichier qui sait tout. Relie les interfaces \u00e0 leurs impl\u00e9mentations.</span>
<span class="cm">// C'est le chef d'orchestre du Dependency Injection.</span>
container.<span class="fn">bind</span>(<span class="ty">CommandeRepository</span>).<span class="fn">to</span>(<span class="ty">PostgresCommandeRepo</span>);
container.<span class="fn">bind</span>(<span class="ty">PaiementService</span>).<span class="fn">to</span>(<span class="ty">StripeService</span>);
container.<span class="fn">bind</span>(<span class="ty">NotificationService</span>).<span class="fn">to</span>(<span class="ty">EmailService</span>);

<span class="cm">// Pour les tests, on swap sans toucher au UseCase :</span>
<span class="cm">// container.bind(CommandeRepository).to(InMemoryCommandeRepo);</span>
<span class="cm">// container.bind(PaiementService).to(MockPaiementService);</span>`

const codeTest = `<span class="cm">// Ce test ne n\u00e9cessite aucune DB, aucun NestJS, aucune connexion r\u00e9seau.</span>
<span class="cm">// Si ce test marche \u2192 votre architecture est propre.</span>
<span class="kw">import</span> { <span class="ty">PasserCommandeUseCase</span> } <span class="kw">from</span> <span class="str">'./usecases/PasserCommandeUseCase'</span>;
<span class="kw">import</span> { <span class="ty">InMemoryCommandeRepo</span> } <span class="kw">from</span> <span class="str">'./test/InMemoryCommandeRepo'</span>;
<span class="kw">import</span> { <span class="ty">MockPaiementService</span> } <span class="kw">from</span> <span class="str">'./test/MockPaiementService'</span>;

<span class="fn">it</span>(<span class="str">'passe une commande avec succ\u00e8s'</span>, <span class="kw">async</span> () =&gt; {
  <span class="kw">const</span> repo    = <span class="kw">new</span> <span class="ty">InMemoryCommandeRepo</span>();   <span class="cm">// implements CommandeRepository</span>
  <span class="kw">const</span> stripe  = <span class="kw">new</span> <span class="ty">MockPaiementService</span>();    <span class="cm">// implements PaiementService</span>
  <span class="kw">const</span> useCase = <span class="kw">new</span> <span class="ty">PasserCommandeUseCase</span>(repo, stripe, mockNotif);

  <span class="kw">await</span> useCase.<span class="fn">executer</span>({ clientId: <span class="str">'c1'</span>, items: [item1] });

  <span class="fn">expect</span>(repo.commandes).toHaveLength(<span class="str">1</span>);
  <span class="fn">expect</span>(stripe.appels).toHaveLength(<span class="str">1</span>);
});`

const fileTreeHtml = `<span class="ft-gray">src/</span>
<span class="ft-green">\u251C\u2500\u2500 entities/</span>                    <span class="ft-gray">\u2190 Cercle 01 \u2014 noyau pur, zero import</span>
<span class="ft-green">\u2502   \u251C\u2500\u2500 Commande.ts</span>              <span class="ft-gray">// payer() annuler() \u2014 r\u00e8gles m\u00e9tier</span>
<span class="ft-green">\u2502   \u251C\u2500\u2500 Produit.ts</span>               <span class="ft-gray">// prixHT() tva() stockDisponible()</span>
<span class="ft-green">\u2502   \u2514\u2500\u2500 Client.ts</span>                <span class="ft-gray">// peuxCommander() adresseValide()</span>
\u2502
<span class="ft-purple">\u251C\u2500\u2500 usecases/</span>                    <span class="ft-gray">\u2190 Cercle 02 \u2014 orchestration</span>
<span class="ft-purple">\u2502   \u251C\u2500\u2500 PasserCommandeUseCase.ts</span> <span class="ft-gray">// executer(cmd) \u2014 s\u00e9quence applicative</span>
<span class="ft-purple">\u2502   \u2514\u2500\u2500 ports/</span>                   <span class="ft-gray">\u2190 interfaces POSS\u00c9D\u00c9ES par le UseCase</span>
<span class="ft-iface">\u2502       \u251C\u2500\u2500 CommandeRepository.ts</span>  <span class="ft-gray">// &lt;&lt;interface&gt;&gt; save() findById()</span>
<span class="ft-iface">\u2502       \u251C\u2500\u2500 PaiementService.ts</span>     <span class="ft-gray">// &lt;&lt;interface&gt;&gt; debiter() rembourser()</span>
<span class="ft-iface">\u2502       \u2514\u2500\u2500 NotificationService.ts</span> <span class="ft-gray">// &lt;&lt;interface&gt;&gt; envoyer(dest, msg)</span>
\u2502
<span class="ft-blue">\u251C\u2500\u2500 adapters/</span>                    <span class="ft-gray">\u2190 Cercle 03 \u2014 traducteurs</span>
<span class="ft-blue">\u2502   \u251C\u2500\u2500 controllers/</span>
<span class="ft-blue">\u2502   \u2502   \u2514\u2500\u2500 CommandeController.ts</span>  <span class="ft-gray">// re\u00e7oit HTTP, appelle UseCase</span>
<span class="ft-blue">\u2502   \u251C\u2500\u2500 presenters/</span>
<span class="ft-blue">\u2502   \u2502   \u2514\u2500\u2500 CommandePresenter.ts</span>   <span class="ft-gray">// formate la r\u00e9ponse JSON/ViewModel</span>
<span class="ft-blue">\u2502   \u2514\u2500\u2500 gateways/</span>
<span class="ft-blue">\u2502       \u251C\u2500\u2500 PostgresCommandeRepo.ts</span> <span class="ft-gray">// implements CommandeRepository</span>
<span class="ft-blue">\u2502       \u2514\u2500\u2500 StripeService.ts</span>        <span class="ft-gray">// implements PaiementService</span>
\u2502
<span class="ft-orange">\u2514\u2500\u2500 frameworks/</span>                  <span class="ft-gray">\u2190 Cercle 04 \u2014 d\u00e9tails techniques</span>
<span class="ft-orange">    \u251C\u2500\u2500 express/</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 app.ts</span>               <span class="ft-gray">// NestFactory.create() ou Express</span>
<span class="ft-orange">    \u251C\u2500\u2500 database/</span>
<span class="ft-orange">    \u2502   \u2514\u2500\u2500 postgres.ts</span>          <span class="ft-gray">// connexion pool, config driver</span>
<span class="ft-orange">    \u2514\u2500\u2500 config/</span>
<span class="ft-orange">        \u2514\u2500\u2500 container.ts</span>         <span class="ft-gray">// IoC \u2014 bind interfaces \u2192 impl\u00e9mentations</span>`

/* ── Sidebar navigation ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'metaphore', label: 'La m\u00e9taphore' },
      { id: 'cercles', label: 'Les 4 cercles' },
    ],
  },
  {
    label: 'Principes',
    links: [
      { id: 'dependency-rule', label: 'Dependency Rule' },
      { id: 'entity', label: 'Entity vs Framework' },
    ],
  },
  {
    label: 'Code & Structure',
    links: [
      { id: 'structure', label: 'Structure src/' },
      { id: 'code', label: 'Exemples de code' },
      { id: 'ports', label: 'Ports & Use Cases' },
    ],
  },
  {
    label: 'R\u00e9f\u00e9rences',
    links: [
      { id: 'diagnostic', label: 'Test ultime' },
    ],
  },
]

useHead({
  title: 'Clean Architecture \u2014 Uncle Bob',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Clean Architecture \u2014 Uncle Bob',
        description:
          'Clean Architecture de Robert C. Martin (Uncle Bob) : principes, cercles concentriques, Dependency Rule, exemples de code TypeScript et structure de projet.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/clean-architecture',
        author: {
          '@type': 'Person',
          name: 'Robert C. Martin',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Clean Architecture de Robert C. Martin (Uncle Bob) : principes, cercles concentriques, Dependency Rule, exemples de code TypeScript et structure de projet.',
  ogTitle: 'Clean Architecture \u2014 Uncle Bob',
  ogDescription:
    'Clean Architecture de Robert C. Martin (Uncle Bob) : principes, cercles concentriques, Dependency Rule, exemples de code TypeScript et structure de projet.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/clean-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Clean Architecture \u2014 Uncle Bob',
  twitterDescription:
    'Clean Architecture de Robert C. Martin (Uncle Bob) : principes, cercles concentriques, Dependency Rule, exemples de code TypeScript et structure de projet.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="Architecture<br>Clean"
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
      <div class="eyebrow">// Clean Architecture &mdash; R&eacute;f&eacute;rence compl&egrave;te</div>
      <h1>La <em>Clean</em><br>Architecture</h1>
      <p class="subtitle">
        Principes, cercles, r&egrave;gles de d&eacute;pendance et exemple concret sur une feature
        e-commerce &mdash; selon Robert C. Martin (Uncle Bob).
      </p>
    </header>

    <!-- Quote box -->
    <div class="quote-box">
      <div class="quote-icon">&#x1F4D6;</div>
      <div class="quote-content">
        <h3>La loi fondamentale &mdash; Robert C. Martin</h3>
        <p>
          &laquo;&nbsp;Le but d&rsquo;une bonne architecture est de minimiser les ressources humaines
          n&eacute;cessaires pour construire et maintenir un syst&egrave;me.&nbsp;&raquo; Une
          architecture n&rsquo;est pas une technologie &mdash; c&rsquo;est une
          <em>d&eacute;cision sur ce qui peut changer facilement</em> et ce qui doit rester stable.
          Elle s&eacute;pare la <em>politique</em> (les r&egrave;gles m&eacute;tier) des
          <em>d&eacute;tails</em> (les frameworks, les bases de donn&eacute;es, le r&eacute;seau).
        </p>
      </div>
    </div>

    <!-- Section 01 : La metaphore -->
    <section id="metaphore" class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La m&eacute;taphore : l&rsquo;ambassade diplomatique</h2>
        <div class="section-line" />
      </div>
      <div class="prose">
        <p>
          Imagine une <strong>ambassade fran&ccedil;aise &agrave; Tokyo</strong>. &Agrave;
          l&rsquo;int&eacute;rieur, les lois fran&ccedil;aises s&rsquo;appliquent &mdash; c&rsquo;est
          le <em>domaine</em>. L&rsquo;ambassade ne se transforme pas selon les lois japonaises. Les
          visiteurs (HTTP, base de donn&eacute;es, UI) s&rsquo;adaptent <strong>&agrave; elle</strong>,
          jamais l&rsquo;inverse.
        </p>
        <p>
          C&rsquo;est exactement la Clean Architecture : le domaine m&eacute;tier ne conna&icirc;t pas
          le monde ext&eacute;rieur. Express.js, MySQL, React&hellip; ce sont des <em>d&eacute;tails</em>.
          Ils peuvent tous &ecirc;tre remplac&eacute;s sans toucher &agrave; une ligne de logique
          m&eacute;tier.
        </p>
      </div>
    </section>

    <!-- Section 02 : Les 4 cercles -->
    <section id="cercles" class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Les 4 cercles concentriques</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          La Clean Architecture s&rsquo;organise en <strong>cercles concentriques</strong>. Plus on
          est au centre, plus le code est stable, abstrait et pr&eacute;cieux. Plus on est &agrave;
          l&rsquo;ext&eacute;rieur, plus le code est volatile, concret et rempla&ccedil;able.
        </p>
      </div>

      <!-- Concentric circles CSS diagram -->
      <div class="circles-diagram">
        <div class="circle-layer c-frameworks">
          <span class="layer-label" style="top:4%;">04 &mdash; Frameworks &amp; Drivers</span>
          <span class="layer-sub" style="top:10%;">Express &middot; NestJS &middot; MySQL &middot; React &middot; Stripe SDK</span>
          <div class="circle-layer c-adapters">
            <span class="layer-label" style="top:4%;">03 &mdash; Interface Adapters</span>
            <span class="layer-sub" style="top:11%;">Controllers &middot; Presenters &middot; Gateways</span>
            <div class="circle-layer c-usecases">
              <span class="layer-label" style="top:6%;">02 &mdash; Use Cases</span>
              <span class="layer-sub" style="top:16%;font-size:0.6rem;">Ports &middot; Interactors</span>
              <div class="circle-layer c-entities">
                <span class="layer-label" style="font-size:0.55rem;top:auto;position:relative;padding:4px;">Entities</span>
              </div>
            </div>
          </div>
          <!-- Dependency arrow -->
          <div class="dep-arrow">
            <span class="arr-label">d&eacute;pendances</span>
            <div class="arr-line" />
          </div>
        </div>
      </div>

      <!-- Circle cards -->
      <div class="cards">
        <article
          v-for="card in circleCards"
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
    <section id="dependency-rule" class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">La Dependency Rule &mdash; la loi absolue</h2>
        <div class="section-line" />
      </div>

      <div class="rule-banner">
        <strong>&ldquo;Source code dependencies must point only inward.&rdquo;</strong><br>
        Rien dans un cercle int&eacute;rieur ne peut mentionner quoi que ce soit d&rsquo;un cercle
        ext&eacute;rieur.<br>
        Ni son nom, ni sa fonction, ni son type, ni sa variable.
      </div>

      <!-- Dependency flow diagram -->
      <div class="dep-flow">
        <div class="dep-node" style="color:#e87a4a;border-color:rgba(232,122,74,0.4);background:rgba(232,122,74,0.08);">
          04<br>Frameworks
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#4a9ee8;border-color:rgba(74,158,232,0.4);background:rgba(74,158,232,0.08);">
          03<br>Adapters
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#a78bfa;border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.08);">
          02<br>Use Cases
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#4ae8b0;border-color:rgba(74,232,176,0.4);background:rgba(74,232,176,0.08);">
          01<br>Entities
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
          Cette r&egrave;gle est rendue possible gr&acirc;ce &agrave; l&rsquo;<strong>inversion de
          d&eacute;pendance (DIP)</strong>. Quand un Use Case a besoin d&rsquo;une base de
          donn&eacute;es, il ne l&rsquo;importe pas directement &mdash; il d&eacute;finit une
          <em>interface</em> (un port) que l&rsquo;adapter du cercle 3 viendra impl&eacute;menter. Le
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

    <!-- Section 04 : Entity Uncle Bob vs Entity Framework -->
    <section id="entity" class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">Entity Uncle Bob vs Entity Framework</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          C&rsquo;est la <strong>source de confusion la plus fr&eacute;quente</strong>. Une Entity
          NestJS/TypeORM n&rsquo;est pas une Entity au sens de la Clean Architecture. Uncle Bob ne dit
          pas <em>&ldquo;n&rsquo;utilisez aucun framework&rdquo;</em> &mdash; il dit
          <strong>&ldquo;les Entities ne doivent pas d&eacute;pendre d&rsquo;un framework&rdquo;</strong>.
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

      <div class="info-box">
        <strong>La solution pragmatique : deux mod&egrave;les s&eacute;par&eacute;s.</strong> En
        pratique, on cr&eacute;e une <strong>Entity domaine pure</strong>
        (<code>entities/Commande.ts</code>) et un <strong>mod&egrave;le ORM</strong> s&eacute;par&eacute;
        (<code>adapters/gateways/CommandeORM.ts</code>). Le Gateway traduit entre les deux. C&rsquo;est
        le seul endroit o&ugrave; TypeORM existe.
      </div>

      <!-- Code block: Entity -->
      <div class="code-filename">entities/Commande.ts &mdash; Cercle 01 &#x2713;</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeEntity" />
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
          Voici comment les 4 cercles se traduisent en une structure de fichiers concr&egrave;te pour
          une feature e-commerce, en suivant exactement la Clean Architecture d&rsquo;Uncle Bob.
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

    <!-- Section 06 : Exemples de code -->
    <section id="code" class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Exemples de code &mdash; couche par couche</h2>
        <div class="section-line" />
      </div>

      <!-- UseCase -->
      <div class="code-filename">usecases/PasserCommandeUseCase.ts &mdash; Cercle 02</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeUseCase" />

      <!-- Port interface -->
      <div class="code-filename">usecases/ports/CommandeRepository.ts &mdash; Interface (port)</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codePort" />

      <!-- Gateway -->
      <div class="code-filename">adapters/gateways/PostgresCommandeRepo.ts &mdash; Cercle 03</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeGateway" />

      <!-- Container DI -->
      <div class="code-filename">frameworks/config/container.ts &mdash; Cercle 04</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeContainer" />
    </section>

    <!-- Section 07 : Pourquoi ports/ dans usecases/ ? -->
    <section id="ports" class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">Pourquoi ports/ vit dans usecases/ ?</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          C&rsquo;est une question l&eacute;gitime. Intuitivement, on pourrait penser que les
          interfaces appartiennent aux adapters qui les impl&eacute;mentent. C&rsquo;est
          <strong>l&rsquo;inverse</strong>.
        </p>
      </div>

      <div class="quote-box">
        <div class="quote-icon">&#x1F50C;</div>
        <div class="quote-content">
          <h3>La m&eacute;taphore de la prise &eacute;lectrique</h3>
          <p>
            La norme de prise &eacute;lectrique est d&eacute;finie par <em>les appareils qui en ont
            besoin</em>, pas par les fabricants de c&acirc;bles. De m&ecirc;me,
            <code>CommandeRepository</code> est d&eacute;fini par le UseCase qui a besoin de persister
            des commandes &mdash; pas par PostgreSQL qui viendra se brancher dessus.
          </p>
          <p>
            Stripe <em>d&eacute;pend du port</em> <code>PaiementService</code>. Jamais
            l&rsquo;inverse. Si Stripe dispara&icirc;t, le UseCase ne change pas d&rsquo;une virgule.
          </p>
        </div>
      </div>

      <div class="rule-banner">
        <strong>Principe DIP (Dependency Inversion Principle) :</strong><br>
        &ldquo;Depend on abstractions, not on concretions.&rdquo;<br>
        Les modules de haut niveau (UseCases) ne d&eacute;pendent pas des modules de bas niveau
        (Stripe, MySQL).<br>
        Les deux d&eacute;pendent d&rsquo;<strong>abstractions</strong> (interfaces/ports).
      </div>
    </section>

    <!-- Section 08 : Le test ultime -->
    <section id="diagnostic" class="section">
      <div class="section-header">
        <span class="section-number">08</span>
        <h2 class="section-title">Le test ultime d&rsquo;une Clean Architecture r&eacute;ussie</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Uncle Bob propose <strong>trois questions diagnostiques</strong> pour &eacute;valuer la
          propret&eacute; d&rsquo;une architecture.
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
        <strong>Si ce test &eacute;choue sans infrastructure</strong> &mdash; si vous devez lancer une
        DB, d&eacute;marrer NestJS ou appeler Stripe pour tester une r&egrave;gle m&eacute;tier
        &mdash; c&rsquo;est un signal clair : la Dependency Rule est viol&eacute;e quelque part.
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

/* Concentric circles diagram */
.circles-diagram {
  position: relative;
  width: 100%;
  max-width: 680px;
  margin: 40px auto;
  aspect-ratio: 1;
}

.circle-layer {
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 2px solid;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.circle-layer .layer-label {
  position: absolute;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  pointer-events: none;
}

.circle-layer .layer-sub {
  position: absolute;
  font-size: 0.7rem;
  color: var(--muted);
  font-family: 'DM Sans', sans-serif;
  pointer-events: none;
}

.c-frameworks {
  width: 100%; height: 100%;
  border-color: rgba(232,122,74,0.5);
  background: rgba(232,122,74,0.06);
}
.c-adapters {
  width: 72%; height: 72%;
  border-color: rgba(74,158,232,0.5);
  background: rgba(74,158,232,0.07);
}
.c-usecases {
  width: 46%; height: 46%;
  border-color: rgba(167,139,250,0.5);
  background: rgba(167,139,250,0.08);
}
.c-entities {
  width: 22%; height: 22%;
  border-color: rgba(74,232,176,0.6);
  background: rgba(74,232,176,0.1);
}

.c-frameworks .layer-label { top: 6%; color: var(--orange); }
.c-frameworks .layer-sub   { top: 12%; }
.c-adapters   .layer-label { top: 5%; color: var(--blue); }
.c-adapters   .layer-sub   { top: 12%; }
.c-usecases   .layer-label { top: 4%; color: var(--purple); font-size:0.65rem; }
.c-usecases   .layer-sub   { top: 14%; font-size:0.6rem; }
.c-entities   .layer-label { color: var(--green); font-size: 0.6rem; top: 15%; }

/* Dependency arrow (vertical, on circles diagram) */
.dep-arrow {
  position: absolute;
  right: 2%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.dep-arrow .arr-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--accent2);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

.dep-arrow .arr-line {
  width: 2px;
  height: 120px;
  background: linear-gradient(to bottom, transparent, var(--accent2));
  position: relative;
}

.dep-arrow .arr-line::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid var(--accent2);
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
  .circles-diagram { max-width: 340px; }
}
</style>
