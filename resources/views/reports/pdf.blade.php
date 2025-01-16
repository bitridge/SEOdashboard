<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $report['title'] }}</title>
    <style>
        @page {
            margin: 50px 50px;
            header: page-header;
            footer: page-footer;
        }
        body {
            font-family: 'Helvetica', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .page-break {
            page-break-after: always;
        }
        .logo-container {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo {
            width: 100px;
            height: auto;
        }
        .report-title {
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 60px;
        }
        .project-info {
            text-align: center;
            background: #f8fafc;
            padding: 30px;
            margin: 40px 0;
            border-radius: 8px;
        }
        .project-info p {
            margin: 10px 0;
            font-size: 16px;
            color: #4a5568;
        }
        .project-info strong {
            font-weight: bold;
            color: #2d3748;
            margin-right: 10px;
        }
        .section {
            margin: 40px 0;
        }
        .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 20px;
        }
        .section-content {
            margin-bottom: 30px;
            font-size: 14px;
            line-height: 1.8;
        }
        .section-image {
            max-width: 100%;
            margin: 20px 0;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .page-number {
            text-align: right;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }
        .page-number:after {
            content: "Page " counter(page) " of " counter(pages);
        }
        .seo-log {
            background: #f8fafc;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            border-left: 4px solid #4a5568;
        }
        .seo-log-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 14px;
            color: #4a5568;
        }
        .seo-log-content {
            font-size: 14px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="logo-container">
        <img src="{{ public_path('images/logo.png') }}" alt="Logo" class="logo">
    </div>

    <div class="report-title">{{ $report['title'] }}</div>

    <div class="project-info">
        <p><strong>Project:</strong> {{ $report['project']['name'] }}</p>
        <p><strong>Date:</strong> {{ $report['generatedAt'] }}</p>
        <p><strong>Created by:</strong> {{ auth()->user()->name }}</p>
    </div>

    @if($report['description'])
    <div class="section">
        <div class="section-content">
            {!! $report['description'] !!}
        </div>
    </div>
    @endif

    @if(count($report['sections']) > 0)
    @foreach($report['sections'] as $section)
    <div class="section">
        <div class="section-title">{{ $section['title'] }}</div>
        <div class="section-content">
            {!! $section['content'] !!}
            @if($section['image_path'])
            <img class="section-image" src="{{ storage_path('app/public/' . $section['image_path']) }}" alt="{{ $section['title'] }}">
            @endif
        </div>
    </div>
    @if(!$loop->last)
    <div class="page-break"></div>
    @endif
    @endforeach
    @endif

    @if(count($report['seoLogs']) > 0)
    <div class="section">
        <div class="section-title">SEO Activities</div>
        @foreach($report['seoLogs'] as $log)
        <div class="seo-log">
            <div class="seo-log-header">
                <span><strong>{{ ucwords(str_replace('_', ' ', $log['work_type'])) }}</strong></span>
                <span>{{ $log['work_date'] }}</span>
            </div>
            <div class="seo-log-content">
                {!! $log['description'] !!}
                @if(!empty($log['attachment_path']))
                <p><strong>Attachment:</strong> {{ basename($log['attachment_path']) }}</p>
                @endif
            </div>
        </div>
        @endforeach
    </div>
    @endif

    <div class="page-number"></div>
</body>
</html> 