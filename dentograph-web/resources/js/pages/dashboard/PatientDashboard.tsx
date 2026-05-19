import { logout } from '@/routes';
import { Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BookOpen,
    CalendarDays,
    Clock3,
    Mail,
    MapPin,
    MessageCircleMore,
    MessageSquareWarningIcon,
    PhoneCall,
    ScanLine,
    ShieldCheck,
    Sparkles,
    Stethoscope,
} from 'lucide-react';

export default function PatientDashboard({ user }: any) {
    return (
        <>
            <div
                id="top"
                className="scroll-mt-32 min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#edf8ff_18%,#e8f6ff_42%,#edf8ff_68%,#f7fbff_100%)] px-6 pt-[120px] lg:px-8 lg:pt-[120px]"
            >
                {/* HEADER */}
                <header className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between border-b border-white/30 bg-white/10 px-8 py-5 shadow-[0_8px_30px_rgba(19,184,255,0.08)] backdrop-blur-xl lg:px-14">
                    {/* LEFT */}
                    <a
                        href="#top"
                        className="flex items-center gap-1 transition hover:scale-[1.02]"
                    >
                        <img
                            src="/asset/images/logo.png"
                            alt="Dentalyze AI"
                            className="h-11 w-11 object-contain"
                        />

                        <div className="text-2xl font-black tracking-tight text-[#1aa0ff] lg:text-[34px]">
                            DENTA
                            <span className="text-[#187df0]">
                                LYZE
                            </span>
                        </div>
                    </a>

                    {/* NAV */}
                    <nav className="hidden lg:flex items-center gap-16 text-[11px] font-black uppercase tracking-[0.28em] text-[#98a3b5]">
                        <a
                            href="#dashboard"
                            className="transition hover:text-[#13b8ff]"
                        >
                            Dashboard
                        </a>

                        <a
                            href="#riwayat"
                            className="transition hover:text-[#13b8ff]"
                        >
                            Riwayat
                        </a>

                        <a
                            href="#contact"
                            className="transition hover:text-[#13b8ff]"
                        >
                            Contact Us
                        </a>
                    </nav>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">
                        {/* LOGOUT */}
                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="rounded-[12px] bg-[linear-gradient(135deg,#ff6b6b_0%,#e53935_100%)] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-[0_12px_28px_rgba(229,57,53,0.22)] transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Logout
                        </Link>
                    </div>
                </header>

                {/* HERO */}
                <section
                    id="dashboard"
                    className="scroll-mt-32 relative overflow-hidden rounded-[34px] border border-white/60 bg-white/80 p-8 shadow-[0_25px_60px_rgba(19,184,255,0.08)] backdrop-blur-xl lg:p-12"
                >
                    {/* GLOW */}
                    <div className="absolute top-[-120px] right-[-100px] h-[320px] w-[320px] rounded-full bg-[#13b8ff]/10 blur-3xl" />

                    <div className="absolute bottom-[-120px] left-[-100px] h-[280px] w-[280px] rounded-full bg-[#49ddd7]/10 blur-3xl" />

                    <div className="relative z-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
                        {/* LEFT */}
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#bdefff] bg-[#f4fdff] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#13b8ff]">
                                <Sparkles size={14} />
                                Smart Dental Monitoring
                            </div>

                            <h1 className="max-w-2xl text-[48px] font-black leading-[1.05] tracking-[-0.04em] text-[#1c356b]">
                                Halo,
                                <span className="bg-gradient-to-r from-[#13b8ff] to-[#0878e8] bg-clip-text text-transparent">
                                    {' '}
                                    {user.name}
                                </span>{' '}
                            </h1>

                            <p className="mt-6 max-w-2xl text-[16px] leading-8 text-[#71809a]">
                                Pantau hasil analisis radiografi gigi,
                                perkembangan kesehatan mulut, dan riwayat
                                pemeriksaan Anda secara real-time melalui sistem AI
                                Dentalyze.
                            </p>

                            {/* INFO BOX */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                {/* NIK */}
                                <div className="rounded-2xl border border-[#d7ecff] bg-[#f8fcff] px-5 py-4 shadow-[0_10px_30px_rgba(19,184,255,0.06)]">
                                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#98a6bc]">
                                        Nomor NIK
                                    </p>

                                    <h4 className="mt-2 text-[18px] font-bold text-[#233b72]">
                                        {user.patient?.nik || '-'}
                                    </h4>
                                </div>

                                {/* STATUS */}
                                <div className="rounded-2xl border border-[#d7ecff] bg-[#f8fcff] px-5 py-4 shadow-[0_10px_30px_rgba(19,184,255,0.06)]">
                                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#98a6bc]">
                                        Status Akun
                                    </p>

                                    <h4 className="mt-2 text-[18px] font-bold text-[#15b98c]">
                                        Active Patient
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="relative flex items-center justify-center py-8">
                            {/* Glow */}
                            <div className="absolute h-[320px] w-[320px] rounded-full bg-[#13b8ff]/10 blur-3xl" />

                            <div className="absolute h-[220px] w-[220px] rounded-full bg-[#49ddd7]/10 blur-2xl" />

                            {/* Floating Card 1 */}
                            <div className="absolute left-[-50px] top-10 z-20 rounded-[22px] border border-white/60 bg-white/70 px-5 py-4 shadow-[0_20px_50px_rgba(19,184,255,0.12)] backdrop-blur-xl animate-[float_5s_ease-in-out_infinite]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] text-white shadow-lg">
                                        <ShieldCheck size={22} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#98a6bc]">
                                            Dental Status
                                        </p>

                                        <h4 className="mt-1 text-[18px] font-black text-[#1f3567]">
                                            Healthy
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute -right-2 bottom-4 z-20 rounded-[22px] border border-white/60 bg-white/70 px-5 py-4 shadow-[0_20px_50px_rgba(73,221,215,0.14)] backdrop-blur-xl animate-[float_6s_ease-in-out_infinite]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#49ddd7_0%,#21bfc6_100%)] text-white shadow-lg">
                                        <Activity size={22} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#98a6bc]">
                                            Clean Score
                                        </p>

                                        <h4 className="mt-1 text-[18px] font-black text-[#1f3567]">
                                            85%
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 3 */}
                            <div className="absolute right-10 top-0 z-20 rounded-full border border-white/60 bg-white/70 px-5 py-3 shadow-[0_18px_40px_rgba(19,184,255,0.12)] backdrop-blur-xl animate-[float_4s_ease-in-out_infinite]">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#49ddd7] opacity-75"></span>
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#49ddd7]"></span>
                                    </span>

                                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0878e8]">
                                        AI Active
                                    </p>
                                </div>
                            </div>

                            {/* Tooth */}
                            <img
                                src="/asset/images/gigishiny.png"
                                alt="Dental"
                                className="relative z-10 w-[340px] xl:w-[440px] drop-shadow-[0_40px_90px_rgba(19,184,255,0.22)]"
                            />
                        </div>
                    </div>
                </section>

                {/* STATUS SECTION */}
                <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {/* DETECTION */}
                    <article className="relative overflow-hidden rounded-[30px] border border-[#d7ecff] bg-gradient-to-br from-[#13b8ff] to-[#0878e8] p-8 text-white shadow-[0_25px_60px_rgba(19,184,255,0.22)]">
                        <div className="absolute right-[-40px] top-[-40px] h-44 w-44 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                                    <ScanLine size={28} />
                                </div>

                                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]">
                                    Latest Detection
                                </span>
                            </div>

                            <h3 className="mt-8 text-[32px] font-black">
                                Status Pemeriksaan
                            </h3>

                            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/80">
                                Anda memiliki hasil deteksi terbaru yang telah
                                selesai dianalisis oleh sistem AI Dentalyze.
                            </p>

                            <button className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[13px] font-black uppercase tracking-[0.16em] text-[#0878e8] transition hover:scale-[1.03]">
                                Lihat Hasil
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </article>

                    {/* CONSULTATION */}
                    <article className="relative overflow-hidden rounded-[30px] border border-[#ccfff2] bg-gradient-to-br from-[#49ddd7] to-[#28c5b8] p-8 text-white shadow-[0_25px_60px_rgba(73,221,215,0.22)]">
                        <div className="absolute bottom-[-40px] right-[-20px] h-44 w-44 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                                    <Stethoscope size={28} />
                                </div>

                                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]">
                                    Consultation
                                </span>
                            </div>

                            <h3 className="mt-8 text-[32px] font-black">
                                Konsultasi Terakhir
                            </h3>

                            <div className="mt-4 flex items-center gap-3 text-white/85">
                                <CalendarDays size={18} />

                                <span className="text-[15px]">
                                    15 Mei 2026
                                </span>
                            </div>

                            <p className="mt-4 text-[15px] leading-7 text-white/80">
                                Pemeriksaan dilakukan bersama
                                <span className="font-bold text-white">
                                    {' '}
                                    drg. Siti Aminah
                                </span>
                                .
                            </p>
                        </div>
                    </article>
                </section>

                {/* HISTORY */}
                <section
                    id="riwayat"
                    className="scroll-mt-32 mt-6 overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(19,184,255,0.06)] backdrop-blur-xl"
                >
                    {/* HEADER */}
                    <div className="flex flex-col gap-4 border-b border-[#edf4ff] px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-[24px] font-black text-[#233b72]">
                                Riwayat Deteksi
                            </h3>

                            <p className="mt-1 text-[14px] text-[#8b97ad]">
                                Riwayat hasil analisis radiografi terbaru Anda.
                            </p>
                        </div>

                        <button className="rounded-2xl border border-[#d8ecff] bg-[#f7fbff] px-5 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-[#0878e8] transition hover:-translate-y-0.5">
                            Lihat Semua
                        </button>
                    </div>

                    {/* EMPTY STATE */}
                    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#13b8ff] to-[#0878e8] shadow-[0_20px_50px_rgba(19,184,255,0.22)]">
                            <MessageSquareWarningIcon
                                size={42}
                                className="text-white"
                            />
                        </div>

                        <h4 className="mt-7 text-[24px] font-black text-[#233b72]">
                            Belum Ada Riwayat
                        </h4>

                        <p className="mt-3 max-w-md text-[15px] leading-7 text-[#8593aa]">
                            Saat ini belum ada data deteksi radiografi yang tersedia
                            untuk akun pasien Anda.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    id="contact"
                    className="scroll-mt-32 relative z-30 mt-10 overflow-hidden rounded-t-[46px] border-t border-white/40 bg-[linear-gradient(135deg,#eaf8ff_0%,#eefaff_32%,#dff6ff_62%,#f8fcff_100%)] px-8 pt-16 pb-8 text-[#1b1b18] shadow-[0_-24px_70px_rgba(19,184,255,0.08)] lg:px-16"
                >
                    {/* Footer Background */}
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute -top-24 left-[-120px] h-[420px] w-[420px] rounded-full bg-[#13b8ff]/14 blur-[120px]" />
                        <div className="absolute top-[10%] right-[-100px] h-[380px] w-[380px] rounded-full bg-[#49ddd7]/16 blur-[120px]" />
                        <div className="absolute bottom-[-160px] left-[40%] h-[420px] w-[420px] rounded-full bg-[#86d8ff]/14 blur-[130px]" />
                        <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_1px_1px,rgba(8,120,232,0.18)_1px,transparent_0)] [background-size:34px_34px]" />
                    </div>

                    <div className="relative z-10">
                        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
                            {/* Brand */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-1">
                                    <img
                                        src="/asset/images/logo.png"
                                        alt="Dentalyze AI"
                                        className="h-11 w-11 object-contain"
                                    />

                                    <div className="text-3xl font-black tracking-tight text-[#1aa0ff]">
                                        DENTA
                                        <span className="text-[#187df0]">
                                            LYZE
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-5 max-w-[320px] text-[15px] leading-[1.8] text-[#808999]">
                                    Platform AI dental intelligence untuk membantu analisis radiografi gigi dewasa,
                                    enumerasi gigi, serta deteksi kelainan secara lebih cepat dan rapi.
                                </p>

                                <div className="mt-8 flex items-center gap-4">
                                    <a
                                        href="#"
                                        className="group flex h-11 w-11 items-center justify-center rounded-[15px] border border-white/70 bg-white/45 text-[#0878e8] shadow-[0_12px_25px_rgba(19,184,255,0.08)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#0878e8] hover:text-white"
                                    >
                                        <BookOpen
                                            size={18}
                                            strokeWidth={2.1}
                                        />
                                    </a>

                                    <a
                                        href="#"
                                        className="group flex h-11 w-11 items-center justify-center rounded-[15px] border border-white/70 bg-white/45 text-[#0878e8] shadow-[0_12px_25px_rgba(19,184,255,0.08)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#0878e8] hover:text-white"
                                    >
                                        <MessageCircleMore
                                            size={18}
                                            strokeWidth={2.1}
                                        />
                                    </a>

                                    <a
                                        href="#"
                                        className="group flex h-11 w-11 items-center justify-center rounded-[15px] border border-white/70 bg-white/45 text-[#0878e8] shadow-[0_12px_25px_rgba(19,184,255,0.08)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#0878e8] hover:text-white"
                                    >
                                        <PhoneCall
                                            size={18}
                                            strokeWidth={2.1}
                                        />
                                    </a>
                                </div>
                            </div>

                            {/* Navigasi */}
                            <div>
                                <h4 className="text-[15px] font-black uppercase tracking-[0.26em] text-[#0878e8]">
                                    Navigasi
                                </h4>

                                <ul className="mt-7 space-y-4">
                                    {['Tentang Kami', 'Layanan', 'Keunggulan', 'Verifikasi'].map((item) => (
                                        <li key={item}>
                                            <a
                                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                                className="group flex items-center gap-3 text-[15px] font-semibold text-[#808999] transition hover:text-[#0878e8]"
                                            >
                                                <span className="h-2 w-2 rounded-full bg-[#49ddd7] transition group-hover:scale-125" />
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Kontak */}
                            <div>
                                <h4 className="text-[13px] font-black uppercase tracking-[0.34em] text-[#0878e8]">
                                    Hubungi Kami
                                </h4>

                                <ul className="mt-6 space-y-6 text-[15px] text-[#808999]">
                                    <li className="flex items-center gap-4">
                                        <span className="flex h-5 w-5 items-center justify-center text-[#49ddd7]">
                                            <MapPin
                                                size={18}
                                                strokeWidth={2.2}
                                            />
                                        </span>

                                        <span>Indonesia</span>
                                    </li>

                                    <li className="flex items-center gap-4">
                                        <span className="flex h-5 w-5 items-center justify-center text-[#49ddd7]">
                                            <Mail
                                                size={18}
                                                strokeWidth={2.2}
                                            />
                                        </span>

                                        <span>support@dentalyze.id</span>
                                    </li>

                                    <li className="flex items-center gap-4">
                                        <span className="flex h-5 w-5 items-center justify-center text-[#49ddd7]">
                                            <Clock3
                                                size={18}
                                                strokeWidth={2.2}
                                            />
                                        </span>

                                        <span>09:00 / 17:00</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Newsletter */}
                            <div>
                                <h4 className="text-[15px] font-black uppercase tracking-[0.26em] text-[#0878e8]">
                                    Newsletter
                                </h4>

                                <p className="mt-7 text-[15px] leading-[1.8] text-[#808999]">
                                    Dapatkan update fitur AI Dentalyze, teknologi deteksi gigi, dan pengembangan sistem terbaru.
                                </p>

                                <form className="relative mt-7 max-w-[340px]">
                                    <input
                                        type="email"
                                        placeholder="Email Anda"
                                        className="w-full rounded-[18px] border border-white/70 bg-white/50 px-5 py-4 pr-14 text-[14px] text-[#0878e8] placeholder:text-[#9ea6b6] shadow-[0_12px_30px_rgba(19,184,255,0.08)] backdrop-blur-md outline-none transition focus:border-[#49ddd7] focus:bg-white/70"
                                    />

                                    <button
                                        type="button"
                                        className="absolute right-2 top-2 bottom-2 flex w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] text-white shadow-lg transition hover:scale-105"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-[#0878e8]/10 pt-8">
                            <div className="flex flex-col items-center justify-between gap-5 text-[14px] text-[#9ea6b6] md:flex-row">
                                <p>
                                    © 2026 Dentalyze AI — AI Powered Dental Disease Detection and Analysis System. All rights reserved.
                                </p>

                                <div className="flex gap-7">
                                    <a href="#" className="transition hover:text-[#0878e8]">
                                        Kebijakan Privasi
                                    </a>
                                    <a href="#" className="transition hover:text-[#0878e8]">
                                        Syarat & Ketentuan
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                html {
                    scroll-behavior: smooth;
                }
                @keyframes gentle-float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(1deg);
                    }
                }

                .animate-gentle-float {
                    animation: gentle-float 6s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}