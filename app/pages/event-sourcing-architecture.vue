<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (concept cards, piege cards, decision table rows,
 *          legend items) are modeled as typed arrays and rendered via v-for,
 *          while unique prose, diagrams, and code blocks stay as direct template markup.
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
  quote?: string
}

interface PiegeCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  quote?: string
}

interface DecisionRow {
  critere: string
  description: string
  verdict: { text: string; cssClass: string }
}

interface CmpItem {
  text: string
}

interface LegendItem {
  color: string
  label: string
}

const conceptCards: ConceptCard[] = [
  {
    icon: '\u{1F4CB}',
    colorClass: 'green',
    name: 'Domain Event',
    title: '\u00c9v\u00e9nement Domaine',
    description:
      'Un fait m\u00e9tier pass\u00e9, immuable. Nomm\u00e9 au pass\u00e9 compos\u00e9 : <code>MoneyDeposited</code>, <code>AccountClosed</code>. Contient toutes les donn\u00e9es n\u00e9cessaires pour reconstituer ce qui s\'est pass\u00e9.',
    tags: ['Immuable', 'Fait pass\u00e9', 'Append-only'],
    quote: '\u00ab Un \u00e9v\u00e9nement n\'est pas "d\u00e9pose de l\'argent" \u2014 c\'est "de l\'argent A \u00c9T\u00c9 d\u00e9pos\u00e9". \u00bb',
  },
  {
    icon: '\u{1F3DB}\uFE0F',
    colorClass: 'blue',
    name: 'Event Store',
    title: 'Journal d\'\u00c9v\u00e9nements',
    description:
      'Base de donn\u00e9es append-only qui persiste tous les \u00e9v\u00e9nements. Comme Git : on n\'\u00e9crase jamais l\'histoire, on ajoute des commits. Organis\u00e9e en <em>streams</em> par agr\u00e9gat.',
    tags: ['Append-only', 'Streams', 'Optimistic Lock'],
    quote: '\u00ab EventStoreDB, PostgreSQL append-only, ou Apache Kafka selon les besoins. \u00bb',
  },
  {
    icon: '\u{1F9EE}',
    colorClass: 'purple',
    name: 'Aggregate + Rehydration',
    title: 'Reconstitution d\'\u00e9tat',
    description:
      'L\'\u00e9tat courant de l\'agr\u00e9gat est reconstruit en <em>replaying</em> tous les \u00e9v\u00e9nements pass\u00e9s. C\'est un <code>Array.reduce()</code> appliqu\u00e9 \u00e0 l\'histoire : <code>fold(events) \u2192 state</code>.',
    tags: ['Fold / Reduce', 'Pure function', 'Deterministe'],
  },
  {
    icon: '\u{1F4CA}',
    colorClass: 'pink',
    name: 'Projection / Read Model',
    title: 'Vue Mat\u00e9rialis\u00e9e',
    description:
      'Repr\u00e9sentation optimis\u00e9e pour la lecture, construite en \u00e9coutant les \u00e9v\u00e9nements. On peut avoir autant de projections que de besoins : soldes, historique, d\u00e9tection de fraude, analytics\u2026',
    tags: ['CQRS Read', 'Reconstruible', 'Optimis\u00e9 query'],
  },
  {
    icon: '\u{1F4F8}',
    colorClass: 'yellow',
    name: 'Snapshot',
    title: 'Instantan\u00e9 d\'optimisation',
    description:
      'Capture de l\'\u00e9tat \u00e0 un moment pr\u00e9cis pour \u00e9viter de rejouer des milliers d\'\u00e9v\u00e9nements \u00e0 chaque chargement. <strong>Optionnel</strong> \u2014 on rejoue uniquement les \u00e9v\u00e9nements <em>post\u00e9rieurs</em> au snapshot.',
    tags: ['Optimisation', 'Optionnel', 'Periodicite'],
  },
  {
    icon: '\u23F0',
    colorClass: 'orange',
    name: 'Time Travel',
    title: 'Voyage dans le temps',
    description:
      'Reconstituer l\'\u00e9tat d\'un agr\u00e9gat \u00e0 <em>n\'importe quel instant pass\u00e9</em> en rejouant uniquement les \u00e9v\u00e9nements ant\u00e9rieurs \u00e0 ce point. Outil de d\u00e9bogage m\u00e9tier inestimable.',
    tags: ['Debug', 'Audit', 'Replay partiel'],
  },
]

const piegeCards: PiegeCard[] = [
  {
    icon: '\u26A0\uFE0F',
    colorClass: 'pink',
    name: 'Pi\u00e8ge 01',
    title: '\u00c9v\u00e9nement \u2260 mutation technique',
    description:
      'Un \u00e9v\u00e9nement doit \u00eatre un <strong>fait m\u00e9tier</strong>, pas une op\u00e9ration technique.',
    quote: '\u274C BalanceFieldUpdated\n\u2705 MoneyDeposited',
  },
  {
    icon: '\u26A0\uFE0F',
    colorClass: 'pink',
    name: 'Pi\u00e8ge 02',
    title: 'Sch\u00e9ma d\'\u00e9v\u00e9nement immuable',
    description:
      'Un \u00e9v\u00e9nement persist\u00e9 est <strong>grav\u00e9 dans le marbre</strong>. Utiliser un <strong>Upcaster</strong> pour migrer les anciens formats vers de nouveaux sch\u00e9mas.',
    quote: '\u00ab On ne modifie pas l\'histoire. On l\'interpr\u00e8te diff\u00e9remment. \u00bb',
  },
  {
    icon: '\u26A0\uFE0F',
    colorClass: 'pink',
    name: 'Pi\u00e8ge 03',
    title: 'Pas de Snapshots = lenteur',
    description:
      'Sans snapshots, rejouer 50 000 \u00e9v\u00e9nements \u00e0 chaque requ\u00eate est prohibitif. Impl\u00e9menter des snapshots <strong>p\u00e9riodiques</strong> pour les agr\u00e9gats \u00e0 longue dur\u00e9e de vie.',
  },
  {
    icon: '\u{1F500}',
    colorClass: 'orange',
    name: 'Confusion 01',
    title: 'ES \u2260 Event-Driven Architecture',
    description:
      'L\'Event Sourcing est un <strong>pattern de persistance</strong>. L\'EDA est un <strong>pattern de communication</strong>. Ils se combinent souvent mais sont distincts et ind\u00e9pendants.',
  },
  {
    icon: '\u{1F500}',
    colorClass: 'orange',
    name: 'Confusion 02',
    title: 'ES \u2260 CQRS obligatoire',
    description:
      'L\'Event Sourcing <em>se marie bien</em> avec CQRS mais ne l\'implique pas. On peut faire de l\'Event Sourcing sans CQRS, et du CQRS sans Event Sourcing.',
  },
  {
    icon: '\u{1F4BE}',
    colorClass: 'yellow',
    name: 'Choix tech',
    title: 'L\'Event Store n\'est pas SQL',
    description:
      'Pas une table SQL ordinaire : <strong>EventStoreDB</strong> (natif), <strong>Apache Kafka</strong> (distribu\u00e9), ou une table <strong>PostgreSQL append-only</strong> avec <code>version</code> et <code>SERIAL</code>.',
  },
]

const decisionRows: DecisionRow[] = [
  {
    critere: 'Audit obligatoire',
    description: 'Finance, sant\u00e9, logistique, conformit\u00e9 r\u00e9glementaire \u2014 tra\u00e7abilit\u00e9 totale requise',
    verdict: { text: '\u2713 Id\u00e9al', cssClass: 'badge badge-ok' },
  },
  {
    critere: 'Time travel m\u00e9tier',
    description: 'Besoin de reconstituer l\'\u00e9tat \u00e0 un instant pass\u00e9 pour d\u00e9bogage ou litige',
    verdict: { text: '\u2713 Id\u00e9al', cssClass: 'badge badge-ok' },
  },
  {
    critere: 'Plusieurs Read Models',
    description: 'Analytics, reporting, dashboard, alertes \u2014 chaque besoin a sa projection',
    verdict: { text: '\u2713 Id\u00e9al', cssClass: 'badge badge-ok' },
  },
  {
    critere: 'Workflow complexe',
    description: 'Processus m\u00e9tier multi-\u00e9tapes avec corrections, annulations, compensations',
    verdict: { text: '\u2713 Recommand\u00e9', cssClass: 'badge badge-ok' },
  },
  {
    critere: 'Int\u00e9gration DDD',
    description: 'Agr\u00e9gats riches, logique m\u00e9tier forte, fronti\u00e8res de contexte claires',
    verdict: { text: '\u2713 Synergie', cssClass: 'badge badge-ok' },
  },
  {
    critere: 'CRUD simple',
    description: 'Blog, catalogue produit, gestion de contenu sans exigence d\'audit',
    verdict: { text: '\u2717 Over-engineering', cssClass: 'badge badge-bad' },
  },
  {
    critere: '\u00c9quipe sans exp\u00e9rience',
    description: 'Pas de formation DDD / Event Sourcing dans l\'\u00e9quipe',
    verdict: { text: '\u26A0 Formation requise', cssClass: 'badge badge-warn' },
  },
  {
    critere: 'Donn\u00e9es \u00e9ph\u00e9m\u00e8res',
    description: 'Sessions, cache, pr\u00e9f\u00e9rences UI, donn\u00e9es temporaires',
    verdict: { text: '\u2717 Inadapt\u00e9', cssClass: 'badge badge-bad' },
  },
  {
    critere: 'Volume extr\u00eame sans snapshot',
    description: 'Millions d\'\u00e9v\u00e9nements par agr\u00e9gat sans strat\u00e9gie de snapshot',
    verdict: { text: '\u26A0 Snapshot obligatoire', cssClass: 'badge badge-warn' },
  },
]

const cmpBad: CmpItem[] = [
  { text: 'L\'historique des mutations est perdu' },
  { text: 'Impossible d\'auditer "qui a modifi\u00e9 quoi et pourquoi"' },
  { text: 'Pas de time travel ni de replay' },
  { text: 'Une seule repr\u00e9sentation de l\'\u00e9tat' },
  { text: 'Correction impossible sans trace' },
]

const cmpGood: CmpItem[] = [
  { text: 'Historique complet et immuable des causes' },
  { text: 'Audit natif, tra\u00e7abilit\u00e9 totale' },
  { text: 'Time travel : \u00e9tat \u00e0 n\'importe quel point' },
  { text: 'Projections multiples et reconstruibles' },
  { text: 'Correction via \u00e9v\u00e9nement compensatoire' },
]

const inconvenients: CmpItem[] = [
  { text: 'Courbe d\'apprentissage \u00e9lev\u00e9e (DDD requis)' },
  { text: 'Migrations de sch\u00e9ma d\'\u00e9v\u00e9nements d\u00e9licates (Upcasters)' },
  { text: 'Latence de lecture si projections asynchrones (Eventual Consistency)' },
  { text: 'Besoin d\'une strat\u00e9gie de Snapshots pour les grands streams' },
  { text: 'Infrastructure suppl\u00e9mentaire (EventStoreDB / Kafka)' },
  { text: 'Requ\u00eates complexes sur l\'\u00e9tat historique difficiles' },
]

const avantages: CmpItem[] = [
  { text: 'Auditabilit\u00e9 native et compl\u00e8te \u2014 chaque changement trac\u00e9' },
  { text: 'Time travel : \u00e9tat reconstitu\u00e9 \u00e0 n\'importe quel instant pass\u00e9' },
  { text: 'Projections reconstruibles \u2014 nouvelles vues possibles \u00e0 tout moment' },
  { text: 'D\u00e9bogage production exceptionnel : replay des sc\u00e9narios r\u00e9els' },
  { text: 'Logique m\u00e9tier isol\u00e9e, pure et testable (reducers d\u00e9terministes)' },
  { text: 'Int\u00e9gration naturelle avec CQRS et DDD' },
]

const legendItems: LegendItem[] = [
  { color: '#4ae8b0', label: '\u00c9v\u00e9nement Domaine' },
  { color: '#4a9ee8', label: 'Event Store (Append-only)' },
  { color: '#a78bfa', label: 'Agr\u00e9gat + Fold' },
  { color: '#e84a7a', label: 'Projections (Read Models)' },
  { color: '#e87a4a', label: 'Snapshot (Optimisation)' },
  { color: '#e8c84a', label: 'Time Travel' },
]

/* ── Code blocks (raw HTML for v-html syntax highlighting) ── */

const codeEvents = `<span class="cm">// --- Les Evenements -- faits immuables nommes au passe ---</span>

<span class="kw">type</span> <span class="ty">EventType</span> =
  | <span class="str">'AccountCreated'</span>
  | <span class="str">'MoneyDeposited'</span>
  | <span class="str">'MoneyWithdrawn'</span>
  | <span class="str">'AccountClosed'</span>

<span class="kw">interface</span> <span class="ty">DomainEvent</span> {
  <span class="kw">readonly</span> eventId:      <span class="ty">string</span>
  <span class="kw">readonly</span> eventType:   <span class="ty">EventType</span>
  <span class="kw">readonly</span> aggregateId: <span class="ty">string</span>
  <span class="kw">readonly</span> version:     <span class="ty">number</span>
  <span class="kw">readonly</span> occurredOn:  <span class="ty">Date</span>
  <span class="kw">readonly</span> payload:     <span class="ty">unknown</span>
}

<span class="kw">interface</span> <span class="ty">AccountCreatedPayload</span>  { owner: <span class="ty">string</span>; initialBalance: <span class="ty">number</span> }
<span class="kw">interface</span> <span class="ty">MoneyDepositedPayload</span>  { amount: <span class="ty">number</span>; currency: <span class="ty">string</span>; description?: <span class="ty">string</span> }
<span class="kw">interface</span> <span class="ty">MoneyWithdrawnPayload</span>  { amount: <span class="ty">number</span>; currency: <span class="ty">string</span>; reason: <span class="ty">string</span> }
<span class="kw">interface</span> <span class="ty">AccountClosedPayload</span>   { reason: <span class="ty">string</span> }`

const codeAggregate = `<span class="kw">type</span> <span class="ty">AccountStatus</span> = <span class="str">'ACTIVE'</span> | <span class="str">'CLOSED'</span>

<span class="kw">interface</span> <span class="ty">AccountState</span> {
  id: <span class="ty">string</span>; owner: <span class="ty">string</span>; balance: <span class="ty">number</span>
  status: <span class="ty">AccountStatus</span>; version: <span class="ty">number</span>
}

<span class="kw">class</span> <span class="ty">BankAccount</span> {
  <span class="kw">private</span> state: <span class="ty">AccountState</span>
  <span class="kw">private</span> uncommittedEvents: <span class="ty">DomainEvent</span>[] = []

  <span class="kw">private constructor</span>(state: <span class="ty">AccountState</span>) { <span class="kw">this</span>.state = state }

  <span class="cm">// -- Factory : rehydrater depuis l'Event Store (le fold) --</span>
  <span class="kw">static</span> <span class="fn">rehydrate</span>(events: <span class="ty">DomainEvent</span>[]): <span class="ty">BankAccount</span> {
    <span class="kw">const</span> initialState: <span class="ty">AccountState</span> = {
      id: <span class="str">''</span>, owner: <span class="str">''</span>, balance: <span class="op">0</span>, status: <span class="str">'ACTIVE'</span>, version: <span class="op">0</span>
    }
    <span class="cm">// Array.reduce() = le coeur d'Event Sourcing</span>
    <span class="kw">const</span> state = events.<span class="fn">reduce</span>(
      (s, e) => <span class="ty">BankAccount</span>.<span class="fn">apply</span>(s, e),
      initialState
    )
    <span class="kw">return new</span> <span class="ty">BankAccount</span>(state)
  }

  <span class="cm">// -- Reducer pur : un evenement -> nouvel etat --</span>
  <span class="kw">private static</span> <span class="fn">apply</span>(state: <span class="ty">AccountState</span>, event: <span class="ty">DomainEvent</span>): <span class="ty">AccountState</span> {
    <span class="kw">switch</span> (event.eventType) {
      <span class="kw">case</span> <span class="str">'AccountCreated'</span>: {
        <span class="kw">const</span> p = event.payload <span class="kw">as</span> <span class="ty">AccountCreatedPayload</span>
        <span class="kw">return</span> { ...state, id: event.aggregateId, owner: p.owner,
                 balance: p.initialBalance, status: <span class="str">'ACTIVE'</span>, version: event.version }
      }
      <span class="kw">case</span> <span class="str">'MoneyDeposited'</span>: {
        <span class="kw">const</span> p = event.payload <span class="kw">as</span> <span class="ty">MoneyDepositedPayload</span>
        <span class="kw">return</span> { ...state, balance: state.balance + p.amount, version: event.version }
      }
      <span class="kw">case</span> <span class="str">'MoneyWithdrawn'</span>: {
        <span class="kw">const</span> p = event.payload <span class="kw">as</span> <span class="ty">MoneyWithdrawnPayload</span>
        <span class="kw">return</span> { ...state, balance: state.balance - p.amount, version: event.version }
      }
      <span class="kw">case</span> <span class="str">'AccountClosed'</span>:
        <span class="kw">return</span> { ...state, status: <span class="str">'CLOSED'</span>, version: event.version }
      <span class="kw">default</span>: <span class="kw">return</span> state
    }
  }

  <span class="cm">// -- Commandes : validation metier + emission d'evenements --</span>

  <span class="fn">deposit</span>(amount: <span class="ty">number</span>, currency = <span class="str">'EUR'</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.state.status === <span class="str">'CLOSED'</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Impossible de deposer sur un compte ferme'</span>)
    <span class="kw">if</span> (amount &lt;= <span class="op">0</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Le montant doit etre positif'</span>)

    <span class="kw">this</span>.<span class="fn">recordEvent</span>(<span class="str">'MoneyDeposited'</span>, { amount, currency } <span class="kw">as</span> <span class="ty">MoneyDepositedPayload</span>)
  }

  <span class="fn">withdraw</span>(amount: <span class="ty">number</span>, reason: <span class="ty">string</span>, currency = <span class="str">'EUR'</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.state.status === <span class="str">'CLOSED'</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Compte ferme'</span>)
    <span class="kw">if</span> (amount > <span class="kw">this</span>.state.balance)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">\`Solde insuffisant: \${this.state.balance} &lt; \${amount}\`</span>)

    <span class="kw">this</span>.<span class="fn">recordEvent</span>(<span class="str">'MoneyWithdrawn'</span>, { amount, currency, reason } <span class="kw">as</span> <span class="ty">MoneyWithdrawnPayload</span>)
  }

  <span class="fn">close</span>(reason: <span class="ty">string</span>): <span class="ty">void</span> {
    <span class="kw">if</span> (<span class="kw">this</span>.state.status === <span class="str">'CLOSED'</span>)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Compte deja ferme'</span>)
    <span class="kw">this</span>.<span class="fn">recordEvent</span>(<span class="str">'AccountClosed'</span>, { reason } <span class="kw">as</span> <span class="ty">AccountClosedPayload</span>)
  }

  <span class="cm">// -- Enregistrement interne : applique + met en file d'attente --</span>
  <span class="kw">private</span> <span class="fn">recordEvent</span>(eventType: <span class="ty">EventType</span>, payload: <span class="ty">unknown</span>): <span class="ty">void</span> {
    <span class="kw">const</span> newVersion = <span class="kw">this</span>.state.version + <span class="op">1</span>
    <span class="kw">const</span> event: <span class="ty">DomainEvent</span> = {
      eventId: crypto.<span class="fn">randomUUID</span>(), eventType,
      aggregateId: <span class="kw">this</span>.state.id, version: newVersion,
      occurredOn: <span class="kw">new</span> <span class="ty">Date</span>(), payload
    }
    <span class="kw">this</span>.state = <span class="ty">BankAccount</span>.<span class="fn">apply</span>(<span class="kw">this</span>.state, event)  <span class="cm">// etat local immediat</span>
    <span class="kw">this</span>.uncommittedEvents.<span class="fn">push</span>(event)                  <span class="cm">// en attente de persistance</span>
  }

  <span class="fn">getUncommittedEvents</span>(): <span class="ty">DomainEvent</span>[] { <span class="kw">return</span> [...<span class="kw">this</span>.uncommittedEvents] }
  <span class="fn">clearUncommittedEvents</span>(): <span class="ty">void</span>         { <span class="kw">this</span>.uncommittedEvents = [] }
  <span class="fn">getState</span>(): <span class="ty">Readonly</span>&lt;<span class="ty">AccountState</span>&gt;     { <span class="kw">return</span> { ...<span class="kw">this</span>.state } }
}`

const codeEventStore = `<span class="kw">interface</span> <span class="ty">EventStore</span> {
  <span class="fn">append</span>(id: <span class="ty">string</span>, events: <span class="ty">DomainEvent</span>[], expectedVersion: <span class="ty">number</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt;
  <span class="fn">loadEvents</span>(id: <span class="ty">string</span>, fromVersion?: <span class="ty">number</span>): <span class="ty">Promise</span>&lt;<span class="ty">DomainEvent</span>[]&gt;
}

<span class="kw">class</span> <span class="ty">InMemoryEventStore</span> <span class="kw">implements</span> <span class="ty">EventStore</span> {
  <span class="kw">private</span> streams = <span class="kw">new</span> <span class="ty">Map</span>&lt;<span class="ty">string</span>, <span class="ty">DomainEvent</span>[]&gt;()

  <span class="kw">async</span> <span class="fn">append</span>(id: <span class="ty">string</span>, events: <span class="ty">DomainEvent</span>[], expectedVersion: <span class="ty">number</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">const</span> stream = <span class="kw">this</span>.streams.<span class="fn">get</span>(id) ?? []
    <span class="kw">const</span> currentVersion = stream.length > <span class="op">0</span> ? stream[stream.length - <span class="op">1</span>].version : <span class="op">0</span>

    <span class="cm">// Optimistic Concurrency Control</span>
    <span class="kw">if</span> (currentVersion !== expectedVersion)
      <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">\`Conflit de version: attendu \${expectedVersion}, actuel \${currentVersion}\`</span>)

    <span class="kw">this</span>.streams.<span class="fn">set</span>(id, [...stream, ...events])
  }

  <span class="kw">async</span> <span class="fn">loadEvents</span>(id: <span class="ty">string</span>, fromVersion = <span class="op">0</span>): <span class="ty">Promise</span>&lt;<span class="ty">DomainEvent</span>[]&gt; {
    <span class="kw">return</span> (<span class="kw">this</span>.streams.<span class="fn">get</span>(id) ?? []).<span class="fn">filter</span>(e => e.version > fromVersion)
  }
}

<span class="cm">// -- Repository : orchestre load -> rehydrate -> save --</span>
<span class="kw">class</span> <span class="ty">BankAccountRepository</span> {
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> eventStore: <span class="ty">EventStore</span>) {}

  <span class="kw">async</span> <span class="fn">findById</span>(id: <span class="ty">string</span>): <span class="ty">Promise</span>&lt;<span class="ty">BankAccount</span>&gt; {
    <span class="kw">const</span> events = <span class="kw">await</span> <span class="kw">this</span>.eventStore.<span class="fn">loadEvents</span>(id)
    <span class="kw">if</span> (events.length === <span class="op">0</span>) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">\`Compte \${id} introuvable\`</span>)
    <span class="kw">return</span> <span class="ty">BankAccount</span>.<span class="fn">rehydrate</span>(events)
  }

  <span class="kw">async</span> <span class="fn">save</span>(account: <span class="ty">BankAccount</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">const</span> uncommitted = account.<span class="fn">getUncommittedEvents</span>()
    <span class="kw">if</span> (uncommitted.length === <span class="op">0</span>) <span class="kw">return</span>

    <span class="kw">const</span> currentVersion = account.<span class="fn">getState</span>().version - uncommitted.length
    <span class="kw">await</span> <span class="kw">this</span>.eventStore.<span class="fn">append</span>(account.<span class="fn">getState</span>().id, uncommitted, currentVersion)
    account.<span class="fn">clearUncommittedEvents</span>()
  }
}

<span class="cm">// -- Time Travel : etat a la version N --</span>
<span class="kw">async function</span> <span class="fn">getStateAtVersion</span>(store: <span class="ty">EventStore</span>, id: <span class="ty">string</span>, version: <span class="ty">number</span>) {
  <span class="kw">const</span> allEvents = <span class="kw">await</span> store.<span class="fn">loadEvents</span>(id)
  <span class="kw">const</span> pastEvents = allEvents.<span class="fn">filter</span>(e => e.version &lt;= version)
  <span class="kw">return</span> <span class="ty">BankAccount</span>.<span class="fn">rehydrate</span>(pastEvents)
  <span class="cm">// Etat a v2 -> balance: 500 EUR</span>
}`

const codeFunctional = `<span class="kw">import</span> { pipe }    <span class="kw">from</span> <span class="str">'fp-ts/function'</span>
<span class="kw">import</span> * <span class="kw">as</span> E     <span class="kw">from</span> <span class="str">'fp-ts/Either'</span>
<span class="kw">import</span> * <span class="kw">as</span> A     <span class="kw">from</span> <span class="str">'fp-ts/Array'</span>
<span class="kw">import</span> * <span class="kw">as</span> O     <span class="kw">from</span> <span class="str">'fp-ts/Option'</span>

<span class="cm">// --- Les Types Algebriques ---</span>

<span class="kw">type</span> <span class="ty">AccountEvent</span> =
  | { <span class="kw">readonly</span> _tag: <span class="str">'AccountCreated'</span>; owner: <span class="ty">string</span>; initialBalance: <span class="ty">number</span> }
  | { <span class="kw">readonly</span> _tag: <span class="str">'MoneyDeposited'</span>; amount: <span class="ty">number</span> }
  | { <span class="kw">readonly</span> _tag: <span class="str">'MoneyWithdrawn'</span>; amount: <span class="ty">number</span> }
  | { <span class="kw">readonly</span> _tag: <span class="str">'AccountClosed'</span>  }

<span class="kw">type</span> <span class="ty">AccountState</span> =
  | { <span class="kw">readonly</span> _tag: <span class="str">'Uninitialized'</span> }
  | { <span class="kw">readonly</span> _tag: <span class="str">'Active'</span>; owner: <span class="ty">string</span>; balance: <span class="ty">number</span> }
  | { <span class="kw">readonly</span> _tag: <span class="str">'Closed'</span>; owner: <span class="ty">string</span>; finalBalance: <span class="ty">number</span> }

<span class="kw">type</span> <span class="ty">AccountError</span> =
  | { <span class="kw">readonly</span> _tag: <span class="str">'InsufficientFunds'</span>; available: <span class="ty">number</span>; requested: <span class="ty">number</span> }
  | { <span class="kw">readonly</span> _tag: <span class="str">'AccountAlreadyClosed'</span> }
  | { <span class="kw">readonly</span> _tag: <span class="str">'InvalidAmount'</span>; amount: <span class="ty">number</span> }

<span class="cm">// --- Le Reducer Pur (fold) ---</span>

<span class="kw">const</span> <span class="fn">applyEvent</span> = (state: <span class="ty">AccountState</span>, event: <span class="ty">AccountEvent</span>): <span class="ty">AccountState</span> => {
  <span class="kw">switch</span> (state._tag) {
    <span class="kw">case</span> <span class="str">'Uninitialized'</span>:
      <span class="kw">if</span> (event._tag === <span class="str">'AccountCreated'</span>)
        <span class="kw">return</span> { _tag: <span class="str">'Active'</span>, owner: event.owner, balance: event.initialBalance }
      <span class="kw">return</span> state

    <span class="kw">case</span> <span class="str">'Active'</span>:
      <span class="kw">switch</span> (event._tag) {
        <span class="kw">case</span> <span class="str">'MoneyDeposited'</span>: <span class="kw">return</span> { ...state, balance: state.balance + event.amount }
        <span class="kw">case</span> <span class="str">'MoneyWithdrawn'</span>: <span class="kw">return</span> { ...state, balance: state.balance - event.amount }
        <span class="kw">case</span> <span class="str">'AccountClosed'</span>:  <span class="kw">return</span> { _tag: <span class="str">'Closed'</span>, owner: state.owner, finalBalance: state.balance }
        <span class="kw">default</span>: <span class="kw">return</span> state
      }

    <span class="kw">case</span> <span class="str">'Closed'</span>: <span class="kw">return</span> state  <span class="cm">// etat terminal</span>
  }
}

<span class="cm">// Le fold -- reconstitution depuis la liste complete des evenements</span>
<span class="kw">const</span> <span class="fn">rehydrate</span> = (events: <span class="ty">ReadonlyArray</span>&lt;<span class="ty">AccountEvent</span>&gt;): <span class="ty">AccountState</span> =>
  events.<span class="fn">reduce</span>(<span class="fn">applyEvent</span>, { _tag: <span class="str">'Uninitialized'</span> } <span class="kw">as</span> <span class="ty">AccountState</span>)

<span class="cm">// --- Les Decisions (commandes -> Railway) ---</span>

<span class="kw">const</span> <span class="fn">deposit</span> =
  (amount: <span class="ty">number</span>) =>
  (state: <span class="ty">AccountState</span>): <span class="ty">E.Either</span>&lt;<span class="ty">AccountError</span>, <span class="ty">AccountEvent</span>[]&gt; => {
    <span class="kw">if</span> (state._tag !== <span class="str">'Active'</span>)  <span class="kw">return</span> E.<span class="fn">left</span>({ _tag: <span class="str">'AccountAlreadyClosed'</span> })
    <span class="kw">if</span> (amount &lt;= <span class="op">0</span>)               <span class="kw">return</span> E.<span class="fn">left</span>({ _tag: <span class="str">'InvalidAmount'</span>, amount })
    <span class="kw">return</span> E.<span class="fn">right</span>([{ _tag: <span class="str">'MoneyDeposited'</span>, amount }])
  }

<span class="kw">const</span> <span class="fn">withdraw</span> =
  (amount: <span class="ty">number</span>) =>
  (state: <span class="ty">AccountState</span>): <span class="ty">E.Either</span>&lt;<span class="ty">AccountError</span>, <span class="ty">AccountEvent</span>[]&gt; => {
    <span class="kw">if</span> (state._tag !== <span class="str">'Active'</span>)       <span class="kw">return</span> E.<span class="fn">left</span>({ _tag: <span class="str">'AccountAlreadyClosed'</span> })
    <span class="kw">if</span> (amount &lt;= <span class="op">0</span>)                   <span class="kw">return</span> E.<span class="fn">left</span>({ _tag: <span class="str">'InvalidAmount'</span>, amount })
    <span class="kw">if</span> (amount > state.balance)         <span class="kw">return</span> E.<span class="fn">left</span>({ _tag: <span class="str">'InsufficientFunds'</span>,
                                                          available: state.balance, requested: amount })
    <span class="kw">return</span> E.<span class="fn">right</span>([{ _tag: <span class="str">'MoneyWithdrawn'</span>, amount }])
  }

<span class="cm">// --- Time Travel fonctionnel ---</span>

<span class="kw">const</span> <span class="fn">getStateAtVersion</span> = (
  events: <span class="ty">ReadonlyArray</span>&lt;<span class="ty">AccountEvent</span>&gt;, version: <span class="ty">number</span>
): <span class="ty">O.Option</span>&lt;<span class="ty">AccountState</span>&gt; =>
  <span class="fn">pipe</span>(
    events,
    A.<span class="fn">takeLeft</span>(version),
    <span class="fn">rehydrate</span>,
    state => (state._tag === <span class="str">'Uninitialized'</span> ? O.<span class="fn">none</span> : O.<span class="fn">some</span>(state))
  )`

const codeProjection = `<span class="kw">interface</span> <span class="ty">AccountBalanceView</span> {
  accountId: <span class="ty">string</span>; owner: <span class="ty">string</span>; balance: <span class="ty">number</span>; lastUpdated: <span class="ty">Date</span>
}

<span class="kw">class</span> <span class="ty">AccountBalanceProjection</span> {
  <span class="kw">private</span> store = <span class="kw">new</span> <span class="ty">Map</span>&lt;<span class="ty">string</span>, <span class="ty">AccountBalanceView</span>&gt;()

  <span class="fn">handle</span>(event: <span class="ty">DomainEvent</span>): <span class="ty">void</span> {
    <span class="kw">switch</span> (event.eventType) {
      <span class="kw">case</span> <span class="str">'AccountCreated'</span>: {
        <span class="kw">const</span> p = event.payload <span class="kw">as</span> <span class="ty">AccountCreatedPayload</span>
        <span class="kw">this</span>.store.<span class="fn">set</span>(event.aggregateId, {
          accountId: event.aggregateId, owner: p.owner,
          balance: p.initialBalance, lastUpdated: event.occurredOn,
        })
        <span class="kw">break</span>
      }
      <span class="kw">case</span> <span class="str">'MoneyDeposited'</span>: {
        <span class="kw">const</span> model = <span class="kw">this</span>.store.<span class="fn">get</span>(event.aggregateId); <span class="kw">if</span> (!model) <span class="kw">return</span>
        <span class="kw">const</span> p = event.payload <span class="kw">as</span> <span class="ty">MoneyDepositedPayload</span>
        <span class="kw">this</span>.store.<span class="fn">set</span>(event.aggregateId, { ...model,
          balance: model.balance + p.amount, lastUpdated: event.occurredOn })
        <span class="kw">break</span>
      }
      <span class="kw">case</span> <span class="str">'MoneyWithdrawn'</span>: {
        <span class="kw">const</span> model = <span class="kw">this</span>.store.<span class="fn">get</span>(event.aggregateId); <span class="kw">if</span> (!model) <span class="kw">return</span>
        <span class="kw">const</span> p = event.payload <span class="kw">as</span> <span class="ty">MoneyWithdrawnPayload</span>
        <span class="kw">this</span>.store.<span class="fn">set</span>(event.aggregateId, { ...model,
          balance: model.balance - p.amount, lastUpdated: event.occurredOn })
        <span class="kw">break</span>
      }
      <span class="kw">case</span> <span class="str">'AccountClosed'</span>:
        <span class="kw">this</span>.store.<span class="fn">delete</span>(event.aggregateId)
        <span class="kw">break</span>
    }
  }

  <span class="fn">getBalance</span>(id: <span class="ty">string</span>): <span class="ty">AccountBalanceView</span> | <span class="ty">undefined</span> {
    <span class="kw">return</span> <span class="kw">this</span>.store.<span class="fn">get</span>(id)
  }

  <span class="cm">// POUVOIR CLE : supprimer et reconstruire depuis zero a tout moment</span>
  <span class="kw">async</span> <span class="fn">rebuild</span>(allEvents: <span class="ty">DomainEvent</span>[]): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">this</span>.store.<span class="fn">clear</span>()                       <span class="cm">// table rase</span>
    allEvents.<span class="fn">forEach</span>(e => <span class="kw">this</span>.<span class="fn">handle</span>(e))   <span class="cm">// replay complet</span>
  }
}`

const fileTreeHtml = `<span class="ft-dir">src/</span>
<span class="ft-dir">\u251C\u2500\u2500 domain/</span>                                    <span class="ft-gray">\u2190 R\u00e8gles m\u00e9tier \u2014 z\u00e9ro d\u00e9pendance</span>
<span class="ft-dir">\u2502   \u251C\u2500\u2500 events/</span>
<span class="ft-yellow">\u2502   \u2502   \u251C\u2500\u2500 bank-account.events.ts</span>              <span class="ft-gray">\u2190 DomainEvent, payloads typ\u00e9s</span>
<span class="ft-yellow">\u2502   \u2502   \u2514\u2500\u2500 event-type.enum.ts</span>
<span class="ft-dir">\u2502   \u2514\u2500\u2500 aggregates/</span>
<span class="ft-yellow">\u2502       \u2514\u2500\u2500 bank-account.aggregate.ts</span>            <span class="ft-gray">\u2190 rehydrate(), apply(), recordEvent()</span>
<span class="ft-dir">\u2502</span>
<span class="ft-dir">\u251C\u2500\u2500 application/</span>                               <span class="ft-gray">\u2190 Cas d'usage \u2014 orchestration</span>
<span class="ft-dir">\u2502   \u251C\u2500\u2500 commands/</span>
<span class="ft-green">\u2502   \u2502   \u251C\u2500\u2500 deposit-money.command.ts</span>
<span class="ft-green">\u2502   \u2502   \u251C\u2500\u2500 withdraw-money.command.ts</span>
<span class="ft-green">\u2502   \u2502   \u2514\u2500\u2500 create-account.command.ts</span>
<span class="ft-dir">\u2502   \u251C\u2500\u2500 handlers/</span>
<span class="ft-green">\u2502   \u2502   \u251C\u2500\u2500 deposit-money.handler.ts</span>             <span class="ft-gray">\u2190 findById \u2192 deposit \u2192 save</span>
<span class="ft-green">\u2502   \u2502   \u2514\u2500\u2500 withdraw-money.handler.ts</span>
<span class="ft-dir">\u2502   \u2514\u2500\u2500 ports/</span>
<span class="ft-green">\u2502       \u2514\u2500\u2500 event-store.port.ts</span>                  <span class="ft-gray">\u2190 Interface (Port)</span>
<span class="ft-dir">\u2502</span>
<span class="ft-dir">\u251C\u2500\u2500 infrastructure/</span>                            <span class="ft-gray">\u2190 D\u00e9tails techniques</span>
<span class="ft-dir">\u2502   \u251C\u2500\u2500 event-store/</span>
<span class="ft-blue">\u2502   \u2502   \u251C\u2500\u2500 in-memory.event-store.ts</span>             <span class="ft-gray">\u2190 Tests / dev</span>
<span class="ft-blue">\u2502   \u2502   \u251C\u2500\u2500 postgres.event-store.ts</span>              <span class="ft-gray">\u2190 Production</span>
<span class="ft-blue">\u2502   \u2502   \u2514\u2500\u2500 eventstoredb.adapter.ts</span>              <span class="ft-gray">\u2190 EventStoreDB</span>
<span class="ft-dir">\u2502   \u251C\u2500\u2500 projections/</span>
<span class="ft-purple">\u2502   \u2502   \u251C\u2500\u2500 account-balance.projection.ts</span>
<span class="ft-purple">\u2502   \u2502   \u251C\u2500\u2500 transaction-history.projection.ts</span>
<span class="ft-purple">\u2502   \u2502   \u2514\u2500\u2500 fraud-detection.projection.ts</span>
<span class="ft-dir">\u2502   \u2514\u2500\u2500 repositories/</span>
<span class="ft-blue">\u2502       \u2514\u2500\u2500 bank-account.repository.ts</span>           <span class="ft-gray">\u2190 load \u2192 rehydrate \u2192 save</span>
<span class="ft-dir">\u2502</span>
<span class="ft-dir">\u2514\u2500\u2500 presentation/</span>                              <span class="ft-gray">\u2190 API REST / Controllers</span>
<span class="ft-dir">    \u251C\u2500\u2500 controllers/</span>
<span class="ft-orange">\u2502   \u2514\u2500\u2500 bank-account.controller.ts</span>
<span class="ft-dir">    \u2514\u2500\u2500 queries/</span>
<span class="ft-orange">        \u2514\u2500\u2500 get-balance.query.ts</span>                 <span class="ft-gray">\u2190 Lit depuis les projections</span>`

/* ── Sidebar navigation ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'metaphore', label: 'La m\u00e9taphore' },
      { id: 'concepts', label: 'Concepts fondamentaux' },
    ],
  },
  {
    label: 'Event Store',
    links: [
      { id: 'event-store', label: 'Le grand livre immuable' },
      { id: 'architecture', label: 'Vue d\'ensemble' },
    ],
  },
  {
    label: 'Impl\u00e9mentation',
    links: [
      { id: 'impl-oop', label: 'OOP TypeScript' },
      { id: 'impl-fp', label: 'Fonctionnel fp-ts' },
    ],
  },
  {
    label: 'Projections',
    links: [
      { id: 'projections', label: 'Read Models' },
      { id: 'file-structure', label: 'Structure de projet' },
    ],
  },
  {
    label: 'R\u00e9f\u00e9rence',
    links: [
      { id: 'pieges', label: 'Pi\u00e8ges classiques' },
      { id: 'quand', label: 'Quand utiliser ?' },
      { id: 'avantages', label: 'Avantages & Inconv\u00e9nients' },
    ],
  },
]

useHead({
  title: 'Event Sourcing Architecture \u2014 Sourcing par \u00c9v\u00e9nements',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Event Sourcing Architecture \u2014 Sourcing par \u00c9v\u00e9nements',
        description:
          'Guide complet sur l\'Event Sourcing : persistance par \u00e9v\u00e9nements immuables, rehydratation, projections, time travel, impl\u00e9mentations OOP et fonctionnelle en TypeScript.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/event-sourcing-architecture',
        author: {
          '@type': 'Person',
          name: 'Greg Young',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Guide complet sur l\'Event Sourcing : persistance par \u00e9v\u00e9nements immuables, rehydratation, projections, time travel, impl\u00e9mentations OOP et fonctionnelle en TypeScript.',
  ogTitle: 'Event Sourcing Architecture \u2014 Sourcing par \u00c9v\u00e9nements',
  ogDescription:
    'Guide complet sur l\'Event Sourcing : persistance par \u00e9v\u00e9nements immuables, rehydratation, projections, time travel, impl\u00e9mentations OOP et fonctionnelle en TypeScript.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/event-sourcing-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Event Sourcing Architecture \u2014 Sourcing par \u00c9v\u00e9nements',
  twitterDescription:
    'Guide complet sur l\'Event Sourcing : persistance par \u00e9v\u00e9nements immuables, rehydratation, projections, time travel, impl\u00e9mentations OOP et fonctionnelle en TypeScript.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="Event Sourcing<br>Architecture"
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
          <div class="eyebrow">// Event Sourcing Architecture &mdash; R&eacute;f&eacute;rence compl&egrave;te</div>
          <h1>Le <em>Sourcing</em><br>par &Eacute;v&eacute;nements</h1>
          <p class="subtitle">
            Stocker les causes plut&ocirc;t que les effets. Un pattern de persistance o&ugrave;
            l&rsquo;&eacute;tat est reconstitu&eacute; &agrave; partir d&rsquo;un journal
            d&rsquo;&eacute;v&eacute;nements immuables &mdash; Time Travel, Audit complet,
            et projections multiples inclus.
          </p>
          <div class="meta-tags">
            <span class="meta-tag pink">Event Sourcing</span>
            <span class="meta-tag green">TypeScript</span>
            <span class="meta-tag purple">Aggregate</span>
            <span class="meta-tag blue">Event Store</span>
            <span class="meta-tag yellow">Time Travel</span>
            <span class="meta-tag orange">fp-ts</span>
          </div>
        </header>

        <!-- Principe fondateur -->
        <div class="quote-box">
          <div class="quote-icon">&#x1F4D6;</div>
          <div class="quote-content">
            <h3>Le principe fondateur</h3>
            <p>
              &laquo;&nbsp;Le solde de votre compte bancaire n&rsquo;est pas une v&eacute;rit&eacute;&nbsp;:
              c&rsquo;est un calcul. La v&eacute;rit&eacute;, ce sont les transactions.&nbsp;&raquo;
              L&rsquo;Event Sourcing applique ce principe &agrave; l&rsquo;ensemble d&rsquo;un syst&egrave;me&nbsp;:
              <em>ne jamais stocker l&rsquo;&eacute;tat courant directement</em> &mdash; stocker les
              &eacute;v&eacute;nements qui l&rsquo;ont produit. L&rsquo;&eacute;tat n&rsquo;est que la
              <em>somme des causes pass&eacute;es</em>, recalculable &agrave; volont&eacute;,
              &agrave; n&rsquo;importe quel instant.
            </p>
          </div>
        </div>

        <!-- 01 — La metaphore -->
        <section id="metaphore" class="section">
          <div class="section-header">
            <span class="section-number">01</span>
            <h2 class="section-title">La m&eacute;taphore&nbsp;: le grand livre de comptabilit&eacute;</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              Imagine la comptabilit&eacute; d&rsquo;une entreprise. Il y a <strong>deux fa&ccedil;ons</strong>
              de tenir les comptes&nbsp;:
            </p>
            <p>
              <strong>Approche CRUD classique</strong> &mdash; Tu as un fichier avec le solde actuel.
              Hier tu avais 1&nbsp;000&nbsp;&euro;, aujourd&rsquo;hui tu notes 1&nbsp;350&nbsp;&euro;.
              <em>Mais pourquoi&nbsp;? D&rsquo;o&ugrave; viennent ces 350&nbsp;&euro;&nbsp;?</em>
              Impossible &agrave; savoir. Tu ne peux pas auditer, remonter dans le temps, ou
              d&eacute;tecter une erreur de saisie.
            </p>
            <p>
              <strong>Approche Event Sourcing</strong> &mdash; Tu tiens un <em>grand livre</em>
              o&ugrave; chaque ligne est une entr&eacute;e immuable&nbsp;: d&eacute;p&ocirc;t +500&nbsp;&euro;,
              achat -200&nbsp;&euro;, virement +1&nbsp;050&nbsp;&euro;. Le solde actuel de
              1&nbsp;350&nbsp;&euro; n&rsquo;est que la <strong>somme de tous les
              &eacute;v&eacute;nements</strong>. Tu peux reconstruire l&rsquo;&eacute;tat
              &agrave; n&rsquo;importe quel moment, auditer chaque d&eacute;cision, rejouer l&rsquo;histoire.
            </p>
            <p>
              C&rsquo;est exactement l&rsquo;Event Sourcing&nbsp;: <strong>les &eacute;v&eacute;nements
              sont la v&eacute;rit&eacute;. L&rsquo;&eacute;tat est un d&eacute;riv&eacute;.</strong>
            </p>
          </div>

          <div class="comparison">
            <div class="cmp-col">
              <div class="cmp-header bad">&#x26D4; Approche CRUD &mdash; UPDATE balance = 1350</div>
              <div class="cmp-body">
                <div v-for="item in cmpBad" :key="item.text" class="cmp-item">
                  <div class="cmp-dot" style="background:var(--red)" />
                  {{ item.text }}
                </div>
              </div>
            </div>
            <div class="cmp-col">
              <div class="cmp-header good">&#x2705; Approche Event Sourcing &mdash; APPEND event</div>
              <div class="cmp-body">
                <div v-for="item in cmpGood" :key="item.text" class="cmp-item">
                  <div class="cmp-dot" style="background:var(--green)" />
                  {{ item.text }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 02 — Concepts fondamentaux -->
        <section id="concepts" class="section">
          <div class="section-header">
            <span class="section-number">02</span>
            <h2 class="section-title">Les concepts fondamentaux</h2>
            <div class="section-line" />
          </div>

          <div class="cards">
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
              <div v-if="card.quote" class="card-quote">
                {{ card.quote }}
              </div>
            </article>
          </div>
        </section>

        <!-- 03 — L'Event Store -->
        <section id="event-store" class="section">
          <div class="section-header">
            <span class="section-number">03</span>
            <h2 class="section-title">L&rsquo;Event Store &mdash; le grand livre immuable</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              Chaque agr&eacute;gat poss&egrave;de son propre <strong>stream
              d&rsquo;&eacute;v&eacute;nements</strong>. Les &eacute;v&eacute;nements sont
              ordonn&eacute;s, versionn&eacute;s et ne sont <em>jamais modifi&eacute;s
              ni supprim&eacute;s</em>. La version est utilis&eacute;e pour
              l&rsquo;<strong>Optimistic Concurrency Control</strong> &mdash; si deux processus
              tentent d&rsquo;&eacute;crire en m&ecirc;me temps avec la m&ecirc;me version,
              le second est rejet&eacute;.
            </p>
          </div>

          <!-- Timeline des evenements -->
          <div class="event-timeline">
            <div class="timeline-axis">
              <span class="timeline-label">temps &rarr;</span>
              <div class="timeline-line" />
            </div>
            <div class="events-row">
              <div class="event-card created">
                <div class="event-version">VERSION 1 &middot; 2024-01-10</div>
                <div class="event-name">AccountCreated</div>
                <div class="event-field">id: <span>acc-42</span></div>
                <div class="event-field">owner: <span>Alice</span></div>
                <div class="event-field">balance: <span>0 EUR</span></div>
              </div>
              <div class="event-card deposited">
                <div class="event-version">VERSION 2 &middot; 2024-01-12</div>
                <div class="event-name">MoneyDeposited</div>
                <div class="event-field">accountId: <span>acc-42</span></div>
                <div class="event-field">amount: <span>500 EUR</span></div>
                <div class="event-field">desc: <span>Salaire</span></div>
              </div>
              <div class="event-card withdrawn">
                <div class="event-version">VERSION 3 &middot; 2024-01-15</div>
                <div class="event-name">MoneyWithdrawn</div>
                <div class="event-field">accountId: <span>acc-42</span></div>
                <div class="event-field">amount: <span>200 EUR</span></div>
                <div class="event-field">reason: <span>Achat ligne</span></div>
              </div>
              <div class="event-card deposited">
                <div class="event-version">VERSION 4 &middot; 2024-01-20</div>
                <div class="event-name">MoneyDeposited</div>
                <div class="event-field">accountId: <span>acc-42</span></div>
                <div class="event-field">amount: <span>1050 EUR</span></div>
                <div class="event-field">desc: <span>Virement</span></div>
              </div>
              <div class="event-card closed">
                <div class="event-version">VERSION 5 &middot; 2024-03-01</div>
                <div class="event-name">AccountClosed</div>
                <div class="event-field">accountId: <span>acc-42</span></div>
                <div class="event-field">reason: <span>Customer req.</span></div>
                <div class="event-field">finalBalance: <span>1350 EUR</span></div>
              </div>
            </div>
            <div class="immutable-badge">&#x1F512; Jamais modifi&eacute; &middot; Jamais supprim&eacute; &middot; Append-only</div>
          </div>

          <!-- Fold diagram -->
          <div class="prose">
            <p>La reconstitution de l&rsquo;&eacute;tat est un simple <strong>fold</strong>
            (&eacute;quivalent &agrave; <code>Array.reduce()</code>) sur la s&eacute;quence
            des &eacute;v&eacute;nements&nbsp;:</p>
          </div>

          <div class="fold-diagram">
            <div class="fold-state" style="color:var(--muted)">balance: 0<br><span style="font-size:9px;color:var(--muted)">initial</span></div>
            <div class="fold-op"><span class="arr">&rarr;</span><span class="lbl">+500</span></div>
            <div class="fold-state">balance: 500</div>
            <div class="fold-op"><span class="arr">&rarr;</span><span class="lbl">-200</span></div>
            <div class="fold-state">balance: 300</div>
            <div class="fold-op"><span class="arr">&rarr;</span><span class="lbl">+1050</span></div>
            <div class="fold-state final">balance: 1350<br><span style="font-size:9px;color:var(--green)">&eacute;tat courant</span></div>
          </div>

          <div class="rule-banner">
            <strong>La r&egrave;gle du fold&nbsp;:</strong> <code>etat courant = events.reduce(applyEvent, initialState)</code><br>
            Le m&ecirc;me ensemble d&rsquo;&eacute;v&eacute;nements produit <strong>toujours</strong>
            le m&ecirc;me &eacute;tat &mdash; la fonction <code>applyEvent</code> est
            <strong>pure et d&eacute;terministe</strong>.<br>
            C&rsquo;est le coeur math&eacute;matique de l&rsquo;Event Sourcing.
          </div>
        </section>

        <!-- 04 — Vue d'ensemble de l'architecture -->
        <section id="architecture" class="section">
          <div class="section-header">
            <span class="section-number">04</span>
            <h2 class="section-title">Vue d&rsquo;ensemble de l&rsquo;architecture</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              L&rsquo;Event Sourcing s&rsquo;articule autour de quatre zones distinctes&nbsp;:
              les <strong>commandes</strong> (intentions), l&rsquo;<strong>agr&eacute;gat</strong>
              (validation + &eacute;mission), l&rsquo;<strong>Event Store</strong> (persistance
              immuable), et les <strong>projections</strong> (lecture optimis&eacute;e).
            </p>
          </div>

          <!-- Architecture layers diagram -->
          <div class="layers-diagram">
            <div class="layer-row" style="--layer-color: var(--blue);">
              <div class="layer-num">Commands</div>
              <div class="layer-content">
                <div class="layer-title">Commandes &mdash; Les Intentions</div>
                <div class="layer-files">
                  <span class="layer-file lf-blue">CreateAccount</span>
                  <span class="layer-file lf-blue">DepositMoney</span>
                  <span class="layer-file lf-blue">WithdrawMoney</span>
                  <span class="layer-file lf-blue">CloseAccount</span>
                  <span class="layer-file lf-blue">CommandBus / Dispatcher</span>
                </div>
              </div>
            </div>
            <div class="layer-row" style="--layer-color: var(--purple);">
              <div class="layer-num">Aggregate</div>
              <div class="layer-content">
                <div class="layer-title">Agr&eacute;gat &mdash; Validation + &Eacute;mission d&rsquo;&eacute;v&eacute;nements</div>
                <div class="layer-files">
                  <span class="layer-file lf-purple">BankAccount (Aggregate)</span>
                  <span class="layer-file lf-purple">R&egrave;gles m&eacute;tier</span>
                  <span class="layer-file lf-purple">recordEvent()</span>
                  <span class="layer-file lf-purple">applyEvent() &mdash; reducer pur</span>
                  <span class="layer-file lf-purple">rehydrate() &mdash; factory</span>
                </div>
              </div>
            </div>
            <div class="layer-row" style="--layer-color: var(--green);">
              <div class="layer-num">Event Store</div>
              <div class="layer-content">
                <div class="layer-title">Event Store &mdash; Persistence Append-Only</div>
                <div class="layer-files">
                  <span class="layer-file lf-green">append(aggregateId, events, expectedVersion)</span>
                  <span class="layer-file lf-green">loadEvents(aggregateId, fromVersion?)</span>
                  <span class="layer-file lf-green">Optimistic Concurrency Control</span>
                  <span class="layer-file lf-green">Snapshots (optionnel)</span>
                </div>
              </div>
            </div>
            <div class="layer-row" style="--layer-color: var(--orange);">
              <div class="layer-num">Event Bus</div>
              <div class="layer-content">
                <div class="layer-title">Event Bus &mdash; Diffusion aux Projections</div>
                <div class="layer-files">
                  <span class="layer-file lf-orange">publish(event)</span>
                  <span class="layer-file lf-orange">subscribe(eventType, handler)</span>
                  <span class="layer-file lf-orange">Kafka / RabbitMQ / in-process</span>
                </div>
              </div>
            </div>
            <div class="layer-row" style="--layer-color: var(--red);">
              <div class="layer-num">Projections</div>
              <div class="layer-content">
                <div class="layer-title">Projections &mdash; Read Models (CQRS)</div>
                <div class="layer-files">
                  <span class="layer-file lf-pink">AccountBalanceProjection</span>
                  <span class="layer-file lf-pink">TransactionHistoryProjection</span>
                  <span class="layer-file lf-pink">FraudDetectionProjection</span>
                  <span class="layer-file lf-pink">AnalyticsDashboardProjection</span>
                  <span class="layer-file lf-pink">rebuild() &mdash; reconstruire depuis z&eacute;ro</span>
                </div>
              </div>
            </div>
          </div>

          <div class="info-box">
            <strong>Principe cl&eacute;&nbsp;:</strong> Chaque projection &eacute;coute les
            m&ecirc;mes &eacute;v&eacute;nements et construit sa propre repr&eacute;sentation
            optimis&eacute;e pour son besoin de lecture. On peut <strong>supprimer et
            reconstruire</strong> n&rsquo;importe quelle projection &agrave; tout moment en
            rejouant l&rsquo;int&eacute;gralit&eacute; de l&rsquo;Event Store &mdash; sans perte
            de donn&eacute;es.
          </div>
        </section>

        <!-- 05 — Implementation OOP -->
        <section id="impl-oop" class="section">
          <div class="section-header">
            <span class="section-number">05</span>
            <h2 class="section-title">Impl&eacute;mentation OOP &mdash; TypeScript / NestJS</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              L&rsquo;approche orient&eacute;e objet organise le code autour de
              l&rsquo;<strong>agr&eacute;gat</strong> qui encapsule &agrave; la fois la logique
              de validation des commandes, l&rsquo;&eacute;mission d&rsquo;&eacute;v&eacute;nements,
              et l&rsquo;application des &eacute;v&eacute;nements &agrave; l&rsquo;&eacute;tat interne.
            </p>
          </div>

          <div class="code-filename">domain/events/bank-account.events.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block" v-html="codeEvents" />

          <div class="code-filename">domain/aggregates/bank-account.aggregate.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block purple" v-html="codeAggregate" />

          <div class="code-filename">infrastructure/event-store/in-memory.event-store.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block green" v-html="codeEventStore" />
        </section>

        <!-- 06 — Implementation Fonctionnelle -->
        <section id="impl-fp" class="section">
          <div class="section-header">
            <span class="section-number">06</span>
            <h2 class="section-title">Impl&eacute;mentation Fonctionnelle &mdash; fp-ts / Railway</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              L&rsquo;Event Sourcing est <strong>naturellement fonctionnel</strong>&nbsp;: un fold
              est une op&eacute;ration purement fonctionnelle. Avec <code>fp-ts</code>, on
              mod&eacute;lise les commandes comme des fonctions
              <code>State &rarr; Either&lt;Error, Event[]&gt;</code>, ce qui garantit une gestion
              d&rsquo;erreur explicite et composable via le <em>Railway Oriented Programming</em>.
            </p>
          </div>

          <div class="code-filename">domain/bank-account.functional.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block orange" v-html="codeFunctional" />

          <div class="info-box">
            <strong>Railway Oriented Programming&nbsp;:</strong> chaque d&eacute;cision retourne
            un <code>Either&lt;Error, Event[]&gt;</code>. Les erreurs sont des valeurs typ&eacute;es,
            pas des exceptions. La fonction <code>processDeposit</code> compose validation et
            &eacute;mission d&rsquo;&eacute;v&eacute;nements dans un pipeline fonctionnel clair
            et testable.
          </div>
        </section>

        <!-- 07 — Projections -->
        <section id="projections" class="section">
          <div class="section-header">
            <span class="section-number">07</span>
            <h2 class="section-title">Les Projections &mdash; construire les Read Models</h2>
            <div class="section-line" />
          </div>

          <div class="prose">
            <p>
              Les projections sont l&rsquo;une des forces majeures de l&rsquo;Event Sourcing.
              Chaque projection <strong>&eacute;coute le flux d&rsquo;&eacute;v&eacute;nements</strong>
              et maintient sa propre repr&eacute;sentation optimis&eacute;e pour un besoin de lecture
              sp&eacute;cifique. On peut en avoir autant que n&eacute;cessaire &mdash; et on peut
              toutes les <em>supprimer et reconstruire</em> en rejouant l&rsquo;Event Store.
            </p>
          </div>

          <table class="proj-table">
            <thead>
              <tr>
                <th>Projection</th>
                <th>&Eacute;v&eacute;nements &eacute;cout&eacute;s</th>
                <th>Read Model produit</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AccountBalanceProjection</td>
                <td>AccountCreated, MoneyDeposited, MoneyWithdrawn, AccountClosed</td>
                <td><code>Map&lt;accountId, { balance, owner }&gt;</code></td>
                <td>GET /accounts/:id/balance</td>
              </tr>
              <tr>
                <td>TransactionHistoryProjection</td>
                <td>MoneyDeposited, MoneyWithdrawn</td>
                <td>Liste pagin&eacute;e et index&eacute;e de transactions</td>
                <td>GET /accounts/:id/history</td>
              </tr>
              <tr>
                <td>FraudDetectionProjection</td>
                <td>MoneyWithdrawn</td>
                <td>Alertes si &gt; 1000 &euro; en 5 min</td>
                <td>GET /fraud/alerts</td>
              </tr>
              <tr>
                <td>AnalyticsDashboardProjection</td>
                <td>Tous les &eacute;v&eacute;nements</td>
                <td>Agr&eacute;gats statistiques, KPIs</td>
                <td>GET /analytics/summary</td>
              </tr>
            </tbody>
          </table>

          <div class="code-filename">infrastructure/projections/account-balance.projection.ts</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="code-block pink" v-html="codeProjection" />
        </section>

        <!-- 08 — Structure de fichiers -->
        <section id="file-structure" class="section">
          <div class="section-header">
            <span class="section-number">08</span>
            <h2 class="section-title">Structure de projet NestJS recommand&eacute;e</h2>
            <div class="section-line" />
          </div>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="file-tree" v-html="fileTreeHtml" />
        </section>

        <!-- 09 — Pieges classiques -->
        <section id="pieges" class="section">
          <div class="section-header">
            <span class="section-number">09</span>
            <h2 class="section-title">Les pi&egrave;ges classiques</h2>
            <div class="section-line" />
          </div>

          <div class="cards cards-3col">
            <article
              v-for="card in piegeCards"
              :key="card.name"
              class="card"
              :class="card.colorClass"
            >
              <span class="card-icon">{{ card.icon }}</span>
              <div class="card-name">{{ card.name }}</div>
              <div class="card-title">{{ card.title }}</div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="card-desc" v-html="card.description" />
              <div v-if="card.quote" class="card-quote">
                {{ card.quote }}
              </div>
            </article>
          </div>
        </section>

        <!-- 10 — Quand utiliser -->
        <section id="quand" class="section">
          <div class="section-header">
            <span class="section-number">10</span>
            <h2 class="section-title">Quand utiliser l&rsquo;Event Sourcing&nbsp;?</h2>
            <div class="section-line" />
          </div>

          <table class="decision-table">
            <thead>
              <tr>
                <th>Crit&egrave;re</th>
                <th>Description</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in decisionRows" :key="row.critere">
                <td><strong>{{ row.critere }}</strong></td>
                <td>{{ row.description }}</td>
                <td><span :class="row.verdict.cssClass">{{ row.verdict.text }}</span></td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 11 — Avantages & Inconvenients -->
        <section id="avantages" class="section">
          <div class="section-header">
            <span class="section-number">11</span>
            <h2 class="section-title">Avantages &amp; Inconv&eacute;nients</h2>
            <div class="section-line" />
          </div>

          <div class="comparison">
            <div class="cmp-col">
              <div class="cmp-header bad">Inconv&eacute;nients &amp; Complexit&eacute;</div>
              <div class="cmp-body">
                <div v-for="item in inconvenients" :key="item.text" class="cmp-item">
                  <div class="cmp-dot" style="background:var(--red)" />
                  {{ item.text }}
                </div>
              </div>
            </div>
            <div class="cmp-col">
              <div class="cmp-header good">Avantages &amp; Puissance</div>
              <div class="cmp-body">
                <div v-for="item in avantages" :key="item.text" class="cmp-item">
                  <div class="cmp-dot" style="background:var(--green)" />
                  {{ item.text }}
                </div>
              </div>
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
.meta-tag.pink   { color: var(--red);    background: rgba(232,74,122,0.08);  border: 1px solid rgba(232,74,122,0.2); }

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

/* Comparison */
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

.cmp-header.bad  { color: var(--red);   background: rgba(232,74,122,0.06); }
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

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 8px;
}
.cards-3col { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

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
.card-desc :deep(em) { color: var(--accent); font-style: italic; }

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
  white-space: pre-line;
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

.code-block :deep(.cm)  { color: #6a7090; font-style: italic; }
.code-block :deep(.kw)  { color: #a78bfa; }
.code-block :deep(.fn)  { color: #4ae8b0; }
.code-block :deep(.str) { color: #e8c84a; }
.code-block :deep(.ty)  { color: #4a9ee8; }
.code-block :deep(.op)  { color: #e84a7a; }
.code-block :deep(.num) { color: #fb923c; }
.code-block :deep(.hl)  { color: var(--white); }

.code-block.purple { border-left-color: var(--purple); }
.code-block.green  { border-left-color: var(--green); }
.code-block.blue   { border-left-color: var(--blue); }
.code-block.orange { border-left-color: var(--orange); }
.code-block.pink   { border-left-color: var(--red); }

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

/* Event timeline */
.event-timeline {
  margin: 40px 0;
  position: relative;
  padding-bottom: 20px;
}

.timeline-axis {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 12px;
  padding: 0 10px;
}

.timeline-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-right: 12px;
  flex-shrink: 0;
}

.timeline-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, var(--border), var(--accent2), transparent);
  position: relative;
}

.timeline-line::after {
  content: '\25B6';
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent2);
  font-size: 10px;
}

.events-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 4px 12px;
}

.event-card {
  flex-shrink: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 18px;
  min-width: 175px;
  position: relative;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--ev-color, var(--green));
  border-radius: 8px 8px 0 0;
}

.event-version {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.12em;
  margin-bottom: 6px;
}

.event-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--ev-color, var(--green));
  margin-bottom: 10px;
}

.event-field {
  font-size: 0.72rem;
  color: var(--muted);
  line-height: 1.7;
  font-family: 'IBM Plex Mono', monospace;
}

.event-field span { color: var(--text); }

.event-card.closed    { --ev-color: var(--red); }
.event-card.deposited { --ev-color: var(--green); }
.event-card.withdrawn { --ev-color: var(--orange); }
.event-card.created   { --ev-color: var(--blue); }

.immutable-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--red);
  border: 1px solid rgba(232,74,122,0.3);
  background: rgba(232,74,122,0.06);
  padding: 4px 12px;
  border-radius: 3px;
  margin-top: 16px;
}

/* Fold diagram */
.fold-diagram {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  margin: 32px 0;
  padding: 20px 0 8px;
}

.fold-state {
  flex-shrink: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent);
  text-align: center;
  min-width: 110px;
}

.fold-state.final {
  border-color: var(--green);
  color: var(--green);
  background: rgba(74,232,176,0.06);
}

.fold-op {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.fold-op .arr { font-size: 1.2rem; color: var(--accent2); }
.fold-op .lbl {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  white-space: nowrap;
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

.lf-green  { color: #4ae8b0; border-color: rgba(74,232,176,0.25);  background: rgba(74,232,176,0.06); }
.lf-purple { color: #a78bfa; border-color: rgba(167,139,250,0.25); background: rgba(167,139,250,0.06); }
.lf-blue   { color: #4a9ee8; border-color: rgba(74,158,232,0.25);  background: rgba(74,158,232,0.06); }
.lf-orange { color: #e87a4a; border-color: rgba(232,122,74,0.25);  background: rgba(232,122,74,0.06); }
.lf-yellow { color: #e8c84a; border-color: rgba(232,200,74,0.25);  background: rgba(232,200,74,0.06); }
.lf-pink   { color: #e84a7a; border-color: rgba(232,74,122,0.25);  background: rgba(232,74,122,0.06); }

/* Projection table */
.proj-table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 0.82rem;
}

.proj-table th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: rgba(0,0,0,0.2);
  text-align: left;
}

.proj-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  vertical-align: top;
  line-height: 1.5;
}

.proj-table tr:last-child td { border-bottom: none; }
.proj-table tr:hover td { background: rgba(255,255,255,0.02); }

.proj-table td:first-child {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent);
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

.file-tree :deep(.ft-dir)    { color: var(--accent); }
.file-tree :deep(.ft-gray)   { color: var(--muted); }
.file-tree :deep(.ft-green)  { color: #4ae8b0; }
.file-tree :deep(.ft-purple) { color: #a78bfa; }
.file-tree :deep(.ft-blue)   { color: #4a9ee8; }
.file-tree :deep(.ft-orange) { color: #e87a4a; }
.file-tree :deep(.ft-yellow) { color: #e8c84a; }
.file-tree :deep(.ft-pink)   { color: #e84a7a; }

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

.badge-ok   { background: rgba(74,232,176,0.12);  color: var(--green);  border: 1px solid rgba(74,232,176,0.3); }
.badge-warn { background: rgba(232,200,74,0.12);  color: var(--accent); border: 1px solid rgba(232,200,74,0.3); }
.badge-bad  { background: rgba(232,74,122,0.12);  color: var(--red);    border: 1px solid rgba(232,74,122,0.3); }

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
.card:nth-child(4) { animation-delay: 0.20s; }
.card:nth-child(5) { animation-delay: 0.25s; }
.card:nth-child(6) { animation-delay: 0.30s; }

/* Responsive */
@media (max-width: 900px) {
  .main { margin-left: 0; }
  .cards-3col { grid-template-columns: 1fr; }
  .comparison { grid-template-columns: 1fr; }
  h1 { font-size: 2.2rem; }
}

@media (max-width: 640px) {
  .content { padding: 32px 20px 80px; }
}
</style>
