import { appDomain, DEFAULT_LOCAL_WILDCARD_DOMAIN } from "@/utils/constants";
import { NextResponse } from "next/server";
import { parse } from "tldts";

/**
 * Checks if the given pathname is an exception.
 * @param {string} pathname - The URL pathname.
 * @returns {boolean} - True if the pathname is an exception, false otherwise.
 */
const isException = (pathname) => {
  return /^\/(_next|api|_static|locales|fonts|images)/.test(pathname);
};

/**
 * Middleware function to handle URL rewriting and redirection.
 * @param {object} req - The request object.
 * @returns {NextResponse | Response | void} - The response object or void if no action is needed.
 */
export function middleware(req) {
  // Get the pathname and the locale from the URL (the pathname has a slash at the beginning)
  const { pathname, locale } = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  if (isException(pathname)) {
    return;
  }

  // Get the host name
  let host = req.headers.get("host");

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL (wildcard)
  const currentHost = isDev
    ? host?.replace(`.localhost:3000`, "")
    : parse(host).subdomain;

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents. This can also be done
  // via rewrites to a custom 404 page
  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  // If the host name is the main/app host "create",
  // or there is not a host name, rewrite to the app domain route (create)
  if (
    currentHost === appDomain ||
    (isDev && currentHost === DEFAULT_LOCAL_WILDCARD_DOMAIN)
  ) {
    return NextResponse.rewrite(
      new URL(`${locale}/${appDomain}${pathname}`, req.url)
    );
  }

  // Rewrite to the current hostname under the pages/_sites folder
  // The main logic component will happen in pages/_sites/[site]/index.tsx
  return NextResponse.rewrite(
    new URL(`${locale}/_sites/${currentHost}${pathname}`, req.url)
  );
}