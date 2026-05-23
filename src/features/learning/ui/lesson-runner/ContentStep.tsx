/**
 * @file src/features/learning/ui/lesson-runner/ContentStep.tsx
 * @updated 2026-05-22
 * @summary Renders educational content steps with interactive visual elements.
 * @scope Client UI; displays formatted content with animations and visual flows.
 */
'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ExternalLink, HelpCircle, ImageIcon, Info, Keyboard, Lightbulb, Terminal, Video, Zap } from 'lucide-react';
import NextImage from 'next/image';

interface ContentBlock {
  type: 'heading' | 'text' | 'list' | 'tip' | 'warning' | 'shortcut' | 'step' | 'code' | 'interactive-flow' | 'image-placeholder' | 'video-placeholder' | 'inline-image';
  content: string | string[] | { url: string; caption: string };
  icon?: string;
  animation?: string;
}

interface InteractiveFlowStep {
  title: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
}

type Props = {
  prompt: string;
  explanation: string | null;
  media?: Record<string, unknown> | null;
};

export function ContentStep({ prompt, explanation, media }: Props) {
  // Fix: replace literal \n with actual newlines
  const normalizedPrompt = prompt.replace(/\\n/g, '\n');
  const blocks = parseContent(normalizedPrompt);

  return (
    <div className="space-y-6">
      {/* Actual media from database */}
      {media && renderMediaBlock(media)}

      {blocks.map((block, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, duration: 0.4 }}
        >
          {renderBlock(block)}
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

function renderMediaBlock(media: Record<string, unknown>) {
  const url = typeof media.url === 'string' ? media.url : null;
  const type = typeof media.type === 'string' ? media.type : 'image';
  const alt = typeof media.alt === 'string' ? media.alt : 'Imatge de la lliçó';

  if (!url) return null;

  if (type === 'video') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border-2 border-[#e5e5e5] bg-black shadow-lg"
      >
        <video controls className="w-full" poster={typeof media.poster === 'string' ? media.poster : undefined}>
          <source src={url} type="video/mp4" />
          El teu navegador no suporta vídeos HTML5.
        </video>
        <p className="px-4 py-2 text-sm font-bold text-white">{alt}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-[#e5e5e5] bg-white shadow-lg"
    >
      <NextImage src={url} alt={alt} width={640} height={360} className="w-full object-cover" />
      <p className="px-4 py-2 text-center text-sm font-bold text-[#777777]">{alt}</p>
    </motion.div>
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

    if (trimmed.startsWith('!{')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      const match = trimmed.match(/^!\{(.+?)\}$/);
      if (match) {
        const inner = match[1];
        // !{url|caption} → render real image inline
        if (inner.includes('|')) {
          const pipeIdx = inner.indexOf('|');
          blocks.push({ type: 'inline-image', content: { url: inner.slice(0, pipeIdx), caption: inner.slice(pipeIdx + 1) } });
        } else {
          // !{caption} → placeholder for future image
          blocks.push({ type: 'image-placeholder', content: inner });
        }
      }
      continue;
    }

    if (trimmed.startsWith('!v{')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: currentList });
        currentList = [];
      }
      const match = trimmed.match(/^!v\{(.+?)\}$/);
      blocks.push({ type: 'video-placeholder', content: match ? match[1] : trimmed });
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

function renderBlock(block: ContentBlock) {
  switch (block.type) {
    case 'heading':
      return (
        <div className="flex items-center gap-3 border-b-2 border-[#58cc02] pb-3">
          <Zap className="h-8 w-8 text-[#58cc02]" />
          <h2 className="text-2xl font-black text-[#1f1f1f]">{renderFormattedText(block.content as string)}</h2>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          {(block.content as string).split('\n').map((line, i) => (
            <p key={i} className="text-lg font-bold leading-relaxed text-[#3c3c3c]">{renderFormattedText(line)}</p>
          ))}
        </div>
      );

    case 'list':
      return (
        <ul className="space-y-3">
          {(block.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#777777]" />
              <span className="text-base font-bold text-[#3c3c3c]">{renderFormattedText(item)}</span>
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
              <p className="mt-2 text-base font-bold leading-relaxed text-[#3c3c3c]">{renderFormattedText(item)}</p>
            </motion.div>
          ))}
        </div>
      );

    case 'tip':
      return (
        <div className="rounded-2xl bg-[#1cb0f6]/10 p-6 border-l-4 border-[#1cb0f6]">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-[#1cb0f6]" />
            <div className="space-y-2">
              {(block.content as string).split('\n').map((line, i) => (
                <p key={i} className="text-base font-bold text-[#1cb0f6]">{renderFormattedText(line)}</p>
              ))}
            </div>
          </div>
        </div>
      );

    case 'warning':
      return (
        <div className="rounded-2xl bg-amber-50 p-6 border-l-4 border-amber-400">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-600" />
            <div className="space-y-2">
              {(block.content as string).split('\n').map((line, i) => (
                <p key={i} className="text-base font-bold text-amber-900">{renderFormattedText(line)}</p>
              ))}
            </div>
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
                <p key={i} className="text-base font-black text-white">{renderFormattedText(line)}</p>
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

    case 'inline-image': {
      const img = block.content as { url: string; caption: string };
      return (
        <figure className="mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-[#e5e5e5] bg-white shadow-lg">
          <div className="relative">
            <NextImage
              src={img.url}
              alt={img.caption}
              width={640}
              height={360}
              className="w-full object-cover"
            />
          </div>
          <figcaption className="px-4 py-2 text-center text-sm font-bold text-[#777777]">
            {img.caption}
          </figcaption>
        </figure>
      );
    }

    case 'image-placeholder':
      return (
        <div className="mx-auto max-w-sm rounded-2xl border-2 border-dashed border-[#d0d0d0] bg-[#f5f5f5] px-6 py-8 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-[#c0c0c0]" />
          <p className="mt-2 text-xs font-bold text-[#afafaf]">{block.content as string}</p>
          <span className="mt-1 inline-block rounded-full bg-[#e5e5e5] px-3 py-0.5 text-[10px] font-bold text-[#afafaf]">
            Pendents
          </span>
        </div>
      );

    case 'video-placeholder':
      return (
        <div className="mx-auto max-w-sm rounded-2xl border-2 border-dashed border-[#d0d0d0] bg-[#f5f5f5] px-6 py-8 text-center">
          <Video className="mx-auto h-8 w-8 text-[#c0c0c0]" />
          <p className="mt-2 text-xs font-bold text-[#afafaf]">{block.content as string}</p>
          <span className="mt-1 inline-block rounded-full bg-[#e5e5e5] px-3 py-0.5 text-[10px] font-bold text-[#afafaf]">
            Pendents
          </span>
        </div>
      );

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
              <p className="mt-1 text-sm font-bold text-[#777777]">{renderFormattedText(step.description)}</p>
              {step.image ? (
                <div className="mt-3 overflow-hidden rounded-lg border border-[#e5e5e5]">
                  <NextImage
                    src={step.image}
                    alt={step.title}
                    width={400}
                    height={225}
                    className="w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function renderFormattedText(text: string): React.ReactNode {
  // Split by markdown patterns: [link](url), **bold**, *italic*, `code`
  const parts = text.split(/(\[.+?\]\(.+?\)|\*\*.*?\*\*|\*.*?\*|`.+?`)/g);
  
  return parts.map((part, i) => {
    // [text](url) - external link pill
    const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1cb0f6]/10 px-2.5 py-1 text-sm font-black text-[#1cb0f6] hover:bg-[#1cb0f6] hover:text-white transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {linkMatch[1]}
        </a>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-[#58cc02]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i} className="text-[#1cb0f6]">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="rounded bg-[#1f1f1f] px-2 py-0.5 text-sm font-mono text-[#58cc02]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
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
