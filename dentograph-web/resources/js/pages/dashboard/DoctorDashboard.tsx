export default function DoctorDashboard({ stats }: any) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold">Panel Dokter</h3>
            <p>Ada {stats.needs_verification} hasil deteksi yang menunggu verifikasi Anda.</p>
        </div>
    );
}