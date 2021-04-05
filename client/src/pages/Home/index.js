import React, { useContext, useState } from 'react';
import { useQuery } from "@apollo/react-hooks";

import { FETCH_POSTS_QUERY } from '../../graphql/gql';

// components
import PostCard from '../../components/PostCard';
import PostForm from '../../components/PostForm';
import { Grid, Loader, Button, Popup, Transition } from 'semantic-ui-react';

// context
import { AuthContext } from '../../context/auth';

import './styles.css'

const Home = () => {
    const { user } = useContext(AuthContext);
    const [openPopup, setOpenPopup] = useState(false)

    const { loading, data: { getPosts : posts}={} } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={1} >
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
                        bottom: '5%',
                        left: '50%',
                        transform: 'translate(-50%)',
                        zIndex: '1',
                    }}>
                        <Popup
                            trigger={
                                <Button 
                                    onClick={() => setOpenPopup(!openPopup)} 
                                    color='teal' 
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
                    <div className="loading">
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
        </Grid>
    )
}
export default Home;