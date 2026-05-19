import { Link, router } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    Clock3,
    Filter,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import radiographs from '@/routes/radiographs';
import * as radiographHistory from '@/routes/radiographs/history';

type RadiographItem = {
    id_radiograph: string;
    patient_name: string;
    patient_nik: string;
    doctor_name: string | null;
    radiographer_name: string | null;
    status: 'menunggu' | 'terverifikasi' | string;
    created_at: string | null;
    detections_count?: number;
    relative_time?: string | null;
};

type Props = {
    radiographs?: RadiographItem[];
    filters?: {
        total: number;
        waiting: number;
        verified: number;
    };
};

type StatusFilter = 'semua' | 'menunggu' | 'terverifikasi';

export default function RadiographsHistory({
    filters,
    radiographs: items = [],
}: Props) {
    const params = new URLSearchParams(window.location.search);
    const initialStatus = params.get('status') as StatusFilter | null;
    const [status, setStatus] = useState<StatusFilter>(
        initialStatus &&
            ['semua', 'menunggu', 'terverifikasi'].includes(initialStatus)
            ? initialStatus
            : 'semua',
    );
    const [query, setQuery] = useState('');

    const visible = useMemo(() => {
        const keyword = query.trim().toLowerCase();

        return items.filter((item) => {
            const matchStatus = status === 'semua' || item.status === status;
            const matchKeyword =
                keyword.length === 0 ||
                item.patient_name.toLowerCase().includes(keyword) ||
                item.patient_nik.toLowerCase().includes(keyword) ||
                item.id_radiograph.toLowerCase().includes(keyword);

            return matchStatus && matchKeyword;
        });
    }, [items, query, status]);

    const tabs = [
        {
            label: 'Semua',
            value: 'semua',
            count: filters?.total ?? items.length,
            icon: Activity,
        },
        {
            label: 'Menunggu',
            value: 'menunggu',
            count:
                filters?.waiting ??
                items.filter((item) => item.status === 'menunggu').length,
            icon: Clock3,
        },
        {
            label: 'Terverifikasi',
            value: 'terverifikasi',
            count:
                filters?.verified ??
                items.filter((item) => item.status === 'terverifikasi').length,
            icon: CheckCircle2,
        },
    ] as const;

    function changeStatus(next: StatusFilter) {
        setStatus(next);
        router.visit(radiographHistory.index.url({
            query: next === 'semua' ? {} : { status: next },
        }), {
            replace: true,
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#eef8ff_0%,#e8f6ff_52%,#f7fbff_100%)] p-4 text-[#073d52] sm:p-6">
            <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-[#c7edff]/55 blur-[105px]" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[#49ddd7]/15 blur-[120px]" />

            <div className="relative z-10">
                <header className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#49ddd7]">
                            Riwayat Deteksi
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight">
                            Semua Pemeriksaan Radiograf
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-400">
                            Pantau radiograf yang masih menunggu analisis dan
                            hasil yang sudah terverifikasi dokter.
                        </p>
                    </div>

                    <label className="flex w-full items-center gap-3 rounded-2xl border border-white/75 bg-white/60 px-4 py-3 shadow-[0_14px_35px_rgba(19,184,255,0.08)] backdrop-blur-md lg:max-w-sm">
                        <Search size={17} className="text-[#9cb7c8]" />
                        <input
                            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9cb7c8]"
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari pasien, NIK, atau ID radiograf"
                            value={query}
                        />
                        {query && (
                            <button
                                className="text-slate-300 transition hover:text-[#0878e8]"
                                onClick={() => setQuery('')}
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </label>
                </header>

                <section className="mb-6 grid gap-4 md:grid-cols-3">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = status === tab.value;

                        return (
                            <button
                                className={`flex items-center justify-between rounded-[26px] border p-5 text-left shadow-[0_14px_35px_rgba(19,184,255,0.08)] backdrop-blur-md transition ${
                                    active
                                        ? 'border-[#49ddd7]/70 bg-white/75'
                                        : 'border-white/75 bg-white/42 hover:bg-white/60'
                                }`}
                                key={tab.value}
                                onClick={() => changeStatus(tab.value)}
                                type="button"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`grid size-12 place-items-center rounded-2xl ${
                                            active
                                                ? 'bg-[#DDF9F4] text-[#14b8a6]'
                                                : 'bg-[#EAF4F8] text-[#073d52]'
                                        }`}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            {tab.label}
                                        </p>
                                        <strong className="mt-1 block text-3xl font-black">
                                            {tab.count}
                                        </strong>
                                    </div>
                                </div>
                                <Filter
                                    className={
                                        active
                                            ? 'text-[#14b8a6]'
                                            : 'text-slate-300'
                                    }
                                    size={18}
                                />
                            </button>
                        );
                    })}
                </section>

                <section className="rounded-[34px] border border-white/75 bg-white/42 p-5 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <h2 className="flex items-center gap-3 text-lg font-black">
                            <span className="grid size-10 place-items-center rounded-2xl bg-[#D9F2FA] text-[#0d8ecf]">
                                <ShieldCheck size={18} />
                            </span>
                            Data Riwayat
                        </h2>
                        <span className="rounded-full bg-white/65 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#0878e8]">
                            {visible.length} Data
                        </span>
                    </div>

                    <div className="space-y-4">
                        {visible.length === 0 ? (
                            <div className="rounded-[24px] border border-white/70 bg-white/45 p-10 text-center text-sm font-semibold text-slate-400">
                                Tidak ada riwayat yang cocok dengan filter.
                            </div>
                        ) : (
                            visible.map((item) => (
                                <Link
                                    className="group grid gap-4 rounded-[26px] bg-white/52 p-4 shadow-[0_10px_28px_rgba(19,184,255,0.05)] transition hover:-translate-y-0.5 hover:bg-white/80 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto]"
                                    href={radiographs.show(item.id_radiograph)}
                                    key={item.id_radiograph}
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="grid size-14 place-items-center rounded-2xl border border-white/75 bg-white/70 text-sm font-black text-[#8ab2c3] shadow-sm">
                                            {initials(item.patient_name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-black">
                                                {item.patient_name}
                                            </p>
                                            <p className="mt-1 truncate text-xs font-semibold text-[#87a9b8]">
                                                {item.id_radiograph}
                                            </p>
                                        </div>
                                    </div>

                                    <InfoBlock
                                        label="Radiografer"
                                        value={item.radiographer_name ?? '-'}
                                    />
                                    <InfoBlock
                                        label="Dokter"
                                        value={item.doctor_name ?? 'Belum dianalisis'}
                                    />

                                    <div className="flex items-center justify-between gap-4 md:justify-end">
                                        <div className="text-right">
                                            <StatusBadge
                                                status={item.status}
                                            />
                                            <p className="mt-2 text-[10px] font-semibold text-slate-400">
                                                {item.relative_time ??
                                                    item.created_at ??
                                                    '-'}
                                            </p>
                                        </div>
                                        <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0878e8]">
                                            <ChevronIcon />
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

RadiographsHistory.layout = () => ({
    breadcrumbs: [
        {
            title: 'Riwayat Deteksi',
            href: radiographHistory.index(),
        },
    ],
});

function InfoBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0 rounded-2xl bg-[#F4FBFF]/70 px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-black text-[#073d52]">
                {value}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const verified = status === 'terverifikasi';

    return (
        <span
            className={`inline-flex rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${
                verified
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
            }`}
        >
            {verified ? 'Terverifikasi' : 'Menunggu'}
        </span>
    );
}

function ChevronIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
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
