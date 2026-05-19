import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronRight,
    Clock3,
    Database,
    ShieldCheck,
    Stethoscope,
    UserRound,
    Users,
    type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import radiographs from '@/routes/radiographs';
import * as radiographHistory from '@/routes/radiographs/history';

type DashboardUser = {
    name: string;
    role: string;
};

type QueueItem = {
    id_radiograph: string;
    patient_name: string;
    created_at: string | null;
};

type CompletedItem = {
    id_radiograph: string;
    patient_name: string;
    date: string | null;
};

type Props = {
    stats: {
        my_patients: number;
        pending_verifications: number;
        completed_verifications: number;
        total_system: number;
    };
    user: DashboardUser;
    verification_queue: QueueItem[];
    doctor_completed_detections: CompletedItem[];
};

export default function DoctorDashboard({
    doctor_completed_detections,
    stats,
    user,
    verification_queue,
}: Props) {
    const cards = [
        {
            label: 'Pasien Saya',
            value: stats.my_patients,
            icon: Users,
            badge: 'Records',
            tone: 'mint',
            href: radiographHistory.index(),
        },
        {
            label: 'Antrean',
            value: stats.pending_verifications,
            icon: Clock3,
            badge: 'Perlu Tindakan',
            tone: 'dark',
            href: radiographHistory.index({ query: { status: 'menunggu' } }),
        },
        {
            label: 'Selesai',
            value: stats.completed_verifications,
            icon: CheckCircle2,
            badge: 'Verified',
            tone: 'green',
            href: radiographHistory.index({
                query: { status: 'terverifikasi' },
            }),
        },
        {
            label: 'Total Sistem',
            value: stats.total_system,
            icon: Database,
            badge: 'Database',
            tone: 'blue',
            href: radiographHistory.index(),
        },
    ];

    return (
        <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#eef8ff_0%,#e8f6ff_52%,#f7fbff_100%)] p-4 text-[#073d52] sm:p-6">
            <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-[#c7edff]/55 blur-[105px]" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[#49ddd7]/15 blur-[120px]" />

            <div className="relative z-10">
                <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-2xl border border-white/70 bg-white/55 text-[#0878e8] shadow-[0_12px_30px_rgba(19,184,255,0.10)] backdrop-blur-md">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#49ddd7]">
                                Dokter
                            </p>
                            <h1 className="text-2xl font-black tracking-tight">
                                Dashboard Overview
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/60 px-4 py-2 shadow-[0_14px_35px_rgba(19,184,255,0.08)] backdrop-blur-md">
                        <div className="grid size-10 place-items-center rounded-full bg-[#DDF4FF] text-xs font-black text-[#0878e8]">
                            {initials(user.name)}
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
                                Dokter
                            </p>
                            <p className="text-sm font-black">{user.name}</p>
                        </div>
                    </div>
                </header>

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <Link
                                className="group relative min-h-36 overflow-hidden rounded-[30px] border border-white/75 bg-white/48 p-6 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/65"
                                href={card.href}
                                key={card.label}
                            >
                                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#86d8ff]/20 blur-3xl transition group-hover:scale-125" />
                                <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div
                                            className={`grid size-12 place-items-center rounded-2xl ${cardIconClass(card.tone)}`}
                                        >
                                            <Icon size={20} />
                                        </div>
                                        <span
                                            className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${badgeClass(card.tone)}`}
                                        >
                                            {card.badge}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8aa0b3]">
                                            {card.label}
                                        </p>
                                        <strong className="mt-1 block text-4xl font-black tracking-tight text-[#073d52]">
                                            {card.value}
                                        </strong>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
                    <DashboardPanel
                        actionHref={radiographHistory.index({
                            query: { status: 'menunggu' },
                        })}
                        actionText="Lihat semua"
                        icon={Clock3}
                        title="Antrean Verifikasi"
                    >
                        {verification_queue.length === 0 ? (
                            <EmptyState text="Tidak ada antrean verifikasi." />
                        ) : (
                            verification_queue.map((item) => (
                                <Link
                                    className="group flex items-center gap-4 rounded-[24px] bg-white/48 p-4 shadow-[0_10px_28px_rgba(19,184,255,0.05)] transition hover:bg-white/75"
                                    href={radiographs.show(item.id_radiograph)}
                                    key={item.id_radiograph}
                                >
                                    <Avatar label={item.patient_name} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-black">
                                            {item.patient_name}
                                        </p>
                                        <p className="mt-1 truncate text-xs font-semibold text-[#87a9b8]">
                                            ID: {item.id_radiograph}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="rounded-full bg-[#FF9F1C] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                                            Verifikasi
                                        </span>
                                        <p className="mt-2 text-[10px] font-semibold italic text-slate-400">
                                            {item.created_at ?? '-'}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0878e8]"
                                        size={17}
                                    />
                                </Link>
                            ))
                        )}
                    </DashboardPanel>

                    <div className="space-y-6">
                        <section className="relative overflow-hidden rounded-[34px] bg-[#073d52] p-7 text-white shadow-[0_20px_45px_rgba(7,61,82,0.22)]">
                            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[18px] border-white/5" />
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="grid size-12 place-items-center rounded-2xl bg-white/12">
                                    <Stethoscope size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">
                                        Halo, {user.name}!
                                    </h2>
                                    <p className="mt-2 text-sm font-semibold text-white/70">
                                        Ada {stats.pending_verifications} pasien
                                        baru yang menunggu validasi radiograf
                                        hari ini.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <DashboardPanel
                            actionHref={radiographHistory.index({
                                query: { status: 'terverifikasi' },
                            })}
                            actionText="Riwayat"
                            icon={CheckCircle2}
                            title="Selesai Diverifikasi"
                        >
                            {doctor_completed_detections.length === 0 ? (
                                <EmptyState text="Belum ada hasil yang diverifikasi." />
                            ) : (
                                doctor_completed_detections.map((item) => (
                                    <Link
                                        className="group flex items-center gap-4 rounded-[22px] bg-white/48 p-4 shadow-[0_10px_28px_rgba(19,184,255,0.05)] transition hover:bg-white/75"
                                        href={radiographs.show(
                                            item.id_radiograph,
                                        )}
                                        key={item.id_radiograph}
                                    >
                                        <Avatar label={item.patient_name} />
                                        <p className="min-w-0 flex-1 truncate font-black">
                                            {item.patient_name}
                                        </p>
                                        <time className="text-xs font-black text-[#87a9b8]">
                                            {item.date ?? '-'}
                                        </time>
                                    </Link>
                                ))
                            )}
                        </DashboardPanel>
                    </div>
                </section>
            </div>
        </div>
    );
}

function DashboardPanel({
    actionHref,
    actionText,
    children,
    icon: Icon,
    title,
}: {
    actionHref: ReturnType<typeof radiographHistory.index>;
    actionText: string;
    children: ReactNode;
    icon: LucideIcon;
    title: string;
}) {
    return (
        <section className="rounded-[34px] border border-white/75 bg-white/42 p-6 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-lg font-black">
                    <span className="grid size-10 place-items-center rounded-2xl bg-[#D9F2FA] text-[#0d8ecf]">
                        <Icon size={18} />
                    </span>
                    {title}
                </h2>
                <Link
                    className="hidden rounded-full bg-white/65 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#0878e8] shadow-sm transition hover:bg-white sm:inline-flex"
                    href={actionHref}
                >
                    {actionText}
                </Link>
            </div>

            <div className="space-y-4">{children}</div>
        </section>
    );
}

function Avatar({ label }: { label: string }) {
    return (
        <div className="grid size-14 place-items-center rounded-2xl border border-white/75 bg-white/70 text-sm font-black text-[#8ab2c3] shadow-sm">
            {initials(label)}
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-[24px] border border-white/70 bg-white/45 p-8 text-center text-sm font-semibold text-slate-400">
            {text}
        </div>
    );
}

function cardIconClass(tone: string) {
    const classes = {
        blue: 'bg-[#E9F0FF] text-[#2F4BA5]',
        dark: 'bg-[#EAF4F8] text-[#073d52]',
        green: 'bg-[#E7FFF5] text-[#11a972]',
        mint: 'bg-[#DDF9F4] text-[#14b8a6]',
    };

    return classes[tone as keyof typeof classes] ?? classes.mint;
}

function badgeClass(tone: string) {
    const classes = {
        blue: 'bg-[#2F4BA5] text-white',
        dark: 'bg-[#073d52] text-white',
        green: 'bg-[#16bf84] text-white',
        mint: 'bg-[#18b99a] text-white',
    };

    return classes[tone as keyof typeof classes] ?? classes.mint;
}

function initials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}
