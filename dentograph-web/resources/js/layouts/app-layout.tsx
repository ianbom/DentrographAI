import { Link, router } from '@inertiajs/react';
import {
    Activity,
    Camera,
    ChevronDown,
    ChevronRight,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Scan,
    ScanHeart,
    Search,
    Settings,
    ShieldCheck,
    Stethoscope,
    Users,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import patients from '@/routes/patients';
import radiographs from '@/routes/radiographs';
import users from '@/routes/users';
import verification from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import DetectionIndex from '@/pages/detection';

const navGroups = [
    {
        label: 'Main Navigation',
        icon: Settings,
        children: [
            { label: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
            { label: 'Deteksi Penyakit', href: "#", icon: Scan },
            { label: 'Data Radiografer', href: "#", icon: Camera },
            { label: 'Data Dokter', href: users.index(), icon: Stethoscope },
            { label: 'Data Pasien', href: patients.index(), icon: Users },
            { label: 'Riwayat Deteksi', href: "#", icon: Activity },
            { label: 'Tugas Verifikasi', href: verification.tasks(), icon: ShieldCheck, },
        ],
    },
];

function Sidebar() {
    const { isCurrentUrl } = useCurrentUrl();

    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`hc-sidebar ${collapsed ? 'is-collapsed' : ''
                }`}
        >
            <div className="hc-brand-row">
                <button
                    className="hc-brand-pill"
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
                    type="button"
                >
                    <ScanHeart
                        size={18}
                        strokeWidth={2.2}
                    />

                    {!collapsed && (
                        <span>DENTALYZE AI</span>
                    )}

                    <div className="hc-brand-arrow">
                        {collapsed ? (
                            <ChevronRight
                                size={14}
                                strokeWidth={2.5}
                            />
                        ) : (
                            <ChevronDown
                                size={14}
                                strokeWidth={2.5}
                            />
                        )}
                    </div>
                </button>
            </div>

            <nav className="hc-nav">
                {navGroups.map((group) =>
                    group.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isActive = isCurrentUrl(
                            child.href,
                        );

                        return (
                            <Link
                                className={`hc-nav-item ${isActive
                                    ? 'is-active'
                                    : ''
                                    }`}
                                href={child.href}
                                key={child.label}
                                prefetch
                            >
                                <ChildIcon
                                    size={16}
                                    strokeWidth={2}
                                />

                                <span>
                                    {child.label}
                                </span>
                            </Link>
                        );
                    }),
                )}
            </nav>

            <button
                className="hc-nav-item hc-logout-button"
                onClick={() => router.post('/logout')}
                type="button"
            >
                <LogOut
                    size={16}
                    strokeWidth={2}
                />

                <span>Logout</span>
            </button>
        </aside>
    );
}

function Header({ title }: { title: string }) {
    return (
        <header className="hc-content-header">
            <h1>{title}</h1>
            <label className="hc-search">
                <input aria-label="Search" placeholder="Search" />
                <Search size={14} strokeWidth={2} />
            </label>
            <img
                alt="Doctor profile"
                className="hc-avatar"
                src="https://i.pravatar.cc/96?img=47"
            />
        </header>
    );
}

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const title = breadcrumbs.at(-1)?.title ?? 'Departments';

    return (
        <main className="hc-root-layout">
            <div className="hc-dashboard-shell">
                <div className="hc-app-layout">
                    <Sidebar />
                    <section className="hc-main-panel">
                        <Header title={title} />
                        <div className="hc-layout-slot">{children}</div>
                        <footer>
                            © 2026 Dentalyze AI — AI Powered Dental Disease Detection and Analysis System. All rights reserved.
                        </footer>
                    </section>
                </div>
            </div>
        </main>
    );
}
