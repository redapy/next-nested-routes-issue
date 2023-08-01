import { appDomain, wildcard } from "./utils/constants";
import { NextResponse } from "next/server";
import { parse } from "tldts";
const isException = (pathname) => {
  return /^\/(_next|api|_static|locales|fonts|images)/.test(pathname);
};

export function middleware(req) {
  //get the pathname and the locale from the url (the pathname is with a slash at the begenning)
  const { pathname, locale } = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  if (isException(pathname)) {
    return;
  }

  //get the host name
  let host = req.headers.get("host");

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL (wildcard)
  const currentHost = isDev
    ? host?.replace(`.localhost:3000`, "")
    : parse(host).subdomain;

  console.log(currentHost);
  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents. This can also be done
  // via rewrites to a custom 404 page
  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  //if the host name is the main/app host (landing page to enter the business infos),
  //or there is not a host name rewrite to the appdomain route (create)
  if (
    currentHost === appDomain ||
    (isDev ? currentHost === "localhost:3000" : currentHost === wildcard)
  ) {
    const newUrl = new URL(req.url);
    // console.log("================================");
    // console.log("pathname", newUrl.toString());
    // console.log("================================");
    return NextResponse.rewrite(
      new URL(`${locale}/${appDomain}${pathname}`, req.url)
    );
  }

  // rewrite to the current hostname under the pages/_sites folder
  // the main logic component will happen in pages/_sites/[site]/index.tsx
  return NextResponse.rewrite(
    new URL(`${locale}/_sites/${currentHost}${pathname}`, req.url)
  );
}
