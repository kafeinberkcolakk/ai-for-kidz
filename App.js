import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ClassroomViewer from './components/assets/Classroom';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>BERK</Text>
      <GLBViewer2 />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
