import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { View, Text } from 'react-native';

export default function SearchScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title="Search"
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Search Screen</Text>
        <Text style={{ fontSize: 16, marginTop: 10 }}>This is the search screen.</Text>
      </View>
    </SafeAreaView>
  );
}
