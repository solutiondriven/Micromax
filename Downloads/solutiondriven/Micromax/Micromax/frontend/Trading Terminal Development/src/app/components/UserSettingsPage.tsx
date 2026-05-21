import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Bell,
  BookOpen,
  Bot,
  Clock,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Flame,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  NotebookPen,
  Phone,
  PenLine,
  RadioTower,
  Save,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react';
import { AuthUser } from '../services/supabaseAuth';
import { TelegramNotificationManager } from './TelegramNotificationManager';
import { aiService } from '../services/aiService';

interface UserSettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  user: AuthUser | null;
  onSignOut: () => void | Promise<void>;
}

type SettingsTab = 'overview' | 'journal' | 'notifications' | 'strategies' | 'profile';

interface ParsedStrategy {
  name?: string;
  code?: string;
  summary?: string;
  rules?: string[];
  risk?: string;
}

export function UserSettingsPage({
  isOpen,
  onClose,
  isDark,
  user,
  onSignOut,
}: UserSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('overview');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [strategyName, setStrategyName] = useState('');
  const [isParsingStrategy, setIsParsingStrategy] = useState(false);
  const [parsedStrategy, setParsedStrategy] = useState<ParsedStrategy | null>(null);
  const [savedStrategies, setSavedStrategies] = useState<ParsedStrategy[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const rateLimitStatus = useMemo(() => aiService.getRateLimitStatus(), []);

  if (!isOpen || !user) return null;

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Fill in all password fields first.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Use at least 6 characters for the new password.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('Choose a password that is different from the current one.');
      return;
    }

    setPasswordError('Password changes are handled through the secure forgot-password flow.');
    setPasswordSuccess('');
  };

  const handleParseStrategy = async () => {
    if (!strategyDescription.trim()) {
      setParsedStrategy({
        name: strategyName || 'Untitled strategy',
        summary: 'Add entry, exit, and risk details before generating strategy logic.',
        code: '',
        rules: ['Entry condition missing', 'Exit condition missing', 'Risk rule missing'],
      });
      return;
    }

    setIsParsingStrategy(true);
    try {
      const strategy = await aiService.parseStrategyDescription(
        strategyDescription,
        strategyName || undefined
      );
      setParsedStrategy(strategy as ParsedStrategy);
    } catch (error) {
      console.error('Failed to parse strategy:', error);
      setParsedStrategy({
        name: strategyName || 'Strategy draft',
        summary: 'The AI parser could not complete the request. Keep the draft here and try again.',
        code: '',
        rules: ['Parser unavailable', 'No code generated yet'],
      });
    } finally {
      setIsParsingStrategy(false);
    }
  };

  const handleSaveStrategy = async () => {
    if (!parsedStrategy) return;

    try {
      const response = await fetch('/api/strategies/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...parsedStrategy,
        }),
      });

      if (!response.ok) throw new Error('Failed to save strategy');

      const saved = (await response.json()) as ParsedStrategy;
      setSavedStrategies([saved, ...savedStrategies]);
      setParsedStrategy(null);
      setStrategyDescription('');
      setStrategyName('');
    } catch (error) {
      console.error('Failed to save strategy:', error);
      setSavedStrategies([parsedStrategy, ...savedStrategies]);
      setParsedStrategy(null);
      setStrategyDescription('');
      setStrategyName('');
    }
  };

  const handleCopyCode = async () => {
    if (!parsedStrategy?.code) return;
    await navigator.clipboard.writeText(parsedStrategy.code);
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClearPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setIsChangingPassword(false);
  };

  const userInitials = (user.fullName?.trim() || user.email || 'MM')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  const tabs = [
    {
      id: 'overview' as const,
      title: 'Command Center',
      kicker: 'Live workspace',
      description: 'Account, alerts, strategy, and AI status in one dashboard.',
      icon: Activity,
      accent: 'from-cyan-400 to-emerald-400',
    },
    {
      id: 'journal' as const,
      title: 'Journal Hearth',
      kicker: 'Recent notes',
      description: 'A warmer place for reflections, tags, and market memory.',
      icon: BookOpen,
      accent: 'from-rose-200 to-amber-300',
    },
    {
      id: 'notifications' as const,
      title: 'Signal Relay',
      kicker: 'Telegram',
      description: 'Route market alerts through your verified notification lane.',
      icon: RadioTower,
      accent: 'from-sky-400 to-violet-400',
    },
    {
      id: 'strategies' as const,
      title: 'Strategy Lab',
      kicker: 'AI builder',
      description: 'Turn trading ideas into rules, code, and saved playbooks.',
      icon: Zap,
      accent: 'from-amber-300 to-rose-400',
    },
    {
      id: 'profile' as const,
      title: 'Identity Vault',
      kicker: 'Security',
      description: 'Profile details, access state, and security controls.',
      icon: Shield,
      accent: 'from-emerald-300 to-teal-500',
    },
  ];

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const ActiveIcon = activeTabMeta.icon;

  const shellClass = isDark
    ? 'border-white/10 bg-[#090b0f] text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)]'
    : 'border-black/10 bg-[#f7f8f4] text-[#101317] shadow-[0_30px_100px_rgba(18,25,32,0.22)]';
  const panelClass = isDark
    ? 'border-white/10 bg-white/[0.045]'
    : 'border-black/10 bg-white/80';
  const strongText = isDark ? 'text-white' : 'text-[#101317]';
  const mutedText = isDark ? 'text-white/58' : 'text-black/55';
  const subtleText = isDark ? 'text-white/38' : 'text-black/38';
  const inputClass = isDark
    ? 'border-white/10 bg-black/35 text-white placeholder:text-white/32 focus:border-cyan-300/50'
    : 'border-black/10 bg-white text-[#101317] placeholder:text-black/32 focus:border-cyan-600/40';
  const buttonGhost = isDark
    ? 'border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.09]'
    : 'border-black/10 bg-white text-[#101317] hover:bg-black/[0.04]';
  const dangerButton = isDark
    ? 'border-rose-400/25 bg-rose-500/12 text-rose-100 hover:bg-rose-500/18'
    : 'border-rose-500/25 bg-rose-50 text-rose-700 hover:bg-rose-100';

  const telemetry = [
    { label: 'AI Credits', value: String(rateLimitStatus.remaining?.messages ?? 50), detail: 'Messages left today', icon: Bot, tone: 'text-cyan-300' },
    { label: 'Signal Lane', value: user.telegramId ? 'Live' : 'Idle', detail: user.telegramId ? 'Telegram verified' : 'Telegram not linked', icon: Bell, tone: 'text-sky-300' },
    { label: 'Saved Logic', value: String(savedStrategies.length), detail: 'Strategy playbooks', icon: NotebookPen, tone: 'text-amber-300' },
  ];

  const recentNotes = [
    {
      title: 'Morning bias felt clean after London open',
      excerpt: 'Price respected the first pullback. Next time, wait for the second candle close before scaling.',
      tags: ['London', 'Discipline'],
      time: 'Today, 8:42 AM',
      accent: 'from-rose-200 to-amber-200',
    },
    {
      title: 'News window needed more breathing room',
      excerpt: 'Spread widened faster than expected. Keep the alert, but widen the no-trade buffer by five minutes.',
      tags: ['News', 'Risk'],
      time: 'Yesterday, 3:18 PM',
      accent: 'from-cyan-200 to-emerald-200',
    },
    {
      title: 'Good patience on the retest',
      excerpt: 'The setup was slower than usual, but the journal note kept the plan calm and simple.',
      tags: ['Patience', 'Replay'],
      time: 'Mon, 10:05 AM',
      accent: 'from-violet-200 to-sky-200',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md" onClick={onClose} />

      <style>{`
        @keyframes settings-tab-in {
          from { opacity: 0; transform: translateY(14px) scale(0.985); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes note-card-in {
          from { opacity: 0; transform: translateY(18px) rotate(var(--note-tilt, 0deg)); }
          to { opacity: 1; transform: translateY(0) rotate(var(--note-tilt, 0deg)); }
        }
      `}</style>

      <div className={`fixed inset-2 z-50 overflow-hidden rounded-lg border sm:inset-5 ${shellClass}`}>
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-amber-300 to-rose-400" />

        <div className="relative flex h-full flex-col">
          <header className={`flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5 ${isDark ? 'border-white/10 bg-black/35' : 'border-black/10 bg-white/70'} backdrop-blur-xl`}>
            <div className="flex min-w-0 items-center gap-3">
              {activeTab !== 'overview' ? (
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${buttonGhost}`}
                  aria-label="Back to command center"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : (
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#101317] text-white">
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-cyan-300/50" />
                  <ActiveIcon className="relative h-4 w-4" />
                </div>
              )}
              <div className="min-w-0">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleText}`}>Micromax settings</p>
                <h1 className="truncate text-xl font-semibold tracking-normal sm:text-2xl">{activeTabMeta.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs sm:flex ${panelClass}`}>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Session active
              </span>
              <button
                onClick={onClose}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${buttonGhost}`}
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[310px_1fr]">
            <aside className={`hidden border-r p-4 lg:block ${isDark ? 'border-white/10 bg-black/20' : 'border-black/10 bg-white/45'}`}>
              <div className={`rounded-lg border p-4 ${panelClass}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 via-emerald-300 to-amber-300 text-sm font-bold text-[#101317]">
                    {userInitials || 'MM'}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-semibold ${strongText}`}>{user.fullName || 'Micromax User'}</p>
                    <p className={`truncate text-xs ${mutedText}`}>{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className={`rounded-lg border p-3 ${isDark ? 'border-white/10 bg-black/25' : 'border-black/10 bg-white'}`}>
                    <p className={subtleText}>Plan</p>
                    <p className={`mt-1 font-semibold capitalize ${strongText}`}>{user.plan || 'free'}</p>
                  </div>
                  <div className={`rounded-lg border p-3 ${isDark ? 'border-white/10 bg-black/25' : 'border-black/10 bg-white'}`}>
                    <p className={subtleText}>Access</p>
                    <p className="mt-1 font-semibold text-emerald-400">Verified</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all duration-300 ease-out hover:shadow-[0_18px_45px_rgba(15,23,42,0.14)] active:translate-y-0 ${
                        isActive
                          ? isDark
                            ? 'border-cyan-300/35 bg-white/[0.09] shadow-[0_16px_50px_rgba(34,211,238,0.08)]'
                            : 'border-cyan-700/25 bg-white shadow-[0_16px_42px_rgba(14,116,144,0.12)]'
                          : `${panelClass} hover:-translate-y-1 hover:scale-[1.015]`
                      }`}
                    >
                      <span className={`mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${tab.accent} text-[#101317] shadow-sm transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-active:scale-95`}>
                        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${subtleText}`}>{tab.kicker}</span>
                        <span className={`mt-1 flex items-center justify-between gap-2 text-sm font-semibold ${strongText}`}>
                          {tab.title}
                          <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                        </span>
                        <span className={`mt-1 block text-xs leading-5 ${mutedText}`}>{tab.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className={`mt-4 rounded-lg border p-4 ${panelClass}`}>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-300" />
                  <p className={`text-sm font-semibold ${strongText}`}>Workspace pulse</p>
                </div>
                <div className="mt-4 space-y-2">
                  {[72, 46, 84].map((width, index) => (
                    <div key={width} className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${['from-cyan-300 to-emerald-300', 'from-amber-300 to-rose-300', 'from-sky-300 to-violet-300'][index]}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <main className="min-h-0 overflow-y-auto p-4 sm:p-5">
              <div key={activeTab} style={{ animation: 'settings-tab-in 340ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <section className={`overflow-hidden rounded-lg border ${panelClass}`}>
                    <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
                      <div className="p-6 sm:p-8">
                        <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${isDark ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100' : 'border-cyan-700/20 bg-cyan-50 text-cyan-800'}`}>
                          <Activity className="h-4 w-4" />
                          Live control surface
                        </div>
                        <h2 className={`mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl ${strongText}`}>
                          Settings that feel like a trading command deck.
                        </h2>
                        <p className={`mt-5 max-w-2xl text-sm leading-7 ${mutedText}`}>
                          Move from identity to alerts to strategy with an interface that surfaces status, confidence, and next actions without feeling like a form drawer.
                        </p>
                      </div>
                      <div className={`border-t p-5 lg:border-l lg:border-t-0 ${isDark ? 'border-white/10 bg-black/20' : 'border-black/10 bg-white/55'}`}>
                        <div className="grid h-full gap-3">
                          {telemetry.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div key={item.label} className={`rounded-lg border p-4 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-black/10 bg-white'}`}>
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${subtleText}`}>{item.label}</p>
                                    <p className={`mt-2 text-2xl font-semibold ${strongText}`}>{item.value}</p>
                                    <p className={`text-xs ${mutedText}`}>{item.detail}</p>
                                  </div>
                                  <Icon className={`h-5 w-5 ${item.tone}`} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="grid gap-4 xl:grid-cols-3">
                    {tabs.filter((tab) => ['journal', 'strategies', 'notifications'].includes(tab.id)).map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`rounded-lg border p-5 text-left transition-all hover:-translate-y-1 ${panelClass}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${tab.accent} text-[#101317]`}>
                              <Icon className="h-5 w-5" />
                            </span>
                            <ChevronRight className={`h-4 w-4 ${mutedText}`} />
                          </div>
                          <p className={`mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] ${subtleText}`}>{tab.kicker}</p>
                          <h3 className={`mt-2 text-xl font-semibold ${strongText}`}>{tab.title}</h3>
                          <p className={`mt-3 text-sm leading-6 ${mutedText}`}>{tab.description}</p>
                        </button>
                      );
                    })}
                  </section>
                </div>
              )}

              {activeTab === 'journal' && (
                <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                  <section className={`overflow-hidden rounded-lg border ${panelClass}`}>
                    <div className="p-5 sm:p-7">
                      <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${isDark ? 'border-rose-200/20 bg-rose-200/10 text-rose-100' : 'border-rose-700/15 bg-rose-50 text-rose-800'}`}>
                        <PenLine className="h-4 w-4" />
                        Quiet trading memory
                      </div>
                      <h2 className={`mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl ${strongText}`}>
                        A softer place to notice what the chart taught you.
                      </h2>
                      <p className={`mt-4 max-w-2xl text-sm leading-7 ${mutedText}`}>
                        Recent notes are arranged like a desk stack: warm, scannable, and personal enough to make review feel less clinical.
                      </p>
                    </div>

                    <div className="grid gap-4 px-5 pb-5 sm:px-7 sm:pb-7">
                      {recentNotes.map((note, index) => (
                        <article
                          key={note.title}
                          className={`relative rounded-lg border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.16)] ${isDark ? 'border-white/10 bg-[#161316]' : 'border-black/10 bg-[#fffaf2]'}`}
                          style={{
                            animation: `note-card-in 420ms ${index * 90}ms cubic-bezier(0.2, 0.8, 0.2, 1) both`,
                            transform: `rotate(${[-0.6, 0.4, -0.2][index]}deg)`,
                            ['--note-tilt' as string]: `${[-0.6, 0.4, -0.2][index]}deg`,
                          }}
                        >
                          <div className={`absolute left-0 top-4 h-12 w-1 rounded-r-full bg-gradient-to-b ${note.accent}`} />
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className={`flex items-center gap-2 text-xs ${subtleText}`}>
                                <Clock className="h-3.5 w-3.5" />
                                {note.time}
                              </p>
                              <h3 className={`mt-3 text-xl font-semibold leading-snug ${strongText}`}>{note.title}</h3>
                            </div>
                            <BookOpen className={`h-5 w-5 ${mutedText}`} />
                          </div>
                          <p className={`mt-3 text-sm leading-7 ${mutedText}`}>{note.excerpt}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {note.tags.map((tag) => (
                              <span key={tag} className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs ${isDark ? 'border-white/10 bg-white/[0.05] text-white/62' : 'border-black/10 bg-white text-black/58'}`}>
                                <Tag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <aside className="space-y-4">
                    <section className={`rounded-lg border p-5 ${panelClass}`}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <h3 className={`text-sm font-semibold ${strongText}`}>Evening review</h3>
                      </div>
                      <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
                        Tag one win, one hesitation, and one adjustment. Small honest notes make the workspace feel like it belongs to you.
                      </p>
                    </section>

                    <section className={`rounded-lg border p-5 ${isDark ? 'border-amber-200/15 bg-amber-200/[0.06]' : 'border-amber-700/15 bg-amber-50'}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${subtleText}`}>Desk mood</p>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {['Calm', 'Clear', 'Ready'].map((item) => (
                          <div key={item} className={`rounded-lg border px-3 py-4 text-center text-sm font-semibold ${isDark ? 'border-white/10 bg-black/20 text-white/75' : 'border-black/10 bg-white text-black/65'}`}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </section>
                  </aside>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className={`rounded-lg border p-4 sm:p-5 ${panelClass}`}>
                  <TelegramNotificationManager user={user} isDark={isDark} onUpdate={() => console.log('Telegram setup updated')} />
                </div>
              )}

              {activeTab === 'strategies' && (
                <div className="grid gap-4 xl:grid-cols-[1fr_390px]">
                  <section className={`rounded-lg border p-5 ${panelClass}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${subtleText}`}>AI strategy lab</p>
                        <h2 className={`mt-2 text-2xl font-semibold ${strongText}`}>Build a playable trading rule set.</h2>
                      </div>
                      <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${isDark ? 'border-amber-300/20 bg-amber-300/10 text-amber-100' : 'border-amber-600/20 bg-amber-50 text-amber-800'}`}>
                        <Sparkles className="h-4 w-4" />
                        AI assisted
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4">
                      <input
                        type="text"
                        value={strategyName}
                        onChange={(event) => setStrategyName(event.target.value)}
                        placeholder="Strategy name, for example London breakout"
                        className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors ${inputClass}`}
                      />
                      <textarea
                        value={strategyDescription}
                        onChange={(event) => setStrategyDescription(event.target.value)}
                        placeholder="Entry, confirmation, invalidation, risk, time window, symbols..."
                        rows={8}
                        className={`w-full resize-none rounded-lg border px-4 py-3 text-sm leading-7 outline-none transition-colors ${inputClass}`}
                      />
                      <button
                        onClick={handleParseStrategy}
                        disabled={isParsingStrategy}
                        className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                          isParsingStrategy
                            ? 'cursor-wait bg-white/10 text-white/45'
                            : 'bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 text-[#101317] hover:brightness-105'
                        }`}
                      >
                        <Sparkles className="h-4 w-4" />
                        {isParsingStrategy ? 'Analyzing strategy...' : 'Generate strategy logic'}
                      </button>
                    </div>
                  </section>

                  <aside className="space-y-4">
                    <section className={`rounded-lg border p-5 ${panelClass}`}>
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-cyan-300" />
                        <h3 className={`text-sm font-semibold ${strongText}`}>Generated logic</h3>
                      </div>

                      {parsedStrategy ? (
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className={`text-xl font-semibold ${strongText}`}>{parsedStrategy.name || strategyName || 'Strategy draft'}</p>
                            <p className={`mt-2 text-sm leading-6 ${mutedText}`}>{parsedStrategy.summary || parsedStrategy.risk || 'Review the generated code and save it when it matches your trading rules.'}</p>
                          </div>
                          {Boolean(parsedStrategy.rules?.length) && (
                            <div className="space-y-2">
                              {parsedStrategy.rules?.slice(0, 4).map((rule) => (
                                <div key={rule} className={`rounded-lg border px-3 py-2 text-xs ${isDark ? 'border-white/10 bg-black/25 text-white/70' : 'border-black/10 bg-white text-black/65'}`}>
                                  {rule}
                                </div>
                              ))}
                            </div>
                          )}
                          <pre className={`max-h-64 overflow-auto rounded-lg border p-3 text-xs leading-6 ${isDark ? 'border-white/10 bg-black/45 text-emerald-200' : 'border-black/10 bg-[#101317] text-emerald-200'}`}>
                            {parsedStrategy.code || '// No code generated yet.'}
                          </pre>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleSaveStrategy} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-[#101317] hover:bg-emerald-400">
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                            <button onClick={handleCopyCode} disabled={!parsedStrategy.code} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${buttonGhost} disabled:cursor-not-allowed disabled:opacity-45`}>
                              {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              {copiedCode ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`mt-4 rounded-lg border border-dashed p-5 text-sm leading-6 ${isDark ? 'border-white/15 text-white/50' : 'border-black/15 text-black/50'}`}>
                          Generated rules, code, and risk notes will appear here.
                        </div>
                      )}
                    </section>

                    <section className={`rounded-lg border p-5 ${panelClass}`}>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`text-sm font-semibold ${strongText}`}>Saved playbooks</h3>
                        <span className={`rounded-lg border px-2 py-1 text-xs ${buttonGhost}`}>{savedStrategies.length}</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        {savedStrategies.length === 0 ? (
                          <p className={`text-sm leading-6 ${mutedText}`}>No saved strategy logic in this session.</p>
                        ) : (
                          savedStrategies.map((strategy, index) => (
                            <div key={`${strategy.name || 'strategy'}-${index}`} className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${isDark ? 'border-white/10 bg-black/25' : 'border-black/10 bg-white'}`}>
                              <span className={`truncate text-sm font-medium ${strongText}`}>{strategy.name || 'Saved strategy'}</span>
                              <button
                                onClick={() => setSavedStrategies(savedStrategies.filter((_, itemIndex) => itemIndex !== index))}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${buttonGhost}`}
                                aria-label="Remove saved strategy"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </aside>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
                  <section className={`rounded-lg border p-5 ${panelClass}`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300 via-cyan-300 to-amber-300 text-xl font-bold text-[#101317]">
                          {userInitials || 'MM'}
                        </div>
                        <div>
                          <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${subtleText}`}>Identity vault</p>
                          <h2 className={`mt-1 text-2xl font-semibold ${strongText}`}>{user.fullName || 'Micromax User'}</h2>
                          <p className={`text-sm ${mutedText}`}>{user.email || 'No email connected'}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${isDark ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' : 'border-emerald-700/20 bg-emerald-50 text-emerald-800'}`}>
                        <Shield className="h-4 w-4" />
                        Access verified
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                      {[
                        { label: 'Full name', value: user.fullName || 'Not set', icon: User },
                        { label: 'Email address', value: user.email || 'Not set', icon: Mail },
                        { label: 'Phone number', value: user.phone || 'Not set', icon: Phone },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className={`rounded-lg border p-4 ${isDark ? 'border-white/10 bg-black/25' : 'border-black/10 bg-white'}`}>
                            <Icon className={`h-4 w-4 ${mutedText}`} />
                            <p className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] ${subtleText}`}>{item.label}</p>
                            <p className={`mt-2 truncate text-sm font-semibold ${strongText}`}>{item.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <aside className={`rounded-lg border p-5 ${panelClass}`}>
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-amber-300" />
                      <h3 className={`text-sm font-semibold ${strongText}`}>Security controls</h3>
                    </div>
                    <p className={`mt-3 text-sm leading-6 ${mutedText}`}>Review password access and sign out of this workspace when you are done.</p>

                    {!isChangingPassword ? (
                      <button onClick={() => setIsChangingPassword(true)} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${buttonGhost}`}>
                        <Lock className="h-4 w-4" />
                        Review password flow
                      </button>
                    ) : (
                      <div className="mt-5 space-y-3">
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(event) => setCurrentPassword(event.target.value)}
                          placeholder="Current password"
                          className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${inputClass}`}
                        />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                          placeholder="New password"
                          className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${inputClass}`}
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder="Confirm new password"
                          className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${inputClass}`}
                        />
                        {passwordError && <p className="rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">{passwordError}</p>}
                        {passwordSuccess && <p className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{passwordSuccess}</p>}
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={handleChangePassword} className="rounded-lg bg-amber-300 px-3 py-2 text-sm font-semibold text-[#101317] hover:bg-amber-200">
                            Check
                          </button>
                          <button onClick={handleClearPasswordForm} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${buttonGhost}`}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <button onClick={onSignOut} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${dangerButton}`}>
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </aside>
                </div>
              )}
              </div>
            </main>
          </div>

          <div className={`flex items-center justify-between gap-3 border-t px-4 py-3 text-xs sm:px-5 ${isDark ? 'border-white/10 bg-black/30 text-white/45' : 'border-black/10 bg-white/60 text-black/45'}`}>
            <div className="flex min-w-0 items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 shrink-0" />
              <span className="truncate">Settings state is scoped to this signed-in workspace.</span>
            </div>
            <button onClick={onClose} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${buttonGhost}`}>
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
