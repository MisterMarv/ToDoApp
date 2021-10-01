import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, TextInput, Keyboard, Alert, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../components/CustomButton';
import { Colors } from '../constants';
import globalStyles from '../styles/styles';
import { createList } from '../store/actions/listActions';

const AddListScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { lists } = useSelector(state => state.list);

  const submitHandler = () => {
    if (name.trim() === '') {
      return Alert.alert('Validation', 'Um nome é necessário!');
    }
    const alreadyExist = lists.find(l => l.name.toLowerCase() === name.trim().toLowerCase());
    if (alreadyExist) {
      return Alert.alert('Validation', 'Uma lista com este nome já existe!');
    }

    dispatch(createList(
      name,
      () => {
        ToastAndroid.show(`Lista "${name}" criada!`, ToastAndroid.LONG);
        Keyboard.dismiss();
        navigation.navigate('Home');
      },
      () => { ToastAndroid.show('ALgo aconteceu de errado, tente novamente!', ToastAndroid.LONG); },
    ));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput style={globalStyles.input} value={name} onChangeText={(val) => setName(val)} placeholder="Nome da lista" placeholderTextColor={Colors.tertiary} />
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

export default AddListScreen;