import { lazy, Suspense, useCallback, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import './styles/cms.css'
import { AppLayout } from './components/AppLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute'
import { SplashScreen } from './components/SplashScreen'
import { AdminShell } from './components/admin/AdminShell'
import { radioRoutes } from './config/radioLinks'
import { AuthProvider } from './context/AuthContext'
import { AudioPlayerProvider } from './context/AudioPlayerContext'
import { SponsorsProvider } from './context/SponsorsContext'
import { LiveStatusProvider } from './context/LiveStatusContext'
import { ThemeProvider } from './context/ThemeProvider'
import { RequireAuth } from './routes/RequireAuth'
import { RequireCommunityAccess } from './routes/RequireCommunityAccess'

/* Public pages */
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const LivePage = lazy(() => import('./pages/LivePage').then((m) => ({ default: m.LivePage })))
const NewsPage = lazy(() => import('./pages/NewsPage').then((m) => ({ default: m.NewsPage })))
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })))
const SportsPage = lazy(() => import('./pages/SportsPage').then((m) => ({ default: m.SportsPage })))
const SchedulePage = lazy(() => import('./pages/SchedulePage').then((m) => ({ default: m.SchedulePage })))
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then((m) => ({ default: m.ProgramsPage })))
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage').then((m) => ({ default: m.ProgramDetailPage })))
const AdvertisePage = lazy(() => import('./pages/AdvertisePage').then((m) => ({ default: m.AdvertisePage })))
const SponsorsPage = lazy(() => import('./pages/SponsorsPage').then((m) => ({ default: m.SponsorsPage })))
const VideosPage = lazy(() => import('./pages/VideosPage').then((m) => ({ default: m.VideosPage })))
const HoroscopePage = lazy(() => import('./pages/HoroscopePage').then((m) => ({ default: m.HoroscopePage })))
const WordOfLifePage = lazy(() => import('./pages/WordOfLifePage').then((m) => ({ default: m.WordOfLifePage })))
const JobsPage = lazy(() => import('./pages/JobsPage').then((m) => ({ default: m.JobsPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const AppLoginPage = lazy(() => import('./pages/AppLoginPage').then((m) => ({ default: m.AppLoginPage })))
const SignDetailPage = lazy(() => import('./pages/SignDetailPage').then((m) => ({ default: m.SignDetailPage })))
const SportDetailPage = lazy(() => import('./pages/SportDetailPage').then((m) => ({ default: m.SportDetailPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const WordOfLifeRankingPage = lazy(() => import('./pages/WordOfLifeRankingPage').then((m) => ({ default: m.WordOfLifeRankingPage })))
const ChatPage = lazy(() => import('./pages/ChatPage').then((m) => ({ default: m.ChatPage })))

/* CMS admin pages */
const AdminDashboard = lazy(() => import('./pages/admin/cms/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminNewsPage = lazy(() => import('./pages/admin/AdminNewsPage').then((m) => ({ default: m.AdminNewsPage })))
const AdminSportsPage = lazy(() => import('./pages/admin/cms/AdminSportsPage').then((m) => ({ default: m.AdminSportsPage })))
const AdminAgendaPage = lazy(() => import('./pages/admin/AdminAgendaPage').then((m) => ({ default: m.AdminAgendaPage })))
const AdminProgramsPage = lazy(() => import('./pages/admin/AdminProgramsPage').then((m) => ({ default: m.AdminProgramsPage })))
const AdminLiveStreamsPage = lazy(() => import('./pages/admin/AdminLiveStreamsPage').then((m) => ({ default: m.AdminLiveStreamsPage })))
const AdminVideosPage = lazy(() => import('./pages/admin/AdminVideosPage').then((m) => ({ default: m.AdminVideosPage })))
const AdminSponsorsPage = lazy(() => import('./pages/admin/AdminSponsorsPage').then((m) => ({ default: m.AdminSponsorsPage })))
const AdminGalleryPage = lazy(() => import('./pages/admin/cms/AdminGalleryPage').then((m) => ({ default: m.AdminGalleryPage })))
const AdminLinksPage = lazy(() => import('./pages/admin/AdminLinksPage').then((m) => ({ default: m.AdminLinksPage })))
const AdminSocialMediaPage = lazy(() => import('./pages/admin/cms/AdminSocialMediaPage').then((m) => ({ default: m.AdminSocialMediaPage })))
const AdminAppearancePage = lazy(() => import('./pages/admin/cms/AdminAppearancePage').then((m) => ({ default: m.AdminAppearancePage })))
const AdminUsersPage = lazy(() => import('./pages/admin/cms/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })))
const AdminLogsPage = lazy(() => import('./pages/admin/cms/AdminLogsPage').then((m) => ({ default: m.AdminLogsPage })))
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage').then((m) => ({ default: m.AdminNotificationsPage })))
const AdminLivePage = lazy(() => import('./pages/admin/AdminLivePage').then((m) => ({ default: m.AdminLivePage })))
const AdminJobsPage = lazy(() => import('./pages/admin/AdminJobsPage').then((m) => ({ default: m.AdminJobsPage })))
const AdminHoroscopePage = lazy(() => import('./pages/admin/AdminHoroscopePage').then((m) => ({ default: m.AdminHoroscopePage })))
const AdminWordOfLifePage = lazy(() => import('./pages/admin/AdminWordOfLifePage').then((m) => ({ default: m.AdminWordOfLifePage })))
const AdminChatPage = lazy(() => import('./pages/admin/AdminChatPage').then((m) => ({ default: m.AdminChatPage })))
const AdminAiWriterPage = lazy(() => import('./pages/admin/cms/AdminAiWriterPage').then((m) => ({ default: m.AdminAiWriterPage })))


function App() {
  const [showSplash, setShowSplash] = useState(true)
  const onSplashComplete = useCallback(() => setShowSplash(false), [])

  return (
    <ThemeProvider>
    <AudioPlayerProvider>
      <SponsorsProvider>
        <LiveStatusProvider>
        <AuthProvider>
          <BrowserRouter>
          {showSplash ? <SplashScreen onComplete={onSplashComplete} /> : null}

          <ErrorBoundary>
            <Suspense
              fallback={<div className="route-loading-shell" aria-live="polite">Carregando página...</div>}
            >
              <Routes>
                {/* ── Public routes ── */}
                <Route element={<AppLayout />}>
                  <Route element={<RequireCommunityAccess />}>
                    <Route index element={<HomePage />} />
                    <Route path={radioRoutes.live} element={<LivePage />} />
                    <Route path={radioRoutes.news} element={<NewsPage />} />
                    <Route path="/noticias/:id" element={<NewsDetailPage />} />
                    <Route path={radioRoutes.sport} element={<SportsPage />} />
                    <Route path={`${radioRoutes.sport}/:slug`} element={<SportDetailPage />} />
                    <Route path={radioRoutes.schedule} element={<SchedulePage />} />
                    <Route path={radioRoutes.programs} element={<ProgramsPage />} />
                    <Route path="/programas/:slug" element={<ProgramDetailPage />} />
                    <Route path={radioRoutes.advertise} element={<AdvertisePage />} />
                    <Route path={radioRoutes.sponsors} element={<SponsorsPage />} />
                    <Route path={radioRoutes.videos} element={<VideosPage />} />
                    <Route path={radioRoutes.horoscope} element={<HoroscopePage />} />
                    <Route path={`${radioRoutes.horoscope}/:slug`} element={<SignDetailPage />} />
                    <Route path={radioRoutes.wordOfLife} element={<WordOfLifePage />} />
                    <Route path="/palavra-de-vida/ranking" element={<WordOfLifeRankingPage />} />
                    <Route path={radioRoutes.jobs} element={<JobsPage />} />
                    <Route path={radioRoutes.contact} element={<ContactPage />} />
                    <Route path={radioRoutes.chat} element={<ChatPage />} />
                  </Route>
                  <Route path={radioRoutes.register} element={<RegisterPage />} />
                  <Route path={radioRoutes.profile} element={<ProfilePage />} />
                  <Route path={radioRoutes.adminLogin} element={<AppLoginPage />} />

                  {/* ── CMS Admin routes (sidebar shell) ── */}
                  <Route element={<RequireAuth />}>
                    <Route element={<ProtectedAdminRoute />}>
                      <Route element={<AdminShell />}>
                        <Route path={radioRoutes.admin} element={<AdminDashboard />} />
                        <Route path={radioRoutes.adminNews} element={<AdminNewsPage />} />
                        <Route path="/admin/esportes" element={<AdminSportsPage />} />
                        <Route path={radioRoutes.adminSchedule} element={<AdminAgendaPage />} />
                        <Route path={radioRoutes.adminPrograms} element={<AdminProgramsPage />} />
                        <Route path={radioRoutes.adminLiveStreams} element={<AdminLiveStreamsPage />} />
                        <Route path={radioRoutes.adminVideos} element={<AdminVideosPage />} />
                        <Route path={radioRoutes.adminSponsors} element={<AdminSponsorsPage />} />
                        <Route path="/admin/galeria" element={<AdminGalleryPage />} />
                        <Route path={radioRoutes.adminLinks} element={<AdminLinksPage />} />
                        <Route path="/admin/redes-sociais" element={<AdminSocialMediaPage />} />
                        <Route path="/admin/aparencia" element={<AdminAppearancePage />} />
                        <Route path="/admin/configuracoes" element={<AdminLivePage />} />
                        <Route path="/admin/usuarios" element={<AdminUsersPage />} />
                        <Route path="/admin/logs" element={<AdminLogsPage />} />
                        <Route path={radioRoutes.adminNotifications} element={<AdminNotificationsPage />} />
                        <Route path={radioRoutes.adminJobs} element={<AdminJobsPage />} />
                        <Route path="/admin/horoscopo" element={<AdminHoroscopePage />} />
                        <Route path={radioRoutes.adminWordOfLife} element={<AdminWordOfLifePage />} />
                        <Route path="/admin/chat" element={<AdminChatPage />} />
                        <Route path="/admin/reescrever" element={<AdminAiWriterPage />} />

                      </Route>
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
      </LiveStatusProvider>
      </SponsorsProvider>
    </AudioPlayerProvider>
    </ThemeProvider>
  )
}

export default App
