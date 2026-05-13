import PlaceholderPage from '@/pages/_placeholder-page';
import patients from '@/routes/patients';

type PatientsEditProps = {
    patient: string;
};

export default function PatientsEdit() {
    return (
        <PlaceholderPage title="Edit Pasien">
            ini halaman edit pasien
        </PlaceholderPage>
    );
}

PatientsEdit.layout = ({ patient }: PatientsEditProps) => ({
    breadcrumbs: [
        {
            title: 'Pasien',
            href: patients.index(),
        },
        {
            title: 'Edit Pasien',
            href: patients.edit(patient),
        },
    ],
});
