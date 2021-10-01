import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, TextInput, Keyboard, Alert, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../components/CustomButton';
import { Colors } from '../constants';
import globalStyles from '../styles/styles';
import { createTask } from '../store/actions/taskActions';

const AddTaskScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.task);
  const { activeListId } = useSelector(state => state.list);

  const submitHandler = () => {
    if (name.trim() === '') {
      return Alert.alert('Validation', 'É necessário um nome!');
    }
    const alreadyExist = tasks.find(t => t.name.toLowerCase() === name.trim().toLowerCase() && t.listId === activeListId);
    if (alreadyExist) {
      return Alert.alert('Validation', 'Uma tarefa com este nome, já existe nessa lista!');
    }

    dispatch(createTask(
      name,
      activeListId,
      () => {
        ToastAndroid.show(`Tarefa "${name}" criada!`, ToastAndroid.LONG);
        Keyboard.dismiss();
        navigation.goBack();
      },
      () => { ToastAndroid.show('Algo de errado aconteceu, tente novamente!', ToastAndroid.LONG); },
    ));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput style={globalStyles.input} value={name} onChangeText={(val) => setName(val)} placeholder="Nome da tarefa" placeholderTextColor={Colors.tertiary} />
        <CustomButton text="Adicionar" onPress={submitHandler} round />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default AddTaskScreen;