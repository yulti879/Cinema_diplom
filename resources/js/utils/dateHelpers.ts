export const DAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

/* =========================================================
   UI / Calendar helpers (работают с Date)
   ========================================================= */

// Получить понедельник недели
export const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
};

// Генерация дней недели (СТАРАЯ логика, оставляем)
export const generateWeekDays = (selectedDate: Date) => {
  const monday = getMondayOfWeek(selectedDate);
  const today = new Date();
  const todayKey = today.toDateString();
  const selectedKey = selectedDate.toDateString();

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + i
    );
    const dayOfWeek = d.getDay();

    return {
      date: d,
      day: DAYS_SHORT[dayOfWeek],
      number: d.getDate(),
      today: d.toDateString() === todayKey,
      chosen: d.toDateString() === selectedKey,
      weekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  });
};

export const generateDaysFromDate = (startDate: Date, count: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedKey = startDate.toDateString();
  const todayKey = today.toDateString();

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const dayOfWeek = d.getDay();

    return {
      date: d,
      day: DAYS_SHORT[dayOfWeek],
      number: d.getDate(),
      today: d.toDateString() === todayKey,
      chosen: d.toDateString() === selectedKey,
      weekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  });
};

// Проверка, один и тот же день
export const isSameDay = (a: Date, b: Date) =>
  a.toDateString() === b.toDateString();

/* =========================================================
   API helpers (работают со строками)
   ========================================================= */

// "YYYY-MM-DD" → "DD.MM.YYYY"
export const formatApiDate = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
};

// "HH:mm" → "HH:mm"
export const formatApiTime = (time: string): string => {
  return time;
};