import PlaceholderPage from '@/pages/_placeholder-page';
import radiographs from '@/routes/radiographs';

export default function RadiographsIndex() {
    return (
        <PlaceholderPage title="Radiographs">
            ini halaman daftar radiograph
        </PlaceholderPage>
    );
}

RadiographsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Radiographs',
            href: radiographs.index(),
        },
    ],
};
