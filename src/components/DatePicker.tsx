import React, { useState, useEffect, useRef } from 'react';
import moment from 'jalali-moment';
import './DatePicker.css';

interface DatePickerProps {
  onChange: (date: string) => void;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    selectedDayColor?: string;
    currentDayBorderColor?: string;
  };
}

const DatePicker: React.FC<DatePickerProps> = ({ onChange, theme }) => {
  const {
    backgroundColor = '#1a1a1a', // Default dark background
    textColor = '#fff', // Default white text
    selectedDayColor = '#fff', // Default white for selected day
    currentDayBorderColor = '#fff', // Default white border for current day
  } = theme || {};

  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);
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

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const generateDaysInMonth = (year: number, month: number) => {
    const daysInMonth = moment(`${year}/${month}`, 'jYYYY/jMM').daysInMonth();
    return Array.from({ length: daysInMonth }, (_, day) => ({ year, month, day: day + 1 }));
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
        currentYearElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const scrollToCurrentMonth = () => {
    if (monthRef.current) {
      const currentMonthElement = monthRef.current.querySelector('.datepicker-month.current');
      if (currentMonthElement) {
        currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <div ref={datePickerRef} style={{ backgroundColor }}>
      <div className="datepicker-input" onClick={toggleDatePicker} style={{ color: textColor }}>
        {selectedDate
          ? `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`
          : 'Select a date'}
      </div>

      {visible && (
        <div className="datepicker-popup" style={{ backgroundColor }}>
          <div className="datepicker-header">
                        <span className="datepicker-arrow" onClick={handlePrevMonth}>
                            &lt;
                        </span>
            <span className="datepicker-header-month" onClick={() => setView('month')}>
                            {persianMonths[currentMonth - 1]}
                        </span>
            <span className="datepicker-header-year" onClick={() => setView('year')}>
                            {currentYear}
                        </span>
            <span className="datepicker-arrow" onClick={handleNextMonth}>
                            &gt;
                        </span>
          </div>

          {view === 'day' && (
            <div className="datepicker-days">
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
                    backgroundColor: selectedDate && selectedDate.year === day.year && selectedDate.month === day.month && selectedDate.day === day.day ? selectedDayColor : 'transparent',
                  }}
                  onClick={() => handleSelectDate(day)}
                >
                  {day.day}
                </div>
              ))}
            </div>
          )}

          {view === 'month' && (
            <div className="datepicker-months" ref={monthRef}>
              {persianMonths.map((month, index) => (
                <div
                  key={index + 1}
                  className={`datepicker-month ${
                    currentMonth === index + 1 ? 'selected' : ''
                  } ${currentJalaliMonth === index + 1 ? 'current' : ''}`}
                  onClick={() => handleMonthChange(index + 1)}
                >
                  {month}
                </div>
              ))}
            </div>
          )}

          {view === 'year' && (
            <div className="datepicker-years" ref={yearRef}>
              {Array.from({ length: 100 }, (_, i) => currentYear - 50 + i).map((year) => (
                <div
                  key={year}
                  className={`datepicker-year ${
                    currentYear === year ? 'selected' : ''
                  } ${currentJalaliYear === year ? 'current' : ''}`}
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
