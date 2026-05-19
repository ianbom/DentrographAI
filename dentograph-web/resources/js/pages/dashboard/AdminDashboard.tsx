import { Link } from '@inertiajs/react';
import {
    Activity,
    Bell,
    Camera,
    ChevronRight,
    Database,
    ShieldCheck,
    Stethoscope,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import patients from '@/routes/patients';
import radiographs from '@/routes/radiographs';

type SeriesPoint = { label: string; value: number };
type ActivityUser = {
    id: number;
    name: string;
    total: number;
    today: number;
    active: boolean;
};
type Notification = {
    id_radiograph: string;
    patient_name: string;
    radiographer_name: string | null;
    image_url: string;
    created_at: string | null;
    date: string | null;
};
type Props = {
    stats: {
        total_patients: number;
        total_doctors: number;
        total_radiographers: number;
        total_radiographs: number;
        total_detections: number;
        pending_verifications: number;
        doctor_analyses: number;
        radiograph_uploads: number;
    };
    user: { name: string; role: string };
    notifications: Notification[];
    activities: {
        doctors: ActivityUser[];
        radiographers: ActivityUser[];
    };
    charts: {
        weekly: SeriesPoint[];
        monthly: SeriesPoint[];
    };
};

export default function AdminDashboard({
    activities,
    charts,
    notifications,
    stats,
    user,
}: Props) {
    const [range, setRange] = useState<'weekly' | 'monthly'>('weekly');
    const chartData = charts[range] ?? [];

    const cards = [
        {
            label: 'Patients',
            value: stats.total_patients,
            icon: Users,
            href: patients.index(),
        },
        {
            label: 'Doctors',
            value: stats.total_doctors,
            icon: Stethoscope,
        },
        {
            label: 'Radiografer',
            value: stats.total_radiographers,
            icon: Camera,
        },
        {
            label: 'Radiographs',
            value: stats.total_radiographs,
            icon: Database,
        },
        {
            label: 'Detections',
            value: stats.total_detections,
            icon: Activity,
        },
    ];

    return (
        <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#eef8ff_0%,#e8f6ff_52%,#f7fbff_100%)] p-4 text-[#073d52] sm:p-6">
            <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#c7edff]/55 blur-[105px]" />
            <div className="pointer-events-none absolute right-10 bottom-0 h-72 w-72 rounded-full bg-[#49ddd7]/15 blur-[120px]" />

            <div className="relative z-10">
                <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-2xl border border-white/70 bg-white/55 text-[#0878e8] shadow-[0_12px_30px_rgba(19,184,255,0.10)] backdrop-blur-md">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black tracking-[0.28em] text-[#49ddd7] uppercase">
                                Administrator
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
                            <p className="text-[9px] font-black tracking-[0.22em] text-slate-400 uppercase">
                                Admin
                            </p>
                            <p className="text-sm font-black">{user.name}</p>
                        </div>
                    </div>
                </header>

                <div className="grid gap-5 xl:grid-cols-[290px_1fr]">
                    <aside className="space-y-5">
                        <ProfileCard user={user} />
                        <NotificationCard notifications={notifications} />
                    </aside>

                    <main className="space-y-5">
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            {cards.map((card) => {
                                const Icon = card.icon;
                                const content = (
                                    <>
                                        <div className="grid size-12 place-items-center rounded-2xl bg-[#D9F2FA] text-[#0d8ecf]">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black tracking-[0.22em] text-slate-400 uppercase">
                                                {card.label}
                                            </p>
                                            <strong className="mt-1 block text-2xl font-black">
                                                {card.value}
                                            </strong>
                                        </div>
                                    </>
                                );

                                return card.href ? (
                                    <Link
                                        className="group relative overflow-hidden rounded-[26px] border border-white/75 bg-white/48 p-5 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/65"
                                        href={card.href}
                                        key={card.label}
                                    >
                                        <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[#86d8ff]/18 blur-3xl transition group-hover:scale-125" />
                                        <div className="relative z-10 flex items-center gap-4">
                                            {content}
                                        </div>
                                    </Link>
                                ) : (
                                    <article
                                        className="relative overflow-hidden rounded-[26px] border border-white/75 bg-white/48 p-5 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md"
                                        key={card.label}
                                    >
                                        <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[#86d8ff]/18 blur-3xl" />
                                        <div className="relative z-10 flex items-center gap-4">
                                            {content}
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        <section className="grid gap-4 lg:grid-cols-2">
                            <MiniStat
                                label="Radiograf Diupload"
                                value={stats.radiograph_uploads}
                            />
                            <MiniStat
                                label="Deteksi Dokter"
                                value={stats.doctor_analyses}
                            />
                        </section>

                        <section className="rounded-[34px] border border-white/75 bg-white/42 p-6 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black">
                                        Health Curve Deteksi
                                    </h2>
                                    <p className="mt-1 text-xs font-semibold text-slate-400">
                                        Grafik volume deteksi radiograf
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/70 bg-white/55 p-1 shadow-sm">
                                    <button
                                        className={`rounded-xl px-4 py-2 text-xs font-black ${
                                            range === 'weekly'
                                                ? 'bg-[#073d52] text-white shadow-sm'
                                                : 'text-slate-400'
                                        }`}
                                        onClick={() => setRange('weekly')}
                                        type="button"
                                    >
                                        W
                                    </button>
                                    <button
                                        className={`rounded-xl px-4 py-2 text-xs font-black ${
                                            range === 'monthly'
                                                ? 'bg-[#073d52] text-white shadow-sm'
                                                : 'text-slate-400'
                                        }`}
                                        onClick={() => setRange('monthly')}
                                        type="button"
                                    >
                                        M
                                    </button>
                                </div>
                            </div>
                            <Curve data={chartData} />
                        </section>

                        <section className="grid gap-5 lg:grid-cols-2">
                            <ActivityList
                                items={activities.doctors}
                                kind="doctor"
                                title="Aktifitas Dokter"
                            />
                            <ActivityList
                                items={activities.radiographers}
                                kind="radiographer"
                                title="Aktifitas Radiografer"
                            />
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ user }: { user: Props['user'] }) {
    return (
        <section className="relative overflow-hidden rounded-[34px] border border-white/75 bg-white/42 p-8 text-center shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#86d8ff]/18 blur-3xl" />
            <div className="relative z-10 mx-auto grid size-24 place-items-center rounded-[26px] bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] text-4xl font-black text-white shadow-[0_20px_45px_rgba(8,120,232,0.24)]">
                {initials(user.name)}
            </div>
            <div className="relative z-10">
                <h2 className="mt-6 font-black">{user.name}</h2>
                <p className="mt-1 text-[11px] font-black tracking-[0.32em] text-slate-400 uppercase">
                    Administrator
                </p>
            </div>
            <div className="relative z-10 mt-7 border-t border-white/70 pt-5">
                <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black text-emerald-600 uppercase">
                    Sistem Online
                </span>
            </div>
        </section>
    );
}

function NotificationCard({
    notifications,
}: {
    notifications: Notification[];
}) {
    return (
        <section className="rounded-[34px] border border-white/75 bg-white/42 p-5 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
            <h2 className="flex items-center gap-2 font-black">
                <span className="grid size-9 place-items-center rounded-2xl bg-[#D9F2FA] text-[#0d8ecf]">
                    <Bell size={16} />
                </span>
                Notifikasi
            </h2>
            <div className="mt-5 space-y-3">
                {notifications.length === 0 && (
                    <p className="rounded-2xl border border-white/70 bg-white/45 p-4 text-sm font-semibold text-slate-400">
                        Tidak ada tugas menunggu.
                    </p>
                )}
                {notifications.map((item) => (
                    <Link
                        className="group flex items-center gap-3 rounded-2xl bg-white/48 p-3 shadow-[0_10px_28px_rgba(19,184,255,0.05)] transition hover:bg-white/75"
                        href={radiographs.show(item.id_radiograph)}
                        key={item.id_radiograph}
                    >
                        <div className="grid size-12 place-items-center rounded-xl border border-white/75 bg-white/70 text-center text-[10px] font-black text-[#073d52] shadow-sm">
                            {item.date ?? 'NEW'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black">
                                {item.patient_name}
                            </p>
                            <p className="mt-1 truncate text-[11px] text-slate-400">
                                {item.created_at ?? '-'}
                            </p>
                        </div>
                        <ChevronRight
                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0878e8]"
                            size={16}
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
}

function MiniStat({ label, value }: { label: string; value: number }) {
    return (
        <article className="relative overflow-hidden rounded-[26px] border border-white/75 bg-white/48 p-5 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
            <div className="absolute -top-12 -right-10 h-28 w-28 rounded-full bg-[#49ddd7]/15 blur-2xl" />
            <p className="relative z-10 text-[10px] font-black tracking-[0.22em] text-slate-400 uppercase">
                {label}
            </p>
            <strong className="relative z-10 mt-2 block text-3xl font-black">
                {value}
            </strong>
        </article>
    );
}

function ActivityList({
    items,
    kind,
    title,
}: {
    items: ActivityUser[];
    kind: 'doctor' | 'radiographer';
    title: string;
}) {
    return (
        <section className="rounded-[34px] border border-white/75 bg-white/42 p-6 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
            <h2 className="border-l-4 border-[#49ddd7] pl-3 text-lg font-black">
                {title}
            </h2>
            <div className="mt-5 space-y-3">
                {items.map((item) => (
                    <article
                        className="flex items-center gap-4 rounded-2xl bg-white/48 p-4 shadow-[0_10px_28px_rgba(19,184,255,0.05)]"
                        key={`${kind}-${item.id}`}
                    >
                        <div className="grid size-12 place-items-center rounded-xl bg-[linear-gradient(135deg,#94B5C1,#073d52)] text-xs font-black text-white shadow-sm">
                            {kind === 'doctor' ? 'DR' : initials(item.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-black">{item.name}</p>
                            <p className="mt-1 text-[11px] font-semibold text-slate-400">
                                {item.today}/{item.total}{' '}
                                {kind === 'doctor'
                                    ? 'Verifikasi Data'
                                    : 'Upload Data'}
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-4 py-2 text-[10px] font-black uppercase ${
                                item.active
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                            {item.active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                    </article>
                ))}
            </div>
        </section>
    );
}

function Curve({ data }: { data: SeriesPoint[] }) {
    const points = useMemo(() => {
        const max = Math.max(...data.map((item) => item.value), 1);

        return data.map((item, index) => {
            const x = 30 + index * (540 / Math.max(data.length - 1, 1));
            const y = 210 - (item.value / max) * 160;

            return { ...item, x, y };
        });
    }, [data]);
    const line = points
        .map(
            (point, index) =>
                `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
        )
        .join(' ');
    const area = `${line} L ${points.at(-1)?.x ?? 30} 220 L 30 220 Z`;

    return (
        <div className="mt-6 overflow-hidden">
            <svg className="h-72 w-full" viewBox="0 0 600 250">
                <defs>
                    <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
                        <stop stopColor="#9CC9D6" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#9CC9D6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[40, 80, 120, 160, 200].map((x) => (
                    <line
                        key={x}
                        stroke="#E7F4FA"
                        strokeDasharray="4 6"
                        x1={x * 3}
                        x2={x * 3}
                        y1="30"
                        y2="220"
                    />
                ))}
                <path d={area} fill="url(#curveFill)" />
                <path
                    d={line}
                    fill="none"
                    stroke="#426777"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                />
                {points.map((point) => (
                    <g key={point.label}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            fill="#426777"
                            r="5"
                            stroke="#fff"
                            strokeWidth="3"
                        />
                        <text
                            fill="#8BABBA"
                            fontSize="11"
                            fontWeight="800"
                            textAnchor="middle"
                            x={point.x}
                            y="240"
                        >
                            {point.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
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
