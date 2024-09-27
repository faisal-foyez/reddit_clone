import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
const client = new ApolloClient({
  uri: 'https://redditserver.faisalislam.net/',
  headers: {
    //Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`,
    'Apollo-Require-Preflight': true
  },
  cache: new InMemoryCache(),
  // link: new HttpLink({
  //   uri: 'https://dashboard.stepzen.com/explorer?endpoint=api%2Fugly-wombat',
  //   fetchOptions: {
  //     mode: 'no-cors',
  //   },
  // }),
})

export default client;
