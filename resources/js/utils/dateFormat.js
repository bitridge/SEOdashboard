import { format } from 'date-fns';

// Map Laravel date formats to date-fns formats
const formatMap = {
    'Y-m-d': 'yyyy-MM-dd',
    'm/d/Y': 'MM/dd/yyyy',
    'd/m/Y': 'dd/MM/yyyy',
    'M d, Y': 'MMM d, yyyy',
    'H:i': 'HH:mm',
    'h:i A': 'hh:mm aa'
};

export const formatDate = (date, settings = {}) => {
    const { date_format = 'Y-m-d' } = settings;
    const formatPattern = formatMap[date_format] || formatMap['Y-m-d'];
    return format(new Date(date), formatPattern);
};

export const formatTime = (date, settings = {}) => {
    const { time_format = 'H:i' } = settings;
    const formatPattern = formatMap[time_format] || formatMap['H:i'];
    return format(new Date(date), formatPattern);
};

export const formatDateTime = (date, settings = {}) => {
    return `${formatDate(date, settings)} ${formatTime(date, settings)}`;
}; 