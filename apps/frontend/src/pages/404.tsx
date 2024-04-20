import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <div className="min-h-full dark:bg-neutral-900 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-gigas-600 sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-neutral-200 sm:pl-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-1 text-base text-neutral-500">
                  Oops — we couldn&apos;t find what you were looking for.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md border border-transparent bg-gigas-600 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gigas-700 focus:outline-none focus:ring-2 focus:ring-gigas-500 focus:ring-offset-2"
                >
                  Go back home
                </Link>
                <Link
                  href="mailto:zack@onplayground.com"
                  className="inline-flex items-center rounded-md border border-transparent bg-gigas-100 px-4 py-2 text-sm font-medium text-gigas-700 hover:bg-gigas-200 focus:outline-none focus:ring-2 focus:ring-gigas-500 focus:ring-offset-2"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
