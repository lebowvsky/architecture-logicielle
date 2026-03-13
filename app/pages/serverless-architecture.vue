<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (principle cards, pattern cards, lifecycle phases,
 *          comparison columns, decision table rows, diagram zones, dependency flow nodes)
 *          are modeled as typed arrays and rendered via v-for, while unique prose,
 *          code blocks, and the file tree stay as direct template markup with v-html.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface MetaphorRow {
  mode: string
  analogy: string
  equivalent: string
  badge: string
  badgeClass: string
}

interface SdNode {
  label: string
  colorClass: string
}

interface SdZone {
  header: string
  headerColor: string
  nodes: SdNode[]
}

interface DepNode {
  label: string
  sublabel: string
  color: string
  borderColor: string
  bgColor: string
}

interface PrincipleCard {
  icon: string
  colorClass: string
  name: string
  title: string
  desc: string
  tags: string[]
  quote?: string
}

interface LifecyclePhase {
  styleClass: string
  label: string
  name: string
  desc: string
}

interface CmpItem {
  text: string
}

interface CmpColumn {
  headerClass: string
  headerLabel: string
  dotColor: string
  items: CmpItem[]
}

interface DecisionRow {
  aspect: string
  detail: string
  badge: string
  badgeClass: string
}

interface LegendItem {
  color: string
  label: string
}

/* ── Sidebar ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'metaphore', label: "La m\u00e9taphore de l'h\u00f4tel" },
      { id: 'overview', label: "Vue d'ensemble" },
    ],
  },
  {
    label: 'Fondamentaux',
    links: [
      { id: 'principes', label: 'Principes fondamentaux' },
      { id: 'coldstart', label: 'Cold Start & Warm' },
    ],
  },
  {
    label: 'Code & Architecture',
    links: [
      { id: 'clean', label: 'Clean Architecture' },
      { id: 'functional', label: 'Railway Oriented' },
    ],
  },
  {
    label: 'Patterns & D\u00e9cision',
    links: [
      { id: 'patterns', label: 'Patterns avanc\u00e9s' },
      { id: 'decision', label: 'Forces & limites' },
    ],
  },
]

/* ── Section 01 — Metaphor table ── */

const metaphorTable: MetaphorRow[] = [
  { mode: 'On-Premise', analogy: 'Vous achetez une maison', equivalent: 'Vous g\u00e9rez vos serveurs physiques', badge: 'Contr\u00f4le total', badgeClass: 'badge-warn' },
  { mode: 'IaaS / VM', analogy: 'Vous louez un appartement', equivalent: 'VM cloud : EC2, GCP Compute Engine', badge: 'Bail \u00e0 dur\u00e9e fixe', badgeClass: 'badge-warn' },
  { mode: 'Serverless / FaaS', analogy: "Chambre d'h\u00f4tel \u00e0 la nuit", equivalent: 'AWS Lambda, Cloudflare Workers, Vercel Fn', badge: 'Pay-per-use', badgeClass: 'badge-ok' },
]

/* ── Section 02 — Serverless diagram ── */

const sdZones: SdZone[] = [
  {
    header: 'Clients / Sources',
    headerColor: 'var(--blue)',
    nodes: [
      { label: 'Web Browser', colorClass: 'sdn-blue' },
      { label: 'Mobile App', colorClass: 'sdn-blue' },
      { label: 'IoT Device', colorClass: 'sdn-blue' },
      { label: 'Cron / Scheduler', colorClass: 'sdn-orange' },
      { label: 'Message Queue', colorClass: 'sdn-orange' },
      { label: 'Storage Event', colorClass: 'sdn-orange' },
    ],
  },
  {
    header: 'Gateway / Routing',
    headerColor: 'var(--purple)',
    nodes: [
      { label: 'API Gateway', colorClass: 'sdn-purple' },
      { label: 'Auth / JWT', colorClass: 'sdn-purple' },
      { label: 'Rate Limiter', colorClass: 'sdn-purple' },
      { label: 'Event Router', colorClass: 'sdn-purple' },
      { label: 'Load Balancer', colorClass: 'sdn-purple' },
    ],
  },
  {
    header: 'Functions (FaaS)',
    headerColor: 'var(--accent)',
    nodes: [
      { label: 'fn: createOrder', colorClass: 'sdn-yellow' },
      { label: 'fn: getUser', colorClass: 'sdn-yellow' },
      { label: 'fn: processPayment', colorClass: 'sdn-yellow' },
      { label: 'fn: sendEmail', colorClass: 'sdn-yellow' },
      { label: 'fn: resizeImage', colorClass: 'sdn-yellow' },
      { label: 'fn: dailyReport', colorClass: 'sdn-yellow' },
    ],
  },
  {
    header: 'Services Manag\u00e9s',
    headerColor: 'var(--green)',
    nodes: [
      { label: 'DynamoDB / Firestore', colorClass: 'sdn-green' },
      { label: 'S3 / Blob Storage', colorClass: 'sdn-green' },
      { label: 'Redis / ElastiCache', colorClass: 'sdn-green' },
      { label: 'SQS / Pub-Sub', colorClass: 'sdn-green' },
      { label: 'SES / SendGrid', colorClass: 'sdn-green' },
      { label: 'Cognito / Auth0', colorClass: 'sdn-green' },
    ],
  },
]

const depFlow: DepNode[] = [
  { label: '\u00c9v\u00e9nement', sublabel: 'HTTP / Queue / Cron', color: 'var(--blue)', borderColor: 'rgba(74,158,232,0.3)', bgColor: 'rgba(74,158,232,0.06)' },
  { label: 'Gateway', sublabel: 'Auth + Route', color: 'var(--purple)', borderColor: 'rgba(167,139,250,0.3)', bgColor: 'rgba(167,139,250,0.06)' },
  { label: 'Function', sublabel: 'Stateless \u00b7 \u00c9ph\u00e9m\u00e8re', color: 'var(--accent)', borderColor: 'rgba(232,200,74,0.3)', bgColor: 'rgba(232,200,74,0.06)' },
  { label: 'Services', sublabel: 'DB \u00b7 Cache \u00b7 Queue', color: 'var(--green)', borderColor: 'rgba(74,232,176,0.3)', bgColor: 'rgba(74,232,176,0.06)' },
  { label: 'R\u00e9ponse', sublabel: 'JSON / Event', color: 'var(--blue)', borderColor: 'rgba(74,158,232,0.3)', bgColor: 'rgba(74,158,232,0.06)' },
]

const depArrows = ['trigger', 'invoke', 'appelle', 'r\u00e9pond']

/* ── Section 03 — Principles ── */

const principleCards: PrincipleCard[] = [
  {
    icon: '\u{1F4CF}',
    colorClass: 'yellow',
    name: 'Scale to Zero',
    title: 'Z\u00e9ro instance = z\u00e9ro co\u00fbt',
    desc: "Quand personne n'appelle votre fonction, il n'y a aucune instance active. Le co\u00fbt est strictement nul. C'est l'inverse d'un serveur traditionnel qui tourne 24h/24 m\u00eame sans charge.",
    tags: ['Auto-scaling', '0 \u2192 \u221e'],
  },
  {
    icon: '\u26A1',
    colorClass: 'green',
    name: 'Pay-per-use',
    title: 'Facturation \u00e0 la milliseconde',
    desc: "Vous payez uniquement le temps d'ex\u00e9cution r\u00e9el. AWS Lambda facture par incr\u00e9ments de 1ms. 10 000 invocations d'une fonction qui prend 100ms co\u00fbtent quelques centimes.",
    tags: ['Granularit\u00e9 ms', 'Co\u00fbt variable'],
    quote: "\u00ab Pas d'appel = pas de facture. \u00bb",
  },
  {
    icon: '\u{1F52E}',
    colorClass: 'blue',
    name: 'Stateless',
    title: 'Aucun \u00e9tat entre invocations',
    desc: "Chaque invocation repart de z\u00e9ro. Aucun \u00e9tat local ne persiste entre deux appels. L'\u00e9tat doit \u00eatre d\u00e9port\u00e9 vers des services externes : DynamoDB, Redis, S3. C'est une contrainte qui force un bon design.",
    tags: ['Immutable', 'Pure functions'],
  },
  {
    icon: '\u{1F3AF}',
    colorClass: 'purple',
    name: 'Event-Driven',
    title: 'D\u00e9clenchement par \u00e9v\u00e9nement',
    desc: "Les fonctions ne tournent pas en permanence \u2014 elles r\u00e9agissent. Un \u00e9v\u00e9nement HTTP, un message dans une queue SQS, un upload S3, un timer Cron : chaque source peut d\u00e9clencher une fonction.",
    tags: ['HTTP', 'SQS', 'S3 Events', 'Cron'],
  },
  {
    icon: '\u{1F4E6}',
    colorClass: 'orange',
    name: 'FaaS Unit',
    title: 'La fonction comme unit\u00e9 de d\u00e9ploiement',
    desc: "Contrairement aux microservices (qui d\u00e9ploient un service), FaaS d\u00e9ploie une <strong>fonction individuelle</strong>. Chaque fonction peut avoir son propre runtime, sa m\u00e9moire, son timeout, ses permissions IAM.",
    tags: ['Fine-grained', 'Ind\u00e9pendant'],
  },
  {
    icon: '\u{1F512}',
    colorClass: 'pink',
    name: 'Managed Infrastructure',
    title: 'Zero ops pour le d\u00e9veloppeur',
    desc: "Pas de serveur \u00e0 patcher, pas de load balancer \u00e0 configurer, pas de certificat SSL \u00e0 renouveler. Le fournisseur cloud g\u00e8re la haute disponibilit\u00e9, la s\u00e9curit\u00e9 OS, les mises \u00e0 jour runtime.",
    tags: ['No-ops', 'HA automatique'],
  },
]

/* ── Section 04 — Cold Start ── */

const lifecyclePhases: LifecyclePhase[] = [
  { styleClass: 'lc-cold', label: 'Cold \u2014 \u00e9tape 1', name: 'Invocation', desc: "Un \u00e9v\u00e9nement arrive. Aucun container disponible." },
  { styleClass: 'lc-cold', label: 'Cold \u2014 \u00e9tape 2', name: 'Init Container', desc: "Le cloud provider alloue les ressources (CPU, RAM, r\u00e9seau)." },
  { styleClass: 'lc-cold', label: 'Cold \u2014 \u00e9tape 3', name: 'Download Code', desc: "Le package ZIP ou l'image container est t\u00e9l\u00e9charg\u00e9." },
  { styleClass: 'lc-cold', label: 'Cold \u2014 \u00e9tape 4', name: 'Boot Runtime', desc: "Node.js / Python / JVM d\u00e9marre. Les plus lents : JVM, .NET." },
  { styleClass: 'lc-neutral', label: 'Init module', name: 'Module Init', desc: "Le code hors handler s'ex\u00e9cute (imports, clients DB, DI\u2026)." },
  { styleClass: 'lc-warm', label: 'Execution', name: 'Execute', desc: "Le handler s'ex\u00e9cute. Le container reste chaud \u2248 5-15 min." },
]

const coldStartCmp: CmpColumn = {
  headerClass: 'bad',
  headerLabel: '\u2744\uFE0F Cold Start \u2014 200ms \u00e0 2s',
  dotColor: 'var(--red)',
  items: [
    { text: 'Premi\u00e8re invocation apr\u00e8s d\u00e9ploiement' },
    { text: "Apr\u00e8s \u2248 15 min d'inactivit\u00e9 (container d\u00e9truit)" },
    { text: 'Pic de trafic : scale-out \u2192 nouveaux containers' },
    { text: 'JVM / .NET particuli\u00e8rement p\u00e9nalis\u00e9s' },
    { text: 'Risque UX sur API synchrones critiques' },
  ],
}

const warmCmp: CmpColumn = {
  headerClass: 'good',
  headerLabel: '\u{1F525} Warm \u2014 1ms \u00e0 5ms',
  dotColor: 'var(--green)',
  items: [
    { text: 'Container r\u00e9utilis\u00e9, runtime d\u00e9j\u00e0 d\u00e9marr\u00e9' },
    { text: 'Variables module-level persist\u00e9es (clients DB, cache)' },
    { text: 'Provisioned Concurrency : containers pre-warmed' },
    { text: 'Node.js / Python : cold starts tr\u00e8s courts (<100ms)' },
    { text: 'Trafic r\u00e9gulier \u2192 containers majoritairement chauds' },
  ],
}

/* ── Section 05 — Clean Architecture in Lambda ── */

const fileTreeHtml = `<span class="ft-dir">src/</span><br/>
<span style="color:var(--muted);">\u2502</span><br/>
<span style="color:var(--muted);">\u251C\u2500\u2500 </span><span class="ft-green">domain/</span><span class="ft-gray">                    \u2190 Cercle 1 + 2 : entit\u00e9s + use cases</span><br/>
<span style="color:var(--muted);">\u2502   \u251C\u2500\u2500 </span><span class="ft-green">entities/</span><br/>
<span style="color:var(--muted);">\u2502   \u2502   \u2514\u2500\u2500 </span><span class="ft-green">Order.ts</span><span class="ft-gray">           \u2190 Entit\u00e9 pure, z\u00e9ro import AWS</span><br/>
<span style="color:var(--muted);">\u2502   \u251C\u2500\u2500 </span><span class="ft-green">usecases/</span><br/>
<span style="color:var(--muted);">\u2502   \u2502   \u2514\u2500\u2500 </span><span class="ft-green">CreateOrderUseCase.ts</span><span class="ft-gray"> \u2190 Use case + ports (interfaces)</span><br/>
<span style="color:var(--muted);">\u2502   \u2514\u2500\u2500 </span><span class="ft-iface">ports/</span><br/>
<span style="color:var(--muted);">\u2502       \u251C\u2500\u2500 </span><span class="ft-iface">OrderRepository.ts</span><span class="ft-gray">  \u2190 Interface (jamais impl\u00e9ment\u00e9e ici)</span><br/>
<span style="color:var(--muted);">\u2502       \u2514\u2500\u2500 </span><span class="ft-iface">EventPublisher.ts</span><br/>
<span style="color:var(--muted);">\u2502</span><br/>
<span style="color:var(--muted);">\u251C\u2500\u2500 </span><span class="ft-blue">infrastructure/</span><span class="ft-gray">             \u2190 Cercle 3 : adaptateurs concrets</span><br/>
<span style="color:var(--muted);">\u2502   \u251C\u2500\u2500 </span><span class="ft-blue">DynamoOrderRepository.ts</span><span class="ft-gray"> \u2190 Impl\u00e9mente OrderRepository</span><br/>
<span style="color:var(--muted);">\u2502   \u2514\u2500\u2500 </span><span class="ft-blue">SnsEventPublisher.ts</span><span class="ft-gray">     \u2190 Impl\u00e9mente EventPublisher</span><br/>
<span style="color:var(--muted);">\u2502</span><br/>
<span style="color:var(--muted);">\u2514\u2500\u2500 </span><span class="ft-orange">handlers/</span><span class="ft-gray">                   \u2190 Cercle 4 : handler Lambda (adaptateur AWS)</span><br/>
<span style="color:var(--muted);">    \u2514\u2500\u2500 </span><span class="ft-orange">createOrder.ts</span><span class="ft-gray">          \u2190 Composition Root + traduction HTTP\u2194domaine</span>`

const codeEntity = `<span class="cm">// Entit\u00e9 \u2014 z\u00e9ro d\u00e9pendance externe, z\u00e9ro import AWS / TypeORM</span>
<span class="kw">class</span> <span class="ty">Order</span> {
  <span class="kw">constructor</span>(
    <span class="kw">public readonly</span> id: <span class="ty">string</span>,
    <span class="kw">public readonly</span> userId: <span class="ty">string</span>,
    <span class="kw">public readonly</span> items: <span class="ty">OrderItem</span>[],
    <span class="kw">public readonly</span> status: <span class="ty">OrderStatus</span> = <span class="str">'pending'</span>
  ) {}

  <span class="kw">get</span> <span class="fn">total</span>(): <span class="ty">number</span> {
    <span class="kw">return</span> <span class="kw">this</span>.items.<span class="fn">reduce</span>((sum, item) =&gt; sum + item.price * item.quantity, <span class="str">0</span>);
  }

  <span class="fn">confirm</span>(): <span class="ty">Order</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.items.length === <span class="str">0</span>) {
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Cannot confirm empty order'</span>);
    }
    <span class="cm">// Retourne une nouvelle instance \u2014 immutabilit\u00e9</span>
    <span class="kw">return new</span> <span class="ty">Order</span>(<span class="kw">this</span>.id, <span class="kw">this</span>.userId, <span class="kw">this</span>.items, <span class="str">'confirmed'</span>);
  }
}

<span class="kw">type</span> <span class="ty">OrderStatus</span> = <span class="str">'pending'</span> | <span class="str">'confirmed'</span> | <span class="str">'cancelled'</span>;
<span class="kw">interface</span> <span class="ty">OrderItem</span> { productId: <span class="ty">string</span>; quantity: <span class="ty">number</span>; price: <span class="ty">number</span>; }`

const codePort = `<span class="cm">// Port \u2014 interface d\u00e9finie par le domaine, impl\u00e9ment\u00e9e par l'infrastructure</span>
<span class="kw">interface</span> <span class="ty">OrderRepository</span> {
  <span class="fn">save</span>(order: <span class="ty">Order</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;
  <span class="fn">findById</span>(id: <span class="ty">string</span>): <span class="ty">Promise</span>&lt;<span class="ty">Order</span> | <span class="ty">null</span>&gt;;
}

<span class="kw">interface</span> <span class="ty">EventPublisher</span> {
  <span class="fn">publish</span>(event: <span class="ty">OrderCreatedEvent</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;
}

<span class="kw">interface</span> <span class="ty">OrderCreatedEvent</span> {
  type: <span class="str">'ORDER_CREATED'</span>;
  orderId: <span class="ty">string</span>;
  userId: <span class="ty">string</span>;
  total: <span class="ty">number</span>;
  timestamp: <span class="ty">string</span>;
}`

const codeUseCase = `<span class="cm">// Use Case \u2014 orchestre domaine et ports, sans conna\u00eetre AWS</span>
<span class="kw">class</span> <span class="ty">CreateOrderUseCase</span> {
  <span class="kw">constructor</span>(
    <span class="kw">private readonly</span> repository: <span class="ty">OrderRepository</span>,  <span class="cm">// injection de d\u00e9pendance</span>
    <span class="kw">private readonly</span> publisher: <span class="ty">EventPublisher</span>
  ) {}

  <span class="kw">async</span> <span class="fn">execute</span>(input: <span class="ty">CreateOrderInput</span>): <span class="ty">Promise</span>&lt;<span class="ty">CreateOrderOutput</span>&gt; {
    <span class="cm">// 1. Cr\u00e9er et valider via l'entit\u00e9</span>
    <span class="kw">const</span> order = <span class="kw">new</span> <span class="ty">Order</span>(crypto.<span class="fn">randomUUID</span>(), input.userId, input.items);
    <span class="kw">const</span> confirmed = order.<span class="fn">confirm</span>();

    <span class="cm">// 2. Persister via le port (jamais via DynamoDB directement)</span>
    <span class="kw">await</span> <span class="kw">this</span>.repository.<span class="fn">save</span>(confirmed);

    <span class="cm">// 3. Publier l'\u00e9v\u00e9nement domaine</span>
    <span class="kw">await</span> <span class="kw">this</span>.publisher.<span class="fn">publish</span>({
      type: <span class="str">'ORDER_CREATED'</span>,
      orderId: confirmed.id,
      userId: confirmed.userId,
      total: confirmed.total,
      timestamp: <span class="kw">new</span> <span class="ty">Date</span>().<span class="fn">toISOString</span>()
    });

    <span class="kw">return</span> { orderId: confirmed.id, total: confirmed.total };
  }
}`

const codeAdapter = `<span class="kw">import</span> { <span class="ty">DynamoDB</span> } <span class="kw">from</span> <span class="str">'@aws-sdk/client-dynamodb'</span>;

<span class="kw">class</span> <span class="ty">DynamoOrderRepository</span> <span class="kw">implements</span> <span class="ty">OrderRepository</span> {
  <span class="kw">private</span> client = <span class="kw">new</span> <span class="ty">DynamoDB</span>({});  <span class="cm">// init module-level \u2192 warm reuse</span>

  <span class="kw">async</span> <span class="fn">save</span>(order: <span class="ty">Order</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">await</span> <span class="kw">this</span>.client.<span class="fn">putItem</span>({
      TableName: process.env.<span class="hl">ORDERS_TABLE</span>!,
      Item: {
        PK:     { S: <span class="str">\`ORDER#\${order.id}\`</span> },
        userId: { S: order.userId },
        status: { S: order.status },
        total:  { N: <span class="ty">String</span>(order.total) },
        items:  { S: <span class="ty">JSON</span>.<span class="fn">stringify</span>(order.items) }
      }
    });
  }

  <span class="kw">async</span> <span class="fn">findById</span>(id: <span class="ty">string</span>): <span class="ty">Promise</span>&lt;<span class="ty">Order</span> | <span class="ty">null</span>&gt; {
    <span class="kw">const</span> result = <span class="kw">await</span> <span class="kw">this</span>.client.<span class="fn">getItem</span>({
      TableName: process.env.<span class="hl">ORDERS_TABLE</span>!,
      Key: { PK: { S: <span class="str">\`ORDER#\${id}\`</span> } }
    });
    <span class="kw">if</span> (!result.Item) <span class="kw">return null</span>;
    <span class="kw">return new</span> <span class="ty">Order</span>(
      id, result.Item.userId.S!, <span class="ty">JSON</span>.<span class="fn">parse</span>(result.Item.items.S!),
      result.Item.status.S <span class="kw">as</span> <span class="ty">OrderStatus</span>
    );
  }
}`

const codeHandler = `<span class="kw">import</span> { <span class="ty">APIGatewayProxyHandler</span>, <span class="ty">APIGatewayProxyResult</span> } <span class="kw">from</span> <span class="str">'aws-lambda'</span>;

<span class="cm">// \u2500\u2500\u2500 Composition Root \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// Instanci\u00e9 au niveau MODULE : ex\u00e9cut\u00e9 une seule fois au cold start,
// puis r\u00e9utilis\u00e9 gratuitement par toutes les invocations warm.</span>
<span class="kw">const</span> useCase = <span class="kw">new</span> <span class="ty">CreateOrderUseCase</span>(
  <span class="kw">new</span> <span class="ty">DynamoOrderRepository</span>(),
  <span class="kw">new</span> <span class="ty">SnsEventPublisher</span>()
);

<span class="cm">// \u2500\u2500\u2500 Handler \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// R\u00f4le : traduire APIGatewayProxyEvent \u2192 domaine \u2192 APIGatewayProxyResult
// Aucune logique m\u00e9tier ici \u2014 pure traduction (Uncle Bob : Controller)</span>
<span class="kw">export const</span> <span class="fn">handler</span>: <span class="ty">APIGatewayProxyHandler</span> = <span class="kw">async</span> (event): <span class="ty">Promise</span>&lt;<span class="ty">APIGatewayProxyResult</span>&gt; =&gt; {
  <span class="kw">try</span> {
    <span class="kw">const</span> body = <span class="ty">JSON</span>.<span class="fn">parse</span>(event.body ?? <span class="str">'{}'</span>);

    <span class="kw">const</span> result = <span class="kw">await</span> useCase.<span class="fn">execute</span>({
      userId: event.requestContext.authorizer?.userId ?? body.userId,
      items: body.items
    });

    <span class="kw">return</span> {
      statusCode: <span class="str">201</span>,
      body: <span class="ty">JSON</span>.<span class="fn">stringify</span>(result),
      headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> }
    };

  } <span class="kw">catch</span> (error) {
    <span class="kw">const</span> message = error <span class="kw">instanceof</span> <span class="ty">Error</span> ? error.message : <span class="str">'Internal error'</span>;
    <span class="kw">return</span> { statusCode: <span class="str">400</span>, body: <span class="ty">JSON</span>.<span class="fn">stringify</span>({ error: message }) };
  }
};`

/* ── Section 06 — Functional approach ── */

const codeResult = `<span class="cm">// Type alg\u00e9brique \u2014 repr\u00e9sente succ\u00e8s OU erreur, jamais les deux</span>
<span class="kw">type</span> <span class="ty">Result</span>&lt;T, E = <span class="ty">Error</span>&gt; =
  | { <span class="kw">readonly</span> _tag: <span class="str">'Ok'</span>;  <span class="kw">readonly</span> value: T }
  | { <span class="kw">readonly</span> _tag: <span class="str">'Err'</span>; <span class="kw">readonly</span> error: E };

<span class="cm">// Constructeurs</span>
<span class="kw">const</span> <span class="fn">Ok</span>  = &lt;T&gt;(value: T): <span class="ty">Result</span>&lt;T&gt;   =&gt; ({ _tag: <span class="str">'Ok'</span>,  value });
<span class="kw">const</span> <span class="fn">Err</span> = &lt;E&gt;(error: E): <span class="ty">Result</span>&lt;<span class="kw">never</span>, E&gt; =&gt; ({ _tag: <span class="str">'Err'</span>, error });

<span class="cm">// Combinateurs fonctionnels</span>
<span class="kw">const</span> <span class="fn">map</span> = &lt;T, U, E&gt;(result: <span class="ty">Result</span>&lt;T, E&gt;, fn: (v: T) =&gt; U): <span class="ty">Result</span>&lt;U, E&gt; =&gt;
  result._tag === <span class="str">'Ok'</span> ? <span class="fn">Ok</span>(<span class="fn">fn</span>(result.value)) : result;

<span class="kw">const</span> <span class="fn">flatMap</span> = &lt;T, U, E&gt;(result: <span class="ty">Result</span>&lt;T, E&gt;, fn: (v: T) =&gt; <span class="ty">Result</span>&lt;U, E&gt;): <span class="ty">Result</span>&lt;U, E&gt; =&gt;
  result._tag === <span class="str">'Ok'</span> ? <span class="fn">fn</span>(result.value) : result;`

const codeDomainFn = `<span class="cm">// Types discrimin\u00e9s \u2014 le type porte l'\u00e9tat</span>
<span class="kw">type</span> <span class="ty">PendingOrder</span>   = { _tag: <span class="str">'Pending'</span>;   id: <span class="ty">string</span>; userId: <span class="ty">string</span>; items: <span class="ty">OrderItem</span>[] };
<span class="kw">type</span> <span class="ty">ConfirmedOrder</span> = { _tag: <span class="str">'Confirmed'</span>; id: <span class="ty">string</span>; userId: <span class="ty">string</span>; items: <span class="ty">OrderItem</span>[]; total: <span class="ty">number</span> };

<span class="cm">// Fonctions pures \u2014 aucun effet de bord</span>
<span class="kw">const</span> <span class="fn">createOrder</span> = (userId: <span class="ty">string</span>, items: <span class="ty">OrderItem</span>[]): <span class="ty">PendingOrder</span> =&gt; ({
  _tag: <span class="str">'Pending'</span>, id: crypto.<span class="fn">randomUUID</span>(), userId, items
});

<span class="kw">const</span> <span class="fn">validateOrder</span> = (order: <span class="ty">PendingOrder</span>): <span class="ty">Result</span>&lt;<span class="ty">PendingOrder</span>&gt; =&gt;
  order.items.length &gt; <span class="str">0</span>
    ? <span class="fn">Ok</span>(order)
    : <span class="fn">Err</span>(<span class="kw">new</span> <span class="ty">Error</span>(<span class="str">'Order must have at least one item'</span>));

<span class="kw">const</span> <span class="fn">calculateTotal</span> = (items: <span class="ty">OrderItem</span>[]): <span class="ty">number</span> =&gt;
  items.<span class="fn">reduce</span>((sum, item) =&gt; sum + item.price * item.quantity, <span class="str">0</span>);

<span class="kw">const</span> <span class="fn">confirmOrder</span> = (order: <span class="ty">PendingOrder</span>): <span class="ty">ConfirmedOrder</span> =&gt; ({
  _tag: <span class="str">'Confirmed'</span>, ...order, total: <span class="fn">calculateTotal</span>(order.items)
});`

const codePipeline = `<span class="cm">// Types des d\u00e9pendances inject\u00e9es par param\u00e8tre (pas de classe)</span>
<span class="kw">type</span> <span class="ty">SaveOrder</span>    = (order: <span class="ty">ConfirmedOrder</span>) =&gt; <span class="ty">Promise</span>&lt;<span class="ty">Result</span>&lt;<span class="ty">void</span>&gt;&gt;;
<span class="kw">type</span> <span class="ty">PublishEvent</span> = (event: <span class="ty">OrderEvent</span>)    =&gt; <span class="ty">Promise</span>&lt;<span class="ty">Result</span>&lt;<span class="ty">void</span>&gt;&gt;;

<span class="cm">// Factory de pipeline \u2014 retourne une fonction avec les d\u00e9pendances captur\u00e9es</span>
<span class="kw">const</span> <span class="fn">createOrderPipeline</span> = (
  saveOrder: <span class="ty">SaveOrder</span>,
  publishEvent: <span class="ty">PublishEvent</span>
) =&gt; <span class="kw">async</span> (input: { userId: <span class="ty">string</span>; items: <span class="ty">OrderItem</span>[] }): <span class="ty">Promise</span>&lt;<span class="ty">Result</span>&lt;{ orderId: <span class="ty">string</span>; total: <span class="ty">number</span> }&gt;&gt; =&gt; {

  <span class="cm">// \u2500\u2500 Railway \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Chaque \u00e9tape court-circuite sur Err \u2014 comme &amp;&amp; mais pour les Promises</span>
  <span class="kw">const</span> pending   = <span class="fn">createOrder</span>(input.userId, input.items);
  <span class="kw">const</span> validated = <span class="fn">validateOrder</span>(pending);
  <span class="kw">if</span> (validated._tag === <span class="str">'Err'</span>) <span class="kw">return</span> validated;

  <span class="kw">const</span> confirmed = <span class="fn">confirmOrder</span>(validated.value);

  <span class="kw">const</span> saved = <span class="kw">await</span> <span class="fn">saveOrder</span>(confirmed);
  <span class="kw">if</span> (saved._tag === <span class="str">'Err'</span>) <span class="kw">return</span> saved;

  <span class="kw">const</span> published = <span class="kw">await</span> <span class="fn">publishEvent</span>({
    type: <span class="str">'ORDER_CREATED'</span>, orderId: confirmed.id, total: confirmed.total
  });
  <span class="kw">if</span> (published._tag === <span class="str">'Err'</span>) <span class="kw">return</span> published;

  <span class="kw">return</span> <span class="fn">Ok</span>({ orderId: confirmed.id, total: confirmed.total });
};

<span class="cm">// \u2500\u2500 Handler fonctionnel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</span>
<span class="kw">const</span> pipeline = <span class="fn">createOrderPipeline</span>(
  <span class="fn">makeDynamoSaveOrder</span>(),   <span class="cm">// adaptateur instanci\u00e9 au niveau module</span>
  <span class="fn">makeSnsPublishEvent</span>()
);

<span class="kw">export const</span> <span class="fn">handler</span>: <span class="ty">APIGatewayProxyHandler</span> = <span class="kw">async</span> (event) =&gt; {
  <span class="kw">const</span> body   = <span class="ty">JSON</span>.<span class="fn">parse</span>(event.body ?? <span class="str">'{}'</span>);
  <span class="kw">const</span> result = <span class="kw">await</span> <span class="fn">pipeline</span>({ userId: body.userId, items: body.items });

  <span class="kw">if</span> (result._tag === <span class="str">'Err'</span>)
    <span class="kw">return</span> { statusCode: <span class="str">400</span>, body: <span class="ty">JSON</span>.<span class="fn">stringify</span>({ error: result.error.message }) };

  <span class="kw">return</span> { statusCode: <span class="str">201</span>, body: <span class="ty">JSON</span>.<span class="fn">stringify</span>(result.value) };
};`

/* ── Section 07 — Advanced patterns ── */

const patternCards: PrincipleCard[] = [
  {
    icon: '\u{1F483}',
    colorClass: 'green',
    name: 'Event Choreography',
    title: "Chor\u00e9graphie sans chef d'orchestre",
    desc: "Chaque fonction r\u00e9agit aux \u00e9v\u00e9nements SNS/SQS de mani\u00e8re autonome. Pas de coordinateur central. Plus r\u00e9silient : la panne d'une fonction n'interrompt pas les autres. Id\u00e9al pour les workflows asynchrones.",
    tags: ['SNS', 'SQS', 'EventBridge'],
    quote: '\u00ab createOrder \u2192 publie ORDER_CREATED \u2192 processPayment r\u00e9agit \u00bb',
  },
  {
    icon: '\u{1F3BB}',
    colorClass: 'purple',
    name: 'Event Orchestration',
    title: "Chef d'orchestre central",
    desc: "AWS Step Functions ou Temporal coordonnent l'ex\u00e9cution des fonctions en s\u00e9quence ou en parall\u00e8le. Visibilit\u00e9 totale sur l'\u00e9tat du workflow. Id\u00e9al pour les processus m\u00e9tier critiques avec compensation (saga pattern).",
    tags: ['Step Functions', 'Saga', 'Retry'],
  },
  {
    icon: '\u{1F6E1}\uFE0F',
    colorClass: 'orange',
    name: 'Idempotency',
    title: 'Protection contre les doublons',
    desc: "Les queues garantissent \"at-least-once delivery\" : une fonction peut \u00eatre invoqu\u00e9e plusieurs fois pour le m\u00eame \u00e9v\u00e9nement. L'idempotency key, stock\u00e9e en DynamoDB, permet de d\u00e9dupliquer les traitements.",
    tags: ['At-least-once', 'Dedup', 'DynamoDB TTL'],
  },
  {
    icon: '\u{1F30A}',
    colorClass: 'blue',
    name: 'Fan-out / Fan-in',
    title: 'Parall\u00e9lisme massif',
    desc: "Une fonction publie N \u00e9v\u00e9nements (fan-out), N fonctions traitent en parall\u00e8le, une derni\u00e8re agr\u00e8ge les r\u00e9sultats (fan-in). Exemple : g\u00e9n\u00e9rer 1000 rapports PDF simultan\u00e9ment en quelques secondes.",
    tags: ['Parall\u00e9lisme', 'SNS Fanout'],
  },
]

const codeIdempotency = `<span class="cm">// Les fonctions peuvent \u00eatre invoqu\u00e9es plusieurs fois (at-least-once delivery)
// L'idempotency key \u00e9vite les doublons</span>

<span class="kw">const</span> <span class="fn">processWithIdempotency</span> = <span class="kw">async</span> &lt;T&gt;(
  idempotencyKey: <span class="ty">string</span>,
  handler: () =&gt; <span class="ty">Promise</span>&lt;T&gt;
): <span class="ty">Promise</span>&lt;T | <span class="kw">undefined</span>&gt; =&gt; {

  <span class="cm">// V\u00e9rification en DynamoDB (conditional write \u2014 atomique)</span>
  <span class="kw">try</span> {
    <span class="kw">await</span> dynamoDB.<span class="fn">putItem</span>({
      TableName: <span class="str">'idempotency-store'</span>,
      Item: { PK: { S: idempotencyKey }, ttl: { N: <span class="ty">String</span>(<span class="ty">Date</span>.<span class="fn">now</span>() / <span class="str">1000</span> + <span class="str">86400</span>) } },
      ConditionExpression: <span class="str">'attribute_not_exists(PK)'</span>  <span class="cm">// \u00e9choue si d\u00e9j\u00e0 trait\u00e9</span>
    });
  } <span class="kw">catch</span> (e) {
    console.<span class="fn">log</span>(<span class="str">\`Skipping \u2014 already processed: \${idempotencyKey}\`</span>);
    <span class="kw">return undefined</span>;
  }

  <span class="kw">return</span> <span class="fn">handler</span>();
};

<span class="cm">// Utilisation dans un handler SQS</span>
<span class="kw">export const</span> <span class="fn">processPaymentHandler</span> = <span class="kw">async</span> (event: <span class="ty">SQSEvent</span>) =&gt; {
  <span class="kw">for</span> (<span class="kw">const</span> record <span class="kw">of</span> event.Records) {
    <span class="kw">const</span> { orderId, amount } = <span class="ty">JSON</span>.<span class="fn">parse</span>(record.body);
    <span class="kw">await</span> <span class="fn">processWithIdempotency</span>(<span class="str">\`payment-\${orderId}\`</span>, <span class="kw">async</span> () =&gt; {
      <span class="cm">// logique de paiement \u2014 ne s'ex\u00e9cute qu'une seule fois</span>
    });
  }
};`

const codeChoreography = `<span class="cm">// fn: createOrder \u2014 publie ORDER_CREATED sur SNS</span>
<span class="kw">export const</span> <span class="fn">createOrderHandler</span>: <span class="ty">APIGatewayProxyHandler</span> = <span class="kw">async</span> (event) =&gt; {
  <span class="cm">// ... traitement commande ...</span>
  <span class="kw">await</span> sns.<span class="fn">publish</span>({
    TopicArn: process.env.<span class="hl">ORDERS_TOPIC_ARN</span>!,
    Message: <span class="ty">JSON</span>.<span class="fn">stringify</span>({ type: <span class="str">'ORDER_CREATED'</span>, orderId, userId, amount }),
    MessageAttributes: { eventType: { DataType: <span class="str">'String'</span>, StringValue: <span class="str">'ORDER_CREATED'</span> } }
  });
  <span class="kw">return</span> { statusCode: <span class="str">201</span>, body: <span class="ty">JSON</span>.<span class="fn">stringify</span>({ orderId }) };
};

<span class="cm">// fn: processPayment \u2014 souscrit \u00e0 ORDER_CREATED (filtre SNS \u2192 SQS \u2192 Lambda)</span>
<span class="kw">export const</span> <span class="fn">processPaymentHandler</span> = <span class="kw">async</span> (event: <span class="ty">SQSEvent</span>) =&gt; {
  <span class="kw">for</span> (<span class="kw">const</span> record <span class="kw">of</span> event.Records) {
    <span class="kw">const</span> orderEvent = <span class="ty">JSON</span>.<span class="fn">parse</span>(record.body);
    <span class="cm">// Traiter le paiement, puis publier PAYMENT_PROCESSED...</span>
  }
};

<span class="cm">// fn: sendConfirmationEmail \u2014 souscrit \u00e0 PAYMENT_PROCESSED</span>
<span class="kw">export const</span> <span class="fn">sendEmailHandler</span> = <span class="kw">async</span> (event: <span class="ty">SQSEvent</span>) =&gt; {
  <span class="cm">// Chaque fonction est totalement autonome \u2014 d\u00e9couplage maximal</span>
};`

/* ── Section 08 — Decision ── */

const decisionTable: DecisionRow[] = [
  { aspect: 'Scalabilit\u00e9', detail: 'De 0 \u00e0 10 000 instances en quelques secondes. Automatique, sans configuration.', badge: 'Force majeure', badgeClass: 'badge-ok' },
  { aspect: 'Co\u00fbt (trafic faible)', detail: 'Pay-per-use + scale to zero. MVP, trafic irr\u00e9gulier : excellent ROI.', badge: 'Id\u00e9al', badgeClass: 'badge-ok' },
  { aspect: 'Co\u00fbt (charge constante)', detail: '\u00c0 forte charge continue, des containers/VMs longue dur\u00e9e deviennent plus \u00e9conomiques.', badge: '\u00c0 \u00e9valuer', badgeClass: 'badge-warn' },
  { aspect: 'Cold Start', detail: "200ms\u20132s de latence \u00e0 la premi\u00e8re invocation. Att\u00e9nuable avec Provisioned Concurrency.", badge: 'Attention API sync', badgeClass: 'badge-warn' },
  { aspect: "Dur\u00e9e max d'ex\u00e9cution", detail: 'AWS Lambda : 15 minutes maximum. Inadapt\u00e9 aux traitements longs.', badge: 'Limite hard', badgeClass: 'badge-bad' },
  { aspect: 'Debugging distribu\u00e9', detail: 'Logs \u00e9parpill\u00e9s sur N fonctions. N\u00e9cessite X-Ray, OpenTelemetry, ou Datadog.', badge: 'Outillage requis', badgeClass: 'badge-warn' },
  { aspect: 'Complexit\u00e9 op\u00e9rationnelle', detail: 'Z\u00e9ro serveur \u00e0 g\u00e9rer. Id\u00e9al pour petites \u00e9quipes sans ops d\u00e9di\u00e9s.', badge: 'Avantage clair', badgeClass: 'badge-ok' },
  { aspect: 'Design du code', detail: 'Force le stateless et le SRP. Naturellement align\u00e9 avec Clean Architecture.', badge: 'Bonne pratique', badgeClass: 'badge-ok' },
  { aspect: 'Vendor lock-in', detail: 'D\u00e9pendance forte aux APIs du fournisseur (Lambda, DynamoDB, SNS\u2026).', badge: 'Risque', badgeClass: 'badge-bad' },
  { aspect: 'Tests unitaires', detail: 'Domaine pur tr\u00e8s facile \u00e0 tester. Int\u00e9gration avec le cloud plus complexe (LocalStack).', badge: 'Domaine : trivial', badgeClass: 'badge-ok' },
]

const idealCmp: CmpColumn = {
  headerClass: 'good',
  headerLabel: 'Serverless est id\u00e9al quand\u2026',
  dotColor: 'var(--green)',
  items: [
    { text: 'Trafic irr\u00e9gulier / impr\u00e9visible \u2014 pics et creux' },
    { text: 'APIs l\u00e9g\u00e8res, webhooks, traitements \u00e9v\u00e9nementiels' },
    { text: 'MVP / prototypes \u2014 time-to-market rapide' },
    { text: 'Traitements batch asynchrones (resize, exports, rapports)' },
    { text: '\u00c9quipes petites sans ops d\u00e9di\u00e9s' },
    { text: 'Microservices avec domaines bien d\u00e9limit\u00e9s (DDD)' },
  ],
}

const avoidCmp: CmpColumn = {
  headerClass: 'bad',
  headerLabel: '\u00c0 \u00e9viter quand\u2026',
  dotColor: 'var(--red)',
  items: [
    { text: 'Charge continue et \u00e9lev\u00e9e \u2014 containers plus \u00e9conomiques' },
    { text: 'Latence < 50ms requise en permanence \u2014 cold start risqu\u00e9' },
    { text: 'Traitements longs (> 15 minutes)' },
    { text: '\u00c9tat local n\u00e9cessaire \u2014 sessions, WebSockets persistants' },
    { text: 'Forte r\u00e9ticence au vendor lock-in' },
    { text: 'Logique monolithique coupl\u00e9e impossible \u00e0 d\u00e9couper' },
  ],
}

const legendItems: LegendItem[] = [
  { color: 'var(--green)', label: 'Domaine / Entit\u00e9s' },
  { color: 'var(--purple)', label: 'Use Cases / Ports' },
  { color: 'var(--blue)', label: 'Adaptateurs / Infrastructure' },
  { color: 'var(--orange)', label: 'Handler Lambda (fronti\u00e8re)' },
  { color: 'var(--accent)', label: 'FaaS / Functions' },
  { color: 'var(--red)', label: 'Cold Start / Violation' },
]

/* ── SEO ── */

useHead({
  title: 'Architecture Serverless / FaaS \u2014 R\u00e9f\u00e9rence compl\u00e8te',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Architecture Serverless / FaaS \u2014 R\u00e9f\u00e9rence compl\u00e8te',
        description: "Function as a Service, cycle de vie, patterns event-driven et exemples TypeScript pour comprendre l'architecture Serverless.",
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/serverless-architecture',
        author: { '@type': 'Organization', name: 'Architectures Logicielles' },
      }),
    },
  ],
})

useSeoMeta({
  description: "Function as a Service, cycle de vie, patterns event-driven et exemples TypeScript pour comprendre l'architecture Serverless.",
  ogTitle: 'Architecture Serverless / FaaS \u2014 R\u00e9f\u00e9rence compl\u00e8te',
  ogDescription: "Function as a Service, cycle de vie, patterns event-driven et exemples TypeScript pour comprendre l'architecture Serverless.",
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/serverless-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Architecture Serverless / FaaS \u2014 R\u00e9f\u00e9rence compl\u00e8te',
  twitterDescription: "Function as a Service, cycle de vie, patterns event-driven et exemples TypeScript pour comprendre l'architecture Serverless.",
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="Engineering handbook"
      title="Architecture<br>Serverless &amp; FaaS"
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
          <div class="eyebrow">// Serverless / FaaS &mdash; R&eacute;f&eacute;rence compl&egrave;te</div>
          <h1>Architecture<br><em>Serverless</em> &amp; FaaS</h1>
          <p class="subtitle">Function as a Service, cycle de vie des fonctions, patterns event-driven et exemples TypeScript (POO + Fonctionnel) &mdash; selon les principes de Robert C. Martin.</p>
        </header>

        <!-- Quote box: Serverless != sans serveurs -->
        <div class="quote-box">
          <div class="quote-icon">&#x2601;&#xFE0F;</div>
          <div class="quote-content">
            <h3>Serverless &ne; sans serveurs</h3>
            <p>Il y a <em>toujours</em> des serveurs. Mais c'est le fournisseur cloud qui les provisionne, les scale, et les d&eacute;truit. Vous apportez votre <em>code</em> &mdash; l'infrastructure se mat&eacute;rialise &agrave; la demande, puis dispara&icirc;t. C'est l'aboutissement logique d'une tendance longue : <em>abstraire progressivement l'infrastructure</em> jusqu'&agrave; la faire dispara&icirc;tre du champ de vision du d&eacute;veloppeur.</p>
          </div>
        </div>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 01 — La métaphore de l'hôtel      -->
        <!-- ══════════════════════════════════════════ -->
        <section id="metaphore" class="section">
          <div class="section-header">
            <span class="section-number">01</span>
            <div class="section-line" />
            <span class="section-title">La m&eacute;taphore de l'h&ocirc;tel</span>
          </div>

          <p>
            Pour comprendre le <em>serverless</em>, imaginez trois modes d'h&eacute;bergement.
            Chacun repr&eacute;sente un compromis diff&eacute;rent entre <strong>contr&ocirc;le</strong>,
            <strong>responsabilit&eacute;</strong> et <strong>co&ucirc;t</strong>.
          </p>

          <div class="decision-table">
            <table>
              <thead>
                <tr>
                  <th>Mode</th>
                  <th>Analogie</th>
                  <th>&Eacute;quivalent technique</th>
                  <th>Mod&egrave;le</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in metaphorTable" :key="row.mode">
                  <td>{{ row.mode }}</td>
                  <td>{{ row.analogy }}</td>
                  <td>{{ row.equivalent }}</td>
                  <td><span class="badge" :class="row.badgeClass">{{ row.badge }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Le serverless pousse l'abstraction au maximum.
            Vous ne g&eacute;rez ni le serveur, ni le runtime, ni le syst&egrave;me d'exploitation.
            Vous &eacute;crivez une <em>fonction</em>, vous la d&eacute;ployez, et le cloud s'occupe du reste.
          </p>

          <div class="info-box">
            <strong>Uncle Bob &mdash; SRP</strong> &mdash;
            Le Single Responsibility Principle s'applique aussi &agrave; l'infrastructure.
            Si votre &eacute;quipe g&egrave;re &agrave; la fois le code m&eacute;tier <em>et</em> les serveurs,
            elle a deux raisons de changer. Le serverless supprime la deuxi&egrave;me.
          </div>
        </section>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 02 — Vue d'ensemble                -->
        <!-- ══════════════════════════════════════════ -->
        <section id="overview" class="section">
          <div class="section-header">
            <span class="section-number">02</span>
            <div class="section-line" />
            <span class="section-title">Vue d'ensemble</span>
          </div>

          <p>
            Un syst&egrave;me serverless se d&eacute;compose en quatre zones.
            Les &eacute;v&eacute;nements traversent ces zones de gauche &agrave; droite :
            de la <em>source</em> au <em>service manag&eacute;</em>, en passant par le <em>gateway</em> et la <em>fonction</em>.
          </p>

          <!-- Serverless diagram -->
          <div class="serverless-diagram">
            <div
              v-for="zone in sdZones"
              :key="zone.header"
              class="sd-zone"
            >
              <div class="sd-zone-header" :style="{ color: zone.headerColor, borderColor: zone.headerColor }">
                {{ zone.header }}
              </div>
              <div class="sd-zone-body">
                <div
                  v-for="node in zone.nodes"
                  :key="node.label"
                  class="sd-node"
                  :class="node.colorClass"
                >
                  {{ node.label }}
                </div>
              </div>
            </div>
          </div>

          <!-- Dependency flow -->
          <h3>Flux de d&eacute;pendance</h3>

          <div class="dep-flow">
            <template v-for="(node, idx) in depFlow" :key="node.label">
              <div
                class="dep-node"
                :style="{
                  color: node.color,
                  borderColor: node.borderColor,
                  background: node.bgColor,
                }"
              >
                <div>{{ node.label }}</div>
                <div class="dep-sublabel" :style="{ color: 'var(--muted)' }">{{ node.sublabel }}</div>
              </div>
              <div v-if="idx < depArrows.length" class="dep-arrow-h">
                <span class="arr" :style="{ color: depFlow[idx + 1]?.color }">&#x2192;</span>
                <span class="arr-txt">{{ depArrows[idx] }}</span>
              </div>
            </template>
          </div>
        </section>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 03 — Principes fondamentaux        -->
        <!-- ══════════════════════════════════════════ -->
        <section id="principes" class="section">
          <div class="section-header">
            <span class="section-number">03</span>
            <div class="section-line" />
            <span class="section-title">Les principes fondamentaux</span>
          </div>

          <p>
            Six principes structurent l'architecture serverless.
            Chacun impose des <em>contraintes</em> qui, bien appliqu&eacute;es,
            produisent un design plus propre et plus r&eacute;silient.
          </p>

          <div class="cards">
            <div
              v-for="card in principleCards"
              :key="card.name"
              class="card"
              :class="card.colorClass"
            >
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-name">{{ card.name }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc" v-html="card.desc"></p>
              <div class="card-tags">
                <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div v-if="card.quote" class="card-quote">{{ card.quote }}</div>
            </div>
          </div>
        </section>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 04 — Cold Start & Warm             -->
        <!-- ══════════════════════════════════════════ -->
        <section id="coldstart" class="section">
          <div class="section-header">
            <span class="section-number">04</span>
            <div class="section-line" />
            <span class="section-title">Cold Start &amp; Warm</span>
          </div>

          <p>
            Le <em>cold start</em> est le talon d'Achille du serverless.
            Quand aucun container n'est disponible, le cloud doit en cr&eacute;er un de z&eacute;ro.
            Ce processus prend entre <strong>200ms et 2 secondes</strong> selon le runtime et la taille du package.
          </p>

          <!-- Lifecycle phases -->
          <h3>Cycle de vie d'une invocation</h3>

          <div class="lifecycle">
            <div
              v-for="(phase, idx) in lifecyclePhases"
              :key="phase.name"
              class="lc-phase"
              :class="phase.styleClass"
            >
              <div class="lc-label">{{ phase.label }}</div>
              <div class="lc-name">{{ phase.name }}</div>
              <div class="lc-desc">{{ phase.desc }}</div>
            </div>
          </div>

          <!-- Comparison grid -->
          <h3>Comparaison</h3>

          <div class="comparison">
            <div class="cmp-col">
              <div class="cmp-header" :class="coldStartCmp.headerClass">
                {{ coldStartCmp.headerLabel }}
              </div>
              <div class="cmp-body">
                <div v-for="item in coldStartCmp.items" :key="item.text" class="cmp-item">
                  <span class="cmp-dot" :style="{ background: coldStartCmp.dotColor }" />
                  <span>{{ item.text }}</span>
                </div>
              </div>
            </div>
            <div class="cmp-col">
              <div class="cmp-header" :class="warmCmp.headerClass">
                {{ warmCmp.headerLabel }}
              </div>
              <div class="cmp-body">
                <div v-for="item in warmCmp.items" :key="item.text" class="cmp-item">
                  <span class="cmp-dot" :style="{ background: warmCmp.dotColor }" />
                  <span>{{ item.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Rule banner -->
          <div class="rule-banner">
            <strong>R&egrave;gle :</strong> Initialisez les clients DB, SDK AWS et caches au <em>niveau module</em>
            (hors du handler). Ils seront cr&eacute;&eacute;s une seule fois au cold start,
            puis r&eacute;utilis&eacute;s gratuitement &agrave; chaque invocation warm.
          </div>
        </section>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 05 — Clean Architecture Lambda     -->
        <!-- ══════════════════════════════════════════ -->
        <section id="clean" class="section">
          <div class="section-header">
            <span class="section-number">05</span>
            <div class="section-line" />
            <span class="section-title">Clean Architecture dans une Lambda</span>
          </div>

          <p>
            Le handler Lambda est un <strong>Controller</strong> au sens d'Uncle Bob :
            il traduit l'entr&eacute;e HTTP (ou SQS, S3&hellip;) en appel au Use Case,
            puis traduit le r&eacute;sultat en r&eacute;ponse HTTP.
            <em>Aucune logique m&eacute;tier dans le handler.</em>
          </p>

          <!-- File tree -->
          <div class="code-filename">Structure des fichiers</div>
          <div class="file-tree" v-html="fileTreeHtml"></div>

          <!-- Entity -->
          <div class="code-filename">domain/entities/Order.ts</div>
          <div class="code-block green-border" v-html="codeEntity"></div>

          <!-- Port -->
          <div class="code-filename">domain/ports/OrderRepository.ts</div>
          <div class="code-block purple-border" v-html="codePort"></div>

          <!-- Use Case -->
          <div class="code-filename">domain/usecases/CreateOrderUseCase.ts</div>
          <div class="code-block purple-border" v-html="codeUseCase"></div>

          <!-- Adapter -->
          <div class="code-filename">infrastructure/DynamoOrderRepository.ts</div>
          <div class="code-block blue-border" v-html="codeAdapter"></div>

          <!-- Handler -->
          <div class="code-filename">handlers/createOrder.ts</div>
          <div class="code-block orange-border" v-html="codeHandler"></div>
        </section>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 06 — Railway Oriented              -->
        <!-- ══════════════════════════════════════════ -->
        <section id="functional" class="section">
          <div class="section-header">
            <span class="section-number">06</span>
            <div class="section-line" />
            <span class="section-title">Approche fonctionnelle &mdash; Railway Oriented</span>
          </div>

          <p>
            L'approche <em>Railway Oriented Programming</em> mod&eacute;lise chaque &eacute;tape
            comme une fonction pure qui retourne <code>Ok</code> ou <code>Err</code>.
            La premi&egrave;re erreur court-circuite le pipeline &mdash; comme un train
            qui d&eacute;raille sur une voie parall&egrave;le.
          </p>

          <!-- Result type -->
          <div class="code-filename">lib/result.ts</div>
          <div class="code-block green-border" v-html="codeResult"></div>

          <!-- Domain functions -->
          <div class="code-filename">domain/order.ts</div>
          <div class="code-block green-border" v-html="codeDomainFn"></div>

          <!-- Pipeline -->
          <div class="code-filename">handler.ts</div>
          <div class="code-block orange-border" v-html="codePipeline"></div>

          <div class="info-box">
            <strong>Z&eacute;ro classe, z&eacute;ro this.</strong> &mdash;
            L'approche fonctionnelle &eacute;limine les classes au profit de
            <em>fonctions pures</em> et de <em>types discrimin&eacute;s</em>.
            Les d&eacute;pendances sont inject&eacute;es par param&egrave;tre, pas par constructeur.
            Le r&eacute;sultat est plus facile &agrave; tester et &agrave; raisonner.
          </div>
        </section>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 07 — Patterns avancés              -->
        <!-- ══════════════════════════════════════════ -->
        <section id="patterns" class="section">
          <div class="section-header">
            <span class="section-number">07</span>
            <div class="section-line" />
            <span class="section-title">Patterns Serverless avanc&eacute;s</span>
          </div>

          <p>
            Au-del&agrave; du simple handler, des <em>patterns architecturaux</em>
            sp&eacute;cifiques au serverless permettent de g&eacute;rer la coordination,
            la r&eacute;silience et le parall&eacute;lisme &agrave; grande &eacute;chelle.
          </p>

          <div class="cards">
            <div
              v-for="card in patternCards"
              :key="card.name"
              class="card"
              :class="card.colorClass"
            >
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-name">{{ card.name }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-tags">
                <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div v-if="card.quote" class="card-quote">{{ card.quote }}</div>
            </div>
          </div>

          <!-- Idempotency code -->
          <div class="code-filename">lib/idempotency.ts</div>
          <div class="code-block orange-border" v-html="codeIdempotency"></div>

          <!-- Choreography code -->
          <div class="code-filename">choreography.ts</div>
          <div class="code-block green-border" v-html="codeChoreography"></div>
        </section>

        <!-- ══════════════════════════════════════════ -->
        <!-- Section 08 — Forces, limites et décision   -->
        <!-- ══════════════════════════════════════════ -->
        <section id="decision" class="section">
          <div class="section-header">
            <span class="section-number">08</span>
            <div class="section-line" />
            <span class="section-title">Forces, limites et d&eacute;cision</span>
          </div>

          <p>
            Le serverless n'est pas une solution universelle.
            Voici un tableau d'aide &agrave; la d&eacute;cision pour &eacute;valuer
            si cette architecture convient &agrave; votre contexte.
          </p>

          <!-- Decision table -->
          <div class="decision-table">
            <table>
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>D&eacute;tail</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in decisionTable" :key="row.aspect">
                  <td>{{ row.aspect }}</td>
                  <td>{{ row.detail }}</td>
                  <td><span class="badge" :class="row.badgeClass">{{ row.badge }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Comparison grid -->
          <h3>Quand l'utiliser ?</h3>

          <div class="comparison">
            <div class="cmp-col">
              <div class="cmp-header" :class="idealCmp.headerClass">
                {{ idealCmp.headerLabel }}
              </div>
              <div class="cmp-body">
                <div v-for="item in idealCmp.items" :key="item.text" class="cmp-item">
                  <span class="cmp-dot" :style="{ background: idealCmp.dotColor }" />
                  <span>{{ item.text }}</span>
                </div>
              </div>
            </div>
            <div class="cmp-col">
              <div class="cmp-header" :class="avoidCmp.headerClass">
                {{ avoidCmp.headerLabel }}
              </div>
              <div class="cmp-body">
                <div v-for="item in avoidCmp.items" :key="item.text" class="cmp-item">
                  <span class="cmp-dot" :style="{ background: avoidCmp.dotColor }" />
                  <span>{{ item.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Final quote box -->
          <div class="quote-box" style="margin-top: 40px;">
            <div class="quote-icon">&#x1F9ED;</div>
            <div class="quote-content">
              <h3>La r&egrave;gle de d&eacute;pendance s'applique toujours</h3>
              <p>Peu importe l'infrastructure &mdash; Lambda, containers, serveurs &mdash; <em>la r&egrave;gle de d&eacute;pendance d'Uncle Bob reste invariante</em> : les d&eacute;pendances pointent vers l'int&eacute;rieur. Le domaine ne conna&icirc;t pas Lambda. La Clean Architecture est <em>agnostique au mode de d&eacute;ploiement</em>. C'est pr&eacute;cis&eacute;ment ce qui vous permet de migrer d'une Lambda vers un container Docker sans changer une ligne de logique m&eacute;tier.</p>
            </div>
          </div>

          <!-- Legend -->
          <div class="legend">
            <div v-for="item in legendItems" :key="item.label" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }" />
              {{ item.label }}
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Page-level custom properties ── */
.page {
  --bg: #0d0f14;
  --surface: #13161e;
  --border: #1e2330;
  --accent: #e8c84a;
  --accent2: #4ae8b0;
  --accent3: #e84a7a;
  --text: #d4d8e8;
  --muted: #6a7090;
  --white: #f0f2fa;
  --green: #4ae8b0;
  --purple: #a78bfa;
  --blue: #4a9ee8;
  --orange: #e87a4a;
  --red: #e84a7a;
  --mono: 'IBM Plex Mono', monospace;
  --sans: 'DM Sans', sans-serif;
  --serif: 'DM Serif Display', serif;
  --sidebar-w: 260px;
  --content-max: 860px;
}

:global(html) {
  scroll-behavior: smooth;
}

/* ── Layout ── */
.main {
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  padding: 48px 40px 80px;
}

.content {
  max-width: var(--content-max);
  margin: 0 auto;
}

/* ── Back link ── */
nav { margin-bottom: 32px; }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: var(--accent); }
.back-link::before { content: '\2190'; font-size: 14px; }

/* ── Header ── */
header {
  border-left: 3px solid var(--accent);
  padding-left: 24px;
  margin-bottom: 48px;
}

.eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

header h1 {
  font-family: var(--serif);
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--white);
  line-height: 1.15;
  margin-bottom: 16px;
}

header h1 em {
  font-style: italic;
  color: var(--accent);
}

.subtitle {
  font-size: 1rem;
  color: var(--muted);
  max-width: 560px;
}

/* ── Quote box ── */
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
  font-family: var(--serif);
  font-size: 1.1rem;
  color: var(--accent);
  margin-bottom: 8px;
}

.quote-content p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.75;
  margin: 0;
}

.quote-content em {
  color: var(--accent2);
  font-style: italic;
}

.quote-content strong {
  color: var(--white);
  font-weight: 500;
}

/* ── Sections ── */
.section {
  margin-bottom: 16px;
  padding-top: 48px;
  scroll-margin-top: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.section-number {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
  background: rgba(232,200,74,0.08);
  border: 1px solid rgba(232,200,74,0.2);
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.section-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.section-title {
  font-family: var(--serif);
  font-size: 1.5rem;
  color: var(--white);
}

.section h3 {
  font-family: var(--serif);
  font-size: 1.15rem;
  color: var(--white);
  margin: 32px 0 16px;
}

.section p {
  font-size: 0.925rem;
  color: var(--text);
  line-height: 1.8;
  margin-bottom: 16px;
  max-width: 780px;
}

.section p strong {
  color: var(--white);
  font-weight: 500;
}

.section p em {
  color: var(--accent);
  font-style: italic;
}

.section p code {
  font-family: var(--mono);
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

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

.card-icon {
  font-size: 1.6rem;
  margin-bottom: 12px;
  display: block;
}

.card-name {
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--card-accent, var(--accent));
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.card-title {
  font-family: var(--serif);
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

:deep(.card-desc strong) {
  color: var(--white);
  font-weight: 500;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-family: var(--mono);
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

/* Card color variants */
.yellow { --card-accent: #e8c84a; }
.green  { --card-accent: #4ae8b0; }
.blue   { --card-accent: #4a9ee8; }
.purple { --card-accent: #a78bfa; }
.pink   { --card-accent: #e84a7a; }
.orange { --card-accent: #e87a4a; }
.cyan   { --card-accent: #2dd4bf; }

/* ── Code blocks ── */
.code-block {
  background: #0a0c10;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 6px;
  padding: 20px 24px;
  margin: 0 0 20px;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 0.78rem;
  line-height: 1.75;
  color: #c8d0e8;
  white-space: pre;
}

.green-border  { border-left-color: var(--green); }
.blue-border   { border-left-color: var(--blue); }
.purple-border { border-left-color: var(--purple); }
.orange-border { border-left-color: var(--orange); }

.code-block :deep(.cm)  { color: #6a7090; }
.code-block :deep(.kw)  { color: #a78bfa; }
.code-block :deep(.fn)  { color: #4ae8b0; }
.code-block :deep(.str) { color: #e8c84a; }
.code-block :deep(.ty)  { color: #4a9ee8; }
.code-block :deep(.op)  { color: #e84a7a; }
.code-block :deep(.hl)  { color: var(--white); }

.code-filename {
  font-family: var(--mono);
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
  margin-top: 24px;
}

.code-filename + .code-block,
.code-filename + .file-tree {
  border-radius: 0 6px 6px 6px;
  margin-top: 0;
}

/* ── File tree ── */
.file-tree {
  background: #0a0c10;
  border: 1px solid var(--border);
  border-left: 3px solid var(--purple);
  border-radius: 6px;
  padding: 20px 24px;
  margin: 0 0 24px;
  font-family: var(--mono);
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
.file-tree :deep(.ft-cyan)   { color: #2dd4bf; }

/* ── Info box ── */
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
.info-box em { color: var(--accent); font-style: italic; }

/* ── Warn box ── */
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

/* ── Rule banner ── */
.rule-banner {
  background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(74,232,176,0.06));
  border: 1px solid rgba(167,139,250,0.25);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 28px 0;
  font-family: var(--mono);
  font-size: 0.82rem;
  color: var(--purple);
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.rule-banner strong { color: var(--white); }
.rule-banner em { color: var(--accent); font-style: normal; }

/* ── Decision table ── */
.decision-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin: 24px 0;
  font-size: 0.875rem;
}

.decision-table table {
  width: 100%;
  border-collapse: collapse;
}

.decision-table th {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
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

.decision-table tr:last-child td {
  border-bottom: none;
}

.decision-table tr:hover td {
  background: rgba(255,255,255,0.02);
}

.decision-table td:first-child {
  font-family: var(--mono);
  font-size: 0.78rem;
  color: var(--accent2);
}

.badge {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 3px;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.badge-ok {
  background: rgba(74,232,176,0.12);
  color: var(--green);
  border: 1px solid rgba(74,232,176,0.3);
}

.badge-warn {
  background: rgba(232,200,74,0.12);
  color: var(--accent);
  border: 1px solid rgba(232,200,74,0.3);
}

.badge-bad {
  background: rgba(232,74,122,0.12);
  color: var(--red);
  border: 1px solid rgba(232,74,122,0.3);
}

/* ── Serverless diagram ── */
.serverless-diagram {
  margin: 40px 0;
  display: grid;
  grid-template-columns: 160px 180px 1fr 1fr;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.sd-zone {
  border-right: 1px solid var(--border);
}

.sd-zone:last-child { border-right: none; }

.sd-zone-header {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.sd-zone-body {
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sd-node {
  border-radius: 5px;
  padding: 8px 12px;
  font-family: var(--mono);
  font-size: 11px;
  text-align: center;
  border: 1px solid;
  line-height: 1.3;
  transition: transform 0.15s;
  cursor: default;
}

.sd-node:hover { transform: scale(1.03); }

.sdn-blue {
  color: var(--blue);
  border-color: rgba(74,158,232,0.3);
  background: rgba(74,158,232,0.07);
}

.sdn-orange {
  color: var(--orange);
  border-color: rgba(232,122,74,0.3);
  background: rgba(232,122,74,0.07);
}

.sdn-purple {
  color: var(--purple);
  border-color: rgba(167,139,250,0.3);
  background: rgba(167,139,250,0.08);
}

.sdn-yellow {
  color: var(--accent);
  border-color: rgba(232,200,74,0.3);
  background: rgba(232,200,74,0.07);
}

.sdn-green {
  color: var(--green);
  border-color: rgba(74,232,176,0.3);
  background: rgba(74,232,176,0.07);
}

/* ── Lifecycle ── */
.lifecycle {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin: 32px 0;
  overflow-x: auto;
}

.lc-phase {
  flex: 1;
  min-width: 120px;
  border: 1px solid var(--border);
  border-right: none;
  position: relative;
  padding: 18px 14px 14px;
  background: var(--surface);
}

.lc-phase:first-child { border-radius: 8px 0 0 8px; }
.lc-phase:last-child  { border-right: 1px solid var(--border); border-radius: 0 8px 8px 0; }

.lc-phase::after {
  content: '▶';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--border);
  z-index: 2;
}

.lc-phase:last-child::after { display: none; }

.lc-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.lc-name {
  font-family: var(--serif);
  font-size: 0.9rem;
  color: var(--white);
  margin-bottom: 6px;
}

.lc-desc {
  font-size: 0.75rem;
  color: var(--muted);
  line-height: 1.5;
}

.lc-cold {
  background: rgba(232,74,122,0.05);
  border-top: 2px solid var(--red);
}
.lc-cold .lc-label { color: var(--red); }

.lc-warm {
  background: rgba(74,232,176,0.05);
  border-top: 2px solid var(--green);
}
.lc-warm .lc-label { color: var(--green); }

.lc-neutral {
  background: rgba(167,139,250,0.05);
  border-top: 2px solid var(--purple);
}
.lc-neutral .lc-label { color: var(--purple); }

/* ── Comparison grid ── */
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
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}

.cmp-header.bad  { color: var(--red); background: rgba(232, 74, 122, 0.06); }
.cmp-header.good { color: var(--green); background: rgba(74, 232, 176, 0.06); }

.cmp-body {
  padding: 16px 20px;
}

.cmp-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: var(--text);
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

/* ── Dependency flow ── */
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
  font-family: var(--mono);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: center;
  line-height: 1.4;
  border: 1px solid;
}

.dep-sublabel {
  font-size: 0.65rem;
  font-weight: 400;
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
  font-family: var(--mono);
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.08em;
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
  font-family: var(--mono);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* ── Inline code ── */
.section :deep(code) {
  font-family: var(--mono);
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

/* ── Animations ── */
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

/* ── Responsive ── */
@media (max-width: 768px) {
  .main {
    margin-left: 0;
    padding: 24px 16px 60px;
  }

  .cards {
    grid-template-columns: 1fr;
  }

  header h1 {
    font-size: 2rem;
  }

  .serverless-diagram {
    grid-template-columns: 1fr 1fr;
  }

  .lifecycle {
    flex-direction: column;
  }

  .lc-phase {
    border-right: 1px solid var(--border);
    border-bottom: none;
    border-radius: 0;
  }

  .lc-phase:first-child { border-radius: 8px 8px 0 0; }
  .lc-phase:last-child  { border-bottom: 1px solid var(--border); border-radius: 0 0 8px 8px; }
  .lc-phase::after { display: none; }

  .comparison {
    grid-template-columns: 1fr;
  }

  .dep-flow {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }

  .section-title {
    white-space: normal;
  }
}

@media (max-width: 480px) {
  .serverless-diagram {
    grid-template-columns: 1fr;
  }

  .decision-table {
    font-size: 0.75rem;
  }

  .decision-table th,
  .decision-table td {
    padding: 8px 10px;
  }
}
</style>
