
type Comments = {
  created_at: string
  id: number
  text: string
  username: string
}

type Vote = {
  created_at: string
  id: number
  upvote: boolean
  username: string
}

type Subreddit = {
  created_at: string
  id: number
  topic: string
}

type Post = {
  body: string
  created_at: string
  id: number
  image: string
  title: string
  username: string
  votes: Vote[]
  comments: Comments[]
  subreddit: Subreddit
}