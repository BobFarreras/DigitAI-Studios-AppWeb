import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Benvingut, Arquitecte.</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
           <CardHeader>
             <CardTitle className="text-sm font-medium text-slate-400">Estat del Sistema</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-green-500">OPERATIU 🟢</div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}