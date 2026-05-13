import PlaceholderPage from '@/pages/_placeholder-page';
import patients from '@/routes/patients';

export default function PatientsIndex() {
    return (
        <PlaceholderPage title="Pasien">
            ini halaman daftar pasien
        </PlaceholderPage>
    );
}

PatientsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Pasien',
            href: patients.index(),
        },
    ],
};
