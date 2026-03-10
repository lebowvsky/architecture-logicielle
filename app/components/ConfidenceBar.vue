<script setup lang="ts">
const props = defineProps<{
  score: number
}>()

const color = computed(() =>
  props.score >= 85 ? '#4ae8b0' : props.score >= 75 ? '#e8c84a' : '#e87a4a',
)

const message = computed(() =>
  props.score >= 85
    ? 'Recommandation forte — profil contextuel bien aligné'
    : props.score >= 75
      ? 'Bonne recommandation — quelques compromis à arbitrer'
      : 'Recommandation indicative — ajustez selon votre contexte',
)
</script>

<template>
  <div class="confidence">
    <div class="confidence-header">
      <span class="confidence-label">SCORE DE CONFIANCE</span>
      <span class="confidence-value" :style="{ color }">{{ score }}%</span>
    </div>
    <div class="confidence-track">
      <div
        class="confidence-fill"
        :style="{ width: `${score}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }"
      />
    </div>
    <p class="confidence-message">{{ message }}</p>
  </div>
</template>

<style scoped>
.confidence {
  margin-bottom: 20px;
}

.confidence-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.confidence-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.confidence-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
}

.confidence-track {
  height: 3px;
  background: var(--border);
  border-radius: 3px;
}

.confidence-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.confidence-message {
  color: var(--muted);
  font-size: 11px;
  margin-top: 5px;
  font-style: italic;
}
</style>
