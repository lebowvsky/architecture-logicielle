<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (concept cards, comparison cards, flow steps,
 *          decision table rows) are modeled as typed arrays and rendered via v-for,
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

interface ConceptCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
}

interface PatternCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
}

interface SagaStyleCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
}

interface FlowStep {
  colorClass: string
  label: string
  text: string
}

interface DecisionRow {
  signal: string
  edaSeul: { text: string; cssClass: string }
  edaCqrs: { text: string; cssClass: string }
  edaCqrsSaga: { text: string; cssClass: string }
}

interface LegendItem {
  color: string
  label: string
}

const conceptCards: ConceptCard[] = [
  {
    icon: '\u{1F4E4}',
    colorClass: 'yellow',
    name: 'Producteur',
    title: 'Publisher / Emitter',
    description:
      'Publie un evenement sans savoir qui l\'ecoutera. Ne retourne rien. Ne connait aucun consommateur. Couplage zero vers l\'aval.',
    tags: ['fire & forget', 'no return'],
  },
  {
    icon: '\u{1F68C}',
    colorClass: 'orange',
    name: 'Event Bus',
    title: 'Message Broker',
    description:
      'Canal de transport. Garantit livraison, routage par topic, persistance. C\'est un <strong>detail d\'infrastructure</strong> — derriere une interface.',
    tags: ['Kafka', 'RabbitMQ', 'NATS'],
  },
  {
    icon: '\u{1F4E5}',
    colorClass: 'green',
    name: 'Consommateur',
    title: 'Subscriber / Listener',
    description:
      'S\'abonne aux evenements qui l\'interessent. Reagit de maniere autonome. Plusieurs consommateurs peuvent ecouter le meme evenement.',
    tags: ['subscribe', 'idempotent'],
  },
]

const patternCards: PatternCard[] = [
  {
    icon: '\u{1F514}',
    colorClass: 'blue',
    name: 'Pattern 1',
    title: 'Simple Event Notification',
    description:
      'Fire & forget. Le producteur emet, les consommateurs reagissent. Decouplage maximal. Ideal pour les notifications et les side-effects non-critiques.',
    tags: ['Async', 'Decouple', 'Simple'],
  },
  {
    icon: '\u{1F4DA}',
    colorClass: 'purple',
    name: 'Pattern 2',
    title: 'Event Sourcing',
    description:
      'L\'etat de l\'application = rejouer la sequence des evenements. L\'Event Store est la <strong>source de verite</strong>. Audit trail parfait. Time travel possible.',
    tags: ['Append-only', 'Replay', 'Audit'],
  },
  {
    icon: '\u26A1',
    colorClass: 'green',
    name: 'Pattern 3',
    title: 'CQRS + Event Sourcing',
    description:
      'Write Side base sur Event Sourcing. Read Side base sur des projections denormalisees reconstruites depuis les events. Scalabilite R/W independante.',
    tags: ['Scalable', 'Eventual', 'Optimise'],
  },
]

const sagaStyleCards: SagaStyleCard[] = [
  {
    icon: '\u{1F483}',
    colorClass: 'blue',
    name: 'Style 1',
    title: 'Choreography',
    description:
      'Chaque service connait ses voisins via des evenements. Pas de coordinateur central. Simple a mettre en place.',
    tags: ['\u2713 Pas de SPOF', '\u2713 Simple', '\u2717 Logique dispersee', '\u2717 Debug difficile'],
  },
  {
    icon: '\u{1F3BC}',
    colorClass: 'purple',
    name: 'Style 2',
    title: 'Orchestration',
    description:
      'Un Orchestrateur central coordonne tous les services. Logique centralisee, lisible, monitorable. Services participants restent simples.',
    tags: ['\u2713 Lisible', '\u2713 Monitorable', '\u2717 SPOF potentiel', '\u2717 Couplage central'],
  },
]

const piegeSteps: FlowStep[] = [
  {
    colorClass: 'red',
    label: '!',
    text: '<strong>Publier avant de persister.</strong> <code>mergeObjectContext(aggregate)</code> publie les events immediatement dans <code>apply()</code>. Si le <code>save()</code> echoue ensuite, les projections sont corrompues et l\'etat est incoherent. <strong>Regle : persister d\'abord, <code>publishAll()</code> ensuite.</strong>',
  },
  {
    colorClass: 'red',
    label: '!',
    text: '<strong>Observable SAGA sans catchError.</strong> Une exception non catchee termine l\'Observable silencieusement. Le SAGA cesse de fonctionner sans aucun log d\'erreur. Toujours : <code>catchError((err, src) =&gt; { logger.error(err); return src; })</code>.',
  },
  {
    colorClass: 'yellow',
    label: '!',
    text: '<strong>EventBus synchrone dans le meme process.</strong> Par defaut, <code>EventBus.publish()</code> en NestJS est synchrone dans le meme processus. Pour une vraie EDA distribuee (Kafka, RabbitMQ), brancher un publisher custom via <code>@nestjs/microservices</code> ou un adaptateur externe.',
  },
  {
    colorClass: 'yellow',
    label: '!',
    text: '<strong>Logique metier dans l\'Orchestrateur.</strong> L\'orchestrateur SAGA dirige <em>quoi faire</em>, pas <em>comment</em>. Des qu\'il contient une regle metier (calcul, condition autre que le statut), c\'est une violation. La regle va dans l\'Agregat, pas dans la SAGA.',
  },
  {
    colorClass: 'purple',
    label: '!',
    text: '<strong><code>@Entity()</code> TypeORM sur l\'Agregat.</strong> La violation la plus repandue en NestJS. L\'Agregat appartient au domaine — zero dependance vers <code>@nestjs/typeorm</code>. Utiliser le double modele : Agregat de domaine + ORM Entity + Mapper.',
  },
]

const decisionRows: DecisionRow[] = [
  {
    signal: 'Ratio lectures/ecritures',
    edaSeul: { text: '\u2713 Equilibre', cssClass: 'dt-ok' },
    edaCqrs: { text: '\u2713 Asymetrique (100:1)', cssClass: 'dt-ok' },
    edaCqrsSaga: { text: '\u2713 Asymetrique', cssClass: 'dt-ok' },
  },
  {
    signal: 'Transactions distribuees',
    edaSeul: { text: '\u26A0 Difficile', cssClass: 'dt-warn' },
    edaCqrs: { text: '\u26A0 Difficile', cssClass: 'dt-warn' },
    edaCqrsSaga: { text: '\u2713 Natif', cssClass: 'dt-ok' },
  },
  {
    signal: 'Audit trail requis',
    edaSeul: { text: '\u26A0 Partiel', cssClass: 'dt-warn' },
    edaCqrs: { text: '\u2713 Event Sourcing', cssClass: 'dt-ok' },
    edaCqrsSaga: { text: '\u2713 Complet', cssClass: 'dt-ok' },
  },
  {
    signal: 'Vues de lecture complexes',
    edaSeul: { text: '\u26A0 JOINs lourds', cssClass: 'dt-warn' },
    edaCqrs: { text: '\u2713 Projections optimisees', cssClass: 'dt-ok' },
    edaCqrsSaga: { text: '\u2713 Projections optimisees', cssClass: 'dt-ok' },
  },
  {
    signal: 'Taille equipe',
    edaSeul: { text: '\u2713 2+ devs', cssClass: 'dt-ok' },
    edaCqrs: { text: '\u26A0 5+ devs', cssClass: 'dt-warn' },
    edaCqrsSaga: { text: '\u2717 8+ devs recommande', cssClass: 'dt-no' },
  },
  {
    signal: 'Coherence forte requise',
    edaSeul: { text: '\u2717 Eventual', cssClass: 'dt-bad' },
    edaCqrs: { text: '\u2717 Eventual', cssClass: 'dt-bad' },
    edaCqrsSaga: { text: '\u2717 Eventual — compromis', cssClass: 'dt-bad' },
  },
  {
    signal: 'Complexite domaine',
    edaSeul: { text: '\u26A0 Moyenne', cssClass: 'dt-warn' },
    edaCqrs: { text: '\u2713 Elevee (DDD)', cssClass: 'dt-ok' },
    edaCqrsSaga: { text: '\u2713 Tres elevee (DDD)', cssClass: 'dt-ok' },
  },
  {
    signal: 'Exemple concret',
    edaSeul: { text: 'Notifications, webhooks', cssClass: '' },
    edaCqrs: { text: 'E-commerce, reporting', cssClass: '' },
    edaCqrsSaga: { text: 'Paiement, reservation, logistique', cssClass: '' },
  },
]

const legendItems: LegendItem[] = [
  { color: '#e8c84a', label: 'EDA / Events' },
  { color: '#4ae8b0', label: 'Read Side / Consommateurs' },
  { color: '#e84a7a', label: 'Write Side / Commands' },
  { color: '#a78bfa', label: 'CQRS / SAGA' },
  { color: '#4a9ee8', label: 'Infrastructure / NestJS' },
  { color: '#e87a4a', label: 'Domaine / Agregat' },
]

/* ── Code blocks (raw HTML for v-html syntax highlighting) ── */

const codeDomainEvent = `<span class="cm">// Interface de base — tout evenement respecte ce contrat</span>
<span class="kw">interface</span> <span class="ty">DomainEvent</span> {
  <span class="kw">readonly</span> eventId:     <span class="ty">string</span>;       <span class="cm">// UUID — identifiant unique de l'event</span>
  <span class="kw">readonly</span> eventType:   <span class="ty">string</span>;       <span class="cm">// 'order.created' — discriminant</span>
  <span class="kw">readonly</span> aggregateId: <span class="ty">string</span>;       <span class="cm">// ID de l'entite concernee</span>
  <span class="kw">readonly</span> occurredAt:  <span class="ty">Date</span>;         <span class="cm">// Quand c'est arrive (passe)</span>
  <span class="kw">readonly</span> version:     <span class="ty">number</span>;       <span class="cm">// Pour l'ordering et la concurrence</span>
  <span class="kw">readonly</span> payload:     <span class="ty">Record</span>&lt;<span class="ty">string</span>, <span class="kw">unknown</span>&gt;;
}

<span class="cm">// Evenement concret — type</span>
<span class="kw">class</span> <span class="ty">OrderCreatedEvent</span> {
  <span class="kw">constructor</span>(
    <span class="kw">public readonly</span> orderId:     <span class="ty">string</span>,
    <span class="kw">public readonly</span> customerId:  <span class="ty">string</span>,
    <span class="kw">public readonly</span> items:       <span class="ty">ReadonlyArray</span>&lt;{ productId: <span class="ty">string</span>; quantity: <span class="ty">number</span>; price: <span class="ty">number</span> }&gt;,
    <span class="kw">public readonly</span> totalAmount: <span class="ty">number</span>,
    <span class="kw">public readonly</span> occurredAt:  <span class="ty">Date</span> = <span class="kw">new</span> <span class="ty">Date</span>(),
  ) {}
}`

const codeEventBus = `<span class="kw">type</span> <span class="ty">Handler</span>&lt;<span class="ty">T</span>&gt; = (<span class="ty">event</span>: <span class="ty">T</span>) =&gt; <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;

<span class="kw">interface</span> <span class="ty">IEventBus</span> {
  <span class="fn">publish</span>&lt;<span class="ty">T</span> <span class="kw">extends</span> <span class="ty">DomainEvent</span>&gt;(event: <span class="ty">T</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;
  <span class="fn">subscribe</span>&lt;<span class="ty">T</span> <span class="kw">extends</span> <span class="ty">DomainEvent</span>&gt;(eventType: <span class="ty">string</span>, handler: <span class="ty">Handler</span>&lt;<span class="ty">T</span>&gt;): <span class="ty">void</span>;
}

<span class="cm">// In-Memory — pour les tests et le monolithe</span>
<span class="kw">class</span> <span class="ty">InMemoryEventBus</span> <span class="kw">implements</span> <span class="ty">IEventBus</span> {
  <span class="kw">private readonly</span> handlers = <span class="kw">new</span> <span class="ty">Map</span>&lt;<span class="ty">string</span>, <span class="ty">Set</span>&lt;<span class="ty">Handler</span>&lt;<span class="kw">any</span>&gt;&gt;&gt;();

  <span class="fn">subscribe</span>&lt;<span class="ty">T</span>&gt;(eventType: <span class="ty">string</span>, handler: <span class="ty">Handler</span>&lt;<span class="ty">T</span>&gt;): <span class="ty">void</span> {
    <span class="kw">if</span> (!<span class="kw">this</span>.handlers.<span class="fn">has</span>(eventType))
      <span class="kw">this</span>.handlers.<span class="fn">set</span>(eventType, <span class="kw">new</span> <span class="ty">Set</span>());
    <span class="kw">this</span>.handlers.<span class="fn">get</span>(eventType)!.<span class="fn">add</span>(handler);
  }

  <span class="kw">async</span> <span class="fn">publish</span>&lt;<span class="ty">T</span> <span class="kw">extends</span> <span class="ty">DomainEvent</span>&gt;(event: <span class="ty">T</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">const</span> handlers = <span class="kw">this</span>.handlers.<span class="fn">get</span>(event.eventType) ?? <span class="kw">new</span> <span class="ty">Set</span>();
    <span class="cm">// Parallel — les consommateurs sont independants</span>
    <span class="kw">await</span> <span class="ty">Promise</span>.<span class="fn">allSettled</span>([...handlers].<span class="fn">map</span>(h =&gt; <span class="fn">h</span>(event)));
  }
}`

const codeProjection = `<span class="kw">interface</span> <span class="ty">IProjection</span> {
  <span class="kw">readonly</span> eventTypes: <span class="ty">ReadonlyArray</span>&lt;<span class="ty">string</span>&gt;;
  <span class="fn">handle</span>(event: <span class="ty">DomainEvent</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;
  <span class="fn">reset</span>(): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;;   <span class="cm">// Pour le replay complet</span>
}

<span class="kw">class</span> <span class="ty">OrderSummaryProjection</span> <span class="kw">implements</span> <span class="ty">IProjection</span> {
  <span class="kw">readonly</span> eventTypes = [
    <span class="str">'order.created'</span>, <span class="str">'order.cancelled'</span>, <span class="str">'payment.completed'</span>, <span class="str">'order.shipped'</span>
  ];

  <span class="kw">constructor</span>(<span class="kw">private readonly</span> db: <span class="ty">IOrderSummaryRepo</span>) {}

  <span class="kw">async</span> <span class="fn">handle</span>(event: <span class="ty">DomainEvent</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">switch</span> (event.eventType) {
      <span class="kw">case</span> <span class="str">'order.created'</span>:
        <span class="kw">await</span> <span class="kw">this</span>.db.<span class="fn">upsert</span>({
          orderId:     event.payload.orderId,
          status:      <span class="str">'PENDING'</span>,
          totalAmount: event.payload.totalAmount,
          itemCount:   event.payload.items.length,
          createdAt:   event.occurredAt.toISOString(),
        }, [<span class="str">'orderId'</span>]);   <span class="cm">// Cle de deduplication — idempotence</span>
        <span class="kw">break</span>;
      <span class="kw">case</span> <span class="str">'payment.completed'</span>:
        <span class="kw">await</span> <span class="kw">this</span>.db.<span class="fn">updateStatus</span>(event.payload.orderId, <span class="str">'PAID'</span>);
        <span class="kw">break</span>;
      <span class="kw">case</span> <span class="str">'order.shipped'</span>:
        <span class="kw">await</span> <span class="kw">this</span>.db.<span class="fn">updateStatus</span>(event.payload.orderId, <span class="str">'SHIPPED'</span>);
        <span class="kw">break</span>;
      <span class="kw">case</span> <span class="str">'order.cancelled'</span>:
        <span class="kw">await</span> <span class="kw">this</span>.db.<span class="fn">updateStatus</span>(event.payload.orderId, <span class="str">'CANCELLED'</span>);
        <span class="kw">break</span>;
    }
  }

  <span class="kw">async</span> <span class="fn">reset</span>(): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">await</span> <span class="kw">this</span>.db.<span class="fn">truncate</span>();   <span class="cm">// Prete pour le replay complet</span>
  }
}`

const codeSagaOrchestrator = `<span class="kw">type</span> <span class="ty">SagaStatus</span> =
  | <span class="str">'ORDER_PENDING'</span> | <span class="str">'PAYMENT_PENDING'</span> | <span class="str">'STOCK_PENDING'</span>
  | <span class="str">'COMPLETED'</span>
  | <span class="str">'COMPENSATING_ORDER'</span> | <span class="str">'COMPENSATING_PAYMENT'</span> | <span class="str">'CANCELLED'</span>;

<span class="kw">interface</span> <span class="ty">SagaState</span> {
  <span class="kw">readonly</span> sagaId:          <span class="ty">string</span>;
  <span class="kw">readonly</span> orderId:         <span class="ty">string</span>;
  <span class="kw">readonly</span> totalAmount:     <span class="ty">number</span>;
  <span class="kw">readonly</span> status:          <span class="ty">SagaStatus</span>;
  <span class="kw">readonly</span> transactionId?:  <span class="ty">string</span>;
  <span class="kw">readonly</span> compensationReason?: <span class="ty">string</span>;
}

<span class="cm">// Reducer pur — pattern Redux applique au SAGA</span>
<span class="kw">const</span> <span class="fn">sagaReducer</span> = (state: <span class="ty">SagaState</span>, event: <span class="ty">SagaEvent</span>): <span class="ty">SagaState</span> =&gt; {
  <span class="kw">const</span> transitions: <span class="ty">Record</span>&lt;<span class="ty">string</span>, (<span class="ty">s</span>: <span class="ty">SagaState</span>) =&gt; <span class="ty">SagaState</span> | <span class="kw">null</span>&gt; = {
    <span class="str">'order.created'</span>:  s =&gt; s.status === <span class="str">'ORDER_PENDING'</span>   ? { ...s, status: <span class="str">'PAYMENT_PENDING'</span> } : <span class="kw">null</span>,
    <span class="str">'payment.done'</span>:   s =&gt; s.status === <span class="str">'PAYMENT_PENDING'</span> ? { ...s, status: <span class="str">'STOCK_PENDING'</span> } : <span class="kw">null</span>,
    <span class="str">'stock.reserved'</span>: s =&gt; s.status === <span class="str">'STOCK_PENDING'</span>   ? { ...s, status: <span class="str">'COMPLETED'</span> } : <span class="kw">null</span>,
    <span class="str">'payment.failed'</span>: s =&gt; s.status === <span class="str">'PAYMENT_PENDING'</span> ? { ...s, status: <span class="str">'COMPENSATING_ORDER'</span> } : <span class="kw">null</span>,
    <span class="str">'stock.failed'</span>:   s =&gt; s.status === <span class="str">'STOCK_PENDING'</span>   ? { ...s, status: <span class="str">'COMPENSATING_PAYMENT'</span> } : <span class="kw">null</span>,
  };
  <span class="kw">const</span> next = transitions[event.step]?.(state);
  <span class="kw">return</span> next ?? state;  <span class="cm">// Idempotence : pas de transition = etat inchange</span>
};`

const codeNestModule = `<span class="kw">import</span> { <span class="ty">Module</span> }      <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { <span class="ty">CqrsModule</span> } <span class="kw">from</span> <span class="str">'@nestjs/cqrs'</span>;
<span class="kw">import</span> { <span class="ty">TypeOrmModule</span> } <span class="kw">from</span> <span class="str">'@nestjs/typeorm'</span>;

<span class="kw">import</span> { <span class="ty">CommandHandlers</span> }        <span class="kw">from</span> <span class="str">'./commands'</span>;
<span class="kw">import</span> { <span class="ty">QueryHandlers</span> }          <span class="kw">from</span> <span class="str">'./queries'</span>;
<span class="kw">import</span> { <span class="ty">EventHandlers</span> }          <span class="kw">from</span> <span class="str">'./events'</span>;
<span class="kw">import</span> { <span class="ty">OrderSaga</span> }              <span class="kw">from</span> <span class="str">'./sagas/order.saga'</span>;
<span class="kw">import</span> { <span class="ty">OrderRepositoryImpl</span> }    <span class="kw">from</span> <span class="str">'./infrastructure/repositories/order.repository.impl'</span>;

<span class="cm">// Token DI pour l'inversion de dependance</span>
<span class="kw">export const</span> <span class="hl">ORDER_REPOSITORY</span> = <span class="fn">Symbol</span>(<span class="str">'ORDER_REPOSITORY'</span>);

<span class="dec">@Module</span>({
  imports: [
    <span class="ty">CqrsModule</span>,   <span class="cm">// Injecte CommandBus, QueryBus, EventBus</span>
    <span class="ty">TypeOrmModule</span>.<span class="fn">forFeature</span>([<span class="ty">OrderEventOrmEntity</span>, <span class="ty">OrderSummaryView</span>]),
  ],
  controllers: [<span class="ty">OrderController</span>],
  providers: [
    ...<span class="ty">CommandHandlers</span>,   <span class="cm">// CreateOrderHandler, CancelOrderHandler</span>
    ...<span class="ty">QueryHandlers</span>,     <span class="cm">// GetOrderByIdHandler</span>
    ...<span class="ty">EventHandlers</span>,     <span class="cm">// OrderCreatedHandler -> projection</span>
    <span class="ty">OrderSaga</span>,           <span class="cm">// @Saga() RxJS pipeline</span>
    { provide: <span class="hl">ORDER_REPOSITORY</span>, useClass: <span class="ty">OrderRepositoryImpl</span> },
  ],
})
<span class="kw">export class</span> <span class="ty">OrderModule</span> {}`

const codeAggregate = `<span class="kw">import</span> { <span class="ty">AggregateRoot</span> } <span class="kw">from</span> <span class="str">'@nestjs/cqrs'</span>;

<span class="kw">export class</span> <span class="ty">OrderAggregate</span> <span class="kw">extends</span> <span class="ty">AggregateRoot</span> {
  <span class="kw">private</span> _id:          <span class="ty">string</span> = <span class="str">''</span>;
  <span class="kw">private</span> _status:      <span class="str">'PENDING'</span> | <span class="str">'PAID'</span> | <span class="str">'SHIPPED'</span> | <span class="str">'CANCELLED'</span> = <span class="str">'PENDING'</span>;
  <span class="kw">private</span> _totalAmount: <span class="ty">number</span> = <span class="num">0</span>;

  <span class="cm">// Factory — logique metier, pas de constructeur public</span>
  <span class="kw">static</span> <span class="fn">create</span>(customerId: <span class="ty">string</span>, items: <span class="ty">OrderItem</span>[]): <span class="ty">OrderAggregate</span> {
    <span class="kw">if</span> (items.length === <span class="num">0</span>) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Commande vide'</span>);
    <span class="kw">const</span> order = <span class="kw">new</span> <span class="ty">OrderAggregate</span>();
    <span class="kw">const</span> total = items.<span class="fn">reduce</span>((s, i) =&gt; s + i.price * i.quantity, <span class="num">0</span>);
    order.<span class="fn">apply</span>(<span class="kw">new</span> <span class="ty">OrderCreatedEvent</span>(<span class="fn">crypto</span>.<span class="fn">randomUUID</span>(), customerId, items, total));
    <span class="kw">return</span> order;
  }

  <span class="fn">cancel</span>(reason: <span class="ty">string</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>._status === <span class="str">'CANCELLED'</span>) <span class="kw">return</span>;  <span class="cm">// Idempotence</span>
    <span class="kw">if</span> (<span class="kw">this</span>._status === <span class="str">'SHIPPED'</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Impossible d\\'annuler une commande expediee'</span>);
    <span class="kw">this</span>.<span class="fn">apply</span>(<span class="kw">new</span> <span class="ty">OrderCancelledEvent</span>(<span class="kw">this</span>._id, reason));
  }

  <span class="cm">// Handlers appeles par apply() et loadFromHistory()</span>
  <span class="fn">onOrderCreatedEvent</span>(e: <span class="ty">OrderCreatedEvent</span>): <span class="ty">void</span> {
    <span class="kw">this</span>._id = e.orderId;
    <span class="kw">this</span>._status = <span class="str">'PENDING'</span>;
    <span class="kw">this</span>._totalAmount = e.totalAmount;
  }

  <span class="fn">onOrderCancelledEvent</span>(_e: <span class="ty">OrderCancelledEvent</span>): <span class="ty">void</span> {
    <span class="kw">this</span>._status = <span class="str">'CANCELLED'</span>;
  }
}`

const codeSagaNest = `<span class="kw">import</span> { <span class="ty">Injectable</span>, <span class="ty">Logger</span> }              <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { <span class="ty">ICommand</span>, <span class="fn">ofType</span>, <span class="ty">Saga</span> }         <span class="kw">from</span> <span class="str">'@nestjs/cqrs'</span>;
<span class="kw">import</span> { <span class="ty">Observable</span> }                      <span class="kw">from</span> <span class="str">'rxjs'</span>;
<span class="kw">import</span> { <span class="fn">map</span>, <span class="fn">filter</span>, <span class="fn">catchError</span> }        <span class="kw">from</span> <span class="str">'rxjs/operators'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="ty">OrderSaga</span> {
  <span class="kw">private readonly</span> logger = <span class="kw">new</span> <span class="ty">Logger</span>(<span class="ty">OrderSaga</span>.name);

  <span class="cm">// SAGA 1 : Commande creee -> declencher le paiement</span>
  <span class="dec">@Saga</span>()
  orderCreated = (events$: <span class="ty">Observable</span>&lt;<span class="kw">any</span>&gt;): <span class="ty">Observable</span>&lt;<span class="ty">ICommand</span>&gt; =&gt;
    events$.pipe(
      <span class="fn">ofType</span>(<span class="ty">OrderCreatedEvent</span>),
      <span class="fn">map</span>(event =&gt; {
        <span class="kw">this</span>.logger.<span class="fn">log</span>(<span class="str">\`Saga: order \${event.orderId} -> processPayment\`</span>);
        <span class="kw">return new</span> <span class="ty">ProcessPaymentCommand</span>(event.orderId, event.customerId, event.totalAmount);
      }),
      <span class="fn">catchError</span>((err, src) =&gt; { <span class="kw">this</span>.logger.<span class="fn">error</span>(err); <span class="kw">return</span> src; }),
    );

  <span class="cm">// SAGA 2 : Paiement OK -> reserver le stock</span>
  <span class="dec">@Saga</span>()
  paymentDone = (events$: <span class="ty">Observable</span>&lt;<span class="kw">any</span>&gt;): <span class="ty">Observable</span>&lt;<span class="ty">ICommand</span>&gt; =&gt;
    events$.pipe(
      <span class="fn">ofType</span>(<span class="ty">PaymentCompletedEvent</span>),
      <span class="fn">map</span>(e =&gt; <span class="kw">new</span> <span class="ty">ReserveStockCommand</span>(e.orderId, e.transactionId)),
      <span class="fn">catchError</span>((err, src) =&gt; { <span class="kw">this</span>.logger.<span class="fn">error</span>(err); <span class="kw">return</span> src; }),
    );
}`

const fileTreeHtml = `<span class="ft-dir">src/</span>
<span class="ft-cmd">\u251C\u2500\u2500 order/</span>                       <span class="ft-gray"># Feature module</span>
<span class="ft-cmd">\u2502   \u251C\u2500\u2500 commands/</span>
<span class="ft-cmd">\u2502   \u2502   \u251C\u2500\u2500 create-order.command.ts</span>
<span class="ft-cmd">\u2502   \u2502   \u251C\u2500\u2500 cancel-order.command.ts</span>
<span class="ft-cmd">\u2502   \u2502   \u2514\u2500\u2500 handlers/</span>
<span class="ft-evt">\u2502   \u251C\u2500\u2500 events/</span>
<span class="ft-evt">\u2502   \u2502   \u251C\u2500\u2500 order-created.event.ts</span>
<span class="ft-evt">\u2502   \u2502   \u251C\u2500\u2500 order-cancelled.event.ts</span>
<span class="ft-evt">\u2502   \u2502   \u2514\u2500\u2500 handlers/</span>              <span class="ft-gray"># @EventsHandler -> projection</span>
<span class="ft-qry">\u2502   \u251C\u2500\u2500 queries/</span>
<span class="ft-qry">\u2502   \u2502   \u251C\u2500\u2500 get-order-by-id.query.ts</span>
<span class="ft-qry">\u2502   \u2502   \u2514\u2500\u2500 handlers/</span>
<span class="ft-dom">\u2502   \u251C\u2500\u2500 domain/</span>
<span class="ft-dom">\u2502   \u2502   \u251C\u2500\u2500 order.aggregate.ts</span>        <span class="ft-gray"># extends AggregateRoot</span>
<span class="ft-dom">\u2502   \u2502   \u2514\u2500\u2500 value-objects/</span>
<span class="ft-saga">\u2502   \u251C\u2500\u2500 sagas/</span>
<span class="ft-saga">\u2502   \u2502   \u2514\u2500\u2500 order.saga.ts</span>             <span class="ft-gray"># @Saga() Observable&lt;ICommand&gt;</span>
<span class="ft-infra">\u2502   \u251C\u2500\u2500 infrastructure/</span>
<span class="ft-infra">\u2502   \u2502   \u251C\u2500\u2500 orm-entities/</span>
<span class="ft-infra">\u2502   \u2502   \u251C\u2500\u2500 repositories/</span>
<span class="ft-infra">\u2502   \u2502   \u2514\u2500\u2500 mappers/</span>
\u2502   \u251C\u2500\u2500 order.controller.ts
\u2502   \u2514\u2500\u2500 order.module.ts
\u2514\u2500\u2500 app.module.ts`

/* ── Sidebar navigation ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'intro', label: 'Le triptyque' },
      { id: 'metaphores', label: 'Metaphores' },
    ],
  },
  {
    label: 'EDA',
    links: [
      { id: 'eda-concepts', label: 'Concepts fondamentaux' },
      { id: 'eda-patterns', label: 'Patterns EDA' },
    ],
  },
  {
    label: 'CQRS',
    links: [
      { id: 'cqrs-concepts', label: 'Separation R/W' },
      { id: 'cqrs-code', label: 'Projections & Code' },
    ],
  },
  {
    label: 'SAGA',
    links: [
      { id: 'saga-concepts', label: 'Transactions distribuees' },
      { id: 'saga-styles', label: 'Choreography vs Orchestration' },
      { id: 'saga-code', label: 'State Machine & Code' },
    ],
  },
  {
    label: 'NestJS',
    links: [
      { id: 'nestjs-module', label: 'Module & Structure' },
      { id: 'nestjs-aggregate', label: 'AggregateRoot' },
      { id: 'nestjs-saga', label: '@Saga() & RxJS' },
      { id: 'nestjs-pieges', label: 'Pieges & regles' },
    ],
  },
  {
    label: 'Reference',
    links: [
      { id: 'quand', label: 'Quand adopter ?' },
    ],
  },
]

useHead({
  title: 'Event-Driven Architecture \u2014 EDA \u00b7 CQRS \u00b7 SAGA',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Event-Driven Architecture \u2014 EDA \u00b7 CQRS \u00b7 SAGA \u00b7 NestJS',
        description:
          'Guide complet sur l\'architecture evenementielle : EDA, CQRS, SAGA et implementation NestJS avec TypeScript. Concepts, patterns, diagrammes et exemples de code.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/event-driven-architecture',
        author: {
          '@type': 'Person',
          name: 'Gregor Hohpe',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Guide complet sur l\'architecture evenementielle : EDA, CQRS, SAGA et implementation NestJS avec TypeScript. Concepts, patterns, diagrammes et exemples de code.',
  ogTitle: 'Event-Driven Architecture \u2014 EDA \u00b7 CQRS \u00b7 SAGA \u00b7 NestJS',
  ogDescription:
    'Guide complet sur l\'architecture evenementielle : EDA, CQRS, SAGA et implementation NestJS avec TypeScript. Concepts, patterns, diagrammes et exemples de code.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/event-driven-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Event-Driven Architecture \u2014 EDA \u00b7 CQRS \u00b7 SAGA \u00b7 NestJS',
  twitterDescription:
    'Guide complet sur l\'architecture evenementielle : EDA, CQRS, SAGA et implementation NestJS avec TypeScript. Concepts, patterns, diagrammes et exemples de code.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="EDA &middot; CQRS &middot; SAGA<br>NestJS"
      :groups="sidebarGroups"
      accent-color="#e84a7a"
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
          <div class="eyebrow">// Architecture R&eacute;active &mdash; Gregor Hohpe &middot; Greg Young &middot; Uncle Bob</div>
          <h1>EDA &middot; CQRS &middot; SAGA<br><em>NestJS</em></h1>
          <p class="subtitle">
            Le triptyque des architectures r&eacute;actives modernes &mdash; Event-Driven Architecture,
            Command Query Responsibility Segregation, Pattern SAGA, int&eacute;gr&eacute;s dans NestJS
            avec TypeScript.
          </p>
          <div class="meta-tags">
            <span class="meta-tag green">NestJS</span>
            <span class="meta-tag green">TypeScript</span>
            <span class="meta-tag yellow">Event-Driven</span>
            <span class="meta-tag purple">CQRS</span>
            <span class="meta-tag blue">SAGA</span>
            <span class="meta-tag orange">RxJS</span>
            <span class="meta-tag red">Event Sourcing</span>
          </div>
        </header>

        <!-- 01 — Le Triptyque -->
        <section id="intro" class="section">
          <div class="section-header">
            <span class="section-number">01</span>
            <h2 class="section-title">Le Triptyque</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              EDA, CQRS et SAGA ne sont pas trois architectures alternatives &mdash; ce sont trois
              <strong>couches compl&eacute;mentaires</strong> qui s&rsquo;embo&icirc;tent.
              L&rsquo;EDA pose le canal de communication (les &eacute;v&eacute;nements). Le CQRS
              s&eacute;pare les responsabilit&eacute;s lecture/&eacute;criture. Le SAGA orchestre
              les transactions distribu&eacute;es sur ce canal.
            </p>
          </div>

          <div class="triptyque">
            <div class="triptyque-item">
              <div class="triptyque-label">Couche 1 &mdash; Communication</div>
              <div class="triptyque-name" style="color:var(--accent)">EDA</div>
              <div class="triptyque-desc">Les services communiquent via des <strong>&eacute;v&eacute;nements immuables</strong>. Couplage minimal. Producteurs et consommateurs s&rsquo;ignorent.</div>
            </div>
            <div class="triptyque-item">
              <div class="triptyque-label">Couche 2 &mdash; Organisation</div>
              <div class="triptyque-name" style="color:var(--green)">CQRS</div>
              <div class="triptyque-desc">Les <strong>commandes</strong> mutent l&rsquo;&eacute;tat. Les <strong>queries</strong> lisent des vues optimis&eacute;es. Jamais les deux en m&ecirc;me temps.</div>
            </div>
            <div class="triptyque-item">
              <div class="triptyque-label">Couche 3 &mdash; Coordination</div>
              <div class="triptyque-name" style="color:var(--purple)">SAGA</div>
              <div class="triptyque-desc">Transactions distribu&eacute;es via des <strong>s&eacute;quences d&rsquo;&eacute;v&eacute;nements</strong> avec compensation en cas d&rsquo;&eacute;chec. Pas de 2PC global.</div>
            </div>
          </div>

          <!-- SVG Diagram: EDA Overview -->
          <div class="diagram-wrap">
            <svg viewBox="0 0 860 340" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Mono', monospace">
              <defs>
                <marker id="arr-y" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#e8c84a" stroke-width="1.5" stroke-linecap="round"/>
                </marker>
                <marker id="arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#4ae8b0" stroke-width="1.5" stroke-linecap="round"/>
                </marker>
                <marker id="arr-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#4a9ee8" stroke-width="1.5" stroke-linecap="round"/>
                </marker>
              </defs>
              <text x="100" y="18" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="2">PRODUCTEURS</text>
              <rect x="20" y="28" width="160" height="280" rx="8" fill="#0a0c10" stroke="#4a9ee8" stroke-width="1" stroke-dasharray="4 3"/>
              <rect x="36" y="55" width="128" height="40" rx="5" fill="#13161e" stroke="#1e2330"/>
              <text x="100" y="72" text-anchor="middle" fill="#4a9ee8" font-size="12">Svc Commande</text>
              <text x="100" y="87" text-anchor="middle" fill="#6a7090" font-size="10">emit()</text>
              <rect x="36" y="110" width="128" height="40" rx="5" fill="#13161e" stroke="#1e2330"/>
              <text x="100" y="127" text-anchor="middle" fill="#4a9ee8" font-size="12">Svc Paiement</text>
              <text x="100" y="142" text-anchor="middle" fill="#6a7090" font-size="10">emit()</text>
              <rect x="36" y="165" width="128" height="40" rx="5" fill="#13161e" stroke="#1e2330"/>
              <text x="100" y="182" text-anchor="middle" fill="#4a9ee8" font-size="12">SAGA Orchestrator</text>
              <text x="100" y="197" text-anchor="middle" fill="#6a7090" font-size="10">emit()</text>
              <line x1="164" y1="75" x2="238" y2="110" stroke="#4a9ee8" stroke-width="1.5" marker-end="url(#arr-b)"/>
              <line x1="164" y1="130" x2="238" y2="155" stroke="#4a9ee8" stroke-width="1.5" marker-end="url(#arr-b)"/>
              <line x1="164" y1="185" x2="238" y2="190" stroke="#4a9ee8" stroke-width="1.5" marker-end="url(#arr-b)"/>
              <text x="430" y="18" text-anchor="middle" fill="#e8c84a" font-size="10" letter-spacing="2">EVENT BUS</text>
              <rect x="240" y="28" width="380" height="280" rx="8" fill="#0a0c10" stroke="#e8c84a" stroke-width="1.5"/>
              <rect x="260" y="55" width="340" height="36" rx="4" fill="#1a1508" stroke="#e8c84a" stroke-width="1" stroke-dasharray="2 2"/>
              <text x="430" y="71" text-anchor="middle" fill="#e8c84a" font-size="11">order.created</text>
              <text x="430" y="84" text-anchor="middle" fill="#6a7090" font-size="9">{ orderId, customerId, amount, timestamp }</text>
              <rect x="260" y="105" width="340" height="36" rx="4" fill="#1a1508" stroke="#e8c84a" stroke-width="1" stroke-dasharray="2 2"/>
              <text x="430" y="121" text-anchor="middle" fill="#e8c84a" font-size="11">payment.completed</text>
              <text x="430" y="134" text-anchor="middle" fill="#6a7090" font-size="9">{ orderId, transactionId, amount }</text>
              <rect x="260" y="155" width="340" height="36" rx="4" fill="#1a1508" stroke="#e8c84a" stroke-width="1" stroke-dasharray="2 2"/>
              <text x="430" y="171" text-anchor="middle" fill="#e8c84a" font-size="11">stock.reserved</text>
              <text x="430" y="184" text-anchor="middle" fill="#6a7090" font-size="9">{ orderId, items[], warehouseId }</text>
              <rect x="260" y="205" width="340" height="36" rx="4" fill="#1a1508" stroke="#e8c84a" stroke-width="1" stroke-dasharray="2 2"/>
              <text x="430" y="221" text-anchor="middle" fill="#e8c84a" font-size="11">order.cancelled</text>
              <text x="430" y="234" text-anchor="middle" fill="#6a7090" font-size="9">{ orderId, reason, compensations[] }</text>
              <text x="430" y="288" text-anchor="middle" fill="#6a7090" font-size="10">Kafka &middot; RabbitMQ &middot; NATS &middot; AWS EventBridge</text>
              <text x="760" y="18" text-anchor="middle" fill="#6a7090" font-size="10" letter-spacing="2">CONSOMMATEURS</text>
              <rect x="680" y="28" width="160" height="280" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" stroke-dasharray="4 3"/>
              <rect x="696" y="55" width="128" height="40" rx="5" fill="#13161e" stroke="#1e2330"/>
              <text x="760" y="72" text-anchor="middle" fill="#4ae8b0" font-size="12">Svc Livraison</text>
              <text x="760" y="87" text-anchor="middle" fill="#6a7090" font-size="10">subscribe()</text>
              <rect x="696" y="110" width="128" height="40" rx="5" fill="#13161e" stroke="#1e2330"/>
              <text x="760" y="127" text-anchor="middle" fill="#4ae8b0" font-size="12">Svc Notification</text>
              <text x="760" y="142" text-anchor="middle" fill="#6a7090" font-size="10">subscribe()</text>
              <rect x="696" y="165" width="128" height="40" rx="5" fill="#13161e" stroke="#1e2330"/>
              <text x="760" y="182" text-anchor="middle" fill="#4ae8b0" font-size="12">Projections CQRS</text>
              <text x="760" y="197" text-anchor="middle" fill="#6a7090" font-size="10">subscribe()</text>
              <rect x="696" y="220" width="128" height="40" rx="5" fill="#13161e" stroke="#1e2330"/>
              <text x="760" y="237" text-anchor="middle" fill="#4ae8b0" font-size="12">SAGA Handler</text>
              <text x="760" y="252" text-anchor="middle" fill="#6a7090" font-size="10">subscribe()</text>
              <line x1="620" y1="100" x2="696" y2="75" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#arr-g)"/>
              <line x1="620" y1="140" x2="696" y2="130" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#arr-g)"/>
              <line x1="620" y1="175" x2="696" y2="185" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#arr-g)"/>
              <line x1="620" y1="210" x2="696" y2="240" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#arr-g)"/>
              <text x="100" y="328" text-anchor="middle" fill="#6a7090" font-size="9">Pas de couplage direct</text>
              <text x="430" y="328" text-anchor="middle" fill="#e8c84a" font-size="9">Evenements immuables &mdash; faits passes</text>
              <text x="760" y="328" text-anchor="middle" fill="#6a7090" font-size="9">Reagissent independamment</text>
            </svg>
            <div class="diagram-caption">EDA &mdash; Producteurs, Event Bus, Consommateurs</div>
          </div>
        </section>

        <!-- 02 — Metaphores -->
        <section id="metaphores" class="section">
          <div class="section-header">
            <span class="section-number">02</span>
            <h2 class="section-title">M&eacute;taphores</h2>
            <div class="section-line" />
          </div>

          <div class="quote-box">
            <div class="quote-icon">&#x1F4FB;</div>
            <div class="quote-content">
              <h3>EDA &mdash; La Station de Radio</h3>
              <p>
                L&rsquo;&eacute;metteur diffuse dans l&rsquo;&eacute;ther sans savoir combien d&rsquo;auditeurs
                l&rsquo;&eacute;coutent. Les auditeurs s&rsquo;abonnent librement aux fr&eacute;quences qui les
                int&eacute;ressent. <em>Personne n&rsquo;attend personne.</em> Un &eacute;v&eacute;nement est un
                <strong>fait pass&eacute; immuable</strong> : <em>&ldquo;La commande #42 a &eacute;t&eacute;
                pass&eacute;e&rdquo;</em>, jamais <em>&ldquo;Passe la commande #42&rdquo;</em>.
              </p>
            </div>
          </div>

          <div class="quote-box">
            <div class="quote-icon">&#x1F468;&#x200D;&#x1F373;</div>
            <div class="quote-content">
              <h3>CQRS &mdash; Le Restaurant &Eacute;toil&eacute;</h3>
              <p>
                La <strong>brigade de cuisine</strong> (Write Side) re&ccedil;oit les bons de commande,
                transforme et modifie l&rsquo;&eacute;tat. Les <strong>serveurs en salle</strong> (Read Side)
                lisent le tableau des plats et servent. La cuisine ne parle jamais directement aux clients.
                Les serveurs ne touchent jamais aux fourneaux. Le <em>tableau des plats du jour</em> est une
                <strong>projection d&eacute;normalis&eacute;e</strong> mise &agrave; jour d&egrave;s qu&rsquo;un
                plat change.
              </p>
            </div>
          </div>

          <div class="quote-box">
            <div class="quote-icon">&#x2708;&#xFE0F;</div>
            <div class="quote-content">
              <h3>SAGA &mdash; L&rsquo;Agent de Voyage</h3>
              <p>
                Tu r&eacute;serves vol + h&ocirc;tel + voiture : trois entreprises diff&eacute;rentes.
                Impossible de faire un <code>BEGIN TRANSACTION</code> global. L&rsquo;agent de voyage
                <strong>coordonne s&eacute;quentiellement</strong> : vol &#x2705; &rarr; h&ocirc;tel &#x2705;
                &rarr; voiture &#x274C; &rarr; <em>annuler l&rsquo;h&ocirc;tel</em> &rarr;
                <em>annuler le vol</em>. Chaque &eacute;tape est une transaction locale. Chaque &eacute;chec
                d&eacute;clenche des <strong>actions de compensation explicites</strong> en sens inverse.
              </p>
            </div>
          </div>
        </section>

        <!-- 03 — EDA Concepts -->
        <section id="eda-concepts" class="section">
          <div class="section-header">
            <span class="section-number">03</span>
            <h2 class="section-title">EDA &mdash; Concepts Fondamentaux</h2>
            <div class="section-line" />
          </div>

          <div class="cards cards-3col">
            <article
              v-for="card in conceptCards"
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
                <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </article>
          </div>

          <h3 class="sub">Structure d&rsquo;un &Eacute;v&eacute;nement</h3>
          <div class="info-box yellow">
            <strong>R&egrave;gle fondamentale :</strong> Un &eacute;v&eacute;nement est un <strong>fait
            pass&eacute;</strong>, immuable, dat&eacute;. Il d&eacute;crit ce qui s&rsquo;est pass&eacute;
            &mdash; pas ce qui doit se passer. Nommez-le au pass&eacute; compos&eacute; :
            <code>OrderCreated</code>, <code>PaymentCompleted</code>, jamais <code>CreateOrder</code>.
          </div>

          <div class="code-filename">domain-event.interface.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeDomainEvent" />
        </section>

        <!-- 04 — EDA Patterns -->
        <section id="eda-patterns" class="section">
          <div class="section-header">
            <span class="section-number">04</span>
            <h2 class="section-title">EDA &mdash; Les 3 Patterns</h2>
            <div class="section-line" />
          </div>

          <div class="cards cards-3col">
            <article
              v-for="card in patternCards"
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
                <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </article>
          </div>

          <h3 class="sub">Event Bus &mdash; Impl&eacute;mentation TypeScript</h3>
          <div class="code-filename">in-memory-event-bus.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeEventBus" />
        </section>

        <!-- 05 — CQRS Concepts -->
        <section id="cqrs-concepts" class="section">
          <div class="section-header">
            <span class="section-number">05</span>
            <h2 class="section-title">CQRS &mdash; S&eacute;paration Read / Write</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              CQRS applique &agrave; l&rsquo;architecture ce qu&rsquo;Uncle Bob applique aux fonctions dans
              <em>Clean Code</em> : <strong>une fonction fait UNE chose &mdash; soit elle r&eacute;pond
              &agrave; une question, soit elle ex&eacute;cute une action, jamais les deux</strong>.
              CQRS &eacute;tend ce principe &agrave; l&rsquo;ensemble du syst&egrave;me.
            </p>
          </div>

          <div class="rule-banner">
            <strong>COMMAND</strong> &mdash; Intention de changer l&rsquo;&eacute;tat. Retourne <code>void</code>
            ou un ID. Valide. Produit des Events.<br>
            <strong>QUERY</strong> &mdash; Demande de lire l&rsquo;&eacute;tat. Retourne un DTO. Ne modifie
            <strong>JAMAIS</strong> l&rsquo;&eacute;tat. Fonction pure.<br>
            <strong>PROJECTION</strong> &mdash; Consomme des Events. Maintient une vue READ optimis&eacute;e.
            Idempotente. Rejouable.
          </div>

          <!-- SVG Diagram: CQRS -->
          <div class="diagram-wrap">
            <svg viewBox="0 0 860 380" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Mono', monospace">
              <defs>
                <marker id="a-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#e84a7a" stroke-width="1.5"/>
                </marker>
                <marker id="a-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#4ae8b0" stroke-width="1.5"/>
                </marker>
                <marker id="a-y" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#e8c84a" stroke-width="1.5"/>
                </marker>
              </defs>
              <rect x="20" y="100" width="100" height="50" rx="5" fill="#13161e" stroke="#4a9ee8" stroke-width="1"/>
              <text x="70" y="121" text-anchor="middle" fill="#4a9ee8" font-size="11">Controller</text>
              <text x="70" y="136" text-anchor="middle" fill="#6a7090" font-size="10">API</text>
              <line x1="120" y1="118" x2="190" y2="118" stroke="#e84a7a" stroke-width="1.5" marker-end="url(#a-r)"/>
              <text x="155" y="112" text-anchor="middle" fill="#e84a7a" font-size="9">Command</text>
              <rect x="190" y="40" width="280" height="200" rx="8" fill="#0a0c10" stroke="#e84a7a" stroke-width="1" stroke-dasharray="4 3"/>
              <text x="330" y="58" text-anchor="middle" fill="#e84a7a" font-size="10" letter-spacing="2">WRITE SIDE</text>
              <rect x="206" y="68" width="110" height="40" rx="4" fill="#13161e" stroke="#e84a7a"/>
              <text x="261" y="84" text-anchor="middle" fill="#f0f2fa" font-size="11">Command</text>
              <text x="261" y="98" text-anchor="middle" fill="#e84a7a" font-size="10">Handler</text>
              <line x1="316" y1="88" x2="346" y2="88" stroke="#e84a7a" stroke-width="1.5" marker-end="url(#a-r)"/>
              <rect x="346" y="68" width="110" height="40" rx="4" fill="#13161e" stroke="#e84a7a"/>
              <text x="401" y="84" text-anchor="middle" fill="#f0f2fa" font-size="11">Domain</text>
              <text x="401" y="98" text-anchor="middle" fill="#e84a7a" font-size="10">Aggregate</text>
              <line x1="401" y1="108" x2="401" y2="130" stroke="#e84a7a" stroke-width="1.5" marker-end="url(#a-r)"/>
              <rect x="270" y="130" width="200" height="40" rx="4" fill="#1a1508" stroke="#e8c84a"/>
              <text x="370" y="147" text-anchor="middle" fill="#e8c84a" font-size="11">Event Store</text>
              <text x="370" y="161" text-anchor="middle" fill="#6a7090" font-size="10">append-only</text>
              <line x1="330" y1="170" x2="295" y2="200" stroke="#e8c84a" stroke-width="1.5" stroke-dasharray="3 2" marker-end="url(#a-y)"/>
              <rect x="198" y="200" width="134" height="34" rx="4" fill="#13161e" stroke="#e8c84a"/>
              <text x="265" y="222" text-anchor="middle" fill="#e8c84a" font-size="11">Event Bus</text>
              <text x="480" y="205" text-anchor="middle" fill="#e84a7a" font-size="9">Eventual</text>
              <text x="480" y="217" text-anchor="middle" fill="#e84a7a" font-size="9">Consistency</text>
              <line x1="332" y1="217" x2="464" y2="217" stroke="#e84a7a" stroke-width="1" stroke-dasharray="3 2" marker-end="url(#a-r)"/>
              <rect x="464" y="190" width="130" height="40" rx="4" fill="#13161e" stroke="#e8c84a"/>
              <text x="529" y="207" text-anchor="middle" fill="#e8c84a" font-size="11">Projection</text>
              <text x="529" y="221" text-anchor="middle" fill="#6a7090" font-size="10">Handler</text>
              <line x1="594" y1="210" x2="624" y2="210" stroke="#e8c84a" stroke-width="1.5" marker-end="url(#a-y)"/>
              <rect x="624" y="40" width="216" height="200" rx="8" fill="#0a0c10" stroke="#4ae8b0" stroke-width="1" stroke-dasharray="4 3"/>
              <text x="732" y="58" text-anchor="middle" fill="#4ae8b0" font-size="10" letter-spacing="2">READ SIDE</text>
              <rect x="636" y="68" width="90" height="35" rx="4" fill="#13161e" stroke="#4ae8b0"/>
              <text x="681" y="83" text-anchor="middle" fill="#f0f2fa" font-size="10">orders_view</text>
              <rect x="734" y="68" width="90" height="35" rx="4" fill="#13161e" stroke="#4ae8b0"/>
              <text x="779" y="83" text-anchor="middle" fill="#f0f2fa" font-size="10">customer_view</text>
              <rect x="636" y="120" width="90" height="35" rx="4" fill="#13161e" stroke="#4ae8b0"/>
              <text x="681" y="135" text-anchor="middle" fill="#f0f2fa" font-size="10">analytics_view</text>
              <rect x="734" y="120" width="90" height="35" rx="4" fill="#13161e" stroke="#4ae8b0"/>
              <text x="779" y="135" text-anchor="middle" fill="#f0f2fa" font-size="10">inventory_view</text>
              <rect x="636" y="172" width="188" height="30" rx="4" fill="#0d1a0d" stroke="#4ae8b0"/>
              <text x="730" y="192" text-anchor="middle" fill="#4ae8b0" font-size="11">Query Handler</text>
              <line x1="120" y1="140" x2="190" y2="195" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#a-g)"/>
              <text x="148" y="180" text-anchor="middle" fill="#4ae8b0" font-size="9">Query</text>
              <line x1="636" y1="155" x2="150" y2="155" stroke="#4ae8b0" stroke-width="1" stroke-dasharray="2 2" marker-end="url(#a-g)"/>
              <text x="390" y="150" text-anchor="middle" fill="#4ae8b0" font-size="9">DTO (lecture seule)</text>
              <text x="330" y="295" text-anchor="middle" fill="#6a7090" font-size="10">Write DB = Event Store (source de verite)</text>
              <text x="732" y="295" text-anchor="middle" fill="#6a7090" font-size="10">Read DB = Vue denormalisee (0 JOIN)</text>
              <text x="330" y="315" text-anchor="middle" fill="#e84a7a" font-size="10">Pas de SELECT ici</text>
              <text x="732" y="315" text-anchor="middle" fill="#4ae8b0" font-size="10">Pas de UPDATE/DELETE ici</text>
              <text x="530" y="355" text-anchor="middle" fill="#e8c84a" font-size="9">Super-pouvoir : Replay &mdash; reconstruire une projection depuis position 0</text>
            </svg>
            <div class="diagram-caption">CQRS &mdash; Write Side, Projections, Read Side</div>
          </div>

          <h3 id="cqrs-code" class="sub">Projections &mdash; Le cycle de vie</h3>
          <div class="info-box purple">
            <strong>Super-pouvoir du Replay :</strong> Si une projection est corrompue ou si une nouvelle vue
            est n&eacute;cessaire, on relit l&rsquo;Event Store depuis le d&eacute;but. Les events &eacute;tant
            immuables, le replay produit toujours exactement le m&ecirc;me r&eacute;sultat. C&rsquo;est le
            <strong>Time Travel</strong> gratuit de l&rsquo;Event Sourcing.
          </div>

          <div class="code-filename">order-summary.projection.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block green" v-html="codeProjection" />
        </section>

        <!-- 06 — SAGA -->
        <section id="saga-concepts" class="section">
          <div class="section-header">
            <span class="section-number">06</span>
            <h2 class="section-title">SAGA &mdash; Transactions Distribu&eacute;es</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              Le pattern SAGA r&eacute;sout le probl&egrave;me des <strong>transactions qui s&rsquo;&eacute;tendent
              sur plusieurs services</strong>. Il n&rsquo;existe pas de <code>BEGIN TRANSACTION</code> global
              en distribu&eacute;. La SAGA remplace l&rsquo;atomicit&eacute; ACID par une s&eacute;quence
              d&rsquo;&eacute;tapes locales, chacune r&eacute;versible via une <strong>action de
              compensation</strong>.
            </p>
          </div>

          <div class="info-box red">
            <strong>Idempotence &mdash; Non N&eacute;gociable :</strong> Les brokers garantissent
            <em>at-least-once delivery</em>. Ton service de paiement <strong>peut recevoir le m&ecirc;me message
            deux fois</strong>. Sans idempotence, tu d&eacute;bites deux fois le client. Solution : stocker le
            <code>sagaId</code> comme cl&eacute; unique de d&eacute;duplication.
          </div>

          <h3 id="saga-styles" class="sub">Choreography vs Orchestration</h3>

          <div class="cards cards-2col">
            <article
              v-for="card in sagaStyleCards"
              :key="card.name"
              class="card"
              :class="card.colorClass"
            >
              <span class="card-icon">{{ card.icon }}</span>
              <div class="card-name">{{ card.name }}</div>
              <div class="card-title">{{ card.title }}</div>
              <div class="card-desc">{{ card.description }}</div>
              <div class="card-tags">
                <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </article>
          </div>

          <!-- SVG Diagram: SAGA State Machine -->
          <div class="diagram-wrap">
            <svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Mono', monospace">
              <defs>
                <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#e8c84a" stroke-width="1.5"/>
                </marker>
                <marker id="ar-g2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#4ae8b0" stroke-width="1.5"/>
                </marker>
                <marker id="ar-r2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M2 2L8 5L2 8" fill="none" stroke="#e84a7a" stroke-width="1.5"/>
                </marker>
              </defs>
              <text x="430" y="16" text-anchor="middle" fill="#a78bfa" font-size="10" letter-spacing="2">SAGA STATE MACHINE</text>
              <rect x="20" y="28" width="80" height="34" rx="4" fill="#1a1a08" stroke="#e8c84a"/>
              <text x="60" y="49" text-anchor="middle" fill="#e8c84a" font-size="11">START</text>
              <line x1="100" y1="45" x2="125" y2="45" stroke="#e8c84a" stroke-width="1.5" marker-end="url(#ar)"/>
              <rect x="125" y="28" width="120" height="34" rx="4" fill="#13161e" stroke="#e8c84a"/>
              <text x="185" y="49" text-anchor="middle" fill="#f0f2fa" font-size="11">ORDER_PENDING</text>
              <line x1="245" y1="45" x2="275" y2="45" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#ar-g2)"/>
              <line x1="185" y1="62" x2="185" y2="84" stroke="#e84a7a" stroke-width="1.5" stroke-dasharray="3 2" marker-end="url(#ar-r2)"/>
              <rect x="275" y="28" width="130" height="34" rx="4" fill="#13161e" stroke="#a78bfa"/>
              <text x="340" y="49" text-anchor="middle" fill="#f0f2fa" font-size="11">PAYMENT_PENDING</text>
              <line x1="405" y1="45" x2="430" y2="45" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#ar-g2)"/>
              <line x1="340" y1="62" x2="340" y2="84" stroke="#e84a7a" stroke-width="1.5" stroke-dasharray="3 2" marker-end="url(#ar-r2)"/>
              <rect x="430" y="28" width="120" height="34" rx="4" fill="#13161e" stroke="#a78bfa"/>
              <text x="490" y="49" text-anchor="middle" fill="#f0f2fa" font-size="11">STOCK_PENDING</text>
              <line x1="550" y1="45" x2="575" y2="45" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#ar-g2)"/>
              <line x1="490" y1="62" x2="490" y2="84" stroke="#e84a7a" stroke-width="1.5" stroke-dasharray="3 2" marker-end="url(#ar-r2)"/>
              <rect x="575" y="28" width="120" height="34" rx="4" fill="#13161e" stroke="#4a9ee8"/>
              <text x="635" y="49" text-anchor="middle" fill="#f0f2fa" font-size="11">SHIP_PENDING</text>
              <line x1="695" y1="45" x2="720" y2="45" stroke="#4ae8b0" stroke-width="1.5" marker-end="url(#ar-g2)"/>
              <rect x="720" y="22" width="120" height="46" rx="4" fill="#0d1a0d" stroke="#4ae8b0" stroke-width="2"/>
              <text x="780" y="43" text-anchor="middle" fill="#4ae8b0" font-size="12" font-weight="600">COMPLETED</text>
              <text x="780" y="59" text-anchor="middle" fill="#6a7090" font-size="10">etat terminal</text>
              <rect x="100" y="84" width="570" height="50" rx="5" fill="#1a0a0a" stroke="#e84a7a" stroke-dasharray="4 3"/>
              <text x="385" y="102" text-anchor="middle" fill="#e84a7a" font-size="10" letter-spacing="2">COMPENSATION (ROLLBACK DISTRIBUE)</text>
              <text x="175" y="120" text-anchor="middle" fill="#6a7090" font-size="9">cancelOrder</text>
              <text x="325" y="120" text-anchor="middle" fill="#6a7090" font-size="9">cancelOrder + refundPayment</text>
              <text x="490" y="120" text-anchor="middle" fill="#6a7090" font-size="9">cancelOrder + refundPayment + releaseStock</text>
              <rect x="280" y="152" width="160" height="30" rx="4" fill="#1a0a0a" stroke="#e84a7a"/>
              <text x="360" y="172" text-anchor="middle" fill="#e84a7a" font-size="11">CANCELLED</text>
              <line x1="385" y1="134" x2="385" y2="152" stroke="#e84a7a" stroke-width="1.5" marker-end="url(#ar-r2)"/>
              <text x="258" y="40" text-anchor="middle" fill="#4ae8b0" font-size="8">order.created</text>
              <text x="415" y="40" text-anchor="middle" fill="#4ae8b0" font-size="8">payment.done</text>
              <text x="560" y="40" text-anchor="middle" fill="#4ae8b0" font-size="8">stock.reserved</text>
              <text x="707" y="40" text-anchor="middle" fill="#4ae8b0" font-size="8">shipped</text>
              <text x="430" y="210" text-anchor="middle" fill="#4ae8b0" font-size="9">&rarr; Chemin heureux</text>
              <text x="430" y="226" text-anchor="middle" fill="#e84a7a" font-size="9">&darr; Chemin de compensation (rollback distribue)</text>
              <rect x="20" y="245" width="820" height="46" rx="5" fill="#1a1508" stroke="#e8c84a" stroke-dasharray="2 2"/>
              <text x="430" y="263" text-anchor="middle" fill="#e8c84a" font-size="10" font-weight="600">Idempotence &mdash; Critique</text>
              <text x="430" y="281" text-anchor="middle" fill="#6a7090" font-size="9">Stocker sagaId comme cle unique. Verifier avant chaque etape. at-least-once delivery = messages dupliques possibles.</text>
            </svg>
            <div class="diagram-caption">SAGA State Machine &mdash; Commande e-commerce</div>
          </div>

          <h3 id="saga-code" class="sub">Code &mdash; SAGA Orchestrateur</h3>
          <div class="code-filename">create-order.saga.orchestrator.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block purple" v-html="codeSagaOrchestrator" />
        </section>

        <!-- 07 — NestJS Module -->
        <section id="nestjs-module" class="section">
          <div class="section-header">
            <span class="section-number">07</span>
            <h2 class="section-title">NestJS &mdash; Module &amp; Structure</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              <code>@nestjs/cqrs</code> fournit trois bus (<code>CommandBus</code>, <code>QueryBus</code>,
              <code>EventBus</code>) et quatre d&eacute;corateurs (<code>@CommandHandler</code>,
              <code>@QueryHandler</code>, <code>@EventsHandler</code>, <code>@Saga</code>) qui s&rsquo;injectent
              via le DI de NestJS. <code>CqrsModule.forRoot()</code> c&acirc;ble tout automatiquement.
            </p>
          </div>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="file-tree" v-html="fileTreeHtml" />

          <div class="code-filename">order.module.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeNestModule" />
        </section>

        <!-- 08 — AggregateRoot & Handlers -->
        <section id="nestjs-aggregate" class="section">
          <div class="section-header">
            <span class="section-number">08</span>
            <h2 class="section-title">NestJS &mdash; AggregateRoot &amp; Handlers</h2>
            <div class="section-line" />
          </div>

          <div class="code-filename">order.aggregate.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block orange" v-html="codeAggregate" />
        </section>

        <!-- 09 — @Saga() & RxJS -->
        <section id="nestjs-saga" class="section">
          <div class="section-header">
            <span class="section-number">09</span>
            <h2 class="section-title">NestJS &mdash; @Saga() &amp; RxJS</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              Le d&eacute;corateur <code>@Saga()</code> de NestJS transforme un flux d&rsquo;&eacute;v&eacute;nements
              (<code>Observable</code>) en flux de commandes (<code>Observable&lt;ICommand&gt;</code>).
              C&rsquo;est l&rsquo;int&eacute;gration native du pattern Choreography avec RxJS.
            </p>
          </div>

          <div class="info-box red">
            <strong>Ne jamais laisser l&rsquo;Observable mourir :</strong> Si le pipeline RxJS lance une
            exception non catch&eacute;e, le SAGA cesse de fonctionner <em>silencieusement</em>. Toujours
            encadrer avec <code>catchError((err, src) =&gt; { logger.error(err); return src; })</code>
            pour relancer la source.
          </div>

          <div class="code-filename">order.saga.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block cyan" v-html="codeSagaNest" />
        </section>

        <!-- 10 — Pieges & Regles -->
        <section id="nestjs-pieges" class="section">
          <div class="section-header">
            <span class="section-number">10</span>
            <h2 class="section-title">Pi&egrave;ges &amp; R&egrave;gles Uncle Bob</h2>
            <div class="section-line" />
          </div>

          <div class="flow-steps">
            <div
              v-for="(step, index) in piegeSteps"
              :key="index"
              class="flow-step"
            >
              <div class="flow-step-num" :class="step.colorClass">{{ step.label }}</div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="flow-step-text" v-html="step.text" />
            </div>
          </div>

          <div class="rule-banner">
            <strong>R&eacute;capitulatif des d&eacute;corateurs @nestjs/cqrs :</strong><br><br>
            <code style="color:var(--red)">@CommandHandler(MyCmd)</code> &rarr; implements ICommandHandler
            &rarr; <code>execute(cmd)</code> &rarr; Promise&lt;R&gt;<br>
            <code style="color:var(--green)">@QueryHandler(MyQuery)</code> &rarr; implements IQueryHandler
            &rarr; <code>execute(qry)</code> &rarr; Promise&lt;R&gt;<br>
            <code style="color:var(--accent)">@EventsHandler(MyEvt)</code> &rarr; implements IEventHandler
            &rarr; <code>handle(evt)</code> &rarr; Promise&lt;void&gt;<br>
            <code style="color:var(--cyan, #22d3ee)">@Saga()</code> &rarr; m&eacute;thode retournant
            &rarr; Observable&lt;ICommand&gt; (RxJS pipeline)
          </div>
        </section>

        <!-- 11 — Quand adopter -->
        <section id="quand" class="section">
          <div class="section-header">
            <span class="section-number">11</span>
            <h2 class="section-title">Quand adopter ce triptyque ?</h2>
            <div class="section-line" />
          </div>

          <table class="decision-table">
            <thead>
              <tr>
                <th>Signal</th>
                <th>EDA seul</th>
                <th>EDA + CQRS</th>
                <th>EDA + CQRS + SAGA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in decisionRows" :key="row.signal">
                <td><strong>{{ row.signal }}</strong></td>
                <td><span :class="row.edaSeul.cssClass">{{ row.edaSeul.text }}</span></td>
                <td><span :class="row.edaCqrs.cssClass">{{ row.edaCqrs.text }}</span></td>
                <td><span :class="row.edaCqrsSaga.cssClass">{{ row.edaCqrsSaga.text }}</span></td>
              </tr>
            </tbody>
          </table>

          <div class="quote-box">
            <div class="quote-icon">&#x1F3DB;&#xFE0F;</div>
            <div class="quote-content">
              <h3>La R&egrave;gle Uncle Bob appliqu&eacute;e au triptyque</h3>
              <p>
                Dans <em>Architecture Logicielle Propre</em>, Uncle Bob insiste sur la <strong>Dependency
                Rule</strong> : les d&eacute;pendances pointent vers l&rsquo;int&eacute;rieur. Dans ce
                triptyque : le <em>domaine</em> (Agr&eacute;gat) ne d&eacute;pend de rien. Le
                <em>Use Case</em> (CommandHandler) d&eacute;pend du domaine. L&rsquo;<em>infrastructure</em>
                (TypeORM, Kafka) d&eacute;pend du Use Case. Et le <em>bus</em> est l&rsquo;abstraction
                fronti&egrave;re qui traverse tout &mdash; le producteur ne conna&icirc;t jamais le
                consommateur.
              </p>
            </div>
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
  max-width: 580px;
  line-height: 1.7;
}

/* Meta tags */
.meta-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
.meta-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.meta-tag.green  { color: var(--green);  background: rgba(74,232,176,0.08);  border: 1px solid rgba(74,232,176,0.2); }
.meta-tag.yellow { color: var(--accent); background: rgba(232,200,74,0.08);  border: 1px solid rgba(232,200,74,0.2); }
.meta-tag.purple { color: var(--purple); background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2); }
.meta-tag.blue   { color: var(--blue);   background: rgba(74,158,232,0.08);  border: 1px solid rgba(74,158,232,0.2); }
.meta-tag.orange { color: var(--orange); background: rgba(232,122,74,0.08);  border: 1px solid rgba(232,122,74,0.2); }
.meta-tag.red    { color: var(--red);    background: rgba(232,74,122,0.08);  border: 1px solid rgba(232,74,122,0.2); }

/* Sections */
.section {
  margin-bottom: 72px;
  scroll-margin-top: 32px;
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

h3.sub {
  font-family: 'DM Serif Display', serif;
  font-size: 1.15rem;
  color: var(--white);
  margin: 36px 0 14px;
  scroll-margin-top: 32px;
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
.quote-content strong { color: var(--white); font-weight: 500; }

/* Triptyque header */
.triptyque {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2px;
  margin: 36px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.triptyque-item {
  background: var(--surface);
  padding: 24px 20px;
  text-align: center;
}

.triptyque-item:nth-child(2) {
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

.triptyque-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}

.triptyque-name {
  font-family: 'DM Serif Display', serif;
  font-size: 1.2rem;
  color: var(--white);
  margin-bottom: 6px;
}

.triptyque-desc {
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.6;
}

.triptyque-desc :deep(strong) { color: var(--white); font-weight: 500; }

/* Diagram */
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
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  text-align: center;
  margin-top: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 8px;
}
.cards-2col { grid-template-columns: 1fr 1fr; }
.cards-3col { grid-template-columns: 1fr 1fr 1fr; }

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
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--card-accent, var(--accent));
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.card-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.05rem;
  color: var(--white);
  margin-bottom: 10px;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.65;
  margin-bottom: 14px;
}

.card-desc :deep(strong) { color: var(--white); font-weight: 500; }

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
.cyan   { --card-accent: #22d3ee; }

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

.code-block :deep(.cm)  { color: #6a7090; font-style: italic; }
.code-block :deep(.kw)  { color: #a78bfa; }
.code-block :deep(.fn)  { color: #4ae8b0; }
.code-block :deep(.str) { color: #e8c84a; }
.code-block :deep(.ty)  { color: #4a9ee8; }
.code-block :deep(.dec) { color: #e84a7a; }
.code-block :deep(.num) { color: #fb923c; }
.code-block :deep(.hl)  { color: var(--white); }

.code-block.purple { border-left-color: var(--purple); }
.code-block.green  { border-left-color: var(--green); }
.code-block.blue   { border-left-color: var(--blue); }
.code-block.orange { border-left-color: var(--orange); }
.code-block.red    { border-left-color: var(--red); }
.code-block.cyan   { border-left-color: #22d3ee; }

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
.info-box.yellow { border-left-color: var(--accent); }
.info-box.yellow strong { color: var(--accent); }
.info-box.purple { border-left-color: var(--purple); }
.info-box.purple strong { color: var(--purple); }
.info-box.red    { border-left-color: var(--red); }
.info-box.red strong    { color: var(--red); }
.info-box.blue   { border-left-color: var(--blue); }
.info-box.blue strong   { color: var(--blue); }

/* Rule banner */
.rule-banner {
  background: linear-gradient(135deg, rgba(74,232,176,0.07), rgba(167,139,250,0.05));
  border: 1px solid rgba(74,232,176,0.25);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 28px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  color: var(--green);
  letter-spacing: 0.04em;
  line-height: 1.7;
}

.rule-banner strong { color: var(--white); }

/* Inline code */
.section :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
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
  color: var(--muted);
  white-space: pre;
  overflow-x: auto;
}

.file-tree :deep(.ft-dir)   { color: var(--accent); }
.file-tree :deep(.ft-gray)  { color: var(--muted); }
.file-tree :deep(.ft-cmd)   { color: var(--red); }
.file-tree :deep(.ft-qry)   { color: var(--green); }
.file-tree :deep(.ft-evt)   { color: var(--accent); }
.file-tree :deep(.ft-dom)   { color: var(--orange); }
.file-tree :deep(.ft-infra) { color: var(--blue); }
.file-tree :deep(.ft-saga)  { color: #22d3ee; }

/* Flow steps */
.flow-steps {
  margin: 28px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.flow-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.flow-step:last-child { border-bottom: none; }

.flow-step-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--bg);
  background: var(--accent2);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  font-weight: 600;
}

.flow-step-num.red    { background: var(--red); }
.flow-step-num.yellow { background: var(--accent); }
.flow-step-num.purple { background: var(--purple); }

.flow-step-text {
  font-size: 0.9rem;
  color: var(--text);
  padding-top: 2px;
  line-height: 1.6;
}

.flow-step-text :deep(strong) { color: var(--white); font-weight: 500; }

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
  padding: 12px 16px;
  text-align: left;
  border-bottom: 2px solid var(--border);
  color: var(--muted);
  background: rgba(0,0,0,0.2);
}

.decision-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
  line-height: 1.6;
  color: var(--text);
}

.decision-table tr:last-child td { border-bottom: none; }
.decision-table tr:hover td { background: rgba(255,255,255,0.015); }

.dt-ok   { color: var(--green);  font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; font-weight: 600; }
.dt-warn { color: var(--accent); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; }
.dt-no   { color: var(--muted);  font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; }
.dt-bad  { color: var(--red);    font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; }

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
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.10s; }
.card:nth-child(3) { animation-delay: 0.15s; }

/* Responsive */
@media (max-width: 900px) {
  .main { margin-left: 0; }
  .cards-2col, .cards-3col { grid-template-columns: 1fr; }
  .triptyque { grid-template-columns: 1fr; }
  h1 { font-size: 2.2rem; }
}

@media (max-width: 640px) {
  .content { padding: 32px 20px 80px; }
}
</style>
