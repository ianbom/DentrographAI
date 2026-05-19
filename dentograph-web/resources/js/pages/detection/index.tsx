import { Head, Link, router, useForm } from '@inertiajs/react';
import { Activity, ImagePlus, Play, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import radiographs from '@/routes/radiographs';

type Option = { name: string; nik?: string };
type Radiograph = {
    id_radiograph: string;
    patient_name: string;
    patient_nik: string;
    doctor_name: string | null;
    radiographer_name: string | null;
    image_url: string;
    status: string;
    created_at: string | null;
};

type DetectionIndexProps = {
    radiographs: Radiograph[];
    patients: Option[];
    filters: { total: number; waiting: number; verified: number };
    permissions: { create: boolean; analyze: boolean; delete: boolean };
};

export default function DetectionIndex({
    filters,
    patients,
    permissions,
    radiographs: rows,
}: DetectionIndexProps) {
    const [search, setSearch] = useState('');
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const { data, setData, post, processing, progress, errors, reset } =
        useForm<{
            patient_nik: string;
            image: File | null;
        }>({ patient_nik: '', image: null });

    const visibleRows = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return rows;
        }

        return rows.filter((item) =>
            [
                item.id_radiograph,
                item.patient_name,
                item.patient_nik,
                item.status,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query)),
        );
    }, [rows, search]);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(radiographs.store.url(), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title="Deteksi Penyakit" />
            <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#eef8ff_0%,#edf8ff_35%,#f7fbff_100%)] p-4 shadow-[0_28px_70px_rgba(19,184,255,0.08)] sm:p-6">
                <section className="grid gap-4 md:grid-cols-3">
                    <Stat label="Total Deteksi" value={filters.total} />
                    <Stat label="Menunggu" value={filters.waiting} strong />
                    <Stat label="Terverifikasi" value={filters.verified} />
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
                    {permissions.create && (
                        <form
                            className="rounded-[30px] border border-white/70 bg-white/35 p-6 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md"
                            onSubmit={submit}
                        >
                            <p className="text-[11px] font-black tracking-[0.42em] text-[#49ddd7] uppercase">
                                DETEKSI PENYAKIT
                            </p>
                            <h2 className="mt-2 text-[30px] leading-none font-black text-[#0878e8] uppercase">
                                Upload Radiograf
                            </h2>
                            <p className="mt-4 text-[15px] leading-[1.8] text-[#808999] italic">
                                Pilih pasien, unggah gambar radiograf, lalu
                                dokter dapat memulai deteksi AI.
                            </p>

                            <div className="mt-7 space-y-4">
                                <Field
                                    error={errors.patient_nik}
                                    label="Pasien"
                                >
                                    <select
                                        className="h-12 w-full rounded-[14px] border border-white/70 bg-white/45 px-4 text-sm text-[#22304F] shadow-sm backdrop-blur-md outline-none"
                                        onChange={(event) =>
                                            setData(
                                                'patient_nik',
                                                event.target.value,
                                            )
                                        }
                                        value={data.patient_nik}
                                    >
                                        <option value="">Pilih pasien</option>
                                        {patients.map((patient) => (
                                            <option
                                                key={patient.nik}
                                                value={patient.nik}
                                            >
                                                {patient.name} - {patient.nik}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field
                                    error={errors.image}
                                    label="Gambar Radiograf"
                                >
                                    <input
                                        className="block w-full rounded-[14px] border border-white/70 bg-white/45 px-4 py-3 text-sm text-[#22304F] shadow-sm backdrop-blur-md file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#13b8ff] file:px-4 file:py-2 file:text-xs file:font-black file:text-white"
                                        onChange={(event) =>
                                            setData(
                                                'image',
                                                event.target.files?.[0] ?? null,
                                            )
                                        }
                                        type="file"
                                    />
                                </Field>
                            </div>
                            <button
                                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#13b8ff_0%,#0878e8_100%)] px-6 text-xs font-black tracking-wider text-white uppercase shadow-[0_12px_28px_rgba(8,120,232,0.22)] disabled:opacity-70"
                                disabled={processing}
                                type="submit"
                            >
                                <ImagePlus size={16} />
                                {processing
                                    ? `Mengunggah${progress?.percentage ? ` ${progress.percentage}%` : ''}`
                                    : 'Upload Radiograf'}
                            </button>
                        </form>
                    )}

                    <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white/35 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                        <div className="flex flex-col gap-4 border-b border-white/60 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-[11px] font-black tracking-[0.42em] text-[#49ddd7] uppercase">
                                    DAFTAR RADIOGRAF
                                </p>
                                <p className="mt-3 text-[15px] leading-[1.8] text-[#808999] italic">
                                    Buka detail untuk membandingkan gambar,
                                    mengoreksi odontogram, dan menyimpan hasil.
                                </p>
                            </div>
                            <label className="flex h-12 min-w-0 items-center gap-2 rounded-[14px] border border-white/70 bg-white/45 px-4 text-[#7B8BA7] shadow-sm backdrop-blur-md sm:w-72">
                                <Search size={16} />
                                <input
                                    className="min-w-0 flex-1 bg-transparent text-sm text-[#22304F] outline-none"
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Cari deteksi"
                                    value={search}
                                />
                            </label>
                        </div>
                        <div className="divide-y divide-white/60">
                            {visibleRows.map((item) => (
                                <article
                                    className="grid gap-4 p-5 text-sm text-[#526184] hover:bg-white/45 lg:grid-cols-[1fr_auto]"
                                    key={item.id_radiograph}
                                >
                                    <Link
                                        className="flex gap-4 rounded-[18px] transition outline-none hover:bg-white/35 focus:ring-2 focus:ring-[#13b8ff]/40"
                                        href={radiographs.show(
                                            item.id_radiograph,
                                        )}
                                        prefetch
                                    >
                                        <img
                                            alt=""
                                            className="h-20 w-28 rounded-[16px] object-cover"
                                            src={item.image_url}
                                        />
                                        <div>
                                            <p className="font-black text-[#22304F]">
                                                {item.patient_name}
                                            </p>
                                            <p className="mt-1 text-xs text-[#7B8BA7]">
                                                {item.id_radiograph}
                                            </p>
                                            <StatusBadge status={item.status} />
                                            <p className="mt-2 text-xs">
                                                Radiografer:{' '}
                                                {item.radiographer_name ?? '-'}
                                            </p>
                                            <p className="text-xs">
                                                Dokter:{' '}
                                                {item.doctor_name ?? '-'}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            className="grid size-10 place-items-center rounded-[12px] border border-white/70 bg-white/40 text-[#1599F5]"
                                            href={radiographs.show(
                                                item.id_radiograph,
                                            )}
                                            prefetch
                                        >
                                            <Activity size={16} />
                                        </Link>
                                        {permissions.analyze && (
                                            <button
                                                className="grid size-10 place-items-center rounded-[12px] bg-[#13b8ff] text-white disabled:opacity-60"
                                                disabled={
                                                    analyzingId ===
                                                    item.id_radiograph
                                                }
                                                onClick={() => {
                                                    setAnalyzingId(
                                                        item.id_radiograph,
                                                    );
                                                    router.post(
                                                        radiographs.analyze.url(
                                                            item.id_radiograph,
                                                        ),
                                                        {},
                                                        {
                                                            onFinish: () =>
                                                                setAnalyzingId(
                                                                    null,
                                                                ),
                                                        },
                                                    );
                                                }}
                                                type="button"
                                                title={
                                                    analyzingId ===
                                                    item.id_radiograph
                                                        ? 'Menganalisis AI'
                                                        : 'Mulai deteksi'
                                                }
                                            >
                                                <Play size={16} />
                                            </button>
                                        )}
                                        {permissions.delete && (
                                            <button
                                                className="grid size-10 place-items-center rounded-[12px] bg-rose-50 text-rose-500"
                                                onClick={() =>
                                                    router.delete(
                                                        radiographs.destroy.url(
                                                            item.id_radiograph,
                                                        ),
                                                    )
                                                }
                                                type="button"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </section>
            </div>
        </>
    );
}

function Field({
    children,
    error,
    label,
}: {
    children: React.ReactNode;
    error?: string;
    label: string;
}) {
    return (
        <label className="space-y-2">
            <span className="text-[11px] font-black tracking-[0.24em] text-[#9ea6b6] uppercase">
                {label}
            </span>
            {children}
            {error && (
                <span className="block text-xs font-semibold text-rose-500">
                    {error}
                </span>
            )}
        </label>
    );
}

function StatusBadge({ status }: { status: string }) {
    const verified = status === 'terverifikasi';

    return (
        <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                verified
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
            }`}
        >
            {verified ? 'Terverifikasi' : 'Menunggu'}
        </span>
    );
}

function Stat({
    label,
    strong = false,
    value,
}: {
    label: string;
    strong?: boolean;
    value: number;
}) {
    return (
        <article
            className={
                strong
                    ? 'rounded-[24px] bg-[linear-gradient(135deg,#20b9ff_0%,#0878e8_100%)] p-5 text-white shadow-[0_24px_55px_rgba(8,120,232,0.22)]'
                    : 'rounded-[24px] border border-white/70 bg-white/40 p-5 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md'
            }
        >
            <p
                className={`text-[11px] font-black tracking-[0.28em] uppercase ${strong ? 'text-white/75' : 'text-[#9ea6b6]'}`}
            >
                {label}
            </p>
            <strong
                className={`mt-3 block text-[40px] leading-none font-black ${strong ? 'text-white' : 'text-[#1c78ea]'}`}
            >
                {value}
            </strong>
        </article>
    );
}

DetectionIndex.layout = {
    breadcrumbs: [{ title: 'Deteksi Penyakit', href: radiographs.index() }],
};
