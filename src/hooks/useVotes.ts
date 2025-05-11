
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vote, VoteCount } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Helper to get user's IP address
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    // Fallback to a random ID if we can't get the IP
    return `anonymous-${Math.random().toString(36).substring(2, 15)}`;
  }
}

export const useVotes = (imageId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userIP, setUserIP] = useState<string | null>(null);

  // Fetch user IP on component mount
  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
    };
    
    fetchIP();
  }, []);

  // Query to get vote counts for this image
  const { data: voteCount = { upvotes: 0, downvotes: 0, userVote: null }, isLoading } = useQuery({
    queryKey: ['votes', imageId],
    queryFn: async () => {
      if (!userIP) return { upvotes: 0, downvotes: 0, userVote: null };
      
      // Get all votes for this image
      const { data: votes, error } = await supabase
        .from('image_votes')
        .select('*')
        .eq('image_id', imageId);
      
      if (error) {
        console.error('Error fetching votes:', error);
        return { upvotes: 0, downvotes: 0, userVote: null };
      }

      // Get the user's vote if it exists
      const userVote = votes.find(vote => vote.user_ip === userIP);

      // Count votes
      const upvotes = votes.filter(vote => vote.vote_type === 'up').length;
      const downvotes = votes.filter(vote => vote.vote_type === 'down').length;

      return {
        upvotes,
        downvotes,
        userVote: userVote ? userVote.vote_type : null
      };
    },
    enabled: !!userIP,
  });

  // Mutation to cast a vote
  const { mutate: castVote, isPending: isVoting } = useMutation({
    mutationFn: async (voteType: 'up' | 'down') => {
      if (!userIP) throw new Error('User IP not available');
      
      // Check if user already voted
      if (voteCount.userVote === voteType) {
        // User is clicking the same vote type again - remove their vote
        const { error } = await supabase
          .from('image_votes')
          .delete()
          .eq('image_id', imageId)
          .eq('user_ip', userIP);
          
        if (error) throw error;
        return { removed: true, voteType };
      } else {
        // Upsert the vote (insert if not exists, update if exists)
        const { error } = await supabase
          .from('image_votes')
          .upsert({
            image_id: imageId,
            user_ip: userIP,
            vote_type: voteType
          }, {
            onConflict: 'image_id,user_ip'
          });
          
        if (error) throw error;
        return { removed: false, voteType };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['votes', imageId] });
      
      if (result.removed) {
        toast({
          title: 'Vote removed',
          description: 'Your vote has been removed',
        });
      } else {
        toast({
          title: 'Vote recorded',
          description: `You voted ${result.voteType === 'up' ? 'up' : 'down'}`,
        });
      }
    },
    onError: (error) => {
      console.error('Error casting vote:', error);
      toast({
        title: 'Error',
        description: 'There was an error recording your vote',
        variant: 'destructive',
      });
    },
  });

  return {
    voteCount,
    isLoading,
    isVoting,
    upvote: () => castVote('up'),
    downvote: () => castVote('down'),
  };
};
