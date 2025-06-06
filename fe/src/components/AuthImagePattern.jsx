import { Code, Terminal, FileCode, Braces } from 'lucide-react';
import { useEffect, useState } from 'react';

const CodeBackground = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Code snippets to display in the background
  const codeSnippets = [
    `function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
          return [map.get(complement), i];
        }
        map.set(nums[i], i);
      }
      return [];
    }`,
    `class ListNode {
      constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
      }
    }

    function reverseList(head) {
      let prev = null;
      let current = head;
      while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
      }
      return prev;
    }`,
    `function isValid(s) {
      const stack = [];
      const map = {
        '(': ')',
        '{': '}',
        '[': ']'
      };
      
      for (let i = 0; i < s.length; i++) {
        if (s[i] in map) {
          stack.push(s[i]);
        } else {
          const last = stack.pop();
          if (map[last] !== s[i]) return false;
        }
      }
      
      return stack.length === 0;
    }`,
  ];

  // Rotate through code snippets
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % codeSnippets.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  return (
    <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-slate-900 p-12 text-white lg:flex">
      {/* Animated code symbols in background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[10%] left-[15%] animate-pulse">
          <Braces size={40} />
        </div>
        <div className="absolute top-[30%] left-[80%] animate-pulse delay-300">
          <FileCode size={50} />
        </div>
        <div className="absolute top-[70%] left-[20%] animate-pulse delay-700">
          <Terminal size={45} />
        </div>
        <div className="absolute top-[60%] left-[75%] animate-pulse delay-500">
          <Code size={55} />
        </div>
        <div className="absolute top-[85%] left-[45%] animate-pulse delay-200">
          <Braces size={35} />
        </div>
        <div className="absolute top-[15%] left-[60%] animate-pulse delay-100">
          <Terminal size={30} />
        </div>
      </div>

      <div className="z-10 flex max-w-md flex-col items-center">
        {/* Code editor mockup */}
        <div className="mb-8 w-full overflow-hidden rounded-lg bg-slate-800 shadow-xl">
          {/* Editor header */}
          <div className="flex items-center bg-slate-700 px-4 py-2">
            <div className="mr-4 flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-mono text-xs opacity-70">problem.js</div>
          </div>

          {/* Code content */}
          <div className="relative h-64 overflow-hidden p-4 font-mono text-xs sm:text-sm">
            <pre className="whitespace-pre-wrap text-green-400 transition-opacity duration-1000">
              {codeSnippets[activeIndex]}
            </pre>

            {/* Blinking cursor */}
            <div className="animate-blink absolute right-4 bottom-4 h-4 w-2 bg-white"></div>
          </div>
        </div>

        {/* Logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
            <Code className="text-primary h-6 w-6" />
          </div>
        </div>

        {/* Text content */}
        <h2 className="mb-4 text-center text-2xl font-bold">{title}</h2>
        <p className="text-center text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
};

export default CodeBackground;
