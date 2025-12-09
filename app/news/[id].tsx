import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { newsService } from '@/services/newsService';
import type { NewsArticle } from '@/types/news.types';
import { ArrowLeft, Calendar, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewsDetailScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const newsId = params.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async () => {
    try {
      setError(null);
      const data = await newsService.getNewsById(newsId);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newsId) {
      fetchArticle();
    } else {
      setError('No article ID provided');
      setLoading(false);
    }
  }, [newsId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading article...
        </Text>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className="text-red-500 text-lg font-semibold mb-2">Error</Text>
        <Text className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error || 'Article not found'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#0f172a' : '#FFFFFF' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className={`px-4 py-3 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            <Text className={`ml-2 text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Back
            </Text>
          </TouchableOpacity>
        </View>

        {/* Article Image */}
        {article.imageUrl && (
          <View className="relative">
            <Image
              source={{ uri: article.imageUrl }}
              className="w-full h-96"
              resizeMode="cover"
            />
            {/* Gradient overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
              }}
            />
          </View>
        )}

        {/* Article Content */}
        <View className={`p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          {/* Category Badge */}
          <View className="mb-4">
            <View className={`px-3 py-1.5 rounded-full self-start ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}>
              <Text className="text-sm font-bold text-white">
                {article.category}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className={`text-3xl font-bold mb-4 leading-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {article.title}
          </Text>

          {/* Meta Information */}
          <View className={`mb-6 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <View className="flex-row items-center mb-3">
              <User size={18} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <Text className={`ml-2 text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {article.author}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Calendar size={18} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <Text className={`ml-2 text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className={`text-xl mb-6 font-semibold leading-7 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {article.description}
          </Text>

          {/* Content */}
          <Text className={`text-base leading-7 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {article.content}
          </Text>

          {/* Divider */}
          <View className={`my-8 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

          {/* Additional Meta */}
          <View className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Published: {new Date(article.publishedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {article.updatedAt !== article.createdAt && (
              <Text className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Updated: {new Date(article.updatedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
