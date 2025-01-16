<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    public function generatePdf(string $view, array $data)
    {
        $pdf = Pdf::loadView($view, $data);
        
        // Configure PDF settings
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'defaultFont' => 'Helvetica',
            'dpi' => 150,
            'isPhpEnabled' => true,
            'debugCss' => false,
        ]);

        return [
            'content' => $pdf->output(),
            'filename' => 'report.pdf'
        ];
    }
} 