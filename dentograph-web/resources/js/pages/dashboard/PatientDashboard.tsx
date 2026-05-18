import { Activity, Clock, FileText, ShieldCheck } from 'lucide-react';

export default function PatientDashboard({ user }: any) {
    return (
        <>
            <div className="hc-primary-column">
                <section className="hc-card p-8">
                    <h2 className="text-2xl font-bold">Halo, {user.name}! 👋</h2>
                    <p className="text-gray-500 mt-2">NIK: {user.patient?.nik}</p>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <h4 className="font-semibold text-blue-700">Status Pemeriksaan</h4>
                            <p className="text-sm mt-1">Anda memiliki hasil deteksi terbaru.</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                            <h4 className="font-semibold text-green-700">Terakhir Konsultasi</h4>
                            <p className="text-sm mt-1">15 Mei 2026 - drg. Siti Aminah</p>
                        </div>
                    </div>
                </section>
                
                {/* Tabel riwayat singkat untuk pasien */}
                <section className="hc-card mt-6">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold">Riwayat Deteksi Terakhir</h3>
                    </div>
                    <div className="p-6 text-center text-gray-400">
                        Belum ada riwayat deteksi.
                    </div>
                </section>
            </div>

            <aside className="hc-right-column">
                <article className="hc-kpi-card is-mint">
                    <div className="hc-kpi-icon"><ShieldCheck size={21} /></div>
                    <p>Status Gigi</p>
                    <strong>Sehat</strong>
                </article>
                <article className="hc-kpi-card is-orange mt-4">
                    <div className="hc-kpi-icon"><Activity size={21} /></div>
                    <p>Skor Kebersihan</p>
                    <strong>85%</strong>
                </article>
            </aside>
        </>
    );
}