import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    MessageSquareWarningIcon,
    Sparkles,
} from 'lucide-react';
import PatientHeader from '@/components/patient-header';
import { dashboard } from '@/routes';

const conditions = [
    {
        label: 'Karies Gigi',
        title: 'Gigi Berlubang',
        body: 'Kerusakan pada lapisan keras gigi akibat asam dari sisa makanan. Jika dibiarkan, lubang dapat semakin dalam dan menimbulkan nyeri tajam.',
        image: '/asset/images/insight_karies.png',
        accent: 'text-[#c81919]',
        badge: 'bg-[#ffe2e2] text-[#c81919]',
    },
    {
        label: 'Lesi Periapikal',
        title: 'Infeksi Akar',
        body: 'Kantong infeksi yang terbentuk di ujung akar gigi, sering terjadi karena lubang gigi yang tidak dirawat sampai sarafnya mati.',
        image: '/asset/images/insight_lesi.png',
        accent: 'text-[#0878e8]',
        badge: 'bg-[#dff9f6] text-[#0f7f78]',
    },
    {
        label: 'Resorpsi',
        title: 'Pengeroposan Akar',
        body: 'Kondisi ketika tubuh menyerap kembali struktur akar gigi. Hal ini dapat terjadi dari dalam atau luar akar karena tekanan atau cedera.',
        image: '/asset/images/insight_resorpsi.png',
        accent: 'text-[#c98a00]',
        badge: 'bg-[#fff3bf] text-[#b77a00]',
    },
    {
        label: 'Impaksi',
        title: 'Gigi Terpendam',
        body: 'Gigi, biasanya gigi bungsu, yang tidak punya cukup ruang untuk tumbuh normal sehingga terjebak di dalam gusi atau tulang rahang.',
        image: '/asset/images/insight_impaksi.png',
        accent: 'text-[#e85d04]',
        badge: 'bg-[#ffe8d6] text-[#e85d04]',
    },
];

const tips = [
    {
        title: 'Sikat Gigi 2 Menit',
        body: 'Gunakan teknik memutar lembut minimal dua kali sehari.',
    },
    {
        title: 'Gunakan Benang Gigi',
        body: 'Bersihkan sela-sela yang sulit dijangkau sikat gigi.',
    },
    {
        title: 'Kurangi Camilan Manis',
        body: 'Gula mempercepat pembentukan asam penyebab lubang gigi.',
    },
];

export default function PatientInsight() {
    return (
        <>
            <Head title="Insight Dental" />

            <main>
                <div className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#c7edff]/55 blur-[120px]" />
                <div className="pointer-events-none absolute right-[-100px] bottom-[-80px] h-[380px] w-[380px] rounded-full bg-[#49ddd7]/18 blur-[130px]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(8,120,232,0.14)_1px,transparent_0)] [background-size:34px_34px] opacity-[0.12]" />

                <PatientHeader />

                <div className="relative z-10 mx-auto max-w-7xl">
                    <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/35 p-8 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md lg:p-10">
                        <img
                            src="/asset/images/gigi.png"
                            alt=""
                            className="pointer-events-none absolute right-[-90px] bottom-[-145px] w-[430px] opacity-[0.1] lg:right-[-20px] lg:w-[540px]"
                        />

                        <div className="relative z-10 max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-5 py-2 text-[11px] font-black tracking-[0.35em] text-[#49ddd7] uppercase backdrop-blur-md">
                                <Sparkles size={14} />
                                Insight Dentalyze
                            </div>

                            <h1 className="mt-5 text-[48px] leading-[0.95] font-black tracking-[-0.06em] text-transparent bg-gradient-to-r from-[#dff6ff] via-[#86d2ff] to-[#0878e8] bg-clip-text lg:text-[76px]">
                                 Kenali Kondisi Gigi & Mulut
                            </h1>

                            <p className="mt-5 max-w-2xl text-[16px] leading-[1.9] text-[#808999]">
                                Pelajari istilah radiografi gigi dengan visual
                                yang lebih ringan, clean, dan mudah dipahami.
                            </p>

                            <Link
                                href={dashboard()}
                                className="mt-8 inline-flex items-center gap-3 rounded-[12px] bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] px-7 py-4 text-xs font-black tracking-[0.18em] text-white uppercase shadow-[0_12px_28px_rgba(24,121,230,0.25)] transition hover:scale-105"
                            >
                                Dashboard
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {conditions.map((condition) => (
                            <article
                                key={condition.label}
                                className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/35 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/50"
                            >
                                <img
                                    src={condition.image}
                                    alt={condition.label}
                                    className="h-48 w-full object-cover"
                                />

                                <div className="p-6">
                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-[10px] font-black tracking-[0.12em] uppercase ${condition.badge}`}
                                    >
                                        {condition.label}
                                    </span>

                                    <h2
                                        className={`mt-4 text-[24px] font-black tracking-[-0.03em] ${condition.accent}`}
                                    >
                                        {condition.title}
                                    </h2>

                                    <p className="mt-3 text-[14px] leading-7 text-[#5f6c7d]">
                                        {condition.body}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </section>

                    <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                        <article className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/35 p-7 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
                            <div className="absolute right-[-80px] bottom-[-90px] h-64 w-64 rounded-full bg-[#49ddd7]/14 blur-3xl" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-[#087b78]">
                                    <Sparkles size={28} />
                                    <h2 className="text-[25px] font-black">
                                        Tips Menjaga Kesehatan Gigi
                                    </h2>
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-3">
                                    {tips.map((tip) => (
                                        <div
                                            key={tip.title}
                                            className="rounded-[20px] border border-white/70 bg-white/45 p-5 shadow-sm"
                                        >
                                            <span className="block size-6 rounded-full bg-[#49ddd7] shadow-[inset_0_0_0_7px_rgba(255,255,255,0.28)]" />
                                            <h3 className="mt-4 font-black text-[#213b5f]">
                                                {tip.title}
                                            </h3>
                                            <p className="mt-2 text-[14px] leading-7 text-[#5f6c7d]">
                                                {tip.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>

                        <article className="rounded-[30px] bg-[linear-gradient(135deg,#20b9ff_0%,#0878e8_100%)] p-7 text-white shadow-[0_24px_55px_rgba(8,120,232,0.26)]">
                            <div className="flex items-center gap-3">
                                <MessageSquareWarningIcon size={30} />
                                <h2 className="text-[25px] font-black">
                                    Kapan Harus ke Dokter Gigi?
                                </h2>
                            </div>

                            <div className="mt-6 space-y-3">
                                {[
                                    ['Sakit gigi berdenyut hebat', 'Segera'],
                                    ['Gusi berdarah atau bengkak', 'Minggu ini'],
                                    ['Pemeriksaan rutin 6 bulan', 'Terjadwal'],
                                ].map(([title, status]) => (
                                    <div
                                        key={title}
                                        className="flex items-center justify-between gap-4 rounded-[16px] border border-white/20 bg-white/15 px-5 py-4 backdrop-blur-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle size={17} />
                                            <p className="font-semibold">
                                                {title}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-[12px] font-black tracking-[0.08em] uppercase text-white/80">
                                            {status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>
                </div>
            </main>
        </>
    );
}
