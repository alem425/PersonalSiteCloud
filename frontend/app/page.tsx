"use client";
import { useState, useEffect } from "react";
import React from "react";
import { AuroraBackground } from "../components/ui/aurora-background";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Image } from "lucide-react";

// Project interface that will have an id, title, link and image, taken in from our backend API and put onto the Website display.
interface Project {
  id: string;
  title: string;
  link: string;
  image: string;
}
// export default function ScrollBackground() {
//   const { scrollYProgress } = useScroll(); // Tracks scroll progress (0 to 1)
//   const smoothProgress = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 20,
//     restDelta: 0.001,
//   });

//   const bg1Opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]); // First background fades out
//   const bg2Opacity = useTransform(smoothProgress, [0.3, 0.8], [1, 0]); // Second background fades in
//   const bg3Opacity = useTransform(smoothProgress, [0.6, 1], [0, 1]); // Third background fades in later

//   return (
//     <div className="relative h-[300vh]">
//       {/* Background Layers */}
//       <motion.div
//         style={{ opacity: bg1Opacity }}
//         className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 to-purple-500"
//       />
//       <motion.div
//         style={{ opacity: bg2Opacity }}
//         className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500 to-red-500"
//       />
//       <motion.div
//         style={{ opacity: bg3Opacity }}
//         className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-red-500 to-orange-500"
//       />

//       {/* Content */}
//       <div className="relative z-10 flex flex-col items-center justify-start pt-20 text-white">
//         <h1 className="text-3xl font-bold">
//           Scroll Down to See the Gradient Change!
//         </h1>
//       </div>
//     </div>
//   );
// }

// export default function ScrollBackground() {
//   const { scrollYProgress } = useScroll();
//   const smoothProgress = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 20,
//     restDelta: 0.001,
//   });

//   const backgroundColor = useTransform(
//     smoothProgress,
//     [0, 0.5, 1],
//     ["#3b82f6", "#9333ea", "#ef4444"]
//   );

//   const [bgColor, setBgColor] = useState("bg-blue-500");

//   useEffect(() => {
//     return smoothScroll.onChange((latest) => {
//       if (latest > 0.6) {
//         setBgColor("bg-red-500");
//       } else if (latest > 0.3) {
//         setBgColor("bg-purple-500");
//       } else {
//         setBgColor("bg-blue-500");
//       }
//     });
//   }, [smoothScroll]);

//   return (
//     <motion.div
//       style={{
//         background:
//           smoothScroll.get() > 0.6
//             ? "linear-gradient(to bottom, #ff0000, #ff7300)"
//             : smoothScroll.get() > 0.3
//             ? "linear-gradient(to bottom, #6a00f4, #ff00ff)"
//             : "linear-gradient(to bottom, #007bff, #6a00f4)",
//       }}
//       className="h-[300vh] flex items-center justify-center transition-all duration-500 ease-in-out"
//     >
//       <div className="h-fit flex flex-col items-center justify-start pt-20">
//         <h1 className="text-3xl font-bold text-white">Scroll Down!</h1>
//       </div>{" "}
//       <div className="h"></div>
//     </motion.div>
//   );
// }

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
        <div className=" text-3xl md:text-7xl font-bold dark:text-white text-center">
          Alexander Morgan
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Artificial Intelligence/Machine Learning &nbsp; Cloud Computing &nbsp;
          Full-Stack Development
        </div>
        {/* <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Debug now
        </button> */}
        <div className="flex flex-row mt-96 mb-12 mx-30 h-[22vh] justify-center items-center">
          <div className="h-full w-1/5 rounded-4xl bg-amber-700"></div>
          <p className="mx-10 text text-right w-1/2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
            quibusdam rem asperiores animi ut consequatur adipisci iste quo
            ullam. Accusamus magni, harum fugiat aut iusto at ad ex qui
            impedit?Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Minima nihil exercitationem praesentium tenetur beatae. Tempore,
            veritatis dolorum mollitia beatae ea eius, voluptatem vitae
            dignissimos possimus quidem dolorem ab, dolor tempora. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Voluptate nulla aliquid
            obcaecati fuga odio, cum, vel dolor minus perspiciatis consequatur
            ullam impedit corporis culpa? Voluptatum obcaecati inventore velit
            provident dignissimos.
          </p>
        </div>
      </motion.div>
      <div>
        {" "}
        <div className="mb 5">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            <h1>Test</h1>
          </BackgroundGradient>
        </div>
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900">
          <h1 className="text-slate-500">Test2</h1>
        </BackgroundGradient>
      </div>
    </AuroraBackground>
  );
}
