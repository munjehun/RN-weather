import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SCREEN_WIDTH = Dimensions.get('window').width; 의 전개구문

export default function App() {
  const [city, setCity] = useState('로딩중..');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const API_KEY = '339a1551a4de1f48db3bac2cf746c0a0'; //API KEY는 원래 앱에 두면 안된다.

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    console.log(granted); //granted가 true면 승인된 것.

    if (!granted) {
      setOk(false);
      // 허가되지 않으므로 보여주는 컴포넌트도 수정하기
    }

    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 3 });
    console.log(latitude, longitude);

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    console.log(location[0].city);
    setCity(location[0].city);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await res.json();
    console.log(json.list);
    setDays(json.list);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled={false}
        horizontal
        showsHorizontalScrollIndicator={true}
        indicatorStyle="white" //iOS에서만 작동
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              size="large"
              color="black"
              style={{ marginTop: 20 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{day.main.temp.toFixed(1)}</Text>
              <Text style={styles.desc}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'mediumpurple' },
  city: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'teal',
  },
  cityName: { fontSize: 60, fontWeight: '700' },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'left',
    marginLeft: 10,
  },
  temp: { marginTop: 0, fontSize: 160, fontWeight: '500' },
  desc: { marginTop: -20, fontSize: 60 },
  tinyText: { fontSize: 30 },
});
