/**
 * Array/String/TypedArray `.at()` polyfill for pre-ES2022 browsers
 * (Chrome <92, Safari <15.4). Both the Next.js runtime and third-party
 * scripts call `.at()` and throw a TypeError in those engines, so the root
 * layout injects this as the FIRST inline script in <head>.
 *
 * Kept as an exported string (rather than inline JSX) so a unit test can
 * execute it and assert the polyfill's semantics — a silent typo here would
 * otherwise only surface as runtime TypeErrors on old browsers that CI never
 * runs.
 */
export const AT_POLYFILL_JS =
  '(function(){function at(n){n=Math.trunc(n)||0;if(n<0)n+=this.length;return n<0||n>=this.length?undefined:this[n]}var protos=[Array.prototype,String.prototype];if(typeof Int8Array==="function"){var t=Object.getPrototypeOf(Int8Array.prototype);if(t)protos.push(t)}protos.forEach(function(p){if(!p.at)Object.defineProperty(p,"at",{writable:true,configurable:true,value:at})})})()'
