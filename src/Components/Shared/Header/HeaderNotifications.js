import React from "react";
import { HiOutlineBell } from "react-icons/hi2";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HeaderNotificationSample } from "../../lib/Consts/HeaderNotificationSample.js";

const HeaderNotifications = () => {
  return (
    <Menu>
      <MenuButton className=" ">
        <HiOutlineBell fontSize={24} />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className=" origin-top-right  border bg-sky-100 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <strong>Notifications</strong>
        {HeaderNotificationSample.slice(0, 10).map((Notif, index) => (
          <MenuItem>
            <button
              key={Notif.id}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              href="/target 1"
            >
              {Notif.type} {Notif.student}
              {Notif.object}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};
export default HeaderNotifications;
