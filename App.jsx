import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { StyleSheet, SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getCalendarColumns, getDayColor, getDayText } from './src/utils/calendar';
import { SimpleLineIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import useCalendar from './src/hooks/useCalendar';

const columnSize = 35;

const Column = ({ 
  text, 
  color, 
  opacity,
  disabled,
  onPress,
  isSelected,
}) => {
  return (
    <TouchableOpacity 
      style={{ 
        width: columnSize, 
        height: columnSize, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: isSelected ? "#c2c2c250" : "transparent",
        borderRadius: columnSize / 2
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ color, opacity }}>{text}</Text>
    </TouchableOpacity>
  )
};

const ArrowButton = ({ direction, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
      <SimpleLineIcons name={`arrow-${direction}`} size={15} color="#404040" />
    </TouchableOpacity>
  )
};

export default function App() {
  const now = dayjs();
  const {
    selectedDate,
    setSelectedDate,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    subtract1Month,
    add1Month,
  } = useCalendar(now);
  
  const columns = getCalendarColumns(selectedDate);

  const onPressLeftArrow = subtract1Month;
  const onPressRightArrow = add1Month;

  const ListHeaderComponent = () => {
    const currentDateText = dayjs(selectedDate).format("YYYY.MM.DD");
    return (
      <View>

      {/* < YYYY.MM.DD > */}
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <ArrowButton direction="left" onPress={onPressLeftArrow} />
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={{ fontSize: 20, color: "#404040" }}>{currentDateText}</Text>
          </TouchableOpacity>
          <ArrowButton direction="right" onPress={onPressRightArrow} />
        </View>

      {/* 일 ~ 토 */}
        <View style={{ flexDirection: "row" }}>
          {[0, 1, 2, 3, 4, 5, 6].map(day => {
            const dayText = getDayText(day);
            const color = getDayColor(day);

            return (
              <Column key={`day-${day}`} text={dayText} color={color} opacity={1} disabled />
            )
          })}
        </View>
      </View>
    )
  };

  const renderItem = ({ item: date }) => {
    const dateText = dayjs(date).get("date");
    const day = dayjs(date).get("day");
    const color = getDayColor(day);
    const isCurrentMonth = dayjs(date).isSame(selectedDate, "month");
    const isSelected = dayjs(date).isSame(selectedDate, "date");

    const onPress = () => {
      setSelectedDate(date);
    };

    return (
      <Column 
        text={dateText} 
        color={color} 
        opacity={isCurrentMonth ? 1 : 0.4} 
        onPress={onPress}
        isSelected={isSelected}
      />
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        data={columns}
        keyExtractor={(_, index) => `index-${index}`}
        numColumns={7}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
