/**
 * @file src/features/learning/ui/lesson-runner/ContentStep.tsx
 * @updated 2026-05-22
 * @summary Renders educational content steps with interactive visual elements.
 * @scope Client UI; displays formatted content with animations and visual flows.
 */
'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, HelpCircle, Info, Keyboard, Lightbulb, Terminal, Zap } from 'lucide-react';

interface ContentBlock {
  type: 'heading' | 'text' | 'list' | 'tip' | 'warning' | 'shortcut' | 'step' | 'code' | 'interactive-flow';
  content: string | string[];
  icon?: string;
  animation?: string;
}

interface InteractiveFlowStep {
  title: string;
  description: string;
  icon: string;
  color: string;
}

type Props = {
  prompt: string;
  explanation: string | null;
};

export function ContentStep({ prompt, explanation }: Props) {
  const blocks = parseContent(prompt);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, duration: 0.4 }}
        >
          {renderBlock(block, index)}
        </motion.div>
      ))}

      {explanation ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: blocks.length * 0.15 }}
          className="mt-8 rounded-2xl border-l-4 border-[#58cc02] bg-[#58cc02]/5 p-6"
        >
          <div className="flex items-start gap-3">
            <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-[#58cc02]" />
            <p className="text-sm font-bold leading-relaxed text-[#3c3c3c]">{explanation}</p>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

function parseContent(prompt: string): ContentBlock[] {
  const lines = prompt.split('\n').filter((l) => l.trim());
  const blocks: ContentBlock[] = [];
  let currentList: string[] = [];
  let currentType: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      blocks.push({ type: 'heading', content: trimmed.replace('## ', '') });
      continue;
    }

    if (trimmed.startsWith('! ')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      blocks.push({ type: 'warning', content: trimmed.replace('! ', '') });
      continue;
    }

    if (trimmed.startsWith('> ')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      blocks.push({ type: 'shortcut', content: trimmed.replace('> ', '') });
      continue;
    }

    if (trimmed.startsWith('$ ')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      blocks.push({ type: 'code', content: trimmed.replace('$ ', '') });
      continue;
    }

    if (trimmed.startsWith('? ')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      blocks.push({ type: 'tip', content: trimmed.replace('? ', '') });
      continue;
    }

    if (trimmed.startsWith('@ ')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      try {
        const steps: InteractiveFlowStep[] = JSON.parse(trimmed.replace('@ ', ''));
        blocks.push({ type: 'interactive-flow', content: JSON.stringify(steps) });
      } catch {
        blocks.push({ type: 'text', content: trimmed });
      }
      continue;
    }

    if (/^\d+\./.test(trimmed)) {
      if (currentType !== 'step') {
        if (currentList.length > 0) {
          blocks.push({ type: 'list', content: currentList });
          currentList = [];
        }
        currentType = 'step';
      }
      currentList.push(trimmed.replace(/^\d+\.\s*/, ''));
      continue;
    }

    if (trimmed.startsWith('- ')) {
      if (currentType !== 'list') {
        if (currentList.length > 0) {
          blocks.push({ type: 'list', content: currentList });
          currentList = [];
        }
        currentType = 'list';
      }
      currentList.push(trimmed.replace('- ', ''));
      continue;
    }

    if (currentList.length > 0) {
      blocks.push({ type: currentType === 'step' ? 'step' : 'list', content: currentList });
      currentList = [];
      currentType = null;
    }

    blocks.push({ type: 'text', content: trimmed });
  }

  if (currentList.length > 0) {
    blocks.push({ type: currentType === 'step' ? 'step' : 'list', content: currentList });
  }

  return blocks;
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'heading':
      return (
        <div className="flex items-center gap-3 border-b-2 border-[#58cc02] pb-3">
          <Zap className="h-8 w-8 text-[#58cc02]" />
          <h2 className="text-2xl font-black text-[#1f1f1f]">{block.content as string}</h2>
        </div>
      );

    case 'text':
      return <p className="text-lg font-bold leading-relaxed text-[#3c3c3c]">{block.content as string}</p>;

    case 'list':
      return (
        <ul className="space-y-3">
          {(block.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#777777]" />
              <span className="text-base font-bold text-[#3c3c3c]">{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'step':
      return (
        <div className="space-y-4">
          {(block.content as string[]).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#58cc02] text-sm font-black text-white shadow-[0_4px_0_#3f8f01]">
                {i + 1}
              </div>
              <p className="mt-2 text-base font-bold leading-relaxed text-[#3c3c3c]">{item}</p>
            </motion.div>
          ))}
        </div>
      );

    case 'tip':
      return (
        <div className="rounded-2xl bg-[#1cb0f6]/10 p-6 border-l-4 border-[#1cb0f6]">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-[#1cb0f6]" />
            <p className="text-base font-bold text-[#1cb0f6]">{block.content as string}</p>
          </div>
        </div>
      );

    case 'warning':
      return (
        <div className="rounded-2xl bg-amber-50 p-6 border-l-4 border-amber-400">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-600" />
            <p className="text-base font-bold text-amber-900">{block.content as string}</p>
          </div>
        </div>
      );

    case 'shortcut':
      return (
        <div className="rounded-2xl bg-[#1f1f1f] p-6 shadow-[0_8px_0_#000]">
          <div className="flex items-start gap-3">
            <Keyboard className="mt-1 h-6 w-6 shrink-0 text-[#58cc02]" />
            <div className="space-y-2">
              {(block.content as string).split('\n').map((line, i) => (
                <p key={i} className="text-base font-black text-white">{line}</p>
              ))}
            </div>
          </div>
        </div>
      );

    case 'code':
      return (
        <div className="rounded-xl bg-[#1f1f1f] p-4 font-mono text-sm text-[#58cc02] shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-[#777777]" />
            <span className="text-xs font-bold text-[#777777]">CMD / PowerShell</span>
          </div>
          <code className="text-lg font-bold">{block.content as string}</code>
        </div>
      );

    case 'interactive-flow':
      try {
        const steps: InteractiveFlowStep[] = JSON.parse(block.content as string);
        return <InteractiveFlow steps={steps} />;
      } catch {
        return <p className="text-sm text-red-500">Error parsing interactive flow</p>;
      }

    default:
      return null;
  }
}

function InteractiveFlow({ steps }: { steps: InteractiveFlowStep[] }) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 h-full w-1 bg-[#e5e5e5]" />
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative flex items-start gap-4 pl-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 + 0.1, type: 'spring' }}
              className="absolute left-0 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-[0_6px_0_#00000030]"
              style={{ backgroundColor: step.color }}
            >
              {getIcon(step.icon)}
            </motion.div>
            <div className="flex-1 rounded-xl bg-white p-4 shadow-[0_4px_0_#e5e5e5] border-2 border-[#e5e5e5]">
              <h4 className="text-lg font-black text-[#1f1f1f]">{step.title}</h4>
              <p className="mt-1 text-sm font-bold text-[#777777]">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function getIcon(iconName: string) {
  switch (iconName) {
    case 'terminal': return <Terminal className="h-8 w-8" />;
    case 'check': return <CheckCircle className="h-8 w-8" />;
    case 'warning': return <AlertTriangle className="h-8 w-8" />;
    case 'info': return <Info className="h-8 w-8" />;
    case 'zap': return <Zap className="h-8 w-8" />;
    default: return <Info className="h-8 w-8" />;
  }
}
