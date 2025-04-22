# SGE 2.0

Proyecto creado con [T3 Stack](https://create.t3.gg/).

# Prod link

- Vercel - [https://sge-2.vercel.app](https://sge-2.vercel.app)
- UTN (requiere VPN) - [https://sge-tst.frba.utn.edu.ar/](https://sge-tst.frba.utn.edu.ar/)

# Como ejecutar local

Para instalar el entorno local en la red UTN-FRBA el administrador web debera tener en cuenta el proxy detras del que se encuentra para la instalación de los programas necesarios. Para este proyecto es necesario instalar:

- Docker
- Node (version >= 14)

Luego se procede a realizar los siguientes pasos:

1. Clonar el repositorio

   ```bash
   git clone git@git-m01.frba.utn.edu.ar:externals/sge-new.git
   ```

2. Para evitar errores al ejecutar los comandos que siguen, debe cambiarse el propietario de la carpeta donde se haya clonado el repositorio. Esto realiza con el comando _chown_. _user_ y _folder_ deben completarse segun el caso, el grupo siempre sera _www-data_.

   ```bash
   sudo chown user:www-data folder
   ```

3. Crear archivo con las variables de entorno. Debe llamarse ".env". A modo de ejemplo se encuentra el archivo ".env.example".

   ```bash
   cp .env.example .env
   ```

4. Iniciar la base de datos en docker. Si se tiene un dump el script va a pedir la ruta al mismo para inicializar la base de datos.

   ```bash
   ./start-database.sh
   ```

5. Instalar dependencias

   ```bash
   npm install
   ```

6. Migrar la base de datos

   ```bash
   npm run db:deploy
   ```

7. Build del sistema con la BD

   ```bash
   npm run build
   ```

8. Ejecutar el entorno local. Cada vez que se quiera acceder al entorno debe ejecutarse este comando.

   ```bash
   npm run dev
   ```

## Tecnologías usadas

- Next.js
- Prisma ORM
- Tailwind CSS
- TypeScript
- Auth.js
- TRPC
- React
- Docker

## Links útiles

- Prisma Docs Errors: [Errors | Prisma Documentation](https://www.prisma.io/docs/orm/reference/error-reference)
- Prisma Type: [Table inheritance | Prisma Documentation](https://www.prisma.io/docs/orm/prisma-schema/data-model/table-inheritance)
- Query Nested: [Relation queries \(Concepts\) | Prisma Documentation](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries)
- Keycloack login issue: [Signout does not logout user when session is being requested simultaneously · Issue \#4612 · nextauthjs/next-auth](https://github.com/nextauthjs/next-auth/issues/4612)
- NextJs Keycloak tutorial: [NextJS, NextAuth with App Router and Keycloak \(Demo part 3/3\)](https://www.youtube.com/watch?v=-HsldaBdIPQ)
- NextJs official guide: [Learn Next.js: Mutating Data](https://nextjs.org/learn/dashboard-app/mutating-data)
- DER generator: [Prisma ERD](https://prisma-erd.simonknott.de/)
- Sonner Toaster: [Toast\(\) – Sonner](https://sonner.emilkowal.ski/toast)
- Tailwind CSS: [Background Position](https://tailwindcss.com/docs/background-position)
- ShadCDN: [Accordion](https://ui.shadcn.com/docs/components/accordion)
- TRPC: [Getting Started](https://trpc.io/docs/getting-started)
- Matine Components: [Slider](https://mantine.dev/core/slider/)
- Guide: [From 0 to Production - The Modern React Tutorial \(RSCs, Next.js, Shadui, Drizzle, TS and more\)](https://youtu.be/d5x0JCZbAJs?si=4qYCzN_18mZngyAA&t=5527)
- Typescript definition: [Configuring: TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin)
- Hooks variedad: [usehooks-ts](https://usehooks-ts.com/introduction)
- Códigos de Error: [Error Handling](https://trpc.io/docs/server/error-handling)
- Presentacion comercial: [SGE 2.0](https://www.canva.com/design/DAGPKrgbpq0/Xg6BmtoG3p1hQdboYGZd9g/edit)
