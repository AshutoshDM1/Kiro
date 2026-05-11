"use client";
import Section from "@/shared/Section/Section";
import Herosection from "../Herosection/Herosection";
import SideRings from "@/shared/SideRings/SideRings";
import { motion } from "motion/react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-dvh relative overflow-hidden items-center justify-center">
      <SideRings
      className="left-[-70%]"
        firstRingSize={1300}
        secondRingSize={1100}
        thirdRingSize={900}
      />
      <SideRings
        className="right-[-70%] "
        firstRingSize={1300}
        secondRingSize={1100}
        thirdRingSize={900}
        reverse
      />
      <Section>
        <Herosection />
      </Section>
    </div>
  );
};

export default Home;
