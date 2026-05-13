import PlaceholderPage from '@/pages/_placeholder-page';
import patients from '@/routes/patients';

type PatientsHistoryProps = {
    patient: string;
};

export default function PatientsHistory() {
    return (
        <PlaceholderPage title="Riwayat Pasien">
            ini halaman riwayat pasien
        </PlaceholderPage>
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
            href: patients.history(patient),
        },
    ],
});
