import Section from "@/shared/Section/Section";
import Herosection from "../Herosection/Herosection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-dvh ">
      <Section>
        <Herosection />
      </Section>
    </div>
  );
};

export default Home;
