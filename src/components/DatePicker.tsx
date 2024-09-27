import React, {useState, useEffect, useRef} from 'react';
import moment from 'jalali-moment';
import './DatePicker.css';

interface DatePickerProps {
    onChange: (date: string) => void;
    value: string | null;
    disabled?: boolean;
    theme?: string;
    classStyle?: {
        backgroundColor?: string;
        textColor?: string;
        textPlaceholder?: string;
        textAlign?: "right" | "left" | "center";
        size?: "xs" | "sm" | "md" | "lg" | "xl";
        radius?: string;
        borderColor?: string;
        selectedDayColor?: string;
        inputStyle?: React.CSSProperties;
    };
}


const SizeMap = {
    "xs":
        {
            inputText: 12,
            calenderText: 10,
            calenderHeader: 14,
            calenderArrow: 12,
        },
    "sm":
        {
            inputText: 14,
            calenderText: 12,
            calenderHeader: 16,
            calenderArrow: 14,
        },
    "md":
        {
            inputText: 16,
            calenderText: 14,
            calenderHeader: 18,
            calenderArrow: 16,
        },
    "lg":
        {
            inputText: 18,
            calenderText: 16,
            calenderHeader: 20,
            calenderArrow: 18,
        },
    "xl":
        {
            inputText: 20,
            calenderText: 18,
            calenderHeader: 22,
            calenderArrow: 20,
        },
}

const DatePicker: React.FC<DatePickerProps> = ({onChange, value, disabled = false, theme = 'light', classStyle}) => {
    const {
        backgroundColor = theme == 'dark' ? '#09090B' : '#fff', // Default dark background
        textColor = theme == 'dark' ? '#fff': '#09090B', // Default white text
        textPlaceholder = 'تاریخ انتخاب کنید', // Default white text
        textAlign = 'right',
        size = "sm",
        radius = "6",
        borderColor = '#E2e8f0',
        selectedDayColor = '#fff', // Default white for selected day
        inputStyle,
    } = classStyle || {};

    // Parse the value to set the initial state
    const initialDate = value ? moment.from(value, 'fa', 'jYYYY/jMM/jDD') : null;
    const [selectedDate, setSelectedDate] = useState<{
        year: number;
        month: number;
        day: number
    } | null>(initialDate ? {
        year: initialDate.jYear(),
        month: initialDate.jMonth() + 1,
        day: initialDate.jDate()
    } : null);

    const [currentYear, setCurrentYear] = useState(moment().jYear());
    const [currentMonth, setCurrentMonth] = useState(moment().jMonth() + 1);
    const [view, setView] = useState<'day' | 'month' | 'year'>('day');
    const [visible, setVisible] = useState(false);
    const datePickerRef = useRef<HTMLDivElement | null>(null);
    const yearRef = useRef<HTMLDivElement | null>(null);
    const monthRef = useRef<HTMLDivElement | null>(null);

    const today = moment();
    const currentJalaliYear = today.jYear();
    const currentJalaliMonth = today.jMonth() + 1;
    const currentJalaliDay = today.jDay();

    const persianMonths = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    const persianWeeks = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

    const generateDaysInMonth = (year: number, month: number) => {
        const daysInMonth = moment(`${year}/${month}`, 'jYYYY/jMM').daysInMonth();
        return Array.from({length: daysInMonth}, (_, day) => ({year, month, day: day + 1}));
    };

    const days = generateDaysInMonth(currentYear, currentMonth);

    const handleSelectDate = (day: { year: number; month: number; day: number }) => {
        setSelectedDate(day);
        const formattedDate = moment
            .from(`${day.year}/${day.month}/${day.day}`, 'fa', 'jYYYY/jMM/jDD')
            .format('YYYY-MM-DD');
        onChange(formattedDate);
        setVisible(false);
    };

    const handleMonthChange = (month: number) => {
        setCurrentMonth(month);
        setView('day');
    };

    const handleYearChange = (year: number) => {
        setCurrentYear(year);
        setView('day');
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const toggleDatePicker = () => {
        if (!visible && selectedDate) {
            setCurrentYear(selectedDate.year);
            setCurrentMonth(selectedDate.month);
        }
        setVisible(!visible);
        setView('day');
    };

    const scrollToCurrentYear = () => {
        if (yearRef.current) {
            const currentYearElement = yearRef.current.querySelector('.datepicker-year.current');
            if (currentYearElement) {
                currentYearElement.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    };

    const scrollToCurrentMonth = () => {
        if (monthRef.current) {
            const currentMonthElement = monthRef.current.querySelector('.datepicker-month.current');
            if (currentMonthElement) {
                currentMonthElement.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    };

    useEffect(() => {
        if (visible) {
            if (view === 'year') {
                scrollToCurrentYear();
            } else if (view === 'month') {
                scrollToCurrentMonth();
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, view]);

    return (
        <div ref={datePickerRef} style={{backgroundColor: backgroundColor, borderRadius: `${radius}px`}}>
            <div className="datepicker-input" onClick={toggleDatePicker}
                 style={{
                     color: selectedDate ? textColor : '#6B7280',
                     width: "100%",
                     textAlign: textAlign,
                     fontSize: SizeMap[size].inputText,
                     padding: "6px 12px",
                     borderColor: borderColor,
                     boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                     cursor: disabled ? 'not-allowed' : 'pointer',
                     opacity: disabled ? 0.5 : 1,
                     borderRadius: `${radius}px`, ...inputStyle
                 }}>
                {selectedDate
                    ? `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`
                    : `${textPlaceholder}`}
            </div>

            {visible && !disabled && (
                <div className="datepicker-popup" style={{borderColor: borderColor, borderRadius: `${radius}px`}}>
                    <div className="datepicker-header"
                         style={{color: textColor, fontSize: SizeMap[size].calenderHeader}}>
                        <span className="datepicker-arrow" onClick={handlePrevMonth}
                              style={{
                                  color: textColor,
                                  fontSize: SizeMap[size].calenderArrow,
                                  borderColor: borderColor,
                                  borderRadius: `${radius}px`
                              }}>
                            &lt;
                        </span>
                        <span className="datepicker-header-month" onClick={() => setView('month')}
                              style={{
                                  color: textColor,
                                  fontSize: SizeMap[size].calenderHeader,
                                  borderRadius: `${radius}px`
                              }}>
                            {persianMonths[currentMonth - 1]}
                        </span>
                        <span className="datepicker-header-year" onClick={() => setView('year')}
                              style={{
                                  color: textColor,
                                  fontSize: SizeMap[size].calenderHeader,
                                  borderRadius: `${radius}px`
                              }}>
                            {currentYear}
                        </span>
                        <span className="datepicker-arrow" onClick={handleNextMonth}
                              style={{
                                  color: textColor,
                                  fontSize: SizeMap[size].calenderArrow,
                                  borderColor: borderColor,
                                  borderRadius: `${radius}px`
                              }}>
                            &gt;
                        </span>
                    </div>

                    {view === 'day' && (
                        <div className="datepicker-days"
                             style={{color: textColor, fontSize: SizeMap[size].calenderText}}>
                            {persianWeeks.map((week) => (
                                <div
                                    className={'datepicker-week'}
                                >
                                    {week}
                                </div>
                            ))}
                            {days.map((day) => (
                                <div
                                    key={`${day.year}-${day.month}-${day.day}`}
                                    className={`datepicker-day ${
                                        selectedDate &&
                                        selectedDate.year === day.year &&
                                        selectedDate.month === day.month &&
                                        selectedDate.day === day.day
                                            ? 'selected'
                                            : ''
                                    }`}
                                    style={{
                                        ...(selectedDate && selectedDate.year === day.year && selectedDate.month === day.month && selectedDate.day === day.day && {
                                            backgroundColor: selectedDayColor,
                                            borderRadius: `${radius}px`,
                                            color: backgroundColor,
                                        }),
                                        ...(currentJalaliDay === day.day && {
                                            border: `1px solid ${textColor}`,
                                            borderRadius: `${radius}px`,
                                        }),
                                        color: selectedDate && selectedDate.year === day.year && selectedDate.month === day.month && selectedDate.day === day.day
                                            ? backgroundColor
                                            : textColor,
                                    }}
                                    onClick={() => handleSelectDate(day)}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>
                    )}

                    {view === 'month' && (
                        <div className="datepicker-months" ref={monthRef} style={{
                            color: textColor,
                            fontSize: SizeMap[size].calenderText, ...(currentMonth && {borderRadius: `${radius}px`})
                        }}>
                            {persianMonths.map((month, index) => (
                                <div
                                    key={index + 1}
                                    className={`datepicker-month ${
                                        currentMonth === index + 1 ? 'selected' : ''
                                    } ${currentJalaliMonth === index + 1 ? 'current' : ''}`}
                                    style={{
                                        ...(currentMonth === index + 1 && {
                                            backgroundColor: textColor,
                                            borderRadius: `${radius}px`,
                                            color: backgroundColor,
                                        }),
                                        ...(currentJalaliMonth === index + 1 && {
                                            border: `1px solid ${textColor}`,
                                            borderRadius: `${radius}px`,
                                        }),
                                    }}
                                    onClick={() => handleMonthChange(index + 1)}
                                >
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}

                    {view === 'year' && (
                        <div className="datepicker-years" ref={yearRef} style={{
                            color: textColor,
                            fontSize: SizeMap[size].calenderText, ...(currentYear && {
                                borderColor: borderColor,
                                borderRadius: `${radius}px`
                            })
                        }}>
                            {Array.from({length: 100}, (_, i) => currentYear - 50 + i).map((year) => (
                                <div
                                    key={year}
                                    className={`datepicker-year ${
                                        currentYear === year ? 'selected' : ''
                                    } ${currentJalaliYear === year ? 'current' : ''}`}

                                    style={{
                                        ...(currentYear === year && {
                                            backgroundColor: textColor,
                                            borderRadius: `${radius}px`,
                                            color: backgroundColor
                                        }),
                                        ...(currentJalaliYear === year && {
                                            border: `1px solid ${textColor}`,
                                            borderRadius: `${radius}px`,
                                        }),
                                    }}
                                    onClick={() => handleYearChange(year)}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DatePicker;
