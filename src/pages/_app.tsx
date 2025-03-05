import BackToTop from "@/components/atoms/BackToTop";
import FloatingMenu from "@/components/atoms/FloatingMenu";
import Footer from "@/components/molecules/Footer";
import Header from "@/components/molecules/Header";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (session && session.status == "unauthenticated") {
      router.replace("/");
    }
  }, [session]);

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-[100vh]">
        <Header />
        <FloatingMenu />
        <main className="flex-1 p-8 w-full max-w-[1200px] m-auto">
          <Component {...pageProps} />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </SessionProvider>
  );
}
