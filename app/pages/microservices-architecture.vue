<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (comparison cards, service cards, piege cards,
 *          flow steps, decision table rows, sidebar groups) are modeled as typed arrays
 *          and rendered via v-for, while unique prose, SVG diagrams, and code blocks
 *          stay as direct template markup with v-html.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface ComparisonCard {
  icon: string
  colorClass: string
  name: string
  title: string
  desc: string
}

interface ServiceCard {
  icon: string
  colorClass: string
  name: string
  title: string
  desc: string
}

interface GatewayOption {
  icon: string
  colorClass: string
  name: string
  title: string
  desc: string
}

interface GatewayRow {
  feature: string
  nginx: string
  nginxClass: string
  kong: string
  kongClass: string
  aws: string
  awsClass: string
  nestjs: string
  nestjsClass: string
}

interface BrokerRow {
  criteria: string
  rabbitmq: string
  rabbitmqClass?: string
  kafka: string
  kafkaClass?: string
}

interface FlowStep {
  num: string
  numStyle?: string
  text: string
}

interface PiegeCard {
  icon: string
  name: string
  title: string
  desc: string
}

interface MetaTag {
  label: string
  colorClass: string
}

/* ── Sidebar ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'intro', label: 'Monolithe vs microservices' },
      { id: 'metaphore', label: 'La m\u00e9taphore' },
    ],
  },
  {
    label: 'Composants',
    links: [
      { id: 'architecture', label: "Vue d'ensemble" },
      { id: 'gateway', label: 'API Gateway' },
      { id: 'nginx', label: 'Nginx vs NestJS' },
      { id: 'gateway-code', label: 'Gateway en NestJS' },
    ],
  },
  {
    label: 'Services m\u00e9tier',
    links: [
      { id: 'services', label: "Structure d'un service" },
      { id: 'services-code', label: 'Code complet' },
    ],
  },
  {
    label: 'Communication',
    links: [
      { id: 'broker', label: 'Message Broker' },
      { id: 'broker-code', label: 'RabbitMQ + NestJS' },
      { id: 'flow', label: 'Flux complet' },
    ],
  },
  {
    label: 'R\u00e9f\u00e9rences',
    links: [
      { id: 'quand', label: 'Quand adopter ?' },
      { id: 'pieges', label: 'Pi\u00e8ges classiques' },
    ],
  },
]

/* ── Meta tags ── */

const metaTags: MetaTag[] = [
  { label: 'NestJS', colorClass: 'meta-green' },
  { label: 'TypeScript', colorClass: 'meta-green' },
  { label: 'RabbitMQ', colorClass: 'meta-yellow' },
  { label: 'Docker', colorClass: 'meta-blue' },
  { label: 'Nginx', colorClass: 'meta-purple' },
  { label: 'Distributed Systems', colorClass: 'meta-orange' },
]

/* ── Section 01 — Comparison cards ── */

const comparisonCards: ComparisonCard[] = [
  {
    icon: '\u{1F9F1}',
    colorClass: 'pink',
    name: 'Monolithe',
    title: 'Tout dans une seule app',
    desc: "D\u00e9ploiement unique. Si la cuisine prend feu, tout l'h\u00f4tel ferme. Agrandir une salle n\u00e9cessite de r\u00e9nover tout le b\u00e2timent.",
  },
  {
    icon: '\u{1F3D9}\uFE0F',
    colorClass: 'green',
    name: 'Microservices',
    title: 'Services ind\u00e9pendants',
    desc: "Chaque commerce est autonome, a sa propre adresse, sa propre \u00e9quipe, peut ouvrir/fermer sans affecter les voisins.",
  },
]

/* ── Section 04 — Gateway options ── */

const gatewayOptions: GatewayOption[] = [
  {
    icon: '\u2699\uFE0F',
    colorClass: 'yellow',
    name: 'Option A',
    title: 'Outil d\u00e9di\u00e9 \u2014 Kong / Nginx',
    desc: 'Configuration d\u00e9clarative YAML. Z\u00e9ro code m\u00e9tier. Id\u00e9al quand on veut moins de choses \u00e0 maintenir.',
  },
  {
    icon: '\u{1F527}',
    colorClass: 'purple',
    name: 'Option B',
    title: 'Application NestJS custom',
    desc: 'Code TypeScript complet. Guards, Interceptors, Pipes. Id\u00e9al pour la logique m\u00e9tier fine au niveau du routing.',
  },
]

const gatewayRows: GatewayRow[] = [
  { feature: 'Reverse proxy / routing', nginx: '\u2713', nginxClass: 'dt-ok', kong: '\u2713', kongClass: 'dt-ok', aws: '\u2713', awsClass: 'dt-ok', nestjs: '\u2713', nestjsClass: 'dt-ok' },
  { feature: 'TLS / HTTPS termination', nginx: '\u2713', nginxClass: 'dt-ok', kong: '\u2713', kongClass: 'dt-ok', aws: '\u2713', awsClass: 'dt-ok', nestjs: '\u2713', nestjsClass: 'dt-ok' },
  { feature: 'Rate limiting', nginx: 'basique', nginxClass: 'dt-warn', kong: '\u2713', kongClass: 'dt-ok', aws: '\u2713', awsClass: 'dt-ok', nestjs: '\u2713', nestjsClass: 'dt-ok' },
  { feature: 'Auth JWT / OAuth', nginx: '\u2717', nginxClass: 'dt-no', kong: 'plugin', kongClass: 'dt-warn', aws: '\u2713', awsClass: 'dt-ok', nestjs: '\u2713 Guard', nestjsClass: 'dt-ok' },
  { feature: 'Logique m\u00e9tier custom', nginx: '\u2717', nginxClass: 'dt-no', kong: 'limit\u00e9', kongClass: 'dt-warn', aws: 'limit\u00e9', awsClass: 'dt-warn', nestjs: '\u2713 full TS', nestjsClass: 'dt-ok' },
  { feature: 'Maintenance / ops', nginx: 'simple', nginxClass: 'dt-ok', kong: 'mod\u00e9r\u00e9e', kongClass: 'dt-warn', aws: 'mod\u00e9r\u00e9e', awsClass: 'dt-warn', nestjs: 'tu g\u00e8res tout', nestjsClass: 'dt-no' },
]

/* ── Section 07 — Service cards ── */

const serviceCards: ServiceCard[] = [
  {
    icon: '\u{1F6AB}',
    colorClass: 'pink',
    name: 'Ne fait pas',
    title: "Pas d'auth, pas de JWT",
    desc: "Il fait confiance au header x-user-id inject\u00e9 par le Gateway. L'auth est d\u00e9j\u00e0 v\u00e9rifi\u00e9e en amont.",
  },
  {
    icon: '\u{1F6AB}',
    colorClass: 'pink',
    name: 'Ne fait pas',
    title: "Pas d'import d'autres services",
    desc: "Jamais import CatalogueService. La communication passe par HTTP ou par events \u2014 jamais par import direct.",
  },
  {
    icon: '\u2705',
    colorClass: 'green',
    name: 'Fait',
    title: 'Sa propre base de donn\u00e9es',
    desc: 'Chaque service poss\u00e8de sa DB isol\u00e9e. Le service Auth peut changer son sch\u00e9ma sans casser les autres.',
  },
  {
    icon: '\u2705',
    colorClass: 'green',
    name: 'Fait',
    title: '\u00c9met des events',
    desc: "Apr\u00e8s chaque action importante, il publie un event sur le broker. Il ne sait pas qui l'\u00e9coutera.",
  },
]

/* ── Section 09 — Broker comparison ── */

const brokerRows: BrokerRow[] = [
  { criteria: 'Mod\u00e8le', rabbitmq: 'Queue \u2014 message supprim\u00e9 apr\u00e8s lecture', kafka: 'Log \u2014 message conserv\u00e9, offset par consommateur' },
  { criteria: 'Volume', rabbitmq: 'Des milliers de msg/s', kafka: 'Des millions de msg/s' },
  { criteria: 'Replay', rabbitmq: 'Non', rabbitmqClass: 'dt-no', kafka: 'Oui \u2014 rejouer l\u2019historique', kafkaClass: 'dt-ok' },
  { criteria: 'Complexit\u00e9 ops', rabbitmq: 'Simple', rabbitmqClass: 'dt-ok', kafka: '\u00c9lev\u00e9e (ZooKeeper/KRaft)', kafkaClass: 'dt-warn' },
  { criteria: "Cas d'usage", rabbitmq: 'Projets standards, microservices classiques', kafka: 'Analytics, event sourcing, tr\u00e8s haut volume' },
]

/* ── Section 12 — Flow steps ── */

const flowSteps: FlowStep[] = [
  {
    num: '1',
    text: '<strong>Projet solo ou petite \u00e9quipe (&lt;5 personnes)</strong> \u2014 reste sur le monolithe. La complexit\u00e9 op\u00e9rationnelle des microservices est disproportionn\u00e9e.',
  },
  {
    num: '2',
    numStyle: 'background: var(--cyan, #22d3ee); color: var(--bg);',
    text: '<strong>\u00c9quipes qui grossissent</strong> \u2014 le monolithe devient un goulot organisationnel autant que technique. Les \u00e9quipes se bloquent mutuellement au d\u00e9ploiement.',
  },
  {
    num: '3',
    numStyle: 'background: var(--accent);',
    text: '<strong>Besoin de scalabilit\u00e9 diff\u00e9renci\u00e9e</strong> \u2014 Netflix scale son service streaming \u00d7100 sans toucher \u00e0 la facturation. Impossible en monolithe.',
  },
  {
    num: '4',
    numStyle: 'background: var(--orange);',
    text: '<strong>D\u00e9ploiement continu \u00e0 grande \u00e9chelle</strong> \u2014 Amazon d\u00e9ploie en production des milliers de fois par jour. Chaque \u00e9quipe pousse son service ind\u00e9pendamment.',
  },
]

/* ── Section 13 — Pieges cards ── */

const piegeCards: PiegeCard[] = [
  {
    icon: '\u{1F4A5}',
    name: 'Pi\u00e8ge 01',
    title: 'Explosion de la complexit\u00e9 ops',
    desc: 'Tu \u00e9changes les bugs de code contre des bugs r\u00e9seau et de configuration distribu\u00e9e. Chaque service = un processus, une DB, une config \u00e0 monitorer.',
  },
  {
    icon: '\u{1F504}',
    name: 'Pi\u00e8ge 02',
    title: 'Transactions distribu\u00e9es',
    desc: "Sans transaction ACID multi-services, tu dois impl\u00e9menter des patterns comme <strong>SAGA</strong> ou <strong>2PC</strong>. C'est complexe et source d'incoh\u00e9rences.",
  },
  {
    icon: '\u23F1\uFE0F',
    name: 'Pi\u00e8ge 03',
    title: 'Latence en cascade',
    desc: "5 appels HTTP synchrones en cha\u00eene = 5\u00d7 les d\u00e9lais r\u00e9seau. Un service lent d\u00e9grade toute la cha\u00eene sans circuit breaker.",
  },
  {
    icon: '\u{1F480}',
    name: 'Pi\u00e8ge 04',
    title: 'Death star diagram',
    desc: "Quand chaque service appelle tous les autres sans discipline, tu recr\u00e9\u00e9s un monolithe distribu\u00e9 \u2014 le pire des deux mondes.",
  },
]

/* ── Code blocks (v-html) ── */

const codeNginx = `<span class="cm"># Nginx comme API Gateway basique</span>
http {
  <span class="cm"># Rate limiting : max 10 req/s par IP</span>
  <span class="kw">limit_req_zone</span> $binary_remote_addr <span class="fn">zone</span>=api:10m <span class="fn">rate</span>=<span class="num">10r/s</span>;

  server {
    <span class="kw">listen</span> <span class="num">80</span>;

    <span class="cm"># /orders/** \u2192 service Commandes</span>
    <span class="kw">location</span> /orders/ {
      <span class="kw">limit_req</span> <span class="fn">zone</span>=api <span class="fn">burst</span>=<span class="num">20</span>;
      <span class="kw">proxy_pass</span> <span class="str">http://orders-service:3001</span>; <span class="cm">\u2190 reverse proxy</span>
      <span class="kw">proxy_set_header</span> X-Real-IP $remote_addr;
    }

    <span class="cm"># /users/** \u2192 service Users</span>
    <span class="kw">location</span> /users/ {
      <span class="kw">proxy_pass</span> <span class="str">http://users-service:3002</span>;
    }
  }
}`

const codeGatewayController = `<span class="dec">@Controller</span>()
<span class="kw">export class</span> <span class="ty">GatewayController</span> {
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> proxy: <span class="ty">ProxyService</span>) {}

  <span class="dec">@All</span>(<span class="str">'orders/*'</span>)
  <span class="dec">@UseGuards</span>(<span class="ty">AuthGuard</span>)   <span class="cm">// v\u00e9rifie JWT \u2014 seul endroit o\u00f9 c'est fait</span>
  <span class="dec">@UseInterceptors</span>(<span class="ty">LoggingInterceptor</span>)
  <span class="kw">async</span> <span class="fn">proxyOrders</span>(
    <span class="dec">@Req</span>() req: <span class="ty">Request</span>,
    <span class="dec">@Res</span>() res: <span class="ty">Response</span>,
    <span class="dec">@User</span>() user: <span class="ty">JwtPayload</span>,
  ) {
    <span class="kw">return</span> <span class="kw">this</span>.proxy.<span class="fn">forward</span>(req, res, {
      target: <span class="str">'http://orders-service:3001'</span>,
      headers: { <span class="str">'x-user-id'</span>: user.id }, <span class="cm">// enrichit la requ\u00eate</span>
    });
  }

  <span class="dec">@Post</span>(<span class="str">'auth/login'</span>) <span class="cm">// route publique \u2014 pas de Guard</span>
  <span class="kw">async</span> <span class="fn">login</span>(<span class="dec">@Req</span>() req, <span class="dec">@Res</span>() res) {
    <span class="kw">return</span> <span class="kw">this</span>.proxy.<span class="fn">forward</span>(req, res, {
      target: <span class="str">'http://auth-service:3003'</span>,
    });
  }
}`

const codeAuthGuard = `<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="ty">AuthGuard</span> <span class="kw">implements</span> <span class="ty">CanActivate</span> {
  <span class="kw">constructor</span>(<span class="kw">private</span> jwt: <span class="ty">JwtService</span>) {}

  <span class="fn">canActivate</span>(ctx: <span class="ty">ExecutionContext</span>): <span class="kw">boolean</span> {
    <span class="kw">const</span> req = ctx.<span class="fn">switchToHttp</span>().<span class="fn">getRequest</span>();
    <span class="kw">const</span> token = req.headers.authorization?.<span class="fn">split</span>(<span class="str">' '</span>)[<span class="num">1</span>];
    <span class="kw">if</span> (!token) <span class="kw">throw new</span> <span class="ty">UnauthorizedException</span>();

    <span class="kw">try</span> {
      <span class="cm">// Gateway = SEUL point de v\u00e9rification JWT</span>
      <span class="cm">// Les services downstream font confiance \u00e0 x-user-id</span>
      req.user = <span class="kw">this</span>.jwt.<span class="fn">verify</span>(token);
      <span class="kw">return true</span>;
    } <span class="kw">catch</span> {
      <span class="kw">throw new</span> <span class="ty">UnauthorizedException</span>(<span class="str">'Invalid or expired token'</span>);
    }
  }
}`

const codeEntity = `<span class="dec">@Entity</span>(<span class="str">'orders'</span>)
<span class="kw">export class</span> <span class="ty">Order</span> {
  <span class="dec">@PrimaryGeneratedColumn</span>(<span class="str">'uuid'</span>)
  id: <span class="kw">string</span>;

  <span class="dec">@Column</span>()
  userId: <span class="kw">string</span>; <span class="cm">// pas de FK vers User \u2014 juste l'ID</span>

  <span class="dec">@Column</span>(<span class="str">'jsonb'</span>)
  items: <span class="ty">OrderItem</span>[];

  <span class="dec">@Column</span>({ type: <span class="str">'enum'</span>, enum: <span class="ty">OrderStatus</span>, default: <span class="ty">OrderStatus</span>.PENDING })
  status: <span class="ty">OrderStatus</span>;

  <span class="dec">@Column</span>(<span class="str">'decimal'</span>)
  total: <span class="kw">number</span>;
}`

const codeOrdersService = `<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="ty">OrdersService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@InjectRepository</span>(<span class="ty">Order</span>) <span class="kw">private readonly</span> repo: <span class="ty">Repository</span>&lt;<span class="ty">Order</span>&gt;,
    <span class="kw">private readonly</span> events: <span class="ty">OrdersEventsService</span>,
  ) {}

  <span class="kw">async</span> <span class="fn">create</span>(dto: <span class="ty">CreateOrderDto</span>, userId: <span class="kw">string</span>): <span class="ty">Promise</span>&lt;<span class="ty">Order</span>&gt; {
    <span class="kw">const</span> total = dto.items.<span class="fn">reduce</span>((sum, i) => sum + i.price * i.qty, <span class="num">0</span>);
    <span class="kw">const</span> order = <span class="kw">await</span> <span class="kw">this</span>.repo.<span class="fn">save</span>(<span class="kw">this</span>.repo.<span class="fn">create</span>({ ...dto, userId, total }));

    <span class="cm">// fire-and-forget \u2014 on ne sait pas qui va consommer cet event</span>
    <span class="kw">await</span> <span class="kw">this</span>.events.<span class="fn">emit</span>(<span class="str">'order.created'</span>, {
      orderId: order.id, userId, total, items: dto.items,
    });

    <span class="kw">return</span> order; <span class="cm">// r\u00e9pond AVANT que Paiement ou Notifs aient trait\u00e9</span>
  }
}`

const codeDocker = `<span class="kw">services</span>:
  <span class="fn">orders-service</span>:
    build: ./orders-service
    <span class="kw">ports</span>:
      - <span class="str">"3001:3001"</span>  <span class="cm"># expose HTTP \u2014 re\u00e7oit du Gateway</span>
    environment:
      <span class="fn">RABBITMQ_URL</span>: <span class="str">amqp://rabbitmq:5672</span>
      <span class="fn">DB_HOST</span>: <span class="str">orders-db</span>

  <span class="fn">payments-service</span>:
    build: ./payments-service
    <span class="cm"># \u2190 pas de ports: \u2014 aucune exposition HTTP</span>
    <span class="cm">#   \u00e9coute uniquement RabbitMQ</span>
    environment:
      <span class="fn">RABBITMQ_URL</span>: <span class="str">amqp://rabbitmq:5672</span>

  <span class="fn">orders-db</span>:
    image: <span class="str">postgres:16</span>
    <span class="cm"># DB priv\u00e9e \u2014 aucun autre service n'y a acc\u00e8s</span>`

const codeBrokerProducer = `<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="ty">OrdersEventsService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@Inject</span>(<span class="str">'BROKER'</span>) <span class="kw">private readonly</span> client: <span class="ty">ClientProxy</span>,
  ) {}

  <span class="kw">async</span> <span class="fn">emit</span>(pattern: <span class="kw">string</span>, payload: <span class="kw">unknown</span>): <span class="ty">Promise</span>&lt;<span class="kw">void</span>&gt; {
    <span class="cm">// fire-and-forget : on n'attend pas de r\u00e9ponse</span>
    <span class="kw">this</span>.client.<span class="fn">emit</span>(pattern, payload);
  }
}`

const codeBrokerConsumer = `<span class="dec">@Controller</span>()
<span class="kw">export class</span> <span class="ty">PaymentsController</span> {
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> svc: <span class="ty">PaymentsService</span>) {}

  <span class="cm">// \u00e9coute l'event \u2014 sans rien changer dans orders-service</span>
  <span class="dec">@EventPattern</span>(<span class="str">'order.created'</span>)
  <span class="kw">async</span> <span class="fn">handleOrderCreated</span>(
    <span class="dec">@Payload</span>() data: { orderId: <span class="kw">string</span>; userId: <span class="kw">string</span>; total: <span class="kw">number</span> },
  ) {
    <span class="kw">await</span> <span class="kw">this</span>.svc.<span class="fn">processPayment</span>(data);
  }
}

<span class="cm">// notifications.controller.ts \u2014 \u00e9coute le M\u00caME event en parall\u00e8le</span>
<span class="dec">@EventPattern</span>(<span class="str">'order.created'</span>)
<span class="kw">async</span> <span class="fn">handleOrderCreated</span>(<span class="dec">@Payload</span>() data) {
  <span class="kw">await</span> <span class="kw">this</span>.svc.<span class="fn">sendConfirmationEmail</span>(data);
}`

const codeBrokerMain = `<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="cm">// createMicroservice au lieu de create \u2192 \u00e9coute le broker, pas HTTP</span>
  <span class="kw">const</span> app = <span class="kw">await</span> <span class="ty">NestFactory</span>.<span class="fn">createMicroservice</span>&lt;<span class="ty">MicroserviceOptions</span>&gt;(
    <span class="ty">AppModule</span>,
    {
      transport: <span class="ty">Transport</span>.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: <span class="str">'events_queue'</span>,
      },
    },
  );
  <span class="kw">await</span> app.<span class="fn">listen</span>(); <span class="cm">// tourne en permanence, aucun port expos\u00e9</span>
}`

/* ── SEO ── */

useHead({
  title: 'Architecture Microservices \u2014 Guide Complet',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Architecture Microservices \u2014 Guide Complet',
        description:
          'Du monolithe au syst\u00e8me distribu\u00e9 \u2014 sch\u00e9mas, m\u00e9taphores et code NestJS concret pour comprendre chaque composant : Gateway, services m\u00e9tier, Message Broker.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/microservices-architecture',
        author: [
          { '@type': 'Person', name: 'Sam Newman' },
          { '@type': 'Person', name: 'Martin Fowler' },
        ],
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Du monolithe au syst\u00e8me distribu\u00e9 \u2014 sch\u00e9mas, m\u00e9taphores et code NestJS concret pour comprendre chaque composant : Gateway, services m\u00e9tier, Message Broker.',
  ogTitle: 'Architecture Microservices \u2014 Guide Complet',
  ogDescription:
    'Du monolithe au syst\u00e8me distribu\u00e9 \u2014 sch\u00e9mas, m\u00e9taphores et code NestJS concret pour comprendre chaque composant : Gateway, services m\u00e9tier, Message Broker.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/microservices-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Architecture Microservices \u2014 Guide Complet',
  twitterDescription:
    'Du monolithe au syst\u00e8me distribu\u00e9 \u2014 sch\u00e9mas, m\u00e9taphores et code NestJS concret pour comprendre chaque composant : Gateway, services m\u00e9tier, Message Broker.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="Architecture<br>Microservices"
      :groups="sidebarGroups"
      accent-color="#e8c84a"
    />

    <main class="main">
      <div class="content">
        <!-- Back link -->
        <nav>
          <NuxtLink to="/" class="back-link">
            Architectures Logicielles
          </NuxtLink>
        </nav>

        <!-- Header -->
        <header>
          <div class="eyebrow">// Architecture Distribu&eacute;e &mdash; Sam Newman &middot; Martin Fowler</div>
          <h1>Architecture<br><em>Microservices</em></h1>
          <p class="subtitle">Du monolithe au syst&egrave;me distribu&eacute; &mdash; sch&eacute;mas, m&eacute;taphores et code NestJS concret pour comprendre chaque composant&nbsp;: Gateway, services m&eacute;tier, Message Broker.</p>
          <div class="meta-tags">
            <span
              v-for="tag in metaTags"
              :key="tag.label"
              class="meta-tag"
              :class="tag.colorClass"
            >{{ tag.label }}</span>
          </div>
        </header>

        <!-- ══ 01 — INTRO ══ -->
        <section id="intro" class="section">
          <div class="section-header">
            <span class="section-number">01</span>
            <h2 class="section-title">Monolithe vs Microservices</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>L'architecture microservices consiste &agrave; d&eacute;couper une application en <strong>services ind&eacute;pendants</strong> qui communiquent entre eux. Pour comprendre pourquoi, il faut partir de son oppos&eacute;&nbsp;: le monolithe.</p>
          </div>

          <!-- SVG Diagram: Monolithe vs Microservices -->
          <div class="diagram-wrap">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <svg viewBox="0 0 820 320" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Mono',monospace">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#4ae8b0" stroke-width="1.5" stroke-linecap="round" />
                </marker>
              </defs>
              <!-- MONOLITH -->
              <text x="185" y="22" text-anchor="middle" fill="#6a7090" font-size="11" font-weight="600" letter-spacing="3">MONOLITHE</text>
              <rect x="40" y="34" width="290" height="256" rx="10" fill="#0a0c10" stroke="#e84a7a" stroke-width="1" stroke-dasharray="4 3" />
              <text x="185" y="58" text-anchor="middle" fill="#6a7090" font-size="11">Une seule application d&eacute;ploy&eacute;e</text>
              <rect x="64" y="68" width="242" height="42" rx="6" fill="#13161e" stroke="#1e2330" stroke-width="1" />
              <text x="185" y="87" text-anchor="middle" fill="#f0f2fa" font-size="13" font-weight="500">Auth</text>
              <text x="185" y="102" text-anchor="middle" fill="#6a7090" font-size="11">+ Users + Paiement</text>
              <rect x="64" y="122" width="242" height="42" rx="6" fill="#13161e" stroke="#1e2330" stroke-width="1" />
              <text x="185" y="141" text-anchor="middle" fill="#f0f2fa" font-size="13" font-weight="500">Catalogue</text>
              <text x="185" y="156" text-anchor="middle" fill="#6a7090" font-size="11">+ Commandes + Stock</text>
              <rect x="64" y="176" width="242" height="42" rx="6" fill="#13161e" stroke="#1e2330" stroke-width="1" />
              <text x="185" y="195" text-anchor="middle" fill="#f0f2fa" font-size="13" font-weight="500">Notifications</text>
              <text x="185" y="210" text-anchor="middle" fill="#6a7090" font-size="11">+ Emails + Push</text>
              <rect x="64" y="232" width="242" height="38" rx="6" fill="#13161e" stroke="#1e2330" stroke-width="1" />
              <text x="185" y="255" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">1 seule base de donn&eacute;es</text>
              <!-- MICROSERVICES -->
              <text x="620" y="22" text-anchor="middle" fill="#6a7090" font-size="11" font-weight="600" letter-spacing="3">MICROSERVICES</text>
              <rect x="440" y="34" width="128" height="42" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="504" y="53" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Auth</text>
              <text x="504" y="68" text-anchor="middle" fill="#6a7090" font-size="10">service</text>
              <rect x="584" y="34" width="128" height="42" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="648" y="53" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Users</text>
              <text x="648" y="68" text-anchor="middle" fill="#6a7090" font-size="10">service</text>
              <rect x="440" y="94" width="128" height="42" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="504" y="113" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Catalogue</text>
              <text x="504" y="128" text-anchor="middle" fill="#6a7090" font-size="10">service</text>
              <rect x="584" y="94" width="128" height="42" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="648" y="113" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Commandes</text>
              <text x="648" y="128" text-anchor="middle" fill="#6a7090" font-size="10">service</text>
              <rect x="440" y="154" width="128" height="42" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="504" y="173" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Paiement</text>
              <text x="504" y="188" text-anchor="middle" fill="#6a7090" font-size="10">service</text>
              <rect x="584" y="154" width="128" height="42" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="648" y="173" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Notifs</text>
              <text x="648" y="188" text-anchor="middle" fill="#6a7090" font-size="10">service</text>
              <rect x="444" y="214" width="56" height="24" rx="4" fill="#13161e" stroke="#1e2330" />
              <text x="472" y="231" text-anchor="middle" fill="#6a7090" font-size="10">DB</text>
              <rect x="508" y="214" width="56" height="24" rx="4" fill="#13161e" stroke="#1e2330" />
              <text x="536" y="231" text-anchor="middle" fill="#6a7090" font-size="10">DB</text>
              <rect x="572" y="214" width="56" height="24" rx="4" fill="#13161e" stroke="#1e2330" />
              <text x="600" y="231" text-anchor="middle" fill="#6a7090" font-size="10">DB</text>
              <rect x="636" y="214" width="56" height="24" rx="4" fill="#13161e" stroke="#1e2330" />
              <text x="664" y="231" text-anchor="middle" fill="#6a7090" font-size="10">DB</text>
              <text x="576" y="268" text-anchor="middle" fill="#6a7090" font-size="11">Chaque service a sa propre DB</text>
              <line x1="568" y1="55" x2="584" y2="55" stroke="#1e2330" stroke-width="1" stroke-dasharray="3 2" />
              <line x1="568" y1="115" x2="584" y2="115" stroke="#1e2330" stroke-width="1" stroke-dasharray="3 2" />
              <line x1="568" y1="175" x2="584" y2="175" stroke="#1e2330" stroke-width="1" stroke-dasharray="3 2" />
              <line x1="400" y1="20" x2="400" y2="300" stroke="#1e2330" stroke-width="1" stroke-dasharray="5 4" />
            </svg>
            <div class="diagram-caption">fig. 1 &mdash; monolithe vs architecture microservices</div>
          </div>

          <div class="cards cards-2col">
            <div
              v-for="card in comparisonCards"
              :key="card.name"
              class="card"
              :class="card.colorClass"
            >
              <span class="card-icon">{{ card.icon }}</span>
              <div class="card-name">{{ card.name }}</div>
              <div class="card-title">{{ card.title }}</div>
              <div class="card-desc">{{ card.desc }}</div>
            </div>
          </div>
        </section>

        <!-- ══ 02 — METAPHORE ══ -->
        <section id="metaphore" class="section">
          <div class="section-header">
            <span class="section-number">02</span>
            <h2 class="section-title">La M&eacute;taphore fondatrice</h2>
            <div class="section-line" />
          </div>

          <div class="quote-box">
            <div class="quote-icon">&#x1F3EC;</div>
            <div class="quote-content">
              <h3>Le Centre Commercial</h3>
              <p>Imagine un <strong>grand centre commercial</strong>. Chaque boutique est autonome&nbsp;: elle g&egrave;re ses propres stocks, ses propres employ&eacute;s, ses propres horaires. La librairie peut faire des travaux sans fermer la boulangerie. Si la boutique de t&eacute;l&eacute;phones conna&icirc;t un rush, on ajoute des vendeurs sans toucher aux autres.</p>
              <p>Le <strong>hall d'entr&eacute;e</strong> est l'API Gateway&nbsp;: tout le monde passe par l&agrave;, on v&eacute;rifie les sacs (auth), on indique o&ugrave; aller (routing). Les boutiques communiquent parfois par <em>interphone</em> (HTTP sync) ou d&eacute;posent des <em>messages en caisse centrale</em> (broker async) que les autres r&eacute;cup&egrave;rent quand elles sont disponibles.</p>
            </div>
          </div>

          <div class="prose">
            <p>Cette m&eacute;taphore capture les trois principes fondamentaux des microservices&nbsp;: <strong>l'autonomie de d&eacute;ploiement</strong> (chaque service se d&eacute;ploie ind&eacute;pendamment), <strong>l'isolation des donn&eacute;es</strong> (chaque boutique g&egrave;re son propre stock), et <strong>la communication d&eacute;coupl&eacute;e</strong> (les boutiques ne partagent pas de caisse commune).</p>
          </div>
        </section>

        <!-- ══ 03 — ARCHITECTURE GLOBALE ══ -->
        <section id="architecture" class="section">
          <div class="section-header">
            <span class="section-number">03</span>
            <h2 class="section-title">Vue d'ensemble &mdash; Architecture compl&egrave;te</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>Une architecture microservices en production se compose de plusieurs couches distinctes. Chaque couche a une responsabilit&eacute; pr&eacute;cise.</p>
          </div>

          <div class="diagram-wrap">
            <svg viewBox="0 0 820 580" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Mono',monospace">
              <defs>
                <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#4a5568" stroke-width="1.5" stroke-linecap="round" />
                </marker>
              </defs>
              <!-- CLIENTS -->
              <text x="410" y="18" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="3">CLIENTS</text>
              <rect x="110" y="26" width="108" height="38" rx="8" fill="#13161e" stroke="#1e2330" />
              <text x="164" y="44" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Web App</text>
              <text x="164" y="57" text-anchor="middle" fill="#6a7090" font-size="10">React / Vue</text>
              <rect x="356" y="26" width="108" height="38" rx="8" fill="#13161e" stroke="#1e2330" />
              <text x="410" y="44" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Mobile</text>
              <text x="410" y="57" text-anchor="middle" fill="#6a7090" font-size="10">iOS / Android</text>
              <rect x="602" y="26" width="108" height="38" rx="8" fill="#13161e" stroke="#1e2330" />
              <text x="656" y="44" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">API tiers</text>
              <text x="656" y="57" text-anchor="middle" fill="#6a7090" font-size="10">Partenaires</text>
              <line x1="164" y1="64" x2="290" y2="104" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <line x1="410" y1="64" x2="410" y2="104" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <line x1="656" y1="64" x2="530" y2="104" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <!-- API GATEWAY -->
              <text x="410" y="100" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="3">API GATEWAY</text>
              <rect x="180" y="108" width="460" height="48" rx="10" fill="#0a0c10" stroke="#a78bfa" stroke-width="1.5" />
              <text x="410" y="129" text-anchor="middle" fill="#f0f2fa" font-size="13" font-weight="500">API Gateway</text>
              <text x="410" y="146" text-anchor="middle" fill="#6a7090" font-size="11">Auth &middot; Rate limiting &middot; Routing &middot; Load balancing</text>
              <line x1="260" y1="156" x2="178" y2="198" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <line x1="310" y1="156" x2="318" y2="198" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <line x1="370" y1="156" x2="418" y2="198" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <line x1="460" y1="156" x2="548" y2="198" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <line x1="510" y1="156" x2="658" y2="198" stroke="#4a5568" stroke-width="1" marker-end="url(#arr2)" />
              <!-- SERVICES -->
              <text x="410" y="194" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="3">SERVICES M&Eacute;TIER</text>
              <rect x="76" y="202" width="118" height="46" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="135" y="222" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Auth</text>
              <text x="135" y="237" text-anchor="middle" fill="#6a7090" font-size="10">JWT &middot; sessions</text>
              <rect x="206" y="202" width="118" height="46" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="265" y="222" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Users</text>
              <text x="265" y="237" text-anchor="middle" fill="#6a7090" font-size="10">Profils &middot; r&ocirc;les</text>
              <rect x="336" y="202" width="148" height="46" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="410" y="222" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Commandes</text>
              <text x="410" y="237" text-anchor="middle" fill="#6a7090" font-size="10">CRUD &middot; statuts</text>
              <rect x="496" y="202" width="118" height="46" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="555" y="222" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Paiement</text>
              <text x="555" y="237" text-anchor="middle" fill="#6a7090" font-size="10">Stripe &middot; facturation</text>
              <rect x="626" y="202" width="118" height="46" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" />
              <text x="685" y="222" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Notifs</text>
              <text x="685" y="237" text-anchor="middle" fill="#6a7090" font-size="10">Email &middot; push &middot; SMS</text>
              <line x1="135" y1="248" x2="200" y2="284" stroke="#4a5568" stroke-width="0.8" stroke-dasharray="3 2" />
              <line x1="265" y1="248" x2="290" y2="284" stroke="#4a5568" stroke-width="0.8" stroke-dasharray="3 2" />
              <line x1="410" y1="248" x2="410" y2="284" stroke="#4a5568" stroke-width="0.8" stroke-dasharray="3 2" />
              <line x1="555" y1="248" x2="520" y2="284" stroke="#4a5568" stroke-width="0.8" stroke-dasharray="3 2" />
              <line x1="685" y1="248" x2="620" y2="284" stroke="#4a5568" stroke-width="0.8" stroke-dasharray="3 2" />
              <!-- BROKER -->
              <text x="410" y="280" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="3">COMMUNICATION ASYNC</text>
              <rect x="176" y="286" width="468" height="42" rx="8" fill="#0a0c10" stroke="#e8c84a" stroke-width="1.5" />
              <text x="410" y="305" text-anchor="middle" fill="#f0f2fa" font-size="13" font-weight="500">Message Broker</text>
              <text x="410" y="320" text-anchor="middle" fill="#6a7090" font-size="11">Kafka &middot; RabbitMQ &mdash; &eacute;v&eacute;nements asynchrones</text>
              <line x1="135" y1="248" x2="135" y2="354" stroke="#1e2330" stroke-width="0.8" />
              <line x1="265" y1="248" x2="265" y2="354" stroke="#1e2330" stroke-width="0.8" />
              <line x1="410" y1="248" x2="410" y2="354" stroke="#1e2330" stroke-width="0.8" />
              <line x1="555" y1="248" x2="555" y2="354" stroke="#1e2330" stroke-width="0.8" />
              <line x1="685" y1="248" x2="685" y2="354" stroke="#1e2330" stroke-width="0.8" />
              <!-- DATABASES -->
              <text x="410" y="350" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="3">PERSISTENCE &mdash; 1 DB PAR SERVICE</text>
              <rect x="75" y="356" width="120" height="38" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="135" y="373" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">Postgres</text>
              <text x="135" y="386" text-anchor="middle" fill="#6a7090" font-size="10">users / auth</text>
              <rect x="205" y="356" width="120" height="38" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="265" y="373" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">Postgres</text>
              <text x="265" y="386" text-anchor="middle" fill="#6a7090" font-size="10">users data</text>
              <rect x="350" y="356" width="120" height="38" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="410" y="373" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">MongoDB</text>
              <text x="410" y="386" text-anchor="middle" fill="#6a7090" font-size="10">commandes</text>
              <rect x="495" y="356" width="120" height="38" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="555" y="373" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">Postgres</text>
              <text x="555" y="386" text-anchor="middle" fill="#6a7090" font-size="10">transactions</text>
              <rect x="625" y="356" width="120" height="38" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="685" y="373" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">Redis</text>
              <text x="685" y="386" text-anchor="middle" fill="#6a7090" font-size="10">queues / cache</text>
              <!-- INFRA -->
              <text x="410" y="418" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="3">INFRASTRUCTURE TRANSVERSE</text>
              <rect x="46" y="424" width="158" height="46" rx="8" fill="#0a0c10" stroke="#4a9ee8" stroke-width="1" />
              <text x="125" y="444" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Service Discovery</text>
              <text x="125" y="459" text-anchor="middle" fill="#6a7090" font-size="10">Consul &middot; Kubernetes</text>
              <rect x="216" y="424" width="158" height="46" rx="8" fill="#0a0c10" stroke="#4a9ee8" stroke-width="1" />
              <text x="295" y="444" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Observabilit&eacute;</text>
              <text x="295" y="459" text-anchor="middle" fill="#6a7090" font-size="10">Logs &middot; traces &middot; m&eacute;triques</text>
              <rect x="386" y="424" width="158" height="46" rx="8" fill="#0a0c10" stroke="#4a9ee8" stroke-width="1" />
              <text x="465" y="444" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Circuit Breaker</text>
              <text x="465" y="459" text-anchor="middle" fill="#6a7090" font-size="10">Resilience4j &middot; Hystrix</text>
              <rect x="556" y="424" width="218" height="46" rx="8" fill="#0a0c10" stroke="#4a9ee8" stroke-width="1" />
              <text x="665" y="444" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Orchestration</text>
              <text x="665" y="459" text-anchor="middle" fill="#6a7090" font-size="10">Docker &middot; Kubernetes &middot; CI/CD</text>
              <!-- legend -->
              <rect x="46" y="492" width="728" height="72" rx="8" fill="#0a0c10" stroke="#1e2330" />
              <rect x="66" y="510" width="12" height="12" rx="2" fill="#4ae8b0" opacity=".7" />
              <text x="84" y="521" fill="#d4d8e8" font-size="11">Services m&eacute;tier</text>
              <rect x="196" y="510" width="12" height="12" rx="2" fill="#a78bfa" opacity=".7" />
              <text x="214" y="521" fill="#d4d8e8" font-size="11">Gateway</text>
              <rect x="296" y="510" width="12" height="12" rx="2" fill="#e8c84a" opacity=".7" />
              <text x="314" y="521" fill="#d4d8e8" font-size="11">Message broker</text>
              <rect x="436" y="510" width="12" height="12" rx="2" fill="#4a9ee8" opacity=".7" />
              <text x="454" y="521" fill="#d4d8e8" font-size="11">Infrastructure</text>
              <rect x="556" y="510" width="12" height="12" rx="2" fill="#1e2330" />
              <text x="574" y="521" fill="#d4d8e8" font-size="11">Bases de donn&eacute;es</text>
              <text x="410" y="548" text-anchor="middle" fill="#4a5568" font-size="11">Chaque service est d&eacute;ploy&eacute; ind&eacute;pendamment dans son propre container Docker</text>
            </svg>
            <div class="diagram-caption">fig. 2 &mdash; architecture compl&egrave;te en production</div>
          </div>
        </section>

        <!-- ══ 04 — API GATEWAY ══ -->
        <section id="gateway" class="section">
          <div class="section-header">
            <span class="section-number">04</span>
            <h2 class="section-title">API Gateway &mdash; Le point d'entr&eacute;e unique</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>L'API Gateway est le <strong>r&eacute;ceptionniste de l'architecture</strong>. Personne n'entre dans le syst&egrave;me sans passer par lui. Il centralise toutes les pr&eacute;occupations transverses.</p>
          </div>

          <div class="info-box">
            <strong>Responsabilit&eacute;s du Gateway</strong> &mdash; V&eacute;rification JWT &middot; routing vers les services &middot; rate limiting &middot; load balancing &middot; enrichissement des headers (injection de <code>x-user-id</code>)
          </div>

          <div class="cards cards-2col" style="margin: 28px 0;">
            <div
              v-for="opt in gatewayOptions"
              :key="opt.name"
              class="card"
              :class="opt.colorClass"
            >
              <span class="card-icon">{{ opt.icon }}</span>
              <div class="card-name">{{ opt.name }}</div>
              <div class="card-title">{{ opt.title }}</div>
              <div class="card-desc">{{ opt.desc }}</div>
            </div>
          </div>

          <h3>Spectre des responsabilit&eacute;s</h3>
          <table class="decision-table">
            <thead>
              <tr>
                <th>Fonctionnalit&eacute;</th>
                <th>Nginx</th>
                <th>Kong</th>
                <th>AWS GW</th>
                <th>NestJS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in gatewayRows" :key="row.feature">
                <td>{{ row.feature }}</td>
                <td :class="row.nginxClass">{{ row.nginx }}</td>
                <td :class="row.kongClass">{{ row.kong }}</td>
                <td :class="row.awsClass">{{ row.aws }}</td>
                <td :class="row.nestjsClass">{{ row.nestjs }}</td>
              </tr>
            </tbody>
          </table>

          <div class="info-box cyan">
            <strong>En pratique</strong> &mdash; Nginx et NestJS ne s'excluent pas &mdash; ils se combinent. Nginx g&egrave;re TLS + compression en frontal, NestJS g&egrave;re la logique JWT + routing derri&egrave;re.
          </div>
        </section>

        <!-- ══ 05 — NGINX ══ -->
        <section id="nginx" class="section">
          <div class="section-header">
            <span class="section-number">05</span>
            <h2 class="section-title">Pourquoi Nginx peut remplacer NestJS</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>Un API Gateway et un reverse proxy font <strong>la m&ecirc;me chose fondamentalement</strong>&nbsp;: rediriger du trafic HTTP. La diff&eacute;rence est une question de degr&eacute;, pas de nature.</p>
            <p>La directive <code>proxy_pass</code> de Nginx fait exactement ce que fait <code>this.http.request()</code> dans un ProxyService NestJS &mdash; les deux op&egrave;rent un reverse proxy HTTP.</p>
          </div>

          <div class="code-filename">nginx.conf</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeNginx" />

          <div class="info-box red">
            <strong>Limite de Nginx seul</strong> &mdash; Nginx ne peut pas lire ni valider un JWT &mdash; ce n'est pas un interpr&eacute;teur de code. Pour l'auth, il faut Kong (plugin JWT), AWS API Gateway, ou du code (NestJS).
          </div>
        </section>

        <!-- ══ 06 — GATEWAY CODE ══ -->
        <section id="gateway-code" class="section">
          <div class="section-header">
            <span class="section-number">06</span>
            <h2 class="section-title">Gateway NestJS complet</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>Un API Gateway NestJS est une application Nest standard dont les controllers <strong>ne font aucune logique m&eacute;tier</strong> &mdash; ils proxifient uniquement. L'auth est port&eacute;e par un Guard.</p>
          </div>

          <div class="code-filename">gateway.controller.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeGatewayController" />

          <div class="code-filename">auth.guard.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeAuthGuard" />
        </section>

        <!-- ══ 07 — SERVICES METIER ══ -->
        <section id="services" class="section">
          <div class="section-header">
            <span class="section-number">07</span>
            <h2 class="section-title">Structure d'un service m&eacute;tier</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>Un service m&eacute;tier est une <strong>application NestJS autonome</strong> avec une responsabilit&eacute; unique. Sa caract&eacute;ristique principale&nbsp;: ce qu'il <em>ne fait pas</em>.</p>
          </div>

          <div class="cards" style="margin: 28px 0;">
            <div
              v-for="(svc, idx) in serviceCards"
              :key="idx"
              class="card"
              :class="svc.colorClass"
            >
              <span class="card-icon">{{ svc.icon }}</span>
              <div class="card-name">{{ svc.name }}</div>
              <div class="card-title">{{ svc.title }}</div>
              <div class="card-desc">{{ svc.desc }}</div>
            </div>
          </div>

          <!-- SVG: Anatomie d'un service metier -->
          <div class="diagram-wrap">
            <svg viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Mono',monospace">
              <defs>
                <marker id="arr3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#4a5568" stroke-width="1.5" stroke-linecap="round" />
                </marker>
              </defs>
              <rect x="30" y="30" width="130" height="38" rx="8" fill="#0a0c10" stroke="#a78bfa" stroke-width="1" />
              <text x="95" y="47" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">API Gateway</text>
              <text x="95" y="62" text-anchor="middle" fill="#6a7090" font-size="10">x-user-id header</text>
              <rect x="30" y="82" width="130" height="38" rx="8" fill="#0a0c10" stroke="#e8c84a" stroke-width="1" />
              <text x="95" y="99" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Message Broker</text>
              <text x="95" y="114" text-anchor="middle" fill="#6a7090" font-size="10">events entrants</text>
              <line x1="160" y1="49" x2="198" y2="90" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <line x1="160" y1="101" x2="198" y2="118" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <!-- Service box -->
              <rect x="200" y="22" width="380" height="256" rx="12" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1.5" />
              <text x="390" y="44" text-anchor="middle" fill="#4ae8b0" font-size="11" letter-spacing="2">ORDERS-SERVICE</text>
              <text x="390" y="60" text-anchor="middle" fill="#6a7090" font-size="10">Application NestJS autonome &middot; port 3001</text>
              <rect x="220" y="70" width="340" height="40" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="390" y="87" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Controller</text>
              <text x="390" y="101" text-anchor="middle" fill="#6a7090" font-size="10">HTTP routes &middot; validation DTOs</text>
              <line x1="390" y1="110" x2="390" y2="128" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <rect x="220" y="130" width="340" height="40" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="390" y="147" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Service</text>
              <text x="390" y="161" text-anchor="middle" fill="#6a7090" font-size="10">Logique m&eacute;tier &middot; orchestration</text>
              <line x1="390" y1="170" x2="390" y2="188" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <rect x="220" y="190" width="340" height="40" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="390" y="207" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Repository</text>
              <text x="390" y="221" text-anchor="middle" fill="#6a7090" font-size="10">TypeORM &middot; acc&egrave;s DB</text>
              <line x1="390" y1="230" x2="390" y2="248" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <rect x="220" y="248" width="340" height="24" rx="6" fill="#13161e" stroke="#1e2330" />
              <text x="390" y="264" text-anchor="middle" fill="#d4d8e8" font-size="11" font-weight="500">EventEmitter &rarr; Broker</text>
              <!-- Outputs -->
              <line x1="580" y1="90" x2="618" y2="58" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <line x1="580" y1="210" x2="618" y2="190" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <line x1="580" y1="260" x2="618" y2="272" stroke="#4a5568" stroke-width="0.8" marker-end="url(#arr3)" />
              <rect x="620" y="34" width="150" height="38" rx="8" fill="#13161e" stroke="#1e2330" />
              <text x="695" y="51" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">HTTP Response</text>
              <text x="695" y="65" text-anchor="middle" fill="#6a7090" font-size="10">vers Gateway</text>
              <rect x="620" y="168" width="150" height="50" rx="8" fill="#13161e" stroke="#1e2330" />
              <text x="695" y="186" text-anchor="middle" fill="#d4d8e8" font-size="12" font-weight="500">Postgres</text>
              <text x="695" y="201" text-anchor="middle" fill="#6a7090" font-size="10">DB d&eacute;di&eacute;e</text>
              <text x="695" y="213" text-anchor="middle" fill="#6a7090" font-size="10">orders only</text>
              <rect x="620" y="254" width="150" height="38" rx="8" fill="#0a0c10" stroke="#e8c84a" />
              <text x="695" y="271" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Events sortants</text>
              <text x="695" y="285" text-anchor="middle" fill="#6a7090" font-size="10">order.created...</text>
              <text x="390" y="292" text-anchor="middle" fill="#4a5568" font-size="10">Le service ne sait pas qui l'appelle ni qui consomme ses events</text>
            </svg>
            <div class="diagram-caption">fig. 3 &mdash; anatomie d'un service m&eacute;tier</div>
          </div>
        </section>

        <!-- ══ 08 — SERVICES CODE ══ -->
        <section id="services-code" class="section">
          <div class="section-header">
            <span class="section-number">08</span>
            <h2 class="section-title">Impl&eacute;mentation compl&egrave;te</h2>
            <div class="section-line" />
          </div>

          <div class="code-filename">order.entity.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeEntity" />

          <div class="code-filename">orders.service.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeOrdersService" />

          <div class="code-filename">docker-compose.yml &mdash; extrait</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeDocker" />
        </section>

        <!-- ══ 09 — BROKER ══ -->
        <section id="broker" class="section">
          <div class="section-header">
            <span class="section-number">09</span>
            <h2 class="section-title">La bo&icirc;te aux lettres du syst&egrave;me</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>Le broker casse le mod&egrave;le de communication synchrone auquel on est habitu&eacute;. La m&eacute;taphore la plus juste&nbsp;: <strong>la lettre de courrier</strong>.</p>
            <p>Quand tu envoies une lettre, tu ne restes pas debout devant ta bo&icirc;te &agrave; attendre la r&eacute;ponse. Tu d&eacute;poses et tu passes &agrave; autre chose. Le destinataire lira quand il sera disponible. Si tu envoies une circulaire, plusieurs personnes lisent la m&ecirc;me lettre.</p>
          </div>

          <!-- SVG: Sans broker vs avec broker -->
          <div class="diagram-wrap">
            <svg viewBox="0 0 820 290" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Mono',monospace">
              <defs>
                <marker id="arr4r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#e84a7a" stroke-width="1.5" stroke-linecap="round" />
                </marker>
                <marker id="arr4y" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#e8c84a" stroke-width="1.5" stroke-linecap="round" />
                </marker>
              </defs>
              <!-- SANS BROKER -->
              <text x="195" y="18" text-anchor="middle" fill="#e84a7a" font-size="10" letter-spacing="3">SANS BROKER &mdash; couplage fort</text>
              <rect x="40" y="26" width="110" height="40" rx="8" fill="#0a0c10" stroke="#4ae8b0" />
              <text x="95" y="44" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Commandes</text>
              <text x="95" y="58" text-anchor="middle" fill="#6a7090" font-size="10">service</text>
              <line x1="150" y1="38" x2="188" y2="38" stroke="#e84a7a" stroke-width="1.2" marker-end="url(#arr4r)" />
              <text x="169" y="32" text-anchor="middle" fill="#e84a7a" font-size="10">HTTP</text>
              <rect x="190" y="22" width="110" height="32" rx="6" fill="#0a0c10" stroke="#e84a7a" stroke-width="1" stroke-dasharray="3 2" />
              <text x="245" y="42" text-anchor="middle" fill="#d4d8e8" font-size="11">Paiement</text>
              <line x1="150" y1="52" x2="188" y2="72" stroke="#e84a7a" stroke-width="1.2" marker-end="url(#arr4r)" />
              <rect x="190" y="60" width="110" height="32" rx="6" fill="#0a0c10" stroke="#e84a7a" stroke-width="1" stroke-dasharray="3 2" />
              <text x="245" y="80" text-anchor="middle" fill="#d4d8e8" font-size="11">Notifs</text>
              <line x1="150" y1="60" x2="188" y2="110" stroke="#e84a7a" stroke-width="1.2" marker-end="url(#arr4r)" />
              <rect x="190" y="100" width="110" height="32" rx="6" fill="#0a0c10" stroke="#e84a7a" stroke-width="1" stroke-dasharray="3 2" />
              <text x="245" y="120" text-anchor="middle" fill="#d4d8e8" font-size="11">Stock</text>
              <rect x="36" y="160" width="278" height="58" rx="6" fill="#0a0c10" stroke="#1e2330" />
              <text x="175" y="181" text-anchor="middle" fill="#e84a7a" font-size="11">Si Paiement est down &rarr; Commandes &eacute;choue.</text>
              <text x="175" y="197" text-anchor="middle" fill="#6a7090" font-size="11">Commandes doit conna&icirc;tre chaque service.</text>
              <text x="175" y="213" text-anchor="middle" fill="#6a7090" font-size="11">Ajout d'un service &rarr; modifier Commandes.</text>
              <line x1="410" y1="10" x2="410" y2="270" stroke="#1e2330" stroke-width="1" stroke-dasharray="5 4" />
              <!-- AVEC BROKER -->
              <text x="615" y="18" text-anchor="middle" fill="#4ae8b0" font-size="10" letter-spacing="3">AVEC BROKER &mdash; d&eacute;couplage fort</text>
              <rect x="428" y="66" width="110" height="40" rx="8" fill="#0a0c10" stroke="#4ae8b0" />
              <text x="483" y="84" text-anchor="middle" fill="#f0f2fa" font-size="12" font-weight="500">Commandes</text>
              <text x="483" y="98" text-anchor="middle" fill="#6a7090" font-size="10">&eacute;met et oublie</text>
              <line x1="538" y1="86" x2="566" y2="86" stroke="#e8c84a" stroke-width="1.5" marker-end="url(#arr4y)" />
              <rect x="568" y="56" width="110" height="60" rx="10" fill="#0a0c10" stroke="#e8c84a" stroke-width="1.5" />
              <text x="623" y="78" text-anchor="middle" fill="#e8c84a" font-size="12" font-weight="500">Broker</text>
              <text x="623" y="94" text-anchor="middle" fill="#d4d8e8" font-size="10">order.created</text>
              <text x="623" y="108" text-anchor="middle" fill="#6a7090" font-size="10">file d'attente</text>
              <line x1="678" y1="70" x2="706" y2="48" stroke="#e8c84a" stroke-width="1" marker-end="url(#arr4y)" />
              <line x1="678" y1="86" x2="706" y2="86" stroke="#e8c84a" stroke-width="1" marker-end="url(#arr4y)" />
              <line x1="678" y1="102" x2="706" y2="124" stroke="#e8c84a" stroke-width="1" marker-end="url(#arr4y)" />
              <rect x="708" y="28" width="88" height="32" rx="6" fill="#0a0c10" stroke="#4ae8b0" />
              <text x="752" y="48" text-anchor="middle" fill="#d4d8e8" font-size="11">Paiement</text>
              <rect x="708" y="70" width="88" height="32" rx="6" fill="#0a0c10" stroke="#4ae8b0" />
              <text x="752" y="90" text-anchor="middle" fill="#d4d8e8" font-size="11">Notifs</text>
              <rect x="708" y="112" width="88" height="32" rx="6" fill="#0a0c10" stroke="#4ae8b0" />
              <text x="752" y="132" text-anchor="middle" fill="#d4d8e8" font-size="11">Stock</text>
              <rect x="424" y="160" width="378" height="72" rx="6" fill="#0a0c10" stroke="#1e2330" />
              <text x="613" y="181" text-anchor="middle" fill="#4ae8b0" font-size="11">Si Paiement est down &rarr; le message l'attend.</text>
              <text x="613" y="197" text-anchor="middle" fill="#6a7090" font-size="11">Commandes ne conna&icirc;t aucun consommateur.</text>
              <text x="613" y="213" text-anchor="middle" fill="#6a7090" font-size="11">Ajouter Analytics &rarr; brancher sans modifier Commandes.</text>
              <text x="410" y="258" text-anchor="middle" fill="#4a5568" font-size="11">Commandes r&eacute;pond au client AVANT que Paiement et Notifs aient trait&eacute; quoi que ce soit</text>
            </svg>
            <div class="diagram-caption">fig. 4 &mdash; appels directs vs message broker</div>
          </div>

          <h3>RabbitMQ vs Kafka</h3>
          <table class="decision-table">
            <thead>
              <tr>
                <th>Crit&egrave;re</th>
                <th>RabbitMQ</th>
                <th>Kafka</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in brokerRows" :key="row.criteria">
                <td>{{ row.criteria }}</td>
                <td :class="row.rabbitmqClass">{{ row.rabbitmq }}</td>
                <td :class="row.kafkaClass">{{ row.kafka }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- ══ 10 — BROKER CODE ══ -->
        <section id="broker-code" class="section">
          <div class="section-header">
            <span class="section-number">10</span>
            <h2 class="section-title">RabbitMQ + NestJS</h2>
            <div class="section-line" />
          </div>

          <div class="code-filename">orders-events.service.ts &mdash; producteur</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeBrokerProducer" />

          <div class="code-filename">payments.controller.ts &mdash; consommateur</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeBrokerConsumer" />

          <div class="code-filename">main.ts &mdash; service consommateur (pas de port HTTP)</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeBrokerMain" />
        </section>

        <!-- ══ 11 — FLUX COMPLET ══ -->
        <section id="flow" class="section">
          <div class="section-header">
            <span class="section-number">11</span>
            <h2 class="section-title">Flux bout en bout &mdash; Passer une commande</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>Voici comment une requ&ecirc;te <code>POST /orders</code> traverse l'int&eacute;gralit&eacute; de l'architecture.</p>
          </div>

          <!-- SVG: Sequence diagram -->
          <div class="diagram-wrap">
            <svg viewBox="0 0 820 380" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Mono',monospace">
              <defs>
                <marker id="arrs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#4ae8b0" stroke-width="1.5" stroke-linecap="round" />
                </marker>
                <marker id="arrr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#6a7090" stroke-width="1.5" stroke-linecap="round" />
                </marker>
                <marker id="arry" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#e8c84a" stroke-width="1.5" stroke-linecap="round" />
                </marker>
              </defs>
              <text x="68" y="20" text-anchor="middle" fill="#6a7090" font-size="10" font-weight="500">Client</text>
              <text x="188" y="20" text-anchor="middle" fill="#a78bfa" font-size="10" font-weight="500">Gateway</text>
              <text x="308" y="20" text-anchor="middle" fill="#6a7090" font-size="10" font-weight="500">Auth</text>
              <text x="438" y="20" text-anchor="middle" fill="#4ae8b0" font-size="10" font-weight="500">Commandes</text>
              <text x="588" y="20" text-anchor="middle" fill="#4ae8b0" font-size="10" font-weight="500">Paiement</text>
              <text x="718" y="20" text-anchor="middle" fill="#4ae8b0" font-size="10" font-weight="500">Notifs</text>
              <line x1="68" y1="28" x2="68" y2="360" stroke="#1e2330" stroke-width="0.8" />
              <line x1="188" y1="28" x2="188" y2="360" stroke="#1e2330" stroke-width="0.8" />
              <line x1="308" y1="28" x2="308" y2="360" stroke="#1e2330" stroke-width="0.8" />
              <line x1="438" y1="28" x2="438" y2="360" stroke="#1e2330" stroke-width="0.8" />
              <line x1="588" y1="28" x2="588" y2="360" stroke="#1e2330" stroke-width="0.8" />
              <line x1="718" y1="28" x2="718" y2="360" stroke="#1e2330" stroke-width="0.8" />
              <!-- Step 1 -->
              <text x="38" y="60" text-anchor="end" fill="#4a5568" font-size="10">1</text>
              <line x1="68" y1="56" x2="180" y2="56" stroke="#4ae8b0" stroke-width="1.2" marker-end="url(#arrs)" />
              <text x="124" y="50" text-anchor="middle" fill="#d4d8e8" font-size="10">POST /orders</text>
              <!-- Step 2 -->
              <text x="38" y="90" text-anchor="end" fill="#4a5568" font-size="10">2</text>
              <line x1="188" y1="86" x2="300" y2="86" stroke="#4ae8b0" stroke-width="1.2" marker-end="url(#arrs)" />
              <text x="244" y="80" text-anchor="middle" fill="#d4d8e8" font-size="10">validate JWT</text>
              <line x1="308" y1="100" x2="196" y2="100" stroke="#6a7090" stroke-width="0.8" stroke-dasharray="4 2" marker-end="url(#arrr)" />
              <text x="252" y="114" text-anchor="middle" fill="#6a7090" font-size="10">&check; user_id</text>
              <!-- Step 3 -->
              <text x="38" y="134" text-anchor="end" fill="#4a5568" font-size="10">3</text>
              <line x1="188" y1="130" x2="430" y2="130" stroke="#4ae8b0" stroke-width="1.2" marker-end="url(#arrs)" />
              <text x="309" y="124" text-anchor="middle" fill="#d4d8e8" font-size="10">forward + x-user-id</text>
              <!-- Step 4 -->
              <text x="38" y="164" text-anchor="end" fill="#4a5568" font-size="10">4</text>
              <rect x="420" y="152" width="36" height="20" rx="4" fill="#13161e" stroke="#1e2330" />
              <text x="438" y="166" text-anchor="middle" fill="#6a7090" font-size="10">DB</text>
              <text x="438" y="149" text-anchor="middle" fill="#6a7090" font-size="10">save order</text>
              <!-- Step 5 -->
              <text x="38" y="202" text-anchor="end" fill="#4a5568" font-size="10">5</text>
              <line x1="438" y1="198" x2="580" y2="198" stroke="#e8c84a" stroke-width="1.2" stroke-dasharray="5 2" marker-end="url(#arry)" />
              <line x1="438" y1="198" x2="710" y2="198" stroke="#e8c84a" stroke-width="1.2" stroke-dasharray="5 2" marker-end="url(#arry)" />
              <text x="576" y="192" text-anchor="middle" fill="#e8c84a" font-size="10">event: order.created (async)</text>
              <rect x="46" y="210" width="748" height="20" rx="4" fill="#0a0c10" opacity="0.8" />
              <text x="420" y="224" text-anchor="middle" fill="#4a5568" font-size="10" letter-spacing="1">&larr; Les &eacute;tapes suivantes sont parall&egrave;les et ind&eacute;pendantes &rarr;</text>
              <!-- Step 6 -->
              <text x="38" y="268" text-anchor="end" fill="#4a5568" font-size="10">6</text>
              <rect x="568" y="248" width="40" height="20" rx="4" fill="#13161e" stroke="#1e2330" />
              <text x="588" y="262" text-anchor="middle" fill="#6a7090" font-size="10">Stripe</text>
              <text x="588" y="245" text-anchor="middle" fill="#d4d8e8" font-size="10">process payment</text>
              <!-- Step 7 -->
              <text x="38" y="318" text-anchor="end" fill="#4a5568" font-size="10">7</text>
              <rect x="700" y="298" width="36" height="20" rx="4" fill="#13161e" stroke="#1e2330" />
              <text x="718" y="312" text-anchor="middle" fill="#6a7090" font-size="10">SMTP</text>
              <text x="718" y="295" text-anchor="middle" fill="#d4d8e8" font-size="10">send email</text>
              <!-- Step 8 -->
              <text x="38" y="358" text-anchor="end" fill="#4a5568" font-size="10">8</text>
              <line x1="430" y1="354" x2="76" y2="354" stroke="#6a7090" stroke-width="0.8" stroke-dasharray="4 2" marker-end="url(#arrr)" />
              <text x="253" y="348" text-anchor="middle" fill="#6a7090" font-size="10">201 Created { order_id } &mdash; r&eacute;ponse sync imm&eacute;diate</text>
              <!-- Legend -->
              <line x1="46" y1="374" x2="66" y2="374" stroke="#4ae8b0" stroke-width="1.5" />
              <text x="72" y="378" fill="#6a7090" font-size="10">sync HTTP</text>
              <line x1="176" y1="374" x2="196" y2="374" stroke="#e8c84a" stroke-width="1.5" stroke-dasharray="5 2" />
              <text x="202" y="378" fill="#6a7090" font-size="10">async event</text>
              <line x1="336" y1="374" x2="356" y2="374" stroke="#6a7090" stroke-width="1" stroke-dasharray="4 2" />
              <text x="362" y="378" fill="#6a7090" font-size="10">r&eacute;ponse</text>
            </svg>
            <div class="diagram-caption">fig. 5 &mdash; s&eacute;quence compl&egrave;te d'une commande</div>
          </div>

          <div class="info-box cyan">
            <strong>Point cl&eacute; &mdash; Coh&eacute;rence &eacute;ventuelle</strong> &mdash; Le service Commandes r&eacute;pond <code>201 Created</code> imm&eacute;diatement au client (&eacute;tape 8), sans attendre que le paiement soit pr&eacute;lev&eacute; ni que l'email soit envoy&eacute;. Le syst&egrave;me converge vers un &eacute;tat coh&eacute;rent, mais pas instantan&eacute;ment.
          </div>
        </section>

        <!-- ══ 12 — QUAND ADOPTER ══ -->
        <section id="quand" class="section">
          <div class="section-header">
            <span class="section-number">12</span>
            <h2 class="section-title">Quand adopter les microservices ?</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>Les microservices ne sont <strong>pas la solution par d&eacute;faut</strong>. Le monolithe reste souvent plus sage au d&eacute;part.</p>
          </div>

          <div class="flow-steps">
            <div
              v-for="step in flowSteps"
              :key="step.num"
              class="flow-step"
            >
              <div
                class="flow-step-num"
                :style="step.numStyle"
              >{{ step.num }}</div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="flow-step-text" v-html="step.text" />
            </div>
          </div>
        </section>

        <!-- ══ 13 — PIEGES ══ -->
        <section id="pieges" class="section">
          <div class="section-header">
            <span class="section-number">13</span>
            <h2 class="section-title">Pi&egrave;ges classiques &mdash; Ce qui peut mal tourner</h2>
            <div class="section-line" />
          </div>

          <div class="cards">
            <div
              v-for="piege in piegeCards"
              :key="piege.name"
              class="card pink"
            >
              <span class="card-icon">{{ piege.icon }}</span>
              <div class="card-name">{{ piege.name }}</div>
              <div class="card-title">{{ piege.title }}</div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="card-desc" v-html="piege.desc" />
            </div>
          </div>

          <div class="rule-banner">
            <strong>R&egrave;gle d'or</strong> &mdash; Un service ne fait jamais <code>import</code> d'un autre service. La communication passe uniquement par HTTP ou par events via le broker. C'est ce qui garantit l'isolation.
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Design tokens ── */
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
  --cyan: #22d3ee;
  --yellow: #e8c84a;
  --mono: 'IBM Plex Mono', monospace;
  --sans: 'DM Sans', sans-serif;
  --serif: 'DM Serif Display', serif;
  --sidebar-w: 268px;
  --content-max: 1000px;
}

:global(html) {
  scroll-behavior: smooth;
}

/* ── Layout ── */
.main {
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.content {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 60px 48px 120px;
}

/* ── Back link ── */
nav { margin-bottom: 40px; }

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
  margin-bottom: 72px;
  border-left: 3px solid var(--accent);
  padding-left: 24px;
}

.eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

header h1 {
  font-family: var(--serif);
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--white);
  line-height: 1.15;
  margin-bottom: 16px;
}

header h1 em { font-style: italic; color: var(--accent); }

.subtitle {
  font-size: 1rem;
  color: var(--muted);
  max-width: 580px;
  line-height: 1.7;
}

.meta-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.meta-tag {
  font-family: var(--mono);
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.meta-green  { color: var(--green);  background: rgba(74,232,176,0.08);  border: 1px solid rgba(74,232,176,0.2); }
.meta-yellow { color: var(--accent); background: rgba(232,200,74,0.08);  border: 1px solid rgba(232,200,74,0.2); }
.meta-purple { color: var(--purple); background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2); }
.meta-blue   { color: var(--blue);   background: rgba(74,158,232,0.08);  border: 1px solid rgba(74,158,232,0.2); }
.meta-orange { color: var(--orange); background: rgba(232,122,74,0.08);  border: 1px solid rgba(232,122,74,0.2); }

/* ── Sections ── */
.section {
  margin-bottom: 88px;
  scroll-margin-top: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
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

.section-title {
  font-family: var(--serif);
  font-size: 1.5rem;
  color: var(--white);
}

.section-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.section h3 {
  font-family: var(--serif);
  font-size: 1.15rem;
  color: var(--white);
  margin: 32px 0 16px;
}

/* ── Prose ── */
.prose {
  font-size: 0.925rem;
  color: var(--text);
  line-height: 1.85;
  max-width: 780px;
}
.prose p { margin-bottom: 16px; }
.prose strong { color: var(--white); font-weight: 500; }
.prose em { color: var(--accent); font-style: italic; }
.prose code {
  font-family: var(--mono);
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
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
.quote-icon { font-size: 2.2rem; flex-shrink: 0; margin-top: 2px; }
.quote-content h3 {
  font-family: var(--serif);
  font-size: 1.1rem;
  color: var(--accent);
  margin-bottom: 8px;
}
.quote-content p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.8;
  margin-bottom: 12px;
}
.quote-content p:last-child { margin-bottom: 0; }
.quote-content em { color: var(--accent2); font-style: italic; }
.quote-content strong { color: var(--white); font-weight: 500; }

/* ── Cards ── */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 8px;
}
.cards-2col { grid-template-columns: 1fr 1fr; }

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
  font-family: var(--mono);
  font-size: 0.8rem; font-weight: 600;
  color: var(--card-accent, var(--accent));
  letter-spacing: 0.05em; margin-bottom: 6px; text-transform: uppercase;
}
.card-title { font-family: var(--serif); font-size: 1.1rem; color: var(--white); margin-bottom: 10px; }
.card-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.65; }

.green  { --card-accent: #4ae8b0; }
.yellow { --card-accent: #e8c84a; }
.blue   { --card-accent: #4a9ee8; }
.purple { --card-accent: #a78bfa; }
.pink   { --card-accent: #e84a7a; }
.orange { --card-accent: #e87a4a; }
.cyan   { --card-accent: #22d3ee; }

.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.10s; }
.card:nth-child(3) { animation-delay: 0.15s; }
.card:nth-child(4) { animation-delay: 0.20s; }

/* ── Info boxes ── */
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
.info-box code {
  font-family: var(--mono);
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

.info-box.cyan   { border-left-color: var(--cyan); }
.info-box.cyan strong   { color: var(--cyan); }
.info-box.yellow { border-left-color: var(--yellow); }
.info-box.yellow strong { color: var(--yellow); }
.info-box.red    { border-left-color: var(--red); }
.info-box.red strong    { color: var(--red); }

/* ── Diagram ── */
.diagram-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px 20px;
  margin: 32px 0;
  overflow-x: auto;
}
.diagram-wrap svg { display: block; width: 100%; height: auto; }
.diagram-caption {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--muted);
  text-align: center;
  margin-top: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* ── Code blocks ── */
.code-block {
  background: #0a0c10;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 6px;
  padding: 20px 24px;
  margin: 20px 0;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 0.78rem;
  line-height: 1.8;
  color: #c8d0e8;
}
.code-block :deep(.cm)  { color: #6a7090; font-style: italic; }
.code-block :deep(.kw)  { color: #a78bfa; }
.code-block :deep(.fn)  { color: #4ae8b0; }
.code-block :deep(.str) { color: #e8c84a; }
.code-block :deep(.ty)  { color: #4a9ee8; }
.code-block :deep(.dec) { color: #e84a7a; }
.code-block :deep(.num) { color: #fb923c; }
.code-block :deep(.hl)  { color: var(--white); }

.code-filename {
  font-family: var(--mono);
  font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--muted); background: var(--surface);
  border: 1px solid var(--border); border-bottom: none;
  border-radius: 6px 6px 0 0; padding: 6px 16px;
  display: inline-block;
}
.code-filename + .code-block { border-radius: 0 6px 6px 6px; margin-top: 0; }

/* ── Decision table ── */
.decision-table {
  width: 100%; border-collapse: collapse; margin: 28px 0;
  font-size: 0.85rem;
}
.decision-table th {
  font-family: var(--mono); font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 12px 16px; text-align: left;
  border-bottom: 2px solid var(--border); color: var(--muted);
  background: rgba(0,0,0,0.2);
}
.decision-table td {
  padding: 12px 16px; border-bottom: 1px solid var(--border);
  vertical-align: top; line-height: 1.5; color: var(--text);
}
.decision-table tr:last-child td { border-bottom: none; }
.decision-table tr:hover td { background: rgba(255,255,255,0.015); }
.dt-ok   { color: var(--green);  font-family: var(--mono); font-size: 0.8rem; }
.dt-warn { color: var(--yellow); font-family: var(--mono); font-size: 0.8rem; }
.dt-no   { color: var(--muted);  font-family: var(--mono); font-size: 0.8rem; }

/* ── Flow steps ── */
.flow-steps { margin: 28px 0; display: flex; flex-direction: column; gap: 0; }
.flow-step {
  display: flex; gap: 16px; align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.flow-step:last-child { border-bottom: none; }
.flow-step-num {
  font-family: var(--mono); font-size: 11px;
  color: var(--bg); background: var(--accent2);
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 2px; font-weight: 600;
}
.flow-step-text { font-size: 0.9rem; color: var(--text); padding-top: 2px; line-height: 1.6; }
.flow-step-text :deep(strong) { color: var(--white); font-weight: 500; }

/* ── Rule banner ── */
.rule-banner {
  background: linear-gradient(135deg, rgba(74,232,176,0.07), rgba(167,139,250,0.05));
  border: 1px solid rgba(74,232,176,0.25); border-radius: 8px;
  padding: 20px 24px; margin: 28px 0;
  font-family: var(--mono); font-size: 0.82rem;
  color: var(--green); letter-spacing: 0.04em; line-height: 1.7;
}
.rule-banner strong { color: var(--white); }
.rule-banner code {
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 0.82em;
}

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .main { margin-left: 0; }
  .content { padding: 32px 20px 80px; }
  .cards-2col { grid-template-columns: 1fr; }
  header h1 { font-size: 2.2rem; }
}
</style>
