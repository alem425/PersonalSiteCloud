"use client";
import { url } from "inspector";
import { WindSong } from "next/font/google";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

// Add debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  github: string;
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonName, setButtonName] = useState("action");
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  //Stock Images
  const images = [
    "https://readdy.ai/api/search-image?query=Professional%20developer%20working%20on%20multiple%20screens%20with%20code%20and%20data%20visualizations%2C%20dark%20modern%20workspace%20with%20blue%20and%20purple%20ambient%20lighting%2C%20futuristic%20tech%20environment%20with%20holographic%20UI%20elements%2C%20focused%20on%20machine%20learning%20and%20cloud%20computing&width=600&height=500&seq=6&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Futuristic%20industrial%20machinery%20with%20glowing%20diagnostic%20overlays%2C%20predictive%20maintenance%20visualization%20with%20AI%20analysis%2C%20dark%20background%20with%20blue%20and%20purple%20technical%20elements%2C%20digital%20twin%20concept%20with%20data%20flowing%20through%20equipment&width=600&height=400&seq=4&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Modern%20analytics%20dashboard%20with%20multiple%20charts%2C%20graphs%20and%20data%20visualizations%20on%20dark%20theme%2C%20glowing%20UI%20elements%20with%20blue%20and%20purple%20accents%2C%20futuristic%20interface%20design%20with%20clean%20typography%20and%20glass%20effect%20panels&width=600&height=400&seq=3&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Abstract%20visualization%20of%20cloud%20computing%20architecture%20with%20connected%20nodes%20and%20services%2C%20floating%20digital%20elements%20on%20dark%20background%20with%20blue%20and%20purple%20glow%2C%20technical%20diagram%20of%20microservices%20with%20flowing%20data%20streams&width=600&height=400&seq=2&orientation=landscape",
    "https://readdy.ai/api/search-image?query=A%20stunning%203D%20visualization%20of%20neural%20networks%20with%20glowing%20blue%20and%20purple%20connections%20on%20a%20dark%20background%2C%20abstract%20digital%20nodes%20connected%20with%20light%20beams%2C%20futuristic%20technology%20concept%20with%20depth%20and%20dimension&width=600&height=400&seq=1&orientation=landscape",
  ];

  //URLS
  const urls = {
    github: "https://github.com/alem425",
    linkedin: "https://www.linkedin.com/in/alexander-morgan-8467311b8/",
    google:
      "https://mail.google.com/mail/?view=cm&fs=1&to=xander12@terpmail.umd.edu",
    Projects: "https://github.com/alem425",
    About: "/about",
    Contact:
      "https://mail.google.com/mail/?view=cm&fs=1&to=xander12@terpmail.umd.edu",
  };

  // Create all refs upfront
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const projectsHeaderRef = useRef<HTMLDivElement>(null);
  const skillsHeaderRef = useRef<HTMLDivElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skillCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const callToActionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Fix ref callbacks
  const setProjectRef = useCallback(
    (element: HTMLDivElement | null, index: number) => {
      if (projectRefs.current) {
        projectRefs.current[index] = element;
      }
    },
    [],
  );

  const setSkillRef = useCallback(
    (element: HTMLDivElement | null, index: number) => {
      if (skillCardRefs.current) {
        skillCardRefs.current[index] = element;
      }
    },
    [],
  );

  // Handle intersection observer for all elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const delay = parseInt(element.getAttribute("data-delay") || "0");

            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.willChange = "opacity, transform";

            setTimeout(() => {
              element.style.transition =
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
              element.style.opacity = "1";
              element.style.transform = "translateY(0)";

              setTimeout(() => {
                element.style.willChange = "auto";
              }, 800);
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    // Observe hero section
    if (heroContentRef.current) {
      heroContentRef.current.setAttribute("data-delay", "0");
      observer.observe(heroContentRef.current);
    }
    if (heroImageRef.current) {
      heroImageRef.current.setAttribute("data-delay", "200");
      observer.observe(heroImageRef.current);
    }

    // Observe project header
    if (projectsHeaderRef.current) {
      projectsHeaderRef.current.setAttribute("data-delay", "0");
      observer.observe(projectsHeaderRef.current);
    }

    // Observe projects with staggered delay
    projectRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute("data-delay", `${index * 200}`);
        observer.observe(ref);
      }
    });

    // Observe skills section
    if (skillsHeaderRef.current) {
      skillsHeaderRef.current.setAttribute("data-delay", "0");
      observer.observe(skillsHeaderRef.current);
    }

    // Observe skill cards with staggered delay
    skillCardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute("data-delay", `${index * 200}`);
        observer.observe(ref);
      }
    });

    // Observe call to action and footer
    if (callToActionRef.current) {
      callToActionRef.current.setAttribute("data-delay", "0");
      observer.observe(callToActionRef.current);
    }
    if (footerRef.current) {
      footerRef.current.setAttribute("data-delay", "0");
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [featuredProjects.length]);

  // Optimize scroll handler
  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setIsScrolled(scrolled);
      }
    }, 10);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://personal-portfolio-function-app.azurewebsites.net/api/GetProjects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const projects = await response.json();
        setFeaturedProjects(projects);
        // Initialize refs array with the new length
        projectRefs.current = new Array(projects.length).fill(null);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setFeaturedProjects([]);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden">
      {/* Background Aurora Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://readdy.ai/api/search-image?query=Abstract%20digital%20aurora%20borealis%20with%20subtle%20blue%20and%20purple%20waves%2C%20flowing%20ethereal%20light%20patterns%20on%20dark%20background%2C%20minimalist%20cosmic%20glow%20effect%20with%20depth%20and%20dimension%2C%20elegant%20atmospheric%20phenomenon&width=1920&height=1080&seq=5&orientation=landscape')] bg-cover bg-center opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500 opacity-[0.1] blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500 opacity-[0.03] blur-[150px] animate-[pulse_10s_ease-in-out_infinite]"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Navigation  */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/30 backdrop-blur-lg" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Name with cool gradient effect  */}
            <a href="#" className="text-2xl font-bold tracking-tight group">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Xander.dev
              </span>
              <span className="block h-0.5 max-w-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 group-hover:max-w-full"></span>{" "}
              {/* Line With Hover Effect*/}
            </a>

            {/* Right Side Nav portion  */}
            <nav className="hidden md:flex space-x-8">
              {(
                ["Projects", "About", "Contact"] as Array<keyof typeof urls>
              ).map((item) => (
                <a
                  key={item}
                  href={urls[item]}
                  className="relative px-2 py-1 text-sm uppercase tracking-wider transition-colors hover:text-blue-400 cursor-pointer whitespace-nowrap"
                >
                  <span>{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 hover:w-full"></span>
                </a>
              ))}
            </nav>

            <button className="md:hidden text-white focus:outline-none cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center z-10 pt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12" ref={heroContentRef}>
              {/* Title Heading With nice gradients and subtext/buttons container  */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                <span className="block">Crafting Digital</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Experiences
                </span>
              </h1>

              {/* Regular Text  */}
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg">
                Computer Science, Machine Learning student at Univeristy of
                Maryland, College Park with projects specialized in{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Machine Learning{" "}
                </span>
                ,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Cloud Computing
                </span>
                , and{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Full-Stack Development{" "}
                </span>
                technology and human experience.
              </p>

              {/* Projects and Contact Me buttons */}
              <div className="flex space-x-4">
                <a
                  href="https://github.com/alem425"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap"
                >
                  View Projects
                </a>
              </div>
            </div>

            {/* Image with background glow  */}
            <div className="md:w-1/2 mt-12 md:mt-0" ref={heroImageRef}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                <div className="relative bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800">
                  <img
                    src="/IMG_4464.JPG"
                    alt="Developer workspace"
                    className="w-full h-auto object-cover opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Down Carrot Icon  */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a
              href="#projects"
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <p className="fas fa-chevron-down text-2xl"></p>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 relative z-10">
        {/* Big Ol container for these projects */}
        <div className="container mx-auto px-6">
          {/* Top beginning with the featured projects tag a lil line and filler subtext  */}
          <div className="text-center mb-16" ref={projectsHeaderRef}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              Some of My Favorites ;)
            </p>
          </div>

          {/* Grid for all the projects  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Each project is mapped to this style */}
            {featuredProjects.map((project, index) => {
              // console.log(project.title, "GitHub URL:", project.github);
              const randomIndex = Math.floor(Math.random() * images.length);
              project.imageUrl === ""
                ? (project.imageUrl = images[randomIndex])
                : project.imageUrl;
              return (
                <div
                  key={project.id}
                  className="group relative"
                  ref={(el) => setProjectRef(el, index)}
                  onMouseEnter={() => setActiveProject(project.id)}
                  onMouseLeave={() => setActiveProject(null)}
                >
                  <div
                    className="absolute -inset-0.5 pointer-events-none
             bg-gradient-to-r from-blue-500 to-purple-600
             rounded-xl blur opacity-0 group-hover:opacity-30
             transition-opacity duration-300"
                  />
                  <div className="relative h-full bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-opacity-50">
                    {/* Image within the project card  */}
                    <div className="h-64 overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    {/* Project Info   */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 group-hover:text-white transition-colors duration-300">
                          {project.title}
                        </h3>
                        <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-xs rounded-full border border-gray-700">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {project.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <a
                          href="#"
                          className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center cursor-pointer whitespace-nowrap"
                        >
                          View details
                          <i className="fas fa-arrow-right ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
                        </a>
                        <div className="flex space-x-2">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log("Click detected");
                                window.open(project.github, "_blank");
                              }}
                              className="relative z-10 pointer-events-auto
               w-8 h-8 flex items-center justify-center
               rounded-full bg-black/40 border border-gray-700
               cursor-pointer hover:bg-black/60
               transition-colors"
                              role="button"
                              aria-label="View on GitHub"
                            >
                              <i className="fab fa-github text-sm text-gray-300 hover:text-white transition-colors" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Glow effect when hovering */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 ${activeProject === project.id ? "opacity-100" : ""}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* View All Projects Button  */}
          <div className="text-center mt-12">
            <a
              href="https://github.com/alem425"
              className="px-6 py-3 bg-black/30 backdrop-blur-lg border border-gray-700 text-white rounded-lg hover:bg-black/50 transition-all duration-300 inline-flex items-center cursor-pointer !rounded-button whitespace-nowrap"
            >
              View All Projects
              <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-20 relative z-10">
        {/* Header text with nice line again  */}
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" ref={skillsHeaderRef}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              Specialized domains where I create innovative solutions
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            ref={skillsGridRef}
          >
            {/* Machine Learning */}
            <div className="group relative" ref={(el) => setSkillRef(el, 0)}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative h-full bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-opacity-50 p-6">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/30">
                    <i className="fas fa-brain text-2xl text-blue-400"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">
                  Machine Learning/Artificial Intelligence
                </h3>
                <p className="text-gray-400 text-center mb-6">
                  Creating intelligent systems that learn and adapt through data
                  analysis and pattern recognition.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Python",
                    "Pandas",
                    "Scikit-learn",
                    "Neural Networks",
                    "Computer Vision",
                    "NLP",
                    "Predictive Analytics",
                    "Jupyter Notebook",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-900/30 text-xs rounded-full border border-blue-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cloud Computing */}
            <div className="group relative" ref={(el) => setSkillRef(el, 1)}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative h-full bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-opacity-50 p-6">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/30">
                    <i className="fas fa-cloud text-2xl text-purple-400"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">
                  Cloud Computing
                </h3>
                <p className="text-gray-400 text-center mb-6">
                  Building scalable, resilient infrastructure and services on
                  modern cloud platforms.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "AWS",
                    "Azure",
                    "Google Cloud Platform",
                    "Terraform",
                    "Kubernetes",
                    "Serverless",
                    "Microservices",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-900/30 text-xs rounded-full border border-purple-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Full-Stack Development */}
            <div className="group relative" ref={(el) => setSkillRef(el, 2)}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative h-full bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-opacity-50 p-6">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30">
                    <i className="fas fa-code text-2xl text-cyan-400"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">
                  Full-Stack Development
                </h3>
                <p className="text-gray-400 text-center mb-6">
                  Creating end-to-end web applications with modern frontend and
                  backend technologies.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Next.js",
                    "React",
                    "Node.js",
                    "HTML",
                    "CSS",
                    "TypeScript",
                    "SQL",
                    "MongoDB",
                    "Flask",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cyan-900/30 text-xs rounded-full border border-cyan-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
            <div
              className="relative bg-black/40 backdrop-blur-md border border-gray-800 rounded-xl p-8 md:p-12"
              ref={callToActionRef}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-2/3 mb-8 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Like What You See ?
                  </h2>
                  <p className="text-gray-300">
                    Let's collaborate on something great together :)
                  </p>
                </div>
                <div>
                  <a
                    href={urls["google"]}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 inline-flex items-center cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    Get in Touch
                    <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 border-t border-gray-800 relative z-10"
        ref={footerRef}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <a href="#" className="text-2xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Alexander Morgan
                </span>
              </a>
              <p className="text-gray-400 mt-2">
                Ready to build and collaborate in world changing products
              </p>
            </div>

            <div className="flex space-x-6">
              {(
                ["github", "linkedin", "google"] as Array<keyof typeof urls>
              ).map((platform) => (
                <a
                  key={platform}
                  href={urls[platform]}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-gray-700 cursor-pointer hover:bg-black/60 transition-colors"
                >
                  <i
                    className={`fab fa-${platform} text-gray-300 hover:text-white transition-colors`}
                  ></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
