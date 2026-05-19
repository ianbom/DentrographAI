import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Tetap import untuk properti .layout
import AdminDashboard from './AdminDashboard';
import RadiographerDashboard from './RadiographerDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

export default function Dashboard(props: any) {
    const { role } = props;

    return (
        <>
            <Head title="Dashboard" />
            {role === 'admin' && <AdminDashboard {...props} />}
            {role === 'radiografer' && <RadiographerDashboard {...props} />}
            {role === 'dokter' && <DoctorDashboard {...props} />}
            {role === 'pasien' && <PatientDashboard {...props} />}
        </>
    );
}

Dashboard.layout = (page: any) => {
    const role =
        page?.props?.auth?.user?.role ??
        page?.props?.role;

    if (role === 'pasien') {
        return page;
    }

    return (
        <AppLayout>
            {page}
        </AppLayout>
    );
};