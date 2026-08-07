import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const CHAVE_TEMA = 'tcc-modo-escuro'

export function useTheme() {
  const $q = useQuasar()

  const modoEscuro = computed(() => {
    return $q.dark.isActive
  })

  const iconeTema = computed(() => {
    return modoEscuro.value
      ? 'light_mode'
      : 'dark_mode'
  })

  const textoTema = computed(() => {
    return modoEscuro.value
      ? 'Ativar modo claro'
      : 'Ativar modo escuro'
  })

  function carregarTema() {
    const temaSalvo =
      localStorage.getItem(CHAVE_TEMA)

    if (temaSalvo === null) {
      $q.dark.set(false)
      return
    }

    $q.dark.set(
      temaSalvo === 'true'
    )
  }

  function alternarTema() {
    const novoTema =
      !$q.dark.isActive

    $q.dark.set(novoTema)

    localStorage.setItem(
      CHAVE_TEMA,
      String(novoTema)
    )
  }

  onMounted(carregarTema)

  return {
    modoEscuro,
    iconeTema,
    textoTema,
    alternarTema
  }
}