// src/pages/Homepage.jsx
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    ClerkProvider,
  } from "@clerk/clerk-react";
  import { useUser } from "@clerk/clerk-react";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import { LayoutGrid, Moon, Sun } from "lucide-react";
  import { motion } from "framer-motion";
  import { Link } from "react-router-dom";
  import { useEffect, useState } from "react";
  import Hero1 from "../assets/edusync-hero2.png";
  
  const features = [
    {
      title: "AI Quiz Generator",
      description: "Create personalized quizzes to test and enhance your knowledge.",
      link: "/quiz-generator",
    },
    {
      title: "Career Roadmaps",
      description: "Step-by-step guides for every tech career path.",
      link: "/roadmaps",
    },
    {
      title: "Curated Resources",
      description: "Handpicked resources for your skill growth.",
      link: "/resources",
    },
    {
      title: "AI Resume Builder",
      description: "Build ATS-optimized resumes with ease.",
      link: "/resume-builder",
    },
    {
      title: "Industry Insights",
      description: "Get the latest trends and analytics about your field.",
      link: "/insights",
    },
    {
      title: "AI Chatbot",
      description: "Ask questions and get instant, intelligent career guidance.",
      link: "/chatbot",
    },
  ];
  
  export default function Homepage() {
    const { user } = useUser();
    const [darkMode, setDarkMode] = useState(true);
  
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [darkMode]);
  
    return (
      <div className="min-h-screen bg-background text-foreground py-10 px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-primary">EduSync</h1>
          <div className="flex gap-4 items-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
  
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <img
            src={Hero1}
            alt="EduSync Hero"
            className="mx-auto mb-6 w-60 h-60 object-contain"
          />
          <h2 className="text-3xl font-semibold mb-4">
            Your AI-powered Career Intelligence Platform
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore, learn, and grow with cutting-edge tools designed to accelerate your career journey.
          </p>
        </div>
  
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={feature.link}>
                <Card className="rounded-2xl shadow hover:shadow-lg transition duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-primary">
                      <LayoutGrid className="w-6 h-6" />
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
  
        {/* Footer */}
        <footer className="mt-20 pt-10 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduSync. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    );
  }
  