import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
      const { resume, jobDesc } = await req.json();
  
      const prompt = `
Follow these tasks to analyze the resume and job description. I do not want to know your full thought process.  
  Resume:
  ${resume}
  
  Job Description:
  ${jobDesc}
  
  Tasks:
  1. Rate the resume's fit for the job (1–10).
  2. Provide 3 suggestions to improve the resume.
  3. Generate 3 tailored interview questions.
  `;
  
      const res = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free', // Updated model name
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });
  
      const json = await res.json();
      console.log('Full DeepSeek API response:', JSON.stringify(json, null, 2));
  
      let result = 'No response from DeepSeek.';
      if (json.choices && json.choices.length > 0) {
        result = json.choices[0].message?.content ?? 'Response format unexpected.';
      }
  
      return NextResponse.json({ result });
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Something went wrong with DeepSeek.' },
        { status: 500 }
      );
    }
  }
  