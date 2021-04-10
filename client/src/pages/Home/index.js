/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useSubscription } from "@apollo/react-hooks";

import { FETCH_POSTS_QUERY, NEW_POST_NOTIFICATION_SUBSCRIPTION } from '../../graphql/gql';

// components
import PostCard from '../../components/PostCard';
import PostForm from '../../components/PostForm';
import { Grid, Loader, Button, Popup, Transition, Icon } from 'semantic-ui-react';

// context
import { AuthContext } from '../../context/auth';

import './styles.css'

const Home = () => {
    const { user } = useContext(AuthContext);
    const [openPopup, setOpenPopup] = useState(false);
    const [showGetNewPosts, setShowGetNewPosts] = useState(false);
    const [prevKey, setPrevKey] = useState("");
    
    const { loading, data: { getPosts : posts}={}, fetchMore } = useQuery(FETCH_POSTS_QUERY, {
        onCompleted({ getPosts }) {
            setPrevKey(getPosts[getPosts.length-1].id)
        }
    });

    const { data } =  useSubscription(NEW_POST_NOTIFICATION_SUBSCRIPTION, {
        fetchPolicy: 'network-only',
        onSubscriptionData({ subscriptionData: { data: { notification} } }) {
            if(notification.username !== user.username)
                setShowGetNewPosts(true);
                
        }
    })

    const handleLoadMore = () => {

        fetchMore({
            variables: {prevKey},
            updateQuery(prev, { fetchMoreResult: { getPosts } }) {
                if(getPosts.length !== 0) 
                    setPrevKey(getPosts[getPosts.length-1].id)
                
                return {
                    getPosts: [...prev.getPosts, ...getPosts]
                }
            }
        })
    }

    return (
        <Grid columns={1} >
            {showGetNewPosts && (
                <div style={{
                        position: 'fixed',
                        top: '15%',
                        left: '50%',
                        transform: 'translate(-50%)',
                        zIndex: '10',
                }}>
                    <Button 
                        as='div'
                        color='blue'
                        onClick={() => {
                        window.location.reload()
                        setShowGetNewPosts(false);
                    }} >
                        <Icon name='redo' />
                        New Posts
                    </Button>
                </div>
            )}
            <Grid.Row className='page-title'>
                <h2>
                    Recent Posts
                </h2>
            </Grid.Row>
            <Grid.Row >
                {user && (
                    <div 
                    style={{
                        position: 'fixed',
                        bottom: '1%',
                        left: '50%',
                        transform: 'translate(-50%)',
                        zIndex: '10',
                    }}>
                        <Popup
                            trigger={
                                <Button 
                                    onClick={() => setOpenPopup(!openPopup)} 
                                    color='blue' 
                                    icon='add' 
                                    size='huge' />
                            }
                            content={<PostForm setOpenPopup={setOpenPopup} />}
                            on='click'
                            position='top center'
                            size='huge'
                            wide
                            positionFixed
                            open={openPopup}
                        />
                    </div>
                )}

                {loading ? (
                    <div style={{ marginTop: '300px' }}>
                        <Loader active />
                    </div>
                ) : (
                    <Transition.Group>
                    {
                        posts && posts.map(post => (
                            <Grid.Column key={post.id}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))
                    }
                    </Transition.Group>
                )}
            </Grid.Row>
            <Grid.Row centered>
                <Button onClick={handleLoadMore} >
                    Load more
                </Button>
            </Grid.Row>
        </Grid>
    )
}
export default Home;