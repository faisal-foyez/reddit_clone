import { gql } from '@apollo/client'

export const ADD_POST = gql`
  mutation MyMutation(
    $input:postInput
  ){
    insertPost(
      input:$input
    ){
      body
      created_at
      id
      image
      subreddit{
        id
      }
      title
      username
    }
  }
`

export const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic:String!){
    insertSubreddit(topic:$topic){
      id
      topic
      created_at
    }
  }
`

export const ADD_COMMENT = gql`
  mutation MyMutation($input:commentInput){
    insertComment(input:$input) {
      id
      created_at
      text
      username
      post{
        id
      }
    }
  }
`

export const CAST_VOTE = gql`
  mutation MyMutation($input:voteInput!){
    castVote(input:$input) {
      upvote
      id
      created_at
    }
  }
`