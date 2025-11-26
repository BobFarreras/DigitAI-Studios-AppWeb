'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

// Tipus per a les props (per si en el futur venen de la base de dades)
type Testimonial = {
  id: number | string;
  name: string;
  company: string;
  text: string;
  rating: number;
};

type Props = {
  initialTestimonials: Testimonial[];
};

export function TestimonialsSection({ initialTestimonials }: Props) {
  return (
    <section id="testimonis" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Confiança <span className="gradient-text">Real</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Petites empreses que ja han fet el salt digital amb nosaltres.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {initialTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="testimonial-card relative flex flex-col justify-between h-full"
            >
              {/* Icona de cometa decorativa */}
              <Quote className="absolute top-6 right-6 text-primary/10 w-12 h-12 rotate-180" />

              <div>
                {/* Estrelles */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>

                <p className="text-lg italic text-foreground/80 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/40">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-primary font-medium">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}