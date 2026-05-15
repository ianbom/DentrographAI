import PlaceholderPage from '@/pages/_placeholder-page';
import patients from '@/routes/patients';
import PatientsIndex from '../patients';

export default function DetectionIndex() {
    return (
        <PlaceholderPage title="Deteksi Penyakit">
            ini halaman deteksi penyakit
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
