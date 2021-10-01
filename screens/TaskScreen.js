import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { Colors } from '../constants';
import globalStyles from '../styles/styles';
import CustomButton from '../components/CustomButton';
import { updateTask, deleteTask } from '../store/actions/taskActions';

const TaskScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [completed, setCompleted] = useState(false);
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.task);

  useEffect(() => {
    const taskFound = tasks.find(t => t.id === route.params.id);
    if (taskFound) {
      setName(taskFound.name);
      setCompleted(taskFound.completed);
      setTask(taskFound);
      setLoading(false);
    }
  }, [tasks, route.params.id]);

  const updateTaskHandler = () => {
    if (task.name === name && task.completed === completed) {
      return Alert.alert('Nada mudou', 'Não pode ser atualizado pois nada mudou!');
    }

    const updatedTask = {
      ...task,
      name,
      completed,
    };

    dispatch(updateTask(
      updatedTask,
      () => {
        navigation.goBack();
        ToastAndroid.show('Tarefa atualizada!', ToastAndroid.LONG);
      },
      () => {
        ToastAndroid.show('Algo de errado aconteceu, tente novamente!', ToastAndroid.LONG);
      },
    ));
  };

  const deleteTaskClickHandler = () => {
    Alert.alert(
      'Apagar tarefa',
      'Tem certeza que quer apagar esta tarefa?',
      [{ text: 'Cancelar' }, { text: 'Deletar', onPress: () => deleteTaskHandler() }]
    );
  };

  const deleteTaskHandler = () => {
    dispatch(deleteTask(
      task.id,
      () => {
        navigation.goBack();
        ToastAndroid.show(`Tarefa "${task.name} deleteda!"`, ToastAndroid.LONG);
      },
      () => {
        ToastAndroid.show('Algo de errado aconteceu, tente novamente!', ToastAndroid.LONG);
      },
    ));
  };

  if (loading) {
    return <ActivityIndicator color={Colors.primary} size="large" style={globalStyles.loader} />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput value={name} onChangeText={(val) => setName(val)} placeholder="Nome da tarefa" placeholderTextColor={Colors.quaternary} style={globalStyles.input} />
        <View style={globalStyles.switchContainer}>
          <Switch
            value={completed}
            onValueChange={(val) => setCompleted(val)}
            thumbColor={completed ? Colors.primary : Colors.secondary}
            trackColor={{ false: Colors.tertiary, true: Colors.quaternary }}
          />
          <Text style={globalStyles.switchText}>Tarefa completada</Text>
        </View>
        <CustomButton text="Atualizar tarefa" onPress={updateTaskHandler} round style={styles.spaceBottom} />
        <CustomButton text="Deletar tarefa" onPress={deleteTaskClickHandler} round danger />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  spaceBottom: {
    marginBottom: 30,
  },
});

export default TaskScreen;