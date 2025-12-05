'use client';

import { useState } from 'react';
import { TestTaskDTO, TestResultDTO } from '@/types/models';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitTestFeedback } from '../actions';

// Simple toast casolà o usa 'sonner'/'react-hot-toast' si en tens
const notify = (msg: string) => alert(msg); 

export function TaskRunner({ task, existingResult }: { task: TestTaskDTO, existingResult?: TestResultDTO }) {
  const [isOpen, setIsOpen] = useState(!existingResult); 
  const [status, setStatus] = useState<string | null>(existingResult?.status || null);
  const [comment, setComment] = useState(existingResult?.comment || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (newStatus: 'pass' | 'fail' | 'blocked') => {
    setIsSaving(true);
    setStatus(newStatus); 
    
    const res = await submitTestFeedback(task.id, newStatus, comment);
    
    if (res.success) {
      setIsOpen(false); 
    } else {
      notify('Error guardant.');
    }
    setIsSaving(false);
  };

  return (
    <div className={`border rounded-xl mb-4 transition-all bg-white dark:bg-slate-900 ${
        status === 'pass' ? 'border-green-500/30 bg-green-50/10' : 
        status === 'fail' ? 'border-red-500/30 bg-red-50/10' : 
        'border-border'
    }`}>
      
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {status === 'pass' && <CheckCircle className="text-green-500 w-5 h-5" />}
          {status === 'fail' && <XCircle className="text-red-500 w-5 h-5" />}
          {status === 'blocked' && <AlertTriangle className="text-orange-500 w-5 h-5" />}
          {!status && <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />}
          
          <span className={`font-medium ${status ? 'text-slate-500' : 'text-foreground'}`}>
            {task.title}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </div>

      {/* Cos */}
      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-border mt-2">
          <p className="text-sm text-muted-foreground my-4 leading-relaxed bg-muted/30 p-3 rounded-lg border border-border">
            📝 <strong>Instrucció:</strong> {task.description}
          </p>

          <textarea 
            placeholder="Afegeix comentaris..." 
            value={comment || ''}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 mb-4 text-sm bg-background border border-input rounded-md min-h-[80px]"
          />

          <div className="flex gap-2 justify-end">
            <Button 
                size="sm" variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => handleSubmit('fail')} disabled={isSaving}
            >
              <XCircle className="w-4 h-4 mr-2" /> Falla
            </Button>
            <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleSubmit('pass')} disabled={isSaving}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Funciona
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}