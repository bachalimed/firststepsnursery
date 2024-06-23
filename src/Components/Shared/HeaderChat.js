import React from 'react'
import { HiOutlineChatAlt } from "react-icons/hi";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const HeaderChat = () => {
  return (
    


       
    



    <Menu>
      <MenuButton><HiOutlineChatAlt fontSize={24}/></MenuButton>
      <MenuItems anchor="bottom">
        <MenuItem>
          <a className="block data-[focus]:bg-blue-100" href="/settings">
            Settings
          </a>
        </MenuItem>
        <MenuItem>
          <a className="block data-[focus]:bg-blue-100" href="/support">
            Support
          </a>
        </MenuItem>
        <MenuItem>
          <a className="block data-[focus]:bg-blue-100" href="/license">
            License
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
export default HeaderChat
{/* <HiOutlineChatAlt fontSize={24}/> */}