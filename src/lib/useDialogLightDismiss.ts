import { useRef, type PointerEvent, type RefObject } from 'react'

/**
 * Backdrop-click ("light dismiss") fallback for native modal dialogs, for
 * browsers that do not support `closedby="any"` (Modern Web Guidance:
 * ui-components/dialog). Browsers that support `closedby` handle this
 * themselves, so the handlers do nothing there.
 *
 * The dialog closes only when the pointer is both pressed and released
 * outside its box, so dragging a text selection from inside the dialog out
 * onto the backdrop does not close it.
 */
export function useDialogLightDismiss(dialogRef: RefObject<HTMLDialogElement | null>) {
  const pressedOutside = useRef(false)

  const isOutside = (event: PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current
    if (!dialog || event.target !== dialog) return false
    const rect = dialog.getBoundingClientRect()
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
  }

  const nativeSupport = () =>
    typeof HTMLDialogElement !== 'undefined' && 'closedBy' in HTMLDialogElement.prototype

  return {
    onPointerDown: (event: PointerEvent<HTMLDialogElement>) => {
      pressedOutside.current = !nativeSupport() && isOutside(event)
    },
    onPointerUp: (event: PointerEvent<HTMLDialogElement>) => {
      const close = pressedOutside.current && isOutside(event)
      pressedOutside.current = false
      if (close) dialogRef.current?.close()
    },
  }
}
