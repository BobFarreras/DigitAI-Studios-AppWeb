/**
 * @file src/services/ProjectAccessService.ts
 * @updated 2026-08-20
 * @summary Valida la clau compartida i signa sessions temporals de projectes.
 * @scope Servei server-only sense accés a cookies ni UI.
 */
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_SECONDS = 60 * 60 * 8;

function password() {
  return (
    process.env.PROJECTS_DEMO_PASSWORD ??
    process.env.PROJECTS_ACCESS_PASSWORD ??
    ""
  );
}

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(expires: string) {
  return createHmac("sha256", password()).update(`projects:${expires}`).digest("hex");
}

export class ProjectAccessService {
  static isConfigured() {
    return password().length >= 6;
  }

  static validatePassword(candidate: string) {
    const expected = password();
    return expected.length >= 6 && equal(candidate, expected);
  }

  static createSession() {
    const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
    return { token: `${expires}.${signature(expires)}`, maxAge: SESSION_SECONDS };
  }

  static validateSession(token?: string) {
    if (!token || !password()) return false;
    const [expires, provided] = token.split(".");
    if (!expires || !provided || Number(expires) <= Date.now() / 1000) return false;
    return equal(provided, signature(expires));
  }
}
