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
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SCREEN_WIDTH = Dimensions.get('window').width; 의 전개구문

export default function App() {
  const [city, setCity] = useState('로딩중..');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const API_KEY = '339a1551a4de1f48db3bac2cf746c0a0'; //API KEY는 원래 앱에 두면 안된다.

  const icons = {
    Clear: 'day-sunny',
    Clouds: 'cloudy',
    Rain: 'rain',
    Atmosphere: 'cloudy-gusts',
    Snow: 'snow',
    Drizzle: 'day-rain',
    Thunderstorm: 'lightning',
  };

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
      // 허가되지 않으므로 보여주는 컴포넌트도 수정하기
    }

    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 4 });
    console.log(latitude, longitude);

    try {
      const location = await Location.reverseGeocodeAsync(
        { latitude, longitude },
        { useGoogleMaps: false }
      );

      console.log(location[0].city);
      setCity(location[0].city);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await res.json();

    const filteredList = await json.list.filter(
      (weather) => weather.dt_txt.includes(`03:00:00`) //한국 정오로 설정
    );
    // console.log(JSON.stringify(filteredList, null, 2));

    setDays(filteredList);
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
        pagingEnabled={true}
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
              <Text style={styles.date}>
                {day.dt_txt.replace(
                  /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})$/,
                  (all, year, month, day, time) => `${month}/${day} `
                )}
                {/* {new Date(day.dt * 1000).toDateString()} */}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.temp}>{day.main.temp.toFixed(1)}</Text>
                <Text style={{ fontSize: 60 }}> ℃</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={46}
                  color="black"
                  marginRight={16}
                />
                <Text style={styles.desc}>{day.weather[0].main}</Text>
              </View>
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
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  cityName: { fontSize: 60, fontWeight: '700' },
  weather: { marginLeft: 10 },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'left',
  },
  date: { fontSize: 60, marginBottom: 10 },
  temp: {
    marginTop: 0,
    fontSize: 160,
    fontWeight: '500',
    lineHeight: 165,
  },
  desc: { marginTop: -20, fontSize: 60 },
  tinyText: { fontSize: 30, marginLeft: 5 },
});
