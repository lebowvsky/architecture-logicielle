<script setup lang="ts">
/**
 * @pattern Factory Pattern (Creational)
 * @category Creational
 * @purpose Repeated data structures (metaphor cards, flow steps, comparison rows,
 *          decision cards, pros/cons, legend items) are modeled as typed arrays
 *          and rendered via v-for, while unique prose, code blocks, diagrams,
 *          quote boxes, rule banners and info/warn boxes stay as direct template markup.
 */

interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface MetaphorCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
}

interface FlowStep {
  num: number
  bgColor: string
  textColor: string
  label: string
  description: string
}

interface ProConItem {
  text: string
}

interface ProConColumn {
  headerLabel: string
  headerColor: string
  bgColor: string
  dotColor: string
  items: ProConItem[]
}

type CellColor = 'tg' | 'to' | 'tr' | 'tp' | 'tb' | ''

interface ComparisonRow {
  criterion: string
  mvc: string
  mvp: string
  mvvm: string
  mvcColor: CellColor
  mvpColor: CellColor
  mvvmColor: CellColor
}

interface DecisionCard {
  icon: string
  colorClass: string
  name: string
  title: string
  description: string
  tags: string[]
  quote: string
}

interface LegendItem {
  color: string
  label: string
}

const metaphorCards: MetaphorCard[] = [
  {
    icon: '\u{1F468}\u200D\u{1F373}',
    colorClass: 'orange',
    name: 'MVC',
    title: "Le Ma\u00eetre d'H\u00f4tel",
    description:
      "Le Controller prend ta commande, la transmet en cuisine, et dit \u00e0 la salle comment dresser la table. Mais la salle peut regarder dans la cuisine directement.",
    tags: ['Orchestrateur central', 'Couplage possible'],
  },
  {
    icon: '\u{1F3AD}',
    colorClass: 'purple',
    name: 'MVP',
    title: 'Le Puppet Master',
    description:
      "La View est une marionnette \u2014 elle ne fait rien par elle-m\u00eame. Le Presenter tire toutes les ficelles et ne conna\u00eet la View que via un contrat (interface).",
    tags: ['View passive', 'Interface stricte'],
  },
  {
    icon: '\u{1F4E1}',
    colorClass: 'blue',
    name: 'MVVM',
    title: 'Le Tableau de Bord',
    description:
      "Le ViewModel publie des donn\u00e9es en temps r\u00e9el. La View s'abonne et se met \u00e0 jour automatiquement \u2014 sans qu'on lui demande. Z\u00e9ro r\u00e9f\u00e9rence directe.",
    tags: ['Data binding', 'R\u00e9activit\u00e9'],
  },
]

const mvcFlowSteps: FlowStep[] = [
  {
    num: 1,
    bgColor: 'rgba(74,158,232,0.08)',
    textColor: '#4a9ee8',
    label: 'Utilisateur',
    description:
      "D\u00e9clenche une action \u2014 clic, soumission de formulaire, requ\u00eate HTTP GET/POST",
  },
  {
    num: 2,
    bgColor: 'rgba(167,139,250,0.08)',
    textColor: '#a78bfa',
    label: 'Controller',
    description:
      "Re\u00e7oit l'action, interpr\u00e8te les param\u00e8tres, appelle la bonne m\u00e9thode du Model",
  },
  {
    num: 3,
    bgColor: 'rgba(74,232,176,0.08)',
    textColor: '#4ae8b0',
    label: 'Model',
    description:
      "Ex\u00e9cute la logique m\u00e9tier, interroge la base de donn\u00e9es, retourne les donn\u00e9es",
  },
  {
    num: 4,
    bgColor: 'rgba(74,232,176,0.08)',
    textColor: '#4ae8b0',
    label: 'Model \u2192 View',
    description:
      "Notifie les Views abonn\u00e9es (Observer) ou le Controller choisit la View \u00e0 rendre",
  },
  {
    num: 5,
    bgColor: 'rgba(232,122,74,0.08)',
    textColor: '#e87a4a',
    label: 'View',
    description:
      "Re\u00e7oit les donn\u00e9es, g\u00e9n\u00e8re le rendu HTML/UI, retourne le r\u00e9sultat \u00e0 l'utilisateur",
  },
]

const mvcProsCons: ProConColumn[] = [
  {
    headerLabel: '\u2713 Points forts',
    headerColor: '#4ae8b0',
    bgColor: 'rgba(74,232,176,0.06)',
    dotColor: '#4ae8b0',
    items: [
      { text: "Simple \u00e0 comprendre \u2014 le pattern standard du web" },
      { text: 'Frameworks nombreux : Express, NestJS, Django, Rails' },
      { text: "S\u00e9paration claire des responsabilit\u00e9s initiales" },
      { text: "Id\u00e9al pour le rendu c\u00f4t\u00e9 serveur (SSR)" },
    ],
  },
  {
    headerLabel: '\u2717 Points faibles',
    headerColor: '#e84a7a',
    bgColor: 'rgba(232,74,122,0.06)',
    dotColor: '#e84a7a',
    items: [
      { text: "La View peut d\u00e9pendre du Model directement (couplage)" },
      { text: "Controller difficile \u00e0 tester unitairement (li\u00e9 \u00e0 HTTP)" },
      { text: "Fat Controller : la logique de pr\u00e9sentation d\u00e9rive vers lui" },
      { text: "Moins adapt\u00e9 aux UIs riches et r\u00e9actives" },
    ],
  },
]

const mvpProsCons: ProConColumn[] = [
  {
    headerLabel: '\u2713 Points forts',
    headerColor: '#4ae8b0',
    bgColor: 'rgba(74,232,176,0.06)',
    dotColor: '#4ae8b0',
    items: [
      { text: "Presenter testable \u00e0 100% sans DOM ni framework" },
      { text: "View totalement passive \u2014 z\u00e9ro logique \u00e0 tester c\u00f4t\u00e9 UI" },
      { text: "L'interface IView est un contrat strict et explicite" },
      { text: "Id\u00e9al pour Android natif, iOS UIKit" },
    ],
  },
  {
    headerLabel: '\u2717 Points faibles',
    headerColor: '#e84a7a',
    bgColor: 'rgba(232,74,122,0.06)',
    dotColor: '#e84a7a',
    items: [
      { text: "Beaucoup de boilerplate \u2014 une interface par View" },
      { text: "Relation 1-to-1 Presenter/View \u2014 peu flexible" },
      { text: "Presenter peut grossir (God Presenter)" },
      { text: "Mise \u00e0 jour UI manuelle \u2014 pas de r\u00e9activit\u00e9 automatique" },
    ],
  },
]

const mvvmProsCons: ProConColumn[] = [
  {
    headerLabel: '\u2713 Points forts',
    headerColor: '#4ae8b0',
    bgColor: 'rgba(74,232,176,0.06)',
    dotColor: '#4ae8b0',
    items: [
      { text: "View totalement passive \u2014 aucun appel explicite" },
      { text: "Testabilit\u00e9 maximale du ViewModel sans UI" },
      { text: "Parfait pour les UIs r\u00e9actives et complexes" },
      { text: 'React, Angular, SwiftUI, Jetpack Compose' },
    ],
  },
  {
    headerLabel: '\u2717 Points faibles',
    headerColor: '#e84a7a',
    bgColor: 'rgba(232,74,122,0.06)',
    dotColor: '#e84a7a',
    items: [
      { text: "Courbe d'apprentissage du data binding" },
      { text: 'Overhead pour les UIs simples (overkill)' },
      { text: "Gestion de la m\u00e9moire (d\u00e9sabonnement)" },
      { text: 'Debugging parfois difficile avec le binding' },
    ],
  },
]

const comparisonRows: ComparisonRow[] = [
  {
    criterion: 'Couplage View / Logique',
    mvc: 'Moyen',
    mvp: 'Faible',
    mvvm: 'Tr\u00e8s faible',
    mvcColor: 'to',
    mvpColor: 'tg',
    mvvmColor: 'tg',
  },
  {
    criterion: 'Testabilit\u00e9',
    mvc: 'Moyenne',
    mvp: '\u00c9lev\u00e9e',
    mvvm: 'Tr\u00e8s \u00e9lev\u00e9e',
    mvcColor: 'to',
    mvpColor: 'tg',
    mvvmColor: 'tg',
  },
  {
    criterion: 'Complexit\u00e9',
    mvc: 'Faible',
    mvp: 'Moyenne',
    mvvm: '\u00c9lev\u00e9e',
    mvcColor: 'tg',
    mvpColor: 'to',
    mvvmColor: 'to',
  },
  {
    criterion: 'Relation Pr\u00e9sentateur / View',
    mvc: '1-N',
    mvp: '<strong>1-1 stricte</strong>',
    mvvm: 'Aucune',
    mvcColor: '',
    mvpColor: 'tp',
    mvvmColor: 'tb',
  },
  {
    criterion: 'R\u00e9activit\u00e9 UI',
    mvc: 'Manuelle',
    mvp: 'Manuelle',
    mvvm: 'Automatique',
    mvcColor: 'tr',
    mvpColor: 'tr',
    mvvmColor: 'tg',
  },
  {
    criterion: 'View passive ?',
    mvc: 'Non',
    mvp: 'Oui',
    mvvm: 'Totalement',
    mvcColor: 'tr',
    mvpColor: 'tg',
    mvvmColor: 'tg',
  },
  {
    criterion: 'Contexte id\u00e9al',
    mvc: 'Web SSR<br><span style="font-size:0.78rem;color:var(--muted);">Express, Rails, Django</span>',
    mvp: 'Mobile legacy<br><span style="font-size:0.78rem;color:var(--muted);">Android, iOS UIKit</span>',
    mvvm: 'UI r\u00e9active<br><span style="font-size:0.78rem;color:var(--muted);">React, Angular, Compose</span>',
    mvcColor: '',
    mvpColor: '',
    mvvmColor: '',
  },
  {
    criterion: 'Boilerplate',
    mvc: 'Faible',
    mvp: '\u00c9lev\u00e9 (interfaces)',
    mvvm: 'Moyen',
    mvcColor: 'tg',
    mvpColor: 'to',
    mvvmColor: 'to',
  },
]

const decisionCards: DecisionCard[] = [
  {
    icon: '\u{1F310}',
    colorClass: 'orange',
    name: 'Choisir MVC quand\u2026',
    title: 'Application web SSR',
    description:
      "Application web serveur-side, \u00e9quipe junior, besoin de rapidit\u00e9. Le framework impose souvent le pattern. Rendu HTML c\u00f4t\u00e9 serveur sans \u00e9tat UI complexe.",
    tags: ['Express', 'NestJS', 'Rails', 'Django', 'Laravel'],
    quote: '\u00ab Utilise MVC quand la Vue n\u2019a pas besoin de m\u00e9moire. \u00bb',
  },
  {
    icon: '\u{1F4F1}',
    colorClass: 'purple',
    name: 'Choisir MVP quand\u2026',
    title: 'Mobile & testabilit\u00e9 critique',
    description:
      "Application mobile, legacy code \u00e0 tester, contexte o\u00f9 le binding automatique n'existe pas. La testabilit\u00e9 du Presenter sans framework est l'avantage d\u00e9cisif.",
    tags: ['Android legacy', 'iOS UIKit', 'Tests unitaires'],
    quote: '\u00ab Utilise MVP quand tu dois tester la logique sans l\u2019UI. \u00bb',
  },
  {
    icon: '\u26A1',
    colorClass: 'blue',
    name: 'Choisir MVVM quand\u2026',
    title: 'UI r\u00e9active et complexe',
    description:
      "UI avec \u00e9tat partag\u00e9 entre composants, framework moderne, besoins de r\u00e9activit\u00e9. Le Data Binding est un avantage structurel, pas un luxe.",
    tags: ['React', 'Angular', 'Jetpack Compose', 'SwiftUI'],
    quote: '\u00ab Utilise MVVM quand l\u2019UI doit r\u00e9agir \u00e0 l\u2019\u00e9tat, pas l\u2019inverse. \u00bb',
  },
]

const legendItems: LegendItem[] = [
  { color: '#4a9ee8', label: 'Utilisateur / Action UI' },
  { color: '#e87a4a', label: 'View (affichage)' },
  { color: '#a78bfa', label: 'Controller / Presenter / ViewModel' },
  { color: '#4ae8b0', label: 'Model (donn\u00e9es + m\u00e9tier)' },
  { color: '#e84a7a', label: 'Interface / Contrat IView' },
  { color: '#e8c84a', label: 'R\u00e8gle / Principe' },
]

/* ── MVC Code Blocks ──────────────────────────────────────────────── */

const codeBlockMvcModel = `<span class="cm">// MODEL \u2014 logique m\u00e9tier + acc\u00e8s aux donn\u00e9es</span>
<span class="cm">// Ne conna\u00eet ni la View ni le Controller</span>
<span class="kw">interface</span> <span class="ty">Article</span> {
  id: <span class="ty">number</span>;
  titre: <span class="ty">string</span>;
  contenu: <span class="ty">string</span>;
  auteur: <span class="ty">string</span>;
}

<span class="kw">class</span> <span class="ty">ArticleModel</span> {
  <span class="kw">private</span> articles: <span class="ty">Article</span>[] = [
    { id: <span class="num">1</span>, titre: <span class="str">"Clean Code"</span>, contenu: <span class="str">"\u00c9crire du code lisible..."</span>, auteur: <span class="str">"Bob Martin"</span> },
    { id: <span class="num">2</span>, titre: <span class="str">"Clean Architecture"</span>, contenu: <span class="str">"S\u00e9parer les responsabilit\u00e9s..."</span>, auteur: <span class="str">"Bob Martin"</span> },
  ];

  <span class="fn">findById</span>(id: <span class="ty">number</span>): <span class="ty">Article</span> | <span class="ty">undefined</span> {
    <span class="kw">return</span> <span class="kw">this</span>.articles.<span class="fn">find</span>(a =&gt; a.id === id);
  }

  <span class="fn">findAll</span>(): <span class="ty">Article</span>[] { <span class="kw">return</span> <span class="kw">this</span>.articles; }
}`

const codeBlockMvcView = `<span class="cm">// VIEW \u2014 rendu HTML uniquement, aucune logique</span>
<span class="kw">const</span> <span class="ty">ArticleView</span> = {
  <span class="fn">render</span>(article: <span class="ty">Article</span>): <span class="ty">string</span> {
    <span class="kw">return</span> <span class="str">\`
      &lt;article&gt;
        &lt;h1&gt;\${article.titre}&lt;/h1&gt;
        &lt;p class="auteur"&gt;Par \${article.auteur}&lt;/p&gt;
        &lt;p&gt;\${article.contenu}&lt;/p&gt;
      &lt;/article&gt;
    \`</span>;
  },

  <span class="fn">renderNotFound</span>(): <span class="ty">string</span> {
    <span class="kw">return</span> <span class="str">\`&lt;p class="erreur"&gt;Article introuvable&lt;/p&gt;\`</span>;
  },

  <span class="fn">renderListe</span>(articles: <span class="ty">Article</span>[]): <span class="ty">string</span> {
    <span class="kw">const</span> items = articles
      .<span class="fn">map</span>(a =&gt; <span class="str">\`&lt;li&gt;&lt;a href="/articles/\${a.id}"&gt;\${a.titre}&lt;/a&gt;&lt;/li&gt;\`</span>)
      .<span class="fn">join</span>(<span class="str">''</span>);
    <span class="kw">return</span> <span class="str">\`&lt;ul&gt;\${items}&lt;/ul&gt;\`</span>;
  }
};`

const codeBlockMvcController = `<span class="cm">// CONTROLLER \u2014 orchestre Model et View</span>
<span class="cm">// C'est lui qui re\u00e7oit les requ\u00eates HTTP</span>
<span class="kw">class</span> <span class="ty">ArticleController</span> {
  <span class="kw">constructor</span>(<span class="kw">private</span> model: <span class="ty">ArticleModel</span>) {}

  <span class="fn">afficher</span>(req: <span class="ty">Request</span>, res: <span class="ty">Response</span>): <span class="ty">void</span> {
    <span class="kw">const</span> id = <span class="ty">Number</span>(req.params.id);
    <span class="kw">const</span> article = <span class="kw">this</span>.model.<span class="fn">findById</span>(id);

    <span class="kw">if</span> (!article) {
      res.<span class="fn">status</span>(<span class="num">404</span>).<span class="fn">send</span>(<span class="ty">ArticleView</span>.<span class="fn">renderNotFound</span>());
      <span class="kw">return</span>;
    }
    res.<span class="fn">send</span>(<span class="ty">ArticleView</span>.<span class="fn">render</span>(article));
  }

  <span class="fn">liste</span>(req: <span class="ty">Request</span>, res: <span class="ty">Response</span>): <span class="ty">void</span> {
    <span class="kw">const</span> articles = <span class="kw">this</span>.model.<span class="fn">findAll</span>();
    res.<span class="fn">send</span>(<span class="ty">ArticleView</span>.<span class="fn">renderListe</span>(articles));
  }
}

<span class="cm">// Wiring \u2014 Express.js</span>
<span class="kw">const</span> controller = <span class="kw">new</span> <span class="ty">ArticleController</span>(<span class="kw">new</span> <span class="ty">ArticleModel</span>());
app.<span class="fn">get</span>(<span class="str">'/articles'</span>, (req, res) =&gt; controller.<span class="fn">liste</span>(req, res));
app.<span class="fn">get</span>(<span class="str">'/articles/:id'</span>, (req, res) =&gt; controller.<span class="fn">afficher</span>(req, res));`

/* ── MVP Code Blocks ──────────────────────────────────────────────── */

const codeBlockMvpInterface = `<span class="cm">// INTERFACE \u2014 le contrat que toute View DOIT respecter</span>
<span class="cm">// C'est la fronti\u00e8re entre Presenter et View</span>
<span class="kw">interface</span> <span class="ty">ILoginView</span> {
  <span class="fn">afficherChargement</span>(visible: <span class="ty">boolean</span>): <span class="ty">void</span>;
  <span class="fn">afficherErreur</span>(message: <span class="ty">string</span>): <span class="ty">void</span>;
  <span class="fn">afficherSucces</span>(utilisateur: <span class="ty">Utilisateur</span>): <span class="ty">void</span>;
  <span class="fn">getEmail</span>(): <span class="ty">string</span>;
  <span class="fn">getMotDePasse</span>(): <span class="ty">string</span>;
}`

const codeBlockMvpModel = `<span class="cm">// MODEL \u2014 service d'authentification pur</span>
<span class="kw">interface</span> <span class="ty">Utilisateur</span> { email: <span class="ty">string</span>; nom: <span class="ty">string</span>; }

<span class="kw">class</span> <span class="ty">AuthService</span> {
  <span class="kw">async</span> <span class="fn">login</span>(email: <span class="ty">string</span>, mdp: <span class="ty">string</span>): <span class="ty">Promise</span>&lt;<span class="ty">Utilisateur</span>&gt; {
    <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/login'</span>, {
      method: <span class="str">'POST'</span>,
      body: <span class="ty">JSON</span>.<span class="fn">stringify</span>({ email, mdp }),
    });
    <span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Identifiants invalides'</span>);
    <span class="kw">return</span> res.<span class="fn">json</span>();
  }
}`

const codeBlockMvpPresenter = `<span class="cm">// PRESENTER \u2014 logique de pr\u00e9sentation testable \u00e0 100%</span>
<span class="cm">// Ne conna\u00eet la View QUE via ILoginView</span>
<span class="kw">class</span> <span class="ty">LoginPresenter</span> {
  <span class="kw">constructor</span>(
    <span class="kw">private</span> view: <span class="ty">ILoginView</span>,       <span class="cm">// \u2190 interface, jamais la classe concr\u00e8te</span>
    <span class="kw">private</span> authService: <span class="ty">AuthService</span>
  ) {}

  <span class="kw">async</span> <span class="fn">onLoginClique</span>(): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">const</span> email = <span class="kw">this</span>.view.<span class="fn">getEmail</span>().<span class="fn">trim</span>();
    <span class="kw">const</span> mdp   = <span class="kw">this</span>.view.<span class="fn">getMotDePasse</span>();

    <span class="kw">if</span> (!email || !mdp) {
      <span class="kw">this</span>.view.<span class="fn">afficherErreur</span>(<span class="str">'Email et mot de passe requis'</span>);
      <span class="kw">return</span>;
    }

    <span class="kw">this</span>.view.<span class="fn">afficherChargement</span>(<span class="kw">true</span>);

    <span class="kw">try</span> {
      <span class="kw">const</span> utilisateur = <span class="kw">await</span> <span class="kw">this</span>.authService.<span class="fn">login</span>(email, mdp);
      <span class="kw">this</span>.view.<span class="fn">afficherSucces</span>(utilisateur);
    } <span class="kw">catch</span> (e) {
      <span class="kw">this</span>.view.<span class="fn">afficherErreur</span>((e <span class="kw">as</span> <span class="ty">Error</span>).message);
    } <span class="kw">finally</span> {
      <span class="kw">this</span>.view.<span class="fn">afficherChargement</span>(<span class="kw">false</span>);
    }
  }
}`

const codeBlockMvpView = `<span class="cm">// VIEW \u2014 impl\u00e9mente ILoginView, manipule le DOM</span>
<span class="cm">// AUCUNE logique ici \u2014 que du relais vers le Presenter</span>
<span class="kw">class</span> <span class="ty">LoginView</span> <span class="kw">implements</span> <span class="ty">ILoginView</span> {
  <span class="kw">private</span> presenter: <span class="ty">LoginPresenter</span>;

  <span class="kw">constructor</span>() {
    <span class="kw">this</span>.presenter = <span class="kw">new</span> <span class="ty">LoginPresenter</span>(<span class="kw">this</span>, <span class="kw">new</span> <span class="ty">AuthService</span>());
    document.<span class="fn">getElementById</span>(<span class="str">'btn-login'</span>)!
      .<span class="fn">addEventListener</span>(<span class="str">'click'</span>, () =&gt; <span class="kw">this</span>.presenter.<span class="fn">onLoginClique</span>());
  }

  <span class="fn">getEmail</span>():      <span class="ty">string</span> { <span class="kw">return</span> (document.<span class="fn">getElementById</span>(<span class="str">'email'</span>) <span class="kw">as</span> <span class="ty">HTMLInputElement</span>).value; }
  <span class="fn">getMotDePasse</span>(): <span class="ty">string</span> { <span class="kw">return</span> (document.<span class="fn">getElementById</span>(<span class="str">'mdp'</span>)   <span class="kw">as</span> <span class="ty">HTMLInputElement</span>).value; }

  <span class="fn">afficherChargement</span>(visible: <span class="ty">boolean</span>): <span class="ty">void</span> {
    document.<span class="fn">getElementById</span>(<span class="str">'spinner'</span>)!.style.display = visible ? <span class="str">'block'</span> : <span class="str">'none'</span>;
  }

  <span class="fn">afficherErreur</span>(message: <span class="ty">string</span>): <span class="ty">void</span> {
    <span class="kw">const</span> el = document.<span class="fn">getElementById</span>(<span class="str">'erreur'</span>)!;
    el.textContent = message;
    el.style.display = <span class="str">'block'</span>;
  }

  <span class="fn">afficherSucces</span>(u: <span class="ty">Utilisateur</span>): <span class="ty">void</span> {
    window.location.href = <span class="str">\`/bienvenue?nom=\${u.nom}\`</span>;
  }
}`

const codeBlockMvpTest = `<span class="cm">// MockLoginView impl\u00e9mente ILoginView \u2014 c'est un espion</span>
<span class="kw">class</span> <span class="ty">MockLoginView</span> <span class="kw">implements</span> <span class="ty">ILoginView</span> {
  erreurAffichee  = <span class="str">''</span>;
  chargementVisible = <span class="kw">false</span>;
  utilisateurConnecte: <span class="ty">Utilisateur</span> | <span class="kw">null</span> = <span class="kw">null</span>;

  <span class="fn">afficherChargement</span>(v: <span class="ty">boolean</span>) { <span class="kw">this</span>.chargementVisible = v; }
  <span class="fn">afficherErreur</span>(msg: <span class="ty">string</span>)     { <span class="kw">this</span>.erreurAffichee = msg; }
  <span class="fn">afficherSucces</span>(u: <span class="ty">Utilisateur</span>)  { <span class="kw">this</span>.utilisateurConnecte = u; }
  <span class="fn">getEmail</span>()      { <span class="kw">return</span> <span class="str">'test@test.com'</span>; }
  <span class="fn">getMotDePasse</span>() { <span class="kw">return</span> <span class="str">'1234'</span>; }
}

<span class="cm">// Test unitaire \u2014 pas besoin de navigateur, de DOM, ni de serveur</span>
<span class="fn">test</span>(<span class="str">'affiche une erreur si email vide'</span>, <span class="kw">async</span> () =&gt; {
  <span class="kw">const</span> mock = <span class="kw">new</span> <span class="ty">MockLoginView</span>();
  jest.<span class="fn">spyOn</span>(mock, <span class="str">'getEmail'</span>).<span class="fn">mockReturnValue</span>(<span class="str">''</span>);
  <span class="kw">const</span> presenter = <span class="kw">new</span> <span class="ty">LoginPresenter</span>(mock, <span class="kw">new</span> <span class="ty">AuthService</span>());

  <span class="kw">await</span> presenter.<span class="fn">onLoginClique</span>();

  <span class="fn">expect</span>(mock.erreurAffichee).<span class="fn">toBe</span>(<span class="str">'Email et mot de passe requis'</span>);
  <span class="fn">expect</span>(mock.chargementVisible).<span class="fn">toBe</span>(<span class="kw">false</span>);
});`

/* ── MVVM Code Blocks ─────────────────────────────────────────────── */

const codeBlockObservable = `<span class="cm">// Observable g\u00e9n\u00e9rique \u2014 comprendre le m\u00e9canisme sans framework</span>
<span class="kw">class</span> <span class="ty">Observable</span>&lt;<span class="ty">T</span>&gt; {
  <span class="kw">private</span> valeur: <span class="ty">T</span>;
  <span class="kw">private</span> abonnes: <span class="ty">Array</span>&lt;(val: <span class="ty">T</span>) =&gt; <span class="ty">void</span>&gt; = [];

  <span class="kw">constructor</span>(valeurInitiale: <span class="ty">T</span>) { <span class="kw">this</span>.valeur = valeurInitiale; }

  <span class="fn">get</span>(): <span class="ty">T</span> { <span class="kw">return</span> <span class="kw">this</span>.valeur; }

  <span class="fn">set</span>(nouvelleValeur: <span class="ty">T</span>): <span class="ty">void</span> {
    <span class="kw">this</span>.valeur = nouvelleValeur;
    <span class="kw">this</span>.abonnes.<span class="fn">forEach</span>(fn =&gt; <span class="fn">fn</span>(nouvelleValeur)); <span class="cm">// notifie tous les abonn\u00e9s</span>
  }

  <span class="fn">abonner</span>(fn: (val: <span class="ty">T</span>) =&gt; <span class="ty">void</span>): <span class="ty">void</span> {
    <span class="kw">this</span>.abonnes.<span class="fn">push</span>(fn);
    <span class="fn">fn</span>(<span class="kw">this</span>.valeur); <span class="cm">// \u00e9mission imm\u00e9diate de la valeur actuelle</span>
  }
}`

const codeBlockMvvmViewModel = `<span class="cm">// VIEWMODEL \u2014 expose des Observables</span>
<span class="cm">// Ne conna\u00eet PAS le DOM \u2014 aucun import UI</span>
<span class="kw">class</span> <span class="ty">CompteurViewModel</span> {
  <span class="kw">readonly</span> compteur = <span class="kw">new</span> <span class="ty">Observable</span>&lt;<span class="ty">number</span>&gt;(<span class="num">0</span>);
  <span class="kw">readonly</span> message  = <span class="kw">new</span> <span class="ty">Observable</span>&lt;<span class="ty">string</span>&gt;(<span class="str">'Pr\u00eat'</span>);

  <span class="fn">incrementer</span>(): <span class="ty">void</span> {
    <span class="kw">const</span> n = <span class="kw">this</span>.compteur.<span class="fn">get</span>() + <span class="num">1</span>;
    <span class="kw">this</span>.compteur.<span class="fn">set</span>(n);
    <span class="kw">this</span>.message.<span class="fn">set</span>(n &gt;= <span class="num">10</span> ? <span class="str">'Objectif atteint !'</span> : <span class="str">\`Plus que \${<span class="num">10</span> - n} clics\`</span>);
  }

  <span class="fn">reinitialiser</span>(): <span class="ty">void</span> {
    <span class="kw">this</span>.compteur.<span class="fn">set</span>(<span class="num">0</span>);
    <span class="kw">this</span>.message.<span class="fn">set</span>(<span class="str">'R\u00e9initialis\u00e9'</span>);
  }
}`

const codeBlockMvvmView = `<span class="cm">// VIEW \u2014 s'abonne aux Observables, aucune logique m\u00e9tier</span>
<span class="kw">class</span> <span class="ty">CompteurView</span> {
  <span class="kw">private</span> vm = <span class="kw">new</span> <span class="ty">CompteurViewModel</span>();

  <span class="kw">constructor</span>() {
    <span class="kw">const</span> affichageCompteur = document.<span class="fn">getElementById</span>(<span class="str">'compteur'</span>)!;
    <span class="kw">const</span> affichageMessage  = document.<span class="fn">getElementById</span>(<span class="str">'message'</span>)!;

    <span class="cm">// BINDING \u2014 l'UI se met \u00e0 jour automatiquement \u00e0 chaque changement</span>
    <span class="kw">this</span>.vm.compteur.<span class="fn">abonner</span>(val  =&gt; affichageCompteur.textContent = <span class="ty">String</span>(val));
    <span class="kw">this</span>.vm.message.<span class="fn">abonner</span>(msg  =&gt; affichageMessage.textContent  = msg);

    <span class="cm">// Events \u2192 d\u00e9l\u00e9gu\u00e9s au ViewModel (commandes)</span>
    document.<span class="fn">getElementById</span>(<span class="str">'btn-plus'</span>)!
      .<span class="fn">addEventListener</span>(<span class="str">'click'</span>, () =&gt; <span class="kw">this</span>.vm.<span class="fn">incrementer</span>());
    document.<span class="fn">getElementById</span>(<span class="str">'btn-reset'</span>)!
      .<span class="fn">addEventListener</span>(<span class="str">'click'</span>, () =&gt; <span class="kw">this</span>.vm.<span class="fn">reinitialiser</span>());
  }
}

<span class="kw">new</span> <span class="ty">CompteurView</span>();`

const codeBlockMvvmReactVm = `<span class="cm">// MODEL \u2014 service de donn\u00e9es pur</span>
<span class="kw">interface</span> <span class="ty">Article</span> { id: <span class="ty">number</span>; titre: <span class="ty">string</span>; auteur: <span class="ty">string</span>; }

<span class="kw">class</span> <span class="ty">ArticleService</span> {
  <span class="kw">async</span> <span class="fn">getAll</span>(): <span class="ty">Promise</span>&lt;<span class="ty">Article</span>[]&gt; {
    <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/articles'</span>);
    <span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="ty">Error</span>(<span class="str">'Erreur r\u00e9seau'</span>);
    <span class="kw">return</span> res.<span class="fn">json</span>();
  }
  <span class="kw">async</span> <span class="fn">supprimer</span>(id: <span class="ty">number</span>): <span class="ty">Promise</span>&lt;<span class="ty">void</span>&gt; {
    <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">\`/api/articles/\${id}\`</span>, { method: <span class="str">'DELETE'</span> });
  }
}

<span class="cm">// VIEWMODEL \u2014 hook React = \u00e9tat observable</span>
<span class="cm">// La View s'abonne \u00e0 ce hook, jamais au service directement</span>
<span class="kw">function</span> <span class="fn">useArticlesViewModel</span>() {
  <span class="kw">const</span> [articles, setArticles] = <span class="fn">useState</span>&lt;<span class="ty">Article</span>[]&gt;([]);
  <span class="kw">const</span> [chargement, setChargement] = <span class="fn">useState</span>(<span class="kw">false</span>);
  <span class="kw">const</span> [erreur, setErreur] = <span class="fn">useState</span>&lt;<span class="ty">string</span> | <span class="kw">null</span>&gt;(<span class="kw">null</span>);

  <span class="kw">const</span> service = <span class="fn">useMemo</span>(() =&gt; <span class="kw">new</span> <span class="ty">ArticleService</span>(), []);

  <span class="kw">const</span> charger = <span class="fn">useCallback</span>(<span class="kw">async</span> () =&gt; {
    <span class="fn">setChargement</span>(<span class="kw">true</span>);
    <span class="kw">try</span> {
      <span class="fn">setArticles</span>(<span class="kw">await</span> service.<span class="fn">getAll</span>());
    } <span class="kw">catch</span> (e) {
      <span class="fn">setErreur</span>((e <span class="kw">as</span> <span class="ty">Error</span>).message);
    } <span class="kw">finally</span> {
      <span class="fn">setChargement</span>(<span class="kw">false</span>);
    }
  }, [service]);

  <span class="kw">const</span> supprimer = <span class="fn">useCallback</span>(<span class="kw">async</span> (id: <span class="ty">number</span>) =&gt; {
    <span class="kw">await</span> service.<span class="fn">supprimer</span>(id);
    <span class="fn">setArticles</span>(prev =&gt; prev.<span class="fn">filter</span>(a =&gt; a.id !== id));
  }, [service]);

  <span class="fn">useEffect</span>(() =&gt; { <span class="fn">charger</span>(); }, [charger]);

  <span class="kw">return</span> { articles, chargement, erreur, supprimer }; <span class="cm">// \u00e9tat en lecture seule</span>
}`

const codeBlockMvvmReactView = `<span class="cm">// VIEW \u2014 z\u00e9ro logique m\u00e9tier, observe et r\u00e9agit</span>
<span class="cm">// Elle NE SAIT PAS comment les donn\u00e9es arrivent</span>
<span class="kw">const</span> <span class="ty">ArticlesView</span>: <span class="ty">React.FC</span> = () =&gt; {
  <span class="kw">const</span> { articles, chargement, erreur, supprimer } = <span class="fn">useArticlesViewModel</span>();

  <span class="kw">if</span> (chargement) <span class="kw">return</span> &lt;<span class="ty">Spinner</span> /&gt;;
  <span class="kw">if</span> (erreur)     <span class="kw">return</span> &lt;<span class="ty">Erreur</span> texte={erreur} /&gt;;

  <span class="kw">return</span> (
    &lt;<span class="ty">ul</span>&gt;
      {articles.<span class="fn">map</span>(article =&gt; (
        &lt;<span class="ty">li</span> key={article.id}&gt;
          &lt;<span class="ty">strong</span>&gt;{article.titre}&lt;/<span class="ty">strong</span>&gt; \u2014 {article.auteur}
          &lt;<span class="ty">button</span> onClick={() =&gt; <span class="fn">supprimer</span>(article.id)}&gt;Supprimer&lt;/<span class="ty">button</span>&gt;
        &lt;/<span class="ty">li</span>&gt;
      ))}
    &lt;/<span class="ty">ul</span>&gt;
  );
};`

/* ── Section 05 \u2014 Diff Code Block ──────────────────────────────────── */

const codeBlockDiff = `<span class="cm">// MVC \u2014 le Controller POUSSE les donn\u00e9es \u00e0 la View</span>
view.<span class="fn">render</span>(model.<span class="fn">getData</span>());

<span class="cm">// MVP \u2014 le Presenter DIT \u00e0 la View quoi afficher (via interface)</span>
<span class="kw">this</span>.view.<span class="fn">afficherArticles</span>(articles);           <span class="cm">// \u2190 appel explicite</span>

<span class="cm">// MVVM \u2014 la View S'ABONNE et r\u00e9agit toute seule</span>
viewModel.articles.<span class="fn">abonner</span>(articles =&gt; <span class="kw">this</span>.<span class="fn">render</span>(articles));
<span class="cm">//                 ^^^^^^^^^^^^^^^^^^ Binding automatique \u2014 z\u00e9ro appel explicite</span>`

/* ── Sidebar navigation ── */

const sidebarGroups: NavGroup[] = [
  {
    label: 'Introduction',
    links: [
      { id: 'metaphore', label: 'La m\u00e9taphore' },
    ],
  },
  {
    label: 'Patterns',
    links: [
      { id: 'mvc', label: 'MVC' },
      { id: 'mvp', label: 'MVP' },
      { id: 'mvvm', label: 'MVVM' },
    ],
  },
  {
    label: 'Synth\u00e8se',
    links: [
      { id: 'difference', label: 'Diff\u00e9rence fondamentale' },
      { id: 'comparatif', label: 'Comparatif' },
      { id: 'choix', label: 'Quel pattern choisir ?' },
    ],
  },
]

useHead({
  title: 'Patterns de Pr\u00e9sentation \u2014 MVC \u00b7 MVP \u00b7 MVVM',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Patterns de Pr\u00e9sentation \u2014 MVC \u00b7 MVP \u00b7 MVVM',
        description:
          'Comparaison compl\u00e8te des patterns MVC, MVP et MVVM \u2014 principes, sch\u00e9mas, m\u00e9taphores et exemples TypeScript selon les principes de Robert C. Martin.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/presentation-patterns',
        author: {
          '@type': 'Person',
          name: 'Robert C. Martin (Uncle Bob)',
        },
      }),
    },
  ],
})

useSeoMeta({
  description:
    'Comparaison compl\u00e8te des patterns MVC, MVP et MVVM \u2014 principes, sch\u00e9mas, m\u00e9taphores et exemples TypeScript selon les principes de Robert C. Martin.',
  ogTitle: 'Patterns de Pr\u00e9sentation \u2014 MVC \u00b7 MVP \u00b7 MVVM',
  ogDescription:
    'Comparaison compl\u00e8te des patterns MVC, MVP et MVVM \u2014 principes, sch\u00e9mas, m\u00e9taphores et exemples TypeScript selon les principes de Robert C. Martin.',
  ogType: 'article',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/presentation-patterns',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Patterns de Pr\u00e9sentation \u2014 MVC \u00b7 MVP \u00b7 MVVM',
  twitterDescription:
    'Comparaison compl\u00e8te des patterns MVC, MVP et MVVM \u2014 principes, sch\u00e9mas, m\u00e9taphores et exemples TypeScript selon les principes de Robert C. Martin.',
})
</script>

<template>
  <div class="page">
    <SideBar
      eyebrow="// Engineering Handbook"
      title="MVC &middot; MVP<br>MVVM"
      :groups="sidebarGroups"
      accent-color="#9a4ae8"
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
      <div class="eyebrow">// Patterns de Pr&eacute;sentation &mdash; R&eacute;f&eacute;rence compl&egrave;te</div>
      <h1>MVC &middot; MVP<br><em>MVVM</em></h1>
      <p class="subtitle">
        Les trois patterns de la couche de pr&eacute;sentation &mdash; principes, sch&eacute;mas,
        m&eacute;taphores et exemples TypeScript complets selon les principes de Robert C. Martin.
      </p>
    </header>

    <!-- Quote box -->
    <div class="quote-box">
      <div class="quote-icon">&#x1F4D6;</div>
      <div class="quote-content">
        <h3>Uncle Bob &mdash; Clean Architecture</h3>
        <p>
          Les patterns MVC, MVP et MVVM ne sont que des <em>d&eacute;tails de la couche de
          pr&eacute;sentation</em>. Dans une Clean Architecture, ils sont rel&eacute;gu&eacute;s au rang
          de &ldquo;Plugin UI&rdquo;. Le domaine m&eacute;tier &mdash; Use Cases et Entities &mdash; ne
          doit <em>jamais</em> d&eacute;pendre du pattern qui orchestre son affichage. Ce qui importe,
          c&rsquo;est que <em>les d&eacute;pendances pointent toujours vers l&rsquo;int&eacute;rieur</em>.
        </p>
      </div>
    </div>

    <!-- Section 01 : La métaphore du restaurant -->
    <section id="metaphore" class="section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">La m&eacute;taphore du restaurant</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Avant de plonger dans les sch&eacute;mas, une m&eacute;taphore qui unifie les trois patterns.
          Imagine un <strong>restaurant gastronomique</strong>. Le client (l&rsquo;Utilisateur) ne va
          jamais en cuisine. Il interagit avec une interface (la salle). La cuisine pr&eacute;pare les
          donn&eacute;es (le Model).
        </p>
        <p>
          Ce qui change entre MVC, MVP et MVVM, c&rsquo;est <em>qui orchestre</em>,
          <em>qui parle &agrave; qui</em>, et <em>qui porte la responsabilit&eacute;</em> de la logique
          de pr&eacute;sentation.
        </p>
      </div>

      <div class="cards-3">
        <article
          v-for="card in metaphorCards"
          :key="card.name"
          class="card"
          :class="card.colorClass"
        >
          <span class="card-icon">{{ card.icon }}</span>
          <div class="card-name">{{ card.name }}</div>
          <div class="card-title">{{ card.title }}</div>
          <div class="card-desc">{{ card.description }}</div>
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

    <!-- Section 02 : MVC -->
    <section id="mvc" class="section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">MVC &mdash; Model View Controller</h2>
        <div class="section-line" />
      </div>

      <!-- Metaphor box -->
      <div class="metaphor-box">
        <span class="meta-label">M&eacute;taphore</span>
        Le <strong>Controller</strong> est le ma&icirc;tre d&rsquo;h&ocirc;tel. Il re&ccedil;oit ta
        commande (action utilisateur), la passe en cuisine (Model) et dit &agrave; la salle comment
        dresser la table (View). Probl&egrave;me : la salle <strong>peut regarder directement dans la
        cuisine</strong> &mdash; c&rsquo;est le couplage View &rarr; Model, la faille principale du
        pattern.
      </div>

      <!-- Pattern diagram -->
      <div class="pattern-diagram">
        <div class="pd-node pd-user">
          <div class="pd-box">Utilisateur</div>
          <div class="pd-sub">Action UI</div>
        </div>
        <div class="pd-arrow">
          <span class="arr">&rarr;</span>
          <span class="arr-txt">1. action</span>
        </div>
        <div class="pd-node pd-controller">
          <div class="pd-box">Controller</div>
          <div class="pd-sub">Orchestre les actions</div>
        </div>
        <div class="pd-arrow">
          <span class="arr">&rarr;</span>
          <span class="arr-txt">2. met &agrave; jour</span>
        </div>
        <div class="pd-node pd-model">
          <div class="pd-box">Model</div>
          <div class="pd-sub">Donn&eacute;es + logique m&eacute;tier</div>
        </div>
        <div class="pd-arrow">
          <span class="arr">&rarr;</span>
          <span class="arr-txt">3. notifie</span>
        </div>
        <div class="pd-node pd-view">
          <div class="pd-box">View</div>
          <div class="pd-sub">Affichage UI</div>
        </div>
        <div class="pd-arrow">
          <span class="arr">&rarr;</span>
          <span class="arr-txt">4. affiche</span>
        </div>
        <div class="pd-node pd-user">
          <div class="pd-box">Utilisateur</div>
          <div class="pd-sub">Voit le r&eacute;sultat</div>
        </div>
      </div>

      <div class="prose">
        <p>
          Le Controller est le <strong>pivot central</strong>. Il re&ccedil;oit les actions
          (requ&ecirc;tes HTTP, clics), interroge ou modifie le Model, puis s&eacute;lectionne la View
          &agrave; rendre. La View peut parfois observer le Model directement &mdash; ce qui cr&eacute;e
          un couplage ind&eacute;sirable.
        </p>
      </div>

      <!-- Flow diagram -->
      <div class="flow-diagram">
        <div
          v-for="step in mvcFlowSteps"
          :key="step.num"
          class="flow-step"
          :style="{ background: step.bgColor }"
        >
          <div class="flow-num" :style="{ color: step.textColor }">{{ step.num }}</div>
          <div>
            <div class="flow-label" :style="{ color: step.textColor }">{{ step.label }}</div>
            <div class="flow-desc">{{ step.description }}</div>
          </div>
        </div>
      </div>

      <!-- MVC code blocks -->
      <div class="code-filename">model/ArticleModel.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block green-left" v-html="codeBlockMvcModel" />

      <div class="code-filename">view/ArticleView.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block orange-left" v-html="codeBlockMvcView" />

      <div class="code-filename">controller/ArticleController.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block purple-left" v-html="codeBlockMvcController" />

      <!-- MVC Pros / Cons -->
      <div class="two-col">
        <div
          v-for="col in mvcProsCons"
          :key="col.headerLabel"
          class="col-box"
        >
          <div
            class="col-box-header"
            :style="{ color: col.headerColor, background: col.bgColor }"
          >
            {{ col.headerLabel }}
          </div>
          <div class="col-box-body">
            <div
              v-for="(item, i) in col.items"
              :key="i"
              class="col-item"
            >
              <div class="col-dot" :style="{ background: col.dotColor }" />
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 03 : MVP -->
    <section id="mvp" class="section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">MVP &mdash; Model View Presenter</h2>
        <div class="section-line" />
      </div>

      <!-- Metaphor box -->
      <div class="metaphor-box">
        <span class="meta-label">M&eacute;taphore</span>
        La <strong>View dans MVP est une marionnette</strong>. Elle ne fait rien par elle-m&ecirc;me.
        Le <strong>Presenter tire les ficelles</strong> : il d&eacute;cide de tout, dit exactement quoi
        afficher, et la View ob&eacute;it. Le Presenter ne conna&icirc;t la View que via une
        <strong>interface</strong> (un contrat) &mdash; il ne sait m&ecirc;me pas si c&rsquo;est une vraie
        UI ou un mock de test. C&rsquo;est l&agrave; toute la puissance du MVP.
      </div>

      <!-- Pattern diagram -->
      <div class="pattern-diagram">
        <div class="pd-node pd-user">
          <div class="pd-box">Utilisateur</div>
          <div class="pd-sub">Action UI</div>
        </div>
        <div class="pd-arrow">
          <span class="arr">&rarr;</span>
          <span class="arr-txt">1. action</span>
        </div>
        <div class="pd-node pd-view">
          <div class="pd-box">View</div>
          <div class="pd-sub">Passive &mdash; d&eacute;l&egrave;gue tout</div>
        </div>
        <div class="pd-arrow dashed">
          <span class="arr">&hArr;</span>
          <span class="arr-txt">2. via IView</span>
        </div>
        <div class="pd-node pd-presenter">
          <div class="pd-box">Presenter</div>
          <div class="pd-sub">Toute la logique de pr&eacute;sentation</div>
        </div>
        <div class="pd-arrow dashed">
          <span class="arr">&hArr;</span>
          <span class="arr-txt">3. lit / &eacute;crit</span>
        </div>
        <div class="pd-node pd-model">
          <div class="pd-box">Model</div>
          <div class="pd-sub">Donn&eacute;es + m&eacute;tier</div>
        </div>
      </div>

      <!-- Rule banner -->
      <div class="rule-banner">
        <strong>R&egrave;gle fondamentale MVP :</strong> La View impl&eacute;mente une interface
        (<code>IView</code>). Le Presenter ne r&eacute;f&eacute;rence <strong>jamais</strong> la View
        concr&egrave;te &mdash; seulement l&rsquo;interface. Cette s&eacute;paration est le fondement de
        la testabilit&eacute; totale.
      </div>

      <!-- MVP code blocks -->
      <div class="code-filename">view/ILoginView.ts &mdash; Le contrat strict</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block red-left" v-html="codeBlockMvpInterface" />

      <div class="code-filename">model/AuthService.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block green-left" v-html="codeBlockMvpModel" />

      <div class="code-filename">presenter/LoginPresenter.ts &mdash; Toute la logique ici</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block purple-left" v-html="codeBlockMvpPresenter" />

      <div class="code-filename">view/LoginView.ts &mdash; La marionnette</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block orange-left" v-html="codeBlockMvpView" />

      <!-- Info box: testing -->
      <div class="info-box">
        <strong>La puissance du test MVP</strong> &mdash; Voici pourquoi l&rsquo;interface
        <code>ILoginView</code> est un superpouvoir : on peut tester <em>toute la logique de
        pr&eacute;sentation sans d&eacute;marrer le DOM</em>.
      </div>

      <div class="code-filename">tests/LoginPresenter.test.ts &mdash; Zero DOM, zero infra</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockMvpTest" />

      <!-- MVP Pros / Cons -->
      <div class="two-col">
        <div
          v-for="col in mvpProsCons"
          :key="col.headerLabel"
          class="col-box"
        >
          <div
            class="col-box-header"
            :style="{ color: col.headerColor, background: col.bgColor }"
          >
            {{ col.headerLabel }}
          </div>
          <div class="col-box-body">
            <div
              v-for="(item, i) in col.items"
              :key="i"
              class="col-item"
            >
              <div class="col-dot" :style="{ background: col.dotColor }" />
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 04 : MVVM -->
    <section id="mvvm" class="section">
      <div class="section-header">
        <span class="section-number">04</span>
        <h2 class="section-title">MVVM &mdash; Model View ViewModel</h2>
        <div class="section-line" />
      </div>

      <!-- Metaphor box -->
      <div class="metaphor-box">
        <span class="meta-label">M&eacute;taphore</span>
        Imagine un <strong>tableau de bord dans une salle de march&eacute;</strong>. Le
        <strong>ViewModel</strong> est le serveur de donn&eacute;es qui publie des informations en temps
        r&eacute;el. Le tableau (View) s&rsquo;abonne automatiquement : d&egrave;s qu&rsquo;une
        donn&eacute;e change, l&rsquo;affichage se met &agrave; jour <strong>sans qu&rsquo;on lui
        demande</strong>. La View ne tire pas les donn&eacute;es &mdash; elle <strong>observe et
        r&eacute;agit</strong>. C&rsquo;est le <em>Data Binding</em>.
      </div>

      <!-- Pattern diagram -->
      <div class="pattern-diagram">
        <div class="pd-node pd-user">
          <div class="pd-box">Utilisateur</div>
          <div class="pd-sub">Interagit</div>
        </div>
        <div class="pd-arrow dashed">
          <span class="arr">&hArr;</span>
          <span class="arr-txt">binding bidir.</span>
        </div>
        <div class="pd-node pd-view">
          <div class="pd-box">View</div>
          <div class="pd-sub">D&eacute;clarative / S&rsquo;abonne</div>
        </div>
        <div class="pd-arrow dashed">
          <span class="arr">&hArr;</span>
          <span class="arr-txt">observe / commandes</span>
        </div>
        <div class="pd-node pd-viewmodel">
          <div class="pd-box">ViewModel</div>
          <div class="pd-sub">&Eacute;tat observable / Z&eacute;ro ref. View</div>
        </div>
        <div class="pd-arrow dashed">
          <span class="arr">&hArr;</span>
          <span class="arr-txt">lit / &eacute;crit</span>
        </div>
        <div class="pd-node pd-model">
          <div class="pd-box">Model</div>
          <div class="pd-sub">Donn&eacute;es + m&eacute;tier</div>
        </div>
      </div>

      <!-- Rule banner -->
      <div class="rule-banner">
        <strong>R&egrave;gle fondamentale MVVM :</strong> Le ViewModel expose un <em>&eacute;tat
        observable</em>. Il ne conna&icirc;t jamais la View et ne la r&eacute;f&eacute;rence jamais. La
        View s&rsquo;abonne &agrave; l&rsquo;&eacute;tat &mdash; quand l&rsquo;&eacute;tat change,
        l&rsquo;UI se met &agrave; jour <strong>automatiquement</strong>. C&rsquo;est le contrat du Data
        Binding.
      </div>

      <div class="prose">
        <p>
          Le ViewModel est l&rsquo;<strong>abstraction de l&rsquo;&eacute;tat de la View</strong>. Il
          n&rsquo;a aucune d&eacute;pendance vers l&rsquo;UI &mdash; ni DOM, ni composant, ni framework
          graphique. Il expose des <em>observables</em> (LiveData, Signal, BehaviorSubject,
          useState&hellip;) que la View consomme d&eacute;clarativement.
        </p>
      </div>

      <!-- MVVM code blocks -->
      <div class="code-filename">core/Observable.ts &mdash; Le moteur du MVVM</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockObservable" />

      <div class="code-filename">viewmodel/CompteurViewModel.ts</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block purple-left" v-html="codeBlockMvvmViewModel" />

      <div class="code-filename">view/CompteurView.ts &mdash; S&rsquo;abonne, ne tire jamais</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block orange-left" v-html="codeBlockMvvmView" />

      <!-- Info box: React version -->
      <div class="info-box">
        <strong>Version React / TypeScript</strong> &mdash; Dans React, le hook
        <code>useState</code> + <code>useEffect</code> joue le r&ocirc;le d&rsquo;Observable. Le custom
        hook <em>est</em> le ViewModel.
      </div>

      <div class="code-filename">viewmodel/useArticlesViewModel.ts &mdash; Hook = ViewModel</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block purple-left" v-html="codeBlockMvvmReactVm" />

      <div class="code-filename">view/ArticlesView.tsx &mdash; 100% d&eacute;clarative</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block orange-left" v-html="codeBlockMvvmReactView" />

      <!-- MVVM Pros / Cons -->
      <div class="two-col">
        <div
          v-for="col in mvvmProsCons"
          :key="col.headerLabel"
          class="col-box"
        >
          <div
            class="col-box-header"
            :style="{ color: col.headerColor, background: col.bgColor }"
          >
            {{ col.headerLabel }}
          </div>
          <div class="col-box-body">
            <div
              v-for="(item, i) in col.items"
              :key="i"
              class="col-item"
            >
              <div class="col-dot" :style="{ background: col.dotColor }" />
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 05 : La différence fondamentale en 3 lignes -->
    <section id="difference" class="section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">La diff&eacute;rence fondamentale en 3 lignes</h2>
        <div class="section-line" />
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="code-block" v-html="codeBlockDiff" />
    </section>

    <!-- Section 06 : Comparatif synthétique -->
    <section id="comparatif" class="section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Comparatif synth&eacute;tique</h2>
        <div class="section-line" />
      </div>

      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Crit&egrave;re</th>
              <th class="th-orange">MVC</th>
              <th class="th-purple">MVP</th>
              <th class="th-blue">MVVM</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in comparisonRows"
              :key="i"
            >
              <td class="criterion">{{ row.criterion }}</td>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <td :class="row.mvcColor" v-html="row.mvc" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <td :class="row.mvpColor" v-html="row.mvp" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <td :class="row.mvvmColor" v-html="row.mvvm" />
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section 07 : Quel pattern choisir ? -->
    <section id="choix" class="section">
      <div class="section-header">
        <span class="section-number">07</span>
        <h2 class="section-title">Quel pattern choisir ?</h2>
        <div class="section-line" />
      </div>

      <div class="prose">
        <p>
          Selon Robert C. Martin, <strong>l&rsquo;architecture doit servir le cas d&rsquo;usage, pas
          l&rsquo;ego du d&eacute;veloppeur</strong>. Ces patterns sont des d&eacute;tails &mdash;
          choisir le bon d&eacute;pend du contexte, du framework impos&eacute;, et des contraintes de
          testabilit&eacute;.
        </p>
      </div>

      <div class="cards">
        <article
          v-for="card in decisionCards"
          :key="card.name"
          class="card"
          :class="card.colorClass"
        >
          <span class="card-icon">{{ card.icon }}</span>
          <div class="card-name">{{ card.name }}</div>
          <div class="card-title">{{ card.title }}</div>
          <div class="card-desc">{{ card.description }}</div>
          <div class="card-tags">
            <span
              v-for="tag in card.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          <blockquote class="card-quote">{{ card.quote }}</blockquote>
        </article>
      </div>

      <!-- Warn box -->
      <div class="warn-box">
        <strong>Rappel Uncle Bob &mdash; Clean Architecture :</strong> Ces trois patterns sont des
        <em>d&eacute;tails d&rsquo;impl&eacute;mentation</em> de la couche de pr&eacute;sentation.
        Dans une Clean Architecture, ils sont rel&eacute;gu&eacute;s au rang de &ldquo;Plugin
        UI&rdquo;. Le domaine m&eacute;tier &mdash; Use Cases et Entities &mdash; ne doit
        <strong>jamais</strong> en d&eacute;pendre. Le vrai d&eacute;couplage, c&rsquo;est que le Model
        ignore totalement quel pattern orchestre son affichage.
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

/* Cards (auto-fill) */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

/* Cards 3-column */
.cards-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
.cyan   { --card-accent: #4ae8e8; }

/* Pattern diagram (horizontal flow) */
.pattern-diagram {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 32px 0;
  overflow-x: auto;
  padding-bottom: 4px;
}

.pd-node {
  flex-shrink: 0;
  text-align: center;
}

.pd-box {
  padding: 12px 18px;
  border-radius: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  border: 1px solid;
  line-height: 1.4;
}

.pd-sub {
  font-size: 0.7rem;
  color: var(--muted);
  margin-top: 4px;
  font-family: 'DM Sans', sans-serif;
}

.pd-arrow {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8px;
  gap: 2px;
}

.pd-arrow .arr {
  font-size: 1.1rem;
  color: var(--accent2);
}

.pd-arrow .arr-txt {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.08em;
}

.pd-arrow.dashed .arr {
  color: var(--accent);
}

/* Node colors */
.pd-user .pd-box {
  color: #4a9ee8;
  border-color: rgba(74,158,232,0.4);
  background: rgba(74,158,232,0.08);
}

.pd-controller .pd-box {
  color: #a78bfa;
  border-color: rgba(167,139,250,0.4);
  background: rgba(167,139,250,0.08);
}

.pd-model .pd-box {
  color: #4ae8b0;
  border-color: rgba(74,232,176,0.4);
  background: rgba(74,232,176,0.08);
}

.pd-view .pd-box {
  color: #e87a4a;
  border-color: rgba(232,122,74,0.4);
  background: rgba(232,122,74,0.08);
}

.pd-presenter .pd-box {
  color: #a78bfa;
  border-color: rgba(167,139,250,0.4);
  background: rgba(167,139,250,0.08);
}

.pd-viewmodel .pd-box {
  color: #a78bfa;
  border-color: rgba(167,139,250,0.4);
  background: rgba(167,139,250,0.08);
}

.pd-iface .pd-box {
  color: #e84a7a;
  border-color: rgba(232,74,122,0.4);
  background: rgba(232,74,122,0.08);
}

/* Flow diagram (vertical) */
.flow-diagram {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 28px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}

.flow-step:last-child { border-bottom: none; }
.flow-step:hover { filter: brightness(1.15); }

.flow-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.4rem;
  font-weight: 700;
  flex-shrink: 0;
  width: 40px;
  text-align: center;
}

.flow-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.flow-desc {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.5;
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
.code-block :deep(.num) { color: #e87a4a; }

.code-block.green-left  { border-left-color: #4ae8b0; }
.code-block.purple-left { border-left-color: #a78bfa; }
.code-block.blue-left   { border-left-color: #4a9ee8; }
.code-block.orange-left { border-left-color: #e87a4a; }
.code-block.red-left    { border-left-color: #e84a7a; }

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
.info-box em { color: var(--accent); font-style: italic; }

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
.warn-box em { color: var(--accent); font-style: italic; }

/* Metaphor box */
.metaphor-box {
  background: linear-gradient(135deg, rgba(232,200,74,0.04), rgba(167,139,250,0.04));
  border: 1px solid rgba(232,200,74,0.15);
  border-radius: 8px;
  padding: 22px 24px;
  margin: 24px 0;
  font-size: 0.875rem;
  color: var(--text);
  line-height: 1.75;
  position: relative;
}

.metaphor-box strong { color: var(--white); font-weight: 500; }
.metaphor-box em { color: var(--accent); font-style: italic; }

.meta-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--bg);
  border: 1px solid rgba(232,200,74,0.2);
  border-radius: 3px;
  padding: 2px 8px;
  position: absolute;
  top: -10px;
  left: 16px;
}

/* Two columns (pros/cons) */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 28px 0;
}

.col-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.col-box-header {
  padding: 14px 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}

.col-box-body {
  padding: 16px 20px;
}

.col-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text);
}

.col-item:last-child { margin-bottom: 0; }

.col-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 7px;
}

/* Comparison table */
.comparison-table-wrapper {
  overflow-x: auto;
  margin: 24px 0;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.85rem;
}

.comparison-table th,
.comparison-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}

.comparison-table thead th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--surface);
  color: var(--muted);
  border-bottom: 2px solid var(--border);
}

.comparison-table .th-orange { color: #e87a4a; }
.comparison-table .th-purple { color: #a78bfa; }
.comparison-table .th-blue   { color: #4a9ee8; }

.comparison-table tbody tr {
  transition: background 0.15s;
}

.comparison-table tbody tr:hover {
  background: rgba(255,255,255,0.02);
}

.comparison-table tbody tr:last-child td {
  border-bottom: none;
}

.comparison-table td {
  color: var(--text);
}

.comparison-table .criterion {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--white);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.comparison-table .tg { color: #4ae8b0; }
.comparison-table .to { color: #e87a4a; }
.comparison-table .tr { color: #e84a7a; }
.comparison-table .tp { color: #a78bfa; }
.comparison-table .tb { color: #4a9ee8; }

/* Inline code */
.section :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

.rule-banner :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
}

.info-box :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82em;
  color: var(--accent2);
  background: rgba(74,232,176,0.08);
  padding: 1px 6px;
  border-radius: 3px;
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

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.10s; }
.card:nth-child(3) { animation-delay: 0.15s; }

/* Responsive */
@media (max-width: 900px) {
  .main { margin-left: 0; }
}

@media (max-width: 768px) {
  .cards-3 {
    grid-template-columns: 1fr;
  }
  .two-col {
    grid-template-columns: 1fr;
  }
  .pattern-diagram {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
}

@media (max-width: 640px) {
  .comparison-table {
    font-size: 0.75rem;
  }
  .comparison-table th,
  .comparison-table td {
    padding: 8px 10px;
  }
  .comparison-table .criterion {
    font-size: 0.7rem;
  }
}
</style>
