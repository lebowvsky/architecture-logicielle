<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (variant cards, comparison table rows, decision cards)
 *          are modeled as typed arrays and rendered via v-for, while unique prose, diagrams,
 *          layers stack, flow diagram, and file tree stay as direct template markup.
 */

interface VariantCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
}

interface CompTableRow {
  criterion: string
  evaluation: string
  evalClass: string
  comment: string
}

interface DecisionCard {
  colorClass: string
  name: string
  title: string
  tags: string[]
}

const variantCards: VariantCard[] = [
  {
    icon: '\u{1F7E0}',
    colorClass: 'orange',
    name: '2-Tier',
    title: 'Client \u2014 Serveur',
    description:
      'L\u2019application est divis\u00e9e en deux parties\u00a0: un <strong>client lourd</strong> (desktop, WinForms) qui contient la logique m\u00e9tier et la pr\u00e9sentation, et un <strong>serveur de base de donn\u00e9es</strong> qui g\u00e8re la persistance. Les stored procedures vivent c\u00f4t\u00e9 serveur. Simple mais couplage fort entre UI et m\u00e9tier.',
    tags: ['Legacy', 'Desktop Apps', 'Stored Procs'],
  },
  {
    icon: '\u{1F7E2}',
    colorClass: 'green',
    name: '3-Tier',
    title: 'Pr\u00e9sentation \u2014 M\u00e9tier \u2014 Donn\u00e9es',
    description:
      'Le mod\u00e8le le plus r\u00e9pandu. Un <strong>serveur web</strong> (pr\u00e9sentation), un <strong>serveur applicatif</strong> (logique m\u00e9tier) et un <strong>serveur de donn\u00e9es</strong>. Chaque tier peut \u00eatre d\u00e9ploy\u00e9 sur une machine s\u00e9par\u00e9e. C\u2019est le standard de l\u2019industrie depuis les ann\u00e9es 2000.',
    tags: ['Web classique', 'Java EE', 'ASP.NET', 'PHP MVC'],
  },
  {
    icon: '\u{1F7E3}',
    colorClass: 'purple',
    name: 'N-Tier',
    title: 'Extension \u00e0 N couches',
    description:
      'Au-del\u00e0 de 3 couches\u00a0: on ajoute une <strong>couche de services</strong> (API Gateway, orchestration), une <strong>couche d\u2019int\u00e9gration</strong> (messaging, ESB) ou une <strong>couche de cache</strong>. Chaque couche suppl\u00e9mentaire ajoute de l\u2019abstraction \u2014 et de l\u2019indirection.',
    tags: ['Enterprise', 'Service Layer', 'Integration', 'Cache Layer'],
  },
  {
    icon: '\u{1F535}',
    colorClass: 'blue',
    name: 'Strict vs Relaxed',
    title: 'Layered strict ou ouvert',
    description:
      'En mode <strong>strict</strong>, chaque couche ne peut appeler que la couche imm\u00e9diatement inf\u00e9rieure (N \u2192 N-1). En mode <strong>relaxed</strong>, une couche peut sauter des niveaux (Pr\u00e9sentation \u2192 DAL directement). Le pragmatisme impose souvent un mix des deux.',
    tags: ['Strict', 'Relaxed', 'Pragmatisme'],
  },
]

const compTableRows: CompTableRow[] = [
  {
    criterion: 'Compr\u00e9hension',
    evaluation: '\u2713 Excellent',
    evalClass: 'good',
    comment:
      'Tout d\u00e9veloppeur comprend instinctivement la s\u00e9paration en couches. Pas besoin de formation sp\u00e9cifique.',
  },
  {
    criterion: 'S\u00e9paration des concerns',
    evaluation: '\u2713 Bon',
    evalClass: 'good',
    comment:
      'Chaque couche a un r\u00f4le d\u00e9fini. La pr\u00e9sentation ne touche pas la DB, la DB ne conna\u00eet pas l\u2019UI.',
  },
  {
    criterion: 'Testabilit\u00e9',
    evaluation: '~ Moyen',
    evalClass: 'neutral',
    comment:
      'La couche Business est testable si elle ne d\u00e9pend que d\u2019interfaces. Souvent, elle d\u00e9pend directement du DAL concret.',
  },
  {
    criterion: '\u00c9volutivit\u00e9',
    evaluation: '~ Moyen',
    evalClass: 'neutral',
    comment:
      'Facile d\u2019ajouter des fonctionnalit\u00e9s horizontalement. Difficile de refactorer verticalement (changer le mod\u00e8le de donn\u00e9es).',
  },
  {
    criterion: 'Performance',
    evaluation: '~ Moyen',
    evalClass: 'neutral',
    comment:
      'Chaque couche est un niveau d\u2019indirection. Le mapping entre couches a un co\u00fbt, mais n\u00e9gligeable dans la majorit\u00e9 des cas.',
  },
  {
    criterion: 'Scalabilit\u00e9',
    evaluation: '\u2717 Limit\u00e9',
    evalClass: 'bad',
    comment:
      'Architecture typiquement monolithique. On scale tout le syst\u00e8me ou rien. Impossible de scaler une couche ind\u00e9pendamment.',
  },
  {
    criterion: 'Couplage DB \u2192 M\u00e9tier',
    evaluation: '\u2717 Probl\u00e8me',
    evalClass: 'bad',
    comment:
      'Uncle Bob\u00a0: le sch\u00e9ma DB risque de \u00ab\u00a0dicter\u00a0\u00bb la structure des entit\u00e9s m\u00e9tier. Le probl\u00e8me fondamental de l\u2019architecture en couches.',
  },
  {
    criterion: 'Adapt\u00e9 pour',
    evaluation: '\u2713 CRUD apps',
    evalClass: 'good',
    comment:
      'Applications de gestion, back-offices, APIs REST classiques. Le pattern id\u00e9al quand la logique m\u00e9tier est simple.',
  },
]

const decisionCards: DecisionCard[] = [
  {
    colorClass: 'green',
    name: 'Bon choix si\u2026',
    title: 'Utilisez Layered quand',
    tags: ['CRUD', 'Petite \u00e9quipe', 'MVP rapide', 'Back-office'],
  },
  {
    colorClass: 'pink',
    name: 'Attention si\u2026',
    title: '\u00c9vitez Layered quand',
    tags: ['DDD complexe', 'Microservices', 'Haute testabilit\u00e9'],
  },
]

const fileTreeHtml = `<span class="ft-gray">src/</span>
<span class="ft-orange">\u251C\u2500\u2500 presentation/</span>                <span class="ft-gray">\u2190 Couche 01 \u2014 Controllers, DTOs, Middlewares</span>
<span class="ft-orange">\u2502   \u251C\u2500\u2500 controllers/</span>
<span class="ft-orange">\u2502   \u2502   \u2514\u2500\u2500 OrderController.ts</span>    <span class="ft-gray">// POST /orders \u2192 appelle OrderService</span>
<span class="ft-orange">\u2502   \u251C\u2500\u2500 dto/</span>
<span class="ft-orange">\u2502   \u2502   \u251C\u2500\u2500 CreateOrderDto.ts</span>       <span class="ft-gray">// Validation des inputs (class-validator)</span>
<span class="ft-orange">\u2502   \u2502   \u2514\u2500\u2500 OrderResponseDto.ts</span>     <span class="ft-gray">// Shape de la r\u00e9ponse JSON</span>
<span class="ft-orange">\u2502   \u2514\u2500\u2500 middlewares/</span>
<span class="ft-orange">\u2502       \u2514\u2500\u2500 AuthMiddleware.ts</span>        <span class="ft-gray">// JWT guard</span>
\u2502
<span class="ft-purple">\u251C\u2500\u2500 business/</span>                       <span class="ft-gray">\u2190 Couche 02 \u2014 R\u00e8gles m\u00e9tier pures</span>
<span class="ft-purple">\u2502   \u251C\u2500\u2500 services/</span>
<span class="ft-purple">\u2502   \u2502   \u2514\u2500\u2500 OrderService.ts</span>         <span class="ft-gray">// createOrder() \u2014 orchestration m\u00e9tier</span>
<span class="ft-purple">\u2502   \u251C\u2500\u2500 entities/</span>
<span class="ft-purple">\u2502   \u2502   \u2514\u2500\u2500 Order.ts</span>                <span class="ft-gray">// Entit\u00e9 m\u00e9tier (pas un entity TypeORM ici)</span>
<span class="ft-purple">\u2502   \u2514\u2500\u2500 validators/</span>
<span class="ft-purple">\u2502       \u2514\u2500\u2500 StockValidator.ts</span>        <span class="ft-gray">// "Le stock est-il suffisant ?"</span>
\u2502
<span class="ft-green">\u251C\u2500\u2500 data-access/</span>                    <span class="ft-gray">\u2190 Couche 03 \u2014 Acc\u00e8s aux donn\u00e9es</span>
<span class="ft-green">\u2502   \u251C\u2500\u2500 repositories/</span>
<span class="ft-green">\u2502   \u2502   \u251C\u2500\u2500 OrderRepository.ts</span>      <span class="ft-gray">// save() findById() findByUser()</span>
<span class="ft-green">\u2502   \u2502   \u2514\u2500\u2500 ProductRepository.ts</span>    <span class="ft-gray">// findById() decrementStock()</span>
<span class="ft-green">\u2502   \u2514\u2500\u2500 entities/</span>
<span class="ft-green">\u2502       \u2514\u2500\u2500 OrderEntity.ts</span>          <span class="ft-gray">// @Entity() TypeORM \u2014 mapping DB</span>
\u2502
<span class="ft-blue">\u2514\u2500\u2500 database/</span>                       <span class="ft-gray">\u2190 Couche 04 \u2014 Config DB, migrations</span>
<span class="ft-blue">    \u251C\u2500\u2500 migrations/</span>
<span class="ft-blue">    \u2502   \u2514\u2500\u2500 001_create_orders.ts</span>
<span class="ft-blue">    \u2514\u2500\u2500 database.module.ts</span>           <span class="ft-gray">// TypeORM config, connection pool</span>`

useHead({
  title: 'Architecture Layered / N-Tier \u2014 En Couches',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Architecture Layered / N-Tier \u2014 En Couches',
        description:
          'Architecture Layered (en couches) / N-Tier : les 4 couches fondamentales, flux d\u2019une requ\u00eate, structure TypeScript/NestJS, critique d\u2019Uncle Bob, variantes 2-Tier/3-Tier/N-Tier et bilan objectif.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/layered-architecture',
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
    'Architecture Layered (en couches) / N-Tier : les 4 couches fondamentales, flux d\u2019une requ\u00eate, structure TypeScript/NestJS, critique d\u2019Uncle Bob, variantes 2-Tier/3-Tier/N-Tier et bilan objectif.',
  ogTitle: 'Architecture Layered / N-Tier \u2014 En Couches',
  ogDescription:
    'Architecture Layered (en couches) / N-Tier : les 4 couches fondamentales, flux d\u2019une requ\u00eate, structure TypeScript/NestJS, critique d\u2019Uncle Bob, variantes 2-Tier/3-Tier/N-Tier et bilan objectif.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/layered-architecture',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Architecture Layered / N-Tier \u2014 En Couches',
  twitterDescription:
    'Architecture Layered (en couches) / N-Tier : les 4 couches fondamentales, flux d\u2019une requ\u00eate, structure TypeScript/NestJS, critique d\u2019Uncle Bob, variantes 2-Tier/3-Tier/N-Tier et bilan objectif.',
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
      <div class="eyebrow">// Architecture Logicielle &mdash; D&eacute;tail</div>
      <h1>Architecture <em>Layered</em><br>N-Tier / En Couches</h1>
      <p class="subtitle">
        L&rsquo;architecture la plus r&eacute;pandue dans l&rsquo;industrie &mdash; et la plus mal
        comprise. S&eacute;paration horizontale des responsabilit&eacute;s, mais attention aux
        pi&egrave;ges que pointe Uncle Bob.
      </p>
    </header>

    <!-- Section 01 : La metaphore -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La m&eacute;taphore : le restaurant gastronomique</h2>
        <div class="section-line" />
      </div>

      <div class="metaphore-block">
        <div class="meta-emoji">&#x1F37D;&#xFE0F;</div>
        <div class="meta-content">
          <h3>Chaque brigade a son r&ocirc;le &mdash; et ne touche pas aux autres</h3>
          <p>
            Imagine un <strong>restaurant gastronomique</strong>. La <em>salle</em> accueille les
            clients et prend les commandes &mdash; c&rsquo;est la <strong>couche de
            Pr&eacute;sentation</strong>. Le <em>chef</em> en cuisine d&eacute;cide des recettes, des
            temps de cuisson, de l&rsquo;assaisonnement &mdash; c&rsquo;est la <strong>couche de
            Logique M&eacute;tier</strong>. Le <em>garde-manger</em> g&egrave;re les stocks, les
            commandes fournisseurs, le rangement &mdash; c&rsquo;est la <strong>couche d&rsquo;Acc&egrave;s
            aux Donn&eacute;es</strong>. Et la <em>chambre froide</em> stocke les ingr&eacute;dients
            bruts &mdash; c&rsquo;est la <strong>Base de Donn&eacute;es</strong>.
          </p>
          <p>
            Le serveur ne va jamais directement en chambre froide. Il passe par le chef, qui passe par
            le garde-manger. Chacun a sa responsabilit&eacute;, et les d&eacute;pendances ne
            s&rsquo;&eacute;coulent que dans un seul sens &mdash; du haut vers le bas.
          </p>
          <p>
            Si le restaurant change de fournisseur de viande (la base de donn&eacute;es change), le
            chef adapte peut-&ecirc;tre ses recettes, mais le serveur ne le sait m&ecirc;me pas. Et
            si un client veut commander en japonais au lieu de fran&ccedil;ais (changement d&rsquo;UI),
            la cuisine ne change rien.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 02 : Les 4 couches fondamentales -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Les 4 couches fondamentales</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          L&rsquo;architecture Layered organise le code en <strong>couches horizontales
          empil&eacute;es</strong>. Chaque couche a une responsabilit&eacute; unique et ne communique
          qu&rsquo;avec la couche imm&eacute;diatement inf&eacute;rieure. C&rsquo;est la
          s&eacute;paration des pr&eacute;occupations la plus intuitive qui existe.
        </p>
      </div>

      <!-- Layers stack diagram -->
      <div class="layers-stack">
        <!-- Layer 1 - Presentation -->
        <div class="layer-band l1">
          <div class="band-num">Layer 01</div>
          <div class="band-icon">&#x1F5A5;&#xFE0F;</div>
          <div class="band-body">
            <div class="band-title">Presentation Layer &mdash; Couche de Pr&eacute;sentation</div>
            <div class="band-sub">
              Interface avec l&rsquo;utilisateur. Re&ccedil;oit les requ&ecirc;tes, affiche les
              r&eacute;ponses. Ne contient aucune logique m&eacute;tier.
            </div>
            <div class="band-chips">
              <span class="chip">HTML / CSS</span>
              <span class="chip">React / Vue</span>
              <span class="chip">REST Controllers</span>
              <span class="chip">GraphQL Resolvers</span>
              <span class="chip">CLI</span>
              <span class="chip">MVC Views</span>
            </div>
          </div>
          <div class="band-arrow">
            <div class="arrow-down">
              <span class="arr-label">appelle</span>
              <span class="arr-sym">&darr;</span>
            </div>
          </div>
        </div>

        <!-- Layer 2 - Business Logic -->
        <div class="layer-band l2">
          <div class="band-num">Layer 02</div>
          <div class="band-icon">&#x2699;&#xFE0F;</div>
          <div class="band-body">
            <div class="band-title">Business Logic Layer &mdash; Couche M&eacute;tier (BLL)</div>
            <div class="band-sub">
              Le c&oelig;ur du syst&egrave;me. Contient les r&egrave;gles m&eacute;tier, les calculs,
              les validations et les workflows. Ne conna&icirc;t ni l&rsquo;UI ni la base de
              donn&eacute;es.
            </div>
            <div class="band-chips">
              <span class="chip">Services</span>
              <span class="chip">Use Cases</span>
              <span class="chip">Validators</span>
              <span class="chip">Domain Objects</span>
              <span class="chip">Workflow Engine</span>
            </div>
          </div>
          <div class="band-arrow">
            <div class="arrow-down">
              <span class="arr-label">appelle</span>
              <span class="arr-sym">&darr;</span>
            </div>
          </div>
        </div>

        <!-- Layer 3 - Data Access -->
        <div class="layer-band l3">
          <div class="band-num">Layer 03</div>
          <div class="band-icon">&#x1F4C2;</div>
          <div class="band-body">
            <div class="band-title">Data Access Layer &mdash; Couche d&rsquo;Acc&egrave;s aux Donn&eacute;es (DAL)</div>
            <div class="band-sub">
              Abstraction de la persistance. Expose des m&eacute;thodes CRUD simples &agrave; la
              couche m&eacute;tier. Cache les d&eacute;tails SQL, ORM et requ&ecirc;tes.
            </div>
            <div class="band-chips">
              <span class="chip">Repository</span>
              <span class="chip">DAO</span>
              <span class="chip">ORM (TypeORM / Hibernate)</span>
              <span class="chip">Query Builder</span>
              <span class="chip">Cache</span>
            </div>
          </div>
          <div class="band-arrow">
            <div class="arrow-down">
              <span class="arr-label">appelle</span>
              <span class="arr-sym">&darr;</span>
            </div>
          </div>
        </div>

        <!-- Layer 4 - Database -->
        <div class="layer-band l4">
          <div class="band-num">Layer 04</div>
          <div class="band-icon">&#x1F5C4;&#xFE0F;</div>
          <div class="band-body">
            <div class="band-title">Database Layer &mdash; Couche de Persistance</div>
            <div class="band-sub">
              Le stockage des donn&eacute;es. SQL, NoSQL, fichiers, services externes. Ne contient
              aucune logique applicative &mdash; uniquement des donn&eacute;es.
            </div>
            <div class="band-chips">
              <span class="chip">PostgreSQL</span>
              <span class="chip">MySQL</span>
              <span class="chip">MongoDB</span>
              <span class="chip">Redis</span>
              <span class="chip">S3</span>
              <span class="chip">Elasticsearch</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rule banner -->
      <div class="rule-banner">
        <strong>R&egrave;gle fondamentale&nbsp;:</strong> Les d&eacute;pendances ne
        s&rsquo;&eacute;coulent que dans un seul sens &mdash; de la couche haute vers la couche
        basse. La couche N peut appeler la couche N-1, jamais la couche N+1.
      </div>
    </section>

    <!-- Section 03 : Flux d'une requete -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">Flux d&rsquo;une requ&ecirc;te &mdash; du navigateur &agrave; la DB</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Suivons une requ&ecirc;te <strong>POST /orders</strong> de bout en bout, couche par
          couche. Chaque &eacute;tape montre comment la responsabilit&eacute; est d&eacute;l&eacute;gu&eacute;e
          vers le bas &mdash; et comment la r&eacute;ponse remonte.
        </p>
      </div>

      <!-- Flow diagram -->
      <div class="flow-diagram">
        <div class="flow-node fn-l1">
          &#x1F5B1;&#xFE0F; POST /orders &mdash; Requ&ecirc;te HTTP du navigateur
          <span class="fn-sub">Le Controller re&ccedil;oit la requ&ecirc;te et la valide</span>
        </div>

        <div class="flow-arrow">
          <div class="flow-arrow-line" />
          appelle
          <div class="flow-arrow-line" />
        </div>

        <div class="flow-node fn-l2">
          &#x2699;&#xFE0F; OrderService.createOrder(dto)
          <span class="fn-sub">V&eacute;rifie le stock, applique les remises, calcule la TVA</span>
        </div>

        <div class="flow-arrow">
          <div class="flow-arrow-line" />
          appelle
          <div class="flow-arrow-line" />
        </div>

        <div class="flow-node fn-l3">
          &#x1F4C2; OrderRepository.save(order)
          <span class="fn-sub">Traduit l&rsquo;entit&eacute; en SQL INSERT, g&egrave;re la transaction</span>
        </div>

        <div class="flow-arrow">
          <div class="flow-arrow-line" />
          ex&eacute;cute
          <div class="flow-arrow-line" />
        </div>

        <div class="flow-node fn-db">
          &#x1F5C4;&#xFE0F; INSERT INTO orders VALUES (...)
          <span class="fn-sub">PostgreSQL persiste l&rsquo;enregistrement</span>
        </div>

        <div class="flow-arrow flow-arrow-return">
          <div class="flow-arrow-line" />
          retour
          <div class="flow-arrow-line" />
        </div>

        <div class="flow-node fn-l1" style="opacity:0.7;">
          &#x2705; HTTP 201 &mdash; { orderId: &quot;abc-123&quot;, status: &quot;confirmed&quot; }
          <span class="fn-sub">La r&eacute;ponse remonte couche par couche</span>
        </div>
      </div>
    </section>

    <!-- Section 04 : Structure concrete -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">Structure concr&egrave;te &mdash; TypeScript / NestJS</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Voici comment les 4 couches se traduisent en une <strong>structure de fichiers
          concr&egrave;te</strong> dans un projet TypeScript avec NestJS. Chaque dossier correspond
          &agrave; une couche, et les d&eacute;pendances ne pointent que vers le bas.
        </p>
      </div>

      <!-- File tree -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="file-tree" v-html="fileTreeHtml" />
    </section>

    <!-- Section 05 : La critique d'Uncle Bob -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">La critique d&rsquo;Uncle Bob &mdash; le pi&egrave;ge du sch&eacute;ma DB</h2>
        <div class="section-line" />
      </div>

      <!-- Quote box -->
      <div class="quote-box">
        <div class="quote-icon">&#x1F4D6;</div>
        <div class="quote-content">
          <h3>Robert C. Martin &mdash; Clean Architecture (2017)</h3>
          <p>
            &laquo;&nbsp;Les d&eacute;tails doivent d&eacute;pendre des politiques, jamais
            l&rsquo;inverse. Dans une architecture en couches classique, la couche m&eacute;tier
            d&eacute;pend directement de la couche d&rsquo;acc&egrave;s aux donn&eacute;es &mdash; ce
            qui signifie que le <em>sch&eacute;ma de la base de donn&eacute;es dicte la structure
            des entit&eacute;s m&eacute;tier</em>. C&rsquo;est exactement l&rsquo;inverse de ce
            qu&rsquo;il faudrait.&nbsp;&raquo;
          </p>
        </div>
      </div>

      <div class="prose">
        <p>
          Dans une architecture Layered classique, les d&eacute;pendances pointent
          <strong>vers le bas</strong>&nbsp;: la Pr&eacute;sentation d&eacute;pend du M&eacute;tier,
          qui d&eacute;pend de l&rsquo;Acc&egrave;s aux Donn&eacute;es, qui d&eacute;pend de la
          Database. Le probl&egrave;me&nbsp;? <em>La couche la plus volatile (la DB) se retrouve
          &agrave; la base de tout le syst&egrave;me.</em>
        </p>
      </div>

      <!-- Dep flow -->
      <div class="dep-flow">
        <div class="dep-node" style="color:#e87a4a;border-color:rgba(232,122,74,0.4);background:rgba(232,122,74,0.08);">
          Presentation
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#a78bfa;border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.08);">
          Business
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#4ae8b0;border-color:rgba(74,232,176,0.4);background:rgba(74,232,176,0.08);">
          Data Access
        </div>
        <div class="dep-arrow-h">
          <span class="arr" style="color:#4ae8b0;">&rarr;</span>
          <span class="arr-txt">d&eacute;pend de</span>
        </div>
        <div class="dep-node" style="color:#4a9ee8;border-color:rgba(74,158,232,0.4);background:rgba(74,158,232,0.08);">
          Database
        </div>
      </div>

      <!-- Problem banner -->
      <div class="problem-banner">
        <h4>&#x26A0;&#xFE0F; Le probl&egrave;me concret</h4>
        <p>
          Si le DBA modifie une colonne dans la table <code>orders</code>, le changement cascade
          &agrave; travers <strong>toutes les couches</strong>&nbsp;: l&rsquo;entity ORM change, le
          repository change, le service change, le DTO change, le controller change. Une modification
          de <em>d&eacute;tail technique</em> (la DB) force une modification de <em>politique
          m&eacute;tier</em> &mdash; exactement ce qu&rsquo;Uncle Bob interdit.
        </p>
      </div>

      <div class="prose">
        <p>
          La solution d&rsquo;Uncle Bob&nbsp;? L&rsquo;<strong>inversion de
          d&eacute;pendance (DIP)</strong>. La couche m&eacute;tier ne d&eacute;pend plus de la
          couche d&rsquo;acc&egrave;s aux donn&eacute;es &mdash; elle d&eacute;finit une
          <em>interface</em> que la couche DAL viendra impl&eacute;menter. C&rsquo;est le principe
          fondateur de la Clean Architecture, de l&rsquo;Hexagonale, et de l&rsquo;Onion
          Architecture.
        </p>
      </div>
    </section>

    <!-- Section 06 : Variantes -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Variantes &mdash; 2-Tier, 3-Tier, N-Tier</h2>
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

    <!-- Section 07 : Avantages & Limites -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">Avantages &amp; Limites &mdash; Bilan objectif</h2>
        <div class="section-line" />
      </div>

      <table class="comp-table">
        <thead>
          <tr>
            <th>Crit&egrave;re</th>
            <th>&Eacute;valuation</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in compTableRows"
            :key="row.criterion"
          >
            <td>{{ row.criterion }}</td>
            <td :class="row.evalClass">{{ row.evaluation }}</td>
            <td>{{ row.comment }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Section 08 : Quand l'utiliser -->
    <section class="section">
      <div class="section-header">
        <span class="section-number">08</span>
        <h2 class="section-title">Quand l&rsquo;utiliser &mdash; et quand passer &agrave; autre chose</h2>
        <div class="section-line" />
      </div>

      <div class="cards">
        <article
          v-for="card in decisionCards"
          :key="card.name"
          class="card"
          :class="card.colorClass"
        >
          <div class="card-name">{{ card.name }}</div>
          <div class="card-title">{{ card.title }}</div>
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

      <div class="info-box">
        <strong>Bonne pratique&nbsp;:</strong> M&ecirc;me dans une architecture Layered, appliquez
        le <strong>Dependency Inversion Principle (DIP)</strong>. Faites d&eacute;pendre la couche
        m&eacute;tier d&rsquo;interfaces (et non d&rsquo;impl&eacute;mentations concr&egrave;tes).
        Vous obtiendrez les b&eacute;n&eacute;fices de la testabilit&eacute; de la Clean Architecture
        sans la complexit&eacute; structurelle compl&egrave;te.
      </div>
    </section>

    <!-- Footer -->
    <footer class="page-footer">
      <span>// LAYERED ARCHITECTURE &mdash; N-TIER</span>
      <span>R&eacute;f&eacute;rence : <em>Clean Architecture</em> &mdash; Robert C. Martin (2017)</span>
    </footer>
  </div>
</template>

<style scoped>
/* Container */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 32px 100px;
  position: relative;
  z-index: 1;
}

/* Back link */
nav { margin-bottom: 32px; }

.back-link {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

/* Metaphore block */
.metaphore-block {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  align-items: start;
  background: rgba(74,232,176,0.04);
  border: 1px solid rgba(74,232,176,0.15);
  border-radius: 10px;
  padding: 28px 32px;
  margin: 32px 0;
}
.meta-emoji { font-size: 3rem; }
.meta-content h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 1.15rem;
  color: var(--accent2);
  margin-bottom: 10px;
}
.meta-content p { font-size: 0.875rem; color: var(--muted); line-height: 1.75; margin-bottom: 10px; }
.meta-content p:last-child { margin-bottom: 0; }
.meta-content strong { color: var(--white); }
.meta-content em { color: var(--accent); }

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

/* Layers stack */
.layers-stack {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  position: relative;
}

.layer-band {
  display: flex;
  align-items: center;
  min-height: 84px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  position: relative;
  transition: background 0.2s;
  cursor: default;
}
.layer-band:last-child { border-bottom: none; }
.layer-band:hover { filter: brightness(1.1); }

.layer-band.l1 { background: linear-gradient(90deg, rgba(232,122,74,0.14) 0%, rgba(232,122,74,0.05) 100%); }
.layer-band.l2 { background: linear-gradient(90deg, rgba(167,139,250,0.14) 0%, rgba(167,139,250,0.05) 100%); }
.layer-band.l3 { background: linear-gradient(90deg, rgba(74,232,176,0.14) 0%, rgba(74,232,176,0.05) 100%); }
.layer-band.l4 { background: linear-gradient(90deg, rgba(74,158,232,0.14) 0%, rgba(74,158,232,0.05) 100%); }

.band-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  padding: 16px 14px;
  border-right: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.l1 .band-num { color: var(--orange); background: rgba(232,122,74,0.08); }
.l2 .band-num { color: var(--purple); background: rgba(167,139,250,0.08); }
.l3 .band-num { color: var(--green); background: rgba(74,232,176,0.08); }
.l4 .band-num { color: var(--blue); background: rgba(74,158,232,0.08); }

.band-icon { font-size: 1.8rem; padding: 0 20px; flex-shrink: 0; }
.band-body { flex: 1; padding: 16px 20px 16px 0; }

.band-title {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.l1 .band-title { color: var(--orange); }
.l2 .band-title { color: var(--purple); }
.l3 .band-title { color: var(--green); }
.l4 .band-title { color: var(--blue); }

.band-sub { font-size: 0.8rem; color: var(--muted); line-height: 1.5; }

.band-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

.chip {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 3px;
  letter-spacing: 0.04em;
}
.l1 .chip { background: rgba(232,122,74,0.12); border: 1px solid rgba(232,122,74,0.25); color: var(--orange); }
.l2 .chip { background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.25); color: var(--purple); }
.l3 .chip { background: rgba(74,232,176,0.12); border: 1px solid rgba(74,232,176,0.25); color: var(--green); }
.l4 .chip { background: rgba(74,158,232,0.12); border: 1px solid rgba(74,158,232,0.25); color: var(--blue); }

.band-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  flex-shrink: 0;
}
.arrow-down {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.arrow-down .arr-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.arrow-down .arr-sym { font-size: 1rem; color: var(--muted); }

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

/* Flow diagram */
.flow-diagram {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
}

.flow-node {
  width: 100%;
  max-width: 640px;
  border-radius: 8px;
  padding: 14px 24px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-align: center;
  border: 1px solid;
  position: relative;
}
.flow-node .fn-sub {
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  color: var(--muted);
  display: block;
  margin-top: 2px;
  letter-spacing: 0;
}

.fn-l1 { background: rgba(232,122,74,0.08); border-color: rgba(232,122,74,0.35); color: var(--orange); }
.fn-l2 { background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.35); color: var(--purple); }
.fn-l3 { background: rgba(74,232,176,0.08); border-color: rgba(74,232,176,0.35); color: var(--green); }
.fn-db { background: rgba(232,200,74,0.08); border-color: rgba(232,200,74,0.35); color: var(--accent); }

.flow-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.flow-arrow-line {
  flex: 1;
  max-width: 120px;
  height: 1px;
  background: var(--border);
}

.flow-arrow-return {
  transform: rotate(180deg);
}

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

/* Problem banner */
.problem-banner {
  background: rgba(232,74,122,0.06);
  border: 1px solid rgba(232,74,122,0.2);
  border-left: 3px solid var(--red);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 28px 0;
  font-size: 0.875rem;
  line-height: 1.7;
}
.problem-banner strong { color: var(--red); }
.problem-banner h4 {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--red);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

/* Comparison table */
.comp-table {
  width: 100%;
  border-collapse: collapse;
  margin: 28px 0;
  font-size: 0.85rem;
}
.comp-table th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(232,200,74,0.2);
  background: rgba(232,200,74,0.04);
}
.comp-table td {
  padding: 11px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  vertical-align: top;
  line-height: 1.5;
}
.comp-table tr:last-child td { border-bottom: none; }
.comp-table tr:hover td { background: rgba(255,255,255,0.015); }
.comp-table .good { color: var(--green); font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; }
.comp-table .bad  { color: var(--orange); font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; }
.comp-table .neutral { color: var(--muted); font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; }

/* File tree */
.file-tree {
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px 28px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  line-height: 2;
  overflow-x: auto;
  margin: 28px 0;
  white-space: pre;
}

.file-tree :deep(.ft-gray)   { color: var(--muted); }
.file-tree :deep(.ft-blue)   { color: #4a9ee8; }
.file-tree :deep(.ft-orange) { color: #e87a4a; }
.file-tree :deep(.ft-purple) { color: #a78bfa; }
.file-tree :deep(.ft-green)  { color: #4ae8b0; }
.file-tree :deep(.ft-yellow) { color: #e8c84a; }

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

/* Footer */
.page-footer {
  border-top: 1px solid var(--border);
  padding-top: 32px;
  margin-top: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.1em;
}
.page-footer em { color: var(--accent); }

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
@media (max-width: 640px) {
  .cards { grid-template-columns: 1fr; }
  .dep-flow { flex-wrap: wrap; justify-content: center; }
  .metaphore-block { grid-template-columns: 1fr; text-align: center; }
  .layers-stack .band-arrow { display: none; }
  .layer-band { flex-wrap: wrap; }
  .comp-table { font-size: 0.75rem; }
  .comp-table th, .comp-table td { padding: 8px 10px; }
  .flow-diagram { padding: 0 8px; }
}
</style>
