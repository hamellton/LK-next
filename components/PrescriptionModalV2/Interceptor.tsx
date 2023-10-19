/* eslint prefer-rest-params: 0 */
//@ts-ignore
const open =
  typeof window !== "undefined" ? XMLHttpRequest.prototype.open : () => null;
const send =
  typeof window !== "undefined" ? XMLHttpRequest.prototype.send : () => null;

function openReplacement() {
  if (arguments[1] && arguments[1]?.indexOf("pd/verify") > -1) {
    (window as any).imageData = null;
  }
  return open.apply(this, arguments);
}

function sendReplacement(data: any) {
  if (data instanceof FormData) {
    (window as any).imageData = data.get("image") || null;
  }
  return send.apply(this, arguments);
}

export function initiateInterceptor() {
  XMLHttpRequest.prototype.open = openReplacement;
  XMLHttpRequest.prototype.send = sendReplacement;
}

export function destroyInterceptor() {
  XMLHttpRequest.prototype.open = open;
  XMLHttpRequest.prototype.send = send;
}
