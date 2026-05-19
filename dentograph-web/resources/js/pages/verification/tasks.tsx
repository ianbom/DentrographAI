import { Head, Link } from '@inertiajs/react';
import { Activity, Clock, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import radiographs from '@/routes/radiographs';
import verification from '@/routes/verification';

type VerificationTask = {
    id_radiograph: string;
    patient_name: string;
    patient_nik: string;
    radiographer_name: string | null;
    image_url: string;
    status: string;
    created_at: string | null;
};

type Props = {
    tasks: VerificationTask[];
    filters: { total: number };
    permissions: { verify: boolean };
};

export default function VerificationTasks({
    filters,
    permissions,
    tasks,
}: Props) {
    const [search, setSearch] = useState('');

    const visibleTasks = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return tasks;
        }

        return tasks.filter((item) =>
            [
                item.id_radiograph,
                item.patient_name,
                item.patient_nik,
                item.radiographer_name ?? '',
            ].some((value) => value.toLowerCase().includes(query)),
        );
    }, [search, tasks]);

    return (
        <>
            <Head title="Tugas Verifikasi" />
            <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#eef8ff_0%,#edf8ff_35%,#f7fbff_100%)] p-4 shadow-[0_28px_70px_rgba(19,184,255,0.08)] sm:p-6">
                <section className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-[24px] bg-[linear-gradient(135deg,#20b9ff_0%,#0878e8_100%)] p-5 text-white shadow-[0_24px_55px_rgba(8,120,232,0.22)]">
                        <p className="text-[11px] font-black tracking-[0.28em] text-white/75 uppercase">
                            Menunggu Verifikasi
                        </p>
                        <strong className="mt-3 block text-[40px] leading-none font-black">
                            {filters.total}
                        </strong>
                    </article>
                    <article className="rounded-[24px] border border-white/70 bg-white/40 p-5 shadow-[0_18px_45px_rgba(19,184,255,0.08)] backdrop-blur-md md:col-span-2">
                        <p className="text-[11px] font-black tracking-[0.28em] text-[#9ea6b6] uppercase">
                            Tugas Dokter
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[#7B8BA7]">
                            Radiograf dengan status menunggu akan muncul di
                            sini. Buka detail untuk menjalankan deteksi,
                            mengoreksi odontogram, lalu menyimpan hasil final.
                        </p>
                    </article>
                </section>

                <section className="mt-6 overflow-hidden rounded-[30px] border border-white/70 bg-white/35 shadow-[0_24px_55px_rgba(19,184,255,0.1)] backdrop-blur-md">
                    <div className="flex flex-col gap-4 border-b border-white/60 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-[11px] font-black tracking-[0.42em] text-[#49ddd7] uppercase">
                                DAFTAR TUGAS
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[#0878e8]">
                                Verifikasi Deteksi Penyakit
                            </h2>
                        </div>
                        <label className="flex h-12 min-w-0 items-center gap-2 rounded-[14px] border border-white/70 bg-white/45 px-4 text-[#7B8BA7] shadow-sm backdrop-blur-md sm:w-80">
                            <Search size={16} />
                            <input
                                className="min-w-0 flex-1 bg-transparent text-sm text-[#22304F] outline-none"
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari tugas"
                                value={search}
                            />
                        </label>
                    </div>

                    {!permissions.verify && (
                        <p className="m-5 rounded-[20px] border border-white/70 bg-white/45 p-5 text-sm text-[#7B8BA7]">
                            Akun ini tidak memiliki akses verifikasi.
                        </p>
                    )}

                    {permissions.verify && visibleTasks.length === 0 && (
                        <p className="m-5 rounded-[20px] border border-white/70 bg-white/45 p-5 text-sm text-[#7B8BA7]">
                            Tidak ada radiograf yang menunggu verifikasi.
                        </p>
                    )}

                    <div className="divide-y divide-white/60">
                        {visibleTasks.map((item) => (
                            <Link
                                className="grid gap-4 p-5 text-sm text-[#526184] transition hover:bg-white/45 lg:grid-cols-[1fr_auto]"
                                href={radiographs.show(item.id_radiograph)}
                                key={item.id_radiograph}
                                prefetch
                            >
                                <div className="flex gap-4">
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
                                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-600 uppercase">
                                            <Clock size={12} /> Menunggu
                                        </span>
                                        <p className="mt-2 text-xs">
                                            Radiografer:{' '}
                                            {item.radiographer_name ?? '-'}
                                        </p>
                                        <p className="text-xs">
                                            Upload: {item.created_at ?? '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#073d52] px-5 text-xs font-black text-white uppercase">
                                        <Activity size={16} /> Buka Detail
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

VerificationTasks.layout = {
    breadcrumbs: [
        {
            title: 'Tugas Verifikasi',
            href: verification.tasks(),
        },
    ],
};
