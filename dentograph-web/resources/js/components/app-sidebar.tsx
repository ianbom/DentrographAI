import { Link } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    ClipboardCheck,
    FileText,
    FolderGit2,
    History,
    LayoutGrid,
    Plus,
    ShieldCheck,
    User,
    UserCog,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import patients from '@/routes/patients';
import publicRoutes from '@/routes/public';
import radiographs from '@/routes/radiographs';
import reportsRadiographs from '@/routes/reports/radiographs';
import users from '@/routes/users';
import verification from '@/routes/verification';
import type { NavItem } from '@/types';

const sampleUser = '1';
const samplePatient = 'PATIENT-001';
const sampleRadiograph = 'RAD-TEST-001';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: users.index(),
        icon: UserCog,
        children: [
            {
                title: 'Daftar User',
                href: users.index(),
                icon: Users,
            },
            {
                title: 'Tambah User',
                href: users.create(),
                icon: Plus,
            },
            {
                title: 'Detail User',
                href: users.show(sampleUser),
                icon: User,
            },
            {
                title: 'Edit User',
                href: users.edit(sampleUser),
                icon: UserCog,
            },
        ],
    },
    {
        title: 'Pasien',
        href: patients.index(),
        icon: Users,
        children: [
            {
                title: 'Daftar Pasien',
                href: patients.index(),
                icon: Users,
            },
            {
                title: 'Tambah Pasien',
                href: patients.create(),
                icon: Plus,
            },
            {
                title: 'Detail Pasien',
                href: patients.show(samplePatient),
                icon: User,
            },
            {
                title: 'Edit Pasien',
                href: patients.edit(samplePatient),
                icon: UserCog,
            },
            {
                title: 'Riwayat Pasien',
                href: patients.history(samplePatient),
                icon: History,
            },
        ],
    },
    {
        title: 'Radiograph',
        href: radiographs.index(),
        icon: Activity,
        children: [
            {
                title: 'Daftar Radiograph',
                href: radiographs.index(),
                icon: Activity,
            },
            {
                title: 'Tambah Deteksi',
                href: radiographs.create(),
                icon: Plus,
            },
            {
                title: 'Detail Deteksi',
                href: radiographs.show(sampleRadiograph),
                icon: ClipboardCheck,
            },
            {
                title: 'Riwayat Radiograph',
                href: radiographs.history(sampleRadiograph),
                icon: History,
            },
        ],
    },
    {
        title: 'Verifikasi',
        href: verification.tasks(),
        icon: ShieldCheck,
    },
    {
        title: 'Laporan PDF',
        href: reportsRadiographs.pdf(sampleRadiograph),
        icon: FileText,
    },
    {
        title: 'Verifikasi Publik',
        href: publicRoutes.verify(sampleRadiograph),
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
