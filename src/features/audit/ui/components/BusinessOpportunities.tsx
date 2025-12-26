import { BusinessSuggestion } from "@/types/ai";
import { Lightbulb, Calendar, ShoppingCart, Users, BarChart3, Settings, Rocket } from "lucide-react";

interface Props {
  suggestions: BusinessSuggestion[];
}

export function BusinessOpportunities({ suggestions }: Props) {
  if (!suggestions || suggestions.length === 0) return null;

  // Helper per mapejar icones (string -> component)
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'shop': return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'user': return <Users className="w-5 h-5 text-purple-600" />;
      case 'chart': return <BarChart3 className="w-5 h-5 text-amber-600" />;
      case 'settings': return <Settings className="w-5 h-5 text-slate-600" />;
      default: return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
          <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Oportunitats de Creixement</h3>
          <p className="text-sm text-muted-foreground">Detectades per IA segons el teu sector</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {suggestions.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                {getIcon(item.icon)}
              </div>
              {item.impact === 'high' && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
                  Alt Impacte
                </span>
              )}
            </div>
            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}