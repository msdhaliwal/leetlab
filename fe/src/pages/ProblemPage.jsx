import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from 'lucide-react';

import { useProblemStore } from '../store/useProblemStore';
import { useExecutionStore } from '../store/useExecutionStore';
import { getLanguageId } from '../lib/lang';

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, /* isProblemLoading */ } = useProblemStore();
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting } = useExecutionStore();

  // const submissionCount = 10;

  useEffect(() => {
    getProblemById(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage.toUpperCase()] || ''); // we not use map here because we need to get the code snippet of the selected language

      setTestCases(
        problem.testCases?.map(tc => ({
          // we use map here because we need to get the input and output of the testcases
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  // Function to get the language ID based on the selected language
  const handleLanguageChange = e => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || '');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose max-w-none">
            <p className="mb-6 text-lg">{problem?.description}</p>

            {problem?.examples && (
              <>
                <h3 className="mb-4 text-xl font-bold">Examples:</h3>
                {Object.entries(problem?.examples).map(([lang, example], idx) => (
                  <div key={lang} className="bg-base-200 mb-6 rounded-xl p-6 font-mono">
                    <div className="mb-4">
                      <div className="mb-2 text-base font-semibold text-indigo-300">Input:</div>
                      <span className="rounded-lg bg-black/90 px-4 py-1 font-semibold text-white">
                        {example.input}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="mb-2 text-base font-semibold text-indigo-300">Output:</div>
                      <span className="rounded-lg bg-black/90 px-4 py-1 font-semibold text-white">
                        {example.output}
                      </span>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="mb-2 text-base font-semibold text-emerald-300">
                          Explanation:
                        </div>
                        <p className="text-base-content/70 font-sem text-lg">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {problem?.constraints && (
              <>
                <h3 className="mb-4 text-xl font-bold">Constraints:</h3>
                <div className="bg-base-200 mb-6 rounded-xl p-6">
                  <span className="rounded-lg bg-black/90 px-4 py-1 text-lg font-semibold text-white">
                    {problem?.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case 'submissions':
        return <div className="text-base-content/70 p-4 text-center">No Submisssion</div>;
      // return <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />;
      case 'discussion':
        return <div className="text-base-content/70 p-4 text-center">No discussions yet</div>;
      case 'hints':
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 rounded-xl p-6">
                <span className="rounded-lg bg-black/90 px-4 py-1 text-lg font-semibold text-white">
                  {problem?.hints}
                </span>
              </div>
            ) : (
              <div className="text-base-content/70 text-center">No hints available</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleRunCode = e => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map(tc => tc.input);
      const expected_outputs = problem.testCases.map(tc => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log('Error executing code', error);
    }
  };

  return (
    <div className="from-base-300 to-base-200 min-h-screen w-full max-w-7xl bg-gradient-to-br">
      {/* Navbar */}
      <nav className="navbar bg-base-100 px-4 shadow-lg">
        <div className="container flex-1 items-center gap-2">
          <Link to={'/'} className="text-primary flex items-center gap-2">
            <Home className="h-6 w-6" />
            <ChevronRight className="h-4 w-4" />
          </Link>
          <div className="mt-2">
            <h1 className="text-xl font-bold">{problem?.title}</h1>
            <div className="text-base-content/70 mt-5 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>
                Updated{' '}
                {new Date(problem?.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="h-4 w-4" />
              <span>{10} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="h-4 w-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex-none gap-4">
          <button
            className={`btn btn-ghost btn-circle ${isBookmarked ? 'text-primary' : ''}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="h-5 w-5" />
          </button>
          <select
            className="select select-bordered select-primary w-40"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem?.codeSnippets || {}).map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              {/* buttons --> description, submissions, discussion, hints */}
              <div className="tabs tabs-bordered">
                <button
                  className={`tab gap-2 ${activeTab === 'description' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  <FileText className="h-4 w-4" />
                  Description
                </button>
                <button
                  className={`tab gap-2 ${activeTab === 'submissions' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('submissions')}
                >
                  <Code2 className="h-4 w-4" />
                  Submissions
                </button>
                <button
                  className={`tab gap-2 ${activeTab === 'discussion' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('discussion')}
                >
                  <MessageSquare className="h-4 w-4" />
                  Discussion
                </button>
                <button
                  className={`tab gap-2 ${activeTab === 'hints' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('hints')}
                >
                  <Lightbulb className="h-4 w-4" />
                  Hints
                </button>
              </div>

              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>

          {/* Code Editor */}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button className="tab tab-active gap-2">
                  <Terminal className="h-4 w-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[600px] w-full">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={value => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 22,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="border-base-300 bg-base-200 border-t p-4">
                <div className="flex items-center justify-between">
                  <button
                    className={`btn btn-primary gap-2 ${isExecuting ? 'loading' : ''} `}
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    {!isExecuting && <Play className="h-4 w-4" />}
                    Run Code
                  </button>
                  <button className="btn btn-success gap-2">Submit Solution</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 mt-6 shadow-xl">
          <div className="card-body">
            {submission ? (
              <SubmissionResults submission={submission} />
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table-zebra table w-full">
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Expected Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testCases.map((testCase, index) => (
                        <tr key={index}>
                          <td className="font-mono">{testCase.input}</td>
                          <td className="font-mono">{testCase.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
