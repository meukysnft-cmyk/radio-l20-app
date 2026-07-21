const GEMINI_API_KEY = () => process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = 'gemini-1.5-flash'

type RewriteResult = {
  title: string
  content: string
  excerpt: string
  imageUrl: string
  sourceUrl: string
}

async function extractArticle(url: string): Promise<{ title: string; body: string; imageUrl: string }> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(12_000),
    redirect: 'follow',
  })
  const html = await res.text()

  const title =
    html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)?.[1]
    || html.match(/<title>([^<]*)<\/title>/)?.[1]
    || ''

  const imageUrl = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)?.[1] || ''

  const bodyParts: string[] = []

  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i)
  const container = articleMatch?.[0] || html

  const pTags = container.match(/<p[^>]*>([\s\S]*?)<\/p>/gi)
  if (pTags) {
    for (const p of pTags) {
      const text = p.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#\d+;/g, '').trim()
      if (text && text.length > 20) {
        bodyParts.push(text)
      }
    }
  }

  const body = bodyParts.slice(0, 30).join('\n\n')
  return { title: title.trim(), body, imageUrl }
}

function buildPrompt(originalTitle: string, originalBody: string, instructions: string): string {
  return `Você é um redator de notícias da Rádio L20, uma rádio comunitária de Pilar, Alagoas.

Reescreva a notícia abaixo em português brasileiro, em tom jornalístico e acessível. 
Mude a estrutura dos parágrafos, o vocabulário e a ordem das informações, mas mantenha todos os fatos, nomes, números, citações e dados exatos.
Adicione um parágrafo de contexto local ("Em Pilar, AL...") se fizer sentido.
O resultado deve ser original e evitar plágio textual.

${instructions ? `Instruções adicionais do editor:\n${instructions}\n` : ''}

Responda APENAS com um JSON válido neste formato (sem acentos ou caracteres especiais extras):
{
  "title": "Título reescrito em até 15 palavras",
  "content": "Conteúdo completo em parágrafos HTML (<p>...</p>)",
  "excerpt": "Resumo de até 30 palavras"
}

Notícia original:
Título: ${originalTitle}
Conteúdo:
${originalBody.slice(0, 5000)}`
}

export async function rewriteArticle(url: string, instructions = ''): Promise<RewriteResult> {
  const key = GEMINI_API_KEY()
  if (!key) throw new Error('GEMINI_API_KEY não configurada no servidor')

  const { title, body, imageUrl } = await extractArticle(url)
  if (!body) throw new Error('Não foi possível extrair o conteúdo do artigo')

  const prompt = buildPrompt(title, body, instructions)

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
      signal: AbortSignal.timeout(30_000),
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json() as any
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!raw) throw new Error('Resposta vazia da IA')

  const jsonMatch = raw.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Formato inválido na resposta da IA')

  const parsed = JSON.parse(jsonMatch[0])
  return {
    title: parsed.title || title,
    content: parsed.content || '',
    excerpt: parsed.excerpt || '',
    imageUrl,
    sourceUrl: url,
  }
}
