import React from 'react'
import { Navbar } from 'reactstrap'
import AudioPlayer from './AudioPlayer'

const NavBar: React.FC = () => {
    return (
        <Navbar
            color="light"
            light
            expand="md"
            style={{
                position: 'fixed',
                bottom: 0,
                zIndex: 9999,
                width: '100%',
                overflow: 'visible',
                backgroundImage: 'linear-gradient(to right top, #000000, #1f0712, #320921, #440533, #55004a, #5a0057, #5e0065, #600075, #5b0079, #55007e, #4e0082, #460087)',
                height: 120
            }}
        >
            <AudioPlayer />
        </Navbar>
    )
}

export default NavBar
