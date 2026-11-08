import AboutMe from "@/components/AboutMe";
import ArtGeneratorDelivery from "@/components/ArtGeneratorDelivery";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import MenuDelivery from "@/components/MenuDelivery";
import MonitoringDelivery from "@/components/MonitoringDelivery";
import SectionNavigator from "@/components/SectionNavigator";
import SupportChatDelivery from "@/components/SupportChatDelivery";
import TechStack from "@/components/TechStack";
import VezonProduct from "@/components/VezonProduct";

export default function Home() {
  return (
    <SectionNavigator>
      <Hero />
      <TechStack />
      <Experience />
      <MenuDelivery />
      <SupportChatDelivery />
      <ArtGeneratorDelivery />
      <MonitoringDelivery />
      <VezonProduct />
      <Education />
      <AboutMe />
      <Contact />
    </SectionNavigator>
  );
}
