import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl">
        Hello to Login page{" "}
        <span className="text-red-500">{router.locale}</span>{" "}
      </h1>
    </div>
  );
}
