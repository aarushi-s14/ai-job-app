'use client'

import { useState } from 'react';

export default function Home() {
  const [screen, setScreen] = useState('landing'); // 'landing', 'role', 'analyzer', 'mission', 'login'
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

  // Function to reset text boxes and go back to role selection
  const handleBackToRole = () => {
    setResume('');      // Clear resume input
    setJobDesc('');     // Clear job description input
    setScreen('role');  // Go back to role selection screen
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full p-10" style={{ backgroundColor: '#3F3DE8' }}>
        <div className="flex justify-end items-center space-x-4">
          <button
            className="px-6 py-3 rounded-xl text-lg font-semibold"
            style={{ backgroundColor: '#DD649C', color: '#FFFFFF' }}
            onClick={() => setScreen('mission')}
          >
            Our Mission
          </button>
          <button
            className="px-6 py-3 rounded-xl text-lg font-semibold"
            style={{ backgroundColor: '#DD649C', color: '#FFFFFF' }}
            onClick={() => setScreen('login')}
          >
            Login
          </button>
        </div>
      </div>

      {screen === 'landing' && (
        <div className="flex flex-col items-center justify-center text-center h-[90vh] px-4">
          <h1 className="text-6xl font-extrabold mb-4" style={{ color: '#DD649C' }}>
            Resu-ME
          </h1>
          <p className="text-2xl mb-8" style={{ color: 'black' }}>
            The perfect place to prep for an interview!
          </p>
          <button
            className="px-6 py-3 rounded-xl text-white text-lg font-semibold"
            style={{ backgroundColor: '#DD649C' }}
            onClick={() => setScreen('role')}
          >
            Let’s Go!
          </button>
        </div>
      )}

      {screen === 'mission' && (
        <div className="p-6 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'black' }}>Our Mission</h1>
          <p className="text-lg mb-6">
            Our mission is to help job seekers and employers alike find the best matches using smart AI tools.
          </p>
          <button
            className="absolute top-26 left-6 px-4 py-2 text-white rounded-xl text-sm"
            style={{ backgroundColor: '#DD649C' }}
            onClick={() => setScreen('landing')}
          >
            ← Back
          </button>
        </div>
      )}

      {screen === 'login' && (
        <div className="p-6 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'black' }}>Login</h1>
          <p className="text-lg mb-6">Login functionality coming soon!</p>
          <button
            className="absolute top-26 left-6 px-4 py-2 text-white rounded-xl text-sm"
            style={{ backgroundColor: '#DD649C' }}
            onClick={() => setScreen('landing')}
          >
            ← Back
          </button>
        </div>
      )}

      {screen === 'role' && (
        <div className="p-6 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'black' }}>AI Helper</h1>
          <div className="grid gap-4">
            <button
              className="px-4 py-2 text-white rounded-xl"
              style={{ backgroundColor: '#DD649C' }}
              onClick={() => {
                setRole('employee');
                setScreen('analyzer'); // Go directly to the analyzer screen after selecting a role
              }}
            >
              I’m a Job Seeker
            </button>
            <button
              className="px-4 py-2 text-white rounded-xl"
              style={{ backgroundColor: '#DD649C' }}
              onClick={() => {
                setRole('employer');
                setScreen('analyzer'); // Go directly to the analyzer screen after selecting a role
              }}
            >
              I’m an Employer
            </button>
          </div>
          <button
            className="absolute top-26 left-6 px-4 py-2 text-white rounded-xl text-sm"
            style={{ backgroundColor: '#DD649C' }}
            onClick={() => setScreen('landing')}
          >
            ← Back
          </button>
        </div>
      )}

      {screen === 'analyzer' && (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'black' }}>
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
              style={{ backgroundColor: '#DD649C' }}
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
          {/* ** Back Button Added Below ** */}
          <button
            className="absolute top-6 left-6 px-4 py-2 text-white rounded-xl text-sm"
            style={{ backgroundColor: '#DD649C' }}
            onClick={handleBackToRole} // Go back to the role selection screen and clear the inputs
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
