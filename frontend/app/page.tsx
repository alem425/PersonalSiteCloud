"use client"
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "../components/ui/aurora-background";

// Project interface that will have an id, title, link and image, taken in from our backend API and put onto the Website display.
interface Project {
    id: string;
    title: string;
    link: string;
    image: string;
}

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Alexander Morgan
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Artificial Intelligence/Machine Learning &nbsp; Cloud Computing &nbsp; Full-Stack Development
        </div>
        {/* <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Debug now
        </button> */}
      </motion.div>
    </AuroraBackground>
  );
}