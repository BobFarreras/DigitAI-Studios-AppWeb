/**
 * @file src/features/learning/ui/lesson-runner/ContentStep.tsx
 * @updated 2026-05-22
 * @summary Renders educational content steps with proper formatting.
 * @scope Client UI; displays text, images, and interactive hotspots.
 */
import { Lightbulb, Keyboard, Monitor } from 'lucide-react';

type Props = {
  prompt: string;
  explanation: string | null;
};

export function ContentStep({ prompt, explanation }: Props) {
  const lines = prompt.split('\n').filter((line) => line.trim().length > 0);

  return (
    <div className="space-y-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={index} className="text-2xl font-black text-[#1f1f1f]">
              {trimmed.replace('# ', '')}
            </h2>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={index} className="text-lg font-bold text-[#58cc02] flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('! ')) {
          return (
            <div key={index} className="rounded-xl bg-amber-50 p-4 border-l-4 border-amber-400">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-bold text-amber-900">{trimmed.replace('! ', '')}</p>
              </div>
            </div>
          );
        }

        if (trimmed.startsWith('> ')) {
          return (
            <div key={index} className="rounded-xl bg-[#1cb0f6]/10 p-4 border-l-4 border-[#1cb0f6]">
              <div className="flex items-start gap-3">
                <Keyboard className="h-5 w-5 text-[#1cb0f6] mt-0.5 shrink-0" />
                <p className="text-sm font-black text-[#1cb0f6]">{trimmed.replace('> ', '')}</p>
              </div>
            </div>
          );
        }

        if (/^\d+\./.test(trimmed)) {
          return (
            <div key={index} className="flex items-start gap-3 pl-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#58cc02] text-xs font-black text-white">
                {trimmed.match(/^\d+/)?.[0]}
              </span>
              <p className="text-sm font-bold text-[#3c3c3c] leading-relaxed">{trimmed.replace(/^\d+\.\s*/, '')}</p>
            </div>
          );
        }

        if (trimmed.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-2 pl-4">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#777777]" />
              <p className="text-sm font-bold text-[#3c3c3c] leading-relaxed">{trimmed.replace('- ', '')}</p>
            </div>
          );
        }

        return (
          <p key={index} className="text-base font-bold text-[#3c3c3c] leading-relaxed">
            {trimmed}
          </p>
        );
      })}

      {explanation ? (
        <div className="mt-6 rounded-xl bg-[#e5e5e5]/50 p-4">
          <p className="text-sm font-bold text-[#777777]">{explanation}</p>
        </div>
      ) : null}
    </div>
  );
}
