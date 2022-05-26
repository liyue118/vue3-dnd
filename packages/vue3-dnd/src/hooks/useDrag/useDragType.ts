import { invariant } from '@react-dnd/invariant'
import type { Identifier } from 'dnd-core'
import type { DragSourceHookSpec } from '../types'
import { computed, ComputedRef, Ref, unref } from 'vue-demi'

export function useDragType(
  spec: Ref<DragSourceHookSpec<any, any, any>>
): ComputedRef<Identifier> {
  return computed(() => {
    const result: Identifier = unref(spec).type
    invariant(result != null, 'spec.type must be defined')
    return result
  })
}
