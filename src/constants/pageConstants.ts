export type Role = "ADMIN" | "VENDOR";

export const pageConstants = [
  { name: "Dashboard", href: "/common", roles: ["ADMIN", "VENDOR"], key: "dashboard" },
  { name: "Design Master", href: "/common/design", roles: ["ADMIN"], key: "design_master" },
  { name: "Assigned Tasks", href: "/common/assigned", roles: ["VENDOR"], key: "assigned_tasks" },
  { name: "Size Master", href: "/common/size", roles: ["ADMIN"], key: "size_master" },
  { name: "Unit Master", href: "/common/unit", roles: ["ADMIN"], key: "unit_master" },
  { name: "Vendor Master", href: "/common/vendor", roles: ["ADMIN"], key: "vendor_master" },
  { name: "Process Master", href: "/common/process", roles: ["ADMIN"], key: "process_master" },
  { name: "Component Master", href: "/common/component", roles: ["ADMIN"], key: "component_master" },
  { name: "Responsibility Master", href: "/common/responsibility", roles: ["ADMIN"], key: "responsibility_master" },
  { name: "Permissions Master", href: "/common/permission", roles: ["ADMIN"], key: "permissions_master" },
];