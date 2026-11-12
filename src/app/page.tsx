import { Nav } from "@/components/Nav";
import { ScrollScenes } from "@/components/ScrollScenes";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Menu } from "@/components/sections/Menu";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:p-3 focus:text-ground">
        Skip to content
      </a>
      <ScrollScenes />
      <Nav />
      <main id="main">
        <Hero />
        <Menu />
        <HowItWorks />
        <Visit />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
