'use client'

import { useState } from 'react';

export default function Home() {
  const [screen, setScreen] = useState('landing'); // 'landing', 'role', 'analyzer'
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
    <div className="min-h-screen" style={{ backgroundColor: '#E7E7FF' }}>
      <div className="w-full p-4" style={{ backgroundColor: '#B2EA5F' }} />

      {screen === 'landing' && (
        <div className="flex flex-col items-center justify-center text-center h-[90vh] px-4">
          <h1 className="text-6xl font-extrabold mb-4" style={{ color: '#74ED29' }}>
            resuME
          </h1>
          <p className="text-2xl mb-8" style={{ color: '#74ED29' }}>
            The perfect place to prep for an interview!
          </p>
          <button
            className="px-6 py-3 rounded-xl text-white text-lg font-semibold"
            style={{ backgroundColor: '#86B2F5' }}
            onClick={() => setScreen('role')}
          >
            Let’s Go!
          </button>
        </div>
      )}

      {screen === 'role' && (
        <div className="p-6 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#74ED29' }}>AI Helper</h1>
          <div className="grid gap-4">
            <button
              className="px-4 py-2 text-white rounded-xl"
              style={{ backgroundColor: '#86B2F5' }}
              onClick={() => setRole('employee')}
            >
              I’m a Job Seeker
            </button>
            <button
              className="px-4 py-2 text-white rounded-xl"
              style={{ backgroundColor: '#86B2F5' }}
              onClick={() => setRole('employer')}
            >
              I’m an Employer
            </button>
          </div>
        </div>
      )}

      {(role === 'employee' || role === 'employer') && (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#74ED29' }}>
              {role === 'employee' ? 'Resume Analyzer' : 'Candidate Analyzer'}
            </h2>
            <textarea
              className="p-2 border rounded-xl w-full h-40 mt-2"
              placeholder={role === 'employee' ? 'Paste your resume here...' : 'Paste candidate resume here...'}
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
              className="px-4 py-2 text-white rounded-xl mt-4"
              style={{ backgroundColor: '#86B2F5' }}
              onClick={handleAnalyze}
            >
              {role === 'employee' ? 'Analyze Fit' : 'Analyze Candidate'}
            </button>
            {result && (
              <div className="mt-4 whitespace-pre-wrap bg-gray-100 p-4 rounded-xl">
                {result}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}