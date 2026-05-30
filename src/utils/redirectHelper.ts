import { AUTH_TOKEN_NAME } from "@/common/constants";

export function RemoveToken() {
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  if (token != null) localStorage.removeItem(AUTH_TOKEN_NAME);
}

export function RedirectLogin() {
  if (window.location.href.indexOf("/login") == -1) {
    const redirect = window.location.href;
    window.location.href = "/login?redirect=" + redirect;
  }
}

export function RedirectLoginAndResetParam() {
  if (window.location.href.indexOf("/login") == -1) {
    window.location.href = "/login";
  }
}

export function RedirectToPage() {
  const params = new URL(window.location.href).searchParams;
  const redirect = params.get("redirect");
  if (redirect) window.location.href = redirect;
  else window.location.href = "/";
}

export function RemoveNullAttributes(obj: any) {
  for (const key in obj) {
    if (obj[key] === null) {
      delete obj[key];
    }
  }
  return obj;
}
