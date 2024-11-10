export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-12 px-4 ">{children}</div>
    </main>
  );
}
