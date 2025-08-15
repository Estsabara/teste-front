import { Card } from "@/components/ui/card";
import { Zap, Shield, Sparkles, Rocket } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Built for speed with modern architecture that scales with your needs."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure by Default",
      description: "Enterprise-grade security with end-to-end encryption and privacy controls."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Powered",
      description: "Intelligent automation that learns from your workflow and adapts."
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Deploy Instantly",
      description: "From idea to production in minutes with our streamlined deployment."
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to turn your vision into reality, backed by cutting-edge technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;