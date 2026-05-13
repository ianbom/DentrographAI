import PlaceholderPage from '@/pages/_placeholder-page';
import radiographs from '@/routes/radiographs';

type RadiographsHistoryProps = {
    radiograph: string;
};

export default function RadiographsHistory() {
    return (
        <PlaceholderPage title="Riwayat Radiograph">
            ini halaman riwayat radiograph
        </PlaceholderPage>
    );
}

RadiographsHistory.layout = ({ radiograph }: RadiographsHistoryProps) => ({
    breadcrumbs: [
        {
            title: 'Radiographs',
            href: radiographs.index(),
        },
        {
            title: 'Riwayat Radiograph',
            href: radiographs.history(radiograph),
        },
    ],
});
