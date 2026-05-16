'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  TrendingUp, 
  Zap, 
  Target, 
  Share2, 
  BrainCircuit 
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Clock,
    title: 'Estalvi de temps',
    description: 'Automatitza tasques repetitives i allibera fins a 40 hores setmanals per centrar-te en el que realment importa.'
  },
  {
    icon: TrendingUp,
    title: 'Productivitat x3',
    description: "Incrementa l'eficiència del teu equip amb processos intel·ligents i fluxos de treball sense errors."
  },
  {
    icon: Zap,
    title: 'Respostes 24/7',
    description: 'Chatbots intel·ligents que atenen els teus clients a qualsevol hora, sense descans i amb precisió.'
  },
  {
    icon: Target,
    title: 'Adaptació a mida',
    description: "No et donem una plantilla. La nostra IA s'entrena amb les dades específiques del teu negoci."
  },
  {
    icon: Share2,
    title: 'Màrqueting Autopilot',
    description: 'Generació i publicació de contingut a xarxes socials de forma autònoma i estratègica.'
  },
  {
    icon: BrainCircuit,
    title: 'Decisions amb Dades',
    description: 'Analítica predictiva per anticipar-te a les tendències del mercat i prendre millors decisions.'
  }
];

export function BenefitsSection() {
  return (
    <section id="beneficis" className="py-24 relative overflow-hidden">
      {/* Element decoratiu de fons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        {/* Capçalera de secció */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Beneficis de la <span className="gradient-text">Nova Era</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            La tecnologia no ha de ser complicada. Descobreix com simplifiquem el teu dia a dia.
          </p>
        </motion.div>
        
        {/* Graella de beneficis */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="solution-card-futuristic p-8 rounded-3xl flex flex-col items-center text-center group"
            >
              <div className="benefit-icon group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}