import BackToTop from "@/components/atoms/BackToTop";
import Footer from "@/components/molecules/Footer";
import Header from "@/components/molecules/Header";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps: { session, ...pageProps }}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-[100vh]">
        <Header/>
        <main className="flex-1 p-8">
          <Component {...pageProps} />
        </main>
        <Footer/>
        <BackToTop/>
      </div>
    </SessionProvider>
  );
}
