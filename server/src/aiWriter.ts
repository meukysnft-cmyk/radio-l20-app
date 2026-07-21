const DEEPSEEK_API_KEY = () => process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_MODELS = ['deepseek-chat']

type RewriteResult = {
  title: string
  content: string
  excerpt: string
  imageUrl: string
  sourceUrl: string
}

function stripTags(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractContainer(html: string): string {
  const patterns = [
    /<article[\s\S]*?<\/article>/i,
    /<main[\s\S]*?<\/main>/i,
    /<div[^>]*class="[^"]*\b(?:post-content|article-content|entry-content|content-single|noticia-conteudo|texto-noticia)\b[^"]*"[\s\S]*?<\/div>/i,
    /<div[^>]*itemprop="articleBody"[\s\S]*?<\/div>/i,
    /<section[^>]*class="[^"]*\b(?:content|article-body|post-body)\b[^"]*"[\s\S]*?<\/section>/i,
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m) return m[0]
  }
  return html
}

async function extractArticle(url: string): Promise<{ title: string; body: string; imageUrl: string }> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(15_000),
    redirect: 'follow',
  })
  const html = await res.text()

  const title =
    html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)?.[1]
    || html.match(/<meta\s+name="title"\s+content="([^"]*)"/i)?.[1]
    || html.match(/<title>([^<]*)<\/title>/)?.[1]
    || ''

  const imageUrl = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)?.[1] || ''

  const container = extractContainer(html)

  const pTags = container.match(/<p[^>]*>([\s\S]*?)<\/p>/gi)
  const bodyParts: string[] = []
  if (pTags) {
    for (const p of pTags) {
      const text = stripTags(p)
      if (text && text.length > 20) {
        bodyParts.push(text)
      }
    }
  }

  if (bodyParts.length === 0) {
    const divs = container.match(/<div[^>]*>([\s\S]*?)<\/div>/gi)
    if (divs) {
      for (const d of divs) {
        const text = stripTags(d)
        if (text && text.length > 80) {
          bodyParts.push(text)
        }
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

async function callDeepSeek(prompt: string, key: string, model: string): Promise<any> {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) {
    const err = await res.text()
    if (res.status === 429) throw new Error('QUOTA_EXCEEDED')
    throw new Error(`DeepSeek API error ${res.status}: ${err.slice(0, 200)}`)
  }

  return res.json()
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function extractJson(raw: string): any {
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Formato inválido na resposta da IA')
  return JSON.parse(match[0])
}

export async function rewriteArticle(url: string, instructions = ''): Promise<RewriteResult> {
  const key = DEEPSEEK_API_KEY()
  if (!key) throw new Error('DEEPSEEK_API_KEY não configurada no servidor')

  const { title, body, imageUrl } = await extractArticle(url)
  if (!body) throw new Error('Não foi possível extrair o conteúdo do artigo')

  const prompt = buildPrompt(title, body, instructions)

  let lastError = ''
  for (const model of DEEPSEEK_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) await sleep(2000)
      try {
        const data = await callDeepSeek(prompt, key, model)
        const raw = data?.choices?.[0]?.message?.content || ''
        if (!raw) throw new Error('Resposta vazia da IA')

        const parsed = extractJson(raw)
        return {
          title: parsed.title || title,
          content: parsed.content || '',
          excerpt: parsed.excerpt || '',
          imageUrl,
          sourceUrl: url,
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg === 'QUOTA_EXCEEDED') {
          lastError = `Cota excedida no modelo ${model}. ${model === DEEPSEEK_MODELS[DEEPSEEK_MODELS.length - 1] ? 'Cota gratuita esgotada no DeepSeek. Crie uma nova chave em platform.deepseek.com/api_keys.' : 'Tentando próximo modelo...'}`
          await sleep(1000)
          break
        }
        if (attempt === 1) lastError = msg
      }
    }
  }

  throw new Error(lastError || 'Erro ao reescrever artigo')
}
