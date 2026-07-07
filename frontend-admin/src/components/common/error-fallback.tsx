export default function ErrorFallback() {
  return (
    <section className="flex flex-col space-y-5 items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold tracking-wider">
        Something went wrong :(
      </h1>
      <button onClick={() => window.location.assign(window.location.origin)}>
        Try Again
      </button>
    </section>
  );
}