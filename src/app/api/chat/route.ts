import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import webtoons from '@/data/webtoons.json';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Create a lightweight context for Gemini to save tokens
const webtoonContext = webtoons.map((w: any) => ({
    title: w.title,
    author: w.author,
    link: w.link,
    thumbnail: w.thumbnail,
    genres: w.genre ? w.genre.filter((g: string) => !g.includes('\n')).slice(0, 3).join(', ') : '',
    story: w.story ? w.story.substring(0, 150) + '...' : ''
}));

const SYSTEM_PROMPT = `
당신은 사용자의 취향에 맞는 웹툰을 추천해주는 친절한 AI 어시스턴트입니다.
아래 제공된 웹툰 데이터베이스 목록 내에서만 추천해야 합니다.
사용자가 장르, 분위기, 스토리 등을 말하면 그에 가장 잘 맞는 웹툰 1~3개를 추천해주고 추천 이유를 간략하게 설명해주세요.
답변은 친근하고 자연스러운 한국어로 작성하되, **반드시 아래의 정확한 JSON 형식**으로만 응답해야 합니다. (다른 텍스트나 Markdown 블록 기호는 포함하지 마세요)

[
  {
    "type": "text",
    "content": "추천 인사말 및 설명 내용..."
  },
  {
    "type": "webtoon",
    "title": "웹툰 제목",
    "author": "작가 이름",
    "link": "https://...",
    "thumbnail": "https://...",
    "reason": "이 웹툰을 추천하는 이유 (1~2문장)"
  }
]

[웹툰 데이터베이스]:
${JSON.stringify(webtoonContext, null, 2)}
`;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: message,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
            }
        });

        return NextResponse.json({ reply: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: 'An error occurred while generating a response.' },
            { status: 500 }
        );
    }
}
