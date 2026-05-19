import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileClock,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    User,
    X,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { PatientFormPatient } from '@/pages/patients/_patient-form';
import patients from '@/routes/patients';
import radiographs from '@/routes/radiographs';

type RadiographHistory = {
    id_radiograph: string;
    title: string;
    date: string | null;
    status: 'menunggu' | 'terverifikasi' | string;
    doctor_name: string | null;
    radiographer_name: string | null;
    detections_count: number;
};

type PatientsHistoryProps = {
    patient: PatientFormPatient;
    radiographs: RadiographHistory[];
    filters: {
        total: number;
        waiting: number;
        verified: number;
    };
};

type StatusFilter = 'semua' | 'menunggu' | 'terverifikasi';

function formatDate(value: string | null) {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

export default function PatientsHistory({
    filters,
    patient,
    radiographs: radiographRows,
}: PatientsHistoryProps) {
    const [status, setStatus] = useState<StatusFilter>('semua');
    const [search, setSearch] = useState('');

    const visibleRadiographs = useMemo(() => {
        const query = search.trim().toLowerCase();

        return radiographRows.filter((radiograph) => {
            const matchStatus =
                status === 'semua' || radiograph.status === status;
            const matchSearch =
                query.length === 0 ||
                radiograph.id_radiograph.toLowerCase().includes(query) ||
                radiograph.title.toLowerCase().includes(query) ||
                (radiograph.doctor_name ?? '').toLowerCase().includes(query) ||
                (radiograph.radiographer_name ?? '')
                    .toLowerCase()
                    .includes(query);

            return matchStatus && matchSearch;
        });
    }, [radiographRows, search, status]);

    const tabs = [
        {
            label: 'Semua',
            value: 'semua',
            count: filters.total,
            icon: Activity,
        },
        {
            label: 'Menunggu',
            value: 'menunggu',
            count: filters.waiting,
            icon: Clock3,
        },
        {
            label: 'Terverifikasi',
            value: 'terverifikasi',
            count: filters.verified,
            icon: CheckCircle2,
        },
    ] as const;

    return (
        <>
            <Head title={`Riwayat ${patient.name}`} />

            <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#eef8ff_0%,#edf8ff_35%,#f7fbff_100%)] p-4 shadow-[0_28px_70px_rgba(19,184,255,0.08)] sm:p-6">
                <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[#c7edff]/55 blur-[100px]" />
                <div className="pointer-events-none absolute bottom-0 left-1/3 size-72 rounded-full bg-[#49ddd7]/15 blur-[120px]" />

                <section className="relative grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
                    <aside className="overflow-hidden rounded-[30px] border border-white/70 bg-white/35 p-6 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                        <div className="flex items-start gap-4">
                            <span className="grid size-16 shrink-0 place-items-center rounded-[20px] bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] text-2xl font-black text-white shadow-[0_12px_28px_rgba(8,120,232,0.22)]">
                                {patient.name.slice(0, 1).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-black tracking-[0.36em] text-[#49ddd7] uppercase">
                                    PROFIL PASIEN
                                </p>
                                <h2 className="mt-2 text-[28px] leading-none font-black text-[#0878e8]">
                                    {patient.name}
                                </h2>
                                <p className="mt-2 text-sm font-semibold text-[#7B8BA7]">
                                    NIK {patient.nik}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3 text-sm text-[#526184]">
                            <Info icon={CalendarDays}>
                                {formatDate(patient.birth_date)} / {patient.age}{' '}
                                tahun
                            </Info>
                            <Info icon={MapPin}>
                                {patient.birth_place ?? '-'}
                            </Info>
                            <Info icon={Mail}>{patient.email ?? '-'}</Info>
                            <Info icon={Phone}>{patient.phone ?? '-'}</Info>
                            <Info icon={User}>
                                {patient.gender === 'male'
                                    ? 'Laki-laki'
                                    : 'Perempuan'}
                            </Info>
                        </div>

                        <p className="mt-8 rounded-[20px] border border-white/70 bg-white/40 p-4 text-sm leading-7 text-[#808999] italic shadow-sm backdrop-blur-md">
                            {patient.address ?? 'Alamat pasien belum diisi.'}
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-3">
                            {tabs.map((tab) => (
                                <button
                                    className={`rounded-[16px] border px-3 py-3 text-left transition ${
                                        status === tab.value
                                            ? 'border-[#49ddd7]/70 bg-white/70'
                                            : 'border-white/70 bg-white/35 hover:bg-white/55'
                                    }`}
                                    key={tab.value}
                                    onClick={() => setStatus(tab.value)}
                                    type="button"
                                >
                                    <tab.icon
                                        className={
                                            status === tab.value
                                                ? 'text-[#0878e8]'
                                                : 'text-[#9BA8BC]'
                                        }
                                        size={16}
                                    />
                                    <p className="mt-2 text-[9px] font-black tracking-[0.18em] text-[#9ea6b6] uppercase">
                                        {tab.label}
                                    </p>
                                    <strong className="mt-1 block text-xl font-black text-[#073d52]">
                                        {tab.count}
                                    </strong>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white/35 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                        <div className="flex flex-col gap-4 border-b border-white/60 p-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-[11px] font-black tracking-[0.42em] text-[#49ddd7] uppercase">
                                    RIWAYAT
                                </p>
                                <h2 className="mt-2 text-[30px] leading-none font-black text-[#0878e8] uppercase">
                                    Pemeriksaan
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <label className="flex h-12 min-w-0 items-center gap-2 rounded-[14px] border border-white/70 bg-white/45 px-4 text-[#7B8BA7] shadow-sm backdrop-blur-md sm:w-80">
                                    <Search size={16} />
                                    <input
                                        aria-label="Cari riwayat pasien"
                                        className="min-w-0 flex-1 bg-transparent text-sm text-[#22304F] outline-none placeholder:text-[#9BA8BC]"
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Cari ID, dokter, radiografer"
                                        type="search"
                                        value={search}
                                    />
                                    {search && (
                                        <button
                                            className="text-[#9BA8BC] transition hover:text-[#0878e8]"
                                            onClick={() => setSearch('')}
                                            type="button"
                                        >
                                            <X size={15} />
                                        </button>
                                    )}
                                </label>

                                <Link
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] px-5 text-xs font-black tracking-wider text-white uppercase shadow-[0_12px_28px_rgba(8,120,232,0.22)] transition-all hover:scale-[1.02] active:scale-95"
                                    href={patients.index()}
                                    prefetch
                                >
                                    <Plus size={16} />
                                    Kembali
                                </Link>
                            </div>
                        </div>

                        {visibleRadiographs.length ? (
                            <div className="divide-y divide-white/60">
                                {visibleRadiographs.map((radiograph) => (
                                    <Link
                                        className="grid gap-4 p-5 text-sm text-[#526184] transition hover:bg-white/45 md:grid-cols-[1.1fr_0.8fr_0.8fr_auto]"
                                        href={radiographs.show(
                                            radiograph.id_radiograph,
                                        )}
                                        key={radiograph.id_radiograph}
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-white/45 text-[#1599F5] shadow-sm backdrop-blur-md">
                                                <Activity size={18} />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate font-black text-[#22304F]">
                                                    {radiograph.id_radiograph}
                                                </p>
                                                <p className="mt-1 text-xs text-[#7B8BA7]">
                                                    {formatDate(
                                                        radiograph.date,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <Meta
                                            label="Radiografer"
                                            value={
                                                radiograph.radiographer_name ??
                                                '-'
                                            }
                                        />
                                        <Meta
                                            label="Dokter"
                                            value={
                                                radiograph.doctor_name ??
                                                'Belum dianalisis'
                                            }
                                        />

                                        <div className="flex items-center justify-between gap-3 md:justify-end">
                                            <div className="text-right">
                                                <StatusBadge
                                                    status={radiograph.status}
                                                />
                                                <p className="mt-1 text-[10px] font-semibold text-[#7B8BA7]">
                                                    {
                                                        radiograph.detections_count
                                                    }{' '}
                                                    deteksi
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="grid min-h-96 place-items-center p-8 text-center">
                                <div className="max-w-sm rounded-[28px] border border-white/70 bg-white/40 p-8 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md">
                                    <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] text-white shadow-[0_12px_28px_rgba(8,120,232,0.22)]">
                                        <FileClock size={24} />
                                    </span>
                                    <h3 className="mt-5 text-[20px] font-black text-[#0878e8] uppercase">
                                        Belum ada riwayat
                                    </h3>
                                    <p className="mt-3 text-[15px] leading-[1.8] text-[#808999] italic">
                                        Riwayat radiografi pasien akan muncul di
                                        sini setelah data pemeriksaan tersedia.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </section>
            </div>
        </>
    );
}

function Info({
    children,
    icon: Icon,
}: {
    children: ReactNode;
    icon: ComponentType<{ size?: number }>;
}) {
    return (
        <p className="flex items-center gap-3 rounded-[16px] border border-white/70 bg-white/40 px-4 py-3 shadow-sm backdrop-blur-md">
            <Icon size={15} />
            <span>{children}</span>
        </p>
    );
}

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[16px] border border-white/70 bg-white/35 px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#9ea6b6] uppercase">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-black text-[#22304F]">
                {value}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const verified = status === 'terverifikasi';

    return (
        <span
            className={`rounded-[10px] px-3 py-1 text-xs font-black shadow-sm ${
                verified
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
            }`}
        >
            {verified ? 'Terverifikasi' : 'Menunggu'}
        </span>
    );
}

PatientsHistory.layout = ({ patient }: PatientsHistoryProps) => ({
    breadcrumbs: [
        {
            title: 'Pasien',
            href: patients.index(),
        },
        {
            title: 'Riwayat Pasien',
            href: patients.history(patient.nik),
        },
    ],
});
