import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Edit3, Shield } from 'lucide-react';

interface CommunityForumProps {
  language: 'en' | 'hi';
}

const CommunityForum = ({ language }: CommunityForumProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'anxiety' });
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const content = {
    en: {
      title: 'Community Support Forum',
      description: 'Share your experiences and support others in their mental health journey',
      categories: {
        all: 'All Posts',
        anxiety: 'Anxiety',
        depression: 'Depression',
        selfcare: 'Self-Care',
        success: 'Success Stories'
      },
      shareStory: 'Share Your Story',
      postTitle: 'Post Title',
      postContent: 'Share your thoughts, experiences, or questions...',
      publish: 'Publish Post',
      cancel: 'Cancel',
      likes: 'likes',
      comments: 'comments',
      moderated: 'Moderated',
      anonymous: 'Anonymous User'
    },
    hi: {
      title: 'कम्युनिटी सपोर्ट फोरम',
      description: 'अपने अनुभव साझा करें और दूसरों की मानसिक स्वास्थ्य यात्रा में सहायता करें',
      categories: {
        all: 'सभी पोस्ट',
        anxiety: 'चिंता',
        depression: 'अवसाद',
        selfcare: 'स्व-देखभाल',
        success: 'सफलता की कहानियां'
      },
      shareStory: 'अपनी कहानी साझा करें',
      postTitle: 'पोस्ट शीर्षक',
      postContent: 'अपने विचार, अनुभव या प्रश्न साझा करें...',
      publish: 'पोस्ट प्रकाशित करें',
      cancel: 'रद्द करें',
      likes: 'लाइक',
      comments: 'टिप्पणियां',
      moderated: 'नियंत्रित',
      anonymous: 'गुमनाम उपयोगकर्ता'
    }
  };

  // Load posts from database
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('is_moderated', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      anxiety: 'warning',
      depression: 'secondary',
      selfcare: 'success',
      success: 'default'
    } as const;
    return colors[category as keyof typeof colors] || 'default';
  };

  const handlePublishPost = async () => {
    if (!user) {
      alert(language === 'en' ? 'Please login to post' : 'पोस्ट करने के लिए कृपया लॉगिन करें');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          is_moderated: false // Will be moderated by admin
        });

      if (error) {
        console.error('Error publishing post:', error);
        alert(language === 'en' ? 'Error publishing post' : 'पोस्ट प्रकाशित करने में त्रुटि');
        return;
      }

      alert(language === 'en' 
        ? 'Post submitted for moderation. It will appear after approval.' 
        : 'पोस्ट मॉडरेशन के लिए सबमिट की गई। अप्रूवल के बाद यह दिखेगी।');
      
      setShowEditor(false);
      setNewPost({ title: '', content: '', category: 'anxiety' });
      loadPosts(); // Reload posts
    } catch (error) {
      console.error('Error publishing post:', error);
      alert(language === 'en' ? 'Error publishing post' : 'पोस्ट प्रकाशित करने में त्रुटि');
    }
  };

  return (
    <section id="community" className="py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {content[language].description}
          </p>
          
          <Button
            variant="wellness"
            size="lg"
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-5 w-5" />
            {content[language].shareStory}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {Object.entries(content[language].categories).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'wellness' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary">
                Loading posts...
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                {language === 'en' ? 'No posts found in this category.' : 'इस श्रेणी में कोई पोस्ट नहीं मिली।'}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
            <Card key={post.id} className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant={getCategoryColor(post.category)} className="mb-2">
                    {content[language].categories[post.category as keyof typeof content[typeof language]['categories']]}
                  </Badge>
                  {post.is_moderated && (
                    <Shield className="h-4 w-4 text-success" />
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.content.substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments_count || 0}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">A</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{content[language].anonymous}</span>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Post Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-2xl glass border-0">
              <CardHeader>
                <CardTitle>{content[language].shareStory}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={content[language].postTitle}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="anxiety">{content[language].categories.anxiety}</option>
                  <option value="depression">{content[language].categories.depression}</option>
                  <option value="selfcare">{content[language].categories.selfcare}</option>
                  <option value="success">{content[language].categories.success}</option>
                </select>
                
                <Textarea
                  placeholder={content[language].postContent}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                />
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowEditor(false)} className="flex-1">
                    {content[language].cancel}
                  </Button>
                  <Button 
                    variant="wellness" 
                    onClick={handlePublishPost} 
                    className="flex-1"
                    disabled={!newPost.title || !newPost.content}
                  >
                    {content[language].publish}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityForum;