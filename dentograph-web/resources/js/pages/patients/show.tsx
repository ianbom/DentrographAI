import PlaceholderPage from '@/pages/_placeholder-page';
import patients from '@/routes/patients';

type PatientsShowProps = {
    patient: string;
};

export default function PatientsShow() {
    return (
        <PlaceholderPage title="Detail Pasien">
            ini halaman detail pasien
        </PlaceholderPage>
    );
}

PatientsShow.layout = ({ patient }: PatientsShowProps) => ({
    breadcrumbs: [
        {
            title: 'Pasien',
            href: patients.index(),
        },
        {
            title: 'Detail Pasien',
            href: patients.show(patient),
        },
    ],
});
