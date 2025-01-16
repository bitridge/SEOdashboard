<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $report->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1a1a1a;
        }
        .project-info {
            margin-bottom: 20px;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2563eb;
            padding-bottom: 5px;
            border-bottom: 2px solid #2563eb;
        }
        .content {
            margin-bottom: 20px;
        }
        .seo-log {
            background-color: #f8f9fa;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }
        .seo-log-header {
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e9ecef;
        }
        .work-type {
            color: #2563eb;
            font-weight: bold;
            display: inline-block;
            margin-right: 15px;
        }
        .date {
            color: #6b7280;
            font-size: 11px;
        }
        img {
            max-width: 100%;
            height: auto;
            margin: 15px 0;
            display: block;
        }
        h3 {
            color: #1a1a1a;
            font-size: 16px;
            margin-bottom: 10px;
        }
        p {
            margin: 0 0 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{ $report->title }}</div>
        <div class="project-info">
            <p><strong>Project:</strong> {{ $report->project->name }}</p>
            <p><strong>Generated:</strong> {{ $report->generatedAt }}</p>
            <p><strong>Type:</strong> {{ ucfirst($report->type) }}</p>
        </div>
    </div>

    @if($report->description)
    <div class="section">
        <div class="section-title">Overview</div>
        <div class="content">{!! $report->description !!}</div>
    </div>
    @endif

    @if(count($report->sections) > 0)
    <div class="section">
        <div class="section-title">Report Sections</div>
        @foreach($report->sections as $section)
        <div class="content">
            <h3>{{ $section->title }}</h3>
            {!! $section->content !!}
            @if(!empty($section->image_path))
            <img src="{{ storage_path('app/public/' . $section->image_path) }}" alt="{{ $section->title }}">
            @endif
        </div>
        @endforeach
    </div>
    @endif

    @if(count($report->seoLogs) > 0)
    <div class="section">
        <div class="section-title">SEO Activities</div>
        @foreach($report->seoLogs as $log)
        <div class="seo-log">
            <div class="seo-log-header">
                <span class="work-type">{{ str_replace('_', ' ', ucwords($log->work_type)) }}</span>
                <span class="date">{{ \Carbon\Carbon::parse($log->work_date)->format('M d, Y') }}</span>
            </div>
            <div class="content">{!! $log->description !!}</div>
            @if(!empty($log->attachment_path))
            <div class="attachment">
                <img src="{{ storage_path('app/public/' . $log->attachment_path) }}" alt="Attachment">
            </div>
            @endif
        </div>
        @endforeach
    </div>
    @endif
</body>
</html> 