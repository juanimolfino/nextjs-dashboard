/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
      ppr: 'incremental', //The 'incremental' value allows you to adopt PPR for specific routes.
    },
  };

  //That's it. You may not see a difference in your application in development, but you should notice a performance improvement in production. Next.js will prerender the static parts of your route and defer the dynamic parts until the user requests them.

// The great thing about Partial Prerendering is that you don't need to change your code to use it. As long as you're using Suspense to wrap the dynamic parts of your route, Next.js will know which parts of your route are static and which are dynamic.

export default nextConfig;

