import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>Gumi</Text>
      </View>
      <View style={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.desc}>Sunny</Text>
        </View>
        <View></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'mediumpurple' },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: { fontSize: 60, fontWeight: '700' },
  weather: { flex: 2 },
  day: {
    flex: 1,
    alignItems: 'center',
  },
  temp: { marginTop: 40, fontSize: 178 },
  desc: { marginTop: -20, fontSize: 60 },
});
