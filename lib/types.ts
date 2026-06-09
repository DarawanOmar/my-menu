export type Category = {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
};

// NOTE: the mock API spells the field "discription" (sic) — keep it as-is so
// the JSON deserializes correctly, and expose a clean alias when we map.
export type MenuItemRaw = {
  id: string;
  name: string;
  avatar: string;
  discription: string;
  price: string;
  categoryId: string;
  createdAt: string;
};

export type MenuItem = {
  id: string;
  name: string;
  avatar: string;
  description: string;
  price: string;
  categoryId: string;
  createdAt: string;
};
