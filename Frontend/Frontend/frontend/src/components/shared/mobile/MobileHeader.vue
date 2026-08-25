<template>
  <div class="mobile-header">
    <div class="mobile-header__left">
      <q-btn
        flat
        round
        dense
        icon="menu"
        color="dark"
        @click="$emit('toggle-drawer')"
      />
      <div class="mobile-header__titles">
        <div class="mobile-header__title">{{ titulo }}</div>
        <div v-if="subtitulo" class="mobile-header__subtitle">
          {{ subtitulo }}
        </div>
      </div>
    </div>

    <div class="mobile-header__right">
      <q-btn
        flat
        round
        dense
        :icon="iconeTema"
        :color="modoEscuro ? 'orange' : 'dark'"
        @click="alternarTema"
      />

      <q-btn
        flat
        round
        dense
        icon="notifications_none"
        :color="modoEscuro ? 'orange' : 'dark'"
      />

      <q-avatar
        size="40px"
        :color="modoEscuro ? 'grey-9' : 'orange-1'"
        :text-color="modoEscuro ? 'orange' : 'orange-8'"
        class="mobile-header__avatar"
      >
        {{ iniciais }}
      </q-avatar>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from 'src/composables/useTheme'

defineProps({
  titulo: {
    type: String,
    default: 'Dashboard'
  },
  subtitulo: {
    type: String,
    default: ''
  },
  iniciais: {
    type: String,
    default: '?'
  }
})

defineEmits(['toggle-drawer'])

const {
  modoEscuro,
  iconeTema,
  alternarTema
} = useTheme()
</script>

<style scoped>
.mobile-header {
  height: 74px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #eaecf0;
}

.mobile-header__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.mobile-header__titles {
  min-width: 0;
}

.mobile-header__title {
  font-size: 18px;
  font-weight: 800;
  color: #101828;
  line-height: 1.1;
}

.mobile-header__subtitle {
  font-size: 12px;
  color: #98a2b3;
  margin-top: 2px;
}

.mobile-header__right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-header__avatar {
  font-weight: 700;
}

.body--dark .mobile-header {
  background: #16191f;
  border-bottom-color: #2b2f36;
}

.body--dark .mobile-header__title {
  color: #f9fafb;
}

.body--dark .mobile-header__subtitle {
  color: #98a2b3;
}
</style>