<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class SimplePdfService
{
    /**
     * @param  array<string, mixed>  $report
     */
    public function radiographReport(array $report): string
    {
        $patient = $report['patient'];
        $radiograph = $report['radiograph'];
        $detections = $report['detections']
            ->where('is_active', true)
            ->values();
        $abnormalDetections = $detections
            ->filter(fn (array $detection): bool => strcasecmp(trim((string) ($detection['abnormality'] ?? '')), 'Normal') !== 0)
            ->values();
        $missingTeethCount = max(32 - $detections->pluck('no_fdi')->unique()->count(), 0);
        $conditionCounts = $this->conditionCounts($detections);
        $qrCodePath = $report['qr_code_path'] ?? null;

        $pages = [
            $this->coverPage($patient, $radiograph, $abnormalDetections->count(), $missingTeethCount),
            $this->resultPage($radiograph, $abnormalDetections, $missingTeethCount, $conditionCounts, $qrCodePath),
        ];

        return $this->build($pages);
    }

    /**
     * @param  array<string, mixed>  $patient
     * @param  array<string, mixed>  $radiograph
     * @return array<int, array<int, mixed>>
     */
    private function coverPage(array $patient, array $radiograph, int $abnormalCount, int $missingTeethCount): array
    {
        return [
            ['fill_rect', 0, 716, 595, 126, [0.07, 0.66, 0.95]],
            ['fill_rect', 0, 716, 595, 42, [0.03, 0.27, 0.38]],
            ['text', 42, 792, 'DENTALYZE AI', 11, true, [0.82, 0.96, 1]],
            ['text', 42, 762, 'Laporan Deteksi Radiograf', 25, true, [1, 1, 1]],
            ['text', 42, 738, $radiograph['id_radiograph'], 10, false, [0.86, 0.97, 1]],
            ['text', 414, 790, 'STATUS DOKUMEN', 8, true, [0.82, 0.96, 1]],
            ['text', 414, 768, 'TERVERIFIKASI', 16, true, [1, 1, 1]],

            ...$this->statCards($patient, $abnormalCount, $missingTeethCount),

            ['fill_rect', 42, 530, 245, 136, [0.96, 0.99, 1]],
            ['stroke_rect', 42, 530, 245, 136, [0.78, 0.9, 0.96]],
            ['text', 60, 642, 'INFORMASI PASIEN', 9, true, [0.1, 0.55, 0.85]],
            ...$this->infoLines(60, 620, [
                ['Nama', $patient['name'] ?? '-'],
                ['NIK', $patient['nik'] ?? '-'],
                ['Telepon', $patient['phone'] ?? '-'],
                ['Email', $patient['email'] ?? '-'],
                ['Usia', filled($patient['age'] ?? null) ? $patient['age'].' tahun' : '-'],
            ]),

            ['fill_rect', 308, 530, 245, 136, [0.96, 0.99, 1]],
            ['stroke_rect', 308, 530, 245, 136, [0.78, 0.9, 0.96]],
            ['text', 326, 642, 'INFORMASI PEMERIKSAAN', 9, true, [0.1, 0.55, 0.85]],
            ...$this->infoLines(326, 620, [
                ['Radiografer', $radiograph['radiographer_name'] ?? '-'],
                ['Dokter', $radiograph['doctor_name'] ?? '-'],
                ['Tanggal upload', $radiograph['created_at'] ?? '-'],
                ['Tanggal verifikasi', $radiograph['verified_at'] ?? '-'],
                ['Status', $radiograph['status'] ?? '-'],
            ]),

            ['text', 42, 495, 'RADIOGRAF AWAL', 10, true, [0.1, 0.55, 0.85]],
            ['fill_rect', 42, 286, 511, 194, [0.02, 0.08, 0.1]],
            ['image', 50, 294, 495, 178, $radiograph['image_path'] ?? null],

            ['text', 42, 250, 'HASIL AI + BOUNDING BOX', 10, true, [0.1, 0.55, 0.85]],
            ['fill_rect', 42, 41, 511, 194, [0.02, 0.08, 0.1]],
            ['image', 50, 49, 495, 178, $radiograph['result_image_path'] ?? $radiograph['image_path'] ?? null],
        ];
    }

    /**
     * @param  array<string, mixed>  $radiograph
     * @param  Collection<int, array<string, mixed>>  $detections
     * @return array<int, array<int, mixed>>
     */
    private function resultPage(array $radiograph, Collection $detections, int $missingTeethCount, array $conditionCounts, ?string $qrCodePath): array
    {
        return [
            ['fill_rect', 0, 790, 595, 52, [0.93, 0.98, 1]],
            ['text', 42, 812, 'DETAIL HASIL DETEKSI', 18, true, [0.03, 0.27, 0.38]],
            ['text', 42, 794, $radiograph['id_radiograph'], 9, false, [0.45, 0.55, 0.68]],

            ['fill_rect', 42, 718, 245, 46, [0.96, 0.99, 1]],
            ['stroke_rect', 42, 718, 245, 46, [0.78, 0.9, 0.96]],
            ['text', 60, 746, 'Gigi hilang / tidak terdeteksi', 9, true, [0.45, 0.55, 0.68]],
            ['text', 60, 725, $missingTeethCount.' gigi', 18, true, [0.03, 0.48, 0.88]],

            ['fill_rect', 308, 718, 245, 46, [0.96, 0.99, 1]],
            ['stroke_rect', 308, 718, 245, 46, [0.78, 0.9, 0.96]],
            ['text', 326, 746, 'Kelainan non-normal', 9, true, [0.45, 0.55, 0.68]],
            ['text', 326, 725, $detections->count().' temuan', 18, true, [0.03, 0.48, 0.88]],

            ['text', 42, 690, 'Ringkasan kondisi: Normal '.$conditionCounts['Normal'].' | Karies '.$conditionCounts['Karies'].' | Lesi '.$conditionCounts['LesiPeriapikal'].' | Resorpsi '.$conditionCounts['Resorpsi'].' | Impaksi '.$conditionCounts['Impaksi'], 9, true, [0.1, 0.55, 0.85]],
            ['text', 42, 666, 'Crop Gigi dan Catatan Dokter', 13, true, [0.03, 0.27, 0.38]],
            ...$this->detectionRows($detections->all(), 42, 634),

            ['fill_rect', 42, 84, 300, 76, [0.96, 0.99, 1]],
            ['stroke_rect', 42, 84, 300, 76, [0.78, 0.9, 0.96]],
            ['text', 60, 136, 'Pernyataan Verifikasi', 11, true, [0.03, 0.27, 0.38]],
            ['text', 60, 116, 'Dokumen ini diterbitkan oleh sistem Dentalyze AI.', 9, false, [0.32, 0.42, 0.55]],
            ['text', 60, 100, 'Scan QR untuk memastikan dokumen asli.', 9, false, [0.32, 0.42, 0.55]],

            ['text', 402, 154, 'Dokter Pemeriksa,', 10, false, [0.03, 0.27, 0.38]],
            ['image', 398, 54, 96, 96, $qrCodePath],
            ['stroke_rect', 394, 50, 104, 104, [0.78, 0.9, 0.96]],
            ['text', 382, 30, $radiograph['doctor_name'] ?? '-', 11, true, [0.03, 0.27, 0.38]],
            ['text', 360, 16, 'SCAN TO VERIFY ORIGINAL DOCUMENT', 7, true, [0.45, 0.55, 0.68]],
        ];
    }

    /**
     * @param  array<string, mixed>  $patient
     * @return array<int, array<int, mixed>>
     */
    private function statCards(array $patient, int $abnormalCount, int $missingTeethCount): array
    {
        return [
            ['fill_rect', 42, 684, 158, 58, [0.96, 0.99, 1]],
            ['stroke_rect', 42, 684, 158, 58, [0.78, 0.9, 0.96]],
            ['text', 60, 722, 'PASIEN', 8, true, [0.55, 0.64, 0.74]],
            ['text', 60, 701, Str::limit((string) ($patient['name'] ?? '-'), 18), 15, true, [0.03, 0.27, 0.38]],
            ['fill_rect', 218, 684, 158, 58, [0.96, 0.99, 1]],
            ['stroke_rect', 218, 684, 158, 58, [0.78, 0.9, 0.96]],
            ['text', 236, 722, 'TOTAL TEMUAN', 8, true, [0.55, 0.64, 0.74]],
            ['text', 236, 701, $abnormalCount.' gigi', 15, true, [0.03, 0.48, 0.88]],
            ['fill_rect', 394, 684, 159, 58, [0.96, 0.99, 1]],
            ['stroke_rect', 394, 684, 159, 58, [0.78, 0.9, 0.96]],
            ['text', 412, 722, 'GIGI HILANG', 8, true, [0.55, 0.64, 0.74]],
            ['text', 412, 701, $missingTeethCount.' gigi', 15, true, [0.03, 0.48, 0.88]],
        ];
    }

    /**
     * @param  array<int, array{0: string, 1: mixed}>  $rows
     * @return array<int, array<int, mixed>>
     */
    private function infoLines(int $x, int $startY, array $rows): array
    {
        $commands = [];
        $y = $startY;

        foreach ($rows as [$label, $value]) {
            $commands[] = ['text', $x, $y, $label, 8, true, [0.55, 0.64, 0.74]];
            $commands[] = ['text', $x + 88, $y, Str::limit((string) $value, 30), 9, false, [0.03, 0.27, 0.38]];
            $y -= 18;
        }

        return $commands;
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $detections
     * @return array{Normal: int, Karies: int, LesiPeriapikal: int, Resorpsi: int, Impaksi: int}
     */
    private function conditionCounts(Collection $detections): array
    {
        $counts = [
            'Normal' => 0,
            'Karies' => 0,
            'LesiPeriapikal' => 0,
            'Resorpsi' => 0,
            'Impaksi' => 0,
        ];

        foreach ($detections as $detection) {
            $abnormality = trim((string) ($detection['abnormality'] ?? ''));

            foreach (array_keys($counts) as $condition) {
                if (strcasecmp($abnormality, $condition) === 0) {
                    $counts[$condition]++;
                    break;
                }
            }
        }

        return $counts;
    }

    /**
     * @param  array<int, array<string, mixed>>  $detections
     * @return array<int, array<int, mixed>>
     */
    private function detectionRows(array $detections, int $x, int $startY): array
    {
        $rows = [
            ['fill_rect', $x, $startY, 511, 26, [0.93, 0.98, 1]],
            ['text', $x + 12, $startY + 9, 'CROP', 8, true, [0.55, 0.64, 0.74]],
            ['text', $x + 92, $startY + 9, 'FDI', 8, true, [0.55, 0.64, 0.74]],
            ['text', $x + 134, $startY + 9, 'KELAINAN', 8, true, [0.55, 0.64, 0.74]],
            ['text', $x + 246, $startY + 9, 'CATATAN DOKTER', 8, true, [0.55, 0.64, 0.74]],
        ];
        $y = $startY - 58;

        if ($detections === []) {
            return [
                ...$rows,
                ['fill_rect', $x, $startY - 54, 511, 42, [0.98, 1, 0.98]],
                ['text', $x + 16, $startY - 30, 'Tidak ada kelainan non-normal yang perlu ditampilkan.', 10, false, [0.06, 0.55, 0.28]],
            ];
        }

        foreach (array_slice($detections, 0, 8) as $index => $detection) {
            $rows[] = ['fill_rect', $x, $y - 8, 511, 52, $index % 2 === 0 ? [0.99, 1, 1] : [0.96, 0.99, 1]];
            $rows[] = ['stroke_rect', $x, $y - 8, 511, 52, [0.86, 0.94, 0.98]];

            if (filled($detection['crop_image_path'] ?? null) && is_file($detection['crop_image_path'])) {
                $rows[] = ['image', $x + 12, $y, 40, 40, $detection['crop_image_path']];
            } else {
                $rows[] = ['text', $x + 15, $y + 18, 'Manual', 8, false, [0.55, 0.64, 0.74]];
            }

            $rows[] = ['text', $x + 92, $y + 17, (string) $detection['no_fdi'], 11, true, [0.03, 0.48, 0.88]];
            $rows[] = ['text', $x + 134, $y + 17, (string) $detection['abnormality'], 9, true, [0.03, 0.27, 0.38]];
            $rows[] = ['text', $x + 246, $y + 20, Str::limit((string) ($detection['analysis'] ?? '-'), 56), 8, false, [0.32, 0.42, 0.55]];
            $y -= 58;
        }

        if (count($detections) > 8) {
            $rows[] = ['text', $x + 12, $y + 22, '+ '.(count($detections) - 8).' temuan lain tersimpan di sistem.', 9, true, [0.45, 0.55, 0.68]];
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

                    if ($size <= 0) {
                        continue;
                    }

                    $color = $command[6] ?? [0, 0, 0];
                    $content .= $this->fillColor($color);
                    $content .= sprintf(
                        "BT /F1 %d Tf %d %d Td (%s) Tj ET\n",
                        $bold ? $size + 1 : $size,
                        $x,
                        $y,
                        $this->escape((string) $text),
                    );
                }

                if ($command[0] === 'fill_rect') {
                    [, $x, $y, $w, $h, $color] = $command;
                    $content .= $this->fillColor($color);
                    $content .= sprintf("%d %d %d %d re f\n", $x, $y, $w, $h);
                }

                if ($command[0] === 'stroke_rect') {
                    [, $x, $y, $w, $h, $color] = $command;
                    $content .= $this->strokeColor($color);
                    $content .= sprintf("%d %d %d %d re S\n", $x, $y, $w, $h);
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
        imagejpeg($image, null, 92);
        imagedestroy($image);

        return ob_get_clean();
    }

    /**
     * @param  array{0: float|int, 1: float|int, 2: float|int}  $color
     */
    private function fillColor(array $color): string
    {
        return sprintf("%.3F %.3F %.3F rg\n", $color[0], $color[1], $color[2]);
    }

    /**
     * @param  array{0: float|int, 1: float|int, 2: float|int}  $color
     */
    private function strokeColor(array $color): string
    {
        return sprintf("%.3F %.3F %.3F RG\n", $color[0], $color[1], $color[2]);
    }

    private function escape(string $text): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\(', '\)'], $text);
    }
}
