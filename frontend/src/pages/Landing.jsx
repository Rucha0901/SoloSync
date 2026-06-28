import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "../components/Landing/LandingNavbar";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import Workflow from "../components/Landing/Workflow";
import DashboardPreview from "../components/Landing/DashboardPreview";
import Testimonials from "../components/Landing/Testimonials";
import FinalCTA from "../components/Landing/FinalCTA";
import Footer from "../components/Landing/Footer";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <DashboardPreview />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
