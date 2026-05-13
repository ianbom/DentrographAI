import PlaceholderPage from '@/pages/_placeholder-page';
import patients from '@/routes/patients';

export default function PatientsCreate() {
    return (
        <PlaceholderPage title="Tambah Pasien">
            ini halaman tambah pasien
        </PlaceholderPage>
    );
}

PatientsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Pasien',
            href: patients.index(),
        },
        {
            title: 'Tambah Pasien',
            href: patients.create(),
        },
    ],
};
