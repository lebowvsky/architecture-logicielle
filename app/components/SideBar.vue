<script setup lang="ts">
interface NavLink {
  id: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface Props {
  eyebrow: string
  title: string
  groups: NavGroup[]
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: '#4ade80',
})

const activeId = ref(props.groups[0]?.links[0]?.id ?? '')

function onLinkClick(id: string) {
  activeId.value = id
}

onMounted(() => {
  const sections = props.groups
    .flatMap((g) => g.links)
    .map((link) => document.getElementById(link.id))
    .filter(Boolean) as HTMLElement[]

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  )

  sections.forEach((s) => observer.observe(s))

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <aside class="sidebar" :style="{ '--sidebar-accent': props.accentColor }">
    <div class="sidebar-header">
      <div class="sidebar-label">{{ eyebrow }}</div>
      <div class="sidebar-title" v-html="title" />
    </div>
    <nav class="sidebar-nav">
      <div v-for="group in groups" :key="group.label" class="nav-group">
        <div class="nav-group-label">{{ group.label }}</div>
        <a
          v-for="link in group.links"
          :key="link.id"
          :href="`#${link.id}`"
          class="nav-link"
          :class="{ active: activeId === link.id }"
          @click="onLinkClick(link.id)"
        >
          <span class="nav-dot" />
          {{ link.label }}
        </a>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-w, 260px);
  min-height: 100vh;
  background: var(--bg2, #141518);
  border-right: 1px solid var(--border, #2a2d35);
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 28px 24px 20px;
  border-bottom: 1px solid var(--border, #2a2d35);
}

.sidebar-label {
  font-family: var(--mono, 'IBM Plex Mono', monospace);
  font-size: 10px;
  color: var(--sidebar-accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.sidebar-title {
  font-family: var(--serif, 'DM Serif Display', serif);
  font-size: 17px;
  color: var(--text, #e2e4e9);
  line-height: 1.3;
}

.sidebar-nav {
  padding: 16px 0 32px;
  flex: 1;
}

.nav-group {
  margin-bottom: 4px;
}

.nav-group-label {
  font-family: var(--mono, 'IBM Plex Mono', monospace);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text3, #6b7280);
  padding: 12px 24px 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 24px;
  color: var(--text2, #9ca3af);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 400;
  border-left: 2px solid transparent;
  transition: all 0.15s;
  line-height: 1.4;
}

.nav-link:hover {
  color: var(--text, #e2e4e9);
  background: var(--bg3, #1a1c21);
}

.nav-link.active {
  color: var(--sidebar-accent);
  border-left-color: var(--sidebar-accent);
  background: color-mix(in srgb, var(--sidebar-accent) 5%, transparent);
}

.nav-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--border2, #353940);
  flex-shrink: 0;
  transition: background 0.15s;
}

.nav-link.active .nav-dot {
  background: var(--sidebar-accent);
}

.nav-link:hover .nav-dot {
  background: var(--text3, #6b7280);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
