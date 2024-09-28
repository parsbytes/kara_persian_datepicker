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
    textAlign?: 'right' | 'left' | 'center';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    radius?: string;
    borderColor?: string;
    selectedDayColor?: string;
    inputStyle?: React.CSSProperties;
  };
}

const SizeMap = {
  xs: {inputText: 12, calenderText: 10, calenderHeader: 14, calenderArrow: 12},
  sm: {inputText: 14, calenderText: 12, calenderHeader: 16, calenderArrow: 14},
  md: {inputText: 16, calenderText: 14, calenderHeader: 18, calenderArrow: 16},
  lg: {inputText: 18, calenderText: 16, calenderHeader: 20, calenderArrow: 18},
  xl: {inputText: 20, calenderText: 18, calenderHeader: 22, calenderArrow: 20},
};

// Helper function to check if the year is a leap year
const isLeapYear = (year: number) => moment.jIsLeapYear(year);

// Generate the number of days in a Jalali month
const generateDaysInMonth = (year: number, month: number) => {
  if (month <= 6) return 31;
  else if (month <= 11) return 30;
  else return isLeapYear(year) ? 30 : 29;
};

// Persian months and week days
const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const persianWeeks = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']; // Saturday to Friday

const DatePicker: React.FC<DatePickerProps> = ({onChange, value, disabled = false, theme = 'light', classStyle}) => {
  const {
    backgroundColor = theme === 'dark' ? '#09090B' : '#fff',
    textColor = theme === 'dark' ? '#fff' : '#09090B',
    textPlaceholder = 'تاریخ انتخاب کنید',
    textAlign = 'right',
    size = 'sm',
    radius = '6',
    borderColor = '#E2e8f0',
    selectedDayColor = '#fff',
    inputStyle,
  } = classStyle || {};

  const initialDate = value ? moment.from(value, 'fa', 'jYYYY/jMM/jDD') : null;
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(
    initialDate ? {year: initialDate.jYear(), month: initialDate.jMonth() + 1, day: initialDate.jDate()} : null
  );
  const [currentYear, setCurrentYear] = useState(moment().jYear());
  const [currentMonth, setCurrentMonth] = useState(moment().jMonth() + 1);
  const [view, setView] = useState<'day' | 'month' | 'year'>('day');
  const [visible, setVisible] = useState(false);
  const datePickerRef = useRef<HTMLDivElement | null>(null);

  const today = moment();
  const currentJalaliYear = today.jYear();

  // Determine if a day is a holiday (Friday in this case)
  const isHoliday = (year: number, month: number, day: number) => {
    const date = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD');
    return date.jDay() === 6; // Friday (jDay() === 6)
  };

  // Calculate the number of days in the current month
  const daysInMonth = generateDaysInMonth(currentYear, currentMonth);
  const days = Array.from({length: daysInMonth}, (_, day) => ({
    year: currentYear,
    month: currentMonth,
    day: day + 1,
  }));

  useEffect(() => {
    const today = moment();
    setCurrentYear(today.jYear());
    setCurrentMonth(today.jMonth() + 1);
  }, []);

  // Get the weekday offset for the first day of the month
  const getWeekDayOffset = (year: number, month: number) => {
    return moment(`${year}/${month}/01`, 'jYYYY/jMM/jDD').jDay(); // Using jDay for correct Jalali day
  };
  const weekDayOffset = getWeekDayOffset(currentYear, currentMonth);

  const handleSelectDate = (day: { year: number; month: number; day: number }) => {
    setSelectedDate(day);
    const formattedDate = moment.from(`${day.year}/${day.month}/${day.day}`, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
    onChange(formattedDate);
    setVisible(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  return (
    <div ref={datePickerRef} style={{backgroundColor, borderRadius: `${radius}px`}}>
      <div
        className="datepicker-input"
        onClick={toggleDatePicker}
        style={{
          color: selectedDate ? textColor : '#6B7280',
          width: '100%',
          textAlign,
          fontSize: SizeMap[size].inputText,
          padding: '6px 12px',
          borderColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          borderRadius: `${radius}px`,
          ...inputStyle,
        }}
      >
        {selectedDate ? `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}` : textPlaceholder}
      </div>
      {visible && (
        <div className="datepicker-popup">
          <div className="datepicker-header"
               style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px'}}>
            <div
              className="datepicker-arrow"
              onClick={handlePrevMonth}
              style={{
                cursor: 'pointer',
                padding: '0 5px',
                fontSize: '16px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" style={{fill: textColor}}>
                <path d="M10.293 11.293l-1.414 1.414L4.586 8l4.293-4.707 1.414 1.414L7.414 8z"/>
              </svg>
            </div>

            {/* Month and Year View Toggle */}
            <div className="datepicker-header-month-year"
                 style={{flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>
              {view === 'day' ? (
                <span>
                  <span onClick={() => setView('month')} className={'datepicker-month-button'}>{persianMonths[currentMonth - 1]}</span>
                  <span style={{margin:'0 6px'}}/>
                  <span onClick={() => setView('year')} className={'datepicker-year-button'}> {currentYear}</span>
                </span>
              ) : view === 'month' ? (
                <span>انتخاب ماه</span>
              ) : (
                <span>انتخاب سال</span>
              )}
            </div>

            <div
              className="datepicker-arrow"
              onClick={handleNextMonth}
              style={{
                cursor: 'pointer',
                padding: '0 5px',
                fontSize: '16px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" style={{fill: textColor}}>
                <path d="M5.707 4.293l1.414-1.414L11.414 8l-4.293 4.707-1.414-1.414L9.586 8z"/>
              </svg>
            </div>
          </div>

          {view === 'day' && (
            <>
              <div className="datepicker-weeks">
                {persianWeeks.map((week) => (
                  <div className="datepicker-week" key={week}>
                    {week}
                  </div>
                ))}
              </div>
              <div className="datepicker-days">
                {/* Empty cells before the start of the month */}
                {Array.from({length: weekDayOffset}, (_, i) => (
                  <div key={`empty-${i}`} className="datepicker-day empty"></div>
                ))}
                {/* Render actual days */}
                {days.map((day) => (
                  <div
                    key={`${day.year}-${day.month}-${day.day}`}
                    className={`datepicker-day ${
                      isHoliday(day.year, day.month, day.day) ? 'holiday' : ''
                    } ${selectedDate?.year === day.year &&
                    selectedDate?.month === day.month &&
                    selectedDate?.day === day.day
                      ? 'selected'
                      : ''}`}
                    onClick={() => handleSelectDate(day)}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Month View */}
          {view === 'month' && (
            <div className="datepicker-months-grid"
                 style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '10px'}}>
              {persianMonths.map((month, index) => (
                <div
                  key={index}
                  className={`datepicker-month ${currentMonth === index + 1 ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentMonth(index + 1); // Set the current month
                    setView('day'); // Switch back to day view
                  }}
                  style={{
                    textAlign: 'center',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          )}

          {/* Year View */}
          {view === 'year' && (
            <div className="datepicker-years-grid"
                 style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '10px'}}>
              {Array.from({length: 140}, (_, i) => currentJalaliYear - 70 + i).map(year => (
                <div
                  key={year}
                  className={`datepicker-year ${currentYear === year ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentYear(year); // Set the selected year
                    setView('day'); // Switch to month view
                  }}
                  style={{
                    textAlign: 'center',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
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
