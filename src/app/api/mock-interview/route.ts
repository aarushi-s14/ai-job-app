import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { question, answer } = await req.json();

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY!}`, // <-- Add this to .env.local
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free', // Or use 'deepseek-coder:latest' if that’s your chosen model
      messages: [
        {
          role: 'system',
          content: "You are a friendly and professional AI interviewer. Ask thoughtful follow-up questions based on the candidate's answers.",
        },
        {
          role: 'user',
          content: `The candidate was asked: "${question}". They responded: "${answer}". Please provide a thoughtful follow-up question.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error('DeepSeek Error:', data.error);
    return NextResponse.json({ followUp: "Sorry, there was an error generating a follow-up question." });
  }

  const followUp = data.choices?.[0]?.message?.content || 'Can you elaborate on that more?';

  return NextResponse.json({ followUp });
}

