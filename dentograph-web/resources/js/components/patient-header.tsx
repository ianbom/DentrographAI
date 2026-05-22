import { Link } from '@inertiajs/react';
import { logout, dashboard } from '@/routes';
import { edit as editProfile } from '@/routes/profile';

type PatientHeaderProps = {
    localAnchors?: boolean;
};

export default function PatientHeader({
    localAnchors = false,
}: PatientHeaderProps) {
    const dashboardUrl = dashboard.url();
    const anchorHref = (hash: string) =>
        localAnchors ? `#${hash}` : `${dashboardUrl}#${hash}`;

    return (
        <header className="fixed top-0 left-0 right-0 z-[999] border-b border-white/30 bg-white/10 px-8 py-5 backdrop-blur-xl lg:px-14">
            <div className="mx-auto flex w-full max-w-[1440px] items-center">
                {/* LEFT */}
                <div className="flex flex-1">
                    <a
                        href={localAnchors ? '#top' : dashboardUrl}
                        className="flex items-center gap-1"
                    >
                        <img
                            src="/asset/images/logo.png"
                            alt="Dentalyze AI"
                            className="h-11 w-11 object-contain"
                        />

                        <div className="text-2xl font-black tracking-tight text-[#1aa0ff] lg:text-[34px]">
                            DENTA
                            <span className="text-[#187df0]">LYZE</span>
                        </div>
                    </a>
                </div>

                {/* CENTER */}
                <nav className="hidden items-center justify-center gap-16 text-[11px] font-black tracking-[0.28em] text-[#98a3b5] uppercase lg:flex">
                    <a
                        href={anchorHref('riwayat')}
                        className="transition hover:text-[#13b8ff]"
                    >
                        Riwayat
                    </a>

                    <a
                        href={anchorHref('insight')}
                        className="transition hover:text-[#13b8ff]"
                    >
                        Insight
                    </a>

                    <a
                        href={anchorHref('contact')}
                        className="transition hover:text-[#13b8ff]"
                    >
                        Contact Us
                    </a>
                </nav>

                {/* RIGHT */}
                <div className="flex flex-1 justify-end items-center gap-4">
                    <Link
                        href={editProfile()}
                        className="rounded-[12px] bg-[#49ddd7] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:scale-105"
                    >
                        Profile
                    </Link>

                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className="rounded-[12px] bg-[#ef4444] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:scale-105"
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </header>
    );
}
