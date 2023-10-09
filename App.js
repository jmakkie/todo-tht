import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, SafeAreaView, FlatList, TextInput } from 'react-native';

const STORAGE_KEY = 'todos'

export default function App() {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState([{key: '0', description: 'testing'}])

  const addTodo = () => {
    const newKey = String(todos.length)
    const object = {key: newKey, description: newTodo}
    const newTodos = [...todos, object]
    
    setTodos(newTodos)
    setNewTodo('')
    storeData(newTodos)
  }
  
  const storeData = async(value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
    } catch(e) {
      console.log(e)
    }
  }

  const getData = async() => {
    try{
      return AsyncStorage.getItem(STORAGE_KEY)
      .then(req => JSON.parse(req))
      .then(json => {
        if (json === null) {
          json = []
        }
        setTodos(json)
      })
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Todos</Text>
      <TextInput
        style={styles.input}
        placeholder='enter new todo'
        value={newTodo}
        onChangeText={text => setNewTodo(text)}
        returnKeyType='done'
        onSubmitEditing={() => addTodo}
      />
      <FlatList
        styles={styles.list}
        data={todos}
        extraData={todos}
        renderItem={({item}) => 
          <Text style={styles.row}>{item.description}</Text>  
        }
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.StatusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderColor: '#FAFAFA',
    height: 40,
    margin: 8,
  },
  list: {
    margin: 8,
  },
  row: {
    height: 30,
  }
});
