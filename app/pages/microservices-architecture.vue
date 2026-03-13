<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (intro cards, gateway cards, service cards, trap cards,
 *          comparison tables, flow steps) are modeled as typed arrays and rendered via v-for,
 *          while unique prose, SVG diagrams, and code blocks stay as direct template markup.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface MsCard {
  colorClass: string
  icon: string
  title: string
  body: string
}

interface CompareRow {
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

interface BrokerCompareRow {
  criteria: string
  rabbitmq: string
  rabbitmqClass?: string
  kafka: string
  kafkaClass?: string
}

interface FlowStep {
  numClass?: string
  text: string
}

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'intro', label: 'Monolithe vs microservices' },
    ],
  },
  {
    label: 'Composants',
    links: [
      { id: 'architecture', label: "Vue d'ensemble" },
      { id: 'gateway', label: 'API Gateway' },
      { id: 'gateway-code', label: 'Gateway en NestJS' },
      { id: 'nginx', label: 'Nginx vs NestJS' },
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

const introCards: MsCard[] = [
  {
    colorClass: 'coral',
    icon: 'MONOLITHE',
    title: 'Tout dans une seule app',
    body: "D\u00e9ploiement unique. Si la cuisine prend feu, tout l'h\u00f4tel ferme. Agrandir une salle n\u00e9cessite de r\u00e9nover tout le b\u00e2timent.",
  },
  {
    colorClass: 'teal',
    icon: 'MICROSERVICES',
    title: 'Services ind\u00e9pendants',
    body: "Chaque commerce est autonome, a sa propre adresse, sa propre \u00e9quipe, peut ouvrir/fermer sans affecter les voisins.",
  },
]

const gatewayCards: MsCard[] = [
  {
    colorClass: 'amber',
    icon: 'OPTION A',
    title: 'Outil d\u00e9di\u00e9 \u2014 Kong / Nginx',
    body: "Configuration d\u00e9clarative YAML. Z\u00e9ro code m\u00e9tier. Id\u00e9al quand on veut moins de choses \u00e0 maintenir.",
  },
  {
    colorClass: 'purple',
    icon: 'OPTION B',
    title: 'Application NestJS custom',
    body: "Code TypeScript complet. Guards, Interceptors, Pipes. Id\u00e9al pour la logique m\u00e9tier fine au niveau du routing.",
  },
]

const serviceCards: MsCard[] = [
  {
    colorClass: 'coral',
    icon: 'NE FAIT PAS',
    title: "Pas d'auth, pas de JWT",
    body: "Il fait confiance au header <code>x-user-id</code> inject\u00e9 par le Gateway. L'auth est d\u00e9j\u00e0 v\u00e9rifi\u00e9e en amont.",
  },
  {
    colorClass: 'coral',
    icon: 'NE FAIT PAS',
    title: "Pas d'import d'autres services",
    body: "Jamais <code>import CatalogueService</code>. La communication passe par HTTP ou par events \u2014 jamais par import direct.",
  },
  {
    colorClass: 'teal',
    icon: 'FAIT',
    title: 'Sa propre base de donn\u00e9es',
    body: "Chaque service poss\u00e8de sa DB isol\u00e9e. Le service Auth peut changer son sch\u00e9ma sans casser les autres.",
  },
  {
    colorClass: 'teal',
    icon: 'FAIT',
    title: '\u00c9met des events',
    body: "Apr\u00e8s chaque action importante, il publie un event sur le broker. Il ne sait pas qui l'\u00e9coutera.",
  },
]

const trapCards: MsCard[] = [
  {
    colorClass: 'coral',
    icon: 'PI\u00c8GE 01',
    title: 'Explosion de la complexit\u00e9 ops',
    body: "Tu \u00e9changes les bugs de code contre des bugs r\u00e9seau et de configuration distribu\u00e9e. Chaque service = un processus, une DB, une config \u00e0 monitorer.",
  },
  {
    colorClass: 'coral',
    icon: 'PI\u00c8GE 02',
    title: 'Transactions distribu\u00e9es',
    body: "Sans transaction ACID multi-services, tu dois impl\u00e9menter des patterns comme <strong>SAGA</strong> ou <strong>2PC</strong>. C'est complexe et source d'incoh\u00e9rences.",
  },
  {
    colorClass: 'coral',
    icon: 'PI\u00c8GE 03',
    title: 'Latence en cascade',
    body: "5 appels HTTP synchrones en cha\u00eene = 5\u00d7 les d\u00e9lais r\u00e9seau. Un service lent d\u00e9grade toute la cha\u00eene sans circuit breaker.",
  },
  {
    colorClass: 'coral',
    icon: 'PI\u00c8GE 04',
    title: 'Death star diagram',
    body: "Quand chaque service appelle tous les autres sans discipline, tu recr\u00e9\u00e9s un monolithe distribu\u00e9 \u2014 le pire des deux mondes.",
  },
]

const gatewayCompare: CompareRow[] = [
  { feature: 'Reverse proxy / routing', nginx: '\u2713', nginxClass: 'check', kong: '\u2713', kongClass: 'check', aws: '\u2713', awsClass: 'check', nestjs: '\u2713', nestjsClass: 'check' },
  { feature: 'TLS / HTTPS termination', nginx: '\u2713', nginxClass: 'check', kong: '\u2713', kongClass: 'check', aws: '\u2713', awsClass: 'check', nestjs: '\u2713', nestjsClass: 'check' },
  { feature: 'Rate limiting', nginx: 'basique', nginxClass: 'partial', kong: '\u2713', kongClass: 'check', aws: '\u2713', awsClass: 'check', nestjs: '\u2713', nestjsClass: 'check' },
  { feature: 'Auth JWT / OAuth', nginx: '\u2717', nginxClass: 'cross', kong: 'plugin', kongClass: 'partial', aws: '\u2713', awsClass: 'check', nestjs: '\u2713 Guard', nestjsClass: 'check' },
  { feature: 'Logique m\u00e9tier custom', nginx: '\u2717', nginxClass: 'cross', kong: 'limit\u00e9', kongClass: 'partial', aws: 'limit\u00e9', awsClass: 'partial', nestjs: '\u2713 full TS', nestjsClass: 'check' },
  { feature: 'Maintenance / ops', nginx: 'simple', nginxClass: 'check', kong: 'mod\u00e9r\u00e9e', kongClass: 'partial', aws: 'mod\u00e9r\u00e9e', awsClass: 'partial', nestjs: 'tu g\u00e8res tout', nestjsClass: 'cross' },
]

const brokerCompare: BrokerCompareRow[] = [
  { criteria: 'Mod\u00e8le', rabbitmq: 'Queue \u2014 message supprim\u00e9 apr\u00e8s lecture', kafka: 'Log \u2014 message conserv\u00e9, offset par consommateur' },
  { criteria: 'Volume', rabbitmq: 'Des milliers de msg/s', kafka: 'Des millions de msg/s' },
  { criteria: 'Replay', rabbitmq: 'Non', rabbitmqClass: 'cross', kafka: 'Oui \u2014 rejouer l\'historique', kafkaClass: 'check' },
  { criteria: 'Complexit\u00e9 ops', rabbitmq: 'Simple', rabbitmqClass: 'check', kafka: '\u00c9lev\u00e9e (ZooKeeper/KRaft)', kafkaClass: 'partial' },
  { criteria: "Cas d'usage", rabbitmq: 'Projets standards, microservices classiques', kafka: 'Analytics, event sourcing, tr\u00e8s haut volume' },
]

const flowSteps: FlowStep[] = [
  { text: "<strong>Projet solo ou petite \u00e9quipe (&lt;5 personnes)</strong> \u2014 reste sur le monolithe. La complexit\u00e9 op\u00e9rationnelle des microservices est disproportionn\u00e9e." },
  { numClass: 'teal', text: "<strong>\u00c9quipes qui grossissent</strong> \u2014 le monolithe devient un goulot organisationnel autant que technique. Les \u00e9quipes se bloquent mutuellement au d\u00e9ploiement." },
  { numClass: 'amber', text: "<strong>Besoin de scalabilit\u00e9 diff\u00e9renci\u00e9e</strong> \u2014 Netflix scale son service streaming \u00d7100 sans toucher \u00e0 la facturation. Impossible en monolithe." },
  { numClass: 'coral', text: "<strong>D\u00e9ploiement continu \u00e0 grande \u00e9chelle</strong> \u2014 Amazon d\u00e9ploie en production des milliers de fois par jour. Chaque \u00e9quipe pousse son service ind\u00e9pendamment." },
]

/* ── Code blocks ── */

const codeNginx = `<span class="cmt"># Nginx comme API Gateway basique</span>
http {
  <span class="cmt"># Rate limiting : max 10 req/s par IP</span>
  <span class="kw">limit_req_zone</span> $binary_remote_addr <span class="fn">zone</span>=api:10m <span class="fn">rate</span>=<span class="num">10r/s</span>;

  server {
    <span class="kw">listen</span> <span class="num">80</span>;

    <span class="cmt"># /orders/** \u2192 service Commandes</span>
    <span class="kw">location</span> /orders/ {
      <span class="kw">limit_req</span> <span class="fn">zone</span>=api <span class="fn">burst</span>=<span class="num">20</span>;
      <span class="kw">proxy_pass</span> <span class="str">http://orders-service:3001</span>; <span class="cmt">\u2190 reverse proxy</span>
      <span class="kw">proxy_set_header</span> X-Real-IP $remote_addr;
    }

    <span class="cmt"># /users/** \u2192 service Users</span>
    <span class="kw">location</span> /users/ {
      <span class="kw">proxy_pass</span> <span class="str">http://users-service:3002</span>;
    }
  }
}`

const codeGatewayController = `<span class="dec">@Controller</span>()
<span class="kw">export class</span> <span class="cls">GatewayController</span> {
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> proxy: <span class="cls">ProxyService</span>) {}

  <span class="dec">@All</span>(<span class="str">'orders/*'</span>)
  <span class="dec">@UseGuards</span>(<span class="cls">AuthGuard</span>)   <span class="cmt">// v\u00e9rifie JWT \u2014 seul endroit o\u00f9 c'est fait</span>
  <span class="dec">@UseInterceptors</span>(<span class="cls">LoggingInterceptor</span>)
  <span class="kw">async</span> <span class="fn">proxyOrders</span>(
    <span class="dec">@Req</span>() req: <span class="cls">Request</span>,
    <span class="dec">@Res</span>() res: <span class="cls">Response</span>,
    <span class="dec">@User</span>() user: <span class="cls">JwtPayload</span>,
  ) {
    <span class="kw">return</span> <span class="kw">this</span>.proxy.<span class="fn">forward</span>(req, res, {
      target: <span class="str">'http://orders-service:3001'</span>,
      headers: { <span class="str">'x-user-id'</span>: user.id }, <span class="cmt">// enrichit la requ\u00eate</span>
    });
  }

  <span class="dec">@Post</span>(<span class="str">'auth/login'</span>) <span class="cmt">// route publique \u2014 pas de Guard</span>
  <span class="kw">async</span> <span class="fn">login</span>(<span class="dec">@Req</span>() req, <span class="dec">@Res</span>() res) {
    <span class="kw">return</span> <span class="kw">this</span>.proxy.<span class="fn">forward</span>(req, res, {
      target: <span class="str">'http://auth-service:3003'</span>,
    });
  }
}`

const codeAuthGuard = `<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="cls">AuthGuard</span> <span class="kw">implements</span> <span class="cls">CanActivate</span> {
  <span class="kw">constructor</span>(<span class="kw">private</span> jwt: <span class="cls">JwtService</span>) {}

  <span class="fn">canActivate</span>(ctx: <span class="cls">ExecutionContext</span>): <span class="kw">boolean</span> {
    <span class="kw">const</span> req = ctx.<span class="fn">switchToHttp</span>().<span class="fn">getRequest</span>();
    <span class="kw">const</span> token = req.headers.authorization?.<span class="fn">split</span>(<span class="str">' '</span>)[<span class="num">1</span>];
    <span class="kw">if</span> (!token) <span class="kw">throw new</span> <span class="cls">UnauthorizedException</span>();

    <span class="kw">try</span> {
      <span class="cmt">// Gateway = SEUL point de v\u00e9rification JWT</span>
      <span class="cmt">// Les services downstream font confiance \u00e0 x-user-id</span>
      req.user = <span class="kw">this</span>.jwt.<span class="fn">verify</span>(token);
      <span class="kw">return true</span>;
    } <span class="kw">catch</span> {
      <span class="kw">throw new</span> <span class="cls">UnauthorizedException</span>(<span class="str">'Invalid or expired token'</span>);
    }
  }
}`

const codeOrderEntity = `<span class="dec">@Entity</span>(<span class="str">'orders'</span>)
<span class="kw">export class</span> <span class="cls">Order</span> {
  <span class="dec">@PrimaryGeneratedColumn</span>(<span class="str">'uuid'</span>)
  id: <span class="kw">string</span>;

  <span class="dec">@Column</span>()
  userId: <span class="kw">string</span>; <span class="cmt">// pas de FK vers User \u2014 juste l'ID</span>

  <span class="dec">@Column</span>(<span class="str">'jsonb'</span>)
  items: <span class="cls">OrderItem</span>[];

  <span class="dec">@Column</span>({ type: <span class="str">'enum'</span>, enum: <span class="cls">OrderStatus</span>, default: <span class="cls">OrderStatus</span>.PENDING })
  status: <span class="cls">OrderStatus</span>;

  <span class="dec">@Column</span>(<span class="str">'decimal'</span>)
  total: <span class="kw">number</span>;
}`

const codeOrdersService = `<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="cls">OrdersService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@InjectRepository</span>(<span class="cls">Order</span>) <span class="kw">private readonly</span> repo: <span class="cls">Repository</span>&lt;<span class="cls">Order</span>&gt;,
    <span class="kw">private readonly</span> events: <span class="cls">OrdersEventsService</span>,
  ) {}

  <span class="kw">async</span> <span class="fn">create</span>(dto: <span class="cls">CreateOrderDto</span>, userId: <span class="kw">string</span>): <span class="cls">Promise</span>&lt;<span class="cls">Order</span>&gt; {
    <span class="kw">const</span> total = dto.items.<span class="fn">reduce</span>((sum, i) =&gt; sum + i.price * i.qty, <span class="num">0</span>);
    <span class="kw">const</span> order = <span class="kw">await</span> <span class="kw">this</span>.repo.<span class="fn">save</span>(<span class="kw">this</span>.repo.<span class="fn">create</span>({ ...dto, userId, total }));

    <span class="cmt">// fire-and-forget \u2014 on ne sait pas qui va consommer cet event</span>
    <span class="kw">await</span> <span class="kw">this</span>.events.<span class="fn">emit</span>(<span class="str">'order.created'</span>, {
      orderId: order.id, userId, total, items: dto.items,
    });

    <span class="kw">return</span> order; <span class="cmt">// r\u00e9pond AVANT que Paiement ou Notifs aient trait\u00e9</span>
  }
}`

const codeDockerCompose = `<span class="kw">services</span>:
  <span class="fn">orders-service</span>:
    build: ./orders-service
    <span class="kw">ports</span>:
      - <span class="str">"3001:3001"</span>  <span class="cmt"># expose HTTP \u2014 re\u00e7oit du Gateway</span>
    environment:
      <span class="fn">RABBITMQ_URL</span>: <span class="str">amqp://rabbitmq:5672</span>
      <span class="fn">DB_HOST</span>: <span class="str">orders-db</span>

  <span class="fn">payments-service</span>:
    build: ./payments-service
    <span class="cmt"># \u2190 pas de ports: \u2014 aucune exposition HTTP</span>
    <span class="cmt">#   \u00e9coute uniquement RabbitMQ</span>
    environment:
      <span class="fn">RABBITMQ_URL</span>: <span class="str">amqp://rabbitmq:5672</span>

  <span class="fn">orders-db</span>:
    image: <span class="str">postgres:16</span>
    <span class="cmt"># DB priv\u00e9e \u2014 aucun autre service n'y a acc\u00e8s</span>`

const codeOrdersEvents = `<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="cls">OrdersEventsService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@Inject</span>(<span class="str">'BROKER'</span>) <span class="kw">private readonly</span> client: <span class="cls">ClientProxy</span>,
  ) {}

  <span class="kw">async</span> <span class="fn">emit</span>(pattern: <span class="kw">string</span>, payload: <span class="kw">unknown</span>): <span class="cls">Promise</span>&lt;<span class="kw">void</span>&gt; {
    <span class="cmt">// fire-and-forget : on n'attend pas de r\u00e9ponse</span>
    <span class="kw">this</span>.client.<span class="fn">emit</span>(pattern, payload);
  }
}`

const codePaymentsController = `<span class="dec">@Controller</span>()
<span class="kw">export class</span> <span class="cls">PaymentsController</span> {
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> svc: <span class="cls">PaymentsService</span>) {}

  <span class="cmt">// \u00e9coute l'event \u2014 sans rien changer dans orders-service</span>
  <span class="dec">@EventPattern</span>(<span class="str">'order.created'</span>)
  <span class="kw">async</span> <span class="fn">handleOrderCreated</span>(
    <span class="dec">@Payload</span>() data: { orderId: <span class="kw">string</span>; userId: <span class="kw">string</span>; total: <span class="kw">number</span> },
  ) {
    <span class="kw">await</span> <span class="kw">this</span>.svc.<span class="fn">processPayment</span>(data);
  }
}

<span class="cmt">// notifications.controller.ts \u2014 \u00e9coute le M\u00caME event en parall\u00e8le</span>
<span class="dec">@EventPattern</span>(<span class="str">'order.created'</span>)
<span class="kw">async</span> <span class="fn">handleOrderCreated</span>(<span class="dec">@Payload</span>() data) {
  <span class="kw">await</span> <span class="kw">this</span>.svc.<span class="fn">sendConfirmationEmail</span>(data);
}`

const codeMainTs = `<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="cmt">// createMicroservice au lieu de create \u2192 \u00e9coute le broker, pas HTTP</span>
  <span class="kw">const</span> app = <span class="kw">await</span> <span class="cls">NestFactory</span>.<span class="fn">createMicroservice</span>&lt;<span class="cls">MicroserviceOptions</span>&gt;(
    <span class="cls">AppModule</span>,
    {
      transport: <span class="cls">Transport</span>.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: <span class="str">'events_queue'</span>,
      },
    },
  );
  <span class="kw">await</span> app.<span class="fn">listen</span>(); <span class="cmt">// tourne en permanence, aucun port expos\u00e9</span>
}`

useHead({
  title: 'Architecture Microservices \u2014 Guide Complet',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Architecture Microservices \u2014 Guide Complet',
        description: "Du monolithe au syst\u00e8me distribu\u00e9 : sch\u00e9mas, m\u00e9taphores et code NestJS pour comprendre l'architecture microservices.",
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/microservices-architecture',
        author: { '@type': 'Organization', name: 'Architectures Logicielles' },
      }),
    },
  ],
})

useSeoMeta({
  description: "Du monolithe au syst\u00e8me distribu\u00e9 : sch\u00e9mas, m\u00e9taphores et code NestJS pour comprendre l'architecture microservices.",
  ogTitle: 'Architecture Microservices \u2014 Guide Complet',
  ogDescription: "Du monolithe au syst\u00e8me distribu\u00e9 : sch\u00e9mas, m\u00e9taphores et code NestJS pour comprendre l'architecture microservices.",
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/microservices-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Architecture Microservices \u2014 Guide Complet',
  twitterDescription: "Du monolithe au syst\u00e8me distribu\u00e9 : sch\u00e9mas, m\u00e9taphores et code NestJS pour comprendre l'architecture microservices.",
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="Engineering handbook"
      title="Architecture<br>Microservices"
      :groups="sidebarGroups"
      accent-color="#4ade80"
    />

    <main class="main">
      <div class="content">
        <!-- Back link -->
        <nav>
          <NuxtLink to="/" class="back-link">
            Retour aux architectures
          </NuxtLink>
        </nav>

        <!-- Hero -->
        <header class="hero">
          <div class="hero-eyebrow">Architecture logicielle</div>
          <h1>Architecture<br><em>Microservices</em></h1>
          <p class="hero-desc">Du monolithe au syst&egrave;me distribu&eacute; &mdash; sch&eacute;mas, m&eacute;taphores et code NestJS concret pour comprendre chaque composant.</p>
          <div class="hero-meta">
            <span class="hero-tag">NestJS</span>
            <span class="hero-tag">TypeScript</span>
            <span class="hero-tag">RabbitMQ</span>
            <span class="hero-tag">Docker</span>
            <span class="hero-tag">Nginx</span>
          </div>
        </header>

        <!-- ═══════════════════════════════════════ -->
        <!-- Section 1 : Monolithe vs Microservices  -->
        <!-- ═══════════════════════════════════════ -->
        <section id="intro" class="section">
          <div class="section-eyebrow">Introduction</div>
          <h2>Monolithe vs Microservices</h2>
          <p>
            Imagine un <strong>grand h&ocirc;tel tout-en-un</strong> : restaurant, spa, salle de conf&eacute;rence, h&eacute;bergement &mdash; tout sous le m&ecirc;me toit, g&eacute;r&eacute; par une seule &eacute;quipe. C&rsquo;est le <em>monolithe</em>.
            Maintenant imagine une <strong>rue commer&ccedil;ante</strong> : chaque boutique est ind&eacute;pendante, avec son propre personnel, ses propres horaires, sa propre caisse. C&rsquo;est les <em>microservices</em>.
          </p>

          <div class="diagram-wrap">
            <svg viewBox="0 0 820 320" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monolithe vs Microservices">
              <!-- Monolith -->
              <rect x="20" y="40" width="360" height="260" rx="16" fill="#1a1c21" stroke="#f87171" stroke-width="2" stroke-dasharray="6 4"/>
              <text x="200" y="28" text-anchor="middle" fill="#f87171" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.1em">MONOLITHE</text>
              <rect x="50" y="70" width="140" height="50" rx="8" fill="rgba(248,113,113,0.08)" stroke="#f87171" stroke-width="1"/>
              <text x="120" y="100" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Auth</text>
              <rect x="210" y="70" width="140" height="50" rx="8" fill="rgba(248,113,113,0.08)" stroke="#f87171" stroke-width="1"/>
              <text x="280" y="100" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Commandes</text>
              <rect x="50" y="140" width="140" height="50" rx="8" fill="rgba(248,113,113,0.08)" stroke="#f87171" stroke-width="1"/>
              <text x="120" y="170" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Paiements</text>
              <rect x="210" y="140" width="140" height="50" rx="8" fill="rgba(248,113,113,0.08)" stroke="#f87171" stroke-width="1"/>
              <text x="280" y="170" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Notifications</text>
              <rect x="120" y="210" width="160" height="50" rx="8" fill="rgba(248,113,113,0.12)" stroke="#f87171" stroke-width="1.5"/>
              <text x="200" y="240" text-anchor="middle" fill="#f87171" font-family="IBM Plex Mono, monospace" font-size="12">1 seule DB</text>

              <!-- Arrow -->
              <text x="410" y="170" text-anchor="middle" fill="#6b7280" font-size="28">&#x2192;</text>

              <!-- Microservices -->
              <text x="620" y="28" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.1em">MICROSERVICES</text>
              <rect x="450" y="50" width="150" height="100" rx="12" fill="#1a1c21" stroke="#2dd4bf" stroke-width="2"/>
              <text x="525" y="90" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Auth</text>
              <rect x="470" y="118" width="110" height="22" rx="6" fill="rgba(45,212,191,0.1)" stroke="#2dd4bf" stroke-width="0.8"/>
              <text x="525" y="133" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">sa propre DB</text>

              <rect x="620" y="50" width="150" height="100" rx="12" fill="#1a1c21" stroke="#2dd4bf" stroke-width="2"/>
              <text x="695" y="90" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Commandes</text>
              <rect x="640" y="118" width="110" height="22" rx="6" fill="rgba(45,212,191,0.1)" stroke="#2dd4bf" stroke-width="0.8"/>
              <text x="695" y="133" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">sa propre DB</text>

              <rect x="450" y="170" width="150" height="100" rx="12" fill="#1a1c21" stroke="#2dd4bf" stroke-width="2"/>
              <text x="525" y="210" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Paiements</text>
              <rect x="470" y="238" width="110" height="22" rx="6" fill="rgba(45,212,191,0.1)" stroke="#2dd4bf" stroke-width="0.8"/>
              <text x="525" y="253" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">sa propre DB</text>

              <rect x="620" y="170" width="150" height="100" rx="12" fill="#1a1c21" stroke="#2dd4bf" stroke-width="2"/>
              <text x="695" y="210" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="13">Notifications</text>
              <rect x="640" y="238" width="110" height="22" rx="6" fill="rgba(45,212,191,0.1)" stroke="#2dd4bf" stroke-width="0.8"/>
              <text x="695" y="253" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">sa propre DB</text>
            </svg>
            <div class="diagram-caption">fig.1 &mdash; Monolithe (une seule unit&eacute;) vs Microservices (services autonomes avec DB isol&eacute;es)</div>
          </div>

          <div class="cards">
            <div
              v-for="card in introCards"
              :key="card.title"
              class="card"
              :class="card.colorClass"
            >
              <div class="card-icon">{{ card.icon }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-body">{{ card.body }}</p>
            </div>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════ -->
        <!-- Section 2 : Architecture compl  -->
        <!-- ═══════════════════════════════ -->
        <section id="architecture" class="section">
          <div class="section-eyebrow">Composants</div>
          <h2>Architecture compl&egrave;te</h2>
          <p>
            En production, un syst&egrave;me microservices ne se r&eacute;sume pas &agrave; &laquo;&nbsp;plusieurs apps&nbsp;&raquo;.
            Il y a une <strong>API Gateway</strong>, un <strong>Message Broker</strong>, des <strong>bases de donn&eacute;es isol&eacute;es</strong>,
            et un <strong>Service Registry</strong> pour que tout ce monde se retrouve.
          </p>

          <div class="diagram-wrap">
            <svg viewBox="0 0 820 580" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture microservices compl&egrave;te">
              <!-- Client -->
              <rect x="310" y="10" width="200" height="50" rx="12" fill="#22252c" stroke="#60a5fa" stroke-width="2"/>
              <text x="410" y="40" text-anchor="middle" fill="#60a5fa" font-family="IBM Plex Mono, monospace" font-size="13">Client (Browser/App)</text>

              <!-- Arrow client->gateway -->
              <line x1="410" y1="60" x2="410" y2="95" stroke="#353940" stroke-width="1.5" stroke-dasharray="4 3"/>
              <text x="435" y="82" fill="#6b7280" font-family="IBM Plex Mono, monospace" font-size="9">HTTPS</text>

              <!-- API Gateway -->
              <rect x="220" y="95" width="380" height="70" rx="14" fill="rgba(251,191,36,0.06)" stroke="#fbbf24" stroke-width="2"/>
              <text x="410" y="122" text-anchor="middle" fill="#fbbf24" font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing="0.08em">API GATEWAY</text>
              <text x="410" y="146" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="11">Auth JWT &bull; Rate Limit &bull; Routing &bull; Logging</text>

              <!-- Arrows gateway->services -->
              <line x1="300" y1="165" x2="160" y2="230" stroke="#353940" stroke-width="1.5" stroke-dasharray="4 3"/>
              <line x1="410" y1="165" x2="410" y2="230" stroke="#353940" stroke-width="1.5" stroke-dasharray="4 3"/>
              <line x1="520" y1="165" x2="660" y2="230" stroke="#353940" stroke-width="1.5" stroke-dasharray="4 3"/>
              <text x="220" y="195" fill="#6b7280" font-family="IBM Plex Mono, monospace" font-size="9">HTTP</text>
              <text x="415" y="195" fill="#6b7280" font-family="IBM Plex Mono, monospace" font-size="9">HTTP</text>
              <text x="600" y="195" fill="#6b7280" font-family="IBM Plex Mono, monospace" font-size="9">HTTP</text>

              <!-- Service 1 : Auth -->
              <rect x="60" y="230" width="200" height="90" rx="12" fill="#1a1c21" stroke="#a78bfa" stroke-width="1.5"/>
              <text x="160" y="260" text-anchor="middle" fill="#a78bfa" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.06em">AUTH SERVICE</text>
              <text x="160" y="280" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="11">Login, Register, JWT</text>
              <rect x="110" y="292" width="100" height="20" rx="6" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" stroke-width="0.8"/>
              <text x="160" y="306" text-anchor="middle" fill="#a78bfa" font-family="IBM Plex Mono, monospace" font-size="9">auth-db</text>

              <!-- Service 2 : Orders -->
              <rect x="310" y="230" width="200" height="90" rx="12" fill="#1a1c21" stroke="#4ade80" stroke-width="1.5"/>
              <text x="410" y="260" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.06em">ORDERS SERVICE</text>
              <text x="410" y="280" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="11">CRUD commandes</text>
              <rect x="360" y="292" width="100" height="20" rx="6" fill="rgba(74,222,128,0.08)" stroke="#4ade80" stroke-width="0.8"/>
              <text x="410" y="306" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="9">orders-db</text>

              <!-- Service 3 : Payments -->
              <rect x="560" y="230" width="200" height="90" rx="12" fill="#1a1c21" stroke="#f87171" stroke-width="1.5"/>
              <text x="660" y="260" text-anchor="middle" fill="#f87171" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.06em">PAYMENTS SERVICE</text>
              <text x="660" y="280" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="11">Stripe, Factures</text>
              <rect x="610" y="292" width="100" height="20" rx="6" fill="rgba(248,113,113,0.08)" stroke="#f87171" stroke-width="0.8"/>
              <text x="660" y="306" text-anchor="middle" fill="#f87171" font-family="IBM Plex Mono, monospace" font-size="9">payments-db</text>

              <!-- Message Broker -->
              <rect x="220" y="380" width="380" height="60" rx="14" fill="rgba(45,212,191,0.06)" stroke="#2dd4bf" stroke-width="2"/>
              <text x="410" y="408" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing="0.08em">MESSAGE BROKER</text>
              <text x="410" y="428" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="11">RabbitMQ / Kafka &mdash; Communication asynchrone</text>

              <!-- Arrows services->broker -->
              <line x1="160" y1="320" x2="310" y2="380" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="4 3"/>
              <line x1="410" y1="320" x2="410" y2="380" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="4 3"/>
              <line x1="660" y1="320" x2="510" y2="380" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="4 3"/>
              <text x="230" y="355" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">events</text>
              <text x="415" y="355" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">events</text>
              <text x="580" y="355" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">events</text>

              <!-- Notifications service (consumes from broker) -->
              <rect x="310" y="490" width="200" height="70" rx="12" fill="#1a1c21" stroke="#60a5fa" stroke-width="1.5"/>
              <text x="410" y="520" text-anchor="middle" fill="#60a5fa" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.06em">NOTIFICATIONS</text>
              <text x="410" y="540" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="11">Emails, Push, SMS</text>
              <line x1="410" y1="440" x2="410" y2="490" stroke="#60a5fa" stroke-width="1" stroke-dasharray="4 3"/>
              <text x="435" y="470" fill="#60a5fa" font-family="IBM Plex Mono, monospace" font-size="9">consume</text>
            </svg>
            <div class="diagram-caption">fig.2 &mdash; Architecture compl&egrave;te en production : Gateway, services, broker, DB isol&eacute;es</div>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════ -->
        <!-- Section 3 : API Gateway         -->
        <!-- ═══════════════════════════════ -->
        <section id="gateway" class="section">
          <div class="section-eyebrow">Composants</div>
          <h2>Le point d&rsquo;entr&eacute;e unique</h2>
          <p>
            L&rsquo;API Gateway est la <strong>porte d&rsquo;entr&eacute;e unique</strong> du syst&egrave;me.
            Aucun client n&rsquo;appelle directement un service &mdash; tout passe par le Gateway.
            Il g&egrave;re l&rsquo;authentification, le rate limiting, le routing, et enrichit les requ&ecirc;tes
            avant de les transf&eacute;rer au bon service.
          </p>

          <div class="callout">
            <div class="callout-icon">&#x1F511;</div>
            <div class="callout-content">
              <strong>R&egrave;gle d&rsquo;or :</strong> L&rsquo;auth JWT est v&eacute;rifi&eacute;e <em>uniquement</em> au niveau du Gateway.
              Les services downstream font confiance au header <code>x-user-id</code> inject&eacute; par le Gateway.
              Si un service re-v&eacute;rifie le JWT, c&rsquo;est un code smell.
            </div>
          </div>

          <div class="cards">
            <div
              v-for="card in gatewayCards"
              :key="card.title"
              class="card"
              :class="card.colorClass"
            >
              <div class="card-icon">{{ card.icon }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-body">{{ card.body }}</p>
            </div>
          </div>

          <h3>Comparaison des solutions Gateway</h3>

          <div class="table-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Nginx</th>
                  <th>Kong</th>
                  <th>AWS API GW</th>
                  <th>NestJS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in gatewayCompare" :key="row.feature">
                  <td>{{ row.feature }}</td>
                  <td :class="row.nginxClass">{{ row.nginx }}</td>
                  <td :class="row.kongClass">{{ row.kong }}</td>
                  <td :class="row.awsClass">{{ row.aws }}</td>
                  <td :class="row.nestjsClass">{{ row.nestjs }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="callout callout-info">
            <div class="callout-icon">&#x1F4A1;</div>
            <div class="callout-content">
              <strong>Recommandation :</strong> Commence avec <em>Nginx</em> si tu as juste besoin de routing.
              Passe &agrave; <em>NestJS</em> d&egrave;s que tu as besoin de logique m&eacute;tier au niveau du Gateway
              (transformation de requ&ecirc;tes, agr&eacute;gation de r&eacute;ponses, circuit breaker custom).
            </div>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════ -->
        <!-- Section 4 : Nginx vs NestJS         -->
        <!-- ═══════════════════════════════════ -->
        <section id="nginx" class="section">
          <div class="section-eyebrow">Composants</div>
          <h2>Pourquoi Nginx peut remplacer NestJS</h2>
          <p>
            Pour du <strong>simple reverse proxy</strong>, Nginx fait le job en quelques lignes de config.
            Pas de code TypeScript, pas de build, pas de <code>node_modules</code>.
            L&rsquo;overhead est quasi nul compar&eacute; &agrave; une app Node.js.
          </p>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">nginx.conf</span>
              <span class="code-lang">nginx</span>
            </div>
            <pre v-html="codeNginx"></pre>
          </div>

          <div class="callout callout-warn">
            <div class="callout-icon">&#x26A0;&#xFE0F;</div>
            <div class="callout-content">
              <strong>Limite :</strong> Nginx ne fait pas de logique m&eacute;tier. Pas de v&eacute;rification JWT native,
              pas de transformation de payload, pas de circuit breaker. D&egrave;s que tu as besoin de &ccedil;a,
              il faut passer &agrave; une solution programmatique (NestJS, Kong avec plugins).
            </div>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════ -->
        <!-- Section 5 : Gateway NestJS complet  -->
        <!-- ═══════════════════════════════════ -->
        <section id="gateway-code" class="section">
          <div class="section-eyebrow">Composants</div>
          <h2>Gateway NestJS complet</h2>
          <p>
            Le Gateway NestJS agit comme un <strong>proxy intelligent</strong>. Il intercepte toutes les requ&ecirc;tes,
            v&eacute;rifie le JWT via un Guard, enrichit les headers, et forward la requ&ecirc;te vers le bon service.
          </p>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">gateway.controller.ts</span>
              <span class="code-lang">TypeScript</span>
            </div>
            <pre v-html="codeGatewayController"></pre>
          </div>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">auth.guard.ts</span>
              <span class="code-lang">TypeScript</span>
            </div>
            <pre v-html="codeAuthGuard"></pre>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════ -->
        <!-- Section 6 : Structure d'un service  -->
        <!-- ═══════════════════════════════════ -->
        <section id="services" class="section">
          <div class="section-eyebrow">Services m&eacute;tier</div>
          <h2>Structure d&rsquo;un service</h2>
          <p>
            Chaque microservice est une <strong>application autonome</strong> avec sa propre base de donn&eacute;es,
            son propre sch&eacute;ma, ses propres tests. Il ne partage rien avec les autres services &mdash;
            ni code, ni DB, ni mod&egrave;les.
          </p>

          <div class="cards cards-4">
            <div
              v-for="card in serviceCards"
              :key="card.title"
              class="card"
              :class="card.colorClass"
            >
              <div class="card-icon">{{ card.icon }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-body" v-html="card.body"></p>
            </div>
          </div>

          <div class="diagram-wrap">
            <svg viewBox="0 0 820 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Anatomie d'un service m&eacute;tier">
              <text x="410" y="22" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.1em">ANATOMIE D'UN SERVICE METIER</text>

              <!-- Outer box -->
              <rect x="60" y="40" width="700" height="240" rx="16" fill="#1a1c21" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="6 4"/>
              <text x="410" y="68" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="12">orders-service</text>

              <!-- Controller -->
              <rect x="100" y="90" width="180" height="70" rx="10" fill="rgba(251,191,36,0.06)" stroke="#fbbf24" stroke-width="1.2"/>
              <text x="190" y="118" text-anchor="middle" fill="#fbbf24" font-family="IBM Plex Mono, monospace" font-size="11">Controller</text>
              <text x="190" y="140" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="10">HTTP routes</text>

              <!-- Service -->
              <rect x="320" y="90" width="180" height="70" rx="10" fill="rgba(167,139,250,0.06)" stroke="#a78bfa" stroke-width="1.2"/>
              <text x="410" y="118" text-anchor="middle" fill="#a78bfa" font-family="IBM Plex Mono, monospace" font-size="11">Service</text>
              <text x="410" y="140" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="10">Business logic</text>

              <!-- Repository -->
              <rect x="540" y="90" width="180" height="70" rx="10" fill="rgba(45,212,191,0.06)" stroke="#2dd4bf" stroke-width="1.2"/>
              <text x="630" y="118" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="11">Repository</text>
              <text x="630" y="140" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="10">DB access (TypeORM)</text>

              <!-- Arrows between layers -->
              <line x1="280" y1="125" x2="320" y2="125" stroke="#353940" stroke-width="1.2"/>
              <polygon points="318,121 326,125 318,129" fill="#353940"/>
              <line x1="500" y1="125" x2="540" y2="125" stroke="#353940" stroke-width="1.2"/>
              <polygon points="538,121 546,125 538,129" fill="#353940"/>

              <!-- Events module -->
              <rect x="320" y="190" width="180" height="60" rx="10" fill="rgba(96,165,250,0.06)" stroke="#60a5fa" stroke-width="1.2"/>
              <text x="410" y="218" text-anchor="middle" fill="#60a5fa" font-family="IBM Plex Mono, monospace" font-size="11">Events</text>
              <text x="410" y="236" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="10">Publish to broker</text>

              <!-- Arrow service->events -->
              <line x1="410" y1="160" x2="410" y2="190" stroke="#353940" stroke-width="1.2"/>
              <polygon points="406,188 410,196 414,188" fill="#353940"/>

              <!-- DB -->
              <rect x="540" y="190" width="180" height="60" rx="10" fill="rgba(74,222,128,0.06)" stroke="#4ade80" stroke-width="1.2"/>
              <text x="630" y="218" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="11">PostgreSQL</text>
              <text x="630" y="236" text-anchor="middle" fill="#9ca3af" font-family="DM Sans, sans-serif" font-size="10">DB priv&eacute;e isol&eacute;e</text>

              <!-- Arrow repo->db -->
              <line x1="630" y1="160" x2="630" y2="190" stroke="#353940" stroke-width="1.2"/>
              <polygon points="626,188 630,196 634,188" fill="#353940"/>
            </svg>
            <div class="diagram-caption">fig.3 &mdash; Anatomie d&rsquo;un service m&eacute;tier : Controller &rarr; Service &rarr; Repository + Events</div>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════════ -->
        <!-- Section 7 : Impl&eacute;mentation compl&egrave;te   -->
        <!-- ═══════════════════════════════════════ -->
        <section id="services-code" class="section">
          <div class="section-eyebrow">Services m&eacute;tier</div>
          <h2>Impl&eacute;mentation compl&egrave;te</h2>
          <p>
            Voici le code complet d&rsquo;un service <strong>Orders</strong> &mdash; entity TypeORM,
            service m&eacute;tier, et configuration Docker pour l&rsquo;isolation.
          </p>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">order.entity.ts</span>
              <span class="code-lang">TypeScript</span>
            </div>
            <pre v-html="codeOrderEntity"></pre>
          </div>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">orders.service.ts</span>
              <span class="code-lang">TypeScript</span>
            </div>
            <pre v-html="codeOrdersService"></pre>
          </div>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">docker-compose.yml</span>
              <span class="code-lang">YAML</span>
            </div>
            <pre v-html="codeDockerCompose"></pre>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════ -->
        <!-- Section 8 : Message Broker          -->
        <!-- ═══════════════════════════════════ -->
        <section id="broker" class="section">
          <div class="section-eyebrow">Communication</div>
          <h2>La bo&icirc;te aux lettres du syst&egrave;me</h2>
          <p>
            Le <strong>Message Broker</strong> est l&rsquo;interm&eacute;diaire entre les services.
            Au lieu d&rsquo;appels HTTP directs (synchrones, fragiles), les services publient des <em>events</em>
            sur le broker. D&rsquo;autres services s&rsquo;y abonnent et r&eacute;agissent &mdash; sans conna&icirc;tre l&rsquo;&eacute;metteur.
          </p>

          <div class="diagram-wrap">
            <svg viewBox="0 0 820 290" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Appels directs vs Message Broker">
              <!-- Direct calls (left) -->
              <text x="200" y="22" text-anchor="middle" fill="#f87171" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.1em">APPELS DIRECTS</text>
              <rect x="60" y="40" width="120" height="50" rx="10" fill="#1a1c21" stroke="#f87171" stroke-width="1.2"/>
              <text x="120" y="70" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="12">Orders</text>
              <rect x="220" y="40" width="120" height="50" rx="10" fill="#1a1c21" stroke="#f87171" stroke-width="1.2"/>
              <text x="280" y="70" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="12">Payments</text>
              <rect x="140" y="120" width="120" height="50" rx="10" fill="#1a1c21" stroke="#f87171" stroke-width="1.2"/>
              <text x="200" y="150" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="12">Notifs</text>

              <!-- Direct arrows (messy coupling) -->
              <line x1="180" y1="65" x2="220" y2="65" stroke="#f87171" stroke-width="1.2"/>
              <polygon points="218,61 226,65 218,69" fill="#f87171"/>
              <line x1="160" y1="90" x2="175" y2="120" stroke="#f87171" stroke-width="1.2"/>
              <polygon points="171,118 178,124 175,114" fill="#f87171"/>
              <line x1="260" y1="90" x2="230" y2="120" stroke="#f87171" stroke-width="1.2"/>
              <polygon points="226,115 227,124 234,118" fill="#f87171"/>

              <text x="200" y="200" text-anchor="middle" fill="#f87171" font-family="IBM Plex Mono, monospace" font-size="10">Couplage fort</text>
              <text x="200" y="216" text-anchor="middle" fill="#6b7280" font-family="DM Sans, sans-serif" font-size="10">Chaque service conna&icirc;t les autres</text>

              <!-- Separator -->
              <line x1="410" y1="30" x2="410" y2="260" stroke="#353940" stroke-width="1" stroke-dasharray="4 3"/>
              <text x="410" y="275" text-anchor="middle" fill="#6b7280" font-family="IBM Plex Mono, monospace" font-size="10">vs</text>

              <!-- Broker (right) -->
              <text x="620" y="22" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="0.1em">MESSAGE BROKER</text>
              <rect x="500" y="40" width="120" height="50" rx="10" fill="#1a1c21" stroke="#4ade80" stroke-width="1.2"/>
              <text x="560" y="70" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="12">Orders</text>
              <rect x="660" y="40" width="120" height="50" rx="10" fill="#1a1c21" stroke="#a78bfa" stroke-width="1.2"/>
              <text x="720" y="70" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="12">Payments</text>
              <rect x="580" y="170" width="120" height="50" rx="10" fill="#1a1c21" stroke="#60a5fa" stroke-width="1.2"/>
              <text x="640" y="200" text-anchor="middle" fill="#e2e4e9" font-family="DM Sans, sans-serif" font-size="12">Notifs</text>

              <!-- Broker box -->
              <rect x="550" y="110" width="180" height="40" rx="8" fill="rgba(45,212,191,0.06)" stroke="#2dd4bf" stroke-width="1.5"/>
              <text x="640" y="135" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="11">RabbitMQ</text>

              <!-- Broker arrows -->
              <line x1="560" y1="90" x2="600" y2="110" stroke="#2dd4bf" stroke-width="1"/>
              <polygon points="596,107 604,112 598,116" fill="#2dd4bf"/>
              <line x1="680" y1="110" x2="720" y2="90" stroke="#2dd4bf" stroke-width="1"/>
              <polygon points="716,87 724,86 718,94" fill="#2dd4bf"/>
              <line x1="640" y1="150" x2="640" y2="170" stroke="#2dd4bf" stroke-width="1"/>
              <polygon points="636,168 640,176 644,168" fill="#2dd4bf"/>

              <text x="640" y="250" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="10">Couplage faible</text>
              <text x="640" y="266" text-anchor="middle" fill="#6b7280" font-family="DM Sans, sans-serif" font-size="10">Les services ne se connaissent pas</text>
            </svg>
            <div class="diagram-caption">fig.4 &mdash; Appels directs (couplage fort) vs Message Broker (couplage faible)</div>
          </div>

          <h3>RabbitMQ vs Kafka</h3>

          <div class="table-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th>Crit&egrave;re</th>
                  <th>RabbitMQ</th>
                  <th>Kafka</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in brokerCompare" :key="row.criteria">
                  <td>{{ row.criteria }}</td>
                  <td :class="row.rabbitmqClass">{{ row.rabbitmq }}</td>
                  <td :class="row.kafkaClass">{{ row.kafka }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════ -->
        <!-- Section 9 : RabbitMQ + NestJS       -->
        <!-- ═══════════════════════════════════ -->
        <section id="broker-code" class="section">
          <div class="section-eyebrow">Communication</div>
          <h2>RabbitMQ + NestJS</h2>
          <p>
            Voici comment un service <strong>&eacute;met</strong> un event et comment un autre service
            <strong>&eacute;coute</strong> ce m&ecirc;me event &mdash; sans que les deux ne se connaissent.
          </p>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">orders-events.service.ts</span>
              <span class="code-lang">TypeScript</span>
            </div>
            <pre v-html="codeOrdersEvents"></pre>
          </div>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">payments.controller.ts</span>
              <span class="code-lang">TypeScript</span>
            </div>
            <pre v-html="codePaymentsController"></pre>
          </div>

          <div class="code-block">
            <div class="code-header">
              <span class="code-filename">main.ts</span>
              <span class="code-lang">TypeScript</span>
            </div>
            <pre v-html="codeMainTs"></pre>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════ -->
        <!-- Section 10 : Flux complet           -->
        <!-- ═══════════════════════════════════ -->
        <section id="flow" class="section">
          <div class="section-eyebrow">Communication</div>
          <h2>Passer une commande</h2>
          <p>
            Voici le flux complet quand un utilisateur passe une commande &mdash; du clic sur &laquo;&nbsp;Commander&nbsp;&raquo;
            jusqu&rsquo;&agrave; la r&eacute;ception de l&rsquo;email de confirmation.
          </p>

          <div class="diagram-wrap">
            <svg viewBox="0 0 820 380" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="S&eacute;quence compl&egrave;te d'une commande">
              <!-- Timeline labels -->
              <text x="100" y="30" text-anchor="middle" fill="#60a5fa" font-family="IBM Plex Mono, monospace" font-size="10">Client</text>
              <text x="270" y="30" text-anchor="middle" fill="#fbbf24" font-family="IBM Plex Mono, monospace" font-size="10">Gateway</text>
              <text x="440" y="30" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="10">Orders</text>
              <text x="610" y="30" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="10">Broker</text>
              <text x="740" y="30" text-anchor="middle" fill="#a78bfa" font-family="IBM Plex Mono, monospace" font-size="10">Payments</text>

              <!-- Vertical lines -->
              <line x1="100" y1="40" x2="100" y2="360" stroke="#353940" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="270" y1="40" x2="270" y2="360" stroke="#353940" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="440" y1="40" x2="440" y2="360" stroke="#353940" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="610" y1="40" x2="610" y2="360" stroke="#353940" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="740" y1="40" x2="740" y2="360" stroke="#353940" stroke-width="1" stroke-dasharray="3 3"/>

              <!-- Step 1: Client -> Gateway -->
              <line x1="100" y1="70" x2="270" y2="70" stroke="#60a5fa" stroke-width="1.5"/>
              <polygon points="266,66 274,70 266,74" fill="#60a5fa"/>
              <text x="185" y="62" text-anchor="middle" fill="#60a5fa" font-family="IBM Plex Mono, monospace" font-size="9">POST /orders</text>
              <rect x="180" y="75" width="60" height="16" rx="4" fill="rgba(96,165,250,0.1)"/>
              <text x="210" y="87" text-anchor="middle" fill="#60a5fa" font-family="IBM Plex Mono, monospace" font-size="8">+ JWT</text>

              <!-- Step 2: Gateway checks JWT -->
              <rect x="240" y="100" width="60" height="30" rx="6" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" stroke-width="0.8"/>
              <text x="270" y="119" text-anchor="middle" fill="#fbbf24" font-family="IBM Plex Mono, monospace" font-size="8">JWT OK</text>

              <!-- Step 3: Gateway -> Orders -->
              <line x1="270" y1="150" x2="440" y2="150" stroke="#fbbf24" stroke-width="1.5"/>
              <polygon points="436,146 444,150 436,154" fill="#fbbf24"/>
              <text x="355" y="142" text-anchor="middle" fill="#fbbf24" font-family="IBM Plex Mono, monospace" font-size="9">forward + x-user-id</text>

              <!-- Step 4: Orders processes -->
              <rect x="410" y="165" width="60" height="30" rx="6" fill="rgba(74,222,128,0.08)" stroke="#4ade80" stroke-width="0.8"/>
              <text x="440" y="184" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="8">save DB</text>

              <!-- Step 5: Orders -> Broker -->
              <line x1="440" y1="210" x2="610" y2="210" stroke="#2dd4bf" stroke-width="1.5"/>
              <polygon points="606,206 614,210 606,214" fill="#2dd4bf"/>
              <text x="525" y="202" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="9">emit order.created</text>

              <!-- Step 6: Orders -> Client (response) -->
              <line x1="440" y1="240" x2="100" y2="240" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="4 3"/>
              <polygon points="104,236 96,240 104,244" fill="#4ade80"/>
              <text x="270" y="255" text-anchor="middle" fill="#4ade80" font-family="IBM Plex Mono, monospace" font-size="9">201 Created (avant que Payments traite)</text>

              <!-- Step 7: Broker -> Payments -->
              <line x1="610" y1="290" x2="740" y2="290" stroke="#a78bfa" stroke-width="1.5"/>
              <polygon points="736,286 744,290 736,294" fill="#a78bfa"/>
              <text x="675" y="282" text-anchor="middle" fill="#a78bfa" font-family="IBM Plex Mono, monospace" font-size="9">order.created</text>

              <!-- Step 8: Payments processes -->
              <rect x="710" y="305" width="60" height="30" rx="6" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" stroke-width="0.8"/>
              <text x="740" y="324" text-anchor="middle" fill="#a78bfa" font-family="IBM Plex Mono, monospace" font-size="8">charge</text>

              <!-- Async zone label -->
              <rect x="30" y="265" width="90" height="20" rx="6" fill="rgba(45,212,191,0.08)" stroke="#2dd4bf" stroke-width="0.8"/>
              <text x="75" y="279" text-anchor="middle" fill="#2dd4bf" font-family="IBM Plex Mono, monospace" font-size="8">ASYNC</text>
            </svg>
            <div class="diagram-caption">fig.5 &mdash; S&eacute;quence compl&egrave;te : le client re&ccedil;oit sa r&eacute;ponse <em>avant</em> que le paiement soit trait&eacute;</div>
          </div>

          <div class="callout">
            <div class="callout-icon">&#x1F4E8;</div>
            <div class="callout-content">
              <strong>Point cl&eacute; :</strong> Le service Orders r&eacute;pond <code>201 Created</code> au client
              <em>avant</em> que le paiement soit trait&eacute;. Le paiement se fait de mani&egrave;re asynchrone
              via le broker. C&rsquo;est le principe du <strong>fire-and-forget</strong>.
            </div>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════════ -->
        <!-- Section 11 : Quand adopter ?            -->
        <!-- ═══════════════════════════════════════ -->
        <section id="quand" class="section">
          <div class="section-eyebrow">R&eacute;f&eacute;rences</div>
          <h2>Quand adopter les microservices&nbsp;?</h2>
          <p>
            Les microservices ne sont <strong>pas une silver bullet</strong>. Martin Fowler lui-m&ecirc;me
            recommande de commencer par un monolithe et de migrer quand la douleur organisationnelle
            d&eacute;passe la douleur technique.
          </p>

          <div class="flow-steps">
            <div
              v-for="(step, i) in flowSteps"
              :key="i"
              class="flow-step"
            >
              <div class="flow-num" :class="step.numClass">{{ i + 1 }}</div>
              <p class="flow-text" v-html="step.text"></p>
              <div v-if="i < flowSteps.length - 1" class="flow-connector" />
            </div>
          </div>

          <div class="section-divider" />
        </section>

        <!-- ═══════════════════════════════════════ -->
        <!-- Section 12 : Pi&egrave;ges classiques   -->
        <!-- ═══════════════════════════════════════ -->
        <section id="pieges" class="section">
          <div class="section-eyebrow">R&eacute;f&eacute;rences</div>
          <h2>Ce qui peut mal tourner</h2>
          <p>
            Les microservices introduisent une <strong>complexit&eacute; op&eacute;rationnelle</strong> significative.
            Voici les pi&egrave;ges les plus fr&eacute;quents rencontr&eacute;s en production.
          </p>

          <div class="cards cards-4">
            <div
              v-for="card in trapCards"
              :key="card.title"
              class="card"
              :class="card.colorClass"
            >
              <div class="card-icon">{{ card.icon }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-body" v-html="card.body"></p>
            </div>
          </div>

          <div class="callout callout-warn">
            <div class="callout-icon">&#x26A0;&#xFE0F;</div>
            <div class="callout-content">
              <strong>R&egrave;gle de survie :</strong> Si tu ne peux pas nommer clairement les <em>bounded contexts</em>
              de ton domaine, tu n&rsquo;es pas pr&ecirc;t pour les microservices. Tu vas d&eacute;couper au mauvais endroit
              et cr&eacute;er un <strong>monolithe distribu&eacute;</strong> &mdash; la pire des architectures possibles.
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
  --bg2: #141518;
  --bg3: #1a1c21;
  --bg4: #22252c;
  --border: #2a2d35;
  --border2: #353940;
  --text: #e2e4e9;
  --text2: #9ca3af;
  --text3: #6b7280;
  --accent: #4ade80;
  --accent2: #22c55e;
  --amber: #fbbf24;
  --teal: #2dd4bf;
  --purple: #a78bfa;
  --coral: #f87171;
  --blue: #60a5fa;
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
  font-size: 0.8rem;
  color: var(--text3);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: color 0.2s;
}
.back-link:hover { color: var(--accent); }
.back-link::before { content: '\2190'; font-size: 14px; }

/* ── Hero ── */
.hero {
  margin-bottom: 56px;
}

.hero-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero h1 {
  font-family: var(--serif);
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 16px;
}

.hero h1 em {
  color: var(--accent);
  font-style: normal;
}

.hero-desc {
  font-size: 1.05rem;
  color: var(--text2);
  max-width: 600px;
  line-height: 1.7;
  margin-bottom: 20px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-tag {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text2);
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  letter-spacing: 0.04em;
}

/* ── Sections ── */
.section {
  margin-bottom: 16px;
  scroll-margin-top: 32px;
}

.section-eyebrow {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.section h2 {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: var(--text);
  margin-bottom: 16px;
  line-height: 1.2;
}

.section h3 {
  font-family: var(--serif);
  font-size: 1.25rem;
  color: var(--text);
  margin: 32px 0 16px;
}

.section p {
  color: var(--text2);
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.section p strong {
  color: var(--text);
  font-weight: 500;
}

.section p em {
  color: var(--accent);
  font-style: normal;
}

.section p code {
  font-family: var(--mono);
  font-size: 0.85em;
  color: var(--accent);
  background: rgba(74, 222, 128, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

.section-divider {
  height: 1px;
  background: var(--border);
  margin: 48px 0;
}

/* ── Callouts ── */
.callout {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(74, 222, 128, 0.04);
  border: 1px solid rgba(74, 222, 128, 0.15);
  border-radius: 12px;
  margin: 24px 0;
}

.callout-icon {
  font-size: 20px;
  flex-shrink: 0;
  line-height: 1.6;
}

.callout-content {
  font-size: 0.9rem;
  color: var(--text2);
  line-height: 1.7;
}

.callout-content strong {
  color: var(--text);
  font-weight: 500;
}

.callout-content em {
  color: var(--accent);
  font-style: normal;
}

.callout-content code {
  font-family: var(--mono);
  font-size: 0.85em;
  color: var(--accent);
  background: rgba(74, 222, 128, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

.callout-info {
  background: rgba(96, 165, 250, 0.04);
  border-color: rgba(96, 165, 250, 0.15);
}

.callout-info .callout-content em {
  color: var(--blue);
}

.callout-warn {
  background: rgba(251, 191, 36, 0.04);
  border-color: rgba(251, 191, 36, 0.15);
}

.callout-warn .callout-content strong {
  color: var(--amber);
}

.callout-warn .callout-content em {
  color: var(--amber);
}

/* ── Code blocks ── */
.code-block {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: var(--bg3);
  border-bottom: 1px solid var(--border);
}

.code-filename {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  font-weight: 500;
}

.code-lang {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text3);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.code-block pre {
  padding: 20px;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text2);
  margin: 0;
}

/* Syntax highlighting for v-html code blocks */
:deep(.kw) { color: var(--purple); }
:deep(.dec) { color: var(--blue); }
:deep(.str) { color: var(--accent); }
:deep(.cmt) { color: var(--text3); font-style: italic; }
:deep(.fn) { color: var(--amber); }
:deep(.cls) { color: var(--teal); }
:deep(.num) { color: var(--coral); }

/* ── SVG diagrams ── */
.diagram-wrap {
  margin: 28px 0;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px 24px 16px;
}

.diagram-wrap svg {
  width: 100%;
  height: auto;
}

.diagram-caption {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text3);
  text-align: center;
  margin-top: 16px;
  line-height: 1.5;
}

/* ── Comparison tables ── */
.table-wrap {
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.compare-table th {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text);
  text-align: left;
  padding: 12px 16px;
  background: var(--bg3);
  border-bottom: 1px solid var(--border);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.compare-table td {
  padding: 10px 16px;
  color: var(--text2);
  border-bottom: 1px solid var(--border);
  font-family: var(--sans);
  white-space: nowrap;
}

.compare-table tr:last-child td {
  border-bottom: none;
}

.compare-table td:first-child {
  color: var(--text);
  font-weight: 400;
}

.compare-table .check { color: var(--accent); }
.compare-table .cross { color: var(--coral); }
.compare-table .partial { color: var(--amber); }

/* ── Cards ── */
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0;
}

.cards.cards-4 {
  grid-template-columns: repeat(2, 1fr);
}

.card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.2s;
}

.card:hover {
  border-color: var(--border2);
}

.card-icon {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.card-title {
  font-family: var(--serif);
  font-size: 1.05rem;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.3;
}

.card-body {
  font-size: 0.88rem;
  color: var(--text2);
  line-height: 1.6;
}

:deep(.card-body code) {
  font-family: var(--mono);
  font-size: 0.85em;
  color: var(--accent);
  background: rgba(74, 222, 128, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Card color variants */
.card.coral {
  border-color: rgba(248, 113, 113, 0.2);
}
.card.coral .card-icon { color: var(--coral); }
.card.coral:hover { border-color: rgba(248, 113, 113, 0.4); }

.card.teal {
  border-color: rgba(45, 212, 191, 0.2);
}
.card.teal .card-icon { color: var(--teal); }
.card.teal:hover { border-color: rgba(45, 212, 191, 0.4); }

.card.amber {
  border-color: rgba(251, 191, 36, 0.2);
}
.card.amber .card-icon { color: var(--amber); }
.card.amber:hover { border-color: rgba(251, 191, 36, 0.4); }

.card.purple {
  border-color: rgba(167, 139, 250, 0.2);
}
.card.purple .card-icon { color: var(--purple); }
.card.purple:hover { border-color: rgba(167, 139, 250, 0.4); }

/* ── Flow steps ── */
.flow-steps {
  margin: 28px 0;
}

.flow-step {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  padding-bottom: 8px;
}

.flow-num {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  background: rgba(248, 113, 113, 0.1);
  color: var(--coral);
  border: 1px solid rgba(248, 113, 113, 0.25);
}

.flow-num.teal {
  background: rgba(45, 212, 191, 0.1);
  color: var(--teal);
  border-color: rgba(45, 212, 191, 0.25);
}

.flow-num.amber {
  background: rgba(251, 191, 36, 0.1);
  color: var(--amber);
  border-color: rgba(251, 191, 36, 0.25);
}

.flow-num.coral {
  background: rgba(248, 113, 113, 0.1);
  color: var(--coral);
  border-color: rgba(248, 113, 113, 0.25);
}

.flow-text {
  font-size: 0.9rem;
  color: var(--text2);
  line-height: 1.7;
  padding-top: 6px;
}

:deep(.flow-text strong) {
  color: var(--text);
  font-weight: 500;
}

.flow-connector {
  position: absolute;
  left: 17px;
  top: 44px;
  width: 2px;
  height: 24px;
  background: var(--border);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .main {
    margin-left: 0;
    padding: 24px 16px 60px;
  }

  .cards,
  .cards.cards-4 {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .compare-table {
    font-size: 0.75rem;
  }

  .compare-table th,
  .compare-table td {
    padding: 8px 10px;
  }
}
</style>
