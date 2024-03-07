import type { Events } from '@/events/emitter'

type Handler<T> = (event: T) => void

export function useEmitter<EmitterName extends keyof Events>(
  name: EmitterName,
  handler: Handler<Events[EmitterName]>,
) {
  Emitter.on(name, handler)

  onUnmounted(() => {
    Emitter.off(name, handler)
  })
}
