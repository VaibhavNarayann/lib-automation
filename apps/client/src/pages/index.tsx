import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Library } from "lucide-react";
import heroImage from "@/assets/library-hero.jpg";
import RegistrationForm from "@/components/RegistrationForm";

const features = [
  { icon: BookOpen, title: "50,000+ Books", desc: "Vast collection across every genre" },
  { icon: Clock, title: "Open Daily", desc: "Mon–Sat, 8 AM to 8 PM" },
  { icon: Users, title: "Community Events", desc: "Workshops, readings & more" },
  { icon: Library, title: "Digital Access", desc: "E-books & online resources" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Library interior" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 drop-shadow-lg">
            The Grand Library
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-body max-w-xl mx-auto">
            A sanctuary of knowledge, imagination, and community
          </p>
          <a
            href="#register"
            className="inline-block mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-md font-body font-semibold hover:opacity-90 transition-opacity"
          >
            Become a Member
          </a>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-lg p-6 text-center"
            >
              <f.icon className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 font-body">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="py-16 px-6 bg-secondary/40">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Join Our Library</h2>
          <p className="text-muted-foreground font-body mt-2">Fill in the form below to become a member</p>
        </div>
        <RegistrationForm />
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground font-body">© 2026 The Grand Library. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
