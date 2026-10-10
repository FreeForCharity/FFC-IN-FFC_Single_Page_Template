/**
 * Escape a build-time value for safe embedding inside an inline `<script>`
 * body.
 *
 * `JSON.stringify` supplies the quotes and escapes quotes/backslashes. The
 * three replacements after it cover what JSON does NOT escape but a browser's
 * HTML and JavaScript parsers still treat specially:
 *
 *   - `<` becomes \u003c, so a value containing </script> cannot close
 *     the element early and inject markup. This is the replacement that turns
 *     a malformed ID into script injection rather than a merely broken tag.
 *   - U+2028 and U+2029 become \u2028 and \u2029. Both are line
 *     terminators in JavaScript but NOT in JSON, so JSON.stringify leaves them
 *     raw and an unescaped one silently breaks the statement across lines.
 *
 *     Writing this file proved the point: an editor pass emitted those two as
 *     literal characters instead of escape text, and the regex below stopped
 *     parsing with "unterminated regular expression literal" — exactly the
 *     failure this function exists to prevent, in the function that prevents it.
 *
 * The IDs this wraps are build-time values set by a maintainer, not by a
 * visitor, so it is defence in depth rather than a live hole. It matters
 * because `isConfigured()` only rejects placeholder values — nothing else
 * validates the SHAPE of what reaches a script body.
 *
 * WHY THIS LIVES HERE. It used to be duplicated in the GTM loader and the
 * cookie-consent component, and the GTM copy carried a comment justifying the
 * duplication on a server-boundary argument that was simply untrue: that
 * module declares `'use client'` on its first line, so importing from another
 * client module was never a boundary call. The real cost of the duplication
 * was that the tests only exercised one copy, so an escaping fix could land in
 * one loader and not the other. One implementation, one test, both callers.
 */
export function scriptString(value: string): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
