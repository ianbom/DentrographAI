import { Link } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    BriefcaseMedical,
    ChevronDown,
    Cross,
    GraduationCap,
    HeartPulse,
    Image as ImageIcon,
    LayoutDashboard,
    Plane,
    Search,
    Settings,
    ShieldCheck,
    Stethoscope,
    User,
    UserCog,
    Users,
    Wrench,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import patients from '@/routes/patients';
import radiographs from '@/routes/radiographs';
import users from '@/routes/users';
import verification from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

const railIcons = [
    GraduationCap,
    BarChart3,
    User,
    HeartPulse,
    Settings,
    Plane,
    Wrench,
    Stethoscope,
    BriefcaseMedical,
    ImageIcon,
];

const navGroups = [
    {
        label: 'Main Navigation',
        icon: Settings,
        children: [
            { label: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
            { label: 'Users', href: users.index(), icon: UserCog },
            { label: 'Patients', href: patients.index(), icon: Users },
            { label: 'Radiographs', href: radiographs.index(), icon: Activity },
            {
                label: 'Verification Tasks',
                href: verification.tasks(),
                icon: ShieldCheck,
            },
        ],
    },
];

function IconRail() {
    return (
        <aside className="hc-icon-rail">
            <div className="hc-logo-mark">
                <Cross size={14} strokeWidth={2.2} />
            </div>
            <div className="hc-rail-stack">
                {railIcons.map((Icon, index) => (
                    <button
                        aria-label={`Open module ${index + 1}`}
                        className={`hc-rail-button ${index === 3 ? 'is-active' : ''}`}
                        key={index}
                        type="button"
                    >
                        <Icon size={15} strokeWidth={2} />
                    </button>
                ))}
            </div>
        </aside>
    );
}

function Sidebar() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <aside className="hc-sidebar">
            <div className="hc-brand-row">
                <div className="hc-brand-pill">
                    <HeartPulse size={16} strokeWidth={2.1} />
                    <span>Health Care</span>
                </div>
                <button aria-label="Collapse sidebar" className="hc-collapse">
                    <ChevronDown size={13} strokeWidth={2} />
                </button>
            </div>

            <nav className="hc-nav">
                {navGroups.map((group) => {
                    const GroupIcon = group.icon;

                    return (
                        <div className="hc-nav-group" key={group.label}>
                            <div className="hc-nav-parent">
                                <GroupIcon size={14} strokeWidth={2} />
                                <span>{group.label}</span>
                            </div>
                            {group.children?.map((child) => {
                                const ChildIcon = child.icon;
                                const isActive = isCurrentUrl(child.href);

                                return (
                                    <Link
                                        className={`hc-nav-item ${isActive ? 'is-active' : ''}`}
                                        href={child.href}
                                        key={child.label}
                                        prefetch
                                    >
                                        <ChildIcon size={13} strokeWidth={2} />
                                        <span>{child.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>

            <div className="hc-profile-card">
                <MedicalIllustration />
                <h3>Apollo Hospital Ltd.</h3>
                <p>Call: +023 32034 44</p>
                <button type="button">Hospital Profile</button>
            </div>

            <button className="hc-settings-link" type="button">
                <Settings size={13} strokeWidth={2} />
                <span>Settings</span>
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
                    <IconRail />
                    <Sidebar />
                    <section className="hc-main-panel">
                        <Header title={title} />
                        <div className="hc-layout-slot">{children}</div>
                        <footer>
                            2019 Deviason.com | Designed by Mohnul Ahsan
                        </footer>
                    </section>
                </div>
            </div>
        </main>
    );
}
