import { useRouter } from "next/router";

export default function Home({ subdomain }) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>
        <span className="text-red-500">{subdomain}</span> SUBDOMAIN{" "}
        <span className="text-green-500">{router.locale}</span>
      </h1>
    </div>
  );
}

// Getting the paths for all the subdomains in our database
export async function getStaticPaths({ locales }) {
  //just a demo for possible sites/domains we may have in the database
  const paths = locales.map(
    (locale) => (
      { params: { site: "reda" }, locale },
      { params: { site: "youssef" }, locale }
    )
  );

  return {
    paths: paths,
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ params, locale }) => {
  return {
    props: {
      subdomain: params.site,
    },
  };
};
