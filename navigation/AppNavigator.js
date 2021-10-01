import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider, useDispatch, useSelector } from 'react-redux';

import HomeScreen from '../screens/HomeScreen';
import AddListScreen from '../screens/AddListScreen';
import ListScreen from '../screens/ListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskScreen from '../screens/TaskScreen';
import { Colors } from '../constants';
import { deleteList } from '../store/actions/listActions';

const TasksStackNavigator = createStackNavigator();

const defaultStyles = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontFamily: 'Poppins-Regular',
  },
};

const styles = StyleSheet.create({
  headerRightSpace: {
    marginRight: 10,
  },
});

const TasksNavigator = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.task);

  const deleteListClickHandler = (id, navigation) => {
    const listHasTasks = tasks.find(t => t.listId === id);

    if (listHasTasks) {
      return Alert.alert('Não conseguimos deletar', 'A lista não pode ser deletada pois não está vazia. Apague as tarefas dela primeiro.');
    }

    Alert.alert(
      'Deletar lista',
      'Tem certeza que quer deletar esta lista?',
      [
        { text: 'Cancelar' },
        { text: 'Deletar', onPress: () => deleteListHandler(id, navigation) },
      ]
    );
  };

  const deleteListHandler = (id, navigation) => {
    dispatch(deleteList(id, () => {
      navigation.goBack();
      ToastAndroid.show('Lista deletada!', ToastAndroid.LONG);
    }));
  };

  return (
    <TasksStackNavigator.Navigator>
      <TasksStackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ ...defaultStyles, title: 'Suas listas', headerTitleAlign: 'center' }}
      />
      <TasksStackNavigator.Screen
        name="NewList"
        component={AddListScreen}
        options={{ ...defaultStyles, title: 'Adicionar nova lista' }}
      />
      <TasksStackNavigator.Screen
        name="List"
        component={ListScreen}
        options={({ route, navigation }) => ({ 
          ...defaultStyles,
          title: route.params.name,
          headerRight: () => (
            <View style={styles.headerRightSpace}>
              <Icon
                name="md-trash"
                color="#fff"
                size={30}
                onPress={() => deleteListClickHandler(route.params.id, navigation)}
              />
            </View>
          ),
        })}
      />
      <TasksStackNavigator.Screen
        name="NewTask"
        component={AddTaskScreen}
        options={{ ...defaultStyles, title: 'Adicionar nova tarefa' }}
      />
      <TasksStackNavigator.Screen
        name="Task"
        component={TaskScreen}
        options={{ ...defaultStyles, title: 'Atualizar tarefa' }}
      />
    </TasksStackNavigator.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TasksNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;