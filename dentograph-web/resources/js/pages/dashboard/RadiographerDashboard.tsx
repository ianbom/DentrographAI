import { Link } from '@inertiajs/react';
import {
    CalendarCheck,
    ChevronRight,
    ClipboardCheck,
    Clock3,
    FolderOpen,
    ShieldCheck,
    UserRound,
    Users,
    type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import patients from '@/routes/patients';
import radiographs from '@/routes/radiographs';

type DashboardUser = {
    name: string;
    role: string;
};

type PatientItem = {
    nik: string;
    name: string;
    age: number | null;
    date: string | null;
};

type CompletedDetection = {
    id_radiograph: string;
    patient_name: string;
    detections_count: number;
    date: string | null;
};

type Props = {
    stats: {
        total_patients: number;
        detections_today: number;
        total_detections: number;
        pending_detections: number;
    };
    user: DashboardUser;
    recent_patients: PatientItem[];
    completed_detections: CompletedDetection[];
};

export default function RadiographerDashboard({
    completed_detections,
    recent_patients,
    stats,
    user,
}: Props) {
    const cards = [
        {
            label: 'Total Pasien',
            value: stats.total_patients,
            icon: Users,
            badge: '+Record',
            href: patients.index(),
            tone: 'mint',
        },
        {
            label: 'Deteksi Hari Ini',
            value: stats.detections_today,
            icon: CalendarCheck,
            badge: 'Hari Ini',
            href: radiographs.index(),
            tone: 'dark',
        },
        {
            label: 'Total Deteksi',
            value: stats.total_detections,
            icon: ClipboardCheck,
            badge: 'Sistem',
            href: radiographs.index(),
            tone: 'green',
        },
        {
            label: 'Deteksi Menunggu',
            value: stats.pending_detections,
            icon: Clock3,
            badge: 'Antrean',
            href: radiographs.index(),
            tone: 'blue',
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
                                Radiografer
                            </p>
                            <h1 className="text-2xl font-black tracking-tight">
                                Dashboard Overview
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/60 px-4 py-2 shadow-[0_14px_35px_rgba(19,184,255,0.08)] backdrop-blur-md">
                        <div className="grid size-10 place-items-center rounded-full bg-[#073d52] text-xs font-black text-white">
                            {initials(user.name)}
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
                                Radiografer
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
                                        <p className="text-[11px] font-semibold text-[#8aa0b3]">
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

                <section className="mt-6 grid gap-6 xl:grid-cols-2">
                    <DashboardPanel
                        actionHref={patients.index()}
                        actionText="Lihat pasien"
                        icon={UserRound}
                        title="Pasien Terbaru"
                    >
                        {recent_patients.length === 0 ? (
                            <EmptyState text="Belum ada pasien terbaru." />
                        ) : (
                            recent_patients.map((patient) => (
                                <Link
                                    className="group flex items-center gap-4 rounded-[24px] bg-white/48 p-4 shadow-[0_10px_28px_rgba(19,184,255,0.05)] transition hover:bg-white/75"
                                    href={patients.show(patient.nik)}
                                    key={patient.nik}
                                >
                                    <Avatar label={patient.name} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-black">
                                            {patient.name}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-slate-400">
                                            {patient.age ?? 0} Tahun
                                        </p>
                                    </div>
                                    <time className="text-xs font-black text-[#87a9b8]">
                                        {patient.date ?? '-'}
                                    </time>
                                    <ChevronRight
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0878e8]"
                                        size={17}
                                    />
                                </Link>
                            ))
                        )}
                    </DashboardPanel>

                    <DashboardPanel
                        actionHref={radiographs.index()}
                        actionText="Lihat deteksi"
                        icon={FolderOpen}
                        title="Deteksi Selesai"
                    >
                        {completed_detections.length === 0 ? (
                            <EmptyState text="Belum ada deteksi yang selesai." />
                        ) : (
                            completed_detections.map((detection) => (
                                <Link
                                    className="group flex items-center gap-4 rounded-[24px] bg-white/48 p-4 shadow-[0_10px_28px_rgba(19,184,255,0.05)] transition hover:bg-white/75"
                                    href={radiographs.show(
                                        detection.id_radiograph,
                                    )}
                                    key={detection.id_radiograph}
                                >
                                    <Avatar label={detection.patient_name} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-black">
                                            {detection.patient_name}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-slate-400">
                                            {detection.detections_count} gigi
                                            terdeteksi
                                        </p>
                                    </div>
                                    <time className="text-xs font-black text-[#87a9b8]">
                                        {detection.date ?? '-'}
                                    </time>
                                    <ChevronRight
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0878e8]"
                                        size={17}
                                    />
                                </Link>
                            ))
                        )}
                    </DashboardPanel>
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
    actionHref: ReturnType<typeof patients.index>;
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
