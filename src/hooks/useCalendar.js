import { useState } from "react";
import dayjs from "dayjs";

export default function useCalendar(now) {
  const [selectedDate, setSelectedDate] = useState(now);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(dayjs(date));
    hideDatePicker();
  };

  const subtract1Month = () => {
    const newSelectedDate = dayjs(selectedDate).subtract(1, 'month');
    setSelectedDate(newSelectedDate);
  };

  const add1Month = () => {
    const newSelectedDate = dayjs(selectedDate).add(1, 'month');
    setSelectedDate(newSelectedDate);
  };

  return {
    selectedDate,
    setSelectedDate,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    subtract1Month,
    add1Month,
  }
}