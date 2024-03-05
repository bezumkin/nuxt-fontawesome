import type {Transform} from '@fortawesome/fontawesome-svg-core'

export function transformIsMeaningful(transform: Transform) {
  const meaninglessTransform = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: false,
    flipY: false,
  }

  return (
    transform.size !== meaninglessTransform.size ||
    transform.x !== meaninglessTransform.x ||
    transform.y !== meaninglessTransform.y ||
    transform.rotate !== meaninglessTransform.rotate ||
    transform.flipX ||
    transform.flipY
  )
}
