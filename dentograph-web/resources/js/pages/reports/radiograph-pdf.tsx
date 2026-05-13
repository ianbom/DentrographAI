import PlaceholderPage from '@/pages/_placeholder-page';
import radiographReports from '@/routes/reports/radiographs';

type RadiographPdfProps = {
    radiograph: string;
};

export default function RadiographPdf() {
    return (
        <PlaceholderPage title="Laporan PDF">
            ini halaman laporan PDF
        </PlaceholderPage>
    );
}

RadiographPdf.layout = ({ radiograph }: RadiographPdfProps) => ({
    breadcrumbs: [
        {
            title: 'Laporan PDF',
            href: radiographReports.pdf(radiograph),
        },
    ],
});
