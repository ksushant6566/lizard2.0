import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import { Grid, Loader } from 'semantic-ui-react';

import PostCard from '../../components/PostCard';
import './styles.css'

const Home = () => {

    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    let posts = []

    if (data) {
        posts = data.getPosts;
    }

    return (
        <Grid columns={1} >
            <Grid.Row className='page-title'>
                <h2>
                    Recent Posts
                </h2>
            </Grid.Row>

            <Grid.Row >
                {loading ? (
                    <div className="loading">
                        <Loader active/>
                    </div>
                ) : (
                    posts && posts.map(post => (
                        <Grid.Column key={post.id}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))
                )}
            </Grid.Row>
        </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts{
            body
            id
            createdAt
            likes {
                id
                username
                createdAt
            }
            comments {
                id
                body
                username
            }
            username
            likesCount
            commentsCount
    }
}
`
export default Home;