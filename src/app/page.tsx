'use client'

import { useState } from 'react';

export default function Home() {
  const [screen, setScreen] = useState('landing'); // 'landing', 'role', 'analyzer', 'mission', 'login'
  const [role, setRole] = useState('');
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState('');
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const [transcript, setTranscript] = useState('');

  const [isInterviewActive, setInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  let mediaRecorder: MediaRecorder;
  let audioChunks: Blob[] = [];

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
    // Clear the interview states and reset them
    setInterviewActive(false);  // This will hide the Mock Interview UI
    setCurrentQuestion('');     // Clear the current question
    setAudioUrl('');            // Clear any audio URL
    setTranscript('');          // Clear any transcript

    // Clear the resume and job description fields
    setResume('');
    setJobDesc('');
    setResult('');

    // Go back to the role selection screen
    setScreen('role');
  };

  // Mock Interview Controls
  const startMockInterview = () => {
    setCurrentQuestion("Tell me about a time you overcame a challenge at work.");
    setInterviewActive(true);
    speak("Tell me about a time you overcame a challenge at work.");
  };

  const endMockInterview = () => {
    setInterviewActive(false);
    setCurrentQuestion('');
    setAudioUrl('');
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new MediaRecorder(stream);
      let localChunks: Blob[] = [];

      newRecorder.ondataavailable = (event) => {
        localChunks.push(event.data);
      };

      newRecorder.onstop = async () => {
        const audioBlob = new Blob(localChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecording(false);

        // 🔁 Step 1: Transcribe audio
        const formData = new FormData();
        formData.append("file", audioBlob);
        formData.append("model", "whisper-1");
        const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // or from your .env
          },
          body: formData,
        });

        const whisperData = await whisperRes.json();
        const userAnswer = whisperData.text;
        setTranscript(userAnswer);

        // 🔁 Step 2: Send to AI backend for follow-up
        const aiRes = await fetch("/api/mock-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentQuestion,
            answer: userAnswer,
          }),
        });

        const aiData = await aiRes.json();
        const followUp = aiData.followUp;
        setCurrentQuestion(followUp);

        // 🔁 Step 3: Speak it
        speak(followUp);
      };

      newRecorder.start();
      setRecorder(newRecorder); // Save the recorder in state
    } catch (err) {
      console.error("Mic access error:", err);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    } else {
      console.warn("No active recorder found.");
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'public/Untitled design (2).png', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="w-full p-1" style={{ backgroundColor: '#3F3DE8' }}>
        <div className="flex justify-between items-center space-x-4">
          <img
            src="Screenshot 2025-04-05 5.50.52 PM.png"
            alt="Logo"
            className="w-25 h-25 rounded-full object-cover border border-gray-300"
          />
          <div className="flex space-x-4">
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
      </div>

      {screen === 'landing' && (
        <div className="flex flex-col items-center justify-center text-center h-[90vh] px-4">
          <h1 className="text-9xl font-bold mb-4" style={{ color: '#DD649C' }}>
            Resu-ME
          </h1>
          <p className="text-2xl mb-8" style={{ color: 'black' }}>
            The perfect place to prep for an interview! "The Only AI Interviewer Prep."
          </p>
          <br></br>
          <img
            src="772299788.jpg"
            alt="Home"
            className="w-300 h-125"
          />
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
          <img
            src="IMG_1760-EDIT.jpg"
            alt="Our Mission"
            className="w-500 h-100 rounded-full object-cover border border-gray-300"
          />
          <p className="text-lg mb-6">
            Our goal is to enhance resumes to effectively highlight individuals' skills and experiences. We aim to improve applicants' chances of acceptance by refining their resumes. Additionally, we assist employers in narrowing down candidates by allowing them to input specific key words. We also offer a tool that enables applicants to practice for mock interviews through AI-powered video calls. Furthermore, our website provides examples of resumes of past users.
          </p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'black' }}>Privacy</h2>
          <img
            src="privacy.jpg"
            alt="Privacy"
            className="w-500 h-100 rounded-full object-cover border border-gray-300"
          />
          <p>One of the primary objectives of Resu-ME is to safeguard the information we gather from our users, ensuring that it remains confidential and is not disclosed to any third parties. We are dedicated to upholding the highest standards of user privacy while implementing robust security measures to protect data from unauthorized access or breaches. Your trust is important to us, and we strive to create a safe environment for your personal information.</p>
          <button
            className="absolute top-35 left-6 px-4 py-2 text-white rounded-xl text-sm"
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
            className="absolute top-35 left-6 px-4 py-2 text-white rounded-xl text-sm"
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
            className="absolute top-35 left-6 px-4 py-2 text-white rounded-xl text-sm"
            style={{ backgroundColor: '#DD649C' }}
            onClick={() => setScreen('landing')}
          >
            ← Back
          </button>
          <br></br>
          <img
            src="artapixel-interview-office-job-pv.jpg"
            alt="Interview"
            className="w-500 h-100 rounded-full object-cover border border-gray-300"
          />
        </div>
      )}

      {screen === 'analyzer' && (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'black' }}>
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

            <div className="flex flex-wrap mt-4 gap-4">
              <button
                className="px-4 py-2 text-white rounded-xl"
                style={{ backgroundColor: '#DD649C' }}
                onClick={handleAnalyze}
              >
                {role === 'employee' ? 'Analyze Fit' : 'Analyze Candidate'}
              </button>

              {role === 'employee' && (
                <button
                  className="px-4 py-2 text-white rounded-xl"
                  style={{ backgroundColor: '#3F3DE8' }}
                  onClick={startMockInterview}
                >
                  Start Mock Interview
                </button>
              )}
            </div>

            {result && (
              <div className="mt-4 whitespace-pre-wrap bg-gray-100 p-4 rounded-xl">
                {result}
              </div>
            )}

            {/* Only render the Mock Interview UI if isInterviewActive is true */}
            {isInterviewActive && (
              <div className="mt-6 bg-gray-100 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-black">Mock Interview</h3>

                <div className="flex items-start gap-6 mb-6">
                  <img
                    src="interviewerImage.png"
                    alt="AI Interviewer"
                    className="w-500 h-100 rounded-full object-cover border border-gray-300"
                  />
                  <div className="relative bg-blue-100 p-4 rounded-xl max-w-[80%]">
                    <div className="absolute -top-2 left-2 transform rotate-45 bg-blue-100 w-4 h-4 border-t border-l border-blue-100"></div>
                    <p className="text-black">
                      <strong>AI Interviewer:</strong> {currentQuestion}
                    </p>
                  </div>
                </div>

                <button
                  className="mt-2 px-3 py-1 rounded text-sm text-white"
                  style={{ backgroundColor: '#3F3DE8' }}
                  onClick={() => speak(currentQuestion)}
                >
                  🔊 Hear Question
                </button>

                <div className="flex gap-4 items-center mt-4">
                  {!recording ? (
                    <button
                      className="px-4 py-2 rounded-xl text-white"
                      style={{ backgroundColor: '#DD649C' }}
                      onClick={startRecording}
                    >
                      🎙️ Record Answer
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 rounded-xl text-white"
                      style={{ backgroundColor: '#FF6B6B' }}
                      onClick={stopRecording}
                    >
                      ⏹️ Stop Recording
                    </button>
                  )}

                  {audioUrl && (
                    <audio controls className="ml-2">
                      <source src={audioUrl} type="audio/webm" />
                    </audio>
                  )}
                </div>

                <button
                  className="mt-4 px-4 py-2 text-white rounded-xl"
                  style={{ backgroundColor: '#DD649C' }}
                  onClick={endMockInterview}
                >
                  End Interview
                </button>
              </div>
            )}
          </div>

          {/* Back button */}
          <button
            className="absolute top-35 left-6 px-4 py-2 text-white rounded-xl text-sm"
            style={{ backgroundColor: '#DD649C' }}
            onClick={handleBackToRole} // Handle reset and go back
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
