import { Component } from "lucide-react"; // Shadcn icons

const Sidebar = () => {
  // Sidebar items - icon and link
  const menuItems = [{ icon: <Component size={36} />, link: "/" }];

  return (
    <div className="sidebar fixed h-full w-16 text-white flex flex-col items-center justify-center py-4 space-y-6">
      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.link}
          className="sidebar-icon hover:text-gray-200"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
