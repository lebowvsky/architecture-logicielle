<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @purpose Card data is generated from typed category/card structures,
 *          avoiding repetitive template markup via v-for iteration.
 *
 * The page data is modeled as an array of Category objects, each containing
 * an array of Card objects. This enables clean v-for rendering while
 * preserving full type safety.
 */

interface Card {
  icon: string
  name: string
  title: string
  description: string
  tags: string[]
  quote?: string
  slug?: string
}

interface Category {
  number: string
  title: string
  colorClass: string
  cards: Card[]
}

interface LegendItem {
  color: string
  label: string
}

const categories: Category[] = [
  {
    number: '01',
    title: 'Architectures Monolithiques',
    colorClass: 'yellow',
    cards: [
      {
        icon: '\u{1F3DB}\u{FE0F}',
        name: 'Monolith',
        title: 'Architecture Monolithique',
        description:
          'Tout le syst\u00e8me est d\u00e9ploy\u00e9 comme une seule unit\u00e9. Simple \u00e0 d\u00e9velopper initialement, difficile \u00e0 faire \u00e9voluer \u00e0 grande \u00e9chelle. La m\u00e9taphore\u00a0: un bloc de pierre \u2014 solide, mais sculptez-en une partie et vous risquez de tout fissurer.',
        tags: ['D\u00e9ploiement unique', 'Base de code unifi\u00e9e', 'Simple'],
        slug: 'monolithic-architecture',
      },
      {
        icon: '\u{1F370}',
        name: 'Layered / N-Tier',
        title: 'Architecture en Couches',
        description:
          "Organisation en couches horizontales\u00a0: Pr\u00e9sentation \u2192 Logique M\u00e9tier \u2192 Acc\u00e8s aux donn\u00e9es \u2192 Base de donn\u00e9es. Uncle Bob critique le fait que les couches inf\u00e9rieures dictent souvent les couches sup\u00e9rieures \u2014 le sch\u00e9ma DB ne doit pas dicter les entit\u00e9s m\u00e9tier.",
        tags: ['3-Tier', 'MVC', 'S\u00e9paration concerns'],
        quote: '\u00ab\u00a0Les d\u00e9tails doivent d\u00e9pendre des politiques, jamais l\u2019inverse.\u00a0\u00bb',
        slug: 'layered-architecture',
      },
      {
        icon: '\u{1F3AD}',
        name: 'MVC / MVP / MVVM',
        title: 'Patterns Pr\u00e9sentation',
        description:
          "S\u00e9paration de la vue, du mod\u00e8le et du contr\u00f4leur/pr\u00e9senteur/viewmodel. Patterns de pr\u00e9sentation plut\u00f4t qu\u2019architecturaux au sens strict, mais fondamentaux dans la structuration du code d\u2019interface.",
        tags: ['Model', 'View', 'Controller', 'Presenter'],
        slug: 'presentation-patterns',
      },
    ],
  },
  {
    number: '02',
    title: 'Architectures "Propres" \u2014 \u00c9cole Uncle Bob',
    colorClass: 'green',
    cards: [
      {
        icon: '\u{1F3AF}',
        name: 'Clean Architecture',
        title: 'Architecture Propre',
        description:
          "Cercles concentriques\u00a0: Entities \u2192 Use Cases \u2192 Interface Adapters \u2192 Frameworks. La r\u00e8gle de d\u00e9pendance est absolue\u00a0: les d\u00e9pendances ne pointent QUE vers l\u2019int\u00e9rieur. La DB, le web, les frameworks sont des d\u00e9tails rempla\u00e7ables.",
        tags: ['Dependency Rule', 'Entities', 'Use Cases', 'Uncle Bob'],
        quote: '\u00ab\u00a0Le web est un d\u00e9tail. La DB est un d\u00e9tail.\u00a0\u00bb \u2014 Clean Architecture',
        slug: 'clean-architecture',
      },
      {
        icon: '\u{1F9C5}',
        name: 'Onion Architecture',
        title: 'Architecture Oignon',
        description:
          "Similaire \u00e0 Clean Architecture (Jeffrey Palermo). Le Domain Model est au centre, entour\u00e9 de couches de services. L\u2019infrastructure est toujours \u00e0 l\u2019ext\u00e9rieur. Les interfaces d\u00e9finissent les contrats entre couches.",
        tags: ['Domain Model', 'Infrastructure externe', 'Interfaces'],
        slug: 'onion-architecture',
      },
      {
        icon: '\u{1F537}',
        name: 'Hexagonal',
        title: 'Architecture Hexagonale (Ports & Adapters)',
        description:
          "Le domaine au centre communique via des Ports (interfaces). Les Adapters impl\u00e9mentent ces ports pour le monde ext\u00e9rieur (HTTP, DB, Queue\u2026). Invent\u00e9e par Alistair Cockburn. Parfait pour la testabilit\u00e9\u00a0: le domaine ne conna\u00eet rien de l\u2019ext\u00e9rieur.",
        tags: ['Ports', 'Adapters', 'Testabilit\u00e9', 'Cockburn'],
        slug: 'hexagonal-architecture',
      },
      {
        icon: '\u{1F4E6}',
        name: 'DDD',
        title: 'Domain-Driven Design',
        description:
          "Eric Evans. L\u2019architecture suit le domaine m\u00e9tier\u00a0: Bounded Contexts, Aggregates, Entities, Value Objects, Domain Events. Ubiquitous Language\u00a0: le code parle le m\u00eame langage que les experts m\u00e9tier. Souvent combin\u00e9 avec Hexagonale ou Clean.",
        tags: ['Bounded Context', 'Aggregate', 'Domain Events', 'Evans'],
        slug: 'ddd-architecture',
      },
    ],
  },
  {
    number: '03',
    title: 'Architectures Orient\u00e9es Services',
    colorClass: 'blue',
    cards: [
      {
        icon: '\u{1F50C}',
        name: 'SOA',
        title: 'Service-Oriented Architecture',
        description:
          "Services r\u00e9utilisables communiquant via un ESB (Enterprise Service Bus). Pr\u00e9curseur des microservices, souvent plus lourd. Populaire dans les grandes entreprises ann\u00e9es 2000. L\u2019ESB peut devenir un point de d\u00e9faillance unique.",
        tags: ['ESB', 'WSDL', 'SOAP', 'Enterprise'],
      },
      {
        icon: '\u{1F52C}',
        name: 'Microservices',
        title: 'Architecture Microservices',
        description:
          "Services petits, ind\u00e9pendants, d\u00e9ployables s\u00e9par\u00e9ment. Chaque service poss\u00e8de sa propre base de donn\u00e9es. Communication via REST, gRPC ou messages. Scalabilit\u00e9 fine, mais complexit\u00e9 op\u00e9rationnelle \u00e9lev\u00e9e. La m\u00e9taphore\u00a0: un banc de poissons vs un requin.",
        tags: ['D\u00e9ploiement ind\u00e9pendant', 'API Gateway', 'Docker', 'Kubernetes'],
        quote: 'Martin Fowler\u00a0: \u00ab\u00a0Ne commencez pas avec les microservices.\u00a0\u00bb',
      },
      {
        icon: '\u{1F310}',
        name: 'Serverless / FaaS',
        title: 'Architecture Sans Serveur',
        description:
          "Fonctions d\u00e9ploy\u00e9es \u00e0 la demande (AWS Lambda, Azure Functions). L\u2019infrastructure est totalement abstraite. Facturation \u00e0 l\u2019usage. Id\u00e9al pour les charges variables. Limite\u00a0: cold starts, \u00e9tat difficile \u00e0 g\u00e9rer, vendor lock-in.",
        tags: ['Lambda', 'Event-driven', 'Pay-per-use', 'Stateless'],
      },
    ],
  },
  {
    number: '04',
    title: 'Architectures \u00c9v\u00e9nementielles & R\u00e9actives',
    colorClass: 'pink',
    cards: [
      {
        icon: '\u26A1',
        name: 'EDA',
        title: 'Event-Driven Architecture',
        description:
          "Les composants communiquent via des \u00e9v\u00e9nements asynchrones (Kafka, RabbitMQ). D\u00e9couplage fort\u00a0: le producteur ignore qui consomme. Parfait pour les flux temps r\u00e9el. La m\u00e9taphore\u00a0: la radio FM \u2014 elle \u00e9met sans savoir combien d\u2019auditeurs l\u2019\u00e9coutent.",
        tags: ['Kafka', 'Async', 'Pub/Sub', 'D\u00e9couplage'],
      },
      {
        icon: '\u{1F4DC}',
        name: 'Event Sourcing',
        title: 'Sourcing par \u00c9v\u00e9nements',
        description:
          "L\u2019\u00e9tat du syst\u00e8me est reconstruit en rejouant une s\u00e9quence d\u2019\u00e9v\u00e9nements immuables. Auditabilit\u00e9 totale. La m\u00e9taphore\u00a0: un journal comptable \u2014 on ne rature jamais, on passe une \u00e9criture de correction. Souvent combin\u00e9 avec CQRS.",
        tags: ['Immutabilit\u00e9', 'Audit Trail', 'Replay', 'Append-only'],
      },
      {
        icon: '\u2702\uFE0F',
        name: 'CQRS',
        title: 'Command Query Responsibility Segregation',
        description:
          "S\u00e9parer les mod\u00e8les d\u2019\u00e9criture (Commands) et de lecture (Queries). Optimiser chaque c\u00f4t\u00e9 ind\u00e9pendamment. La lecture peut avoir ses propres vues d\u00e9normalis\u00e9es. Complexit\u00e9 accrue mais performances et scalabilit\u00e9 sup\u00e9rieures.",
        tags: ['Commands', 'Queries', 'Read Model', 'Write Model'],
      },
    ],
  },
  {
    number: '05',
    title: 'Architectures Modulaires & Composants',
    colorClass: 'purple',
    cards: [
      {
        icon: '\u{1F9E9}',
        name: 'Plugin',
        title: 'Architecture Plugin (Microkernel)',
        description:
          "Un noyau stable expose des points d\u2019extension. Les fonctionnalit\u00e9s sont des plugins ind\u00e9pendants. Uncle Bob\u00a0: le syst\u00e8me central ne d\u00e9pend PAS des plugins, c\u2019est l\u2019inverse. Exemple canonique\u00a0: un IDE avec ses extensions.",
        tags: ['Microkernel', 'Extension Points', 'Stable Core'],
        quote: '\u00ab\u00a0Prot\u00e9gez le noyau des d\u00e9tails volatils.\u00a0\u00bb',
      },
      {
        icon: '\u{1F3D7}\uFE0F',
        name: 'Component-Based',
        title: 'Architecture par Composants',
        description:
          "D\u00e9composition en composants autonomes, r\u00e9utilisables, avec interfaces claires. Chaque composant encapsule son \u00e9tat et sa logique. Fondement des frameworks modernes (React, Vue, Web Components). Favorise la r\u00e9utilisabilit\u00e9.",
        tags: ['Encapsulation', 'R\u00e9utilisabilit\u00e9', 'Interface'],
      },
      {
        icon: '\u{1F33F}',
        name: 'Modular Monolith',
        title: 'Monolithe Modulaire',
        description:
          "Un seul d\u00e9ploiement mais une structure interne fortement modulaire avec fronti\u00e8res claires entre modules. Le meilleur des deux mondes\u00a0: simplicit\u00e9 op\u00e9rationnelle du monolithe + s\u00e9paration des pr\u00e9occupations des microservices. Recommand\u00e9 comme \u00e9tape avant microservices.",
        tags: ['Modules isol\u00e9s', 'D\u00e9ploiement simple', 'Bounded Modules'],
      },
    ],
  },
  {
    number: '06',
    title: 'Architectures Distribu\u00e9es & Cloud-Native',
    colorClass: 'orange',
    cards: [
      {
        icon: '\u{1F578}\uFE0F',
        name: 'Service Mesh',
        title: 'Architecture Service Mesh',
        description:
          "Couche d\u2019infrastructure d\u00e9di\u00e9e \u00e0 la communication inter-services (Istio, Linkerd). G\u00e8re\u00a0: la d\u00e9couverte, le load balancing, le chiffrement, l\u2019observabilit\u00e9. La logique r\u00e9seau sort du code applicatif pour aller dans le mesh.",
        tags: ['Istio', 'Sidecar Proxy', 'mTLS', 'Observabilit\u00e9'],
      },
      {
        icon: '\u{1F504}',
        name: 'Saga Pattern',
        title: 'Architecture Saga',
        description:
          "Gestion des transactions distribu\u00e9es sans 2PC. S\u00e9quence de transactions locales compens\u00e9es en cas d\u2019\u00e9chec. Deux modes\u00a0: Choreography (\u00e9v\u00e9nements) ou Orchestration (saga orchestrateur central). Complexe mais incontournable en microservices.",
        tags: ['Transactions distribu\u00e9es', 'Compensation', 'Eventual Consistency'],
      },
      {
        icon: '\u{1F4E1}',
        name: 'Micro-Frontends',
        title: 'Micro-Frontends',
        description:
          "Application du principe microservices au frontend. Chaque \u00e9quipe poss\u00e8de sa slice verticale compl\u00e8te\u00a0: backend + frontend. Ind\u00e9pendance de d\u00e9ploiement, de technologie. Module Federation (Webpack) en est l\u2019impl\u00e9mentation moderne.",
        tags: ['Module Federation', 'Autonomie \u00e9quipe', 'Vertical Slice'],
      },
    ],
  },
]

const legendItems: LegendItem[] = [
  { color: '#e8c84a', label: 'Monolithique' },
  { color: '#4ae8b0', label: 'Architecture Propre / DDD' },
  { color: '#4a9ee8', label: 'Orient\u00e9e Services' },
  { color: '#e84a7a', label: '\u00c9v\u00e9nementielle' },
  { color: '#9a4ae8', label: 'Modulaire' },
  { color: '#e87a4a', label: 'Distribu\u00e9e / Cloud' },
]

useHead({
  title: 'Panorama complet',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Architectures Logicielles',
        description:
          'Panorama des patterns architecturaux fondamentaux : Clean Architecture, Hexagonale, Microservices, Event-Driven, DDD et plus. Guide de reference en francais.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr',
      }),
    },
  ],
})

useSeoMeta({
  title: 'Panorama complet',
  description:
    'Panorama des patterns architecturaux fondamentaux : Clean Architecture, Hexagonale, Microservices, Event-Driven, DDD et plus. Guide de reference en francais.',
  ogTitle: 'Les grandes architectures logicielles',
  ogDescription:
    'Panorama des patterns architecturaux fondamentaux : Clean Architecture, Hexagonale, Microservices, Event-Driven, DDD et plus. Guide de reference en francais.',
  ogType: 'website',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Les grandes architectures logicielles',
  twitterDescription:
    'Panorama des patterns architecturaux fondamentaux : Clean Architecture, Hexagonale, Microservices, Event-Driven, DDD et plus. Guide de reference en francais.',
})
</script>

<template>
  <div class="container">
    <header>
      <div class="eyebrow">// Architecture Logicielle — R&eacute;f&eacute;rence Compl&egrave;te</div>
      <h1>Les grandes <em>architectures</em><br>logicielles</h1>
      <p class="subtitle">
        Panorama des patterns architecturaux fondamentaux, de la couche monolithique aux
        syst&egrave;mes distribu&eacute;s.
      </p>
    </header>

    <!-- Uncle Bob callout -->
    <div class="martin-box">
      <div class="martin-avatar">&#x1F4D6;</div>
      <div class="martin-content">
        <h3>La loi fondamentale de Robert C. Martin (Uncle Bob)</h3>
        <p>
          &laquo;&nbsp;Le but d'une bonne architecture est de minimiser les ressources humaines
          n&eacute;cessaires pour construire et maintenir un syst&egrave;me.&nbsp;&raquo; Une
          architecture n'est pas une technologie &mdash; c'est une
          <em>d&eacute;cision sur ce qui peut changer facilement</em> et ce qui doit rester stable.
          Elle s&eacute;pare la politique (les r&egrave;gles m&eacute;tier) des d&eacute;tails (les
          frameworks, les bases de donn&eacute;es, le r&eacute;seau).
        </p>
      </div>
    </div>

    <!-- Category sections -->
    <section
      v-for="category in categories"
      :key="category.number"
      class="category"
    >
      <div class="category-header">
        <span class="category-number">{{ category.number }}</span>
        <h2 class="category-title">{{ category.title }}</h2>
        <div class="category-line" />
      </div>
      <div class="cards">
        <template
          v-for="(card, cardIndex) in category.cards"
          :key="card.name"
        >
          <NuxtLink
            v-if="card.slug"
            :to="`/${card.slug}`"
            class="card card-link"
            :class="category.colorClass"
            :style="{ animationDelay: `${(cardIndex + 1) * 0.05}s` }"
          >
            <span class="card-icon">{{ card.icon }}</span>
            <div class="card-name">{{ card.name }}</div>
            <div class="card-title">{{ card.title }}</div>
            <p class="card-desc">{{ card.description }}</p>
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
          </NuxtLink>
          <article
            v-else
            class="card"
            :class="category.colorClass"
            :style="{ animationDelay: `${(cardIndex + 1) * 0.05}s` }"
          >
            <span class="card-icon">{{ card.icon }}</span>
            <div class="card-name">{{ card.name }}</div>
            <div class="card-title">{{ card.title }}</div>
            <p class="card-desc">{{ card.description }}</p>
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
        </template>
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

h1 em {
  font-style: italic;
  color: var(--accent);
}

.subtitle {
  font-size: 1rem;
  color: var(--muted);
  max-width: 520px;
}

/* Category sections */
.category {
  margin-bottom: 64px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.category-number {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  background: rgba(232, 200, 74, 0.08);
  border: 1px solid rgba(232, 200, 74, 0.2);
  padding: 4px 10px;
  border-radius: 3px;
  letter-spacing: 0.1em;
}

.category-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.5rem;
  color: var(--white);
}

.category-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* Cards grid */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
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
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--card-accent, var(--accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.card-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: block;
}

.card:hover {
  border-color: var(--card-accent, var(--accent));
  transform: translateY(-2px);
}

.card:hover::before {
  transform: scaleX(1);
}

.card-icon {
  font-size: 1.6rem;
  margin-bottom: 12px;
  display: block;
}

.card-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--card-accent, var(--accent));
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.card-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.2rem;
  color: var(--white);
  margin-bottom: 10px;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.65;
  margin-bottom: 16px;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--muted);
  letter-spacing: 0.05em;
}

.card-quote {
  font-style: italic;
  font-size: 0.8rem;
  color: rgba(232, 200, 74, 0.5);
  border-left: 2px solid rgba(232, 200, 74, 0.2);
  padding-left: 10px;
  margin-top: 12px;
  line-height: 1.5;
}

/* Robert Martin callout */
.martin-box {
  background: linear-gradient(135deg, rgba(232, 200, 74, 0.06), rgba(74, 232, 176, 0.04));
  border: 1px solid rgba(232, 200, 74, 0.2);
  border-radius: 10px;
  padding: 28px 32px;
  margin: 56px 0;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.martin-avatar {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.martin-content h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 1.15rem;
  color: var(--accent);
  margin-bottom: 8px;
}

.martin-content p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.7;
}

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

/* Color variants */
.yellow { --card-accent: #e8c84a; }
.green  { --card-accent: #4ae8b0; }
.pink   { --card-accent: #e84a7a; }
.blue   { --card-accent: #4a9ee8; }
.purple { --card-accent: #9a4ae8; }
.orange { --card-accent: #e87a4a; }

/* Animation */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
