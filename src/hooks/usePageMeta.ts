import { useEffect } from 'react'

export function setPageMeta(title: string, description?: string) {
  document.title = title

  if (description) {
    const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (descriptionTag) descriptionTag.setAttribute('content', description)

    const ogDescriptionTag = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    if (ogDescriptionTag) ogDescriptionTag.setAttribute('content', description)

    const twitterDescriptionTag = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
    if (twitterDescriptionTag) twitterDescriptionTag.setAttribute('content', description)
  }

  const ogTitleTag = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
  if (ogTitleTag) ogTitleTag.setAttribute('content', title)

  const twitterTitleTag = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
  if (twitterTitleTag) twitterTitleTag.setAttribute('content', title)
}

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    setPageMeta(title, description)
  }, [title, description])
}
