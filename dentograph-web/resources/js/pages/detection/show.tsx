import { Head, Link, router } from '@inertiajs/react';
import { Download, Play, Plus, Save, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import radiographs from '@/routes/radiographs';
import radiographReports from '@/routes/reports/radiographs';

type Detection = {
    id_detection?: number;
    no_fdi: string;
    abnormality: string;
    analysis: string | null;
    bbox?: number[] | null;
    confidence?: number | null;
    crop_image?: string | null;
    is_active: boolean;
    source: string;
    crop_image_url?: string | null;
};
type AnalyzePayload = {
    message?: string;
    result_image?: string | null;
    result_image_url?: string | null;
    results?: Detection[];
};
type Props = {
    radiograph: {
        id_radiograph: string;
        patient: {
            name: string;
            nik: string;
            phone?: string | null;
            email?: string | null;
            age?: number | null;
            address?: string | null;
        };
        doctor_name: string | null;
        radiographer_name: string | null;
        image_url: string;
        result_image_url: string | null;
        preview_result_image?: string | null;
        status: string;
    };
    detections: Detection[];
    permissions: { analyze: boolean; finalize: boolean };
};

const fdiRows = [
    [
        '18',
        '17',
        '16',
        '15',
        '14',
        '13',
        '12',
        '11',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
    ],
    [
        '48',
        '47',
        '46',
        '45',
        '44',
        '43',
        '42',
        '41',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
    ],
];
const abnormalities = [
    'Normal',
    'Karies',
    'LesiPeriapikal',
    'Impaksi',
    'Resorpsi',
];
const conditionStyles: Record<string, string> = {
    Normal: 'bg-emerald-400 text-white shadow-[0_10px_22px_rgba(16,185,129,0.22)]',
    Karies: 'bg-amber-300 text-[#5C4200] shadow-[0_10px_22px_rgba(245,158,11,0.18)]',
    LesiPeriapikal:
        'bg-violet-500 text-white shadow-[0_10px_22px_rgba(139,92,246,0.2)]',
    Impaksi: 'bg-sky-500 text-white shadow-[0_10px_22px_rgba(14,165,233,0.2)]',
    Resorpsi:
        'bg-orange-500 text-white shadow-[0_10px_22px_rgba(249,115,22,0.2)]',
};
const legend = [
    ['Normal / terdeteksi', 'bg-emerald-400'],
    ['Dibatalkan', 'bg-rose-500'],
    ['Lesi periapikal', 'bg-violet-500'],
    ['Impaksi', 'bg-sky-500'],
    ['Resorpsi', 'bg-orange-500'],
    ['Karies', 'bg-amber-300'],
];

export default function DetectionShow({
    detections,
    permissions,
    radiograph,
}: Props) {
    const [items, setItems] = useState<Detection[]>(detections);
    const [manualFdi, setManualFdi] = useState('11');
    const [manualAbnormality, setManualAbnormality] = useState('Karies');
    const [analyzing, setAnalyzing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [resultImageUrl, setResultImageUrl] = useState<string | null>(
        radiograph.result_image_url,
    );
    const [resultImagePath, setResultImagePath] = useState<string | null>(
        radiograph.preview_result_image ?? null,
    );
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [analysisNotice, setAnalysisNotice] = useState<string | null>(null);
    const [selectedFdi, setSelectedFdi] = useState<string | null>(null);

    useEffect(() => {
        setItems(detections);
        setResultImageUrl(radiograph.result_image_url);
        setResultImagePath(radiograph.preview_result_image ?? null);
    }, [detections, radiograph.id_radiograph]);

    const byFdi = useMemo(
        () => new Map(items.map((item) => [item.no_fdi, item])),
        [items],
    );
    const activeItems = useMemo(
        () => items.filter((item) => item.is_active),
        [items],
    );

    function toggle(fdi: string) {
        setItems((current) =>
            current.map((item) =>
                item.no_fdi === fdi
                    ? { ...item, is_active: !item.is_active }
                    : item,
            ),
        );
    }

    function addManual() {
        if (byFdi.has(manualFdi)) {
            setSelectedFdi(manualFdi);

            return;
        }

        setItems((current) => [
            ...current,
            {
                no_fdi: manualFdi,
                abnormality: manualAbnormality,
                analysis: '',
                is_active: true,
                source: 'manual',
            },
        ]);
        setSelectedFdi(manualFdi);
    }

    function updateDetection(fdi: string, changes: Partial<Detection>): void {
        setItems((current) =>
            current.map((item) =>
                item.no_fdi === fdi ? { ...item, ...changes } : item,
            ),
        );
    }

    function save() {
        router.post(
            radiographs.finalize.url(radiograph.id_radiograph),
            {
                detections: items,
                result_image: resultImagePath,
            },
            {
                onStart: () => setSaving(true),
                onFinish: () => setSaving(false),
            },
        );
    }

    async function analyze() {
        setAnalyzing(true);
        setAnalysisError(null);
        setAnalysisNotice(null);

        try {
            const response = await fetch(
                radiographs.analyze.url(radiograph.id_radiograph),
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') ?? '',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({}),
                },
            );

            const responseText = await response.text();
            let payload: AnalyzePayload = {};

            try {
                payload = responseText
                    ? (JSON.parse(responseText) as AnalyzePayload)
                    : {};
            } catch {
                throw new Error(
                    `Laravel mengembalikan response non-JSON (HTTP ${response.status}). Cuplikan: ${responseText.slice(0, 180)}`,
                );
            }

            if (!response.ok) {
                throw new Error(
                    payload.message ??
                        `AI gagal mengembalikan hasil deteksi (HTTP ${response.status}).`,
                );
            }

            const results = payload.results ?? [];

            setItems(results);
            setResultImageUrl(payload.result_image_url ?? null);
            setResultImagePath(payload.result_image ?? null);

            if (results.length === 0) {
                setAnalysisError(
                    'AI tidak mengembalikan odontogram. Cek terminal Flask untuk detail error model.',
                );
                return;
            }

            setAnalysisNotice(
                payload.message ??
                    `AI berhasil mengembalikan ${results.length} hasil deteksi sementara. Lengkapi catatan lalu simpan final.`,
            );
        } catch (error) {
            setAnalysisError(
                error instanceof Error
                    ? error.message
                    : 'AI gagal mengembalikan hasil deteksi.',
            );
        } finally {
            setAnalyzing(false);
        }
    }

    const isVerified = radiograph.status === 'terverifikasi';
    const selectedItem = selectedFdi ? byFdi.get(selectedFdi) : undefined;

    return (
        <>
            <Head title={`Detail Deteksi ${radiograph.id_radiograph}`} />
            <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#eef8ff_0%,#edf8ff_35%,#f7fbff_100%)] p-4 shadow-[0_28px_70px_rgba(19,184,255,0.08)] sm:p-6">
                {analyzing && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-[#EAF8FF]/80 backdrop-blur-sm">
                        <div className="w-[min(420px,calc(100vw-32px))] rounded-[28px] border border-white/80 bg-white/70 p-7 text-center shadow-[0_24px_70px_rgba(8,120,232,0.18)]">
                            <div className="mx-auto size-14 animate-spin rounded-full border-4 border-[#CDEEFF] border-t-[#0878e8]" />
                            <h3 className="mt-5 text-xl font-black text-[#0878e8]">
                                Menganalisis Radiograf
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-[#62708f]">
                                AI sedang membuat bounding box, odontogram, dan
                                crop gigi. Jangan tutup halaman ini.
                            </p>
                        </div>
                    </div>
                )}
                <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[30px] border border-white/70 bg-white/35 p-6 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                        <p className="text-[11px] font-black tracking-[0.42em] text-[#49ddd7] uppercase">
                            PASIEN TERKAIT
                        </p>
                        <h2 className="mt-2 text-[30px] font-black text-[#0878e8]">
                            {radiograph.patient.name}
                        </h2>
                        <div className="mt-5 grid gap-3 text-sm text-[#526184] md:grid-cols-2">
                            <Info label="NIK" value={radiograph.patient.nik} />
                            <Info
                                label="Telepon"
                                value={radiograph.patient.phone ?? '-'}
                            />
                            <Info
                                label="Email"
                                value={radiograph.patient.email ?? '-'}
                            />
                            <Info
                                label="Usia"
                                value={
                                    radiograph.patient.age
                                        ? `${radiograph.patient.age} tahun`
                                        : '-'
                                }
                            />
                        </div>
                    </div>
                    <div className="rounded-[30px] bg-[#073d52] p-6 text-white shadow-[0_24px_55px_rgba(7,61,82,0.22)]">
                        <p className="text-[11px] font-black tracking-[0.42em] text-white/60 uppercase">
                            Radiograf
                        </p>
                        <h3 className="mt-3 text-xl font-black">
                            {radiograph.id_radiograph}
                        </h3>
                        <p className="mt-4 text-sm text-white/80">
                            Radiografer: {radiograph.radiographer_name ?? '-'}
                        </p>
                        <p className="mt-2 text-sm text-white/80">
                            Dokter:{' '}
                            {radiograph.doctor_name ?? 'Belum dianalisis'}
                        </p>
                        <p className="mt-4 inline-flex rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-100 uppercase">
                            {radiograph.status}
                        </p>
                        {permissions.analyze && !isVerified && (
                            <button
                                className="mt-5 inline-flex h-11 items-center gap-2 rounded-[14px] bg-white px-5 text-xs font-black text-[#073d52] uppercase"
                                disabled={analyzing}
                                onClick={analyze}
                                type="button"
                            >
                                <Play size={15} />
                                {analyzing ? 'Menganalisis' : 'Mulai Deteksi'}
                            </button>
                        )}
                        {(analysisNotice || analysisError) && (
                            <div
                                className={`mt-5 rounded-[16px] px-4 py-3 text-sm font-semibold ${
                                    analysisError
                                        ? 'bg-rose-400/15 text-rose-100'
                                        : 'bg-emerald-400/15 text-emerald-100'
                                }`}
                            >
                                {analysisError ?? analysisNotice}
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-6 grid gap-5 xl:grid-cols-2">
                    <ImagePanel
                        title="Original Image"
                        src={radiograph.image_url}
                    />
                    <ImagePanel
                        title="AI Detection + Bounding Box"
                        src={resultImageUrl ?? radiograph.image_url}
                    />
                </section>

                <section className="mt-6 rounded-[30px] border border-white/70 bg-white/35 p-6 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-black tracking-[0.42em] text-[#49ddd7] uppercase">
                                ODONTOGRAM FDI
                            </p>
                            <p className="mt-2 text-sm text-[#808999] italic">
                                Klik nomor gigi untuk membatalkan atau
                                mengaktifkan hasil deteksi.
                            </p>
                        </div>
                        {isVerified && (
                            <Link
                                className="inline-flex h-10 items-center gap-2 rounded-[12px] bg-white/50 px-4 text-xs font-black text-[#0878e8]"
                                href={radiographReports.pdf(
                                    radiograph.id_radiograph,
                                )}
                            >
                                <Download size={14} /> PDF
                            </Link>
                        )}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {legend.map(([label, color]) => (
                            <span
                                className="inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-2 text-[11px] font-black text-[#526184]"
                                key={label}
                            >
                                <span
                                    className={`size-3 rounded-full ${color}`}
                                />
                                {label}
                            </span>
                        ))}
                    </div>
                    <div className="mt-6 space-y-4 rounded-[24px] border border-white/70 bg-white/40 p-6">
                        {fdiRows.map((row) => (
                            <div
                                className="flex flex-wrap justify-center gap-2"
                                key={row.join('-')}
                            >
                                {row.map((fdi) => {
                                    const item = byFdi.get(fdi);

                                    return (
                                        <button
                                            className={`flex h-16 w-16 flex-col items-center justify-center rounded-[14px] text-[10px] font-black transition ${
                                                item
                                                    ? item.is_active
                                                        ? (conditionStyles[
                                                              item.abnormality
                                                          ] ??
                                                          conditionStyles.Normal)
                                                        : 'bg-rose-500 text-white line-through shadow-[0_10px_22px_rgba(244,63,94,0.2)]'
                                                    : 'bg-slate-100 text-slate-300'
                                            }`}
                                            key={fdi}
                                            onClick={() =>
                                                item && setSelectedFdi(fdi)
                                            }
                                            type="button"
                                        >
                                            <span className="text-sm">
                                                {fdi}
                                            </span>
                                            {item && (
                                                <span className="mt-1 max-w-[56px] truncate">
                                                    {item.is_active
                                                        ? item.abnormality
                                                        : 'Batal'}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <select
                            className="h-12 rounded-[14px] border border-white/70 bg-white/45 px-4 text-sm"
                            onChange={(event) =>
                                setManualFdi(event.target.value)
                            }
                            value={manualFdi}
                        >
                            {fdiRows.flat().map((fdi) => (
                                <option key={fdi}>{fdi}</option>
                            ))}
                        </select>
                        <select
                            className="h-12 rounded-[14px] border border-white/70 bg-white/45 px-4 text-sm"
                            onChange={(event) =>
                                setManualAbnormality(event.target.value)
                            }
                            value={manualAbnormality}
                        >
                            {abnormalities.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                        <button
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#073d52] px-5 text-xs font-black text-white uppercase"
                            onClick={addManual}
                            type="button"
                        >
                            <Plus size={16} /> Tambah Manual
                        </button>
                    </div>
                </section>

                <section className="mt-6 rounded-[30px] border border-white/70 bg-white/35 p-6 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                    <p className="text-[11px] font-black tracking-[0.42em] text-[#49ddd7] uppercase">
                        Tabel Hasil Per Gigi
                    </p>
                    <div className="mt-5">
                        {analyzing && (
                            <p className="rounded-[20px] border border-sky-200/70 bg-sky-50/70 p-5 text-sm font-semibold text-[#0878e8]">
                                AI sedang membaca radiograf. Proses pertama bisa
                                lebih lama karena model dimuat ke memori.
                            </p>
                        )}
                        {analysisError && (
                            <p className="rounded-[20px] border border-rose-200/70 bg-rose-50/70 p-5 text-sm font-semibold text-rose-500">
                                {analysisError}
                            </p>
                        )}
                        {!analyzing && items.length === 0 && (
                            <p className="rounded-[20px] border border-white/70 bg-white/45 p-5 text-sm text-[#7B8BA7]">
                                Belum ada hasil crop. Klik Mulai Deteksi untuk
                                menjalankan AI.
                            </p>
                        )}
                        {items.length > 0 && (
                            <div className="overflow-hidden rounded-[22px] border border-white/70 bg-white/45">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead className="bg-white/55 text-[11px] font-black tracking-[0.22em] text-[#9ea6b6] uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Crop</th>
                                            <th className="px-4 py-3">FDI</th>
                                            <th className="px-4 py-3">
                                                Kelainan
                                            </th>
                                            <th className="px-4 py-3">
                                                Catatan Dokter
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/70">
                                        {items.map((item, index) => (
                                            <tr
                                                className={
                                                    item.is_active
                                                        ? 'text-[#526184]'
                                                        : 'bg-rose-50/60 text-rose-500'
                                                }
                                                key={`${item.no_fdi}-row-${index}`}
                                            >
                                                <td className="px-4 py-3">
                                                    {item.crop_image_url ? (
                                                        <img
                                                            alt={`Gigi ${item.no_fdi}`}
                                                            className="size-20 rounded-[14px] bg-black object-cover"
                                                            src={
                                                                item.crop_image_url
                                                            }
                                                        />
                                                    ) : (
                                                        <div className="grid size-20 place-items-center rounded-[14px] bg-white/70 text-[9px] font-black text-[#b5bfce] uppercase">
                                                            Manual
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-black text-[#0878e8]">
                                                    {item.no_fdi}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                                                            item.is_active
                                                                ? (conditionStyles[
                                                                      item
                                                                          .abnormality
                                                                  ] ??
                                                                  conditionStyles.Normal)
                                                                : 'bg-rose-500 text-white'
                                                        }`}
                                                    >
                                                        {item.is_active
                                                            ? item.abnormality
                                                            : 'Dibatalkan'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        className="rounded-[12px] bg-white/60 px-4 py-2 text-xs font-black text-[#0878e8]"
                                                        onClick={() =>
                                                            setSelectedFdi(
                                                                item.no_fdi,
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        {item.analysis
                                                            ? 'Edit Catatan'
                                                            : 'Tambah Catatan'}
                                                    </button>
                                                    <p className="mt-2 max-w-md text-xs leading-5 text-[#7B8BA7]">
                                                        {item.analysis ??
                                                            'Belum ada catatan'}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-6 rounded-[30px] border border-white/70 bg-white/35 p-6 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                    {permissions.finalize && !isVerified && (
                        <button
                            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-emerald-500 px-6 text-xs font-black tracking-wider text-white uppercase shadow-[0_12px_28px_rgba(16,185,129,0.22)] disabled:cursor-not-allowed disabled:opacity-55"
                            disabled={saving || activeItems.length === 0}
                            onClick={save}
                            type="button"
                        >
                            <Save size={16} />
                            {saving ? 'Menyimpan' : 'Simpan Hasil Final'}
                        </button>
                    )}
                    {isVerified && (
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-[#073d52] px-6 text-xs font-black tracking-wider text-white uppercase"
                                href={radiographReports.pdf(
                                    radiograph.id_radiograph,
                                )}
                            >
                                <Download size={16} /> Buka Laporan PDF
                            </Link>
                        </div>
                    )}
                </section>
                {selectedItem && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-[#082f49]/30 p-4 backdrop-blur-sm">
                        <div className="w-[min(560px,100%)] rounded-[28px] border border-white/80 bg-[#F4FBFF] p-6 shadow-[0_24px_70px_rgba(8,120,232,0.22)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-black tracking-[0.34em] text-[#49ddd7] uppercase">
                                        Analisis Gigi
                                    </p>
                                    <h3 className="mt-2 text-2xl font-black text-[#0878e8]">
                                        FDI {selectedItem.no_fdi}
                                    </h3>
                                </div>
                                <button
                                    className="grid size-10 place-items-center rounded-full bg-white/70 text-[#526184]"
                                    onClick={() => setSelectedFdi(null)}
                                    type="button"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-[11px] font-black tracking-[0.2em] text-[#9ea6b6] uppercase">
                                        Kelainan
                                    </span>
                                    <select
                                        className="h-12 w-full rounded-[14px] border border-white/70 bg-white/60 px-4 text-sm outline-none"
                                        onChange={(event) =>
                                            updateDetection(
                                                selectedItem.no_fdi,
                                                {
                                                    abnormality:
                                                        event.target.value,
                                                },
                                            )
                                        }
                                        value={selectedItem.abnormality}
                                    >
                                        {abnormalities.map((item) => (
                                            <option key={item}>{item}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="space-y-2">
                                    <span className="text-[11px] font-black tracking-[0.2em] text-[#9ea6b6] uppercase">
                                        Status
                                    </span>
                                    <button
                                        className={`h-12 w-full rounded-[14px] text-xs font-black uppercase ${
                                            selectedItem.is_active
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-rose-500 text-white'
                                        }`}
                                        onClick={() =>
                                            toggle(selectedItem.no_fdi)
                                        }
                                        type="button"
                                    >
                                        {selectedItem.is_active
                                            ? 'Aktif / Disimpan'
                                            : 'Dibatalkan'}
                                    </button>
                                </label>
                            </div>
                            <label className="mt-5 block space-y-2">
                                <span className="text-[11px] font-black tracking-[0.2em] text-[#9ea6b6] uppercase">
                                    Catatan Analisis
                                </span>
                                <textarea
                                    className="min-h-36 w-full rounded-[18px] border border-white/70 bg-white/65 p-4 text-sm outline-none"
                                    onChange={(event) =>
                                        updateDetection(selectedItem.no_fdi, {
                                            analysis: event.target.value,
                                        })
                                    }
                                    placeholder="Tambahkan analisis dokter untuk gigi ini"
                                    value={selectedItem.analysis ?? ''}
                                />
                            </label>
                            <button
                                className="mt-5 h-12 w-full rounded-[14px] bg-[#073d52] text-xs font-black text-white uppercase"
                                onClick={() => setSelectedFdi(null)}
                                type="button"
                            >
                                Simpan Catatan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <p className="rounded-[14px] bg-white/50 px-4 py-3">
            <span className="font-black text-[#9ea6b6]">{label}: </span>
            {value}
        </p>
    );
}

function ImagePanel({ src, title }: { src: string; title: string }) {
    return (
        <figure className="rounded-[24px] border border-white/70 bg-white/40 p-4 shadow-sm backdrop-blur-md">
            <p className="mb-3 text-center text-[11px] font-black tracking-[0.28em] text-[#9ea6b6] uppercase">
                {title}
            </p>
            <img
                alt={title}
                className="h-80 w-full rounded-[18px] bg-black object-contain"
                src={src}
            />
        </figure>
    );
}

DetectionShow.layout = ({ radiograph }: Props) => ({
    breadcrumbs: [
        { title: 'Deteksi Penyakit', href: radiographs.index() },
        {
            title: 'Detail Deteksi',
            href: radiographs.show(radiograph.id_radiograph),
        },
    ],
});
