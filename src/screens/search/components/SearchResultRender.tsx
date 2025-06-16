import { useNavigation } from "@react-navigation/native";
import { MediaCard } from "../../../common/components/media";
import { MediaItem } from "../../../types/media";
import { NavigationProps } from "../../../types/navigation";
import { useTheme } from "../../../common/context/ThemeContext";

interface SearchResultRenderProps {
  item: MediaItem;
  width: number;
  layoutColumns: number;
}

export default function SearchResultRender({ item, width, layoutColumns }: SearchResultRenderProps) {
  const itemWidth = (width - (layoutColumns + 1) * 16) / layoutColumns;
  const navigation = useNavigation<NavigationProps>();
  const { theme } = useTheme();

  const handleItemPress = () => {
    if (item.media_type === 'movie') {
      navigation.navigate('MovieDetail', {
        id: item.id,
      });
    } else {
      navigation.navigate('TVShowDetail', {
        id: item.id,
      });
    }
  };

  return (
    <MediaCard
      item={item}
      onPress={handleItemPress}
      theme={theme}
      style={{
        width: itemWidth,
        marginBottom: 20,
        marginHorizontal: 8
      }}
    />
  );
}
