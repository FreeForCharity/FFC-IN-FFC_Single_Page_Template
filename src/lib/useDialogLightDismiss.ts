import { useRef, type MouseEvent, type PointerEvent, type RefObject } from 'react'

/**
 * Backdrop-click ("light dismiss") fallback for native modal dialogs, for
 * browsers that do not support `closedby="any"` (Modern Web Guidance:
 * ui-components/dialog). Browsers that support `closedby` handle this
 * themselves, so the handlers do nothing there.
 *
 * The dialog closes only when the press started outside its box and the click
 * also lands outside, so dragging a text selection from inside the dialog out
 * onto the backdrop does not close it. Closing on `click` (not `pointerup`)
 * means a touch tap is fully consumed by the dialog and cannot fall through
 * to the page behind once the dialog has gone.
 */
export function useDialogLightDismiss(dialogRef: RefObject<HTMLDialogElement | null>) {
  const pressedOutside = useRef(false)

  const isOutside = (event: MouseEvent<HTMLDialogElement>) => {
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
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      const close = pressedOutside.current && isOutside(event)
      pressedOutside.current = false
      if (close) dialogRef.current?.close()
    },
  }
}
