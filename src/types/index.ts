
export interface Image {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: Date;
  source?: 'url' | 'upload';
}

export interface Vote {
  id: string;
  image_id: string;
  user_ip: string;
  vote_type: 'up' | 'down';
  created_at: Date;
}

export interface VoteCount {
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
}
