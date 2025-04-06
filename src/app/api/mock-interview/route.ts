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
          content: "You are a professional AI interviewer. Ask a follow-up question based on the candidate's response. You should analyze the answer deeply and generate follow-up questions that explore multiple aspects of the response, such as: - Asking for more details or specific examples.- Asking about challenges or difficulties related to the answer.- Probing into motivations, feelings, or reasoning behind the answer - Exploring any contradictions or assumptions in the answer. Avoid repeating the same question or asking for simple clarifications."
        },
        {
          role: 'user',
          content: `The candidate was asked: "${question}". They responded: "${answer}". Please provide a follow-up question in quotes that digs deeper, explores new angles, or requests more context based on the response.`,
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

  // Extract and clean up the follow-up response
  let followUp = data.choices?.[0]?.message?.content || 'Can you elaborate on that more?';

  // 🔥 Remove <think></think> blocks
  followUp = followUp.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 🔥 Remove text between --- symbols
  followUp = followUp.replace(/---[\s\S]*?---/gi, '').trim();

  // 🔥 Extract only text inside quotation marks
  const quotedText = followUp.match(/"([^"]+)"/);
  const cleanFollowUp = quotedText ? quotedText[1] : followUp; // Use the quoted text or fall back to full follow-up

  return NextResponse.json({ followUp: cleanFollowUp });
}
