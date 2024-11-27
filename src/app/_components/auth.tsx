"use client";

import { signIn, signOut, type ClientSafeProvider } from "next-auth/react";

const style = "rounded-full bg-slate-100 px-10 py-3 font-semibold no-underline transition hover:bg-slate-200";

export function SignIn(providers: ClientSafeProvider[]) {
  return (
    <>
      {providers &&
        Object.values(providers)
          .filter((provider) => provider.id === "keycloak")
          .map((provider) => (
            <button key={provider.id} className={style} onClick={async () => await signIn(provider.id)}>
              Iniciar sesión
            </button>
          ))}
    </>
  );
}

export function SignOut() {
  return (
    <button className={style} onClick={async () => await signOut()}>
      Cerrar sesión
    </button>
  );
}
