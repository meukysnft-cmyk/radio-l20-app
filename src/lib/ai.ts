import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { app } from './firebase'

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string
  }
}

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

if (recaptchaSiteKey) {
  if (import.meta.env.VITE_APPCHECK_DEBUG === 'true') {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
}

export const ai = getAI(app, { backend: new GoogleAIBackend() })

export const aiModel = getGenerativeModel(ai, {
  model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash',
})
