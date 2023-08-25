import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={styles.container}></View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = (StyleSheet.create = {
  container: { flex: 1, backgroundColor: 'mediumpurple' },
});
