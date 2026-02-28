import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Copy, Check, Trash2, Maximize2, Minimize2, Code2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JsonNode } from './JsonNode';
import { cn } from './lib/utils';

export default function App() {
  const [input, setInput] = useState('{\n  "project": "JSON Parser",\n  "version": "1.0.0",\n  "features": [\n    "Minimalist Design",\n    "Dark/Light Theme",\n    "Recursive Rendering",\n    "Expand/Collapse Support"\n  ],\n  "stats": {\n    "performance": 99.9,\n    "latency": "minimal"\n  }\n}');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);

  const handleCopyOutput = () => {
    try {
      const formatted = JSON.stringify(parsedData, null, 2);
      navigator.clipboard.writeText(formatted);
      setOutputCopied(true);
      setTimeout(() => setOutputCopied(false), 2000);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      if (input.trim() === '') {
        setParsedData(null);
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, [input]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(input), null, 2);
      setInput(formatted);
    } catch (e) {}
  };

  const handleMinify = () => {
    try {
      const minified = JSON.stringify(JSON.parse(input));
      setInput(minified);
    } catch (e) {}
  };

  const handleSortKeys = () => {
    try {
      const sortObj = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObj);
        return Object.keys(obj).sort().reduce((acc: any, key) => {
          acc[key] = sortObj(obj[key]);
          return acc;
        }, {});
      };
      const sorted = JSON.stringify(sortObj(JSON.parse(input)), null, 2);
      setInput(sorted);
    } catch (e) {}
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 selection:bg-indigo-500/30",
      isDarkMode ? "dark bg-[#0A0A0A] text-neutral-100" : "bg-neutral-50 text-neutral-900"
    )}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Code2 size={20} />
            </div>
            <h1 className="font-semibold tracking-tight text-lg">JSON Parser</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500 dark:text-neutral-400"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={cn(
          "grid gap-6 transition-all duration-500",
          isFullWidth ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        )}>
          {/* Input Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Raw Input</h2>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleFormat}
                  className="px-3 py-1 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                >
                  Format
                </button>
                <button 
                  onClick={handleMinify}
                  className="px-3 py-1 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                >
                  Minify
                </button>
                <button 
                  onClick={handleSortKeys}
                  className="px-3 py-1 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                >
                  Sort
                </button>
                <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-1" />
                <button 
                  onClick={handleDownload}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded transition-colors"
                  title="Download"
                >
                  <Download size={16} />
                </button>
                <button 
                  onClick={handleClear}
                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-neutral-400 hover:text-rose-500 rounded transition-colors"
                  title="Clear"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded transition-colors"
                  title="Copy"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                className={cn(
                  "w-full h-[600px] p-6 font-mono text-sm bg-white dark:bg-[#111111] border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all custom-scrollbar resize-none",
                  error ? "border-rose-500/50" : "border-neutral-200 dark:border-neutral-800"
                )}
                placeholder="Paste your JSON here..."
              />
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl backdrop-blur-sm"
                  >
                    <p className="text-xs font-mono text-rose-500">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Output Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Parsed View</h2>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleCopyOutput}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded transition-colors"
                  title="Copy Formatted"
                >
                  {outputCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={() => setIsFullWidth(!isFullWidth)}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded transition-colors"
                  title={isFullWidth ? "Split View" : "Full View"}
                >
                  {isFullWidth ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

            <div className="w-full h-[600px] p-6 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-auto custom-scrollbar">
              {parsedData ? (
                <JsonNode data={parsedData} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Code2 size={24} />
                  </div>
                  <p className="text-sm font-medium">Waiting for valid JSON input...</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <span className="font-mono">Lumina v1.0.0</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span>Crafted for clarity</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Documentation</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">GitHub</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
