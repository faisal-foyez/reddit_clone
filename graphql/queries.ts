import { gql } from '@apollo/client'

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic:String!){
    getSubredditListByTopic(topic:$topic){
      id
      topic
      created_at
    }
  }
`

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPosts{
      body
      created_at
      id
      image
      title
      subreddit{
        id
        topic
        created_at
      }
      comments{
        created_at
        id
        text
        username
      }
      username
    }
  }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic:String!) {
    getPostsByTopic(topic:$topic){
      body
      created_at
      id
      image
      title
      subreddit{
        id
        topic
        created_at
      }
      comments{
        created_at
        id
        text
        username
      }
      username
    }
  }
`

export const GET_POST_BY_POSTID = gql`
  query MyQuery($postId:String!) {
    getPost(postId:$postId){
      body
      created_at
      id
      image
      title
      subreddit{
        id
        topic
        created_at
      }
      comments{
        created_at
        id
        text
        username
      }
      username
    }
  }
`

export const GET_ALL_VOTES_BY_POSTID = gql`
  query MyQuery($postId: String!){
    getVotesByPostId(postId: $postId) {
      username
      id
      upvote
    }
  }
`

export const GET_SUBREDDITS_BY_LIMIT = gql`
  query MyQuery($limit: Int!){
    getSubredditListLimit(limit: $limit) {
      id
      topic
      created_at
    }
  }
`