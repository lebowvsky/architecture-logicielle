<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (principle cards, comparison items, legend items,
 *          layer rows, SOA overview nodes) are modeled as typed arrays and rendered
 *          via v-for, while unique prose, code blocks, and diagrams stay as direct
 *          template markup.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface PrincipleCard {
  number: string
  title: string
  description: string
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
}

interface LegendItem {
  color: string
  label: string
}

interface SoaNode {
  icon: string
  label: string
}

interface DecisionRow {
  criteria: string
  soa: string
  micro: string
}

const principleCards: PrincipleCard[] = [
  {
    number: '01',
    title: 'Loose Coupling',
    description:
      'Les services minimisent leurs d\u00e9pendances mutuelles. Un service ne conna\u00eet que le contrat de l\u2019autre, jamais son impl\u00e9mentation.',
  },
  {
    number: '02',
    title: 'Service Contract',
    description:
      'Chaque service expose un contrat formel et stable \u2014 son interface publique. C\u2019est le seul engagement envers l\u2019ext\u00e9rieur.',
  },
  {
    number: '03',
    title: 'Autonomy',
    description:
      'Chaque service contr\u00f4le enti\u00e8rement sa propre logique. Il ne d\u00e9l\u00e8gue pas \u00e0 un autre service pour remplir sa propre responsabilit\u00e9.',
  },
  {
    number: '04',
    title: 'Abstraction',
    description:
      'L\u2019impl\u00e9mentation interne est cach\u00e9e. Les consommateurs ne voient que ce que le contrat expose \u2014 rien de plus.',
  },
  {
    number: '05',
    title: 'Reusability',
    description:
      'Un service est con\u00e7u pour \u00eatre consomm\u00e9 par plusieurs clients. La r\u00e9utilisation est une priorit\u00e9 de conception, pas un bonus.',
  },
  {
    number: '06',
    title: 'Composability',
    description:
      'Les services peuvent \u00eatre compos\u00e9s pour former des processus m\u00e9tier plus complexes \u2014 l\u2019orchestration en est l\u2019expression.',
  },
  {
    number: '07',
    title: 'Statelessness',
    description:
      'Les services \u00e9vitent de conserver un \u00e9tat entre les appels. L\u2019\u00e9tat est port\u00e9 par le client ou externalis\u00e9 dans un store.',
  },
  {
    number: '08',
    title: 'Discoverability',
    description:
      'Les services sont enregistr\u00e9s et d\u00e9couvrables via un annuaire. Aucun consommateur ne devrait coder en dur une adresse r\u00e9seau.',
  },
]

const comparisonGood: ComparisonColumn = {
  headerClass: 'good',
  headerLabel: '\u2713 Utilise la SOA quand\u2026',
  dotColor: '#4ae8b0',
  items: [
    { text: 'Tu dois <strong>int\u00e9grer des syst\u00e8mes h\u00e9t\u00e9rog\u00e8nes</strong> existants (ERP, CRM, legacy, partenaires B2B)' },
    { text: 'Tu as besoin d\u2019une <strong>gouvernance forte</strong> et de contrats formels (finance, sant\u00e9, gouvernement)' },
    { text: 'La <strong>r\u00e9utilisation de services</strong> entre plusieurs applications est un objectif strat\u00e9gique' },
    { text: 'Tu travailles dans un contexte <strong>Enterprise</strong> avec des \u00e9quipes IT centralis\u00e9es' },
    { text: 'Les <strong>protocoles de s\u00e9curit\u00e9 standardis\u00e9s</strong> (WS-Security, SAML) sont requis' },
  ],
}

const comparisonBad: ComparisonColumn = {
  headerClass: 'bad',
  headerLabel: '\u2717 \u00c9vite la SOA quand\u2026',
  dotColor: '#e84a7a',
  items: [
    { text: 'Tu construis une <strong>startup</strong> \u2014 l\u2019overhead d\u2019un ESB est fatal \u00e0 la v\u00e9locit\u00e9' },
    { text: 'Tu veux un <strong>d\u00e9ploiement ind\u00e9pendant par feature team</strong> \u2192 pr\u00e9f\u00e8re les Microservices' },
    { text: 'Ton syst\u00e8me est <strong>simple</strong> \u2014 un bon Monolithe Modulaire est plus efficace et moins co\u00fbteux' },
    { text: 'Tu as besoin d\u2019une <strong>latence ultra-faible</strong> \u2014 l\u2019ESB ajoute des sauts r\u00e9seau' },
    { text: 'Ton \u00e9quipe n\u2019a pas la <strong>maturit\u00e9 op\u00e9rationnelle</strong> pour maintenir un ESB en production' },
  ],
}

const decisionRows: DecisionRow[] = [
  {
    criteria: 'Granularit\u00e9',
    soa: 'Services m\u00e9tier larges (Order, Customer\u2026)',
    micro: 'Services ultra-granulaires (1 fonction = 1 service)',
  },
  {
    criteria: 'Communication',
    soa: 'ESB central \u2014 SOAP/XML, WS-*',
    micro: 'Direct \u2014 REST, gRPC, Events (Kafka)',
  },
  {
    criteria: 'D\u00e9ploiement',
    soa: 'Souvent d\u00e9ploy\u00e9 en groupe (plusieurs services/serveur)',
    micro: 'Conteneur ind\u00e9pendant (Docker + K8s)',
  },
  {
    criteria: 'Donn\u00e9es',
    soa: 'Base de donn\u00e9es souvent partag\u00e9e',
    micro: 'Database-per-service (id\u00e9al)',
  },
  {
    criteria: 'Gouvernance',
    soa: 'Centralis\u00e9e \u2014 IT/Enterprise driven',
    micro: 'Equipe autonome \u2014 Team owned',
  },
  {
    criteria: 'Contrat',
    soa: 'WSDL / UDDI formels',
    micro: 'OpenAPI / AsyncAPI',
  },
  {
    criteria: 'Cible',
    soa: 'Int\u00e9gration Enterprise (EAI)',
    micro: 'Applications Cloud-native',
  },
  {
    criteria: 'Failure mode',
    soa: 'SPOF potentiel sur l\u2019ESB',
    micro: 'D\u00e9faillance partielle, circuit breaker',
  },
]

const sagaRows: LayerRow[] = [
  {
    color: '#4ae8b0',
    num: '\u00e9tape 1',
    title: 'Cr\u00e9er la commande',
    files: [
      { label: 'OrderService.createOrder()', colorClass: 'lf-green' },
      { label: 'compensation: cancelOrder()', colorClass: 'lf-orange' },
    ],
  },
  {
    color: '#a78bfa',
    num: '\u00e9tape 2',
    title: 'Traiter le paiement',
    files: [
      { label: 'PaymentService.processPayment()', colorClass: 'lf-purple' },
      { label: 'compensation: refund()', colorClass: 'lf-orange' },
    ],
  },
  {
    color: '#4a9ee8',
    num: '\u00e9tape 3',
    title: 'Notifier le client',
    files: [
      { label: 'NotificationService.sendConfirmation()', colorClass: 'lf-blue' },
      { label: 'pas de compensation n\u00e9cessaire', colorClass: 'lf-iface' },
    ],
  },
  {
    color: '#e8c84a',
    num: 'succ\u00e8s',
    title: 'Publier l\u2019\u00e9v\u00e9nement domaine',
    files: [
      { label: "EventEmitter.emit('order.confirmed')", colorClass: 'lf-yellow' },
    ],
  },
]

const consumerNodes: SoaNode[] = [
  { icon: '\u{1F310}', label: 'Web App' },
  { icon: '\u{1F4F1}', label: 'Mobile App' },
  { icon: '\u{1F91D}', label: 'Partenaire B2B' },
  { icon: '\u{1F4E6}', label: 'ERP Interne' },
  { icon: '\u{1F5A5}\uFE0F', label: 'Portail Client' },
]

const busNodes: SoaNode[] = [
  { icon: '\u21C4', label: 'Routage' },
  { icon: '\u21CC', label: 'Transformation' },
  { icon: '\u{1F3BC}', label: 'Orchestration' },
  { icon: '\u{1F510}', label: 'S\u00e9curit\u00e9 / Auth' },
  { icon: '\u{1F4CA}', label: 'Monitoring' },
  { icon: '\u{1F4CB}', label: 'Logging' },
  { icon: '\u26A1', label: 'Cache' },
]

const serviceNodesMain: SoaNode[] = [
  { icon: '\u{1F6D2}', label: 'Svc Commande' },
  { icon: '\u{1F4B3}', label: 'Svc Paiement' },
  { icon: '\u{1F464}', label: 'Svc Client' },
  { icon: '\u{1F4E6}', label: 'Svc Inventaire' },
]

const serviceNodesSecondary: SoaNode[] = [
  { icon: '\u{1F514}', label: 'Svc Notification' },
  { icon: '\u{1F511}', label: 'Svc Auth / IAM' },
  { icon: '\u{1F4C8}', label: 'Svc Reporting' },
  { icon: '\u{1F69A}', label: 'Svc Livraison' },
]

const legendItems: LegendItem[] = [
  { color: '#4a9ee8', label: 'Consommateurs' },
  { color: '#a78bfa', label: 'ESB / Bus' },
  { color: '#4ae8b0', label: 'Services M\u00e9tier' },
  { color: '#e8c84a', label: 'Annuaire / Registry' },
  { color: '#e87a4a', label: 'Compensation / Saga' },
  { color: '#e84a7a', label: 'Contrat / Interface' },
]

const codeContract = `<span class="cm">// \u2500\u2500 Types enveloppes \u2014 le "protocole" commun entre tous les services \u2500\u2500</span>

<span class="kw">export interface</span> <span class="ty">ServiceRequest</span>&lt;<span class="ty">T</span>&gt; {
  correlationId: <span class="ty">string</span>;   <span class="cm">// trace bout-en-bout</span>
  timestamp:     <span class="ty">Date</span>;
  payload:       <span class="ty">T</span>;
  metadata?:     <span class="ty">Record</span>&lt;<span class="ty">string</span>, <span class="ty">string</span>&gt;;
}

<span class="kw">export interface</span> <span class="ty">ServiceResponse</span>&lt;<span class="ty">T</span>&gt; {
  correlationId: <span class="ty">string</span>;
  success:       <span class="ty">boolean</span>;
  data?:         <span class="ty">T</span>;
  error?:        <span class="ty">ServiceError</span>;
  timestamp:     <span class="ty">Date</span>;
}

<span class="kw">export interface</span> <span class="ty">ServiceError</span> {
  code:     <span class="ty">string</span>;
  message:  <span class="ty">string</span>;
  details?: <span class="ty">unknown</span>;
}

<span class="cm">// \u2500\u2500 Contrat du Service Commande \u2500\u2500</span>
<span class="kw">export interface</span> <span class="ty">IOrderService</span> {
  <span class="fn">createOrder</span>(request: <span class="ty">ServiceRequest</span>&lt;<span class="ty">CreateOrderDTO</span>&gt;): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">OrderDTO</span>&gt;&gt;;
  <span class="fn">getOrder</span>   (request: <span class="ty">ServiceRequest</span>&lt;{ orderId: <span class="ty">string</span> }&gt;): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">OrderDTO</span>&gt;&gt;;
  <span class="fn">cancelOrder</span>(request: <span class="ty">ServiceRequest</span>&lt;{ orderId: <span class="ty">string</span> }&gt;): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">void</span>&gt;&gt;;
}

<span class="cm">// \u2500\u2500 Contrat du Service Paiement \u2500\u2500</span>
<span class="kw">export interface</span> <span class="ty">IPaymentService</span> {
  <span class="fn">processPayment</span>(request: <span class="ty">ServiceRequest</span>&lt;<span class="ty">PaymentDTO</span>&gt;): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">PaymentResultDTO</span>&gt;&gt;;
  <span class="fn">refund</span>         (request: <span class="ty">ServiceRequest</span>&lt;<span class="ty">RefundDTO</span>&gt;):    <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">void</span>&gt;&gt;;
}

<span class="cm">// \u2500\u2500 DTOs (Data Transfer Objects) \u2014 ce qui traverse le r\u00e9seau \u2500\u2500</span>
<span class="kw">export interface</span> <span class="ty">CreateOrderDTO</span> {
  customerId: <span class="ty">string</span>;
  items: <span class="ty">Array</span>&lt;{ productId: <span class="ty">string</span>; quantity: <span class="ty">number</span>; unitPrice: <span class="ty">number</span> }&gt;;
}

<span class="kw">export interface</span> <span class="ty">OrderDTO</span> {
  orderId:     <span class="ty">string</span>;
  customerId:  <span class="ty">string</span>;
  items:       <span class="ty">CreateOrderDTO</span>[<span class="str">'items'</span>];
  totalAmount: <span class="ty">number</span>;
  status:      <span class="str">'PENDING'</span> | <span class="str">'CONFIRMED'</span> | <span class="str">'CANCELLED'</span> | <span class="str">'DELIVERED'</span>;
  createdAt:   <span class="ty">Date</span>;
}

<span class="kw">export interface</span> <span class="ty">PaymentDTO</span> {
  orderId:       <span class="ty">string</span>;
  amount:        <span class="ty">number</span>;
  currency:      <span class="ty">string</span>;
  paymentMethod: <span class="str">'CREDIT_CARD'</span> | <span class="str">'BANK_TRANSFER'</span>;
}

<span class="kw">export interface</span> <span class="ty">PaymentResultDTO</span> {
  transactionId: <span class="ty">string</span>;
  status:        <span class="str">'SUCCESS'</span> | <span class="str">'FAILED'</span> | <span class="str">'PENDING'</span>;
}

<span class="kw">export interface</span> <span class="ty">RefundDTO</span> {
  transactionId: <span class="ty">string</span>;
  reason:        <span class="ty">string</span>;
}`

const codeService = `<span class="kw">import</span> { <span class="ty">Injectable</span>, <span class="ty">Logger</span> } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { <span class="ty">InjectRepository</span> } <span class="kw">from</span> <span class="str">'@nestjs/typeorm'</span>;
<span class="kw">import</span> { <span class="ty">Repository</span> } <span class="kw">from</span> <span class="str">'typeorm'</span>;
<span class="kw">import</span> { <span class="fn">v4</span> <span class="kw">as</span> <span class="fn">uuidv4</span> } <span class="kw">from</span> <span class="str">'uuid'</span>;
<span class="kw">import</span> { <span class="ty">IOrderService</span>, <span class="ty">ServiceRequest</span>, <span class="ty">ServiceResponse</span>, <span class="ty">CreateOrderDTO</span>, <span class="ty">OrderDTO</span> } <span class="kw">from</span> <span class="str">'./contracts'</span>;
<span class="kw">import</span> { <span class="ty">OrderEntity</span> } <span class="kw">from</span> <span class="str">'./entities/order.entity'</span>;

<span class="dec">@Injectable()</span>
<span class="kw">export class</span> <span class="ty">OrderService</span> <span class="kw">implements</span> <span class="ty">IOrderService</span> {
  <span class="kw">private readonly</span> logger = <span class="kw">new</span> <span class="fn">Logger</span>(<span class="ty">OrderService</span>.name);

  <span class="kw">constructor</span>(
    <span class="dec">@InjectRepository(OrderEntity)</span>
    <span class="kw">private readonly</span> orderRepository: <span class="ty">Repository</span>&lt;<span class="ty">OrderEntity</span>&gt;,
  ) {}

  <span class="kw">async</span> <span class="fn">createOrder</span>(
    request: <span class="ty">ServiceRequest</span>&lt;<span class="ty">CreateOrderDTO</span>&gt;,
  ): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">OrderDTO</span>&gt;&gt; {
    <span class="kw">const</span> { correlationId, payload } = request;
    <span class="kw">this</span>.logger.<span class="fn">log</span>(<span class="str">\`[\${correlationId}] Creating order for \${payload.customerId}\`</span>);

    <span class="kw">try</span> {
      <span class="kw">const</span> totalAmount = payload.items.<span class="fn">reduce</span>(
        (sum, item) =&gt; sum + item.quantity * item.unitPrice, <span class="str">0</span>,
      );

      <span class="kw">const</span> order = <span class="kw">this</span>.orderRepository.<span class="fn">create</span>({
        orderId:     <span class="fn">uuidv4</span>(),
        customerId:  payload.customerId,
        items:       payload.items,
        totalAmount,
        status:      <span class="str">'PENDING'</span>,
        createdAt:   <span class="kw">new</span> <span class="ty">Date</span>(),
      });

      <span class="kw">const</span> saved = <span class="kw">await</span> <span class="kw">this</span>.orderRepository.<span class="fn">save</span>(order);

      <span class="kw">return</span> { correlationId, success: <span class="kw">true</span>, data: <span class="kw">this</span>.<span class="fn">toDTO</span>(saved), timestamp: <span class="kw">new</span> <span class="ty">Date</span>() };
    } <span class="kw">catch</span> (error) {
      <span class="kw">this</span>.logger.<span class="fn">error</span>(<span class="str">\`[\${correlationId}] Failed to create order\`</span>, error);
      <span class="kw">return</span> {
        correlationId, success: <span class="kw">false</span>,
        error: { code: <span class="str">'ORDER_CREATE_FAILED'</span>, message: <span class="str">'Unable to create order'</span>, details: error },
        timestamp: <span class="kw">new</span> <span class="ty">Date</span>(),
      };
    }
  }

  <span class="kw">async</span> <span class="fn">getOrder</span>(
    request: <span class="ty">ServiceRequest</span>&lt;{ orderId: <span class="ty">string</span> }&gt;,
  ): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">OrderDTO</span>&gt;&gt; {
    <span class="kw">const</span> { correlationId, payload } = request;
    <span class="kw">const</span> order = <span class="kw">await</span> <span class="kw">this</span>.orderRepository.<span class="fn">findOne</span>({ where: { orderId: payload.orderId } });

    <span class="kw">if</span> (!order) {
      <span class="kw">return</span> {
        correlationId, success: <span class="kw">false</span>,
        error: { code: <span class="str">'ORDER_NOT_FOUND'</span>, message: <span class="str">\`Order \${payload.orderId} not found\`</span> },
        timestamp: <span class="kw">new</span> <span class="ty">Date</span>(),
      };
    }

    <span class="kw">return</span> { correlationId, success: <span class="kw">true</span>, data: <span class="kw">this</span>.<span class="fn">toDTO</span>(order), timestamp: <span class="kw">new</span> <span class="ty">Date</span>() };
  }

  <span class="kw">async</span> <span class="fn">cancelOrder</span>(
    request: <span class="ty">ServiceRequest</span>&lt;{ orderId: <span class="ty">string</span> }&gt;,
  ): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">void</span>&gt;&gt; {
    <span class="kw">await</span> <span class="kw">this</span>.orderRepository.<span class="fn">update</span>(
      { orderId: request.payload.orderId },
      { status: <span class="str">'CANCELLED'</span> },
    );
    <span class="kw">return</span> { correlationId: request.correlationId, success: <span class="kw">true</span>, timestamp: <span class="kw">new</span> <span class="ty">Date</span>() };
  }

  <span class="kw">private</span> <span class="fn">toDTO</span>(entity: <span class="ty">OrderEntity</span>): <span class="ty">OrderDTO</span> {
    <span class="kw">return</span> {
      orderId:     entity.orderId,
      customerId:  entity.customerId,
      items:       entity.items,
      totalAmount: entity.totalAmount,
      status:      entity.status,
      createdAt:   entity.createdAt,
    };
  }
}`

const codeBus = `<span class="cm">// \u2500\u2500 Interfaces du Bus \u2500\u2500</span>
<span class="kw">interface</span> <span class="ty">BusContext</span> {
  serviceName: <span class="ty">string</span>;
  method:      <span class="ty">string</span>;
  request:     <span class="ty">ServiceRequest</span>&lt;<span class="ty">unknown</span>&gt;;
}

<span class="kw">interface</span> <span class="ty">Middleware</span> {
  <span class="fn">before</span>(ctx: <span class="ty">BusContext</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;
  <span class="fn">after</span> (ctx: <span class="ty">BusContext</span>, res: <span class="ty">ServiceResponse</span>&lt;<span class="ty">unknown</span>&gt;): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;
}

<span class="cm">// \u2500\u2500 Le Bus \u2500\u2500</span>
<span class="kw">export class</span> <span class="ty">ServiceBus</span> {
  <span class="kw">private readonly</span> services    = <span class="kw">new</span> <span class="ty">Map</span>&lt;<span class="ty">string</span>, <span class="ty">unknown</span>&gt;();
  <span class="kw">private readonly</span> middlewares: <span class="ty">Middleware</span>[] = [];

  <span class="fn">register</span>&lt;<span class="ty">T</span>&gt;(name: <span class="ty">string</span>, service: <span class="ty">T</span>): <span class="ty">void</span> {
    <span class="kw">this</span>.services.<span class="fn">set</span>(name, service);
  }

  <span class="fn">use</span>(middleware: <span class="ty">Middleware</span>): <span class="ty">void</span> {
    <span class="kw">this</span>.middlewares.<span class="fn">push</span>(middleware);
  }

  <span class="kw">async</span> <span class="fn">call</span>&lt;<span class="ty">TReq</span>, <span class="ty">TRes</span>&gt;(
    serviceName: <span class="ty">string</span>,
    method:      <span class="ty">string</span>,
    payload:     <span class="ty">TReq</span>,
  ): <span class="ty">Promise</span>&lt;<span class="ty">ServiceResponse</span>&lt;<span class="ty">TRes</span>&gt;&gt; {
    <span class="kw">const</span> correlationId = <span class="fn">uuidv4</span>();
    <span class="kw">const</span> request: <span class="ty">ServiceRequest</span>&lt;<span class="ty">TReq</span>&gt; = { correlationId, timestamp: <span class="kw">new</span> <span class="ty">Date</span>(), payload };
    <span class="kw">const</span> ctx: <span class="ty">BusContext</span> = { serviceName, method, request };

    <span class="cm">// \u2500\u2500 Pipeline "avant" \u2500\u2500</span>
    <span class="kw">for</span> (<span class="kw">const</span> mw <span class="kw">of</span> <span class="kw">this</span>.middlewares) <span class="kw">await</span> mw.<span class="fn">before</span>(ctx);

    <span class="kw">try</span> {
      <span class="kw">const</span> service = <span class="kw">this</span>.services.<span class="fn">get</span>(serviceName);
      <span class="kw">if</span> (!service) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">\`Service "\${serviceName}" not found\`</span>);

      <span class="kw">const</span> handler = (service <span class="kw">as</span> <span class="ty">Record</span>&lt;<span class="ty">string</span>, <span class="ty">Function</span>&gt;)[method];
      <span class="kw">if</span> (<span class="kw">typeof</span> handler !== <span class="str">'function'</span>)
        <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">\`Method "\${method}" not found on "\${serviceName}"\`</span>);

      <span class="kw">const</span> response: <span class="ty">ServiceResponse</span>&lt;<span class="ty">TRes</span>&gt; = <span class="kw">await</span> handler.<span class="fn">call</span>(service, request);

      <span class="cm">// \u2500\u2500 Pipeline "apr\u00e8s" \u2500\u2500</span>
      <span class="kw">for</span> (<span class="kw">const</span> mw <span class="kw">of</span> <span class="kw">this</span>.middlewares) <span class="kw">await</span> mw.<span class="fn">after</span>(ctx, response);

      <span class="kw">return</span> response;
    } <span class="kw">catch</span> (error) {
      <span class="kw">return</span> {
        correlationId, success: <span class="kw">false</span>,
        error: { code: <span class="str">'BUS_ERROR'</span>, message: <span class="ty">String</span>(error) },
        timestamp: <span class="kw">new</span> <span class="ty">Date</span>(),
      };
    }
  }
}

<span class="cm">// \u2500\u2500 Middleware de logging \u2500\u2500</span>
<span class="kw">class</span> <span class="ty">LoggingMiddleware</span> <span class="kw">implements</span> <span class="ty">Middleware</span> {
  <span class="kw">async</span> <span class="fn">before</span>(ctx: <span class="ty">BusContext</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    console.<span class="fn">log</span>(<span class="str">\`[BUS] --> \${ctx.serviceName}.\${ctx.method} | \${ctx.request.correlationId}\`</span>);
  }
  <span class="kw">async</span> <span class="fn">after</span>(ctx: <span class="ty">BusContext</span>, res: <span class="ty">ServiceResponse</span>&lt;<span class="ty">unknown</span>&gt;): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">const</span> status = res.success ? <span class="str">'OK'</span> : <span class="str">'FAIL'</span>;
    console.<span class="fn">log</span>(<span class="str">\`[BUS] <-- \${ctx.serviceName}.\${ctx.method} | \${status}\`</span>);
  }
}

<span class="cm">// \u2500\u2500 Enregistrement et utilisation \u2500\u2500</span>
<span class="kw">const</span> bus = <span class="kw">new</span> <span class="ty">ServiceBus</span>();
bus.<span class="fn">use</span>(<span class="kw">new</span> <span class="ty">LoggingMiddleware</span>());
bus.<span class="fn">register</span>(<span class="str">'OrderService'</span>,   <span class="kw">new</span> <span class="ty">OrderService</span>(repo));
bus.<span class="fn">register</span>(<span class="str">'PaymentService'</span>, <span class="kw">new</span> <span class="ty">PaymentService</span>());

<span class="cm">// Le consommateur ne conna\u00eet PAS l'impl\u00e9mentation \u2014 seulement le bus</span>
<span class="kw">const</span> result = <span class="kw">await</span> bus.<span class="fn">call</span>&lt;<span class="ty">CreateOrderDTO</span>, <span class="ty">OrderDTO</span>&gt;(
  <span class="str">'OrderService'</span>, <span class="str">'createOrder'</span>,
  { customerId: <span class="str">'cust-001'</span>, items: [{ productId: <span class="str">'p-1'</span>, quantity: <span class="str">2</span>, unitPrice: <span class="str">49.99</span> }] },
);`

const codeOrchestrator = `<span class="kw">export class</span> <span class="ty">PlaceOrderOrchestrator</span> {
  <span class="kw">constructor</span>(
    <span class="kw">private readonly</span> bus:          <span class="ty">ServiceBus</span>,
    <span class="kw">private readonly</span> eventEmitter: <span class="ty">EventEmitter</span>,
  ) {}

  <span class="kw">async</span> <span class="fn">execute</span>(customerId: <span class="ty">string</span>, items: <span class="ty">CreateOrderDTO</span>[<span class="str">'items'</span>]): <span class="ty">Promise</span>&lt;<span class="ty">OrderDTO</span>&gt; {
    <span class="kw">const</span> steps: <span class="ty">CompensationStep</span>[] = []; <span class="cm">// pile LIFO pour rollback</span>

    <span class="cm">// \u2500\u2500 \u00c9tape 1 : Cr\u00e9er la commande \u2500\u2500</span>
    <span class="kw">const</span> orderRes = <span class="kw">await</span> <span class="kw">this</span>.bus.<span class="fn">call</span>&lt;<span class="ty">CreateOrderDTO</span>, <span class="ty">OrderDTO</span>&gt;(
      <span class="str">'OrderService'</span>, <span class="str">'createOrder'</span>, { customerId, items },
    );
    <span class="kw">if</span> (!orderRes.success || !orderRes.data) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Order creation failed'</span>);
    <span class="kw">const</span> order = orderRes.data;

    steps.<span class="fn">push</span>({
      compensate: () =&gt; <span class="kw">this</span>.bus.<span class="fn">call</span>(<span class="str">'OrderService'</span>, <span class="str">'cancelOrder'</span>, { orderId: order.orderId }),
    });

    <span class="cm">// \u2500\u2500 \u00c9tape 2 : Traiter le paiement \u2500\u2500</span>
    <span class="kw">const</span> payRes = <span class="kw">await</span> <span class="kw">this</span>.bus.<span class="fn">call</span>&lt;<span class="ty">PaymentDTO</span>, <span class="ty">PaymentResultDTO</span>&gt;(
      <span class="str">'PaymentService'</span>, <span class="str">'processPayment'</span>,
      { orderId: order.orderId, amount: order.totalAmount, currency: <span class="str">'EUR'</span>, paymentMethod: <span class="str">'CREDIT_CARD'</span> },
    );

    <span class="kw">if</span> (!payRes.success || payRes.data?.status !== <span class="str">'SUCCESS'</span>) {
      <span class="kw">await</span> <span class="kw">this</span>.<span class="fn">compensate</span>(steps); <span class="cm">// rollback de tout</span>
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Payment failed \u2014 order rolled back'</span>);
    }

    steps.<span class="fn">push</span>({
      compensate: () =&gt; <span class="kw">this</span>.bus.<span class="fn">call</span>(<span class="str">'PaymentService'</span>, <span class="str">'refund'</span>, {
        transactionId: payRes.data!.transactionId,
        reason: <span class="str">'Orchestration rollback'</span>,
      }),
    });

    <span class="cm">// \u2500\u2500 \u00c9tape 3 : Notification \u2500\u2500</span>
    <span class="kw">await</span> <span class="kw">this</span>.bus.<span class="fn">call</span>(<span class="str">'NotificationService'</span>, <span class="str">'sendOrderConfirmation'</span>, {
      customerId, orderId: order.orderId, transactionId: payRes.data!.transactionId,
    });

    <span class="cm">// \u2500\u2500 \u00c9v\u00e9nement domaine \u2500\u2500</span>
    <span class="kw">this</span>.eventEmitter.<span class="fn">emit</span>(<span class="str">'order.confirmed'</span>, { orderId: order.orderId, customerId });

    <span class="kw">return</span> order;
  }

  <span class="kw">private async</span> <span class="fn">compensate</span>(steps: <span class="ty">CompensationStep</span>[]): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="cm">// LIFO \u2014 on d\u00e9fait dans l'ordre inverse</span>
    <span class="kw">for</span> (<span class="kw">const</span> step <span class="kw">of</span> [...steps].<span class="fn">reverse</span>()) {
      <span class="kw">try</span> { <span class="kw">await</span> step.<span class="fn">compensate</span>(); }
      <span class="kw">catch</span> (e) { console.<span class="fn">error</span>(<span class="str">'Compensation failed'</span>, e); }
    }
  }
}

<span class="kw">interface</span> <span class="ty">CompensationStep</span> {
  compensate: () =&gt; <span class="ty">Promise</span>&lt;<span class="ty">unknown</span>&gt;;
}`

const codeFunctional = `<span class="kw">import</span> { <span class="fn">pipe</span> }     <span class="kw">from</span> <span class="str">'fp-ts/function'</span>;
<span class="kw">import</span> * <span class="kw">as</span> <span class="ty">TE</span>   <span class="kw">from</span> <span class="str">'fp-ts/TaskEither'</span>;
<span class="kw">import</span> { <span class="fn">v4</span> <span class="kw">as</span> <span class="fn">uuidv4</span> } <span class="kw">from</span> <span class="str">'uuid'</span>;

<span class="cm">// \u2500\u2500 Type canonique d'un service fonctionnel \u2500\u2500</span>
<span class="kw">type</span> <span class="ty">ServiceCall</span>&lt;<span class="ty">A</span>, <span class="ty">B</span>&gt; = (input: <span class="ty">A</span>) =&gt; <span class="ty">TE.TaskEither</span>&lt;<span class="ty">ServiceError</span>, <span class="ty">B</span>&gt;;

<span class="cm">// \u2500\u2500 Services en style fonctionnel (fonctions pures) \u2500\u2500</span>
<span class="kw">const</span> createOrder: <span class="ty">ServiceCall</span>&lt;<span class="ty">CreateOrderDTO</span>, <span class="ty">OrderDTO</span>&gt; =
  (payload) =&gt; <span class="ty">TE</span>.<span class="fn">tryCatch</span>(
    <span class="kw">async</span> () =&gt; ({
      orderId:     <span class="fn">uuidv4</span>(),
      customerId:  payload.customerId,
      items:       payload.items,
      totalAmount: payload.items.<span class="fn">reduce</span>((s, i) =&gt; s + i.quantity * i.unitPrice, <span class="str">0</span>),
      status:      <span class="str">'PENDING'</span> <span class="kw">as const</span>,
      createdAt:   <span class="kw">new</span> <span class="ty">Date</span>(),
    }),
    (e): <span class="ty">ServiceError</span> =&gt; ({ code: <span class="str">'ORDER_FAILED'</span>, message: <span class="ty">String</span>(e) }),
  );

<span class="kw">const</span> processPayment: <span class="ty">ServiceCall</span>&lt;<span class="ty">PaymentDTO</span>, <span class="ty">PaymentResultDTO</span>&gt; =
  (payload) =&gt; <span class="ty">TE</span>.<span class="fn">tryCatch</span>(
    <span class="kw">async</span> () =&gt; ({
      transactionId: <span class="fn">uuidv4</span>(),
      status:        <span class="str">'SUCCESS'</span> <span class="kw">as const</span>,
    }),
    (e): <span class="ty">ServiceError</span> =&gt; ({ code: <span class="str">'PAYMENT_FAILED'</span>, message: <span class="ty">String</span>(e) }),
  );

<span class="cm">// \u2500\u2500 Composition du pipeline \u2500\u2500</span>
<span class="kw">const</span> placeOrderPipeline = (
  customerId: <span class="ty">string</span>,
  items:      <span class="ty">CreateOrderDTO</span>[<span class="str">'items'</span>],
): <span class="ty">TE.TaskEither</span>&lt;<span class="ty">ServiceError</span>, <span class="ty">PaymentResultDTO</span>&gt; =&gt;
  <span class="fn">pipe</span>(
    <span class="fn">createOrder</span>({ customerId, items }),      <span class="cm">// TaskEither&lt;Err, OrderDTO&gt;</span>
    <span class="ty">TE</span>.<span class="fn">chain</span>((order) =&gt;                       <span class="cm">// si succ\u00e8s, on encha\u00eene</span>
      <span class="fn">processPayment</span>({
        orderId:       order.orderId,
        amount:        order.totalAmount,
        currency:      <span class="str">'EUR'</span>,
        paymentMethod: <span class="str">'CREDIT_CARD'</span>,
      }),
    ),
    <span class="ty">TE</span>.<span class="fn">tapError</span>((err) =&gt;                     <span class="cm">// log en cas d'erreur</span>
      <span class="ty">TE</span>.<span class="fn">of</span>(console.<span class="fn">error</span>(<span class="str">'Pipeline failed:'</span>, err.code))
    ),
  );

<span class="cm">// \u2500\u2500 Appel \u2500\u2500</span>
<span class="kw">const</span> result = <span class="kw">await</span> <span class="fn">placeOrderPipeline</span>(
  <span class="str">'cust-001'</span>,
  [{ productId: <span class="str">'p-1'</span>, quantity: <span class="str">2</span>, unitPrice: <span class="str">49.99</span> }],
)();

<span class="kw">if</span> (result._tag === <span class="str">'Right'</span>) {
  console.<span class="fn">log</span>(<span class="str">'Success:'</span>, result.right.transactionId);
} <span class="kw">else</span> {
  console.<span class="fn">error</span>(<span class="str">'Failed:'</span>, result.left.code);
}`

/* ── Sidebar navigation ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'metaphore', label: 'La m\u00e9taphore' },
      { id: 'overview', label: 'Vue d\u2019ensemble' },
      { id: 'triangle', label: 'Triangle SOA' },
    ],
  },
  {
    label: 'Principes',
    links: [
      { id: 'principes', label: 'Principes de Thomas Erl' },
      { id: 'orchestration', label: 'Orchestration vs Chor\u00e9graphie' },
      { id: 'contrat', label: 'Contrat de service' },
    ],
  },
  {
    label: 'Impl\u00e9mentation',
    links: [
      { id: 'implementation', label: 'Approche OO' },
      { id: 'esb', label: 'Service Bus (ESB)' },
      { id: 'saga', label: 'Pattern Saga' },
      { id: 'fonctionnelle', label: 'Approche fonctionnelle' },
    ],
  },
  {
    label: 'R\u00e9f\u00e9rences',
    links: [
      { id: 'soa-vs-micro', label: 'SOA vs Microservices' },
      { id: 'quand', label: 'Quand utiliser la SOA ?' },
    ],
  },
]

useHead({
  title: 'SOA \u2014 Service-Oriented Architecture',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'SOA \u2014 Service-Oriented Architecture',
        description:
          'Architecture SOA (Service-Oriented Architecture) : principes de Thomas Erl, ESB, orchestration vs chor\u00e9graphie, pattern Saga, exemples de code TypeScript et comparaison avec les Microservices.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/soa',
        author: {
          '@type': 'Person',
          name: 'Thomas Erl',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Architecture SOA (Service-Oriented Architecture) : principes de Thomas Erl, ESB, orchestration vs chor\u00e9graphie, pattern Saga, exemples de code TypeScript et comparaison avec les Microservices.',
  ogTitle: 'SOA \u2014 Service-Oriented Architecture',
  ogDescription:
    'Architecture SOA (Service-Oriented Architecture) : principes de Thomas Erl, ESB, orchestration vs chor\u00e9graphie, pattern Saga, exemples de code TypeScript et comparaison avec les Microservices.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/soa',
  twitterCard: 'summary_large_image',
  twitterTitle: 'SOA \u2014 Service-Oriented Architecture',
  twitterDescription:
    'Architecture SOA (Service-Oriented Architecture) : principes de Thomas Erl, ESB, orchestration vs chor\u00e9graphie, pattern Saga, exemples de code TypeScript et comparaison avec les Microservices.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="Service-Oriented<br>Architecture"
      :groups="sidebarGroups"
      accent-color="#4a9ee8"
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
      <div class="eyebrow">Architecture Logicielle &middot; Patterns Enterprise</div>
      <h1>Service-Oriented<br><em>Architecture</em></h1>
      <p class="subtitle">
        Concevoir des syst&egrave;mes d&rsquo;information comme un r&eacute;seau de services
        autonomes, interop&eacute;rables et r&eacute;utilisables &mdash; gouvern&eacute;s par des
        contrats formels.
      </p>
    </header>

    <!-- Section 01 : La Metaphore -->
    <section id="metaphore" class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La M&eacute;taphore</h2>
        <div class="section-line" />
      </div>

      <div class="quote-box">
        <span class="quote-icon">&#x1F3DB;&#xFE0F;</span>
        <div class="quote-content">
          <h3>La Ville et ses Administrations</h3>
          <p>
            Imagine une ville avec ses services publics&nbsp;: la mairie, la biblioth&egrave;que, la
            poste, la banque, l&rsquo;h&ocirc;pital. Chaque institution est <em>autonome</em>, a ses
            propres r&egrave;gles internes, mais elles communiquent toutes via un
            <em>langage commun</em> &mdash; formulaires standardis&eacute;s, protocoles officiels.
          </p>
          <p>
            Quand tu veux construire une maison, tu passes par un <em>guichet central</em>
            (l&rsquo;ESB) qui contacte le cadastre, la mairie, le fisc. Chaque service r&eacute;pond
            avec un <em>contrat formel</em> (WSDL ou OpenAPI). Tu re&ccedil;ois une r&eacute;ponse
            consolid&eacute;e. C&rsquo;est exactement ce qu&rsquo;est la SOA.
          </p>
        </div>
      </div>

      <div class="prose">
        <p>
          La <strong>Service-Oriented Architecture</strong> est un style architectural apparu dans
          les ann&eacute;es 2000 pour r&eacute;pondre &agrave; un probl&egrave;me massif dans les
          grandes entreprises&nbsp;: des dizaines de syst&egrave;mes h&eacute;t&eacute;rog&egrave;nes
          (ERP, CRM, legacy COBOL, partenaires B2B) incapables de se parler.
        </p>
        <p>
          L&rsquo;id&eacute;e fondatrice&nbsp;: d&eacute;composer l&rsquo;application en
          <strong>services m&eacute;tier ind&eacute;pendants</strong>, chacun exposant une interface
          publique formelle (son <em>contrat</em>), communicant via un <strong>bus central</strong>
          (l&rsquo;ESB &mdash; Enterprise Service Bus) qui prend en charge le routage, la
          transformation de messages, la s&eacute;curit&eacute; et le monitoring de mani&egrave;re
          transversale.
        </p>
      </div>
    </section>

    <!-- Section 02 : Vue d'ensemble -->
    <section id="overview" class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Vue d&rsquo;ensemble</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Une architecture SOA typique s&rsquo;articule autour de trois zones&nbsp;: les
          <strong>consommateurs</strong> (clients qui appellent les services), l&rsquo;<strong>ESB</strong>
          (le bus qui centralise la communication), et les <strong>services m&eacute;tier</strong>
          (les unit&eacute;s autonomes de logique).
        </p>
      </div>

      <!-- SOA Overview Diagram -->
      <div class="soa-overview">
        <!-- Consommateurs -->
        <div class="soa-consumers-col">
          <div class="soa-col-header">Consommateurs</div>
          <div class="soa-col-body">
            <div
              v-for="node in consumerNodes"
              :key="node.label"
              class="soa-node soa-node-consumer"
            >
              <span class="node-icon">{{ node.icon }}</span> {{ node.label }}
            </div>
          </div>
        </div>

        <!-- ESB -->
        <div class="soa-bus-col">
          <div class="soa-col-header">ESB / Service Bus</div>
          <div class="soa-col-body">
            <div
              v-for="node in busNodes"
              :key="node.label"
              class="soa-node soa-node-bus"
            >
              {{ node.icon }} {{ node.label }}
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="soa-services-col">
          <div class="soa-col-header">Services M&eacute;tier (Business Services)</div>
          <div class="soa-col-body">
            <div class="soa-services-grid">
              <div
                v-for="node in serviceNodesMain"
                :key="node.label"
                class="soa-node soa-node-service"
              >
                <span class="node-icon">{{ node.icon }}</span> {{ node.label }}
              </div>
              <div
                v-for="node in serviceNodesSecondary"
                :key="node.label"
                class="soa-node soa-node-service secondary"
              >
                <span class="node-icon">{{ node.icon }}</span> {{ node.label }}
              </div>
            </div>

            <!-- Registry -->
            <div class="soa-registry">
              &#x1F4D2; Service Registry (UDDI / Annuaire)<br>
              <span class="soa-registry-sub">Discover &middot; Publish &middot; Bind</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rule-banner">
        <strong>R&egrave;gle fondamentale&nbsp;:</strong> tout consommateur communique
        <em>exclusivement</em> via l&rsquo;ESB. Il ne conna&icirc;t jamais l&rsquo;adresse
        r&eacute;seau r&eacute;elle d&rsquo;un service &mdash; seulement son
        <strong>nom de contrat</strong>. L&rsquo;ESB r&eacute;sout, route et transforme de
        mani&egrave;re transparente.
      </div>
    </section>

    <!-- Section 03 : Le Triangle SOA -->
    <section id="triangle" class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">Le Triangle SOA &mdash; Publish / Find / Bind</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Le mod&egrave;le d&rsquo;interaction canonique en SOA repose sur trois acteurs et trois
          op&eacute;rations. C&rsquo;est le protocole de d&eacute;couverte de services &agrave; la
          base de toute l&rsquo;architecture.
        </p>
      </div>

      <div class="triangle-diagram">
        <svg class="tri-arrows" viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arr-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4ae8b0" />
            </marker>
            <marker id="arr-yellow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#e8c84a" />
            </marker>
            <marker id="arr-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4a9ee8" />
            </marker>
          </defs>
          <!-- Publish: Provider -> Registry -->
          <line x1="290" y1="110" x2="170" y2="255" stroke="#4ae8b0" stroke-width="2" marker-end="url(#arr-green)" stroke-dasharray="6,3" />
          <!-- Find: Consumer -> Registry -->
          <line x1="390" y1="255" x2="235" y2="255" stroke="#e8c84a" stroke-width="2" marker-end="url(#arr-yellow)" />
          <!-- Bind: Consumer -> Provider -->
          <line x1="385" y1="248" x2="360" y2="120" stroke="#4a9ee8" stroke-width="2" marker-end="url(#arr-blue)" stroke-dasharray="6,3" />
        </svg>

        <div class="tri-node tri-provider">
          <div class="tri-node-label">Service Provider</div>
          <div class="tri-node-title">Fournisseur</div>
        </div>

        <div class="tri-node tri-registry">
          <div class="tri-node-label">Service Registry</div>
          <div class="tri-node-title">Annuaire<br>UDDI</div>
        </div>

        <div class="tri-node tri-consumer">
          <div class="tri-node-label">Service Consumer</div>
          <div class="tri-node-title">Consommateur</div>
        </div>

        <span class="tri-step-badge tsb-green" style="left:155px; top:175px;">1. Publish</span>
        <span class="tri-step-badge tsb-yellow" style="left:250px; top:265px;">2. Find</span>
        <span class="tri-step-badge tsb-blue" style="left:390px; top:170px;">3. Bind</span>
      </div>

      <div class="info-box">
        <strong>Publish</strong> &mdash; Le fournisseur enregistre son service dans l&rsquo;annuaire
        avec son contrat (WSDL ou OpenAPI).<br>
        <strong>Find</strong> &mdash; Le consommateur interroge l&rsquo;annuaire pour trouver le
        service dont il a besoin.<br>
        <strong>Bind</strong> &mdash; Le consommateur appelle directement le service via le contrat
        d&eacute;couvert (souvent via l&rsquo;ESB).
      </div>
    </section>

    <!-- Section 04 : Les 8 Principes -->
    <section id="principes" class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">Les 8 Principes de Thomas Erl</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Thomas Erl a formalis&eacute; huit principes fondamentaux qui d&eacute;finissent ce
          qu&rsquo;est un <strong>vrai service SOA</strong>. Un service qui viole l&rsquo;un de ces
          principes n&rsquo;est pas un service &mdash; c&rsquo;est une fonction expos&eacute;e sur le
          r&eacute;seau.
        </p>
      </div>

      <div class="principles-grid">
        <div
          v-for="principle in principleCards"
          :key="principle.number"
          class="principle-card"
        >
          <div class="principle-number">{{ principle.number }}</div>
          <div class="principle-body">
            <h4>{{ principle.title }}</h4>
            <p>{{ principle.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 05 : Orchestration vs Choregraphie -->
    <section id="orchestration" class="section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">Orchestration vs Chor&eacute;graphie</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          En SOA, deux mod&egrave;les coexistent pour coordonner plusieurs services dans un processus
          m&eacute;tier. Le choix entre les deux est l&rsquo;une des d&eacute;cisions
          d&rsquo;architecture les plus importantes.
        </p>
      </div>

      <div class="two-col">
        <!-- Orchestration -->
        <div class="orch-box">
          <div class="orch-box-header purple-h">
            &#x1F3BC; Orchestration &mdash; le Chef d&rsquo;orchestre
          </div>
          <div class="orch-box-body">
            <div class="orch-flow">
              <div class="orch-node-central">Orchestrateur<br>(ESB / BPEL / Camunda)</div>
              <div class="orch-arrow-down" />
              <div class="orch-services-row">
                <div class="orch-svc-small">1. Commande</div>
                <div class="orch-svc-small">2. Paiement</div>
                <div class="orch-svc-small">3. Livraison</div>
              </div>
            </div>
            <div class="orch-note">
              <span class="note-ok">&#x2713;</span> Flux visible et facile &agrave; monitorer<br>
              <span class="note-ok">&#x2713;</span> Rollback / compensation centralis&eacute;s<br>
              <span class="note-warn">&#x2717;</span> Point de d&eacute;faillance unique (SPOF)<br>
              <span class="note-warn">&#x2717;</span> Couplage fort &agrave; l&rsquo;orchestrateur<br>
              <div class="orch-tools">Outils : BPEL, Camunda, Activiti, Apache Camel</div>
            </div>
          </div>
        </div>

        <!-- Choregraphie -->
        <div class="orch-box">
          <div class="orch-box-header orange-h">
            &#x1F483; Chor&eacute;graphie &mdash; la Danse collective
          </div>
          <div class="orch-box-body">
            <div class="orch-flow">
              <div class="choreo-event-bus">Event Bus (Kafka / RabbitMQ)</div>
              <div class="choreo-flow">
                <div class="choreo-svc">
                  Svc Commande<br>
                  <span class="choreo-event">&eacute;met: order.created</span>
                </div>
                <div class="choreo-svc">
                  Svc Paiement<br>
                  <span class="choreo-event">r&eacute;agit: order.created</span>
                </div>
                <div class="choreo-svc">
                  Svc Livraison<br>
                  <span class="choreo-event">r&eacute;agit: payment.ok</span>
                </div>
                <div class="choreo-svc">
                  Svc Notif<br>
                  <span class="choreo-event">r&eacute;agit: any event</span>
                </div>
              </div>
            </div>
            <div class="orch-note">
              <span class="note-ok">&#x2713;</span> Pas de SPOF &mdash; tr&egrave;s r&eacute;silient<br>
              <span class="note-ok">&#x2713;</span> Services totalement d&eacute;coupl&eacute;s<br>
              <span class="note-warn">&#x2717;</span> Flux implicite, difficile &agrave; d&eacute;boguer<br>
              <span class="note-warn">&#x2717;</span> Coh&eacute;rence &eacute;ventuelle complexe<br>
              <div class="orch-tools">Outils : Kafka, RabbitMQ, AWS EventBridge</div>
            </div>
          </div>
        </div>
      </div>

      <div class="warn-box">
        <strong>Pi&egrave;ge classique&nbsp;:</strong> l&rsquo;orchestration centralis&eacute;e dans
        l&rsquo;ESB cr&eacute;e souvent un monolithe distribu&eacute;. La logique m&eacute;tier
        migre progressivement dans l&rsquo;ESB au lieu de rester dans les services &mdash;
        r&eacute;sultat&nbsp;: l&rsquo;ESB devient le vrai syst&egrave;me, et les services des
        fa&ccedil;ades vides.
      </div>
    </section>

    <!-- Section 06 : Le Contrat de Service -->
    <section id="contrat" class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Le Contrat de Service</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          En SOA, <strong>le contrat est roi</strong>. Avant d&rsquo;&eacute;crire une ligne
          d&rsquo;impl&eacute;mentation, on d&eacute;finit l&rsquo;interface publique. C&rsquo;est
          l&rsquo;&eacute;quivalent moderne du WSDL &mdash; et c&rsquo;est le seul point de
          couplage autoris&eacute; entre services.
        </p>
      </div>

      <div class="dep-flow">
        <div class="dep-node" style="background:rgba(74,158,232,0.08);border-color:rgba(74,158,232,0.3);color:var(--blue);">
          Consumer<br>App
        </div>
        <div class="dep-arrow-h">
          <span class="arr">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="background:rgba(232,74,122,0.08);border-color:rgba(232,74,122,0.3);color:var(--red);">
          &laquo;interface&raquo;<br>IOrderService
        </div>
        <div class="dep-arrow-h">
          <span class="arr">&larr;</span>
          <span class="arr-txt">impl&eacute;mente</span>
        </div>
        <div class="dep-node" style="background:rgba(74,232,176,0.08);border-color:rgba(74,232,176,0.3);color:var(--green);">
          OrderService<br>(impl.)
        </div>
      </div>

      <div class="code-filename">contracts/service.contracts.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeContract" />
    </section>

    <!-- Section 07 : Implementation -->
    <section id="implementation" class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">Impl&eacute;mentation &mdash; Approche Orient&eacute;e Objet</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Chaque service impl&eacute;mente son contrat de mani&egrave;re autonome.
          L&rsquo;impl&eacute;mentation est un d&eacute;tail &mdash; le contrat est la
          v&eacute;rit&eacute;. NestJS facilite cette approche gr&acirc;ce &agrave; l&rsquo;injection
          de d&eacute;pendances et aux d&eacute;corateurs.
        </p>
      </div>

      <div class="code-filename">order/order.service.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeService" />
    </section>

    <!-- Section 08 : Le Service Bus -->
    <section id="esb" class="section">
      <div class="section-header">
        <span class="section-number">08</span>
        <h2 class="section-title">Le Service Bus &mdash; ESB simplifi&eacute;</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          L&rsquo;ESB est le c&oelig;ur de la SOA. Pour comprendre ce qu&rsquo;il fait, voici un
          <strong>ESB maison en TypeScript</strong> qui impl&eacute;mente les
          responsabilit&eacute;s essentielles&nbsp;: enregistrement, routage, middleware pipeline
          (logging, auth, retry).
        </p>
        <p>
          C&rsquo;est le pattern <strong>Chain of Responsibility</strong> de GoF appliqu&eacute; au
          bus de services.
        </p>
      </div>

      <div class="code-filename">bus/service-bus.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBus" />
    </section>

    <!-- Section 09 : Orchestration / Saga -->
    <section id="saga" class="section">
      <div class="section-header">
        <span class="section-number">09</span>
        <h2 class="section-title">Orchestration &mdash; Pattern Saga avec Compensation</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Dans un syst&egrave;me distribu&eacute;, les transactions ACID n&rsquo;existent plus. Le
          <strong>pattern Saga</strong> remplace la transaction globale par une s&eacute;quence
          d&rsquo;&eacute;tapes locales, chacune associ&eacute;e &agrave; une
          <em>compensation</em> en cas d&rsquo;&eacute;chec &mdash; l&rsquo;&eacute;quivalent
          d&rsquo;un <code>ROLLBACK</code> distribu&eacute;.
        </p>
      </div>

      <!-- Saga layers diagram -->
      <div class="layers-diagram">
        <div
          v-for="layer in sagaRows"
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

      <div class="code-filename">orchestration/place-order.orchestrator.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeOrchestrator" />
    </section>

    <!-- Section 10 : Approche Fonctionnelle -->
    <section id="fonctionnelle" class="section">
      <div class="section-header">
        <span class="section-number">10</span>
        <h2 class="section-title">Approche Fonctionnelle &mdash; Pipeline fp-ts</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          La SOA n&rsquo;est pas r&eacute;serv&eacute;e &agrave; la POO. En programmation
          fonctionnelle, un service est simplement une <strong>fonction pure</strong>
          <code>Input &rarr; TaskEither&lt;Error, Output&gt;</code>. La composition de services
          devient alors un <em>pipeline</em> explicite via <code>pipe</code> et <code>chain</code>.
        </p>
        <p>
          La biblioth&egrave;que <strong>fp-ts</strong> apporte les monades
          <code>TaskEither</code> et <code>Either</code> qui encodent les deux cas &mdash;
          succ&egrave;s et &eacute;chec &mdash; dans le type lui-m&ecirc;me. Plus de
          <code>try/catch</code> implicites.
        </p>
      </div>

      <div class="code-filename">functional/order-pipeline.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeFunctional" />

      <div class="info-box">
        <strong>Avantage cl&eacute;&nbsp;:</strong> dans l&rsquo;approche fonctionnelle,
        l&rsquo;erreur est un <em>citoyen de premi&egrave;re classe du type</em>. Le compilateur
        TypeScript te force &agrave; g&eacute;rer les deux cas. Il est impossible d&rsquo;oublier un
        cas d&rsquo;&eacute;chec &mdash; contrairement aux <code>try/catch</code> o&ugrave;
        l&rsquo;oubli passe silencieusement &agrave; la compilation.
      </div>
    </section>

    <!-- Section 11 : SOA vs Microservices -->
    <section id="soa-vs-micro" class="section">
      <div class="section-header">
        <span class="section-number">11</span>
        <h2 class="section-title">SOA vs Microservices</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          La confusion entre SOA et Microservices est omnipr&eacute;sente. La v&eacute;rit&eacute;&nbsp;:
          les Microservices sont une <strong>&eacute;volution</strong> de la SOA, n&eacute;s du besoin
          de d&eacute;ploiements ind&eacute;pendants et de l&rsquo;essor du Cloud. Ils partagent les
          m&ecirc;mes principes fondamentaux, mais s&rsquo;opposent radicalement sur
          l&rsquo;impl&eacute;mentation.
        </p>
      </div>

      <table class="decision-table">
        <thead>
          <tr>
            <th>Crit&egrave;re</th>
            <th>SOA (2000&ndash;2010)</th>
            <th>Microservices (2010&ndash;aujourd&rsquo;hui)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in decisionRows"
            :key="row.criteria"
          >
            <td>{{ row.criteria }}</td>
            <td>{{ row.soa }}</td>
            <td>{{ row.micro }}</td>
          </tr>
        </tbody>
      </table>

      <div class="quote-box">
        <span class="quote-icon">&#x1F3E2;</span>
        <div class="quote-content">
          <h3>La m&eacute;taphore finale</h3>
          <p>
            La <em>SOA</em> est une grande entreprise structur&eacute;e avec des
            d&eacute;partements bien d&eacute;finis et un secr&eacute;tariat central (l&rsquo;ESB)
            qui filtre toute communication. Les <em>Microservices</em> sont une startup agile
            o&ugrave; chaque petite &eacute;quipe autonome livre directement, sans passer par la
            hi&eacute;rarchie. Les deux sont valides &mdash; &ccedil;a d&eacute;pend de ton
            contexte, de ta maturit&eacute; organisationnelle et de tes contraintes de
            d&eacute;ploiement.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 12 : Quand utiliser la SOA -->
    <section id="quand" class="section">
      <div class="section-header">
        <span class="section-number">12</span>
        <h2 class="section-title">Quand utiliser la SOA ?</h2>
        <div class="section-line" />
      </div>

      <div class="comparison">
        <div class="cmp-col">
          <div class="cmp-header" :class="comparisonGood.headerClass">
            {{ comparisonGood.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in comparisonGood.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: comparisonGood.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
        <div class="cmp-col">
          <div class="cmp-header" :class="comparisonBad.headerClass">
            {{ comparisonBad.headerLabel }}
          </div>
          <div class="cmp-body">
            <div
              v-for="(item, index) in comparisonBad.items"
              :key="index"
              class="cmp-item"
            >
              <div class="cmp-dot" :style="{ background: comparisonBad.dotColor }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.text" />
            </div>
          </div>
        </div>
      </div>

      <div class="rule-banner">
        <strong>R&egrave;gle de Rob Martin appliqu&eacute;e &agrave; la SOA&nbsp;:</strong> chaque
        service doit avoir <em>une seule raison de changer</em> &mdash; son domaine m&eacute;tier.
        Si un service change parce que l&rsquo;ESB change, ou parce que la base de donn&eacute;es
        change, la SOA a &eacute;chou&eacute;. Le Principe de Responsabilit&eacute; Unique
        s&rsquo;applique &agrave; l&rsquo;&eacute;chelle de l&rsquo;architecture, pas seulement du
        code.
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

/* Color variants */
.green  { --card-accent: #4ae8b0; }
.yellow { --card-accent: #e8c84a; }
.blue   { --card-accent: #4a9ee8; }
.purple { --card-accent: #a78bfa; }
.pink   { --card-accent: #e84a7a; }
.orange { --card-accent: #e87a4a; }

/* SOA Overview Diagram */
.soa-overview {
  margin: 40px 0;
  display: grid;
  grid-template-columns: 220px 200px 1fr;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
  min-height: 420px;
}

.soa-col-header {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

.soa-consumers-col {
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.soa-consumers-col .soa-col-header { color: var(--blue); background: rgba(74,158,232,0.06); }

.soa-bus-col {
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  background: rgba(167,139,250,0.03);
}

.soa-bus-col .soa-col-header { color: var(--purple); background: rgba(167,139,250,0.08); }

.soa-services-col {
  display: flex;
  flex-direction: column;
}

.soa-services-col .soa-col-header { color: var(--green); background: rgba(74,232,176,0.06); border-right: none; }

.soa-col-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.soa-node {
  border-radius: 6px;
  padding: 10px 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.03em;
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
  line-height: 1.3;
}

.soa-node-consumer {
  background: rgba(74,158,232,0.07);
  border-color: rgba(74,158,232,0.25);
  color: var(--blue);
}

.soa-node-bus {
  background: rgba(167,139,250,0.08);
  border-color: rgba(167,139,250,0.25);
  color: var(--purple);
  font-size: 0.7rem;
}

.soa-node-service {
  background: rgba(74,232,176,0.07);
  border-color: rgba(74,232,176,0.22);
  color: var(--green);
}

.soa-node-service.secondary {
  background: rgba(232,122,74,0.07);
  border-color: rgba(232,122,74,0.22);
  color: var(--orange);
}

.soa-node .node-icon { font-size: 1rem; flex-shrink: 0; }

.soa-services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.soa-registry {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(232,200,74,0.07);
  border: 1px dashed rgba(232,200,74,0.3);
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  text-align: center;
}

.soa-registry-sub {
  font-size: 0.6rem;
  color: var(--muted);
}

/* Triangle diagram */
.triangle-diagram {
  margin: 40px auto;
  max-width: 680px;
  position: relative;
  height: 360px;
}

.tri-node {
  position: absolute;
  width: 180px;
  padding: 16px 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid;
}

.tri-node-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 4px;
}

.tri-node-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.05rem;
  line-height: 1.2;
}

.tri-provider {
  background: rgba(74,232,176,0.08);
  border-color: rgba(74,232,176,0.35);
  color: var(--green);
  left: 50%; transform: translateX(-50%);
  top: 20px;
}

.tri-registry {
  background: rgba(232,200,74,0.08);
  border-color: rgba(232,200,74,0.35);
  color: var(--accent);
  left: 20px;
  top: 240px;
}

.tri-consumer {
  background: rgba(74,158,232,0.08);
  border-color: rgba(74,158,232,0.35);
  color: var(--blue);
  right: 20px;
  top: 240px;
}

.tri-arrows {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tri-step-badge {
  position: absolute;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 3px;
}

.tsb-green  { background: rgba(74,232,176,0.1);  border: 1px solid rgba(74,232,176,0.3);  color: var(--green);  }
.tsb-yellow { background: rgba(232,200,74,0.1);  border: 1px solid rgba(232,200,74,0.3);  color: var(--accent); }
.tsb-blue   { background: rgba(74,158,232,0.1);  border: 1px solid rgba(74,158,232,0.3);  color: var(--blue);   }

/* Principles grid */
.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin: 28px 0;
}

.principle-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 18px 20px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  transition: border-color 0.2s, transform 0.2s;
  animation: fadeUp 0.4s ease both;
}

.principle-card:hover { border-color: rgba(74,232,176,0.3); transform: translateY(-2px); }

.principle-number {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--accent);
  opacity: 0.4;
  flex-shrink: 0;
  line-height: 1;
  padding-top: 2px;
}

.principle-body h4 {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent2);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.principle-body p {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.55;
}

/* Orchestration vs Choregraphie */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 36px 0;
}

.orch-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.orch-box-header {
  padding: 14px 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.orch-box-header.purple-h { color: var(--purple); background: rgba(167,139,250,0.07); }
.orch-box-header.orange-h { color: var(--orange); background: rgba(232,122,74,0.07); }

.orch-box-body { padding: 20px; }

.orch-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.orch-node-central {
  background: rgba(167,139,250,0.12);
  border: 2px solid rgba(167,139,250,0.4);
  border-radius: 8px;
  padding: 12px 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: var(--purple);
  text-align: center;
  letter-spacing: 0.03em;
  width: 100%;
  max-width: 200px;
  margin-bottom: 6px;
}

.orch-arrow-down {
  width: 1px;
  height: 20px;
  background: var(--border);
  position: relative;
}

.orch-arrow-down::after {
  content: '\25BC';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: var(--muted);
}

.orch-services-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}

.orch-svc-small {
  padding: 8px 12px;
  border-radius: 5px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.03em;
  border: 1px solid;
  text-align: center;
  background: rgba(74,232,176,0.07);
  border-color: rgba(74,232,176,0.22);
  color: var(--green);
}

/* Choreo diagram */
.choreo-flow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  position: relative;
}

.choreo-event-bus {
  grid-column: 1 / -1;
  background: rgba(232,122,74,0.08);
  border: 1px dashed rgba(232,122,74,0.4);
  border-radius: 6px;
  padding: 8px 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  color: var(--orange);
  text-align: center;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.choreo-svc {
  padding: 10px 12px;
  border-radius: 5px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.03em;
  border: 1px solid;
  text-align: center;
  background: rgba(232,200,74,0.07);
  border-color: rgba(232,200,74,0.22);
  color: var(--accent);
}

.choreo-event {
  font-size: 0.55rem;
  opacity: 0.6;
}

.orch-note {
  margin-top: 14px;
  font-size: 0.78rem;
  color: var(--muted);
  line-height: 1.55;
}

.orch-note span {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 3px;
  margin-right: 4px;
}

.note-ok   { background: rgba(74,232,176,0.1);  color: var(--green); }
.note-warn { background: rgba(232,74,122,0.1);  color: var(--red);   }

.orch-tools {
  margin-top: 10px;
  font-size: 0.72rem;
  color: var(--muted);
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
  min-width: 42px;
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
.lf-yellow { color: #e8c84a; border-color: rgba(232,200,74,0.25); background: rgba(232,200,74,0.06); }
.lf-iface  { color: #e84a7a; border-color: rgba(232,74,122,0.25); background: rgba(232,74,122,0.06); }

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
  line-height: 1.55;
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
  white-space: nowrap;
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

.principle-card:nth-child(1) { animation-delay: 0.05s; }
.principle-card:nth-child(2) { animation-delay: 0.10s; }
.principle-card:nth-child(3) { animation-delay: 0.15s; }
.principle-card:nth-child(4) { animation-delay: 0.20s; }
.principle-card:nth-child(5) { animation-delay: 0.25s; }
.principle-card:nth-child(6) { animation-delay: 0.30s; }
.principle-card:nth-child(7) { animation-delay: 0.35s; }
.principle-card:nth-child(8) { animation-delay: 0.40s; }

/* Responsive */
@media (max-width: 900px) {
  .main { margin-left: 0; }
}

@media (max-width: 700px) {
  .comparison { grid-template-columns: 1fr; }
  .two-col    { grid-template-columns: 1fr; }
  .soa-overview { grid-template-columns: 1fr; }
  .soa-services-grid { grid-template-columns: 1fr; }
  .triangle-diagram { height: 480px; }
  .tri-consumer { right: auto; left: 20px; top: 320px; }
  .tri-registry { top: 240px; }
}
</style>
