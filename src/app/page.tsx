'use client'

import { useState } from 'react';

export default function Home() {
  const [role, setRole] = useState('');
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jobDesc }),
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Job Helper</h1>

      {!role && (
        <div className="grid gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
            onClick={() => setRole('employee')}
          >
            I’m a Job Seeker
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
            onClick={() => setRole('employer')}
          >
            I’m an Employer
          </button>
        </div>
      )}

      {role === 'employee' && (
        <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Resume Analyzer</h2>
          <textarea
            className="p-2 border rounded-xl w-full h-40 mt-4"
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
          <textarea
            className="p-2 border rounded-xl w-full h-40 mt-4"
            placeholder="Paste the job description here (optional)..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-xl mt-4"
            onClick={handleAnalyze}
          >
            Analyze Fit
          </button>
          {result && <div className="mt-4 whitespace-pre-wrap bg-gray-100 p-4 rounded-xl">{result}</div>}
        </div>
      )}

      {role === 'employer' && (
        <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Candidate Analyzer</h2>
          <textarea
            className="p-2 border rounded-xl w-full h-40 mt-4"
            placeholder="Paste candidate resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
          <textarea
            className="p-2 border rounded-xl w-full h-40 mt-4"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-xl mt-4"
            onClick={handleAnalyze}
          >
            Analyze Candidate
          </button>
          {result && <div className="mt-4 whitespace-pre-wrap bg-gray-100 p-4 rounded-xl">{result}</div>}
        </div>
      )}
    </div>
  );
}
