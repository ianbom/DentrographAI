import { Head } from '@inertiajs/react';
import radiographReports from '@/routes/reports/radiographs';
type Detection = {
    no_fdi: string;
    abnormality: string;
    analysis: string | null;
    crop_image_url: string | null;
    is_active: boolean;
};
type Props = {
    radiograph: {
        id_radiograph: string;
        doctor_name: string | null;
        radiographer_name: string | null;
        image_url: string;
        result_image_url: string | null;
        status: string;
        created_at: string | null;
        verified_at: string | null;
        verification_url: string;
    };
    patient: {
        nik: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        age: number | null;
        address: string | null;
    };
    detections: Detection[];
    qr_code: string;
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
const conditionStyles: Record<string, string> = {
    Normal: 'bg-emerald-400 text-white',
    Karies: 'bg-amber-300 text-[#5C4200]',
    LesiPeriapikal: 'bg-violet-500 text-white',
    Impaksi: 'bg-sky-500 text-white',
    Resorpsi: 'bg-orange-500 text-white',
};

export default function RadiographPdf({
    detections,
    patient,
    qr_code,
    radiograph,
}: Props) {
    const byFdi = new Map(detections.map((item) => [item.no_fdi, item]));

    return (
        <>
            <Head title={`Laporan ${radiograph.id_radiograph}`} />
            <main className="min-h-screen bg-white p-10 text-[#17304A] print:p-6">
                <header className="flex items-start justify-between border-b-2 border-[#DDECF4] pb-6">
                    <div>
                        <p className="text-xs font-black tracking-[0.35em] text-[#13b8ff] uppercase">
                            Dentalyze AI
                        </p>
                        <h1 className="mt-2 text-3xl font-black">
                            Laporan Deteksi Radiograf
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {radiograph.id_radiograph}
                        </p>
                    </div>
                    <div className="print:hidden">
                        <button
                            className="rounded-lg bg-[#13b8ff] px-5 py-3 text-xs font-black text-white uppercase"
                            onClick={() => window.print()}
                            type="button"
                        >
                            Print
                        </button>
                        <a
                            className="ml-3 inline-flex rounded-lg bg-[#073d52] px-5 py-3 text-xs font-black text-white uppercase"
                            href={radiographReports.download.url(
                                radiograph.id_radiograph,
                            )}
                        >
                            Download PDF
                        </a>
                    </div>
                </header>

                <section className="mt-8 grid gap-6 md:grid-cols-2">
                    <Info
                        title="Informasi Pasien"
                        rows={[
                            ['Nama', patient.name ?? '-'],
                            ['NIK', patient.nik],
                            ['Telepon', patient.phone ?? '-'],
                            ['Email', patient.email ?? '-'],
                            [
                                'Usia',
                                patient.age ? `${patient.age} tahun` : '-',
                            ],
                            ['Alamat', patient.address ?? '-'],
                        ]}
                    />
                    <Info
                        title="Informasi Pemeriksaan"
                        rows={[
                            [
                                'Radiografer',
                                radiograph.radiographer_name ?? '-',
                            ],
                            ['Dokter pemeriksa', radiograph.doctor_name ?? '-'],
                            ['Tanggal upload', radiograph.created_at ?? '-'],
                            [
                                'Tanggal verifikasi',
                                radiograph.verified_at ?? '-',
                            ],
                            ['Status', radiograph.status],
                        ]}
                    />
                </section>

                <section className="mt-8 grid gap-6 md:grid-cols-2">
                    <ImageBlock
                        src={radiograph.image_url}
                        title="Radiograf Awal"
                    />
                    <ImageBlock
                        src={
                            radiograph.result_image_url ?? radiograph.image_url
                        }
                        title="Hasil AI + Bounding Box"
                    />
                </section>

                <section className="mt-8 rounded-2xl border border-[#DDECF4] p-5">
                    <h2 className="text-lg font-black">
                        Odontogram FDI dan Kelainan
                    </h2>
                    <div className="mt-4 space-y-3">
                        {fdiRows.map((row) => (
                            <div
                                className="flex flex-wrap justify-center gap-2"
                                key={row.join('-')}
                            >
                                {row.map((fdi) => {
                                    const item = byFdi.get(fdi);

                                    return (
                                        <span
                                            className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl text-[9px] font-black ${
                                                item
                                                    ? (conditionStyles[
                                                          item.abnormality
                                                      ] ??
                                                      conditionStyles.Normal)
                                                    : 'bg-slate-100 text-slate-300'
                                            }`}
                                            key={fdi}
                                        >
                                            <span className="text-sm">
                                                {fdi}
                                            </span>
                                            {item && (
                                                <span className="max-w-[48px] truncate">
                                                    {item.abnormality}
                                                </span>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="text-lg font-black">
                        Crop Gigi dan Catatan
                    </h2>
                    <table className="mt-4 w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="bg-[#EEF8FF] text-xs text-slate-500 uppercase">
                                <th className="border p-3">Crop</th>
                                <th className="border p-3">FDI</th>
                                <th className="border p-3">Kelainan</th>
                                <th className="border p-3">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detections.map((item) => (
                                <tr key={`${item.no_fdi}-${item.abnormality}`}>
                                    <td className="border p-3">
                                        {item.crop_image_url ? (
                                            <img
                                                alt={`Gigi ${item.no_fdi}`}
                                                className="size-20 rounded-lg object-cover"
                                                src={item.crop_image_url}
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="border p-3 font-black">
                                        {item.no_fdi}
                                    </td>
                                    <td className="border p-3">
                                        {item.abnormality}
                                    </td>
                                    <td className="border p-3">
                                        {item.analysis ?? '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <footer className="mt-10 flex justify-end">
                    <div className="text-center">
                        <p className="text-sm">
                            Surabaya, {radiograph.verified_at ?? '-'}
                        </p>
                        <p className="mt-3 text-sm">Dokter Pemeriksa,</p>
                        <img
                            alt="QR verifikasi dokumen"
                            className="mx-auto mt-3 size-32"
                            src={qr_code}
                        />
                        <p className="mt-2 font-black">
                            {radiograph.doctor_name ?? '-'}
                        </p>
                        <div className="mt-3 border-t border-[#17304A] pt-2 text-[10px] tracking-[0.22em] text-slate-400 uppercase">
                            Scan to verify original document
                        </div>
                        <p className="mt-2 max-w-56 text-[10px] break-all text-slate-400">
                            {radiograph.verification_url}
                        </p>
                    </div>
                </footer>
            </main>
        </>
    );
}

function ImageBlock({ src, title }: { src: string; title: string }) {
    return (
        <section>
            <h2 className="text-lg font-black">{title}</h2>
            <img
                alt={title}
                className="mt-4 max-h-[360px] w-full rounded-xl bg-black object-contain"
                src={src}
            />
        </section>
    );
}

function Info({ rows, title }: { rows: string[][]; title: string }) {
    return (
        <section className="rounded-xl border border-[#DDECF4] p-5">
            <h2 className="font-black">{title}</h2>
            <div className="mt-4 space-y-2 text-sm">
                {rows.map(([label, value]) => (
                    <p key={label}>
                        <span className="font-semibold text-slate-500">
                            {label}:{' '}
                        </span>
                        {value}
                    </p>
                ))}
            </div>
        </section>
    );
}

RadiographPdf.layout = null;
