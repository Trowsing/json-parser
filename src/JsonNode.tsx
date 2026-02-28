import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from './lib/utils';

interface JsonNodeProps {
  data: any;
  name?: string;
  isLast?: boolean;
  depth?: number;
}

export const JsonNode: React.FC<JsonNodeProps> = ({ data, name, isLast = true, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const type = typeof data;
  const isObject = data !== null && type === 'object';
  const isArray = Array.isArray(data);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const renderValue = () => {
    if (data === null) return <span className="text-rose-500 dark:text-rose-400">null</span>;
    if (type === 'string') return <span className="text-emerald-600 dark:text-emerald-400">"{data}"</span>;
    if (type === 'number') return <span className="text-amber-600 dark:text-amber-400">{data}</span>;
    if (type === 'boolean') return <span className="text-blue-600 dark:text-blue-400">{String(data)}</span>;
    return null;
  };

  if (!isObject) {
    return (
      <div className="flex items-start py-0.5 font-mono text-sm">
        <div className="w-4 shrink-0" />
        {name && <span className="text-neutral-500 dark:text-neutral-400 mr-2">"{name}":</span>}
        {renderValue()}
        {!isLast && <span className="text-neutral-400">,</span>}
      </div>
    );
  }

  const keys = Object.keys(data);
  const isEmpty = keys.length === 0;
  const bracketOpen = isArray ? '[' : '{';
  const bracketClose = isArray ? ']' : '}';

  return (
    <div className="font-mono text-sm">
      <div 
        className="flex items-start py-0.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/50 rounded px-1 -ml-1 transition-colors group"
        onClick={toggleExpand}
      >
        <div className="w-4 shrink-0 flex items-center justify-center mt-1">
          {!isEmpty && (
            isExpanded ? 
              <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200" /> : 
              <ChevronRight size={14} className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200" />
          )}
        </div>
        {name && <span className="text-neutral-500 dark:text-neutral-400 mr-2">"{name}":</span>}
        <span className="text-neutral-400">{bracketOpen}</span>
        {!isExpanded && !isEmpty && (
          <span className="text-neutral-400 mx-1 px-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
            {isArray ? `${data.length} items` : `${keys.length} keys`}
          </span>
        )}
        {!isExpanded && <span className="text-neutral-400">{bracketClose}{!isLast && ','}</span>}
      </div>

      {isExpanded && (
        <div className="pl-4 border-l border-neutral-200 dark:border-neutral-800 ml-2">
          {keys.map((key, index) => (
            <JsonNode 
              key={key} 
              data={data[key]} 
              name={isArray ? undefined : key} 
              isLast={index === keys.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="flex items-start py-0.5">
          <div className="w-4 shrink-0" />
          <span className="text-neutral-400">{bracketClose}{!isLast && ','}</span>
        </div>
      )}
    </div>
  );
};
