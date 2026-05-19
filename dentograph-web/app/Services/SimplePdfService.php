<?php

namespace App\Services;

use Illuminate\Support\Str;

class SimplePdfService
{
    /**
     * @param  array<int, array<string, mixed>>  $detections
     */
    public function radiographReport(array $report): string
    {
        $patient = $report['patient'];
        $radiograph = $report['radiograph'];
        $detections = $report['detections']->all();

        $pages = [
            [
                ['text', 50, 792, 'Dentalyze AI - Laporan Deteksi Radiograf', 18, true],
                ['text', 50, 764, $radiograph['id_radiograph'], 11, false],
                ['text', 50, 726, 'Informasi Pasien', 14, true],
                ['text', 50, 704, 'Nama: '.($patient['name'] ?? '-'), 10, false],
                ['text', 50, 688, 'NIK: '.$patient['nik'], 10, false],
                ['text', 50, 672, 'Telepon: '.($patient['phone'] ?? '-'), 10, false],
                ['text', 50, 656, 'Email: '.($patient['email'] ?? '-'), 10, false],
                ['text', 50, 640, 'Usia: '.($patient['age'] ? $patient['age'].' tahun' : '-'), 10, false],
                ['text', 310, 726, 'Informasi Pemeriksaan', 14, true],
                ['text', 310, 704, 'Radiografer: '.($radiograph['radiographer_name'] ?? '-'), 10, false],
                ['text', 310, 688, 'Dokter: '.($radiograph['doctor_name'] ?? '-'), 10, false],
                ['text', 310, 672, 'Tanggal Verifikasi: '.($radiograph['verified_at'] ?? '-'), 10, false],
                ['text', 310, 656, 'Status: '.$radiograph['status'], 10, false],
                ['text', 50, 610, 'Radiograf Awal', 14, true],
                ['image', 50, 360, 500, 225, $radiograph['image_path'] ?? null],
                ['text', 50, 326, 'Hasil AI + Bounding Box', 14, true],
                ['image', 50, 76, 500, 225, $radiograph['result_image_path'] ?? null],
            ],
            [
                ['text', 50, 792, 'Odontogram dan Catatan Per Gigi', 18, true],
                ...$this->detectionRows($detections),
                ['text', 330, 132, 'Dokter Pemeriksa,', 11, false],
                ['text', 330, 104, $radiograph['doctor_name'] ?? '-', 12, true],
                ['text', 330, 76, 'Verifikasi Dokumen:', 10, false],
                ['text', 330, 60, $radiograph['verification_url'] ?? '-', 8, false],
                ['rect', 330, 158, 88, 88],
                ['text', 348, 202, 'SCAN', 16, true],
                ['text', 338, 188, 'VERIFY', 11, true],
            ],
        ];

        return $this->build($pages);
    }

    /**
     * @param  array<int, array<string, mixed>>  $detections
     * @return array<int, array<int, mixed>>
     */
    private function detectionRows(array $detections): array
    {
        $rows = [
            ['text', 50, 758, 'FDI', 10, true],
            ['text', 95, 758, 'Kelainan', 10, true],
            ['text', 220, 758, 'Catatan', 10, true],
        ];
        $y = 738;

        foreach (array_slice($detections, 0, 30) as $detection) {
            $rows[] = ['text', 50, $y, (string) $detection['no_fdi'], 9, false];
            $rows[] = ['text', 95, $y, (string) $detection['abnormality'], 9, false];
            $rows[] = ['text', 220, $y, Str::limit((string) ($detection['analysis'] ?? '-'), 70), 9, false];
            $y -= 20;
        }

        return $rows;
    }

    /**
     * @param  array<int, array<int, array<int, mixed>>>  $pages
     */
    private function build(array $pages): string
    {
        $objects = [];
        $pageObjectNumbers = [];
        $fontObject = 3;
        $nextObject = 4;

        $objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
        $objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

        foreach ($pages as $page) {
            $content = '';
            $xobjects = [];

            foreach ($page as $command) {
                if ($command[0] === 'text') {
                    [, $x, $y, $text, $size, $bold] = $command;
                    $content .= sprintf(
                        "BT /F1 %d Tf %d %d Td (%s) Tj ET\n",
                        $bold ? $size + 1 : $size,
                        $x,
                        $y,
                        $this->escape((string) $text),
                    );
                }

                if ($command[0] === 'rect') {
                    [, $x, $y, $w, $h] = $command;
                    $content .= sprintf("%d %d %d %d re S\n", $x, $y, $w, $h);
                }

                if ($command[0] === 'image' && filled($command[5]) && is_file($command[5])) {
                    [, $x, $y, $w, $h, $path] = $command;
                    $name = 'Im'.count($xobjects);
                    $imageObject = $nextObject++;
                    $xobjects[$name] = $imageObject;
                    $objects[$imageObject] = $this->imageObject($path);
                    $content .= sprintf("q %d 0 0 %d %d %d cm /%s Do Q\n", $w, $h, $x, $y, $name);
                }
            }

            $contentObject = $nextObject++;
            $pageObject = $nextObject++;
            $pageObjectNumbers[] = $pageObject;
            $objects[$contentObject] = '<< /Length '.strlen($content)." >>\nstream\n".$content.'endstream';
            $xobjectDictionary = collect($xobjects)
                ->map(fn (int $object, string $name): string => "/{$name} {$object} 0 R")
                ->implode(' ');
            $objects[$pageObject] = sprintf(
                '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 %d 0 R >> /XObject << %s >> >> /Contents %d 0 R >>',
                $fontObject,
                $xobjectDictionary,
                $contentObject,
            );
        }

        $objects[2] = '<< /Type /Pages /Kids ['.collect($pageObjectNumbers)->map(fn (int $object): string => "{$object} 0 R")->implode(' ').'] /Count '.count($pageObjectNumbers).' >>';
        ksort($objects);

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $number => $body) {
            $offsets[$number] = strlen($pdf);
            $pdf .= "{$number} 0 obj\n{$body}\nendobj\n";
        }

        $xref = strlen($pdf);
        $pdf .= "xref\n0 ".(count($objects) + 1)."\n0000000000 65535 f \n";

        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }

        return $pdf."trailer\n<< /Size ".(count($objects) + 1)." /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";
    }

    private function imageObject(string $path): string
    {
        $info = getimagesize($path);
        $jpeg = $this->jpegBytes($path, $info[2] ?? null);
        [$width, $height] = getimagesizefromstring($jpeg);

        return "<< /Type /XObject /Subtype /Image /Width {$width} /Height {$height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ".strlen($jpeg)." >>\nstream\n".$jpeg."\nendstream";
    }

    private function jpegBytes(string $path, ?int $type): string
    {
        if ($type === IMAGETYPE_JPEG) {
            return file_get_contents($path);
        }

        $image = imagecreatefromstring(file_get_contents($path));
        ob_start();
        imagejpeg($image, null, 86);
        imagedestroy($image);

        return ob_get_clean();
    }

    private function escape(string $text): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\(', '\)'], $text);
    }
}
