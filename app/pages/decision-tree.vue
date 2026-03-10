<script setup lang="ts">
const {
  DIM_COLORS,
  DIM_LABELS,
  ARCHITECTURES,
  history,
  finished,
  currentNodeId,
  currentNode,
  resultNode,
  progress,
  answers,
  answersByDim,
  choose,
  goBack,
  restart,
} = useArchitectureTree()

useHead({
  title: 'Arbre de décision architectural',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Arbre de décision architectural',
        description:
          'Outil interactif pour choisir la bonne architecture logicielle selon 5 dimensions : stade, domaine, organisation, NFR et coût du changement.',
        inLanguage: 'fr',
        url: 'https://architectures-logicielles.fr/decision-tree',
      }),
    },
  ],
})

useSeoMeta({
  title: 'Arbre de décision architectural',
  description:
    'Outil interactif pour choisir la bonne architecture logicielle selon 5 dimensions : stade, domaine, organisation, NFR et coût du changement.',
  ogTitle: 'Arbre de décision architectural',
  ogDescription:
    'Outil interactif pour choisir la bonne architecture logicielle selon 5 dimensions : stade, domaine, organisation, NFR et coût du changement.',
  ogType: 'website',
  ogLocale: 'fr_FR',
  ogUrl: 'https://architectures-logicielles.fr/decision-tree',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Arbre de décision architectural',
  twitterDescription:
    'Outil interactif pour choisir la bonne architecture logicielle selon 5 dimensions.',
})
</script>

<template>
  <div class="adt-container">
    <!-- Header -->
    <header class="adt-header">
      <NuxtLink to="/" class="adt-back-home">&larr; Retour au panorama</NuxtLink>
      <p class="adt-eyebrow">// ARCHITECTURE DECISION TREE &mdash; V2</p>
      <h1 class="adt-title">Quel est votre <em>sch&eacute;ma architectural</em>&nbsp;?</h1>
      <p class="adt-subtitle">
        5 dimensions : stade &middot; domaine &middot; organisation &middot; NFR &middot;
        co&ucirc;t du changement
      </p>
      <div class="adt-dim-pills">
        <span
          v-for="(dim, key) in DIM_LABELS"
          :key="key"
          class="adt-dim-pill"
          :class="{ 'adt-dim-pill--active': answersByDim[key] }"
          :style="
            answersByDim[key]
              ? {
                  color: DIM_COLORS[key],
                  background: DIM_COLORS[key] + '12',
                  borderColor: DIM_COLORS[key] + '40',
                }
              : {}
          "
        >
          {{ dim.icon }} {{ dim.label }} {{ answersByDim[key] ? '✓' : '' }}
        </span>
      </div>
    </header>

    <!-- Progress -->
    <div class="adt-progress-wrap">
      <div class="adt-progress-labels">
        <span>PROGRESSION</span>
        <span class="adt-progress-pct">
          {{ finished ? '100%' : `${Math.round(progress)}%` }}
        </span>
      </div>
      <div class="adt-progress-track">
        <div
          class="adt-progress-fill"
          :style="{ width: finished ? '100%' : `${progress}%` }"
        />
      </div>
    </div>

    <!-- Breadcrumb -->
    <div v-if="answers.length" class="adt-breadcrumb">
      <span
        v-for="(a, i) in answers"
        :key="i"
        class="adt-crumb"
        :style="{ borderColor: (DIM_COLORS[a.dimension] || '#1e2330') + '20' }"
      >
        <span :style="{ color: DIM_COLORS[a.dimension] || '#e8c84a' }">&rarr;</span>
        {{ a.answer }}
      </span>
    </div>

    <!-- Question -->
    <Transition name="adt-fade" mode="out-in">
      <div v-if="!finished" :key="currentNodeId" class="adt-card">
        <div
          class="adt-card-topline"
          :style="{
            background: `linear-gradient(90deg, ${DIM_COLORS[currentNode?.dimension] || '#e8c84a'}50, transparent)`,
          }"
        />

        <!-- Dimension badge -->
        <div
          v-if="currentNode?.dimension"
          class="adt-dim-badge"
          :style="{
            background: (DIM_COLORS[currentNode.dimension] || '#e8c84a') + '12',
            borderColor: (DIM_COLORS[currentNode.dimension] || '#e8c84a') + '30',
            color: DIM_COLORS[currentNode.dimension] || '#e8c84a',
          }"
        >
          {{ DIM_LABELS[currentNode.dimension]?.icon }}
          {{ DIM_LABELS[currentNode.dimension]?.label }}
        </div>

        <p class="adt-question-label">Question {{ history.length }}</p>
        <h2 class="adt-question">{{ currentNode?.question }}</h2>
        <p
          class="adt-context"
          :style="{
            borderLeftColor: (DIM_COLORS[currentNode?.dimension] || '#1e2330') + '40',
          }"
        >
          {{ currentNode?.context }}
        </p>

        <div class="adt-choices">
          <button
            v-for="(choice, i) in currentNode?.choices"
            :key="i"
            class="adt-choice"
            :data-dim="currentNode?.dimension"
            @click="choose(choice)"
          >
            <span class="adt-choice-icon">{{ choice.icon }}</span>
            <div class="adt-choice-text">
              <p class="adt-choice-label">{{ choice.label }}</p>
              <p v-if="choice.sub" class="adt-choice-sub">{{ choice.sub }}</p>
            </div>
            <span class="adt-choice-arrow">&rarr;</span>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-else key="results" class="adt-results">
        <!-- Confidence score -->
        <div class="adt-confidence-card">
          <ConfidenceBar :score="resultNode!.confidence" />
          <p class="adt-rationale-label">✓ Analyse &amp; Rationale</p>
          <p class="adt-rationale-text">{{ resultNode?.rationale }}</p>
        </div>

        <!-- 5 dimensions synthesis -->
        <div class="adt-synthesis">
          <p class="adt-synthesis-title">
            Synth&egrave;se &mdash; 5 dimensions analys&eacute;es
          </p>
          <div class="adt-synthesis-grid">
            <div
              v-for="(dim, key) in DIM_LABELS"
              :key="key"
              class="adt-synthesis-item"
              :class="{ 'adt-synthesis-item--active': answersByDim[key] }"
              :style="answersByDim[key] ? { borderColor: DIM_COLORS[key] + '25' } : {}"
            >
              <p
                class="adt-synthesis-label"
                :style="{ color: answersByDim[key] ? DIM_COLORS[key] : '#6a7090' }"
              >
                {{ dim.icon }} {{ dim.label }}
              </p>
              <template v-if="answersByDim[key]">
                <p
                  v-for="(v, i) in answersByDim[key]"
                  :key="i"
                  class="adt-synthesis-val"
                >
                  &rarr; {{ v }}
                </p>
              </template>
              <p v-else class="adt-synthesis-empty">&mdash; non renseign&eacute;</p>
            </div>
          </div>
        </div>

        <!-- Architecture cards -->
        <div class="adt-arch-list">
          <ArchCard
            v-for="(archId, i) in resultNode!.result"
            :key="archId"
            :arch="ARCHITECTURES[archId]"
            :rank="i"
          />
        </div>
      </div>
    </Transition>

    <!-- Navigation -->
    <div class="adt-nav">
      <button v-if="history.length > 1" class="adt-btn adt-btn--back" @click="goBack">
        &larr; Retour
      </button>
      <button v-if="finished" class="adt-btn adt-btn--restart" @click="restart">
        &circlearrowright; Recommencer
      </button>
    </div>

    <footer class="adt-footer">
      <span>// ARCHITECTURE DECISION TREE &mdash; V2</span>
      <span>
        Clean Architecture &middot; R.C. Martin &nbsp;&middot;&nbsp; DDD &middot; E. Evans
        &nbsp;&middot;&nbsp; Conway's Law
      </span>
    </footer>
  </div>
</template>

<style scoped>
.adt-container {
  max-width: 780px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  position: relative;
  z-index: 1;
}

/* Back link */
.adt-back-home {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  text-decoration: none;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.adt-back-home:hover {
  color: var(--accent);
}

/* Header */
.adt-header {
  border-left: 3px solid var(--accent);
  padding-left: 20px;
  margin-bottom: 44px;
}

.adt-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}

.adt-title {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  color: var(--white);
  line-height: 1.2;
  margin-bottom: 10px;
}

.adt-title em {
  color: var(--accent);
  font-style: italic;
}

.adt-subtitle {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 14px;
}

.adt-dim-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.adt-dim-pill {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px 10px;
  transition: all 0.3s;
}

/* Progress */
.adt-progress-wrap {
  margin-bottom: 32px;
}

.adt-progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.1em;
}

.adt-progress-pct {
  color: var(--accent);
}

.adt-progress-track {
  height: 2px;
  background: var(--border);
  border-radius: 2px;
}

.adt-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* Breadcrumb */
.adt-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 24px;
}

.adt-crumb {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 11px;
  color: var(--muted);
}

/* Question card */
.adt-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 28px;
  position: relative;
}

.adt-card-topline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  border-radius: 16px 16px 0 0;
}

.adt-dim-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid;
  border-radius: 20px;
  padding: 4px 12px;
  margin-bottom: 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.adt-question-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.15em;
  margin-bottom: 12px;
}

.adt-question {
  color: var(--white);
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 600;
  line-height: 1.35;
  margin-bottom: 14px;
}

.adt-context {
  color: var(--muted);
  font-size: 12px;
  font-style: italic;
  line-height: 1.75;
  margin-bottom: 28px;
  border-left: 2px solid;
  padding-left: 14px;
}

/* Choices */
.adt-choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.adt-choice {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text);
  text-align: left;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
  width: 100%;
}

.adt-choice:hover {
  background: rgba(232, 200, 74, 0.06);
  border-color: rgba(232, 200, 74, 0.4);
}

.adt-choice-icon {
  font-size: 20px;
  line-height: 1;
}

.adt-choice-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--white);
  margin-bottom: 1px;
}

.adt-choice-sub {
  font-size: 11px;
  color: var(--muted);
}

.adt-choice-arrow {
  margin-left: auto;
  color: var(--muted);
}

/* Results */
.adt-confidence-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 2px solid var(--accent2);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 16px;
}

.adt-rationale-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--accent2);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.adt-rationale-text {
  color: var(--text);
  font-size: 13px;
  line-height: 1.85;
}

/* Synthesis */
.adt-synthesis {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.adt-synthesis-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.adt-synthesis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.adt-synthesis-item {
  background: #0d0f14;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.adt-synthesis-item--active {
  opacity: 1;
}

.adt-synthesis-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.adt-synthesis-val {
  color: var(--text);
  font-size: 11px;
}

.adt-synthesis-empty {
  color: var(--muted);
  font-size: 11px;
}

/* Architecture list */
.adt-arch-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

/* Navigation */
.adt-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 52px;
}

.adt-btn {
  border-radius: 8px;
  padding: 9px 18px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  border: 1px solid;
  transition: opacity 0.15s;
}

.adt-btn:hover {
  opacity: 0.8;
}

.adt-btn--back {
  background: transparent;
  border-color: var(--border);
  color: var(--muted);
}

.adt-btn--restart {
  background: rgba(232, 200, 74, 0.08);
  border-color: rgba(232, 200, 74, 0.3);
  color: var(--accent);
}

/* Footer */
.adt-footer {
  border-top: 1px solid var(--border);
  padding-top: 18px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  color: var(--muted);
}

/* Transitions */
.adt-fade-enter-active,
.adt-fade-leave-active {
  transition: opacity 0.22s, transform 0.22s;
}

.adt-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.adt-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Responsive */
@media (max-width: 520px) {
  .adt-synthesis-grid {
    grid-template-columns: 1fr;
  }

  .adt-card {
    padding: 20px 16px;
  }
}
</style>
