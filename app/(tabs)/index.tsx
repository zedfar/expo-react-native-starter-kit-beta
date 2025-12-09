import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { newsService } from '@/services/newsService';
import type { NewsArticle } from '@/types/news.types';

export default function NewsListScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setError(null);
      const data = await newsService.getNews();
      setNews(data.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const handleItemPress = (item: NewsArticle) => {
    router.push(`/news/${item.id}`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading news...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className="text-red-500 text-lg font-semibold mb-2">Error</Text>
        <Text className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchNews}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (news.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No news available
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#0f172a' : '#F9FAFB' }}>
      {/* Header */}
      <View className={`px-6 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Latest News
        </Text>
        <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Stay updated with the latest stories
        </Text>
      </View>

      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item)}
            className={`mx-4 mt-4 rounded-xl overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {item.imageUrl && (
              <View className="relative">
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-full h-52"
                  resizeMode="cover"
                />
                <View className="absolute top-3 left-3">
                  <View className={`px-3 py-1.5 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}>
                    <Text className="text-xs font-bold text-white">
                      {item.category}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <View className="p-5">
              <Text className={`text-xl font-bold mb-2 leading-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </Text>
              <Text className={`mb-3 leading-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} numberOfLines={2}>
                {item.description}
              </Text>
              <View className={`pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <View className="flex-row justify-between items-center">
                  <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    {item.author}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 4 }}
      />
    </SafeAreaView>
  );
}
