import MenuItem, { MenuItemProps } from "@/components/atoms/MenuItem";

interface MenuListProps {
  title: string;
  list: Array<MenuItemProps>;
}

export default function MenuList({ title, list }: MenuListProps) {
  return (
    <div>
      <p className="text-[20px] mb-3 md:mb-6 md:mt-3 md:text-[24px] md:border-b md:pb-2 md:border-red-500/35">{title}</p>
      <div className="flex gap-4">
        {list.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
