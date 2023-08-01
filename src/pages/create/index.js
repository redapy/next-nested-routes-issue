import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 justify-center items-center">
      <h1 className="text-2xl">
        Hello to Home page <span className="text-red-500">{router.locale}</span>{" "}
      </h1>
      <nav className="flex gap-3 justify-center items-center">
        <Link href="login" className="text-blue-500 underline">
          login
        </Link>
        <Link href="auth/signup" className="text-blue-500 underline">
          sign up
        </Link>
      </nav>
    </div>
  );
}
