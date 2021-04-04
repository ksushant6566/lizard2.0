import React, { useEffect, useState, useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substring(1);
    setActiveItem(path)
  },[user])

  const handleItemClick = (e, { name }) => setActiveItem(name)

  return (
    <Menu pointing secondary size='massive' color='violet'>
      <Menu.Item
        name='home'
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />
      { user === null ? (
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to='/login'
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to='/register'
          />
        </Menu.Menu>
      ) : (
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={() => logout()}
            as={Link}
            to='/login'
          />
        </Menu.Menu>
      )

      }
      
    </Menu>
  )
}
export default Header;