import React, { useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Image, KeyboardAvoidingView, Platform, Keyboard, Pressable, Alert } from 'react-native';
import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import useCalendar from './src/hooks/useCalendar';
import useTodoList from './src/hooks/useTodoList';
import Calendar from './src/components/layout/Calendar';
import Margin from './src/components/common/Margin';
import AddTodoInput from './src/components/layout/AddTodoInput';
import { bottomSpace, ITEM_WIDTH, statusBarHeight } from './src/utils/calendar';

export default function App() {
  const now = dayjs();
  const flatListRef = useRef(null);
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
  const {
    todoList,
    filteredTodoList,
    input,
    setInput,
    addTodo,
    removeTodo,
    toggleTodo,
    resetInput,
  } = useTodoList(selectedDate);

  const onPressLeftArrow = subtract1Month;
  const onPressHeaderDate = showDatePicker;
  const onPressRightArrow = add1Month;
  const onPressDate = setSelectedDate;

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
  }
  const onPressAdd = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };

  const onSubmitEditing = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };

  const onFocus = () => {
    scrollToEnd();
  };

  const ListHeaderComponent = () => (
    <View>
      <Calendar 
        todoList={todoList}
        selectedDate={selectedDate}
        onPressLeftArrow={onPressLeftArrow}
        onPressRightArrow={onPressRightArrow}
        onPressHeaderDate={onPressHeaderDate}
        onPressDate={onPressDate}
      />
      <Margin height={15} />

      <View 
        style={{
          width: 4,
          height: 4,
          borderRadius: 4 / 2,
          backgroundColor: "#a3a3a3",
          alignSelf: "center",
        }}
      />
      <Margin height={15} />
    </View>
  );

  const renderItem = ({ item: todo }) => {
    const isDone = todo.isDone;
    const onPress = () => toggleTodo(todo.id);
    const onLongPress = () => {
      Alert.alert("삭제하시겠어요?", "", [
        {
          style: 'cancel',
          text: "아니요",
        },
        {
          text: "네",
          onPress: () => removeTodo(todo.id),
        }
      ]);
    };

    return (
      <Pressable 
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: ITEM_WIDTH, 
          alignSelf: "center",
          paddingVertical: 10,
          paddingHorizontal: 5,
          borderBottomWidth: 0.2,
          borderColor: "#a6a6a6",
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 14,
            color: "#595959",
          }}
        >{todo.content}</Text>

        <Ionicons 
          name="ios-checkmark" 
          size={20} 
          color={isDone ? "#37981a" : "#bfbfbf"}
        />
      </Pressable>
    )
  };

  return (
    <Pressable 
      style={styles.container}
      onPress={Keyboard.dismiss}
    >
      <Image 
        source={{
          // 출처: https://kr.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1189772.htm
          uri: "https://img.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1373-159.jpg?w=1060&t=st=1667524235~exp=1667524835~hmac=8a3d988d6c33a32017e280768e1aa4037b1ec8078c98fe21f0ea2ef361aebf2c",
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -1,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <FlatList 
            ref={flatListRef}
            data={filteredTodoList}
            keyExtractor={(_, index) => `todo-${index}`}
            contentContainerStyle={{ paddingTop: statusBarHeight + 30 }}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          <AddTodoInput 
            value={input}
            onChangeText={setInput}
            placeholder={`${dayjs(selectedDate).format('MM.D')}에 할 일 추가`}
            onPressAdd={onPressAdd}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
          />
        </View>
      </KeyboardAvoidingView>

      <Margin height={bottomSpace} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Pressable>
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
