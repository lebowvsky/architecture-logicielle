<script setup lang="ts">
import type { Architecture } from '~/composables/useArchitectureTree'

defineProps<{
  arch: Architecture
  rank: number
}>()

const expanded = ref(false)

const detailItems = [
  { key: 'changeCost' as const, label: 'Coût du changement', color: '#4ae8b0' },
  { key: 'orgFit' as const, label: 'Fit organisationnel', color: '#a78bfa' },
  { key: 'nfrImpact' as const, label: 'Impact NFR', color: '#e84a7a' },
]
</script>

<template>
  <div
    class="arch-card"
    :style="{ borderLeftColor: arch.color, '--arch-color': arch.color }"
    @click="expanded = !expanded"
  >
    <div
      class="arch-topline"
      :style="{ background: `linear-gradient(90deg, ${arch.color}60, transparent)` }"
    />

    <div class="arch-header">
      <span class="arch-icon">{{ arch.icon }}</span>
      <div class="arch-meta">
        <span class="arch-rank" :style="{ color: arch.color }">
          {{ rank === 0 ? 'Recommandation principale' : 'Alternative complémentaire' }}
        </span>
        <h3 class="arch-name">{{ arch.name }}</h3>
        <p class="arch-sub">{{ arch.subtitle }}</p>
      </div>
      <span class="arch-toggle">{{ expanded ? '↑' : '↓' }}</span>
    </div>

    <p class="arch-desc">{{ arch.description }}</p>

    <Transition name="adt-expand">
      <div v-if="expanded" class="arch-details">
        <div class="arch-two-col">
          <div>
            <p class="detail-label" :style="{ color: arch.color }">✓ Forces</p>
            <p v-for="s in arch.strengths" :key="s" class="detail-item">→ {{ s }}</p>
          </div>
          <div>
            <p class="detail-label" style="color: #e84a7a">✗ Limites</p>
            <p v-for="w in arch.weaknesses" :key="w" class="detail-item">→ {{ w }}</p>
          </div>
        </div>

        <div v-for="item in detailItems" :key="item.key" class="detail-box">
          <p class="detail-label" :style="{ color: item.color }">{{ item.label }}</p>
          <p class="detail-item">{{ arch[item.key] }}</p>
        </div>

        <div class="quote-box" :style="{ borderLeftColor: arch.color }">
          <p class="quote-text">{{ arch.uncle_bob }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.arch-card {
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid var(--arch-color, #e8c84a);
  border-radius: 12px;
  padding: 20px 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.arch-topline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
}

.arch-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.arch-icon {
  font-size: 26px;
  line-height: 1;
}

.arch-meta {
  flex: 1;
}

.arch-rank {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.arch-name {
  color: var(--white);
  font-size: 17px;
  font-weight: 600;
  margin: 3px 0 1px;
}

.arch-sub {
  color: var(--muted);
  font-size: 11px;
  font-family: 'IBM Plex Mono', monospace;
}

.arch-toggle {
  color: var(--muted);
  font-size: 16px;
}

.arch-desc {
  color: var(--text);
  font-size: 13px;
  line-height: 1.6;
}

.arch-details {
  border-top: 1px solid var(--border);
  padding-top: 16px;
  margin-top: 14px;
}

.arch-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.detail-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.detail-item {
  color: var(--text);
  font-size: 12px;
  line-height: 1.8;
}

.detail-box {
  background: #0d0f14;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 10px;
}

.quote-box {
  border-left: 2px solid var(--arch-color, #e8c84a);
  padding: 10px 14px;
  background: #0d0f14;
  border-radius: 0 8px 8px 0;
}

.quote-text {
  color: var(--muted);
  font-size: 11px;
  font-style: italic;
}

.adt-expand-enter-active,
.adt-expand-leave-active {
  transition: opacity 0.18s;
}

.adt-expand-enter-from,
.adt-expand-leave-to {
  opacity: 0;
}

@media (max-width: 520px) {
  .arch-two-col {
    grid-template-columns: 1fr;
  }
}
</style>
