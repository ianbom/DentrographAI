import { Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    Camera,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Scan,
    ShieldCheck,
    Stethoscope,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import detection from '@/routes/detection';
import doctors from '@/routes/doctors';
import patients from '@/routes/patients';
import radiographers from '@/routes/radiographers';
import * as radiographHistory from '@/routes/radiographs/history';
import verification from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

const navItems = [
    {
        label: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
        roles: ['admin', 'radiografer', 'dokter'],
    },
    {
        label: 'Deteksi Penyakit',
        href: detection.index(),
        icon: Scan,
        roles: ['admin', 'radiografer', 'dokter'],
    },
    {
        label: 'Data Radiografer',
        href: radiographers.index(),
        icon: Camera,
        roles: ['admin'],
    },
    {
        label: 'Data Dokter',
        href: doctors.index(),
        icon: Stethoscope,
        roles: ['admin'],
    },
    {
        label: 'Data Pasien',
        href: patients.index(),
        icon: Users,
        roles: ['admin', 'radiografer', 'dokter'],
    },
    {
        label: 'Riwayat Deteksi',
        href: radiographHistory.index(),
        icon: Activity,
        roles: ['admin', 'radiografer', 'dokter'],
    },
    {
        label: 'Tugas Verifikasi',
        href: verification.tasks(),
        icon: ShieldCheck,
        roles: ['admin', 'dokter'],
    },
];

function Sidebar({ role }: { role: string }) {
    const { isCurrentOrParentUrl, isCurrentUrl } = useCurrentUrl();

    const [collapsed, setCollapsed] = useState(false);
    const visibleItems = navItems.filter((item) => item.roles.includes(role));

    return (
        <aside className={`hc-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
            <div className="hc-brand-row">
                <button
                    className="hc-brand-pill"
                    onClick={() => setCollapsed(!collapsed)}
                    type="button"
                >
                    <img
                        alt="Dentalyze AI"
                        className="hc-brand-logo"
                        src="/asset/images/logo.png"
                    />

                    {!collapsed && (
                        <span className="hc-brand-name">
                            DENTA<span>LYZE</span>
                        </span>
                    )}

                    <div className="hc-brand-arrow">
                        {collapsed ? (
                            <ChevronRight size={14} strokeWidth={2.5} />
                        ) : (
                            <ChevronDown size={14} strokeWidth={2.5} />
                        )}
                    </div>
                </button>
            </div>

            <nav className="hc-nav">
                {visibleItems.map((item) => {
                    const ItemIcon = item.icon;
                    const href =
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url;
                    const isActive =
                        href === '#'
                            ? isCurrentUrl(href)
                            : isCurrentOrParentUrl(href);

                    return (
                        <Link
                            className={`hc-nav-item ${
                                isActive ? 'is-active' : ''
                            }`}
                            href={item.href}
                            key={item.label}
                            prefetch
                        >
                            <ItemIcon size={16} strokeWidth={2} />

                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="hc-profile-card">
                <MedicalIllustration />

                <h3>Apollo Hospital Ltd.</h3>

                <p>Call: +023 32034 44</p>

                <button type="button">Hospital Profile</button>
            </div>

            <button
                className="hc-nav-item hc-logout-button"
                onClick={() => router.post('/logout')}
                type="button"
            >
                <LogOut size={16} strokeWidth={2} />

                <span>Logout</span>
            </button>
        </aside>
    );
}

function MedicalIllustration() {
    return (
        <svg
            aria-hidden="true"
            className="hc-medical-illustration"
            viewBox="0 0 180 122"
        >
            <defs>
                <linearGradient id="ill-bg" x1="0" x2="1" y1="0" y2="1">
                    <stop stopColor="#E9F6FF" />
                    <stop offset="1" stopColor="#D8EBFF" />
                </linearGradient>
                <linearGradient id="ill-heart" x1="0" x2="1" y1="0" y2="1">
                    <stop stopColor="#13B8FF" />
                    <stop offset="1" stopColor="#0878E8" />
                </linearGradient>
            </defs>
            <path
                d="M22 84C14 57 33 22 70 17c42-6 82 9 94 41 9 26-12 44-47 49-43 7-84 8-95-23Z"
                fill="url(#ill-bg)"
            />
            <path d="M32 93h116" stroke="#C8DDF3" strokeLinecap="round" />
            <path d="M51 43h14v45H51z" fill="#FFFFFF" />
            <path d="M118 47h13v41h-13z" fill="#FFFFFF" />
            <circle cx="58" cy="36" fill="#26345F" r="8" />
            <circle cx="124" cy="40" fill="#26345F" r="7" />
            <path d="M44 58h28l-5 36H49z" fill="#FFFFFF" />
            <path d="M112 60h26l-5 34h-17z" fill="#FFFFFF" />
            <path d="M53 58h10v37H53z" fill="#1599F5" opacity=".22" />
            <path d="M122 60h8v34h-8z" fill="#FF9A5C" opacity=".24" />
            <path
                d="M83 34c9-13 28-5 28 10 0 18-28 30-28 30S55 62 55 44c0-15 19-23 28-10Z"
                fill="url(#ill-heart)"
            />
            <path
                d="M70 52h9l4-10 7 19 5-9h9"
                fill="none"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
            />
            <path d="M46 94h10l2-32h-8z" fill="#25345D" />
            <path d="M64 94h10l-8-32h-7z" fill="#25345D" />
            <path d="M116 94h9l1-29h-8z" fill="#25345D" />
            <path d="M132 94h9l-8-29h-7z" fill="#25345D" />
            <path d="M37 70c-12 4-16 12-13 23" stroke="#9DC9F8" />
            <path d="M151 68c12 3 17 11 15 24" stroke="#9DC9F8" />
        </svg>
    );
}

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { auth } = usePage().props as {
        auth?: { user?: { role?: string } };
    };
    const role = auth?.user?.role ?? 'admin';

    return (
        <main className="hc-root-layout">
            <div className="hc-dashboard-shell">
                <div className="hc-app-layout">
                    <Sidebar role={role} />
                    <section className="hc-main-panel">
                        <div className="hc-layout-slot">{children}</div>
                        <footer>
                            © 2026 Dentalyze AI — AI Powered Dental Disease
                            Detection and Analysis System. All rights reserved.
                        </footer>
                    </section>
                </div>
            </div>
        </main>
    );
}
