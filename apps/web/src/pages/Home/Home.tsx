import Section from "@/shared/Section/Section";
import Herosection from "../Herosection/Herosection";
import SideRings from "@/shared/SideRings/SideRings";

const Home = () => {
  return (
    <div className="flex flex-col min-h-dvh relative overflow-hidden items-center justify-center">
      <SideRings
        className="left-[-70%]"
        firstRingSize={1000}
        secondRingSize={850}
        thirdRingSize={700}
      />
      <SideRings
        className="right-[-70%] "
        firstRingSize={1000}
        secondRingSize={850}
        thirdRingSize={700}
        reverse
      />
      <Section>
        <Herosection />
      </Section>
    </div>
  );
};

export default Home;