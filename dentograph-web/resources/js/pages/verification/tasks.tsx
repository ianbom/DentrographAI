import PlaceholderPage from '@/pages/_placeholder-page';
import verification from '@/routes/verification';

export default function VerificationTasks() {
    return (
        <PlaceholderPage title="Tugas Verifikasi">
            ini halaman tugas verifikasi
        </PlaceholderPage>
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
