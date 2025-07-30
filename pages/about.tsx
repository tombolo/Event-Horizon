import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';


const About = () => (
  <>
    <Header />
    <main className="p-6 mt-16">
      <h1 className="text-4xl font-bold text-center mb-4">About</h1>
      <p className="text-center text-lg">This is the About page of GANSPRO, where we share information.</p>
    </main>
    <Footer />
  </>
);

export default About;
