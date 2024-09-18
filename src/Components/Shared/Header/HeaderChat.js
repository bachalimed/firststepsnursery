import React from 'react'
import { HiOutlineChatAlt } from "react-icons/hi"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { HeaderChatSample } from '../../lib/Consts/HeaderChatSample.js'

const HeaderChat = () => {
  return (
    
    <Menu>
        <MenuButton className=" ">  
          <HiOutlineChatAlt fontSize={24} />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className=" origin-top-right rounded-md border   bg-sky-100 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <strong>Messages</strong>
          {HeaderChatSample.slice(0, 10).map((chat, index )=>(//will only show 5 messages but we need to select the last when retrieving
          <MenuItem>
            <button key = {chat.id} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="/target 1">
              {chat.sender}
            </button>
          </MenuItem>)
        )}
          
        </MenuItems>
      </Menu>
  )
}
export default HeaderChat
