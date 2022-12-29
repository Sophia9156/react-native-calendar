import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import dayjs from 'dayjs';
import { SimpleLineIcons } from '@expo/vector-icons';
import { getCalendarColumns, getDayColor, getDayText } from '../../utils/calendar';

const columnSize = 35;

const Column = ({ 
  text, 
  color, 
  opacity,
  disabled,
  onPress,
  isSelected,
  hasTodo,
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
      <Text style={{ color, opacity, fontWeight: hasTodo ? "bold" : "normal" }}>{text}</Text>
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

export default function Calendar({
  todoList,
  selectedDate,
  onPressLeftArrow,
  onPressRightArrow,
  onPressHeaderDate,
  onPressDate,
}) {
  const columns = getCalendarColumns(selectedDate);

  const ListHeaderComponent = () => {
    const currentDateText = dayjs(selectedDate).format("YYYY.MM.DD");
    return (
      <View>

      {/* < YYYY.MM.DD > */}
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <ArrowButton direction="left" onPress={onPressLeftArrow} />

          <TouchableOpacity onPress={onPressHeaderDate}>
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
              <Column 
                key={`day-${day}`} 
                text={dayText} 
                color={color} 
                opacity={1} 
                disabled 
              />
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
    const hasTodo = todoList.find(todo => dayjs(todo.date).isSame(date, 'date'));

    const onPress = () => onPressDate(date);

    return (
      <Column 
        text={dateText} 
        color={color} 
        opacity={isCurrentMonth ? 1 : 0.4} 
        onPress={onPress}
        isSelected={isSelected}
        hasTodo={hasTodo}
      />
    )
  };

  return (
    <FlatList 
      data={columns}
      scrollEnabled={false}
      keyExtractor={(_, index) => `column-${index}`}
      numColumns={7}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
    />
  )
}