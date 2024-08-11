export interface Post {
  _id: string;
  username: string;
  userID: {
    _id: string;
  };
  title: string;
  content: string;
  comments: [
    {
      _id: string;
      username: string;
      content: string;
      likes: number;
      likedBy: string[];
      date: Date;
    }
  ];
  likes: number;
  likedBy: string;
  date: Date;
}
