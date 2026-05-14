import { Head } from '@inertiajs/react';
import {
    Activity,
    BriefcaseMedical,
    ChevronDown,
    User,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';

const kpis = [
    {
        label: 'Number of Departments',
        value: '05',
        icon: BriefcaseMedical,
        tone: 'mint',
    },
    { label: 'Total Patient', value: '12903', icon: Users, tone: 'violet' },
    {
        label: 'Av. Patient per Department',
        value: '32',
        icon: Activity,
        tone: 'orange',
    },
    {
        label: 'Av. Doctors per Department',
        value: '12',
        icon: User,
        tone: 'active',
    },
];

const departments = [
    ['Orthopedics', '126', '50', '$39493.90', '15 (29%)', 29],
    ['Dermetology', '203', '76', '$28390.00', '29 (69%)', 69],
    ['Surgery', '102', '45', '$83944.92', '10 (59%)', 59],
    ['Cardiology', '99', '32', '$29490.32', '5 (48%)', 48],
    ['Nurology', '87', '27', '$30293.93', '8 (45%)', 45],
];

const legend = [
    ['Orthopedics', '#49E1DA'],
    ['Cardiology', '#1599F5'],
    ['Surgery', '#8B78F6'],
    ['Dermetology', '#FF9A5C'],
    ['Nurology', '#FF7C9B'],
];

function OverviewChart() {
    return (
        <section className="hc-card hc-overview-card">
            <div className="hc-card-title-row">
                <div>
                    <h2>Overview</h2>
                    <div className="hc-chart-legend">
                        <span>
                            <i className="is-blue" />
                            Av. Cost
                        </span>
                        <span>
                            <i className="is-cyan" />
                            #Patient Admissions
                        </span>
                    </div>
                </div>
            </div>
            <div className="hc-chart-wrap">
                <svg
                    aria-label="Department overview chart"
                    role="img"
                    viewBox="0 0 640 246"
                >
                    <defs>
                        <linearGradient
                            id="blue-fill"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                        >
                            <stop stopColor="#1599F5" stopOpacity=".2" />
                            <stop
                                offset="1"
                                stopColor="#1599F5"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="cyan-fill"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                        >
                            <stop stopColor="#49E1DA" stopOpacity=".18" />
                            <stop
                                offset="1"
                                stopColor="#49E1DA"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <filter
                            id="line-shadow"
                            x="-8%"
                            y="-20%"
                            width="116%"
                            height="150%"
                        >
                            <feDropShadow
                                dx="0"
                                dy="7"
                                floodColor="#1599F5"
                                floodOpacity=".18"
                                stdDeviation="5"
                            />
                        </filter>
                    </defs>
                    {[30, 63, 96, 129, 162, 195].map((y) => (
                        <line
                            className="hc-grid-line"
                            key={y}
                            x1="44"
                            x2="604"
                            y1={y}
                            y2={y}
                        />
                    ))}
                    <rect
                        className="hc-selected-band"
                        height="170"
                        rx="3"
                        width="22"
                        x="333"
                        y="31"
                    />
                    <line
                        className="hc-selected-line"
                        x1="344"
                        x2="344"
                        y1="31"
                        y2="203"
                    />
                    <path
                        d="M50 191 C90 100 134 92 178 92 C224 92 238 111 284 97 C322 86 321 66 344 76 C372 88 381 45 432 41 C482 37 493 55 534 47 C568 42 586 26 602 23"
                        fill="none"
                        filter="url(#line-shadow)"
                        stroke="#1599F5"
                        strokeLinecap="round"
                        strokeWidth="4"
                    />
                    <path
                        d="M50 191 C90 100 134 92 178 92 C224 92 238 111 284 97 C322 86 321 66 344 76 C372 88 381 45 432 41 C482 37 493 55 534 47 C568 42 586 26 602 23 L602 207 L50 207Z"
                        fill="url(#blue-fill)"
                    />
                    <path
                        d="M50 197 C87 133 128 124 174 128 C217 132 244 151 286 144 C321 138 325 133 344 145 C382 168 400 143 446 130 C492 117 506 137 548 127 C579 120 590 96 604 83"
                        fill="none"
                        stroke="#49E1DA"
                        strokeLinecap="round"
                        strokeWidth="4"
                    />
                    <path
                        d="M50 197 C87 133 128 124 174 128 C217 132 244 151 286 144 C321 138 325 133 344 145 C382 168 400 143 446 130 C492 117 506 137 548 127 C579 120 590 96 604 83 L604 207 L50 207Z"
                        fill="url(#cyan-fill)"
                    />
                    <circle
                        cx="344"
                        cy="76"
                        fill="#FFFFFF"
                        r="7"
                        stroke="#1599F5"
                        strokeWidth="4"
                    />
                    <circle
                        cx="344"
                        cy="145"
                        fill="#FFFFFF"
                        r="7"
                        stroke="#49E1DA"
                        strokeWidth="4"
                    />
                    {[
                        '12-05',
                        '13-05',
                        '14-05',
                        '15-05',
                        '16-05',
                        '17-05',
                        '18-05',
                    ].map((label, index) => (
                        <text
                            className="hc-axis-label"
                            key={label}
                            x={54 + index * 91}
                            y="228"
                        >
                            {label}
                        </text>
                    ))}
                    {['0', '1k', '2k', '3k', '4k', '5k', '6k'].map(
                        (label, index) => (
                            <text
                                className="hc-axis-label"
                                key={label}
                                x="18"
                                y={204 - index * 29}
                            >
                                {label}
                            </text>
                        ),
                    )}
                </svg>
                <div className="hc-chart-tooltip">
                    <strong>15-May-2019</strong>
                    <span>
                        <i className="is-blue" />
                        Av. Cost: $3201
                    </span>
                    <span>
                        <i className="is-cyan" />
                        #Patient Admitted: 52
                    </span>
                </div>
            </div>
        </section>
    );
}

function KpiGrid() {
    return (
        <section className="hc-kpi-grid">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;

                return (
                    <article
                        className={`hc-kpi-card is-${kpi.tone}`}
                        key={kpi.label}
                    >
                        <div className="hc-kpi-icon">
                            <Icon size={21} strokeWidth={2} />
                        </div>
                        <p>{kpi.label}</p>
                        <strong>{kpi.value}</strong>
                    </article>
                );
            })}
        </section>
    );
}

function DepartmentTable() {
    return (
        <section className="hc-card hc-table-card">
            <div className="hc-table-header">
                <h2>Department Overview</h2>
                <button type="button">
                    Sort by
                    <ChevronDown size={12} strokeWidth={2} />
                </button>
            </div>
            <div className="hc-table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Diagnosis Name</th>
                            <th># Patients</th>
                            <th>#Manpower</th>
                            <th>Avg. Cost</th>
                            <th>Avg. Days Admitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(
                            (
                                [
                                    name,
                                    patients,
                                    manpower,
                                    cost,
                                    days,
                                    progress,
                                ],
                                index,
                            ) => (
                                <tr
                                    className={
                                        index === 1 ? 'is-highlighted' : ''
                                    }
                                    key={name}
                                >
                                    <td>{name}</td>
                                    <td>{patients}</td>
                                    <td>{manpower}</td>
                                    <td>{cost}</td>
                                    <td>
                                        <span className="hc-days-cell">
                                            <span className="hc-mini-bar">
                                                <span
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </span>
                                            {days}
                                        </span>
                                    </td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function DonutCard() {
    return (
        <section className="hc-card hc-donut-card">
            <h2>Admission by Division</h2>
            <div className="hc-donut-wrap">
                <svg
                    aria-label="Admission by division"
                    role="img"
                    viewBox="0 0 210 210"
                >
                    <circle
                        cx="105"
                        cy="105"
                        fill="none"
                        r="69"
                        stroke="#F0F5FB"
                        strokeWidth="15"
                    />
                    <circle
                        className="hc-donut-segment"
                        cx="105"
                        cy="105"
                        fill="none"
                        r="69"
                        stroke="#49E1DA"
                        strokeDasharray="102 332"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        strokeWidth="15"
                    />
                    <circle
                        className="hc-donut-segment"
                        cx="105"
                        cy="105"
                        fill="none"
                        r="69"
                        stroke="#1599F5"
                        strokeDasharray="60 374"
                        strokeDashoffset="-120"
                        strokeLinecap="round"
                        strokeWidth="15"
                    />
                    <circle
                        className="hc-donut-segment"
                        cx="105"
                        cy="105"
                        fill="none"
                        r="69"
                        stroke="#8B78F6"
                        strokeDasharray="132 302"
                        strokeDashoffset="-196"
                        strokeLinecap="round"
                        strokeWidth="15"
                    />
                    <circle
                        className="hc-donut-segment"
                        cx="105"
                        cy="105"
                        fill="none"
                        r="69"
                        stroke="#FF9A5C"
                        strokeDasharray="48 386"
                        strokeDashoffset="-348"
                        strokeLinecap="round"
                        strokeWidth="15"
                    />
                    <circle
                        className="hc-donut-segment"
                        cx="105"
                        cy="105"
                        fill="none"
                        r="69"
                        stroke="#FF7C9B"
                        strokeDasharray="44 390"
                        strokeDashoffset="-412"
                        strokeLinecap="round"
                        strokeWidth="15"
                    />
                </svg>
                <div className="hc-donut-center">
                    <strong>930</strong>
                    <span>Total Patients</span>
                </div>
                <div className="hc-donut-tooltip">
                    <i />
                    26% Orthopology
                </div>
            </div>
            <div className="hc-donut-legend">
                {legend.map(([label, color]) => (
                    <span key={label}>
                        <i style={{ backgroundColor: color }} />
                        {label}
                    </span>
                ))}
            </div>
        </section>
    );
}

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="hc-content-layout">
                <div className="hc-primary-column">
                    <OverviewChart />
                    <DepartmentTable />
                </div>
                <aside className="hc-right-column">
                    <KpiGrid />
                    <DonutCard />
                </aside>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Departments',
            href: dashboard(),
        },
    ],
};
