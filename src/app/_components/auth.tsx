"use client";

import { signIn, signOut } from "next-auth/react";

const style = "rounded-full bg-slate-100 px-10 py-3 font-semibold no-underline transition hover:bg-slate-200";

export function SignIn() {
  return (
    <button className={style} onClick={() => signIn("keycloak")}>
      Iniciar sesión
    </button>
  );
}

export function SignOut() {
  return (
    <button className={style} onClick={() => signOut()}>
      Cerrar sesión
    </button>
  );
}
